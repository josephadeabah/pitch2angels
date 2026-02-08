import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log('🔧 Initializing database connection...');

// Build connection string WITHOUT SSL parameters initially
const baseConnectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

console.log('📡 Database configuration:');
console.log(`   Host: ${process.env.PGHOST}`);
console.log(`   Database: ${process.env.PGDATABASE}`);
console.log(`   User: ${process.env.PGUSER}`);
console.log(`   Port: ${process.env.PGPORT}`);
console.log(`   Environment: ${process.env.NODE_ENV}`);

// Test multiple SSL configurations
const connectionAttempts = [
  {
    name: "SSL with verify-full (most secure)",
    connectionString: `${baseConnectionString}?sslmode=verify-full&sslrootcert=system`,
    ssl: { rejectUnauthorized: true }
  },
  {
    name: "SSL with require (SiteGround default)",
    connectionString: `${baseConnectionString}?sslmode=require`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "SSL with prefer",
    connectionString: `${baseConnectionString}?sslmode=prefer`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "No SSL (for testing)",
    connectionString: baseConnectionString,
    ssl: false
  }
];

interface ConnectionConfig {
  name: string;
  connectionString: string;
  ssl: { rejectUnauthorized: boolean } | boolean;
}

let connectedPool: Pool | null = null;
let successfulConfig: ConnectionConfig | null = null;

// Initialize database connection
(async () => {
  // Try each connection configuration
  for (const config of connectionAttempts) {
    try {
      console.log(`\n🔄 Attempting connection: ${config.name}`);
      
      const testPool = new Pool({
        connectionString: config.connectionString,
        ssl: config.ssl,
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000
      });

      const client = await testPool.connect();
      const result = await client.query('SELECT NOW() as time, version() as version');
      
      console.log(`✅ ${config.name} SUCCESSFUL!`);
      console.log(`   Database time: ${result.rows[0].time}`);
      console.log(`   PostgreSQL version: ${result.rows[0].version.split(',')[0]}`);
      
      client.release();
      
      // Close test pool and create main pool with successful config
      await testPool.end();
      
      successfulConfig = config;
      
      // Create main connection pool with successful configuration
      connectedPool = new Pool({
        connectionString: config.connectionString,
        ssl: config.ssl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      
      console.log(`🎉 Using configuration: ${config.name}`);
      break;
      
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ ${config.name} failed: ${errorMessage}`);
      continue;
    }
  }

  if (!connectedPool) {
    console.error('\n🚨 ALL DATABASE CONNECTION ATTEMPTS FAILED!');
    console.error('💡 Please check:');
    console.error('1. Is PostgreSQL running on SiteGround?');
    console.error('2. Are remote connections enabled in cPanel?');
    console.error('3. Check firewall/security settings');
    console.error('4. Verify username/password in Railway variables');
    
    // Create a dummy pool to prevent app crash
    // The app will still run but database operations will fail
    connectedPool = new Pool({
      connectionString: baseConnectionString,
      ssl: false,
      max: 1
    });
    
    console.warn('⚠️ Created fallback pool (database operations will fail)');
  }

  // Add event listeners
  connectedPool.on('connect', () => {
    console.log('🔗 New database connection established');
  });

  connectedPool.on('error', (err) => {
    console.error('💥 Database pool error:', err);
  });

  // Test the final connection
  try {
    const client = await connectedPool.connect();
    console.log('✅ Main database pool ready');
    client.release();
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Final pool test failed:', errorMessage);
  }
})();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Shutting down database pool...');
  if (connectedPool) {
    await connectedPool.end();
    console.log('✅ Database pool closed');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Shutting down database pool (SIGINT)...');
  if (connectedPool) {
    await connectedPool.end();
    console.log('✅ Database pool closed');
  }
  process.exit(0);
});

export default connectedPool;