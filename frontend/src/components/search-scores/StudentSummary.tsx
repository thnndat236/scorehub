import { Card } from "@/components/ui/Card";
import type { StudentScoresResponse } from "@/lib/api/types";
import { formatScore } from "@/lib/format";

type StudentSummaryProps = {
  student: StudentScoresResponse;
};

export function StudentSummary({ student }: StudentSummaryProps) {
  return (
    <Card title="Student Summary">
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">
            Registration
          </dt>
          <dd className="mt-1 font-mono text-base font-semibold text-slate-900">
            {student.registrationNumber}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">
            Foreign Language
          </dt>
          <dd className="mt-1 text-base font-semibold text-slate-900">
            {student.foreignLanguageCode ?? "—"}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">
            Subjects with Scores
          </dt>
          <dd className="mt-1 text-base font-semibold tabular-nums text-slate-900">
            {student.subjectCount}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">
            Average Score
          </dt>
          <dd className="mt-1 text-base font-semibold tabular-nums text-slate-900">
            {formatScore(student.averageScore)}
          </dd>
        </div>
      </dl>

      {student.subjectCount === 0 ? (
        <p className="mt-4 text-xs text-slate-500">
          No average is shown because this student has no recorded scores.
        </p>
      ) : null}
    </Card>
  );
}
