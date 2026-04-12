/**
 * All sample / mock data used across the app while there is no real backend.
 * Centralised here so it's easy to find, replace, or remove once real API
 * endpoints are wired in.
 */
import { LogSeverity, type LogEntry } from "@/types";

// ── Dashboard — DashboardPage ────────────────────────────────────────────────

export const MOCK_WORKERS = [
  { name: "Antminer S19 Pro #1", hashrate: "24.6 TH/s", temp: "71°C", status: "active" },
  { name: "Antminer S19 Pro #2", hashrate: "23.9 TH/s", temp: "73°C", status: "active" },
  { name: "Antminer S19 Pro #3", hashrate: "24.1 TH/s", temp: "70°C", status: "active" },
  { name: "Antminer S19    #4",  hashrate: "22.8 TH/s", temp: "68°C", status: "active" },
  { name: "Antminer S19j   #5",  hashrate: "0.0 TH/s",  temp: "—",    status: "error"  },
];

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

// ── Dashboard — OverviewTile ─────────────────────────────────────────────────

export const MOCK_FANS = [
  { id: "FAN1", rpm: 4200, pct: 72 },
  { id: "FAN2", rpm: 4350, pct: 75 },
  { id: "FAN3", rpm: 4100, pct: 70 },
  { id: "FAN4", rpm: 4280, pct: 73 },
];

// ── Dashboard — HashrateChartTile ────────────────────────────────────────────

export const MOCK_HASHRATE_BARS = [
  68, 72, 75, 80, 78, 82, 85, 88, 84, 87, 90, 92, 89, 91, 94, 93, 95, 96, 94,
  97, 95, 94, 96, 95,
];

export const MOCK_OVERALL_BARS = [
  65, 68, 70, 72, 75, 78, 80, 82, 80, 83, 85, 87, 85, 86, 88, 89, 90, 91, 90,
  92, 91, 90, 92, 91,
];

export const MOCK_TEMPERATURE_BARS = [
  62, 63, 65, 66, 67, 68, 70, 71, 72, 73, 72, 73, 74, 73, 72, 71, 70, 71, 72,
  73, 74, 73, 72, 71,
];

export const MOCK_CHART_DATASETS = [
  { key: "overall",     bars: MOCK_OVERALL_BARS,     avg: "83.4", peak: "92.0", unit: "%" },
  { key: "hashrate",    bars: MOCK_HASHRATE_BARS,    avg: "88.7", peak: "97.2", unit: "TH/s" },
  { key: "temperature", bars: MOCK_TEMPERATURE_BARS, avg: "70.1", peak: "74.0", unit: "°C" },
] as const;

// ── System — Log page ────────────────────────────────────────────────────────

export const MOCK_LOG_DATA: readonly LogEntry[] = [
  { id: "1",  time: "2026-04-12 08:01:12", name: "System",      description: "Miner booted successfully",                     severity: LogSeverity.INFO },
  { id: "2",  time: "2026-04-12 08:02:45", name: "Network",     description: "DHCP lease obtained: 192.168.1.42",             severity: LogSeverity.INFO },
  { id: "3",  time: "2026-04-12 08:03:10", name: "Pool",        description: "Connected to Braiins Pool (stratum+tcp://...)",  severity: LogSeverity.INFO },
  { id: "4",  time: "2026-04-12 08:05:30", name: "Tuner",       description: "Autotuning started on hashboard #1",            severity: LogSeverity.DEBUG },
  { id: "5",  time: "2026-04-12 08:06:02", name: "Tuner",       description: "Autotuning started on hashboard #2",            severity: LogSeverity.DEBUG },
  { id: "6",  time: "2026-04-12 08:12:44", name: "Temperature", description: "Chip temp 72°C on hashboard #1 — within range", severity: LogSeverity.DEBUG },
  { id: "7",  time: "2026-04-12 08:30:00", name: "Pool",        description: "New best share submitted (difficulty 65536)",    severity: LogSeverity.INFO },
  { id: "8",  time: "2026-04-12 09:15:22", name: "Temperature", description: "Chip temp exceeded 80°C on hashboard #2",       severity: LogSeverity.WARN },
  { id: "9",  time: "2026-04-12 09:16:01", name: "Fan",         description: "Fan speed increased to 85%",                    severity: LogSeverity.INFO },
  { id: "10", time: "2026-04-12 09:45:10", name: "Pool",        description: "Pool failover: switched to Slush Pool",         severity: LogSeverity.WARN },
  { id: "11", time: "2026-04-12 10:02:33", name: "Hashboard",   description: "Hashboard #3 not responding — retrying",        severity: LogSeverity.ERROR },
  { id: "12", time: "2026-04-12 10:03:01", name: "Hashboard",   description: "Hashboard #3 recovered after reset",            severity: LogSeverity.WARN },
  { id: "13", time: "2026-04-12 10:30:00", name: "Firmware",    description: "Firmware update available: BOS+ 23.05",         severity: LogSeverity.INFO },
  { id: "14", time: "2026-04-12 11:00:15", name: "Power",       description: "PSU voltage out of range on rail #2",           severity: LogSeverity.ERROR },
  { id: "15", time: "2026-04-12 11:01:00", name: "System",      description: "Emergency shutdown triggered — overtemp",       severity: LogSeverity.FATAL },
];
