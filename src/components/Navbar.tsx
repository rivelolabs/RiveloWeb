"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "py-3 bg-black/60 backdrop-blur-2xl border-b border-white/[0.04]"
                    : "py-5 bg-transparent"
                }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
                        <span className="text-sm font-black text-white tracking-tight">R</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white font-[var(--font-display)]">
                        rivelo<span className="text-indigo-400">labs</span>
                    </span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            className="relative px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white group"
                        >
                            {l.label}
                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-indigo-500 transition-all duration-300 group-hover:w-4/5 rounded-full" />
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="ml-4 rounded-full bg-white/[0.06] border border-white/[0.08] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/[0.12] hover:border-white/[0.15] hover:shadow-lg hover:shadow-indigo-500/10"
                    >
                        Let&apos;s Talk
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    aria-label="Menu"
                >
                    <motion.span
                        animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="block h-0.5 w-6 bg-white rounded-full"
                    />
                    <motion.span
                        animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="block h-0.5 w-6 bg-white rounded-full"
                    />
                    <motion.span
                        animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="block h-0.5 w-6 bg-white rounded-full"
                    />
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-2xl border-t border-white/[0.04]"
                    >
                        <div className="flex flex-col gap-1 px-6 py-4">
                            {links.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
