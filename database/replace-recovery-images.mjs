import { neon } from "@neondatabase/serverless";

const commit = process.argv.includes("--commit");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const sql = neon(databaseUrl);
const recoveryImagePattern = "%res.cloudinary.com/rehabpath/%";
const placeholderUrl = "https://treatmentlane.com/images/treatmentlane-listing-placeholder.webp";

async function affectedCount() {
  const rows = await sql`
    select
      count(*)::int as total,
      count(*) filter (where publication_status = 'published')::int as published
    from providers
    where featured_image_url like ${recoveryImagePattern}
      or exists (
        select 1
        from unnest(image_urls) as image_url
        where image_url like ${recoveryImagePattern}
      )
  `;
  return rows[0];
}

const before = await affectedCount();
let changed = 0;

if (commit && before.total > 0) {
  const rows = await sql`
    update providers
    set
      featured_image_url = ${placeholderUrl},
      image_urls = array[${placeholderUrl}]::text[],
      updated_at = now()
    where featured_image_url like ${recoveryImagePattern}
      or exists (
        select 1
        from unnest(image_urls) as image_url
        where image_url like ${recoveryImagePattern}
      )
    returning id
  `;
  changed = rows.length;
}

const after = await affectedCount();

console.log(JSON.stringify({ commit, before, changed, after, placeholderUrl }, null, 2));
