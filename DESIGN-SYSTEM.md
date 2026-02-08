# Meatsuits.ai Design System

Complete Neon-Glass cyberpunk design system for the Meatsuits.ai project.

## Theme Overview

A dark cyberpunk aesthetic with neon colors, glassmorphism effects, and monospace typography. Inspired by hacker terminals and futuristic interfaces.

### Color Palette

```css
--color-bg-deep: #0a0a0f        /* Deep background */
--color-bg-surface: #12121a      /* Surface background */
--color-bg-elevated: #1a1a2e     /* Elevated background */

--color-neon-cyan: #00ffff       /* Primary accent */
--color-neon-purple: #b366ff     /* Secondary accent */
--color-neon-yellow: #ffff00     /* Warning/highlight */
--color-neon-red: #ff3366        /* Danger/error */
--color-neon-green: #39ff14      /* Success/available */

--color-text-primary: #e0e0e0    /* Primary text */
--color-text-muted: #666680      /* Muted text */
```

### Typography

- **Font**: JetBrains Mono (monospace)
- **Style**: Uppercase, wide letter spacing for headings
- **Glitch effects**: Available via GlitchText component

## Components

### GlitchText

Animated glitch text effect with color-shifted layers.

```tsx
import GlitchText from "@/components/ui/GlitchText";

// Usage
<GlitchText
  text="MEATSUITS.AI"
  as="h1"
  className="text-4xl text-neon-cyan"
/>
```

**Props:**
- `text: string` - The text to display
- `as?: "h1" | "h2" | "h3" | "span"` - HTML element (default: "span")
- `className?: string` - Additional Tailwind classes

**Use cases:**
- Logo/branding
- Page titles
- Attention-grabbing headings

---

### NeonCard

Glass-morphism card with neon glow border effects.

```tsx
import NeonCard from "@/components/ui/NeonCard";

// Usage
<NeonCard glowColor="cyan">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</NeonCard>
```

**Props:**
- `children: ReactNode` - Card content
- `className?: string` - Additional Tailwind classes
- `glowColor?: "cyan" | "purple" | "yellow" | "red" | "green"` - Border glow color (default: "cyan")

**Features:**
- Semi-transparent backdrop blur
- Hover effect that intensifies glow
- Smooth transitions

**Use cases:**
- Bounty listings
- User profiles
- Feature cards
- Dashboard widgets

---

### NeonButton

Cyberpunk-styled button with neon glow effects.

```tsx
import NeonButton from "@/components/ui/NeonButton";

// Usage
<NeonButton variant="primary" size="lg" onClick={handleClick}>
  Connect Wallet
</NeonButton>
```

**Props:**
- `variant?: "primary" | "secondary" | "danger"` - Button style (default: "primary")
  - `primary` = cyan glow
  - `secondary` = purple glow
  - `danger` = red glow
- `size?: "sm" | "md" | "lg"` - Button size (default: "md")
- `className?: string` - Additional Tailwind classes
- Standard button HTML attributes

**Features:**
- Pulsing glow on hover
- Scale-down on active/click
- Disabled state with reduced opacity
- Uppercase text with wide tracking

**Use cases:**
- CTAs
- Form submissions
- Navigation actions
- Wallet connections

---

### TerminalInput

Terminal-style input with `>_` prefix and neon focus effects.

```tsx
import TerminalInput from "@/components/ui/TerminalInput";

// Usage
<TerminalInput
  label="WALLET ADDRESS"
  placeholder="0x..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Props:**
- `label?: string` - Label text (displayed above input)
- `className?: string` - Additional Tailwind classes
- Standard input HTML attributes

**Features:**
- Monospace font
- `>_` prefix visible inside input
- Cyan focus border with glow
- Blinking cursor animation on focus

**Use cases:**
- Search inputs
- Wallet address inputs
- Terminal commands
- Code/ID inputs

---

### StatusBadge

Color-coded status indicator pills.

```tsx
import StatusBadge from "@/components/ui/StatusBadge";

// Usage
<StatusBadge status="available" />
<StatusBadge status="in_progress" />
<StatusBadge status="completed" />
```

**Props:**
- `status: Status` - Status type
- `className?: string` - Additional Tailwind classes

**Status Types:**

| Status | Color | Pulse | Use Case |
|--------|-------|-------|----------|
| `available` | Green | Yes | Available workers/bounties |
| `open` | Green | Yes | Open bounties |
| `engaged` | Cyan | No | Worker is engaged |
| `claimed` | Cyan | No | Bounty is claimed |
| `in_progress` | Cyan | No | Task in progress |
| `verification` | Yellow | No | Awaiting verification |
| `completed` | Purple | No | Task completed |
| `offline` | Muted | No | Worker offline |
| `expired` | Muted | No | Bounty expired |

**Features:**
- Auto-formatted text (underscores become spaces)
- Uppercase display
- Pulsing animation for "available" and "open" states

**Use cases:**
- Bounty status
- Worker availability
- Task progress
- System status

---

### CyberGrid

Animated background grid pattern overlay.

```tsx
import CyberGrid from "@/components/ui/CyberGrid";

// Usage (typically in layout)
<body>
  <CyberGrid />
  {/* Rest of app */}
