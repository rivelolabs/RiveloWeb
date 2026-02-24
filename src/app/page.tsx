"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";

// Load 3D scene only on client — avoids SSR issues with Three.js
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  return (
    <>
      <Scene />
      <Navbar />
      <main>
        <Hero />
        <div className="animated-gradient-line" />
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
