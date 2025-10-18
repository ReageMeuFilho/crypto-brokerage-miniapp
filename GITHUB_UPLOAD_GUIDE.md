# GitHub Upload Guide

This guide will help you upload the Crypto Brokerage Mini App to GitHub and share it with your team.

---

## Quick Start (5 Minutes)

### Option 1: Using GitHub CLI (Recommended)

```bash
# 1. Navigate to the project
cd crypto-brokerage-miniapp

# 2. Initialize git (if not already done)
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: Crypto Brokerage Mini App"

# 5. Create GitHub repository and push (one command!)
gh repo create crypto-brokerage-miniapp --public --source=. --remote=origin --push

# Done! 🎉
```

### Option 2: Using GitHub Website

```bash
# 1. Navigate to the project
cd crypto-brokerage-miniapp

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: Crypto Brokerage Mini App"

# 5. Create repository on GitHub
# Go to: https://github.com/new
# Repository name: crypto-brokerage-miniapp
# Description: Farcaster Mini App for crypto trading on Base
# Public or Private: Choose based on your needs
# DO NOT initialize with README (you already have one)
# Click "Create repository"

# 6. Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
git branch -M main
git push -u origin main

# Done! 🎉
```

---

## Detailed Instructions

### Prerequisites

- [ ] Git installed on your computer
- [ ] GitHub account
- [ ] GitHub CLI installed (optional, for Option 1)

### Step 1: Prepare the Repository

```bash
# Navigate to the project directory
cd /path/to/crypto-brokerage-miniapp

# Check git status
git status

# If not initialized, initialize git
git init

# Check what files will be committed
git status
```

### Step 2: Review .gitignore

The project already includes a `.gitignore` file that excludes:
- `node_modules/`
- `.next/`
- `.env.local`
- `.env*.local`
- `.vercel/`
- Build artifacts
- OS files

Verify it exists:
```bash
cat .gitignore
```

### Step 3: Create Initial Commit

```bash
# Add all files
git add .

# Verify what's staged
git status

# Create commit
git commit -m "Initial commit: Crypto Brokerage Mini App

- Complete Next.js app with TypeScript
- Mobile-first UI with 5 screens
- API routes with mock data
- Farcaster integration ready
- CI/CD pipeline configured
- PWA support
- Comprehensive documentation"

# Verify commit
git log --oneline
```

### Step 4: Create GitHub Repository

#### Using GitHub CLI:

```bash
# Login to GitHub (if not already)
gh auth login

# Create repository and push
gh repo create crypto-brokerage-miniapp \
  --public \
  --source=. \
  --remote=origin \
  --push \
  --description "Farcaster Mini App for crypto trading on Base network"

# Your repository is now live!
```

#### Using GitHub Website:

1. **Go to GitHub**: https://github.com/new

2. **Fill in details**:
   - Repository name: `crypto-brokerage-miniapp`
   - Description: `Farcaster Mini App for crypto trading on Base network`
   - Visibility: Public (or Private if you prefer)
   - **DO NOT** check "Initialize with README"
   - **DO NOT** add .gitignore or license (already included)

3. **Click "Create repository"**

4. **Push your code**:
   ```bash
   # Add remote (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
   
   # Verify remote
   git remote -v
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Step 5: Verify Upload

1. **Visit your repository**: `https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp`

2. **Check that you see**:
   - ✅ README.md displayed on the homepage
   - ✅ All folders (app, components, lib, etc.)
   - ✅ GitHub Actions workflows (.github/workflows)
   - ✅ Documentation files
   - ✅ No node_modules or .next folders

3. **Check GitHub Actions**:
   - Go to the "Actions" tab
   - You should see workflows listed
   - First workflow may fail (expected - needs secrets)

---

## Share with Your Teammate

### Option 1: Add as Collaborator

1. **Go to repository settings**:
   - Settings → Collaborators → Add people

2. **Enter teammate's GitHub username**

3. **They'll receive an invitation email**

4. **They can then clone**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
   cd crypto-brokerage-miniapp
   npm install --legacy-peer-deps
   ```

### Option 2: Share Repository Link

If the repository is public, just share the link:
```
https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp
```

Your teammate can:
1. Fork the repository
2. Clone it
3. Start working

---

## Set Up for Team Deployment

### Step 1: Configure GitHub Secrets

Your teammate needs to set up GitHub secrets for CI/CD:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
cd crypto-brokerage-miniapp

