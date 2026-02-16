"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

const words = "We Build What's Next".split(" ");

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

    return (
        <section
            ref={ref}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20"
        >
            <motion.div
                style={{ opacity, y }}
                className="flex flex-col items-center gap-8 text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-1.5 text-sm font-medium text-indigo-300"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                    </span>
                    Crafting Next-Gen Digital Experiences
                </motion.div>

                {/* Main Title — word-by-word reveal */}
                <h1 className="max-w-5xl text-6xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl font-[var(--font-display)]">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                                delay: 0.3 + i * 0.12,
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="inline-block mr-[0.25em]"
                        >
                            {word === "Next" ? (
                                <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="max-w-2xl text-lg text-gray-400 sm:text-xl leading-relaxed"
                >
                    Rivelolabs is a next-generation tech studio that designs and engineers
                    premium mobile and web applications — from{" "}
                    <span className="text-gray-200">concept</span> to{" "}
                    <span className="text-gray-200">launch</span>.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                    <a
                        href="#work"
                        className="group inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:bg-indigo-400 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Explore Our Work
                        <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    </a>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-gray-300 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:text-white hover:border-white/20"
                    >
                        Get in Touch
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-600"
            >
                <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown className="h-4 w-4" />
                </motion.div>
            </motion.div>
        </section>
    );
}
