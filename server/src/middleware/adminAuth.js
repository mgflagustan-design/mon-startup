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

  // Check if the token is Base64 encoded (indicated by the x-admin-token-encoded header)
  const isEncoded = req.headers['x-admin-token-encoded'] === 'base64' || 
                    req.headers['X-Admin-Token-Encoded'] === 'base64';
  
  let receivedToken;
  try {
    if (isEncoded && rawToken) {
      // Decode Base64 token
      receivedToken = Buffer.from(rawToken.trim(), 'base64').toString('utf-8');
    } else {
      receivedToken = rawToken.trim();
    }
  } catch (err) {
    console.log('[adminAuth] Failed to decode token:', err.message);
    receivedToken = rawToken.trim(); // Fallback to raw token
  }
  
  const expectedToken = env.adminToken.trim();

  // Always log authentication attempts (for debugging in production)
  console.log('[adminAuth] Auth attempt:', {
    receivedPrefix: receivedToken ? `${receivedToken.substring(0, 4)}...` : 'empty',
    receivedLength: receivedToken.length,
    expectedPrefix: expectedToken ? `${expectedToken.substring(0, 4)}...` : 'empty',
    expectedLength: expectedToken.length,
    tokensMatch: receivedToken === expectedToken,
    hasHeader: !!(req.headers['x-admin-token'] || req.headers['X-Admin-Token'] || req.headers['X-ADMIN-TOKEN'] || req.headers['authorization']),
  });

  if (receivedToken === expectedToken) {
    console.log('[adminAuth] ✅ Authentication successful');
    return next();
  }

  console.log('[adminAuth] ❌ Authentication failed - tokens do not match');
  return res.status(401).json({ 
    message: 'Unauthorized: Invalid admin token',
    hint: 'Make sure the token in your request matches ADMIN_TOKEN in your backend .env file',
    debug: env.nodeEnv === 'development' ? {
      receivedLength: receivedToken.length,
      expectedLength: expectedToken.length,
    } : undefined,
  });
}

module.exports = adminAuth;

