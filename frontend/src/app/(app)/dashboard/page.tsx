import type { Metadata } from "next";
import { GroupALeaderboard } from "@/components/dashboard/GroupALeaderboard";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { StudentAverageDistribution } from "@/components/dashboard/StudentAverageDistribution";
import { ErrorState } from "@/components/ui/ErrorState";
import { ApiError } from "@/lib/api/client";
import {
  getOverview,
  getStudentAverageDistribution,
  getTopGroupA
} from "@/lib/api/endpoints";
import type {
  OverviewResponse,
  StudentAverageDistributionResponse,
  TopGroupAResponse
} from "@/lib/api/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

type DashboardData = {
  overview: OverviewResponse;
  distribution: StudentAverageDistributionResponse;
  leaderboard: TopGroupAResponse;
};

type DashboardResult =
  | { ok: true; data: DashboardData }
  | { ok: false; message: string };

async function loadDashboard(): Promise<DashboardResult> {
  try {
    const [overview, distribution, leaderboard] = await Promise.all([
      getOverview(),
      getStudentAverageDistribution(),
      getTopGroupA()
    ]);

    return { ok: true, data: { overview, distribution, leaderboard } };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }

    throw error;
  }
}

export default async function DashboardPage() {
  const result = await loadDashboard();

  if (!result.ok) {
    return (
      <ErrorState
        title="Unable to load the dashboard"
        message={result.message}
      />
    );
  }

  const { overview, distribution, leaderboard } = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Aggregated from the full examination dataset.
        </p>
      </div>

      <OverviewCards overview={overview} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <StudentAverageDistribution distribution={distribution} />
        </div>

        <div className="xl:col-span-2">
          <GroupALeaderboard leaderboard={leaderboard} />
        </div>
      </div>
    </div>
  );
}
