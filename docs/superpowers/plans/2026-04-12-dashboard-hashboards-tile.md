# Dashboard Hash Boards Tile & Enum Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract shared enums from OverviewTile into `src/enums.ts`, remove the Mining Pools and Recent Events tiles, and replace them with a full-width Hash Boards data table on the Dashboard.

**Architecture:** Create a new `src/enums.ts` file for cross-module enums, then build `HashBoardsTile` as a self-contained Carbon Table component with component-local mock data. DashboardPage is simplified by removing two inline sub-components and rendering HashBoardsTile in their place.

**Tech Stack:** React 18, TypeScript (strict), IBM Carbon Design System (`@carbon/react` — `Tile`, `Table`, `TableHead`, `TableRow`, `TableHeader`, `TableBody`, `TableCell`), Tailwind CSS (`tw-` prefix).

---

## File Map

| File | Action |
|------|--------|
| `apps/web/src/enums.ts` | **Create** — four shared enums; UNITS expanded with VOLTAGE, FREQUENCY, HASHRATEERRORS |
| `apps/web/src/components/dashboard/OverviewTile.tsx` | **Modify** — remove four `const enum` blocks, add import from `@/enums` |
| `apps/web/src/mockData.tsx` | **Modify** — remove `MOCK_POOLS` and `MOCK_EVENTS` |
| `apps/web/src/routes/DashboardPage.tsx` | **Modify** — remove `PoolsSection`, `EventLog`, nested Grid; add `HashBoardsTile` |
| `apps/web/src/components/dashboard/HashBoardsTile.tsx` | **Create** — new tile with Carbon Table |

---

### Task 1: Create `src/enums.ts`

**Files:**
- Create: `apps/web/src/enums.ts`

- [ ] **Step 1: Create the enums file**

Create `apps/web/src/enums.ts` with the following content (converting from `const enum` to `export enum` so they are importable across module boundaries):

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

- [ ] **Step 2: Verify TypeScript is happy**

```bash
cd apps/web && npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/enums.ts
git commit -m "feat(BR-6): add shared enums.ts with expanded UNITS enum"
```

---

### Task 2: Migrate OverviewTile to import from `@/enums`

**Files:**
- Modify: `apps/web/src/components/dashboard/OverviewTile.tsx`

- [ ] **Step 1: Remove the four `const enum` declarations from OverviewTile.tsx**

Delete these blocks (lines 8–36 in the original file):

```ts
const enum UNITS {
  TEMPERATURE = "°C",
  HASHRATE = "TH/s",
  EFFICIENCY = "W/THs",
  POWER = "kW",
  RPM = "RPM",
}

const enum POOL_STATUS {
  ALIVE = "alive",
  DEAD = "dead",
  DEGRADED = "degraded",
}

const enum TUNER_STATUS {
  STABLE = "stable",
  UNSTABLE = "unstable",
  ERROR = "error",
}

const enum METRIC_LABEL {
  REAL_HASHRATE = "realHashrate",
  TEMPERATURE = "temperature",
  EFFICIENCY = "efficiency",
  POWER = "power",
  DPS = "dps",
  POOL_STATUS = "poolStatus",
  TUNER_STATUS = "tunerStatus",
}
```

- [ ] **Step 2: Add the import at the top of OverviewTile.tsx**

After the existing imports, add:

```ts
import { UNITS, POOL_STATUS, TUNER_STATUS } from "@/enums";
```

Note: `METRIC_LABEL` is declared in the original file but not actually used in component logic — do not import it unless usage is found.

