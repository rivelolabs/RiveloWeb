"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Cpu,
  Layers,
  BarChart3,
  Send,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Download,
  Smartphone,
  Globe,
  FileCode,
  CheckCircle2,
  Mail,
} from "lucide-react";

interface HeroProps {
  onOpenModal: () => void;
}

const heroCurrencyData: Record<string, { label: string; symbol: string; options: string[] }> = {
  USD: {
    label: "USD ($)",
    symbol: "$",
    options: ["< $5,000", "$5,000 - $15,000", "$15,000 - $40,000", "$40,000+", "Custom Amount"],
  },
  INR: {
    label: "INR (₹)",
    symbol: "₹",
    options: ["< ₹2,00,000", "₹2,00,000 - ₹5,00,000", "₹5,00,000 - ₹15,00,000", "₹15,00,000+", "Custom Amount"],
  },
  EUR: {
    label: "EUR (€)",
    symbol: "€",
    options: ["< €4,500", "€4,500 - €14,000", "€14,000 - €35,000", "€35,000+", "Custom Amount"],
  },
  GBP: {
    label: "GBP (£)",
    symbol: "£",
    options: ["< £4,000", "£4,000 - £12,000", "£12,000 - £30,000", "£30,000+", "Custom Amount"],
  },
  AED: {
    label: "AED (د.إ)",
    symbol: "AED",
    options: ["< 15,000 AED", "15,000 - 50,000 AED", "50,000 - 150,000 AED", "150,000+ AED", "Custom Amount"],
  },
  CAD: {
    label: "CAD (CA$)",
    symbol: "CA$",
    options: ["< CA$6,500", "CA$6,500 - CA$20,000", "CA$20,000 - CA$50,000", "CA$50,000+", "Custom Amount"],
  },
  AUD: {
    label: "AUD (AU$)",
    symbol: "AU$",
    options: ["< AU$7,000", "AU$7,000 - AU$22,000", "AU$22,000 - AU$55,000", "AU$55,000+", "Custom Amount"],
  },
  SGD: {
    label: "SGD (S$)",
    symbol: "S$",
    options: ["< S$6,500", "S$6,500 - S$20,000", "S$20,000 - S$50,000", "S$50,000+", "Custom Amount"],
  },
};

