"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* ——— CTA Section ——— */}
      <section id="contact" className="relative z-10 py-28 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="card relative overflow-hidden p-10 sm:p-16"
          >
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, var(--accent-glow) 0%, transparent 60%)`,
              }}
            />

            <div className="relative z-10">
              <p className="section-label">Ready to Build?</p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  color: "var(--text)",
                }}
              >
                Let&apos;s Create Something{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--accent), #06b6d4)",
                  }}
                >
                  Extraordinary
                </span>
              </h2>
              <p
                className="text-base sm:text-lg max-w-xl mx-auto mb-8"
                style={{ color: "var(--text-muted)" }}
              >
                Have a project in mind? We&apos;d love to hear about it. Drop
                us a line and let&apos;s explore what&apos;s possible.
              </p>

              <a
                href="mailto:hello@rivelolabs.com"
                className="btn-primary group inline-flex"
              >
                <Mail className="h-4 w-4" />
                hello@rivelolabs.com
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer
        className="relative z-10"
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-alt)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <span className="text-[10px] font-black text-white">R</span>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                rivelo<span style={{ color: "var(--accent)" }}>labs</span>
              </span>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              {["Work", "Services", "Stack", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  {link}
                </a>
              ))}
              <Link
                href="/privacy"
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Privacy
              </Link>
            </div>

            {/* Info & Social */}
            <div className="flex items-center gap-5">
              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>India</span>
                </div>
                <a
                  href="mailto:hello@rivelolabs.com"
                  className="hidden sm:flex items-center gap-1.5 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  <Mail className="h-3.5 w-3.5" />
                  hello@rivelolabs.com
                </a>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { icon: Github, href: "#" },
                  { icon: Twitter, href: "#" },
                ].map(({ icon: I, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      color: "var(--text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-hover)";
                      e.currentTarget.style.color = "var(--text)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <I className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              &copy; {new Date().getFullYear()} Rivelolabs. Crafted with
              obsession.
            </p>
            <Link
              href="/privacy"
              className="text-xs transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
