-- KelvoDigital manager upgrades: invoice line items, archive, deposit tracking and audit history.
alter table public.documents add column if not exists line_items jsonb not null default '[]'::jsonb;
alter table public.documents add column if not exists archived_at timestamptz;
alter table public.projects add column if not exists archived_at timestamptz;
alter table public.projects add column if not exists deposit_percent numeric not null default 50 check (deposit_percent between 0 and 100);
alter table public.requests add column if not exists archived_at timestamptz;

create table if not exists public.customer_archives (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.businesses(id) on delete cascade,
 customer_key text not null, customer_name text, archived_at timestamptz not null default now(), unique(business_id,customer_key)
);

create table if not exists public.audit_logs (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.businesses(id) on delete cascade,
 user_id uuid, action text not null, entity_type text, entity_id uuid, details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
