# Frontend App — CLAUDE.md

## Package Purpose

React 18 frontend with TanStack Router.
Consumes API from ../api backend.

## Tech Stack

- React 18 + TypeScript (strict)
- Vite bundler
- TanStack Router for client-side routing
- TanStack Query for server state
- **IBM Carbon Design System** (`@carbon/react`, `@carbon/icons-react`) — primary component library
- **Tailwind CSS** — utility classes, prefixed with `tw-` to avoid collision with Carbon (e.g. `tw-mb-4`, `tw-font-bold`)
- **react-i18next** — internationalization

## Project Structure

```
src/
  components/             # Reusable React components
    dashboard/            # Dashboard-specific tiles/widgets
    TopBar.tsx            # Global header (forced dark theme via Carbon <Theme g100>)
    PageTitle.tsx          # Shared <h1> wrapper for page headings
    TileTitle.tsx          # Shared <h2> wrapper for section headings above tiles
    ThemeIcon.tsx          # Shared half-moon SVG (used in TopBar + Settings)
    BraiinsWordmark.tsx    # Braiins full wordmark SVG
    BraiinsOsIcon.tsx      # Braiins OS compact glyph SVG
    LogsTable.tsx          # Log page data table with severity filter + pagination
    DashboardTileHeader.tsx
  routes/                 # TanStack Router route modules
    DashboardPage.tsx
    configuration/
      ConfigurationLayout.tsx
      PoolsPage.tsx
      PerformancePage.tsx
      CoolingPage.tsx
    system/
      SystemLayout.tsx
      SettingsPage.tsx
      NetworkPage.tsx
      LogPage.tsx
  context/                # React context providers
    ThemeContext.tsx       # Carbon theme preference + system-preference detection
    SidebarContext.tsx     # Mobile sidebar open/close state
  hooks/                  # Custom hooks
    useMediaQuery.ts
    useFormat.ts           # Locale-aware formatDate, formatDateTime, formatNumber
  services/               # API service layer (fetch calls)
  i18n/                   # i18next setup and locale files
    index.ts
    format.ts              # Raw Intl-based formatDate, formatDateTime, formatNumber
    locales/
      en.json
      es.json
      de.json
  lib/                    # Misc utilities
    breakpoints.ts
  types.tsx               # Shared public types, interfaces, and enums
  const.tsx               # Shared ALL_CAPS app-configuration constants
  mockData.tsx            # All sample/mock data (until real API is wired in)
  regex.tsx               # Shared regular expressions (e.g. IPV4_REGEX)
  ipUtils.tsx             # IP address helpers (e.g. isValidIPv4)
  App.tsx
  main.tsx
```

## Where to Put Things

### Types, interfaces, enums → `src/types.tsx`

All **cross-module** types, interfaces, and enums live here. Examples: `Theme`, `CarbonTheme`, `ThemeOption`, `LanguageOption`, `NetworkProtocol`, `LogSeverity`, `LogEntry`.

- Module-private types (e.g. a component's own `Props` interface, `ThemeContextValue`) stay co-located in the file that owns them.
- Use `export const` arrow functions (not `export function`) for utility exports.

### App-configuration constants → `src/const.tsx`

Shared ALL_CAPS constants that configure UI behaviour: `THEME_OPTIONS`, `LANGUAGE_OPTIONS`, `PROTOCOL_OPTIONS`, `LOG_SEVERITY_OPTIONS`.

- Only **exported, cross-module** constants go here. Component-local constants (e.g. `NAV_ITEMS` in a layout file) stay in their owning file.
- No sample data here — mock data has its own file.

### Mock / sample data → `src/mockData.tsx`

All dummy data lives here until real API endpoints are wired in: `MOCK_WORKERS`, `MOCK_POOLS`, `MOCK_EVENTS`, `MOCK_FANS`, `MOCK_CHART_DATASETS`, `MOCK_LOG_DATA`, etc.

- Prefix every export with `MOCK_` so it's obvious the data is fake.
- When a real API replaces a dataset, delete the export from here and update the consumer to fetch from the service layer.

### Regular expressions → `src/regex.tsx`

Shared regex patterns (e.g. `IPV4_REGEX`). Keep validation helpers that use them in dedicated util files.

### IP / network utilities → `src/ipUtils.tsx`

Helper functions for IP address validation, etc. Uses `IPV4_REGEX` from `regex.tsx`.

### Reusable components → `src/components/`

One component per file. Extract a component when:
- It's used in more than one place (e.g. `PageTitle`, `ThemeIcon`)
- It's a self-contained UI widget (e.g. `LogsTable`)

SVG brand assets (`BraiinsWordmark.tsx`, `BraiinsOsIcon.tsx`) are components, not inline SVG in TopBar.

### Page headings

- **`<PageTitle>`** for every page's `<h1>` heading (bold, `tw-text-2xl`).
- **`<TileTitle>`** for section headings above groups of tiles (bold, `tw-text-base`). Not every page uses one — e.g. Network has no TileTitle, Settings has "Personal".

### Formatting / i18n utilities → `src/hooks/useFormat.ts` + `src/i18n/format.ts`

- `i18n/format.ts` — raw `Intl`-based helpers: `formatDate`, `formatDateTime`, `formatNumber`.
- `hooks/useFormat.ts` — React hook that wraps the above with the current i18next locale. Components should use this hook, not call `i18n/format.ts` directly.

## Styling — Carbon + Tailwind

- **Prefer Carbon components and tokens first.** Use `@carbon/react` components (`Tile`, `Grid`, `Column`, `SideNav`, `Header`, `ContentSwitcher`, `MultiSelect`, `Toggle`, `TextInput`, `Pagination`, `Table`, etc.) for structural UI.
- **Carbon type classes** for typography: `cds--type-heading-01`..`cds--type-heading-07`, `cds--type-body-01`, `cds--type-body-compact-01`, etc. Prefer these over raw Tailwind `text-*` for text that should align with the Carbon scale.
- **Carbon color tokens** via CSS variables: `var(--cds-text-primary)`, `var(--cds-text-secondary)`, `var(--cds-layer-01)`, `var(--cds-border-subtle)`, etc. Never hard-code hex colors — tokens auto-flip with the active Carbon theme (`white` / `g100`).
- **Primary brand color** is defined as `$primary-color` in `index.scss`. Hover / active variants are derived via Sass `color.scale()` — change the one variable and all variants follow.
- **Tailwind utilities are prefixed with `tw-`** (configured in `tailwind.config.ts`). Use for spacing, flex, grid gaps, and non-Carbon layout adjustments: `tw-mb-4`, `tw-flex`, `tw-gap-2`, `tw-p-8`.
- **Path alias** `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`). Always use `@/` imports, not relative `../../`.

