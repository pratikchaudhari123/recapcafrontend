# Deploy Frontend to Vercel - Complete Guide

## ✅ This folder is READY for Vercel deployment

This is a clean, frontend-only folder with NO Python files, NO backend code.

---

## Step 1: Push to GitHub

Create a NEW GitHub repository for frontend only:

```bash
cd deploy-frontend
git init
git add .
git commit -m "Initial commit - Clean frontend for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/recap-ca-frontend.git
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your new frontend repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Leave empty (.)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Add Environment Variables (click "Environment Variables"):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDtlT161nYDr93YrDm1VTxA-5RazmofQEg
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=recap-ca-ai.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=recap-ca-ai
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=recap-ca-ai.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=557093631304
   NEXT_PUBLIC_FIREBASE_APP_ID=1:557093631304:web:0fd976ab2e5f8e9134ef7d
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-1KGQ58RPWC
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SK39B8PUIHlAgO
   ```

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
npm install -g vercel
cd deploy-frontend
vercel login
vercel --prod
```

---

## Step 3: Verify Deployment

After deployment completes:

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test login/signup
3. Test subscription page
4. Test AI chat
5. Check browser console for errors

---

## How It Works

### API Proxy Configuration

The `vercel.json` file configures Vercel to proxy all `/api/*` requests to your EC2 backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://13.201.103.113/api/:path*"
    }
  ]
}
```

This means:
- Frontend calls: `/api/subscription/status`
- Vercel proxies to: `http://13.201.103.113/api/subscription/status`
- No CORS issues, no mixed content errors

### Environment Variables

All Firebase and Razorpay keys are configured as environment variables in Vercel dashboard.

---

## Troubleshooting

### Build Fails

- Check that `package.json` has `"next": "14.2.0"` in dependencies
- Verify all environment variables are set correctly
- Check build logs for specific errors

### API Calls Fail

- Verify EC2 backend is running: `http://13.201.103.113/health`
- Check Vercel proxy configuration in `vercel.json`
- Verify environment variables are set in Vercel dashboard

### 404 Errors

- Ensure `next.config.js` does NOT have `output: 'export'`
- Verify build completed successfully

---

## Important Notes

1. **DO NOT** add `NEXT_PUBLIC_API_URL` environment variable - the proxy handles this
2. **DO NOT** modify `vercel.json` - it's configured correctly
3. **DO NOT** commit `.env.local` or `.env` files to Git
4. Backend must be running on EC2 for frontend to work
5. All API calls use relative paths (`/api/...`) which Vercel proxies to EC2

---

## Production Checklist

- [ ] Backend running on EC2: http://13.201.103.113
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured in Vercel
- [ ] Login/Signup working
- [ ] Payment system working
- [ ] AI Chat working
- [ ] No console errors

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify EC2 backend is running
4. Check environment variables in Vercel dashboard
