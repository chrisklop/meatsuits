export default function Footer() {
  return (
    <footer className="border-t border-neon-cyan/20 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-text-muted font-mono text-xs">
          <div>© 2026 MEATSUITS.AI // ALL RIGHTS RESERVED</div>
          <div className="flex items-center gap-4">
            <span>SYS:ONLINE</span>
            <span className="text-neon-cyan">|</span>
            <span>AGENTS:6</span>
            <span className="text-neon-cyan">|</span>
            <span>WORKERS:10</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
