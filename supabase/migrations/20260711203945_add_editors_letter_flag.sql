-- Explicit flag replacing the old EDITOR_USER_ID account-based heuristic
-- in magazine-reader.html, which hid ALL of that account's contributions
-- (including real, distinct columns) instead of just the one that's
-- actually the Editor's Letter.
alter table public.contributions
  add column is_editors_letter boolean not null default false;

-- Article id=1's text is a verbatim duplicate of the hardcoded Editor's
-- Letter page content -- flag it so it stops appearing twice (once as the
-- static letter, once as a normal contributor page).
update public.contributions set is_editors_letter = true where id = 1;
