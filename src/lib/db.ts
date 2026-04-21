import pg from 'pg';
import dotenv from 'dotenv';

// Enforce environment variables loading before pool creation
dotenv.config();

let pool: any;

export const getPool = () => {
  if (!pool) {
    const { Pool } = pg;
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
};

export const query = (text: string, params?: any[]) => getPool().query(text, params);

export const initDb = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        pair VARCHAR(20) DEFAULT 'BTC/USD',
        side VARCHAR(10),
        amount VARCHAR(20),
        price DECIMAL(20, 2),
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        pnl VARCHAR(20),
        balance_delta DECIMAL(20, 4),
        status VARCHAR(50) DEFAULT 'executed',
        reasoning TEXT,
        audit_hash VARCHAR(66)
      );
    `);
    // Migrate existing tables that predate balance_delta
    await query(`
      ALTER TABLE trades
        ADD COLUMN IF NOT EXISTS balance_delta DECIMAL(20, 4),
        ADD COLUMN IF NOT EXISTS audit_hash VARCHAR(66);
    `).catch(() => {});
    console.log("--- Neon DB Initialized Successfully ---");
  } catch (err: any) {
    console.error("--- Neon DB Initialization Failed ---", err);
  }
};
