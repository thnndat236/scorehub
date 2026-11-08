import { Card } from "@/components/ui/Card";
import type { OverviewResponse } from "@/lib/api/types";
import { formatCount, formatPercentage, formatScore } from "@/lib/format";

type OverviewCardsProps = {
  overview: OverviewResponse;
};

export function OverviewCards({ overview }: OverviewCardsProps) {
  const rate = overview.studentsWithAverageAtLeast8Rate * 100;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card title="Total Students">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {formatCount(overview.totalStudents)}
        </p>
      </Card>

      <Card title="Total Subjects">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {formatCount(overview.totalSubjects)}
        </p>
      </Card>

      <Card title="Overall Average Score">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {formatScore(overview.overallAverageScore)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Across {formatCount(overview.validScoreRecords)} score records
        </p>
      </Card>

      <Card title="Students with Average ≥ 8">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {formatCount(overview.studentsWithAverageAtLeast8)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {formatPercentage(rate)} of all students
        </p>
      </Card>
    </section>
  );
}
