-- Waitlist for the landing page's early-access form.
--
-- The landing site talks to Supabase with the anon key, so access is governed
-- entirely by RLS below: anonymous visitors may INSERT and nothing else. There
-- is deliberately no SELECT policy, so the anon key cannot read the list back.

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  created_at timestamptz not null default now()
);

-- The API route lowercases before inserting; this index enforces uniqueness
-- regardless, and is what produces the 23505 the route turns into a 409.
create unique index if not exists waitlist_email_lower_key
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

drop policy if exists "anon can join the waitlist" on public.waitlist;
create policy "anon can join the waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
