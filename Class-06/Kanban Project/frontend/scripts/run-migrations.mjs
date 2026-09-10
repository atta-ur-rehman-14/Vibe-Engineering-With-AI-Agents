import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend/.env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const sqlPath = path.resolve(__dirname, "../../supabase/schema.sql");
const sqlContent = fs.readFileSync(sqlPath, "utf-8");

const regions = [
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "ca-central-1",
  "me-central-1",
  "sa-east-1",
];

async function findAndMigrate() {
  const projectRef = process.env.SUPABASE_PROJECT_REF || "hzhqmzsdcunbbqsitzfw";
  const password = process.env.SUPABASE_DB_PASSWORD;

  if (!password) {
    console.error("ERROR: SUPABASE_DB_PASSWORD not set in environment");
    console.error("Set it in frontend/.env.local or as an environment variable");
    process.exit(1);
  }

  const user = `postgres.${projectRef}`;

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    process.stdout.write(`Trying ${region}... `);

    const client = new Client({
      host,
      port: 6543,
      user,
      password,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3500,
    });

    try {
      await client.connect();
      console.log(`\nCONNECTED to ${region}!`);
      console.log("Executing schema.sql on database...");
      await client.query(sqlContent);
      console.log("schema.sql executed successfully!");

      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name IN ('boards', 'columns', 'cards');
      `);
      console.log("Verified tables in database:", res.rows.map(r => r.table_name));

      const cols = await client.query(`SELECT title, position FROM public.columns ORDER BY position;`);
      console.log("Verified columns:", cols.rows);

      await client.end();
      console.log("SUCCESS! Database is fully migrated.");
      return;
    } catch (err) {
      if (err.message.includes("tenant/user")) {
        console.log("not here");
      } else {
        console.log(`error: ${err.message}`);
      }
    }
  }
}

findAndMigrate();