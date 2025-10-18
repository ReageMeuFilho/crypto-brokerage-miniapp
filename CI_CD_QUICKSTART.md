# CI/CD Quick Start Guide

Get your CI/CD pipeline running in 10 minutes!

---

## Prerequisites

- [ ] Code pushed to GitHub
- [ ] Vercel account connected to GitHub
- [ ] GitHub CLI installed (optional, for script)

---

## Step 1: Set Up GitHub Secrets (5 minutes)

### Option A: Using the Script (Recommended)

```bash
# Run the setup script
./scripts/setup-github-secrets.sh
```

The script will prompt you for all required values.

### Option B: Manual Setup

Go to GitHub → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | How to Get |
|-------------|------------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Run `vercel link` then `cat .vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same as above |
| `NEYNAR_API_KEY` | neynar.com → Dashboard → API Keys |
| `JWT_SECRET` | Run `openssl rand -hex 32` |
| `NEXT_PUBLIC_URL` | Your Vercel URL |
| `NEXT_PUBLIC_FARCASTER_HEADER` | Set to "placeholder" initially |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | Set to "placeholder" initially |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | Set to "placeholder" initially |

---

## Step 2: Push Workflows to GitHub (1 minute)

```bash
# Add workflow files
git add .github/

# Commit
git commit -m "ci: add GitHub Actions workflows"

# Push
git push
```

---

## Step 3: Watch Your First Build (2 minutes)

1. Go to GitHub → Actions tab
2. You'll see "CI/CD Pipeline" workflow running
3. Click on it to watch progress
4. Wait for all jobs to complete (✅ green checkmarks)

---

## Step 4: Update Farcaster Secrets (2 minutes)

After your first successful deployment:

1. Go to [base.dev/preview](https://base.dev/preview)
2. Enter your Vercel URL
3. Click "Verify" and sign with Farcaster
4. Copy the three credentials
5. Update GitHub secrets:
   - `NEXT_PUBLIC_FARCASTER_HEADER`
   - `NEXT_PUBLIC_FARCASTER_PAYLOAD`
   - `NEXT_PUBLIC_FARCASTER_SIGNATURE`
6. Push a new commit to trigger redeploy

---

## What Happens Now?

### On Every Push to `main`:

```
1. Code Quality Check (ESLint, TypeScript)
   ↓
2. Build Application
   ↓
3. Deploy to Vercel (Production)
   ↓
4. Success! ✅
```

### On Every Pull Request:

```
1. Validate PR (title, branch name)
   ↓
2. Code Quality Check
   ↓
3. Build Application
   ↓
4. Deploy Preview
   ↓
5. Comment with preview URL
   ↓
6. Ready for review! ✅
```

### On Version Tags (v1.0.0):

```
1. Generate Changelog
   ↓
2. Create GitHub Release
   ↓
3. Deploy to Production
   ↓
4. Released! 🎉
```

---

## Common Workflows

### Creating a Feature

```bash
# Create feature branch
git checkout -b feature/new-trading-ui

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "feat: add new trading UI"

# Push
git push -u origin feature/new-trading-ui

# Create PR on GitHub
gh pr create --title "feat: add new trading UI" --body "Description"

# CI will automatically:
# - Run checks
# - Build the app
# - Deploy a preview
# - Comment with preview URL
```

### Deploying to Production

```bash
# Merge PR to main (via GitHub UI)
# Or directly push to main:

git checkout main
git merge feature/new-trading-ui
git push

# CI will automatically:
# - Run all checks
# - Build the app
# - Deploy to production
```

### Creating a Release

```bash
# Tag a version
git tag v1.0.0

# Push tag
git push --tags

# CI will automatically:
# - Generate changelog
# - Create GitHub release
# - Deploy to production
```

---

## Monitoring Your Pipeline

### GitHub Actions Dashboard

View all workflows:
```
https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp/actions
```

### Vercel Dashboard

View deployments:
```
https://vercel.com/YOUR_USERNAME/crypto-brokerage-miniapp
```

### Check Build Status

Add badge to README.md:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp/actions/workflows/ci-cd.yml/badge.svg)
```

---

## Troubleshooting

### Build Fails

**Check the logs:**
1. GitHub → Actions → Click on failed workflow
2. Click on failed job
3. Expand failed step
4. Read error message

**Common fixes:**
- Missing GitHub secret
- TypeScript error
- ESLint error
- Build error

### Deployment Fails

**Check Vercel logs:**
1. Vercel dashboard → Deployments
2. Click on failed deployment
3. View build logs

**Common fixes:**
- Wrong environment variables
- Missing dependencies
- Build timeout

### Tests Fail

**Run locally first:**
```bash
npm run lint
npm run build
npm test
```

Fix errors locally, then push again.

---

## Advanced Configuration

### Enable E2E Tests

1. Install Playwright:
```bash
npm install --save-dev @playwright/test
npx playwright install
```

2. Uncomment E2E job in `.github/workflows/ci-cd.yml`

3. Push to trigger tests

### Add Code Coverage

1. Install Codecov:
```bash
npm install --save-dev @codecov/codecov-action
```

2. Sign up at [codecov.io](https://codecov.io)

3. Add `CODECOV_TOKEN` to GitHub secrets

4. Coverage reports will be uploaded automatically

### Enable Slack Notifications

1. Create Slack webhook:
   - Slack → Apps → Incoming Webhooks
   - Copy webhook URL

2. Add to GitHub secrets:
```bash
gh secret set SLACK_WEBHOOK
```

3. Notifications will be sent automatically

---

## Branch Protection Rules

Protect your `main` branch:

1. GitHub → Settings → Branches
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

---

## Best Practices

### Commit Messages

Use conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### Branch Names

Use descriptive names:

```
feature/add-limit-orders
bugfix/fix-portfolio-calculation
hotfix/critical-security-patch
refactor/simplify-api-calls
```

### Pull Requests

- Keep PRs small and focused
- Write clear descriptions
- Link related issues
- Request reviews
- Wait for CI to pass

---

## Useful Commands

```bash
# Check workflow status
gh workflow list

# View workflow runs
gh run list

# Watch a workflow run
gh run watch

# View logs
gh run view --log

# Manually trigger workflow
gh workflow run ci-cd.yml

# List secrets
gh secret list

# Set a secret
gh secret set SECRET_NAME

# Delete a secret
gh secret delete SECRET_NAME
```

---

## Next Steps

- [ ] Set up branch protection
- [ ] Enable E2E tests
- [ ] Add code coverage
- [ ] Configure Slack notifications
- [ ] Set up monitoring
- [ ] Create release workflow
- [ ] Document deployment process
- [ ] Train team on CI/CD

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Playwright Docs](https://playwright.dev)
- [Jest Docs](https://jestjs.io)
- [Conventional Commits](https://www.conventionalcommits.org)

---

## Success! 🎉

Your CI/CD pipeline is now running!

Every code change will be:
- ✅ Automatically tested
- ✅ Automatically built
- ✅ Automatically deployed
- ✅ Automatically monitored

**Happy shipping!** 🚀

