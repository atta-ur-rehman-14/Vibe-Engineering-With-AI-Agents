import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import assert from "assert";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local using native fs
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key.trim()] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("==========================================");
console.log("VERIFYING SUPABASE BACKEND INTEGRATION");
console.log("==========================================");
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key prefix:", supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + "..." : "NONE");

assert.ok(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL must be defined");
assert.ok(supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined");
assert.ok(!supabaseUrl.includes("your-project-id"), "Supabase URL cannot be dummy placeholder");

const client = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function runEndToEndVerification() {
  // Step 1: Sign in with authenticated user
  console.log("\n1. Authenticating user (mrarehman703@gmail.com)...");
  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: "mrarehman703@gmail.com",
    password: "Password123!",
  });

  if (authError) {
    console.error("Sign-in failed:", authError.message);
    process.exit(1);
  }

  console.log("Authentication successful! User ID:", authData.user.id);

  // Step 2: Fetch boards
  console.log("\n2. Querying 'boards' table...");
  const { data: boards, error: boardsError } = await client.from("boards").select("*");
  if (boardsError) throw boardsError;
  console.log(`Found ${boards.length} board(s):`, boards.map(b => b.title));
  const boardId = boards[0].id;

  // Step 3: Fetch columns
  console.log("\n3. Querying 'columns' table for board:", boardId);
  const { data: columns, error: colsError } = await client
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position", { ascending: true });
  if (colsError) throw colsError;
  console.log(`Found ${columns.length} columns:`, columns.map(c => `${c.title} (pos: ${c.position})`));
  assert.strictEqual(columns.length, 5, "Must have exactly 5 columns");

  // Step 4: Create a new card in Column 1 (Backlog)
  const targetCol = columns[0];
  const testCardId = "30000000-0000-4000-8000-" + Date.now().toString(16).padStart(12, "0").slice(-12);
  console.log(`\n4. Inserting test card into '${targetCol.title}'...`);
  const { data: insertedCard, error: insertError } = await client
    .from("cards")
    .insert({
      id: testCardId,
      column_id: targetCol.id,
      title: "Automated Supabase Verification Card",
      details: "Verifying live database persistence and synchronization",
      position: 99,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Card insertion error:", insertError.message);
    throw insertError;
  }
  console.log("Card successfully inserted:", insertedCard.title, `(ID: ${insertedCard.id})`);

  // Step 5: Verify the card is present in DB query
  console.log("\n5. Verifying card exists in database...");
  const { data: fetchedCard, error: fetchCardError } = await client
    .from("cards")
    .select("*")
    .eq("id", testCardId)
    .single();
  if (fetchCardError) throw fetchCardError;
  assert.strictEqual(fetchedCard.id, testCardId);
  assert.strictEqual(fetchedCard.title, "Automated Supabase Verification Card");
  console.log("Card existence confirmed in Supabase PostgreSQL!");

  // Step 6: Move card to Column 2 (To Do) - Drag & Drop simulation
  const nextCol = columns[1];
  console.log(`\n6. Moving card from '${targetCol.title}' to '${nextCol.title}'...`);
  const { error: moveError } = await client
    .from("cards")
    .update({ column_id: nextCol.id, position: 0 })
    .eq("id", testCardId);
  if (moveError) throw moveError;

  const { data: movedCard, error: verifyMoveError } = await client
    .from("cards")
    .select("*")
    .eq("id", testCardId)
    .single();
  if (verifyMoveError) throw verifyMoveError;
  assert.strictEqual(movedCard.column_id, nextCol.id);
  console.log("Card moved successfully! New column_id matches:", nextCol.title);

  // Step 7: Delete the test card
  console.log("\n7. Deleting test card from Supabase...");
  const { error: deleteError } = await client
    .from("cards")
    .delete()
    .eq("id", testCardId);
  if (deleteError) throw deleteError;

  const { data: checkDeleted } = await client
    .from("cards")
    .select("*")
    .eq("id", testCardId);
  assert.strictEqual(checkDeleted.length, 0, "Card should be deleted");
  console.log("Card cleanly deleted from database!");

  // Step 8: Test column rename and revert
  console.log("\n8. Testing column title update in Supabase...");
  const originalTitle = targetCol.title;
  const tempTitle = originalTitle + " (Renamed)";
  const { error: renameError } = await client
    .from("columns")
    .update({ title: tempTitle })
    .eq("id", targetCol.id);
  if (renameError) throw renameError;

  const { data: renamedCol } = await client
    .from("columns")
    .select("*")
    .eq("id", targetCol.id)
    .single();
  assert.strictEqual(renamedCol.title, tempTitle);
  console.log("Column successfully renamed to:", renamedCol.title);

  // Revert column name
  const { error: revertError } = await client
    .from("columns")
    .update({ title: originalTitle })
    .eq("id", targetCol.id);
  if (revertError) throw revertError;
  console.log("Column reverted to original title:", originalTitle);

  console.log("\n==========================================");
  console.log("ALL SUPABASE BACKEND TESTS PASSED SUCCESSFULLY!");
  console.log("==========================================");
}

runEndToEndVerification().catch((err) => {
  console.error("\nTEST FAILED WITH ERROR:", err);
  process.exit(1);
});
