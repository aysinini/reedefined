alter table public.comments
  add column parent_comment_id bigint references public.comments(id) on delete cascade;

create policy "Authors can delete comments on their contributions"
  on public.comments
  for delete
  using (
    exists (
      select 1 from public.contributions c
      where c.id = comments.contribution_id and c.user_id = auth.uid()
    )
  );
