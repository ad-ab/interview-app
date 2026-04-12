import {
  LogSeverity,
  NetworkProtocol,
  Theme,
  type LanguageOption,
  type LogEntry,
  type ProtocolOption,
  type ThemeOption,
} from "@/types";

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: Theme.SYSTEM, labelKey: "theme.system", rotation: 60 },
  { value: Theme.LIGHT, labelKey: "theme.light", rotation: 0 },
  { value: Theme.DARK, labelKey: "theme.dark", rotation: 180 },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

/** Canonical order for the Network → Protocol switcher. */
export const PROTOCOL_OPTIONS: readonly ProtocolOption[] = [
  { value: NetworkProtocol.DHCP, labelKey: "network.protocol.dhcp" },
  { value: NetworkProtocol.STATIC, labelKey: "network.protocol.static" },
];

/** Log severity levels and their i18n label keys. */
export const LOG_SEVERITY_OPTIONS = [
  { value: LogSeverity.DEBUG, labelKey: "log.severity.debug" },
  { value: LogSeverity.INFO, labelKey: "log.severity.info" },
  { value: LogSeverity.WARN, labelKey: "log.severity.warn" },
  { value: LogSeverity.ERROR, labelKey: "log.severity.error" },
  { value: LogSeverity.FATAL, labelKey: "log.severity.fatal" },
] as const;

/** Sample log data for the System → Log page (15 entries). */
export const SAMPLE_LOG_DATA: readonly LogEntry[] = [
  { id: "1",  time: "2026-04-12 08:01:12", name: "System",          description: "Miner booted successfully",                     severity: LogSeverity.INFO },
  { id: "2",  time: "2026-04-12 08:02:45", name: "Network",         description: "DHCP lease obtained: 192.168.1.42",             severity: LogSeverity.INFO },
  { id: "3",  time: "2026-04-12 08:03:10", name: "Pool",            description: "Connected to Braiins Pool (stratum+tcp://...)",  severity: LogSeverity.INFO },
  { id: "4",  time: "2026-04-12 08:05:30", name: "Tuner",           description: "Autotuning started on hashboard #1",            severity: LogSeverity.DEBUG },
  { id: "5",  time: "2026-04-12 08:06:02", name: "Tuner",           description: "Autotuning started on hashboard #2",            severity: LogSeverity.DEBUG },
  { id: "6",  time: "2026-04-12 08:12:44", name: "Temperature",     description: "Chip temp 72°C on hashboard #1 — within range", severity: LogSeverity.DEBUG },
  { id: "7",  time: "2026-04-12 08:30:00", name: "Pool",            description: "New best share submitted (difficulty 65536)",    severity: LogSeverity.INFO },
  { id: "8",  time: "2026-04-12 09:15:22", name: "Temperature",     description: "Chip temp exceeded 80°C on hashboard #2",       severity: LogSeverity.WARN },
  { id: "9",  time: "2026-04-12 09:16:01", name: "Fan",             description: "Fan speed increased to 85%",                    severity: LogSeverity.INFO },
  { id: "10", time: "2026-04-12 09:45:10", name: "Pool",            description: "Pool failover: switched to Slush Pool",         severity: LogSeverity.WARN },
  { id: "11", time: "2026-04-12 10:02:33", name: "Hashboard",       description: "Hashboard #3 not responding — retrying",        severity: LogSeverity.ERROR },
  { id: "12", time: "2026-04-12 10:03:01", name: "Hashboard",       description: "Hashboard #3 recovered after reset",            severity: LogSeverity.WARN },
  { id: "13", time: "2026-04-12 10:30:00", name: "Firmware",        description: "Firmware update available: BOS+ 23.05",         severity: LogSeverity.INFO },
  { id: "14", time: "2026-04-12 11:00:15", name: "Power",           description: "PSU voltage out of range on rail #2",           severity: LogSeverity.ERROR },
  { id: "15", time: "2026-04-12 11:01:00", name: "System",          description: "Emergency shutdown triggered — overtemp",       severity: LogSeverity.FATAL },
];
