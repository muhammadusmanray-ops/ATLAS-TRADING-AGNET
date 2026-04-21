# ATLAS — Autonomous AI Trading Agent Swarm

A production-grade multi-agent trading system built with **LangGraph**, **React**, **TypeScript**, and **PostgreSQL**. Four specialized AI agents collaborate in a sequential decision pipeline to analyze markets, assess risk, and execute simulated trades — with every action cryptographically signed and permanently logged.

**Live demo:** [atlas-trading-agnet.vercel.app](https://atlas-trading-agnet.vercel.app)

---

## What It Does

ATLAS runs a coordinated swarm of four AI agents, each owning one stage of the trading workflow:

| Agent | Role | Technology |
|---|---|---|
| **Atlas** | Market data — fetches live BTC/ETH prices | CoinGecko API |
| **Nova** | Sentiment — scans news headlines, classifies market mood | Tavily Search + Groq Llama-3 |
| **Orion** | Risk — blocks the trade if volatility conditions fail | Heuristic + PRISM Volatility API |
| **Lyra** | Execution — signs the trade intent via EIP-712, submits order | ERC-8004 + Kraken API |

Every trade decision is stored in PostgreSQL with a SHA-256 audit hash — so every action is traceable and reproducible.

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tooling)
- Tailwind CSS + Framer Motion (UI/animations)
- Recharts (portfolio performance charts)
- React Router v7

**Backend**
- Node.js + Express 5
- LangGraph (agent orchestration DAG)
- Groq SDK — Llama-3.1 8B for sentiment analysis
- Ethers.js v6 — EIP-712 typed data signing (Base Sepolia)
- PostgreSQL via Neon (serverless)

**Infrastructure**
- Vercel (serverless deployment)
- Neon (managed PostgreSQL)
- CoinGecko API (live price feed, no API key needed)

---

## Architecture

```
User Request
    │
    ▼
Express API (/api/swarm/execute)
    │
    ▼
LangGraph Pipeline
  Atlas ──► Nova ──► Orion ──► Lyra
  (price)  (sentiment) (risk) (sign + execute)
    │
    ▼
PostgreSQL (trade log + audit hash)
    │
    ▼
Response → React Dashboard
```

---

## Running Locally

**1. Clone and install**
```bash
git clone https://github.com/doit2win/ATLAS-TRADING-AGNET
cd ATLAS-TRADING-AGNET
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
```

Fill in `.env` — minimum required to run:
```env
GROQ_API_KEY=your_groq_key        # free at console.groq.com
DATABASE_URL=your_neon_db_url     # free at neon.tech
```

Optional (enables full agent pipeline):
```env
TAVILY_API_KEY=your_tavily_key    # for Nova sentiment agent
WALLET_PRIVATE_KEY=your_pk        # for EIP-712 trade signing
KRAKEN_API_KEY=your_kraken_key    # for live exchange execution
```

**3. Start**
```bash
npm run dev
```

Open `http://localhost:3000`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/prices` | Live BTC + ETH prices (CoinGecko, 60s cache) |
| GET | `/api/swarm/status` | Agent status + API connection state |
| GET | `/api/swarm/logs` | Real-time agent activity log |
| GET | `/api/swarm/balance` | Current portfolio balance from DB |
| POST | `/api/swarm/claim-capital` | Initialize sandbox capital (0.85 ETH) |
| POST | `/api/swarm/execute` | Run full agent pipeline, record trade |
| GET | `/api/trades` | Full trade history with audit hashes |
| GET | `/api/swarm/leaderboard` | Agent performance rankings |

---

## Key Design Decisions

**Why LangGraph?**
The agent pipeline is a directed acyclic graph — each node receives state from the previous and passes enriched state forward. This makes the workflow inspectable, testable, and easy to extend (add a new agent node without touching others).

**Why EIP-712 signing?**
Every trade intent is cryptographically signed before execution. This creates a verifiable, tamper-proof record that the AI agent — not a human — authorized the trade. The signature is stored as the audit hash in PostgreSQL.

**Why SHA-256 audit hashes for non-wallet trades?**
When a wallet key isn't configured, ATLAS falls back to SHA-256 hashing the trade parameters (side, amount, price, timestamp). This preserves audit integrity without requiring private key setup in development.

**Balance tracking**
Each trade row stores `balance_delta` — the portfolio value after that trade. Balance queries aggregate this column, making it resilient to server restarts and avoiding fragile string parsing.

---

## Project Structure

```
├── server.ts              # Express API + middleware
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main trading terminal
│   │   ├── AgentMatrix.tsx    # Agent swarm visualization
│   │   ├── TradeHistory.tsx   # Audit log + verification
│   │   └── Leaderboard.tsx    # Performance rankings
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── PriceTicker.tsx
│   └── lib/
│       ├── agents/
│       │   ├── swarm.ts       # LangGraph pipeline definition
│       │   └── onchain.ts     # EIP-712 signing + ERC-8004 identity
│       ├── db.ts              # PostgreSQL connection + schema init
│       └── utils/logger.ts    # Shared logging callback
├── api/
│   └── server.ts              # Vercel serverless entry point
└── .env.example               # All required environment variables
```

---

## What's Next

- [ ] Live Kraken order execution (API keys configured)
- [ ] WebSocket price streaming (replace polling)
- [ ] Portfolio backtesting against historical data
- [ ] Multi-asset support (ETH, SOL, MATIC)
- [ ] Agent memory — persist sentiment history across sessions

---

## License

MIT
