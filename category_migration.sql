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

-- Video embeds (YouTube/Vimeo links) attached to a column, alongside photos/products.
alter table public.contributions add column if not exists videos text;

-- Auto-follow: every user (new and existing) automatically follows the
-- founder by default. They can unfollow anytime from Discover or their
-- Dashboard, exactly like any other follow.
-- Aysegul's real user ID (from auth.users), confirmed via the Supabase dashboard.
DO $$
DECLARE
  founder_id uuid := 'dfa18b13-a201-4012-8449-7356b3ef2c69';
BEGIN
  -- Backfill existing users
  INSERT INTO public.follows (user_id, contributor_id)
  SELECT id, founder_id::text FROM auth.users
  WHERE id != founder_id
  ON CONFLICT (user_id, contributor_id) DO NOTHING;
END $$;

-- Make sure every future signup also auto-follows the founder.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role','reader'));

  insert into public.follows (user_id, contributor_id)
  values (new.id, 'dfa18b13-a201-4012-8449-7356b3ef2c69')
  on conflict (user_id, contributor_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- CRITICAL FIX: contributions.user_id only had a foreign key to auth.users,
-- not to public.profiles. That meant every query joining contributions to
-- profiles (to show the author's name/avatar/bio) had no relationship to
-- follow, and silently failed or returned incomplete data. This adds the
-- missing link so those joins actually work.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contributions_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.contributions
      ADD CONSTRAINT contributions_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ══════════════════════════════════════════════
-- NOTIFICATIONS: likes and comments can notify the
-- contribution's author, in-app and/or by email,
-- based on each user's own preference.
-- ══════════════════════════════════════════════

alter table public.profiles add column if not exists notify_comments_inapp boolean default true;
alter table public.profiles add column if not exists notify_comments_email boolean default true;
alter table public.profiles add column if not exists notify_likes_inapp boolean default true;
alter table public.profiles add column if not exists notify_likes_email boolean default false;

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('like','comment')),
  contribution_id bigint references public.contributions(id) on delete cascade,
  comment_body text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert notifications for others" on public.notifications;
create policy "Users can insert notifications for others"
  on public.notifications for insert
  with check (true);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Same missing-relationship fix as contributions: comments.user_id only
-- linked to auth.users, not to public.profiles, so joining comments to
-- profiles (to show the commenter's name/avatar) had no relationship to
-- follow and could fail silently.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'comments_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.comments
      ADD CONSTRAINT comments_user_id_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Same fix again: notifications.actor_id needs a direct link to profiles
-- so the dashboard can show who liked/commented (name, avatar).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'notifications_actor_id_profiles_fkey'
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_actor_id_profiles_fkey
      FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;
