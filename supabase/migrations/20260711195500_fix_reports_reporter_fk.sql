-- reports.reporter_id was pointed at auth.users(id). Every other user_id
-- column in this schema (e.g. contributions.user_id) points at
-- public.profiles(id) instead, which is what lets PostgREST embed
-- `profiles:reporter_id(name)` in a select() -- a straight FK to
-- auth.users isn't visible to PostgREST's relationship inference.
-- profiles.id === auth.users.id 1:1, so this is a like-for-like swap.
alter table public.reports drop constraint reports_reporter_id_fkey;
alter table public.reports
  add constraint reports_reporter_id_fkey
  foreign key (reporter_id) references public.profiles(id);
