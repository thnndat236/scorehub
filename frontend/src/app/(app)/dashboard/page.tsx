import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="Dashboard"
      description="Overview metrics, overall student average distribution, and the Top 10 Group A leaderboard."
    />
  );
}
