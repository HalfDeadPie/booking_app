import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [units, setUnits] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setProduct(res.data));

    const today = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + 6);
    const endDate = end.toISOString().split('T')[0];

    axios.post('http://localhost:3000/availability', {
      productId: id,
      localDateStart: today,
      localDateEnd: endDate
    }).then(res => setAvailability(res.data));
  }, [id]);

  const handleReserve = async (availabilityId: string) => {
    const res = await axios.post('http://localhost:3000/bookings', {
      productId: id,
      availabilityId,
      units
    });
    navigate(`/bookings/${res.data.id}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{product?.name}</h2>
      <label>
        Units to book:
        <input type="number" min={1} max={product?.capacity || 10} value={units} onChange={e => setUnits(Number(e.target.value))} />
      </label>
      <h3>Availability (Next 7 Days)</h3>
      <ul>
        {availability.map(a => (
          <li key={a.id}>
            {a.localDate} — {a.status} ({a.vacancies} left)
            {a.available && <button onClick={() => handleReserve(a.id)} style={{ marginLeft: 10 }}>Reserve</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
