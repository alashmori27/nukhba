-- Run this in Supabase SQL Editor

create table candidates (
  id               uuid default gen_random_uuid() primary key,
  name             text,
  specialization   text,
  location         text,
  experience_years text,
  score            integer,
  profile_json     jsonb,
  created_at       timestamptz default now()
);

-- Allow public read (for companies page)
alter table candidates enable row level security;

create policy "Public read"
  on candidates for select
  using (true);

create policy "Public insert"
  on candidates for insert
  with check (true);
