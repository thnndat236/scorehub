"use client";

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
  HISTOGRAM_COLOR,
  formatCompactCount,
} from "@/components/charts/chartTheme";
import { SubjectSelect } from "@/components/reports/SubjectSelect";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { HistogramResponse, Subject } from "@/lib/api/types";
import { formatCount } from "@/lib/format";

type HistogramChartRow = {
  range: string;
  count: number;
};

type HistogramTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: HistogramChartRow }>;
};

function HistogramTooltip({ active, payload }: HistogramTooltipProps) {
  const row = payload?.[0]?.payload;

  if (!active || row === undefined) {
    return null;
  }

  return (
    <div style={CHART_TOOLTIP_STYLE}>
      <p className="font-semibold">Score range: {row.range}</p>
      <p className="mt-0.5 text-muted-foreground">
        {formatCount(row.count)} students
      </p>
    </div>
  );
}

type ScoreHistogramProps = {
  subjects: Subject[];
  selectedCode: string;
  histogram: HistogramResponse | null;
  unknownSubject: boolean;
  errorMessage?: string;
};

export function ScoreHistogram({
  subjects,
  selectedCode,
  histogram,
  unknownSubject,
  errorMessage,
}: ScoreHistogramProps) {
  const chartData: HistogramChartRow[] =
    histogram?.bins.map((bin) => ({
      range: bin.label,
      count: bin.count,
    })) ?? [];

  return (
    <Card
      className="flex h-full w-full flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Score Histogram
          </h2>
        </div>

        <SubjectSelect
          subjects={subjects}
          selectedCode={selectedCode}
        />
      </div>

      {unknownSubject ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            title="Unknown subject"
            message="Choose a subject from the list to view its score distribution."
          />
        </div>
      ) : errorMessage ? (
        <div className="flex flex-1 items-center">
          <ErrorState
            title="Unable to load the histogram"
            message={errorMessage}
          />
        </div>
      ) : histogram === null || chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState message="No histogram data is available for this subject." />
        </div>
      ) : (
        <div className="mt-1 h-55 w-full shrink-0 xl:h-auto xl:min-h-0 xl:flex-1">
          <div className="h-full w-full overflow-x-auto">
            <div className="h-full min-w-140 xl:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={CHART_GRID_COLOR}
                  />
                  <XAxis
                    dataKey="range"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={46}
                    tick={{
                      fontSize: 9,
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
                      formatCompactCount(value)
                    }
                  />
                  <Tooltip
                    content={<HistogramTooltip />}
                    cursor={{ fill: "var(--surface-muted)", opacity: 0.6 }}
                  />
                  <Bar
                    dataKey="count"
                    name="Students"
                    fill={HISTOGRAM_COLOR}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={26}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
