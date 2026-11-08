import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SubjectStatistic } from "@/lib/api/types";
import { formatCount, formatScore } from "@/lib/format";

type SubjectStatisticsTableProps = {
  data: SubjectStatistic[];
};

export function SubjectStatisticsTable({ data }: SubjectStatisticsTableProps) {
  return (
    <Card
      title="Subject Statistics"
      description="Averages are rounded to two decimal places. Subjects without scores show an em dash."
    >
      {data.length === 0 ? (
        <EmptyState message="No subject statistics are available." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-140 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-2 py-2 font-medium">
                  Subject
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-right font-medium"
                >
                  Total Students
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-right font-medium"
                >
                  Average
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-right font-medium"
                >
                  Highest
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-right font-medium"
                >
                  Lowest
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr
                  key={row.subjectCode}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-2 py-2">
                    <div className="text-slate-900">
                      {row.subjectName}
                    </div>
                    <div className="font-mono text-xs text-slate-400">
                      {row.subjectCode}
                    </div>
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-slate-900">
                    {formatCount(row.totalStudents)}
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-slate-900">
                    {formatScore(row.averageScore)}
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-slate-900">
                    {formatScore(row.highestScore)}
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-slate-900">
                    {formatScore(row.lowestScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
