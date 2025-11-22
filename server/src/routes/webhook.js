const express = require('express');
const {
  validateWebhook,
  normalizeWebhookPayload,
} = require('../services/paymentService');
const { updateOrder, getOrderById } = require('../db/orderRepository');
const { sendOrderConfirmation } = require('../services/emailService');

const router = express.Router();

router.post('/payment/webhook', async (req, res, next) => {
  try {
    validateWebhook(req.headers);
    const payload = normalizeWebhookPayload(req.body);

    await updateOrder(payload.orderId, {
      status: payload.status,
      paymentMethod: payload.paymentMethod,
      paymentChannel: payload.paymentChannel,
    });

    if (payload.status === 'paid') {
      const order = await getOrderById(payload.orderId);
      if (order) {
        await sendOrderConfirmation(order);
      }
    }

    return res.json({ received: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

