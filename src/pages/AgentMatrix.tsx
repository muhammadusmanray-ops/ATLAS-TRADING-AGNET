import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bot, MessageSquare, Shield, Zap, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AgentMatrix() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [swarmStatus, setSwarmStatus] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/swarm/logs');
        const data = await response.json();
        setLogs(data.logs);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
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

    fetchLogs();
    fetchStatus();
    const interval = setInterval(() => {
      fetchLogs();
      fetchStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    try {
      await fetch('/api/swarm/execute', { method: 'POST' });
    } catch (error) {
      console.error('Failed to execute swarm:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 p-6 flex flex-col bg-[#0B0E14] text-slate-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white border border-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Agent Swarm Matrix
            </h1>
            <p className="text-xs font-mono text-slate-500">LIVE MULTI-AGENT CONSENSUS PROTOCOL</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2 text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'EXECUTING...' : 'TRIGGER SWARM'}
          </button>
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-lg">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400">ERC-8004 ATTESTATION ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left: Live Chat / Debate */}
        <div className="col-span-8 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Live Consensus Debate</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 uppercase">Syncing...</span>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm custom-scrollbar relative scroll-smooth"
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-900/80 to-transparent pointer-events-none z-10" />
            
            {logs.map((log, i) => {
              // ... existing mapping logic ...
              const timestampMatch = log.match(/\[(.*?)\]/);
              const timestamp = timestampMatch ? timestampMatch[1] : '';
              const content = log.replace(`[${timestamp}]`, '').trim();
              const agentMatch = content.match(/\[(.*?)\]/);
              const agent = agentMatch ? agentMatch[1] : '';
              const message = content.replace(`[${agent}]`, '').trim();

              if (!agent || agent === 'System' || agent === 'Network') return null;

              const agentConfig: Record<string, { color: string, iconColor: string, bgColor: string }> = {
                'Atlas': { color: 'text-emerald-400', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
                'Nova': { color: 'text-rose-400', iconColor: 'text-rose-400', bgColor: 'bg-rose-500/10' },
                'Orion': { color: 'text-cyan-400', iconColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
                'Lyra': { color: 'text-purple-400', iconColor: 'text-purple-400', bgColor: 'bg-purple-500/10' },
              };

              const config = agentConfig[agent] || { color: 'text-slate-400', iconColor: 'text-slate-400', bgColor: 'bg-slate-500/10' };

              return (
                <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className={`w-10 h-10 rounded border border-slate-700 flex items-center justify-center shrink-0 ${config.bgColor} relative`}>
                    <Bot className={`w-5 h-5 ${config.iconColor}`} />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-slate-900 shadow-lg">
                      <Shield className="w-1.5 h-1.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${config.color}`}>{agent}</span>
                      <span className="text-[10px] text-slate-600">{new Date(timestamp).toLocaleTimeString()}</span>
                      {swarmStatus?.agents?.find((a: any) => a.name === agent)?.reputation && (
                        <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 ml-auto">
                          Merit: {swarmStatus.agents.find((a: any) => a.name === agent).reputation}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-r-lg rounded-bl-lg border border-slate-800/50 shadow-inner">
                      {message}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div id="scroll-anchor" />

            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                <Bot className="w-12 h-12 animate-bounce" />
                <p className="text-xs uppercase tracking-widest">Awaiting Swarm Communication...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Data Feeds */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Live API Feeds</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-400">TAVILY_NEWS_STREAM</span>
                  <span className={`w-2 h-2 rounded-full ${swarmStatus?.apis?.tavily ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                </div>
                <div className="text-[10px] font-mono text-cyan-400">
                  &gt; Status: {swarmStatus?.apis?.tavily ? 'CONNECTED' : 'NOT CONFIGURED'}<br/>
                  &gt; Sentiment: {swarmStatus?.apis?.tavily ? 'LIVE_STREAMING' : 'OFFLINE'}
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-400">GROQ_LLM_INFERENCE</span>
                  <span className={`w-2 h-2 rounded-full ${swarmStatus?.apis?.groq ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                </div>
                <div className="text-[10px] font-mono text-purple-400">
                  &gt; Status: {swarmStatus?.apis?.groq ? 'CONNECTED' : 'NOT CONFIGURED'}<br/>
                  &gt; Model: llama-3.1-8b-instant
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-400">KRAKEN_EXCHANGE_API</span>
                  <span className={`w-2 h-2 rounded-full ${swarmStatus?.apis?.kraken ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  &gt; Status: {swarmStatus?.apis?.kraken ? 'CONNECTED' : 'NOT CONFIGURED'}<br/>
                  &gt; Mode: {swarmStatus?.apis?.kraken ? 'LIVE_EXECUTION' : 'SIMULATED'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
