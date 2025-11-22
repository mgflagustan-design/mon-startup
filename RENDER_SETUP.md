# Render.com Backend Setup Guide

## Quick Setup Steps

### Step 1: Create New Web Service on Render

1. Go to [render.com](https://render.com) → **Dashboard**
2. Click **+ New** → **Web Service**
3. Connect your GitHub repository (`mgflagustan-design/mon-startup`)
4. Configure the service:

### Step 2: Configure Service Settings

**Basic Settings:**
- **Name:** `mon-startup-api` (or any name you prefer)
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main`

**Build & Deploy:**
- **Root Directory:** `server` ⚠️ **IMPORTANT: Set this to `server`**
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 3: Set Environment Variables

In the **Environment** tab, add these variables:

#### Required Variables:

```
NODE_ENV=production
PORT=4000
CLIENT_BASE_URL=https://your-vercel-app.vercel.app
SERVER_BASE_URL=https://your-render-service.onrender.com
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

1. Click **Create Web Service**
2. Wait for the build to complete (2-3 minutes)
3. Your service will be live at: `https://your-service.onrender.com`

### Step 5: Verify Deployment

1. Check the **Logs** tab - you should see:
   ```
   API server listening on 4000
   ```

2. Test the health endpoint:
   ```bash
   curl https://your-service.onrender.com/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

3. Test admin token verification:
   ```bash
   curl https://your-service.onrender.com/api/admin/verify
   ```
   Should return admin token status

## Common Issues

### Error: "Cannot find module '/app/index.js'"

**Cause:** Root Directory is not set to `server`

**Fix:**
1. Go to Render → Your service → **Settings**
2. Scroll to **Build & Deploy**
3. Set **Root Directory** to: `server`
4. Click **Save Changes**
5. Manual Deploy → **Deploy latest commit**

### Error: "Cannot find module 'express'"

**Cause:** Dependencies not installed

**Fix:**
- Make sure **Build Command** is: `npm install`
- Check **Logs** tab for npm install errors
- Try redeploying

### Service Keeps Crashing

**Check:**
1. **Logs** tab for error messages
2. All required environment variables are set
3. `ADMIN_TOKEN` has no quotes or extra spaces
4. `CLIENT_BASE_URL` and `SERVER_BASE_URL` are correct

### CORS Errors

**Fix:**
- Make sure `CLIENT_BASE_URL` in Render matches your Vercel frontend URL exactly
- Include `https://` and no trailing slash
- Example: `https://mon-startup.vercel.app` (not `https://mon-startup.vercel.app/`)

## Updating Your Service

After pushing code changes:

1. Render automatically redeploys on `git push`
2. Or manually: Render → Your service → **Manual Deploy** → **Deploy latest commit**

## Monitoring

- **Logs:** Real-time logs in the **Logs** tab
- **Metrics:** CPU, Memory usage in **Metrics** tab
- **Events:** Deploy history in **Events** tab

## Free Tier Limits

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- Consider upgrading to paid plan for always-on service

