"use client";

import React, { useState } from "react";
import { CodeIcon, DatabaseIcon, CpuIcon, ActivityIcon, ServerIcon, SparklesIcon, ArrowUpRight } from "./Icons";

interface StackItem {
  name: string;
  category: "vibe" | "python" | "bi" | "growth" | "cs";
  level: "Advanced" | "Expert" | "Proficient";
  highlight?: boolean;
  useCase: string;
  tags: string[];
}

const stackData: StackItem[] = [
  // 1. Vibe Engineering & AI (Top Skill)
  {
    name: "Vibe Engineering",
    category: "vibe",
    level: "Expert",
    highlight: true,
    useCase: "Orchestrating agentic AI workflows, prompt architecture, and combining human direction with rapid generative execution.",
    tags: ["Top Skill", "Prompt Architecture", "Agentic AI"],
  },
  {
    name: "Autonomous AI Agents",
    category: "vibe",
    level: "Expert",
    highlight: true,
    useCase: "Deploying multi-step autonomous agent personas, tool execution, and grounded knowledge retrieval systems.",
    tags: ["LLM Agents", "Automation", "Workflow Design"],
  },
  {
    name: "Personal AI Knowledge Clones",
    category: "vibe",
    level: "Advanced",
    highlight: true,
    useCase: "Grounding LLMs with verified profile facts, authentic tone matching, and deterministic safety guardrails.",
    tags: ["Personal AI", "Grounding", "Gemma 4"],
  },

  // 2. Data Analytics with Python (Top Skill & Headline)
  {
    name: "Python",
    category: "python",
    level: "Advanced",
    highlight: true,
    useCase: "Core programming for data extraction, automated transformation scripts, and analytical workflows.",
    tags: ["Top Skill", "Data Analytics", "Scripts"],
  },
  {
    name: "Pandas & NumPy",
    category: "python",
    level: "Advanced",
    highlight: true,
    useCase: "Data wrangling, exploratory data analysis (EDA), matrix operations, and vectorized computations.",
    tags: ["Data Wrangling", "EDA", "DataFrames"],
  },
  {
    name: "Machine Learning Basics",
    category: "python",
    level: "Proficient",
    highlight: true,
    useCase: "Predictive classification, churn probability modeling, regression analysis, and statistical foundations.",
    tags: ["Predictive Models", "Statistics", "Algorithms"],
  },

  // 3. SQL & Business Intelligence (Headline)
  {
    name: "SQL",
    category: "bi",
    level: "Advanced",
    highlight: true,
    useCase: "Complex relational queries, data aggregation, normalization, and structuring analytical tables.",
    tags: ["Headline Skill", "Relational DB", "Queries"],
  },
  {
    name: "Power BI",
    category: "bi",
    level: "Proficient",
    highlight: true,
    useCase: "Interactive business intelligence dashboards, DAX measures, and transforming data logs into visual decisions.",
    tags: ["Headline Skill", "Dashboards", "DAX"],
  },
  {
    name: "Microsoft Excel",
    category: "bi",
    level: "Advanced",
    highlight: true,
    useCase: "Financial and performance modeling, pivot tables, lookup functions, and executive data presentation.",
    tags: ["Headline Skill", "Spreadsheets", "Data Modeling"],
  },

  // 4. Social Media, Meta Ads & Business Development (Top Skill & Experience)
  {
    name: "Social Media Management",
    category: "growth",
    level: "Advanced",
    highlight: true,
    useCase: "Directing multi-channel narrative strategy and scaling community engagement at Pakistan Youth Nexus Society & Zyrom.",
    tags: ["Headline Skill", "PYNS", "Zyrom PVT LTD"],
  },
  {
    name: "Meta Ads Manager",
    category: "growth",
    level: "Advanced",
    highlight: true,
    useCase: "Paid campaign optimization on Meta, continuous A/B split-testing on hooks and funnels, and CAC reduction.",
    tags: ["Headline Skill", "A/B Testing", "Paid Acquisition"],
  },
  {
    name: "Business Development",
    category: "growth",
    level: "Proficient",
    highlight: true,
    useCase: "Translating audience growth into business velocity, partnership building, and conversion funnel design.",
    tags: ["Top Skill", "Growth Strategy", "Partnerships"],
  },

  // 5. Computer Science Foundation (Education: IAC BS CS & SMIT)
  {
    name: "Algorithms & Data Structures",
    category: "cs",
    level: "Advanced",
    useCase: "Rigorous computing principles studied in BS Computer Science at Institute for Art and Culture.",
    tags: ["IAC BS CS", "Computational Logic", "Problem Solving"],
  },
  {
    name: "Applied Computing & Pipelines",
    category: "cs",
    level: "Advanced",
    useCase: "Intensive training in modern computing and scalable data implementation from Saylani SMIT.",
    tags: ["Saylani S.M.I.T", "Specialized Training"],
  },
  {
    name: "Git & GitHub",
    category: "cs",
    level: "Advanced",
    useCase: "Source code version control, repository maintenance, and collaborative software management.",
    tags: ["GitHub Personal", "Version Control"],
  },
];

