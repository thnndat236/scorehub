"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SubjectStatistic } from "@/lib/api/types";
import { formatCount, formatScore } from "@/lib/format";

type SortField =
  | "subjectName"
  | "totalStudents"
  | "averageScore"
  | "highestScore"
  | "lowestScore";

type SortColumn = {
  field: SortField;
  label: string;
  numeric: boolean;
};

const COLUMNS: SortColumn[] = [
  { field: "subjectName", label: "Subject", numeric: false },
  { field: "totalStudents", label: "Total Students", numeric: true },
  { field: "averageScore", label: "Average", numeric: true },
  { field: "highestScore", label: "Highest", numeric: true },
  { field: "lowestScore", label: "Lowest", numeric: true },
];

const collator = new Intl.Collator("en");

type IndexedRow = {
  row: SubjectStatistic;
  index: number;
};

function compareRows(
  a: IndexedRow,
  b: IndexedRow,
  field: SortField,
  ascending: boolean
): number {
  const valueA = a.row[field];
  const valueB = b.row[field];

  if (valueA === null && valueB === null) {
    return a.index - b.index;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  const comparison =
    typeof valueA === "string" && typeof valueB === "string"
      ? collator.compare(valueA, valueB)
      : Number(valueA) - Number(valueB);

  if (comparison === 0) {
    return a.index - b.index;
  }

  return ascending ? comparison : -comparison;
}

type SubjectStatisticsTableProps = {
  data: SubjectStatistic[];
};

export function SubjectStatisticsTable({
  data,
}: SubjectStatisticsTableProps) {
  const [sortField, setSortField] = useState<SortField>("averageScore");
  const [ascending, setAscending] = useState(false);

  const sortedData = useMemo(() => {
    const indexed: IndexedRow[] = data.map((row, index) => ({ row, index }));

    return indexed
      .sort((a, b) => compareRows(a, b, sortField, ascending))
      .map((entry) => entry.row);
  }, [data, sortField, ascending]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setAscending((current) => !current);
      return;
    }

    setSortField(field);
    setAscending(field === "subjectName");
  };

  const sortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown aria-hidden="true" className="size-3 opacity-50" />;
    }

    return ascending ? (
      <ArrowUp aria-hidden="true" className="size-3" />
    ) : (
      <ArrowDown aria-hidden="true" className="size-3" />
    );
  };

  return (
    <Card
      title="Subject Statistics"
      className="flex h-full w-full min-h-0 flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState message="No subject statistics are available." />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border">
          <table className="w-full min-w-90 table-fixed border-collapse text-xs">
            <caption className="sr-only">Subject statistics</caption>

            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[19%]" />
              <col className="w-[17%]" />
              <col className="w-[17%]" />
              <col className="w-[17%]" />
            </colgroup>

            <thead className="sticky top-0 z-10 bg-surface-muted">
              <tr>
                {COLUMNS.map((column) => {
                  const isActive = column.field === sortField;

                  return (
                    <th
                      key={column.field}
                      scope="col"
                      aria-sort={
                        isActive
                          ? ascending
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      className={[
                        "p-0 font-medium text-muted-foreground",
                        column.numeric ? "text-right" : "text-left",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(column.field)}
                        className={[
                          "flex w-full items-center gap-1 px-2 py-2 transition-colors hover:text-foreground",
                          column.numeric ? "justify-end" : "justify-start",
                          isActive ? "text-foreground" : undefined,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span>{column.label}</span>
                        {sortIcon(column.field)}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {sortedData.map((row) => (
                <tr
                  key={row.subjectCode}
                  className="border-t border-border transition-colors hover:bg-surface-muted/60"
                >
                  <th
                    scope="row"
                    className="px-2 py-2 text-left font-medium text-foreground"
                  >
                    {row.subjectName}
                  </th>

                  <td className="px-2 py-2 text-right tabular-nums text-foreground">
                    {formatCount(row.totalStudents)}
                  </td>

                  <td className="px-2 py-2 text-right font-semibold tabular-nums text-accent">
                    {formatScore(row.averageScore)}
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-level-excellent">
                    {formatScore(row.highestScore)}
                  </td>

                  <td className="px-2 py-2 text-right tabular-nums text-level-poor">
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