</body>
```

**Features:**
- Fixed position full-screen
- Very low opacity (0.03)
- Slow upward scrolling animation
- Pointer-events disabled (doesn't block clicks)

**Use cases:**
- Global background effect
- Add to layout for consistent aesthetic

---

### ScanLine

CRT scanline overlay effect.

```tsx
import ScanLine from "@/components/ui/ScanLine";

// Usage (typically in layout)
<body>
  <ScanLine />
  {/* Rest of app */}
</body>
```

**Features:**
- Fixed position full-screen
- Horizontal line that sweeps down slowly
- Very low opacity (0.03) - almost subliminal
- High z-index (50) - sits above content
- Pointer-events disabled

**Use cases:**
- CRT/retro monitor effect
- Add to layout for atmospheric touch

---

### Header

Sticky navigation header with glassmorphism.

```tsx
import Header from "@/components/layout/Header";

// Usage (in layout)
<Header />
```

**Features:**
- Logo with glitch text effect
- Active link detection with neon underline
- Mobile responsive with hamburger menu
- Glass-morphism background with backdrop blur

**Navigation Links:**
- BOUNTIES (`/bounties`)
- DASHBOARD (`/dashboard`)
- AGENT (`/agent`)
- LOGIN (`/login`)

---

### Footer

Terminal-style footer with system stats.

```tsx
import Footer from "@/components/layout/Footer";

// Usage (in layout)
<Footer />
```

**Features:**
- Copyright notice
- System status display (online, agent count, worker count)
- Responsive layout (stacks on mobile)
- Monospace styling

---

## Utility Classes

### Neon Glow

Add neon cyan glow to text:

```tsx
<h1 className="neon-glow">Glowing Text</h1>
```

### Glass Panel

Create glassmorphism panel:

```tsx
<div className="glass-panel p-6 rounded-lg">
  Content here
</div>
```

### Custom Tailwind Tokens

Use theme colors in Tailwind classes:

```tsx
<div className="bg-bg-deep text-text-primary border-neon-cyan">
  Themed content
</div>
```

**Available tokens:**
- `bg-bg-deep`, `bg-bg-surface`, `bg-bg-elevated`
- `text-text-primary`, `text-text-muted`
- `border-neon-cyan`, `border-neon-purple`, etc.
- `text-neon-cyan`, `text-neon-purple`, etc.

---

## Animations

### CSS Keyframes

Available animations (defined in globals.css):

- `@keyframes glitch` - Glitch displacement effect
- `@keyframes neon-pulse` - Brightness pulsing
- `@keyframes scanline-sweep` - Vertical scanline movement
- `@keyframes cursor-blink` - Blinking cursor
- `@keyframes grid-scroll` - Upward grid scroll

### Usage

```tsx
<div style={{ animation: "neon-pulse 2s infinite" }}>
  Pulsing element
</div>
```

---

## Best Practices

### Typography
- Use monospace font (JetBrains Mono) for all text
- UPPERCASE for headings and labels with `tracking-wider`
- Keep body text readable with appropriate contrast

### Colors
- Use neon colors sparingly as accents
- Prefer `text-primary` and `text-muted` for body text
- Match glow colors to semantic meaning (green=success, red=danger, etc.)

### Layout
- Use dark backgrounds (`bg-bg-deep`, `bg-bg-surface`)
- Add glassmorphism to cards and panels
- Layer effects: grid → content → scanline

### Performance
- All background effects (CyberGrid, ScanLine) use pure CSS animations
- Client components only where necessary (event handlers, hooks)
- Static generation for most pages

### Accessibility
- Maintain sufficient contrast for text readability
- Use semantic HTML elements
- Provide aria-labels where needed
- Ensure keyboard navigation works

---

## File Structure

```
src/
├── app/
│   ├── globals.css          # Theme config + animations
│   ├── layout.tsx            # Root layout with Header/Footer
│   └── page.tsx              # Homepage demo
├── components/
│   ├── ui/
│   │   ├── GlitchText.tsx    # Glitch text effect
│   │   ├── NeonCard.tsx      # Glassmorphism cards
│   │   ├── NeonButton.tsx    # Neon buttons
│   │   ├── TerminalInput.tsx # Terminal inputs
│   │   ├── StatusBadge.tsx   # Status indicators
│   │   ├── CyberGrid.tsx     # Background grid
│   │   └── ScanLine.tsx      # CRT scanline
│   └── layout/
│       ├── Header.tsx        # Navigation header
│       └── Footer.tsx        # Footer with stats
└── lib/
    └── utils.ts              # cn() utility + helpers
```

---

## Quick Start

1. Import components:
```tsx
import GlitchText from "@/components/ui/GlitchText";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
```

2. Use Tailwind theme tokens:
```tsx
<div className="bg-bg-surface text-text-primary border border-neon-cyan">
  Cyberpunk content
</div>
```

3. Add interactive elements:
```tsx
<NeonButton variant="primary" onClick={handleClick}>
  Action
</NeonButton>
```

4. Create cards with glow:
```tsx
<NeonCard glowColor="purple">
  <h3 className="text-neon-purple">Title</h3>
  <p className="text-text-muted">Description</p>
</NeonCard>
```

---

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000 to see the design system in action.
