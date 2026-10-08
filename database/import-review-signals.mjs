import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
if (!process.env.APIFY_TOKEN) throw new Error("APIFY_TOKEN is not configured");
if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

const args = process.argv.slice(2);
const commit = args.includes("--commit");
const refresh = args.includes("--refresh");
const skipSummaries = args.includes("--skip-summaries");
const valueArg = (name, fallback = "") => args.find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1) || fallback;
const limit = Math.min(Math.max(Number.parseInt(valueArg("--limit", "10"), 10) || 10, 1), 250);
const maxReviews = Math.min(Math.max(Number.parseInt(valueArg("--max-reviews", "50"), 10) || 50, 10), 150);
const providerSlug = valueArg("--provider-slug");
const datasetId = valueArg("--dataset-id");
const model = process.env.OPENAI_REVIEW_MODEL || "gpt-5-mini";
const sql = neon(process.env.DATABASE_URL);

const SummarySchema = z.object({
  overview: z.string().min(1).max(520),
  positiveThemes: z.array(z.object({ label: z.string().min(1).max(90), reviewIds: z.array(z.number().int().min(1)).min(2) })).max(4),
  concernThemes: z.array(z.object({ label: z.string().min(1).max(90), reviewIds: z.array(z.number().int().min(1)).min(2) })).max(4),
  limitations: z.string().min(1).max(360),
});

const outputJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["overview", "positiveThemes", "concernThemes", "limitations"],
  properties: {
    overview: { type: "string", maxLength: 520, description: "A neutral two-sentence summary grounded only in the supplied reviews." },
    positiveThemes: {
      type: "array", maxItems: 4,
      items: { type: "object", additionalProperties: false, required: ["label", "reviewIds"], properties: { label: { type: "string", maxLength: 90 }, reviewIds: { type: "array", minItems: 2, items: { type: "integer", minimum: 1 } } } },
    },
    concernThemes: {
      type: "array", maxItems: 4,
      items: { type: "object", additionalProperties: false, required: ["label", "reviewIds"], properties: { label: { type: "string", maxLength: 90 }, reviewIds: { type: "array", minItems: 2, items: { type: "integer", minimum: 1 } } } },
    },
    limitations: { type: "string", maxLength: 360, description: "A short statement about sample size, recency, subjectivity, or missing context." },
  },
};

function clean(value) {
  return String(value || "").replaceAll("\u2014", "-").replaceAll("\u2013", "-").replace(/\s+/g, " ").trim();
}

