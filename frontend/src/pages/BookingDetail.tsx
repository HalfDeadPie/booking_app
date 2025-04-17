import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  const fetchBooking = () => {
    axios.get(`http://localhost:3000/bookings/${id}`).then(res => setBooking(res.data));
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const confirm = async () => {
    await axios.post(`http://localhost:3000/bookings/${id}/confirm`);
    fetchBooking();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Booking ID: {id}</h2>
      <p>Status: {booking?.status}</p>
      <ul>
        {booking?.units.map((u: any) => (
          <li key={u.id}>
            Unit {u.id}: {u.ticket || 'Pending'}
          </li>
        ))}
      </ul>
      {booking?.status === 'RESERVED' && <button onClick={confirm}>Confirm Booking</button>}
    </div>
  );
}
