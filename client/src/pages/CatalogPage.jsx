import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard.jsx';
import { getProducts } from '../api/client.js';
import { fallbackProducts } from '../data/products.js';

export function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.warn('API failed, using fallback products:', err);
        // Use fallback products if API fails
        setProducts(fallbackProducts);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Curated Collection
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover premium clothing designed for modern living
        </p>
      </div>

      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading curated looks...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-center text-rose-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

