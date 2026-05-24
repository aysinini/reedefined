-- ══════════════════════════════════════════════════════════════
-- REEDEFINED — Supabase Database Setup
-- Run this entire script in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ══════════════════════════════════════════════════════════════

-- ── 1. PROFILES ──────────────────────────────────────────────
-- Extends Supabase auth.users with name and role
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  name      text,
  role      text default 'reader' check (role in ('reader','contrib')),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'reader')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. WAITLIST ───────────────────────────────────────────────
create table if not exists public.waitlist (
  id          bigserial primary key,
  name        text not null,
  email       text not null unique,
  role        text default 'reader',
  interests   text,
  joined_at   timestamptz default now()
);

-- ── 3. CONTRIBUTIONS ─────────────────────────────────────────
-- Contributor column submissions
create table if not exists public.contributions (
  id                bigserial primary key,
  user_id           uuid references auth.users(id) on delete set null,
  title             text,
  body              text,
  issue             text,
  moderation_passed boolean default false,
  submitted_at      timestamptz default now()
);

-- ── 4. COVER SUBMISSIONS ─────────────────────────────────────
-- Illustrator open call submissions
create table if not exists public.cover_submissions (
  id                bigserial primary key,
  name              text not null,
  email             text not null,
  bio               text,
  social            text,
  location          text,
  portfolio         text,
  filename          text,
  filesize          bigint,
  sketch_filename   text,
  drift_answer      text,
  issue             text,
  moderation_passed boolean default false,
  submitted_at      timestamptz default now()
);

-- ── 5. FOLLOWS ───────────────────────────────────────────────
-- Reader follows contributor
create table if not exists public.follows (
  id              bigserial primary key,
  user_id         uuid references auth.users(id) on delete cascade,
  contributor_id  text not null,
  followed_at     timestamptz default now(),
  unique(user_id, contributor_id)
);

-- ── 6. PUBLIC ISSUES ─────────────────────────────────────────
-- Reader opts in to making their issue public
create table if not exists public.public_issues (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete cascade unique,
  opted_in    boolean default false,
  updated_at  timestamptz default now()
);

-- ── 7. AD ENQUIRIES ──────────────────────────────────────────
-- Brand advertising enquiries
create table if not exists public.ad_enquiries (
  id           bigserial primary key,
  name         text not null,
  brand        text not null,
  email        text not null,
  format       text,
  issue        text,
  message      text,
  submitted_at timestamptz default now()
);

-- ── 8. PLATFORM CONNECTIONS ──────────────────────────────────
-- User connected platforms (Spotify, TikTok etc)
create table if not exists public.platform_connections (
  id           bigserial primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  platform     text not null,
  access_token text,
  username     text,
  profile_url  text,
  connected_at timestamptz default now(),
  unique(user_id, platform)
);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Protects data so users can only see their own records
-- ══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table public.profiles             enable row level security;
alter table public.waitlist             enable row level security;
alter table public.contributions        enable row level security;
alter table public.cover_submissions    enable row level security;
alter table public.follows              enable row level security;
alter table public.public_issues        enable row level security;
alter table public.ad_enquiries         enable row level security;
alter table public.platform_connections enable row level security;

-- ── PROFILES ──
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── WAITLIST — anyone can insert (public signup) ──
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

-- ── CONTRIBUTIONS ──
create policy "Users can insert own contributions"
  on public.contributions for insert
  with check (auth.uid() = user_id);

create policy "Users can view own contributions"
  on public.contributions for select
  using (auth.uid() = user_id);

-- ── COVER SUBMISSIONS — anyone can submit ──
create policy "Anyone can submit cover"
  on public.cover_submissions for insert
  with check (true);

-- ── FOLLOWS ──
create policy "Users can manage own follows"
  on public.follows for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view follows"
  on public.follows for select
  using (true);

-- ── PUBLIC ISSUES ──
create policy "Users can manage own public issue"
  on public.public_issues for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view public issues"
  on public.public_issues for select
  using (opted_in = true);

-- ── AD ENQUIRIES — anyone can submit ──
create policy "Anyone can submit ad enquiry"
  on public.ad_enquiries for insert
  with check (true);

-- ── PLATFORM CONNECTIONS ──
create policy "Users can manage own connections"
  on public.platform_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- DONE
-- All 8 tables created with RLS policies
-- The on_auth_user_created trigger auto-creates profiles
-- ══════════════════════════════════════════════════════════════
