"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "scorehub-theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

let cachedTheme: Theme | null = null;
let cachedSystemTheme: ResolvedTheme | null = null;

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function readStoredTheme(): Theme {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : "system";
  } catch {
    return "system";
  }
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  if (cachedTheme === null) {
    cachedTheme = readStoredTheme();
  }

  return cachedTheme;
}

function getSystemThemeSnapshot(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  if (cachedSystemTheme === null) {
    cachedSystemTheme = readSystemTheme();
  }

  return cachedSystemTheme;
}

function getServerThemeSnapshot(): Theme {
  return "system";
}

function getServerSystemThemeSnapshot(): ResolvedTheme {
  return "light";
}

function applyResolvedTheme(resolvedTheme: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
}

function resolveTheme(theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const media = window.matchMedia(DARK_MEDIA_QUERY);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    cachedTheme = null;
    const nextSystemTheme = readSystemTheme();
    cachedSystemTheme = nextSystemTheme;
    applyResolvedTheme(resolveTheme(getThemeSnapshot(), nextSystemTheme));
    notifyListeners();
  };

  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    cachedSystemTheme = event.matches ? "dark" : "light";
    applyResolvedTheme(
      resolveTheme(getThemeSnapshot(), cachedSystemTheme),
    );
    notifyListeners();
  };

  window.addEventListener("storage", handleStorage);
  media.addEventListener("change", handleSystemThemeChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
    media.removeEventListener("change", handleSystemThemeChange);
  };
}

function storeTheme(nextTheme: Theme): void {
  cachedTheme = nextTheme;
  cachedSystemTheme = readSystemTheme();
  applyResolvedTheme(resolveTheme(nextTheme, cachedSystemTheme));

  try {
    localStorage.setItem(STORAGE_KEY, nextTheme);
  } catch {
    // Storage can be unavailable (private mode, restricted browser).
  }

  notifyListeners();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const systemTheme = useSyncExternalStore(
    subscribe,
    getSystemThemeSnapshot,
    getServerSystemThemeSnapshot,
  );

  const resolvedTheme = resolveTheme(theme, systemTheme);

  // Re-apply before paint after hydration. This also restores the attribute if
  // React's development-mode remount clears attributes on <html>.
  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    storeTheme(nextTheme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
