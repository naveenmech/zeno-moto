"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getServerThemeSnapshot, getThemeSnapshot, setTheme, subscribeTheme } from "./theme";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return { theme, toggleTheme };
}
