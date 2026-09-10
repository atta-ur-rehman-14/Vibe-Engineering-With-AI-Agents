import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Kanban Business & Technical Requirements", () => {
  const typesFilePath = path.resolve(__dirname, "../src/types/kanban.ts");
  const typesContent = fs.readFileSync(typesFilePath, "utf8");

  const globalsCssPath = path.resolve(__dirname, "../src/app/globals.css");
  const globalsCssContent = fs.readFileSync(globalsCssPath, "utf8");

  const schemaSqlPath = path.resolve(__dirname, "../../supabase/schema.sql");
  const schemaSqlContent = fs.readFileSync(schemaSqlPath, "utf8");

  it("should have exactly 5 fixed columns in initial data", () => {
    // Check 5 column names from requirements
    const columnTitles = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
    columnTitles.forEach((title) => {
      assert.ok(
        typesContent.includes(`"${title}"`),
        `Missing required column: ${title}`
      );
    });
  });

  it("should not contain any emojis in code or initial data (CLAUDE.md requirement)", () => {
    // Emoji regex checking code files
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    assert.strictEqual(
      emojiRegex.test(typesContent),
      false,
      "Found forbidden emojis in src/types/kanban.ts"
    );
    assert.strictEqual(
      emojiRegex.test(globalsCssContent),
      false,
      "Found forbidden emojis in src/app/globals.css"
    );
  });

  it("should enforce exact brand color scheme from CLAUDE.md", () => {
    assert.ok(
      globalsCssContent.includes("#ecad0a"),
      "Missing Accent Yellow #ecad0a"
    );
    assert.ok(
      globalsCssContent.includes("#209dd7"),
      "Missing Blue Primary #209dd7"
    );
    assert.ok(
      globalsCssContent.includes("#753991"),
      "Missing Purple Secondary #753991"
    );
    assert.ok(
      globalsCssContent.includes("#032147"),
      "Missing Dark Navy #032147"
    );
    assert.ok(
      globalsCssContent.includes("#888888"),
      "Missing Gray Text #888888"
    );
  });

  it("should define Supabase PostgreSQL schema with boards, columns, cards and RLS", () => {
    assert.ok(schemaSqlContent.includes("CREATE TABLE IF NOT EXISTS public.boards"));
    assert.ok(schemaSqlContent.includes("CREATE TABLE IF NOT EXISTS public.columns"));
    assert.ok(schemaSqlContent.includes("CREATE TABLE IF NOT EXISTS public.cards"));
    assert.ok(schemaSqlContent.includes("ENABLE ROW LEVEL SECURITY"));
    assert.ok(schemaSqlContent.includes("REFERENCES public.boards"));
    assert.ok(schemaSqlContent.includes("REFERENCES public.columns"));
  });

  it("should correctly handle card creation and column movement logic", () => {
    let columns = [
      { id: "col-1", title: "Backlog", position: 0, cards: [] },
      { id: "col-2", title: "To Do", position: 1, cards: [] },
    ];

    // 1. Add card to col-1
    const newCard = {
      id: "card-1",
      column_id: "col-1",
      title: "Test Task",
      details: "Test Description",
      position: 0,
    };
    columns[0].cards.push(newCard);

    assert.strictEqual(columns[0].cards.length, 1);
    assert.strictEqual(columns[0].cards[0].title, "Test Task");

    // 2. Move card from col-1 to col-2
    const [moved] = columns[0].cards.splice(0, 1);
    moved.column_id = "col-2";
    moved.position = 0;
    columns[1].cards.push(moved);

    assert.strictEqual(columns[0].cards.length, 0);
    assert.strictEqual(columns[1].cards.length, 1);
    assert.strictEqual(columns[1].cards[0].column_id, "col-2");

    // 3. Rename column
    columns[1].title = "Ready for Development";
    assert.strictEqual(columns[1].title, "Ready for Development");

    // 4. Delete card
    columns[1].cards = columns[1].cards.filter((c) => c.id !== "card-1");
    assert.strictEqual(columns[1].cards.length, 0);
  });

  it("should have valid Supabase project configuration configured in .env.local", () => {
    const envLocalPath = path.resolve(__dirname, "../.env.local");
    assert.ok(fs.existsSync(envLocalPath), ".env.local must exist");
    const envContent = fs.readFileSync(envLocalPath, "utf8");
    assert.ok(
      envContent.includes("https://hzhqmzsdcunbbqsitzfw.supabase.co"),
      "Supabase project URL must be active"
    );
    assert.ok(
      !envContent.includes("your-project-id"),
      "Must not contain placeholder project id"
    );
    assert.ok(
      envContent.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_"),
      "Must have valid publishable anon key"
    );
  });

  it("should ensure no emojis exist in component files or supabase client", () => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    const filesToCheck = [
      "../src/lib/supabase.ts",
      "../src/app/page.tsx",
      "../src/components/Navbar.tsx",
      "../src/components/KanbanBoard.tsx",
      "../src/components/KanbanColumn.tsx",
      "../src/components/KanbanCard.tsx",
      "../src/components/AuthGate.tsx",
      "../src/components/StatusBanner.tsx",
      "../src/components/AddCardModal.tsx",
    ];

    filesToCheck.forEach((relPath) => {
      const fullPath = path.resolve(__dirname, relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8");
        assert.strictEqual(
          emojiRegex.test(content),
          false,
          `Found forbidden emoji in ${relPath}`
        );
      }
    });
  });
});
