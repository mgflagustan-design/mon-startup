const env = require('../config/env');

function adminAuth(req, res, next) {
  if (!env.adminToken) {
    return res.status(500).json({ message: 'Admin token is not configured on the server.' });
  }

  const token =
    req.headers['x-admin-token'] ||
    req.headers['X-Admin-Token'] ||
    req.headers['authorization'] ||
    '';

  if (token === env.adminToken || token === `Bearer ${env.adminToken}`) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = adminAuth;

