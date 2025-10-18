# Deployment Guide

This guide walks you through deploying the Crypto Brokerage Mini App to production.

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account
- [ ] Neynar API key ([get one here](https://neynar.com))
- [ ] Base app account
- [ ] Upstash Redis instance (optional, for notifications)

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Crypto Brokerage Mini App"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 3. Configure Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

```env
# Required
NEXT_PUBLIC_URL=https://your-app.vercel.app
NEYNAR_API_KEY=your-neynar-api-key
JWT_SECRET=your-random-secret-string

# Will be added after account association
NEXT_PUBLIC_FARCASTER_HEADER=
NEXT_PUBLIC_FARCASTER_PAYLOAD=
NEXT_PUBLIC_FARCASTER_SIGNATURE=

# Optional - for notifications
REDIS_URL=your-upstash-redis-url
REDIS_TOKEN=your-upstash-redis-token

# Optional - for enhanced OnchainKit features
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-api-key
```

**Important**: Make sure to disable Vercel's Deployment Protection:
- Go to Settings > Deployment Protection
- Toggle "Vercel Authentication" to OFF
- Click Save

### 4. Generate Account Association Credentials

1. **Visit the Account Association Tool**:
   - Go to [base.dev/preview](https://base.dev/preview)
   - Or use the [Base Build dashboard](https://build.base.org)

2. **Enter Your App URL**:
   - Paste your Vercel deployment URL (e.g., `your-app.vercel.app`)
   - Click "Submit"

3. **Verify and Generate**:
   - Click the "Verify" button
   - Follow the instructions to sign with your Farcaster account
   - Copy the generated `accountAssociation` object

4. **Update Environment Variables**:
   - Go back to Vercel > Settings > Environment Variables
   - Add the three account association variables:
     ```
     NEXT_PUBLIC_FARCASTER_HEADER=eyJmaWQ...
     NEXT_PUBLIC_FARCASTER_PAYLOAD=eyJkb21...
     NEXT_PUBLIC_FARCASTER_SIGNATURE=MHhmNGQ...
     ```

5. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on the latest deployment
   - Click "Redeploy"

### 5. Verify Your Deployment

1. **Test the Manifest**:
   - Visit `https://your-app.vercel.app/.well-known/farcaster.json`
   - Verify the JSON response includes your account association

2. **Use the Preview Tool**:
   - Go to [base.dev/preview](https://base.dev/preview)
   - Enter your app URL
   - Check all three tabs:
     - **Embeds**: Verify frame preview image and button
     - **Account Association**: Should show green checkmark
     - **Metadata**: Review all manifest fields

3. **Test in Base App**:
   - Open Base app on your phone
   - Cast your app URL
   - Click the frame to launch
   - Test all functionality

### 6. Optional: Set Up Redis Notifications

If you want to enable background notifications:

1. **Create Upstash Redis Instance**:
   - Go to [upstash.com](https://upstash.com)
   - Create a new Redis database
   - Copy the REST URL and token

2. **Add to Environment Variables**:
   ```env
   REDIS_URL=https://your-redis-url.upstash.io
   REDIS_TOKEN=your-redis-token
   ```

3. **Configure Webhook**:
   - Your webhook URL will be: `https://your-app.vercel.app/api/webhook`
   - This is automatically set in the manifest

4. **Test Notifications**:
   - Use the Neynar API to send a test notification
   - Verify it appears in the Base app

### 7. Optional: Custom Domain

1. **Add Domain in Vercel**:
   - Go to Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_URL=https://your-custom-domain.com
   ```

3. **Regenerate Account Association**:
   - Repeat Step 4 with your new domain
   - Update environment variables
   - Redeploy

## Troubleshooting

### Issue: Account Association Fails

**Solution**:
- Ensure Deployment Protection is disabled in Vercel
- Verify your app URL is accessible publicly
- Check that you're signed in with the correct Farcaster account
- Try generating credentials again

### Issue: Frame Doesn't Display

**Solution**:
- Verify manifest is accessible at `/.well-known/farcaster.json`
- Check that all image URLs are valid and accessible
- Ensure `NEXT_PUBLIC_URL` is set correctly
- Clear Farcaster cache and try again

### Issue: App Doesn't Launch

**Solution**:
- Check browser console for errors
- Verify all environment variables are set
- Test the app directly in a browser first
- Check Vercel deployment logs for errors

### Issue: Build Fails on Vercel

**Solution**:
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors locally first
- Verify Node.js version compatibility
- Review Vercel build logs for specific errors

### Issue: Styles Not Loading

**Solution**:
- Verify Tailwind CSS is configured correctly
- Check that `globals.css` is imported in `layout.tsx`
- Clear browser cache
- Check for CSS conflicts in browser dev tools

## Performance Optimization

### 1. Image Optimization

- Use Next.js `<Image>` component for all images
- Provide proper width and height attributes
- Use WebP format when possible
- Implement lazy loading for below-fold images

### 2. Code Splitting

- Use dynamic imports for heavy components
- Implement route-based code splitting
- Lazy load charts and visualizations

### 3. Caching Strategy

- Set appropriate cache headers for static assets
- Use SWR or React Query for data fetching
- Implement service worker caching for PWA

### 4. Bundle Size

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

## Monitoring

### Set Up Error Tracking

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

### Set Up Analytics

```bash
# Install PostHog
npm install posthog-js

# Or use Vercel Analytics
npm install @vercel/analytics
```

## Security Checklist

- [ ] All API routes have proper authentication
- [ ] Environment variables are not exposed to client
- [ ] CORS is configured correctly
- [ ] Rate limiting is implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention (if using database)
- [ ] XSS protection enabled
- [ ] HTTPS enforced

## Post-Deployment

### 1. Submit to Base Mini Apps Directory

1. Go to [Base Build dashboard](https://build.base.org)
2. Verify your mini app
3. Fill out the submission form
4. Wait for review

### 2. Promote Your Mini App

- Share on Farcaster with your app URL
- Create engaging frame previews
- Post updates and new features
- Engage with the community

### 3. Monitor Performance

- Check Vercel Analytics
- Monitor error rates in Sentry
- Track user engagement
- Gather user feedback

## Updating Your App

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically deploy
# Or manually trigger deployment in Vercel dashboard
```

## Rollback

If you need to rollback to a previous version:

1. Go to Vercel > Deployments
2. Find the previous working deployment
3. Click "..." > "Promote to Production"

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review browser console errors
3. Test manifest at base.dev/preview
4. Consult Base Mini Apps documentation
5. Ask in Base developer community

## Next Steps

- Replace mock data with real APIs
- Implement real wallet transactions
- Add more trading features
- Enhance charts and visualizations
- Implement advanced order types
- Add price alerts
- Integrate more cryptocurrencies

---

Congratulations! Your Crypto Brokerage Mini App is now live! 🎉

