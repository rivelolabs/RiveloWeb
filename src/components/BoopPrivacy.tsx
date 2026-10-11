import Link from "next/link";
import { Shield } from "lucide-react";
import { BoopPageShell, ContactCard, EmailLink, SectionHeading, SubHeading } from "@/components/BoopLegal";

/* Privacy policy body for BOOP. One source of truth for iOS and Android; only platform details differ. */

const sections = [
  { id: "collect", label: "1. Information We Collect" },
  { id: "device", label: "2. Stored on Your Device" },
  { id: "permissions", label: "3. Permissions" },
  { id: "sharing", label: "4. Who Receives Info" },
  { id: "ads", label: "5. Advertising & Tracking" },
  { id: "retention", label: "6. Retention & Deletion" },
  { id: "children", label: "7. Children" },
  { id: "rights", label: "8. Your Choices & Rights" },
  { id: "labels", label: "9. Store Declarations" },
  { id: "changes", label: "10. Changes & Contact" },
];

export default function BoopPrivacy({ platform }: { platform: "ios" | "android" }) {
  const ios = platform === "ios";
  const os = ios ? "iOS" : "Android";
  const store = ios ? "Apple App Store" : "Google Play";
  const otherHref = ios ? "/privacy/boop-android" : "/privacy/boop";
  const otherLabel = ios ? "View Android Privacy Policy" : "View iOS Privacy Policy";

  return (
    <BoopPageShell
      sections={sections}
      badgeIcon={Shield}
      badgeLabel="Privacy Policy"
      platform={platform}
      titlePrefix="Privacy Policy for"
      titleAccent={`BOOP (${os})`}
      meta={["Effective date: October 11, 2026", "Last updated: October 11, 2026", `Platform: ${ios ? "Apple iOS" : "Google Android"}`]}
      sideLinks={[
        { caption: "Need help with the game?", href: "/support/boop", label: "BOOP Support" },
        { caption: ios ? "Using Android?" : "Using iPhone?", href: otherHref, label: ios ? "BOOP Android Privacy Policy" : "BOOP iOS Privacy Policy" },
      ]}
    >
      <p>
        BOOP is operated by Rivelo Labs, managed by calquors.com (&quot;BOOP,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
        {!ios && <> Its Android application ID is <strong style={{ color: "var(--text)" }}>com.ripplebound.game</strong>.</>} This policy
        explains what the BOOP {os} app does with information. Questions and privacy requests can be sent to <EmailLink />.
      </p>
      <p>
        BOOP is an offline, single-player wave-physics puzzle game for all ages. You tap the water, ground or sky to send a wave that carries
        your pet into a goal ring. <strong style={{ color: "var(--text)" }}>BOOP does not collect, store on our servers, share, or sell any
        personal information.</strong> It has no accounts, no sign-in, no chat, no advertising, no analytics and no in-app purchases, and it
        makes no network requests.
      </p>

      <section>
        <SectionHeading id="collect" number="01" title="Information we collect" />
        <p className="mt-3">
          None. BOOP does not send any information from your device to us or to any third party, and we have no servers that receive data
          from the game.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <SubHeading title="What BOOP never collects" />
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Name, email address, phone number, date of birth, or account details</li>
              <li>Location (precise or approximate)</li>
              <li>Contacts, photos, videos, files, camera, or microphone</li>
              <li>Health, fitness, or financial information</li>
              <li>Advertising identifiers ({ios ? "IDFA" : "Android Advertising ID"}) or other device identifiers</li>
              <li>Usage analytics, crash reports, or diagnostics</li>
              <li>Browsing or search history</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading id="device" number="02" title="Information stored only on your device" />
        <p className="mt-3">To remember your game, BOOP saves the following on your device. It never leaves your device.</p>
        <div className="mt-4 space-y-4">
          <div>
            <SubHeading title="Game progress" />
            <p className="mt-1">
              Levels unlocked in each world (Water, Land and Sky), stars, points, streaks, and Daily level results, saved in
              {ios ? " iOS UserDefaults" : " Android SharedPreferences"} so you can continue where you left off.
            </p>
          </div>
          <div>
            <SubHeading title="Settings" />
            <p className="mt-1">
              Your chosen companion, world, 2D or 3D view, theme and colours, and whether sound and vibration are on.
            </p>
          </div>
          {!ios && (
            <div>
              <SubHeading title="Sound effects" />
              <p className="mt-1">The game generates its sound effects when it first starts and keeps them in the app&apos;s cache folder.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <SectionHeading id="permissions" number="03" title="Permissions" />
        {ios ? (
          <p className="mt-3">
            BOOP does not request any iOS permissions. It uses the system haptic engine for vibration feedback, which needs no permission,
            and you can turn haptics off in the game&apos;s Settings. It does not use location, camera, microphone, contacts, photos,
            notifications, or tracking.
          </p>
        ) : (
          <p className="mt-3">
            BOOP requests only the <strong style={{ color: "var(--text)" }}>Vibration</strong> permission, used for haptic feedback when you
            tap and when your pet hits a wall or reaches the goal. You can turn it off in the game&apos;s Settings. BOOP does not request
            internet, location, camera, microphone, contacts, storage, notification, or advertising permissions.
          </p>
        )}
      </section>

      <section>
        <SectionHeading id="sharing" number="04" title="Who receives information" />
        <p className="mt-3">
          Nobody. BOOP includes no third-party SDKs for analytics, advertising, crash reporting, or social features, and it does not connect to
          any server. If you download BOOP from the {store}, {ios ? "Apple" : "Google"} may process information about your download and device
          under its own{" "}
          <a
            href={ios ? "https://www.apple.com/legal/privacy" : "https://policies.google.com/privacy"}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
            style={{ color: "var(--accent)" }}
          >
            privacy policy
          </a>
          , which we do not control.
        </p>
      </section>

      <section>
        <SectionHeading id="ads" number="05" title="Advertising and tracking" />
        <p className="mt-3">
          BOOP shows no advertising and does not track you across other companies&apos; apps or websites.
          {ios ? " Because it performs no tracking, it never shows Apple's App Tracking Transparency prompt." : " It does not use the Android Advertising ID."}
        </p>
      </section>

      <section>
        <SectionHeading id="retention" number="06" title="Retention and deletion" />
        <p className="mt-3">Your progress and settings stay on your device until you remove them. You can erase all progress at any time in:</p>
        <div className="mt-2 rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: "var(--code-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          Settings → Reset progress
        </div>
        <p className="mt-3">
          Uninstalling BOOP deletes all of its data from your device. Because we hold no information about you, there is nothing to delete on
          our side and no account to close.
        </p>
      </section>

      <section>
        <SectionHeading id="children" number="07" title="Children" />
        <p className="mt-3">
          BOOP is suitable for all ages. Because it collects no personal information from anyone, it collects none from children. It has no
          chat, no links to social media, no advertising, and no purchases. If you have a concern, contact <EmailLink />.
        </p>
      </section>

      <section>
        <SectionHeading id="rights" number="08" title="Your choices and rights" />
        <p className="mt-3">
          You control sound, vibration, and all game data from inside the app. Depending on where you live, laws such as the GDPR or CCPA may
          give you rights to access, correct, delete, or obtain a copy of your personal information, or to object to its processing. BOOP does
          not collect or sell personal information, so we hold none to provide or delete. For any question, contact <EmailLink />.
        </p>
      </section>

      <section>
        <SectionHeading id="labels" number="09" title={`${store} declarations`} />
        {ios ? (
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Data Used to Track You: None</li>
            <li>Data Linked to You: None</li>
            <li>Data Not Linked to You: None</li>
            <li>Privacy label: <strong style={{ color: "var(--text)" }}>Data Not Collected</strong></li>
          </ul>
        ) : (
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Data collected: None</li>
            <li>Data shared with third parties: None</li>
            <li>Encryption in transit: Not applicable (the app sends no data)</li>
            <li>Data deletion: Reset progress in the app or uninstall it</li>
          </ul>
        )}
      </section>

      <section>
        <SectionHeading id="changes" number="10" title="Changes and contact" />
        <p className="mt-3">
          If a future version of BOOP changes how information is handled, we will update this policy and its &quot;Last updated&quot; date before
          that version is released. For help with the game, visit{" "}
          <Link href="/support/boop" className="underline underline-offset-4" style={{ color: "var(--accent)" }}>BOOP Support</Link>.
        </p>
        <ContactCard
          urlLabel={`${os} Privacy Policy URL`}
          url={ios ? "https://www.rivelolabs.com/privacy/boop" : "https://www.rivelolabs.com/privacy/boop-android"}
          otherHref={otherHref}
          otherLabel={otherLabel}
        />
      </section>
    </BoopPageShell>
  );
}
