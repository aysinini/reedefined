-- ── PUZZLES ──────────────────────────────────────────────────
-- Monthly crossword puzzle (en/de/tr), grid built server-side by a
-- deterministic backtracking algorithm from AI-generated word/clue
-- lists, shown as an interactive spread in magazine-reader.html.
create table if not exists public.puzzles (
  id           bigserial primary key,
  issue_number integer not null,
  lang         text not null,
  grid_data    jsonb not null,  -- {width, height, cells:[[{letter|null, blocked, number|null}]]}
  clues        jsonb not null,  -- {across:[{number,clue,answer,row,col,length}], down:[...]}
  created_at   timestamptz default now(),
  unique(issue_number, lang)
);

alter table public.puzzles enable row level security;

create policy "Anyone can view puzzles"
  on public.puzzles for select
  using (true);
