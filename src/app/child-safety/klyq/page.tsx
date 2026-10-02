import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Mail, Flag, Ban, Scale, ShieldCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Child Safety Standards & CSAE Prevention Policy — Klyq | Rivelolabs",
  description:
    "Published Child Sexual Abuse and Exploitation (CSAE) prevention standards, CSAM zero-tolerance policy, in-app reporting mechanisms, and legal compliance for Klyq by Rivelo Labs.",
};

function SectionHeading({ id, number, title }: { id?: string; number: string; title: string }) {
  return (
    <h2 id={id} className="flex items-baseline gap-3 text-xl font-semibold scroll-mt-24" style={{ color: "var(--text)" }}>
      <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{number}</span>
      {title}
    </h2>
  );
}

function SubHeading({ title }: { title: string }) {
  return <h3 className="mt-5 text-lg font-semibold" style={{ color: "var(--text)", opacity: 0.9 }}>{title}</h3>;
}

export default function KlyqChildSafetyPage() {
  const sections = [
    { id: "policy", label: "1. Zero-Tolerance Policy" },
    { id: "age", label: "2. Age Restriction (18+)" },
    { id: "prohibited", label: "3. Prohibited Conduct" },
    { id: "reporting", label: "4. In-App Reporting" },
    { id: "moderation", label: "5. Moderation & Enforcement" },
    { id: "authorities", label: "6. Reporting to Authorities" },
    { id: "contact", label: "7. Designated Contact" },
  ];

  return (
    <main className="relative min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="mesh-gradient" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar TOC — sticky on desktop */}
          <aside className="hidden lg:block lg:w-60 shrink-0">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Safety Standards
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
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Related Policies:</p>
                <div className="mt-2 flex flex-col gap-2">
                  <Link href="/privacy/klyq-android" className="text-[13px] font-medium underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    Klyq Android Privacy Policy →
                  </Link>
                  <Link href="/privacy/klyq" className="text-[13px] font-medium underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    Klyq iOS Privacy Policy →
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="card min-w-0 flex-1 p-6 sm:p-10 lg:p-12">
            {/* Header */}
            <div className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="badge mb-4">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                Child Safety Standards
              </div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.25)", color: "#f43f5e" }}>
                <ShieldCheck className="h-3.5 w-3.5" /> CSAE &amp; CSAM Prevention Policy
              </div>
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  color: "var(--text)",
                }}
              >
                Child Sexual Abuse and Exploitation (CSAE) Prevention &amp;{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #f43f5e, #8b5cf6)" }}
                >
                  Child Safety Standards
                </span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>App: Klyq (com.klyq.app)</p>
                <p>Developer: Rivelo Labs (Calquors Private Limited)</p>
                <p>Effective Date: June 20, 2026</p>
                <p>Last Updated: October 2, 2026</p>
              </div>
            </div>

            {/* Policy Summary Callout */}
            <div className="mb-8 rounded-2xl p-5 sm:p-6" style={{ backgroundColor: "rgba(244, 63, 94, 0.06)", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm sm:text-base">
                  <p className="font-semibold text-white">Public Statement of Commitment</p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Rivelo Labs maintains an absolute zero-tolerance policy against Child Sexual Abuse Material (CSAM) and Child Sexual Exploitation and Abuse (CSAE). We are committed to preventing, identifying, reporting, and eradicating any misuse of our platforms that endangers children.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-10 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {/* 1. Zero-Tolerance Policy */}
              <section>
                <SectionHeading id="policy" number="01" title="Zero-Tolerance Policy on CSAE &amp; CSAM" />
                <p className="mt-3">
                  Klyq, operated by Rivelo Labs and managed by calquors.com, strictly prohibits any form of Child Sexual Abuse Material (CSAM) and Child Sexual Exploitation and Abuse (CSAE) across all parts of our service.
                </p>
                <p className="mt-3">
                  We enforce zero tolerance for any content, behavior, or communication that exploits, endangers, or harms children. Violations will result in immediate termination of the offending user&apos;s account, permanent bans across device and authentication credentials, preservation of evidence, and proactive referral to law enforcement authorities.
                </p>
              </section>

              {/* 2. Age Requirement & Restrictions */}
              <section>
                <SectionHeading id="age" number="02" title="Strict Age Restriction (18+ Adults Only)" />
                <p className="mt-3">
                  Klyq is exclusively designed and intended for adults aged 18 and older (or the legal age of majority in your jurisdiction, if higher).
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 marker:text-rose-500/80">
                  <li>
                    <strong style={{ color: "var(--text)" }}>Age Verification at Registration:</strong> All users are required to provide their date of birth during account sign-up. Accounts indicating an age under 18 are rejected at registration.
                  </li>
                  <li>
                    <strong style={{ color: "var(--text)" }}>Prohibition of Minors:</strong> Minors are not permitted to register, create profiles, access community feeds, join circles, send direct messages, or participate in live audio/video calls.
                  </li>
                  <li>
                    <strong style={{ color: "var(--text)" }}>Immediate Termination of Underage Accounts:</strong> If we discover or have reason to suspect that an account belongs to or is operated by an individual under the age of 18, that account and its associated data are promptly terminated.
                  </li>
                </ul>
              </section>

              {/* 3. Prohibited Conduct & Prohibited Content */}
              <section>
                <SectionHeading id="prohibited" number="03" title="Prohibited Conduct and Prohibited Content" />
                <p className="mt-3">The following behaviors and content are strictly banned on Klyq without exception:</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <p className="font-semibold text-sm text-white flex items-center gap-2">
                      <Ban className="h-4 w-4 text-rose-400" /> CSAM Generation &amp; Distribution
                    </p>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Uploading, capturing, streaming, linking to, requesting, or distributing any visual depictions of child sexual abuse, sexual acts involving minors, or sexually explicit content featuring children, including real, AI-generated, or synthetic depictions.
                    </p>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <p className="font-semibold text-sm text-white flex items-center gap-2">
                      <Ban className="h-4 w-4 text-rose-400" /> Child Grooming &amp; Enticement
                    </p>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Attempting to build an emotional relationship with a minor, entice, persuade, or solicit a child for sexual conduct, sexual abuse, or illicit meetings.
                    </p>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <p className="font-semibold text-sm text-white flex items-center gap-2">
                      <Ban className="h-4 w-4 text-rose-400" /> Sextortion &amp; Exploitation
                    </p>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Coercing, blackmailing, threatening, or soliciting sexual imagery or intimate material from anyone, particularly minors.
                    </p>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <p className="font-semibold text-sm text-white flex items-center gap-2">
                      <Ban className="h-4 w-4 text-rose-400" /> Commercial Exploitation &amp; Trafficking
                    </p>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Any commercial sexual exploitation, human trafficking, or solicitation of child sex acts.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. In-App Reporting Mechanisms */}
              <section>
                <SectionHeading id="reporting" number="04" title="In-App Reporting &amp; User Protection Mechanisms" />
                <p className="mt-3">
                  Klyq provides continuous, accessible, in-app mechanisms empowering users to immediately report any child safety concerns, inappropriate behavior, or suspected underage users across all interactive surfaces:
                </p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start gap-3">
                      <Flag className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Live Call In-App Reporting &amp; Instant Block</p>
                        <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                          During any direct audio or video call on the Live screen, a dedicated <strong>Report</strong> button and <strong>Block</strong> button are permanently visible on screen. Tapping report allows immediate flagging under safety categories, including child endangerment. Tapping block instantly disconnects the stream and prevents any further calls or contact.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start gap-3">
                      <Flag className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Direct Messages, Circles &amp; In-Game Chat Reporting</p>
                        <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                          Users can flag any message, photo, or conversation by using the message options menu or the conversation settings menu to report inappropriate conduct or child safety concerns.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start gap-3">
                      <Flag className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">Profile &amp; Community Post Reporting</p>
                        <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                          Every user profile and community post includes a menu option to report the account or post directly to our moderation team with optional context and proof.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-white">External Direct Reporting via Email</p>
                        <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                          Anyone can submit child safety reports directly to our dedicated safety contact email:{" "}
                          <a href="mailto:rivelolabs@gmail.com" className="underline underline-offset-4 text-indigo-400 font-medium">
                            rivelolabs@gmail.com
                          </a>{" "}
                          or{" "}
                          <a href="mailto:support@calquors.com" className="underline underline-offset-4 text-indigo-400 font-medium">
                            support@calquors.com
                          </a>
                          . These reports are handled with the highest priority.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Moderation & Enforcement */}
              <section>
                <SectionHeading id="moderation" number="05" title="Content Moderation, Investigation &amp; Enforcement" />
                <p className="mt-3">
                  When a report involving child safety or CSAE is submitted, our operations team follows a strict, expedited escalation protocol:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 marker:text-rose-500/80">
                  <li>
                    <strong style={{ color: "var(--text)" }}>High-Priority Triage:</strong> Reports concerning potential CSAM, grooming, or child exploitation take precedence over all standard moderation tickets.
                  </li>
                  <li>
                    <strong style={{ color: "var(--text)" }}>Immediate Action &amp; Content Removal:</strong> Any confirmed or suspected material depicting or relating to CSAE is removed from our platform immediately and quarantined from public access.
                  </li>
                  <li>
                    <strong style={{ color: "var(--text)" }}>Account Termination &amp; Hardware/IP Blacklisting:</strong> Violators receive permanent account bans without recourse. Associated device identifiers, email addresses, and network identifiers are blacklisted to block subsequent attempts to access the platform.
                  </li>
                  <li>
                    <strong style={{ color: "var(--text)" }}>Evidence Preservation:</strong> Transaction records, account logs, and reported materials are preserved in a secure, isolated environment strictly for evidentiary handover to authorized law enforcement and regulatory authorities.
                  </li>
                </ul>
              </section>

              {/* 6. Reporting to Authorities & Legal Compliance */}
              <section>
                <SectionHeading id="authorities" number="06" title="Reporting to Law Enforcement &amp; Authorities" />
                <p className="mt-3">
                  Rivelo Labs complies with all applicable local, national, and international child protection laws and regulations:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 marker:text-rose-500/80">
                  <li>
                    <strong style={{ color: "var(--text)" }}>Mandatory Reporting:</strong> In compliance with legal mandates (including 18 U.S.C. § 2258A and international equivalents), we report any apparent Child Sexual Abuse Material (CSAM) or Child Sexual Exploitation and Abuse (CSAE) to the <strong>National Center for Missing &amp; Exploited Children (NCMEC)</strong> via the CyberTipline and/or relevant national and regional law enforcement authorities.
                  </li>
                  <li>
                    <strong style={{ color: "var(--text)" }}>Law Enforcement Cooperation:</strong> We promptly cooperate with official law enforcement requests, valid subpoenas, search warrants, and court orders relating to investigations of child endangerment, abuse, or exploitation.
                  </li>
                </ul>
              </section>

              {/* 7. Designated Point of Contact */}
              <section>
                <SectionHeading id="contact" number="07" title="Designated Child Safety Point of Contact" />
                <p className="mt-3">
                  We have established a designated point of contact ready and able to speak about our child sexual abuse material (CSAM) prevention practices, child safety compliance, and incoming reports:
                </p>

                <div className="mt-6 rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-lg font-bold text-white">Rivelo Labs — Child Safety &amp; Compliance</p>
                      <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
                        Operated by Rivelo Labs &bull; Managed by Calquors Private Limited
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      Designated CSAM Contact
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-rose-400 shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400">Developer Contact Email (Google Play Console):</span>
                        <p>
                          <a href="mailto:rivelolabs@gmail.com" className="font-semibold text-white underline underline-offset-4 hover:text-rose-400 transition-colors">
                            rivelolabs@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400">App Support &amp; Compliance Email:</span>
                        <p>
                          <a href="mailto:support@calquors.com" className="font-semibold text-white underline underline-offset-4 hover:text-indigo-400 transition-colors">
                            support@calquors.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Scale className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-xs text-slate-400">Official Standards Link:</span>
                        <p className="font-mono text-xs text-slate-300 break-all">
                          https://rivelolabs.com/child-safety/klyq
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <p>Google Play Package: com.klyq.app</p>
                    <div className="flex items-center gap-3">
                      <Link href="/privacy/klyq-android" className="underline underline-offset-4 hover:text-white" style={{ color: "var(--accent)" }}>
                        Android Privacy Policy
                      </Link>
                      <span>&bull;</span>
                      <Link href="/privacy/klyq" className="underline underline-offset-4 hover:text-white" style={{ color: "var(--accent)" }}>
                        iOS Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
