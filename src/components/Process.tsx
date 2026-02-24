"use client";

import { motion } from "framer-motion";
import { Lightbulb, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Discovery",
    description: "We dig deep into your vision, goals, and users. Research-driven strategy ensures we build the right thing.",
    color: "from-amber-500 to-orange-500",
    glowColor: "amber",
  },
  {
    icon: PenTool,
    title: "Design",
    description: "Wireframes evolve into polished interfaces. Every pixel serves a purpose — beauty meets usability.",
    color: "from-purple-500 to-pink-500",
    glowColor: "purple",
  },
  {
    icon: Code2,
    title: "Develop",
    description: "Clean architecture, tested code, and iterative builds. We ship incrementally so you see progress early.",
    color: "from-cyan-500 to-blue-500",
    glowColor: "cyan",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Deployment, monitoring, and optimization. We stay with you post-launch to ensure everything runs flawlessly.",
    color: "from-emerald-500 to-teal-500",
    glowColor: "emerald",
  },
];

export default function Process() {
  return (
    <section className="relative z-10 py-32 px-6">
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
            How We Work
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-[var(--font-display)]">
            From Idea to{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Reality
            </span>
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-gray-400 text-lg">
            A proven process that transforms ambitious ideas into products people love.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Connector line — desktop only */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent hidden lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Step number */}
              <div className="absolute -top-3 right-4 text-[80px] font-bold text-white/[0.02] font-[var(--font-display)] select-none leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div
                className={`relative z-10 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <step.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400 max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
