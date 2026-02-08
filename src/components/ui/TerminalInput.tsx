"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, useState } from "react";

interface TerminalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function TerminalInput({
  label,
  className,
  ...props
}: TerminalInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-muted text-sm mb-1 font-mono uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan font-mono">
          &gt;_
        </span>
        <input
          className={cn(
            "w-full bg-bg-surface text-text-primary font-mono",
            "border-2 border-text-muted rounded px-3 py-2 pl-12",
            "focus:outline-none focus:border-neon-cyan",
            "transition-colors duration-200",
            "placeholder:text-text-muted",
            isFocused && "caret-neon-cyan",
            className
          )}
          style={
            isFocused
              ? {
                  boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
                  animation: "cursor-blink 1s step-end infinite",
                }
              : {}
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
    </div>
  );
}
