import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TopGroupAResponse } from "@/lib/api/types";
import { formatScore } from "@/lib/format";

type GroupALeaderboardProps = {
  leaderboard: TopGroupAResponse;
};

function rankClassName(rank: number): string {
  if (rank === 1) {
    return "bg-amber-100 text-amber-800";
  }
  if (rank === 2) {
    return "bg-slate-200 text-slate-700";
  }
  if (rank === 3) {
    return "bg-orange-100 text-orange-800";
  }
  return "bg-slate-100 text-slate-600";
}

export function GroupALeaderboard({ leaderboard }: GroupALeaderboardProps) {
  return (
    <Card
      title="Top 10 Group A"
      description="Ranked by total score in Mathematics, Physics, and Chemistry."
    >
      {leaderboard.data.length === 0 ? (
        <EmptyState message="No students have scores in all three Group A subjects." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full m2in-w-140 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-2 py-2 font-medium">
                  Rank
                </th>
                <th scope="col" className="px-2 py-2 font-medium">
                  Registration
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Math
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Physics
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Chemistry
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.data.map((student) => (
                <tr
                  key={student.registrationNumber}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-2 py-2">
                    <span
                      className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold ${rankClassName(student.rank)}`}
                    >
                      {student.rank}
                    </span>
                  </td>

                  <td className="px-2 py-2 font-mono text-slate-900">
                    {student.registrationNumber}
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-slate-700">
                    {formatScore(student.math)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-slate-700">
                    {formatScore(student.physics)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-slate-700">
                    {formatScore(student.chemistry)}
                  </td>

                  <td className="px-2 py-2 text-right font-semibold tabular-nums text-slate-900">
                    {formatScore(student.total)}
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