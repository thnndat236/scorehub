import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SearchForm } from "@/components/search-scores/SearchForm";
import { StudentScoreTable } from "@/components/search-scores/StudentScoreTable";
import { StudentSummary } from "@/components/search-scores/StudentSummary";
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

export default async function SearchScoresPage(props: PageProps<"/search-scores">) {
  const params = await props.searchParams;
  const raw = params.registrationNumber;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const registrationNumber = (value ?? "").trim();

  const hasQuery = registrationNumber !== "";
  const isValid = /^\d{8}$/.test(registrationNumber);

  let content: ReactNode;

  if (!hasQuery) {
    content = (
      <EmptyState
        title="Start a search"
        message="Enter an 8-digit registration number above to view a student's scores."
      />
    );
  } else if (!isValid) {
    content = (
      <EmptyState
        title="Invalid registration number"
        message="Registration numbers must contain exactly 8 digits."
      />
    );
  } else {
    const result = await loadStudent(registrationNumber);

    if (result.status === "not-found") {
      content = (
        <EmptyState
          title="Student not found"
          message={`No student exists with registration number ${registrationNumber}.`}
        />
      );
    } else if (result.status === "error") {
      content = (
        <ErrorState
          title="Unable to load student scores"
          message={result.message}
        />
      );
    } else {
      content = (
        <div className="space-y-6">
          <StudentSummary student={result.student} />
          <StudentScoreTable student={result.student} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Search Scores
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Look up a student by their 8-digit registration number.
        </p>
      </div>

      <SearchForm
        key={registrationNumber}
        initialValue={registrationNumber}
      />

      {content}
    </div>
  );
}
