export default function ReportsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="app-page flex flex-col gap-4 sm:gap-5"
    >
      <span className="sr-only">Loading reports data...</span>

      <div className="shrink-0">
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-surface-muted" />
      </div>

      <div className="grid min-w-0 gap-4 sm:gap-5 xl:min-h-0 xl:flex-1 xl:grid-cols-12 xl:grid-rows-1">
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5 xl:col-span-7 xl:min-h-0">
          <div className="h-80 animate-pulse rounded-xl border border-border bg-surface xl:h-auto xl:flex-[1.15]" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-surface xl:h-auto xl:flex-1" />
        </div>

        <div className="h-80 animate-pulse rounded-xl border border-border bg-surface xl:col-span-5 xl:h-auto" />
      </div>
    </div>
  );
}
