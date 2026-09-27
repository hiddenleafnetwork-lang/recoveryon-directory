import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";
import zipcodes from "zipcodes";

const args = new Set(process.argv.slice(2));
const commit = args.has("--commit");
const root = process.cwd();
const masterPath = resolve(root, process.env.MASTER_CSV || "work/data/atc-usa-master.csv");
const recoveryPath = resolve(root, process.env.RECOVERY_CSV || "work/data/recovery-centers-usa.csv");

const US_REGIONS = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
  "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY", "AS", "GU", "MP", "PR", "VI",
]);

const clean = (value) => String(value || "").trim();
const normalized = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const zip5 = (value) => clean(value).match(/\b\d{5}\b/)?.[0] || "";
const phoneDigits = (value) => clean(value).replace(/\D/g, "").slice(-10);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const unique = (values) => [...new Set(values.filter(Boolean))];
const pgArray = (values) => `{${values.map((value) => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`).join(",")}}`;

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 92) || "provider";
}

function safeUrl(value) {
  try {
    const url = new URL(clean(value));
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

function inferredState(row, recoveryByUrl, stateMaps) {
  const direct = clean(row.State).toUpperCase();
  if (US_REGIONS.has(direct)) return direct;
  const fromRecovery = recoveryByUrl.get(clean(row["Listing Url"]).replace(/\/$/, ""))?.state?.toUpperCase();
  if (US_REGIONS.has(fromRecovery)) return fromRecovery;
  const postalCode = zip5(row.Zip);
  if (stateMaps.byZip.has(postalCode)) return stateMaps.byZip.get(postalCode);
  const lookup = zipcodes.lookup(postalCode);
  if (lookup && US_REGIONS.has(lookup.state)) return lookup.state;
  if (stateMaps.byPrefix.has(postalCode.slice(0, 3))) return stateMaps.byPrefix.get(postalCode.slice(0, 3));
  if (stateMaps.byCity.has(normalized(row.City))) return stateMaps.byCity.get(normalized(row.City));
  return "";
}

function categoriesFor(row) {
  const text = [row["Service Specialty Tags"], row["Recovery Url Type"], row["Samhsa Service Codes Named"]].join(" ").toLowerCase();
  const values = [];
  if (/residential|inpatient|hospital/.test(text)) values.push("Treatment Centers");
  if (/detox|withdrawal/.test(text)) values.push("Medical Detox");
  if (/outpatient|day.treatment|partial.hospital|telehealth|virtual/.test(text)) values.push("Outpatient Programs");
  if (/therap|counsel/.test(text)) values.push("Counseling & Therapy");
  if (/sober.living|recovery.home|transitional.housing/.test(text)) values.push("Sober Living");
  if (clean(row["Samhsa In Mh"]) === "Y" || /mental.health|psychiatr/.test(text)) values.push("Mental Health Services");
  if (/case.management|peer.support|recovery.coach|employment/.test(text)) values.push("Recovery Support");
  return unique(values);
}

function levelsFor(row) {
  const text = [row["Service Specialty Tags"], row["Recovery Url Type"], row["Samhsa Service Codes Named"]].join(" ").toLowerCase();
  const values = [];
  if (/withdrawal|detox/.test(text)) values.push("Withdrawal management / detox");
  if (/residential|inpatient/.test(text)) values.push("Residential treatment");
  if (/partial.hospital|day.treatment/.test(text)) values.push("Partial hospitalization / day treatment");
  if (/intensive.outpatient/.test(text)) values.push("Intensive outpatient program (IOP)");
  if (/outpatient/.test(text)) values.push("Outpatient treatment");
  if (/hospital/.test(text)) values.push("Hospital-based care");
  if (/sober.living|recovery.home/.test(text)) values.push("Sober living");
  if (/telehealth|virtual/.test(text)) values.push("Virtual / telehealth");
  return unique(values);
}

function insuranceFor(row) {
  const text = clean(row["Samhsa Service Codes Named"]).toLowerCase();
  const values = [];
  if (/\bmedicare\b/.test(text)) values.push("Medicare");
  if (/\bmedicaid\b/.test(text)) values.push("Medicaid");
  if (/private insurance/.test(text)) values.push("Private insurance");
  if (/\btricare\b/.test(text)) values.push("TRICARE");
  if (/state.financed/.test(text)) values.push("State-financed health insurance");
  if (/cash|self.pay/.test(text)) values.push("Cash or self-pay");
  return unique(values);
}

function mergeRows(rows) {
  if (rows.length === 1) return rows[0];
  const ranked = [...rows].sort((a, b) => Number(b["Source Count"] || 0) - Number(a["Source Count"] || 0));
  const result = { ...ranked[0] };
  for (const row of ranked.slice(1)) {
    for (const [key, value] of Object.entries(row)) if (!clean(result[key]) && clean(value)) result[key] = value;
  }
  return result;
}

const [masterText, recoveryText] = await Promise.all([readFile(masterPath, "utf8"), readFile(recoveryPath, "utf8")]);
const masterRows = parse(masterText, { columns: true, bom: true, skip_empty_lines: true, relax_column_count: true });
const recoveryRows = parse(recoveryText, { columns: true, bom: true, skip_empty_lines: true, relax_column_count: true });
const recoveryByUrl = new Map(recoveryRows.map((row) => [clean(row.listing_url).replace(/\/$/, ""), row]).filter(([url]) => url));

const zipSets = new Map();
const prefixSets = new Map();
const citySets = new Map();
function addState(map, key, state) {
  if (!key || !US_REGIONS.has(state)) return;
  const values = map.get(key) || new Set();
  values.add(state);
  map.set(key, values);
}
for (const row of masterRows) {
  const state = clean(row.State).toUpperCase();
  const postalCode = zip5(row.Zip);
  addState(zipSets, postalCode, state);
  addState(prefixSets, postalCode.slice(0, 3), state);
  addState(citySets, normalized(row.City), state);
}
for (const row of recoveryRows) {
  const state = clean(row.state).toUpperCase();
  const postalCode = zip5(row.zip_code);
  addState(zipSets, postalCode, state);
  addState(prefixSets, postalCode.slice(0, 3), state);
  addState(citySets, normalized(row.city), state);
}
const singles = (map) => new Map([...map].filter(([, values]) => values.size === 1).map(([key, values]) => [key, [...values][0]]));
const stateMaps = { byZip: singles(zipSets), byPrefix: singles(prefixSets), byCity: singles(citySets) };

const prepared = [];
const rejected = [];
for (let index = 0; index < masterRows.length; index += 1) {
  const row = masterRows[index];
  const state = inferredState(row, recoveryByUrl, stateMaps);
  const name = clean(row.Name);
  const city = clean(row.City);
  const postalCode = zip5(row.Zip);
  if (!name || !city || !state) {
    rejected.push({ row: index + 2, name, city, state, postalCode, reason: "Missing a publishable U.S. identity or location" });
    continue;
  }
  const address = clean(row.Street);
  const listingUrl = safeUrl(row["Listing Url"]);
  const identity = address
    ? [normalized(name), normalized(address), normalized(city), state, postalCode].join("|")
    : [normalized(name), normalized(city), state, postalCode, phoneDigits(row["Phone E164"] || row.Phone), listingUrl || ""].join("|");
  prepared.push({ row, rowNumber: index + 2, state, name, city, postalCode, address, listingUrl, identity });
}

const groups = new Map();
for (const item of prepared) {
  const group = groups.get(item.identity) || [];
  group.push(item);
  groups.set(item.identity, group);
}

const usedSlugs = new Map();
const providers = [];
for (const [identity, items] of groups) {
  const row = mergeRows(items.map((item) => item.row));
  const first = items[0];
  const sourceKey = `atc-master:${hash(identity).slice(0, 32)}`;
  const baseSlug = slugify(`${first.name} ${first.city} ${first.state}`);
  let slug = baseSlug;
  if (usedSlugs.has(slug) && usedSlugs.get(slug) !== sourceKey) slug = slugify(`${baseSlug}-${first.postalCode || hash(identity).slice(0, 7)}`);
  if (usedSlugs.has(slug) && usedSlugs.get(slug) !== sourceKey) slug = `${slug.slice(0, 91)}-${hash(identity).slice(0, 7)}`;
  usedSlugs.set(slug, sourceKey);
  const categories = categoriesFor(row);
  const levels = levelsFor(row);
  const insurance = insuranceFor(row);
  const sourceCount = clean(row["Source Count"]);
  const sourceNames = [clean(row["Samhsa In Su"]) === "Y" || clean(row["Samhsa In Mh"]) === "Y" ? "SAMHSA" : "", first.listingUrl ? "Recovery.com" : ""].filter(Boolean);
  const description = `${first.name} is listed as a behavioral health, treatment, or recovery resource in ${first.city}, ${first.state}. Contact the organization directly to confirm services, eligibility, availability, cost, and licensing.`;
  const sourceNotes = `Imported from ATC USA Master v2. Sources represented: ${sourceNames.join(" and ") || "public directory data"}. Match classification: ${clean(row["Match Confidence"]) || "not recorded"}; source count: ${sourceCount || "not recorded"}. Contact and service details have not been independently verified by TreatmentLane.`;
  const rawRows = items.map((item) => ({ sheetRow: item.rowNumber, ...item.row }));
  const fingerprint = hash(JSON.stringify(rawRows));
  providers.push({
    sourceKey, name: first.name, slug, description, address: first.address || null, city: first.city, state: first.state,
    postalCode: first.postalCode || null, phone: clean(row["Phone E164"] || row.Phone) || null, website: null,
    categories, levels, insurance, licenseSummary: null, accreditation: [], sourceUrl: first.listingUrl,
    sourceNotes, intakePhone: clean(row["Intake Phone"]) || null, latitude: Number(row.Latitude) || null,
    longitude: Number(row.Longitude) || null, sourceData: { masterRows: rawRows }, fingerprint,
  });
}

const duplicateGroups = [...groups.values()].filter((group) => group.length > 1);
const recoveryUrlsInMaster = new Set(masterRows.map((row) => clean(row["Listing Url"]).replace(/\/$/, "")).filter(Boolean));
const summary = {
  masterRows: masterRows.length,
  recoveryReferenceRows: recoveryRows.length,
  recoveryRowsRepresentedInMaster: [...recoveryByUrl.keys()].filter((url) => recoveryUrlsInMaster.has(url)).length,
  recoveryRowsExcludedFromCanonicalMaster: [...recoveryByUrl.keys()].filter((url) => !recoveryUrlsInMaster.has(url)).length,
  exactDuplicateGroupsMerged: duplicateGroups.length,
  exactDuplicateRowsMerged: duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0),
  publishableProviders: providers.length,
  rejectedRows: rejected.length,
  inferredStateRows: prepared.filter((item) => !US_REGIONS.has(clean(item.row.State).toUpperCase())).length,
};
console.log(JSON.stringify(summary, null, 2));
if (rejected.length) console.log("Rejected sample:", rejected.slice(0, 10));
if (!commit) {
  console.log("Dry run only. Re-run with --commit after reviewing the summary.");
  process.exit(0);
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const sql = neon(process.env.DATABASE_URL);
const batchSize = 120;
const columns = [
  "name", "slug", "description", "address", "city", "state", "postal_code", "phone", "website", "categories",
  "levels_of_care", "insurance", "license_summary", "accreditation", "source_url", "source_notes", "verification_status",
  "publication_status", "is_sponsored", "source_key", "intake_phone", "latitude", "longitude", "source_data", "import_fingerprint",
];

for (let offset = 0; offset < providers.length; offset += batchSize) {
  const batch = providers.slice(offset, offset + batchSize);
  const params = [];
  const tuples = batch.map((provider) => {
    const values = [
      provider.name, provider.slug, provider.description, provider.address, provider.city, provider.state, provider.postalCode,
      provider.phone, provider.website, pgArray(provider.categories), pgArray(provider.levels), pgArray(provider.insurance),
      provider.licenseSummary, pgArray(provider.accreditation), provider.sourceUrl, provider.sourceNotes, "listed", "published", false,
      provider.sourceKey, provider.intakePhone, provider.latitude, provider.longitude, JSON.stringify(provider.sourceData), provider.fingerprint,
    ];
    const start = params.length;
    params.push(...values);
    return `(${values.map((_, index) => `$${start + index + 1}`).join(",")})`;
  });
  const updateColumns = columns.filter((column) => !["source_key", "verification_status", "publication_status", "is_sponsored"].includes(column));
  const query = `insert into providers (${columns.join(",")}) values ${tuples.join(",")}
    on conflict (source_key) where source_key is not null do update set
    ${updateColumns.map((column) => `${column} = excluded.${column}`).join(",")}, updated_at = now()
    where providers.verification_status = 'listed'`;
  await sql.query(query, params);
  if (offset % 2400 === 0) console.log(`Imported ${Math.min(offset + batch.length, providers.length)} / ${providers.length}`);
}

const counts = await sql`select publication_status, verification_status, count(*)::int as count from providers group by publication_status, verification_status order by publication_status, verification_status`;
console.log("Import complete:", counts);
