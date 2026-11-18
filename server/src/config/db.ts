import { Pool } from "pg";
import { env } from "@/config/env.js";
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

async function main() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected to Database!");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await pool.end();
  }
}

main();