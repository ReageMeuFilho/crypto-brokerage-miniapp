# Complete Deployment Guide - Crypto Brokerage Mini App

This guide will walk you through deploying your Crypto Brokerage Mini App from start to finish, including all prerequisites, configuration, and testing.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Step 1: Prepare Your Code](#step-1-prepare-your-code)
4. [Step 2: Set Up GitHub Repository](#step-2-set-up-github-repository)
5. [Step 3: Deploy to Vercel](#step-3-deploy-to-vercel)
6. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
7. [Step 5: Generate Farcaster Account Association](#step-5-generate-farcaster-account-association)
8. [Step 6: Verify Deployment](#step-6-verify-deployment)
9. [Step 7: Test Your Mini App](#step-7-test-your-mini-app)
10. [Step 8: Submit to Base Directory](#step-8-submit-to-base-directory)
11. [Troubleshooting](#troubleshooting)
12. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before you begin, make sure you have:

### Required Accounts
- [ ] **GitHub Account** - [Sign up here](https://github.com/join)
- [ ] **Vercel Account** - [Sign up here](https://vercel.com/signup)
- [ ] **Farcaster Account** - Download Warpcast app
- [ ] **Neynar Account** - [Sign up here](https://neynar.com)

### Required Tools
- [ ] **Git** installed on your computer
- [ ] **Node.js 18+** installed
- [ ] **Code editor** (VS Code recommended)

### Required Credentials
- [ ] **Neynar API Key** - Get from [neynar.com/dashboard](https://neynar.com)
- [ ] **Upstash Redis** (optional) - For notifications

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] App runs locally without errors (`npm run dev`)
- [ ] All TypeScript errors are resolved
- [ ] Environment variables are documented
- [ ] `.env.local` is in `.gitignore`
- [ ] Build succeeds locally (`npm run build`)
- [ ] No sensitive data in code

---

## Step 1: Prepare Your Code

### 1.1 Test Locally

```bash
# Navigate to project directory
cd crypto-brokerage-miniapp

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Visit `http://localhost:3000` and verify:
- All pages load correctly
- Navigation works
- No console errors
- API endpoints respond

### 1.2 Build for Production

```bash
# Create production build
npm run build

# Test production build
npm start
```

If the build succeeds, you're ready to deploy!

### 1.3 Clean Up

```bash
# Remove development artifacts
rm -rf .next
rm -rf node_modules/.cache

# Verify .gitignore includes:
# - node_modules
# - .next
# - .env.local
# - .env*.local
```

---

## Step 2: Set Up GitHub Repository

### 2.1 Initialize Git (if not already done)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Crypto Brokerage Mini App"
```

### 2.2 Create GitHub Repository

**Option A: Via GitHub Website**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `crypto-brokerage-miniapp`
3. Description: "Farcaster Mini App for crypto trading on Base"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (you already have one)
6. Click **Create repository**

**Option B: Via GitHub CLI**

```bash
# Install GitHub CLI (if not installed)
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login to GitHub
gh auth login

# Create repository
gh repo create crypto-brokerage-miniapp --public --source=. --remote=origin --push
```

### 2.3 Push to GitHub

```bash
# Add remote origin (if using Option A)
git remote add origin https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Verify your code is on GitHub by visiting your repository URL.

---

## Step 3: Deploy to Vercel

### Method A: Vercel Dashboard (Recommended)

#### 3.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. If not connected, click **"Connect GitHub Account"**
5. Authorize Vercel to access your repositories

#### 3.2 Import Your Repository

1. Find `crypto-brokerage-miniapp` in the list
2. Click **"Import"**

#### 3.3 Configure Project

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as default)

**Build Command**: 
```bash
npm run build
```

**Output Directory**: `.next` (auto-detected)

**Install Command**:
```bash
npm install --legacy-peer-deps
```

⚠️ **Important**: Click "Override" next to Install Command and enter the command above with the `--legacy-peer-deps` flag.

#### 3.4 Skip Environment Variables (For Now)

Click **"Deploy"** without adding environment variables yet.

The first deployment will fail - this is expected! We'll add environment variables next.

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? crypto-brokerage-miniapp
# - Directory? ./
# - Override settings? Yes
# - Build Command? npm run build
# - Output Directory? .next
# - Development Command? npm run dev
```

---

## Step 4: Configure Environment Variables

### 4.1 Get Your Neynar API Key

1. Go to [neynar.com](https://neynar.com)
2. Sign in or create account
3. Go to **Dashboard** → **API Keys**
4. Click **"Create New API Key"**
5. Name it "Crypto Brokerage Mini App"
6. Copy the API key

### 4.2 Generate JWT Secret

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - this is your `JWT_SECRET`.

### 4.3 Add Environment Variables in Vercel

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

#### Required Variables

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_URL` | `https://your-app.vercel.app` | Production, Preview, Development |
| `NEYNAR_API_KEY` | Your Neynar API key | Production, Preview, Development |
| `JWT_SECRET` | Your generated secret | Production, Preview, Development |

**To add each variable:**
1. Click **"Add New"**
2. Enter the **Name**
3. Enter the **Value**
4. Select environments: **Production**, **Preview**, **Development**
5. Click **"Save"**

#### Placeholder Variables (Will Update Later)

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_FARCASTER_HEADER` | `placeholder` | Production, Preview, Development |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | `placeholder` | Production, Preview, Development |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | `placeholder` | Production, Preview, Development |

### 4.4 Optional Variables (For Notifications)

If you want to enable notifications, set up Upstash Redis:

1. Go to [upstash.com](https://upstash.com)
2. Create account and new Redis database
3. Copy **REST URL** and **REST TOKEN**
4. Add to Vercel:

| Name | Value | Environment |
|------|-------|-------------|
| `REDIS_URL` | Your Upstash REST URL | Production, Preview, Development |
| `REDIS_TOKEN` | Your Upstash REST TOKEN | Production, Preview, Development |

### 4.5 Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

Your app should now deploy successfully!

---

## Step 5: Generate Farcaster Account Association

This is the **most important step** for Farcaster integration.

### 5.1 Disable Vercel Authentication

⚠️ **Critical**: Your app must be publicly accessible.

1. In Vercel, go to **Settings** → **Deployment Protection**
2. Find **"Vercel Authentication"**
3. Toggle it **OFF**
4. Click **"Save"**

### 5.2 Get Your Deployment URL

1. Go to your Vercel project
2. Copy your deployment URL (e.g., `your-app.vercel.app`)
3. Test it in a browser - make sure it loads

### 5.3 Generate Account Association

**Option A: Base Preview Tool (Recommended)**

1. Go to [base.dev/preview](https://base.dev/preview)
2. Paste your Vercel URL in the input field
3. Click **"Submit"** or press Enter
4. You'll see three tabs: **Embeds**, **Account Association**, **Metadata**

**Check Embeds Tab:**
- You should see a preview of your Frame
- Verify the image and button appear correctly

**Go to Account Association Tab:**
- Click **"Verify"** button
- You'll be prompted to sign with your Farcaster account
- Open Warpcast app on your phone
- Scan the QR code or click the link
- Sign the message in Warpcast
- Return to the browser

**Copy Credentials:**
After signing, you'll see the `accountAssociation` object:

```json
{
  "header": "eyJmaWQ...",
  "payload": "eyJkb21...",
  "signature": "MHhmNGQ..."
}
```

Copy these three values.

**Option B: Warpcast Developer Settings**

1. Open **Warpcast app** on your phone
2. Go to **Settings** → **Developer** → **Domains**
3. Tap **"Add Domain"**
4. Enter your Vercel URL (without https://)
5. Tap **"Generate Domain Manifest"**
6. Copy the three values shown

### 5.4 Update Environment Variables

1. Go back to Vercel → **Settings** → **Environment Variables**
2. Find the three placeholder variables
3. Click **"Edit"** on each one
4. Update with the real values:

| Variable | New Value |
|----------|-----------|
| `NEXT_PUBLIC_FARCASTER_HEADER` | The `header` value |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | The `payload` value |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | The `signature` value |

5. Click **"Save"** for each

### 5.5 Final Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. ✅ Check **"Use existing Build Cache"** - UNCHECK this
5. Click **"Redeploy"**

Wait for deployment to complete.

---

## Step 6: Verify Deployment

### 6.1 Check Manifest Endpoint

Visit: `https://your-app.vercel.app/.well-known/farcaster.json`

You should see JSON output with:
- `accountAssociation` object with your credentials
- `frame` object with app metadata

**Example:**
```json
{
  "accountAssociation": {
    "header": "eyJmaWQ...",
    "payload": "eyJkb21...",
    "signature": "MHhmNGQ..."
  },
  "frame": {
    "version": "1",
    "name": "Crypto Brokerage",
    "iconUrl": "https://your-app.vercel.app/images/icon.png",
    ...
  }
}
```

### 6.2 Verify with Base Preview Tool

1. Go to [base.dev/preview](https://base.dev/preview)
2. Enter your Vercel URL
3. Check all three tabs:

**Embeds Tab:**
- ✅ Frame preview appears
- ✅ "Launch App" button visible
- ✅ Image loads correctly

**Account Association Tab:**
- ✅ Green checkmark appears
- ✅ "Verified" status shown
- ✅ Your FID (Farcaster ID) displayed

**Metadata Tab:**
- ✅ All fields populated correctly
- ✅ No errors or warnings
- ✅ Images load

### 6.3 Test the App Directly

Visit your Vercel URL in a browser:

- [ ] Home page loads
- [ ] Navigation works
- [ ] Markets page shows data
- [ ] Portfolio displays
- [ ] Activity page loads
- [ ] No console errors
- [ ] Dark mode works

---

## Step 7: Test Your Mini App

### 7.1 Test Frame Embed

1. Open **Warpcast** on your phone
2. Create a new cast
3. Paste your Vercel URL
4. You should see a **Frame preview** appear
5. **DO NOT POST YET** - just verify the preview looks good

### 7.2 Test Launch Button

**Option A: From a Cast**

1. Post your URL as a cast (or DM it to yourself)
2. Tap the **"Launch App"** button on the Frame
3. Your Mini App should open in the Base app
4. Test all functionality:
   - Navigate between screens
   - Check data loads
   - Test dark mode
   - Verify wallet connection

**Option B: Direct Launch**

1. Open **Base app** (or Warpcast)
2. Go to **Mini Apps** section
3. Search for your domain
4. Tap to launch

### 7.3 Test on Multiple Devices

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Desktop browser
- [ ] Different screen sizes

### 7.4 Test Core Functionality

- [ ] Sign in with Farcaster works
- [ ] Markets load with prices
- [ ] Portfolio displays correctly
- [ ] Orders can be created
- [ ] Activity shows history
- [ ] Navigation is smooth
- [ ] No errors in console

---

## Step 8: Submit to Base Directory

Once everything is working:

### 8.1 Prepare Submission

1. **Create App Icons**:
   - 192x192px PNG
   - 512x512px PNG
   - Upload to `/public/` folder

2. **Create Screenshots**:
   - 1284x2778px (iPhone format)
   - Take screenshots of all main screens
   - Upload to `/public/images/`

3. **Update Manifest**:
   Edit `lib/warpcast.ts` to include screenshot URLs:
   ```typescript
   screenshotUrls: [
     `${appUrl}/images/screenshot-home.png`,
     `${appUrl}/images/screenshot-markets.png`,
     `${appUrl}/images/screenshot-portfolio.png`,
   ],
   ```

4. **Redeploy** with updated assets

### 8.2 Submit to Base

1. Go to [Base Build Dashboard](https://build.base.org)
2. Sign in with your Farcaster account
3. Click **"Submit Mini App"**
4. Fill out the form:
   - **App Name**: Crypto Brokerage
   - **URL**: Your Vercel URL
   - **Category**: Finance
   - **Description**: Mobile-first crypto trading platform
   - **Tags**: crypto, trading, defi, base
5. Submit for review

### 8.3 Wait for Approval

- Review typically takes 1-3 business days
- You'll receive notification in Warpcast
- Once approved, your app appears in the Base directory

---

## Troubleshooting

### Issue: Build Fails on Vercel

**Error: "Cannot find module"**

**Solution:**
```bash
# Ensure Install Command includes --legacy-peer-deps
npm install --legacy-peer-deps
```

Update in Vercel:
1. Settings → General → Build & Development Settings
2. Override Install Command: `npm install --legacy-peer-deps`
3. Save and redeploy

---

**Error: "Type errors"**

**Solution:**
```bash
# Test build locally first
npm run build

# Fix any TypeScript errors shown
# Then push to GitHub and redeploy
```

---

### Issue: Account Association Fails

**Error: "Domain not accessible"**

**Solution:**
1. Verify Deployment Protection is OFF
2. Test URL in incognito browser
3. Check that `/.well-known/farcaster.json` is accessible
4. Wait 5 minutes and try again (DNS propagation)

---

**Error: "Invalid signature"**

**Solution:**
1. Regenerate account association from scratch
2. Make sure you're using the correct Farcaster account
3. Copy the ENTIRE value (no spaces or line breaks)
4. Update all three variables in Vercel
5. Redeploy WITHOUT build cache

---

### Issue: Frame Doesn't Display

**Error: "No preview shown in Warpcast"**

**Solution:**
1. Verify manifest is accessible: `your-app.vercel.app/.well-known/farcaster.json`
2. Check that `NEXT_PUBLIC_URL` matches your actual URL
3. Ensure all image URLs are valid and accessible
4. Clear Warpcast cache:
   - Settings → Advanced → Clear Cache
5. Try posting URL again

---

**Error: "Launch button doesn't work"**

**Solution:**
1. Check browser console for errors
2. Verify account association is correct
3. Test in Base Preview Tool first
4. Make sure app loads directly in browser
5. Check that all environment variables are set

---

### Issue: App Crashes on Launch

**Error: "White screen" or "Error page"**

**Solution:**
1. Check Vercel deployment logs:
   - Deployments → Click on deployment → View Function Logs
2. Look for runtime errors
3. Verify all environment variables are set
4. Test API endpoints directly:
   - `your-app.vercel.app/api/markets`
   - `your-app.vercel.app/api/portfolio`
5. Check browser console for JavaScript errors

---

### Issue: Slow Performance

**Solution:**
1. Run Lighthouse audit in Chrome DevTools
2. Optimize images (use WebP format)
3. Enable caching headers
4. Implement lazy loading for heavy components
5. Check Vercel Analytics for slow endpoints

---

### Issue: Environment Variables Not Working

**Error: "undefined" values in app**

**Solution:**
1. Verify variables are set in **all environments** (Production, Preview, Development)
2. Variables starting with `NEXT_PUBLIC_` are exposed to browser
3. Other variables are server-side only
4. After changing variables, **redeploy** (changes don't apply to existing deployments)
5. Clear build cache when redeploying

---

## Post-Deployment

### Monitor Your App

**Vercel Analytics:**
1. Go to your project → Analytics
2. Monitor page views, performance, errors

**Vercel Logs:**
1. Go to Deployments → Click deployment → Function Logs
2. Monitor for errors and warnings

**Set Up Error Tracking:**
```bash
# Install Sentry
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Optimize Performance

**Run Lighthouse Audit:**
1. Open your app in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Run audit
5. Fix issues with scores < 90

**Enable Caching:**
Add to `next.config.mjs`:
```javascript
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### Set Up Custom Domain (Optional)

1. **Buy domain** (e.g., from Namecheap, GoDaddy)
2. **Add to Vercel:**
   - Settings → Domains
   - Add your domain
   - Follow DNS instructions
3. **Update environment variables:**
   - Change `NEXT_PUBLIC_URL` to your custom domain
4. **Regenerate account association** with new domain
5. **Redeploy**

### Enable Analytics

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Marketing Your Mini App

1. **Announce on Farcaster:**
   - Post about your launch
   - Share screenshots
   - Explain features

2. **Engage with Community:**
   - Respond to feedback
   - Share updates
   - Build in public

3. **Iterate Based on Feedback:**
   - Monitor user behavior
   - Fix bugs quickly
   - Add requested features

---

## Success Checklist

- [ ] App deployed to Vercel
- [ ] All environment variables set
- [ ] Account association verified
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] Frame preview works in Warpcast
- [ ] Launch button opens app
- [ ] All screens load correctly
- [ ] No console errors
- [ ] Lighthouse scores > 90
- [ ] Tested on mobile devices
- [ ] Submitted to Base directory
- [ ] Announced on Farcaster

---

## Next Steps

1. **Replace Mock Data:**
   - Integrate real cryptocurrency APIs
   - Connect to price feeds
   - Implement real order execution

2. **Add Real Wallet Transactions:**
   - Implement DEX integration
   - Add token swaps
   - Enable real trading

3. **Enhance Features:**
   - Add more cryptocurrencies
   - Implement price alerts
   - Add advanced charts
   - Create watchlists

4. **Scale:**
   - Add database for user data
   - Implement caching
   - Optimize API calls
   - Add rate limiting

---

## Support Resources

- **Base Docs**: https://docs.base.org/mini-apps
- **Vercel Docs**: https://vercel.com/docs
- **Farcaster Docs**: https://docs.farcaster.xyz
- **Neynar Docs**: https://docs.neynar.com
- **Base Preview Tool**: https://base.dev/preview
- **Base Build**: https://build.base.org

---

## Congratulations! 🎉

Your Crypto Brokerage Mini App is now live and accessible to millions of Farcaster users!

Keep iterating, gathering feedback, and improving your app. The Base ecosystem is growing rapidly, and you're now part of it!

**Happy building!** 🚀

