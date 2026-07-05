-- Run this in Supabase SQL Editor
alter table public.contributions add column if not exists category text;
alter table public.profiles add column if not exists interests text;
alter table public.profiles add column if not exists avatar text;
alter table public.profiles add column if not exists bio text;

-- IMPORTANT: allow contributors to have MULTIPLE articles over time.
-- Previously user_id was UNIQUE, meaning every new submission overwrote
-- the contributor's one and only row. This drops that constraint so each
-- submitted article gets to keep its own row (its own archive entry).
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT conname INTO con_name
  FROM pg_constraint
  WHERE conrelid = 'public.contributions'::regclass
    AND contype = 'u'
    AND array_to_string(conkey, ',') = (
      SELECT array_to_string(array_agg(attnum), ',')
      FROM pg_attribute
      WHERE attrelid = 'public.contributions'::regclass AND attname = 'user_id'
    );
  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.contributions DROP CONSTRAINT %I', con_name);
  END IF;
END $$;

-- Likes and comments for the Newsstand/article (blog-style) reading format.
-- The flip-reader stays a pure magazine with no interaction; these power
-- the alternative "click to read" format only.
create table if not exists public.likes (
  id bigint generated always as identity primary key,
  contribution_id bigint not null references public.contributions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(contribution_id, user_id)
);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  contribution_id bigint not null references public.contributions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table public.likes enable row level security;
alter table public.comments enable row level security;

drop policy if exists "Public read likes" on public.likes;
create policy "Public read likes" on public.likes for select using (true);
drop policy if exists "Users can like" on public.likes;
create policy "Users can like" on public.likes for insert with check (auth.uid() = user_id);
drop policy if exists "Users can unlike own" on public.likes;
create policy "Users can unlike own" on public.likes for delete using (auth.uid() = user_id);

drop policy if exists "Public read comments" on public.comments;
create policy "Public read comments" on public.comments for select using (true);
drop policy if exists "Users can comment" on public.comments;
create policy "Users can comment" on public.comments for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete own comments" on public.comments;
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- IMPORTANT FIX: the original setup only let users view their OWN profile
-- (using auth.uid() = id). That breaks every public-facing feature: viewing
-- another contributor's profile page, seeing their name/avatar on articles
-- and in the newsstand/discover contributor cards, etc. Profiles need to be
-- publicly readable (bio/avatar/name are meant to be public); only editing
-- your own profile should stay restricted.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Add a public "location" field to profiles, shown on the profile page.
alter table public.profiles add column if not exists location text;
