import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SearchForm } from "@/components/search-scores/SearchForm";
import { StudentScoreTable } from "@/components/search-scores/StudentScoreTable";
import { StudentSummary } from "@/components/search-scores/StudentSummary";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ApiError } from "@/lib/api/client";
import { getStudentScores } from "@/lib/api/endpoints";
import type { StudentScoresResponse } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Scores"
};

type StudentResult =
  | { status: "found"; student: StudentScoresResponse }
  | { status: "not-found" }
  | { status: "error"; message: string };

async function loadStudent(registrationNumber: string): Promise<StudentResult> {
  try {
    return {
      status: "found",
      student: await getStudentScores(registrationNumber),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { status: "not-found" };
    }

    if (error instanceof ApiError) {
      return { status: "error", message: error.message };
    }

    throw error;
  }
}

function ResultPanel({ children }: { children: ReactNode }) {
  return (
    <Card
      title="Detailed Scores"
      className="flex h-full w-full flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col justify-center p-6"
    >
      <div className="mx-auto w-full max-w-2xl">
        {children}
      </div>
    </Card>
  );
}

export default async function SearchScoresPage(
  props: PageProps<"/search-scores">
) {
  const params = await props.searchParams;
  const raw = params.registrationNumber;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const registrationNumber = (value ?? "").trim();

  const hasQuery = registrationNumber !== "";
  const isValid = /^\d{8}$/.test(registrationNumber);

  let content: ReactNode;

  if (!hasQuery) {
    content = (
      <ResultPanel>
        <EmptyState
          title="Start a search"
          message="Enter an 8-digit registration number above to view a student's scores."
        />
      </ResultPanel>
    );
  } else if (!isValid) {
    content = (
      <ResultPanel>
        <EmptyState
          title="Invalid registration number"
          message="Registration numbers must contain exactly 8 digits."
        />
      </ResultPanel>
    );
  } else {
    const result = await loadStudent(registrationNumber);

    if (result.status === "not-found") {
      content = (
        <ResultPanel>
          <EmptyState
            title="Student not found"
            message={`No student exists with registration number ${registrationNumber}.`}
          />
        </ResultPanel>
      );
    } else if (result.status === "error") {
      content = (
        <ResultPanel>
          <ErrorState
            title="Unable to load student scores"
            message={result.message}
          />
        </ResultPanel>
      );
    } else {
      content = (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="shrink-0">
            <StudentSummary student={result.student} />
          </div>

          <div className="flex min-h-0 flex-1">
            <StudentScoreTable student={result.student} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="app-page flex flex-col gap-3">
      <div className="shrink-0">
        <SearchForm
          key={registrationNumber}
          initialValue={registrationNumber}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">{content}</div>
    </div>
  );
}
