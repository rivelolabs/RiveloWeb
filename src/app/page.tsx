"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Background effects */}
      <div className="mesh-gradient" />
      <div className="dot-grid" />

      <Navbar />
      <main>
        <Hero />
        <div className="section-separator" />
        <Stats />
        <Services />
        <Process />
        <Projects />
        <TechStack />
        <Footer />
      </main>
    </>
  );
}
