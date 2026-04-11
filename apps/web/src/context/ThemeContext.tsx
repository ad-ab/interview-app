import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export enum Theme {
  LIGHT = "white",
  DARK = "g100",
  SYSTEM = "system",
}

export type CarbonTheme = "white" | "g100";

function getSystemCarbonTheme(): CarbonTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Theme.DARK
    : Theme.LIGHT;
}

function resolveCarbonTheme(preference: Theme): CarbonTheme {
  if (preference === Theme.LIGHT) return "white";
  if (preference === Theme.DARK) return "g100";
  return getSystemCarbonTheme();
}

interface ThemeContextValue {
  preference: Theme;
  carbonTheme: CarbonTheme;
  setPreference: (preference: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  preference: Theme.SYSTEM,
  carbonTheme: getSystemCarbonTheme(),
  setPreference: () => {},
});

const STORAGE_KEY = "theme-preference";

function readStoredPreference(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (
    stored === Theme.LIGHT ||
    stored === Theme.DARK ||
    stored === Theme.SYSTEM
  )
    return stored;
  return Theme.SYSTEM;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] =
    useState<Theme>(readStoredPreference);
  const [carbonTheme, setCarbonTheme] = useState<CarbonTheme>(() =>
    resolveCarbonTheme(readStoredPreference()),
  );

  const setPreference = (value: Theme) => {
    localStorage.setItem(STORAGE_KEY, value);
    setPreferenceState(value);
  };

  useEffect(() => {
    setCarbonTheme(resolveCarbonTheme(preference));

    if (preference !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setCarbonTheme(getSystemCarbonTheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  return (
    <ThemeContext.Provider value={{ preference, carbonTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
