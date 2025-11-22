const axios = require('axios');
const env = require('../config/env');

const XENDIT_INVOICE_API = 'https://api.xendit.co/v2/invoices';

function getAuthHeader() {
  if (!env.xenditApiKey) {
    throw new Error(
      'XENDIT_API_KEY is missing. Please add it to your environment variables.',
    );
  }

  const token = Buffer.from(`${env.xenditApiKey}:`).toString('base64');
  return {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json',
  };
}

async function createInvoice(order, { successUrl, failureUrl }) {
  const payload = {
    external_id: order.id,
    amount: order.total,
    currency: 'PHP',
    description: `Order ${order.id}`,
    customer: {
      name: order.customerName,
      email: order.email,
      mobile_number: order.phone,
    },
    customer_notification_preference: {
      invoice_created: ['email'],
      invoice_reminder: ['email'],
      invoice_paid: ['email'],
    },
    success_redirect_url: successUrl,
    failure_redirect_url: failureUrl,
    payment_methods: ['GCASH', 'BANK_TRANSFER', 'QR_PH'],
    metadata: {
      orderId: order.id,
    },
    items: order.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  const { data } = await axios.post(XENDIT_INVOICE_API, payload, {
    headers: getAuthHeader(),
  });

  return data;
}

function validateWebhook(headers) {
  if (!env.xenditCallbackToken) {
    // If no callback token configured, accept all (useful for local dev)
    return true;
  }

  const token =
    headers['x-callback-token'] ||
    headers['X-Callback-Token'] ||
    headers['X-CALLBACK-TOKEN'];

  if (!token || token !== env.xenditCallbackToken) {
    throw new Error('Invalid webhook token');
  }

  return true;
}

function normalizeWebhookPayload(payload) {
  if (!payload?.data) {
    throw new Error('Malformed webhook payload');
  }

  const { status, external_id: orderId, payment_method, paid_at } = payload.data;

  let normalizedStatus = 'pending';
  if (status === 'PAID') normalizedStatus = 'paid';
  if (status === 'EXPIRED' || status === 'CANCELED') normalizedStatus = 'failed';

  return {
    orderId,
    status: normalizedStatus,
    paymentMethod: payment_method?.type || null,
    paymentChannel: payment_method?.channel_code || null,
    paidAt: paid_at || null,
    raw: payload,
  };
}

module.exports = {
  createInvoice,
  validateWebhook,
  normalizeWebhookPayload,
};

