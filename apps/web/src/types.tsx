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
