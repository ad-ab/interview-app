# My Fullstack App — CLAUDE.md

## Project Overview
Fullstack application with Rust backend (Actix-web) and React frontend (TanStack Router).
This is a monorepo managed with pnpm workspaces.

## Architecture
- **Backend**: Rust/Actix-web API
- **Frontend**: React 18 + TanStack Router + TypeScript  
- **Shared**: TypeScript types (@myapp/shared)

## Technology Stack

### Frontend
- React 18
- TypeScript (strict mode)
- Vite bundler
- TanStack Router
- TanStack Query
- Tailwind CSS

### Backend
- Rust 1.70+
- Actix-web 4.x
- Tokio
- Serde JSON

## Key Commands

### Development
- `pnpm dev` — Start both frontend and backend
- `pnpm dev:backend` — Start Rust server
- `pnpm dev:frontend` — Start React dev server

### Build & Test
- `pnpm build` — Build all
- `pnpm test` — Test all
- `cd apps/api && cargo fmt` — Format Rust code
- `cd apps/web && npm run lint` — Lint React code

## Directory Layout
- `apps/api/` — Rust backend
- `apps/web/` — React frontend
- `packages/shared/` — Shared types
- `.claude/skills/` — Claude Code skills

## Development Rules
- Import shared types from @myapp/shared
- Never duplicate API types
- Use error types consistently
- Keep CLAUDE.md files under 10k words

## Start Claude Code
```bash
cd my-fullstack-app
claude
```

See apps/api/CLAUDE.md and apps/web/CLAUDE.md for package-specific details.
