create extension if not exists pgcrypto;

create type public.publication_status as enum ('draft', 'review', 'published', 'archived');
create type public.verification_status as enum ('listed', 'provider-confirmed', 'independently-reviewed');
create type public.application_status as enum ('new', 'reviewing', 'approved', 'declined', 'spam');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'viewer' check (role in ('viewer', 'editor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.providers (
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
  verification_status public.verification_status not null default 'listed',
  publication_status public.publication_status not null default 'draft',
  is_sponsored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  work_email text not null,
  phone text,
  website text,
  city text not null,
  state text not null,
  relationship text not null,
  notes text,
  status public.application_status not null default 'new',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id)
);

create table public.correction_requests (
  id uuid primary key default gen_random_uuid(),
  provider_slug text,
  requester_name text not null,
  requester_email text not null,
  details text not null,
  source_url text,
  status public.application_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status public.application_status not null default 'new',
  created_at timestamptz not null default now()
);

create index providers_publication_idx on public.providers(publication_status);
create index providers_state_city_idx on public.providers(state, city);
create index providers_categories_gin on public.providers using gin(categories);

alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.provider_submissions enable row level security;
alter table public.correction_requests enable row level security;
alter table public.contact_inquiries enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$;

create policy "published providers are public"
on public.providers for select
to anon, authenticated
using (publication_status = 'published' or public.is_staff());

create policy "staff manage providers"
on public.providers for all
to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "staff read submissions"
on public.provider_submissions for select
to authenticated
using (public.is_staff());

create policy "staff update submissions"
on public.provider_submissions for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "staff read corrections"
on public.correction_requests for select
to authenticated
using (public.is_staff());

create policy "staff update corrections"
on public.correction_requests for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "staff read contact inquiries"
on public.contact_inquiries for select
to authenticated
using (public.is_staff());

create policy "staff update contact inquiries"
on public.contact_inquiries for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

revoke all on public.profiles from anon;
revoke all on public.provider_submissions from anon, authenticated;
revoke all on public.correction_requests from anon, authenticated;
revoke all on public.contact_inquiries from anon, authenticated;
grant select on public.providers to anon, authenticated;
grant select, insert, update, delete on public.providers to authenticated;
grant select, update on public.provider_submissions to authenticated;
grant select, update on public.correction_requests to authenticated;
grant select, update on public.contact_inquiries to authenticated;
