import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/client.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/format.js';
import { useAdmin } from '../state/AdminContext.jsx';

export function AdminDashboardPage() {
  const { adminToken } = useAdmin();
  const [status, setStatus] = useState('paid');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    getOrders(status === 'all' ? undefined : status)
      .then(setOrders)
      .catch(() => setError('Unable to fetch orders.'))
      .finally(() => setLoading(false));
  }, [status, refreshKey]);

  async function handleStatusUpdate(orderId, nextStatus) {
    if (!adminToken || !adminToken.trim()) {
      setActionError('Admin token is required. Please log in again at /admin/login');
      return;
    }

    try {
      setActionError(null);
      setActionMessage(null);
      setActionLoadingId(`${nextStatus}-${orderId}`);
      
      console.log('Updating order with token:', adminToken ? 'Token present' : 'No token');
      
      await updateOrderStatus(
        orderId,
        {
          status: nextStatus,
          paymentMethod: nextStatus === 'paid' ? 'manual_qr' : 'manual_review',
        },
        adminToken,
      );
      setActionMessage(`Order ${orderId} marked as ${nextStatus}.`);
      setRefreshKey((key) => key + 1);
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err) {
      console.error('Status update error:', err);
      let errorMsg = err.message || 'Unable to update order.';
      
      if (err.status === 401) {
        errorMsg = 'Unauthorized. Please check your admin token and log in again at /admin/login';
      }
      
      setActionError(errorMsg);
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoadingId(null);
    }
  }

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'paid').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    failed: orders.filter((o) => o.status === 'failed').length,
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor and manage orders in real time</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Paid</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{stats.paid}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <p className="text-sm text-rose-700">Failed</p>
          <p className="mt-2 text-3xl font-bold text-rose-700">{stats.failed}</p>
        </div>
      </div>

      {/* Filter and Info */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
          <p className="font-medium">💡 Tip:</p>
          <p>When you receive a payment receipt, mark the order as paid to send the confirmation email automatically.</p>
        </div>
      </div>

      {/* Messages */}
      {actionMessage && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
          ✓ {actionMessage}
        </div>
      )}
      {actionError && (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
          ⚠ {actionError}
        </div>
      )}

      {/* Orders Table */}
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-rose-700">
          {error}
        </div>
      )}

      {!adminToken && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
          <p className="font-medium">⚠️ Admin token not found</p>
          <p className="mt-1">You need to log in with your admin token to update orders. Please visit <a href="/admin/login" className="underline font-semibold">/admin/login</a> to authenticate.</p>
        </div>
      )}

      {adminToken && (
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
          <p className="font-medium">ℹ️ Using admin token</p>
          <p className="mt-1 text-xs">Token: {adminToken.substring(0, 4)}...{adminToken.substring(adminToken.length - 2)} (Make sure this matches your backend ADMIN_TOKEN)</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Payment</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700">Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.paymentMethod || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status !== 'paid' ? (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'paid')}
                          disabled={actionLoadingId === `paid-${order.id}` || !adminToken || !adminToken.trim()}
                          className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand/20"
                          title={!adminToken ? 'Please log in first' : ''}
                        >
                          {actionLoadingId === `paid-${order.id}` ? 'Updating…' : 'Mark as Paid'}
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600">✓ Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!orders.length && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No orders found for this status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

