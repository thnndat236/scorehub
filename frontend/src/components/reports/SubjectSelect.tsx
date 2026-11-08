"use client";

import { useRouter } from "next/navigation";
import type { Subject } from "@/lib/api/types";

type SubjectSelectProps = {
  subjects: Subject[];
  selectedCode: string;
};

export function SubjectSelect({
  subjects,
  selectedCode
}: SubjectSelectProps) {
  const router = useRouter();
  const isKnown = subjects.some(
    (subject) => subject.code === selectedCode
  );

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="subjectCode"
        className="text-sm font-medium text-slate-700"
      >
        Subject
      </label>

      <select
        id="subjectCode"
        key={selectedCode}
        defaultValue={selectedCode}
        onChange={(event) => {
          router.push(`/reports?subjectCode=${event.target.value}`);
        }}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {!isKnown ? (
          <option value={selectedCode}>Unknown ({selectedCode})</option>
        ) : null}

        {subjects.map((subject) => (
          <option key={subject.code} value={subject.code}>
            {subject.name}
          </option>
        ))}
      </select>
    </div>
  );
}
