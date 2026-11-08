import Link from "next/link";
import { GraduationCap } from "lucide-react";

type BrandProps = {
  onNavigate?: () => void;
  className?: string;
};

export function Brand({ onNavigate, className }: BrandProps) {
  return (
    <Link
      href="/dashboard"
      onClick={onNavigate}
      aria-label="ScoreHub dashboard"
      className={[
        "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm">
        <GraduationCap className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">
        Score<span className="text-accent">Hub</span>
      </span>
    </Link>
  );
}
