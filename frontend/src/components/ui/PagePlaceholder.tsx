type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>
      <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
        UI will be replaced
      </p>
    </section>
  );
}
