import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StudentScoresResponse } from "@/lib/api/types";
import { formatScore } from "@/lib/format";

type StudentScoreTableProps = {
  student: StudentScoresResponse;
};

export function StudentScoreTable({ student }: StudentScoreTableProps) {
  return (
    <Card title="Subject Scores">
      {student.scores.length === 0 ? (
        <EmptyState message="This student has no recorded subject scores." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-105 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-2 py-2 font-medium">
                  Subject
                </th>
                <th scope="col" className="px-2 py-2 font-medium">
                  Code
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {student.scores.map((row) => (
                <tr
                  key={row.subjectCode}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-2 py-2 text-slate-900">
                    {row.subjectName}
                  </td>
                  <td className="px-2 py-2 font-mono text-xs text-slate-500">
                    {row.subjectCode}
                  </td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums text-slate-900">
                    {formatScore(row.score)}
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
