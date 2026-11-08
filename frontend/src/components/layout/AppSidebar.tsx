import Link from "next/link";
import { NAV_ITEMS } from "./navigation";

type AppSidebarProps = {
  pathname: string;
  open: boolean;
  onNavigate: () => void;
};

export function AppSidebar({
  pathname,
  open,
  onNavigate,
}: AppSidebarProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onNavigate}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Score<span className="text-blue-600">Hub</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
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
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
          High School Graduation Exam Analytics
        </div>
      </aside>
    </>
  );
}
