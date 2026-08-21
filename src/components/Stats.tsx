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
  { value: 100, suffix: "K+", label: "Requests Handled (omeglevc.com)", cardStyle: "card-pastel-blue" },
  { value: 20, suffix: "K+", label: "Monthly Active Visitors", cardStyle: "card-pastel-white" },
  { value: 4, suffix: "+", label: "Shipped Production Systems", cardStyle: "card-pastel-green" },
  { value: 99, suffix: ".9%", label: "Uptime & High Availability", cardStyle: "card-pastel-white" },
];

export default function Stats() {
  return (
    <section className="relative z-10 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`${stat.cardStyle} p-6 sm:p-7 text-center rounded-2xl flex flex-col items-center justify-center`}
            >
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900"
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                }}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
