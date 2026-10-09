-- KelvoDigital expense tracking migration
-- Already applied to the live Supabase project. Kept here for source control.

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  expense_name text not null,
  amount numeric(12,2) not null check (amount >= 0),
  expense_date date not null default current_date,
  category text not null default 'Other',
  payment_method text,
  supplier text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expenses_business_id_idx on public.expenses(business_id);
create index if not exists expenses_project_id_idx on public.expenses(project_id);
create index if not exists expenses_date_idx on public.expenses(expense_date);
create index if not exists expenses_category_idx on public.expenses(category);

drop trigger if exists expenses_updated_at on public.expenses;
create trigger expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

alter table public.expenses enable row level security;

drop policy if exists "members can read own expenses" on public.expenses;
drop policy if exists "members can create own expenses" on public.expenses;
drop policy if exists "members can update own expenses" on public.expenses;
drop policy if exists "members can delete own expenses" on public.expenses;

create policy "members can read own expenses"
on public.expenses for select
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));

create policy "members can create own expenses"
on public.expenses for insert
to authenticated
with check (
  business_id in (select business_id from public.profiles where id = auth.uid())
  and (project_id is null or project_id in (
    select id from public.projects
    where business_id in (select business_id from public.profiles where id = auth.uid())
  ))
);

create policy "members can update own expenses"
on public.expenses for update
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()))
with check (
  business_id in (select business_id from public.profiles where id = auth.uid())
  and (project_id is null or project_id in (
    select id from public.projects
    where business_id in (select business_id from public.profiles where id = auth.uid())
  ))
);

create policy "members can delete own expenses"
on public.expenses for delete
to authenticated
using (business_id in (select business_id from public.profiles where id = auth.uid()));

revoke all on public.expenses from anon, authenticated;
grant select, insert, update, delete on public.expenses to authenticated;
