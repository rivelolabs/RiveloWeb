import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Mail, Apple } from "lucide-react";

export const metadata: Metadata = {
  title: "Klyq Privacy Policy (iOS) | Rivelolabs",
  description:
    "Privacy Policy for the Klyq iOS app — random video, voice & text matching, multiplayer games, anonymous circles, and nearby discovery.",
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

export default function KlyqPrivacyPage() {
  const sections = [
    { id: "who", label: "Who We Are" },
    { id: "scope", label: "Scope" },
    { id: "collect", label: "Information We Collect" },
    { id: "use", label: "How We Use Info" },
    { id: "matching", label: "Live Matching & Media" },
    { id: "location", label: "Location & Nearby" },
    { id: "tracking", label: "Tracking & Ads" },
    { id: "sharing", label: "How We Share" },
    { id: "safety", label: "Safety & Moderation" },
    { id: "retention", label: "Data Retention" },
    { id: "storage", label: "Storage & Security" },
    { id: "choices", label: "Your Controls" },
    { id: "children", label: "Age Requirement" },
    { id: "international", label: "International" },
    { id: "rights", label: "Your Rights" },
    { id: "changes", label: "Changes" },
    { id: "contact", label: "Contact" },
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
          <aside className="hidden lg:block lg:w-56 shrink-0">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                On this page
              </p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-[13px] transition-colors py-1 border-l-2 border-transparent pl-3 -ml-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Using Android?</p>
                <Link href="/privacy/klyq-android" className="text-[13px] font-medium underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  Klyq Android Privacy Policy →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <article className="card min-w-0 flex-1 p-6 sm:p-10 lg:p-12">
            {/* Header */}
            <div className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="badge mb-4">
                <Shield className="h-3.5 w-3.5" />
                Privacy Policy
              </div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(236, 72, 153, 0.1)", border: "1px solid rgba(236, 72, 153, 0.25)", color: "#ec4899" }}>
                <Apple className="h-3.5 w-3.5" /> iOS Version
              </div>
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  color: "var(--text)",
                }}
              >
                Privacy Policy for{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
                >
                  Klyq
                </span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>Effective Date: June 20, 2026</p>
                <p>Last Updated: June 20, 2026</p>
                <p>Platform: Apple iOS</p>
              </div>
            </div>

            <div className="space-y-10 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {/* Intro */}
              <p>
                Klyq (&quot;Klyq&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operated by Rivelo Labs, respects your privacy. This Privacy Policy explains how we collect, use, disclose, store, and protect information when you use the Klyq iOS application and related services (the &quot;Services&quot;).
              </p>
              <p>
                Klyq is a live social app that lets you meet new people through random video, voice, and text matching, play quick multiplayer games against other people, join anonymous circles, share posts and stories in communities, and discover people and groups nearby. Because Klyq connects you with other people — including strangers — please read this policy and our safety guidance carefully.
              </p>
              <p>
                By using Klyq, you agree to this Privacy Policy. If you do not agree, please do not use the Services.
              </p>

              {/* 1. Who We Are */}
              <section>
                <SectionHeading id="who" number="01" title="Who We Are" />
                <p className="mt-3">
                  Klyq is a real-time social, matching, and gaming app operated by Rivelo Labs.
                </p>
                <div className="mt-4 rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>App &amp; Developer:</p>
                  <p>Klyq — operated by Rivelo Labs</p>
                  <p>Managed by calquors.com</p>
                  <p>Bundle ID: jai.Klyq</p>
                  <p className="mt-1">
                    Email:{" "}
                    <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      support@calquors.com
                    </a>
                  </p>
                </div>
              </section>

              {/* 2. Scope */}
              <section>
                <SectionHeading id="scope" number="02" title="Scope of This Privacy Policy" />
                <p className="mt-3">This Privacy Policy applies to information collected through:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>The Klyq iOS app</li>
                  <li>Features within the app, including random video / voice / text matching, multiplayer games, anonymous circles, communities, posts, stories, direct messages, and nearby discovery</li>
                  <li>Customer support and privacy-related communications with us</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  A separate policy applies to the Klyq{" "}
                  <Link href="/privacy/klyq-android" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>Android app</Link>. This Privacy Policy does not apply to third-party services we do not control (for example, Apple, the App Store, or other people you interact with on Klyq), which have their own terms and privacy policies.
                </p>
              </section>

              {/* 3. Information We Collect */}
              <section>
                <SectionHeading id="collect" number="03" title="Information We Collect" />
                <p className="mt-3">
                  Depending on the features you use, we may collect the following categories of information:
                </p>

                <SubHeading title="3.1 Account and Identity Information" />
                <p className="mt-2">When you create a Klyq account using email and password authentication (powered by Firebase Authentication), we collect:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Email address</li>
                  <li>An authentication credential (your password is handled by Firebase Authentication; we do not store your plain-text password)</li>
                  <li>A unique user ID</li>
                  <li>Display name / username and account settings</li>
                </ul>

                <SubHeading title="3.2 Profile and Content You Create" />
                <p className="mt-2">Information you choose to add or share in the app, such as:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Profile details (display name, bio, avatar/photo, and preferences)</li>
                  <li>Posts, stories, comments, and reactions</li>
                  <li>Communities and circles you create or join</li>
                  <li>Direct messages and chat sent during matches and in circles</li>
                </ul>

                <SubHeading title="3.3 Camera and Microphone (Optional — Live Matching)" />
                <p className="mt-2">
                  Random video matching and voice/audio rooms use your device&apos;s camera and microphone. We access the camera and/or microphone only while you are actively using a video or voice feature, and only after you grant permission through iOS. Live audio and video streams are used to connect you with the person you are matched with in real time.
                </p>

                <SubHeading title="3.4 Approximate Location (Optional — Nearby)" />
                <p className="mt-2">
                  The Nearby feature shows people and groups around you on a map. If you enable it and grant location permission, we use your device location to power nearby discovery. You control this through iOS location permissions and can choose approximate (rather than precise) location.
                </p>

                <SubHeading title="3.5 Communications and Interaction Data" />
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Messages and chat content you send through matches, circles, and direct messages</li>
                  <li>Matching activity (who you connect, skip, like, block, or report)</li>
                  <li>Reports and safety-related information you submit about other users</li>
                </ul>

                <SubHeading title="3.6 Multiplayer Game Data" />
                <p className="mt-2">When you play games such as Tic Tac Toe, Connect Four, Rock Paper Scissors, or Memory Match, we process gameplay data needed to run a live match, such as moves, results, scores, and the opponent you are paired with.</p>

                <SubHeading title="3.7 Device, App, and Diagnostic Information" />
                <p className="mt-2">
                  We may collect basic technical information needed to operate, secure, and improve the Services, such as:
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>App version, device type, and operating system version</li>
                  <li>Error logs and crash/diagnostic information</li>
                  <li>Basic usage and performance analytics (via Firebase / Google Analytics for app developers)</li>
                  <li>A device push token if you enable notifications</li>
                </ul>
              </section>

              {/* 4. How We Use Your Information */}
              <section>
                <SectionHeading id="use" number="04" title="How We Use Your Information" />
                <p className="mt-3">We use your information to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Create and manage your account and authenticate you</li>
                  <li>Connect you with other people through random video, voice, and text matching</li>
                  <li>Run live multiplayer games and pair you with opponents</li>
                  <li>Power communities, circles, posts, stories, and direct messaging</li>
                  <li>Provide nearby discovery when you enable it</li>
                  <li>Keep Klyq safe — detect, review, and act on abuse, spam, and policy violations</li>
                  <li>Send notifications you have enabled</li>
                  <li>Improve app performance, reliability, and user experience</li>
                  <li>Provide support and respond to your requests</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* 5. Live Matching & Media */}
              <section>
                <SectionHeading id="matching" number="05" title="Live Matching, Video &amp; Voice" />
                <p className="mt-3">
                  Klyq&apos;s random matching connects you with other real people, including strangers. When you use video or voice features:
                </p>
                <div className="mt-3 rounded-xl p-5 space-y-2" style={{ backgroundColor: "rgba(236, 72, 153, 0.05)", border: "1px solid rgba(236, 72, 153, 0.12)" }}>
                  <p className="flex items-start gap-2"><span className="mt-0.5" style={{ color: "#ec4899" }}>&#10003;</span> Live audio/video is used to connect you with your match in real time.</p>
                  <p className="flex items-start gap-2"><span className="mt-0.5" style={{ color: "#ec4899" }}>&#10003;</span> The people you match with can see and/or hear you and anything in view of your camera and microphone — only share what you are comfortable with.</p>
                  <p className="flex items-start gap-2"><span className="mt-0.5" style={{ color: "#ec4899" }}>&#10003;</span> You can skip, leave, block, or report at any time.</p>
                  <p className="flex items-start gap-2"><span className="mt-0.5" style={{ color: "#ec4899" }}>&#10003;</span> We do not sell your video or voice streams or use them for advertising.</p>
                </div>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We may retain limited information related to a session (for example, reports, block records, or safety signals) to investigate abuse and keep the community safe, as described in Section 9.
                </p>
              </section>

              {/* 6. Location */}
              <section>
                <SectionHeading id="location" number="06" title="Location and Nearby" />
                <p className="mt-3">
                  Location is optional and used only to power the Nearby feature. You can grant, limit (approximate only), or revoke location access at any time in iOS Settings. If you disable location, Nearby will be limited or unavailable, but the rest of Klyq will continue to work.
                </p>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  We do not use your location for advertising and do not sell your location data.
                </p>
              </section>

              {/* 7. Tracking and Advertising */}
              <section>
                <SectionHeading id="tracking" number="07" title="Tracking and Advertising" />
                <p className="mt-3">
                  Klyq does not display third-party ads and does not track you across other companies&apos; apps or websites for advertising purposes.
                </p>
                <p className="mt-3">We do not:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Use your personal data for cross-app/cross-website behavioral advertising</li>
                  <li>Sell your personal information or share it with data brokers</li>
                  <li>Collect the Identifier for Advertisers (IDFA)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  Because Klyq does not perform tracking as defined by Apple&apos;s App Tracking Transparency (ATT) framework, Klyq does not request ATT permission unless our practices change in the future.
                </p>
              </section>

              {/* 8. How We Share Information */}
              <section>
                <SectionHeading id="sharing" number="08" title="How We Share Information" />
                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>We do not sell your personal information.</p>

                <SubHeading title="8.1 Other Users (By Design)" />
                <p className="mt-2">
                  Klyq is a social product, so some information is shared with other people by design — for example, your profile and username, posts and stories you publish, messages you send, and your live video/voice/text during a match. Content shared publicly or with a circle may be seen, saved, or screenshotted by others outside our control.
                </p>

                <SubHeading title="8.2 Apple" />
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Apple Push Notification service (APNs) for notifications you enable</li>
                  <li>App Store / StoreKit if you make any in-app purchase</li>
                </ul>

                <SubHeading title="8.3 Service Providers (Infrastructure)" />
                <p className="mt-2">We use trusted providers to operate the app, including:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Google Firebase — Authentication, Realtime Database, and app analytics/diagnostics</li>
                  <li>Cloud hosting and infrastructure used to deliver real-time features</li>
                </ul>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  Firebase Privacy &amp; Security:{" "}
                  <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    firebase.google.com/support/privacy
                  </a>
                </p>

                <SubHeading title="8.4 Legal, Safety, and Security" />
                <p className="mt-2">We may disclose information if reasonably necessary to:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Comply with legal obligations or valid legal process</li>
                  <li>Enforce our terms or protect our rights</li>
                  <li>Protect the safety, security, and integrity of users, the Services, or the public</li>
                </ul>
              </section>

              {/* 9. Safety & Moderation */}
              <section>
                <SectionHeading id="safety" number="09" title="Safety, Moderation &amp; Reporting" />
                <p className="mt-3">
                  Because Klyq connects you with other people, we provide tools and processes to keep the community safe:
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li><span className="font-medium" style={{ color: "var(--text)" }}>Block &amp; skip:</span> end or avoid an interaction at any time.</li>
                  <li><span className="font-medium" style={{ color: "var(--text)" }}>Report:</span> flag users or content that violate our rules.</li>
                  <li><span className="font-medium" style={{ color: "var(--text)" }}>Review &amp; enforcement:</span> we may review reported content and account activity and take action, including warnings, content removal, or account suspension.</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  To operate these protections, we may process and retain reports, block records, and related metadata for as long as needed to investigate abuse, enforce our terms, and comply with the law.
                </p>
              </section>

              {/* 10. Data Retention */}
              <section>
                <SectionHeading id="retention" number="10" title="Data Retention" />
                <p className="mt-3">We retain personal information only for as long as reasonably necessary to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Provide the Services and features you use</li>
                  <li>Maintain your account and content</li>
                  <li>Keep the community safe and enforce our terms</li>
                  <li>Comply with legal obligations and resolve disputes</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  When you delete your account, we delete or anonymize your associated data within a reasonable period, subject to legal, security, backup, and safety/moderation requirements.
                </p>
              </section>

              {/* 11. Storage & Security */}
              <section>
                <SectionHeading id="storage" number="11" title="Data Storage and Security" />
                <p className="mt-3">Your information may be stored:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Locally on your device</li>
                  <li>In secure cloud services used to operate the app (such as Firebase Authentication and Realtime Database)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We use reasonable administrative, technical, and organizational measures, and communication with our backend uses encryption in transit (HTTPS/TLS). However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* 12. Your Choices and Controls */}
              <section>
                <SectionHeading id="choices" number="12" title="Your Choices and Controls" />

                <SubHeading title="12.1 Profile &amp; Content" />
                <p className="mt-2">You can edit your profile and delete content you have posted within the app.</p>

                <SubHeading title="12.2 Camera, Microphone &amp; Location Permissions" />
                <p className="mt-2">You can grant or revoke camera, microphone, and location access at any time in iOS Settings → Klyq.</p>

                <SubHeading title="12.3 Notifications" />
                <p className="mt-2">You can manage push notifications in iOS Settings → Klyq → Notifications.</p>

                <SubHeading title="12.4 Block &amp; Report" />
                <p className="mt-2">You can block and report other users directly from a match, chat, or profile.</p>

                <SubHeading title="12.5 Account Deletion" />
                <p className="mt-2">You can request deletion of your account and associated data from within the app:</p>
                <div className="mt-2 rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: "var(--code-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  Profile / Settings → Delete Account
                </div>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  You can also email{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>support@calquors.com</a>{" "}
                  to request deletion.
                </p>
              </section>

              {/* 13. Age Requirement */}
              <section>
                <SectionHeading id="children" number="13" title="Age Requirement" />
                <p className="mt-3">
                  Klyq includes live, unmoderated-in-real-time interactions with strangers and is intended for adults. You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Services. Klyq is not directed to children, and we do not knowingly collect personal information from anyone under 18. If you believe a minor has provided us personal information, contact us and we will take appropriate steps to remove it.
                </p>
              </section>

              {/* 14. International Users */}
              <section>
                <SectionHeading id="international" number="14" title="International Users" />
                <p className="mt-3">
                  If you use Klyq from outside the country where our services are hosted, your information may be processed and stored in other countries where we or our service providers (such as Google Firebase) operate. Data protection laws in those countries may differ from the laws in your location.
                </p>
              </section>

              {/* 15. Your Regional Rights */}
              <section>
                <SectionHeading id="rights" number="15" title="Your Regional Rights (Where Applicable)" />
                <p className="mt-3">
                  Depending on your location (for example, under GDPR or CCPA/CPRA), you may have rights to:
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Request data portability (where applicable)</li>
                  <li>Withdraw consent for optional permissions (camera, microphone, location)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  To exercise applicable rights, contact us at{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    support@calquors.com
                  </a>
                  . We may need to verify your identity before fulfilling certain requests.
                </p>
              </section>

              {/* 16. Changes */}
              <section>
                <SectionHeading id="changes" number="16" title="Changes to This Privacy Policy" />
                <p className="mt-3">
                  We may update this Privacy Policy from time to time. If we make material changes, we will post the updated version at this URL and update the &quot;Effective Date&quot; / &quot;Last Updated&quot; date above. Your continued use of Klyq after changes become effective means you accept the updated Privacy Policy.
                </p>
              </section>

              {/* 17. Contact Us */}
              <section>
                <SectionHeading id="contact" number="17" title="Contact Us" />
                <p className="mt-3">
                  If you have questions, requests, or concerns about this Privacy Policy or your data, contact us at:
                </p>
                <div className="mt-4 rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="font-medium" style={{ color: "var(--text)" }}>Klyq — Rivelo Labs</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Managed by calquors.com</p>
                  <p className="mt-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      support@calquors.com
                    </a>
                  </p>
                  <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                    iOS Privacy Policy URL:{" "}
                    <span style={{ color: "var(--text-secondary)" }}>https://www.rivelolabs.com/privacy/klyq</span>
                  </p>
                  <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                    Android Privacy Policy:{" "}
                    <Link href="/privacy/klyq-android" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      rivelolabs.com/privacy/klyq-android
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
