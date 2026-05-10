import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "guyguy.theme";

const getSystemTheme = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const resolve = (theme) => (theme === "system" ? getSystemTheme() : theme);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem(STORAGE_KEY) || "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState(() => resolve(theme));

  useEffect(() => {
    const next = resolve(theme);
    setResolvedTheme(next);
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Listen for OS theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = mq.matches ? "dark" : "light";
      setResolvedTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((value) => {
    setThemeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: "light", resolvedTheme: "light", setTheme: () => {} };
  return ctx;
}
