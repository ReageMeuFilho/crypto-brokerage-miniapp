# Cast-POS — Farcaster Mini-POS + Lite Treasury for SMBs (Base L2)

## What it does

Cast-POS is a point-of-sale system built on Base L2 that enables SMBs to accept cryptocurrency payments and manage their treasury with minimal setup.

### Core Features

1. **In-Person Payments**: Enter an amount → Generate QR code → Customer scans with their wallet → Pre-filled USDC transfer on Base → Payment confirmed

2. **Remote Pay Links**: Create shareable payment links for DM/SMS/XMTP with one click

3. **Receipts**: App detects payment and shows PAID status with transaction link

4. **Treasury Management**: Simple targets and one-click allocation of surplus to a Reserve wallet

## Why it matters

SMBs can accept on-chain stablecoin payments with no custodian and almost no setup. Treasury gives a clean first step toward automated cash management.

## Standards & Stack

- **Standards**: EIP-681 payment URIs, ERC-20, SIWE (login), ERC-4337 ready
- **Stack**: Next.js 14 Mini-App, Base Sepolia, viem, QRCode, Wagmi
- **Future**: EAS for receipts, alerts/exports, swap/fees (aggregator), sponsored catalogs

## Demo Flow

1. **Connect Wallet**: Connect your merchant wallet in the Mini-App
2. **Accept Payment**: 
   - Navigate to "Accept" tab
   - Enter amount (e.g., $12.50)
   - Show QR code to customer
   - Customer scans → pays → "PAID ✅"
3. **Treasury Management**:
   - Navigate to "Treasury" tab
   - Set operating target (e.g., $1,000)
   - Click "Allocate" → transfers surplus to Reserve wallet

## Setup Instructions

### 1. Environment Configuration

Copy `.env.local` and configure the following variables:

```bash
# Base Sepolia Configuration
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_MERCHANT_ADDRESS=<your_merchant_wallet_address>
NEXT_PUBLIC_USDC_ADDRESS=<usdc_token_address>
NEXT_PUBLIC_RESERVE_ADDRESS=<your_reserve_wallet_address>
NEXT_PUBLIC_BLOCK_EXPLORER=https://sepolia.basescan.org
```

### 2. Deploy Test USDC Token (Optional)

If you need a test USDC token on Base Sepolia, deploy the included `contracts/tUSDC.sol`:

```solidity
// Minimal ERC-20 with mint function for testing
// 6 decimals to match USDC
```

Or use the official Circle test USDC on Base Sepolia.

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` and test the Accept and Treasury features.

## How It Works

### Accept Payment Flow

1. Merchant enters amount in USD
2. App generates EIP-681 payment URI with pre-filled USDC transfer
3. QR code displays the payment URI
4. Customer scans with any compatible wallet (MetaMask, Coinbase Wallet, etc.)
5. Wallet pre-fills the transfer with correct amount and recipient
6. Customer confirms transaction
7. Merchant marks as paid (or auto-detect via event watching)

### Treasury Flow

1. App reads merchant's USDC balance from Base Sepolia
2. Merchant sets operating target (e.g., $1,000)
3. If balance > target, surplus is calculated
4. One-click "Allocate" button transfers surplus to Reserve address
5. Helps maintain optimal cash flow while securing excess funds

## File Structure

```
crypto-brokerage-miniapp/
├── app/
│   ├── accept/
│   │   └── page.tsx              # Accept payment page
│   └── treasury/
│       └── page.tsx              # Treasury management page
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx         # Updated navigation with Accept & Treasury
│   └── screens/
│       ├── AcceptScreen.tsx      # Payment acceptance UI
│       └── TreasuryScreen.tsx    # Treasury management UI
├── lib/
│   ├── chain.ts                  # Chain constants (Base Sepolia)
│   ├── eip681.ts                 # EIP-681 URI generation
│   └── viem-client.ts            # Viem public client
├── contracts/
│   └── tUSDC.sol                 # Test USDC token (optional)
└── .env.local                    # Environment configuration
```

## Next Steps (Post-Hackathon)

1. **Enhanced Payment Detection**: Add event watcher for automatic payment confirmation via USDC Transfer events
2. **Permit2 Integration**: Combine approve+pay in one signature for better UX
3. **Auto-Sweeps**: Automated treasury allocations based on time or balance thresholds
4. **4626 Vault Integration**: Earn yield on reserve funds
5. **1inch Auto-Swap**: Automatically swap to preferred stablecoin
6. **XMTP Bot**: Send invoices and receipts via messaging (`/invoice 12.50`, `/receipt`)
7. **Tips & Tax**: Quick buttons for tip percentages and tax calculation
8. **Invoice Pages**: Shareable `/invoice/[id]` pages with QR and copy link
9. **Merchant Settings**: Currency display (USD/EUR), branding, multiple reserve addresses
10. **EAS Receipts**: On-chain attestations for payment receipts

## Technical Details

### EIP-681 Payment URIs

The app uses EIP-681 standard for payment requests:

```
ethereum:<token>/transfer?address=<merchant>&uint256=<amount>&chain_id=<chainId>
```

This format is supported by most modern wallets and pre-fills the transaction for the customer.

### Treasury Allocation

Simple USDC transfer from merchant wallet to reserve wallet:

```typescript
await client.writeContract({
  address: USDC,
  abi: erc20Abi,
  functionName: "transfer",
  args: [RESERVE, surplusAmount],
  account: merchantAddress,
});
```

## Security Considerations

- Merchant and reserve addresses should be properly secured
- Test thoroughly on Base Sepolia before mainnet deployment
- Consider multi-sig for reserve wallet
- Implement proper access controls for treasury operations
- Monitor for suspicious transactions

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

## License

See LICENSE.md for details.
