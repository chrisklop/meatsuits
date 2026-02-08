"use client";

import { useMemo } from "react";
import Link from "next/link";
import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import StatusBadge from "@/components/ui/StatusBadge";
import PresenceToggle from "@/components/dashboard/PresenceToggle";
import WorkerStats from "@/components/dashboard/WorkerStats";
import { usePresence } from "@/hooks/usePresence";
import {
  getWorkerById,
  getClaimsByWorker,
  getBountyById,
  bounties,
} from "@/lib/mock-data";
import { formatCredits, timeRemaining, timeAgo } from "@/lib/utils";
import { User, Star } from "lucide-react";

const CURRENT_WORKER_ID = "worker-001";

export default function DashboardPage() {
  const worker = getWorkerById(CURRENT_WORKER_ID)!;
  const { status, setStatus } = usePresence(worker.status);

  const workerClaims = useMemo(() => getClaimsByWorker(CURRENT_WORKER_ID), []);

  const activeClaims = useMemo(
    () => workerClaims.filter((c) => c.status !== "completed"),
    [workerClaims]
  );

  const completedClaims = useMemo(
    () => workerClaims.filter((c) => c.status === "completed"),
    [workerClaims]
  );

  const completedBounties = useMemo(
    () =>
      completedClaims
        .map((c) => {
          const bounty = getBountyById(c.bounty_id);
          return bounty ? { bounty, claim: c } : null;
        })
        .filter(Boolean) as { bounty: (typeof bounties)[0]; claim: (typeof workerClaims)[0] }[],
    [completedClaims]
  );

  const activeBounties = useMemo(
    () =>
      activeClaims
        .map((c) => {
          const bounty = getBountyById(c.bounty_id);
          return bounty ? { bounty, claim: c } : null;
        })
        .filter(Boolean) as { bounty: (typeof bounties)[0]; claim: (typeof workerClaims)[0] }[],
    [activeClaims]
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <GlitchText text="WORKER DASHBOARD" as="h1" className="text-3xl md:text-4xl font-bold" />
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan font-mono text-lg font-bold">{worker.callsign}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-neon-yellow" />
              <span className="text-neon-yellow font-mono text-sm">{worker.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presence Toggle */}
      <div className="mb-8">
        <p className="text-text-muted font-mono text-xs uppercase tracking-wide mb-3">
          Presence Status
        </p>
        <PresenceToggle status={status} onStatusChange={setStatus} />
      </div>

      {/* Stats Row */}
      <div className="mb-8">
        <WorkerStats worker={worker} activeClaimsCount={activeClaims.length} />
      </div>

      {/* Active Claims */}
      <section className="mb-8">
        <h2 className="text-xl font-mono font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-neon-cyan">{'//'}</span> ACTIVE CLAIMS
          <span className="text-text-muted text-sm">({activeBounties.length})</span>
        </h2>

        {activeBounties.length === 0 ? (
          <NeonCard className="text-center py-8">
            <p className="text-text-muted font-mono text-sm">No active claims. Browse bounties to find work.</p>
            <Link href="/bounties">
              <NeonButton size="sm" className="mt-4">
                BROWSE BOUNTIES
              </NeonButton>
            </Link>
          </NeonCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBounties.map(({ bounty, claim }) => {
              const remaining = timeRemaining(bounty.expires_at);
              return (
                <NeonCard key={claim.id} glowColor="cyan">
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
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">STATUS</span>
                      <span className="text-neon-cyan uppercase">{claim.status}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-text-muted">TIME LEFT</span>
                      <span
                        className={remaining === "expired" ? "text-neon-red" : "text-neon-yellow"}
                      >
                        {remaining}
                      </span>
                    </div>
                  </div>

                  <Link href={`/bounties/${bounty.id}`}>
                    <NeonButton variant="primary" size="sm" className="w-full">
                      VIEW BOUNTY
                    </NeonButton>
                  </Link>
                </NeonCard>
              );
            })}
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      <section>
        <h2 className="text-xl font-mono font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-neon-purple">{'//'}</span> COMPLETED TASKS
          <span className="text-text-muted text-sm">({completedBounties.length})</span>
        </h2>

        {completedBounties.length === 0 ? (
          <NeonCard className="text-center py-8">
            <p className="text-text-muted font-mono text-sm">No completed tasks yet.</p>
          </NeonCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedBounties.map(({ bounty, claim }) => (
              <NeonCard key={claim.id} glowColor="purple">
                <h3 className="text-sm font-mono font-bold text-text-primary mb-3 leading-tight">
                  {bounty.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-muted">EARNED</span>
                    <span className="text-neon-green">{formatCredits(bounty.reward_amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-muted">COMPLETED</span>
                    <span className="text-text-primary">
                      {claim.completed_at ? timeAgo(claim.completed_at) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-end pt-1">
                    <StatusBadge status="completed" />
                  </div>
                </div>
              </NeonCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
