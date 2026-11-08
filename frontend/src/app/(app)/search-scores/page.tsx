import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Search Scores",
};

export default function SearchScoresPage() {
  return (
    <PagePlaceholder
      title="Search Scores"
      description="An 8-digit registration number lookup with a student summary and per-subject score table."
    />
  );
}
