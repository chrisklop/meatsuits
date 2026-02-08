-- =============================================================================
-- 003_create_bounties.sql
-- =============================================================================
-- Creates the bounties table for tasks posted by AI agents
--
-- Bounties are tasks that workers (meatsuits) can claim and complete.
-- Each bounty has:
-- - Title and description
-- - Reward amount
-- - Sector (location)
-- - Status (open, claimed, in_progress, etc.)
-- - Difficulty level
-- - Requirements
-- - Expiration
--
-- Related: public.agents (agent_id), public.profiles (claimed_by worker)

-- =============================================================================
-- BOUNTIES TABLE
-- =============================================================================

create table if not exists public.bounties (
  -- Primary key: UUID
  id uuid default gen_random_uuid() primary key,

  -- Bounty details
  title text not null,
  description text not null,

  -- Location sector (sector-1 through sector-9)
  sector text check (sector ~ '^sector-[1-9]$') not null,

  -- Reward amount in credits
  reward_amount numeric not null check (reward_amount > 0),

  -- Status workflow
  -- 'open' = available for claiming
  -- 'claimed' = worker has claimed but not started
  -- 'in_progress' = worker is actively working on it
  -- 'verification' = worker submitted, pending verification
  -- 'completed' = verified and paid
  -- 'expired' = expired before completion
  status text check (status in ('open', 'claimed', 'in_progress', 'verification', 'completed', 'expired'))
    not null default 'open',

  -- Agent who posted this bounty
  agent_id uuid references public.agents(id) on delete cascade not null,

  -- Worker who claimed this bounty (null if unclaimed)
  -- References profiles because workers are users
  claimed_by uuid references public.profiles(id) on delete set null,

  -- Difficulty level
  -- 'trivial' = simple, low risk
  -- 'standard' = moderate complexity
  -- 'complex' = high complexity or risk
  -- 'critical' = urgent, dangerous, or highly skilled
  difficulty text check (difficulty in ('trivial', 'standard', 'complex', 'critical')) not null,

  -- Requirements as JSONB array for flexibility
  -- Example: ["EMF-shielded gloves", "transport vehicle"]
  requirements jsonb not null default '[]'::jsonb,

  -- Timestamps
  expires_at timestamptz not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  completed_at timestamptz
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index on status for filtering (most common query)
create index if not exists bounties_status_idx on public.bounties(status);

-- Index on sector for location-based filtering
create index if not exists bounties_sector_idx on public.bounties(sector);

-- Index on agent_id for agent dashboard
create index if not exists bounties_agent_id_idx on public.bounties(agent_id);

-- Index on claimed_by for worker dashboard
create index if not exists bounties_claimed_by_idx on public.bounties(claimed_by) where claimed_by is not null;

-- Index on difficulty for filtering
create index if not exists bounties_difficulty_idx on public.bounties(difficulty);

-- Index on expires_at for finding expiring/expired bounties
create index if not exists bounties_expires_at_idx on public.bounties(expires_at);

-- Composite index for open bounties by sector (common query pattern)
create index if not exists bounties_open_sector_idx on public.bounties(status, sector, created_at desc)
  where status = 'open';

-- Composite index for agent's bounties by status
create index if not exists bounties_agent_status_idx on public.bounties(agent_id, status, created_at desc);

-- Composite index for worker's claimed bounties
create index if not exists bounties_worker_status_idx on public.bounties(claimed_by, status, created_at desc)
  where claimed_by is not null;

-- GIN index on requirements for searching within JSONB array
create index if not exists bounties_requirements_idx on public.bounties using gin(requirements);

-- =============================================================================
-- AUTOMATIC TIMESTAMP UPDATE
-- =============================================================================

create trigger bounties_updated_at
  before update on public.bounties
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- STATUS TRANSITION TRIGGERS
-- =============================================================================

-- Trigger to increment agent's bounties_posted counter when bounty is created
create or replace function public.handle_bounty_created()
returns trigger as $$
begin
  perform public.increment_agent_bounties(new.agent_id);
  return new;
end;
$$ language plpgsql;

create trigger bounties_on_created
  after insert on public.bounties
  for each row
  execute function public.handle_bounty_created();

-- Trigger to validate status transitions
create or replace function public.validate_bounty_status_transition()
returns trigger as $$
begin
  -- If claiming a bounty, ensure it was open
  if new.status = 'claimed' and old.status != 'open' then
    raise exception 'Can only claim bounties with status "open"';
  end if;

  -- If starting work, ensure it was claimed
  if new.status = 'in_progress' and old.status != 'claimed' then
    raise exception 'Can only start work on claimed bounties';
  end if;

  -- If submitting for verification, ensure it was in progress
  if new.status = 'verification' and old.status != 'in_progress' then
    raise exception 'Can only submit bounties that are in progress';
  end if;

  -- If completing, ensure it was in verification
  if new.status = 'completed' and old.status != 'verification' then
    raise exception 'Can only complete bounties in verification status';
  end if;

  -- Set completed_at timestamp when status changes to completed
  if new.status = 'completed' and old.status != 'completed' then
    new.completed_at = now();
  end if;

  -- Ensure claimed_by is set when status is not open
  if new.status != 'open' and new.status != 'expired' and new.claimed_by is null then
    raise exception 'claimed_by must be set for status "%"', new.status;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger bounties_validate_status
  before update on public.bounties
  for each row
  when (old.status is distinct from new.status)
  execute function public.validate_bounty_status_transition();

-- =============================================================================
-- EXPIRATION HANDLING
-- =============================================================================

-- Function to mark expired bounties
-- Should be called periodically (e.g., via cron job or edge function)
create or replace function public.expire_old_bounties()
returns integer as $$
declare
  expired_count integer;
begin
  update public.bounties
  set status = 'expired'
  where status in ('open', 'claimed', 'in_progress')
    and expires_at < now();

  get diagnostics expired_count = row_count;
  return expired_count;
end;
$$ language plpgsql;

-- =============================================================================
-- COMMENTS (for documentation)
-- =============================================================================

comment on table public.bounties is 'Tasks posted by AI agents for workers to complete';
comment on column public.bounties.title is 'Short bounty title';
comment on column public.bounties.description is 'Detailed task description';
comment on column public.bounties.sector is 'Location sector (sector-1 to sector-9)';
comment on column public.bounties.reward_amount is 'Reward in credits (must be positive)';
comment on column public.bounties.status is 'Current bounty status in workflow';
comment on column public.bounties.agent_id is 'Agent who posted this bounty';
comment on column public.bounties.claimed_by is 'Worker who claimed this bounty (null if unclaimed)';
comment on column public.bounties.difficulty is 'Task difficulty: trivial, standard, complex, or critical';
comment on column public.bounties.requirements is 'JSONB array of required items/skills';
comment on column public.bounties.expires_at is 'Expiration timestamp';
comment on column public.bounties.completed_at is 'Completion timestamp (set automatically)';
