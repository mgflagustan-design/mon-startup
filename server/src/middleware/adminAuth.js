const env = require('../config/env');

function adminAuth(req, res, next) {
  if (!env.adminToken || !env.adminToken.trim()) {
    console.warn('[adminAuth] ADMIN_TOKEN is not configured in .env. Admin routes are unprotected.');
    return next(); // Allow access if no token is configured (dev convenience)
  }

  const rawToken =
    req.headers['x-admin-token'] ||
    req.headers['X-Admin-Token'] ||
    req.headers['X-ADMIN-TOKEN'] ||
    (req.headers['authorization'] && req.headers['authorization'].replace(/^Bearer\s+/i, '')) ||
    '';

  const receivedToken = rawToken.trim();
  const expectedToken = env.adminToken.trim();

  // Debug logging (only in development)
  if (env.nodeEnv === 'development') {
    console.log('[adminAuth] Received token:', receivedToken ? `${receivedToken.substring(0, 4)}...` : 'empty');
    console.log('[adminAuth] Expected token:', expectedToken ? `${expectedToken.substring(0, 4)}...` : 'empty');
  }

  if (receivedToken === expectedToken) {
    return next();
  }

  return res.status(401).json({ 
    message: 'Unauthorized: Invalid admin token',
    hint: 'Make sure the token in your request matches ADMIN_TOKEN in your backend .env file'
  });
}

module.exports = adminAuth;

