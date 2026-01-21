-- Create Profiles Table
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  role text check (role in ('student', 'parent')),
  full_name text,
  grade_level text, -- Specific for students
  children_ids uuid[], -- Specific for parents (placeholder)
  avatar_url text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

-- Optional: Storage for Avatars
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- create policy "Avatar images are publicly accessible" on storage.objects for select using ( bucket_id = 'avatars' );
-- create policy "Anyone can upload an avatar" on storage.objects for insert with check ( bucket_id = 'avatars' );
