import { cn } from "@/lib/utils";

type Status =
  | "available"
  | "engaged"
  | "offline"
  | "open"
  | "claimed"
  | "in_progress"
  | "verification"
  | "completed"
  | "expired";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { color: string; bg: string; pulse?: boolean }
> = {
  available: { color: "text-neon-green", bg: "bg-neon-green/10", pulse: true },
  open: { color: "text-neon-green", bg: "bg-neon-green/10", pulse: true },
  engaged: { color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  claimed: { color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  in_progress: { color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  verification: { color: "text-neon-yellow", bg: "bg-neon-yellow/10" },
  completed: { color: "text-neon-purple", bg: "bg-neon-purple/10" },
  offline: { color: "text-text-muted", bg: "bg-text-muted/10" },
  expired: { color: "text-text-muted", bg: "bg-text-muted/10" },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded-full text-xs font-mono uppercase tracking-wide",
        config.color,
        config.bg,
        config.pulse && "animate-pulse",
        className
      )}
      style={
        config.pulse
          ? {
              animation: "neon-pulse 2s ease-in-out infinite",
            }
          : {}
      }
    >
      {status.replace("_", " ")}
    </span>
  );
}
