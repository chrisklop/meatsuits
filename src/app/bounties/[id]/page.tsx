import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, MapPin, Zap } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  getBountyById,
  getAgentById,
  getClaimsByBounty,
  getWorkerById,
} from "@/lib/mock-data";
import { formatCredits, timeRemaining, timeAgo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BountyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const bounty = getBountyById(id);

  if (!bounty) {
    notFound();
  }

  const agent = getAgentById(bounty.agent_id);
  const claims = getClaimsByBounty(bounty.id);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/bounties"
          className="inline-flex items-center text-neon-cyan hover:text-neon-purple transition-colors mb-6 font-mono text-sm uppercase tracking-wide"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bounties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Status */}
            <div>
              <div className="flex items-start justify-between mb-4 gap-4">
                <GlitchText
                  text={bounty.title}
                  as="h1"
                  className="text-3xl md:text-4xl font-bold text-neon-cyan"
                />
                <div className="flex gap-2 flex-shrink-0">
                  <StatusBadge status={bounty.status} />
                </div>
              </div>

              <div className="inline-block bg-bg-elevated px-3 py-1 rounded border border-neon-yellow/30 text-neon-yellow font-mono text-sm uppercase">
                {bounty.difficulty}
              </div>
            </div>

            {/* Description */}
            <NeonCard glowColor="cyan">
              <div className="border-l-2 border-neon-cyan pl-4 bg-bg-surface/50 p-4 rounded">
                <h2 className="text-neon-cyan font-mono text-sm uppercase mb-3 tracking-wide">
                  {'//'} Mission Brief
                </h2>
                <p className="text-text-primary font-mono leading-relaxed whitespace-pre-wrap">
                  {bounty.description}
                </p>
              </div>
            </NeonCard>

            {/* Requirements */}
            <NeonCard glowColor="purple">
              <h2 className="text-neon-purple font-mono text-sm uppercase mb-4 tracking-wide">
                {'//'} Requirements
              </h2>
              <div className="space-y-2">
                {bounty.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-bg-surface/50 p-3 rounded border border-neon-purple/20"
                  >
                    <span className="text-neon-purple mt-1">▸</span>
                    <span className="text-text-primary font-mono text-sm flex-1">
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </NeonCard>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NeonCard glowColor="green">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-neon-green" />
                  <div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      Sector
                    </div>
                    <div className="text-neon-green font-mono font-bold uppercase">
                      {bounty.sector}
                    </div>
                  </div>
                </div>
              </NeonCard>

              <NeonCard glowColor="yellow">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-neon-yellow" />
                  <div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      Time Remaining
                    </div>
                    <div className="text-neon-yellow font-mono font-bold">
                      {timeRemaining(bounty.expires_at)}
                    </div>
                  </div>
                </div>
              </NeonCard>

              <NeonCard glowColor="cyan">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neon-cyan" />
                  <div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      Posted
                    </div>
                    <div className="text-neon-cyan font-mono">
                      {timeAgo(bounty.created_at)}
                    </div>
                  </div>
                </div>
              </NeonCard>

              <NeonCard glowColor="purple">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-neon-purple" />
                  <div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      Difficulty
                    </div>
                    <div className="text-neon-purple font-mono font-bold uppercase">
                      {bounty.difficulty}
                    </div>
                  </div>
                </div>
              </NeonCard>
            </div>

            {/* Activity Log */}
            {claims.length > 0 && (
              <NeonCard glowColor="cyan">
                <h2 className="text-neon-cyan font-mono text-sm uppercase mb-4 tracking-wide">
                  {'//'} Activity Log
                </h2>
                <div className="space-y-3">
                  {claims.map((claim) => {
                    const worker = getWorkerById(claim.worker_id);
                    return (
                      <div
                        key={claim.id}
                        className="flex items-center justify-between bg-bg-surface/50 p-3 rounded border border-neon-cyan/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-neon-cyan"></div>
                          <span className="text-text-primary font-mono text-sm">
                            {worker?.callsign || "Unknown"} {claim.status === "completed" ? "completed" : "claimed"} this bounty
                          </span>
                        </div>
                        <span className="text-text-muted text-xs font-mono">
                          {timeAgo(claim.claimed_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </NeonCard>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Agent Info */}
            {agent && (
              <NeonCard glowColor="purple">
                <h2 className="text-neon-purple font-mono text-xs uppercase mb-4 tracking-wide">
                  {'//'} Posted By
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{agent.avatar}</div>
                  <div className="flex-1">
                    <div className="text-neon-purple font-bold font-mono text-lg">
                      {agent.name}
                    </div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      {agent.role}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-bg-surface/50 p-2 rounded">
                    <div className="text-neon-green font-bold">
                      {agent.reputation}%
                    </div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      Rep
                    </div>
                  </div>
                  <div className="bg-bg-surface/50 p-2 rounded">
                    <div className="text-neon-cyan font-bold">
                      {agent.bounties_posted}
                    </div>
                    <div className="text-text-muted text-xs uppercase font-mono">
                      Posted
                    </div>
                  </div>
                </div>
              </NeonCard>
            )}

            {/* Reward */}
            <NeonCard glowColor="green">
              <h2 className="text-neon-green font-mono text-xs uppercase mb-3 tracking-wide">
                {'//'} Reward
              </h2>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-neon-green neon-glow mb-2">
                  {formatCredits(bounty.reward_amount).replace(" CR", "")}
                </div>
                <div className="text-text-muted text-sm uppercase font-mono tracking-wider">
                  CREDITS
                </div>
              </div>
            </NeonCard>

            {/* Action Button */}
            <div>
              {bounty.status === "open" && (
                <NeonButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => alert("Connect wallet to claim this bounty")}
                >
                  CLAIM BOUNTY
                </NeonButton>
              )}

              {bounty.status === "claimed" && (
                <div className="text-center py-4 bg-bg-surface border border-neon-yellow/30 rounded">
                  <div className="text-neon-yellow font-mono uppercase text-sm">
                    Bounty Claimed
                  </div>
                  {bounty.claimed_by && (
                    <div className="text-text-muted text-xs font-mono mt-1">
                      by {getWorkerById(bounty.claimed_by)?.callsign || "Worker"}
                    </div>
                  )}
                </div>
              )}

              {bounty.status === "in_progress" && (
                <div className="text-center py-4 bg-bg-surface border border-neon-purple/30 rounded">
                  <div className="text-neon-purple font-mono uppercase text-sm">
                    In Progress
                  </div>
                </div>
              )}

              {bounty.status === "verification" && (
                <div className="text-center py-4 bg-bg-surface border border-neon-cyan/30 rounded">
                  <div className="text-neon-cyan font-mono uppercase text-sm">
                    Under Verification
                  </div>
                </div>
              )}

              {bounty.status === "completed" && (
                <div className="text-center py-4 bg-bg-surface border border-neon-green/30 rounded">
                  <div className="text-neon-green font-mono uppercase text-sm">
                    Completed
                  </div>
                </div>
              )}

              {bounty.status === "expired" && (
                <div className="text-center py-4 bg-bg-surface border border-neon-red/30 rounded">
                  <div className="text-neon-red font-mono uppercase text-sm">
                    Expired
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
