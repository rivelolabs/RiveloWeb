import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "RevFit Privacy Policy | Rivelolabs",
  description: "Privacy Policy for the RevFit mobile application by Rivelo Labs.",
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

export default function PrivacyPage() {
  const sections = [
    { id: "who", label: "Who We Are" },
    { id: "scope", label: "Scope" },
    { id: "collect", label: "Information We Collect" },
    { id: "use", label: "How We Use Info" },
    { id: "healthkit", label: "HealthKit Data" },
    { id: "tracking", label: "Tracking & Ads" },
    { id: "sharing", label: "How We Share" },
    { id: "retention", label: "Data Retention" },
    { id: "storage", label: "Storage & Security" },
    { id: "choices", label: "Your Controls" },
    { id: "children", label: "Children" },
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
                  style={{ backgroundImage: "linear-gradient(135deg, var(--accent), #06b6d4)" }}
                >
                  RevFit
                </span>
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>Effective Date: February 24, 2026</p>
                <p>Last Updated: February 27, 2026</p>
              </div>
            </div>

            <div className="space-y-10 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
              {/* Intro */}
              <p>
                RevFit (&quot;RevFit&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operated by Rivelo Labs, respects your privacy. This Privacy Policy explains how we collect, use, disclose, store, and protect information when you use the RevFit mobile application and related services (the &quot;Services&quot;).
              </p>
              <p>
                By using RevFit, you agree to this Privacy Policy. If you do not agree, please do not use the Services.
              </p>

              {/* 1. Who We Are */}
              <section>
                <SectionHeading id="who" number="01" title="Who We Are" />
                <p className="mt-3">
                  RevFit is a fitness, nutrition, wellness, and progress tracking app operated by Rivelo Labs.
                </p>
                <div className="mt-4 rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Contact:</p>
                  <p>Rivelo Labs</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:hello@rivelolabs.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      hello@rivelolabs.com
                    </a>
                  </p>
                </div>
              </section>

              {/* 2. Scope */}
              <section>
                <SectionHeading id="scope" number="02" title="Scope of This Privacy Policy" />
                <p className="mt-3">This Privacy Policy applies to information collected through:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>The RevFit iOS app</li>
                  <li>Features within the app, including fitness tracking, nutrition/hydration logging, wellness tools, subscriptions, and optional AR/camera features</li>
                  <li>Customer support and privacy-related communications with us</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  This Privacy Policy does not apply to third-party services we do not control (for example, Apple, App Store, or third-party payment/subscription systems), which have their own privacy policies.
                </p>
              </section>

              {/* 3. Information We Collect */}
              <section>
                <SectionHeading id="collect" number="03" title="Information We Collect" />
                <p className="mt-3">
                  Depending on the features you use, we may collect the following categories of information:
                </p>

                <SubHeading title="3.1 Account and Identity Information" />
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Sign in with Apple account identifier</li>
                  <li>Name and email address (only if shared by you through Apple or otherwise provided)</li>
                  <li>Account settings and preferences</li>
                </ul>

                <SubHeading title="3.2 Profile and Fitness Information" />
                <p className="mt-2">Information you enter to use and personalize the app, such as:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Age, gender, height, weight, target weight</li>
                  <li>Fitness goals and preferences</li>
                  <li>Workout routines, exercise logs, activity progress</li>
                  <li>Training history and performance metrics</li>
                </ul>

                <SubHeading title="3.3 Nutrition, Hydration, and Wellness Information" />
                <p className="mt-2">Information you create or log in the app, such as:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Meals, calories, macronutrients, and nutrition entries</li>
                  <li>Water intake and hydration logs</li>
                  <li>Wellness tracking data (for example, mood, journal entries, breathing sessions, recovery-related check-ins)</li>
                </ul>

                <SubHeading title="3.4 HealthKit / Apple Health Data (Optional)" />
                <p className="mt-2">
                  If you connect Apple Health / HealthKit and grant permission, RevFit may read and/or write certain HealthKit data to provide health and fitness features.
                </p>
                <p className="mt-2">Examples of HealthKit data RevFit may access (with your permission):</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Steps</li>
                  <li>Exercise minutes</li>
                  <li>Stand hours</li>
                  <li>Limited activity/workout-related data (if you enable sync and grant write permission)</li>
                </ul>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  HealthKit access is optional and controlled by you through Apple&apos;s permission system.
                </p>

                <SubHeading title="3.5 Camera, AR, and Face Analysis Data (Optional)" />
                <p className="mt-2">
                  RevFit uses your device&apos;s camera for two optional AR-powered features: (1) body motion tracking for exercise rep counting, and (2) face and appearance analysis using Apple&apos;s TrueDepth API (ARKit). Camera access is only used while the feature is active and after you grant camera permission.
                </p>

                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>What face data is collected:</p>
                <p className="mt-1">
                  When you use the Face Analyzer feature, the app accesses face mesh geometry (3D vertex data) and facial expression coefficients (blendShapes) from the TrueDepth camera to estimate face shape, facial symmetry, and expressions.
                </p>

                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>How it is used:</p>
                <p className="mt-1">
                  Face data is used solely to provide real-time visual feedback, including face shape classification, symmetry scoring, lighting assessment, and grooming/styling recommendations. Face data is not used for biometric identification, facial recognition, authentication, or advertising.
                </p>

                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>Storage and retention:</p>
                <p className="mt-1">
                  Face data is processed entirely on-device and exists only in temporary memory during the active AR camera session. No face data is written to disk, databases, or cloud storage. All face data is immediately discarded when the AR session ends or the app is closed. The retention period is zero.
                </p>

                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>Third-party sharing:</p>
                <p className="mt-1">
                  Face data is never shared with any third parties, data brokers, advertisers, or analytics services.
                </p>

                <p className="mt-3">
                  For body motion tracking, camera frames may be processed in real time using Apple&apos;s Vision framework to estimate movement, body position, and joint angles for exercise rep counting. This data is also processed entirely on-device and is not stored or transmitted.
                </p>

                <p className="mt-3">
                  If a feature allows you to submit a photo or media for analysis, the photo/media you choose to submit may be processed locally on your device and/or sent to a service provider as described in Section 7 (How We Share Information), depending on the feature implementation.
                </p>

                <div className="mt-3 rounded-xl p-5 space-y-2" style={{ backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.1)" }}>
                  <p className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span> Camera and face data is processed entirely on-device</p>
                  <p className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span> No face data is stored persistently — discarded when session ends</p>
                  <p className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span> Face data is never shared with third parties</p>
                  <p className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span> Not used for biometric identification, facial recognition, or advertising</p>
                  <p className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span> Not used for cross-app tracking</p>
                </div>

                <SubHeading title="3.6 Purchase and Subscription Information" />
                <p className="mt-2">If you purchase a subscription in RevFit:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Subscription status, product identifiers, and entitlement information from Apple (StoreKit/App Store)</li>
                  <li>Transaction metadata made available by Apple to verify access</li>
                </ul>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  We do not collect or store your full payment card number. Payments are processed by Apple.
                </p>

                <SubHeading title="3.7 Device, App, and Technical Information" />
                <p className="mt-2">
                  We may collect basic technical information needed to operate, secure, and improve the Services, such as:
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>App version</li>
                  <li>Device type and operating system version</li>
                  <li>Error logs, crash/debug information</li>
                  <li>Basic usage diagnostics related to app performance and reliability</li>
                </ul>
              </section>

              {/* 4. How We Use Your Information */}
              <section>
                <SectionHeading id="use" number="04" title="How We Use Your Information" />
                <p className="mt-3">We use your information to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Create and manage your account</li>
                  <li>Provide fitness, nutrition, hydration, wellness, and progress tracking features</li>
                  <li>Personalize goals, insights, and recommendations</li>
                  <li>Enable optional HealthKit integrations (when you grant permission)</li>
                  <li>Enable optional camera/AR/analysis features (when you grant permission)</li>
                  <li>Sync data across devices (if cloud sync is enabled)</li>
                  <li>Process and manage subscriptions and entitlements through Apple</li>
                  <li>Improve app performance, reliability, and user experience</li>
                  <li>Provide customer support and respond to your requests</li>
                  <li>Protect the security and integrity of the Services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* 5. HealthKit Data Use */}
              <section>
                <SectionHeading id="healthkit" number="05" title="HealthKit Data Use (Apple Health / HealthKit)" />
                <p className="mt-3">If you connect Apple Health / HealthKit:</p>
                <div className="mt-3 rounded-xl p-5 space-y-2" style={{ backgroundColor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                  <p className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#10003;</span> HealthKit data is used only to provide and improve health and fitness features within RevFit</p>
                  <p className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#10003;</span> HealthKit data is not used for advertising</p>
                  <p className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#10003;</span> HealthKit data is not sold to third parties</p>
                  <p className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#10003;</span> HealthKit data is not used for cross-app or cross-website tracking</p>
                  <p className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">&#10003;</span> HealthKit data is not shared with data brokers</p>
                </div>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We access only the HealthKit data types you authorize, and you can revoke access at any time in Apple Health / iOS Settings.
                </p>
              </section>

              {/* 6. Tracking and Advertising */}
              <section>
                <SectionHeading id="tracking" number="06" title="Tracking and Advertising" />
                <p className="mt-3">
                  RevFit does not track users across third-party apps or websites for advertising purposes.
                </p>
                <p className="mt-3">We do not:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Use personal data for cross-app/cross-website behavioral advertising</li>
                  <li>Share personal information with data brokers</li>
                  <li>Use HealthKit data for advertising, marketing profiling, or data broker purposes</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  Because RevFit does not perform tracking as defined by Apple&apos;s App Tracking Transparency (ATT) framework, RevFit may not request ATT permission unless our practices change in the future.
                </p>
              </section>

              {/* 7. How We Share Information */}
              <section>
                <SectionHeading id="sharing" number="07" title="How We Share Information" />
                <p className="mt-3 font-medium" style={{ color: "var(--text)" }}>We do not sell your personal information.</p>
                <p className="mt-3">
                  We may share limited information only as necessary to operate the Services, including:
                </p>

                <SubHeading title="7.1 Apple" />
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Sign in with Apple authentication</li>
                  <li>App Store / StoreKit subscription billing and entitlement processing</li>
                  <li>HealthKit framework access (with your permission)</li>
                </ul>

                <SubHeading title="7.2 Service Providers (Infrastructure / App Operations)" />
                <p className="mt-2">We may use trusted service providers that support app functionality, such as:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Authentication and account services</li>
                  <li>Database/storage services</li>
                  <li>Cloud infrastructure</li>
                  <li>Error monitoring / diagnostics (if enabled)</li>
                </ul>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  Examples may include providers such as Google/Firebase and other infrastructure vendors used to operate the app.
                </p>

                <SubHeading title="7.3 AI/Analysis Service Providers (Only When You Use Those Features)" />
                <p className="mt-2">
                  If you use optional AI-powered analysis features (for example, photo, face, or text-based analysis features), the data you choose to submit for analysis (such as images or prompts) may be transmitted to a third-party AI service provider to generate the requested results.
                </p>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  We do not use such submitted data for advertising or cross-app tracking. Use of those providers is subject to their service terms and privacy practices.
                </p>

                <SubHeading title="7.4 Legal, Safety, and Security" />
                <p className="mt-2">We may disclose information if reasonably necessary to:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Comply with legal obligations or valid legal process</li>
                  <li>Enforce our terms or protect our rights</li>
                  <li>Protect the safety, security, and integrity of users, the Services, or the public</li>
                </ul>
              </section>

              {/* 8. Data Retention */}
              <section>
                <SectionHeading id="retention" number="08" title="Data Retention" />
                <p className="mt-3">We retain personal information only for as long as reasonably necessary to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Provide the Services and features you use</li>
                  <li>Maintain your account</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain security, backups, and service integrity</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  Retention periods may vary based on the type of data and whether you maintain an active account.
                </p>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  When you request deletion, we will delete or anonymize your data within a reasonable period, subject to legal, security, backup, and operational requirements.
                </p>
              </section>

              {/* 9. Data Storage and Security */}
              <section>
                <SectionHeading id="storage" number="09" title="Data Storage and Security" />
                <p className="mt-3">Your information may be stored:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Locally on your device</li>
                  <li>In secure cloud services used to operate the app (for example, authentication and database services)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  We use reasonable administrative, technical, and organizational measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* 10. Your Choices and Controls */}
              <section>
                <SectionHeading id="choices" number="10" title="Your Choices and Controls" />

                <SubHeading title="10.1 Account and Profile Information" />
                <p className="mt-2">You can review and update certain profile information in the app.</p>

                <SubHeading title="10.2 HealthKit Permissions" />
                <p className="mt-2">You can control or revoke HealthKit access at any time through:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Apple Health app</li>
                  <li>iOS Settings permissions</li>
                </ul>

                <SubHeading title="10.3 Camera Permissions" />
                <p className="mt-2">You can control or revoke camera access in iOS Settings.</p>

                <SubHeading title="10.4 Subscription Management" />
                <p className="mt-2">
                  Subscriptions are billed and managed by Apple. You can manage or cancel your subscription in your Apple ID / App Store subscription settings.
                </p>

                <SubHeading title="10.5 Account Deletion" />
                <p className="mt-2">
                  You can request deletion of your account and associated app data from within the app:
                </p>
                <div className="mt-2 rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: "var(--code-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  Profile / Settings → Delete Account
                </div>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  When you delete your account, we will delete or anonymize associated data, subject to legal, security, backup, or operational retention requirements.
                </p>

                <SubHeading title="10.6 Privacy Requests" />
                <p className="mt-2">
                  You may contact us for privacy-related requests, including questions, access/deletion requests, or concerns, at:{" "}
                  <a href="mailto:rivelolabs@gmail.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    rivelolabs@gmail.com
                  </a>
                </p>
              </section>

              {/* 11. Children's Privacy */}
              <section>
                <SectionHeading id="children" number="11" title="Children&apos;s Privacy" />
                <p className="mt-3">
                  RevFit is not intended for children under 13 (or the minimum age required in your country/region). We do not knowingly collect personal information from children without appropriate consent. If you believe a child has provided us personal information in violation of this section, contact us and we will take appropriate steps.
                </p>
              </section>

              {/* 12. International Users */}
              <section>
                <SectionHeading id="international" number="12" title="International Users" />
                <p className="mt-3">
                  If you use RevFit from outside the country where our services are hosted, your information may be processed and stored in other countries where we or our service providers operate. Data protection laws in those countries may differ from the laws in your location.
                </p>
              </section>

              {/* 13. Your Regional Rights */}
              <section>
                <SectionHeading id="rights" number="13" title="Your Regional Rights (Where Applicable)" />
                <p className="mt-3">
                  Depending on your location, you may have privacy rights under applicable law, including rights to:
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-indigo-500/60">
                  <li>Request access to personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Request data portability (where applicable)</li>
                  <li>Withdraw consent where processing is based on consent (for example, optional permissions)</li>
                </ul>
                <p className="mt-3" style={{ color: "var(--text-muted)" }}>
                  To exercise applicable rights, contact us at{" "}
                  <a href="mailto:hello@rivelolabs.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                    hello@rivelolabs.com
                  </a>
                  . We may need to verify your identity before fulfilling certain requests.
                </p>
              </section>

              {/* 14. Changes */}
              <section>
                <SectionHeading id="changes" number="14" title="Changes to This Privacy Policy" />
                <p className="mt-3">
                  We may update this Privacy Policy from time to time. If we make material changes, we will post the updated version at the Privacy Policy URL and update the &quot;Effective Date&quot; / &quot;Last Updated&quot; date above. Your continued use of RevFit after changes become effective means you accept the updated Privacy Policy.
                </p>
              </section>

              {/* 15. Contact Us */}
              <section>
                <SectionHeading id="contact" number="15" title="Contact Us" />
                <p className="mt-3">
                  If you have questions, requests, or concerns about this Privacy Policy or your data, contact us at:
                </p>
                <div className="mt-4 rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="font-medium" style={{ color: "var(--text)" }}>Rivelo Labs</p>
                  <p className="mt-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    <a href="mailto:hello@rivelolabs.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                      hello@rivelolabs.com
                    </a>
                  </p>
                  <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                    Privacy Policy URL:{" "}
                    <span style={{ color: "var(--text-secondary)" }}>https://www.rivelolabs.com/privacy</span>
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
