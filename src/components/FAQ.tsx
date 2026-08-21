"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Mail, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Engineering & Turnaround",
    question: "How fast can Riveno build and deploy a production-grade AI or web platform?",
    answer:
      "Our sprint model is engineered for flash speed. Rapid MVPs and AI tools are typically designed, built, and deployed within 1 to 2 weeks. Full production-grade SaaS platforms, native iOS/Android mobile applications, and WebRTC systems typically ship in 3 to 5 weeks with complete automated testing and CI/CD pipelines.",
  },
  {
    category: "Track Record & Scale",
    question: "What high-traffic platforms and scalable applications has Riveno engineered?",
    answer:
      "We have engineered and scaled applications like OmegleVC (omeglevc.com) handling over 100K+ network requests and 20K+ active visitors with sub-50ms WebRTC latency. We also built RevFit (all-in-one lifestyle & fitness tracking ecosystem), Calarm (smart wake-up Google Calendar integration with Push notifications), and Klyq (real-time live matchmaking arena with LiveKit).",
  },
  {
    category: "Intellectual Property & Code Ownership",
    question: "Who owns the code, intellectual property (IP), and architecture?",
    answer:
      "You own 100% of all intellectual property, source code, design files, and cloud infrastructure upon project handover. Calquors Private Limited / Riveno signs comprehensive non-disclosure agreements (NDAs) by default and guarantees zero vendor lock-in.",
  },
  {
    category: "AI & Modern Tech Stack",
    question: "What technologies and AI frameworks does Rivelo Labs specialize in?",
    answer:
      "We specialize in Next.js 16 (React 19), TypeScript, Tailwind CSS, Python, Node.js, WebRTC, distributed WebSockets, Redis, PostgreSQL, Supabase, Swift/SwiftUI for iOS, Kotlin for Android, and advanced AI architectures grounded in verified data standards.",
  },
  {
    category: "Project Inquiries & Communication",
    question: "How do I submit my project brief and what happens after?",
    answer:
      "You can submit your project directly through our interactive dispatcher or email hello@rivelolabs.com. A senior engineering lead reviews your requirements, prepares an architectural breakdown and scope estimate, and reaches out within 24 hours to schedule a kickoff sprint.",
  },
  {
    category: "Pricing & Billing",
    question: "How does pricing and project budgeting work?",
    answer:
      "We offer transparent, fixed-scope milestone billing with regional currency support (USD, INR, EUR, GBP, AED, CAD, AUD, SGD) as well as custom budget brackets. We also provide flexible dedicated engineering sprints for scale-ups and enterprises.",
  },
];

export default function FAQ({ onOpenModal }: { onOpenModal: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative z-10 py-24 px-4 sm:px-6" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3"
            style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
          >
            Frequently Asked <span className="glow-speed">Questions</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Everything you need to know about partnering with Riveno and shipping at flash speed.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "border-indigo-500/40 bg-[#0e121d]/95 shadow-xl shadow-indigo-500/5"
                    : "border-white/10 bg-[#0a0d17]/70 hover:border-white/20 hover:bg-[#0e121d]/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
                >
                  <span
                    itemProp="name"
                    className="text-base sm:text-lg font-semibold text-white tracking-tight"
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 border-indigo-500 bg-indigo-600/20 text-indigo-300"
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div
                        itemScope
                        itemProp="acceptedAnswer"
                        itemType="https://schema.org/Answer"
                        className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm sm:text-base leading-relaxed text-slate-300 border-t border-white/5 mt-1"
                      >
                        <p itemProp="text">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Prompt */}
        <div className="mt-10 p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Have a specific project in mind?</h4>
              <p className="text-xs text-slate-400">Direct inquiries to hello@rivelolabs.com or submit your specs.</p>
            </div>
          </div>
          <button
            onClick={onOpenModal}
            className="btn-launch !py-2 !px-5 text-xs whitespace-nowrap cursor-pointer"
          >
            <span>Ask Us Anything →</span>
          </button>
        </div>
      </div>
    </section>
  );
}
