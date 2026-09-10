import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hzhqmzsdcunbbqsitzfw.supabase.co";
const supabaseAnonKey = "sb_publishable_rnRfqSZuPHQO1reudh7Umg_OqelsHRj";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserLogin() {
  console.log("Testing user sign-in with client SDK...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "mrarehman703@gmail.com",
    password: "Password123!",
  });

  if (authError) {
    console.error("Sign-in failed:", authError.message);
    return;
  }

  console.log("Sign-in SUCCESSFUL! User ID:", authData.user.id);

  // Test querying boards as authenticated user
  const { data: boards, error: boardsError } = await supabase.from("boards").select("*");
  if (boardsError) {
    console.error("Failed to fetch boards:", boardsError.message);
  } else {
    console.log("Fetched boards as authenticated user:", boards);
  }

  // Test querying columns
  const { data: columns, error: colsError } = await supabase.from("columns").select("*").order("position");
  if (colsError) {
    console.error("Failed to fetch columns:", colsError.message);
  } else {
    console.log("Fetched columns count:", columns.length);
    console.log("Columns:", columns.map((c) => c.title));
  }

  // Test querying cards
  const { data: cards, error: cardsError } = await supabase.from("cards").select("*");
  if (cardsError) {
    console.error("Failed to fetch cards:", cardsError.message);
  } else {
    console.log("Fetched cards count:", cards.length);
  }
}

testUserLogin();
