-- =============================================================================
-- 005_create_sectors.sql
-- =============================================================================
-- Creates the sectors lookup table and reference data
--
-- Sectors are geographic zones in the Meatsuits world (sector-1 through sector-9)
-- This table provides metadata about each sector for UI/filtering purposes
--
-- In production, this could be expanded with:
-- - Sector descriptions
-- - Danger levels
-- - Access requirements
-- - Geographic coordinates

-- =============================================================================
-- SECTORS TABLE
-- =============================================================================

create table if not exists public.sectors (
  -- Sector identifier (e.g., "sector-1", "sector-2")
  id text primary key check (id ~ '^sector-[1-9]$'),

  -- Human-readable sector name
  name text not null,

  -- Optional: sector description
  description text,

  -- Optional: danger/difficulty level (1-10)
  danger_level integer check (danger_level between 1 and 10),

  -- Optional: sector color for UI (hex color)
  color text,

  -- Created timestamp
  created_at timestamptz default now() not null
);

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert the 9 sectors with metadata
insert into public.sectors (id, name, description, danger_level, color) values
  (
    'sector-1',
    'Downtown Core',
    'High-density urban center with night markets and transit hubs. Moderate foot traffic, high surveillance.',
    4,
    '#3B82F6' -- blue
  ),
  (
    'sector-2',
    'Transit District',
    'Major transportation nexus connecting all sectors. Courier-friendly but heavily monitored.',
    3,
    '#10B981' -- green
  ),
  (
    'sector-3',
    'Industrial Zone',
    'Manufacturing and warehousing district. MedTech facilities and storage complexes. Low foot traffic.',
    5,
    '#F59E0B' -- amber
  ),
  (
    'sector-4',
    'Corporate Heights',
    'High-rise business district. Security is tight. Home to Tessier-Ashpool Tower and other megacorps.',
    7,
    '#8B5CF6' -- violet
  ),
  (
    'sector-5',
    'Entertainment Zone',
    'Bars, clubs, and nightlife. Social engineering hotspot. Moderate danger after dark.',
    5,
    '#EC4899' -- pink
  ),
  (
    'sector-6',
    'Residential Sprawl',
    'Mixed residential and commercial. Good for dead drops and sensor sweeps. Low security.',
    3,
    '#14B8A6' -- teal
  ),
  (
    'sector-7',
    'Tech Corridor',
    'Server farms, data centers, and tech infrastructure. Specialized skills required. High heat.',
    6,
    '#EF4444' -- red
  ),
  (
    'sector-8',
    'Utility Grid',
    'Power, water, and municipal infrastructure. Critical systems. Dangerous work environment.',
    8,
    '#F97316' -- orange
  ),
  (
    'sector-9',
    'Edge District',
    'Outer perimeter. Industrial lots, train platforms, and antenna installations. Low oversight.',
    6,
    '#6366F1' -- indigo
  )
on conflict (id) do nothing;

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index on danger_level for filtering
create index if not exists sectors_danger_level_idx on public.sectors(danger_level);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to get sector metadata
create or replace function public.get_sector_info(sector_id text)
returns table (
  id text,
  name text,
  description text,
  danger_level integer,
  color text
) as $$
begin
  return query
  select s.id, s.name, s.description, s.danger_level, s.color
  from public.sectors s
  where s.id = sector_id;
end;
$$ language plpgsql stable;

-- Function to list all sectors
create or replace function public.list_sectors()
returns table (
  id text,
  name text,
  description text,
  danger_level integer,
  color text
) as $$
begin
  return query
  select s.id, s.name, s.description, s.danger_level, s.color
  from public.sectors s
  order by s.id;
end;
$$ language plpgsql stable;

-- Function to get bounty count by sector
create or replace function public.get_bounty_count_by_sector()
returns table (
  sector_id text,
  sector_name text,
  total_bounties bigint,
  open_bounties bigint
) as $$
begin
  return query
  select
    s.id as sector_id,
    s.name as sector_name,
    count(b.id) as total_bounties,
    count(b.id) filter (where b.status = 'open') as open_bounties
  from public.sectors s
  left join public.bounties b on b.sector = s.id
  group by s.id, s.name
  order by s.id;
end;
$$ language plpgsql stable;

-- =============================================================================
-- COMMENTS (for documentation)
-- =============================================================================

comment on table public.sectors is 'Geographic sectors in the Meatsuits world (sector-1 through sector-9)';
comment on column public.sectors.id is 'Sector identifier (sector-1 to sector-9)';
comment on column public.sectors.name is 'Human-readable sector name';
comment on column public.sectors.description is 'Description of sector characteristics';
comment on column public.sectors.danger_level is 'Danger/difficulty rating from 1-10';
comment on column public.sectors.color is 'Hex color code for UI display';
