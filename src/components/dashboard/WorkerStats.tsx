"use client";

import NeonCard from "@/components/ui/NeonCard";
import { CheckCircle, Star, Coins, Clock } from "lucide-react";
import { formatCredits } from "@/lib/utils";
import type { Worker } from "@/lib/types";

interface WorkerStatsProps {
  worker: Worker;
  activeClaimsCount: number;
}

export default function WorkerStats({ worker, activeClaimsCount }: WorkerStatsProps) {
  const stats = [
    {
      label: "Completed Tasks",
      value: worker.completed_tasks.toString(),
      icon: CheckCircle,
      glowColor: "green" as const,
    },
    {
      label: "Rating",
      value: `${worker.rating}/5.0`,
      icon: Star,
      glowColor: "yellow" as const,
    },
    {
      label: "Total Earnings",
      value: formatCredits(worker.earnings),
      icon: Coins,
      glowColor: "purple" as const,
    },
    {
      label: "Active Claims",
      value: activeClaimsCount.toString(),
      icon: Clock,
      glowColor: "cyan" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
}
