# Teammate Setup Guide

Welcome! This guide will help you get the Crypto Brokerage Mini App running on your machine and deployed to Vercel.

---

## 🚀 Quick Setup (15 Minutes)

### Step 1: Clone Repository (1 min)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git

# Navigate to directory
cd crypto-brokerage-miniapp
```

### Step 2: Install Dependencies (3 min)

```bash
# Install all dependencies
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required due to OnchainKit requiring React 19 while we use React 18.

### Step 3: Set Up Environment (2 min)

```bash
# Copy environment template
cp .env.example .env.local

# Open in your editor
code .env.local  # or nano .env.local
```

Add these values:

```env
# Required for local development
NEXT_PUBLIC_URL=http://localhost:3000
NEYNAR_API_KEY=your-neynar-api-key
JWT_SECRET=your-random-secret

# Placeholder for now (will update after deployment)
NEXT_PUBLIC_FARCASTER_HEADER=placeholder
NEXT_PUBLIC_FARCASTER_PAYLOAD=placeholder
NEXT_PUBLIC_FARCASTER_SIGNATURE=placeholder
```

**Get Neynar API Key**:
1. Go to [neynar.com](https://neynar.com)
2. Sign up for free account
3. Create API key
4. Copy and paste into `.env.local`

**Generate JWT Secret**:
```bash
openssl rand -hex 32
```

### Step 4: Run Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the app running! ✅

---

## 📦 Deploy to Vercel (10 Minutes)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find `crypto-brokerage-miniapp` in the list
3. Click **"Import"**

### Step 3: Configure Build Settings

**Important**: Override the install command!

- Framework Preset: **Next.js** (auto-detected)
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: **`npm install --legacy-peer-deps`** ⚠️ (click Override)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_URL` | (leave empty for now) |
| `NEYNAR_API_KEY` | Your Neynar API key |
| `JWT_SECRET` | Your generated secret |
| `NEXT_PUBLIC_FARCASTER_HEADER` | `placeholder` |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | `placeholder` |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | `placeholder` |

Select **Production**, **Preview**, and **Development** for each.

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `your-app.vercel.app`

### Step 6: Update Environment Variables

1. Copy your deployment URL
2. Go to Settings → Environment Variables
3. Edit `NEXT_PUBLIC_URL` and set it to your deployment URL
4. Click **"Save"**
5. Go to Deployments → Click "..." → **"Redeploy"**

---

## 🔗 Generate Farcaster Credentials (5 Minutes)

### Step 1: Disable Deployment Protection

⚠️ **Critical**: Your app must be publicly accessible.

1. In Vercel, go to **Settings** → **Deployment Protection**
2. Toggle **"Vercel Authentication"** to **OFF**
3. Click **"Save"**

### Step 2: Generate Account Association

1. Go to [base.dev/preview](https://base.dev/preview)
2. Paste your Vercel URL (e.g., `your-app.vercel.app`)
3. Click **"Submit"**
4. Go to **"Account Association"** tab
5. Click **"Verify"**
6. Open Warpcast app on your phone
7. Scan QR code or click link
8. Sign the message
9. Return to browser

You'll see three values:
- `header`
- `payload`
- `signature`

### Step 3: Update Vercel Environment Variables

1. Go to Vercel → Settings → Environment Variables
2. Update these three variables:
   - `NEXT_PUBLIC_FARCASTER_HEADER` → paste `header` value
   - `NEXT_PUBLIC_FARCASTER_PAYLOAD` → paste `payload` value
   - `NEXT_PUBLIC_FARCASTER_SIGNATURE` → paste `signature` value
3. Click **"Save"** for each

### Step 4: Redeploy

1. Go to Deployments tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. ⚠️ **UNCHECK** "Use existing Build Cache"
5. Click **"Redeploy"**

Wait for deployment to complete.

---

## ✅ Verify Everything Works

### Check 1: Manifest Endpoint

Visit: `https://your-app.vercel.app/.well-known/farcaster.json`

You should see JSON with:
- `accountAssociation` object
- `frame` metadata

### Check 2: Base Preview Tool

1. Go to [base.dev/preview](https://base.dev/preview)
2. Enter your Vercel URL
3. Check all three tabs:
   - **Embeds**: Frame preview appears ✅
   - **Account Association**: Green checkmark ✅
   - **Metadata**: All fields populated ✅

### Check 3: Test in Warpcast

1. Open Warpcast app
2. Create new cast
3. Paste your Vercel URL
4. You should see Frame preview
5. Tap **"Launch App"** button
6. App should open and work

---

## 🎯 Project Structure

```
crypto-brokerage-miniapp/
├── app/                    # Next.js pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── markets/           # Markets page
│   ├── trade/             # Trade page
│   ├── portfolio/         # Portfolio page
│   └── activity/          # Activity page
├── components/            # React components
│   ├── layout/           # Navigation components
│   ├── screens/          # Screen components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── types.ts          # TypeScript types
│   ├── mock-data.ts      # Mock data generators
│   └── utils.ts          # Utility functions
└── public/                # Static assets
```

---

## 🛠️ Development Workflow

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make your changes
# ... edit files ...

# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "feat: add my feature"

# 5. Push to GitHub
git push -u origin feature/my-feature

# 6. Create Pull Request on GitHub
```

### Deploying Changes

```bash
# Option 1: Merge PR (recommended)
# Merge PR on GitHub → Vercel auto-deploys

# Option 2: Direct push to main
git checkout main
git merge feature/my-feature
git push
# Vercel auto-deploys
```

---

## 📚 Key Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `QUICKSTART.md` | Get started in 5 minutes |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment steps |
| `CI_CD_QUICKSTART.md` | CI/CD pipeline setup |
| `PROJECT_SUMMARY.md` | Technical overview |

---

## 🧪 Testing

### Run Tests Locally

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build

# Run unit tests (when added)
npm test

# Run E2E tests (when added)
npm run test:e2e
```

---

## 🐛 Troubleshooting

### Issue: Dependencies won't install

**Solution**:
```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install --legacy-peer-deps
```

### Issue: Build fails on Vercel

**Solution**:
1. Check Install Command has `--legacy-peer-deps`
2. Verify all environment variables are set
3. Check build logs in Vercel dashboard

### Issue: App doesn't load locally

**Solution**:
```bash
# Kill any process on port 3000
npx kill-port 3000

# Restart dev server
npm run dev
```

### Issue: Frame doesn't show in Warpcast

**Solution**:
1. Verify manifest at `/.well-known/farcaster.json`
2. Check Deployment Protection is OFF
3. Regenerate Farcaster credentials
4. Clear Warpcast cache

---

## 💡 Tips

### Hot Reload
- Changes auto-reload in browser
- API routes require manual refresh
- Environment changes require restart

### VS Code Extensions
Install these for better DX:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Lint code

# Git
git status              # Check status
git log --oneline       # View commits
git branch              # List branches
git checkout -b name    # Create branch

# Vercel
vercel                  # Deploy
vercel --prod           # Deploy to production
vercel logs             # View logs
```

---

## 🎓 Learning Resources

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)

### Farcaster
- [Farcaster Docs](https://docs.farcaster.xyz)
- [Base Mini Apps](https://docs.base.org/mini-apps)

### Vercel
- [Vercel Docs](https://vercel.com/docs)
- [Deployment Guide](https://vercel.com/docs/deployments/overview)

---

## 🤝 Getting Help

### From Your Teammate
- Ask questions in Slack/Discord
- Review PRs together
- Pair program on complex features

### From Documentation
- Check README.md first
- Review DEPLOYMENT_GUIDE.md for deployment issues
- Check PROJECT_SUMMARY.md for architecture

### From Community
- [Base Discord](https://discord.gg/buildonbase)
- [Farcaster Discord](https://discord.gg/farcaster)
- [Next.js Discord](https://discord.gg/nextjs)

---

## ✅ Checklist

### Local Setup
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Dev server running
- [ ] App loads at localhost:3000

### Vercel Deployment
- [ ] Vercel account created
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Deployment URL obtained

### Farcaster Integration
- [ ] Deployment Protection disabled
- [ ] Account association generated
- [ ] Farcaster credentials updated
- [ ] Redeployed without cache
- [ ] Manifest endpoint works
- [ ] Base Preview Tool shows green
- [ ] Frame works in Warpcast

---

## 🎉 You're All Set!

You now have:
- ✅ Local development environment
- ✅ Deployed app on Vercel
- ✅ Farcaster integration working
- ✅ Ready to start building

**Next Steps**:
1. Explore the codebase
2. Make a small change
3. Test locally
4. Push to GitHub
5. Watch it auto-deploy!

**Welcome to the team!** 🚀

If you have any questions, don't hesitate to ask your teammate or check the documentation.

Happy coding! 💻

