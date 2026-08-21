"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Github, Twitter, Sparkles, Send } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  onOpenModal: () => void;
}

export default function Footer({ onOpenModal }: FooterProps) {
  return (
    <>
      {/* ——— CTA Section ——— */}
      <section id="contact" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="card relative overflow-hidden p-8 sm:p-14 border border-white/15 bg-[#0e121d]/90 shadow-2xl backdrop-blur-2xl"
          >
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, var(--accent-glow) 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Launch?</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white"
                style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
              >
                Tell us about your project at <br />
                <span className="glow-speed">flash speed.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
                Whether you need a full-stack AI SaaS, a high-performance native iOS/Android app, or custom enterprise architecture, we turn requirements into reality within days.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onOpenModal}
                  className="btn-gradient cursor-pointer text-sm !py-3 !px-7 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Project Scope</span>
                </button>

                <a
                  href="mailto:hello@rivelolabs.com"
                  className="btn-terminal text-sm !py-3 !px-6 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>hello@rivelolabs.com</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer
        className="relative z-10 border-t border-white/10 bg-[#080a10]"
      >
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center p-0.5 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="RIVENO"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span
                className="text-lg font-black tracking-widest text-white uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                RIVENO
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-slate-400 font-mono">
                rivelo<span className="text-indigo-400">labs</span> studio
              </span>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#work" className="hover:text-white transition-colors">Work</a>
              <a href="#stack" className="hover:text-white transition-colors">Stack</a>
              <button onClick={onOpenModal} className="hover:text-indigo-300 text-indigo-400 transition-colors cursor-pointer">
                Submit Project
              </button>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>

            {/* Info & Social */}
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <a
                href="mailto:hello@rivelolabs.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors text-indigo-300"
              >
                <Mail className="h-3.5 w-3.5" />
                hello@rivelolabs.com
              </a>
            </div>
          </div>

          <div
            className="mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 text-[11px] text-slate-400 font-mono"
          >
            <p>
              &copy; {new Date().getFullYear()} Riveno by <strong className="text-slate-300 font-semibold">Calquors Private Limited</strong>. All rights reserved.
            </p>
            <p className="text-slate-400">
              Inquiries dispatched directly to <span className="text-indigo-300">hello@rivelolabs.com</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
