import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RevFit Privacy Policy | Rivelolabs",
  description: "Privacy Policy for the RevFit mobile application.",
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen px-6 py-16 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-10 top-48 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <article className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 backdrop-blur-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Privacy Policy
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-[var(--font-display)]">
          Privacy Policy for RevFit
        </h1>
        <p className="mt-4 text-sm text-gray-400">Effective Date: February 22, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-gray-300 sm:text-base">
          <p>
            RevFit ("RevFit", "we", "our", or "us") respects your privacy. This Privacy Policy
            explains how we collect, use, store, and protect your information when you use the
            RevFit mobile application.
          </p>

          <p>If you do not agree with this Privacy Policy, please do not use the app.</p>

          <section>
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p className="mt-3">
              We may collect the following types of information to provide and improve RevFit:
            </p>

            <h3 className="mt-4 text-lg font-semibold text-white">A. Account Information</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Sign in with Apple account information (such as your Apple account identifier)</li>
              <li>Name and email address (if provided by Apple and shared by you)</li>
            </ul>

            <h3 className="mt-4 text-lg font-semibold text-white">B. Profile and Fitness Information</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Profile details you enter, such as age, gender, height, weight, target weight,
                goals, and preferences
              </li>
              <li>Workout logs, exercise activity, routines, and progress data</li>
              <li>Nutrition and hydration data (meals, calories, macros, water intake)</li>
              <li>
                Wellness and mind tracking data (journal entries, mood, breathing sessions,
                recovery-related check-ins)
              </li>
            </ul>

            <h3 className="mt-4 text-lg font-semibold text-white">
              C. HealthKit / Apple Health Data (Optional)
            </h3>
            <p className="mt-2">If you grant permission, RevFit may read data from Apple Health / HealthKit, such as:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Steps</li>
              <li>Exercise minutes</li>
              <li>Stand hours</li>
            </ul>
            <p className="mt-2">
              RevFit may also write limited activity/workout-related data if you enable sync and
              grant permission.
            </p>

            <h3 className="mt-4 text-lg font-semibold text-white">D. Purchase and Subscription Information</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Subscription status and product entitlement information provided by Apple (StoreKit)</li>
              <li>We do not receive your full payment card details. Payments are handled by Apple.</li>
            </ul>

            <h3 className="mt-4 text-lg font-semibold text-white">E. Device and App Data</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Basic technical information needed to operate the app (such as app version, device
                type, and error/debug information)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
            <p className="mt-3">We use your information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Create and manage your account</li>
              <li>Provide fitness, nutrition, and wellness tracking features</li>
              <li>Personalize goals, insights, and recommendations</li>
              <li>Sync your data across devices (when cloud sync is enabled)</li>
              <li>Process and manage subscriptions through Apple</li>
              <li>Improve app performance, reliability, and user experience</li>
              <li>Provide customer support and respond to requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. HealthKit Data Use</h2>
            <p className="mt-3">If you connect Apple Health / HealthKit:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>HealthKit data is used only to provide and improve health and fitness features in RevFit</li>
              <li>HealthKit data is not used for advertising</li>
              <li>HealthKit data is not sold to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. How We Store Your Information</h2>
            <p className="mt-3">Your information may be stored:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Locally on your device</li>
              <li>
                In secure cloud services used to operate the app (such as authentication and
                database services)
              </li>
            </ul>
            <p className="mt-2">
              We take reasonable steps to protect your data, but no method of transmission or
              storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Sharing of Information</h2>
            <p className="mt-3">We do not sell your personal information.</p>
            <p className="mt-3">
              We may share limited information only when necessary to operate the app, such as:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Apple (for Sign in with Apple and subscription billing)</li>
              <li>
                Service providers that support app functionality (for example,
                authentication/database services)
              </li>
            </ul>
            <p className="mt-2">
              We may also disclose information if required by law or to protect rights, safety, or
              security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Data Retention</h2>
            <p className="mt-3">We retain your information only as long as needed to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Provide the app and its features</li>
              <li>Maintain your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Account Deletion and Your Choices</h2>
            <p className="mt-3">
              You can request deletion of your account and associated app data from within the app:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Profile / Settings -> Delete Account</li>
            </ul>
            <p className="mt-2">
              When you delete your account, we will delete or anonymize your data, subject to legal
              or operational requirements.
            </p>
            <p className="mt-2">You may also contact us for privacy-related requests.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Children&apos;s Privacy</h2>
            <p className="mt-3">
              RevFit is not intended for children under 13 (or the minimum age required in your
              country/region). We do not knowingly collect personal information from children
              without appropriate consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. International Users</h2>
            <p className="mt-3">
              If you use RevFit outside the country where our services are hosted, your information
              may be processed and stored in other countries where our service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Changes to This Privacy Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Updated versions will be posted
              at the Privacy Policy URL and will become effective on the date listed above (or the
              updated effective date).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">11. Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy or your data, contact us at:
            </p>
            <p className="mt-3">
              <a
                href="mailto:rivelolabs@gmail.com"
                className="text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
              >
                rivelolabs@gmail.com
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
