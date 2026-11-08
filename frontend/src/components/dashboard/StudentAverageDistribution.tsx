import { Card } from "@/components/ui/Card";
import type { ScoreLevel, StudentAverageDistributionResponse } from "@/lib/api/types";
import { formatCount, formatPercentage } from "@/lib/format";

type LevelStyle = {
  label: string;
  range: string;
  bar: string;
};

const LEVEL_STYLES: Record<ScoreLevel, LevelStyle> = {
  EXCELLENT: {
    label: "Excellent",
    range: "8.0 – 10",
    bar: "bg-emerald-500",
  },
  GOOD: {
    label: "Good",
    range: "6.0 – <8.0",
    bar: "bg-blue-500",
  },
  AVERAGE: {
    label: "Average",
    range: "4.0 – <6.0",
    bar: "bg-amber-500",
  },
  POOR: {
    label: "Poor",
    range: "0 – <4.0",
    bar: "bg-red-500",
  },
};

type StudentAverageDistributionProps = {
  distribution: StudentAverageDistributionResponse;
};

export function StudentAverageDistribution({ distribution }: StudentAverageDistributionProps) {
  return (
    <Card
      title="Student Average Distribution"
      description="Students grouped by the average of their available subject scores."
    >
      <p className="text-xs text-slate-500">
        {formatCount(distribution.totalStudents)} students with at least one score
      </p>

      <ul className="mt-4 space-y-4">
        {distribution.levels.map((level) => {
          const style = LEVEL_STYLES[level.level];

          return (
            <li key={level.level}>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    {style.label}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {style.range}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {formatCount(level.count)}
                  </span>
                  <span className="ml-2 text-xs tabular-nums text-slate-500">
                    {formatPercentage(level.percentage)}
                  </span>
                </div>
              </div>

              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${style.bar}`}
                  style={{ width: `${level.percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
