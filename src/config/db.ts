import { Pool } from "pg";
import { env } from "@/config/env.js";
import dotenv from "dotenv";
dotenv.config();
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});
export const client = pool.connect();