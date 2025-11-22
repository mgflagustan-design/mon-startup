import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/client.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/format.js';

export function AdminDashboardPage() {
  const [status, setStatus] = useState('paid');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin-token') || '');
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

  function handleTokenChange(value) {
    setAdminToken(value);
    if (value) {
      localStorage.setItem('admin-token', value);
    } else {
      localStorage.removeItem('admin-token');
    }
  }

  async function handleStatusUpdate(orderId, nextStatus) {
    if (!adminToken) {
      setActionError('Set the admin token first to update orders.');
      return;
    }

    try {
      setActionError(null);
      setActionMessage(null);
      setActionLoadingId(`${nextStatus}-${orderId}`);
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
    } catch (err) {
      setActionError(err.message || 'Unable to update order.');
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">
            Monitor payments in real time. Webhooks auto-update the list.
          </p>
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="all">All</option>
        </select>
      </div>

      <div className="mt-4 grid gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Admin token</label>
          <input
            type="password"
            value={adminToken}
            onChange={(event) => handleTokenChange(event.target.value)}
            placeholder="Enter token to unlock status actions"
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Stored locally only. Required for Mark as Paid actions.
          </p>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900">Manual payment verification</p>
          <p>
            When you receive a buyer&apos;s receipt, mark their order as paid here. They will
            automatically get the confirmation email.
          </p>
        </div>
      </div>

      {actionMessage && (
        <p className="mt-4 rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {actionMessage}
        </p>
      )}
      {actionError && (
        <p className="mt-4 rounded-md bg-rose-50 px-4 py-2 text-sm text-rose-600">{actionError}</p>
      )}

      {loading && <p className="mt-6 text-gray-500">Loading orders...</p>}
      {error && <p className="mt-6 text-rose-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id}</td>
                  <td className="px-4 py-3 text-gray-900">{order.customerName}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.paymentMethod || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {order.status !== 'paid' ? (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'paid')}
                        disabled={actionLoadingId === `paid-${order.id}`}
                        className="rounded-md bg-brand px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {actionLoadingId === `paid-${order.id}` ? 'Updating…' : 'Mark as Paid'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && (
            <p className="px-4 py-6 text-center text-sm text-gray-500">
              No orders found for this status.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

