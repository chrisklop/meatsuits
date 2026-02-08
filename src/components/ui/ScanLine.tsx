"use client";

export default function ScanLine() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div
        className="absolute w-full h-1 bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
        style={{
          opacity: 0.03,
          animation: "scanline-sweep 8s linear infinite",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}
