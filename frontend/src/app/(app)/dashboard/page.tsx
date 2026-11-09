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
    <div className="app-page flex flex-col gap-4 sm:gap-5">
      <div className="shrink-0">
        <OverviewCards overview={overview} />
      </div>

      <div className="grid min-w-0 gap-4 sm:gap-5 xl:min-h-0 xl:flex-1 xl:grid-cols-12 xl:grid-rows-1">
        <div className="flex min-h-0 min-w-0 xl:col-span-7">
          <StudentAverageDistribution distribution={distribution} />
        </div>

        <div className="flex min-h-0 min-w-0 xl:col-span-5">
          <GroupALeaderboard leaderboard={leaderboard} />
        </div>
      </div>
    </div>
  );
}
