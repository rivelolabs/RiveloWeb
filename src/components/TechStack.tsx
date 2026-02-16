"use client";

import { motion } from "framer-motion";

const stack = [
    { name: "Swift", icon: "🍎", category: "Mobile" },
    { name: "SwiftUI", icon: "📱", category: "Mobile" },
    { name: "Kotlin", icon: "🤖", category: "Mobile" },
    { name: "TypeScript", icon: "🔷", category: "Web" },
    { name: "Next.js", icon: "▲", category: "Web" },
    { name: "React", icon: "⚛️", category: "Web" },
    { name: "Three.js", icon: "🎮", category: "Web" },
    { name: "Firebase", icon: "🔥", category: "Backend" },
    { name: "Node.js", icon: "🟢", category: "Backend" },
    { name: "Python", icon: "🐍", category: "Backend" },
    { name: "PostgreSQL", icon: "🐘", category: "Backend" },
    { name: "Figma", icon: "🎨", category: "Design" },
    { name: "Docker", icon: "🐳", category: "DevOps" },
    { name: "AWS", icon: "☁️", category: "DevOps" },
    { name: "Git", icon: "📦", category: "DevOps" },
    { name: "TensorFlow", icon: "🧠", category: "AI" },
];

export default function TechStack() {
    return (
        <section id="stack" className="relative z-10 py-32 px-6">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-16 text-center"
                >
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                        Technology
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-[var(--font-display)]">
                        Our{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Arsenal
                        </span>
                    </h2>
                    <p className="mt-5 mx-auto max-w-xl text-gray-400 text-lg">
                        Battle-tested technologies chosen for reliability, performance, and developer joy.
                    </p>
                </motion.div>

                {/* Animated Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {stack.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04, duration: 0.4 }}
                            viewport={{ once: true, margin: "-30px" }}
                            whileHover={{ scale: 1.1, y: -4 }}
                            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1] cursor-default"
                        >
                            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors text-center">
                                {item.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Animated gradient line separator */}
                <div className="mt-20 animated-gradient-line" />
            </div>
        </section>
    );
}