## Vite + Sass Configuration

Configured in `vite.config.ts` per Carbon v11 recommendations:

- `api: 'modern-compiler'` — faster Dart Sass compiler API, no `legacy-js-api` deprecation warnings.
- `loadPaths: ['node_modules']` — lets `@use '@carbon/react'` resolve from the package tree.
- `quietDeps: true` — silences deprecation warnings from Carbon internals.
- `silenceDeprecations` — belt-and-braces list for remaining Carbon deprecation noise.

TypeScript config is split:
- `tsconfig.json` — app code (`src/`), `noEmit: true`.
- `tsconfig.node.json` — `vite.config.ts` only, scoped `types: ["node"]` so Node globals don't leak into browser code.

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
{ "dashboard": { "hostname": "Hostname: {{name}}" } }
```

```tsx
t("dashboard.hostname", { name: "Antminer" });
// → "Hostname: Antminer"
```

### Rules for adding new strings

1. **Never hard-code user-facing strings in components.** Add a key to all three locale files first.
2. Organize keys by feature namespace: `nav.*`, `config.*`, `system.*`, `settings.*`, `network.*`, `log.*`, `dashboard.*`, `overview.*`, `chart.*`, `common.*`, `theme.*`, `topbar.*`.
3. Keep keys in the same order across `en.json`, `es.json`, `de.json` to make diffs clean.
4. Device model names, brand names, and hostnames are **not** translated.

## API Integration

- All API types come from `@myapp/shared/src/api-types.ts`
- API calls in `services/` layer (e.g., `userService.ts`)
- Use TanStack Query for caching/state management
- Error boundary for error handling

## Component Guidelines

- Functional components with hooks only
- `export const` arrow functions for utility exports; `export default function` for components
- Props interfaces defined inline in the component file
- One component per file
- Prefer Carbon components + tokens over custom CSS
- When a component repeats inline markup (e.g. tile headers), extract it into `src/components/`

## Development Workflow

1. Define new API types in `@myapp/shared` if needed
2. Add shared types/enums to `src/types.tsx`, constants to `src/const.tsx`
3. Add mock data to `src/mockData.tsx` (prefix with `MOCK_`)
4. Create service method in `services/` (e.g., `userService.ts`)
5. Use `useQuery` from TanStack Query in component
6. Add i18n keys to **all three** locale files for any new UI strings
7. Use `<PageTitle>` for page headings, `<TileTitle>` for section headings
8. Handle loading/error states with proper UI

## Common Commands

- `pnpm dev` — Start both frontend + backend (from monorepo root)
- `npm run dev` — Start Vite dev server (from this directory)
- `npm run build` — Type-check + build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code
- `npm run type-check` — Check TypeScript types (both app + vite config)

## Key Files to Know

- `src/main.tsx` — Entry point, full route tree definition
- `src/App.tsx` — Root component, providers (Theme, Sidebar, QueryClient)
- `src/types.tsx` — All shared types, interfaces, enums
- `src/const.tsx` — All shared app-configuration constants
- `src/mockData.tsx` — All mock/sample data
- `src/routes/` — All route components
- `src/components/TopBar.tsx` — Global header (forced dark via Carbon `<Theme g100>`)
- `src/components/PageTitle.tsx` — Shared page heading component
- `src/components/TileTitle.tsx` — Shared section heading component
- `src/context/ThemeContext.tsx` — Carbon theme preference + system-preference detection
- `src/context/SidebarContext.tsx` — Mobile sidebar open/close state
- `src/hooks/useFormat.ts` — Locale-aware number/date/dateTime formatting
- `src/i18n/index.ts` — react-i18next setup
- `src/i18n/format.ts` — Raw Intl formatting helpers
- `src/i18n/locales/*.json` — Translation strings
- `src/index.scss` — Global styles, Carbon overrides, brand color (`$primary-color`)
- `src/services/` — API client layer
- `vite.config.ts` — Vite + Sass + Carbon configuration
- `tsconfig.json` — App TypeScript config
- `tsconfig.node.json` — Vite config TypeScript config (scoped Node types)
