-- ── HOROSCOPES ───────────────────────────────────────────────
-- Monthly horoscope copy (12 zodiac signs × en/de/tr), generated
-- server-side by the generate-horoscopes edge function and shown
-- as the closing spread of magazine-reader.html.
create table if not exists public.horoscopes (
  id           bigserial primary key,
  issue_number integer not null,
  sign         text not null,
  lang         text not null,
  content      text not null,
  created_at   timestamptz default now(),
  unique(issue_number, sign, lang)
);

alter table public.horoscopes enable row level security;

create policy "Anyone can view horoscopes"
  on public.horoscopes for select
  using (true);
