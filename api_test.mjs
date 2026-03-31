import http from 'http';

function post(path) {
  return new Promise((res) => {
    const req = http.request({hostname:'localhost',port:3000,path,method:'POST',headers:{'Content-Type':'application/json'}}, r => {
      let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d)));
    });
    req.write('{}'); req.end();
  });
}

function get(path) {
  return new Promise((res) => {
    http.get({hostname:'localhost',port:3000,path}, r => {
      let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d)));
    });
  });
}

async function test() {
  console.log('=== ATLAS LIVE API TEST ===\n');
  
  // 1. Claim Capital
  const claim = await post('/api/swarm/claim-capital');
  console.log('1. Claim Capital:', claim.success ? 'OK' : 'FAIL');
  console.log('   Amount:', claim.amount, '| Balance: $' + (claim.balance||0).toFixed(2));
  
  // 2. Execute 4 trades 
  console.log('\n2. Executing 4 Trades...');
  for(let i=0; i<4; i++) {
    const trade = await post('/api/swarm/execute');
    const side = trade.data?.finalDecision?.includes('SELL') ? 'SELL' : 'BUY';
    console.log(`   Trade ${i+1}: ${side} | Balance: $${(trade.balance||0).toFixed(2)}`);
    await new Promise(r=>setTimeout(r,600));
  }
  
  // 3. Check History Boxes
  console.log('\n3. Checking Trade History Boxes...');
  const hist = await get('/api/trades');
  const trades = (hist.trades || []).filter(t => t.side === 'BUY' || t.side === 'SELL');
  
  const buyVol = trades.filter(t=>t.side==='BUY').reduce((a,t)=>a + parseFloat(t.amount)*parseFloat(t.price), 0);
  const sellVol = trades.filter(t=>t.side==='SELL').reduce((a,t)=>a + parseFloat(t.amount)*parseFloat(t.price), 0);
  const pnl = trades.reduce((a,t)=> {
    const raw = (t.pnl||'+0').replace(/[+$]/g,'');
    return a + (parseFloat(raw)||0);
  }, 0);
  
  console.log('\n=== SUMMARY BOXES RESULT ===');
  console.log('Total Trades:', trades.length);
  console.log('Buy Volume:  $' + buyVol.toFixed(2));
  console.log('Sell Volume: $' + sellVol.toFixed(2));
  console.log('Net PnL:     $' + pnl.toFixed(2));
  console.log('============================');
  
  if (sellVol > 0) {
    console.log('\n✅ PASS: Sell Volume is REAL & Non-Zero!');
  } else {
    console.log('\n❌ FAIL: Sell Volume is still $0');
  }
  
  if (pnl !== 0) {
    console.log('✅ PASS: Net PnL is REAL & Non-Zero!');
  } else {
    console.log('⚠️  NOTE: Net PnL is $0 (all BUY trades, no SELL yet)');
  }
}

test().catch(e => console.error('Test Error:', e.message));
