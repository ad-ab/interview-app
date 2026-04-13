# Fullstack Application

Rust backend (Actix-web) + React frontend (TanStack Router) monorepo.

## Example Frontend Feature Dev



https://github.com/user-attachments/assets/be06419e-2224-470d-9eb4-3ef50ed7268b




Press play to see the video.

## Quick Start

### Prerequisites

- Rust 1.70+
- Node.js 18+
- pnpm

### Development

```bash
# Install dependencies
pnpm install

# Start both backend and frontend
pnpm dev

# Or start separately:
pnpm dev:backend  # Rust API on http://localhost:8000
pnpm dev:frontend # React app on http://localhost:5173
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

## Project Structure

- `apps/api` — Rust Actix-web backend
- `apps/web` — React + TanStack Router frontend
- `packages/shared` — Shared types and utilities

## Development with Claude Code

```bash
cd my-fullstack-app
claude
```

See `.claude/CLAUDE.md` for Claude Code instructions.
