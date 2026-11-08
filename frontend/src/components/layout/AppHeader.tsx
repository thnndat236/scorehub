import { Menu } from "lucide-react";

type AppHeaderProps = {
  title: string;
  onOpenMenu: () => void;
};

export function AppHeader({ title, onOpenMenu }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <h1 className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h1>
    </header>
  );
}
