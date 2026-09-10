import React from "react";
import { focusAreas } from "../data/portfolio";
import { ArrowUpRight } from "./Icons";

export default function FocusSection() {
  return (
    <section className="focus shell" id="focus">
      <div className="section-heading">
        <div>
          <p className="section-kicker">/ 03 — Core Strategic Focus (Linkedin.pdf)</p>
          <h2 className="section-title">
            Three pillars.
            <br />
            <em className="gradient-text">One clear trajectory.</em>
          </h2>
        </div>
        <p className="section-meta">Vibe Engineering • Data Analytics • Social Media Growth</p>
      </div>

      <div className="focus-grid">
        {focusAreas.map((area) => (
          <article className="focus-card" key={area.number}>
            <div className="focus-card-header">
              <span className="card-number">/ {area.number}</span>
              <span className="card-arrow">
                <ArrowUpRight />
              </span>
            </div>
            <div>
              <h3>{area.title}</h3>
              <p className="focus-subtitle">{area.subtitle}</p>
              <p>{area.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
