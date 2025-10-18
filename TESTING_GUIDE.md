# Cast-POS Testing Guide

## Deployment URL
**Production**: https://crypto-brokerage-miniapp.vercel.app

## Quick Test Links

### 1. Test Farcaster Manifest
**URL**: https://crypto-brokerage-miniapp.vercel.app/.well-known/farcaster.json

**What to verify**:
- JSON response loads successfully
- `frame.name` shows "Cast-POS"
- `frame.subtitle` shows "Accept crypto payments on Base"
- `frame.tags` includes ["payments", "pos", "usdc", "base", "treasury"]

### 2. Test Accept Payment Screen
**URL**: https://crypto-brokerage-miniapp.vercel.app/accept

**What to test**:
1. ✅ Page loads without errors
2. ✅ QR code displays
3. ✅ Amount input field works (try entering different amounts)
4. ✅ Order ID is generated (unique UUID)
5. ✅ Payment link shows full EIP-681 URI
6. ✅ "Copy Link" button copies to clipboard
7. ✅ "View Merchant Token" button opens Base Sepolia explorer
8. ✅ Bottom navigation shows all tabs

**Test the QR Code**:
- The QR code encodes an EIP-681 payment URI
- Format: `ethereum:<token>/transfer?address=<merchant>&uint256=<amount>&chain_id=84532`
- Chain ID 84532 = Base Sepolia
- Amount is in USDC (6 decimals), so $12.50 = 12500000

### 3. Test Treasury Management Screen
**URL**: https://crypto-brokerage-miniapp.vercel.app/treasury

**What to test**:
1. ✅ Page loads without errors
2. ✅ Current USDC Balance displays (will show $0.00 until wallet connected)
3. ✅ Operating Target input works
4. ✅ "No surplus to allocate" button shows when balance ≤ target
5. ✅ Reserve address displays
6. ✅ "How it works" explanation is clear

### 4. Test Wallet Connection (Optional - requires wallet)

**Prerequisites**:
- MetaMask, Coinbase Wallet, or compatible wallet installed
- Switch to Base Sepolia network (Chain ID: 84532)
- Have some test USDC on Base Sepolia

**Steps**:
1. Click "Connect Wallet" in the top header
2. Select your wallet (MetaMask, Coinbase Wallet, or Farcaster Frame)
3. Approve connection
4. Switch to Base Sepolia network if prompted
5. Navigate to Treasury screen
6. Your USDC balance should display

### 5. Test in Farcaster/Warpcast (Full Mini App Test)

**Prerequisites**:
- Warpcast mobile app installed
- Farcaster account

**Steps**:
1. Open Warpcast mobile app
2. Go to Settings > Developer > Mini Apps
3. Add the app URL: `https://crypto-brokerage-miniapp.vercel.app`
4. The app should appear in your mini apps list
5. Open the app from Warpcast
6. Test Accept and Treasury features

**Note**: For full Farcaster integration, you need to:
- Generate account association credentials via Warpcast
- Update environment variables with real credentials
- Redeploy

### 6. Test in Base App

**Prerequisites**:
- Base app installed (if available)
- Or access via base.dev

**Steps**:
1. Open Base app
2. Navigate to mini apps section
3. Search for "Cast-POS" or enter URL
4. Test the Accept and Treasury features

## Browser Testing (Easiest Method)

### Desktop Browser Test
1. Open Chrome/Firefox/Safari
2. Navigate to: https://crypto-brokerage-miniapp.vercel.app
3. Open Developer Tools (F12)
4. Switch to Mobile View (Ctrl+Shift+M or Cmd+Shift+M)
5. Test all features

### Mobile Browser Test
1. Open mobile browser (Safari on iOS, Chrome on Android)
2. Navigate to: https://crypto-brokerage-miniapp.vercel.app
3. Test all features
4. Try scanning the QR code with another device

## Expected Behavior

