import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductsList from './pages/ProductsList';
import ProductDetail from './pages/ProductDetail';
import BookingDetail from './pages/BookingDetail';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Home</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
      </Routes>
    </Router>
  );
}
