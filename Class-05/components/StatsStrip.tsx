import React from "react";
import { stats } from "../data/portfolio";

export default function StatsStrip() {
  return (
    <section className="stats-strip" aria-label="Key Performance Indicators">
      <div className="shell">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <span className="stat-number">{stat.value}</span>
              <div>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-desc">{stat.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
