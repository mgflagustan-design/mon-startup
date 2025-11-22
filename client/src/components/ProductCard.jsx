import { useState } from 'react';
import { useCart } from '../state/CartContext.jsx';
import { formatCurrency } from '../utils/format.js';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm">
          {product.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.description}</p>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-2xl font-bold text-brand">{formatCurrency(product.price)}</p>
          {product.stock > 0 && (
            <span className="text-xs text-gray-500">{product.stock} in stock</span>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700">Size:</label>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all ${
            isAdded
              ? 'bg-emerald-500'
              : 'bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20'
          }`}
        >
          {isAdded ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

