import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Ticker from './Ticker';
import PriceTicker from './PriceTicker';
import { Bot, Trophy } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-[#0B0E14] text-slate-300 relative overflow-hidden">
      {/* Top Price Ticker */}
      <PriceTicker />
      
      <Header />
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Floating Agents Button */}
        <button 
          onClick={() => navigate('/matrix')}
          className="fixed left-0 top-[35%] -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-1 rounded-r-lg flex flex-col items-center gap-2 z-50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/30 group"
        >
          <Bot className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-widest">Agents</span>
        </button>

        {/* Floating Leaderboard Button */}
        <button 
          onClick={() => navigate('/leaderboard')}
          className="fixed left-0 top-[65%] -translate-y-1/2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-1 rounded-r-lg flex flex-col items-center gap-2 z-50 transition-all shadow-[0_0_20px_rgba(202,138,4,0.3)] border border-yellow-400/30 group"
        >
          <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-widest">Rank</span>
        </button>

        <Outlet />
      </main>
      
      <Ticker />
    </div>
  );
}
