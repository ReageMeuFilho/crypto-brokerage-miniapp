# Deployment Checklist

Use this checklist to ensure you complete all deployment steps correctly.

---

## Pre-Deployment

### Local Testing
- [ ] App runs locally without errors (`npm run dev`)
- [ ] All pages load correctly
- [ ] Navigation works smoothly
- [ ] No TypeScript errors
- [ ] Production build succeeds (`npm run build`)
- [ ] Production server runs (`npm start`)

### Code Preparation
- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in code
- [ ] All dependencies in `package.json`
- [ ] README.md is complete
- [ ] Code is committed to git

---

## GitHub Setup

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Repository is accessible (public or private)
- [ ] Latest commit is on `main` branch

---

## Vercel Deployment

### Initial Setup
- [ ] Vercel account created
- [ ] Vercel connected to GitHub
- [ ] Project imported from GitHub
- [ ] Framework preset: Next.js
- [ ] Install command: `npm install --legacy-peer-deps`
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### First Deployment
- [ ] Initial deployment triggered
- [ ] Deployment URL obtained
- [ ] Deployment Protection disabled
- [ ] App accessible at Vercel URL

---

## Environment Variables

### Required Variables
- [ ] `NEXT_PUBLIC_URL` - Your Vercel URL
- [ ] `NEYNAR_API_KEY` - From neynar.com
- [ ] `JWT_SECRET` - Random generated string

### Farcaster Variables (Placeholder First)
- [ ] `NEXT_PUBLIC_FARCASTER_HEADER` - Set to "placeholder"
- [ ] `NEXT_PUBLIC_FARCASTER_PAYLOAD` - Set to "placeholder"
- [ ] `NEXT_PUBLIC_FARCASTER_SIGNATURE` - Set to "placeholder"

