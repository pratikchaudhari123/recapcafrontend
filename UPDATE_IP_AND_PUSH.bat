@echo off
echo ========================================
echo  Update Backend IP and Push to GitHub
echo ========================================
echo.
echo Old IP: 13.201.103.113
echo New IP: 13.203.232.46
echo.
echo This will:
echo 1. Update vercel.json (already done)
echo 2. Commit changes
echo 3. Push to GitHub
echo.
pause

echo.
echo Step 1: Add all files
git add .

echo.
echo Step 2: Commit changes
git commit -m "Updated backend IP to 13.203.232.46 in all documentation"

echo.
echo Step 3: Push to GitHub
git push origin main

echo.
echo ========================================
echo  SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Repository: https://github.com/pratikchaudhari123/recapcafrontend
echo.
echo Next: Redeploy on Vercel
echo 1. Go to Vercel dashboard
echo 2. Find your deployment
echo 3. Click "Redeploy"
echo.
echo Or Vercel will auto-deploy on next push
echo.
pause
