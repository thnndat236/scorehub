import { Card } from "@/components/ui/Card";
import type { StudentScoresResponse } from "@/lib/api/types";
import { formatScore } from "@/lib/format";

type StudentSummaryProps = {
  student: StudentScoresResponse;
};

export function StudentSummary({ student }: StudentSummaryProps) {
  return (
    <Card title="Student Summary" className="w-full">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="min-w-0 rounded-lg bg-surface-muted/60 px-3 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Registration
          </dt>
          <dd className="mt-0.5 truncate font-mono text-sm font-semibold tracking-wide text-foreground">
            {student.registrationNumber}
          </dd>
        </div>

        <div className="min-w-0 rounded-lg bg-surface-muted/60 px-3 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Foreign Language
          </dt>
          <dd className="mt-0.5 truncate font-mono text-sm font-semibold text-foreground">
            {student.foreignLanguageCode ?? "—"}
          </dd>
        </div>

        <div className="min-w-0 rounded-lg bg-surface-muted/60 px-3 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Subjects with Scores
          </dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
            {student.subjectCount}
          </dd>
        </div>

        <div className="min-w-0 rounded-lg bg-surface-muted/60 px-3 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Average Score
          </dt>
          <dd className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
            {formatScore(student.averageScore)}
          </dd>
        </div>
      </dl>

      {student.subjectCount === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No average is shown because this student has no recorded scores.
        </p>
      ) : null}
    </Card>
  );
}
