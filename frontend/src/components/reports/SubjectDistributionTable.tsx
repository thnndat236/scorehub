import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SubjectScoreDistribution } from "@/lib/api/types";
import { formatCount, formatPercentage } from "@/lib/format";

const LEVELS = [
  { key: "excellent", label: "Excellent", dot: "bg-emerald-500" },
  { key: "good", label: "Good", dot: "bg-blue-500" },
  { key: "average", label: "Average", dot: "bg-amber-500" },
  { key: "poor", label: "Poor", dot: "bg-red-500" }
] as const;

function percent(count: number, total: number): number {
  return total === 0 ? 0 : (count / total) * 100;
}

type SubjectDistributionTableProps = {
  data: SubjectScoreDistribution[];
};

export function SubjectDistributionTable({ data }: SubjectDistributionTableProps) {
  return (
    <Card
      title="Score Distribution by Subject"
      description="Each subject is classified using its own valid score count as the denominator."
    >
      {data.length === 0 ? (
        <EmptyState message="No subject score data is available." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-2 py-2 font-medium">
                  Subject
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-right font-medium"
                >
                  Total
                </th>

                {LEVELS.map((level) => (
                  <th
                    key={level.key}
                    scope="col"
                    className="px-2 py-2 text-right font-medium"
                  >
                    <span
                      className={`mr-1 inline-block size-2 rounded-full align-middle ${level.dot}`}
                    />
                    {level.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr
                  key={row.subjectCode}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-2 py-2">
                    <div className="text-slate-900">{row.subjectName}</div>
                    <div className="font-mono text-xs text-slate-400">
                      {row.subjectCode}
                    </div>
                  </td>

                  <td className="px-2 py-2 text-right align-top tabular-nums text-slate-900">
                    {formatCount(row.totalStudents)}
                  </td>

                  {LEVELS.map((level) => {
                    const count = row[level.key];

                    return (
                      <td
                        key={level.key}
                        className="px-2 py-2 text-right align-top"
                      >
                        <div className="tabular-nums text-slate-900">
                          {formatCount(count)}
                        </div>
                        <div className="tabular-nums text-xs text-slate-400">
                          {formatPercentage(
                            percent(count, row.totalStudents),
                            1
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
