import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { ApiError } from "@/lib/api/client";
import { getOverview } from "@/lib/api/endpoints";
import type { OverviewResponse } from "@/lib/api/types";
import { formatCount, formatPercentage, formatScore } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

type OverviewResult =
  | { ok: true; overview: OverviewResponse }
  | { ok: false; message: string };

async function loadOverview(): Promise<OverviewResult> {
  try {
    return { ok: true, overview: await getOverview() };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }

    throw error;
  }
}

export default async function DashboardPage() {
  const result = await loadOverview();

  if (!result.ok) {
    return (
      <ErrorState
        title="Unable to load the overview"
        message={result.message}
      />
    );
  }

  const { overview } = result;
  const rate = overview.studentsWithAverageAtLeast8Rate * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Aggregated from the full examination dataset.
        </p>
      </div>

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
    </div>
  );
}
