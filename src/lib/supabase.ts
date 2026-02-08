/**
 * Supabase Client Factory
 *
 * This module provides a factory for creating Supabase clients.
 * It automatically detects whether to use real Supabase or mock data.
 *
 * MOCK MODE (default):
 * - When NEXT_PUBLIC_SUPABASE_URL is not set
 * - Returns mock data from @/lib/mock-data
 * - Create operations are disabled
 *
 * REAL MODE:
 * - When NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * - Connects to real Supabase instance
 * - Full CRUD operations enabled
 *
 * HOW TO CONNECT REAL SUPABASE:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Run migrations in /supabase/migrations/ folder
 * 3. Add environment variables to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 * 4. Restart your dev server
 */

import { createClient } from '@supabase/supabase-js';
import {
  bounties,
  agents,
  workers,
  claims,
  getBountyById,
  getBountiesByStatus,
  getAgentById,
  getWorkersByStatus,
  type Bounty,
  type Agent,
  type Worker,
  type Claim,
} from '@/lib/mock-data';
import type { BountyStatus, WorkerStatus } from '@/lib/types';

// Check if we're in mock mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isMockMode = !supabaseUrl || !supabaseAnonKey;

/**
 * Get Supabase client instance
 *
 * @returns Supabase client or null if in mock mode
 */
export function getSupabaseClient() {
  if (isMockMode) {
    console.warn('Supabase not configured - running in mock mode');
    return null;
  }

  return createClient(supabaseUrl!, supabaseAnonKey!);
}

/**
 * Mock client interface that returns data from mock-data.ts
 * This makes it easy to swap to real Supabase later
 */
export const mockClient = {
  /**
   * Check if running in mock mode
   */
  isMockMode: () => isMockMode,

  /**
   * Get all bounties
   */
  bounties: {
    list: async (filters?: { status?: BountyStatus; limit?: number; offset?: number }) => {
      let results = filters?.status ? getBountiesByStatus(filters.status) : [...bounties];

      const total = results.length;
      const offset = filters?.offset || 0;

      results = results.slice(offset);
      if (filters?.limit) {
        results = results.slice(0, filters.limit);
      }

      return { data: results, error: null, total };
    },

    get: async (id: string) => {
      const bounty = getBountyById(id);
      return bounty
        ? { data: bounty, error: null }
        : { data: null, error: new Error(`Bounty not found: ${id}`) };
    },

    create: async (_bounty: Partial<Bounty>) => {
      return {
        data: null,
        error: new Error('Create operations disabled in mock mode'),
      };
    },

    update: async (_id: string, _updates: Partial<Bounty>) => {
      return {
        data: null,
        error: new Error('Update operations disabled in mock mode'),
      };
    },

    delete: async (_id: string) => {
      return {
        data: null,
        error: new Error('Delete operations disabled in mock mode'),
      };
    },
  },

  /**
   * Get all agents
   */
  agents: {
    list: async () => {
      return { data: [...agents], error: null };
    },

    get: async (id: string) => {
      const agent = getAgentById(id);
      return agent
        ? { data: agent, error: null }
        : { data: null, error: new Error(`Agent not found: ${id}`) };
    },

    create: async (_agent: Partial<Agent>) => {
      return {
        data: null,
        error: new Error('Create operations disabled in mock mode'),
      };
    },

    update: async (_id: string, _updates: Partial<Agent>) => {
      return {
        data: null,
        error: new Error('Update operations disabled in mock mode'),
      };
    },

    delete: async (_id: string) => {
      return {
        data: null,
        error: new Error('Delete operations disabled in mock mode'),
      };
    },
  },

  /**
   * Get all workers
   */
  workers: {
    list: async (filters?: { status?: WorkerStatus }) => {
      const results = filters?.status ? getWorkersByStatus(filters.status) : [...workers];
      return { data: results, error: null };
    },

    available: async (sector?: string) => {
      let results = getWorkersByStatus('available');
      if (sector) {
        results = results.filter((w) => w.sector === sector);
      }
      return { data: results, error: null };
    },

    get: async (id: string) => {
      const worker = workers.find((w) => w.id === id);
      return worker
        ? { data: worker, error: null }
        : { data: null, error: new Error(`Worker not found: ${id}`) };
    },

    create: async (_worker: Partial<Worker>) => {
      return {
        data: null,
        error: new Error('Create operations disabled in mock mode'),
      };
    },

    update: async (_id: string, _updates: Partial<Worker>) => {
      return {
        data: null,
        error: new Error('Update operations disabled in mock mode'),
      };
    },

    delete: async (_id: string) => {
      return {
        data: null,
        error: new Error('Delete operations disabled in mock mode'),
      };
    },
  },

  /**
   * Get all claims
   */
  claims: {
    list: async () => {
      return { data: [...claims], error: null };
    },

    byBounty: async (bountyId: string) => {
      const results = claims.filter((c) => c.bounty_id === bountyId);
      return { data: results, error: null };
    },

    byWorker: async (workerId: string) => {
      const results = claims.filter((c) => c.worker_id === workerId);
      return { data: results, error: null };
    },

    create: async (_claim: Partial<Claim>) => {
      return {
        data: null,
        error: new Error('Create operations disabled in mock mode'),
      };
    },

    update: async (_id: string, _updates: Partial<Claim>) => {
      return {
        data: null,
        error: new Error('Update operations disabled in mock mode'),
      };
    },

    delete: async (_id: string) => {
      return {
        data: null,
        error: new Error('Delete operations disabled in mock mode'),
      };
    },
  },
};

/**
 * Default export - use mock client for now
 * When Supabase is configured, this can be swapped to use real client
 */
export default mockClient;
