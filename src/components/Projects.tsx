"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Apple, Globe, ChevronLeft, ChevronRight, Activity, Zap } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

/* ——— 3D Tilt Hook ——— */
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 25 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return { rotateX, rotateY, handleMouse, reset };
}

type Screen = { src: string; label: string; desc: string };
type Feature = { label: string };
type PrivacyLink = { label: string; href: string };

type Project = {
  name: string;
  typeLabel: string;
  accent: string;
  isWeb?: boolean;
  liveUrl?: string;
  metricsBadge?: string;
  description: ReactNode;
  features: Feature[];
  tech: string[];
  screens: Screen[];
  privacyLinks?: PrivacyLink[];
  caseStudyHref?: string;
  cardClass?: string;
};

const projects: Project[] = [
  {
    name: "OmegleVC",
    typeLabel: "Live Video & Voice Web Platform",
    accent: "#0891b2",
    isWeb: true,
    liveUrl: "https://omeglevc.com",
    metricsBadge: "⚡ 100K+ Requests · 20K+ Active Visitors",
    cardClass: "card-pastel-blue",
    description: (
      <>
        A high-throughput, real-time random video, voice, and text connection
        platform. Engineered with sub-second peer matching, low-latency WebRTC
        media pipelines, and distributed WebSocket routing. Handling{" "}
        <strong className="text-cyan-700 font-bold">100K+ network requests</strong> and{" "}
        <strong className="text-cyan-700 font-bold">20K+ monthly active visitors</strong> with zero-lag uptime.
      </>
    ),
    features: [
      { label: "100K+ Handled Requests" },
      { label: "20K+ Active Visitors" },
      { label: "Sub-50ms Peer Matching" },
      { label: "WebRTC Video & Voice Mesh" },
      { label: "Distributed WebSockets" },
      { label: "Zero-Log Privacy" },
    ],
    tech: ["Next.js", "TypeScript", "WebRTC", "Node.js", "WebSockets", "Redis", "Tailwind CSS"],
    screens: [
      {
        src: "/omeglevc.png",
        label: "Live Arena",
        desc: "Instant random video, chat, custom rooms & live streaming with 100K+ requests",
      },
    ],
  },
  {
    name: "RevFit",
    typeLabel: "iOS Application",
    accent: "#4f46e5",
    cardClass: "card-pastel-white",
    description: (
      <>
        The ultimate lifestyle companion for peak performance. An all-in-one
        ecosystem integrating health tracking, fitness coaching, mindfulness,
        and nutrition management.
      </>
    ),
    features: [
      { label: "Activity Tracking" },
      { label: "Meal Logger" },
      { label: "Custom Workouts" },
      { label: "Mood Tracking" },
      { label: "XP & Leveling" },
      { label: "Weight Progress" },
    ],
    tech: ["Swift", "SwiftUI", "Firebase", "Charts", "HealthKit", "Core Data"],
    screens: [
      {
        src: "/revfit.png",
        label: "Dashboard",
        desc: "Live workout tracking, activity rings, weekly goals & exercise logs",
      },
    ],
    privacyLinks: [{ label: "Privacy Policy", href: "/privacy" }],
  },
  {
    name: "Calarm",
    typeLabel: "iOS Application",
    accent: "#d97706",
    cardClass: "card-pastel-white",
    description: (
      <>
        A smart wake-up app that turns Google Calendar events into reliable
        alarms. Calarm combines color-based triggers, calendar sync, premium
        timing controls, and push-backed reminders.
      </>
    ),
    features: [
      { label: "Google Calendar Sync" },
      { label: "Color Alarm Rules" },
      { label: "Custom Alarm Timing" },
      { label: "Push Notifications" },
      { label: "Premium Plans" },
    ],
    tech: ["Swift", "SwiftUI", "Firebase Auth", "Google Calendar API", "APNs", "StoreKit", "AlarmKit"],
    screens: [
      { src: "/calarm-screen-1.png", label: "Settings", desc: "Subscription, calendar sync, alarms, and account controls" },
      { src: "/calarm-screen-2.png", label: "Alarm Colors", desc: "Configure event color triggers and premium timing options" },
      { src: "/calarm-screen-3.png", label: "Premium", desc: "Unlock unlimited alarms, all colors, timing, and sounds" },
    ],
    privacyLinks: [{ label: "Privacy Policy", href: "/privacy/calarm" }],
  },
  {
    name: "Klyq",
    typeLabel: "iOS & Android Application",
    accent: "#db2777",
    cardClass: "card-pastel-green",
    description: (
      <>
        Play. Chat. Match. A live social arena where you meet new people through
        random video, voice, and text matching, battle strangers in quick
        multiplayer games, drop into anonymous circles, and discover who&apos;s
        nearby.
      </>
    ),
    features: [
      { label: "Random Video Match" },
      { label: "Voice & Text Chat" },
      { label: "Multiplayer Games" },
      { label: "Anonymous Circles" },
      { label: "Nearby Map" },
      { label: "Communities & Stories" },
    ],
    tech: ["Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "Supabase", "LiveKit", "Google Mobile Ads"],
    screens: [
      { src: "/klyq-arena.png", label: "Arena", desc: "Random opponents & quick multiplayer games with live chat" },
      { src: "/klyq-match.png", label: "Match", desc: "Random video, voice, and text matching with new people" },
      { src: "/klyq-nearby.png", label: "Nearby", desc: "Discover people and groups around you on the live map" },
    ],
    privacyLinks: [
      { label: "Privacy (iOS)", href: "/privacy/klyq" },
      { label: "Privacy (Android)", href: "/privacy/klyq-android" },
    ],
  },
];

function ProjectCard({ project, isFirst }: { project: Project; isFirst: boolean }) {
  const { rotateX, rotateY, handleMouse, reset } = useTilt();
  const [active, setActive] = useState(0);

  const next = () => setActive((p) => (p + 1) % project.screens.length);
  const prev = () => setActive((p) => (p - 1 + project.screens.length) % project.screens.length);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
      className="perspective"
    >
      <div
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ transform: `perspective(1000px)` }}
        className={`${project.cardClass || "card-pastel-white"} relative overflow-hidden p-7 sm:p-12 rounded-3xl transition-transform duration-300`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Info */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${project.accent}15`,
                  border: `1px solid ${project.accent}30`,
                  color: project.accent,
                }}
              >
                {project.isWeb ? <Globe className="h-3.5 w-3.5" /> : <Apple className="h-3.5 w-3.5" />}
                <span>{project.typeLabel}</span>
              </div>

              {project.metricsBadge && (
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold bg-cyan-600/10 border border-cyan-600/25 text-cyan-800">
                  <Activity className="h-3.5 w-3.5 text-cyan-600" />
                  <span>{project.metricsBadge}</span>
                </div>
              )}
            </div>

            <h3
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {project.name}
            </h3>

            <p className="text-sm sm:text-base leading-relaxed text-slate-700 max-w-lg">
              {project.description}
            </p>

            {project.liveUrl && (
              <div className="pt-1 flex justify-center lg:justify-start">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit live site for ${project.name}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all group cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visit {project.name} ({project.liveUrl.replace("https://", "")})</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}

            {project.privacyLinks && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start pt-1">
                {project.privacyLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {link.label} <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start pt-2">
              {project.features.map((f) => (
                <span
                  key={f.label}
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-white border border-black/10 text-slate-700 shadow-2xs"
                >
                  {f.label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 justify-center lg:justify-start">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-[10px] font-mono bg-black/5 border border-black/8 text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project Visual Showcase */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            {/* Device Mockup */}
            <div
              className="relative w-[240px] sm:w-[260px] h-[480px] sm:h-[520px] rounded-[2.5rem] overflow-hidden border-[6px] border-slate-900 bg-slate-950 shadow-xl"
            >
              {/* Notch */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20 bg-slate-900 pointer-events-none"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {project.screens[active]?.src && (
                    <Image
                      src={project.screens[active].src}
                      alt={`${project.name} - ${project.screens[active].label}`}
                      fill
                      sizes="(max-width: 640px) 240px, 260px"
                      priority={isFirst && active === 0}
                      loading={isFirst && active === 0 ? "eager" : "lazy"}
                      quality={85}
                      className="object-cover object-top"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls (if multiple screens) */}
            {project.screens.length > 1 && (
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={prev}
                  aria-label="Previous screen"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-black/10 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="text-center min-w-[120px]">
                  <p className="text-xs font-semibold text-slate-900">
                    {project.screens[active]?.label}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                    {project.screens[active]?.desc}
                  </p>
                </div>

                <button
                  onClick={next}
                  aria-label="Next screen"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-black/10 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Proven Track Record</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3"
            style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
          >
            Featured <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">Creations</span>
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            From high-throughput real-time platforms handling 100K+ requests to native mobile ecosystems.
          </p>
        </motion.div>

        <div className="space-y-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
