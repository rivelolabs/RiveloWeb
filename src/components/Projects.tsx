"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Apple, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

/* ——— 3D Tilt Hook ——— */
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 25 });

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
  description: ReactNode;
  features: Feature[];
  tech: string[];
  screens: Screen[];
  privacyLinks: PrivacyLink[];
  caseStudyHref?: string;
  accent: string;
};

const projects: Project[] = [
  {
    name: "RevFit",
    typeLabel: "iOS Application",
    accent: "#6366f1",
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
      { src: "/life-home.png", label: "Home", desc: "Activity tracking with Move, Exercise & Stand goals" },
      { src: "/life-fitness.png", label: "Fitness", desc: "Custom workout plans, weekly charts & weight tracking" },
      { src: "/life-mind.png", label: "Mind", desc: "Mood tracking, breathing exercises & recovery coaching" },
      { src: "/life-profile.png", label: "Profile", desc: "XP leveling, achievements & personalized goals" },
    ],
    privacyLinks: [{ label: "Privacy Policy", href: "/privacy" }],
    caseStudyHref: "#",
  },
  {
    name: "Calarm",
    typeLabel: "iOS Application",
    accent: "#f59e0b",
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
    accent: "#ec4899",
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

function ProjectCard({ project }: { project: Project }) {
  const { rotateX, rotateY, handleMouse, reset } = useTilt();
  const [active, setActive] = useState(0);

  const next = () => setActive((p) => (p + 1) % project.screens.length);
  const prev = () => setActive((p) => (p - 1 + project.screens.length) % project.screens.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
      className="perspective"
    >
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ rotateX, rotateY }}
        className="card relative overflow-hidden p-8 sm:p-12"
        /* override card border-radius */
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Info */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${project.accent}12`,
                border: `1px solid ${project.accent}25`,
                color: project.accent,
              }}
            >
              <Apple className="h-3.5 w-3.5" /> {project.typeLabel}
            </div>

            <h3
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                color: "var(--text)",
              }}
            >
              {project.name}
            </h3>

            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: "var(--text-muted)" }}
            >
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start">
              {project.privacyLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  {link.label} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {project.features.map((f) => (
                <span
                  key={f.label}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--accent-subtle)",
                    color: "var(--accent)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {f.label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 justify-center lg:justify-start">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-[11px] font-mono"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.caseStudyHref && (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href={project.caseStudyHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  View Case Study <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="flex-shrink-0 flex flex-col items-center gap-5"
          >
            <div
              className="relative w-[260px] h-[530px] rounded-[2.5rem] overflow-hidden"
              style={{
                border: "5px solid var(--border)",
                boxShadow: "var(--shadow-xl)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Notch */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-20"
                style={{ backgroundColor: "var(--border)" }}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.screens[active].src}
                    alt={`${project.name} ${project.screens[active].label} screen`}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-muted)",
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-center min-w-[140px]">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {project.screens[active].label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {project.screens[active].desc}
                </p>
              </div>

              <button
                onClick={next}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-muted)",
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex gap-1.5">
              {project.screens.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "1.25rem" : "0.375rem",
                    height: "0.375rem",
                    backgroundColor: i === active ? "var(--accent)" : "var(--border-hover)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative z-10 py-28 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <p className="section-label">Our Creations</p>
          <h2 className="section-title mx-auto">
            Featured{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              }}
            >
              Projects
            </span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
