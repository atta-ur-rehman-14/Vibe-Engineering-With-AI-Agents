import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hzhqmzsdcunbbqsitzfw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_SECRET_KEY";

console.log("Testing Supabase connection with Anon/Publishable key...");
const client = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await client.from("boards").select("*").limit(1);
    if (error) {
      console.log("Querying 'boards' table returned error:", error.message, "(code:", error.code, ")");
    } else {
      console.log("Successfully connected to 'boards' table! Data:", data);
    }
  } catch (err) {
    console.error("Connection exception:", err.message);
  }

  // Also test with secret key
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("\nTesting with Secret key...");
    const adminClient = createClient(supabaseUrl, supabaseSecretKey);
    try {
      const { data, error } = await adminClient.from("boards").select("*").limit(1);
      if (error) {
        console.log("Admin querying 'boards' returned error:", error.message, "(code:", error.code, ")");
      } else {
        console.log("Admin successfully connected to 'boards' table! Data:", data);
      }
    } catch (err) {
      console.error("Admin exception:", err.message);
    }
  }
}

testConnection();
