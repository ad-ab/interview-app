# BR-4: Configure — Pools Page

## Overview

Implement the Pools page under `/configuration/pools`. This page lets users configure mining pool connections organized by pool groups. For the initial implementation, only the "Default" group is present (not deletable). The architecture supports multiple groups for future expansion.

## Architecture

**Pattern:** Page + Table component (same as LogPage → LogsTable).

- `PoolsPage.tsx` — owns draft state, renders PageTitle + TileTitle + PoolsTable + Add Pool button + Save button
- `PoolsTable.tsx` — receives pools array + callbacks, renders Carbon Table with interactive rows

## Data Types

Added to `src/types.tsx`:

```typescript
interface PoolConfig {
  id: string;        // unique ID for React keys + reordering
  enabled: boolean;
  url: string;       // stratum+tcp://... or stratum+ssl://...
  username: string;
  password: string;
}

interface PoolGroup {
  name: string;      // "Default" for now
  pools: PoolConfig[];
}
```

## Component: PoolsPage

**File:** `src/routes/configuration/PoolsPage.tsx`

**Responsibilities:**
- Initialize draft state from `MOCK_POOL_GROUPS` (single "Default" group with 3 sample pools)
- Render `<PageTitle>{t("pools.title")}</PageTitle>`
- For each group: render `<TileTitle>{group.name}</TileTitle>` + `<Tile>` containing `<PoolsTable>`
- Below each group tile: ghost `<Button>` with `Add` icon — "Add Pool"
- Bottom: primary `<Button>` — "Save" (shows `alert(t("pools.saveTodo"))`)

**State management:**
- `useState<PoolGroup[]>` initialized from mock data
- All changes (toggle, edit, reorder, add, delete) update draft state
- Save commits draft (currently just alert "todo")

**Callbacks passed to PoolsTable:**
- `onToggle(poolId: string)` — flip `enabled`
- `onUpdate(poolId: string, field: keyof PoolConfig, value: string)` — update field
- `onMoveUp(poolId: string)` — swap with previous
- `onMoveDown(poolId: string)` — swap with next
- `onDelete(poolId: string)` — remove from array

## Component: PoolsTable

**File:** `src/components/PoolsTable.tsx`

**Props:**
- `pools: PoolConfig[]`
- `onToggle`, `onUpdate`, `onMoveUp`, `onMoveDown`, `onDelete` — callbacks from parent

**Table columns:**

| # | Column | Width | Component | Notes |
|---|--------|-------|-----------|-------|
| 1 | (no header) | 50px | Carbon `Toggle` | Flips `enabled` via `onToggle` |
| 2 | Pool URL | flex | Carbon `TextInput` | Validated on blur: must start with `stratum+tcp://` or `stratum+ssl://`. Shows `invalid` + `invalidText` on failure |
| 3 | Username | 160px | Carbon `TextInput` | Plain text input |
| 4 | Password | 160px | Carbon `TextInput` type="password" | Same width as Username |
| 5 | Actions | ~120px | Carbon `IconButton` x3 | ArrowUp, ArrowDown, TrashCan |

**Row behavior:**
- Disabled rows (`enabled: false`): input fields render at 50% opacity. Action buttons remain fully interactive.
- ArrowUp disabled on first row, ArrowDown disabled on last row.
- TrashCan hidden when only 1 pool in the group.
- 16px gap between arrow buttons and TrashCan to prevent misclicks.

**Delete confirmation:**
- Clicking TrashCan sets a `confirmingDeleteId` state on the row.
- Row content is replaced with inline confirmation: "Are you sure you want to remove this pool?" + No (ghost button) / Yes (danger button).
- No = cancel (clear `confirmingDeleteId`). Yes = call `onDelete(poolId)`.

## Validation

- Pool URL: must start with `stratum+tcp://` or `stratum+ssl://`. Validated on blur using a regex. Error shown via Carbon `TextInput` `invalid` + `invalidText` props.
- No other field validation for now.

**Regex** (added to `src/regex.tsx`):

```typescript
export const STRATUM_URL_REGEX = /^stratum\+(tcp|ssl):\/\/.+/;
```

## Mock Data

Added to `src/mockData.tsx`:

```typescript
export const MOCK_POOL_GROUPS: PoolGroup[] = [
  {
    name: "Default",
    pools: [
      { id: "1", enabled: true, url: "stratum+tcp://pool.braiins.com:3333", username: "worker1.miner01", password: "x" },
      { id: "2", enabled: true, url: "stratum+tcp://pool.slushpool.com:3333", username: "worker1.backup", password: "x" },
      { id: "3", enabled: false, url: "stratum+ssl://f2pool.com:6688", username: "myworker", password: "x" },
    ],
  },
];
```

## Internationalization

New keys added under `"pools"` namespace in all three locale files (`en.json`, `es.json`, `de.json`):

- `pools.title` — "Pools"
- `pools.columns.url` — "Pool URL"
- `pools.columns.username` — "Username"
- `pools.columns.password` — "Password"
- `pools.columns.actions` — "Actions"
- `pools.addPool` — "Add Pool"
- `pools.save` — "Save"
- `pools.saveTodo` — "todo"
- `pools.validation.invalidUrl` — "Must start with stratum+tcp:// or stratum+ssl://"
- `pools.deleteConfirm` — "Are you sure you want to remove this pool?"
- `pools.deleteYes` — "Yes"
- `pools.deleteNo` — "No"

## Carbon Components Used

- `Tile` — container for the pool table
- `Toggle` — per-row enable/disable
- `TextInput` — Pool URL, Username, Password fields
- `Button` — Save (kind="primary"), Add Pool (kind="ghost")
- `IconButton` — ArrowUp, ArrowDown, TrashCan actions
- Icons: `ArrowUp`, `ArrowDown`, `TrashCan`, `Add` from `@carbon/icons-react`

## Files Changed

| File | Action |
|------|--------|
| `src/types.tsx` | Add `PoolConfig`, `PoolGroup` |
| `src/regex.tsx` | Add `STRATUM_URL_REGEX` |
| `src/mockData.tsx` | Add `MOCK_POOL_GROUPS` |
| `src/routes/configuration/PoolsPage.tsx` | Replace stub with full implementation |
| `src/components/PoolsTable.tsx` | New component |
| `src/i18n/locales/en.json` | Add `pools.*` keys |
| `src/i18n/locales/es.json` | Add `pools.*` keys |
| `src/i18n/locales/de.json` | Add `pools.*` keys |

## Out of Scope

- Multiple pool groups (add/rename/delete groups) — future feature
- Real API integration — Save shows alert("todo") consistent with Settings/Network pages
- Drag-and-drop reordering — using arrow buttons for now
