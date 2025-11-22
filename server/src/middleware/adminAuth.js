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
    console.log('[adminAuth] Received token:', receivedToken ? `${receivedToken.substring(0, 4)}...${receivedToken.substring(receivedToken.length - 2)} (length: ${receivedToken.length})` : 'empty');
    console.log('[adminAuth] Expected token:', expectedToken ? `${expectedToken.substring(0, 4)}...${expectedToken.substring(expectedToken.length - 2)} (length: ${expectedToken.length})` : 'empty');
    console.log('[adminAuth] Tokens match:', receivedToken === expectedToken);
    console.log('[adminAuth] Request headers:', {
      'x-admin-token': req.headers['x-admin-token'] ? 'present' : 'missing',
      'X-Admin-Token': req.headers['X-Admin-Token'] ? 'present' : 'missing',
      'X-ADMIN-TOKEN': req.headers['X-ADMIN-TOKEN'] ? 'present' : 'missing',
      'authorization': req.headers['authorization'] ? 'present' : 'missing',
    });
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

