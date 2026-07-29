-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
--
-- WHY: users, jobs, applications, notifications, candidates currently have no
-- (or overly permissive) Row Level Security, so the public anon key - the one
-- shipped in every browser bundle as NEXT_PUBLIC_SUPABASE_ANON_KEY - can read
-- and write every row of every one of these tables directly via Supabase's
-- REST API, completely bypassing the Next.js app and its auth checks. This
-- was verified directly: a raw anon-key request dumped real user emails and
-- plaintext passwords, and anon-key writes to all five tables succeeded.
--
-- FIX: enable RLS with zero policies on each table. With RLS on and no
-- policies defined, PostgREST denies anon and authenticated roles entirely -
-- only the service_role key (which bypasses RLS by design) can touch these
-- tables. This matches how the app is actually built: every read/write goes
-- through a Next.js API route using SUPABASE_SERVICE_KEY, never straight from
-- the browser, so there is no legitimate reason for anon to have any access.

alter table users         enable row level security;
alter table jobs          enable row level security;
alter table applications  enable row level security;
alter table notifications enable row level security;
alter table candidates    enable row level security;

-- candidates had "Public read" / "Public insert" policies from the original
-- schema, intended for a client-side "companies page" that no longer exists
-- (all reads now go through /api/candidates using the service key). Drop them
-- so candidates gets the same deny-all-to-anon treatment as the other tables.
drop policy if exists "Public read"   on candidates;
drop policy if exists "Public insert" on candidates;

-- Bonus fix found during this audit: the app's PATCH routes for candidates
-- reference a `notes` column that was never actually created, so any update
-- including `notes` throws ("Could not find the 'notes' column of
-- 'candidates' in the schema cache") and silently fails the whole request.
alter table candidates add column if not exists notes text;
