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
