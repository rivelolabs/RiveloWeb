"use client";

import { motion } from "framer-motion";
import { Lightbulb, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Discovery",
    description:
      "We dig deep into your vision, goals, and users. Research-driven strategy ensures we build the right thing.",
    accent: "#f59e0b",
    num: "01",
  },
  {
    icon: PenTool,
    title: "Design",
    description:
      "Wireframes evolve into polished interfaces. Every pixel serves a purpose — beauty meets usability.",
    accent: "#8b5cf6",
    num: "02",
  },
  {
    icon: Code2,
    title: "Develop",
    description:
      "Clean architecture, tested code, and iterative builds. We ship incrementally so you see progress early.",
    accent: "#06b6d4",
    num: "03",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Deployment, monitoring, and optimization. We stay with you post-launch to ensure everything runs flawlessly.",
    accent: "#10b981",
    num: "04",
  },
];

export default function Process() {
  return (
    <section className="relative z-10 py-28 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <p className="section-label">How We Work</p>
          <h2 className="section-title mx-auto">
            From Idea to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #06b6d4, #10b981)",
              }}
            >
              Reality
            </span>
          </h2>
          <p className="section-desc mx-auto">
            A proven process that transforms ambitious ideas into products
            people love.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connector line — desktop */}
          <div
            className="absolute top-14 left-[12.5%] right-[12.5%] h-px hidden lg:block"
            style={{ backgroundColor: "var(--border)" }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Step number watermark */}
              <div
                className="absolute -top-2 right-4 text-7xl font-bold select-none leading-none opacity-[0.04]"
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  color: "var(--text)",
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                className="relative z-10 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: `${step.accent}15`,
                  color: step.accent,
                }}
              >
                <step.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3
                className="mb-2 text-base font-semibold"
                style={{ color: "var(--text)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
