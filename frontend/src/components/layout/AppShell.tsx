"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { pageTitle } from "./navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      if (desktopQuery.matches) {
        setMenuOpen(false);
      }
    };

    desktopQuery.addEventListener("change", handleChange);

    return () => {
      desktopQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="app-shell flex bg-background">
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

        <main className="app-main flex-1 px-4 py-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
