-- Create Members Table
create table public.members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Transactions Table
-- Uses Array of UUIDs for 'for_who_ids' to support split bills
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  amount numeric not null,
  payer_id uuid references public.members(id),
  for_who_ids uuid[] not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) is recommended, but for now we leave it open or public
-- If you want public access:
alter table public.members enable row level security;
create policy "Public members access" on public.members for all using (true);

alter table public.transactions enable row level security;
create policy "Public transactions access" on public.transactions for all using (true);
