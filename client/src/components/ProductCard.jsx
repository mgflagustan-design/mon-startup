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
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full rounded-lg object-cover"
        loading="lazy"
      />
      <div className="mt-4 flex flex-col gap-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            {product.category}
          </p>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        </div>
        <p className="text-sm text-gray-500">{product.description}</p>
        <p className="text-xl font-semibold text-brand">{formatCurrency(product.price)}</p>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">
            Size
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="ml-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-gray-600">
            Qty
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="ml-2 w-16 rounded-md border border-gray-200 px-2 py-1 text-sm"
            />
          </label>
        </div>

        <button
          onClick={handleAdd}
          className="mt-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
        >
          {isAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

