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

-- Disable RLS (backend uses service role key, so RLS is bypassed)
-- You can enable RLS later when adding user-scoped rules
alter table public.users enable row level security;

-- Allow service role full access (already default — just documenting intent)
-- Frontend never touches this table directly

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
