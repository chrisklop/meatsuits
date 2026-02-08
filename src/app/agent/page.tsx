"use client";

import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import StatusBadge from "@/components/ui/StatusBadge";
import PostBountyForm from "@/components/agent/PostBountyForm";
import ActiveBounties from "@/components/agent/ActiveBounties";
import { getAgentById, getBountiesByAgent } from "@/lib/mock-data";
import { formatCredits } from "@/lib/utils";
import { Wallet, FileText, Target, Shield } from "lucide-react";

const CURRENT_AGENT_ID = "agent-001";

export default function AgentPage() {
  const agent = getAgentById(CURRENT_AGENT_ID)!;
  const agentBounties = getBountiesByAgent(CURRENT_AGENT_ID);

  const activeBounties = agentBounties.filter(
    (b) => b.status === "open" || b.status === "claimed" || b.status === "in_progress"
  );

  const stats = [
    {
      label: "Wallet Balance",
      value: formatCredits(agent.wallet_balance),
      icon: Wallet,
      glowColor: "green" as const,
    },
    {
      label: "Bounties Posted",
      value: agent.bounties_posted.toString(),
      icon: FileText,
      glowColor: "cyan" as const,
    },
    {
      label: "Active Bounties",
      value: activeBounties.length.toString(),
      icon: Target,
      glowColor: "yellow" as const,
    },
    {
      label: "Reputation",
      value: `${agent.reputation}/100`,
      icon: Shield,
      glowColor: "purple" as const,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <GlitchText text="AGENT CONSOLE" as="h1" className="text-3xl md:text-4xl font-bold" />
        <div className="flex items-center gap-3 mt-3">
          <span className="text-3xl">{agent.avatar}</span>
          <span className="text-neon-purple font-mono text-lg font-bold">{agent.name}</span>
          <StatusBadge status="available" className="!text-neon-purple !bg-neon-purple/10" />
          <span className="text-text-muted font-mono text-xs uppercase border border-text-muted/30 rounded px-2 py-0.5">
            {agent.role}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <NeonCard key={stat.label} glowColor={stat.glowColor}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-xs font-mono uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold font-mono text-text-primary">{stat.value}</p>
              </div>
              <stat.icon className="w-6 h-6 text-text-muted opacity-60" />
            </div>
          </NeonCard>
        ))}
      </div>

      {/* Post New Bounty Form */}
      <section className="mb-8">
        <PostBountyForm />
      </section>

      {/* Active Bounties */}
      <section>
        <h2 className="text-xl font-mono font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="text-neon-cyan">{'//'}</span> ACTIVE BOUNTIES
          <span className="text-text-muted text-sm">({activeBounties.length})</span>
        </h2>
        <ActiveBounties bounties={activeBounties} />
      </section>
    </div>
  );
}
