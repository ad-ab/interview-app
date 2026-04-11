/**
 * Shared public types and interfaces for the web app.
 *
 * Module-private types (e.g. `ThemeContextValue`, `SidebarContextValue`,
 * or a component's own `Props` interface) intentionally stay co-located
 * with their owner — only cross-module types live here.
 */

/** User-selectable theme preference. `SYSTEM` follows `prefers-color-scheme`. */
export enum Theme {
  LIGHT = "white",
  DARK = "g100",
  SYSTEM = "system",
}

/** Concrete Carbon theme id actually applied to the DOM. */
export type CarbonTheme = "white" | "g100";

/** One entry in the Color Theme switcher (both the TopBar menu and the Settings page). */
export interface ThemeOption {
  value: Theme;
  labelKey: string;
  /** Degrees to rotate the shared half-moon ThemeIcon for this option. */
  rotation: number;
}

/** One entry in the Language switcher. */
export interface LanguageOption {
  code: string;
  label: string;
}
