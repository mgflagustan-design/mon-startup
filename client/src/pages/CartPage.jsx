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
        <p className="text-lg text-gray-500">Your cart is empty.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 py-10 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm uppercase text-gray-400">Size {item.size}</p>
                <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <label className="text-xs text-gray-500">
                    Qty
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.id, item.size, Number(event.target.value))
                      }
                      className="ml-2 w-16 rounded-md border border-gray-200 px-2 py-1 text-sm"
                    />
                  </label>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-sm text-rose-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <CartSummary
        total={totals.totalAmount}
        ctaLabel="Proceed to Checkout"
        onAction={() => navigate('/checkout')}
      />
    </div>
  );
}

