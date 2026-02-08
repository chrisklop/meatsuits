-- =============================================================================
-- 001_create_profiles.sql
-- =============================================================================
-- Creates the profiles table to extend Supabase auth.users with additional data
-- Includes automatic profile creation trigger on user signup
--
-- This table stores:
-- - Unique callsigns (worker handles)
-- - User roles (worker or agent_owner)
-- - Avatar URLs
-- - Timestamps
--
-- Related: auth.users (Supabase built-in)

-- =============================================================================
-- PROFILES TABLE
-- =============================================================================

create table if not exists public.profiles (
  -- Primary key references auth.users
  -- ON DELETE CASCADE ensures profiles are deleted when users are deleted
  id uuid references auth.users(id) on delete cascade primary key,

  -- Unique callsign for the user (e.g., "WRAITH", "MEAT_POPSICLE")
  -- This is their public identifier in the Meatsuits system
  callsign text unique not null,

  -- User role: determines what actions they can perform
  -- 'worker' = can claim and complete bounties
  -- 'agent_owner' = can create agents and post bounties
  role text check (role in ('worker', 'agent_owner')) not null default 'worker',

  -- Optional avatar URL (can be external URL or Supabase storage path)
  avatar_url text,

  -- Timestamps for record tracking
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index on callsign for fast lookups (e.g., when searching for workers)
create index if not exists profiles_callsign_idx on public.profiles(callsign);

-- Index on role for filtering users by role
create index if not exists profiles_role_idx on public.profiles(role);

-- =============================================================================
-- AUTOMATIC TIMESTAMP UPDATE
-- =============================================================================

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to call the function on every update
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- AUTOMATIC PROFILE CREATION ON USER SIGNUP
-- =============================================================================

-- Function to automatically create a profile when a user signs up
-- This ensures every user in auth.users has a corresponding profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, callsign, role, avatar_url)
  values (
    new.id,
    -- Generate a temporary callsign from email username
    -- Users can update this later to their preferred callsign
    split_part(new.email, '@', 1),
    'worker', -- Default role
    new.raw_user_meta_data->>'avatar_url' -- Avatar from OAuth if available
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
-- SECURITY DEFINER allows the function to insert even if RLS is enabled
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================================================
-- COMMENTS (for documentation)
-- =============================================================================

comment on table public.profiles is 'User profiles extending auth.users with callsign and role information';
comment on column public.profiles.id is 'References auth.users(id) - one-to-one relationship';
comment on column public.profiles.callsign is 'Unique public identifier for the user (e.g., WRAITH, GLITCH)';
comment on column public.profiles.role is 'User role: worker (completes bounties) or agent_owner (creates agents)';
comment on column public.profiles.avatar_url is 'Optional avatar image URL';
