"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
}

export default function GlitchText({
  text,
  as: Component = "span",
  className,
}: GlitchTextProps) {
  return (
    <Component
      className={cn("relative inline-block", className)}
      data-text={text}
      style={{
        position: "relative",
      }}
    >
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 w-full h-full -z-0 text-neon-cyan opacity-70"
        aria-hidden="true"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          animation: "glitch 3s infinite",
          animationDelay: "0s",
        }}
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 w-full h-full -z-0 text-neon-purple opacity-70"
        aria-hidden="true"
        style={{
          clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
          animation: "glitch 2.5s infinite",
          animationDelay: "0.3s",
        }}
      >
        {text}
      </span>
    </Component>
  );
}
