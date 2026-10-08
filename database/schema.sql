create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  address text,
  city text not null,
  state text not null check (char_length(state) = 2),
  postal_code text,
  phone text,
  website text,
  categories text[] not null default '{}',
  levels_of_care text[] not null default '{}',
  insurance text[] not null default '{}',
  license_summary text,
  accreditation text[] not null default '{}',
  source_url text,
  source_notes text,
  last_verified_at timestamptz,
  verification_status text not null default 'listed'
    check (verification_status in ('listed', 'provider-confirmed', 'independently-reviewed')),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'review', 'published', 'archived')),
  is_sponsored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table providers add column if not exists source_key text;
alter table providers add column if not exists email text;
alter table providers add column if not exists intake_phone text;
alter table providers add column if not exists latitude double precision;
alter table providers add column if not exists longitude double precision;
alter table providers add column if not exists source_data jsonb not null default '{}'::jsonb;
alter table providers add column if not exists import_fingerprint text;
alter table providers add column if not exists featured_image_url text;
alter table providers add column if not exists image_urls text[] not null default '{}';
alter table providers add column if not exists treatment_types text[] not null default '{}';
alter table providers add column if not exists therapies text[] not null default '{}';
alter table providers add column if not exists amenities text[] not null default '{}';
alter table providers add column if not exists specialties text[] not null default '{}';
alter table providers add column if not exists insurance_details text;
alter table providers add column if not exists price_range text;
alter table providers add column if not exists treatment_duration text;
alter table providers add column if not exists source_rating_value numeric(4, 2);
alter table providers add column if not exists source_rating_count integer;
alter table providers add column if not exists organization_slug text;
alter table providers add column if not exists location_slug text;
alter table providers add column if not exists evidence_score integer not null default 0
  check (evidence_score between 0 and 100);

alter table providers drop constraint if exists providers_verification_status_check;
alter table providers add constraint providers_verification_status_check
  check (verification_status in ('listed', 'data-verified', 'provider-confirmed', 'independently-reviewed'));

create table if not exists provider_source_records (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers(id) on delete cascade,
  source_type text not null,
  external_id text,
  source_url text,
  fetched_at timestamptz not null default now(),
  field_data jsonb not null default '{}'::jsonb,
  payload_hash text,
  match_confidence numeric(5, 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, source_type, external_id)
);

create table if not exists provider_verification_checks (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers(id) on delete cascade,
  check_type text not null,
  status text not null check (status in ('pass', 'fail', 'conflict', 'not-applicable')),
  source_url text,
  checked_at timestamptz not null default now(),
  expires_at timestamptz,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists provider_review_sources (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers(id) on delete cascade,
  source_type text not null check (source_type in ('google', 'recovery.com', 'rehab.com', 'rehabs.com', 'other')),
  source_name text not null,
  source_url text not null,
  external_place_id text,
  average_rating numeric(4, 2) check (average_rating between 0 and 5),
  review_count integer check (review_count >= 0),
  sampled_review_count integer not null default 0 check (sampled_review_count >= 0),
  rating_distribution jsonb not null default '{}'::jsonb,
  review_summary text,
  positive_themes jsonb not null default '[]'::jsonb,
  concern_themes jsonb not null default '[]'::jsonb,
  summary_limitations text,
  review_date_start timestamptz,
  review_date_end timestamptz,
  match_confidence numeric(5, 4),
  source_notes text,
  collection_method text not null,
  summary_model text,
  summary_version text,
  fetched_at timestamptz not null default now(),
  summarized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, source_type)
);

alter table provider_review_sources add column if not exists text_review_count integer not null default 0
  check (text_review_count >= 0);
alter table provider_review_sources add column if not exists match_status text not null default 'accepted'
  check (match_status in ('accepted', 'rejected'));

create table if not exists provider_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  work_email text not null,
  phone text,
  website text,
  city text not null,
  state text not null check (char_length(state) = 2),
  relationship text not null,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'approved', 'declined', 'spam')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table provider_submissions add column if not exists request_type text not null default 'list-new';
