# Setting ADMIN_TOKEN in Production

Since your app is already deployed, you need to set the `ADMIN_TOKEN` environment variable on your **backend hosting platform** (Render, Railway, etc.), not just locally.

## Your Current Admin Token

From your local `.env` file:
```
7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
```

## Step-by-Step Instructions

### If your backend is on Render.com:

1. Go to [render.com](https://render.com) and log in
2. Find your backend service (the one running your API)
3. Click on it to open the service dashboard
4. Go to **Environment** tab (in the left sidebar)
5. Click **Add Environment Variable**
6. Add:
   - **Key:** `ADMIN_TOKEN`
   - **Value:** `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
7. Click **Save Changes**
8. Render will automatically redeploy your service

### If your backend is on Railway.app:

1. Go to [railway.app](https://railway.app) and log in
2. Open your project
3. Click on your backend service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add:
   - **Variable:** `ADMIN_TOKEN`
   - **Value:** `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
7. Railway will automatically redeploy

### If your backend is on another platform:

- **Fly.io:** Use `fly secrets set ADMIN_TOKEN=7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
- **Heroku:** Use `heroku config:set ADMIN_TOKEN=7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
- **DigitalOcean App Platform:** Add in App Settings → App-Level Environment Variables

## After Setting the Token

1. Wait for your backend to redeploy (usually 1-2 minutes)
2. Go to your deployed frontend (on Vercel)
3. Visit `/admin/login`
4. Enter the token: `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
5. Click "Sign In"
6. Try marking an order as paid

## Verify It's Working

After setting the token and redeploying, you can test it:

```bash
# Replace with your actual backend URL
curl -X PATCH https://your-backend.onrender.com/api/orders/ord_123/status \
  -H "Content-Type: application/json" \
  -H "x-admin-token: 7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9" \
  -d '{"status":"paid","paymentMethod":"manual_qr"}'
```

If you get a 401 Unauthorized, the token isn't set correctly on the backend.

## Important Notes

- The token must match **exactly** between:
  - What you enter in `/admin/login` (frontend)
  - What's set as `ADMIN_TOKEN` in your backend hosting platform
- No quotes needed when setting in the hosting platform
- The backend will automatically restart after you add the environment variable
- You don't need to do anything locally - this is all on the hosting platform

