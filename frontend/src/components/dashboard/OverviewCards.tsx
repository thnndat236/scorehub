import type { OverviewResponse } from "@/lib/api/types";
import { formatCount, formatScore } from "@/lib/format";

type OverviewCardsProps = {
  overview: OverviewResponse;
};

type KpiCard = {
  label: string;
  value: string;
  barClassName: string;
  progress: number;
};

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  const studentsAtLeast8Rate = overview.studentsWithAverageAtLeast8Rate * 100;
  const averageScoreProgress = ((overview.overallAverageScore ?? 0) / 10) * 100;

  const cards: KpiCard[] = [
    {
      label: "Total Students",
      value: formatCount(overview.totalStudents),
      barClassName: "bg-accent",
      progress: 100,
    },
    {
      label: "Total Subjects",
      value: formatCount(overview.totalSubjects),
      barClassName: "bg-level-average",
      progress: 100,
    },
    {
      label: "Overall Average Score",
      value: formatScore(overview.overallAverageScore),
      barClassName: "bg-level-excellent",
      progress: clampPercentage(averageScoreProgress),
    },
    {
      label: "Students with Average ≥ 8",
      value: formatCount(overview.studentsWithAverageAtLeast8),
      barClassName: "bg-level-good",
      progress: clampPercentage(studentsAtLeast8Rate),
    },
  ];

  return (
    <section
      aria-label="Examination overview"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-3xl">
              {card.value}
            </p>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={`h-full rounded-full ${card.barClassName}`}
              style={{ width: `${card.progress}%` }}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
