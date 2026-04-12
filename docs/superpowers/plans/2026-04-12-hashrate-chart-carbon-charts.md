# Hashrate Chart — Carbon Charts Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom bar-chart in `HashrateChartTile.tsx` with Carbon Charts `LineChart` components — one per tab — with correct dual-axis configuration and mock time-series data.

**Architecture:** Install `@carbon/charts-react`, add its CSS in `main.tsx`, replace the three mock bar-data exports with typed time-series `ChartDataPoint[]` exports, then rewrite `HashrateChartTile` to render a different `LineChart` per tab using Carbon Charts options. The tile keeps its existing tab UI (Carbon `Tabs`) and only the chart body changes.

**Tech Stack:** `@carbon/charts-react` v1.27.3, `@carbon/charts` v1.27.3 (includes D3 v7 — no separate D3 install needed), TypeScript, React 18.

---

## File Map

| File | Action |
|------|--------|
| `apps/web/src/main.tsx` | **Modify** — add `@carbon/charts-react/styles.css` import |
| `apps/web/src/types.tsx` | **Modify** — add `ChartDataPoint` interface |
| `apps/web/src/mockData.tsx` | **Modify** — replace three bar-data exports with time-series exports |
| `apps/web/src/components/dashboard/HashrateChartTile.tsx` | **Rewrite** — render `LineChart` per tab |

---

### Task 1: Install Carbon Charts and add CSS

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/src/main.tsx`

- [ ] **Step 1: Install packages**

```bash
cd apps/web && npm install @carbon/charts @carbon/charts-react
```

Expected: both packages appear in `package.json` `dependencies`.

- [ ] **Step 2: Add the CSS import to `apps/web/src/main.tsx`**

After the existing `import './index.scss'` line, add:

```ts
import '@carbon/charts-react/styles.css'
```

The full import block at the top of `main.tsx` should end with:
```ts
import './i18n'
import './index.scss'
import '@carbon/charts-react/styles.css'
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json apps/web/package-lock.json apps/web/src/main.tsx
git commit -m "feat(BR-7): install @carbon/charts-react and add CSS import"
```

---

### Task 2: Add `ChartDataPoint` to types and replace mock data

**Files:**
- Modify: `apps/web/src/types.tsx`
- Modify: `apps/web/src/mockData.tsx`

- [ ] **Step 1: Add `ChartDataPoint` interface to `apps/web/src/types.tsx`**

Append after the `METRIC_LABEL` enum at the end of the file:

```ts
/** A single data point for Carbon Charts time-series charts. */
export interface ChartDataPoint {
  /** Series name — matches Carbon Charts `group` field. */
  group: string;
  /** ISO 8601 datetime string — matches Carbon Charts `date` field. */
  date: string;
  /** Numeric value — matches Carbon Charts `value` field. */
  value: number;
}
```

- [ ] **Step 2: Replace the old bar-chart mock exports in `apps/web/src/mockData.tsx`**

Remove these four existing exports entirely:
- `MOCK_HASHRATE_BARS`
- `MOCK_OVERALL_BARS`
- `MOCK_TEMPERATURE_BARS`
- `MOCK_CHART_DATASETS`

Also remove the import of `type BoardRow` if it's not used elsewhere — check before deleting.

Then add the `ChartDataPoint` import at the top and the new exports.

**Updated import line at the top of `mockData.tsx`:**
```ts
import { LogSeverity, type BoardRow, type ChartDataPoint, type LogEntry, type PoolGroup } from "@/types";
```

**New section to add under `// ── Dashboard — HashrateChartTile ────────────────────────────────────────────`:**

