type EmptyStateProps = {
  title?: string;
  message: string;
};

export function EmptyState({
  title = "No data",
  message,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-muted/50 p-6 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
