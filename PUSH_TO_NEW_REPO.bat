@echo off
echo ========================================
echo  Push Frontend to New GitHub Repository
echo ========================================
echo.
echo Target Repository:
echo https://github.com/pratikchaudhari123/recapcafrontend.git
echo.
echo This will:
echo 1. Initialize Git in this folder
echo 2. Add all frontend files
echo 3. Create initial commit
echo 4. Force push to recapcafrontend repository
echo.
echo WARNING: This will overwrite any existing content in the repository!
echo.
pause

echo.
echo Step 1: Removing existing .git folder (if any)
if exist .git (
    rmdir /s /q .git
    echo Removed existing .git folder
) else (
    echo No existing .git folder found
)

echo.
echo Step 2: Initialize new Git repository
git init

echo.
echo Step 3: Configure Git
git config user.name "pratikchaudhari123"
git config user.email "pratikchaudhari123@users.noreply.github.com"

echo.
echo Step 4: Add all files
git add .

echo.
echo Step 5: Create initial commit
git commit -m "Initial commit - Clean frontend for Vercel deployment"

echo.
echo Step 6: Set main branch
git branch -M main

echo.
echo Step 7: Add remote origin
git remote add origin https://github.com/pratikchaudhari123/recapcafrontend.git

echo.
echo Step 8: Force push to GitHub
echo This will overwrite any existing content in the repository!
git push -f origin main

echo.
echo ========================================
echo  SUCCESS! Frontend pushed to GitHub
echo ========================================
echo.
echo Repository: https://github.com/pratikchaudhari123/recapcafrontend
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new
echo 2. Import: pratikchaudhari123/recapcafrontend
echo 3. Add environment variables from VERCEL_ENV_VARIABLES.txt
echo 4. Deploy
echo.
echo Backend EC2: http://13.201.103.113
echo Vercel proxy configured in vercel.json
echo.
pause
