"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

const words = "We Build What's Next".split(" ");

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-20"
    >
      <motion.div
        style={{ opacity, y }}
        className="flex flex-col items-center gap-6 text-center max-w-5xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="badge"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </span>
          Next-Gen Digital Studio
        </motion.div>

        {/* Main Title */}
        <h1
          className="max-w-5xl leading-[1.05] tracking-tight"
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            color: "var(--text)",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.3 + i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-[0.22em]"
            >
              {word === "Next" ? (
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--accent), #06b6d4, #8b5cf6)",
                  }}
                >
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-2xl text-lg sm:text-xl leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          A next-generation tech studio that designs and engineers premium
          mobile and web applications — from{" "}
          <span style={{ color: "var(--text-secondary)" }}>concept</span> to{" "}
          <span style={{ color: "var(--text-secondary)" }}>launch</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <a href="#work" className="btn-primary group">
            Explore Our Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a href="#contact" className="btn-secondary">
            Get in Touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
