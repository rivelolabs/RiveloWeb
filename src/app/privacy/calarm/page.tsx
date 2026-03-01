import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calarm Privacy Policy | Rivelolabs",
  description: "Privacy Policy for the Calarm (EventAlarm - Smart Wake-Up) iOS application.",
};

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
      <table className="min-w-full text-left text-sm">
        <thead style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ color: "var(--text-secondary)" }}>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderTop: "1px solid var(--border)" }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CalarmPrivacyPage() {
  return (
    <main className="relative min-h-screen px-6 py-16 sm:px-8">
      <div className="mesh-gradient" />

      <article className="card mx-auto max-w-5xl relative z-10 p-6 sm:p-10">
        <p className="section-label">Privacy Policy</p>
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            color: "var(--text)",
          }}
        >
          Privacy Policy for Calarm
        </h1>
        <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Last Updated: February 28, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 sm:text-base" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>App Details</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>
                <span className="font-semibold" style={{ color: "var(--text)" }}>Developer:</span> Rivelo Labs
              </li>
              <li>
                <span className="font-semibold" style={{ color: "var(--text)" }}>App Name:</span> Calarm - Smart Wake-Up
              </li>
              <li>
                <span className="font-semibold" style={{ color: "var(--text)" }}>Bundle ID:</span> com.eventalarm.app
              </li>
              <li>
                <span className="font-semibold" style={{ color: "var(--text)" }}>Contact Email:</span>{" "}
                <a href="mailto:rivelolabs@gmail.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  rivelolabs@gmail.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>1. Introduction</h2>
            <p className="mt-3">
              Calarm (&quot;we&quot;, &quot;our&quot;, or &quot;the App&quot;) respects your privacy. This Privacy Policy explains what
              information we collect, how we use it, how we share it, and your choices regarding
              your data when you use the Calarm iOS application.
            </p>
            <p className="mt-2">
              By using Calarm, you agree to the collection and use of information as described in
              this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>2. Information We Collect</h2>

            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text)" }}>2.1 Information You Provide</h3>
            <DataTable
              headers={["Data Type", "Purpose", "Required"]}
              rows={[
                ["Google Account Email", "Account creation and identification", "Yes"],
                ["Google Display Name", "Personalization within the app", "Yes"],
                ["Google Calendar Data (read-only)", "Reading your calendar events to create alarms automatically", "Yes"],
              ]}
            />

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>2.2 Information Collected Automatically</h3>
            <DataTable
              headers={["Data Type", "Purpose", "Required"]}
              rows={[
                ["Firebase Authentication Token", "Secure API authentication", "Yes"],
                ["Apple Push Notification (APNs) Token", "Delivering alarm notifications to your device", "Yes"],
                ["Device Name", "Identifying your device for push notification delivery", "Yes"],
                ["Subscription Status", "Managing your free or premium plan", "Yes"],
              ]}
            />

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>2.3 Information We Do NOT Collect</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>We do not collect your precise location</li>
              <li>We do not collect your contacts or address book</li>
              <li>We do not collect health or fitness data</li>
              <li>We do not collect photos, videos, or media files</li>
              <li>We do not collect browsing history</li>
              <li>We do not collect financial or payment information (all payments processed by Apple)</li>
              <li>We do not collect advertising identifiers (IDFA)</li>
              <li>We do not run any analytics or tracking SDKs</li>
              <li>We do not collect your Google account password</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>3. How We Use Your Information</h2>
            <p className="mt-3">We use the information we collect for the following purposes:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Account Authentication:</span> To securely sign you in via Google Sign-In and Firebase Authentication.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Calendar Sync:</span> To read your Google Calendar events (read-only) and automatically create alarms based on event colors you configure.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Alarm Delivery:</span> To schedule system-level alarms (via AlarmKit on iOS 26+) and send push notifications so you never miss an event.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Subscription Management:</span> To verify your subscription tier (Free, Trial, or Premium) and provide the appropriate features.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>App Functionality:</span> To save your alarm preferences (alarm color rules, timing settings, sound preferences).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>4. Third-Party Services</h2>

            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text)" }}>4.1 Firebase Authentication (by Google)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Purpose:</span> Secure user authentication</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Data Shared:</span> Email address, authentication tokens</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Privacy Policy:</span>{" "}
                <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  https://firebase.google.com/support/privacy
                </a>
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>4.2 Google Sign-In (by Google)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Purpose:</span> User login and Google Calendar authorization</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Data Shared:</span> Google account email, display name, calendar read-only access token</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Privacy Policy:</span>{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  https://policies.google.com/privacy
                </a>
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>4.3 Google Calendar API</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Purpose:</span> Reading calendar events to create automatic alarms</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Access Level:</span> Read-only (`calendar.readonly` scope)</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Data Accessed:</span> Event titles, start/end times, locations, descriptions, calendar names, event colors, and event links</li>
              <li>We do NOT modify, create, or delete your calendar events</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>4.4 Apple StoreKit</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Purpose:</span> In-app subscription purchases</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Data Shared:</span> Transaction data processed entirely by Apple</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Privacy Policy:</span>{" "}
                <a href="https://www.apple.com/legal/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  https://www.apple.com/legal/privacy
                </a>
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>4.5 Apple Push Notification Service (APNs)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Purpose:</span> Delivering alarm notifications</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Data Shared:</span> Device push token, notification content (event title, time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>5. Data Storage and Security</h2>

            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text)" }}>5.1 Local Storage</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Keychain:</span> Your authentication token is stored securely in the iOS Keychain with `afterFirstUnlock` protection, encrypted by the device hardware.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>AlarmKit:</span> Alarm data is stored locally on your device by the iOS system for scheduled alarms.</li>
              <li>No other data is stored locally on your device.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>5.2 Server Storage</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Your account data, alarm records, and preferences are stored on our secure backend server hosted on Railway (
                <a href="https://railway.app" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>https://railway.app</a>).
              </li>
              <li>All communication between the app and our server uses HTTPS encryption.</li>
              <li>Authentication is enforced via Firebase ID tokens on every API request.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>5.3 Google Calendar Tokens</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Your Google Calendar authorization code is exchanged server-side for an access token.</li>
              <li>Calendar access tokens are stored securely on our backend server.</li>
              <li>These tokens provide read-only access to your calendar.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>6. Data Sharing</h2>
            <p className="mt-3">We do not sell, rent, or trade your personal information to third parties.</p>
            <p className="mt-2">We share data only with:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Google (Firebase and Google Sign-In):</span> For authentication purposes only.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Apple:</span> For push notification delivery and subscription transaction processing.</li>
              <li><span className="font-semibold" style={{ color: "var(--text)" }}>Our Backend Server:</span> To sync your alarms, preferences, and subscription status.</li>
            </ul>
            <p className="mt-2">We may disclose your information if required by law or to protect our legal rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>7. Data Retention</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Your data is retained as long as your account is active.</li>
              <li>When you delete your account (via Settings &gt; Delete Account), we permanently delete:</li>
              <li>Your user profile and email</li>
              <li>All alarm records</li>
              <li>All calendar connection tokens</li>
              <li>All color rule preferences</li>
              <li>Your Firebase authentication account</li>
              <li>Push notification tokens are removed when you sign out or delete your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>8. Your Rights and Choices</h2>

            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text)" }}>8.1 Access and Deletion</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You can view your account information in the Settings tab.</li>
              <li>You can delete your account and all associated data at any time from Settings &gt; Delete Account.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>8.2 Google Calendar Access</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You can disconnect Google Calendar access by revoking Calarm&apos;s permissions in your Google Account settings at{" "}
                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  https://myaccount.google.com/permissions
                </a>.
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>8.3 Push Notifications</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You can disable push notifications at any time via iOS Settings &gt; Calarm &gt; Notifications.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>8.4 Subscription</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You can manage or cancel your subscription at any time via iOS Settings &gt; Apple ID &gt; Subscriptions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>9. Children&apos;s Privacy</h2>
            <p className="mt-3">
              Calarm is not directed at children under the age of 13. We do not knowingly collect
              personal information from children under 13. If we discover that a child under 13 has
              provided us with personal data, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>10. Permissions Used</h2>
            <DataTable
              headers={["Permission", "Reason"]}
              rows={[
                ["Notifications", "To deliver alarm alerts when your calendar events are approaching"],
                ["AlarmKit (iOS 26+)", "To schedule system-level alarms that ring even when the app is closed"],
                ["Internet Access", "To sync alarms with our server and authenticate with Google"],
                ["Google Calendar (read-only)", "To read your events and automatically create alarms based on color rules"],
              ]}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>11. Apple App Tracking Transparency</h2>
            <p className="mt-3">
              Calarm does not track you across other companies&apos; apps or websites. We do not use the
              App Tracking Transparency framework because we do not perform any tracking. We do not
              collect the Identifier for Advertisers (IDFA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>12. California Privacy Rights (CCPA)</h2>
            <p className="mt-3">If you are a California resident, you have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Know what personal data we collect about you</li>
              <li>Request deletion of your personal data</li>
              <li>Not be discriminated against for exercising your privacy rights</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, delete your account within the app or contact us at{" "}
              <a href="mailto:rivelolabs@gmail.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                rivelolabs@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>13. European Privacy Rights (GDPR)</h2>
            <p className="mt-3">If you are in the European Economic Area, you have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-2">
              Our legal basis for processing your data is your consent (by signing in and using the
              app) and legitimate interest (providing the alarm service). To exercise these rights,
              contact us at{" "}
              <a href="mailto:rivelolabs@gmail.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                rivelolabs@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>14. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by updating the &quot;Last Updated&quot; date at the top of this page. Continued use of
              the App after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>15. Contact Us</h2>
            <p className="mt-3">If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                Email:{" "}
                <a href="mailto:rivelolabs@gmail.com" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>
                  rivelolabs@gmail.com
                </a>
              </li>
              <li>Website: https://rivelolabs.com/privacy/calarm</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>Apple App Store Privacy Nutrition Label</h2>
            <p className="mt-3">Below is the data declaration for the App Store privacy label:</p>

            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--text)" }}>Data Used to Track You</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>None - We do not track you across apps or websites.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>Data Linked to You</h3>
            <DataTable
              headers={["Data Type", "Purpose"]}
              rows={[
                ["Email Address", "App Functionality, Account Authentication"],
                ["Name", "App Functionality, Personalization"],
                ["User ID (Firebase UID)", "App Functionality, Account Authentication"],
              ]}
            />

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>Data Not Linked to You</h3>
            <DataTable
              headers={["Data Type", "Purpose"]}
              rows={[
                ["Purchase History", "App Functionality (subscription status)"],
                ["Device ID (APNs Token)", "App Functionality (push notifications)"],
              ]}
            />

            <h3 className="mt-6 text-lg font-semibold" style={{ color: "var(--text)" }}>Data Not Collected</h3>
            <p className="mt-2">
              Location, Contacts, Photos, Health, Fitness, Financial Info, Sensitive Info, Browsing
              History, Search History, Diagnostics, Advertising Data, Usage Data.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