export default function Hero({ onOpenModal }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"inquiry" | "compare" | "matrix">("inquiry");

  // 5-second looping auto-rotation across the 3 tabs
  useEffect(() => {
    const tabList: Array<"inquiry" | "compare" | "matrix"> = ["inquiry", "compare", "matrix"];
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabList.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabList.length;
        return tabList[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Interactive In-Card Project Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("$5,000 - $15,000");
  const [customBudget, setCustomBudget] = useState("");
  const [projectType, setProjectType] = useState("AI Web Platform");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Auto-detect currency from timezone
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (timeZone.includes("Calcutta") || timeZone.includes("Kolkata") || timeZone.includes("India")) {
        setCurrency("INR");
        setBudget("₹2,00,000 - ₹5,00,000");
      } else if (timeZone.includes("London")) {
        setCurrency("GBP");
        setBudget("£4,000 - £12,000");
      } else if (timeZone.includes("Paris") || timeZone.includes("Berlin") || timeZone.includes("Europe")) {
        setCurrency("EUR");
        setBudget("€4,500 - €14,000");
      } else if (timeZone.includes("Dubai")) {
        setCurrency("AED");
        setBudget("15,000 - 50,000 AED");
      }
    } catch {
      // fallback USD
    }
  }, []);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (budget !== "Custom Amount") {
      const options = heroCurrencyData[newCurrency]?.options || heroCurrencyData.USD.options;
      setBudget(options[1]);
    }
  };

  // Keyboard shortcut Ctrl + ~ to open modal/form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        onOpenModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenModal]);

  const effectiveBudget =
    budget === "Custom Amount"
      ? `${heroCurrencyData[currency]?.symbol || ""} ${customBudget || "Custom"} (${currency})`
      : `${budget} (${currency})`;

  // Handle in-card submission
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !details) return;

    setSending(true);
    try {
      const res = await fetch("/api/send-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          projectType,
          budget: effectiveBudget,
          description: details,
        }),
      });
      const data = await res.json();
      setSentSuccess(true);
      if (data?.mailtoUrl) {
        window.location.href = data.mailtoUrl;
      }
    } catch (err) {
      console.error(err);
      const subject = encodeURIComponent(`Project Brief: ${projectType} from ${clientName || "Client"}`);
      const bodyText = encodeURIComponent(
        `Hi Rivelo Labs,\n\nName: ${clientName}\nEmail: ${clientEmail}\nPhone: ${clientPhone || "N/A"}\nType: ${projectType}\nBudget: ${effectiveBudget}\n\nProject Scope:\n${details}`
      );
      window.location.href = `mailto:hello@rivelolabs.com?subject=${subject}&body=${bodyText}`;
      setSentSuccess(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="hero-cloud-wrapper flex flex-col items-center pt-28 sm:pt-36 pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Atmosphere gradient overlay */}
      <div className="hero-cloud-overlay" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Sub-banner Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 text-xs py-2 px-4.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/20 text-slate-100 shadow-xl hover:bg-black hover:border-white/40 transition-all cursor-pointer group"
          >
            <span className="text-slate-200 font-normal">
              Now live: <strong className="text-white font-semibold">AI Project Scoper &amp; Instant Inquiry Dispatch</strong>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-cyan-300 font-bold flex items-center gap-1 group-hover:text-cyan-200">
              hello@rivelolabs.com <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </motion.div>

        {/* Hero Title (Matching the exact styling from screenshot) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] mb-6"
          style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
        >
          AI &amp; Software Engineering <br />
          at flash <span className="glow-speed">speed.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl font-normal leading-relaxed mb-8 drop-shadow-sm"
        >
          Sub-second AI architectures, high-performance web &amp; mobile systems, and custom enterprise software. Tell us about your project, delivered with zero hallucinations and verified code.
        </motion.p>

        {/* Hero Actions (Primary Gradient CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={onOpenModal}
            className="btn-gradient cursor-pointer text-sm sm:text-base"
          >
            
            <span>Tell Us Your Project (Instant Send)</span>
          </button>
        </motion.div>

        {/* Tab Pills (Matching screenshot tabs, auto-rotating 5s) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 mb-8 max-w-2xl shadow-xl"
        >
          <button
            onClick={() => setActiveTab("inquiry")}
            className={`relative px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === "inquiry"
                ? "bg-white text-slate-950 shadow-md font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTab === "inquiry" && (
              <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
            Tell Us Your Project
          </button>

          <button
            onClick={() => setActiveTab("compare")}
            className={`relative px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === "compare"
                ? "bg-white text-slate-950 shadow-md font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTab === "compare" && (
              <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
            AI &amp; Mobile Benchmark
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`relative px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === "matrix"
                ? "bg-white text-slate-950 shadow-md font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTab === "matrix" && (
              <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
            Cost &amp; Timeline Matrix
          </button>
        </motion.div>

        {/* ——— Bottom Card (Matching the Multi-Tenant Workspace Card from Screenshot) ——— */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full rounded-2xl border border-white/15 bg-[#0b0f19]/90 backdrop-blur-2xl shadow-2xl overflow-hidden text-left"
        >
          {/* Card Topbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-3.5 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center p-0.5 shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="rivelolabs"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="font-bold tracking-tight text-sm sm:text-base text-white" style={{ fontFamily: "var(--font-display)" }}>
                  rivelo<span className="text-indigo-400">labs</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className={activeTab === "inquiry" ? "text-white font-semibold" : "hover:text-slate-300 cursor-pointer"} onClick={() => setActiveTab("inquiry")}>Project Dispatch</span>
                <span className={activeTab === "compare" ? "text-white font-semibold" : "hover:text-slate-300 cursor-pointer"} onClick={() => setActiveTab("compare")}>Benchmarking</span>
                <span className={activeTab === "matrix" ? "text-white font-semibold" : "hover:text-slate-300 cursor-pointer"} onClick={() => setActiveTab("matrix")}>Scope Matrix</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">WORKSPACE STATUS:</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active: Ready for Projects
                </span>
              </div>

              <button
                onClick={onOpenModal}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Brief</span>
                <div className="w-2 h-2 rounded-full bg-emerald-300" />
              </button>
            </div>
          </div>

          {/* Card Sub-header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-2 border-b border-white/5 bg-slate-950/40 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2 truncate">
              <span>Audited Code &amp; Architecture</span>
              <span>•</span>
              <span className="text-indigo-300">Auto-rotating (5s)</span>
              <span>•</span>
              <span className="text-slate-400">hello@rivelolabs.com</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Live Ingestion Active</span>
            </div>
          </div>

          {/* Card Dynamic Body */}
          <div className="p-5 sm:p-7">
            <AnimatePresence mode="wait">
              {activeTab === "inquiry" && (
                <motion.div
                  key="inquiry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left explanation */}
                    <div className="lg:w-5/12 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            DIRECT INQUIRY
                          </span>
                          <span className="text-xs text-slate-400">Target: hello@rivelolabs.com</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                          Tell Us Your Project Vision
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                          Share your requirements, ideas, or architectural needs. Our engineering team will review your specs and craft a production-ready roadmap.
                        </p>

                        <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Direct response from senior engineering leads</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>NDA &amp; strict IP protection by default</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Full-stack web, mobile (Swift/Kotlin), &amp; AI architectures</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span>Prefer direct email?</span>
                        <a
                          href="mailto:hello@rivelolabs.com"
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          hello@rivelolabs.com
                        </a>
                      </div>
                    </div>

                    {/* Right Form */}
                    <div className="lg:w-7/12 rounded-xl bg-black/40 border border-white/10 p-5">
                      {!sentSuccess ? (
                        <form onSubmit={handleCardSubmit} className="space-y-3.5 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block font-medium text-slate-300 mb-1">
                                Your Name / Org
                              </label>
                              <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Jordan Lee"
                                className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-slate-300 mb-1">
                                Email Address <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                placeholder="jordan@venture.com"
                                className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-slate-300 mb-1">
                                Mobile / WhatsApp
                              </label>
                              <input
                                type="tel"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-medium text-slate-300 mb-1">
                                Project Type
                              </label>
                              <select
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                              >
                                <option value="AI Web Platform">AI Web Platform / SaaS</option>
                                <option value="iOS Native App">iOS Native App (Swift/SwiftUI)</option>
                                <option value="Android / Cross-Platform">Cross-Platform Mobile</option>
                                <option value="Custom AI Agent System">Autonomous AI Agent System</option>
                                <option value="Enterprise Architecture">Enterprise Cloud Architecture</option>
                              </select>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block font-medium text-slate-300">
                                  Estimated Budget
                                </label>
                                <select
                                  value={currency}
                                  onChange={(e) => handleCurrencyChange(e.target.value)}
                                  className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded px-1.5 py-0.5 focus:outline-none"
                                >
                                  {Object.keys(heroCurrencyData).map((cur) => (
                                    <option key={cur} value={cur} className="bg-[#0b0f19] text-white">
                                      {heroCurrencyData[cur].label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <select
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                              >
                                {(heroCurrencyData[currency]?.options || heroCurrencyData.USD.options).map((b) => (
                                  <option key={b} value={b} className="bg-[#0b0f19] text-white">
                                    {b === "Custom Amount" ? " Custom Amount (Type exact value)" : b}
                                  </option>
                                ))}
                              </select>

                              {budget === "Custom Amount" && (
                                <div className="mt-2 relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-400">
                                    {heroCurrencyData[currency]?.symbol || "$"}
                                  </span>
                                  <input
                                    type="text"
                                    value={customBudget}
                                    onChange={(e) => setCustomBudget(e.target.value)}
                                    placeholder={`Enter custom amount e.g. ${currency === "INR" ? "3,50,000" : "12,500"}`}
                                    className="w-full rounded-lg border border-indigo-500/50 bg-indigo-950/30 pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none text-xs"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block font-medium text-slate-300 mb-1">
                              Tell us what you want to build <span className="text-red-400">*</span>
                            </label>
                            <textarea
                              required
                              rows={3}
                              value={details}
                              onChange={(e) => setDetails(e.target.value)}
                              placeholder="Describe the problem, target audience, core features, or reference products you admire..."
                              className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none text-xs"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-400">
                              Sends to <strong className="text-slate-300">hello@rivelolabs.com</strong>
                            </span>
                            <button
                              type="submit"
                              disabled={sending}
                              className="btn-gradient !py-2 !px-4 text-xs flex items-center gap-1.5"
                            >
                              {sending ? (
                                <span>Sending...</span>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Submit Project Brief</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="py-6 text-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h4 className="text-base font-bold text-white mb-1">Project Brief Sent Successfully!</h4>
                          <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4">
                            Dispatched to <strong>hello@rivelolabs.com</strong>. We will review your requirements and follow up within 24 hours.
                          </p>
                          <button
                            onClick={() => {
                              setSentSuccess(false);
                              setDetails("");
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                          >
                            Submit another brief
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "compare" && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        MULTI-SYSTEM BENCHMARKING
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                        Comparative Engineering &amp; Delivery Matrix
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenModal}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        <span>CSV Export</span>
                      </button>
                      <span className="px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
                        MULTI-STACK
                      </span>
                    </div>
                  </div>

                  {/* Benchmark Matrix Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                          <th className="pb-2.5 font-medium">CAPABILITY / METRIC</th>
                          <th className="pb-2.5 font-medium text-indigo-400">RIVELOLABS STUDIO</th>
                          <th className="pb-2.5 font-medium text-slate-400">TRADITIONAL AGENCY</th>
                          <th className="pb-2.5 font-medium text-slate-400">IN-HOUSE HIRING</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        <tr>
                          <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            Time to MVP Launch
                          </td>
                          <td className="py-2.5 text-emerald-400 font-semibold font-mono">1 - 3 Weeks (Flash Speed)</td>
                          <td className="py-2.5 text-slate-400 font-mono">3 - 6 Months</td>
                          <td className="py-2.5 text-slate-400 font-mono">4 - 8 Months</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                            AI &amp; Autonomous Tech
                          </td>
                          <td className="py-2.5 text-emerald-400 font-semibold font-mono">Native Agentic &amp; SEC Grounded</td>
                          <td className="py-2.5 text-slate-400 font-mono">Basic Wrappers</td>
                          <td className="py-2.5 text-slate-400 font-mono">Requires Specialized R&amp;D</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                            Mobile &amp; Web Polish
                          </td>
                          <td className="py-2.5 text-emerald-400 font-semibold font-mono">SwiftUI / Apple HIG / React 19</td>
                          <td className="py-2.5 text-slate-400 font-mono">Hybrid / Generic</td>
                          <td className="py-2.5 text-slate-400 font-mono">Varies by hire</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                            Code Ownership &amp; IP
                          </td>
                          <td className="py-2.5 text-emerald-400 font-semibold font-mono">100% Client Owned (Zero Lock-in)</td>
                          <td className="py-2.5 text-slate-400 font-mono">Often Proprietary</td>
                          <td className="py-2.5 text-emerald-400 font-mono">100% Owned</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Ready to test our turnaround?</span>
                    <button
                      onClick={onOpenModal}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Start Project with rivelolabs →
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "matrix" && (
                <motion.div
                  key="matrix"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        REAL-TIME ESTIMATOR
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                        Scope &amp; Architecture Matrix
                      </h3>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono">Instant Calculation</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="text-slate-400 font-mono text-[10px] uppercase mb-1">Tier 1</div>
                        <h4 className="text-base font-bold text-white mb-2">Rapid MVP / AI Tool</h4>
                        <p className="text-slate-300 text-xs mb-3">Complete prototype, clean UI, database, authentication, and core workflow.</p>
                        <div className="text-emerald-400 font-bold text-lg font-mono mb-1">$3,500 – $6,000</div>
                        <div className="text-slate-400 font-mono text-[11px]">Turnaround: 1 – 2 Weeks</div>
                      </div>
                      <button
                        onClick={() => {
                          setProjectType("Rapid MVP");
                          onOpenModal();
                        }}
                        className="btn-terminal !py-1.5 !px-3 text-xs mt-4 justify-center w-full"
                      >
                        Select Tier 1
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded">
                        MOST POPULAR
                      </div>
                      <div>
                        <div className="text-indigo-400 font-mono text-[10px] uppercase mb-1">Tier 2</div>
                        <h4 className="text-base font-bold text-white mb-2">Full Production System</h4>
                        <p className="text-slate-300 text-xs mb-3">Native iOS/Android or Next.js Web App with real-time AI, Stripe payments, and admin portal.</p>
                        <div className="text-indigo-300 font-bold text-lg font-mono mb-1">$8,000 – $18,000</div>
                        <div className="text-slate-400 font-mono text-[11px]">Turnaround: 3 – 5 Weeks</div>
                      </div>
                      <button
                        onClick={() => {
                          setProjectType("Full Production System");
                          onOpenModal();
                        }}
                        className="btn-gradient !py-1.5 !px-3 text-xs mt-4 justify-center w-full"
                      >
                        Select Tier 2
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="text-slate-400 font-mono text-[10px] uppercase mb-1">Tier 3</div>
                        <h4 className="text-base font-bold text-white mb-2">Enterprise Multi-Tenant</h4>
                        <p className="text-slate-300 text-xs mb-3">Custom AI agent cluster, SOC2 compliance standards, high-throughput backend, and SLA support.</p>
                        <div className="text-cyan-400 font-bold text-lg font-mono mb-1">$25,000+</div>
                        <div className="text-slate-400 font-mono text-[11px]">Turnaround: Dedicated Sprint</div>
                      </div>
                      <button
                        onClick={() => {
                          setProjectType("Enterprise Multi-Tenant");
                          onOpenModal();
                        }}
                        className="btn-terminal !py-1.5 !px-3 text-xs mt-4 justify-center w-full"
                      >
                        Select Tier 3
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
