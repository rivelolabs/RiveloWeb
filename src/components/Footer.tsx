"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Sparkles, Send } from "lucide-react";
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
            className="card-pastel-white relative overflow-hidden p-8 sm:p-14 rounded-3xl border border-black/10 bg-white shadow-xl"
          >
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, rgba(79, 70, 229, 0.06) 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Launch?</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900"
                style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
              >
                Tell us about your project at <br />
                <span className="glow-speed">flash speed.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
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
                  className="btn-terminal text-sm !py-3 !px-6 flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-indigo-600" />
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
        className="relative z-10 border-t border-black/8 bg-[#f1efe9]"
      >
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white border border-black/10 flex items-center justify-center p-0.5 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="rivelolabs"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span
                className="text-lg font-black tracking-tight text-slate-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                rivelo<span className="text-indigo-600">labs</span>
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-xs text-slate-600 font-mono">
                studio
              </span>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <a href="#services" className="hover:text-slate-950 transition-colors">Services</a>
              <a href="#work" className="hover:text-slate-950 transition-colors">Work</a>
              <a href="#stack" className="hover:text-slate-950 transition-colors">Stack</a>
              <button onClick={onOpenModal} className="hover:text-indigo-800 text-indigo-600 transition-colors cursor-pointer">
                Submit Project
              </button>
              <Link href="/privacy" className="hover:text-slate-950 transition-colors">Privacy</Link>
            </div>

            {/* Info & Social */}
            <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
              <a
                href="mailto:hello@rivelolabs.com"
                className="flex items-center gap-1.5 hover:text-slate-950 transition-colors text-indigo-600 font-semibold"
              >
                <Mail className="h-3.5 w-3.5" />
                hello@rivelolabs.com
              </a>
            </div>
          </div>

          <div
            className="mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/6 text-[11px] text-slate-600 font-mono"
          >
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-slate-800 font-semibold">rivelolabs</strong> by <strong className="text-slate-800 font-semibold">Calquors Private Limited</strong>. All rights reserved.
            </p>
            <p className="text-slate-600">
              Inquiries dispatched directly to <span className="text-indigo-600 font-semibold">hello@rivelolabs.com</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
