import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard.jsx';
import { getProducts } from '../api/client.js';

export function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Unable to load products. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading curated looks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

