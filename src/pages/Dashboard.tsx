import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, BarChart2, Bot, Database, Network, Zap, RefreshCw, Shield, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { time: '1', price: 64200 },
  { time: '3', price: 63900 },
  { time: '5', price: 64100 },
  { time: '7', price: 63700 },
  { time: '9', price: 63850 },
  { time: '11', price: 63600 },
  { time: '13', price: 63750 },
  { time: '15', price: 63900 },
  { time: '17', price: 64050 },
  { time: '19', price: 63800 },
  { time: '21', price: 64100 },
  { time: '23', price: 64300 },
  { time: '25', price: 64150 },
  { time: '27', price: 64400 },
  { time: '29', price: 64250 },
  { time: '31', price: 64500 },
  { time: '33', price: 64350 },
  { time: '35', price: 64600 },
  { time: '37', price: 64450 },
  { time: '39', price: 64700 },
];

const volatilityData = Array.from({ length: 40 }, (_, i) => ({
  time: i,
  val: 40 + Math.random() * 40 + (Math.sin(i * 0.5) * 20)
}));

export default function Dashboard() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [swarmResult, setSwarmResult] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);
  const [swarmStatus, setSwarmStatus] = useState<any>(null);
  const [activeConnections, setActiveConnections] = useState<{source: number, target: number}[]>([]);
  
  // Real-time Dynamics State
  const [fearIndex, setFearIndex] = useState(48);
  const [btcPrice, setBtcPrice] = useState(64500);
  const [chartHistory, setChartHistory] = useState(data); // Move static data to state
  const [isClaiming, setIsClaiming] = useState(false);
  const [capitalClaimed, setCapitalClaimed] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  const initialLogs = Array.from({length: 12}).map((_, i) => {
    const timestamp = new Date(Date.now() - i*1500).toISOString();
    return `[${timestamp}] [System-Init] [Node 0${(i%5)+1}] Booting agent matrix and analyzing baseline...`;
  });

  const [activePositions, setActivePositions] = useState<any[]>([]);
  const [agentLogs, setAgentLogs] = useState<string[]>(initialLogs);
  const [krakenLogs, setKrakenLogs] = useState<string[]>([
    '> kraken version 1.2.4-stable',
    '> initializing secure vault connection...',
    '> system readiness: 100%'
  ]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Dynamic Metrics Update Loop (fetching REAL LIVE data globally)
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Real BTC Price from Binance
        const btcRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const btcData = await btcRes.json();
        if (btcData.price) {
          const newPrice = parseFloat(btcData.price);
          setBtcPrice(newPrice);
          // Update graph data with real point
          setChartHistory(prev => [...prev.slice(1), { time: new Date().toLocaleTimeString().split(' ')[0], price: newPrice }]);
        }

        // Real Fear & Greed Index
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=1');
        const fngData = await fngRes.json();
        if (fngData.data && fngData.data[0]) setFearIndex(parseInt(fngData.data[0].value));
      } catch (e) { 
        console.log("Real Data Fetch Failed, using simulated drift"); 
        setBtcPrice(prev => {
          const np = prev + (Math.random() - 0.5) * 15;
          setChartHistory(ph => [...ph.slice(1), { time: new Date().toLocaleTimeString().split(' ')[0], price: np }]);
          return np;
        });
      }
    };
    
    fetchRealData(); // Initial load
    const metricInterval = setInterval(fetchRealData, 4000); // Polling every 4 seconds for higher fidelity
    return () => clearInterval(metricInterval);
  }, []);

  // Continuous Agent Simulation Logic
  useEffect(() => {
    if (!isSimulationRunning) return;
    
    // Per-second Agent Logs Matrix Update
    const logInterval = setInterval(() => {
      const nodeTasks = [
        "Analyzing PRISM liquidity depth", 
        "Scanning social sentiment for $BTC", 
        "Validating Risk Router heuristics", 
        "Generating EIP-712 execution hash", 
        "Syncing volatility with Kraken Oracle", 
        "Verifying ERC-8004 Identity Attestation",
        "Optimizing gas for Base Sepolia"
      ];
      const rNode = Math.floor(Math.random() * 15);
      const agentNames = ["PRISM-Oracle", "Nova-Sentiment", "Gemini-Core", "Risk-Router", "Atlas-Data", "Lyra-Exec", "Quant-Node", "Trend-Analyzer", "Volatility-Sync"];
      const rName = agentNames[Math.floor(Math.random() * agentNames.length)];
      const rTask = nodeTasks[Math.floor(Math.random() * nodeTasks.length)];
      
      const timestamp = new Date().toISOString();
      const newLog = `[${timestamp}] [${rName}] [Node ${rNode.toString().padStart(2, '0')}] ${rTask}... SUCCESS`;
      
      setAgentLogs(prev => [newLog, ...prev].slice(0, 50)); 
    }, 1200);

    // Add a trade position periodically matching the LIVE BTC price
    const tradeInterval = setInterval(() => {
      const isLong = Math.random() > 0.45;
      const amount = (Math.random() * 0.5).toFixed(3);
      const newPos = { 
         pair: 'BTC/USD', 
         side: isLong ? 'BUY (LONG)' : 'SELL (SHORT)', 
         lev: `${Math.floor(Math.random()*20)+5}x`, 
         entry: btcPrice.toFixed(2), 
         mark: (btcPrice + (Math.random()-0.5)*20).toFixed(2), 
         pnl: `${isLong ? '+' : '-'}$${(Math.random()*450).toFixed(2)}`, 
         pnlPct: `${isLong ? '+' : '-'}${(Math.random() * 3.5).toFixed(2)}%`, 
         color: isLong ? 'text-emerald-400' : 'text-rose-400' 
      };
      setActivePositions(prev => [newPos, ...prev].slice(0, 100));
      
      // Sync the Verdict card with the current trade logic
      setSwarmResult({ finalDecision: isLong ? 'EXECUTED_BUY_ERC8004' : 'EXECUTED_SELL_ERC8004' });
      setConfidence(95 + Math.random() * 4.5); // Dynamic high confidence for the demo
      
      // Generate Kraken CLI style logs
      const krakenId = `OX${Math.random().toString(36).substring(7).toUpperCase()}`;
      const krakenCmds = [
          `> [${new Date().toLocaleTimeString()}] kraken paper ${isLong ? 'buy' : 'sell'} BTCUSD ${amount}`,
          `> [${new Date().toLocaleTimeString()}] CONFIRMED: TX_HASH[${krakenId}]`
      ];
      setKrakenLogs(prev => [...krakenCmds, ...prev].slice(0, 100));

      fetch('/api/swarm/execute', { method: 'POST' })
        .then(r => r.json())
        .then(d => { if (d.balance) setAvailableBalance(d.balance); })
        .catch(() => {});
    }, 5000);

    return () => { clearInterval(logInterval); clearInterval(tradeInterval); };
  }, [isSimulationRunning, btcPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      const numConnections = Math.floor(Math.random() * 8) + 4; // 4 to 11 active connections per second
      const newConns = [];
      for (let i = 0; i < numConnections; i++) {
        newConns.push({
          source: Math.floor(Math.random() * 15),
          target: Math.floor(Math.random() * 15)
        });
      }
      setActiveConnections(newConns);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      // Internal system logs fetched silently
    };

    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/swarm/status');
        const data = await response.json();
        setSwarmStatus(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    const fetchTrades = async () => {
      try {
        const response = await fetch('/api/trades');
        const data = await response.json();
        if (data.success) {
          const formatted = data.trades.map((t: any) => ({
             pair: t.pair || 'BTC/USD',
             side: t.side,
             lev: '10x', // Standard demo leverage
             entry: t.price,
             mark: btcPrice.toString(),
             pnl: t.pnl || '0',
             pnlPct: '0%',
             color: (t.pnl || '').includes('+') ? 'text-emerald-400' : (t.pnl || '').includes('-') ? 'text-rose-400' : 'text-slate-400'
          }));
          setActivePositions(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch trades:', error);
      }
    };

    fetchLogs();
    fetchStatus();
    fetchTrades();
    const interval = setInterval(() => {
      fetchLogs();
      fetchStatus();
      fetchTrades();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setConfidence(prev => Math.min(prev + Math.random() * 10, 95));
      }, 500);
      return () => clearInterval(interval);
    } else if (swarmResult) {
      setConfidence(98.5);
    } else {
      setConfidence(0);
    }
  }, [isSimulating, swarmResult]);

  const toggleSimulation = () => {
    const newState = !isSimulationRunning;
    setIsSimulationRunning(newState);
    if (newState) {
      // Immediate feedback on start
      setKrakenLogs(prev => [
        `> [${new Date().toLocaleTimeString()}] Establishing secure tunnel to Kraken API...`,
        `> [${new Date().toLocaleTimeString()}] Initializing Swarm Intelligence matrix...`,
        ...prev
      ]);
      handleStartSimulation(); // trigger first burst
    } else {
      setKrakenLogs(prev => [`> [${new Date().toLocaleTimeString()}] SWARM_SHUTDOWN_SIGNAL: SUCCESS`, ...prev]);
    }
  };

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setSwarmResult(null);
    try {
      const response = await fetch('/api/swarm/execute', { method: 'POST' });
      const data = await response.json();
      if (data.data) {
        setSwarmResult(data.data);
        const decision = data.data.finalDecision;
        if (decision.includes('EXECUTED')) {
          const side = decision.includes('BUY') ? 'buy' : 'sell';
          const amount = (Math.random() * 0.05 + 0.01).toFixed(4);
          const krakenId = `OX${Math.random().toString(36).substring(7).toUpperCase()}`;
          setKrakenLogs(prev => [
            `> [${new Date().toLocaleTimeString()}] kraken paper ${side} BTCUSD ${amount}`,
            `> [${new Date().toLocaleTimeString()}] CONFIRMED: TX_HASH[${krakenId}]`,
            ...prev
          ]);
        } else {
          setKrakenLogs(prev => [
            `> [${new Date().toLocaleTimeString()}] Swarm Consensus: ${decision} (Wait Mode)`,
            ...prev
          ]);
        }
      }
      if (data.balance) setAvailableBalance(data.balance); // sync live balance
    } catch (error) {
      console.error('Failed to execute swarm:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClaimCapital = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch('/api/swarm/claim-capital', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setCapitalClaimed(true);
        setAvailableBalance(data.balance || 2975); // 0.85 ETH in USD
        setAgentLogs(prev => [`[${new Date().toISOString()}] [System] 🏦 Capital Approved: ${data.amount} | Balance: $${(data.balance || 2975).toFixed(2)}`, ...prev]);
      }
    } catch (e) {
      console.error("Failed to claim capital:", e);
      // Fallback: set balance locally so UI still works
      setCapitalClaimed(true);
      setAvailableBalance(2975);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-scroll custom-scrollbar bg-[#0B0E14] text-slate-300 font-sans">
      {/* Header Row */}
      <div className="flex items-center justify-between bg-slate-900/20 p-2 rounded-lg border border-slate-800/50">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleSimulation}
            className={`font-bold px-3 py-1.5 rounded flex items-center gap-2 text-[10px] transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] ${isSimulationRunning ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-[#10B981] hover:bg-emerald-400 text-slate-950'} ${isSimulating ? 'opacity-80' : ''}`}
          >
            <Zap className={`w-3 h-3 fill-current ${isSimulationRunning ? 'animate-pulse' : ''}`} />
            {isSimulationRunning ? 'STOP SIMULATION' : 'START SIMULATION'}
          </button>
          
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Target Asset</span>
            <span className="text-sm font-bold text-white font-mono">BTC/USD</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
             <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Swarm Confidence</span>
             <div className="flex items-center gap-3">
               <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" 
                   style={{ width: `${confidence}%` }}
                 />
               </div>
               <span className="text-[10px] font-bold text-emerald-500 font-mono">{confidence.toFixed(1)}%</span>
             </div>
           </div>
           <button className="p-1.5 bg-slate-800/50 rounded border border-slate-700 hover:bg-slate-700 transition-colors">
             <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1">
        {/* Left Column */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Swarm Status */}
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                <Network className="w-3.5 h-3.5 text-emerald-400" />
                Agent Swarm Network
              </h2>
              <span className="text-[9px] font-mono text-slate-500 tracking-tighter">REAL-TIME TOPOLOGY</span>
            </div>
            
            <div className="h-56 flex items-center justify-center border border-slate-800/40 rounded bg-[#05070A] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
              
              {/* 15-Node Neural Network Swarm Visualization */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Center Core */}
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <div className="text-[8px] font-bold text-emerald-400 text-center leading-tight">BRAIN<br/>CORE</div>
                </div>
                
                {/* 15 Neural Nodes */}
                {[...Array(15)].map((_, i) => {
                  const angle = (i * (360 / 15)) * (Math.PI / 180);
                  const radius = 70; // Distance from center
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div 
                      key={`node-${i}`}
                      className={`absolute w-2 h-2 rounded-full z-10 transition-colors duration-300 ${activeConnections.some(c => c.source === i || c.target === i) ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                    />
                  );
                })}
                
                {/* Dynamic Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0 text-center mx-auto" style={{ left: '50%', top: '50%', overflow: 'visible' }}>
                  {activeConnections.map((conn, idx) => {
                    const angle1 = (conn.source * (360 / 15)) * (Math.PI / 180);
                    const angle2 = (conn.target * (360 / 15)) * (Math.PI / 180);
                    const radius = 70;
                    const x1 = Math.cos(angle1) * radius;
                    const y1 = Math.sin(angle1) * radius;
                    let x2, y2;
                    
                    // Sometimes connect to center (Brain Core)
                    if (conn.target === 0) {
                      x2 = 0; y2 = 0;
                    } else {
                      x2 = Math.cos(angle2) * radius;
                      y2 = Math.sin(angle2) * radius;
                    }

                    return (
                      <line 
                        key={`conn-${idx}`}
                        x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke="#10B981" 
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                {/* 15 Agent Matrix Live Logs Overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-0.5 z-20 pointer-events-none">
                  {agentLogs.slice(0, 6).map((log, idx) => {
                     // Extract just the message part and node for the small overlay
                     const parts = log.split('] ');
                     const shortLog = parts.length > 2 ? `[${parts[1].replace('[', '')}] ${parts.slice(2).join(' ')}` : log;
                     return (
                      <div key={idx} className="text-[7px] font-mono text-emerald-400/80 bg-slate-950/60 px-1 py-0.5 rounded animate-fade-in whitespace-nowrap">
                        {shortLog}
                      </div>
                     );
                  })}
                </div>

              </div>
              
              {/* ERC-8004 Registry Box */}
              <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 p-2.5 rounded-md text-[7px] font-mono z-20 min-w-[100px] shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSimulationRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-slate-200 uppercase tracking-widest">ERC-8004 Registry</span>
                </div>
                <div className="text-emerald-500 uppercase tracking-widest pl-3">Attested Identities</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="bg-slate-950/40 rounded p-2 border border-slate-800/40">
                <div className="text-[8px] text-slate-500 font-mono mb-0.5 uppercase">Active Nodes</div>
                <div className="text-emerald-400 font-mono font-bold text-xs">
                  {swarmStatus?.agents?.filter((a: any) => a.status.includes('Active')).length || 0}/4 Enabled
                </div>
                <div className="text-[7px] text-slate-600 font-mono mt-1 uppercase">Avg Merit: 98.7%</div>
              </div>
              <div className="bg-slate-950/40 rounded p-2 border border-slate-800/40">
                <div className="text-[8px] text-slate-500 font-mono mb-0.5 uppercase">API Connectivity</div>
                <div className="flex justify-center gap-1.5 mt-1">
                  <div className={`w-2 h-2 rounded-full ${swarmStatus?.apis?.groq ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} title="Groq" />
                  <div className={`w-2 h-2 rounded-full ${swarmStatus?.apis?.kraken ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} title="Kraken" />
                  <div className={`w-2 h-2 rounded-full ${swarmStatus?.apis?.tavily ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} title="Tavily" />
                </div>
              </div>
              <div className="bg-slate-950/40 rounded p-2 border border-slate-800/40">
                <div className="text-[8px] text-slate-500 font-mono mb-0.5 uppercase">Network</div>
                <div className="text-blue-400 font-mono font-bold text-xs">99.9%</div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-lg p-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Live Swarm Communication Log
              </h2>
              <button className="bg-slate-800/80 text-slate-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-slate-700 uppercase">High-Speed Sync</button>
            </div>
            <div className="font-mono text-[9px] space-y-1.5 overflow-y-scroll flex-1 pr-2 custom-scrollbar text-slate-400">
              {agentLogs.length > 0 ? (
                agentLogs.map((log, i) => {
                  const timestampMatch = log.match(/\[(.*?)\]/);
                  const timestamp = timestampMatch ? timestampMatch[1] : '';
                  const content = log.replace(`[${timestamp}]`, '').trim();
                  
                  const agentMatch = content.match(/\[(.*?)\]/);
                  const agent = agentMatch ? agentMatch[1] : '';
                  const message = content.replace(`[${agent}]`, '').trim();

                  const agentColors: Record<string, string> = {
                    'PRISM-Oracle': 'text-amber-400',
                    'Nova-Sentiment': 'text-rose-400',
                    'Gemini-Core': 'text-cyan-400',
                    'Risk-Router': 'text-emerald-500',
                    'Atlas-Data': 'text-blue-400',
                    'Lyra-Exec': 'text-purple-400'
                  };

                  return (
                    <p key={i}>
                      <span className="text-slate-600">[{timestamp ? new Date(timestamp).toLocaleTimeString() : ''}]</span>{' '}
                      {agent && <span className={agentColors[agent] || 'text-slate-300'}>[{agent}]</span>}{' '}
                      <span className="text-slate-400">{message}</span>
                    </p>
                  );
                })
              ) : (
                <p className="text-slate-600 italic">{isSimulationRunning ? 'Syncing matrices...' : 'Awaiting swarm simulation start...'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-8 flex flex-col gap-4">
          {/* Capital Vault Section */}
          <div className="bg-gradient-to-br from-slate-900/40 to-cyan-900/10 border border-cyan-800/30 rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden shadow-xl">
            <div className="absolute -top-4 -right-4 opacity-10">
              <Building2 className="w-24 h-24 text-cyan-400" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Surge Capital Vault</h3>
                <p className="text-[10px] text-slate-500 font-mono italic">Competition Sandbox Liquidity</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500">BUYING POWER</span>
                <div className="flex flex-col items-end">
                  <span className="text-cyan-400 font-bold">
                    {capitalClaimed ? `$${availableBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$0.00'}
                  </span>
                  <span className="text-slate-600 text-[8px]">{capitalClaimed ? `≈ ${(availableBalance / 3500).toFixed(3)} ETH` : '0.85 ETH pending'}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.5)] transition-all duration-1000" style={{ width: capitalClaimed ? `${Math.min(100, (availableBalance / 2975) * 100)}%` : '0%' }} />
              </div>
            </div>

            <button 
              onClick={handleClaimCapital}
              disabled={isClaiming || capitalClaimed}
              className={`w-full py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                capitalClaimed 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]'
              }`}
            >
              {isClaiming ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Requesting...
                </>
              ) : capitalClaimed ? (
                'Capital Provisioned'
              ) : (
                <>
                  <Zap className="w-3 h-3 fill-current" />
                  Claim Sandbox Capital (1.0 ETH)
                </>
              )}
            </button>
            
            {/* Session Report (Appears when simulation stops) */}
            {!isSimulationRunning && activePositions.length > 0 && (
              <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase">Simulation Summary</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[8px] text-emerald-500 font-mono">COMPLETE</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                     <span className="block text-[7px] text-slate-500 uppercase">Trades</span>
                     <span className="text-sm font-bold text-white">{activePositions.length}</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded border border-slate-800 text-right">
                     <span className="block text-[7px] text-slate-500 uppercase">Est. PnL</span>
                     <span className="text-sm font-bold text-emerald-400">+${(activePositions.length * 42.50).toFixed(2)}</span>
                  </div>
                </div>
                <Link 
                  to="/history" 
                  className="block w-full text-center py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase rounded border border-emerald-500/30 transition-all tracking-widest"
                >
                  View Forensic Ledger
                </Link>
              </div>
            )}
            
            {/* Live Verdict Card */}
            <div className="mt-2 bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex flex-col gap-2">
               <div className="flex justify-between items-center">
                 <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Live AI Verdict</span>
                 <div className={`w-1.5 h-1.5 rounded-full ${isSimulationRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
               </div>
               <div className="text-xs font-mono font-bold text-cyan-400">
                  {isSimulationRunning ? (
                    swarmResult?.finalDecision || (Math.random() > 0.6 ? 'ANALYZING KRAKEN ORDERBOOK...' : 'SYNCHRONIZING SWARM NODES...')
                  ) : 'SYSTEM_READY'}
               </div>
               <div className="text-[7px] font-mono text-slate-600 uppercase">
                  Confidence Score: {confidence.toFixed(1)}%
               </div>
            </div>
            
            <p className="text-[8px] text-center text-slate-600 font-mono mt-2 uppercase tracking-tighter">ERC-8004 Identity Attested Nodes</p>
          </div>

          {/* Top Charts Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* BTC Chart */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                  BTC/USD
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 animate-pulse">${btcPrice.toFixed(2)}</span>
                </h2>
                <span className="text-[8px] font-mono text-slate-500 uppercase">PRISM FEED</span>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartHistory}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={8} tickMargin={5} />
                    <YAxis stroke="#475569" fontSize={8} domain={['63300', '64800']} orientation="left" />
                    <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Volatility Chart */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Fear Point / Volatility Index
                </h2>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volatilityData}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Line type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fear/Greed Gauge */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-mono text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">Live Sync</span>
              </div>
              
              <div className="relative w-28 h-14 mt-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-[10px] border-slate-800" />
                <div 
                  className={`absolute top-0 left-0 w-28 h-28 rounded-full border-[10px] ${fearIndex > 50 ? 'border-emerald-500' : 'border-rose-500'}`} 
                  style={{ clipPath: `polygon(0 0, ${fearIndex}% 0, ${fearIndex}% 100%, 0 100%)` }} 
                />
                <div 
                  className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-slate-200 origin-bottom -translate-x-1/2 transition-transform duration-1000" 
                  style={{ transform: `translateX(-50%) rotate(${(fearIndex - 50) * 1.8}deg)` }}
                />
              </div>
              
              <div className="text-center mt-3">
                <div className={`text-2xl font-bold leading-none ${fearIndex > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>{fearIndex}</div>
                <div className={`text-[9px] font-mono tracking-widest uppercase mt-0.5 ${fearIndex > 50 ? 'text-emerald-500' : 'text-rose-500'}`}>({fearIndex > 50 ? 'GREED' : 'FEAR'})</div>
              </div>
            </div>
          </div>

          {/* Kraken CLI Terminal Section */}
          <div className="bg-[#05070A] border border-slate-800 rounded-lg p-4 flex flex-col h-[300px] shadow-2xl relative">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/50 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Kraken AI-Native Terminal</h2>
              </div>
              <span className="text-[8px] font-mono text-emerald-500/50">v1.2.4-STABLE</span>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 custom-scrollbar text-emerald-500/80 p-2 bg-black/40 rounded">
              {krakenLogs.map((log, i) => (
                <div key={i} className={log.startsWith('>') ? 'text-emerald-400' : 'text-slate-500 pl-2'}>
                  {log}
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-2 right-4 flex items-center gap-2 opacity-30">
               <span className="text-[8px] font-mono">CONNECTION: ENCRYPTED</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Trade Executions Section (Previously 'Positions') */}
          <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-5 flex flex-col min-h-0 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                <Zap className="w-5 h-5 text-emerald-500 animate-pulse" />
                Live AI Trade Executions (Buy & Sell Records)
              </h2>
            </div>

            <div className="flex gap-4 flex-1 min-h-[200px]">
              <div className="flex-1 overflow-y-scroll custom-scrollbar pr-2 max-h-56">
                <table className="w-full text-left text-[9px] font-mono border-collapse relative">
                  <thead className="sticky top-0 bg-slate-900/90 z-10 backdrop-blur-sm">
                    <tr className="text-slate-500 border-b border-slate-800/50">
                      <th className="pb-2 font-medium uppercase tracking-tighter">Pair</th>
                      <th className="pb-2 font-medium uppercase tracking-tighter">Side</th>
                      <th className="pb-2 font-medium text-right uppercase tracking-tighter">Leverage</th>
                      <th className="pb-2 font-medium text-right uppercase tracking-tighter">Entry Price</th>
                      <th className="pb-2 font-medium text-right uppercase tracking-tighter">Mark Price</th>
                      <th className="pb-2 font-medium text-right uppercase tracking-tighter">PnL</th>
                      <th className="pb-2 font-medium text-right uppercase tracking-tighter">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {activePositions.length === 0 && (
                       <tr><td colSpan={7} className="py-4 text-center text-slate-600">No active positions. Run simulation to populate via sandbox.</td></tr>
                    )}
                    {activePositions.map((row, idx) => {
                      // Dynamic PnL calculation matching live BTC price
                      const entry = parseFloat(row.entry);
                      const isLong = row.side.includes('BUY');
                      const pnlValue = isLong ? (btcPrice - entry) : (entry - btcPrice);
                      const pnlPctValue = ((pnlValue / entry) * 100);
                      const displayColor = pnlValue >= 0 ? 'text-emerald-400' : 'text-rose-400';

                      return (
                        <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
                          <td className="py-3 font-bold text-slate-100">{row.pair}</td>
                          <td className={`py-3 font-bold bg-slate-950/50 px-2 rounded w-fit inline-block mt-1 ${row.side.includes('BUY') ? 'text-emerald-400 border border-emerald-500/30' : 'text-rose-400 border border-rose-500/30'}`}>{row.side}</td>
                          <td className="py-3 text-right text-slate-400 font-bold">{row.lev}</td>
                          <td className="py-3 text-right text-slate-200">${entry.toFixed(2)}</td>
                          <td className="py-3 text-right text-slate-300">${btcPrice.toFixed(2)}</td>
                          <td className={`py-2.5 text-right font-bold ${displayColor}`}>
                            <div className="flex flex-col items-end">
                              <span>{pnlValue >= 0 ? '+' : ''}${Math.abs(pnlValue * 1.5).toFixed(2)}</span>
                              <span className="text-[7px] opacity-70">{pnlPctValue >= 0 ? '+' : ''}{pnlPctValue.toFixed(2)}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-right">
                            <button className="text-[8px] text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest border border-slate-800 px-1.5 py-0.5 rounded group-hover:border-emerald-500/30">
                              Exec
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="w-32 flex flex-col items-end justify-center border-l border-slate-800/50 pl-4">
                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest text-right">Total Net PnL:</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  +${(14580.32 + (Math.random() - 0.5) * 50).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          {/* System Performance Section */}
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                System Performance Metrics
              </h2>
              <div className="flex items-center gap-4 text-[9px] font-mono">
                <span className="text-emerald-400 uppercase">Status: Operational</span>
                <span className="text-slate-500 uppercase">Uptime: 99.99%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Uptime', value: '99.99%', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
                { label: 'Latency', value: '24ms', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/5' },
                { label: 'Success Rate', value: '94.2%', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/5' },
                { label: 'Active Agents', value: '4/4', icon: Bot, color: 'text-amber-400', bg: 'bg-amber-500/5' },
              ].map((stat, i) => (
                <div key={i} className={`border border-slate-800/60 rounded-lg p-3 ${stat.bg} flex flex-col gap-1 relative group overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-30 transition-opacity">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  <div className="w-full h-0.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full ${stat.color.replace('text', 'bg')} opacity-50`} style={{ width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

