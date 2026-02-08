"use client";

import { useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import TerminalInput from "@/components/ui/TerminalInput";
import GlitchText from "@/components/ui/GlitchText";
import type { BountySector, BountyDifficulty } from "@/lib/types";

const sectors: BountySector[] = [
  "sector-1", "sector-2", "sector-3", "sector-4", "sector-5",
  "sector-6", "sector-7", "sector-8", "sector-9",
];

const difficulties: BountyDifficulty[] = ["trivial", "standard", "complex", "critical"];

const expiryOptions = [
  { label: "24 HOURS", value: "24h" },
  { label: "48 HOURS", value: "48h" },
  { label: "72 HOURS", value: "72h" },
  { label: "1 WEEK", value: "1w" },
];

export default function PostBountyForm() {
  const [showNotice, setShowNotice] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [reward, setReward] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 5000);
  };

  const selectClasses =
    "w-full bg-bg-surface text-text-primary font-mono border-2 border-text-muted rounded px-3 py-2 pl-12 focus:outline-none focus:border-neon-cyan transition-colors duration-200 appearance-none";

  return (
    <NeonCard glowColor="purple" className="w-full">
      <GlitchText text="POST NEW BOUNTY" as="h2" className="text-xl font-bold mb-6" />

      {showNotice && (
        <NeonCard glowColor="yellow" className="mb-6">
          <p className="text-neon-yellow font-mono text-sm">
            [SYSTEM] Bounty deployment requires Supabase connection. Coming soon.
          </p>
        </NeonCard>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <TerminalInput
          label="Title"
          placeholder="Enter bounty title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="w-full">
          <label className="block text-text-muted text-sm mb-1 font-mono uppercase tracking-wide">
            Description
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-neon-cyan font-mono">&gt;_</span>
            <textarea
              className="w-full bg-bg-surface text-text-primary font-mono border-2 border-text-muted rounded px-3 py-2 pl-12 focus:outline-none focus:border-neon-cyan transition-colors duration-200 placeholder:text-text-muted min-h-[120px] resize-y"
              placeholder="Describe the bounty requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ caretColor: "var(--color-neon-cyan)" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="w-full">
            <label className="block text-text-muted text-sm mb-1 font-mono uppercase tracking-wide">
              Sector
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan font-mono">
                &gt;_
              </span>
              <select
                className={selectClasses}
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              >
                <option value="" disabled>
                  Select sector...
                </option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-text-muted text-sm mb-1 font-mono uppercase tracking-wide">
              Difficulty
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan font-mono">
                &gt;_
              </span>
              <select
                className={selectClasses}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="" disabled>
                  Select difficulty...
                </option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TerminalInput
            label="Reward Amount (CR)"
            placeholder="e.g. 2500"
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-text-muted text-sm mb-1 font-mono uppercase tracking-wide">
              Expiry Duration
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-cyan font-mono">
                &gt;_
              </span>
              <select
                className={selectClasses}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              >
                <option value="" disabled>
                  Select expiry...
                </option>
                {expiryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <NeonButton type="submit" size="lg" className="w-full">
            DEPLOY BOUNTY
          </NeonButton>
        </div>
      </form>
    </NeonCard>
  );
}
