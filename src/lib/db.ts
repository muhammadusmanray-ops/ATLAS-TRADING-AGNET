import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: any = null;
let dbAvailable = false;

export const getPool = () => {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const { Pool } = pg;
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  }
  return pool;
};

export const query = async (text: string, params?: any[]): Promise<any> => {
  const p = getPool();
  if (!p) return { rows: [] };
  return p.query(text, params);
};

export const isDbAvailable = () => dbAvailable;

export const initDb = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn("--- No DATABASE_URL set — running in stateless mode (trades will not persist) ---");
    return;
  }
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
    await query(`
      ALTER TABLE trades
        ADD COLUMN IF NOT EXISTS balance_delta DECIMAL(20, 4),
        ADD COLUMN IF NOT EXISTS audit_hash VARCHAR(66);
    `).catch(() => {});
    dbAvailable = true;
    console.log("--- Neon DB Initialized Successfully ---");
  } catch (err: any) {
    console.error("--- Neon DB Initialization Failed ---", err.message);
  }
};
