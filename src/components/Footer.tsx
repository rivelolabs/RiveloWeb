"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Sparkles, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  onOpenModal: () => void;
}

export default function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="relative z-10 bg-[#080b12] text-white overflow-hidden mt-16">
      {/* ——— Top Scenic Landscape Banner (Unzoomed, Natural Aspect Ratio) ——— */}
      <div className="relative w-full aspect-[16/9] max-h-[580px] overflow-hidden">
        {/* Landscape Image */}
        <Image
          src="/about.png"
          alt="rivelolabs by Calquors Private Limited"
          fill
          priority
          sizes="100vw"
          className="object-contain sm:object-cover object-top"
        />

        {/* Smooth Gradient Overlay Fading into Dark Footer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8, 11, 18, 0) 0%, rgba(8, 11, 18, 0) 35%, rgba(8, 11, 18, 0.5) 70%, #080b12 100%)",
          }}
        />
      </div>

      {/* ——— Main Portside-Style Footer Content ——— */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 pt-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Brand Logo & Big Bold Statement */}
          <div className="lg:col-span-6 space-y-6">
            {/* Logo Badge */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center p-1 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="rivelolabs"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <span
                className="text-2xl font-black tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                rivelo<span className="text-indigo-400">labs</span>
              </span>
            </div>

            {/* Big Headline (Portside typography) */}
            <h3
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white leading-[1.12]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your systems keep scaling. <br />
              Now you can ship the whole vision at flash speed.
            </h3>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenModal}
                className="btn-gradient cursor-pointer text-xs sm:text-sm !py-2.5 !px-6 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tell Us Your Project</span>
              </button>

              <a
                href="mailto:hello@rivelolabs.com"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>hello@rivelolabs.com</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Right Columns: Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left pt-2">
            {/* Column 1: Capabilities */}
            <div className="space-y-3">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Capabilities
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    AI &amp; Web Apps
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-white transition-colors">
                    WebRTC Platforms
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Native iOS &amp; Android
                  </a>
                </li>
                <li>
                  <a href="#stack" className="hover:text-white transition-colors">
                    Tech Arsenal
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Featured Work */}
            <div className="space-y-3">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Showcase
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <a
                    href="https://omeglevc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>OmegleVC</span>
                    <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-white transition-colors">
                    RevFit iOS
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-white transition-colors">
                    Calarm App
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-white transition-colors">
                    Klyq Arena
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Studio & Legal */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Studio
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li>
                  <button
                    onClick={onOpenModal}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors text-left cursor-pointer"
                  >
                    Submit Specs ↗
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ &amp; Terms
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li className="text-[11px] text-slate-400 pt-1 font-mono">
                  Calquors Pvt Ltd
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ——— Bottom Copyright Line ——— */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-slate-200">rivelolabs</strong> by <strong className="text-slate-200">Calquors Private Limited</strong>. All rights reserved.
          </p>
          <p>
            Dispatched directly to <span className="text-indigo-400 font-semibold">hello@rivelolabs.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
