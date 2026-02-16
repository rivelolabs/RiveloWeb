"use client";

import { motion } from "framer-motion";
import { Smartphone, Globe, Palette, Zap, Shield, BarChart3 } from "lucide-react";

const services = [
    {
        icon: Smartphone,
        title: "Mobile Apps",
        description: "Native iOS & Android experiences built with SwiftUI and Kotlin — fluid, fast, and pixel‑perfect.",
        gradient: "from-indigo-500 to-blue-500",
        glow: "group-hover:shadow-indigo-500/20",
    },
    {
        icon: Globe,
        title: "Web Platforms",
        description: "Modern web applications powered by Next.js, React, and TypeScript with server-side performance.",
        gradient: "from-cyan-500 to-teal-500",
        glow: "group-hover:shadow-cyan-500/20",
    },
    {
        icon: Palette,
        title: "UI/UX Design",
        description: "Research-driven interfaces that feel intuitive. We design experiences people love to use.",
        gradient: "from-purple-500 to-pink-500",
        glow: "group-hover:shadow-purple-500/20",
    },
    {
        icon: Zap,
        title: "Performance",
        description: "Lightning‑fast load times, silky animations, and optimized bundles. Speed is not optional.",
        gradient: "from-yellow-500 to-orange-500",
        glow: "group-hover:shadow-yellow-500/20",
    },
    {
        icon: Shield,
        title: "Security",
        description: "End-to-end encryption, secure authentication flows, and battle-tested backend infrastructure.",
        gradient: "from-emerald-500 to-green-500",
        glow: "group-hover:shadow-emerald-500/20",
    },
    {
        icon: BarChart3,
        title: "Analytics",
        description: "Data-driven insights baked into every product. Real-time dashboards and actionable metrics.",
        gradient: "from-rose-500 to-red-500",
        glow: "group-hover:shadow-rose-500/20",
    },
];

export default function Services() {
    return (
        <section id="services" className="relative z-10 py-32 px-6">
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
                        What We Do
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-[var(--font-display)]">
                        Engineering{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Excellence
                        </span>
                    </h2>
                    <p className="mt-5 mx-auto max-w-xl text-gray-400 text-lg">
                        From concept to deployment, we handle the entire stack with obsessive attention to craft.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={`group relative rounded-2xl border border-white/[0.04] bg-white/[0.02] p-7 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.08] hover:shadow-2xl ${s.glow}`}
                        >
                            <div
                                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-lg`}
                            >
                                <s.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-400">{s.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
