"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Apple, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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

/* ——— Screenshot Data ——— */
const screens = [
    { src: "/life-home.png", label: "Home", desc: "Activity tracking with Move, Exercise & Stand goals" },
    { src: "/life-fitness.png", label: "Fitness", desc: "Custom workout plans, weekly charts & weight tracking" },
    { src: "/life-mind.png", label: "Mind", desc: "Mood tracking, breathing exercises & recovery coaching" },
    { src: "/life-profile.png", label: "Profile", desc: "XP leveling, achievements & personalized goals" },
];

export default function Projects() {
    const { rotateX, rotateY, handleMouse, reset } = useTilt();
    const [active, setActive] = useState(0);

    const next = () => setActive((p) => (p + 1) % screens.length);
    const prev = () => setActive((p) => (p - 1 + screens.length) % screens.length);

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
                            Project
                        </span>
                    </h2>
                </motion.div>

                {/* Project Card */}
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
                        {/* Background glows */}
                        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/[0.07] blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-3xl" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            {/* Info Side */}
                            <div className="flex-1 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-3 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-300">
                                    <Apple className="h-4 w-4" /> iOS Application
                                </div>

                                <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-[var(--font-display)]">
                                    RevFit
                                </h3>

                                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                                    The ultimate lifestyle companion for peak performance. An all-in-one ecosystem integrating{" "}
                                    <span className="text-cyan-400 font-medium">Health Tracking</span>,{" "}
                                    <span className="text-orange-400 font-medium">Fitness Coaching</span>,{" "}
                                    <span className="text-purple-400 font-medium">Mindfulness</span>, and{" "}
                                    <span className="text-emerald-400 font-medium">Nutrition Management</span>.
                                </p>

                                {/* Feature pills */}
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                    {[
                                        { label: "Activity Tracking", color: "text-orange-300 border-orange-500/20 bg-orange-500/5" },
                                        { label: "Meal Logger", color: "text-emerald-300 border-emerald-500/20 bg-emerald-500/5" },
                                        { label: "Custom Workouts", color: "text-cyan-300 border-cyan-500/20 bg-cyan-500/5" },
                                        { label: "Mood Tracking", color: "text-purple-300 border-purple-500/20 bg-purple-500/5" },
                                        { label: "XP & Leveling", color: "text-yellow-300 border-yellow-500/20 bg-yellow-500/5" },
                                        { label: "Weight Progress", color: "text-rose-300 border-rose-500/20 bg-rose-500/5" },
                                    ].map((f) => (
                                        <span
                                            key={f.label}
                                            className={`rounded-full border px-3 py-1 text-xs font-medium ${f.color}`}
                                        >
                                            {f.label}
                                        </span>
                                    ))}
                                </div>

                                {/* Tech tags */}
                                <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start">
                                    {["Swift", "SwiftUI", "Firebase", "Charts", "HealthKit", "Core Data"].map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-mono text-gray-500"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                                    >
                                        View Case Study <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>

                            {/* Phone Screenshot Carousel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="flex-shrink-0 flex flex-col items-center gap-6"
                            >
                                {/* Phone Frame with Real Screenshot */}
                                <div className="relative w-[280px] h-[570px] rounded-[3rem] border-[6px] border-gray-800 bg-black shadow-2xl shadow-indigo-500/10 overflow-hidden">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />

                                    {/* Screenshot */}
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
                                                src={screens[active].src}
                                                alt={`RevFit ${screens[active].label} screen`}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Screen Info & Controls */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={prev}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <div className="text-center min-w-[160px]">
                                        <p className="text-sm font-semibold text-white">{screens[active].label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{screens[active].desc}</p>
                                    </div>

                                    <button
                                        onClick={next}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Dots */}
                                <div className="flex gap-2">
                                    {screens.map((_, i) => (
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
            </div>
        </section>
    );
}
