import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="app-page flex flex-col gap-4 sm:gap-5">
      <div className="shrink-0">
        <p className="text-sm text-muted-foreground">
          Application preferences.
        </p>
      </div>

      <SettingsView />
    </div>
  );
}
