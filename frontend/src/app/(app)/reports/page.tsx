import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <PagePlaceholder
      title="Reports"
      description="Score distribution by subject, the 20-bin histogram, and detailed subject statistics."
    />
  );
}
