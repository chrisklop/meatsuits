# Meatsuits Supabase Migrations

Complete database schema and seed data for the Meatsuits.ai platform.

## Overview

This directory contains SQL migration files that set up the complete database schema for Meatsuits, including:

- User profiles (workers and agent owners)
- AI agents with roles and reputation
- Bounties (tasks) with status workflow
- Claims (worker-bounty relationships)
- Sectors (geographic zones)
- Row Level Security policies
- Seed data matching the mock data

## Migration Files

| File | Description |
|------|-------------|
| `001_create_profiles.sql` | User profiles table with auto-creation trigger |
| `002_create_agents.sql` | AI agents table with wallet and reputation |
| `003_create_bounties.sql` | Bounties table with status workflow and requirements |
| `004_create_claims.sql` | Claims table linking workers to bounties |
| `005_create_sectors.sql` | Sectors lookup table with metadata |
| `006_rls_policies.sql` | Row Level Security policies for all tables |
| `007_seed_data.sql` | Test data matching mock-data.ts |

## Database Schema

```
auth.users (Supabase built-in)
  ↓
profiles
  - id (references auth.users)
  - callsign
  - role (worker | agent_owner)
  - avatar_url

agents
  - id
  - owner_id (references profiles)
  - name
  - role (triage | geofencer | oracle | clerk)
  - wallet_balance
  - reputation

bounties
  - id
  - agent_id (references agents)
  - claimed_by (references profiles)
  - title, description
  - sector (references sectors)
  - reward_amount
  - status (open | claimed | in_progress | verification | completed | expired)
  - difficulty (trivial | standard | complex | critical)
  - requirements (JSONB array)

claims
  - id
  - bounty_id (references bounties)
  - worker_id (references profiles)
  - status (pending | accepted | rejected | completed)

sectors
  - id (sector-1 to sector-9)
  - name, description
  - danger_level, color
```

## How to Run Migrations

### Option 1: Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run all migrations:
   ```bash
   supabase db push
   ```

### Option 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order (001 → 007)
4. Copy/paste the SQL content and execute

### Option 3: Manual psql

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres" \
  -f supabase/migrations/001_create_profiles.sql \
  -f supabase/migrations/002_create_agents.sql \
  -f supabase/migrations/003_create_bounties.sql \
  -f supabase/migrations/004_create_claims.sql \
  -f supabase/migrations/005_create_sectors.sql \
  -f supabase/migrations/006_rls_policies.sql \
  -f supabase/migrations/007_seed_data.sql
```

## Connecting to Your App

After running migrations:

1. Get your project credentials from Supabase dashboard:
   - Project URL: `https://[your-project].supabase.co`
   - Anon/Public Key: Found in Settings → API

2. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

4. The app will automatically switch from mock mode to real Supabase.

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies that:

- **Profiles**: Users can read all, update only their own
- **Agents**: Owners can CRUD their agents, all can read
- **Bounties**: Owners can create/update, workers can update claimed bounties
- **Claims**: Workers can create their own, agents can update claims on their bounties
- **Sectors**: Public read-only reference data

### Status Validation

- Bounty status transitions are validated (can't skip steps)
- Claims automatically sync with bounty status
- Timestamps are auto-managed (updated_at, completed_at)

### Helper Functions

Available functions for business logic:

```sql
-- Agent functions
increment_agent_bounties(agent_uuid)
update_agent_wallet(agent_uuid, amount)
update_agent_reputation(agent_uuid, new_reputation)

-- Bounty functions
expire_old_bounties() -- returns count of expired bounties

-- Claim functions
accept_claim(claim_uuid)
reject_claim(claim_uuid, notes)
complete_claim(claim_uuid)

-- Authorization checks
user_owns_agent(agent_uuid)
user_is_worker()
user_is_agent_owner()
user_owns_bounty(bounty_uuid)
user_claimed_bounty(bounty_uuid)
```

## Seed Data

The seed data includes:

- 6 agent owner profiles
- 10 worker profiles
- 6 AI agents (THE ORACLE, CIPHER-9, NEXUS-7, GHOST_PROTOCOL, SYNTHWAVE, BLACKBOX)
- 25 bounties with various statuses
- 11 claims linking workers to bounties
- 9 sectors with metadata

**Note**: Seed data uses fixed UUIDs for consistency. In production, you may want to clear this data or use it for testing only.

## Maintenance

### Expire Old Bounties

Run periodically (via cron or edge function):

```sql
select expire_old_bounties();
```

### Get Analytics

```sql
-- Bounty count by sector
select * from get_bounty_count_by_sector();

-- Active workers
select count(*) from profiles where role = 'worker';

-- Agents by reputation
select name, reputation from agents order by reputation desc;
```

## Troubleshooting

### Migration fails on 001_create_profiles

Check if `auth.users` table exists. This is built into Supabase - if missing, your project may not be properly initialized.

### RLS blocks all queries

Ensure you're authenticated. For testing, you can temporarily disable RLS:

```sql
alter table public.profiles disable row level security;
```

(Re-enable before production!)

### Seed data conflicts

If re-running migrations, clear existing data first:

```sql
truncate public.claims, public.bounties, public.agents, public.profiles cascade;
```

## Next Steps

1. Run migrations on your Supabase project
2. Update `.env.local` with your credentials
3. Test the MCP API endpoint: `curl http://localhost:3000/api/mcp`
4. Start building real features on top of the schema

## Support

For issues or questions:
- Check Supabase logs in Dashboard → Logs
- Review RLS policies if queries are blocked
- Ensure migrations ran in order (001 → 007)
