import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Mail, Apple } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy for Klyq (iOS) | Rivelolabs",
  description:
    "Privacy Policy for Klyq (iOS) — adults-only social app for conversations, interest-based circles, nearby discovery, direct audio and video calls, and multiplayer games.",
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
    { id: "collect", label: "1. Information We Collect" },
    { id: "use", label: "2. How We Use Info" },
    { id: "sharing", label: "3. Who Receives Info" },
    { id: "safety", label: "4. Safety & Moderation" },
    { id: "ads", label: "5. Advertising & Tracking" },
    { id: "retention", label: "6. Retention & Deletion" },
    { id: "choices", label: "7. Your Choices & Rights" },
    { id: "age", label: "8. Age Requirement" },
    { id: "security", label: "9. Security & Processing" },
    { id: "changes", label: "10. Changes & Contact" },
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
                    className="text-[13px] transition-colors py-1 border-l-2 border-transparent pl-3 -ml-0.5 hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Child Safety Standards:</p>
                <Link href="/child-safety/klyq" className="text-[13px] font-medium underline underline-offset-4 text-rose-400 block mb-3">
                  CSAE Standards Policy →
                </Link>
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
                  Klyq (iOS)
                </span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>Effective date: June 20, 2026</p>
                <p>Last updated: September 24, 2026</p>
                <p>Platform: Apple iOS</p>
              </div>
            </div>

            <div className="space-y-10 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {/* Intro */}
              <p>
                Klyq is operated by Rivelo Labs, managed by calquors.com (&quot;Klyq,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). This policy explains what information the Klyq iOS app and its supporting services collect, how we use and share it, and the choices available to you. Questions and privacy requests can be sent to{" "}
                <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  support@calquors.com
                </a>
                .
              </p>
              <p>
                Klyq is an adults-only social app for conversations, interest-based circles, nearby discovery, direct audio and video calls, and multiplayer games. This policy covers the iOS app, the backend services that support it, and communications with our support team. Third-party services and other users may have their own privacy practices.
              </p>

              {/* 1. Information we collect */}
              <section>
                <SectionHeading id="collect" number="01" title="Information we collect" />
                <div className="mt-4 space-y-4">
                  <div>
                    <SubHeading title="Account and profile" />
                    <p className="mt-1">
                      When you register, we process your email address, account ID, display name, unique username, date of birth, and account preferences. You may add a profile photo, gender, interests, hobbies, and other profile details. Supabase handles account authentication and password credentials; we do not store your password in plain text. The app may also store a record on your device that you accepted the Terms of Use and confirmed the adult age requirement.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Content and interactions" />
                    <p className="mt-1">
                      We process the messages, circle messages, status or story content, photos, game moves and results, connection requests, and other material you choose to share. We also process information about the accounts you message, follow up with, block, or report. Content you share with another person or a circle is visible to its intended recipients, who may copy or capture it outside Klyq.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Profile visits" />
                    <p className="mt-1">
                      When you open another person&apos;s profile, we record your account and the time of the visit. Klyq Plus subscribers can view recent visitors for the preceding 30 days, subject to blocking and account deletion controls.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Location" />
                    <p className="mt-1">
                      If you enable Nearby and grant location permission, the app obtains your device location to find people or circles near you. Klyq sends and stores an approximate discovery location rather than a continuous precise location history. A manually selected place label may also be stored. You can change or revoke location permission in iOS Settings. Location is not used to target ads.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Contacts, if you choose to use contact discovery" />
                    <p className="mt-1">
                      With your permission, the app reads contact names and email addresses on your device to show which contacts use Klyq. It sends SHA-256 hashes of normalized email addresses to our backend for matching. Contact names, phone numbers, and raw contact email addresses are not uploaded for this feature. Email hashes can still be personal information and are handled as such.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Calls and permissions" />
                    <p className="mt-1">
                      If you make a direct audio or video call, the app uses your microphone and, for video, your camera after you grant permission. LiveKit carries the call in real time. Klyq does not record the live audio or video stream as call content. We may retain call connection details and any related abuse reports. You can stop a call or revoke camera and microphone permission in iOS Settings.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Purchases" />
                    <p className="mt-1">
                      Apple processes Klyq Plus subscription payments. We receive and store information needed to verify and provide your subscription, including the product ID, original transaction identifier, subscription status, expiration date, and the Klyq account linked to the purchase. We do not receive your payment-card details. Deleting your Klyq account does not cancel your Apple subscription; cancellation is managed through your Apple account settings.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Device and usage information" />
                    <p className="mt-1">
                      We process push notification tokens, app interactions, feature usage events, service logs, and information needed for reliability and abuse prevention. When ads are enabled, Google Mobile Ads may process device and advertising information under its own privacy practices. Klyq requests Apple&apos;s App Tracking Transparency permission before enabling tracking-capable ad flows. Declining tracking does not prevent you from using Klyq. Klyq Plus removes third-party ads from the app.
                    </p>
                  </div>

                  <div>
                    <SubHeading title="Support and safety reports" />
                    <p className="mt-1">
                      If you contact us or report another account, we receive the information you provide and related account or content details needed to investigate and respond.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. How we use information */}
              <section>
                <SectionHeading id="use" number="02" title="How we use information" />
                <p className="mt-3">
                  We use this information to create and protect accounts; show profiles, circles, nearby users and relevant activity; deliver messages, calls, notifications and games; verify subscriptions and provide paid features; respond to support requests; detect and act on harassment, spam, fraud and other misuse; and maintain and improve service reliability. We do not sell personal information.
                </p>
              </section>

              {/* 3. Who receives information */}
              <section>
                <SectionHeading id="sharing" number="03" title="Who receives information" />
                <p className="mt-3">
                  Other users receive the profile and content you choose to share with them. For example, a message recipient sees your message and profile identity; circle members see content shared in that circle; and someone on a call can hear or see what you share during that call.
                </p>
                <p className="mt-3">
                  We use service providers to operate Klyq, including Supabase for authentication, Railway for application hosting and databases, Cloudflare R2 for uploaded media, LiveKit for live calls, Apple for subscriptions and push notifications, and Google Mobile Ads when ads are enabled. These providers process information needed for their services and may have their own privacy policies. We may also disclose information when required by law or reasonably necessary to protect users, enforce our terms, or investigate abuse. If the business changes ownership, information may transfer as part of that transaction subject to applicable law.
                </p>
              </section>

              {/* 4. Safety and moderation */}
              <section>
                <SectionHeading id="safety" number="04" title="Safety and moderation" />
                <p className="mt-3">
                  Users can block or report other users and inappropriate activity in the app, or email{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    support@calquors.com
                  </a>
                  . We process reports, account identifiers, relevant content and related activity to investigate concerns and enforce our Terms of Use and Community Guidelines. We may remove content or restrict accounts that violate those rules.
                </p>
                <p className="mt-3">
                  <strong style={{ color: "var(--text)" }}>Child Sexual Abuse Material (CSAM) &amp; CSAE Prevention:</strong> We enforce an absolute zero-tolerance policy against any form of child sexual abuse and exploitation. In-app reporting controls allow real-time flagging of safety concerns during live calls, in messages, and on profiles. For complete compliance specifications, please review our published{" "}
                  <Link href="/child-safety/klyq" className="underline underline-offset-4 text-rose-400 font-medium">
                    Child Safety Standards (CSAE Prevention Policy)
                  </Link>
                  .
                </p>
              </section>

              {/* 5. Advertising and tracking */}
              <section>
                <SectionHeading id="ads" number="05" title="Advertising and tracking" />
                <p className="mt-3">
                  Free accounts may see interstitial or optional rewarded ads when ads are enabled. Google Mobile Ads may collect or receive device, usage, and advertising information to serve and measure ads. We ask for Apple&apos;s tracking permission before tracking-capable ad flows. You can change tracking permission in iOS Settings. Declining permission does not remove all advertising; it limits tracking-based advertising. We do not provide message contents, call audio or video, or Nearby location to advertisers for ad targeting.
                </p>
              </section>

              {/* 6. Retention and account deletion */}
              <section>
                <SectionHeading id="retention" number="06" title="Retention and account deletion" />
                <p className="mt-3">
                  We keep account and service information while needed to provide Klyq and for security, moderation, dispute resolution, and legal obligations. Live presence is temporary. Subscription ownership identifiers may be retained after account deletion to reconcile purchases and prevent their reassignment. Backups and records required for legal or security reasons may remain for a limited additional period. We do not claim that deleting a Klyq account cancels an Apple subscription.
                </p>
                <p className="mt-3">
                  You can request account deletion in:
                </p>
                <div className="mt-2 rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: "var(--code-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  You → Account → Delete account
                </div>
                <p className="mt-3">
                  or contact{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    support@calquors.com
                  </a>
                  . The deletion process removes your authentication account and associated application database records, including your profile and messages. Media files stored separately may require additional cleanup; contact{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    support@calquors.com
                  </a>{" "}
                  if you want us to check for remaining files. Billing identifiers and records described above may also remain. Content already copied or captured by other users is outside our control.
                </p>
              </section>

              {/* 7. Your choices and rights */}
              <section>
                <SectionHeading id="choices" number="07" title="Your choices and rights" />
                <p className="mt-3">
                  You can edit your profile, control what you share, block and report users, and manage camera, microphone, contacts, location, notification, and tracking permissions in iOS Settings. You can manage or cancel Klyq Plus through Apple. Depending on where you live, you may have rights to access, correct, delete, or obtain a copy of your information, or to object to certain processing. Contact{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    support@calquors.com
                  </a>{" "}
                  to make a request; we may need to verify your identity.
                </p>
              </section>

              {/* 8. Age requirement */}
              <section>
                <SectionHeading id="age" number="08" title="Age requirement" />
                <p className="mt-3">
                  Klyq is for adults aged 18 or older, or the age of majority in your location if higher. We ask for date of birth during registration and require an adult confirmation before access to community features. Klyq is not directed to children. If you believe someone under the required age has provided us information, contact{" "}
                  <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    support@calquors.com
                  </a>
                  .
                </p>
              </section>

              {/* 9. Security and international processing */}
              <section>
                <SectionHeading id="security" number="09" title="Security and international processing" />
                <p className="mt-3">
                  We use access controls and encrypted connections to protect information, but no system can be guaranteed completely secure. Information may be processed in countries where Klyq and its providers operate, which may have different data protection laws from your country.
                </p>
              </section>

              {/* 10. Changes and contact */}
              <section>
                <SectionHeading id="changes" number="10" title="Changes and contact" />
                <p className="mt-3">
                  We may update this policy when Klyq or applicable requirements change. We will post the updated policy with a new &quot;Last updated&quot; date and provide any additional notice required by law.
                </p>
                <div className="mt-6 rounded-xl p-5 sm:p-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="font-semibold text-base" style={{ color: "var(--text)" }}>Klyq — Rivelo Labs</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Managed by calquors.com</p>
                  <p className="mt-3 flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    <a href="mailto:support@calquors.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      support@calquors.com
                    </a>
                  </p>
                  <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <p>
                      iOS Privacy Policy URL:{" "}
                      <span style={{ color: "var(--text-secondary)" }}>https://www.rivelolabs.com/privacy/klyq</span>
                    </p>
                    <p>
                      <Link href="/privacy/klyq-android" className="underline underline-offset-4 hover:text-white" style={{ color: "var(--accent)" }}>
                        View Android Privacy Policy →
                      </Link>
                    </p>
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