function normalized(value) {
  return clean(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function safeReviewText(value) {
  return clean(value)
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email removed]")
    .replace(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g, "[phone removed]")
    .replace(/https?:\/\/\S+/gi, "[link removed]")
    .slice(0, 1_200);
}

function safeSummaryText(value) {
  return clean(value).replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

function searchString(provider) {
  return clean([provider.name, provider.address, provider.city, provider.state, provider.postal_code].filter(Boolean).join(" "));
}

function searchUrl(provider) {
  return `https://www.google.com/maps/search/${encodeURIComponent(searchString(provider))}`;
}

function tokenOverlap(left, right) {
  const a = new Set(normalized(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalized(right).split(" ").filter((token) => token.length > 2));
  if (!a.size || !b.size) return 0;
  const overlap = [...a].filter((token) => b.has(token)).length;
  return overlap / Math.min(a.size, b.size);
}

function matchConfidence(provider, review) {
  const providerAddress = normalized([provider.address, provider.city, provider.state, provider.postal_code].filter(Boolean).join(" "));
  const sourceAddress = normalized(review.address);
  const streetNumber = clean(provider.address).match(/^\d+/)?.[0];
  let score = 0;
  if (provider.postal_code && sourceAddress.includes(provider.postal_code)) score += 0.35;
  if (streetNumber && sourceAddress.split(" ").includes(streetNumber)) score += 0.2;
  if (normalized(review.city) === normalized(provider.city)) score += 0.15;
  if (normalized(review.state).includes(normalized(provider.state))) score += 0.1;
  score += tokenOverlap(provider.name, review.title) * 0.2;
  if (providerAddress === sourceAddress) score = Math.max(score, 0.98);
  return Math.min(score, 1);
}

function ratingDistribution(reviews) {
  return reviews.reduce((counts, review) => {
    const stars = Math.round(Number(review.stars));
    if (stars >= 1 && stars <= 5) counts[stars] = (counts[stars] || 0) + 1;
    return counts;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
}

function outputText(response) {
  for (const item of response.output || []) {
    for (const content of item.content || []) if (content.type === "output_text" && content.text) return content.text;
  }
  return "";
}

async function summarizeReviews(provider, reviews) {
  const usable = reviews.flatMap((review, index) => {
    const text = safeReviewText(review.text);
    const stars = Number(review.stars);
    if (!text || !Number.isFinite(stars)) return [];
    return [{ id: index + 1, stars, publishedAt: clean(review.publishedAtDate || review.publishAt), text }];
  });
  if (skipSummaries) return { summary: null, textReviewCount: usable.length };
  if (usable.length < 5) return { summary: null, textReviewCount: usable.length };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      store: false,
      instructions: [
        "You summarize a recent sample of public third-party reviews for a behavioral health directory.",
        "Use only the supplied reviews. Do not quote or identify reviewers. Do not claim that treatment works, that a provider is safe, or that reviews are verified.",
        "Represent positive and critical feedback fairly. Do not omit repeated concerns. A theme count must equal the number of supplied reviews that clearly support it.",
        "Mention only themes supported by at least two reviews. For each theme, return the IDs of every supplied review that clearly supports it. If no concern meets that threshold, return an empty concernThemes array.",
        "Use plain, cautious language. The overview must state that these are reviewer reports, not TreatmentLane findings.",
      ].join(" "),
      input: JSON.stringify({ provider: provider.name, sampleOrder: "newest Google reviews", reviews: usable }),
      text: { format: { type: "json_schema", name: "review_signal_summary", strict: true, schema: outputJsonSchema } },
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`OpenAI summary failed with status ${response.status}: ${clean(payload?.error?.message).slice(0, 240)}`);
  const parsed = SummarySchema.parse(JSON.parse(outputText(payload)));
  const themesWithCounts = (themes) => themes.flatMap((theme) => {
    const reviewIds = [...new Set(theme.reviewIds)].filter((id) => id <= usable.length);
    return reviewIds.length >= 2 ? [{ label: safeSummaryText(theme.label), reviewCount: reviewIds.length }] : [];
  });
  return { textReviewCount: usable.length, summary: {
    overview: safeSummaryText(parsed.overview), limitations: safeSummaryText(parsed.limitations),
    positiveThemes: themesWithCounts(parsed.positiveThemes),
    concernThemes: themesWithCounts(parsed.concernThemes),
  } };
}

async function runGoogleReviews(providers) {
  if (datasetId) {
    if (!/^[A-Za-z0-9]+$/.test(datasetId)) throw new Error("Apify dataset ID is invalid");
    const endpoint = new URL(`https://api.apify.com/v2/datasets/${datasetId}/items`);
    endpoint.searchParams.set("clean", "true");
    endpoint.searchParams.set("format", "json");
    const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${process.env.APIFY_TOKEN}` } });
    const body = await response.text();
    if (!response.ok) throw new Error(`Apify dataset read failed with status ${response.status}: ${body.slice(0, 400)}`);
    const items = JSON.parse(body);
    if (!Array.isArray(items)) throw new Error("Apify dataset returned an unexpected payload");
    return items;
  }
  const expectedCost = providers.length * maxReviews * 0.0006;
  const chargeCap = Math.max(1, Math.ceil(expectedCost * 2 * 100) / 100);
  const endpoint = new URL("https://api.apify.com/v2/actors/compass~google-maps-reviews-scraper/run-sync-get-dataset-items");
  endpoint.searchParams.set("timeout", "300");
  endpoint.searchParams.set("maxTotalChargeUsd", String(chargeCap));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.APIFY_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startUrls: providers.map((provider) => ({ url: searchUrl(provider) })),
      maxReviews,
      reviewsSort: "newest",
      language: "en",
      reviewsOrigin: "google",
      personalData: false,
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Apify review collection failed with status ${response.status}: ${body.slice(0, 400)}`);
  const items = JSON.parse(body);
  if (!Array.isArray(items)) throw new Error("Apify review collection returned an unexpected payload");
  return items;
}

async function fetchRecoveryRating(sourceUrl) {
  if (!sourceUrl || !new URL(sourceUrl).hostname.endsWith("recovery.com")) return null;
  const response = await fetch(sourceUrl, { headers: { "User-Agent": "TreatmentLane source monitor/1.0 (+https://treatmentlane.com/how-we-verify)" } });
  if (!response.ok) return null;
  const html = await response.text();
  const match = html.match(/text-sm font-medium text-foreground">([0-5](?:\.\d)?)<\/div><div class="text-sm text-muted-foreground-light">\(<span class="underline">([\d,]+)<\/span>/i);
  if (!match) return null;
  return { rating: Number(match[1]), count: Number(match[2].replaceAll(",", "")) };
}

async function upsertRecovery(provider, liveRating) {
  const rating = liveRating?.rating ?? (provider.source_rating_value === null ? null : Number(provider.source_rating_value));
  const count = liveRating?.count ?? (provider.source_rating_count === null ? null : Number(provider.source_rating_count));
  if (!provider.source_url || rating === null || count === null) return false;
  if (!commit) return true;
  await sql.query(
    `insert into provider_review_sources
      (provider_id, source_type, source_name, source_url, average_rating, review_count, sampled_review_count,
       source_notes, collection_method, match_confidence, fetched_at, updated_at)
     values ($1, 'recovery.com', 'Recovery.com', $2, $3, $4, 0, $5, $6, 1, now(), now())
     on conflict (provider_id, source_type) do update set
       source_name = excluded.source_name, source_url = excluded.source_url, average_rating = excluded.average_rating,
       review_count = excluded.review_count, source_notes = excluded.source_notes, collection_method = excluded.collection_method,
       match_confidence = excluded.match_confidence, fetched_at = excluded.fetched_at, updated_at = now()`,
    [provider.id, provider.source_url, rating, count,
      "Rating displayed on the linked Recovery.com source record. Its review count may include reviews syndicated from another platform, so TreatmentLane does not combine it with Google totals.",
      liveRating ? "Direct source-page refresh" : "Imported source record"],
  );
  return true;
}

async function upsertGoogle(provider, reviews) {
  if (!reviews.length) return { status: "empty" };
  const first = reviews[0];
  const confidence = matchConfidence(provider, first);
  if (confidence < 0.72) {
    if (commit) await sql.query(
      `insert into provider_review_sources
        (provider_id, source_type, source_name, source_url, external_place_id, match_confidence, match_status,
         source_notes, collection_method, fetched_at, updated_at)
       values ($1, 'google', 'Google Maps', $2, $3, $4, 'rejected', $5,
         'Apify Google Maps Reviews Scraper, rejected before review processing', now(), now())
       on conflict (provider_id, source_type) do update set source_url = excluded.source_url,
         external_place_id = excluded.external_place_id, match_confidence = excluded.match_confidence,
         match_status = excluded.match_status, source_notes = excluded.source_notes,
         collection_method = excluded.collection_method, fetched_at = excluded.fetched_at, updated_at = now()`,
      [provider.id, clean(first.url || searchUrl(provider)), clean(first.placeId), confidence,
        "Google Maps result did not meet the TreatmentLane location-match threshold and is not displayed."],
    );
    return { status: "rejected", confidence };
  }
  const { summary, textReviewCount } = await summarizeReviews(provider, reviews);
  const dated = reviews.map((review) => new Date(review.publishedAtDate || review.publishAt)).filter((date) => Number.isFinite(date.getTime())).sort((a, b) => a.getTime() - b.getTime());
  const totalScore = Number(first.totalScore);
  const reviewsCount = Number(first.reviewsCount);
  const distribution = ratingDistribution(reviews);
  const reviewIdsHash = createHash("sha256").update(reviews.map((review) => clean(review.reviewId)).sort().join("|")).digest("hex");
  if (!commit) return { status: "ready", confidence, sample: reviews.length, summary: Boolean(summary) };

  await sql.query(
    `insert into provider_review_sources
      (provider_id, source_type, source_name, source_url, external_place_id, average_rating, review_count,
      sampled_review_count, text_review_count, rating_distribution, review_summary, positive_themes, concern_themes, summary_limitations,
       review_date_start, review_date_end, match_confidence, source_notes, collection_method, summary_model,
       summary_version, match_status, fetched_at, summarized_at, updated_at)
     values ($1, 'google', 'Google Maps', $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb, $11::jsonb, $12,
       $13, $14, $15, $16, 'Apify Google Maps Reviews Scraper, newest reviews, personal data disabled', $17,
       case when $17::text is null then null else 'balanced-review-signals-v2' end, 'accepted', now(), $18, now())
     on conflict (provider_id, source_type) do update set
       source_name = excluded.source_name, source_url = excluded.source_url, external_place_id = excluded.external_place_id,
       average_rating = excluded.average_rating, review_count = excluded.review_count,
       sampled_review_count = excluded.sampled_review_count, text_review_count = excluded.text_review_count,
       rating_distribution = excluded.rating_distribution,
       review_summary = excluded.review_summary, positive_themes = excluded.positive_themes,
       concern_themes = excluded.concern_themes, summary_limitations = excluded.summary_limitations,
       review_date_start = excluded.review_date_start, review_date_end = excluded.review_date_end,
       match_confidence = excluded.match_confidence, source_notes = excluded.source_notes,
       collection_method = excluded.collection_method, summary_model = excluded.summary_model,
       summary_version = excluded.summary_version, match_status = excluded.match_status, fetched_at = excluded.fetched_at,
       summarized_at = excluded.summarized_at, updated_at = now()`,
    [provider.id, clean(first.url), clean(first.placeId), Number.isFinite(totalScore) ? totalScore : null,
      Number.isFinite(reviewsCount) ? reviewsCount : null, reviews.length, textReviewCount, JSON.stringify(distribution), summary?.overview || null,
      JSON.stringify(summary?.positiveThemes || []), JSON.stringify(summary?.concernThemes || []), summary?.limitations || null,
      dated[0]?.toISOString() || null, dated.at(-1)?.toISOString() || null, confidence,
      `Recent-review sample fingerprint ${reviewIdsHash.slice(0, 16)}. Full review text and reviewer identities are not stored.`,
      summary ? model : null, summary ? new Date().toISOString() : null],
  );
  return { status: "saved", confidence, sample: reviews.length, summary: Boolean(summary) };
}

const params = [];
const clauses = ["publication_status = 'published'", "address is not null", "postal_code is not null"];
if (providerSlug) { params.push(providerSlug); clauses.push(`(slug = $${params.length} or organization_slug = $${params.length})`); }
if (!refresh) clauses.push("not exists (select 1 from provider_review_sources prs where prs.provider_id = providers.id and prs.source_type = 'google' and prs.fetched_at > now() - interval '30 days')");
params.push(limit);
const providers = await sql.query(
  `select id, name, slug, organization_slug, address, city, state, postal_code, source_url,
          source_rating_value, source_rating_count
   from providers where ${clauses.join(" and ")}
   order by source_rating_count desc nulls last, evidence_score desc, name
   limit $${params.length}`,
  params,
);

if (!providers.length) {
  console.log("No eligible providers need review enrichment.");
  process.exit(0);
}

console.log(`${commit ? "Enriching" : "Previewing"} ${providers.length} provider review profiles with up to ${maxReviews} recent Google reviews each${datasetId ? ` from saved dataset ${datasetId}` : ""}.`);

const recoveryResults = await Promise.all(providers.map(async (provider) => {
  try { return await upsertRecovery(provider, await fetchRecoveryRating(provider.source_url)); }
  catch (error) { console.warn(`Recovery.com refresh skipped for ${provider.slug}: ${clean(error.message)}`); return false; }
}));

const googleItems = await runGoogleReviews(providers);
const reviewsBySearch = new Map();
for (const item of googleItems) {
  const key = normalized(item.searchString);
  const current = reviewsBySearch.get(key) || [];
  current.push(item);
  reviewsBySearch.set(key, current);
}

const results = [];
for (const provider of providers) {
  const seenReviewIds = new Set();
  const reviews = (reviewsBySearch.get(normalized(searchString(provider))) || []).filter((review) => {
    const id = clean(review.reviewId) || `${clean(review.publishedAtDate || review.publishAt)}:${clean(review.text)}`;
    if (seenReviewIds.has(id)) return false;
    seenReviewIds.add(id);
    return true;
  }).slice(0, maxReviews);
  try {
    const result = await upsertGoogle(provider, reviews);
    results.push({ provider: provider.slug, ...result });
    console.log(`${provider.slug}: ${result.status}${result.sample ? `, ${result.sample} sampled` : ""}${result.confidence ? `, match ${result.confidence.toFixed(2)}` : ""}`);
  } catch (error) {
    results.push({ provider: provider.slug, status: "failed" });
    console.warn(`${provider.slug}: failed, ${clean(error.message)}`);
  }
}

const counts = results.reduce((summary, result) => ({ ...summary, [result.status]: (summary[result.status] || 0) + 1 }), {});
console.log(JSON.stringify({ commit, providers: providers.length, recoverySources: recoveryResults.filter(Boolean).length, googleItems: googleItems.length, results: counts }, null, 2));
