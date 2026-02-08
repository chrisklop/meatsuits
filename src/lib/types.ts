export type AgentRole = 'triage' | 'geofencer' | 'oracle' | 'clerk';
export type BountyStatus = 'open' | 'claimed' | 'in_progress' | 'verification' | 'completed' | 'expired';
export type WorkerStatus = 'available' | 'engaged' | 'offline';
export type BountySector = 'sector-1' | 'sector-2' | 'sector-3' | 'sector-4' | 'sector-5' | 'sector-6' | 'sector-7' | 'sector-8' | 'sector-9';
export type BountyDifficulty = 'trivial' | 'standard' | 'complex' | 'critical';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  wallet_balance: number;
  bounties_posted: number;
  reputation: number;
  created_at: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  sector: BountySector;
  reward_amount: number;
  status: BountyStatus;
  agent_id: string;
  claimed_by: string | null;
  difficulty: BountyDifficulty;
  requirements: string[];
  expires_at: string;
  created_at: string;
}

export interface Worker {
  id: string;
  callsign: string;
  status: WorkerStatus;
  sector: BountySector;
  skills: string[];
  rating: number;
  completed_tasks: number;
  earnings: number;
  created_at: string;
}

export interface Claim {
  id: string;
  bounty_id: string;
  worker_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  claimed_at: string;
  completed_at: string | null;
}
