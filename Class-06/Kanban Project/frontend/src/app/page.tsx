"use client";

import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  isSupabaseConfigured,
  supabase,
  getBoardData,
  signOutUser,
  getCurrentUser,
} from "../lib/supabase";
import { Column, Board, INITIAL_DUMMY_COLUMNS, DEFAULT_BOARD_ID } from "../types/kanban";
import { Navbar } from "../components/Navbar";
import { KanbanBoard } from "../components/KanbanBoard";
import { AuthGate } from "../components/AuthGate";

export default function Home() {
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [board, setBoard] = useState<Board>({
    id: DEFAULT_BOARD_ID,
    title: "Project Board",
  });
  const [columns, setColumns] = useState<Column[]>(INITIAL_DUMMY_COLUMNS);
  const [bypassAuth, setBypassAuth] = useState<boolean>(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setSupabaseActive(configured);

    const initialize = async () => {
      if (configured && supabase) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
              const data = await getBoardData();
              setBoard(data.board);
              setColumns(data.columns);
            }
          }
        );

        if (currentUser) {
          const data = await getBoardData();
          setBoard(data.board);
          setColumns(data.columns);
        }
        setLoading(false);

        return () => {
          authListener.subscription.unsubscribe();
        };
      } else {
        // Local mode
        const data = await getBoardData();
        setBoard(data.board);
        setColumns(data.columns);
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
  };

  const handleAuthSuccess = async () => {
    setLoading(true);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    const data = await getBoardData();
    setBoard(data.board);
    setColumns(data.columns);
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "var(--bg-page)",
          color: "var(--dark-navy)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
        }}
      >
        Initializing Kanban workspace...
      </div>
    );
  }

  // If Supabase is active and user is not authenticated, show AuthGate
  if (supabaseActive && !user && !bypassAuth) {
    return (
      <div>
        <Navbar
          user={null}
          isSupabaseActive={supabaseActive}
          onSignOut={handleSignOut}
        />
        <AuthGate
          onSuccess={handleAuthSuccess}
          onBypassLocal={() => setBypassAuth(true)}
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar
        user={user}
        isSupabaseActive={supabaseActive}
        onSignOut={handleSignOut}
      />
      <KanbanBoard
        initialColumns={columns}
        boardTitle={board.title}
      />
    </div>
  );
}
