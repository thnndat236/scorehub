type AppHeaderProps = {
  title: string;
  onOpenMenu: () => void;
};

export function AppHeader({ title, onOpenMenu }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h1>
    </header>
  );
}
