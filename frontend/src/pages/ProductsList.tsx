import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductsList() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => {
        console.log('PRODUCTS RESPONSE:', res.data);
        setProducts(res.data);
      })
      .catch(err => console.error('API ERROR:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
