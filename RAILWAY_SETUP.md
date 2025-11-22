# Railway.com Backend Setup Guide

## Quick Setup Steps

### Step 1: Create New Project on Railway

1. Go to [railway.app](https://railway.app) → **Dashboard**
2. Click **+ New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository (`mgflagustan-design/mon-startup`)

### Step 2: Configure Service Settings

**Important Settings:**
- **Root Directory:** Set to `server` ⚠️ **CRITICAL**
- Railway will auto-detect Node.js and use `npm start` from `package.json`

### Step 3: Set Environment Variables

In the **Variables** tab, add these:

#### Required Variables:

```
NODE_ENV=production
PORT=4000
CLIENT_BASE_URL=https://your-vercel-app.vercel.app
SERVER_BASE_URL=https://your-railway-app.railway.app
ADMIN_TOKEN=7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
PAYMENTS_MODE=manual
```

#### Optional Variables (for email):

```
EMAIL_FROM=orders@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
MANUAL_PAYMENT_EMAIL=orders@yourdomain.com
MANUAL_QR_IMAGE_URL=https://your-vercel-app.vercel.app/GCASH_QRCODE.JPG
MANUAL_PAYMENT_INSTRUCTIONS=Scan the QR code, send payment, then email your receipt for verification.
```

### Step 4: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click **Deploy** in the dashboard
3. Wait for build to complete (2-3 minutes)
4. Your service will be live at: `https://your-service.railway.app`

### Step 5: Verify Deployment

1. Check the **Deployments** tab → Click latest deployment → **View Logs**
2. You should see:
   ```
   API server listening on 4000
   ```

3. Test the health endpoint:
   ```bash
   curl https://your-service.railway.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

4. Test admin token verification:
   ```bash
   curl https://your-service.railway.app/api/admin/verify
   ```
   Should return admin token status

## Common Issues

### Error: "Cannot find module '/app/index.js'"

**Cause:** Root Directory is not set to `server`

**Fix:**
1. Go to Railway → Your service → **Settings**
2. Scroll to **Service Settings**
3. Set **Root Directory** to: `server`
4. Click **Save**
5. Railway will automatically redeploy

### Error: "Cannot find module 'express'"

**Cause:** Dependencies not installed

**Fix:**
- Check **Deployments** → **Logs** for npm install errors
- Make sure `package.json` is in the `server/` directory
- Try redeploying

### Service Keeps Crashing

**Check:**
1. **Deployments** → **Logs** for error messages
2. All required environment variables are set
3. `ADMIN_TOKEN` has no quotes or extra spaces
4. `CLIENT_BASE_URL` and `SERVER_BASE_URL` are correct

### CORS Errors

**Fix:**
- Make sure `CLIENT_BASE_URL` in Railway matches your Vercel frontend URL exactly
- Include `https://` and no trailing slash
- Example: `https://mon-startup.vercel.app` (not `https://mon-startup.vercel.app/`)

## Updating Your Service

After pushing code changes:

1. Railway automatically redeploys on `git push`
2. Or manually: Railway → Your service → **Deploy** → **Redeploy**

## Monitoring

- **Logs:** Real-time logs in the **Deployments** tab
- **Metrics:** CPU, Memory usage in the **Metrics** tab
- **Settings:** Configure custom domain, environment variables

## Free Tier

- Railway free tier includes:
  - $5 credit per month
  - Automatic deployments
  - Custom domains
  - HTTPS by default

## Setting Root Directory in Railway

1. Go to your service on Railway
2. Click **Settings** tab
3. Scroll to **Service Settings**
4. Find **Root Directory**
5. Enter: `server`
6. Click **Save**

Railway will automatically redeploy with the new settings.

