import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubjectSelect } from "@/components/reports/SubjectSelect";
import type { HistogramResponse, Subject } from "@/lib/api/types";
import { formatCount } from "@/lib/format";

type ScoreHistogramProps = {
  subjects: Subject[];
  selectedCode: string;
  histogram: HistogramResponse | null;
  unknownSubject: boolean;
};

export function ScoreHistogram({
  subjects,
  selectedCode,
  histogram,
  unknownSubject
}: ScoreHistogramProps) {
  const maxCount = histogram === null
    ? 0
    : Math.max(0, ...histogram.bins.map((bin) => bin.count));
  const scale = Math.max(1, maxCount);

  return (
    <Card
      title="Score Histogram"
      description="20 intervals of 0.5 points. The final interval includes 10."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SubjectSelect
          subjects={subjects}
          selectedCode={selectedCode}
        />

        {histogram ? (
          <span className="text-xs text-slate-500">
            {formatCount(histogram.totalStudents)} students with a score
          </span>
        ) : null}
      </div>

      {unknownSubject ? (
        <div className="mt-4">
          <EmptyState
            title="Unknown subject"
            message={`No subject matches "${selectedCode}". Choose a subject from the list.`}
          />
        </div>
      ) : histogram ? (
        <ul className="mt-4 space-y-1.5">
          {histogram.bins.map((bin) => (
            <li
              key={bin.label}
              className="grid grid-cols-[76px_1fr_64px] items-center gap-3"
            >
              <span className="text-xs tabular-nums text-slate-500">
                {bin.label}
              </span>

              <span
                className="block h-2.5 overflow-hidden rounded-full bg-slate-100"
                title={`${bin.label}: ${formatCount(bin.count)} students`}
              >
                <span
                  className="block h-full rounded-full bg-blue-500"
                  style={{ width: `${(bin.count / scale) * 100}%` }}
                />
              </span>

              <span className="text-right text-xs tabular-nums text-slate-600">
                {formatCount(bin.count)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
