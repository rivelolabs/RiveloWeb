import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Mail, Apple, Smartphone, type LucideIcon } from "lucide-react";

/* Shared layout for BOOP's legal and support pages, matching the Klyq pages. */

export const BOOP_EMAIL = "support@calquors.com";
export const BOOP_GRADIENT = "linear-gradient(135deg, #14b8a6, #3b82f6)";

export function SectionHeading({ id, number, title }: { id?: string; number: string; title: string }) {
  return (
    <h2 id={id} className="flex items-baseline gap-3 text-xl font-semibold scroll-mt-24" style={{ color: "var(--text)" }}>
      <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{number}</span>
      {title}
    </h2>
  );
}

export function SubHeading({ title }: { title: string }) {
  return <h3 className="mt-5 text-lg font-semibold" style={{ color: "var(--text)", opacity: 0.9 }}>{title}</h3>;
}

export function EmailLink() {
  return (
    <a href={`mailto:${BOOP_EMAIL}`} className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
      {BOOP_EMAIL}
    </a>
  );
}

export function ContactCard({ urlLabel, url, otherHref, otherLabel }: { urlLabel: string; url: string; otherHref?: string; otherLabel?: string }) {
  return (
    <div className="mt-6 rounded-xl p-5 sm:p-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <p className="font-semibold text-base" style={{ color: "var(--text)" }}>BOOP — Rivelo Labs</p>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Managed by calquors.com</p>
      <p className="mt-3 flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
        <EmailLink />
      </p>
      <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
        <p>
          {urlLabel}: <span style={{ color: "var(--text-secondary)" }}>{url}</span>
        </p>
        {otherHref && otherLabel && (
          <p>
            <Link href={otherHref} className="underline underline-offset-4 hover:text-white" style={{ color: "var(--accent)" }}>
              {otherLabel} →
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

type Platform = "ios" | "android";

export function BoopPageShell({
  sections,
  tocTitle = "On this page",
  badgeIcon: BadgeIcon,
  badgeLabel,
  platform,
  titlePrefix,
  titleAccent,
  meta,
  sideLinks,
  children,
}: {
  sections: { id: string; label: string }[];
  tocTitle?: string;
  badgeIcon: LucideIcon;
  badgeLabel: string;
  platform?: Platform;
  titlePrefix: string;
  titleAccent: string;
  meta: string[];
  sideLinks: { caption: string; href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mesh-gradient" />

      <div className="mx-auto max-w-6xl relative z-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar TOC — sticky on desktop */}
          <aside className="hidden lg:block lg:w-56 shrink-0">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                {tocTitle}
              </p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-[13px] transition-colors py-1 border-l-2 border-transparent pl-3 -ml-0.5 hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                {sideLinks.map((l) => (
                  <div key={l.href} className="mb-3">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{l.caption}</p>
                    <Link href={l.href} className="text-[13px] font-medium underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      {l.label} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="card min-w-0 flex-1 p-6 sm:p-10 lg:p-12">
            <div className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="badge mb-4">
                <BadgeIcon className="h-3.5 w-3.5" />
                {badgeLabel}
              </div>
              {platform && (
                <div
                  className="mb-3 ml-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.3)", color: "#0d9488" }}
                >
                  {platform === "ios" ? <Apple className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                  {platform === "ios" ? "iOS Version" : "Android Version"}
                </div>
              )}
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-display), system-ui, sans-serif", color: "var(--text)" }}
              >
                {titlePrefix}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: BOOP_GRADIENT }}>
                  {titleAccent}
                </span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                {meta.map((m) => (
                  <p key={m}>{m}</p>
                ))}
              </div>
            </div>

            <div className="space-y-10 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {children}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
