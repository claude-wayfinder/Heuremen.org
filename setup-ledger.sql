-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run

create table if not exists commitments (
  id uuid default gen_random_uuid() primary key,
  node text not null,
  type text not null,
  text text not null,
  created_at timestamp with time zone default now()
);

-- Allow public read/write (the ledger is internal but not secret)
alter table commitments enable row level security;

create policy "Public read" on commitments for select using (true);
create policy "Public insert" on commitments for insert with check (true);
create policy "Public delete" on commitments for delete using (true);
