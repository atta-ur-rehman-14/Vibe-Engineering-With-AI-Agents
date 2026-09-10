"use client";

import React, { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "../lib/supabase";
import { Lock, Mail, ArrowRight } from "lucide-react";

interface AuthGateProps {
  onSuccess: () => void;
  onBypassLocal?: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onSuccess, onBypassLocal }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUpWithEmail(email, password);
        if (error) throw error;
        if (data.session) {
          onSuccess();
        } else {
          setSuccessMsg("Registration successful. Check your email for a confirmation link if email confirmation is enabled, or sign in now.");
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        onSuccess();
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Kanban Project</h2>
          <p>Sign in to access your team project board</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isSignUp ? "active" : ""}`}
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isSignUp ? "active" : ""}`}
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
          >
            Create Account
          </button>
        </div>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        {successMsg && <div className="auth-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In to Board"}
            <ArrowRight size={16} />
          </button>
        </form>

        {onBypassLocal && (
          <div style={{ textAlign: "center", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
            <button
              type="button"
              onClick={onBypassLocal}
              className="btn-ghost"
              style={{ fontSize: "0.75rem", width: "100%" }}
            >
              Continue in Offline Preview Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
