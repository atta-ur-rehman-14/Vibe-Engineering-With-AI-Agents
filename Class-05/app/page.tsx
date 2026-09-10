"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsStrip from "../components/StatsStrip";
import ManifestoSection from "../components/ManifestoSection";
import TechStackSection from "../components/TechStackSection";
import FocusSection from "../components/FocusSection";
import WorkSection from "../components/WorkSection";
import AICloneSection from "../components/AICloneSection";
import JourneySection from "../components/JourneySection";
import ContactSection from "../components/ContactSection";
import { personalInfo } from "../data/portfolio";
import { CheckIcon, ArrowUp } from "../components/Icons";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <HeroSection onCopyEmail={handleCopyEmail} copied={copied} />
        <StatsStrip />
        <ManifestoSection />
        <TechStackSection />
        <FocusSection />
        <WorkSection />
        <AICloneSection />
        <JourneySection />
        <ContactSection onCopyEmail={handleCopyEmail} copied={copied} />
      </main>

      {/* Subtle Toast Feedback */}
      {copied && (
        <aside className="copy-toast" role="status" aria-live="polite">
          <CheckIcon />
          <span>Email copied to clipboard ({personalInfo.email})</span>
        </aside>
      )}

      {/* Floating Back to Top Control */}
      {showTopBtn && (
        <a
          href="#top"
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp />
        </a>
      )}
    </>
  );
}
