@echo off
echo ========================================
echo  Push Frontend to GitHub
echo ========================================
echo.

echo Step 1: Initialize Git repository
git init

echo.
echo Step 2: Add all files
git add .

echo.
echo Step 3: Create initial commit
git commit -m "Initial commit - Clean frontend for Vercel deployment"

echo.
echo Step 4: Set main branch
git branch -M main

echo.
echo ========================================
echo  IMPORTANT: Create GitHub Repository
echo ========================================
echo.
echo 1. Go to: https://github.com/new
echo 2. Repository name: recap-ca-frontend
echo 3. Description: Recap CA AI Tool - Frontend
echo 4. Make it Public or Private
echo 5. DO NOT initialize with README
echo 6. Click "Create repository"
echo.
echo After creating the repository, copy the URL and paste it below.
echo Example: https://github.com/YOUR_USERNAME/recap-ca-frontend.git
echo.

set /p REPO_URL="Enter your GitHub repository URL: "

echo.
echo Step 5: Add remote origin
git remote add origin %REPO_URL%

echo.
echo Step 6: Push to GitHub
git push -u origin main

echo.
echo ========================================
echo  SUCCESS! Frontend pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new
echo 2. Import your new repository
echo 3. Follow the deployment guide in DEPLOY_TO_VERCEL.md
echo.
pause
