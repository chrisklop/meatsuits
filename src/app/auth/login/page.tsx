"use client";

import { useState } from "react";
import Link from "next/link";
import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import TerminalInput from "@/components/ui/TerminalInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <GlitchText text="AUTHENTICATE" as="h1" className="text-3xl md:text-4xl font-bold" />
          <p className="text-text-muted font-mono text-sm mt-3">
            Access the meatbag network
          </p>
        </div>

        {showNotice && (
          <NeonCard glowColor="yellow" className="mb-6">
            <p className="text-neon-yellow font-mono text-sm">
              [SYSTEM] Authentication requires Supabase connection. Coming soon.
            </p>
          </NeonCard>
        )}

        <NeonCard glowColor="cyan">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <NeonButton type="submit" size="lg" className="w-full">
              SIGN IN
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted font-mono text-sm">
              No account?{" "}
              <Link
                href="/auth/signup"
                className="text-neon-cyan hover:underline transition-colors"
              >
                REGISTER
              </Link>
            </p>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
