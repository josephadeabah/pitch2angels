import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Use connection string WITHOUT SSL
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const pool = new Pool({
  connectionString,
  // REMOVE SSL configuration
  // ssl: {
  //   rejectUnauthorized: false
  // },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10 seconds
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Test connection immediately
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection test successful');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database server time:', result.rows[0].now);
    
    client.release();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Database connection failed:', message);
  }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
  process.exit(0);
});

export default pool;