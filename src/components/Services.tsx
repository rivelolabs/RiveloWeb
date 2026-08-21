"use client";

import { motion } from "framer-motion";
import { Smartphone, Globe, Palette, Zap, Shield, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native iOS & Android experiences built with SwiftUI and Kotlin — fluid, fast, and pixel-perfect.",
    accent: "#4f46e5",
    cardClass: "card-pastel-blue",
  },
  {
    icon: Globe,
    title: "Web Platforms",
    description:
      "Modern web applications powered by Next.js, React, and TypeScript with server-side performance.",
    accent: "#0891b2",
    cardClass: "card-pastel-white",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Research-driven interfaces that feel intuitive. We design experiences people love to use.",
    accent: "#7c3aed",
    cardClass: "card-pastel-green",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Lightning-fast load times, silky animations, and optimized bundles. Speed is not optional.",
    accent: "#d97706",
    cardClass: "card-pastel-white",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "End-to-end encryption, secure authentication flows, and battle-tested backend infrastructure.",
    accent: "#059669",
    cardClass: "card-pastel-green",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Data-driven insights baked into every product. Real-time dashboards and actionable metrics.",
    accent: "#dc2626",
    cardClass: "card-pastel-blue",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative z-10 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14 text-center"
        >
          <p className="section-label">What We Do</p>
          <h2 className="section-title mx-auto">
            Engineering{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #4f46e5, #0891b2)",
              }}
            >
              Excellence
            </span>
          </h2>
          <p className="section-desc mx-auto">
            From concept to deployment, we handle the entire stack with
            obsessive attention to craft.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`${s.cardClass} p-6 sm:p-7 rounded-2xl flex flex-col justify-between`}
            >
              <div>
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-xs"
                  style={{
                    backgroundColor: `${s.accent}15`,
                    color: s.accent,
                  }}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <h3
                  className="mb-2 text-lg font-bold tracking-tight text-slate-900"
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-slate-600"
                >
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
