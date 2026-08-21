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
  { name: "Next.js", category: "web", color: "#18181b" },
  { name: "React", category: "web", color: "#0891b2" },
  { name: "WebRTC", category: "web", color: "#0284c7" },
  { name: "Tailwind", category: "web", color: "#06B6D4" },
  { name: "Firebase", category: "backend", color: "#d97706" },
  { name: "Node.js", category: "backend", color: "#16a34a" },
  { name: "Python", category: "backend", color: "#2563eb" },
  { name: "PostgreSQL", category: "backend", color: "#4f46e5" },
  { name: "Docker", category: "devops", color: "#0284c7" },
  { name: "AWS", category: "devops", color: "#ea580c" },
  { name: "Git", category: "devops", color: "#dc2626" },
  { name: "Figma", category: "design", color: "#9333ea" },
  { name: "TensorFlow", category: "backend", color: "#d97706" },
];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? stack
      : stack.filter((item) => item.category === activeCategory);

  return (
    <section id="stack" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14 text-center"
        >
          <p className="section-label">Technology</p>
          <h2 className="section-title mx-auto">
            Our{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #4f46e5, #9333ea)",
              }}
            >
              Arsenal
            </span>
          </h2>
          <p className="section-desc mx-auto">
            Battle-tested technologies chosen for reliability, performance, and developer joy.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-black/5"
              }`}
            >
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -3 }}
                className="card-pastel-white group flex flex-col items-center gap-2.5 p-5 rounded-2xl cursor-default"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}40`,
                  }}
                />
                <span
                  className="text-xs sm:text-sm font-bold text-slate-800 text-center"
                >
                  {item.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
