import React from "react";
import { projects } from "../data/portfolio";
import { ArrowUpRight } from "./Icons";

export default function WorkSection() {
  return (
    <section className="work shell" id="work">
      <div className="work-top section-heading">
        <div>
          <p className="section-kicker">/ 04 — Applied Projects &amp; Evidence</p>
          <h2>
            Work worth
            <br />
            <em className="gradient-text">making visible.</em>
          </h2>
        </div>
        <p className="section-meta">Bridging Vibe Engineering, Python Analytics &amp; Meta Ads.</p>
      </div>

      <div className="work-grid">
        {/* Project 1: Large Featured Card with Precision SVG Spline Chart */}
        <article className="work-card work-card-large">
          <div className="work-visual visual-grid" aria-label="Interactive Growth Spline">
            <span className="visual-label">SIGNAL // DATA PIPELINE</span>

            {/* Precision SVG Chart */}
            <svg
              className="chart-svg"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d="M 10 160 Q 120 150 200 110 T 360 65 T 490 35 L 490 200 L 10 200 Z"
                fill="url(#chartGradient)"
              />

              {/* Baseline Trend */}
              <path
                d="M 10 160 Q 120 150 200 110 T 360 65 T 490 35"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="200" cy="110" r="5" fill="#07090e" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="360" cy="65" r="5" fill="#07090e" stroke="#818cf8" strokeWidth="2.5" />
              <circle cx="490" cy="35" r="6" fill="#38bdf8" stroke="#07090e" strokeWidth="2" />
            </svg>

            <div className="visual-metric-badge">+42% Conversion Lift</div>
          </div>

          <div className="work-card-copy">
            <div className="card-top-row">
              <span className="card-category">{projects[0].categoryLabel}</span>
              {projects[0].github && (
                <a
                  href={projects[0].github}
                  target="_blank"
                  rel="noreferrer"
                  className="card-github-link"
                >
                  <span>Code</span>
                  <ArrowUpRight />
                </a>
              )}
            </div>
            <h3>{projects[0].title}</h3>
            <p>{projects[0].description}</p>
            <div className="work-card-tags">
              {projects[0].tags.map((tag, tIdx) => (
                <span key={tIdx}>#{tag}</span>
              ))}
            </div>
          </div>
        </article>

        {/* Project 2: Autonomous AI Vibe Agent (Terminal / Prompt UI) */}
        <article className="work-card">
          <div className="work-visual visual-terminal" aria-label="AI Prompt Execution">
            <div className="terminal-bar">
              <span className="term-dot dot-red" />
              <span className="term-dot dot-yellow" />
              <span className="term-dot dot-green" />
              <span className="terminal-title">agent.vibe.orchestrator</span>
            </div>
            <div className="terminal-body">
              <p className="term-cmd">
                <span className="term-prompt">&gt;</span> execute_agent(
                <span className="term-str">&quot;campaign_brief&quot;</span>)
              </p>
              <div className="term-output">
                <span className="term-ok">✓ Tone:</span> High-conviction
                <br />
                <span className="term-ok">✓ CAC delta:</span> -34%
                <br />
                <span className="term-ok">✓ Latency:</span> 1.2s
              </div>
            </div>
          </div>

          <div className="work-card-copy">
            <div className="card-top-row">
              <span className="card-category">{projects[1].categoryLabel}</span>
              {projects[1].github && (
                <a
                  href={projects[1].github}
                  target="_blank"
                  rel="noreferrer"
                  className="card-github-link"
                >
                  <span>Code</span>
                  <ArrowUpRight />
                </a>
              )}
            </div>
            <h3>{projects[1].title}</h3>
            <p>{projects[1].description}</p>
            <div className="work-card-tags">
              {projects[1].tags.map((tag, tIdx) => (
                <span key={tIdx}>#{tag}</span>
              ))}
            </div>
          </div>
        </article>

        {/* Project 3: Predictive Churn & Cohort Analysis (Cohort Heatmap) */}
        <article className="work-card">
          <div className="work-visual visual-cohort" aria-label="Cohort Retention Matrix">
            <div className="cohort-header">
              <span>COHORT</span>
              <span>M0</span>
              <span>M1</span>
              <span>M2</span>
              <span>M3</span>
            </div>
            <div className="cohort-row">
              <span className="cohort-lbl">2026 Q1</span>
              <span className="cell c-100">100%</span>
              <span className="cell c-85">88%</span>
              <span className="cell c-75">79%</span>
              <span className="cell c-70">72%</span>
            </div>
            <div className="cohort-row">
              <span className="cohort-lbl">2026 Q2</span>
              <span className="cell c-100">100%</span>
              <span className="cell c-85">91%</span>
              <span className="cell c-75">83%</span>
              <span className="cell c-na">—</span>
            </div>
            <div className="cohort-row">
              <span className="cohort-lbl">2026 Q3</span>
              <span className="cell c-100">100%</span>
              <span className="cell c-85">94%</span>
              <span className="cell c-na">—</span>
              <span className="cell c-na">—</span>
            </div>
          </div>

          <div className="work-card-copy">
            <div className="card-top-row">
              <span className="card-category">{projects[2].categoryLabel}</span>
              {projects[2].github && (
                <a
                  href={projects[2].github}
                  target="_blank"
                  rel="noreferrer"
                  className="card-github-link"
                >
                  <span>Code</span>
                  <ArrowUpRight />
                </a>
              )}
            </div>
            <h3>{projects[2].title}</h3>
            <p>{projects[2].description}</p>
            <div className="work-card-tags">
              {projects[2].tags.map((tag, tIdx) => (
                <span key={tIdx}>#{tag}</span>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="work-note">
        A portfolio is not a gallery.
        <br />
        <span>It&apos;s evidence.</span>
      </div>
    </section>
  );
}
