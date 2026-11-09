"use client";

import { useState, type ReactNode } from "react";
import { BarChart3, Hash, Layers, Percent } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_AXIS_COLOR,
  CHART_FONT_FAMILY,
  CHART_GRID_COLOR,
  CHART_TOOLTIP_STYLE,
  SCORE_LEVELS,
  formatCompactCount,
  levelPercentage,
  type ScoreLevelKey,
} from "@/components/charts/chartTheme";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SubjectScoreDistribution } from "@/lib/api/types";
import { formatCount, formatPercentage } from "@/lib/format";

type MetricType = "count" | "percentage";
type ChartType = "grouped" | "stacked";

type DistributionChartRow = {
  subjectName: string;
  totalStudents: number;
  counts: Record<ScoreLevelKey, number>;
  percentages: Record<ScoreLevelKey, number>;
} & Record<ScoreLevelKey, number>;

type DistributionTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: DistributionChartRow }>;
};

function DistributionTooltip({ active, payload }: DistributionTooltipProps) {
  const row = payload?.[0]?.payload;

  if (!active || row === undefined) {
    return null;
  }

  return (
    <div style={CHART_TOOLTIP_STYLE}>
      <p className="font-semibold">{row.subjectName}</p>
      <p className="mt-0.5 text-muted-foreground">
        {formatCount(row.totalStudents)} students with a score
      </p>

      <ul className="mt-2 space-y-1">
        {SCORE_LEVELS.map((level) => (
          <li
            key={level.key}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: level.color }}
              />
              <span>{level.label}</span>
            </span>

            <span className="tabular-nums">
              {formatCount(row.counts[level.key])}
              <span className="ml-1.5 text-muted-foreground">
                ({formatPercentage(row.percentages[level.key], 1)})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToggleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-surface text-accent shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

type SubjectDistributionChartProps = {
  data: SubjectScoreDistribution[];
};

export function SubjectDistributionChart({
  data,
}: SubjectDistributionChartProps) {
  const [metric, setMetric] = useState<MetricType>("count");
  const [chartType, setChartType] = useState<ChartType>("grouped");

  if (data.length === 0) {
    return (
      <Card
        title="Score Distribution by Subject"
        className="flex h-full w-full flex-col"
        contentClassName="flex min-h-0 flex-1 flex-col"
      >
        <EmptyState message="No subject score distribution is available." />
      </Card>
    );
  }

  const chartData: DistributionChartRow[] = data.map((subject) => {
    const counts = {
      excellent: subject.excellent,
      good: subject.good,
      average: subject.average,
      poor: subject.poor,
    };
    const percentages = {
      excellent: levelPercentage(subject.excellent, subject.totalStudents),
      good: levelPercentage(subject.good, subject.totalStudents),
      average: levelPercentage(subject.average, subject.totalStudents),
      poor: levelPercentage(subject.poor, subject.totalStudents),
    };

    const displayValue = (key: ScoreLevelKey): number =>
      metric === "count" ? counts[key] : Number(percentages[key].toFixed(2));

    return {
      subjectName: subject.subjectName,
      totalStudents: subject.totalStudents,
      counts,
      percentages,
      excellent: displayValue("excellent"),
      good: displayValue("good"),
      average: displayValue("average"),
      poor: displayValue("poor"),
    };
  });

  return (
    <Card
      className="flex h-full w-full min-h-0 flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Score Distribution by Subject
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div
            role="group"
            aria-label="Distribution metric"
            className="flex items-center gap-1 rounded-lg bg-surface-muted p-1"
          >
            <ToggleButton
              active={metric === "count"}
              onClick={() => setMetric("count")}
            >
              <Hash aria-hidden="true" className="size-3" />
              Count
            </ToggleButton>
            <ToggleButton
              active={metric === "percentage"}
              onClick={() => setMetric("percentage")}
            >
              <Percent aria-hidden="true" className="size-3" />
              Percentage
            </ToggleButton>
          </div>

          <div
            role="group"
            aria-label="Bar layout"
            className="flex items-center gap-1 rounded-lg bg-surface-muted p-1"
          >
            <ToggleButton
              active={chartType === "grouped"}
              onClick={() => setChartType("grouped")}
            >
              <BarChart3 aria-hidden="true" className="size-3" />
              Grouped
            </ToggleButton>
            <ToggleButton
              active={chartType === "stacked"}
              onClick={() => setChartType("stacked")}
            >
              <Layers aria-hidden="true" className="size-3" />
              Stacked
            </ToggleButton>
          </div>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {SCORE_LEVELS.map((level) => (
          <li key={level.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: level.color }}
            />
            <span>
              {level.label} ({level.range})
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 h-60 w-full shrink-0 xl:h-auto xl:min-h-0 xl:flex-1">
        <div className="h-full w-full overflow-x-auto">
          <div className="h-full min-w-150">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barGap={chartType === "grouped" ? 3 : 0}
                barCategoryGap={chartType === "grouped" ? "22%" : "32%"}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={CHART_GRID_COLOR}
                />
                <XAxis
                  dataKey="subjectName"
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={64}
                  tick={{
                    fontSize: 11,
                    fill: CHART_AXIS_COLOR,
                    fontFamily: CHART_FONT_FAMILY,
                  }}
                  axisLine={{ stroke: CHART_GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: CHART_AXIS_COLOR,
                    fontFamily: CHART_FONT_FAMILY,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) =>
                    metric === "count"
                      ? formatCompactCount(value)
                      : `${value}%`
                  }
                />
                <Tooltip
                  content={<DistributionTooltip />}
                  cursor={{ fill: "var(--surface-muted)", opacity: 0.6 }}
                />

                {SCORE_LEVELS.map((level, index) => (
                  <Bar
                    key={level.key}
                    dataKey={level.key}
                    name={level.label}
                    fill={level.color}
                    stackId={
                      chartType === "stacked" ? "distribution" : undefined
                    }
                    maxBarSize={chartType === "grouped" ? 12 : 26}
                    radius={
                      chartType === "stacked" &&
                      index !== SCORE_LEVELS.length - 1
                        ? 0
                        : [2, 2, 0, 0]
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
