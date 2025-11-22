const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.emailHost || !env.emailUser || !env.emailPassword) {
    console.warn('[email] SMTP is not fully configured - skipping emails');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    secure: env.emailPort === 465,
    auth: {
      user: env.emailUser,
      pass: env.emailPassword,
    },
  });

  return transporter;
}

async function sendOrderConfirmation(order) {
  const mailer = getTransporter();
  if (!mailer) return;

  const formattedTotal = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(order.total);

  const html = `
    <h2>Order Confirmation</h2>
    <p>Hi ${order.customerName},</p>
    <p>Your payment has been confirmed. Here are the details:</p>
    <ul>
      <li><strong>Order ID:</strong> ${order.id}</li>
      <li><strong>Status:</strong> ${order.status}</li>
      <li><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</li>
      <li><strong>Total:</strong> ${formattedTotal}</li>
    </ul>
    <p>We will ship your order soon. Estimated delivery within 5-7 business days.</p>
    <p>Thank you,<br/>Mon Startup Clothing</p>
  `;

  await mailer.sendMail({
    from: env.emailFrom,
    to: order.email,
    subject: `Order ${order.id} confirmed`,
    html,
  });
}

async function sendManualPaymentInstructions(order, manualInfo = {}) {
  const mailer = getTransporter();
  if (!mailer) return;

  const instructions = manualInfo.instructions || env.manualPaymentInstructions;
  const paymentEmail = manualInfo.paymentEmail || env.manualPaymentEmail || env.emailFrom;
  const qrImageUrl = manualInfo.qrImageUrl || env.manualQrImageUrl;

  const html = `
    <h2>Complete Your Payment</h2>
    <p>Hi ${order.customerName},</p>
    <p>We reserved your order <strong>${order.id}</strong>. Please complete payment using the QR details below and email us the receipt.</p>
    <p>${instructions}</p>
    ${qrImageUrl ? `<p><img src="${qrImageUrl}" alt="Payment QR" style="max-width:280px"/></p>` : ''}
    <p>Once paid, send the receipt to <a href="mailto:${paymentEmail}">${paymentEmail}</a> with your order ID in the subject line.</p>
    <p>Thank you,<br/>Mon Startup Clothing</p>
  `;

  await mailer.sendMail({
    from: env.emailFrom,
    to: order.email,
    subject: `Payment instructions for order ${order.id}`,
    html,
  });
}

module.exports = {
  sendOrderConfirmation,
  sendManualPaymentInstructions,
};

