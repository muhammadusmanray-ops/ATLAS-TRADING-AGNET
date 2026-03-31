import { query } from './src/lib/db';

async function verifyRealData() {
  console.log("--- ATLAS AUDIT: NEON DATABASE CHECK ---");
  try {
    const result = await query("SELECT * FROM trades ORDER BY timestamp DESC LIMIT 50", []);
    console.log(`\nRecords Found in Ledger: ${result.rows.length}`);
    
    let totalBuy = 0;
    let totalSell = 0;
    let totalPnl = 0;

    result.rows.forEach((row: any) => {
      const vol = parseFloat(row.amount) * parseFloat(row.price);
      if (row.side === 'BUY') totalBuy += vol;
      else if (row.side === 'SELL') totalSell += vol;
      
      // Robust PnL parsing
      const rawPnl = row.pnl || "+$0.00";
      const pnlVal = parseFloat(rawPnl.replace(/[^\d.-]/g, '')) || 0;
      totalPnl += pnlVal;
      
      console.log(`[TRADE] ID: ${row.id} | ${row.side} | Vol: $${vol.toFixed(2)} | PnL: ${rawPnl}`);
    });

    console.log("\n--- AUDIT TOTALS (LEGAL LEDGER) ---");
    console.log(`Verified Buy Volume:  $${totalBuy.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    console.log(`Verified Sell Volume: $${totalSell.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    console.log(`Total Realized PnL:   $${totalPnl.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    console.log("-----------------------------------------");
    process.exit(0);
  } catch (e: any) {
    console.error("Database Audit Failed:", e.message);
    process.exit(1);
  }
}

verifyRealData();
