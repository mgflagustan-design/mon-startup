# Deployment Guide

This guide covers deploying the Mon Threads e-commerce app to production.

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

**Frontend (Vercel):**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Set root directory to `client`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend.railway.app/api`
5. Deploy

**Backend (Railway):**
1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repo
3. Set root directory to `server`
4. Add all environment variables from `server/.env.example`
5. Update `CLIENT_BASE_URL` to your Vercel URL
6. Update `SERVER_BASE_URL` to your Railway URL
7. Deploy

### Option 2: Netlify (Frontend) + Render (Backend)

**Frontend (Netlify):**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

**Backend (Render):**
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add all environment variables
5. Update URLs in env vars
6. Deploy

### Option 3: Full Stack on Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `server/` directory: `fly launch`
3. Follow prompts, set environment variables
4. Deploy: `fly deploy`

For frontend, create a separate Fly app or use Vercel/Netlify.

## Environment Variables for Production

### Backend (`server/.env`)

```bash
PORT=4000
NODE_ENV=production
CLIENT_BASE_URL=https://your-frontend.vercel.app
SERVER_BASE_URL=https://your-backend.railway.app

# Payment mode
PAYMENTS_MODE=manual  # or xendit

# Manual payment settings (if PAYMENTS_MODE=manual)
MANUAL_QR_IMAGE_URL=https://your-frontend.vercel.app/GCASH_QRCODE.JPG
MANUAL_PAYMENT_EMAIL=payments@yourbrand.com
MANUAL_PAYMENT_INSTRUCTIONS=Scan the QR then email us the receipt with your order ID.

# Xendit settings (if PAYMENTS_MODE=xendit)
XENDIT_API_KEY=your_live_secret_key
XENDIT_CALLBACK_TOKEN=your_callback_token

# Admin
ADMIN_TOKEN=your_secure_random_token

# Email (SMTP)
EMAIL_FROM=orders@yourbrand.com
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Frontend (`client/.env`)

```bash
VITE_API_URL=https://your-backend.railway.app/api
```

## Important Notes

1. **SQLite Storage**: The backend uses SQLite stored in `server/storage/orders.sqlite`. On platforms like Railway/Render, this file persists between deployments. For production, consider migrating to PostgreSQL.

2. **QR Code Image**: Make sure `GCASH_QRCODE.JPG` is in `client/public/` so it's served at the root URL.

3. **CORS**: The backend CORS is configured to allow your frontend URL. Update `CLIENT_BASE_URL` in production.

4. **Webhooks** (Xendit mode): Update your Xendit dashboard webhook URL to `https://your-backend.railway.app/api/payment/webhook`

5. **HTTPS**: Always use HTTPS in production. Most platforms provide this automatically.

## Build Commands

**Frontend:**
```bash
cd client
npm run build
# Output: client/dist/
```

**Backend:**
```bash
cd server
npm start  # Uses node src/server.js
```

## Database Migration (Optional)

For production, consider migrating from SQLite to PostgreSQL:

1. Install `pg` package: `npm install pg`
2. Update `server/src/db/index.js` to use PostgreSQL connection
3. Update connection string in environment variables

## Troubleshooting

- **CORS errors**: Check `CLIENT_BASE_URL` matches your frontend domain
- **404 on API routes**: Ensure `VITE_API_URL` is set correctly
- **QR code broken**: Verify `MANUAL_QR_IMAGE_URL` is publicly accessible
- **Webhook not working**: Check Xendit callback URL and token

