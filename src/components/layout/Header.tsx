"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import GlitchText from "@/components/ui/GlitchText";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/bounties", label: "BOUNTIES" },
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/agent", label: "AGENT" },
  { href: "/login", label: "LOGIN" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-neon-cyan/20">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <GlitchText
            text="MEATSUITS.AI"
            as="h1"
            className="text-lg md:text-xl text-neon-cyan font-bold tracking-wider"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono uppercase tracking-wider text-sm transition-colors relative",
                "hover:text-neon-cyan",
                pathname === link.href
                  ? "text-neon-cyan"
                  : "text-text-muted"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-neon-cyan"
                  style={{
                    boxShadow: "0 0 5px rgba(0, 255, 255, 0.8)",
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-neon-cyan p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-neon-cyan/20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "font-mono uppercase tracking-wider text-sm transition-colors py-2",
                  "hover:text-neon-cyan",
                  pathname === link.href
                    ? "text-neon-cyan border-l-2 border-neon-cyan pl-4"
                    : "text-text-muted pl-4"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
