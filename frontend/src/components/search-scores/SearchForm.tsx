"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  type SubmitEvent as FormSubmitEvent
} from "react";

type SearchFormProps = {
  initialValue: string;
};

export function SearchForm({ initialValue }: SearchFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormSubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = String(
      new FormData(event.currentTarget).get("registrationNumber") ?? ""
    ).trim();

    if (!/^\d{8}$/.test(value)) {
      setError("Registration number must be exactly 8 digits.");
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(`/search-scores?registrationNumber=${value}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor="registrationNumber"
          className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Registration Number
        </label>

        {error ? null : (
          <p
            id="registration-help"
            className="text-xs text-muted-foreground"
          >
            Enter exactly 8 digits.
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="registrationNumber"
          name="registrationNumber"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          defaultValue={initialValue}
          placeholder="e.g. 01000001"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? "registration-error" : "registration-help"
          }
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm tracking-widest text-foreground shadow-sm outline-none transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 sm:max-w-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search className="size-4" aria-hidden="true" />
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>

      {error ? (
        <p
          id="registration-error"
          role="alert"
          className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
