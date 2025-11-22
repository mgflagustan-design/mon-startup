import { formatCurrency } from '../utils/format.js';

export function CartSummary({ total, ctaLabel, onAction, disabled }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
      <div className="mt-4 space-y-3 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="text-brand">FREE</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      {ctaLabel && (
        <button
          onClick={onAction}
          disabled={disabled}
          className="mt-6 w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

