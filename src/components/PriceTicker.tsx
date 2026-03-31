import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const INITIAL_PRICES = [
  { symbol: 'BTC/USDT', price: '64,250.50', change: '+2.45%', up: true },
  { symbol: 'ETH/USDT', price: '3,450.20', change: '+1.12%', up: true },
  { symbol: 'SOL/USDT', price: '145.80', change: '-0.85%', up: false },
  { symbol: 'BNB/USDT', price: '580.40', change: '+0.30%', up: true },
  { symbol: 'XRP/USDT', price: '0.62', change: '-1.20%', up: false },
  { symbol: 'ADA/USDT', price: '0.45', change: '+0.15%', up: true },
  { symbol: 'DOT/USDT', price: '7.20', change: '-2.10%', up: false },
  { symbol: 'LINK/USDT', price: '18.50', change: '+4.20%', up: true },
];

export default function PriceTicker() {
  const [prices, setPrices] = useState(INITIAL_PRICES);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: (parseFloat(p.price.replace(',', '')) + (Math.random() - 0.5) * 10).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#05070A] border-b border-slate-800 h-7 flex items-center overflow-hidden z-[60] relative">
      <div className="flex items-center h-full animate-ticker whitespace-nowrap">
        {[...prices, ...prices].map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-6 border-r border-slate-800/50 h-full">
            <span className="text-[10px] font-bold text-slate-400 font-mono">{item.symbol}</span>
            <span className="text-[10px] font-mono text-white font-bold">{item.price}</span>
            <div className={`flex items-center gap-1 text-[9px] font-bold font-mono ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
              {item.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