- [ ] **Step 3: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: no errors. All `UNITS.*`, `POOL_STATUS.*`, `TUNER_STATUS.*` references in OverviewTile must still resolve correctly.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/dashboard/OverviewTile.tsx
git commit -m "feat(BR-6): migrate OverviewTile to import enums from @/enums"
```

---

### Task 3: Remove `MOCK_POOLS` and `MOCK_EVENTS` from mockData

**Files:**
- Modify: `apps/web/src/mockData.tsx`

- [ ] **Step 1: Delete MOCK_POOLS and MOCK_EVENTS from mockData.tsx**

Remove the following exports entirely from `apps/web/src/mockData.tsx`:

```ts
export const MOCK_POOLS = [
  { name: "Braiins Pool", share: 60, accepted: "14,823", rejected: "12", latency: "18 ms" },
  { name: "Slush Pool",   share: 30, accepted: "7,412",  rejected: "8",  latency: "24 ms" },
  { name: "F2Pool",       share: 10, accepted: "2,471",  rejected: "4",  latency: "41 ms" },
];

export const MOCK_EVENTS = [
  { time: "14:32", type: "info",    msg: "Pool failover: switched to Slush Pool" },
  { time: "13:15", type: "warning", msg: "Worker #5 hashrate dropped to 0" },
  { time: "11:40", type: "info",    msg: "Firmware updated to BOS+ 23.04" },
  { time: "09:02", type: "success", msg: "New best share submitted" },
  { time: "08:55", type: "warning", msg: "Chip temp exceeded 75°C on board 2" },
];
```

Also remove the `// ── Dashboard — DashboardPage ────` section comment if it becomes empty.

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: errors if DashboardPage still imports these — that's fine, we fix it in Task 4.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/mockData.tsx
git commit -m "feat(BR-6): remove MOCK_POOLS and MOCK_EVENTS from mockData"
```

---

### Task 4: Simplify DashboardPage — remove old tiles, add HashBoardsTile

**Files:**
- Modify: `apps/web/src/routes/DashboardPage.tsx`

- [ ] **Step 1: Replace DashboardPage.tsx with the simplified version**

Replace the entire file content with:

```tsx
import { Grid, Column } from "@carbon/react";
import { useTranslation } from "react-i18next";
import HashrateChartTile from "../components/dashboard/HashrateChartTile";
import OverviewTile from "../components/dashboard/OverviewTile";
import HashBoardsTile from "../components/dashboard/HashBoardsTile";
import DashboardTileHeader from "../components/DashboardTileHeader";

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <main className="tw-w-full tw-mt-6">
      <Grid fullWidth>
        <Column sm={4} md={8} lg={16}>
          <DashboardTileHeader
            title="Antminer S19J Pro"
            info={t("dashboard.hostname", { name: "Antminer" })}
          />
        </Column>

        <Column sm={4} md={8} lg={11}>
          <div className="tw-mb-4">
            <HashrateChartTile />
          </div>
          <div className="tw-mb-4">
            <HashBoardsTile />
          </div>
        </Column>

        <Column sm={4} md={8} lg={5}>
          <div className="tw-mb-4">
            <OverviewTile />
          </div>
        </Column>
      </Grid>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: error about missing `HashBoardsTile` module — that's expected, we create it in Task 5.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/routes/DashboardPage.tsx
