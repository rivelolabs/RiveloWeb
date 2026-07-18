import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Mail, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Klyq Privacy Policy (Android) | Rivelolabs",
  description:
    "Privacy Policy for the Klyq Android app — community feed, live discovery with direct audio/video calls, nearby discovery, circles, direct messaging, and multiplayer mini-games. Includes Google Play Data Safety details.",
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

export default function KlyqAndroidPrivacyPage() {
  const sections = [
    { id: "who", label: "Who We Are" },
    { id: "scope", label: "Scope" },
    { id: "collect", label: "Information We Collect" },
    { id: "use", label: "How We Use Info" },
    { id: "live", label: "Live Discovery & Calls" },
    { id: "location", label: "Location & Nearby" },
    { id: "ads", label: "Advertising & Tracking" },
    { id: "sharing", label: "How We Share" },
    { id: "safety", label: "Safety & Moderation" },
    { id: "retention", label: "Data Retention" },
    { id: "storage", label: "Storage & Security" },
    { id: "choices", label: "Your Choices" },
    { id: "age", label: "Age Requirement" },
    { id: "international", label: "International" },
    { id: "rights", label: "Regional Rights" },
    { id: "changes", label: "Changes" },
    { id: "contact", label: "Contact" },
    { id: "summary", label: "Store Disclosure Summary" },
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
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Using iPhone?</p>
                <Link href="/privacy/klyq" className="text-[13px] font-medium underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  Klyq iOS Privacy Policy →
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
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#10b981" }}>
                <Smartphone className="h-3.5 w-3.5" /> Android Version
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
                <p>Last Updated: July 18, 2026</p>
                <p>Platform: Android (Google Play)</p>
              </div>
            </div>

            <div className="space-y-10 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {/* Intro */}
              <p>
                Klyq (&quot;Klyq&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operated by Rivelo Labs, respects your privacy. This Privacy Policy explains how we collect, use, disclose, store, and protect information when you use the Klyq mobile application and related services (the &quot;Services&quot;).
              </p>
              <p>
                Klyq is a social app built around a community feed, live discovery with direct audio/video calls, nearby discovery, circles (communities), direct messaging, and real-opponent multiplayer mini-games. Because Klyq connects you with other people, please read this policy and our safety guidance carefully.
              </p>
              <p>
                By using Klyq, you agree to this Privacy Policy. If you do not agree, please do not use the Services.
              </p>

              {/* 1. Who We Are */}
              <section>
                <SectionHeading id="who" number="01" title="Who We Are" />
                <p className="mt-3">
                  Klyq is a real-time social and gaming app operated by Rivelo Labs.
                </p>
                <div className="mt-4 rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>App &amp; Developer:</p>
                  <p>Klyq — operated by Rivelo Labs</p>
                  <p>Managed by calquors.com</p>
                  <p>Application ID: com.klyq.app</p>
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
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>The Klyq iOS and Android apps</li>
                  <li>Features within the app, including the community feed, live discovery and direct calls, nearby discovery, circles and communities, direct messaging, and multiplayer games</li>
                  <li>Customer support and privacy-related communications with us</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  This Privacy Policy does not apply to third-party services we do not control (for example, Apple, Google, the App Store, Google Play, or other people you interact with on Klyq), which have their own terms and privacy policies. A separate copy of this policy, with iOS-specific detail, is also published for the{" "}
                  <Link href="/privacy/klyq" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>Klyq iOS app</Link>.
                </p>
              </section>

              {/* 3. Information We Collect */}
              <section>
                <SectionHeading id="collect" number="03" title="Information We Collect" />
                <p className="mt-3">Depending on the features you use, we may collect the following categories of information:</p>

                <SubHeading title="3.1 Account and Identity Information" />
                <p className="mt-2">When you create a Klyq account using email authentication (powered by Supabase Auth), we collect:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Email address</li>
                  <li>An authentication credential (your password is handled by our authentication provider; we never store your plain-text password). Email sign-up and account recovery are verified with a one-time code sent to your email.</li>
                  <li>A unique user ID</li>
                  <li>Display name, username/handle, alias, and account settings</li>
                  <li>Date of birth (used to verify you are old enough to use Klyq) and, optionally, gender (used for discovery preferences)</li>
                </ul>

                <SubHeading title="3.2 Profile and Content You Create" />
                <p className="mt-2">Information you choose to add or share in the app, such as:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Profile details (display name, bio, avatar/photos, interests, intent, and preferences)</li>
                  <li>Posts, comments, and reactions in the community feed</li>
                  <li>Circles and communities you create or join</li>
                  <li>Direct messages, in-game chat, and circle chat</li>
                  <li>Virtual gifts you send or receive</li>
                </ul>

                <SubHeading title="3.3 Camera and Microphone (Optional — Live Calls)" />
                <p className="mt-2">
                  Klyq&apos;s Live tab shows people currently available to connect with, and lets you send a connect request for a direct audio or video call — the call only starts once the other person accepts. Camera and/or microphone access is used only while you are actively in a call, and only after you grant permission through your device. Live audio and video are used to carry that call in real time. <strong style={{ color: "var(--text)" }}>We do not record your live audio or video streams.</strong>
                </p>

                <SubHeading title="3.4 Approximate Location (Optional — Nearby)" />
                <p className="mt-2">
                  The Nearby feature shows people and circles around you. If you enable it and grant location permission, we use your device location to power nearby discovery. Klyq is built to reduce location precision: your position is stored as an approximate discovery area (snapped to a coarse grid) rather than an exact GPS trail. You may also set a location manually, in which case a human-readable place label is stored. You control location access through your device settings at any time.
                </p>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  We do not use your location for advertising and do not sell your location data.
                </p>

                <SubHeading title="3.5 Communications and Interaction Data" />
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Messages and chat content you send through direct messages, circles, and in-game chat</li>
                  <li>Connect requests and message requests (who you connect with, decline, block, or report)</li>
                  <li>Reports and safety-related information you submit about other users</li>
                </ul>

                <SubHeading title="3.6 Multiplayer Game Data" />
                <p className="mt-2">
                  Klyq offers turn-based multiplayer mini-games (such as Tic Tac Toe, Connect Four, Checkers, and others) played against another real user matched to you, or an opponent you invite directly. We process gameplay data needed to run a live match, such as moves, results, scores, and the opponent you are paired with.
                </p>

                <SubHeading title="3.7 Purchases, Coins, and Earnings" />
                <p className="mt-2">If you use paid or reward features, we process:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Subscription and purchase status returned by Apple (StoreKit) or Google (Play Billing). Payment is handled entirely by Apple or Google — we never receive or store your credit card or banking details.</li>
                  <li>Your in-app virtual currency balances (coins and diamonds), coin transactions, gift sends, and reward claims</li>
                  <li>Cashout requests (the amount of diamonds you request to redeem). Payout arrangements are handled through support; the app does not collect payment account credentials.</li>
                </ul>

                <SubHeading title="3.8 Device, App, and Diagnostic Information" />
                <p className="mt-2">We may collect basic technical information needed to operate, secure, and improve the Services, such as:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>App version, device type, and operating system version</li>
                  <li>Error logs and crash/diagnostic information</li>
                  <li>First-party usage and feature analytics events, processed on our own backend infrastructure</li>
                </ul>
              </section>

              {/* 4. How We Use Your Information */}
              <section>
                <SectionHeading id="use" number="04" title="How We Use Your Information" />
                <p className="mt-3">We use your information to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Create and manage your account and authenticate you</li>
                  <li>Show who is available on Live and run the connect-request handshake for direct audio/video calls</li>
                  <li>Run multiplayer games and pair you with an opponent</li>
                  <li>Power the community feed, circles, and direct messaging</li>
                  <li>Provide nearby discovery when you enable it</li>
                  <li>Operate subscriptions, coins, gifts, rewarded features, and (where enabled) advertising</li>
                  <li>Keep Klyq safe — detect, review, and act on abuse, spam, and policy violations</li>
                  <li>Improve app performance, reliability, and user experience</li>
                  <li>Provide support and respond to your requests</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* 5. Live Discovery and Direct Calls */}
              <section>
                <SectionHeading id="live" number="05" title="Live Discovery and Direct Calls" />
                <p className="mt-3">
                  The Live tab shows other users currently available to connect, and lets you request a direct 1:1 audio or video call — the call only begins once the other person accepts your request (or you accept theirs). It is not anonymous or random matching with an unknown stranger; you see who you&apos;re requesting before you call.
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Live audio/video is delivered through our real-time infrastructure provider (LiveKit).</li>
                  <li>The person you call can see and/or hear you and anything in view of your camera and microphone — only share what you are comfortable with.</li>
                  <li>You can end the call, block, or report at any time.</li>
                  <li>We do not record, sell, or use your live video or voice streams for advertising.</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We may retain limited information related to a call (for example, reports, block records, or safety signals) to investigate abuse and keep the community safe, as described in Section 9.
                </p>
              </section>

              {/* 6. Location and Nearby */}
              <section>
                <SectionHeading id="location" number="06" title="Location and Nearby" />
                <p className="mt-3">
                  Location is optional and used only to power the Nearby discovery feature. You can grant, limit (approximate only), or revoke location access at any time in your device settings. If you disable location, Nearby will be limited or unavailable, but the rest of Klyq will continue to work.
                </p>
              </section>

              {/* 7. Advertising and Tracking */}
              <section>
                <SectionHeading id="ads" number="07" title="Advertising and Tracking" />
                <p className="mt-3">
                  Klyq may show ads (such as interstitial and rewarded ads) to users without a premium subscription, using Google Mobile Ads (AdMob). Rewarded ads are always optional — you choose to watch them in exchange for in-app rewards. Ads can also be turned on or off remotely for all users; when ads are off, ad-related processing does not occur and non-subscribers see a subscribe option instead.
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li><strong style={{ color: "var(--text)" }}>On Android:</strong> Google Mobile Ads may use the advertising ID subject to your device&apos;s ads personalization settings (Settings → Google → Ads), which you can change or reset at any time.</li>
                  <li><strong style={{ color: "var(--text)" }}>On iOS:</strong> before any tracking-capable advertising flow can collect the Identifier for Advertisers (IDFA), Klyq presents Apple&apos;s App Tracking Transparency (ATT) prompt. If you decline, Klyq does not track you across other companies&apos; apps and websites, and any ads shown are non-personalized.</li>
                  <li>Premium subscribers do not see third-party ads.</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We do not sell your personal information or share it with data brokers, and we do not use your messages, location, or live audio/video for advertising.
                </p>
              </section>

              {/* 8. How We Share Information */}
              <section>
                <SectionHeading id="sharing" number="08" title="How We Share Information" />
                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>We do not sell your personal information.</p>

                <SubHeading title="8.1 Other Users (By Design)" />
                <p className="mt-2">
                  Klyq is a social product, so some information is shared with other people by design — for example, your profile, username or alias, posts you publish, messages you send, your approximate area in nearby discovery, and your live video/voice during a call you&apos;re on. Content shared publicly or with a circle may be seen, saved, or screenshotted by others outside our control.
                </p>

                <SubHeading title="8.2 Service Providers (Infrastructure)" />
                <p className="mt-2">We use trusted providers to operate the app:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Supabase — account authentication (sign-in, email verification codes)</li>
                  <li>Railway — cloud hosting for our backend services and our application database</li>
                  <li>Cloudflare R2 — storage and delivery of photos and media you upload</li>
                  <li>LiveKit — live audio and video call infrastructure</li>
                  <li>Google Mobile Ads (AdMob) — advertising, where ads are enabled</li>
                  <li>Google Maps and related mapping services on Android, where applicable</li>
                  <li>Apple and Google — app distribution, push infrastructure where applicable, and billing for subscriptions and purchases</li>
                </ul>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  These providers process data only as needed to operate their part of the service.
                </p>

                <SubHeading title="8.3 Legal, Safety, and Security" />
                <p className="mt-2">We may disclose information if reasonably necessary to:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Comply with legal obligations or valid legal process</li>
                  <li>Enforce our terms or protect our rights</li>
                  <li>Protect the safety, security, and integrity of users, the Services, or the public</li>
                </ul>

                <SubHeading title="8.4 Business Transfers" />
                <p className="mt-2">
                  If Klyq is involved in a merger, acquisition, financing, restructuring, or sale of assets, information may be transferred as part of that transaction.
                </p>
              </section>

              {/* 9. Safety, Moderation & Reporting */}
              <section>
                <SectionHeading id="safety" number="09" title="Safety, Moderation &amp; Reporting" />
                <p className="mt-3">Because Klyq connects you with other people, we provide tools and processes to keep the community safe:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li><strong style={{ color: "var(--text)" }}>Block:</strong> end or avoid contact with someone at any time.</li>
                  <li><strong style={{ color: "var(--text)" }}>Report:</strong> flag users or content that violate our rules, including directly from a call, chat, or profile.</li>
                  <li><strong style={{ color: "var(--text)" }}>Review &amp; enforcement:</strong> we may review reported content and account activity and take action, including warnings, content removal, or account suspension.</li>
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
                  Retention varies by data type: account and profile data are kept while your account is active; live presence and discovery state are short-lived and refreshed frequently; and some billing, fraud-prevention, and audit data may be retained longer where required. When you delete your account, we delete or anonymize your associated data within a reasonable period, subject to legal, security, backup, and safety/moderation requirements.
                </p>
              </section>

              {/* 11. Data Storage and Security */}
              <section>
                <SectionHeading id="storage" number="11" title="Data Storage and Security" />
                <p className="mt-3">Your information may be stored:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Locally on your device</li>
                  <li>In our backend database and secure cloud services used to operate the app (see Section 8.2)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We use reasonable administrative, technical, and organizational measures, and communication with our backend uses encryption in transit (HTTPS/TLS, secure WebSockets). However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* 12. Your Choices and Controls */}
              <section>
                <SectionHeading id="choices" number="12" title="Your Choices and Controls" />
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li><strong style={{ color: "var(--text)" }}>Profile &amp; content:</strong> edit your profile and delete content you have posted within the app.</li>
                  <li><strong style={{ color: "var(--text)" }}>Camera, microphone &amp; location permissions:</strong> grant or revoke at any time in your device settings.</li>
                  <li><strong style={{ color: "var(--text)" }}>Ads personalization:</strong> manage the advertising ID on Android, or decline the ATT prompt on iOS; premium subscribers see no third-party ads.</li>
                  <li><strong style={{ color: "var(--text)" }}>Block &amp; report:</strong> available directly from a call, chat, or profile.</li>
                </ul>
                <p className="mt-3"><strong style={{ color: "var(--text)" }}>Account deletion:</strong> delete your account and associated data from within the app:</p>
                <div className="mt-2 rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: "var(--code-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  Profile / Settings → Delete Account
                </div>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  Or email{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>support@calquors.com</a>{" "}
                  to request deletion. Account deletion removes your data from our application database and deletes your authentication identity.
                </p>
              </section>

              {/* 13. Age Requirement */}
              <section>
                <SectionHeading id="age" number="13" title="Age Requirement" />
                <p className="mt-3">
                  Klyq is intended for adults. You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Services, and we collect your date of birth at sign-up to enforce this. Klyq is not directed to children, and we do not knowingly collect personal information from anyone under 18. If you believe a minor has provided us personal information, contact us and we will take appropriate steps to remove it.
                </p>
              </section>

              {/* 14. International Users */}
              <section>
                <SectionHeading id="international" number="14" title="International Users" />
                <p className="mt-3">
                  If you use Klyq from outside the countries where our services are hosted, your information may be processed and stored in other countries where we or our service providers operate. Data protection laws in those countries may differ from the laws in your location.
                </p>
              </section>

              {/* 15. Your Regional Rights */}
              <section>
                <SectionHeading id="rights" number="15" title="Your Regional Rights (Where Applicable)" />
                <p className="mt-3">Depending on your location (for example, under GDPR or CCPA/CPRA), you may have rights to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-pink-500/60">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Request data portability (where applicable)</li>
                  <li>Withdraw consent for optional permissions (camera, microphone, location, tracking)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  To exercise applicable rights, contact us at{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>support@calquors.com</a>.
                  We may need to verify your identity before fulfilling certain requests.
                </p>
              </section>

              {/* 16. Changes */}
              <section>
                <SectionHeading id="changes" number="16" title="Changes to This Privacy Policy" />
                <p className="mt-3">
                  We may update this Privacy Policy from time to time. If we make material changes, we will post the updated version at this URL and update the &quot;Last Updated&quot; date above. Your continued use of Klyq after changes become effective means you accept the updated Privacy Policy.
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
                    Android Privacy Policy URL:{" "}
                    <span style={{ color: "var(--text-secondary)" }}>https://www.rivelolabs.com/privacy/klyq-android</span>
                  </p>
                  <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                    iOS Privacy Policy URL:{" "}
                    <Link href="/privacy/klyq" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      rivelolabs.com/privacy/klyq
                    </Link>
                  </p>
                </div>
              </section>

              {/* Appendix: Store Disclosure Summary */}
              <section>
                <SectionHeading id="summary" number="Appendix" title="App Store / Play Store Disclosure Summary" />
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  A practical summary for store privacy questionnaires (App Store &quot;App Privacy&quot; and Play Store &quot;Data safety&quot;). Review against the current build before each submission.
                </p>

                <SubHeading title="Data collected and linked to identity" />
                <p className="mt-2">
                  Email address; user ID, handle, alias; date of birth; optional gender; profile photos; user content (posts, comments, messages, reports); purchase/subscription state; coin, gift, and earnings activity.
                </p>

                <SubHeading title="Data collected, not used to track (unless ATT consent on iOS)" />
                <p className="mt-2">
                  Diagnostics/crash data; first-party usage analytics; advertising identifiers only where ads are enabled and permitted by user choice (ATT on iOS / ads personalization settings on Android).
                </p>

                <SubHeading title="Ephemeral, not retained as content" />
                <p className="mt-2">
                  Live audio/video streams (relayed in real time, not recorded).
                </p>

                <SubHeading title="User controls in the product" />
                <p className="mt-2">
                  In-app account deletion; profile and photo editing; content deletion; block and report actions; permission control via device settings.
                </p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