alter table provider_submissions add column if not exists provider_path text;
alter table provider_submissions add column if not exists availability_status text;
alter table provider_submissions add column if not exists estimated_wait text;
alter table provider_submissions add column if not exists admissions_hours text;
alter table provider_submissions add column if not exists insurance_updates text;
alter table provider_submissions add column if not exists cost_updates text;
alter table provider_submissions add column if not exists profile_updates text;
alter table provider_submissions add column if not exists attested boolean not null default false;

alter table provider_submissions drop constraint if exists provider_submissions_request_type_check;
alter table provider_submissions add constraint provider_submissions_request_type_check
  check (request_type in ('claim-existing', 'update-profile', 'update-availability', 'list-new'));
alter table provider_submissions drop constraint if exists provider_submissions_availability_status_check;
alter table provider_submissions add constraint provider_submissions_availability_status_check
  check (availability_status is null or availability_status in ('accepting', 'waitlist', 'not-accepting', 'unknown'));

create table if not exists correction_requests (
  id uuid primary key default gen_random_uuid(),
  provider_slug text,
  requester_name text not null,
  requester_email text not null,
  details text not null,
  source_url text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'approved', 'declined', 'spam')),
  created_at timestamptz not null default now()
);

create table if not exists contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'approved', 'declined', 'spam')),
  created_at timestamptz not null default now()
);

create table if not exists provider_interactions (
  id bigserial primary key,
  provider_id uuid not null references providers(id) on delete cascade,
  event_type text not null check (event_type in ('call', 'email', 'website', 'directions', 'google-maps')),
  created_at timestamptz not null default now()
);

create table if not exists content_articles (
  id uuid primary key default gen_random_uuid(),
  content_unit_id text not null unique,
  idempotency_key text not null unique,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  seo_title text not null,
  meta_description text not null,
  primary_keyword text not null,
  secondary_keywords text[] not null default '{}',
  category text not null,
  author_name text not null default 'TreatmentLane Editorial Team',
  payload jsonb not null default '{}'::jsonb,
  thumbnail_base64 text,
  thumbnail_mime_type text not null default 'image/webp',
  status text not null default 'needs_medical_review'
    check (status in ('needs_medical_review', 'approved', 'published', 'rejected', 'archived')),
  reviewer_name text,
  reviewer_credentials text,
  reviewed_at timestamptz,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists providers_publication_idx on providers(publication_status);
create index if not exists providers_state_city_idx on providers(state, city);
create index if not exists providers_categories_gin on providers using gin(categories);
create unique index if not exists providers_source_key_unique on providers(source_key) where source_key is not null;
create index if not exists providers_name_trgm on providers using gin(name gin_trgm_ops);
create index if not exists providers_city_trgm on providers using gin(city gin_trgm_ops);
create index if not exists providers_address_trgm on providers using gin(address gin_trgm_ops);
create unique index if not exists providers_canonical_path_unique
  on providers(organization_slug, location_slug)
  where organization_slug is not null and location_slug is not null;
create index if not exists providers_recommended_order_idx
  on providers(verification_status, evidence_score desc, source_rating_count desc)
  where publication_status = 'published';
create index if not exists provider_source_records_provider_idx on provider_source_records(provider_id, source_type);
create index if not exists provider_verification_checks_provider_idx on provider_verification_checks(provider_id, checked_at desc);
create index if not exists provider_review_sources_provider_idx on provider_review_sources(provider_id, fetched_at desc);
create index if not exists provider_review_sources_source_idx on provider_review_sources(source_type, fetched_at desc);
create index if not exists provider_submissions_created_idx on provider_submissions(created_at desc);
create index if not exists correction_requests_created_idx on correction_requests(created_at desc);
create index if not exists contact_inquiries_created_idx on contact_inquiries(created_at desc);
create index if not exists provider_interactions_provider_created_idx on provider_interactions(provider_id, created_at desc);
create index if not exists content_articles_review_queue_idx
  on content_articles(status, scheduled_at, created_at);
create index if not exists content_articles_published_idx
  on content_articles(published_at desc)
  where status = 'published';
