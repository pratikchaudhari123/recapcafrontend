# 🚀 Final Deployment Checklist

## ✅ Pre-Deployment Verification

Run `VERIFY_BEFORE_PUSH.bat` to check:
- [ ] No Python files (`.py`, `.python-version`, `requirements.txt`)
- [ ] No backend folders (`backend`, `routes`, `models`)
- [ ] `package.json` exists with Next.js dependency
- [ ] `vercel.json` exists with EC2 backend IP
- [ ] `.gitignore` configured
- [ ] `next.config.js` exists
- [ ] `app` folder exists
- [ ] `components` folder exists

---

## 📤 Push to GitHub

### Option 1: Automated (Recommended)
```bash
PUSH_TO_NEW_REPO.bat
```

### Option 2: Manual
```bash
# Remove existing .git if any
rmdir /s /q .git

# Initialize new repo
git init
git config user.name "pratikchaudhari123"
git config user.email "pratikchaudhari123@users.noreply.github.com"

# Add and commit
git add .
git commit -m "Initial commit - Clean frontend for Vercel"

# Push to new repo
git branch -M main
git remote add origin https://github.com/pratikchaudhari123/recapcafrontend.git
git push -f origin main
```

---

## 🌐 Deploy to Vercel

### Step 1: Import Repository
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for: `pratikchaudhari123/recapcafrontend`
4. Click "Import"

### Step 2: Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `.` (leave empty)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

Click "Environment Variables" and add these 8 variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
AIzaSyDtlT161nYDr93YrDm1VTxA-5RazmofQEg

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
recap-ca-ai.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID
recap-ca-ai

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
recap-ca-ai.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
557093631304

NEXT_PUBLIC_FIREBASE_APP_ID
1:557093631304:web:0fd976ab2e5f8e9134ef7d

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
G-1KGQ58RPWC

NEXT_PUBLIC_RAZORPAY_KEY_ID
rzp_live_SK39B8PUIHlAgO
```

**Important**: 
- Apply to: Production, Preview, and Development
- DO NOT add `NEXT_PUBLIC_API_URL` (proxy handles this)

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Note your Vercel URL (e.g., `https://recapcafrontend.vercel.app`)

---

## 🧪 Post-Deployment Testing

### Test 1: Frontend Loads
- [ ] Visit your Vercel URL
- [ ] Page loads without errors
- [ ] No console errors in browser

### Test 2: Authentication
- [ ] Click "Sign Up"
- [ ] Create new account with email/password
- [ ] Verify email sent (check spam folder)
- [ ] Login with credentials
- [ ] User redirected to dashboard

### Test 3: API Connection
- [ ] Open browser console (F12)
- [ ] Navigate to subscription page
- [ ] Check Network tab for API calls
- [ ] Verify calls to `/api/subscription/status` succeed
- [ ] No CORS errors
- [ ] No mixed content errors

### Test 4: Subscription System
- [ ] Navigate to subscription page
- [ ] Verify free plan shows correctly
- [ ] Click "Upgrade to Premium"
- [ ] Razorpay modal opens
- [ ] Complete test payment (use test card if available)
- [ ] Verify subscription activates
- [ ] Check subscription status updates

### Test 5: AI Chat
- [ ] Navigate to chat page
- [ ] Ask a question: "What is CA?"
- [ ] Verify AI responds
- [ ] Check response is relevant
- [ ] Verify question count decrements

### Test 6: Study Tracker
- [ ] Navigate to progress page
- [ ] Start study timer
- [ ] Stop timer after 1 minute
- [ ] Verify session saved
- [ ] Check progress updates

### Test 7: Calculator
- [ ] Click floating calculator icon
- [ ] Perform calculation: 2 + 2
- [ ] Verify result: 4
- [ ] Check calculation logged

---

## 🔧 Backend Verification

Before testing, ensure backend is running:

```bash
# Check backend health
curl http://13.201.103.113/health

# Expected response:
{"status":"healthy"}
```

If backend is down:
```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@13.201.103.113

# Check service status
sudo systemctl status recap-backend

# Restart if needed
sudo systemctl restart recap-backend

# Check logs
sudo journalctl -u recap-backend -f
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error**: "No Next.js version detected"
- **Fix**: Verify `package.json` has `"next": "14.2.0"` in dependencies
- **Action**: Check repository on GitHub, ensure `package.json` was pushed

**Error**: "Python version detected"
- **Fix**: Ensure no `.python-version` file in repository
- **Action**: Run `VERIFY_BEFORE_PUSH.bat` before pushing

**Error**: "Module not found"
- **Fix**: Check all imports in code
- **Action**: Verify `node_modules` was not committed

### API Calls Fail

**Error**: "Failed to fetch"
- **Fix**: Verify backend is running on EC2
- **Action**: Run `curl http://13.201.103.113/health`

**Error**: "CORS error"
- **Fix**: Verify `vercel.json` proxy configuration
- **Action**: Check `vercel.json` has correct EC2 IP

**Error**: "401 Unauthorized"
- **Fix**: Verify Firebase token is valid
- **Action**: Logout and login again

### Payment Fails

**Error**: "Razorpay key invalid"
- **Fix**: Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` in Vercel
- **Action**: Check environment variables in Vercel dashboard

**Error**: "Payment verification failed"
- **Fix**: Verify backend Razorpay secret is correct
- **Action**: Check EC2 `.env` file has correct `RAZORPAY_KEY_SECRET`

---

## 📊 Success Criteria

Deployment is successful when:

- ✅ Vercel build completes without errors
- ✅ Frontend loads at Vercel URL
- ✅ No console errors in browser
- ✅ Login/Signup works
- ✅ Subscription page loads and shows correct plan
- ✅ Payment system works (test payment completes)
- ✅ AI Chat responds to questions
- ✅ Study tracker saves sessions
- ✅ Calculator performs calculations
- ✅ All API calls succeed (check Network tab)

---

## 🔗 Important Links

- **GitHub Repository**: https://github.com/pratikchaudhari123/recapcafrontend
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Backend Health**: http://13.201.103.113/health
- **Backend API Docs**: http://13.201.103.113/docs

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend is running: `http://13.201.103.113/health`
4. Check environment variables in Vercel dashboard
5. Review `vercel.json` proxy configuration
6. Check EC2 logs: `sudo journalctl -u recap-backend -f`

---

## 🎉 Congratulations!

If all tests pass, your Recap CA AI Tool is now live in production!

- Frontend: Your Vercel URL
- Backend: http://13.201.103.113
- Database: MongoDB Atlas
- Auth: Firebase
- Payment: Razorpay (Live keys)

**Remember**: This is a production system with live payment keys. Monitor usage and costs regularly.
