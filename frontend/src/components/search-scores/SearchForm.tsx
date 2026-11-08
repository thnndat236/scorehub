"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  type SubmitEvent as FormSubmitEvent,
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
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <label
        htmlFor="registrationNumber"
        className="block text-sm font-medium text-slate-700"
      >
        Registration Number
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="registrationNumber"
          name="registrationNumber"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          defaultValue={initialValue}
          placeholder="e.g. 01000001"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? "registration-error" : "registration-help"
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
        />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>

      {error ? (
        <p
          id="registration-error"
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      ) : (
        <p id="registration-help" className="mt-2 text-xs text-slate-500">
          Enter exactly 8 digits.
        </p>
      )}
    </form>
  );
}
