"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";

type ThemeOption = {
  value: Theme;
  label: string;
  description: string;
  icon: LucideIcon;
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    description: "Bright background with dark text.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Dim background that is easy on the eyes.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device's appearance setting.",
    icon: Monitor,
  },
];

export function SettingsView() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="w-full max-w-2xl rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Choose how ScoreHub looks on this device.
      </p>

      <fieldset className="mt-4">
        <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Theme
        </legend>

        <div className="mt-2 flex flex-col gap-2.5">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <label
                key={option.value}
                className="relative flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-surface-muted/60 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30"
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={theme === option.value}
                  onChange={() => setTheme(option.value)}
                  className="peer sr-only"
                />

                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground transition-colors peer-checked:bg-accent peer-checked:text-accent-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="relative flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-border transition-colors after:absolute after:size-2.5 after:scale-0 after:rounded-full after:bg-accent after:transition-transform peer-checked:border-accent peer-checked:after:scale-100"
                />
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
