import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,

  ssl: false, // ✅ important — your server rejects SSL

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

console.log("📡 Connecting to PostgreSQL...");
console.log(`Host: ${process.env.PGHOST}`);
console.log(`DB: ${process.env.PGDATABASE}`);

export default pool;
