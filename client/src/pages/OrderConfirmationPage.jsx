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
    return <div className="py-20 text-center text-rose-500">{error}</div>;
  }

  return (
    <div className="py-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-widest text-gray-400">Order</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">{headline}</h1>
        {redirectStatus && (
          <p className="mt-2 text-sm text-gray-500">
            Redirect result: <span className="font-medium text-brand">{redirectStatus}</span>
          </p>
        )}

        {!order && <p className="mt-6 text-gray-500">Loading latest status...</p>}

        {order && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs uppercase text-gray-400">Order ID</p>
                <p className="text-lg font-semibold text-gray-900">{order.id}</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs uppercase text-gray-400">Payment Status</p>
                <StatusBadge status={order.status} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs uppercase text-gray-400">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order.paymentMethod || 'Pending'}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs uppercase text-gray-400">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 p-4">
              <p className="text-xs uppercase text-gray-400">Shipping</p>
              <p className="text-gray-700">
                {order.address}. Estimated delivery within 5-7 business days after payment
                confirmation.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

