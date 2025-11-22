# Admin Token Troubleshooting Guide

## Quick Fix Checklist

### ✅ Step 1: Verify ADMIN_TOKEN is Set on Railway

1. Go to [railway.app](https://railway.app) → Your backend service
2. Click **Variables** tab
3. Look for `ADMIN_TOKEN` in the list
4. **If missing or wrong value:**
   - Click **+ New Variable**
   - Key: `ADMIN_TOKEN`
   - Value: `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
   - **Important:** No quotes, no spaces before/after
   - Click **Save**

### ✅ Step 2: Verify Token is Actually Loaded

Test if Railway has the token:

```bash
curl https://your-railway-service.railway.app/api/admin/verify
```

You should see:
```json
{
  "adminTokenConfigured": true,
  "adminTokenLength": 64,
  "adminTokenPrefix": "7IAu...",
  "hint": "ADMIN_TOKEN is configured. Use this exact value when logging in at /admin/login"
}
```

**If `adminTokenConfigured` is `false`:** The token isn't set correctly on Railway.

### ✅ Step 3: Clear Browser Storage & Login Again

1. Go to your Vercel frontend: `https://your-app.vercel.app/admin/login`
2. Open browser DevTools (F12) → **Application** tab → **Local Storage**
3. Delete these keys:
   - `admin-token`
   - `admin-authenticated`
4. Close DevTools
5. **Copy this exact token** (no spaces):
   ```
   7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
   ```
6. Paste it into the login form
7. Click **Sign In**

### ✅ Step 4: Check Railway Logs

If it still doesn't work:

1. Go to Railway → Your service → **Deployments** → Latest deployment → **View Logs**
2. Try marking an order as paid again
3. Look for lines starting with `[adminAuth]`
4. You should see:
   ```json
   {
     "receivedPrefix": "7IAu...",
     "receivedLength": 64,
     "expectedPrefix": "7IAu...",
     "expectedLength": 64,
     "tokensMatch": true,
     "hasHeader": true
   }
   ```

**If `tokensMatch: false`:**
- The token you entered doesn't match Railway's `ADMIN_TOKEN`
- Make sure you copied the exact token (no extra spaces)

**If `hasHeader: false`:**
- The token isn't being sent from the frontend
- Clear browser storage and log in again

## Common Issues & Solutions

### Issue: "adminTokenConfigured: false" in `/api/admin/verify`

**Cause:** `ADMIN_TOKEN` is not set on Railway

**Fix:**
1. Railway → Your service → **Variables**
2. Add `ADMIN_TOKEN` = `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
3. Wait for Railway to redeploy (1-2 minutes)
4. Test `/api/admin/verify` again

### Issue: Tokens don't match in logs (`tokensMatch: false`)

**Cause:** The token in your browser doesn't match Railway's `ADMIN_TOKEN`

**Fix:**
1. Check Railway Variables → `ADMIN_TOKEN` value
2. Copy it exactly (no quotes, no spaces)
3. Clear browser Local Storage
4. Log in again with the exact token from Railway

### Issue: "hasHeader: false" in logs

**Cause:** Token isn't being sent from frontend

**Fix:**
1. Clear browser Local Storage (`admin-token`, `admin-authenticated`)
2. Log in again at `/admin/login`
3. Check browser console (F12) for any errors
4. Try marking an order as paid again

### Issue: Token length mismatch

**Expected:** 64 characters
**If different:** The token was truncated or has extra characters

**Fix:**
- Make sure `ADMIN_TOKEN` on Railway is exactly 64 characters
- Make sure you're entering the full token when logging in

## Your Admin Token

```
7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
```

**This token must be:**
1. ✅ Set as `ADMIN_TOKEN` on Railway (backend)
2. ✅ Entered exactly when logging in at `/admin/login` (frontend)
3. ✅ No quotes, no spaces, exact match

## Step-by-Step Verification

### 1. Check Railway Backend

```bash
# Replace with your Railway URL
curl https://your-service.railway.app/api/admin/verify
```

Expected response:
```json
{
  "adminTokenConfigured": true,
  "adminTokenLength": 64,
  "adminTokenPrefix": "7IAu..."
}
```

### 2. Check Frontend Login

1. Go to `https://your-app.vercel.app/admin/login`
2. Open DevTools (F12) → Console
3. Log in with the token
4. Check console for: `Token stored successfully`

### 3. Check Token Match

1. After logging in, go to `/admin` dashboard
2. Open DevTools → Console
3. Try marking an order as paid
4. Check Railway logs for `[adminAuth]` messages
5. Verify `tokensMatch: true`

## Still Not Working?

1. **Double-check Railway Variables:**
   - Go to Railway → Your service → Variables
   - Verify `ADMIN_TOKEN` exists and has the correct value
   - Make sure there are no quotes around the value

2. **Check Railway Logs:**
   - Railway → Deployments → Latest → View Logs
   - Look for `[adminAuth]` messages
   - Check if token is being received

3. **Clear Everything and Start Fresh:**
   - Clear browser Local Storage
   - Log out and log in again
   - Make sure you're using the exact token from Railway

4. **Verify Backend is Running:**
   - Test: `curl https://your-service.railway.app/api/health`
   - Should return: `{"status":"ok"}`

