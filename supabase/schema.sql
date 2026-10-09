-- KelvoDigital Business Manager - Supabase schema
-- Safe to re-run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  full_name text,
  role text not null default 'owner' check (role in ('owner','manager','staff','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text not null,
  phone text,
  whatsapp text,
  email text,
  request_type text not null default 'quote',
  service text,
  preferred_date date,
  preferred_time text,
  notes text,
  internal_notes text,
  quoted_price numeric(12,2),
  follow_up_date date,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Expand request workflow: Pending -> Contacted -> Confirmed -> In Progress -> Completed.
alter table public.requests drop constraint if exists requests_status_check;
alter table public.requests add constraint requests_status_check
check (status in ('pending','contacted','confirmed','in_progress','completed','rejected'));

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  request_id uuid references public.requests(id) on delete set null,
  project_name text not null,
  customer_name text not null,
  phone text,
  email text,
  service text,
  status text not null default 'waiting_content' check (status in (
    'waiting_content','designing','development','client_review','revisions',
    'ready_to_launch','completed','on_hold','cancelled'
  )),
  agreed_price numeric(12,2),
  start_date date,
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists requests_business_id_idx on public.requests(business_id);
create index if not exists requests_status_idx on public.requests(status);
create index if not exists profiles_business_id_idx on public.profiles(business_id);
create index if not exists projects_business_id_idx on public.projects(business_id);
create index if not exists projects_status_idx on public.projects(status);
create unique index if not exists projects_request_id_unique on public.projects(request_id) where request_id is not null;

-- Initial KelvoDigital business ID. Keep this same ID in the website.
insert into public.businesses (id, name, slug)
values ('11111111-1111-1111-1111-111111111111', 'KelvoDigital', 'kelvodigital')
on conflict (id) do update set name=excluded.name, slug=excluded.slug;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists requests_updated_at on public.requests;
create trigger requests_updated_at
before update on public.requests
for each row execute function public.set_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.projects enable row level security;

-- Make policy creation safe to re-run.
drop policy if exists "members can read own business" on public.businesses;
drop policy if exists "members can read own profile" on public.profiles;
drop policy if exists "public can create requests" on public.requests;
drop policy if exists "members can read own requests" on public.requests;
drop policy if exists "members can update own requests" on public.requests;
drop policy if exists "members can read own projects" on public.projects;
drop policy if exists "members can create own projects" on public.projects;
drop policy if exists "members can update own projects" on public.projects;
drop policy if exists "members can delete own projects" on public.projects;

create policy "members can read own business"
on public.businesses for select
to authenticated
using (id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "public can create requests"
on public.requests for insert
to anon, authenticated
with check (
  business_id = '11111111-1111-1111-1111-111111111111'
  and status = 'pending'
);

create policy "members can read own requests"
on public.requests for select
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can update own requests"
on public.requests for update
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()))
with check (business_id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can read own projects"
on public.projects for select
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can create own projects"
on public.projects for insert
to authenticated
with check (business_id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can update own projects"
on public.projects for update
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()))
with check (business_id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can delete own projects"
on public.projects for delete
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));

-- Least-privilege grants for browser Data API.
revoke all on public.businesses from anon, authenticated;
revoke all on public.profiles from anon, authenticated;
revoke all on public.requests from anon, authenticated;
revoke all on public.projects from anon, authenticated;

grant select on public.businesses to authenticated;
grant select on public.profiles to authenticated;
grant insert on public.requests to anon, authenticated;
grant select, update on public.requests to authenticated;
grant select, insert, update, delete on public.projects to authenticated;

-- Official owner profile for KelvoDigital. Keep the account private; the business UI does not display the personal name.
delete from public.profiles
where id = 'a0706c0b-2a9c-4c97-959e-6d0c3ecd8869';

insert into public.profiles (id, business_id, full_name, role)
values ('7003c6e6-3b42-4e77-8bb2-2fba6fee6616', '11111111-1111-1111-1111-111111111111', 'KelvoDigital', 'owner')
on conflict (id) do update set business_id=excluded.business_id, full_name=excluded.full_name, role=excluded.role;
