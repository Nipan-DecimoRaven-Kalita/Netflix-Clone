# Vercel Deployment Guide

## Option 1: Deploy Frontend and Backend Together (Monorepo)

### Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd "c:\Users\HP\Desktop\Netflix Project"
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project on Vercel → Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL=mysql://avnadmin:AVNS_riuZoAyhoFHQiFz-IcZ@mysql-13444d6c-decimoraven.b.aivencloud.com:16941/defaultdb?ssl-mode=REQUIRED
     JWT_SECRET=your-super-secret-jwt-key-min-32-chars
     JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
     JWT_EXPIRY=24h
     JWT_REFRESH_EXPIRY=7d
     OMDB_API_KEY=278e1ea3
     CORS_ORIGIN=https://your-app.vercel.app
     NODE_ENV=production
     ```
   - **Important**: Replace `CORS_ORIGIN` with your actual Vercel deployment URL after first deploy

5. **Upload CA Certificate**:
   - The `backend/ca.pem` file needs to be accessible
   - Vercel will include it in the deployment automatically

6. **Redeploy** after setting environment variables:
   ```bash
   vercel --prod
   ```

## Option 2: Deploy Frontend and Backend Separately (Recommended)

### Deploy Backend First:

1. **Create a new Vercel project for backend**:
   ```bash
   cd backend
   vercel
   ```

2. **Set backend environment variables** (same as above)

3. **Note the backend URL** (e.g., `https://netflix-clone-backend.vercel.app`)

### Deploy Frontend:

1. **Update frontend API base URL**:
   - Edit `frontend/src/lib/api.js`
   - Change `baseURL: '/api'` to `baseURL: 'https://your-backend-url.vercel.app/api'`

2. **Deploy frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Update backend CORS_ORIGIN** with frontend URL

## Option 3: Use Vercel Dashboard (Easiest)

1. **Push code to GitHub** (already done ✅)

2. **Go to Vercel Dashboard**: https://vercel.com/new

3. **Import your GitHub repository**:
   - Select `Nipan-DecimoRaven-Kalita/Netflix-Clone`

4. **Configure Project**:
   - **Root Directory**: Leave as root (`.`)
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: `frontend/dist`

5. **Add Environment Variables** (Settings → Environment Variables):
   ```
   DATABASE_URL=mysql://avnadmin:AVNS_riuZoAyhoFHQiFz-IcZ@mysql-13444d6c-decimoraven.b.aivencloud.com:16941/defaultdb?ssl-mode=REQUIRED
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
   JWT_EXPIRY=24h
   JWT_REFRESH_EXPIRY=7d
   OMDB_API_KEY=278e1ea3
   CORS_ORIGIN=https://your-app.vercel.app
   NODE_ENV=production
   ```

6. **Deploy** and wait for build to complete

7. **After first deploy**, update `CORS_ORIGIN` with your actual Vercel URL

## Important Notes:

- **Database SSL**: The `ca.pem` file is included in the repo and will be deployed
- **CORS**: Update `CORS_ORIGIN` after first deployment with your actual frontend URL
- **Cookies**: Ensure `secure: true` in production (already handled by `NODE_ENV=production`)
- **Environment Variables**: Never commit `.env` files (already in `.gitignore`)

## Troubleshooting:

- **Database connection errors**: Check that `DATABASE_URL` is set correctly
- **CORS errors**: Ensure `CORS_ORIGIN` matches your frontend URL exactly
- **Build failures**: Check Vercel build logs for specific errors
