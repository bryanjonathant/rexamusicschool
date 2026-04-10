#!/bin/bash

# Configuration
BRANCH="main"

echo "🚀 Starting sync process..."

# 1. Build the project (ensure latest production files are ready)
echo "📦 Building project..."
npm run build

# 2. Add changes
echo "➕ Adding changes to Git..."
git add .

# 3. Commit
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
MESSAGE="Site update: $TIMESTAMP"
echo "💾 Committing changes: '$MESSAGE'..."
git commit -m "$MESSAGE"

# 4. Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

# 5. Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin "$BRANCH"

echo "✅ Sync complete! Your site is live at: https://rexa-music-school-april-2026.vercel.app"
