"use client";

import React, { useState } from "react";
import { personalInfo } from "../data/portfolio";
import { ArrowUpRight, CopyIcon, CheckIcon, DownloadIcon, LinkedInIcon, GitHubIcon } from "./Icons";

interface ContactProps {
  onCopyEmail: () => void;
  copied: boolean;
}

export default function ContactSection({ onCopyEmail, copied }: ContactProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${senderName || "Website Visitor"}`);
    const body = encodeURIComponent(
      `Hi Atta,\n\n${message}\n\n— ${senderName || "Anonymous"} (${senderEmail || "No email provided"})`
    );

    window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSenderName("");
      setSenderEmail("");
      setMessage("");
      setFormOpen(false);
    }, 2800);
  };

  return (
    <footer className="contact" id="contact">
      <div className="shell contact-inner">
        <p className="section-kicker">/ 07 — Direct Engineering Line</p>

        <h2>
          Have an engineering challenge
          <br />
          worth <em className="gradient-text">solving together?</em>
        </h2>

        <div className="contact-main-row">
          <a className="contact-email" href={`mailto:${personalInfo.email}`}>
            <span>{personalInfo.email}</span>
            <ArrowUpRight />
          </a>

          <button
            type="button"
            className="contact-copy-btn"
            onClick={onCopyEmail}
            title="Click to copy email"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? "Copied to clipboard" : "Copy email address"}</span>
          </button>
        </div>

        <div className="contact-actions-strip">
          <button
            type="button"
            className="text-link contact-msg-toggle"
            onClick={() => setFormOpen(!formOpen)}
          >
            <span>{formOpen ? "Close message form" : "Leave a quick technical note"}</span>
            <ArrowUpRight />
          </button>

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            <DownloadIcon />
            <span>Download Resume PDF</span>
          </a>
        </div>

        {/* Quick Message Form */}
        {formOpen && (
          <form className="quick-msg-form" onSubmit={handleSendMessage}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Your Name / Team"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <textarea
              placeholder="What project, architecture, or data opportunity are you looking to unlock?"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="form-textarea"
            />
            <button type="submit" className="button button-primary">
              <span>{sent ? "Message Prepared!" : "Transmit Message"}</span>
              <ArrowUpRight />
            </button>
          </form>
        )}

        <div className="contact-bottom">
          <div className="contact-telemetry">
            <span className="telemetry-live-dot" />
            <span>SYS STATUS: 99.98% OPERATIONAL // ~16MS LATENCY</span>
          </div>

          <div className="social-links">
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
              <ArrowUpRight />
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon />
              <span>GitHub</span>
              <ArrowUpRight />
            </a>
          </div>

          <span className="contact-copyright">© {new Date().getFullYear()} {personalInfo.name} • Lahore, PK</span>
        </div>
      </div>
    </footer>
  );
}
