create extension if not exists pgcrypto;

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

create index if not exists providers_publication_idx on providers(publication_status);
create index if not exists providers_state_city_idx on providers(state, city);
create index if not exists providers_categories_gin on providers using gin(categories);
create index if not exists provider_submissions_created_idx on provider_submissions(created_at desc);
create index if not exists correction_requests_created_idx on correction_requests(created_at desc);
create index if not exists contact_inquiries_created_idx on contact_inquiries(created_at desc);
