"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const categories = [
  { key: "all", label: "All" },
  { key: "mobile", label: "Mobile" },
  { key: "web", label: "Web" },
  { key: "backend", label: "Backend" },
  { key: "devops", label: "DevOps" },
  { key: "design", label: "Design" },
];

const stack = [
  { name: "Swift", category: "mobile", color: "#F05138" },
  { name: "SwiftUI", category: "mobile", color: "#007AFF" },
  { name: "Kotlin", category: "mobile", color: "#7F52FF" },
  { name: "TypeScript", category: "web", color: "#3178C6" },
  { name: "Next.js", category: "web", color: "#ffffff" },
  { name: "React", category: "web", color: "#61DAFB" },
  { name: "Three.js", category: "web", color: "#049EF4" },
  { name: "Tailwind", category: "web", color: "#06B6D4" },
  { name: "Firebase", category: "backend", color: "#FFCA28" },
  { name: "Node.js", category: "backend", color: "#339933" },
  { name: "Python", category: "backend", color: "#3776AB" },
  { name: "PostgreSQL", category: "backend", color: "#4169E1" },
  { name: "Docker", category: "devops", color: "#2496ED" },
  { name: "AWS", category: "devops", color: "#FF9900" },
  { name: "Git", category: "devops", color: "#F05032" },
  { name: "Figma", category: "design", color: "#F24E1E" },
  { name: "TensorFlow", category: "backend", color: "#FF6F00" },
];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? stack
      : stack.filter((item) => item.category === activeCategory);

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

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Animated Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1] cursor-default"
              >
                <div
                  className="h-3 w-3 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}40` }}
                />
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors text-center">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Animated gradient line separator */}
        <div className="mt-20 animated-gradient-line" />
      </div>
    </section>
  );
}
