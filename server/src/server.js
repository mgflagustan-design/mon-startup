const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { httpLogger } = require('./utils/logger');
const { initDatabase } = require('./db');

const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orders');
const webhookRoutes = require('./routes/webhook');

async function start() {
  await initDatabase();

  const app = express();

  app.use(cors({ origin: env.clientBaseUrl }));
  app.use(express.json({ limit: '1mb' }));
  app.use(httpLogger);

  app.get('/', (req, res) => {
    res.json({ 
      message: 'Mon Threads E-Commerce API',
      status: 'running',
      endpoints: {
        products: '/api/products',
        checkout: '/api/checkout',
        orders: '/api/orders',
        webhook: '/api/payment/webhook',
        health: '/api/health'
      },
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/products', productRoutes);
  app.use('/api/checkout', checkoutRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api', webhookRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || 'Internal server error',
      details: err.details,
    });
  });

  app.listen(env.port, () => {
    console.log(`API server listening on ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

