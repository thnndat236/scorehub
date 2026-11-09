import { Crown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TopGroupAResponse } from "@/lib/api/types";
import { formatScore } from "@/lib/format";

type GroupALeaderboardProps = {
  leaderboard: TopGroupAResponse;
};

function rowSurfaceClassName(rank: number): string {
  if (rank === 1) {
    return "bg-accent text-accent-foreground";
  }
  if (rank === 2) {
    return "bg-surface-muted text-foreground";
  }
  if (rank === 3) {
    return "bg-surface-muted/60 text-foreground";
  }
  return "text-foreground hover:bg-surface-muted";
}

function scoreClassName(rank: number): string {
  return rank === 1
    ? "text-accent-foreground/90"
    : "text-muted-foreground";
}

function totalClassName(rank: number): string {
  return rank === 1
    ? "text-accent-foreground"
    : "text-foreground";
}

export function GroupALeaderboard({ leaderboard }: GroupALeaderboardProps) {
  return (
    <Card
      title="Top 10 Group A"
      description="Ranked by total score in Mathematics, Physics, and Chemistry."
      className="flex h-full w-full flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      {leaderboard.data.length === 0 ? (
        <EmptyState message="No students have scores in all three Group A subjects." />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-separate border-spacing-y-1 text-sm">
            <caption className="sr-only">
              Top 10 Group A students ranked by combined Mathematics, Physics,
              and Chemistry score.
            </caption>

            <colgroup>
              <col className="w-11" />
              <col className="w-20" />
              <col />
              <col />
              <col />
              <col />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-1 py-2 text-left font-semibold">
                  Rank
                </th>
                <th scope="col" className="px-1 py-2 text-left font-semibold">
                  Reg. No.
                </th>
                <th scope="col" className="px-1 py-2 text-right font-semibold">
                  Math
                </th>
                <th scope="col" className="px-1 py-2 text-right font-semibold">
                  Phys
                </th>
                <th scope="col" className="px-1 py-2 text-right font-semibold">
                  Chem
                </th>
                <th scope="col" className="px-1 py-2 text-right font-semibold">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.data.map((student) => {
                const surfaceClassName = rowSurfaceClassName(student.rank);
                const isLeader = student.rank === 1;

                return (
                  <tr
                    key={`${student.rank}-${student.registrationNumber}`}
                    className={surfaceClassName}
                  >
                    <td className="rounded-l-lg px-1 py-1.5 align-middle">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                        {isLeader ? (
                          <Crown
                            className="size-3.5 shrink-0 text-amber-300"
                            aria-hidden="true"
                          />
                        ) : null}
                        #{student.rank}
                      </span>
                    </td>

                    <td className="truncate px-1 py-1.5 align-middle font-mono text-xs tracking-wide">
                      {student.registrationNumber}
                    </td>

                    <td
                      className={`px-1 py-1.5 text-right align-middle font-mono text-xs tabular-nums ${scoreClassName(student.rank)}`}
                    >
                      {formatScore(student.math)}
                    </td>
                    <td
                      className={`px-1 py-1.5 text-right align-middle font-mono text-xs tabular-nums ${scoreClassName(student.rank)}`}
                    >
                      {formatScore(student.physics)}
                    </td>
                    <td
                      className={`px-1 py-1.5 text-right align-middle font-mono text-xs tabular-nums ${scoreClassName(student.rank)}`}
                    >
                      {formatScore(student.chemistry)}
                    </td>
                    <td
                      className={`rounded-r-lg px-1 py-1.5 text-right align-middle font-mono text-xs font-bold tabular-nums ${totalClassName(student.rank)}`}
                    >
                      {formatScore(student.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
