import { AlertCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const TICKER_ITEMS = [
  { type: 'alert', text: '[ATLAS] Initiating cross-chain arbitrage scan on ETH/USDC pairs.' },
  { type: 'up', text: 'BTC/USD +2.4% | Volume spiking on Binance.' },
  { type: 'down', text: 'SOL/USD -1.2% | Network congestion detected.' },
  { type: 'info', text: '[NOVA] Sentiment analysis on Crypto Twitter indicates 78% Bullish bias.' },
  { type: 'alert', text: '[ORION] Executing ERC-8004 signed transaction 0x4f3e...b1d.' },
  { type: 'up', text: 'ETH Gas Fees stable at 12 Gwei.' },
  { type: 'info', text: '[LYRA] Risk parameters updated. Max drawdown set to 2.5%.' },
];

export default function Ticker() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-slate-950 border-t border-slate-800 flex items-center overflow-hidden z-50">
      <div className="flex items-center px-4 bg-emerald-900/40 border-r border-emerald-500/30 h-full z-10 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.5)]">
        <span className="text-emerald-400 font-mono text-xs font-bold whitespace-nowrap flex items-center gap-2">
          <Zap className="w-3 h-3" /> LIVE FEED
        </span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="absolute whitespace-nowrap flex items-center h-full animate-ticker">
          {TICKER_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center mx-8 font-mono text-xs">
              {item.type === 'alert' && <AlertCircle className="w-3 h-3 text-amber-400 mr-2" />}
              {item.type === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400 mr-2" />}
              {item.type === 'down' && <TrendingDown className="w-3 h-3 text-rose-400 mr-2" />}
              {item.type === 'info' && <Zap className="w-3 h-3 text-cyan-400 mr-2" />}
              
              <span className={
                item.type === 'alert' ? 'text-amber-400/90' :
                item.type === 'up' ? 'text-emerald-400/90' :
                item.type === 'down' ? 'text-rose-400/90' :
                'text-cyan-400/90'
              }>
                {item.text}
              </span>
              <span className="mx-8 text-slate-700">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
