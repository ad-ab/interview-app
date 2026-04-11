import { Theme, type LanguageOption, type ThemeOption } from "@/types";

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
