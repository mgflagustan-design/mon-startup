import { useNavigate } from 'react-router-dom';
import { CartSummary } from '../components/CartSummary.jsx';
import { useCart } from '../state/CartContext.jsx';
import { formatCurrency } from '../utils/format.js';

export function CartPage() {
  const { items, totals, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-6xl">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Start adding items to your cart to continue shopping</p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 rounded-lg bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-32 flex-shrink-0 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.id, item.size, Number(event.target.value))
                      }
                      className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <CartSummary
            total={totals.totalAmount}
            ctaLabel="Proceed to Checkout"
            onAction={() => navigate('/checkout')}
          />
        </div>
      </div>
    </div>
  );
}

