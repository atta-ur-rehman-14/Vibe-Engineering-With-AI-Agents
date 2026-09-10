"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface StatusBannerProps {
  isSupabaseConfigured: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ isSupabaseConfigured }) => {
  return (
    <div className="status-banner">
      <div className="status-banner-text">
        <span
          className={`status-indicator ${isSupabaseConfigured ? "connected" : ""}`}
        />
        {isSupabaseConfigured ? (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={14} color="#10b981" />
            Supabase persistence active. Connected to PostgreSQL backend.
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertCircle size={14} color="#ecad0a" />
            Supabase credentials not set in frontend/.env.local. Running in local storage mode with full interactive preview.
          </span>
        )}
      </div>

      <div>
        {!isSupabaseConfigured && (
          <span style={{ fontSize: "0.75rem", color: "var(--gray-text)" }}>
            Execute <strong>supabase/schema.sql</strong> in your Supabase SQL editor to initialize tables.
          </span>
        )}
      </div>
    </div>
  );
};
