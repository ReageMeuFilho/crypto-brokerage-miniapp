# Vercel Deployment Steps for Crypto Brokerage Mini App

This guide will walk you through deploying your Farcaster Mini App to Vercel for the hackathon.

## Prerequisites Completed ✅

- ✅ Fixed build issues (OnchainKit import, Redis env vars)
- ✅ Updated dependencies to latest compatible versions
- ✅ Added Vercel configuration file
- ✅ Verified local build succeeds
- ✅ Created PR with all changes: https://github.com/ReageMeuFilho/crypto-brokerage-miniapp/pull/1

## Important: CI/CD Configuration Needed

The CI checks are currently failing because they need environment variables and workflow updates. You have two options:

### Option 1: Quick Deploy (Skip CI for now)
Merge the PR and deploy directly to Vercel. The CI can be fixed later.

### Option 2: Fix CI First (Recommended for production)
Update the GitHub repository secrets and workflow file:

1. **Add GitHub Secrets** (Settings > Secrets and variables > Actions):
   ```
   NEYNAR_API_KEY=your-neynar-api-key
   JWT_SECRET=your-jwt-secret
   NEXT_PUBLIC_URL=https://your-app.vercel.app
   NEXT_PUBLIC_FARCASTER_HEADER=placeholder (update after deployment)
   NEXT_PUBLIC_FARCASTER_PAYLOAD=placeholder (update after deployment)
   NEXT_PUBLIC_FARCASTER_SIGNATURE=placeholder (update after deployment)
   VERCEL_TOKEN=your-vercel-token
   VERCEL_ORG_ID=your-vercel-org-id
   VERCEL_PROJECT_ID=your-vercel-project-id
   ```

2. **Update `.github/workflows/pr-checks.yml`**:
   - Change line 29 to allow `devin/` branches: `^(feature|bugfix|hotfix|refactor|devin)/.+`
   - Add environment variables to the "Run ESLint" and "Type check" steps (lines 53-57)

## Step-by-Step Deployment to Vercel

### Step 1: Merge the PR

```bash
# Option A: Merge via GitHub UI
# Go to https://github.com/ReageMeuFilho/crypto-brokerage-miniapp/pull/1
# Click "Merge pull request" (you may need to bypass CI checks)

# Option B: Merge via command line
git checkout main
git merge devin/1760779214-vercel-deployment-setup
git push origin main
```

### Step 2: Deploy to Vercel

#### Via Vercel Dashboard (Easiest):

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `ReageMeuFilho/crypto-brokerage-miniapp`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`

5. **IMPORTANT**: Before deploying, add environment variables:
   - Click "Environment Variables"
   - Add the following (for all environments: Production, Preview, Development):
     ```
     NEXT_PUBLIC_URL=https://your-project-name.vercel.app
     NEYNAR_API_KEY=placeholder
     JWT_SECRET=<generate with: openssl rand -base64 32>
     NEXT_PUBLIC_FARCASTER_HEADER=placeholder
     NEXT_PUBLIC_FARCASTER_PAYLOAD=placeholder
     NEXT_PUBLIC_FARCASTER_SIGNATURE=placeholder
     ```

6. Click "Deploy"

#### Via Vercel CLI (Alternative):

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd /path/to/crypto-brokerage-miniapp
vercel --prod

# Follow the prompts and set environment variables when asked
```

### Step 3: Disable Deployment Protection

**CRITICAL**: This must be done for Farcaster account association to work!

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Deployment Protection**
3. Toggle **"Vercel Authentication"** to **OFF**
4. Click **Save**

### Step 4: Update Environment Variables with Real URL

1. After deployment, note your Vercel URL (e.g., `https://crypto-brokerage-miniapp.vercel.app`)
2. Go to **Settings > Environment Variables**
3. Update `NEXT_PUBLIC_URL` to your actual Vercel URL
4. Click **Save**
5. **Redeploy** the application (Deployments tab > ... > Redeploy)

