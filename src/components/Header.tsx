import { Activity, Clock, Network, LayoutDashboard, History, Bot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Agent Matrix', path: '/matrix', icon: Bot },
    { name: 'Trade History', path: '/history', icon: History },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0B0E14]/90 backdrop-blur-sm z-50 relative">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-emerald-400 font-mono text-sm group">
          <Activity className="w-4 h-4 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="font-bold tracking-wider">ATLAS | Swarm Intelligence Core</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500">Network: ACTIVE (Live Sync)</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-slate-300">
            {time.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })} PKT+5
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
          <Network className="w-3.5 h-3.5" />
          <span>Epoch: 1629</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">U</div>
        </div>
      </div>
    </header>
  );
}
