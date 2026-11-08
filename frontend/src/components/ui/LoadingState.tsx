type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground"
    >
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-border border-t-accent"
      />
      <span>{label}</span>
    </div>
  );
}
