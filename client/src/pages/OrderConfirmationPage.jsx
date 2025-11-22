import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getOrder } from '../api/client.js';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCurrency } from '../utils/format.js';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;

    const fetchOrder = () => {
      getOrder(orderId)
        .then((data) => {
          setOrder(data);
          if (data.status !== 'pending' && interval) {
            clearInterval(interval);
          }
        })
        .catch(() => setError('Unable to fetch order details.'));
    };

    fetchOrder();
    interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  const redirectStatus = searchParams.get('status');

  const headline = useMemo(() => {
    if (!order) return 'Tracking your order...';
    if (order.status === 'paid') return 'Payment confirmed!';
    if (order.status === 'failed') return 'Payment failed';
    return 'Awaiting payment confirmation';
  }, [order]);

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md rounded-lg bg-rose-50 border border-rose-200 p-6">
          <p className="text-rose-700 font-semibold">Unable to load order</p>
          <p className="mt-2 text-sm text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  const statusIcon = {
    paid: '✓',
    pending: '⏳',
    failed: '✗',
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          {!order ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading latest status...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-3xl mb-4">
                  {statusIcon[order.status] || '📦'}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{headline}</h1>
                {redirectStatus && (
                  <p className="mt-2 text-sm text-gray-500">
                    Payment status: <span className="font-medium text-brand">{redirectStatus}</span>
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Order ID</p>
                  <p className="font-mono text-lg font-bold text-gray-900">{order.id}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Payment Status</p>
                  <div className="mt-1">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.paymentMethod || 'Pending'}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-brand">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Shipping Address</p>
                <p className="text-gray-700 font-medium">{order.address}</p>
                <p className="mt-3 text-sm text-gray-600">
                  📦 Estimated delivery within 5-7 business days after payment confirmation.
                </p>
              </div>

              {order.status === 'pending' && (
                <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                  <p className="font-medium">⏳ Awaiting Payment</p>
                  <p className="mt-1">We'll notify you once your payment is confirmed.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

