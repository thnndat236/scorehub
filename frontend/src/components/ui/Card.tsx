import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function Card({
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
}: CardProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <section
      className={[
        "rounded-xl border border-border bg-surface p-5 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasHeader ? (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            ) : null}

            {description ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}

      <div
        className={[hasHeader ? "mt-3" : undefined, contentClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
