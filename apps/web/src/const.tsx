/**
 * Shared ALL_CAPS constants exported across modules.
 *
 * Component-local constants (e.g. demo data in DashboardPage, NAV_ITEMS
 * in each Layout) intentionally stay in their owning files.
 */
import { Theme, type LanguageOption, type ThemeOption } from "@/types";

/** Canonical order for the Color Theme switcher (TopBar + Settings). */
export const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: Theme.SYSTEM, labelKey: "theme.system", rotation: 60 },
  { value: Theme.LIGHT, labelKey: "theme.light", rotation: 0 },
  { value: Theme.DARK, labelKey: "theme.dark", rotation: 180 },
];

/** Languages available in the Language switcher. */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];
