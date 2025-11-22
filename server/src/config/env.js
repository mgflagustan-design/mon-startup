const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

const requiredVars = ['CLIENT_BASE_URL', 'SERVER_BASE_URL'];

const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  serverBaseUrl: process.env.SERVER_BASE_URL || 'http://localhost:4000',
  xenditApiKey: process.env.XENDIT_API_KEY || '',
  xenditCallbackToken: process.env.XENDIT_CALLBACK_TOKEN || '',
  paymentsMode: (process.env.PAYMENTS_MODE || 'xendit').toLowerCase(),
  adminToken: (process.env.ADMIN_TOKEN || '').trim(),
  emailFrom: process.env.EMAIL_FROM || 'orders@example.com',
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: Number(process.env.EMAIL_PORT || 587),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  manualQrImageUrl: process.env.MANUAL_QR_IMAGE_URL || '',
  manualPaymentEmail: process.env.MANUAL_PAYMENT_EMAIL || process.env.EMAIL_FROM || 'orders@example.com',
  manualPaymentInstructions:
    process.env.MANUAL_PAYMENT_INSTRUCTIONS ||
    'Scan the QR code, send payment, then email your receipt for verification.',
};

for (const key of requiredVars) {
  if (!env[keyMap(key)]) {
    // eslint-disable-next-line no-console
    console.warn(`[env] ${key} is not set - using default value`);
  }
}

function keyMap(varName) {
  switch (varName) {
    case 'CLIENT_BASE_URL':
      return 'clientBaseUrl';
    case 'SERVER_BASE_URL':
      return 'serverBaseUrl';
    default:
      return varName;
  }
}

module.exports = env;

