"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ProjectModal from "@/components/ProjectModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Background dot grid effect */}
      <div className="dot-grid" />

      {/* Global Project Submission Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <Navbar onOpenModal={() => setModalOpen(true)} />
      <main className="relative z-10">
        <Hero onOpenModal={() => setModalOpen(true)} />
        <div className="section-separator" />
        <Stats />
        <Services />
        <Process />
        <div id="work">
          <Projects />
        </div>
        <TechStack />
        <FAQ onOpenModal={() => setModalOpen(true)} />
        <Footer onOpenModal={() => setModalOpen(true)} />
      </main>
    </>
  );
}
