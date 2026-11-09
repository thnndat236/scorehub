"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Subject } from "@/lib/api/types";

type SubjectSelectProps = {
  subjects: Subject[];
  selectedCode: string;
};

export function SubjectSelect({
  subjects,
  selectedCode,
}: SubjectSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isKnown = subjects.some(
    (subject) => subject.code === selectedCode
  );

  const handleChange = (code: string) => {
    if (code === selectedCode) {
      return;
    }

    startTransition(() => {
      router.push(`/reports?subjectCode=${encodeURIComponent(code)}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="flex items-center gap-2" aria-busy={isPending}>
      <label
        htmlFor="subjectCode"
        className="text-xs font-medium text-muted-foreground"
      >
        Subject
      </label>

      <select
        id="subjectCode"
        key={selectedCode}
        defaultValue={selectedCode}
        disabled={subjects.length === 0}
        onChange={(event) => handleChange(event.target.value)}
        className="h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-foreground shadow-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!isKnown ? (
          <option value={selectedCode}>Unknown subject</option>
        ) : null}

        {subjects.map((subject) => (
          <option key={subject.code} value={subject.code}>
            {subject.name}
          </option>
        ))}
      </select>

      {isPending ? (
        <>
          <Loader2
            aria-hidden="true"
            className="size-3.5 animate-spin text-accent"
          />
          <span role="status" className="sr-only">
            Loading histogram...
          </span>
        </>
      ) : null}
    </div>
  );
}
