import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function Card({ title, description, className, children }: CardProps) {
  return (
    <section
      className={[
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? (
        <p className="text-sm font-medium text-slate-500">{title}</p>
      ) : null}

      {description ? (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      ) : null}

      <div className={title || description ? "mt-2" : undefined}>
        {children}
      </div>
    </section>
  );
}
