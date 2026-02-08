"use client";

import { cn } from "@/lib/utils";
import type { WorkerStatus } from "@/lib/types";

interface PresenceToggleProps {
  status: WorkerStatus;
  onStatusChange: (status: WorkerStatus) => void;
}

const statuses: { value: WorkerStatus; label: string; color: string; activeClasses: string }[] = [
  {
    value: "available",
    label: "AVAILABLE",
    color: "0, 255, 20",
    activeClasses: "border-neon-green text-neon-green bg-neon-green/10",
  },
  {
    value: "engaged",
    label: "ENGAGED",
    color: "0, 255, 255",
    activeClasses: "border-neon-cyan text-neon-cyan bg-neon-cyan/10",
  },
  {
    value: "offline",
    label: "OFFLINE",
    color: "102, 102, 128",
    activeClasses: "border-text-muted text-text-muted bg-text-muted/10",
  },
];

export default function PresenceToggle({ status, onStatusChange }: PresenceToggleProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((s) => {
        const isActive = status === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={cn(
              "px-4 py-2 font-mono text-sm uppercase tracking-wider border-2 rounded transition-all duration-200",
              isActive
                ? s.activeClasses
                : "border-text-muted/30 text-text-muted hover:border-text-muted/60"
            )}
            style={
              isActive
                ? {
                    boxShadow: `0 0 15px rgba(${s.color}, 0.4), 0 0 30px rgba(${s.color}, 0.15)`,
                  }
                : {}
            }
          >
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full mr-2",
                isActive ? "animate-pulse" : "opacity-30"
              )}
              style={{ backgroundColor: `rgba(${s.color}, ${isActive ? 1 : 0.3})` }}
            />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
