const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handle(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || 'Request failed');
    error.details = errorBody;
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

