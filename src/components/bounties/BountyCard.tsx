"use client";

import Link from "next/link";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Bounty } from "@/lib/types";
import { formatCredits, truncate, timeRemaining } from "@/lib/utils";
import { getAgentById } from "@/lib/mock-data";

interface BountyCardProps {
  bounty: Bounty;
  onClaim?: (bountyId: string) => void;
}

export default function BountyCard({ bounty, onClaim }: BountyCardProps) {
  const agent = getAgentById(bounty.agent_id);

  return (
    <NeonCard glowColor="cyan" className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <Link href={`/bounties/${bounty.id}`} className="flex-1 pr-2">
          <h3 className="text-lg font-bold text-neon-cyan hover:text-neon-purple transition-colors cursor-pointer">
            {truncate(bounty.title, 60)}
          </h3>
        </Link>
        <StatusBadge status={bounty.status} />
      </div>

      <p className="text-text-muted text-sm mb-4 flex-1">
        {truncate(bounty.description, 120)}
      </p>

      <div className="flex items-center justify-between text-xs text-text-muted mb-3 gap-2">
        <span className="uppercase font-mono">{bounty.sector}</span>
        <span className="uppercase font-mono bg-bg-elevated px-2 py-1 rounded border border-neon-yellow/30 text-neon-yellow">
          {bounty.difficulty}
        </span>
        <span className="font-mono">{timeRemaining(bounty.expires_at)}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neon-cyan/20 mb-3">
        <span className="text-neon-green font-bold text-xl neon-glow">
          {formatCredits(bounty.reward_amount)}
        </span>
        <span className="text-text-muted text-xs font-mono">
          {agent?.name || "Unknown"}
        </span>
      </div>

      {bounty.status === "open" && onClaim && (
        <NeonButton
          variant="primary"
          size="md"
          onClick={() => onClaim(bounty.id)}
          className="w-full"
        >
          CLAIM BOUNTY
        </NeonButton>
      )}

      {bounty.status === "claimed" && (
        <div className="text-center text-neon-yellow text-sm font-mono uppercase">
          Claimed
        </div>
      )}

      {bounty.status === "in_progress" && (
        <div className="text-center text-neon-purple text-sm font-mono uppercase">
          In Progress
        </div>
      )}

      {bounty.status === "verification" && (
        <div className="text-center text-neon-cyan text-sm font-mono uppercase">
          Under Verification
        </div>
      )}

      {bounty.status === "completed" && (
        <div className="text-center text-neon-green text-sm font-mono uppercase">
          Completed
        </div>
      )}

      {bounty.status === "expired" && (
        <div className="text-center text-neon-red text-sm font-mono uppercase">
          Expired
        </div>
      )}
    </NeonCard>
  );
}
