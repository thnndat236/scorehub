"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { pageTitle } from "./navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar
        pathname={pathname}
        open={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title={pageTitle(pathname)}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