### Optional Variables
- [ ] `REDIS_URL` - Upstash Redis URL (if using notifications)
- [ ] `REDIS_TOKEN` - Upstash Redis token (if using notifications)
- [ ] `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - OnchainKit API key (optional)

### Environment Setup
- [ ] All variables added to Vercel
- [ ] Variables set for Production, Preview, Development
- [ ] App redeployed after adding variables
- [ ] Deployment successful

---

## Account Association

### Preparation
- [ ] Deployment Protection is OFF in Vercel
- [ ] App is publicly accessible
- [ ] Manifest endpoint works: `/.well-known/farcaster.json`
- [ ] Farcaster account ready

### Generation
- [ ] Visited base.dev/preview
- [ ] Entered Vercel URL
- [ ] Clicked "Verify" button
- [ ] Signed with Farcaster account (via Warpcast)
- [ ] Copied `header` value
- [ ] Copied `payload` value
- [ ] Copied `signature` value

### Update Variables
- [ ] Updated `NEXT_PUBLIC_FARCASTER_HEADER` in Vercel
- [ ] Updated `NEXT_PUBLIC_FARCASTER_PAYLOAD` in Vercel
- [ ] Updated `NEXT_PUBLIC_FARCASTER_SIGNATURE` in Vercel
- [ ] Redeployed WITHOUT build cache
- [ ] Deployment successful

---

## Verification

### Manifest Check
- [ ] Visited `your-app.vercel.app/.well-known/farcaster.json`
- [ ] JSON response includes `accountAssociation`
- [ ] JSON response includes `frame` metadata
- [ ] All image URLs are valid
- [ ] No errors in JSON structure

### Base Preview Tool
- [ ] Visited base.dev/preview
- [ ] Entered Vercel URL
- [ ] **Embeds Tab**: Frame preview appears
- [ ] **Embeds Tab**: "Launch App" button visible
- [ ] **Embeds Tab**: Image loads correctly
- [ ] **Account Association Tab**: Green checkmark
- [ ] **Account Association Tab**: "Verified" status
- [ ] **Account Association Tab**: FID displayed
- [ ] **Metadata Tab**: All fields populated
- [ ] **Metadata Tab**: No errors or warnings

### Direct App Testing
- [ ] Home page loads
- [ ] Markets page shows data
- [ ] Trade page works
- [ ] Portfolio displays correctly
- [ ] Activity page loads
- [ ] Bottom navigation works
- [ ] Top header displays
- [ ] Dark mode toggles
- [ ] No console errors
- [ ] Mobile responsive

---

## Frame Testing

### Warpcast Preview
- [ ] Opened Warpcast app
- [ ] Created new cast with your URL
- [ ] Frame preview appears
- [ ] Image displays correctly
- [ ] Button text is correct
- [ ] Preview looks professional

### Launch Test
- [ ] Posted cast (or sent DM to self)
- [ ] Tapped "Launch App" button
- [ ] App opens in Base/Warpcast
- [ ] All screens accessible
- [ ] Navigation works
- [ ] Data loads correctly
- [ ] No errors or crashes

### Multi-Device Testing
- [ ] Tested on iPhone
- [ ] Tested on Android
- [ ] Tested on desktop browser
- [ ] Tested in different screen sizes
- [ ] All devices work correctly

---

## Performance

### Lighthouse Audit
- [ ] Ran Lighthouse in Chrome DevTools
- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 90
- [ ] Best Practices score ≥ 90
- [ ] SEO score ≥ 90
- [ ] Fixed any critical issues

### Load Testing
- [ ] App loads in < 3 seconds
- [ ] Images load quickly
- [ ] API responses are fast
- [ ] No layout shifts
- [ ] Smooth animations

---

## Submission (Optional)

### Prepare Assets
- [ ] Created app icon (192x192px)
- [ ] Created app icon (512x512px)
- [ ] Created screenshots (1284x2778px)
- [ ] Uploaded icons to `/public/`
- [ ] Uploaded screenshots to `/public/images/`
- [ ] Updated manifest with screenshot URLs
- [ ] Redeployed with new assets

### Submit to Base
- [ ] Visited build.base.org
- [ ] Signed in with Farcaster
- [ ] Clicked "Submit Mini App"
- [ ] Filled out submission form
- [ ] Provided app name and description
- [ ] Selected category (Finance)
- [ ] Added tags
- [ ] Submitted for review

### Post-Submission
- [ ] Received confirmation
- [ ] Monitoring for approval notification
- [ ] Ready to respond to feedback

---

## Post-Deployment

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Checking deployment logs regularly
- [ ] Monitoring error rates
- [ ] Tracking user engagement

### Optimization
- [ ] Set up error tracking (Sentry)
- [ ] Enabled caching headers
- [ ] Optimized images
- [ ] Implemented lazy loading

### Marketing
- [ ] Announced on Farcaster
- [ ] Shared screenshots
- [ ] Engaged with community
- [ ] Gathered user feedback

### Iteration
- [ ] Monitoring user behavior
- [ ] Fixing bugs promptly
- [ ] Planning new features
- [ ] Responding to feedback

---

## Success Criteria

All items below should be checked:

- [ ] ✅ App is live on Vercel
- [ ] ✅ All environment variables configured
- [ ] ✅ Account association verified
- [ ] ✅ Frame preview works in Warpcast
- [ ] ✅ Launch button opens app successfully
- [ ] ✅ All screens function correctly
- [ ] ✅ No critical errors
- [ ] ✅ Lighthouse scores > 90
- [ ] ✅ Tested on multiple devices
- [ ] ✅ Ready for users

---

## Common Issues Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Build fails | Check Install Command has `--legacy-peer-deps` |
| Account association fails | Disable Deployment Protection in Vercel |
| Frame doesn't show | Verify manifest at `/.well-known/farcaster.json` |
| App crashes | Check Vercel Function Logs for errors |
| Slow performance | Run Lighthouse audit and optimize |
| Env vars not working | Redeploy after changing variables |

---

## Need Help?

- [ ] Checked DEPLOYMENT_GUIDE.md
- [ ] Reviewed troubleshooting section
- [ ] Tested in base.dev/preview
- [ ] Checked Vercel logs
- [ ] Consulted Base documentation

---

## Completion

**Deployment Date**: _______________

**Deployed URL**: _______________

**Farcaster FID**: _______________

**Status**: 
- [ ] Deployed
- [ ] Verified
- [ ] Tested
- [ ] Submitted
- [ ] Live

---

**Congratulations! Your Mini App is deployed!** 🎉

Keep this checklist for future deployments and updates.

