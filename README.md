# Recap CA AI Tool - Frontend

Clean, production-ready Next.js frontend for Vercel deployment.

## Quick Start

See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) for complete deployment instructions.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

## Tech Stack

- Next.js 14.2.0
- React 18.2.0
- TypeScript 5.2.2
- Tailwind CSS 3.3.5
- Firebase 10.14.1
- Axios 1.5.1

## Features

- User Authentication (Firebase)
- AI Chat Assistant
- Study Tracker
- Progress Dashboard
- Subscription Management
- Payment Integration (Razorpay)
- Floating Calculator & Timer

## Deployment

This folder is optimized for Vercel deployment with:
- Clean structure (no Python files)
- Vercel proxy configuration
- Environment variable setup
- Production-ready build

See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) for step-by-step guide.
