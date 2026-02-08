-- =============================================================================
-- 006_rls_policies.sql
-- =============================================================================
-- Enables Row Level Security (RLS) and creates security policies
--
-- RLS ensures that users can only access data they're authorized to see.
-- This is critical for multi-tenant applications where users should not
-- be able to access each other's data.
--
-- Policy Overview:
-- - Profiles: Users can read all profiles, update only their own
-- - Agents: Owners can CRUD their own agents, everyone can read
-- - Bounties: Everyone can read, agents can create for their own agents
-- - Claims: Workers can create/update their own claims, everyone can read
-- - Sectors: Public read-only reference data

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.bounties enable row level security;
alter table public.claims enable row level security;
alter table public.sectors enable row level security;

-- =============================================================================
-- PROFILES POLICIES
-- =============================================================================

-- Anyone can read all profiles (for discovering workers, agents, etc.)
create policy "Profiles are publicly readable"
  on public.profiles
  for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (should be handled by trigger, but allow manual creation)
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Users can delete their own profile
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);

-- =============================================================================
-- AGENTS POLICIES
-- =============================================================================

-- Anyone can read all agents (for browsing bounties and seeing agent info)
create policy "Agents are publicly readable"
  on public.agents
  for select
  using (true);

-- Agent owners can create agents for themselves
create policy "Users can create own agents"
  on public.agents
  for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'agent_owner'
    )
  );

-- Agent owners can update their own agents
create policy "Users can update own agents"
  on public.agents
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Agent owners can delete their own agents
create policy "Users can delete own agents"
  on public.agents
  for delete
  using (auth.uid() = owner_id);

-- =============================================================================
-- BOUNTIES POLICIES
-- =============================================================================

-- Anyone can read all bounties (public marketplace)
create policy "Bounties are publicly readable"
  on public.bounties
  for select
  using (true);

-- Agent owners can create bounties for their agents
create policy "Agent owners can create bounties"
  on public.bounties
  for insert
  with check (
    exists (
      select 1 from public.agents
      where id = agent_id
      and owner_id = auth.uid()
    )
  );

-- Agent owners can update bounties for their agents
-- Workers can update bounties they've claimed (for status updates)
create policy "Agent owners and workers can update bounties"
  on public.bounties
  for update
  using (
    -- Agent owner can update their bounties
    exists (
      select 1 from public.agents
      where id = agent_id
      and owner_id = auth.uid()
    )
    or
    -- Worker can update their claimed bounties
    (claimed_by = auth.uid())
  )
  with check (
    -- Same conditions for check
    exists (
      select 1 from public.agents
      where id = agent_id
      and owner_id = auth.uid()
    )
    or
    (claimed_by = auth.uid())
  );

-- Agent owners can delete their bounties
create policy "Agent owners can delete bounties"
  on public.bounties
  for delete
  using (
    exists (
      select 1 from public.agents
      where id = agent_id
      and owner_id = auth.uid()
    )
  );

-- =============================================================================
-- CLAIMS POLICIES
-- =============================================================================

-- Anyone can read all claims (for transparency in the marketplace)
create policy "Claims are publicly readable"
  on public.claims
  for select
  using (true);

-- Workers can create claims for themselves
create policy "Workers can create own claims"
  on public.claims
  for insert
  with check (
    auth.uid() = worker_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'worker'
    )
  );

-- Workers can update their own claims
-- Agent owners can update claims on their bounties
create policy "Workers and agents can update claims"
  on public.claims
  for update
  using (
    -- Worker can update their own claims
    auth.uid() = worker_id
    or
    -- Agent owner can update claims on their bounties
    exists (
      select 1 from public.bounties b
      join public.agents a on a.id = b.agent_id
      where b.id = bounty_id
      and a.owner_id = auth.uid()
    )
  )
  with check (
    -- Same conditions for check
    auth.uid() = worker_id
    or
    exists (
      select 1 from public.bounties b
      join public.agents a on a.id = b.agent_id
      where b.id = bounty_id
      and a.owner_id = auth.uid()
    )
  );

-- Workers can delete their own pending claims
create policy "Workers can delete own pending claims"
  on public.claims
  for delete
  using (
    auth.uid() = worker_id
    and status = 'pending'
  );

-- =============================================================================
-- SECTORS POLICIES
-- =============================================================================

-- Sectors are public reference data (read-only for everyone)
create policy "Sectors are publicly readable"
  on public.sectors
  for select
  using (true);

-- Only admins can modify sectors (no policy = implicit deny)
-- In production, you might want a separate admin role/policy

-- =============================================================================
-- HELPER FUNCTIONS FOR AUTHORIZATION
-- =============================================================================

-- Function to check if current user owns an agent
create or replace function public.user_owns_agent(agent_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.agents
    where id = agent_uuid
    and owner_id = auth.uid()
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if current user is a worker
create or replace function public.user_is_worker()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'worker'
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if current user is an agent owner
create or replace function public.user_is_agent_owner()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'agent_owner'
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if current user owns a bounty (via their agent)
create or replace function public.user_owns_bounty(bounty_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.bounties b
    join public.agents a on a.id = b.agent_id
    where b.id = bounty_uuid
    and a.owner_id = auth.uid()
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if current user has claimed a bounty
create or replace function public.user_claimed_bounty(bounty_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.bounties
    where id = bounty_uuid
    and claimed_by = auth.uid()
  );
end;
$$ language plpgsql security definer stable;

-- =============================================================================
-- COMMENTS (for documentation)
-- =============================================================================

comment on policy "Profiles are publicly readable" on public.profiles is
  'All profiles are visible for worker/agent discovery';

comment on policy "Users can update own profile" on public.profiles is
  'Users can only update their own profile data';

comment on policy "Agents are publicly readable" on public.agents is
  'All agents are visible in the marketplace';

comment on policy "Users can create own agents" on public.agents is
  'Only agent_owner role users can create agents, and only for themselves';

comment on policy "Bounties are publicly readable" on public.bounties is
  'All bounties are visible in the public marketplace';

comment on policy "Agent owners can create bounties" on public.bounties is
  'Users can create bounties for agents they own';

comment on policy "Claims are publicly readable" on public.claims is
  'All claims are visible for marketplace transparency';

comment on policy "Workers can create own claims" on public.claims is
  'Only worker role users can create claims, and only for themselves';
