# Crypto Brokerage - Farcaster Mini App

A production-ready, mobile-first crypto trading platform built as a Farcaster Mini App on Base network. Features real-time market data, portfolio management, order execution, and seamless wallet integration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🚀 Features

- **Real-time Market Data**: Live price quotes, order books, and market statistics
- **Portfolio Management**: Track positions, P&L, and asset allocation with charts
- **Order Execution**: Market, limit, and stop orders with mock execution
- **Activity Tracking**: View order history and transaction records
- **Mobile-First Design**: Optimized for mobile with 48px touch targets and safe area insets
- **Dark Mode**: Full theme support with smooth transitions
- **PWA Support**: Installable progressive web app with offline capabilities
- **Farcaster Integration**: Frame metadata, account association, and notifications

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Vercel account (for deployment)
- Base app account
- Neynar API key (get from [neynar.com](https://neynar.com))
- Upstash Redis instance (optional, for notifications)

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_URL=http://localhost:3000
NEYNAR_API_KEY=your-neynar-api-key
JWT_SECRET=your-random-secret
NEXT_PUBLIC_FARCASTER_HEADER=
NEXT_PUBLIC_FARCASTER_PAYLOAD=
NEXT_PUBLIC_FARCASTER_SIGNATURE=
REDIS_URL=
REDIS_TOKEN=
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment Guide

### Step 1: Deploy to Vercel

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy via Vercel dashboard or CLI
vercel
```

### Step 2: Generate Account Association

1. Visit [base.dev/preview](https://base.dev/preview)
2. Enter your Vercel URL
3. Click "Verify" to generate credentials
4. Add to Vercel environment variables:
   - `NEXT_PUBLIC_FARCASTER_HEADER`
   - `NEXT_PUBLIC_FARCASTER_PAYLOAD`
   - `NEXT_PUBLIC_FARCASTER_SIGNATURE`
5. Redeploy

### Step 3: Test Your Mini App

- Verify at [base.dev/preview](https://base.dev/preview)
- Test embeds and metadata
- Launch in Base app

## 📱 Screens

### Home Dashboard
- Portfolio value with P&L tracking
- Quick actions (Trade, Deposit)
- Top movers and watchlist

### Markets
- Browse all cryptocurrencies
- Real-time prices with sparklines
- Search functionality

### Trade
- Select assets to trade
- Market, limit, and stop orders
- Order preview and confirmation

### Portfolio
- Position tracking
- Allocation pie chart
- Unrealized P&L

### Activity
- Active orders with cancel option
- Transaction history
- Order status tracking

## 🏗️ Architecture

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (mock data)
│   ├── markets/           # Markets page
│   ├── trade/             # Trade page
│   ├── portfolio/         # Portfolio page
│   └── activity/          # Activity page
├── components/
│   ├── layout/            # Navigation components
│   ├── screens/           # Page-level components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utilities and helpers
│   ├── types.ts          # TypeScript definitions
│   ├── mock-data.ts      # Mock data generators
│   ├── utils.ts          # Helper functions
│   └── warpcast.ts       # Manifest generation
└── public/                # Static assets
```

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/markets` | GET | List all markets |
| `/api/quotes/[symbol]` | GET | Get real-time quote |
| `/api/orderbook/[symbol]` | GET | Get order book |
| `/api/orders` | GET, POST, DELETE | Manage orders |
| `/api/portfolio` | GET | Portfolio summary |
| `/api/positions` | GET | List positions |
| `/api/history` | GET | Transaction history |

## 🎨 Design System

- **Colors**: Semantic tokens with dark mode support
- **Typography**: Inter font family
- **Spacing**: 4px base unit
- **Touch Targets**: Minimum 48px
- **Safe Areas**: Device inset support
- **Themes**: Light and dark modes

## 🔐 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Wagmi + OnchainKit
- **Network**: Base (Ethereum L2)
- **Auth**: Neynar Sign-in with Farcaster
- **Notifications**: Redis (Upstash)
- **Charts**: Recharts
- **PWA**: next-pwa

## 📊 Mock Data

The app includes mock data generators for:
- Market prices with sparklines
- Order books (bids/asks)
- Portfolio positions
- Transaction history
- Real-time quotes

Replace with real APIs for production.

## 🧪 Testing

### Manual Testing

- [ ] All screens load correctly
- [ ] Navigation works smoothly
- [ ] Dark mode toggles properly
- [ ] Responsive on mobile devices
- [ ] PWA installs successfully
- [ ] Frame metadata displays

### Performance

Target Lighthouse scores:
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

## 🚀 Production Checklist

- [ ] Replace mock data with real APIs
- [ ] Set up proper authentication
- [ ] Configure Redis notifications
- [ ] Add error tracking (Sentry)
- [ ] Implement rate limiting
- [ ] Test on multiple devices
- [ ] Verify Frame metadata
- [ ] Submit to Base directory

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_URL` | Yes | App URL |
| `NEYNAR_API_KEY` | Yes | Neynar API key |
| `JWT_SECRET` | Yes | Session secret |
| `NEXT_PUBLIC_FARCASTER_HEADER` | Yes* | Account association |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | Yes* | Account association |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | Yes* | Account association |
| `REDIS_URL` | No | Upstash Redis URL |
| `REDIS_TOKEN` | No | Upstash Redis token |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | No | OnchainKit API key |

*Required for production deployment

## 🔗 Resources

- [Base Mini Apps Docs](https://docs.base.org/mini-apps)
- [OnchainKit Docs](https://docs.base.org/onchainkit)
- [Farcaster Docs](https://docs.farcaster.xyz)
- [Neynar API](https://docs.neynar.com)
- [Wagmi Docs](https://wagmi.sh)

## 📄 License

MIT License - see LICENSE.md

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ for the Base ecosystem

