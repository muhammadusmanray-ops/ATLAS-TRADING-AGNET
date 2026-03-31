// Direct DB Audit - bypasses server completely
import { query } from './src/lib/db.ts';

async function auditDB() {
  console.log('=== NEON DB DIRECT AUDIT ===\n');
  try {
    const result = await query("SELECT side, amount, price, pnl FROM trades WHERE side IN ('BUY', 'SELL') ORDER BY timestamp DESC LIMIT 20");
    const trades = result.rows;
    
    console.log(`Total BUY/SELL trades in DB: ${trades.length}`);
    
    if (trades.length === 0) {
      console.log('\n⚠️  No BUY/SELL trades found. Run simulation first!');
      console.log('Steps: 1) Open localhost:3000  2) Claim Capital  3) Start Simulation (30 sec)  4) Run this script again');
      process.exit(0);
    }
    
    const buyVol = trades.filter(t=>t.side==='BUY').reduce((a,t)=>a + parseFloat(t.amount)*parseFloat(t.price), 0);
    const sellVol = trades.filter(t=>t.side==='SELL').reduce((a,t)=>a + parseFloat(t.amount)*parseFloat(t.price), 0);
    
    let pnl = 0;
    trades.forEach(t => {
      const raw = (t.pnl || '+0').replace(/\+|\$/g, '');
      const val = parseFloat(raw) || 0;
      pnl += (t.pnl?.startsWith('-') ? -val : val);
    });
    
    console.log('\nLast 5 Trades:');
    trades.slice(0,5).forEach(t => {
      console.log(`  ${t.side.padEnd(5)} | BTC: ${t.amount} @ $${t.price} | PnL: ${t.pnl}`);
    });
    
    console.log('\n=== BOXES RESULT (Real DB Data) ===');
    console.log(`Buy Volume:  $${buyVol.toFixed(2)}`);
    console.log(`Sell Volume: $${sellVol.toFixed(2)}`);
    console.log(`Net PnL:     $${pnl.toFixed(2)}`);
    console.log('====================================');
    
    const buyCount = trades.filter(t=>t.side==='BUY').length;
    const sellCount = trades.filter(t=>t.side==='SELL').length;
    console.log(`\nBUY count: ${buyCount} | SELL count: ${sellCount}`);
    
    if (sellVol > 0) console.log('✅ PASS: Sell Volume is REAL!');
    else console.log('❌ No SELL trades in DB yet — run simulation longer!');
    
  } catch(e: any) {
    console.error('DB Error:', e.message);
  }
  process.exit(0);
}

auditDB();
