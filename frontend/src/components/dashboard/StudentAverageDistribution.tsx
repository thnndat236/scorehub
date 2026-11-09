import { Card } from "@/components/ui/Card";
import type {
  ScoreLevel,
  StudentAverageDistributionResponse
} from "@/lib/api/types";
import { formatCount, formatPercentage } from "@/lib/format";

type LevelStyle = {
  label: string;
  range: string;
  barClassName: string;
};

const LEVEL_STYLES: Record<ScoreLevel, LevelStyle> = {
  EXCELLENT: {
    label: "Excellent",
    range: "8.0 – 10",
    barClassName: "bg-level-excellent"
  },
  GOOD: {
    label: "Good",
    range: "6.0 – <8.0",
    barClassName: "bg-level-good"
  },
  AVERAGE: {
    label: "Average",
    range: "4.0 – <6.0",
    barClassName: "bg-level-average"
  },
  POOR: {
    label: "Poor",
    range: "0 – <4.0",
    barClassName: "bg-level-poor"
  }
};

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

type StudentAverageDistributionProps = {
  distribution: StudentAverageDistributionResponse;
};

export function StudentAverageDistribution({ distribution }: StudentAverageDistributionProps) {
  return (
    <Card
      title="Student Average Distribution"
      description="Students grouped by the average of their available subject scores."
      className="flex h-full w-full flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <p className="text-sm text-muted-foreground">
        {formatCount(distribution.totalStudents)} students with at least one score
      </p>

      <ul className="mt-4 flex flex-1 flex-col justify-between gap-4">
        {distribution.levels.map((level) => {
          const style = LEVEL_STYLES[level.level];

          return (
            <li key={level.level} className="flex flex-col min-w-0">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {style.label}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {style.range}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {formatCount(level.count)}
                  </span>
                  <span className="ml-2 text-xs tabular-nums text-muted-foreground">
                    {formatPercentage(level.percentage)}
                  </span>
                </div>
              </div>

              <div className="relative h-12 w-full overflow-hidden rounded-xl bg-surface-muted p-1 shadow-inner">
                <div
                  className={`h-full rounded-lg shadow-sm transition-all duration-500 ease-out ${style.barClassName}`}
                  style={{ width: `${clampPercentage(level.percentage)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