### Step 5: Generate Farcaster Account Association

1. Visit [base.dev/preview](https://base.dev/preview)
2. Enter your Vercel URL
3. Click **"Verify"**
4. Sign with your Farcaster account via Warpcast mobile app
5. Copy the three generated values:
   - `header`
   - `payload`
   - `signature`

### Step 6: Update Farcaster Credentials

1. Go back to Vercel > **Settings > Environment Variables**
2. Update these three variables:
   ```
   NEXT_PUBLIC_FARCASTER_HEADER=<paste header value>
   NEXT_PUBLIC_FARCASTER_PAYLOAD=<paste payload value>
   NEXT_PUBLIC_FARCASTER_SIGNATURE=<paste signature value>
   ```
3. Click **Save**
4. **Redeploy WITHOUT build cache**:
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Check **"Use existing Build Cache"** to **OFF**
   - Click **"Redeploy"**

### Step 7: Verify Deployment

1. **Test the Manifest**:
   - Visit: `https://your-app.vercel.app/.well-known/farcaster.json`
   - Verify it returns valid JSON with `accountAssociation` data

2. **Test in Base Preview Tool**:
   - Go to [base.dev/preview](https://base.dev/preview)
   - Enter your Vercel URL
   - Check all three tabs:
     - ✅ **Embeds**: Frame preview should appear
     - ✅ **Account Association**: Should show green checkmark
     - ✅ **Metadata**: All fields should be populated

3. **Test in Warpcast**:
   - Open Warpcast app on your phone
   - Create a new cast with your Vercel URL
   - Verify the frame preview appears
   - Tap "Launch App" to test the mini app

### Step 8: Optional - Get a Neynar API Key

For production use, you'll need a real Neynar API key:

1. Go to [neynar.com](https://neynar.com)
2. Sign up and create an API key
3. Update `NEYNAR_API_KEY` in Vercel environment variables
4. Redeploy

## Troubleshooting

### Build Fails on Vercel
- Ensure install command is: `npm install --legacy-peer-deps`
- Check that all required environment variables are set
- Review build logs in Vercel dashboard

### Account Association Fails
- Ensure Deployment Protection is **disabled**
- Verify your app is publicly accessible
- Try generating credentials again at base.dev/preview

### Frame Doesn't Display in Warpcast
- Check manifest is accessible at `/.well-known/farcaster.json`
- Verify all image URLs in manifest are valid
- Clear Warpcast cache and try again

### App Crashes or Shows Errors
- Check Vercel Function Logs for errors
- Verify all environment variables are set correctly
- Test the app directly in a browser first

## Hackathon Submission Checklist

- [ ] App deployed to Vercel
- [ ] Account association verified (green checkmark at base.dev/preview)
- [ ] Frame preview works in Warpcast
- [ ] All screens load and function correctly
- [ ] Tested on mobile device
- [ ] Lighthouse scores > 90 (run in Chrome DevTools)
- [ ] Submit to Base Mini Apps directory at [build.base.org](https://build.base.org)

## Resources

- [Base Mini Apps Quickstart](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [Featured Guidelines](https://docs.base.org/mini-apps/featured-guidelines/overview)
- [Building Viral Mini Apps](https://docs.base.org/mini-apps/growth/build-viral-mini-apps)
- [Minikit Hooks](https://docs.base.org/onchainkit/latest/components/minikit/overview)

## Next Steps After Deployment

1. **Test thoroughly** on multiple devices
2. **Gather feedback** from test users
3. **Monitor performance** via Vercel Analytics
4. **Submit to Base directory** for featured placement
5. **Promote on Farcaster** to gain users

---

**Good luck with the hackathon! 🚀**

If you encounter any issues, refer to the detailed `DEPLOYMENT.md` and `DEPLOYMENT_CHECKLIST.md` files in the repository.
