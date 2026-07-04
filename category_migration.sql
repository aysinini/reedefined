-- Run this in Supabase SQL Editor
alter table public.contributions add column if not exists category text;
alter table public.profiles add column if not exists interests text;
