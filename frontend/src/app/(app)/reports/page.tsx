import type { Metadata } from "next";
import { ScoreHistogram } from "@/components/reports/ScoreHistogram";
import { SubjectDistributionTable } from "@/components/reports/SubjectDistributionTable";
import { SubjectStatisticsTable } from "@/components/reports/SubjectStatisticsTable";
import { ErrorState } from "@/components/ui/ErrorState";
import { ApiError } from "@/lib/api/client";
import {
  getHistogram,
  getScoreDistribution,
  getSubjectStatistics,
  getSubjects
} from "@/lib/api/endpoints";
import type {
  HistogramResponse,
  Subject,
  SubjectScoreDistribution,
  SubjectStatistic
} from "@/lib/api/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports"
};

const DEFAULT_SUBJECT_CODE = "TOAN";

type ReportsData = {
  subjects: Subject[];
  distribution: SubjectScoreDistribution[];
  statistics: SubjectStatistic[];
  selectedCode: string;
  histogram: HistogramResponse | null;
  unknownSubject: boolean;
};

type ReportsResult =
  | { ok: true; data: ReportsData }
  | { ok: false; message: string };

async function loadReports( requestedCode: string ): Promise<ReportsResult> {
  try {
    const [subjectsResponse, distributionResponse, statisticsResponse] =
      await Promise.all([
        getSubjects(),
        getScoreDistribution(),
        getSubjectStatistics(),
      ]);

    const subjects = subjectsResponse.data;
    const selectedCode = requestedCode || DEFAULT_SUBJECT_CODE;
    const subject = subjects.find((item) => item.code === selectedCode);
    const histogram =subject === undefined
      ? null
      : await getHistogram(subject.code);

    return {
      ok: true,
      data: {
        subjects,
        distribution: distributionResponse.data,
        statistics: statisticsResponse.data,
        selectedCode,
        histogram,
        unknownSubject: subject === undefined,
      }
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }

    throw error;
  }
}

export default async function ReportsPage(
  props: PageProps<"/reports">
) {
  const params = await props.searchParams;
  const raw = params.subjectCode;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const requestedCode = (value ?? "").trim();

  const result = await loadReports(requestedCode);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Reports</h2>
        <p className="mt-1 text-sm text-slate-600">
          Score distribution, histograms, and subject-level statistics.
        </p>
      </div>

      {!result.ok ? (
        <ErrorState
          title="Unable to load reports"
          message={result.message}
        />
      ) : (
        <div className="space-y-6">
          <SubjectDistributionTable data={result.data.distribution} />

          <ScoreHistogram
            subjects={result.data.subjects}
            selectedCode={result.data.selectedCode}
            histogram={result.data.histogram}
            unknownSubject={result.data.unknownSubject}
          />

          <SubjectStatisticsTable data={result.data.statistics} />
        </div>
      )}
    </div>
  );
}
