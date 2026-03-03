@echo off
echo ========================================
echo  TESTING AFTER VERCEL DEPLOYMENT
echo ========================================
echo.

echo Step 1: Testing Backend HTTPS
echo ------------------------------
curl -s https://api.recapca.com/health
echo.
echo.

echo Step 2: Check if backend is healthy
echo ------------------------------------
echo If you see "status":"healthy" above, backend is working!
echo.

echo Step 3: What to do next
echo ------------------------
echo 1. Wait 2-3 minutes for Vercel deployment
echo 2. Go to your Vercel dashboard
echo 3. Check deployment status
echo 4. Once deployed, open your Vercel URL
echo 5. Clear browser cache (Ctrl+Shift+Delete)
echo 6. Hard refresh (Ctrl+F5)
echo 7. Test these features:
echo    - Login/Signup
echo    - Subscription page
echo    - AI Chat
echo    - Payment system
echo.

echo Step 4: Expected Results
echo -------------------------
echo - No 404 errors
echo - No localhost errors
echo - Subscription page loads
echo - AI Chat works
echo - Payment modal opens
echo - All features working
echo.

echo ========================================
echo  BACKEND STATUS ABOVE
echo ========================================
echo.
pause
