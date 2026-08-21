"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, Copy, Check, Mail, Code, Smartphone, Globe, Cpu, RotateCcw, Edit3 } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

const currencyData: Record<string, { label: string; symbol: string; options: string[] }> = {
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

export default function ProjectModal({ isOpen, onClose, initialType = "AI Application" }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("$5,000 - $15,000");
  const [customBudget, setCustomBudget] = useState("");
  const [projectType, setProjectType] = useState(initialType);
  const [timeline, setTimeline] = useState("2 - 4 weeks");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-detect currency from browser timezone / locale
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
      // fallback to USD
    }
  }, []);

  // Update budget selection when currency changes
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (budget !== "Custom Amount") {
      const options = currencyData[newCurrency]?.options || currencyData.USD.options;
      setBudget(options[1]); // Default to second tier (recommended)
    }
  };

  // Reset submitted state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const handleResetForNew = () => {
    setIsSubmitted(false);
    setDescription("");
    setCustomBudget("");
  };

  const projectTypes = [
    { label: "AI Application", icon: Cpu },
    { label: "iOS / Mobile App", icon: Smartphone },
    { label: "Web Platform / SaaS", icon: Globe },
    { label: "Custom Architecture", icon: Code },
  ];

  const timelineOptions = [
    "ASAP (< 2 weeks)",
    "2 - 4 weeks",
    "1 - 3 months",
    "Flexible",
  ];

  const effectiveBudget =
    budget === "Custom Amount"
      ? `${currencyData[currency]?.symbol || ""} ${customBudget || "Custom"} (${currency})`
      : `${budget} (${currency})`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !description) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/send-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          projectType,
          budget: effectiveBudget,
          timeline,
          description,
        }),
      });

      const data = await res.json();
      setIsSubmitted(true);

      // Open mailto fallback option
      if (data?.mailtoUrl) {
        window.location.href = data.mailtoUrl;
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback directly to mailto
      const subject = encodeURIComponent(`Project Inquiry: ${projectType} from ${name || "Client"}`);
      const bodyText = encodeURIComponent(
        `Hi Rivelo Labs,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nProject Type: ${projectType}\nBudget: ${effectiveBudget}\nTimeline: ${timeline}\n\nProject Scope:\n${description}`
      );
      window.location.href = `mailto:hello@rivelolabs.com?subject=${subject}&body=${bodyText}`;
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBrief = () => {
    const brief = `=== PROJECT BRIEF FOR RIVELOLABS ===\nName: ${name || "N/A"}\nEmail: ${email || "N/A"}\nPhone: ${phone || "N/A"}\nType: ${projectType}\nBudget: ${effectiveBudget}\nTimeline: ${timeline}\nDescription:\n${description}\nTarget: hello@rivelolabs.com`;
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card - Clean White Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-auto text-left text-slate-900"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600/10 border border-indigo-600/20 p-0.5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.png"
                      alt="rivelolabs Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Direct Project Dispatch
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
                  Tell us about your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">project</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Dispatched directly to <span className="text-indigo-600 font-semibold">hello@rivelolabs.com</span>. We review and respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  {/* Project Type Select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Select Project Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {projectTypes.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setProjectType(label)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            projectType === label
                              ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-1 ring-indigo-600 shadow-sm"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1.5 ${projectType === label ? "text-indigo-600" : "text-slate-500"}`} />
                          <span className="text-center">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name, Email, & Mobile Number Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name / Org
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Mobile / WhatsApp</span>
                        <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm"
                      />
                    </div>
                  </div>

                  {/* Budget with Currency Switcher & Custom Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Estimated Budget
                        </label>
                        {/* Currency Selector Pill */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500 font-medium">Currency:</span>
                          <select
                            value={currency}
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                          >
                            {Object.keys(currencyData).map((cur) => (
                              <option key={cur} value={cur}>
                                {currencyData[cur].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm font-medium"
                      >
                        {(currencyData[currency]?.options || currencyData.USD.options).map((b) => (
                          <option key={b} value={b}>
                            {b === "Custom Amount" ? " Custom Amount (Type exact value)" : b}
                          </option>
                        ))}
                      </select>

                      {/* Custom Amount Input field when "Custom Amount" is selected */}
                      {budget === "Custom Amount" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600">
                              {currencyData[currency]?.symbol || "$"}
                            </span>
                            <input
                              type="text"
                              value={customBudget}
                              onChange={(e) => setCustomBudget(e.target.value)}
                              placeholder={`Enter custom amount e.g. ${currency === "INR" ? "3,50,000" : "12,500"}`}
                              className="w-full rounded-xl border border-indigo-300 bg-indigo-50/40 pl-8 pr-3.5 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-xs font-medium"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Target Timeline
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm font-medium"
                      >
                        {timelineOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tell us what you want to build <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Give a brief summary of the problem, required features, tech requirements, or existing designs..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm"
                    />
                  </div>

                  {/* Submit Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sends to <strong className="text-slate-700 font-semibold">hello@rivelolabs.com</strong></span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={copyBrief}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied!" : "Copy Brief"}</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Dispatching...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Project Brief</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Project Brief Dispatched!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  Your project scope has been routed to <strong className="text-slate-900">hello@rivelolabs.com</strong>. Our engineering leads will review your architecture and respond within 24 hours.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left text-slate-700 font-mono mb-6 overflow-x-auto">
                  <div className="text-slate-400 mb-1">// Dispatched Payload Summary</div>
                  <div><strong>From:</strong> {name || "Client"} &lt;{email}&gt;</div>
                  {phone && <div><strong>Mobile:</strong> {phone}</div>}
                  <div><strong>Category:</strong> {projectType}</div>
                  <div><strong>Budget:</strong> {effectiveBudget} | <strong>Timeline:</strong> {timeline}</div>
                  <div><strong>Brief:</strong> {description}</div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleResetForNew}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Send Another Project</span>
                  </button>

                  <a
                    href={`mailto:hello@rivelolabs.com?subject=Project%20Brief:%20${encodeURIComponent(projectType)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nBudget: ${effectiveBudget}\nTimeline: ${timeline}\n\n${description}`)}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Mail Client →</span>
                  </a>

                  <button
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
