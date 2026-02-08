-- =============================================================================
-- 004_create_claims.sql
-- =============================================================================
-- Creates the claims table for tracking bounty claims by workers
--
-- Claims track the relationship between workers and bounties, including:
-- - Claim status (pending, accepted, rejected, completed)
-- - Timestamps for claim and completion
--
-- This is separate from bounties to maintain history even after bounty
-- completion, and to support potential future features like multiple claims
-- per bounty or claim reviews.
--
-- Related: public.bounties (bounty_id), public.profiles (worker_id)

-- =============================================================================
-- CLAIMS TABLE
-- =============================================================================

create table if not exists public.claims (
  -- Primary key: UUID
  id uuid default gen_random_uuid() primary key,

  -- Bounty reference
  -- ON DELETE CASCADE: if bounty is deleted, claims are deleted
  bounty_id uuid references public.bounties(id) on delete cascade not null,

  -- Worker reference (references profiles table)
  -- ON DELETE CASCADE: if worker profile is deleted, their claims are deleted
  worker_id uuid references public.profiles(id) on delete cascade not null,

  -- Claim status
  -- 'pending' = worker claimed, awaiting agent approval
  -- 'accepted' = agent approved the claim, worker can proceed
  -- 'rejected' = agent rejected the claim
  -- 'completed' = work completed and verified
  status text check (status in ('pending', 'accepted', 'rejected', 'completed'))
    not null default 'pending',

  -- Timestamps
  claimed_at timestamptz default now() not null,
  completed_at timestamptz,

  -- Optional: proof of completion (URLs to images, documents, etc.)
  proof_urls jsonb default '[]'::jsonb,

  -- Optional: agent notes on the claim
  agent_notes text,

  -- Optional: worker notes/submission message
  worker_notes text
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index on bounty_id for finding all claims for a bounty
create index if not exists claims_bounty_id_idx on public.claims(bounty_id);

-- Index on worker_id for finding all claims by a worker
create index if not exists claims_worker_id_idx on public.claims(worker_id);

-- Index on status for filtering
create index if not exists claims_status_idx on public.claims(status);

-- Composite index for worker's claims by status
create index if not exists claims_worker_status_idx on public.claims(worker_id, status, claimed_at desc);

-- Composite index for bounty's claims by status
create index if not exists claims_bounty_status_idx on public.claims(bounty_id, status, claimed_at desc);

-- Unique constraint: one active claim per bounty per worker
-- This prevents duplicate claims but allows resubmission after rejection
create unique index if not exists claims_bounty_worker_active_idx
  on public.claims(bounty_id, worker_id)
  where status in ('pending', 'accepted');

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to update bounty status when claim is created/updated
create or replace function public.sync_bounty_claim_status()
returns trigger as $$
begin
  -- When claim is accepted, update bounty to claimed and set claimed_by
  if new.status = 'accepted' and (old is null or old.status != 'accepted') then
    update public.bounties
    set
      status = 'claimed',
      claimed_by = new.worker_id
    where id = new.bounty_id
      and status = 'open';
  end if;

  -- When claim is completed, set completed_at timestamp
  if new.status = 'completed' and (old is null or old.status != 'completed') then
    new.completed_at = now();
  end if;

  return new;
end;
$$ language plpgsql;

create trigger claims_sync_bounty
  before insert or update on public.claims
  for each row
  execute function public.sync_bounty_claim_status();

-- Trigger to validate claim creation
create or replace function public.validate_claim_creation()
returns trigger as $$
declare
  bounty_status text;
begin
  -- Check if bounty is open
  select status into bounty_status
  from public.bounties
  where id = new.bounty_id;

  if bounty_status is null then
    raise exception 'Bounty not found: %', new.bounty_id;
  end if;

  if bounty_status != 'open' then
    raise exception 'Cannot claim bounty with status "%"', bounty_status;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger claims_validate_creation
  before insert on public.claims
  for each row
  execute function public.validate_claim_creation();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to accept a claim
-- Updates claim status and bounty status atomically
create or replace function public.accept_claim(claim_uuid uuid)
returns void as $$
declare
  claim_record record;
begin
  -- Get claim details
  select * into claim_record
  from public.claims
  where id = claim_uuid
    and status = 'pending';

  if not found then
    raise exception 'Claim not found or not pending: %', claim_uuid;
  end if;

  -- Reject all other pending claims for this bounty
  update public.claims
  set status = 'rejected',
      agent_notes = 'Another worker was selected'
  where bounty_id = claim_record.bounty_id
    and id != claim_uuid
    and status = 'pending';

  -- Accept this claim
  update public.claims
  set status = 'accepted'
  where id = claim_uuid;
end;
$$ language plpgsql;

-- Function to reject a claim
create or replace function public.reject_claim(claim_uuid uuid, notes text default null)
returns void as $$
begin
  update public.claims
  set
    status = 'rejected',
    agent_notes = coalesce(notes, agent_notes)
  where id = claim_uuid
    and status = 'pending';

  if not found then
    raise exception 'Claim not found or not pending: %', claim_uuid;
  end if;
end;
$$ language plpgsql;

-- Function to complete a claim
-- Updates claim and bounty to completed, processes payment
create or replace function public.complete_claim(claim_uuid uuid)
returns void as $$
declare
  claim_record record;
  bounty_record record;
begin
  -- Get claim and bounty details
  select c.*, b.reward_amount, b.agent_id
  into claim_record
  from public.claims c
  join public.bounties b on b.id = c.bounty_id
  where c.id = claim_uuid
    and c.status = 'accepted';

  if not found then
    raise exception 'Claim not found or not in accepted status: %', claim_uuid;
  end if;

  -- Update claim to completed
  update public.claims
  set status = 'completed'
  where id = claim_uuid;

  -- Update bounty to completed
  update public.bounties
  set status = 'completed'
  where id = claim_record.bounty_id;

  -- Note: Payment/wallet updates would be handled here in production
  -- For now, this is a placeholder for future payment integration
end;
$$ language plpgsql;

-- =============================================================================
-- COMMENTS (for documentation)
-- =============================================================================

comment on table public.claims is 'Tracks worker claims on bounties';
comment on column public.claims.bounty_id is 'The bounty being claimed';
comment on column public.claims.worker_id is 'The worker making the claim';
comment on column public.claims.status is 'Claim status: pending, accepted, rejected, or completed';
comment on column public.claims.claimed_at is 'When the claim was made';
comment on column public.claims.completed_at is 'When the work was completed (auto-set)';
comment on column public.claims.proof_urls is 'JSONB array of proof URLs (photos, documents, etc.)';
comment on column public.claims.agent_notes is 'Notes from the agent about this claim';
comment on column public.claims.worker_notes is 'Notes/message from the worker';
