"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

interface NavbarProps {
  onOpenModal: () => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#f8f7f4]/90 backdrop-blur-xl border-b border-black/8 py-3 shadow-xs"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <a href="#" aria-label="rivelolabs Home" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-black/10 flex items-center justify-center p-1 shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="rivelolabs Logo"
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
                priority
              />
            </div>
            <span
              className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
            >
              rivelo<span className="text-indigo-500 font-extrabold">labs</span>
            </span>
          </a>
        </div>

        {/* Center Pill: Feature Highlights (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center">
          <div className="glass-pill text-[11px] sm:text-xs py-1.5 px-3.5 border-black/10 bg-white/80 shadow-xs">
            <span className="text-indigo-600 font-semibold">
              Autonomous AI &amp; Product Engineering
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-normal">
              Grounded in High Performance &amp; Clean Code
            </span>
          </div>
        </div>

        {/* Right: Mail / Contact & Launch Button */}
        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="mailto:hello@rivelolabs.com"
            aria-label="Email hello@rivelolabs.com"
            className={`hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors ${
              scrolled ? "text-slate-600 hover:text-slate-950" : "text-slate-200 hover:text-white"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>hello@rivelolabs.com</span>
          </a>

          <button
            onClick={onOpenModal}
            aria-label="Launch Project Brief"
            className="btn-launch text-xs sm:text-sm font-semibold !py-1.5 sm:!py-2 !px-4 sm:!px-5 cursor-pointer"
          >
            <span>Launch Project</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
