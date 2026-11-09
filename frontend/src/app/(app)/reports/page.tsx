import { Suspense } from "react";
import type { Metadata } from "next";
import { ScoreHistogram } from "@/components/reports/ScoreHistogram";
import { SubjectDistributionChart } from "@/components/reports/SubjectDistributionChart";
import { SubjectSelect } from "@/components/reports/SubjectSelect";
import { SubjectStatisticsTable } from "@/components/reports/SubjectStatisticsTable";
import { Card } from "@/components/ui/Card";
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
  unknownSubject: boolean;
};

type ReportsResult =
  | { ok: true; data: ReportsData }
  | { ok: false; message: string };

async function loadReports(requestedCode: string): Promise<ReportsResult> {
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

    return {
      ok: true,
      data: {
        subjects,
        distribution: distributionResponse.data,
        statistics: statisticsResponse.data,
        selectedCode,
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

type HistogramSectionProps = {
  subjects: Subject[];
  selectedCode: string;
  unknownSubject: boolean;
};

async function HistogramSection({
  subjects,
  selectedCode,
  unknownSubject,
}: HistogramSectionProps) {
  if (unknownSubject) {
    return (
      <ScoreHistogram
        subjects={subjects}
        selectedCode={selectedCode}
        histogram={null}
        unknownSubject
      />
    );
  }

  let histogram: HistogramResponse | null = null;
  let errorMessage: string | undefined;

  try {
    histogram = await getHistogram(selectedCode);
  } catch (error) {
    if (error instanceof ApiError) {
      errorMessage = error.message;
    } else {
      throw error;
    }
  }

  return (
    <ScoreHistogram
      subjects={subjects}
      selectedCode={selectedCode}
      histogram={histogram}
      unknownSubject={false}
      errorMessage={errorMessage}
    />
  );
}

function HistogramFallback({
  subjects,
  selectedCode,
}: {
  subjects: Subject[];
  selectedCode: string;
}) {
  return (
    <Card
      title="Score Histogram"
      description="20 intervals of 0.5 points. The final interval includes 10."
      actions={
        <SubjectSelect
          subjects={subjects}
          selectedCode={selectedCode}
        />
      }
      className="flex h-full w-full flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[220px] flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface-muted/40 text-sm text-muted-foreground"
      >
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-border border-t-accent"
        />
        <span>Loading histogram...</span>
      </div>
    </Card>
  );
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
    <div className="app-page flex flex-col gap-4 sm:gap-5">
      {!result.ok ? (
        <ErrorState
          title="Unable to load reports"
          message={result.message}
        />
      ) : (
        <div className="grid min-w-0 gap-4 sm:gap-5 xl:min-h-0 xl:flex-1 xl:grid-cols-12 xl:grid-rows-1">
          <div className="flex min-h-0 min-w-0 flex-col gap-4 sm:gap-5 xl:col-span-7">
            <div className="flex min-h-0 min-w-0 xl:flex-[1.15]">
              <SubjectDistributionChart data={result.data.distribution} />
            </div>

            <div className="flex min-h-0 min-w-0 xl:flex-1">
              <Suspense
                fallback={
                  <HistogramFallback
                    subjects={result.data.subjects}
                    selectedCode={result.data.selectedCode}
                  />
                }
              >
                <HistogramSection
                  subjects={result.data.subjects}
                  selectedCode={result.data.selectedCode}
                  unknownSubject={result.data.unknownSubject}
                />
              </Suspense>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 xl:col-span-5">
            <SubjectStatisticsTable data={result.data.statistics} />
          </div>
        </div>
      )}
    </div>
  );
}
