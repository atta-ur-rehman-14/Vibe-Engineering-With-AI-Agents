"use client";

import React from "react";
import { LogOut, LayoutGrid, Database } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User | null;
  isSupabaseActive: boolean;
  onSignOut: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isSupabaseActive,
  onSignOut,
  onOpenAuthModal,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <LayoutGrid size={18} />
        </div>
        <h1 className="navbar-title">Kanban Project</h1>
        <span className="navbar-badge">Single Board</span>
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="user-tag">{user.email}</span>
            <button
              onClick={onSignOut}
              className="btn-secondary"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
              Sign Out
            </button>
          </>
        ) : isSupabaseActive ? (
          onOpenAuthModal ? (
            <button
              onClick={onOpenAuthModal}
              className="btn-secondary"
              title="Sign In"
            >
              Sign In
            </button>
          ) : null
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#d8e2ef", fontSize: "0.8125rem" }}>
            <Database size={14} />
            <span>Local Mode</span>
          </div>
        )}
      </div>
    </header>
  );
};
