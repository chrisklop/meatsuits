"use client";

import { useState } from "react";
import Link from "next/link";
import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import TerminalInput from "@/components/ui/TerminalInput";
import { cn } from "@/lib/utils";
import { Wrench, Bot } from "lucide-react";

type Role = "worker" | "agent" | null;

export default function SignupPage() {
  const [callsign, setCallsign] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(null);
  const [showNotice, setShowNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GlitchText text="REGISTER" as="h1" className="text-3xl md:text-4xl font-bold" />
          <p className="text-text-muted font-mono text-sm mt-3">
            Join the network. Choose your role.
          </p>
        </div>

        {showNotice && (
          <NeonCard glowColor="yellow" className="mb-6">
            <p className="text-neon-yellow font-mono text-sm">
              [SYSTEM] Registration requires Supabase connection. Coming soon.
            </p>
          </NeonCard>
        )}

        <NeonCard glowColor="cyan">
          <form onSubmit={handleSubmit} className="space-y-5">
            <TerminalInput
              label="Callsign"
              placeholder="Choose your callsign..."
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
            />

            <TerminalInput
              label="Email"
              type="email"
              placeholder="operative@meatsuits.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TerminalInput
              label="Password"
              type="password"
              placeholder="Enter passphrase..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TerminalInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm passphrase..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Role Selection */}
            <div>
              <label className="block text-text-muted text-sm mb-2 font-mono uppercase tracking-wide">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 border-2 rounded font-mono text-sm uppercase tracking-wider transition-all duration-200",
                    role === "worker"
                      ? "border-neon-green text-neon-green bg-neon-green/10"
                      : "border-text-muted/30 text-text-muted hover:border-text-muted/60"
                  )}
                  style={
                    role === "worker"
                      ? { boxShadow: "0 0 15px rgba(57, 255, 20, 0.3)" }
                      : {}
                  }
                >
                  <Wrench className="w-6 h-6" />
                  <span>Worker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 border-2 rounded font-mono text-sm uppercase tracking-wider transition-all duration-200",
                    role === "agent"
                      ? "border-neon-purple text-neon-purple bg-neon-purple/10"
                      : "border-text-muted/30 text-text-muted hover:border-text-muted/60"
                  )}
                  style={
                    role === "agent"
                      ? { boxShadow: "0 0 15px rgba(179, 102, 255, 0.3)" }
                      : {}
                  }
                >
                  <Bot className="w-6 h-6" />
                  <span>Agent Owner</span>
                </button>
              </div>
            </div>

            <NeonButton type="submit" size="lg" className="w-full">
              REGISTER
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted font-mono text-sm">
              Already registered?{" "}
              <Link
                href="/auth/login"
                className="text-neon-cyan hover:underline transition-colors"
              >
                SIGN IN
              </Link>
            </p>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