type FilterType = "all" | "vibe" | "python" | "bi" | "growth" | "cs";

export default function TechStackSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredItems = activeFilter === "all"
    ? stackData
    : stackData.filter((item) => item.category === activeFilter);

  return (
    <section className="stack-section shell" id="skills">
      <div className="section-heading stack-heading">
        <div>
          <p className="section-kicker">/ 02 — Verified Capabilities (Linkedin.pdf)</p>
          <h2>
            Top Skills.
            <br />
            <em className="gradient-text">Practical Execution.</em>
          </h2>
        </div>
        <p className="section-meta">
          From Vibe Engineering to Data Analytics, Power BI &amp; Meta Ads.
        </p>
      </div>

      {/* Interactive Category Filter Tabs */}
      <div className="stack-filter-tabs" role="tablist" aria-label="Technology Categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "all"}
          className={`stack-tab ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          <span>All Skills ({stackData.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "vibe"}
          className={`stack-tab ${activeFilter === "vibe" ? "active" : ""}`}
          onClick={() => setActiveFilter("vibe")}
        >
          <CpuIcon />
          <span>Vibe Engineering</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "python"}
          className={`stack-tab ${activeFilter === "python" ? "active" : ""}`}
          onClick={() => setActiveFilter("python")}
        >
          <CodeIcon />
          <span>Data Analytics (Python)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "bi"}
          className={`stack-tab ${activeFilter === "bi" ? "active" : ""}`}
          onClick={() => setActiveFilter("bi")}
        >
          <DatabaseIcon />
          <span>SQL, Power BI &amp; Excel</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "growth"}
          className={`stack-tab ${activeFilter === "growth" ? "active" : ""}`}
          onClick={() => setActiveFilter("growth")}
        >
          <ActivityIcon />
          <span>Meta Ads &amp; Growth</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === "cs"}
          className={`stack-tab ${activeFilter === "cs" ? "active" : ""}`}
          onClick={() => setActiveFilter("cs")}
        >
          <ServerIcon />
          <span>Computer Science (IAC)</span>
        </button>
      </div>

      {/* Grid of Stack Items */}
      <div className="stack-grid">
        {filteredItems.map((item, idx) => (
          <div key={idx} className={`stack-card ${item.highlight ? "stack-card-highlight" : ""}`}>
            <div className="stack-card-header">
              <span className="stack-card-name">{item.name}</span>
              <span className={`stack-level-badge level-${item.level.toLowerCase()}`}>
                {item.level}
              </span>
            </div>

            <p className="stack-card-usecase">{item.useCase}</p>

            <div className="stack-card-tags">
              {item.tags.map((tag, tIdx) => (
                <span key={tIdx} className="stack-tag-pill">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Philosophy Banner */}
      <div className="stack-architecture-banner">
        <div className="arch-banner-left">
          <span className="arch-kicker">VERIFIED SUMMARY // LINKEDIN</span>
          <h3>Exploring Datasets, Uncovering Patterns &amp; Building Solutions</h3>
          <p>
            &quot;I’m passionate about exploring datasets, uncovering patterns, and building solutions that solve real-world problems.
            Currently learning Python, Pandas, NumPy, and Machine Learning basics while working on small projects to sharpen my skills.
            Eager to connect with professionals, collaborate on interesting data challenges, and grow within the data science community.&quot;
          </p>
        </div>
        <div className="arch-banner-right">
          <div className="arch-metric">
            <span className="arch-metric-val">3 Top Skills</span>
            <span className="arch-metric-lbl">Vibe Eng • Data Analytics • Biz Dev</span>
          </div>
          <div className="arch-metric">
            <span className="arch-metric-val">2 Companies</span>
            <span className="arch-metric-lbl">Pakistan Youth Nexus • Zyrom PVT LTD</span>
          </div>
          <div className="arch-metric">
            <span className="arch-metric-val">BS CS</span>
            <span className="arch-metric-lbl">Institute for Art and Culture (2023–2027)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
