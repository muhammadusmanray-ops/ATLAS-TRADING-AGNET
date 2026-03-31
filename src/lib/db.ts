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
        status VARCHAR(50) DEFAULT 'executed',
        reasoning TEXT,
        ip_address VARCHAR(45),
        audit_hash VARCHAR(64)
      );
    `);
    console.log("--- Neon DB Initialized Successfully ---");
  } catch (err: any) {
    console.error("--- Neon DB Initialization Failed ---", err);
  }
};
