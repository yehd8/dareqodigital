-- KelvoDigital agreements, invoices and receipts
-- This has already been applied to the connected Supabase project.

alter table public.documents add column if not exists status text not null default 'draft';
alter table public.documents add column if not exists business_name text;
alter table public.documents add column if not exists service text;
alter table public.documents add column if not exists start_date date;
alter table public.documents add column if not exists delivery_date date;
alter table public.documents add column if not exists deposit_percent numeric(5,2) not null default 50;
alter table public.documents add column if not exists amount_paid numeric(12,2) not null default 0;
alter table public.documents add column if not exists balance numeric(12,2) not null default 0;
alter table public.documents add column if not exists payment_methods text[] not null default array['OMT','WHISH MONEY','Personally']::text[];
alter table public.documents add column if not exists share_token uuid not null default gen_random_uuid();

create unique index if not exists documents_share_token_unique on public.documents(share_token);
create index if not exists documents_business_id_idx on public.documents(business_id);
create index if not exists documents_project_id_idx on public.documents(project_id);
create index if not exists documents_type_idx on public.documents(document_type);

create or replace function public.set_documents_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at before update on public.documents for each row execute function public.set_documents_updated_at();

alter table public.documents enable row level security;
drop policy if exists "members can read own documents" on public.documents;
drop policy if exists "members can create own documents" on public.documents;
drop policy if exists "members can update own documents" on public.documents;
drop policy if exists "members can delete own documents" on public.documents;
create policy "members can read own documents" on public.documents for select to authenticated using (business_id in (select business_id from public.profiles where id = auth.uid()));
create policy "members can create own documents" on public.documents for insert to authenticated with check (business_id in (select business_id from public.profiles where id = auth.uid()));
create policy "members can update own documents" on public.documents for update to authenticated using (business_id in (select business_id from public.profiles where id = auth.uid())) with check (business_id in (select business_id from public.profiles where id = auth.uid()));
create policy "members can delete own documents" on public.documents for delete to authenticated using (business_id in (select business_id from public.profiles where id = auth.uid()));

revoke all on public.documents from anon, authenticated;
grant select, insert, update, delete on public.documents to authenticated;

create or replace function public.get_shared_document(p_token uuid)
returns table (
  id uuid,
  document_type text,
  status text,
  document_number text,
  customer_name text,
  business_name text,
  customer_email text,
  customer_phone text,
  title text,
  description text,
  service text,
  amount numeric,
  issue_date date,
  due_date date,
  start_date date,
  delivery_date date,
  deposit_percent numeric,
  amount_paid numeric,
  balance numeric,
  payment_methods text[],
  terms text,
  notes text,
  project_name text,
  updated_at timestamptz
)
language sql security definer set search_path=public as $$
  select d.id,d.document_type,d.status,d.document_number,d.customer_name,d.business_name,d.customer_email,d.customer_phone,
         d.title,d.description,d.service,d.amount,d.issue_date,d.due_date,d.start_date,d.delivery_date,d.deposit_percent,
         d.amount_paid,d.balance,d.payment_methods,d.terms,d.notes,p.project_name,d.updated_at
  from public.documents d left join public.projects p on p.id=d.project_id
  where d.share_token=p_token limit 1;
$$;
revoke all on function public.get_shared_document(uuid) from public;
grant execute on function public.get_shared_document(uuid) to anon, authenticated;