git commit -m "feat(BR-6): remove PoolsSection/EventLog from DashboardPage, wire HashBoardsTile"
```

---

### Task 5: Create `HashBoardsTile` component

**Files:**
- Create: `apps/web/src/components/dashboard/HashBoardsTile.tsx`

- [ ] **Step 1: Create the component file**

Create `apps/web/src/components/dashboard/HashBoardsTile.tsx`:

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from "@carbon/react";
import TileTitle from "@/components/TileTitle";
import { UNITS } from "@/enums";

interface BoardRow {
  id: number;
  hashrate: number;
  voltage: number;
  boardTemp: number;
  chipTemp: number;
  freq: number;
  asic: number;
  hwErr: number;
}

const BOARD_ROWS: BoardRow[] = [
  { id: 1, hashrate: 24.83, voltage: 12.40, boardTemp: 68, chipTemp: 78, freq: 650.0, asic: 108, hwErr: 0.0 },
  { id: 2, hashrate: 31.47, voltage: 12.38, boardTemp: 72, chipTemp: 84, freq: 725.5, asic: 108, hwErr: 0.0 },
  { id: 3, hashrate: 18.92, voltage: 12.35, boardTemp: 61, chipTemp: 74, freq: 562.5, asic: 108, hwErr: 0.0 },
];

const HEADERS = [
  { key: "id",        header: "ID"                 },
  { key: "hashrate",  header: `Real Hashrate`       },
  { key: "voltage",   header: `Voltage`             },
  { key: "boardTemp", header: "Board Temp"          },
  { key: "chipTemp",  header: "Chip Temp"           },
  { key: "freq",      header: "Frequency"           },
  { key: "asic",      header: "ASIC#"               },
  { key: "hwErr",     header: "HW Error Hashrate"   },
];

export default function HashBoardsTile() {
  return (
    <Tile className="tw-p-5">
      <TileTitle>Hash Boards</TileTitle>
      <Table size="sm" useZebraStyles={false}>
        <TableHead>
          <TableRow>
            {HEADERS.map((h) => (
              <TableHeader key={h.key}>{h.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody style={{ background: "transparent" }}>
          {BOARD_ROWS.map((row) => (
            <TableRow key={row.id} style={{ background: "transparent" }}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.hashrate.toFixed(2)} {UNITS.HASHRATE}</TableCell>
              <TableCell>{row.voltage.toFixed(2)} {UNITS.VOLTAGE}</TableCell>
              <TableCell>{row.boardTemp} {UNITS.TEMPERATURE}</TableCell>
              <TableCell>{row.chipTemp} {UNITS.TEMPERATURE}</TableCell>
              <TableCell>{row.freq.toFixed(1)} {UNITS.FREQUENCY}</TableCell>
              <TableCell>{row.asic}</TableCell>
              <TableCell>{row.hwErr.toFixed(3)} {UNITS.HASHRATEERRORS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Tile>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
cd apps/web && npm run lint
```

Expected: no errors.

- [ ] **Step 4: Start the dev server and visually verify**

```bash
cd /path/to/my-fullstack-app && pnpm dev:frontend
```

Open `http://localhost:5173/dashboard` in the browser. Verify:
- The HashrateChartTile is still visible at the top of the lg=11 column
- Below it, a "Hash Boards" tile appears with a 3-row table
- The 8 columns are all present with correct units appended (TH/s, V, °C, °C, MHz, H/s)
- ASIC# column shows 108 for all rows
- HW Error Hashrate shows 0.000
- The Recent Events and Mining Pools tiles are gone
- The OverviewTile on the right is unchanged

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/dashboard/HashBoardsTile.tsx
git commit -m "feat(BR-6): add HashBoardsTile component with Carbon Table"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|-----------------|------|
| Extract enums from OverviewTile to `src/enums.ts` | Task 1 + 2 |
| Expand UNITS with VOLTAGE, FREQUENCY, HASHRATEERRORS | Task 1 |
| Remove Recent Events tile | Task 3 + 4 |
| Remove Mining Pools tile | Task 3 + 4 |
| Stretch HashBoardsTile full width of lg=11 column | Task 4 |
| TileTitle "Hash Boards" | Task 5 |
| Carbon Table with transparent body | Task 5 |
| 8 columns with correct formats and units | Task 5 |
| Static 3 rows, component-private | Task 5 |
| ASIC# static 108 | Task 5 |
| HW Error Hashrate 0.000 H/s | Task 5 |
| Remove MOCK_POOLS / MOCK_EVENTS | Task 3 |

All requirements covered. No gaps found.

### Placeholder scan

No TBDs, TODOs, or vague steps. All code blocks are complete.

### Type consistency

- `UNITS.HASHRATE`, `UNITS.VOLTAGE`, `UNITS.TEMPERATURE`, `UNITS.FREQUENCY`, `UNITS.HASHRATEERRORS` — all defined in Task 1, used in Task 5. ✓
- `BoardRow` interface defined and used within Task 5 only. ✓
- `TileTitle` import path `@/components/TileTitle` matches the file at `src/components/TileTitle.tsx`. ✓
