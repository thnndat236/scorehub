import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StudentScoresResponse } from "@/lib/api/types";
import { formatScore } from "@/lib/format";

type StudentScoreTableProps = {
  student: StudentScoresResponse;
};

export function StudentScoreTable({ student }: StudentScoreTableProps) {
  return (
    <Card
      title="Detailed Scores"
      className="flex h-full w-full flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      {student.scores.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <EmptyState message="This student has no recorded subject scores." />
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              Recorded subject scores for registration number{" "}
              {student.registrationNumber}.
            </caption>

            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Subject
                </th>
                <th
                  scope="col"
                  className="w-24 py-2 text-right font-semibold"
                >
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {student.scores.map((row) => (
                <tr
                  key={row.subjectCode}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-muted/60"
                >
                  <td className="py-1.5 pr-4 text-foreground">
                    {row.subjectName}
                  </td>
                  <td className="py-1.5 text-right font-mono font-semibold tabular-nums text-foreground">
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
