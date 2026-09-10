import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend/.env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in frontend/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function checkUser() {
  const email = process.env.TEST_USER_EMAIL || "test@example.com";
  const defaultPassword = process.env.TEST_USER_PASSWORD || "TestPassword123!";

  console.log(`Checking if user ${email} exists in Supabase Auth...`);

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
    return;
  }

  const existing = usersData.users.find((u) => u.email === email);
  if (existing) {
    console.log(`User ${email} already exists! ID:`, existing.id);
  } else {
    console.log(`User ${email} does not exist yet. Creating...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
    });

    if (createError) {
      console.error("Error creating user:", createError.message);
    } else {
      console.log(`User created successfully! Email: ${email}, Password: ${defaultPassword}, Confirmed: true`);
    }
  }
}

checkUser();