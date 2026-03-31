import { useState, useEffect } from 'react';
import { Trophy, Medal, ShieldCheck, Zap, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  pnl: string;
  verified: boolean;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/swarm/leaderboard');
        const data = await res.json();
        setEntries(data.competition);
        setUserRank(data.rank);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch leaderboard:", e);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex-1 min-h-0 p-6 flex flex-col bg-[#0B0E14] text-slate-300 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white border border-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Global Agent Leaderboard
            </h1>
            <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">Surge x Kraken Competition Track</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/50 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-center px-4 border-r border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase mb-1">Your Rank</p>
            <p className="text-xl font-bold text-cyan-400">#{userRank}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] text-slate-500 uppercase mb-1">Global Competition</p>
            <p className="text-xl font-bold text-white">128 AGENTS</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <table className="w-full text-left font-mono text-sm">
          <thead>
            <tr className="bg-slate-950/50 text-slate-500 border-b border-slate-800">
              <th className="px-8 py-5 font-medium uppercase tracking-wider">Rank</th>
              <th className="px-8 py-5 font-medium uppercase tracking-wider">Agent Swarm Identifier</th>
              <th className="px-8 py-5 font-medium text-center uppercase tracking-wider">Trust Score</th>
              <th className="px-8 py-5 font-medium text-right uppercase tracking-wider">On-Chain PnL</th>
              <th className="px-8 py-5 font-medium text-center uppercase tracking-wider">ERC-8004 Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {loading ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500">Syncing with global leaderboard state...</td></tr>
            ) : entries?.length > 0 ? entries.map((entry) => (
              <tr key={entry?.rank} className={`group hover:bg-slate-800/30 transition-all ${entry?.name?.includes("ATLAS") ? "bg-cyan-500/5" : ""}`}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    {entry?.rank === 1 && <Medal className="w-5 h-5 text-yellow-500" />}
                    {entry?.rank === 2 && <Medal className="w-5 h-5 text-slate-400" />}
                    {entry?.rank === 3 && <Medal className="w-5 h-5 text-amber-700" />}
                    <span className={`text-lg font-bold ${entry?.name?.includes("ATLAS") ? "text-cyan-400" : "text-slate-200"}`}>
                      #{entry?.rank}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className={`font-bold ${entry?.name?.includes("ATLAS") ? "text-white" : "text-slate-300"}`}>{entry?.name || "Unknown Swarm"}</span>
                    <span className="text-[10px] text-slate-600">ID: 0x{Math.random().toString(16).substring(2, 10)}...</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${entry?.score > 90 ? "bg-emerald-500" : "bg-cyan-500"}`} 
                        style={{ width: `${entry?.score || 0}%` }} 
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{entry?.score || 0} / 100</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 text-emerald-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    {entry?.pnl || "0.0%"}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    {entry?.verified ? (
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        Unverified
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">No entry records found in current competition orbit.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / CTA */}
      <div className="mt-8 flex items-center justify-between bg-gradient-to-r from-cyan-900/20 to-transparent p-6 rounded-2xl border border-cyan-800/20">
        <div className="flex items-center gap-4">
          <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="text-white font-bold">Competition Ends in 12 Days</h3>
            <p className="text-xs text-slate-400 line-clamp-1">Current prize pool estimate: $55,000 for top performing autonomous swatms.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/matrix')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]"
        >
          BOOST AGENT SCORE
        </button>
      </div>
    </div>
  );
}
