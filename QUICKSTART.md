# Quick Start Guide

Get your Crypto Brokerage Mini App running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or pnpm
- A Neynar API key ([get free key](https://neynar.com))

## Installation

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required because OnchainKit requires React 19 while the project uses React 18.

### 2. Set Up Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_URL=http://localhost:3000
NEYNAR_API_KEY=your-neynar-api-key-here
JWT_SECRET=any-random-string-here
NEXT_PUBLIC_FARCASTER_HEADER=
NEXT_PUBLIC_FARCASTER_PAYLOAD=
NEXT_PUBLIC_FARCASTER_SIGNATURE=
```

**Get Your Neynar API Key**:
1. Go to [neynar.com](https://neynar.com)
2. Sign up for a free account
3. Create a new API key
4. Copy and paste it into `.env.local`

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You'll See

### Home Screen
- Portfolio value with P&L tracking
- Quick action buttons (Trade, Deposit)
- Top movers section
- Watchlist (empty by default)

### Markets Screen
- List of cryptocurrencies (BTC, ETH, SOL, USDC)
- Real-time prices with sparklines
- Search functionality
- 24h price changes

### Trade Screen
- Popular assets for quick trading
- Search to find specific assets
- Link to browse all markets

### Portfolio Screen
- Total portfolio value
- P&L tracking
- Allocation pie chart
- Individual positions

### Activity Screen
- Active orders with cancel option
- Transaction history
- Order status tracking

## Test the App

### 1. Browse Markets
- Click "Markets" in the bottom navigation
- Search for "BTC" or "ETH"
- Click on any asset to view details (coming soon)

### 2. View Portfolio
- Click "Portfolio" in the bottom navigation
- See mock positions and allocation
- View P&L calculations

### 3. Check Activity
- Click "Activity" in the bottom navigation
- Toggle between "Orders" and "History"
- Try canceling a pending order

### 4. Toggle Dark Mode
- Look for the theme toggle (if implemented)
- Or use your system's dark mode setting

## Understanding Mock Data

The app currently uses **mock data** for demonstration:

- **Prices**: Simulated with random fluctuations
- **Orders**: Pre-populated sample orders
- **Portfolio**: Mock positions with fake P&L
- **History**: Sample transaction records

All data resets when you refresh the page.

## Next Steps

### For Local Development

1. **Customize Mock Data**:
   - Edit `lib/mock-data.ts`
   - Add more cryptocurrencies
   - Adjust price ranges

2. **Modify UI**:
   - Edit components in `components/`
   - Update styles in `app/globals.css`
   - Customize colors in `tailwind.config.ts`

3. **Add Features**:
   - Create new pages in `app/`
   - Add new API routes in `app/api/`
   - Build new components

### For Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

**Quick Deploy to Vercel**:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Dependencies Won't Install

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install --legacy-peer-deps
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Press: Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
# Type: "TypeScript: Restart TS Server"
```

### App Won't Start

1. Check that Node.js version is 18+:
   ```bash
   node --version
   ```

2. Verify `.env.local` exists and has required variables

3. Check terminal for error messages

4. Try deleting `.next` folder:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Development Tips

### Hot Reload
- Changes to files automatically reload the browser
- API route changes require manual refresh
- Environment variable changes require restart

### VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## Project Structure Overview

```
crypto-brokerage-miniapp/
├── app/              # Pages and API routes
├── components/       # React components
├── contexts/         # React contexts
├── lib/             # Utilities and helpers
├── public/          # Static assets
└── .env.local       # Environment variables
```

## Key Files to Know

- `app/page.tsx` - Home page
- `app/layout.tsx` - Root layout
- `components/providers.tsx` - Context providers
- `lib/mock-data.ts` - Mock data generators
- `lib/types.ts` - TypeScript types
- `lib/utils.ts` - Utility functions
- `tailwind.config.ts` - Tailwind configuration

## Getting Help

- **Documentation**: See [README.md](./README.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Info**: See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## What's Next?

1. ✅ **You're running the app locally!**
2. 📝 Explore the code and make changes
3. 🚀 Deploy to Vercel when ready
4. 🔗 Integrate real APIs for production
5. 🎉 Launch your crypto brokerage!

---

**Happy coding!** 🚀

If you have questions, check the full README.md or open an issue on GitHub.

