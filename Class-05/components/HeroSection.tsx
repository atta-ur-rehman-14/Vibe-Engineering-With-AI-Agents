"use client";

import React from "react";
import Image from "next/image";
import { personalInfo } from "../data/portfolio";
import { ArrowDown, CopyIcon, CheckIcon, DownloadIcon } from "./Icons";
import DevConsole from "./DevConsole";

interface HeroProps {
  onCopyEmail: () => void;
  copied: boolean;
}

export default function HeroSection({ onCopyEmail, copied }: HeroProps) {
  return (
    <section className="hero shell" id="top">
      {/* Left Column: Authentic Headline, Telemetry & Actions from Linkedin.pdf */}
      <div className="hero-copy">
        <div className="hero-telemetry-pill">
          <span className="telemetry-live-dot" />
          <span className="telemetry-text">VIBE ENGINEERING • DATA ANALYTICS • META ADS // LAHORE, PK</span>
        </div>

        <h1>
          Data has a pulse.
          <br />
          <em className="gradient-text">I find it.</em>
        </h1>

        <p className="hero-headline-sub">
          Vibe Engineering || Data Analyst || Python || SQL || Power Bi || Excel || Social Media Manager || Meta Ads
        </p>

        <p className="hero-intro">
          I&apos;m <strong>{personalInfo.name}</strong> — passionate about exploring datasets, uncovering patterns,
          and building solutions that solve real-world problems. Currently mastering Python, Pandas, NumPy, SQL,
          Power BI, Excel, and Machine Learning basics while driving brand growth, A/B testing, and youth community
          momentum at <strong>Zyrom PVT LTD</strong> and <strong>Pakistan Youth Nexus Society</strong>.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#skills">
            <span>Explore Skills &amp; Projects</span>
            <ArrowDown />
          </a>

          <button
            type="button"
            className="text-link hero-copy-btn"
            onClick={onCopyEmail}
            title="Click to copy email address"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Email Copied!" : personalInfo.email}</span>
          </button>

          <a
            className="text-link"
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadIcon />
            <span>Resume PDF</span>
          </a>
        </div>

        {/* Interactive Developer CLI Quick Console */}
        <DevConsole />

        <div className="hero-tech-strip">
          <span>Vibe Engineering</span>
          <span>Python</span>
          <span>SQL</span>
          <span>Pandas</span>
          <span>NumPy</span>
          <span>Power BI</span>
          <span>Excel</span>
          <span>Meta Ads</span>
          <span>Business Development</span>
        </div>
      </div>

      {/* Right Column: Clean, High-Fashion Portrait Card with Ambient Aura */}
      <div className="hero-aside" aria-label="Atta Ur Rehman Portrait">
        <div className="portrait-ambient-glow" />
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />

        <div className="portrait-card">
          <Image
            src={personalInfo.profileImage}
            alt={personalInfo.name}
            width={320}
            height={420}
            priority
            className="portrait-img"
          />
          <div className="portrait-badge">
            <span className="portrait-badge-name">{personalInfo.name}</span>
            <span className="portrait-badge-tag">LAHORE, PK // VIBE ENG &amp; DATA</span>
          </div>
        </div>

        <div className="hero-caption caption-top">01 / 06 — PROFILE</div>
        <div className="hero-caption caption-bottom">uncovering patterns<br />→ real-world solutions</div>
      </div>

      {/* Hero Footer */}
      <div className="hero-footer">
        <span>Scroll to inspect systems</span>
        <span className="hero-line" />
        <span>01 — 06</span>
      </div>
    </section>
  );
}

