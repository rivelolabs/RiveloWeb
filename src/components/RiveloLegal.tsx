import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Shield, Mail } from "lucide-react";

export type LegalSection = { id: string; title: string; body: ReactNode };

export const LEGAL_CONTACT = "hello@rivelolabs.com";

export default function RiveloLegal({
  badge,
  title,
  intro,
  updated,
  sections,
  other,
}: {
  badge: string;
  title: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
  other: { href: string; label: string };
}) {
  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mesh-gradient" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Rivelo Labs
        </Link>
        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="hidden shrink-0 lg:block lg:w-56">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>On this page</p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="-ml-0.5 border-l-2 border-transparent py-1 pl-3 text-[13px]" style={{ color: "var(--text-muted)" }}>{s.title}</a>
                ))}
              </nav>
              <Link href={other.href} className="mt-6 inline-block text-[13px] font-medium" style={{ color: "var(--accent)" }}>{other.label} →</Link>
            </div>
          </aside>
          <article className="card min-w-0 flex-1 p-6 sm:p-10 lg:p-12" style={{ color: "var(--text-secondary)" }}>
            <header className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="badge mb-4"><Shield className="h-3.5 w-3.5" /> {badge}</div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display), system-ui, sans-serif", color: "var(--text)" }}>{title}</h1>
              <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Last updated: {updated}</p>
              <div className="mt-6 space-y-3 text-[15px] leading-7">{intro}</div>
            </header>
            <div className="space-y-10">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="flex items-baseline gap-3 text-xl font-semibold" style={{ color: "var(--text)" }}>
                    <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="legal-body mt-4 space-y-3 text-[15px] leading-7 [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_ul]:space-y-2">{s.body}</div>
                </section>
              ))}
            </div>
            <footer className="mt-12 flex flex-wrap items-center gap-3 pt-8 text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <Mail className="h-4 w-4" /> Questions? Email <a href={`mailto:${LEGAL_CONTACT}`} style={{ color: "var(--accent)" }}>{LEGAL_CONTACT}</a>
              <span aria-hidden="true">·</span>
              <Link href={other.href} style={{ color: "var(--accent)" }}>{other.label}</Link>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
}
