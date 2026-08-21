"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Globe,
  Apple,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Zap,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, type ReactNode } from "react";

type ProjectItem = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  accent: string;
  badge: string;
  bgGradient: string;
  description: string;
  image: string;
  liveUrl?: string;
  privacyLinks?: { label: string; href: string }[];
  specs: string[];
  isWeb?: boolean;
};

const projects: ProjectItem[] = [
  {
    id: "omeglevc",
    name: "OmegleVC",
    tagline: "Sub-50ms WebRTC Video & Live Voice Matchmaking",
    category: "High-Throughput Web Platform",
    accent: "#06b6d4",
    badge: "⚡ 100K+ Requests · 20K+ Active Visitors",
    bgGradient: "linear-gradient(135deg, #082f49 0%, #0c4a6e 40%, #0369a1 100%)",
    description:
      "A distributed real-time communication platform handling over 100,000 network requests with zero-lag WebRTC media streaming and distributed WebSocket routing.",
    image: "/omeglevc.png",
    liveUrl: "https://omeglevc.com",
    specs: ["WebRTC Media Mesh", "Distributed WebSockets", "Redis Cluster", "Next.js & TypeScript"],
    isWeb: true,
  },
  {
    id: "revfit",
    name: "RevFit",
    tagline: "Apple HealthKit Performance & Daily Habit Ecosystem",
    category: "Native iOS Application",
    accent: "#6366f1",
    badge: "SwiftUI · HealthKit · 60 FPS",
    bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
    description:
      "The ultimate lifestyle and athletic companion. Seamlessly syncs Apple Watch biometric sensors, workout logs, nutrition macros, and gamified XP leveling.",
    image: "/revfit.png",
    privacyLinks: [{ label: "Privacy Policy", href: "/privacy" }],
    specs: ["Apple HealthKit Sync", "Swift Charts", "CoreData Engine", "Offline-First"],
  },
  {
    id: "calarm",
    name: "Calarm",
    tagline: "Google Calendar Smart Wake-Up & Event-Color Triggers",
    category: "Smart Calendar iOS App",
    accent: "#d97706",
    badge: "OAuth2 Sync · APNs Push Triggers",
    bgGradient: "linear-gradient(135deg, #451a03 0%, #78350f 40%, #b45309 100%)",
    description:
      "Transforms Google Calendar events into persistent, reliable alarms. Features automated color-based rules, custom alarm timing, and critical sound bypass.",
    image: "/calarm-screen-1.png",
    privacyLinks: [{ label: "Privacy Policy", href: "/privacy/calarm" }],
    specs: ["Google Calendar API", "AlarmKit Sound Engine", "StoreKit 2 IAP", "Push Notifications"],
  },
  {
    id: "klyq",
    name: "Klyq",
    tagline: "Real-Time Social Arena, Mini-Games & Live Match",
    category: "iOS & Android Cross-Platform Arena",
    accent: "#db2777",
    badge: "LiveKit SFU · Supabase Cluster",
    bgGradient: "linear-gradient(135deg, #500724 0%, #831843 40%, #be185d 100%)",
    description:
      "A high-energy live social platform featuring instant video & voice matchmaking, multiplayer arcade challenges, anonymous circles, and local geospatial discovery.",
    image: "/klyq-arena.png",
    privacyLinks: [
      { label: "Privacy (iOS)", href: "/privacy/klyq" },
      { label: "Privacy (Android)", href: "/privacy/klyq-android" },
    ],
    specs: ["LiveKit WebRTC SFU", "Supabase Realtime", "PostGIS Nearby Map", "Jetpack Compose & SwiftUI"],
  },
];

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-advance loop (5 seconds per slide like Apple.com)
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const currentProject = projects[currentIndex];

  return (
    <section id="work" className="relative z-10 py-24 overflow-hidden">
      {/* Section Header */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-12 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Proven Track Record</span>
        </div>
        <h2
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3"
          style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
        >
          Featured <span className="bg-gradient-to-r from-indigo-600 bg-clip-text text-transparent">Creations</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From high-throughput real-time platforms handling 100K+ requests to native mobile ecosystems.
        </p>
      </div>

      {/* Apple-Style Carousel Viewport */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Navigation Arrow Buttons */}
        <button
          onClick={prevSlide}
          aria-label="Previous project"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all cursor-pointer group"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next project"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all cursor-pointer group"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Carousel Slide Track */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, scale: 0.98, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -50 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              style={{ background: currentProject.bgGradient }}
              className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] w-full rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 flex flex-col justify-between text-white"
            >
              {/* Subtle background glow */}
              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-3xl"
                style={{ backgroundColor: currentProject.accent }}
              />

              {/* Top Meta Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    {currentProject.isWeb ? (
                      <Globe className="w-4 h-4 text-cyan-300" />
                    ) : (
                      <Apple className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90 font-mono">
                    {currentProject.category}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>{currentProject.badge}</span>
                </div>
              </div>

              {/* Main Center Content & Image Showcase */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6">
                {/* Left Text Block */}
                <div className="lg:col-span-7 space-y-4 text-left">
                  <h3
                    className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {currentProject.name}
                  </h3>

                  <p className="text-lg sm:text-xl font-medium text-white/95 leading-snug">
                    {currentProject.tagline}
                  </p>

                  <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                    {currentProject.description}
                  </p>

                  {/* Spec Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentProject.specs.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-medium text-white/90"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Action CTA & Privacy Links */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    {currentProject.liveUrl ? (
                      <a
                        href={currentProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-xl transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-cyan-600" />
                        <span>Visit {currentProject.name} Live</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-sm shadow-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Shipped Production System</span>
                      </div>
                    )}

                    {currentProject.privacyLinks && (
                      <div className="flex items-center gap-3">
                        {currentProject.privacyLinks.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-4 transition-colors"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Device Visual */}
                <div className="lg:col-span-5 flex justify-center items-center">
                  <div className="relative w-[240px] sm:w-[270px] h-[480px] sm:h-[530px] rounded-[2.8rem] overflow-hidden border-[6px] border-slate-950 bg-slate-950 shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20 bg-slate-950 pointer-events-none" />

                    <Image
                      src={currentProject.image}
                      alt={currentProject.name}
                      fill
                      sizes="(max-width: 640px) 240px, 270px"
                      priority
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Carousel Indicator Bar (Apple.com style) */}
              <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10 text-xs font-mono text-white/70">
                <span>0{currentIndex + 1} / 0{projects.length}</span>
                <span className="hidden sm:inline font-sans">
                  {currentProject.name} — {currentProject.category}
                </span>
                <span className="text-white/90 font-semibold">Auto-advancing (5s)</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Apple-Style Bottom Controls: Dots & Play/Pause Button */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-black/10 shadow-xs">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${proj.name}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-slate-900 shadow-xs"
                    : "w-2.5 bg-slate-300 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-black/10 text-slate-700 hover:text-slate-950 shadow-xs transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
