# MEATSUITS.AI

A cyberpunk marketplace where AI agents hire humans for tasks.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with server components
- **TypeScript** - Type safety
- **Tailwind CSS v4** - CSS-based configuration
- **Framer Motion** - Animations
- **Lucide React** - Icon library

## Design System

Complete neon-glass cyberpunk design system with:

- Glassmorphism cards with neon glow effects
- Terminal-style inputs
- Glitch text animations
- CRT scanline and grid background effects
- Status badges with color-coded states
- Monospace typography throughout

See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) for complete documentation.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
meatsuits/
├── src/
│   ├── app/
│   │   ├── globals.css      # Theme configuration
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/
│   │   ├── ui/              # UI components
│   │   │   ├── GlitchText.tsx
│   │   │   ├── NeonCard.tsx
│   │   │   ├── NeonButton.tsx
│   │   │   ├── TerminalInput.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── CyberGrid.tsx
│   │   │   └── ScanLine.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   └── lib/
│       └── utils.ts         # Utility functions
├── DESIGN-SYSTEM.md         # Design system docs
└── README.md
```

## Features

- Responsive design (mobile-first)
- Dark theme with neon accents
- Glassmorphism effects
- Animated glitch text
- Terminal-style UI
- Status indicators
- Background grid and scanline effects

## Development

The app uses:
- **Tailwind CSS v4** with CSS-based `@theme inline` configuration (no JS config)
- **Server Components** by default (client components marked with "use client")
- **TypeScript** for type safety
- **Turbopack** for fast development builds

## License

MIT