# Run the setup script
./scripts/setup-github-secrets.sh
```

Or manually add secrets:
- Go to Settings → Secrets and variables → Actions
- Add required secrets (see CI_CD_QUICKSTART.md)

### Step 2: Connect Vercel

Your teammate should:

1. **Go to Vercel**: https://vercel.com

2. **Import Project**:
   - New Project → Import Git Repository
   - Select `crypto-brokerage-miniapp`

3. **Configure**:
   - Framework: Next.js
   - Install Command: `npm install --legacy-peer-deps`
   - Build Command: `npm run build`

4. **Add Environment Variables**:
   - Copy from `.env.example`
   - Add required values

5. **Deploy**:
   - Click Deploy
   - Wait for deployment to complete
   - Get deployment URL

### Step 3: Generate Farcaster Credentials

After first deployment:

1. **Go to**: https://base.dev/preview
2. **Enter Vercel URL**
3. **Click "Verify"** and sign with Farcaster
4. **Copy credentials**
5. **Update** in Vercel environment variables
6. **Redeploy**

---

## Repository Structure

Your GitHub repository will have:

```
crypto-brokerage-miniapp/
├── .github/
│   └── workflows/          # CI/CD workflows
│       ├── ci-cd.yml
│       ├── pr-checks.yml
│       └── release.yml
├── app/                    # Next.js app
├── components/             # React components
├── contexts/               # React contexts
├── lib/                    # Utilities
├── public/                 # Static assets
├── scripts/                # Setup scripts
├── e2e/                    # E2E tests
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
├── next.config.mjs        # Next.js config
├── jest.config.js         # Jest config
├── playwright.config.ts   # Playwright config
├── README.md              # Main documentation
├── QUICKSTART.md          # Quick start guide
├── DEPLOYMENT.md          # Deployment guide
├── DEPLOYMENT_GUIDE.md    # Detailed deployment
├── DEPLOYMENT_CHECKLIST.md # Deployment checklist
├── PROJECT_SUMMARY.md     # Project overview
├── CI_CD_SETUP.md         # CI/CD guide
├── CI_CD_QUICKSTART.md    # CI/CD quick start
└── GITHUB_UPLOAD_GUIDE.md # This file
```

---

## Teammate Setup Instructions

Share these instructions with your teammate:

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
cd crypto-brokerage-miniapp
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Required values:
- `NEXT_PUBLIC_URL=http://localhost:3000`
- `NEYNAR_API_KEY=` (get from neynar.com)
- `JWT_SECRET=` (generate with `openssl rand -hex 32`)

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Deploy to Vercel

Follow instructions in `DEPLOYMENT_GUIDE.md`

---

## Troubleshooting

### Issue: "Permission denied"

**Solution**:
```bash
# Make sure you're authenticated
gh auth status

# Login if needed
gh auth login
```

### Issue: "Remote already exists"

**Solution**:
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git
```

### Issue: "Failed to push"

**Solution**:
```bash
# Pull first (if repository has content)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

### Issue: "node_modules uploaded"

**Solution**:
```bash
# Remove from git
git rm -r --cached node_modules

# Add to .gitignore (should already be there)
echo "node_modules/" >> .gitignore

# Commit and push
git add .gitignore
git commit -m "fix: remove node_modules from git"
git push
```

---

## Security Checklist

Before pushing to GitHub:

- [ ] No API keys in code
- [ ] No passwords in code
- [ ] `.env.local` in `.gitignore`
- [ ] `.env*.local` in `.gitignore`
- [ ] No sensitive data in comments
- [ ] `.vercel/` in `.gitignore`

---

## Next Steps After Upload

1. **Set up branch protection**:
   - Settings → Branches → Add rule
   - Protect `main` branch
   - Require PR reviews

2. **Configure GitHub Actions**:
   - Add required secrets
   - Enable workflows
   - Test first build

3. **Invite team members**:
   - Settings → Collaborators
   - Add teammates

4. **Create project board** (optional):
   - Projects → New project
   - Track issues and PRs

5. **Set up discussions** (optional):
   - Settings → Features → Discussions
   - Enable for team communication

---

## Quick Reference

### Essential Commands

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp.git

# Status
git status

# Add files
git add .

# Commit
git commit -m "message"

# Push
git push

# Pull
git pull

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge
git merge feature/new-feature
```

### GitHub CLI Commands

```bash
# Create repo
gh repo create

# Clone repo
gh repo clone YOUR_USERNAME/crypto-brokerage-miniapp

# Create PR
gh pr create

# List PRs
gh pr list

# View PR
gh pr view

# Merge PR
gh pr merge

# Set secret
gh secret set SECRET_NAME
```

---

## Support

If you or your teammate need help:

1. **Check documentation**:
   - README.md
   - QUICKSTART.md
   - DEPLOYMENT_GUIDE.md

2. **Check GitHub Issues**:
   - Search existing issues
   - Create new issue if needed

3. **Contact**:
   - Open issue on GitHub
   - Tag with appropriate labels

---

## Success! 🎉

Your repository is now on GitHub and ready for your team!

**Repository URL**: `https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp`

**Share this with your teammate**:
```
Hey! I've uploaded the Crypto Brokerage Mini App to GitHub.

Repository: https://github.com/YOUR_USERNAME/crypto-brokerage-miniapp

To get started:
1. Clone the repo
2. Run: npm install --legacy-peer-deps
3. Copy .env.example to .env.local and add your keys
4. Run: npm run dev
5. Follow DEPLOYMENT_GUIDE.md to deploy to Vercel

All documentation is in the repo. Let me know if you need help!
```

---

**Happy collaborating!** 🚀

