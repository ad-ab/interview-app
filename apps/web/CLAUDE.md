# Frontend App — CLAUDE.md

## Package Purpose

React 18 frontend with TanStack Router.
Consumes API from ../api backend.

## Tech Stack

- React 18 + TypeScript (strict)
- Vite bundler
- TanStack Router for client-side routing
- TanStack Query for server state
- **IBM Carbon Design System** (`@carbon/react`) — primary component library
- **Tailwind CSS** — utility classes, prefixed with `tw-` to avoid collision with Carbon (e.g. `tw-mb-4`, `tw-font-bold`)
- **react-i18next** — internationalization

## Project Structure

```
src/
  components/         # Reusable React components
    dashboard/        # Dashboard-specific tiles/widgets
    TopBar.tsx        # Global header (forced dark theme via Carbon <Theme g100>)
  routes/             # TanStack Router route modules
    DashboardPage.tsx
    configuration/
      ConfigurationLayout.tsx   # Sidebar + <Outlet/> for children
      PoolsPage.tsx
      PerformancePage.tsx
      CoolingPage.tsx
    system/
      SystemLayout.tsx          # Sidebar + <Outlet/> for children
      SettingsPage.tsx
      NetworkPage.tsx
      LogPage.tsx
  context/            # React context providers (ThemeContext, SidebarContext)
  hooks/              # Custom hooks (useMediaQuery, etc.)
  services/           # API service layer (fetch calls)
  i18n/               # i18next setup and locale files
    index.ts
    locales/
      en.json
      es.json
      de.json
  lib/                # Misc utilities (breakpoints, etc.)
  types/              # Frontend-specific types
  App.tsx
  main.tsx
```

## Styling — Carbon + Tailwind

- **Prefer Carbon components and tokens first.** Use `@carbon/react` components (`Tile`, `Grid`, `Column`, `SideNav`, `Header`, etc.) for structural UI.
- **Carbon type classes** for typography: `cds--type-heading-01`..`cds--type-heading-07`, `cds--type-body-01`, `cds--type-body-compact-01`, etc. Prefer these over raw Tailwind `text-*` for text that should align with the Carbon scale.
- **Carbon color tokens** via CSS variables: `var(--cds-text-primary)`, `var(--cds-text-secondary)`, `var(--cds-text-placeholder)`, `var(--cds-layer-01)`, `var(--cds-border-subtle)`, etc. Never hard-code hex colors — tokens auto-flip with the active Carbon theme (`white` / `g100`).
- **Tailwind utilities are prefixed with `tw-`** (configured in `tailwind.config.js`). Use for spacing, flex, grid gaps, and non-Carbon layout adjustments: `tw-mb-4`, `tw-flex`, `tw-gap-2`, `tw-p-8`.
- **Theme scoping**: wrap a subtree in `<Theme theme="g100">` (imported as `CarbonTheme` in `TopBar.tsx` to avoid name clash with the local `Theme` enum) to force a specific Carbon theme for that subtree only.
- **Global theme** is managed via `ThemeContext` (`src/context/ThemeContext.tsx`) with `LIGHT` / `DARK` / `SYSTEM` preference. The top bar language/theme switchers live in `TopBar.tsx`.

## TanStack Router Setup

Routes are **code-based** (not file-based). All routes are assembled in `src/main.tsx` using `createRootRoute` / `createRoute` / `.addChildren()`.

Current route tree:

```
/                          → redirects to /dashboard
/dashboard                 → DashboardPage
/configuration             → ConfigurationLayout (redirects to /configuration/pools)
  /configuration/pools
  /configuration/performance
  /configuration/cooling
/system                    → SystemLayout (redirects to /system/settings)
  /system/settings
  /system/network
  /system/log
```

**Layout pattern for sections with a sidebar** (Configuration, System):

1. A parent route registers a `*Layout.tsx` component containing a Carbon `<SideNav>` and an `<Outlet/>`.
2. Child routes set `getParentRoute: () => parentRoute` so they render inside the layout's `<Outlet/>`.
3. The parent route uses `beforeLoad` to redirect bare `/section` → first child page.
4. `TopBar.tsx` checks `pathname.startsWith("/section")` to show a mobile hamburger (`HeaderMenuButton`) that toggles the sidebar via `SidebarContext`.

To add a new section, follow the existing `system/` folder structure.

## Internationalization (i18n)

- Library: **react-i18next** (configured in `src/i18n/index.ts`).
- Supported languages: **English (en), Spanish (es), German (de)**. Default: English.
- Selected language persists in `localStorage` under key `language`.
- Locale files live in `src/i18n/locales/*.json` — one JSON per language, keys kept in sync across all files.
- Language switcher is in `TopBar.tsx` (globe button in the header).

### Using translations in components

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("nav.dashboard")}</h1>;
}
```

### Interpolation

Use `{{var}}` placeholders in locale strings:

```json
// en.json
{ "dashboard": { "hostname": "Hostname: {{name}}" } }
```

```tsx
t("dashboard.hostname", { name: "Antminer" });
// → "Hostname: Antminer"
```

### Rules for adding new strings

1. **Never hard-code user-facing strings in components.** Add a key to all three locale files first.
2. Organize keys by feature namespace: `nav.*`, `config.*`, `system.*`, `dashboard.*`, `overview.*`, `chart.*`, `common.*`, `theme.*`, `topbar.*`.
3. Keep keys in the same order across `en.json`, `es.json`, `de.json` to make diffs clean.
4. Device model names, brand names, and hostnames are **not** translated.

## API Integration

- All API types come from `@myapp/shared/src/api-types.ts`
- API calls in `services/` layer (e.g., `userService.ts`)
- Use TanStack Query for caching/state management
- Error boundary for error handling

## Component Guidelines

- Functional components with hooks only
- Props interfaces defined inline or in `types/`
- One component per file
- Prefer Carbon components + tokens over custom CSS
- When a component repeats inline markup (e.g. tile headers), extract it into `src/components/` — see `DashboardTileHeader.tsx` for the pattern

## Development Workflow

1. Define new API types in `@myapp/shared` if needed
2. Create service method in `services/` (e.g., `userService.ts`)
3. Use `useQuery` from TanStack Query in component
4. Add i18n keys to all three locale files for any new UI strings
5. Handle loading/error states with proper UI

## Common Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code
- `npm run type-check` — Check TypeScript types

## Key Files to Know

- `src/main.tsx` — Entry point, full route tree definition
- `src/App.tsx` — Root component, providers (Theme, Sidebar, QueryClient)
- `src/routes/` — All route components
- `src/components/TopBar.tsx` — Global header (forced dark via Carbon `<Theme g100>`)
- `src/context/ThemeContext.tsx` — Carbon theme preference + system-preference detection
- `src/context/SidebarContext.tsx` — Mobile sidebar open/close state
- `src/i18n/index.ts` — react-i18next setup
- `src/i18n/locales/*.json` — Translation strings
- `src/services/` — API client layer
