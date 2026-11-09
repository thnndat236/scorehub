import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  Search,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { Brand } from "./Brand";
import { NAV_ITEMS } from "./navigation";

type AppSidebarProps = {
  pathname: string;
  open: boolean;
  onNavigate: () => void;
};

const NAV_ICONS: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/search-scores": Search,
  "/reports": BarChart3,
  "/settings": Settings,
};

function SidebarNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav
      aria-label="Main navigation"
      className="flex-1 space-y-1 overflow-y-auto p-3"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = NAV_ICONS[item.href] ?? LayoutDashboard;
        const active =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              active
                ? "bg-accent-soft font-semibold text-accent"
                : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              className={[
                "size-4 shrink-0",
                active
                  ? "text-accent"
                  : "text-muted-foreground group-hover:text-foreground",
              ].join(" ")}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-border p-3 text-xs text-muted-foreground">
      High School Graduation Exam Analytics
    </div>
  );
}

export function AppSidebar({
  pathname,
  open,
  onNavigate,
}: AppSidebarProps) {
  return (
    <>
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Brand onNavigate={onNavigate} />
        </div>

        <SidebarNavigation pathname={pathname} onNavigate={onNavigate} />

        <SidebarFooter />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onNavigate}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col border-r border-border bg-surface shadow-xl"
          >
            <div className="flex h-16 items-center justify-between gap-3 border-b border-border px-6">
              <Brand onNavigate={onNavigate} />

              <button
                type="button"
                onClick={onNavigate}
                aria-label="Close navigation menu"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <SidebarNavigation
              pathname={pathname}
              onNavigate={onNavigate}
            />

            <SidebarFooter />
          </div>
        </div>
      ) : null}
    </>
  );
}
