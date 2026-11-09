export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="app-page flex flex-col gap-4 sm:gap-5"
    >
      <span className="sr-only">Loading dashboard data...</span>

      <div className="shrink-0 space-y-2">
        <div className="h-6 w-32 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-surface-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>

      <div className="grid min-w-0 gap-4 sm:gap-5 xl:min-h-0 xl:flex-1 xl:grid-cols-12 xl:grid-rows-1">
        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface xl:col-span-7 xl:h-auto" />
        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface xl:col-span-5 xl:h-auto" />
      </div>
    </div>
  );
}
