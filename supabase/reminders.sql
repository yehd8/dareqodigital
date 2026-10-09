-- KelvoDigital project checklist and reminders
-- Already applied to the connected Supabase project. Safe to re-run.

alter table public.projects
add column if not exists checklist jsonb not null default '{"agreement_sent":false,"deposit_received":false,"content_received":false,"design_started":false,"client_review":false,"revisions_done":false,"final_payment_received":false,"website_launched":false,"receipt_sent":false}'::jsonb;

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  request_id uuid references public.requests(id) on delete cascade,
  customer_name text,
  phone text,
  title text not null,
  note text,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','done')),
  snoozed_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reminders_business_id_idx on public.reminders(business_id);
create index if not exists reminders_due_at_idx on public.reminders(due_at);
create index if not exists reminders_status_idx on public.reminders(status);

alter table public.reminders enable row level security;

drop policy if exists "members can read own reminders" on public.reminders;
drop policy if exists "members can create own reminders" on public.reminders;
drop policy if exists "members can update own reminders" on public.reminders;
drop policy if exists "members can delete own reminders" on public.reminders;

create policy "members can read own reminders" on public.reminders for select to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));
create policy "members can create own reminders" on public.reminders for insert to authenticated
with check (business_id in (select business_id from public.profiles where id = auth.uid()));
create policy "members can update own reminders" on public.reminders for update to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()))
with check (business_id in (select business_id from public.profiles where id = auth.uid()));
create policy "members can delete own reminders" on public.reminders for delete to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));

revoke all on public.reminders from anon, authenticated;
grant select, insert, update, delete on public.reminders to authenticated;