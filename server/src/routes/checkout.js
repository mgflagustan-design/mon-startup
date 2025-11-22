const express = require('express');
const env = require('../config/env');
const { products } = require('../data/products');
const { createOrder, updateOrder } = require('../db/orderRepository');
const { createInvoice } = require('../services/paymentService');
const { sendManualPaymentInstructions } = require('../services/emailService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { items = [], customer } = req.body || {};

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    const requiredFields = ['fullName', 'email', 'phone', 'address'];
    for (const field of requiredFields) {
      if (!customer?.[field]) {
        return res.status(400).json({ message: `Missing ${field}` });
      }
    }

    const enrichedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }
      return {
        ...product,
        quantity: item.quantity,
        size: item.size,
      };
    });

    const total = enrichedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await createOrder({
      customerName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      items: enrichedItems.map(
        ({ id, name, price, quantity, size }) => ({
          id,
          name,
          price,
          quantity,
          size,
        }),
      ),
      total,
      currency: 'PHP',
      status: 'pending',
    });

    if (env.paymentsMode === 'manual') {
      const manualInfo = {
        qrImageUrl: env.manualQrImageUrl,
        instructions: env.manualPaymentInstructions,
        paymentEmail: env.manualPaymentEmail,
      };
      await sendManualPaymentInstructions(order, manualInfo);
      return res.status(201).json({
        orderId: order.id,
        status: 'pending',
        manual: manualInfo,
      });
    }

    const successUrl = `${env.clientBaseUrl}/order/${order.id}?status=paid`;
    const failureUrl = `${env.clientBaseUrl}/order/${order.id}?status=failed`;
    const invoice = await createInvoice(
      {
        ...order,
        items: enrichedItems,
      },
      { successUrl, failureUrl },
    );

    const qrSource =
      invoice.qr_string ||
      invoice.available_payments?.find(
        (payment) =>
          payment.channel_category === 'QR_CODE' || payment.channel_code === 'QR_PH',
      )?.qr_string ||
      null;

    await updateOrder(order.id, {
      paymentMethod: 'xendit_invoice',
      paymentChannel: null,
      paymentLinkId: invoice.id,
      paymentUrl: invoice.invoice_url,
      metadata: invoice,
    });

    return res.status(201).json({
      orderId: order.id,
      status: 'pending',
      paymentUrl: invoice.invoice_url,
      availablePayments: invoice.available_payments || [],
      qrString: qrSource,
      expiresAt: invoice.expiry_date || null,
    });
  } catch (error) {
    if (error.response?.data) {
      error.details = error.response.data;
    }
    return next(error);
  }
});

module.exports = router;

