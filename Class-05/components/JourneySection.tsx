import React from "react";
import { ArrowUpRight } from "./Icons";

const experienceItems = [
  {
    index: "01",
    year: "May 2026 — Present",
    periodDetail: "5 months",
    active: true,
    role: "Social Media Manager",
    company: "Pakistan Youth Nexus Society",
    location: "Punjab, Pakistan",
    tag: "Community Growth",
    note: "Scaling youth community engagement through data-backed content loops and strategic narrative direction across Punjab.",
  },
  {
    index: "02",
    year: "Aug 2025 — Present",
    periodDetail: "1 yr 2 mos",
    active: true,
    role: "Social Media Manager",
    company: "Zyrom PVT LTD",
    location: "Lahore, Pakistan",
    tag: "Meta Ads & Performance",
    note: "Managing Meta Ads Manager campaigns, continuous A/B split-testing on hooks and funnels, and performance optimization.",
  },
];

const educationMilestones = [
  {
    index: "01",
    institution: "Institute for Art and Culture",
    qualification: "Bachelor, Computer Science",
    period: "Oct 2023 — Oct 2027",
    status: "In Progress",
  },
  {
    index: "02",
    institution: "Saylani Mass I.T Training (S.M.I.T)",
    qualification: "Applied Data & Software Training",
    period: "Jan 2026 — Apr 2026",
    status: "Completed",
  },
  {
    index: "03",
    institution: "Punjab Group Of Colleges",
    qualification: "Intermediate, ICS",
    period: "2023",
    status: "Completed",
  },
  {
    index: "04",
    institution: "COE",
    qualification: "Matric in Science",
    period: "Completed",
    status: "Completed",
  },
];

export default function JourneySection() {
  return (
    <section className="journey" id="journey">
      <div className="shell">
        <div className="section-heading journey-heading">
          <div>
            <p className="section-kicker">/ 06 — Verified Experience &amp; Education (Linkedin.pdf)</p>
            <h2>
              Continuous compounding.
              <br />
              <em className="gradient-text">Real-world execution.</em>
            </h2>
          </div>
          <p className="section-meta">Grounded in verified milestones.</p>
        </div>

        {/* Experience List */}
        <div className="journey-subheading">
          <span className="subheading-tag">PROFESSIONAL EXPERIENCE</span>
        </div>

        <div className="journey-list">
          {experienceItems.map((item) => (
            <article className="journey-row" key={item.index}>
              <span className="journey-index">{item.index}</span>
              <div className="journey-time-col">
                <span className="journey-year">{item.year}</span>
                {item.active && <span className="role-active-badge">Active ({item.periodDetail})</span>}
              </div>
              <div className="journey-role">
                <div className="role-title-row">
                  <h3>{item.role}</h3>
                  <span className="journey-tag-pill">#{item.tag}</span>
                </div>
                <p>{item.company} • <span className="journey-loc">{item.location}</span></p>
              </div>
              <p className="journey-note">{item.note}</p>
              <span className="journey-arrow">
                <ArrowUpRight />
              </span>
            </article>
          ))}
        </div>

        {/* Education Grid */}
        <div className="journey-subheading" style={{ marginTop: "60px" }}>
          <span className="subheading-tag">ACADEMIC &amp; TRAINING MILESTONES</span>
        </div>

        <div className="education-grid">
          {educationMilestones.map((edu) => (
            <div key={edu.index} className="education-card">
              <span className="edu-index">/ {edu.index}</span>
              <strong className="edu-qual">{edu.qualification}</strong>
              <span className="edu-inst">{edu.institution}</span>
              <div className="edu-bottom">
                <span className="edu-period">{edu.period}</span>
                <span className={`edu-status-badge ${edu.status === "In Progress" ? "status-active" : ""}`}>
                  {edu.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
