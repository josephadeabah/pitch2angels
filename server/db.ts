import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

// SiteGround PostgreSQL connection
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

console.log('📡 Database connection details:');
console.log(`   Host: ${process.env.PGHOST}`);
console.log(`   Database: ${process.env.PGDATABASE}`);
console.log(`   User: ${process.env.PGUSER}`);
console.log(`   Port: ${process.env.PGPORT}`);
console.log(`   SSL Required: true`);

const poolConfig: PoolConfig = {
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Handle SSL for SiteGround
if (process.env.NODE_ENV === 'production' || process.env.PGHOST?.includes('siteground')) {
  console.log('🔒 Enabling SSL for SiteGround PostgreSQL...');
  
  // Try different SSL configurations
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
  
  // Also add SSL as query parameter
  if (!connectionString.includes('?ssl=')) {
    poolConfig.connectionString = `${connectionString}?ssl=require`;
  }
}

const pool = new Pool(poolConfig);

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
    
    // Try alternative connection without SSL to diagnose
    console.log('🔄 Trying alternative connection method...');
    
    try {
      const testPool = new Pool({
        connectionString: `${connectionString}?ssl=require&sslmode=require`,
        ssl: { rejectUnauthorized: false }
      });
      
      const testClient = await testPool.connect();
      console.log('✅ Alternative connection successful');
      testClient.release();
      await testPool.end();
    } catch (altError) {
      console.error('❌ Alternative connection also failed:', altError);
    }
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