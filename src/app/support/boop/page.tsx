import type { Metadata } from "next";
import Image from "next/image";
import { LifeBuoy } from "lucide-react";
import { BoopPageShell, ContactCard, EmailLink, SectionHeading, BOOP_EMAIL } from "@/components/BoopLegal";

export const metadata: Metadata = {
  title: "BOOP Support | Rivelolabs",
  description: "Help, FAQs, screenshots and contact for BOOP, the wave-physics pet puzzle game by Rivelo Labs.",
};

const sections = [
  { id: "contact", label: "1. Contact Support" },
  { id: "screenshots", label: "2. Screenshots" },
  { id: "howto", label: "3. How to Play" },
  { id: "faq", label: "4. FAQ" },
  { id: "details", label: "5. App Details" },
];

const screens = [
  { src: "/boop-home.jpg", label: "Pick your pet & world" },
  { src: "/boop-water.jpg", label: "Water: ride the ripples" },
  { src: "/boop-land.jpg", label: "Land: stomp the meadow" },
  { src: "/boop-sky.jpg", label: "Sky: gust to the rainbow" },
  { src: "/boop-3d.jpg", label: "Full 3D mode" },
  { src: "/boop-win.jpg", label: "Earn stars" },
];

const faqs: { q: string; a: string }[] = [
  { q: "How do I get three stars?", a: "Finish the level using no more stones than the par shown under the level name. One stone over par gives two stars." },
  { q: "What is the difference between Water, Land and Sky?", a: "Each world has its own levels, progress and feel. Water waves glide smoothly. On Land waves fade fast, so stomp close to your pet. In the Sky gusts travel far but push gently." },
  { q: "How do I change my pet, world or switch to 3D?", a: "Use the buttons on the home screen. Colours, themes, sound and vibration are in Settings." },
  { q: "How do I move the camera in 3D?", a: "Drag to look around and pinch to zoom. The camera button in the top bar switches between chase, orbit and top views." },
  { q: "Do the levels ever end?", a: "No. Levels are generated endlessly and slowly get harder. A new Daily level appears every day." },
  { q: "Is my progress saved? Can I move it to a new phone?", a: "Progress is saved on your device. BOOP has no accounts and does not use the internet, so progress cannot be transferred and is removed if you delete the app." },
  { q: "How do I reset my progress?", a: "Open Settings in the game and choose Reset progress." },
  { q: "Does BOOP need internet, show ads or have purchases?", a: "No. BOOP works fully offline with no ads, no accounts and no in-app purchases." },
  { q: "The game feels slow or the 3D mode stutters.", a: "3D mode needs more graphics power. Switch to 2D on the home screen for the smoothest play on older devices, and turn off Low Power Mode or Battery Saver." },
];

export default function BoopSupportPage() {
  return (
    <BoopPageShell
      sections={sections}
      badgeIcon={LifeBuoy}
      badgeLabel="Support"
      titlePrefix="Support for"
      titleAccent="BOOP"
      meta={["Platforms: iOS and Android", "Free · No ads · No accounts"]}
      sideLinks={[
        { caption: "Using iPhone?", href: "/privacy/boop", label: "BOOP iOS Privacy Policy" },
        { caption: "Using Android?", href: "/privacy/boop-android", label: "BOOP Android Privacy Policy" },
      ]}
    >
      <p>
        BOOP is a one-touch physics puzzle with living waves. Tap the water, stomp the meadow or gust through the sky so your cat, dog, bunny,
        panda or frog rides the wave into the glowing ring. This page covers common questions and how to reach us.
      </p>

      <section>
        <SectionHeading id="contact" number="01" title="Contact support" />
        <p className="mt-3">
          Email <EmailLink /> with your device model, {"iOS or Android"} version, and a short description of what happened. Screenshots or a
          screen recording help us fix problems faster. We usually reply within two working days.
        </p>
        <a
          href={`mailto:${BOOP_EMAIL}?subject=BOOP%20Support`}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Email BOOP Support
        </a>
      </section>

      <section>
        <SectionHeading id="screenshots" number="02" title="Screenshots" />
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {screens.map((s) => (
            <figure key={s.src} className="flex flex-col items-center gap-3">
              <div className="relative w-full max-w-[200px] aspect-[603/1311] overflow-hidden rounded-[1.8rem] border-[5px] border-slate-950 bg-slate-950 shadow-xl">
                <Image src={s.src} alt={`BOOP: ${s.label}`} fill sizes="(max-width: 640px) 45vw, 200px" className="object-cover" />
              </div>
              <figcaption className="text-center text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading id="howto" number="03" title="How to play" />
        <ol className="mt-3 list-decimal space-y-1 pl-6">
          <li>Choose a companion and a world (Water, Land or Sky) on the home screen, then tap Play.</li>
          <li>Tap anywhere on the field. Each tap sends a wave that pushes your pet away from where you tapped.</li>
          <li>Tap behind your pet to push it toward the glowing ring, or ahead of it to slow it down.</li>
          <li>Each tap uses one stone. Reach the ring before the stones run out, and avoid the dark drains.</li>
        </ol>
      </section>

      <section>
        <SectionHeading id="faq" number="04" title="Frequently asked questions" />
        <div className="mt-4">
          {faqs.map((f) => (
            <details key={f.q} className="py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <summary className="cursor-pointer list-none font-semibold" style={{ color: "var(--text)" }}>
                <span className="mr-2" style={{ color: "var(--accent)" }}>+</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading id="details" number="05" title="App details" />
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>Developer: Rivelo Labs, managed by calquors.com</li>
          <li>Platforms: iOS and Android</li>
          <li>Price: Free, with no ads and no in-app purchases</li>
          <li>Age rating: suitable for all ages</li>
          <li>Data collected: none</li>
        </ul>
        <ContactCard urlLabel="Support URL" url="https://www.rivelolabs.com/support/boop" />
      </section>
    </BoopPageShell>
  );
}
