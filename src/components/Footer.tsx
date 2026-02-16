"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Github, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <>
            {/* ——— CTA Section ——— */}
            <section id="contact" className="relative z-10 py-32 px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 sm:p-16 overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-cyan-500/[0.04]" />
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-500/[0.08] blur-[80px]" />

                        <div className="relative z-10">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                                Ready to Build?
                            </p>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6 font-[var(--font-display)]">
                                Let&apos;s Create Something{" "}
                                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                    Extraordinary
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                                Have a project in mind? We&apos;d love to hear about it. Drop us a line and let&apos;s explore what&apos;s possible.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:hello@rivelolabs.com"
                                    className="group inline-flex items-center gap-2 rounded-full bg-indigo-500 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:bg-indigo-400 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Mail className="h-4 w-4" />
                                    hello@rivelolabs.com
                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ——— Footer ——— */}
            <footer className="relative z-10 border-t border-white/[0.04] bg-black/40 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400">
                                <span className="text-xs font-black text-white">R</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-400">
                                rivelo<span className="text-indigo-400">labs</span>
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>India</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                <a href="mailto:hello@rivelolabs.com" className="hover:text-gray-300 transition-colors">hello@rivelolabs.com</a>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Github, href: "#" },
                                { icon: Twitter, href: "#" },
                            ].map(({ icon: I, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-gray-500 transition-all hover:bg-white/[0.08] hover:text-white"
                                >
                                    <I className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
                        <p className="text-xs text-gray-600">
                            © {new Date().getFullYear()} Rivelolabs. Crafted with obsession.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
