import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6"
    >
      <h2 className="text-base font-semibold text-red-800">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
