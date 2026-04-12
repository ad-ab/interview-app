import { LogSeverity, type BoardRow, type ChartDataPoint, type LogEntry, type PoolGroup } from "@/types";

// ── Dashboard — DashboardPage ────────────────────────────────────────────────

export const MOCK_HASH_BOARDS: readonly BoardRow[] = [
  { id: 1, hashrate: 24.83, voltage: 12.40, boardTemp: 68, chipTemp: 78, freq: 650.0, asic: 108, hwErr: 0.0 },
  { id: 2, hashrate: 31.47, voltage: 12.38, boardTemp: 72, chipTemp: 84, freq: 725.5, asic: 108, hwErr: 0.0 },
  { id: 3, hashrate: 18.92, voltage: 12.35, boardTemp: 61, chipTemp: 74, freq: 562.5, asic: 108, hwErr: 0.0 },
];

export const MOCK_WORKERS = [
  {
    name: "Antminer S19 Pro #1",
    hashrate: "24.6 TH/s",
    temp: "71°C",
    status: "active",
  },
  {
    name: "Antminer S19 Pro #2",
    hashrate: "23.9 TH/s",
    temp: "73°C",
    status: "active",
  },
  {
    name: "Antminer S19 Pro #3",
    hashrate: "24.1 TH/s",
    temp: "70°C",
    status: "active",
  },
  {
    name: "Antminer S19    #4",
    hashrate: "22.8 TH/s",
    temp: "68°C",
    status: "active",
  },
  {
    name: "Antminer S19j   #5",
    hashrate: "0.0 TH/s",
    temp: "—",
    status: "error",
  },
];

// ── Dashboard — OverviewTile ─────────────────────────────────────────────────

export const MOCK_FANS = [
  { id: "FAN1", rpm: 4200, pct: 72 },
  { id: "FAN2", rpm: 4350, pct: 75 },
  { id: "FAN3", rpm: 4100, pct: 70 },
  { id: "FAN4", rpm: 4280, pct: 73 },
];

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
  ...([88, 90, 87, 85, 86, 89, 91, 93, 92, 94, 95, 96,
       94, 93, 95, 97, 96, 94, 95, 93, 92, 91, 90, 89] as number[]).map(
    (value, i) => ({ group: "Hashrate", date: HOURS[i], value })
  ),
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

// ── System — Log page ────────────────────────────────────────────────────────

export const MOCK_LOG_DATA: readonly LogEntry[] = [
  {
    id: "1",
    time: "2026-04-12 08:01:12",
    name: "System",
    description: "Miner booted successfully",
    severity: LogSeverity.INFO,
  },
  {
    id: "2",
    time: "2026-04-12 08:02:45",
    name: "Network",
    description: "DHCP lease obtained: 192.168.1.42",
    severity: LogSeverity.INFO,
  },
  {
    id: "3",
    time: "2026-04-12 08:03:10",
    name: "Pool",
    description: "Connected to Braiins Pool (stratum+tcp://...)",
    severity: LogSeverity.INFO,
  },
  {
    id: "4",
    time: "2026-04-12 08:05:30",
    name: "Tuner",
    description: "Autotuning started on hashboard #1",
    severity: LogSeverity.DEBUG,
  },
  {
    id: "5",
    time: "2026-04-12 08:06:02",
    name: "Tuner",
    description: "Autotuning started on hashboard #2",
    severity: LogSeverity.DEBUG,
  },
  {
    id: "6",
    time: "2026-04-12 08:12:44",
    name: "Temperature",
    description: "Chip temp 72°C on hashboard #1 — within range",
    severity: LogSeverity.DEBUG,
  },
  {
    id: "7",
    time: "2026-04-12 08:30:00",
    name: "Pool",
    description: "New best share submitted (difficulty 65536)",
    severity: LogSeverity.INFO,
  },
  {
    id: "8",
    time: "2026-04-12 09:15:22",
    name: "Temperature",
    description: "Chip temp exceeded 80°C on hashboard #2",
    severity: LogSeverity.WARN,
  },
  {
    id: "9",
    time: "2026-04-12 09:16:01",
    name: "Fan",
    description: "Fan speed increased to 85%",
    severity: LogSeverity.INFO,
  },
  {
    id: "10",
    time: "2026-04-12 09:45:10",
    name: "Pool",
    description: "Pool failover: switched to Slush Pool",
    severity: LogSeverity.WARN,
  },
  {
    id: "11",
    time: "2026-04-12 10:02:33",
    name: "Hashboard",
    description: "Hashboard #3 not responding — retrying",
    severity: LogSeverity.ERROR,
  },
  {
    id: "12",
    time: "2026-04-12 10:03:01",
    name: "Hashboard",
    description: "Hashboard #3 recovered after reset",
    severity: LogSeverity.WARN,
  },
  {
    id: "13",
    time: "2026-04-12 10:30:00",
    name: "Firmware",
    description: "Firmware update available: BOS+ 23.05",
    severity: LogSeverity.INFO,
  },
  {
    id: "14",
    time: "2026-04-12 11:00:15",
    name: "Power",
    description: "PSU voltage out of range on rail #2",
    severity: LogSeverity.ERROR,
  },
  {
    id: "15",
    time: "2026-04-12 11:01:00",
    name: "System",
    description: "Emergency shutdown triggered — overtemp",
    severity: LogSeverity.FATAL,
  },
];

// ── Configuration — Pools page ──────────────────────────────────────────────

export const MOCK_POOL_GROUPS: readonly PoolGroup[] = [
  {
    name: "Default",
    pools: [
      {
        id: "1",
        enabled: true,
        url: "stratum+tcp://pool.braiins.com:3333",
        username: "worker1.miner01",
        password: "x",
      },
      {
        id: "2",
        enabled: true,
        url: "stratum+tcp://pool.slushpool.com:3333",
        username: "worker1.backup",
        password: "x",
      },
      {
        id: "3",
        enabled: false,
        url: "stratum+ssl://f2pool.com:6688",
        username: "myworker",
        password: "x",
      },
    ],
  },
];
