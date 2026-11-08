type EmptyStateProps = {
  title?: string;
  message: string;
};

export function EmptyState({
  title = "No data",
  message
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
