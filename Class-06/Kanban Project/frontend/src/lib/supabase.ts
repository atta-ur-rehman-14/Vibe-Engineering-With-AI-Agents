import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import {
  Board,
  Column,
  Card,
  DEFAULT_BOARD_ID,
  INITIAL_DUMMY_COLUMNS,
} from "../types/kanban";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey;
  return Boolean(
    url &&
      key &&
      url.trim() !== "" &&
      key.trim() !== "" &&
      !url.includes("your-project-id")
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    )
  : null;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const LOCAL_STORAGE_KEY = "kanban_mvp_board_state";

const getLocalColumns = (): Column[] => {
  if (typeof window === "undefined") return INITIAL_DUMMY_COLUMNS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to read from localStorage", err);
  }
  return INITIAL_DUMMY_COLUMNS;
};

const saveLocalColumns = (cols: Column[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cols));
  } catch (err) {
    console.error("Failed to write to localStorage", err);
  }
};

// Data Fetching
export async function getBoardData(): Promise<{
  board: Board;
  columns: Column[];
}> {
  if (!supabase) {
    return {
      board: { id: DEFAULT_BOARD_ID, title: "Project Board" },
      columns: getLocalColumns(),
    };
  }

  try {
    // 1. Fetch or initialize board
    const { data: boardsData, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .limit(1);

    if (boardError) {
      console.error("Supabase boards query error:", boardError.message);
      throw boardError;
    }

    let boardId = DEFAULT_BOARD_ID;
    let boardTitle = "Project Board";

    if (!boardsData || boardsData.length === 0) {
      const { data: newBoard, error: createError } = await supabase
        .from("boards")
        .insert({ id: DEFAULT_BOARD_ID, title: "Project Board" })
        .select()
        .single();
      if (!createError && newBoard) {
        boardId = newBoard.id;
        boardTitle = newBoard.title;
      }
    } else {
      boardId = boardsData[0].id;
      boardTitle = boardsData[0].title;
    }

    // 2. Fetch columns
    const { data: colsData, error: colsError } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true });

    if (colsError) {
      console.error("Supabase columns query error:", colsError.message);
      throw colsError;
    }

    // If no columns in DB, seed the initial 5 columns and cards
    if (!colsData || colsData.length === 0) {
      for (const col of INITIAL_DUMMY_COLUMNS) {
        await supabase.from("columns").insert({
          id: col.id,
          board_id: boardId,
          title: col.title,
          position: col.position,
        });

        if (col.cards.length > 0) {
          await supabase.from("cards").insert(
            col.cards.map((c) => ({
              id: c.id,
              column_id: col.id,
              title: c.title,
              details: c.details,
              position: c.position,
            }))
          );
        }
      }

      saveLocalColumns(INITIAL_DUMMY_COLUMNS);
      return {
        board: { id: boardId, title: boardTitle },
        columns: INITIAL_DUMMY_COLUMNS,
      };
    }

    // 3. Fetch cards
    const colIds = colsData.map((c) => c.id);
    const { data: cardsData, error: cardsError } = await supabase
      .from("cards")
      .select("*")
      .in("column_id", colIds)
      .order("position", { ascending: true });

    if (cardsError) {
      console.error("Supabase cards query error:", cardsError.message);
      throw cardsError;
    }

    const populatedColumns: Column[] = colsData.map((col) => ({
      id: col.id,
      board_id: col.board_id,
      title: col.title,
      position: col.position,
      cards: (cardsData || [])
        .filter((card) => card.column_id === col.id)
        .sort((a, b) => a.position - b.position),
    }));

    // Keep local cache synced
    saveLocalColumns(populatedColumns);

    return {
      board: { id: boardId, title: boardTitle },
      columns: populatedColumns,
    };
  } catch (error) {
    console.warn("Supabase fetch failed, falling back to local state:", error);
    return {
      board: { id: DEFAULT_BOARD_ID, title: "Project Board" },
      columns: getLocalColumns(),
    };
  }
}

// Column Operations
export async function updateColumnTitle(
  columnId: string,
  newTitle: string,
  currentColumns: Column[]
): Promise<void> {
  const updated = currentColumns.map((col) =>
    col.id === columnId ? { ...col, title: newTitle } : col
  );
  saveLocalColumns(updated);

  if (supabase) {
    const { error } = await supabase
      .from("columns")
      .update({ title: newTitle })
      .eq("id", columnId);
    if (error) {
      console.error("Supabase updateColumnTitle error:", error.message);
      throw error;
    }
  }
}

// Card Operations
export async function createCard(
  columnId: string,
  title: string,
  details: string,
  position: number,
  currentColumns: Column[]
): Promise<Card> {
  const newCard: Card = {
    id: generateUUID(),
    column_id: columnId,
    title,
    details,
    position,
  };

  const updated = currentColumns.map((col) => {
    if (col.id === columnId) {
      return {
        ...col,
        cards: [...col.cards, newCard],
      };
    }
    return col;
  });
  saveLocalColumns(updated);

  if (supabase) {
    const { data, error } = await supabase
      .from("cards")
      .insert({
        id: newCard.id,
        column_id: columnId,
        title,
        details,
        position,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase createCard error:", error.message);
      throw error;
    }
    if (data) return data;
  }

  return newCard;
}

export async function deleteCard(
  cardId: string,
  currentColumns: Column[]
): Promise<void> {
  saveLocalColumns(currentColumns);

  if (supabase) {
    const { error } = await supabase.from("cards").delete().eq("id", cardId);
    if (error) {
      console.error("Supabase deleteCard error:", error.message);
      throw error;
    }
  }
}

export async function syncColumnsState(columns: Column[]): Promise<void> {
  saveLocalColumns(columns);

  if (!supabase) return;

  try {
    const updates = columns.flatMap((col) =>
      col.cards.map((card, index) => ({
        id: card.id,
        column_id: col.id,
        position: index,
        title: card.title,
        details: card.details,
      }))
    );

    if (updates.length > 0) {
      const { error } = await supabase.from("cards").upsert(updates, { onConflict: "id" });
      if (error) {
        console.error("Failed to sync card state with Supabase:", error.message);
        throw error;
      }
    }
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Failed to sync card state with Supabase:", error?.message || err);
    throw err;
  }
}

// Auth Helpers
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured yet. Set credentials in .env.local.");
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured yet. Set credentials in .env.local.");
  }
  return await supabase.auth.signUp({ email, password });
}

export async function signOutUser() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
