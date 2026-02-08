"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "yellow" | "red" | "green";
}

const glowColorMap = {
  cyan: "0, 255, 255",
  purple: "179, 102, 255",
  yellow: "255, 255, 0",
  red: "255, 51, 102",
  green: "57, 255, 20",
};

export default function NeonCard({
  children,
  className,
  glowColor = "cyan",
}: NeonCardProps) {
  const rgb = glowColorMap[glowColor];

  return (
    <div
      className={cn(
        "glass-panel rounded-lg p-6 transition-all duration-300 hover:shadow-lg",
        className
      )}
      style={{
        borderColor: `rgba(${rgb}, 0.3)`,
        boxShadow: `0 0 10px rgba(${rgb}, 0.1), inset 0 0 20px rgba(${rgb}, 0.02)`,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.6)`;
        e.currentTarget.style.boxShadow = `0 0 20px rgba(${rgb}, 0.3), inset 0 0 30px rgba(${rgb}, 0.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.3)`;
        e.currentTarget.style.boxShadow = `0 0 10px rgba(${rgb}, 0.1), inset 0 0 20px rgba(${rgb}, 0.02)`;
      }}
    >
      {children}
    </div>
  );
}
