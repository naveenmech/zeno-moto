export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "zeno-moto-theme";

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function applyTheme(theme: Theme | null) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme) root.classList.add(theme);
}

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.classList.add(t);}}catch(e){}})();`;

let currentTheme: Theme = "light";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  currentTheme = getStoredTheme() ?? getSystemTheme();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!getStoredTheme()) {
      currentTheme = getSystemTheme();
      notify();
    }
  });
}

export function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getThemeSnapshot(): Theme {
  return currentTheme;
}

export function getServerThemeSnapshot(): Theme {
  return "light";
}

export function setTheme(next: Theme) {
  currentTheme = next;
  window.localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
  notify();
}
