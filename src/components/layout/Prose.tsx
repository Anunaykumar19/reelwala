import PageShell from "./PageShell";
export default function Prose({ title, eyebrow, updated, children }: { title: string; eyebrow: string; updated?: string; children: React.ReactNode }) {
  return (
    <PageShell>
      <div className="container max-w-3xl pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink">{eyebrow}</p>
        <h1 className="mt-3 font-display text-h1 font-bold">{title}</h1>
        {updated && <p className="mt-2 text-xs text-muted">Last updated: {updated}</p>}
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-fg/90 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-pink [&_a]:underline [&_p]:text-muted [&_li]:text-muted [&_strong]:text-fg">{children}</div>
      </div>
    </PageShell>
  );
}