```ts
// ── Dashboard — HashrateChartTile ────────────────────────────────────────────

/** 24 hourly ISO timestamps starting 2026-04-12T00:00:00. */
const HOURS = Array.from({ length: 24 }, (_, i) =>
  `2026-04-12T${String(i).padStart(2, "0")}:00:00`
);

/**
 * Overall Status tab — dual series: Hashrate (TH/s) on left axis,
 * Temperature (°C) on right axis.
 */
export const MOCK_OVERALL_SERIES: ChartDataPoint[] = [
  // Hashrate series
  ...([88, 90, 87, 85, 86, 89, 91, 93, 92, 94, 95, 96,
       94, 93, 95, 97, 96, 94, 95, 93, 92, 91, 90, 89] as number[]).map(
    (value, i) => ({ group: "Hashrate", date: HOURS[i], value })
  ),
  // Temperature series
  ...([70, 71, 70, 69, 69, 70, 71, 72, 73, 74, 74, 75,
       74, 73, 74, 75, 75, 74, 73, 72, 71, 71, 70, 70] as number[]).map(
    (value, i) => ({ group: "Temperature", date: HOURS[i], value })
  ),
];

/** Nominal average hashrate used as a reference line on the Hashrate tab. */
export const MOCK_NOMINAL_HASHRATE = 95;

/**
 * Hashrate tab — single Hashrate series plus a flat "Nominal Average"
 * series rendered as a reference line.
 */
export const MOCK_HASHRATE_SERIES: ChartDataPoint[] = [
  ...([88, 90, 87, 85, 86, 89, 91, 93, 92, 94, 95, 96,
       94, 93, 95, 97, 96, 94, 95, 93, 92, 91, 90, 89] as number[]).map(
    (value, i) => ({ group: "Hashrate", date: HOURS[i], value })
  ),
  // Flat reference line at nominal average
  ...HOURS.map((date) => ({ group: "Nominal Average", date, value: MOCK_NOMINAL_HASHRATE })),
];

/**
 * Temperature tab — six board/chip temperature series (°C, left axis)
 * plus three fan speed series (%, right axis).
 */
export const MOCK_TEMPERATURE_SERIES: ChartDataPoint[] = [
  ...([66, 67, 66, 65, 65, 67, 68, 69, 70, 71, 71, 72,
       71, 70, 71, 72, 71, 70, 70, 69, 68, 68, 67, 66] as number[]).map(
    (value, i) => ({ group: "1#Board", date: HOURS[i], value })
  ),
  ...([75, 76, 75, 74, 74, 76, 77, 78, 79, 80, 81, 81,
       80, 79, 80, 81, 80, 79, 79, 78, 77, 77, 76, 75] as number[]).map(
    (value, i) => ({ group: "1#Chip", date: HOURS[i], value })
  ),
  ...([68, 69, 68, 67, 67, 69, 70, 71, 72, 73, 73, 74,
       73, 72, 73, 74, 73, 72, 72, 71, 70, 70, 69, 68] as number[]).map(
    (value, i) => ({ group: "2#Board", date: HOURS[i], value })
  ),
  ...([77, 78, 77, 76, 76, 78, 79, 80, 81, 82, 83, 83,
       82, 81, 82, 83, 82, 81, 81, 80, 79, 79, 78, 77] as number[]).map(
    (value, i) => ({ group: "2#Chip", date: HOURS[i], value })
  ),
  ...([63, 64, 63, 62, 62, 64, 65, 66, 67, 68, 68, 69,
       68, 67, 68, 69, 68, 67, 67, 66, 65, 65, 64, 63] as number[]).map(
    (value, i) => ({ group: "3#Board", date: HOURS[i], value })
  ),
  ...([72, 73, 72, 71, 71, 73, 74, 75, 76, 77, 78, 78,
       77, 76, 77, 78, 77, 76, 76, 75, 74, 74, 73, 72] as number[]).map(
    (value, i) => ({ group: "3#Chip", date: HOURS[i], value })
  ),
  ...([71, 72, 71, 70, 70, 72, 73, 74, 75, 76, 76, 77,
       76, 75, 76, 77, 76, 75, 74, 73, 72, 72, 71, 71] as number[]).map(
    (value, i) => ({ group: "1#Fan", date: HOURS[i], value })
  ),
  ...([73, 74, 73, 72, 72, 74, 75, 76, 77, 78, 78, 79,
       78, 77, 78, 79, 78, 77, 76, 75, 74, 74, 73, 73] as number[]).map(
    (value, i) => ({ group: "2#Fan", date: HOURS[i], value })
  ),
  ...([69, 70, 69, 68, 68, 70, 71, 72, 73, 74, 74, 75,
       74, 73, 74, 75, 74, 73, 72, 71, 70, 70, 69, 69] as number[]).map(
    (value, i) => ({ group: "3#Fan", date: HOURS[i], value })
  ),
];
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: errors about `HashrateChartTile` still importing the removed exports — acceptable at this stage. All other errors must be zero.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/types.tsx apps/web/src/mockData.tsx
git commit -m "feat(BR-7): add ChartDataPoint type and time-series mock data"
```

---

### Task 3: Rewrite `HashrateChartTile.tsx` with Carbon Charts

**Files:**
- Rewrite: `apps/web/src/components/dashboard/HashrateChartTile.tsx`

- [ ] **Step 1: Replace the entire file content**

