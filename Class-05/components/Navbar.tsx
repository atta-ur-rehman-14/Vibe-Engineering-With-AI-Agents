"use client";

import React, { useState, useEffect } from "react";
import { personalInfo } from "../data/portfolio";
import { ArrowUpRight, DownloadIcon, MenuIcon, CloseIcon } from "./Icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["about", "skills", "focus", "work", "clone", "journey"];
      const scrollPosition = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className={`nav-bar ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="shell nav-container">
        {/* Clean, Elegant Brand & Live Telemetry Dot */}
        <div className="brand-group">
          <a href="#top" className="brand" aria-label="Atta Ur Rehman">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="brand-name">Atta Ur Rehman</span>
          </a>
          <div className="nav-sys-badge" title="Vibe Engineering & Data Analytics">
            <span className="sys-status-dot" />
            <span>AVAILABLE</span>
          </div>
        </div>

        {/* Minimal Desktop Nav Links with Active Scroll-Spy */}
        <nav className="nav-links" aria-label="Main Navigation">
          <a
            href="#about"
            className={activeSection === "about" ? "active" : ""}
          >
            About
          </a>
          <a
            href="#skills"
            className={activeSection === "skills" ? "active" : ""}
          >
            Skills
          </a>
          <a
            href="#focus"
            className={activeSection === "focus" ? "active" : ""}
          >
            Focus
          </a>
          <a
            href="#work"
            className={activeSection === "work" ? "active" : ""}
          >
            Work
          </a>
          <a
            href="#clone"
            className={activeSection === "clone" ? "active" : ""}
          >
            AI Clone
          </a>
          <a
            href="#journey"
            className={activeSection === "journey" ? "active" : ""}
          >
            Journey
          </a>
        </nav>

        {/* Clean Actions */}
        <div className="nav-actions">
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cv-link"
            aria-label="Download Resume PDF"
          >
            <DownloadIcon />
            <span>CV</span>
          </a>
          <a href="#contact" className="nav-cta-btn">
            <span>Let&apos;s connect</span>
            <ArrowUpRight />
          </a>
          <button
            type="button"
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop */}
      {mobileOpen && (
        <>
          <div className="nav-backdrop" onClick={closeMenu} aria-hidden="true" />
          <div className="nav-drawer" role="dialog" aria-label="Mobile Navigation">
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#skills" onClick={closeMenu}>Skills (Linkedin.pdf)</a>
            <a href="#focus" onClick={closeMenu}>Focus Areas</a>
            <a href="#work" onClick={closeMenu}>Selected Work</a>
            <a href="#clone" onClick={closeMenu}>AI Clone</a>
            <a href="#journey" onClick={closeMenu}>Journey &amp; Education</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="drawer-cv"
            >
              Download Resume (PDF) →
            </a>
          </div>
        </>
      )}
    </header>
  );
}
