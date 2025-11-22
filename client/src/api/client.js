const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
  return fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken ? { 'x-admin-token': adminToken } : {}),
    },
    body: JSON.stringify(payload),
  }).then(handle);
}

