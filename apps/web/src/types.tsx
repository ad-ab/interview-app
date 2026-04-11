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
  subnet: string;
  gateway: string;
}
