import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <PageIntro
      title="Reports"
      description="Score distribution by subject, the 20-bin histogram, and detailed subject statistics."
    />
  );
}
