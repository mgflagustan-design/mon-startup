import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartSummary } from '../components/CartSummary.jsx';
import { useCart } from '../state/CartContext.jsx';
import { createCheckout } from '../api/client.js';

const defaultForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
};

export function CheckoutPage() {
  const { items, totals, clearCart } = useCart();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [lastOrderTotal, setLastOrderTotal] = useState(null);
  const navigate = useNavigate();

  if (!items.length && !paymentDetails) {
    return (
      <div className="py-20 text-center text-gray-500">
        Your cart is empty. <button className="text-brand" onClick={() => navigate('/')}>Shop now</button>
      </div>
    );
  }

  function updateField(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        items: items.map(({ id, quantity, size }) => ({ id, quantity, size })),
        customer: form,
      };
      const response = await createCheckout(payload);
      setPaymentDetails(response);
      setLastOrderTotal(totals.totalAmount);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      let errorMessage = err.message || 'Failed to process checkout.';
      
      // Check if it's a network/connection error
      if (err.message?.includes('fetch') || err.status === 0) {
        errorMessage = 'Unable to connect to the payment server. Please ensure the backend is deployed and VITE_API_URL is configured correctly.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (paymentDetails) {
    const manualFlow = Boolean(paymentDetails.manual);
    const qrImage = manualFlow
      ? paymentDetails.manual?.qrImageUrl || null
      : paymentDetails.qrString
        ? `https://quickchart.io/qr?size=260&text=${encodeURIComponent(paymentDetails.qrString)}`
        : null;
    const instructions = manualFlow
      ? paymentDetails.manual?.instructions
      : 'Scan via any QR Ph-ready wallet or tap the payment page.';
    const paymentEmail = manualFlow ? paymentDetails.manual?.paymentEmail : null;

    return (
      <div className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">Step 2</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Complete your payment</h2>
            <p className="mt-2 text-sm text-gray-500">
              {manualFlow
                ? 'Use the QR below, then email your receipt so we can verify your payment.'
                : 'Scan the QR code below or open the payment link.'}{' '}
              Your order ID is{' '}
              <span className="font-mono text-gray-900">{paymentDetails.orderId}</span>.
            </p>
            {instructions && (
              <p className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">{instructions}</p>
            )}

            {qrImage ? (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <img
                  src={qrImage}
                  alt="QR for payment"
                  className="h-64 w-64 object-contain sm:h-72 sm:w-72"
                />
                <p className="text-sm text-gray-500">Compatible with any QR Ph-ready banking app.</p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                QR data not available. {manualFlow ? 'Use your saved QR or contact us.' : 'Please open the payment page instead.'}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {paymentDetails.paymentUrl && (
                <a
                  href={paymentDetails.paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white"
                >
                  Open Payment Page
                </a>
              )}
              <button
                onClick={() => navigate(`/order/${paymentDetails.orderId}`)}
                className="rounded-md border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
              >
                View Order Status
              </button>
              {paymentEmail && (
                <a
                  href={`mailto:${paymentEmail}?subject=Payment receipt for order ${paymentDetails.orderId}`}
                  className="rounded-md border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
                >
                  Email Receipt
                </a>
              )}
            </div>

            {!manualFlow && paymentDetails.expiresAt && (
              <p className="mt-4 text-xs text-gray-500">
                QR expires on {new Date(paymentDetails.expiresAt).toLocaleString()}.
              </p>
            )}
          </div>

          <CartSummary total={lastOrderTotal ?? totals.totalAmount} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 py-10 lg:grid-cols-[1.5fr,1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
          <p className="text-sm text-gray-500">
            We ship nationwide. After checkout you will receive payment instructions.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-rose-50 p-4 text-sm text-rose-600">
            <p className="font-semibold">Checkout Error</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs text-rose-500">
              If you're deploying, make sure your backend is running and VITE_API_URL is set in your environment variables.
            </p>
          </div>
        )}

        {['fullName', 'email', 'phone'].map((field) => (
          <label key={field} className="block text-sm font-medium text-gray-600">
            {field === 'fullName' && 'Full Name'}
            {field === 'email' && 'Email'}
            {field === 'phone' && 'Phone Number'}
            <input
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={updateField}
              required
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </label>
        ))}

        <label className="block text-sm font-medium text-gray-600">
          Shipping Address
          <textarea
            name="address"
            rows="3"
            required
            value={form.address}
            onChange={updateField}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Generating QR...' : 'Pay via GCash / Bank Transfer / QR Ph'}
        </button>
      </form>

      <CartSummary total={totals.totalAmount} />
    </div>
  );
}

