## Mon Threads E‑Commerce

Full-stack clothing storefront with live payments via Xendit (GCash, QR Ph, online bank transfer), SQLite persistence (sql.js), and React + Tailwind storefront.

### Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router
- **Backend:** Node.js 18, Express 5, sql.js (SQLite on disk), Nodemailer
- **Payments:** Xendit Invoices API (supports GCash, QR Ph, bank transfers)

### Prerequisites
- Node.js 18+
- Xendit account (API key + webhook callback token)
- SMTP credentials (SendGrid, Mailgun, etc.) for order emails

### Environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Populate the following:

| Key | Notes |
| --- | --- |
| `PAYMENTS_MODE` | `xendit` (default) or `manual` |
| `XENDIT_API_KEY` | Only needed for `xendit` mode (secret key) |
| `XENDIT_CALLBACK_TOKEN` | Only needed for `xendit` mode |
| `MANUAL_QR_IMAGE_URL` | Public/static URL to your QR image |
| `MANUAL_PAYMENT_EMAIL` | Inbox where shoppers send receipts |
| `MANUAL_PAYMENT_INSTRUCTIONS` | Text shown + emailed to shoppers |
| `ADMIN_TOKEN` | Shared secret for admin status updates |
| `CLIENT_BASE_URL` | e.g. `http://localhost:5173` |
| `SERVER_BASE_URL` | e.g. `http://localhost:4000` |
| `EMAIL_*` | SMTP credentials for confirmations/instructions |
| `VITE_API_URL` | Client → API base, e.g. `http://localhost:4000/api` |

### Running locally

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`.

### Payment Flow

**Xendit mode (`PAYMENTS_MODE=xendit`)**
1. Checkout creates an order (`pending`) and hits `POST https://api.xendit.co/v2/invoices`.
2. Shopper is given a redirect link + QR Ph payload.
3. Xendit notifies `/api/payment/webhook`; order shifts to `paid`/`failed`.
4. Confirmation email is sent automatically for paid orders.

**Manual QR mode (`PAYMENTS_MODE=manual`)**
1. Checkout returns your static QR + instructions instantly.
2. Shopper scans the QR and emails their receipt to `MANUAL_PAYMENT_EMAIL`.
3. You verify manually and update order status (e.g., via DB or future admin control).
4. Customer receives an email with the same instructions right after checkout.

### Webhook Setup (Xendit mode)
1. In Xendit Dashboard, set **Invoice Paid** webhook URL to `https://your-domain.com/api/payment/webhook`.
2. Copy the callback token into `XENDIT_CALLBACK_TOKEN`.
3. Allow-list your production server IP if required.

### Deployment
- **Backend:** Deploy Express app on Render, Railway, Fly.io, or similar. Ensure persistent storage for `/server/storage/orders.sqlite` (or swap to hosted Postgres).
- **Frontend:** Deploy Vite build to Netlify/Vercel/Cloudflare Pages. Configure `VITE_API_URL` to your backend’s `/api` URL.
- Update `CLIENT_BASE_URL` / `SERVER_BASE_URL` envs on both sides.

### Admin Dashboard
- Visit `/admin` to view all orders (filter by status). List auto-populates with webhook updates.
- To mark an order as paid (manual mode), call:
  ```
  curl -X PATCH http://localhost:4000/api/orders/{orderId}/status \
    -H "Content-Type: application/json" \
    -H "x-admin-token: ${ADMIN_TOKEN}" \
    -d '{"status":"paid","paymentMethod":"manual_qr"}'
  ```
  (Statuses allowed: `pending`, `paid`, `failed`). When set to `paid`, the confirmation email is sent automatically.

### Testing Tips
- Use Xendit **Test Mode** keys; generated invoice URLs simulate payment flows.
- To simulate paid status without Xendit, POST to `/api/payment/webhook` manually (see sample payload in `src/routes/webhook.js`).

### Folder Structure
```
mon-startup/
├── client/   # React storefront
└── server/   # Express API + payments (persists SQLite at server/storage/orders.sqlite)
```

