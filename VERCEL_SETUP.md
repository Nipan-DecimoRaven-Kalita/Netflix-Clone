# Quick Vercel Deployment Steps

## Method 1: Via Vercel Dashboard (Easiest) ⭐

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**: Select `Nipan-DecimoRaven-Kalita/Netflix-Clone`
3. **Configure**:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root)
   - **Build Command**: Leave empty
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install && cd backend && npm install && cd ../frontend && npm install`
4. **Add Environment Variables** (Settings → Environment Variables):
   ```
   DATABASE_URL=mysql://avnadmin:AVNS_riuZoAyhoFHQiFz-IcZ@mysql-13444d6c-decimoraven.b.aivencloud.com:16941/defaultdb?ssl-mode=REQUIRED
   JWT_SECRET=netflix-clone-jwt-secret-key-min-32-characters-long
   JWT_REFRESH_SECRET=netflix-clone-refresh-secret-key-32-chars
   JWT_EXPIRY=24h
   JWT_REFRESH_EXPIRY=7d
   OMDB_API_KEY=278e1ea3
   CORS_ORIGIN=https://your-app-name.vercel.app
   NODE_ENV=production
   ```
5. **Deploy** → Wait for build
6. **After first deploy**, copy your Vercel URL and update `CORS_ORIGIN` in environment variables, then redeploy

## Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from project root
cd "c:\Users\HP\Desktop\Netflix Project"
vercel

# Set environment variables (or use dashboard)
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
vercel env add OMDB_API_KEY
vercel env add CORS_ORIGIN
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

## Important Notes:

- ✅ `ca.pem` is included in the repo for SSL
- ✅ `.env` files are gitignored (won't be deployed)
- ✅ Backend exports Express app for Vercel serverless
- ⚠️ Update `CORS_ORIGIN` after first deployment with your actual Vercel URL
