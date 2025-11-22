const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Log API base for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE);
}


async function handle(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let errorMessage = errorBody.message || 'Request failed';
    
    // Provide more helpful error messages
    if (response.status === 0 || response.status >= 500) {
      errorMessage = 'Unable to connect to the server. Please check if the backend is running and configured correctly.';
    } else if (response.status === 404) {
      errorMessage = 'API endpoint not found. Please check your VITE_API_URL configuration.';
    } else if (response.status === 401) {
      errorMessage = errorBody.message || 'Authentication failed. Please check your configuration.';
    }
    
    const error = new Error(errorMessage);
    error.details = errorBody;
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function getProducts() {
  return fetch(`${API_BASE}/products`).then(handle);
}

export function createCheckout(payload) {
  return fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function getOrder(orderId) {
  return fetch(`${API_BASE}/orders/${orderId}`).then(handle);
}

export function getOrders(status) {
  const url = new URL(`${API_BASE}/orders`);
  if (status && status !== 'all') {
    url.searchParams.append('status', status);
  }
  return fetch(url).then(handle);
}

export function updateOrderStatus(orderId, payload, adminToken) {
  if (!adminToken || !adminToken.trim()) {
    return Promise.reject(new Error('Admin token is required'));
  }

  const trimmedToken = adminToken.trim();
  
  // Base64 encode the token to safely handle any characters (including Unicode)
  // HTTP headers must only contain ISO-8859-1 characters, so we encode the token
  // Using encodeURIComponent -> unescape -> btoa to properly handle UTF-8
  let encodedToken;
  try {
    encodedToken = btoa(unescape(encodeURIComponent(trimmedToken)));
  } catch (err) {
    // Fallback: if encoding fails, try direct btoa (for ASCII-only tokens)
    console.warn('[API] Base64 encoding failed, using direct encoding:', err.message);
    encodedToken = btoa(trimmedToken);
  }
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log('[API] Updating order status:', {
      orderId,
      tokenPrefix: trimmedToken.substring(0, 4) + '...',
      tokenLength: trimmedToken.length,
      encoded: true,
    });
  }
  
  return fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': encodedToken,
      'x-admin-token-encoded': 'base64', // Flag to indicate the token is Base64 encoded
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