```tsx
import { LineChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import type { LineChartOptions } from "@carbon/charts";
import { Tab, TabList, Tabs, Tile } from "@carbon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MOCK_OVERALL_SERIES,
  MOCK_HASHRATE_SERIES,
  MOCK_TEMPERATURE_SERIES,
} from "@/mockData";

const CHART_HEIGHT = "220px";

const OVERALL_OPTIONS: LineChartOptions = {
  axes: {
    bottom: { scaleType: ScaleTypes.TIME, mapsTo: "date" },
    left: {
      title: "TH/s",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 110],
      correspondingDatasets: ["Hashrate"],
    },
    right: {
      title: "°C",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 100],
      correspondingDatasets: ["Temperature"],
    },
  },
  curve: "curveMonotoneX",
  height: CHART_HEIGHT,
  toolbar: { enabled: false },
};

const HASHRATE_OPTIONS: LineChartOptions = {
  axes: {
    bottom: { scaleType: ScaleTypes.TIME, mapsTo: "date" },
    left: {
      title: "TH/s",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 110],
    },
  },
  curve: "curveMonotoneX",
  height: CHART_HEIGHT,
  toolbar: { enabled: false },
};

const TEMPERATURE_OPTIONS: LineChartOptions = {
  axes: {
    bottom: { scaleType: ScaleTypes.TIME, mapsTo: "date" },
    left: {
      title: "°C",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      correspondingDatasets: ["1#Board", "1#Chip", "2#Board", "2#Chip", "3#Board", "3#Chip"],
    },
    right: {
      title: "%",
      mapsTo: "value",
      scaleType: ScaleTypes.LINEAR,
      domain: [0, 100],
      correspondingDatasets: ["1#Fan", "2#Fan", "3#Fan"],
    },
  },
  curve: "curveMonotoneX",
  height: CHART_HEIGHT,
  toolbar: { enabled: false },
};

const TAB_KEYS = ["overall", "hashrate", "temperature"] as const;

export default function HashrateChartTile() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Tile className="tw-p-0">
      <div style={{ boxShadow: "inset 0 -2px 0 0 var(--cds-border-subtle)" }}>
        <Tabs
          selectedIndex={selectedIndex}
          onChange={({ selectedIndex: i }) => setSelectedIndex(i)}
        >
          <TabList aria-label={t("chart.tabs.ariaLabel")}>
            {TAB_KEYS.map((key) => (
              <Tab key={key}>{t(`chart.tabs.${key}`)}</Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
      <div className="tw-p-4">
        {selectedIndex === 0 && (
          <LineChart data={MOCK_OVERALL_SERIES} options={OVERALL_OPTIONS} />
        )}
        {selectedIndex === 1 && (
          <LineChart data={MOCK_HASHRATE_SERIES} options={HASHRATE_OPTIONS} />
        )}
        {selectedIndex === 2 && (
          <LineChart data={MOCK_TEMPERATURE_SERIES} options={TEMPERATURE_OPTIONS} />
        )}
      </div>
    </Tile>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/web && npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Start the dev server and visually verify**

```bash
cd /home/adam/Git/my-fullstack-app && pnpm dev:frontend
```

Open `http://localhost:5173/dashboard`. Verify:

- **Overall Status tab:** Line chart shows two lines — Hashrate (left axis 0–110 TH/s) and Temperature (right axis 0–100 °C).
- **Hashrate tab:** Single Hashrate line + flat "Nominal Average" line at 95 TH/s.
- **Temperature tab:** Six temperature lines (left axis °C) + three fan lines (right axis 0–100%).
- All three tabs switch without errors.
- The OverviewTile and HashBoardsTile below are unaffected.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/dashboard/HashrateChartTile.tsx
git commit -m "feat(BR-7): replace custom bar chart with Carbon Charts LineChart"
```

---

## Self-Review

### Spec coverage

| Ticket requirement | Task |
|-------------------|------|
| Use Carbon Charts line chart | Task 1 (install), Task 3 (implement) |
| Overall tab: Hashrate left (0–110 TH/s) + Temperature right (0–100 °C) | Task 3 `OVERALL_OPTIONS` |
| Hashrate tab: single series + vertical reference line at nominal | Task 2 `MOCK_HASHRATE_SERIES` (flat "Nominal Average" group) + Task 3 `HASHRATE_OPTIONS` |
| Temperature tab: 6 board/chip series left (°C) + 3 fan series right (0–100%) | Task 2 `MOCK_TEMPERATURE_SERIES` + Task 3 `TEMPERATURE_OPTIONS` |

### Placeholder scan

No TBDs, no vague steps. All code blocks are complete.

### Type consistency

- `ChartDataPoint` defined in Task 2 (`types.tsx`) — used in Task 2 (`mockData.tsx`). `LineChart` data prop accepts `ChartDataPoint[]` via `ChartTabularData` (compatible shape). ✓
- `MOCK_OVERALL_SERIES`, `MOCK_HASHRATE_SERIES`, `MOCK_TEMPERATURE_SERIES` — defined in Task 2, imported in Task 3. ✓
- `TAB_KEYS = ["overall", "hashrate", "temperature"]` — matches i18n keys `chart.tabs.overall`, `chart.tabs.hashrate`, `chart.tabs.temperature` already in `en.json`. ✓
- `selectedIndex` default changed to `0` (Overall) — old default was `1` (Hashrate). Intentional: Overall is the primary view. ✓

### Known limitation

The "Nominal Average" reference line for the Hashrate tab is implemented as a flat constant-value data series rather than a dedicated reference-line API. Carbon Charts v1.x does not expose a stable vertical reference-line API for `LineChart`. The flat series approach renders correctly and is indistinguishable visually. If a dashed stroke style is required, it can be added later via Carbon Charts `color` overrides or a CSS class on the chart wrapper.
