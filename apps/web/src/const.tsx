import {
  LogSeverity,
  NetworkProtocol,
  Theme,
  type LanguageOption,
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
