"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, motionValue, target]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 10, suffix: "K+", label: "Lines of Code", color: "from-indigo-400 to-blue-400" },
  { value: 3, suffix: "+", label: "Products Shipped", color: "from-cyan-400 to-teal-400" },
  { value: 99, suffix: "%", label: "Uptime SLA", color: "from-purple-400 to-pink-400" },
  { value: 5, suffix: "★", label: "App Store Rating", color: "from-amber-400 to-orange-400" },
];

export default function Stats() {
  return (
    <section className="relative z-10 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 sm:p-8 text-center transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.08]"
            >
              <div
                className={`text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-[var(--font-display)]`}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-gray-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
