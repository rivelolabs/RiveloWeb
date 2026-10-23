"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt: string; href: string; label: string; fit?: "cover" | "contain"; bg?: string; overlay?: { eyebrow: string; title: string; text: string } };

const slides: Slide[] = [
  { src: "/hero/hero-omeglevc.webp", alt: "OmegleVC — meet people, join groups, share music and talk", href: "https://omeglevc.com", label: "Explore OmegleVC" },
  {
    src: "/hero/hero-claude.webp",
    alt: "Illustration of a thinking head with connected ideas",
    href: "https://claude.com/programs/startups",
    label: "Claude for Startups",
    fit: "contain",
    bg: "#db7658",
    overlay: { eyebrow: "BUILDING WITH CLAUDE", title: "Part of the Claude for Startups program", text: "We build with Claude by Anthropic to help independent products get discovered." },
  },
];

const INTERVAL = 5000;

export type SponsoredSlide = { id: string; name: string; tagline: string; url: string; image?: string | null; logo?: string | null };

export default function HeroSlider({ first, sponsored = [] }: { first?: ReactNode; sponsored?: SponsoredSlide[] }) {
  // Paid "header" placements first, then the image slides, and the house card last.
  // On phones the slider is image-only, sized exactly to the banners; the text card is dropped there.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => { const mq = window.matchMedia("(max-width: 760px)"); const u = () => setNarrow(mq.matches); u(); mq.addEventListener("change", u); return () => mq.removeEventListener("change", u); }, []);
  const showFirst = !!first && !narrow;
  const offset = sponsored.length;
  const firstIndex = sponsored.length + slides.length;
  const total = firstIndex + (showFirst ? 1 : 0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((n: number) => setIndex((n + total) % total), [total]);
  useEffect(() => { if (index >= total) { const t = setTimeout(() => setIndex(0), 0); return () => clearTimeout(t); } }, [index, total]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, go]);

  return (
    <section
      className="rd-hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="rd-hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {sponsored.map((sp, i) => (
          <a key={sp.id} href={sp.url} target="_blank" rel="sponsored noopener noreferrer" className={`rd-hero-slide${sp.image ? "" : " rd-sponsored-slide"}`} aria-roledescription="slide" aria-label={`${i + 1} of ${total}: Sponsored, ${sp.name}`} aria-hidden={index !== i} inert={index !== i} tabIndex={index === i ? 0 : -1}>
            <span className="rd-sponsored-badge">SPONSORED</span>
            {sp.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sp.image} alt={sp.name} referrerPolicy="no-referrer" loading={i===0?"eager":"lazy"} fetchPriority={i===0?"high":"auto"} />
                <span className="rd-hero-overlay"><strong>{sp.name}</strong><span>{sp.tagline}</span></span>
              </>
            ) : (
              <><strong>{sp.name}</strong><p>{sp.tagline}</p></>
            )}
            <span className="rd-hero-cta">Visit {sp.name} <ArrowUpRight size={14} /></span>
          </a>
        ))}
        {slides.map((s, i) => (
          <a
            key={s.src}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rd-hero-slide"
            style={{ background: s.bg }}
            aria-roledescription="slide"
            aria-label={`${i + 1 + offset} of ${total}: ${s.label}`}
            aria-hidden={i + offset !== index}
            inert={i + offset !== index}
            tabIndex={i + offset === index ? 0 : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src.replace(".webp","-800.webp")} srcSet={s.fit==="contain"?undefined:`${s.src.replace(".webp","-800.webp")} 800w, ${s.src.replace(".webp","-1600.webp")} 1600w`} sizes="(max-width: 760px) 92vw, 860px" alt={s.alt} width={1600} height={690} loading={i===0&&!sponsored.length?"eager":"lazy"} fetchPriority={i===0&&!sponsored.length?"high":"auto"} decoding="async" className={s.fit === "contain" ? "rd-hero-contain" : ""} />
            {s.overlay && (
              <span className="rd-hero-overlay">
                <span className="rd-hero-eyebrow">{s.overlay.eyebrow}</span>
                <strong>{s.overlay.title}</strong>
                <span>{s.overlay.text}</span>
              </span>
            )}
            <span className="rd-hero-cta">{s.label} <ArrowUpRight size={14} /></span>
          </a>
        ))}
        {showFirst && (
          <div className="rd-hero-slide rd-hero-first" aria-roledescription="slide" aria-label={`${total} of ${total}`} aria-hidden={index !== firstIndex} inert={index !== firstIndex}>{first}</div>
        )}
      </div>
      <button type="button" className="rd-hero-arrow rd-hero-prev" aria-label="Previous slide" onClick={() => go(index - 1)}><ChevronLeft size={18} /></button>
      <button type="button" className="rd-hero-arrow rd-hero-next" aria-label="Next slide" onClick={() => go(index + 1)}><ChevronRight size={18} /></button>
      <div className="rd-hero-dots">
        {Array.from({ length: total }, (_, i) => (
          <button key={i} type="button" aria-label={`Show slide ${i + 1}`} aria-current={i === index} className={i === index ? "rd-hero-dot rd-hero-dot-on" : "rd-hero-dot"} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  );
}
