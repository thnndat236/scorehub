"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function DashboardError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <ErrorState
      title="Dashboard unavailable"
      message={message}
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      }
    />
  );
}
