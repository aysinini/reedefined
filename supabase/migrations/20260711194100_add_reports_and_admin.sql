-- Admin flag. Single bootstrap admin set below; no admin UI to grant this
-- to other accounts yet -- add more with a manual UPDATE if needed.
alter table public.profiles
  add column is_admin boolean not null default false;

update public.profiles set is_admin = true
  where id = 'dfa18b13-a201-4012-8449-7356b3ef2c69';

-- Reader-filed reports on published articles.
create table public.reports (
  id bigint generated always as identity primary key,
  article_id bigint not null references public.contributions(id) on delete cascade,
  reporter_id uuid not null references auth.users(id),
  reason text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Signed-in users can report articles"
  on public.reports
  for insert
  with check (auth.uid() = reporter_id);

create policy "Admins can read all reports"
  on public.reports
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Lets an admin soft-remove (status='removed') any contribution, on top of
-- the existing "owner can update their own row" policy. Removal is
-- reversible (a status flip), never a hard delete.
create policy "Admins can update any contribution"
  on public.contributions
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );
