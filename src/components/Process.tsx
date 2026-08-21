"use client";

import { motion } from "framer-motion";
import { Lightbulb, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Discovery & Architecture",
    description:
      "We dig deep into your vision, target users, and technical constraints to map out sub-second scalable systems.",
    accent: "#d97706",
    num: "01",
    cardClass: "card-pastel-white",
  },
  {
    icon: PenTool,
    title: "High-Fidelity Design",
    description:
      "Wireframes evolve into pixel-perfect interfaces designed for high conversion, fluidity, and intuitive ease.",
    accent: "#7c3aed",
    num: "02",
    cardClass: "card-pastel-blue",
  },
  {
    icon: Code2,
    title: "Sprint Development",
    description:
      "Clean TypeScript & native architecture with automated CI/CD. Continuous deployments to staging at flash speed.",
    accent: "#0891b2",
    num: "03",
    cardClass: "card-pastel-white",
  },
  {
    icon: Rocket,
    title: "Production Launch",
    description:
      "Zero-downtime deployment, automated monitoring, SLA scaling, and full IP handover with ongoing engineering support.",
    accent: "#059669",
    num: "04",
    cardClass: "card-pastel-green",
  },
];

export default function Process() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14 text-center"
        >
          <p className="section-label">How We Work</p>
          <h2 className="section-title mx-auto">
            From Idea to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #0891b2, #059669)",
              }}
            >
              Reality
            </span>
          </h2>
          <p className="section-desc mx-auto">
            A proven sprint workflow that transforms ambitious concepts into market-dominating software.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`${step.cardClass} group relative p-6 sm:p-7 rounded-2xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-xs"
                    style={{
                      backgroundColor: `${step.accent}15`,
                      color: step.accent,
                    }}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className="text-xs font-mono font-bold text-slate-600 px-2 py-0.5 rounded-md bg-black/5"
                  >
                    STEP {step.num}
                  </span>
                </div>

                <h3
                  className="mb-2 text-base font-bold text-slate-900"
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed text-slate-600"
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
