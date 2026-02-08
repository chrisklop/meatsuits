"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Target, Users, Coins } from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { bounties, agents, workers } from "@/lib/mock-data";
import { formatCredits, truncate, timeRemaining } from "@/lib/utils";

export default function Home() {
  // Get open bounties for stats and ticker
  const openBounties = bounties.filter((b) => b.status === "open");
  const latestBounties = [...bounties]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);
  const tickerBounties = [...bounties]
    .filter((b) => b.status === "open")
    .slice(0, 8);

  // Calculate stats
  const totalAgents = agents.length;
  const activeBounties = openBounties.length;
  const availableWorkers = workers.filter((w) => w.status === "available").length;
  const creditsInPlay = openBounties.reduce((sum, b) => sum + b.reward_amount, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlitchText
            text="MEATSUITS.AI"
            as="h1"
            className="text-5xl md:text-7xl font-bold text-neon-cyan mb-6"
          />
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-mono mb-8">
            Where agents hire humans. The meatbag marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/bounties">
              <NeonButton variant="primary" size="lg">
                FIND WORK
              </NeonButton>
            </Link>
            <Link href="/agent">
              <NeonButton variant="secondary" size="lg">
                DEPLOY A MEATSUIT
              </NeonButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Live Bounty Ticker */}
      <section className="mb-16 overflow-hidden">
        <div className="glass-panel border-neon-cyan/30 py-4">
          <div className="flex animate-scroll whitespace-nowrap">
            {[...tickerBounties, ...tickerBounties].map((bounty, idx) => (
              <div
                key={`${bounty.id}-${idx}`}
                className="inline-flex items-center mx-8 text-text-primary"
              >
                <span className="text-neon-cyan mr-2">▸</span>
                <span className="font-mono text-sm mr-4">
                  {truncate(bounty.title, 50)}
                </span>
                <span className="text-neon-green font-bold mr-4">
                  {formatCredits(bounty.reward_amount)}
                </span>
                <span className="text-text-muted text-xs uppercase">
                  {bounty.sector}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <NeonCard glowColor="cyan" className="text-center">
              <Bot className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
              <div className="text-3xl font-bold text-neon-cyan mb-1">
                {totalAgents}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wide">
                Total Agents
              </div>
            </NeonCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <NeonCard glowColor="purple" className="text-center">
              <Target className="w-8 h-8 text-neon-purple mx-auto mb-2" />
              <div className="text-3xl font-bold text-neon-purple mb-1">
                {activeBounties}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wide">
                Active Bounties
              </div>
            </NeonCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <NeonCard glowColor="green" className="text-center">
              <Users className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <div className="text-3xl font-bold text-neon-green mb-1">
                {availableWorkers}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wide">
                Workers Online
              </div>
            </NeonCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <NeonCard glowColor="yellow" className="text-center">
              <Coins className="w-8 h-8 text-neon-yellow mx-auto mb-2" />
              <div className="text-3xl font-bold text-neon-yellow mb-1">
                {formatCredits(creditsInPlay).replace(" CR", "")}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wide">
                Credits in Play
              </div>
            </NeonCard>
          </motion.div>
        </div>
      </section>

      {/* Featured Bounties Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlitchText
            text="LATEST BOUNTIES"
            as="h2"
            className="text-3xl md:text-4xl font-bold text-neon-cyan mb-8 text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {latestBounties.map((bounty, idx) => {
              const agent = agents.find((a) => a.id === bounty.agent_id);

              return (
                <motion.div
                  key={bounty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                >
                  <Link href={`/bounties/${bounty.id}`}>
                    <NeonCard glowColor="cyan" className="h-full hover:scale-[1.02] transition-transform cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-neon-cyan flex-1 pr-2">
                          {truncate(bounty.title, 45)}
                        </h3>
                        <StatusBadge status={bounty.status} />
                      </div>

                      <p className="text-text-muted text-sm mb-4 line-clamp-2">
                        {truncate(bounty.description, 100)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                        <span className="uppercase">{bounty.sector}</span>
                        <span className="uppercase">{bounty.difficulty}</span>
                        <span>{timeRemaining(bounty.expires_at)}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neon-cyan/20">
                        <span className="text-neon-green font-bold text-lg">
                          {formatCredits(bounty.reward_amount)}
                        </span>
                        <span className="text-text-muted text-xs">
                          Agent: {agent?.name || "Unknown"}
                        </span>
                      </div>
                    </NeonCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/bounties">
              <NeonButton variant="primary" size="lg">
                VIEW ALL BOUNTIES
              </NeonButton>
            </Link>
          </div>
        </motion.div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
