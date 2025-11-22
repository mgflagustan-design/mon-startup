const express = require('express');
const { listOrders, getOrderById, updateOrder } = require('../db/orderRepository');
const adminAuth = require('../middleware/adminAuth');
const { sendOrderConfirmation } = require('../services/emailService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const orders = await listOrders({ status });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/:orderId', async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:orderId/status', adminAuth, async (req, res, next) => {
  try {
    const { status, paymentMethod, paymentChannel } = req.body || {};
    const allowedStatuses = ['pending', 'paid', 'failed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `Status is required and must be one of: ${allowedStatuses.join(', ')}` });
    }

    const updated = await updateOrder(req.params.orderId, {
      status,
      paymentMethod: paymentMethod || 'manual_verification',
      paymentChannel: paymentChannel || null,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'paid') {
      await sendOrderConfirmation(updated);
    }

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;


