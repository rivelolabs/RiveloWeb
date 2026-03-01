"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Apple, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

/* ——— 3D Tilt Hook ——— */
function useTilt() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const reset = () => { x.set(0); y.set(0); };
    return { rotateX, rotateY, handleMouse, reset };
}

type Screen = {
    src: string;
    label: string;
    desc: string;
};

type Feature = {
    label: string;
    color: string;
};

type Project = {
    name: string;
    typeLabel: string;
    description: ReactNode;
    features: Feature[];
    tech: string[];
    screens: Screen[];
    privacyHref: string;
    caseStudyHref?: string;
};

const projects: Project[] = [
    {
        name: "RevFit",
        typeLabel: "iOS Application",
        description: (
            <>
                The ultimate lifestyle companion for peak performance. An all-in-one ecosystem integrating{" "}
                <span className="text-cyan-400 font-medium">Health Tracking</span>,{" "}
                <span className="text-orange-400 font-medium">Fitness Coaching</span>,{" "}
                <span className="text-purple-400 font-medium">Mindfulness</span>, and{" "}
                <span className="text-emerald-400 font-medium">Nutrition Management</span>.
            </>
        ),
        features: [
            { label: "Activity Tracking", color: "text-orange-300 border-orange-500/20 bg-orange-500/5" },
            { label: "Meal Logger", color: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5" },
            { label: "Custom Workouts", color: "text-cyan-300 border-cyan-500/20 bg-cyan-500/5" },
            { label: "Mood Tracking", color: "text-purple-300 border-purple-500/20 bg-purple-500/5" },
            { label: "XP & Leveling", color: "text-yellow-300 border-yellow-500/20 bg-yellow-500/5" },
            { label: "Weight Progress", color: "text-rose-300 border-rose-500/20 bg-rose-500/5" },
        ],
        tech: ["Swift", "SwiftUI", "Firebase", "Charts", "HealthKit", "Core Data"],
        screens: [
            { src: "/life-home.png", label: "Home", desc: "Activity tracking with Move, Exercise & Stand goals" },
            { src: "/life-fitness.png", label: "Fitness", desc: "Custom workout plans, weekly charts & weight tracking" },
            { src: "/life-mind.png", label: "Mind", desc: "Mood tracking, breathing exercises & recovery coaching" },
            { src: "/life-profile.png", label: "Profile", desc: "XP leveling, achievements & personalized goals" },
        ],
        privacyHref: "/privacy",
        caseStudyHref: "#",
    },
    {
        name: "Calarm",
        typeLabel: "iOS Application",
        description: (
            <>
                A smart wake-up app that turns Google Calendar events into reliable alarms. Calarm combines{" "}
                <span className="text-yellow-300 font-medium">color-based triggers</span>,{" "}
                <span className="text-cyan-300 font-medium">calendar sync</span>,{" "}
                <span className="text-orange-300 font-medium">premium timing controls</span>, and{" "}
                <span className="text-emerald-300 font-medium">push-backed reminders</span> so you never miss an event.
            </>
        ),
        features: [
            { label: "Google Calendar Sync", color: "text-cyan-300 border-cyan-500/20 bg-cyan-500/5" },
            { label: "Color Alarm Rules", color: "text-pink-300 border-pink-500/20 bg-pink-500/5" },
            { label: "Custom Alarm Timing", color: "text-orange-300 border-orange-500/20 bg-orange-500/5" },
            { label: "Push Notifications", color: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5" },
            { label: "Premium Plans", color: "text-yellow-300 border-yellow-500/20 bg-yellow-500/5" },
        ],
        tech: ["Swift", "SwiftUI", "Firebase Auth", "Google Calendar API", "APNs", "StoreKit", "AlarmKit"],
        screens: [
            { src: "/calarm-screen-1.png", label: "Settings", desc: "Subscription, calendar sync, alarms, and account controls" },
            { src: "/calarm-screen-2.png", label: "Alarm Colors", desc: "Configure event color triggers and premium timing options" },
            { src: "/calarm-screen-3.png", label: "Premium", desc: "Unlock unlimited alarms, all colors, timing, and sounds" },
        ],
        privacyHref: "/privacy/calarm",
    },
];

function ProjectCard({ project }: { project: Project }) {
    const { rotateX, rotateY, handleMouse, reset } = useTilt();
    const [active, setActive] = useState(0);

    const next = () => setActive((p) => (p + 1) % project.screens.length);
    const prev = () => setActive((p) => (p - 1 + project.screens.length) % project.screens.length);

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="perspective"
        >
            <motion.div
                onMouseMove={handleMouse}
                onMouseLeave={reset}
                style={{ rotateX, rotateY }}
                className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-12 overflow-hidden backdrop-blur-sm"
            >
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/[0.07] blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-300">
                            <Apple className="h-4 w-4" /> {project.typeLabel}
                        </div>

                        <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-[var(--font-display)]">
                            {project.name}
                        </h3>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                            {project.description}
                        </p>

                        <a
                            href={project.privacyHref}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                        >
                            Privacy Policy <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                            {project.features.map((feature) => (
                                <span
                                    key={feature.label}
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${feature.color}`}
                                >
                                    {feature.label}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start">
                            {project.tech.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-mono text-gray-500"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {project.caseStudyHref ? (
                            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                                <a
                                    href={project.caseStudyHref}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                                >
                                    View Case Study <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        ) : null}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 flex flex-col items-center gap-6"
                    >
                        <div className="relative w-[280px] h-[570px] rounded-[3rem] border-[6px] border-gray-800 bg-black shadow-2xl shadow-indigo-500/10 overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.3 }}
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

                        <div className="flex items-center gap-4">
                            <button
                                onClick={prev}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="text-center min-w-[160px]">
                                <p className="text-sm font-semibold text-white">{project.screens[active].label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{project.screens[active].desc}</p>
                            </div>

                            <button
                                onClick={next}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            {project.screens.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === active
                                        ? "w-6 bg-indigo-500"
                                        : "w-2 bg-gray-600 hover:bg-gray-500"
                                        }`}
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
        <section id="work" className="relative z-10 py-32 px-6 spotlight">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20 text-center"
                >
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                        Our Creation
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-[var(--font-display)]">
                        Featured{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Projects
                        </span>
                    </h2>
                </motion.div>

                <div className="space-y-16">
                    {projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
