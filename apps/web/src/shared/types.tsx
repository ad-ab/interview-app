export enum Theme {
  LIGHT = "white",
  DARK = "g100",
  SYSTEM = "system",
}

export type CarbonTheme = "white" | "g100";

export interface ThemeOption {
  value: Theme;
  labelKey: string;
  rotation: number;
}

export interface LanguageOption {
  code: string;
  label: string;
}

/** Network interface protocol on the System → Network page. */
export enum NetworkProtocol {
  DHCP = "dhcp",
  STATIC = "static",
}

/** One entry in the Protocol switcher. */
export interface ProtocolOption {
  value: NetworkProtocol;
  labelKey: string;
}

/** Static IP configuration — only relevant when NetworkProtocol.STATIC is selected. */
export interface NetworkStaticConfig {
  ip: string;
  gateway: string;
  dns: string;
}

/** Log severity levels for the System → Log page. */
export enum LogSeverity {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

/** A single log entry displayed in the LogsTable. */
export interface LogEntry {
  id: string;
  time: string;
  name: string;
  description: string;
  severity: LogSeverity;
}

/** A single mining pool connection. */
export interface PoolConfig {
  id: string;
  enabled: boolean;
  url: string;
  username: string;
  password: string;
}

/** A named group of pool connections. */
export interface PoolGroup {
  name: string;
  pools: PoolConfig[];
}

/** A single hash board row in the Hash Boards table. */
export interface BoardRow {
  id: number;
  hashrate: number;
  voltage: number;
  boardTemp: number;
  chipTemp: number;
  freq: number;
  asic: number;
  hwErr: number;
}

/** Unit strings for miner metric display. */
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

/** Pool connection health status. */
export enum POOL_STATUS {
  ALIVE = "alive",
  DEAD = "dead",
  DEGRADED = "degraded",
}

/** Auto-tuner operational status. */
export enum TUNER_STATUS {
  STABLE = "stable",
  UNSTABLE = "unstable",
  ERROR = "error",
}

/** Metric label keys for the Overview tile. */
export enum METRIC_LABEL {
  REAL_HASHRATE = "realHashrate",
  TEMPERATURE = "temperature",
  EFFICIENCY = "efficiency",
  POWER = "power",
  DPS = "dps",
  POOL_STATUS = "poolStatus",
  TUNER_STATUS = "tunerStatus",
}

/** A single data point for Carbon Charts time-series charts. */
export interface ChartDataPoint {
  /** Series name — matches Carbon Charts `group` field. */
  group: string;
  /** ISO 8601 datetime string — matches Carbon Charts `date` field. */
  date: string;
  /** Numeric value — matches Carbon Charts `value` field. */
  value: number;
}
