import type { CSSProperties } from "react";

export const SCORE_LEVELS = [
  {
    key: "excellent",
    label: "Excellent",
    range: "≥ 8.0",
    color: "var(--level-excellent)",
  },
  {
    key: "good",
    label: "Good",
    range: "6.0 – < 8.0",
    color: "var(--level-good)",
  },
  {
    key: "average",
    label: "Average",
    range: "4.0 – < 6.0",
    color: "var(--level-average)",
  },
  {
    key: "poor",
    label: "Poor",
    range: "< 4.0",
    color: "var(--level-poor)",
  },
] as const;

export type ScoreLevelKey = (typeof SCORE_LEVELS)[number]["key"];

export const CHART_GRID_COLOR = "var(--chart-grid)";
export const CHART_AXIS_COLOR = "var(--chart-axis)";
export const CHART_FONT_FAMILY = "var(--font-sans)";
export const HISTOGRAM_COLOR = "var(--accent)";

export const CHART_TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: "var(--chart-tooltip-bg)",
  border: "1px solid var(--chart-tooltip-border)",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgb(15 23 42 / 0.16)",
  color: "var(--foreground)",
  fontSize: "12px",
  lineHeight: 1.5,
  padding: "8px 10px",
};

export function formatCompactCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }

  return String(value);
}

export function levelPercentage(count: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return (count / total) * 100;
}
