import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Load root .env if variables are placed there
const rootEnvPath = path.resolve(process.cwd(), "../.env");
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
      const cleanKey = key.trim();
      if ((!process.env[cleanKey] || process.env[cleanKey]?.includes("your-project-id")) && val) {
        process.env[cleanKey] = val;
      }
    }
  });
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
