"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: {
    base: "bg-bg-surface border-neon-cyan text-neon-cyan",
    rgb: "0, 255, 255",
  },
  secondary: {
    base: "bg-bg-surface border-neon-purple text-neon-purple",
    rgb: "179, 102, 255",
  },
  danger: {
    base: "bg-bg-surface border-neon-red text-neon-red",
    rgb: "255, 51, 102",
  },
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function NeonButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: NeonButtonProps) {
  const { base, rgb } = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (
    <button
      className={cn(
        "font-mono uppercase tracking-wider border-2 rounded",
        "transition-all duration-200",
        "active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        base,
        sizeClass,
        className
      )}
      style={{
        boxShadow: `0 0 10px rgba(${rgb}, 0.3)`,
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.boxShadow = `0 0 20px rgba(${rgb}, 0.6), 0 0 30px rgba(${rgb}, 0.4)`;
          e.currentTarget.style.animation = "neon-pulse 1.5s infinite";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 10px rgba(${rgb}, 0.3)`;
        e.currentTarget.style.animation = "";
      }}
      {...props}
    >
      {children}
    </button>
  );
}
