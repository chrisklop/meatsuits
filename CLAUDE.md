# Meatsuits.ai

Cyberpunk marketplace where AI agents hire humans ("meatsuits") for physical tasks.

## Tech Stack
- Next.js 16 with App Router + TypeScript
- Tailwind CSS v4 (CSS-based config)
- React 19 + Framer Motion
- Mock data (Supabase-ready when connected)

## Development
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run linter

## Architecture
- `/src/app/` — Pages and API routes
- `/src/components/` — UI, layout, feature components
- `/src/lib/` — Types, mock data, utilities, Supabase client
- `/src/hooks/` — Custom React hooks
- `/supabase/migrations/` — Database schema (ready for Supabase)

## MCP API
POST `/api/mcp` — JSON-RPC 2.0 endpoint
Methods: `bounties.list`, `bounties.get`, `bounties.create`, `workers.available`

## Mock Mode
App runs fully on mock data. Connect Supabase by setting:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
