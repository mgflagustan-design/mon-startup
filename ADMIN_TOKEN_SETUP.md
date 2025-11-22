# Admin Token Setup & Troubleshooting Guide

## Quick Fix Steps

### Step 1: Verify ADMIN_TOKEN on Render

1. Go to [render.com](https://render.com) and sign in
2. Find your backend service (should be named something like `mon-startup-api`)
3. Click on it → Go to **Environment** tab
4. Look for `ADMIN_TOKEN` in the list
5. **If it's missing or different**, add/update it:
   - Click **+ Add Environment Variable**
   - Key: `ADMIN_TOKEN`
   - Value: `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
   - **Important:** No quotes, no spaces before/after
   - Click **Save Changes** (this will trigger a redeploy)

### Step 2: Wait for Redeploy (1-2 minutes)

- Render will automatically redeploy when you save environment variables
- Watch the **Events** tab to see when it's done
- Status should show "Live" when ready

### Step 3: Verify Token is Configured

Test if the token is set correctly:

```bash
curl https://your-backend-url.onrender.com/api/admin/verify
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

If `adminTokenConfigured` is `false`, the token isn't set correctly on Render.

### Step 4: Clear Browser Storage & Login Again

1. Go to your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
2. Open browser DevTools (F12) → **Application** tab → **Local Storage**
3. Delete these keys:
   - `admin-token`
   - `admin-authenticated`
4. Go to `/admin/login`
5. Enter this **exact** token (copy-paste, no spaces):
   ```
   7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
   ```
6. Click **Sign In**

### Step 5: Check Render Logs

If it still doesn't work:

1. On Render → Your backend service → **Logs** tab
2. Try marking an order as paid again
3. Look for lines starting with `[adminAuth]`
4. You should see:
   - `receivedPrefix`: First 4 chars of token you sent
   - `expectedPrefix`: First 4 chars of token on server
   - `tokensMatch`: Should be `true` if they match

## Common Issues

### Issue: "adminTokenConfigured: false"
**Fix:** The `ADMIN_TOKEN` environment variable is not set on Render. Add it in Step 1.

### Issue: Tokens don't match in logs
**Fix:** 
- Make sure you're using the **exact same token** in:
  - Render's `ADMIN_TOKEN` environment variable
  - The login form at `/admin/login`
- No extra spaces, no quotes
- Clear browser storage and log in again

### Issue: Token has different length
**Fix:** The token might have been truncated or has extra characters. Copy the full token from your local `.env` file and set it exactly on Render.

## Your Current Token

```
7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
```

**This is the token you need to:**
1. Set as `ADMIN_TOKEN` on Render
2. Enter when logging in at `/admin/login` on your Vercel site

## Still Having Issues?

1. Check Render logs for `[adminAuth]` messages
2. Verify the token on Render matches exactly (no quotes, no spaces)
3. Clear browser local storage and try logging in again
4. Make sure Render service has finished redeploying after adding the variable

