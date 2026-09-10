import React from "react";
import { personalInfo } from "../data/portfolio";
import { ArrowUpRight } from "./Icons";

export default function ManifestoSection() {
  return (
    <section className="manifesto" id="about">
      <div className="shell manifesto-grid">
        <p className="section-kicker">/ 01 — Mission &amp; Philosophy</p>

        <div className="manifesto-main">
          <h2>
            Not just numbers.
            <br />
            <span className="gradient-text">Patterns &amp; Solutions.</span>
          </h2>
          <p className="manifesto-lead">
            I&apos;m passionate about exploring datasets, uncovering patterns, and building solutions
            that solve real-world problems.
          </p>
          <p className="manifesto-body">
            In practice, that means advancing through Python, Pandas, NumPy, SQL, Power BI, Excel, and
            Machine Learning basics while working on targeted data projects to continuously sharpen my skills.
            At the same time, I execute real-world performance strategies: managing Meta Ads campaigns with
            continuous A/B split-testing at <strong>Zyrom PVT LTD</strong>, and expanding youth engagement
            loops at <strong>Pakistan Youth Nexus Society</strong>. I am eager to connect with professionals,
            collaborate on interesting data challenges, and grow within the global data science and Vibe Engineering community.
          </p>
          <a
            className="text-link"
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <span>View Verified LinkedIn Profile</span>
            <ArrowUpRight />
          </a>
        </div>

        <div className="manifesto-aside">
          <div className="pull-quote">
            “The most useful insight is the one that changes what you build and execute next.”
          </div>
          <div className="quote-rule" />
          <p>Verified Working Principle</p>
        </div>
      </div>
    </section>
  );
}
