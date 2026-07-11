-- Per-article translation cache. Keyed by target language ('tr'/'de'), each
-- value holds {title, tagline, body}. Written only by the translate-article
-- edge function (service role), so no new RLS write policy is needed —
-- reads are already covered by the existing "Anyone can read submitted
-- contributions" policy.
alter table public.contributions
  add column translations text not null default '{}';
