#!/bin/bash

# GitHub Secrets Setup Script for Crypto Brokerage Mini App
# This script helps you set up all required GitHub secrets for CI/CD

set -e

echo "🔐 GitHub Secrets Setup for Crypto Brokerage Mini App"
echo "======================================================"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "🔑 Please authenticate with GitHub CLI:"
    gh auth login
fi

echo "✅ GitHub CLI is authenticated"
echo ""

# Function to set secret
set_secret() {
    local name=$1
    local description=$2
    local value=$3
    
    if [ -z "$value" ]; then
        echo "📝 $description"
        read -sp "Enter value for $name: " value
        echo ""
    fi
    
    if [ -n "$value" ]; then
        echo "$value" | gh secret set "$name"
        echo "✅ Set $name"
    else
        echo "⚠️  Skipped $name (no value provided)"
    fi
}

echo "Setting up required secrets..."
echo ""

# Vercel secrets
echo "🔹 Vercel Configuration"
echo "Get these from: https://vercel.com/account/tokens"
echo "Or run: vercel link && cat .vercel/project.json"
echo ""

set_secret "VERCEL_TOKEN" "Vercel API token"
set_secret "VERCEL_ORG_ID" "Vercel Organization ID"
set_secret "VERCEL_PROJECT_ID" "Vercel Project ID"

echo ""
echo "🔹 Application Configuration"
echo ""

set_secret "NEXT_PUBLIC_URL" "Your app URL (e.g., https://your-app.vercel.app)"
set_secret "NEYNAR_API_KEY" "Neynar API key from neynar.com"

# Generate JWT secret if not provided
echo "📝 JWT Secret (will generate if not provided)"
read -sp "Enter JWT_SECRET or press Enter to generate: " jwt_secret
echo ""
if [ -z "$jwt_secret" ]; then
    jwt_secret=$(openssl rand -hex 32)
    echo "Generated JWT_SECRET: $jwt_secret"
fi
echo "$jwt_secret" | gh secret set "JWT_SECRET"
echo "✅ Set JWT_SECRET"

echo ""
echo "🔹 Farcaster Configuration"
echo "Get these from: https://base.dev/preview after deploying"
echo "You can set placeholders now and update later"
echo ""

set_secret "NEXT_PUBLIC_FARCASTER_HEADER" "Farcaster account association header"
set_secret "NEXT_PUBLIC_FARCASTER_PAYLOAD" "Farcaster account association payload"
set_secret "NEXT_PUBLIC_FARCASTER_SIGNATURE" "Farcaster account association signature"

echo ""
echo "🔹 Optional: Redis Configuration"
read -p "Do you want to set up Redis (Upstash) for notifications? (y/n): " setup_redis
if [ "$setup_redis" = "y" ]; then
    set_secret "REDIS_URL" "Upstash Redis REST URL"
    set_secret "REDIS_TOKEN" "Upstash Redis REST token"
fi

echo ""
echo "🔹 Optional: Slack Notifications"
read -p "Do you want to set up Slack notifications? (y/n): " setup_slack
if [ "$setup_slack" = "y" ]; then
    set_secret "SLACK_WEBHOOK" "Slack webhook URL"
fi

echo ""
echo "✅ GitHub secrets setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. GitHub Actions will automatically run"
echo "3. Check the Actions tab to see the workflow"
echo "4. Update Farcaster secrets after first deployment"
echo ""
echo "🔗 Useful links:"
echo "- GitHub Actions: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Base Preview: https://base.dev/preview"
echo ""

