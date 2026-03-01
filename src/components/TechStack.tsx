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
  { name: "Next.js", category: "web", color: "#888888" },
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
    <section id="stack" className="relative z-10 py-28 px-6">
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
                backgroundImage: "linear-gradient(135deg, var(--accent), #8b5cf6)",
              }}
            >
              Arsenal
            </span>
          </h2>
          <p className="section-desc mx-auto">
            Battle-tested technologies chosen for reliability, performance, and
            developer joy.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                color: activeCategory === cat.key ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
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
                className="card group flex flex-col items-center gap-3 p-5 cursor-default"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 12px ${item.color}30`,
                  }}
                />
                <span
                  className="text-sm font-medium text-center transition-colors"
                  style={{ color: "var(--text-secondary)" }}
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
