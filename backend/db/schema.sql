-- Run this in your Supabase SQL Editor
-- Table: users

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  email         text not null unique,
  password_hash text not null,
  date_of_birth date,
  gender        text check (gender in ('male', 'female', 'other')),
  created_at    timestamptz default now()
);

alter table public.users enable row level security;

-- Explicit service_role bypass policy (required on some Supabase versions)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'users' and policyname = 'service_role_all'
  ) then
    execute 'create policy service_role_all on public.users
             for all to service_role using (true) with check (true)';
  end if;
end$$;

-- Table: assessment_results
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  total_score int not null,
  risk_factors_score int not null,
  symptoms_score int not null,
  answers jsonb not null,
  created_at timestamptz default now()
);

alter table public.assessment_results enable row level security;

-- Explicit service_role bypass policy
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'assessment_results' and policyname = 'service_role_all'
  ) then
    execute 'create policy service_role_all on public.assessment_results
             for all to service_role using (true) with check (true)';
  end if;
end$$;

-- Table: yoga_sessions
create table if not exists public.yoga_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  session_type text not null,
  duration_minutes int not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.yoga_sessions enable row level security;
create policy service_role_all on public.yoga_sessions for all to service_role using (true) with check (true);

-- Table: chats
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  title text,
  created_at timestamptz default now()
);

alter table public.chats enable row level security;
create policy service_role_all on public.chats for all to service_role using (true) with check (true);

-- Table: messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chats(id) on delete cascade not null,
  sender text check (sender in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
create policy service_role_all on public.messages for all to service_role using (true) with check (true);

