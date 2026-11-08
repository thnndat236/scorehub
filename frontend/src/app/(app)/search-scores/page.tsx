import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Search Scores",
};

export default function SearchScoresPage() {
  return (
    <PageIntro
      title="Search Scores"
      description="An 8-digit registration number lookup with a student summary and per-subject score table."
    />
  );
}
