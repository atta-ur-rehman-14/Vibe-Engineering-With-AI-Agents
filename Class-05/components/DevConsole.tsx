"use client";

import React, { useState, useRef, useEffect } from "react";
import { personalInfo, stats } from "../data/portfolio";
import { TerminalIcon } from "./Icons";

interface HistoryEntry {
  command: string;
  output: string | React.ReactNode;
  timestamp: string;
}

export default function DevConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "atta --version",
      output: (
        <div className="cli-output-block">
          <span className="cli-cyan">Atta Ur Rehman Core Engine v2.4.0</span>
          <br />
          <span className="cli-muted">Full-Stack &amp; Data Solutions Architecture (Lahore, PK)</span>
          <br />
          <span className="cli-green">✔ Status: Systems nominal. Ready for high-impact challenges.</span>
        </div>
      ),
      timestamp: "12:00:01",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const time = new Date().toLocaleTimeString();

    let output: React.ReactNode;

    switch (cmd) {
      case "help":
      case "--help":
      case "-h":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">AVAILABLE COMMANDS (GROUNDED IN LINKEDIN.PDF):</span>
            <ul className="cli-list">
              <li><strong className="cli-yellow">atta --skills</strong>: Inspect Top Skills &amp; Technical Capabilities</li>
              <li><strong className="cli-yellow">atta --experience</strong>: View professional roles at Zyrom &amp; PYNS</li>
              <li><strong className="cli-yellow">atta --education</strong>: View verified academic history (IAC, SMIT, PGC, COE)</li>
              <li><strong className="cli-yellow">atta --summary</strong>: Read personal mission &amp; data philosophy</li>
              <li><strong className="cli-yellow">atta --contact</strong>: Print direct verified contact links</li>
              <li><strong className="cli-yellow">clear</strong>: Wipe terminal output buffer</li>
            </ul>
          </div>
        );
        break;

      case "atta --skills":
      case "skills":
      case "atta --stack":
      case "stack":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">TOP SKILLS (FROM LINKEDIN PROFILE):</span>
            <br />
            <span className="cli-green">✔ Vibe Engineering:</span> Prompt Architecture, LLM Workflows, Agentic Solutions
            <br />
            <span className="cli-green">✔ Data Analytics with Python:</span> Python, Pandas, NumPy, Machine Learning Basics
            <br />
            <span className="cli-green">✔ SQL &amp; Database Systems:</span> Relational Queries, Structuring Data &amp; Pipelines
            <br />
            <span className="cli-green">✔ Business Intelligence:</span> Power BI, Microsoft Excel, Data Visualization
            <br />
            <span className="cli-green">✔ Growth &amp; Performance:</span> Social Media Management, Meta Ads Manager, Business Development
          </div>
        );
        break;

      case "atta --experience":
      case "experience":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">VERIFIED PROFESSIONAL EXPERIENCE:</span>
            <br />
            <span className="cli-yellow">[01] Pakistan Youth Nexus Society</span>
            <br />
            <span className="cli-white">Role:</span> Social Media Manager | <span className="cli-muted">May 2026 — Present (5 months) | Punjab, Pakistan</span>
            <br />
            <span className="cli-muted">Focus: Community growth, youth engagement, and strategic content direction.</span>
            <br /><br />
            <span className="cli-yellow">[02] Zyrom PVT LTD</span>
            <br />
            <span className="cli-white">Role:</span> Social Media Manager | <span className="cli-muted">August 2025 — Present (1 year 2 months) | Lahore</span>
            <br />
            <span className="cli-muted">Focus: Meta Ads Manager campaigns, continuous A/B testing on hooks &amp; funnels, and performance marketing.</span>
          </div>
        );
        break;

      case "atta --education":
      case "education":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">VERIFIED EDUCATION (FROM LINKEDIN.PDF):</span>
            <br />
            <span className="cli-white">1. Institute for Art and Culture:</span> Bachelor, Computer Science (Oct 2023 — Oct 2027)
            <br />
            <span className="cli-white">2. Saylani Mass I.T Training (S.M.I.T):</span> Training Program (Jan 2026 — Apr 2026)
            <br />
            <span className="cli-white">3. Punjab Group Of Colleges:</span> Intermediate, ICS (2023)
            <br />
            <span className="cli-white">4. COE:</span> Matric in Science
          </div>
        );
        break;

      case "atta --summary":
      case "summary":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">SUMMARY (FROM LINKEDIN):</span>
            <br />
            <span className="cli-white">
              &quot;I’m passionate about exploring datasets, uncovering patterns, and building solutions that solve real-world problems. Currently learning Python, Pandas, NumPy, and Machine Learning basics while working on small projects to sharpen my skills. I’m eager to connect with professionals, collaborate on interesting data challenges, and grow within the data science community.&quot;
            </span>
          </div>
        );
        break;

      case "atta --projects":
      case "projects":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">SELECTED DATA &amp; VIBE PROJECTS:</span>
            <br />
            <span className="cli-yellow">[01] OmniChannel Signal Engine:</span> Meta Ads + Python analytics (+42% Conversion Lift)
            <br />
            <span className="cli-yellow">[02] Autonomous Vibe Agent:</span> Prompt Engineering &amp; LLM Knowledge Clone (&lt;1.2s Latency)
            <br />
            <span className="cli-yellow">[03] Predictive Customer Churn:</span> Python, Pandas, NumPy, Cohort Heatmap (99.4% Accuracy)
            <br />
            <span className="cli-muted">Scroll down to #work to interact with the live visualizations.</span>
          </div>
        );
        break;

      case "atta --contact":
      case "contact":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">DIRECT CONTACT (LINKEDIN.PDF VERIFIED):</span>
            <br />
            <span className="cli-white">Email:</span> <span className="cli-yellow">{personalInfo.email}</span>
            <br />
            <span className="cli-white">LinkedIn:</span> <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="cli-cyan">{personalInfo.linkedin}</a>
            <br />
            <span className="cli-white">GitHub:</span> <a href={personalInfo.github} target="_blank" rel="noreferrer" className="cli-cyan">{personalInfo.github}</a>
            <br />
            <span className="cli-white">Location:</span> <span className="cli-muted">{personalInfo.location}</span>
          </div>
        );
        break;

      case "atta --ping":
      case "ping":
        output = (
          <div className="cli-output-block">
            <span className="cli-green">PONG 127.0.0.1:</span>
            <br />
            <span>Time: 12.4ms | Status: 200 OK | Node: Lahore Edge (PKT UTC+5)</span>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="cli-output-block">
            <span className="cli-cyan">guest@portfolio:~$</span> Welcome, engineer or technical leader! Feel free to execute commands.
          </div>
        );
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInputVal("");
        return;

      default:
        output = (
          <div className="cli-output-block cli-red">
            zsh: command not found: {rawCmd}. Try typing <strong className="cli-yellow">help</strong> or clicking one of the quick command buttons.
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: rawCmd, output, timestamp: time }]);
    setInputVal("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  return (
    <div className="dev-cli-wrapper">
      <div className="dev-cli-trigger-bar">
        <button
          type="button"
          className={`dev-cli-pill-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <TerminalIcon />
          <span>{isOpen ? "Close Terminal Console" : "Interactive Developer Console [>_]"}</span>
          <span className="cli-kbd">CLI</span>
        </button>

        <div className="cli-quick-commands">
          <button type="button" onClick={() => { setIsOpen(true); executeCommand("atta --skills"); }}>
            &gt; atta --skills
          </button>
          <button type="button" onClick={() => { setIsOpen(true); executeCommand("atta --experience"); }}>
            &gt; atta --experience
          </button>
          <button type="button" onClick={() => { setIsOpen(true); executeCommand("atta --education"); }}>
            &gt; atta --education
          </button>
          <button type="button" onClick={() => { setIsOpen(true); executeCommand("atta --contact"); }}>
            &gt; atta --contact
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="dev-console-panel" role="region" aria-label="Developer Console">
          <div className="dev-console-header">
            <div className="console-window-dots">
              <span className="w-dot dot-red" />
              <span className="w-dot dot-yellow" />
              <span className="w-dot dot-green" />
            </div>
            <span className="console-title">atta@production-node: ~/developer-shell (zsh)</span>
            <div className="console-meta-tag">LIVE TELEMETRY</div>
          </div>

          <div className="dev-console-body">
            {history.map((entry, idx) => (
              <div key={idx} className="cli-entry">
                <div className="cli-command-line">
                  <span className="cli-prompt">atta@shell:~$</span>
                  <span className="cli-cmd-text">{entry.command}</span>
                  <span className="cli-time">{entry.timestamp}</span>
                </div>
                <div className="cli-response">{entry.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="dev-console-input-bar" onSubmit={handleFormSubmit}>
            <span className="cli-prompt">atta@shell:~$</span>
            <input
              type="text"
              className="dev-console-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type 'help', 'stack', 'projects', 'metrics' or 'clear'..."
            />
            <button type="submit" className="dev-console-run-btn">
              <span>Run</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
