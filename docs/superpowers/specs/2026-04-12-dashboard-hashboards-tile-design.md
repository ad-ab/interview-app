# Dashboard — Hash Boards Tile & Enum Refactor

**Date:** 2026-04-12  
**Status:** Approved

---

## Summary

Refactor the Dashboard page to:

1. Extract inline sub-components into their own files.
2. Remove the `Recent Events` tile entirely.
3. Replace `Mining Pools` with a new full-width `Hash Boards` tile containing a data table.
4. Move all enums from `OverviewTile.tsx` into a new `src/enums.ts` file, expanding `UNITS` with three new entries.

---

## 1. Enum Extraction — `src/enums.ts`

Create `apps/web/src/enums.ts`. Move the following enums out of `OverviewTile.tsx`, converting from `const enum` to regular `export enum` (required for cross-module imports):

```ts
export enum UNITS {
  TEMPERATURE = "°C",
  HASHRATE = "TH/s",
  EFFICIENCY = "W/THs",
  POWER = "kW",
  RPM = "RPM",
  VOLTAGE = "V",
  FREQUENCY = "MHz",
  HASHRATEERRORS = "H/s",
}

export enum POOL_STATUS {
  ALIVE = "alive",
  DEAD = "dead",
  DEGRADED = "degraded",
}

export enum TUNER_STATUS {
  STABLE = "stable",
  UNSTABLE = "unstable",
  ERROR = "error",
}

export enum METRIC_LABEL {
  REAL_HASHRATE = "realHashrate",
  TEMPERATURE = "temperature",
  EFFICIENCY = "efficiency",
  POWER = "power",
  DPS = "dps",
  POOL_STATUS = "poolStatus",
  TUNER_STATUS = "tunerStatus",
}
```

**Update `OverviewTile.tsx`:** remove the four `const enum` declarations; add `import { UNITS, POOL_STATUS, TUNER_STATUS, METRIC_LABEL } from "@/enums"`.

---

## 2. Layout Changes — `DashboardPage.tsx`

### Remove

- `PoolsSection` inline component (and its `MOCK_POOLS` import)
- `EventLog` inline component (and its `MOCK_EVENTS` import)
- The nested `<Grid>` that placed those two side-by-side

### Add

- Import `HashBoardsTile` from `@/components/dashboard/HashBoardsTile`
- Render `<HashBoardsTile />` directly below `<HashrateChartTile />`, spanning the full `lg={11}` column — no nested grid needed

### Resulting column structure

```
lg={11}
  <HashrateChartTile />     ← unchanged
  <HashBoardsTile />        ← new, full width of the lg=11 column

lg={5}
  <OverviewTile />          ← unchanged
```

---

## 3. New Component — `src/components/dashboard/HashBoardsTile.tsx`

### Heading

Use `<TileTitle>Hash Boards</TileTitle>` (the shared `src/components/TileTitle.tsx` component).

### Container

Wrap in `<Tile>` with standard `tw-p-5` padding.

### Table

Use Carbon's `<Table>`, `<TableHead>`, `<TableRow>`, `<TableHeader>`, `<TableBody>`, `<TableCell>` components from `@carbon/react`.

The `<TableBody>` must be transparent so the tile background shows through — apply `style={{ background: "transparent" }}` on the `<TableBody>` (and `<TableRow>` if Carbon overrides it).

### Columns

| Header            | Value format  | Notes                                                          |
| ----------------- | ------------- | -------------------------------------------------------------- |
| ID                | `1`, `2`, `3` | Row index, 1-based                                             |
| Real Hashrate     | `XX.XX TH/s`  | 10–40 range, 2 decimal places; unit from `UNITS.HASHRATE`      |
| Voltage           | `XX.XX V`     | 2 decimal places; unit from `UNITS.VOLT`                       |
| Board Temp        | `XX °C`       | 40–100 range, integer; unit from `UNITS.TEMPERATURE`           |
| Chip Temp         | `XX °C`       | Higher than Board Temp, integer; unit from `UNITS.TEMPERATURE` |
| Frequency         | `XXX.X MHz`   | 500–1000 range, 1 decimal place; unit from `UNITS.MHZ`         |
| ASIC#             | `108`         | Static value, no unit                                          |
| HW Error Hashrate | `0.000 H/s`   | Fixed at zero, 3 decimal places; unit from `UNITS.H_S`         |

### Mock rows (component-private, not exported to `mockData.tsx`)

Three rows of hardcoded representative values defined as a local `const` inside the component file. These are static UI scaffolding, not reusable mock data.

Example shape:

```ts
const BOARD_ROWS = [
  {
    id: 1,
    hashrate: 24.83,
    voltage: 12.4,
    boardTemp: 68,
    chipTemp: 78,
    freq: 650.0,
    asic: 108,
    hwErr: 0.0,
  },
  {
    id: 2,
    hashrate: 31.47,
    voltage: 12.38,
    boardTemp: 72,
    chipTemp: 84,
    freq: 725.5,
    asic: 108,
    hwErr: 0.0,
  },
  {
    id: 3,
    hashrate: 18.92,
    voltage: 12.35,
    boardTemp: 61,
    chipTemp: 74,
    freq: 562.5,
    asic: 108,
    hwErr: 0.0,
  },
];
```

---

## 4. Mock Data Cleanup — `src/mockData.tsx`

Remove:

- `MOCK_POOLS` export and its data
- `MOCK_EVENTS` export and its data

These are no longer consumed anywhere.

---

## 5. Files Affected

| File                                          | Action                                                           |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `src/enums.ts`                                | **Create** — all four enums, UNITS expanded                      |
| `src/components/dashboard/OverviewTile.tsx`   | **Edit** — remove `const enum` blocks, add import from `@/enums` |
| `src/components/dashboard/HashBoardsTile.tsx` | **Create** — new tile component                                  |
| `src/routes/DashboardPage.tsx`                | **Edit** — remove PoolsSection + EventLog, add HashBoardsTile    |
| `src/mockData.tsx`                            | **Edit** — remove MOCK_POOLS and MOCK_EVENTS                     |

---

## Out of Scope

- No i18n keys needed — column headers are English-only static labels for now.
- No API wiring — table uses component-local static data.
- No changes to `HashrateChartTile`, `OverviewTile` behavior, or any other page.
