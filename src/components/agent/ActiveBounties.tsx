"use client";

import Link from "next/link";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCredits, timeRemaining } from "@/lib/utils";
import { getWorkerById } from "@/lib/mock-data";
import type { Bounty } from "@/lib/types";

interface ActiveBountiesProps {
  bounties: Bounty[];
}

export default function ActiveBounties({ bounties }: ActiveBountiesProps) {
  if (bounties.length === 0) {
    return (
      <NeonCard className="text-center py-8">
        <p className="text-text-muted font-mono">No active bounties found.</p>
      </NeonCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bounties.map((bounty) => {
        const claimedWorker = bounty.claimed_by
          ? getWorkerById(bounty.claimed_by)
          : null;
        const remaining = timeRemaining(bounty.expires_at);

        return (
          <NeonCard key={bounty.id} glowColor="cyan">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-mono font-bold text-text-primary leading-tight flex-1 mr-3">
                {bounty.title}
              </h3>
              <StatusBadge status={bounty.status} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">REWARD</span>
                <span className="text-neon-green">{formatCredits(bounty.reward_amount)}</span>
              </div>

              {claimedWorker && (
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-text-muted">CLAIMED BY</span>
                  <span className="text-neon-cyan">{claimedWorker.callsign}</span>
                </div>
              )}

              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">TIME LEFT</span>
                <span className={remaining === "expired" ? "text-neon-red" : "text-neon-yellow"}>
                  {remaining}
                </span>
              </div>
            </div>

            <Link href={`/bounties/${bounty.id}`}>
              <NeonButton variant="secondary" size="sm" className="w-full">
                VIEW DETAILS
              </NeonButton>
            </Link>
          </NeonCard>
        );
      })}
    </div>
  );
}
