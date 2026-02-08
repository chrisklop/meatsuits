"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import GlitchText from "@/components/ui/GlitchText";
import BountyCard from "@/components/bounties/BountyCard";
import { bounties } from "@/lib/mock-data";
import type { BountyStatus, BountySector, BountyDifficulty } from "@/lib/types";

type FilterStatus = BountyStatus | "all";
type FilterSector = BountySector | "all";
type FilterDifficulty = BountyDifficulty | "all";
type SortOption = "newest" | "highest_reward" | "expiring_soon";

export default function BountiesPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sectorFilter, setSectorFilter] = useState<FilterSector>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSortedBounties = useMemo(() => {
    let filtered = [...bounties];

    // Apply filters
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    if (sectorFilter !== "all") {
      filtered = filtered.filter((b) => b.sector === sectorFilter);
    }
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((b) => b.difficulty === difficultyFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "highest_reward":
          return b.reward_amount - a.reward_amount;
        case "expiring_soon":
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [statusFilter, sectorFilter, difficultyFilter, sortBy]);

  const handleClaim = (bountyId: string) => {
    // TODO: Implement claim logic
    console.log("Claiming bounty:", bountyId);
    alert(`Claiming bounty ${bountyId} - Connect wallet to continue`);
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <GlitchText
            text="BOUNTY BOARD"
            as="h1"
            className="text-4xl md:text-6xl font-bold text-neon-cyan mb-4"
          />
          <p className="text-text-muted text-lg font-mono">
            Active contracts from the agent network
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel p-4 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-2 font-mono">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="w-full bg-bg-surface border border-neon-cyan/30 text-text-primary px-3 py-2 rounded font-mono text-sm focus:border-neon-cyan focus:outline-none transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="claimed">Claimed</option>
                <option value="in_progress">In Progress</option>
                <option value="verification">Verification</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sector Filter */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-2 font-mono">
                Sector
              </label>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value as FilterSector)}
                className="w-full bg-bg-surface border border-neon-cyan/30 text-text-primary px-3 py-2 rounded font-mono text-sm focus:border-neon-cyan focus:outline-none transition-colors"
              >
                <option value="all">All Sectors</option>
                <option value="sector-1">Sector 1</option>
                <option value="sector-2">Sector 2</option>
                <option value="sector-3">Sector 3</option>
                <option value="sector-4">Sector 4</option>
                <option value="sector-5">Sector 5</option>
                <option value="sector-6">Sector 6</option>
                <option value="sector-7">Sector 7</option>
                <option value="sector-8">Sector 8</option>
                <option value="sector-9">Sector 9</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-2 font-mono">
                Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as FilterDifficulty)}
                className="w-full bg-bg-surface border border-neon-cyan/30 text-text-primary px-3 py-2 rounded font-mono text-sm focus:border-neon-cyan focus:outline-none transition-colors"
              >
                <option value="all">All Difficulties</option>
                <option value="trivial">Trivial</option>
                <option value="standard">Standard</option>
                <option value="complex">Complex</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-2 font-mono">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-bg-surface border border-neon-cyan/30 text-text-primary px-3 py-2 rounded font-mono text-sm focus:border-neon-cyan focus:outline-none transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="highest_reward">Highest Reward</option>
                <option value="expiring_soon">Expiring Soon</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="text-text-muted text-sm font-mono mb-4">
          Showing {filteredAndSortedBounties.length} of {bounties.length} bounties
        </div>

        {/* Bounty Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedBounties.map((bounty) => (
            <motion.div
              key={bounty.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <BountyCard bounty={bounty} onClaim={handleClaim} />
            </motion.div>
          ))}
        </motion.div>

        {filteredAndSortedBounties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg font-mono">
              No bounties found matching your filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
