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
    <div className="py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
            <p className="mt-2 text-gray-600">
              We ship nationwide. After checkout you will receive payment instructions via email.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-5 text-sm text-rose-700">
              <p className="font-semibold mb-2">Checkout Error</p>
              <p className="mb-3">{error}</p>
              <div className="mt-3 space-y-2 text-xs text-rose-600 bg-rose-100/50 p-3 rounded">
                <p><strong>Current API URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:4000/api (default)'}</p>
                <p className="mt-2"><strong>To fix this:</strong></p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Deploy your backend to Railway/Render (see DEPLOYMENT.md)</li>
                  <li>In Vercel → Settings → Environment Variables, add: <code className="bg-rose-200 px-1 rounded">VITE_API_URL</code> = <code className="bg-rose-200 px-1 rounded">https://your-backend-url.com/api</code></li>
                  <li>Redeploy your Vercel project</li>
                </ol>
              </div>
            </div>
          )}

          {['fullName', 'email', 'phone'].map((field) => (
            <label key={field} className="block">
              <span className="text-sm font-semibold text-gray-700">
                {field === 'fullName' && 'Full Name'}
                {field === 'email' && 'Email Address'}
                {field === 'phone' && 'Phone Number'}
              </span>
              <input
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
                placeholder={
                  field === 'fullName' ? 'John Doe'
                  : field === 'email' ? 'john@example.com'
                  : '+63 912 345 6789'
                }
              />
            </label>
          ))}

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Shipping Address</span>
            <textarea
              name="address"
              rows="4"
              required
              value={form.address}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition resize-none"
              placeholder="Street address, City, Province, Postal Code"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : (
              'Complete Order & Get Payment QR'
            )}
          </button>
        </form>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <CartSummary total={totals.totalAmount} />
        </div>
      </div>
    </div>
  );
}

