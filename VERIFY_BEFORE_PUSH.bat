@echo off
echo ========================================
echo  Pre-Push Verification
echo ========================================
echo.

echo Checking for Python files...
powershell -Command "Get-ChildItem -Recurse -File -Include '*.py','.python-version','requirements.txt' | Select-Object Name"
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Python files found! This may cause Vercel build errors.
) else (
    echo [OK] No Python files found
)

echo.
echo Checking for backend folders...
if exist "backend" (
    echo [WARNING] Backend folder found!
) else (
    echo [OK] No backend folder
)

if exist "routes" (
    echo [WARNING] Routes folder found! (might be backend)
) else (
    echo [OK] No routes folder
)

if exist "models" (
    echo [WARNING] Models folder found! (might be backend)
) else (
    echo [OK] No models folder
)

echo.
echo Checking for node_modules...
if exist "node_modules" (
    echo [WARNING] node_modules folder exists (will be ignored by .gitignore)
) else (
    echo [OK] No node_modules folder
)

echo.
echo Checking for .next build folder...
if exist ".next" (
    echo [WARNING] .next folder exists (will be ignored by .gitignore)
) else (
    echo [OK] No .next folder
)

echo.
echo Checking package.json...
if exist "package.json" (
    echo [OK] package.json found
    findstr /C:"\"next\"" package.json >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Next.js dependency found
    ) else (
        echo [ERROR] Next.js dependency NOT found!
    )
) else (
    echo [ERROR] package.json NOT found!
)

echo.
echo Checking vercel.json...
if exist "vercel.json" (
    echo [OK] vercel.json found
    findstr /C:"13.201.103.113" vercel.json >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] EC2 backend IP configured
    ) else (
        echo [WARNING] EC2 backend IP not found in vercel.json
    )
) else (
    echo [ERROR] vercel.json NOT found!
)

echo.
echo Checking .gitignore...
if exist ".gitignore" (
    echo [OK] .gitignore found
) else (
    echo [WARNING] .gitignore NOT found!
)

echo.
echo Checking next.config.js...
if exist "next.config.js" (
    echo [OK] next.config.js found
) else (
    echo [ERROR] next.config.js NOT found!
)

echo.
echo Checking app folder...
if exist "app" (
    echo [OK] app folder found (Next.js 13+ structure)
) else (
    echo [WARNING] app folder NOT found!
)

echo.
echo Checking components folder...
if exist "components" (
    echo [OK] components folder found
) else (
    echo [WARNING] components folder NOT found!
)

echo.
echo ========================================
echo  Verification Complete
echo ========================================
echo.
echo If all checks passed, you can run:
echo PUSH_TO_NEW_REPO.bat
echo.
pause
