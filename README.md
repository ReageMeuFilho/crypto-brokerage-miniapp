# Cast-POS: Mini-POS for SMBs

**Accept crypto payments as easily as cash, with built-in treasury management.**

Cast-POS is a Farcaster Mini App that enables small and medium businesses (SMBs) to accept cryptocurrency payments via QR codes and manage their treasury with simple allocation tools. Built on Base Sepolia testnet using USDC.

## Features

### 🔵 Accept Payment
- Generate EIP-681 payment URIs as QR codes for instant wallet pre-filling
- Accept USDC payments on Base Sepolia (low fees, fast settlement)
- Copy payment links for remote payments
- Manual payment confirmation
- View merchant balance on block explorer

### 💚 Treasury Management
- Connect wallet (MetaMask, Coinbase Wallet, Farcaster Frame connector)
- View real-time USDC balance
- Set operating target (minimum balance to maintain)
- One-click surplus allocation to reserve wallet
- On-chain transaction tracking

### 🎯 Key Benefits
- **Zero Custody**: Payments go directly to merchant's wallet
- **Universal Compatibility**: EIP-681 standard works with any wallet
- **Low Fees**: ~$0.01 per transaction on Base Sepolia
- **Fast Settlement**: ~2 seconds transaction finality
- **Farcaster Native**: Social discovery and SIWE authentication

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Blockchain**: Base Sepolia, Viem, Wagmi
- **Farcaster**: @farcaster/miniapp-sdk, Sign-In With Farcaster
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A wallet with Base Sepolia ETH for gas fees
- (Optional) Neynar API key for Farcaster integration

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ReageMeuFilho/crypto-brokerage-miniapp.git cast-pos
cd cast-pos
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure environment variables:

Copy `.env.local` and update with your values:

```bash
# Base Sepolia Configuration
NEXT_PUBLIC_MERCHANT_ADDRESS=0xYourMerchantWallet
NEXT_PUBLIC_RESERVE_ADDRESS=0xYourReserveWallet
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# For production deployment, also configure .env.production with:
# - NEXT_PUBLIC_URL (your deployed URL)
# - NEXT_PUBLIC_FARCASTER_* credentials (from Warpcast)
# - JWT_SECRET (random 256-bit secret)
# - NEYNAR_API_KEY (from neynar.com)
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Getting Test USDC on Base Sepolia

**Option 1: Use Existing Test USDC**
- USDC Contract: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (Base Sepolia)
- Get test USDC from Base Sepolia faucets

**Option 2: Deploy Your Own Test Token**
- Use the `tUSDC.sol` contract from the PRD
- Deploy via Remix or Hardhat
- Mint tokens to your test wallet

## Usage

### For Merchants

1. **Accept Payments**:
   - Navigate to "Accept Payment"
   - Enter amount in USD
   - Show QR code to customer
   - Customer scans with wallet and confirms
   - Click "Mark as Paid" when complete

2. **Manage Treasury**:
   - Navigate to "Treasury"
   - Connect your wallet
   - View current USDC balance
   - Set operating target (e.g., $1,000)
   - Click "Allocate to Reserve" to transfer surplus

### For Customers

1. Open your wallet app (MetaMask, Coinbase Wallet, etc.)
2. Scan the merchant's QR code
3. Verify the pre-filled transaction details
4. Confirm the USDC transfer
5. Transaction settles on Base Sepolia in ~2 seconds

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy with build command: `npm run build`
5. Install command: `npm install --legacy-peer-deps`

### Farcaster Integration

After deployment, enable Farcaster integration:

1. Visit your deployed app URL
2. Use `base.dev/preview` tool to test
3. Open Warpcast mobile app
4. Go to Settings → Developer → Domains
5. Add your domain and sign account association request
6. Copy generated credentials (HEADER, PAYLOAD, SIGNATURE)
7. Update Vercel environment variables:
   - `NEXT_PUBLIC_FARCASTER_HEADER`
   - `NEXT_PUBLIC_FARCASTER_PAYLOAD`
   - `NEXT_PUBLIC_FARCASTER_SIGNATURE`
8. Redeploy: `vercel --prod --yes --force`
9. Verify manifest endpoint: `/.well-known/farcaster.json`

## Project Structure

```
cast-pos/
├── app/
│   ├── accept/          # Accept Payment page
│   ├── treasury/        # Treasury Management page
│   ├── api/             # API routes (auth, users)
│   ├── page.tsx         # Home page
│   └── layout.tsx       # Root layout
├── components/
│   ├── Home/            # Home screen component
│   ├── pages/           # Page wrappers
│   └── providers.tsx    # Context providers
├── contexts/
│   ├── miniapp-context.tsx         # Farcaster MiniApp state
│   ├── miniapp-wallet-context.tsx  # Wagmi configuration
│   └── user-context.tsx            # User authentication
├── lib/
│   ├── utils.ts         # Utility functions (EIP-681, formatting)
│   ├── env.ts           # Environment validation
│   └── warpcast.ts      # Farcaster manifest
├── .env.local           # Local development config
├── .env.production      # Production config
└── next.config.mjs      # Next.js configuration
```

## Key Functions

### EIP-681 URI Generation

```typescript
buildEip681Erc20(
  tokenAddress: string,
  recipientAddress: string,
  amount: bigint,
  chainId: number
): string
```

Generates EIP-681 payment URI for QR code display.

### Treasury Allocation

```typescript
// Read balance
const balance = await publicClient.readContract({
  address: usdcAddress,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [merchantAddress],
});

// Transfer surplus
const hash = await walletClient.writeContract({
  address: usdcAddress,
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [reserveAddress, surplus],
});
```

## Configuration

### Wagmi Configuration

Supports Base Sepolia and Base mainnet with multiple wallet connectors:
- Farcaster Frame connector
- MetaMask
- Coinbase Wallet

### Next.js Configuration

- Minification disabled to avoid Farcaster SDK worker issues
- Transpiles `@farcaster/miniapp-sdk` package
- Fallback configuration for client-side builds

## Troubleshooting

### Build Fails with HeartbeatWorker Error

The Farcaster SDK includes a worker file that causes Terser minification issues. This is resolved by disabling minification in `next.config.mjs`:

```javascript
swcMinify: false,
webpack: (config) => {
  config.optimization = {
    ...config.optimization,
    minimize: false,
  };
  return config;
}
```

### Wallet Connection Issues

- Ensure you're on Base Sepolia network (Chain ID: 84532)
- Check that your wallet has Base Sepolia ETH for gas
- Try disconnecting and reconnecting wallet

### QR Code Not Generating

- Verify `NEXT_PUBLIC_MERCHANT_ADDRESS` is set correctly
- Ensure `NEXT_PUBLIC_USDC_ADDRESS` is valid
- Check browser console for errors

## Development

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see LICENSE.md for details

## Resources

- [Farcaster Mini App Starter](https://github.com/builders-garden/farcaster-miniapp-starter)
- [Base QuickStart Guide](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [EIP-681 Specification](https://eips.ethereum.org/EIPS/eip-681)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

## Support

For questions or issues:
- GitHub Issues: [crypto-brokerage-miniapp/issues](https://github.com/ReageMeuFilho/crypto-brokerage-miniapp/issues)
- Developer: Wesley Rios (wesley.f.rios@gmail.com)
- Devin Session: https://app.devin.ai/sessions/9866e0cc23224e04a6b02cfa7f832223

## Acknowledgments

Built on top of the [Farcaster Mini App Starter](https://github.com/builders-garden/farcaster-miniapp-starter) template by Builders Garden.

---

**Cast-POS** - Accept crypto like cash 💰
