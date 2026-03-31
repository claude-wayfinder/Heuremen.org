-- Run in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run

create table if not exists amigos_messages (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  author text not null,
  text text not null,
  type text default 'text',
  created_at timestamp with time zone default now()
);

alter table amigos_messages enable row level security;

create policy "Public read" on amigos_messages for select using (true);
create policy "Public insert" on amigos_messages for insert with check (true);
create policy "Public delete" on amigos_messages for delete using (true);

-- Enable realtime
alter publication supabase_realtime add table amigos_messages;
