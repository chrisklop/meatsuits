-- =============================================================================
-- 002_create_agents.sql
-- =============================================================================
-- Creates the agents table for AI agents owned by users
--
-- Agents are AI entities that post bounties for meatsuits to complete.
-- Each agent has:
-- - A specific role (triage, geofencer, oracle, clerk)
-- - A wallet balance (in-game currency)
-- - Reputation score
-- - Activity tracking (bounties posted)
--
-- Related: public.profiles (owner_id)

-- =============================================================================
-- AGENTS TABLE
-- =============================================================================

create table if not exists public.agents (
  -- Primary key: UUID
  id uuid default gen_random_uuid() primary key,

  -- Owner reference
  -- ON DELETE CASCADE: if profile is deleted, their agents are deleted too
  owner_id uuid references public.profiles(id) on delete cascade not null,

  -- Agent name (e.g., "THE ORACLE", "CIPHER-9", "GHOST_PROTOCOL")
  name text not null,

  -- Agent role determines their specialty/behavior
  -- 'triage' = task prioritization and assignment
  -- 'geofencer' = location-based tasks
  -- 'oracle' = information gathering and analysis
  -- 'clerk' = administrative and documentation tasks
  role text check (role in ('triage', 'geofencer', 'oracle', 'clerk')) not null,

  -- Avatar emoji or image identifier (e.g., "🔮", "🔐", "🌐")
  avatar text not null,

  -- Wallet balance in credits (numeric for precision with currency)
  -- Default 0, cannot go negative
  wallet_balance numeric default 0 not null check (wallet_balance >= 0),

  -- Number of bounties this agent has posted (counter)
  bounties_posted integer default 0 not null check (bounties_posted >= 0),

  -- Reputation score (0-100)
  -- Higher reputation = more trusted agent
  -- Affects worker interest in accepting bounties
  reputation integer default 50 not null check (reputation >= 0 and reputation <= 100),

  -- Timestamp
  created_at timestamptz default now() not null
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index on owner_id for fast lookups of all agents owned by a user
create index if not exists agents_owner_id_idx on public.agents(owner_id);

-- Index on role for filtering agents by specialty
create index if not exists agents_role_idx on public.agents(role);

-- Index on reputation for sorting by trust level
create index if not exists agents_reputation_idx on public.agents(reputation desc);

-- Composite index for owner's agents sorted by reputation
create index if not exists agents_owner_reputation_idx on public.agents(owner_id, reputation desc);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to increment bounties_posted counter
-- Called when a new bounty is created for this agent
create or replace function public.increment_agent_bounties(agent_uuid uuid)
returns void as $$
begin
  update public.agents
  set bounties_posted = bounties_posted + 1
  where id = agent_uuid;
end;
$$ language plpgsql;

-- Function to update agent wallet balance
-- Validates that balance won't go negative
create or replace function public.update_agent_wallet(agent_uuid uuid, amount numeric)
returns boolean as $$
declare
  current_balance numeric;
  new_balance numeric;
begin
  -- Get current balance
  select wallet_balance into current_balance
  from public.agents
  where id = agent_uuid;

  if current_balance is null then
    raise exception 'Agent not found: %', agent_uuid;
  end if;

  new_balance := current_balance + amount;

  -- Check if balance would go negative
  if new_balance < 0 then
    return false;
  end if;

  -- Update balance
  update public.agents
  set wallet_balance = new_balance
  where id = agent_uuid;

  return true;
end;
$$ language plpgsql;

-- Function to update agent reputation
-- Clamps value between 0 and 100
create or replace function public.update_agent_reputation(agent_uuid uuid, new_reputation integer)
returns void as $$
begin
  update public.agents
  set reputation = greatest(0, least(100, new_reputation))
  where id = agent_uuid;
end;
$$ language plpgsql;

-- =============================================================================
-- COMMENTS (for documentation)
-- =============================================================================

comment on table public.agents is 'AI agents that post bounties for workers to complete';
comment on column public.agents.owner_id is 'Profile ID of the user who owns this agent';
comment on column public.agents.name is 'Agent display name (e.g., THE ORACLE, CIPHER-9)';
comment on column public.agents.role is 'Agent specialty: triage, geofencer, oracle, or clerk';
comment on column public.agents.avatar is 'Avatar emoji or image identifier';
comment on column public.agents.wallet_balance is 'Agent wallet balance in credits (cannot go negative)';
comment on column public.agents.bounties_posted is 'Total number of bounties posted by this agent';
comment on column public.agents.reputation is 'Trust score from 0-100 (higher = more trusted)';
