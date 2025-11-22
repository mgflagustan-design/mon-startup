const products = [
  {
    id: 'tee-classic',
    name: 'Classic Crew Tee',
    price: 999,
    category: 'Top',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    description: 'Ultra-soft cotton crew neck tee available in multiple colors.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-air',
    name: 'Airlite Hoodie',
    price: 2199,
    category: 'Outerwear',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight hoodie with moisture-wicking fabric for tropical weather.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'denim-relaxed',
    name: 'Relaxed Denim',
    price: 2590,
    category: 'Bottom',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    description: 'Relaxed fit denim with a subtle taper and stretch for daily wear.',
    sizes: ['26', '28', '30', '32', '34'],
  },
  {
    id: 'dress-slip',
    name: 'Silk Slip Dress',
    price: 3290,
    category: 'Dress',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
    description: 'Bias-cut silk slip dress perfect for elevated evenings.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'shorts-linen',
    name: 'Linen City Shorts',
    price: 1490,
    category: 'Bottom',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Breathable linen shorts with adjustable waistband.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'jacket-bomber',
    name: 'Minimal Bomber',
    price: 2890,
    category: 'Outerwear',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1521572160346-57c249e74f66?auto=format&fit=crop&w=900&q=80',
    description: 'Cropped bomber jacket with hidden pockets and matte finish.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'set-athleisure',
    name: 'Athleisure Twin Set',
    price: 1990,
    category: 'Set',
    stock: 70,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    description: 'Matching ribbed top and jogger set with four-way stretch.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'polo-luxe',
    name: 'Luxe Knit Polo',
    price: 1799,
    category: 'Top',
    stock: 90,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    description: 'Breathable knit polo shirt with mother-of-pearl buttons.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'cap-sun',
    name: 'Sun Shield Cap',
    price: 890,
    category: 'Accessory',
    stock: 150,
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    description: 'UV-blocking cap with adjustable strap and sweatband lining.',
    sizes: ['One Size'],
  },
];

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Handle GET request
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
};