### Accept Payment Screen
- **Amount Input**: Enter any USD amount (e.g., 12.50, 100.00, 5.99)
- **QR Code**: Updates automatically when amount changes
- **Payment Link**: Shows full EIP-681 URI with:
  - Token address (currently placeholder)
  - Merchant address (currently placeholder)
  - Amount in USDC units (amount × 1,000,000)
  - Chain ID: 84532 (Base Sepolia)

### Treasury Screen
- **Without Wallet**: Shows $0.00 balance
- **With Wallet Connected**: Shows actual USDC balance on Base Sepolia
- **Surplus Calculation**: 
  - If balance > operating target: Shows surplus amount and enables "Allocate" button
  - If balance ≤ operating target: Shows "No surplus to allocate" (disabled)

## Testing with Real Wallet (Advanced)

### Setup
1. Install MetaMask or Coinbase Wallet
2. Add Base Sepolia network:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

3. Get test ETH for Base Sepolia:
   - Visit: https://www.alchemy.com/faucets/base-sepolia
   - Or: https://faucet.quicknode.com/base/sepolia

4. Get test USDC:
   - Deploy the test USDC contract from `contracts/tUSDC.sol`
   - Or use existing test USDC on Base Sepolia

### Test Accept Payment Flow
1. Connect wallet to the app
2. Enter amount (e.g., $10.00)
3. Copy the payment link
4. Open a second wallet/device
5. Paste the payment link
6. Wallet should pre-fill the USDC transfer
7. Confirm transaction
8. Check merchant wallet for received USDC

### Test Treasury Allocation
1. Connect wallet with USDC balance
2. Set operating target (e.g., $100)
3. If balance > $100, "Allocate" button becomes enabled
4. Click "Allocate to Reserve"
5. Approve transaction in wallet
6. Check reserve wallet for received USDC

## Troubleshooting

### QR Code Not Displaying
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Wallet Connection Issues
- Ensure you're on Base Sepolia network
- Check that wallet is unlocked
- Try disconnecting and reconnecting

### Balance Shows $0.00
- Ensure wallet is connected
- Ensure you're on Base Sepolia network (Chain ID: 84532)
- Check that you have USDC on Base Sepolia
- Verify USDC token address is configured correctly

### Manifest Endpoint Not Loading
- Check that deployment is successful
- Verify URL is correct
- Check Vercel deployment logs

## Quick Verification Checklist

- [ ] Home page loads
- [ ] Accept page loads and shows QR code
- [ ] Treasury page loads and shows balance
- [ ] Bottom navigation works (all 5 tabs)
- [ ] Manifest endpoint returns JSON
- [ ] QR code changes when amount changes
- [ ] Copy link button works
- [ ] Mobile responsive design works
- [ ] No console errors (except expected MetaMask warnings)

## Demo Script for Hackathon

### 1. Introduction (30 seconds)
"Cast-POS is a Mini-POS system for SMBs built on Base. It enables merchants to accept USDC payments via QR codes and manage their treasury with simple allocation tools."

### 2. Accept Payment Demo (1 minute)
1. Navigate to Accept page
2. Enter amount: $25.00
3. Show QR code generation
4. Explain: "Customer scans this QR code with any wallet, and it pre-fills the USDC transfer"
5. Show payment link for remote payments
6. Click "Copy Link" to demonstrate sharing

### 3. Treasury Management Demo (1 minute)
1. Navigate to Treasury page
2. Show current balance
3. Set operating target: $1,000
4. Explain: "When balance exceeds target, merchants can allocate surplus to reserve with one click"
5. Show allocation button (enabled/disabled based on surplus)

### 4. Technical Highlights (30 seconds)
- Built with Next.js 14 and Farcaster Mini App SDK
- Uses EIP-681 standard for payment URIs
- Deployed on Base Sepolia testnet
- Mobile-first responsive design
- Compatible with Warpcast and Base app

## Support

For issues or questions:
- Check `E2E_TEST_RESULTS.md` for detailed test results
- Check `MINI_POS_README.md` for setup instructions
- Review browser console for errors
- Check Vercel deployment logs

---

**Last Updated**: October 18, 2025  
**Version**: 1.0.0  
**Deployment**: https://crypto-brokerage-miniapp.vercel.app
