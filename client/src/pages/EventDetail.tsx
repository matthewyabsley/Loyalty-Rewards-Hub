import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Check } from 'lucide-react';

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { events, bookEvent } = useData();
  const [booked, setBooked] = useState(false);

  const event = events.find(e => e.id === id);
  if (!event) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
          <h1>Event</h1>
        </div>
        <div className="empty-state"><p>Event not found</p></div>
      </div>
    );
  }

  function handleBook() {
    bookEvent(event!.id);
    setBooked(true);
  }

  if (booked) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: '#1DB26415', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={32} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Event Booked!</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>{event.title}</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
          {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {event.time}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ maxWidth: 280 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Event Details</h1>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{
          background: `linear-gradient(135deg, var(--primary-dark), var(--primary))`,
          borderRadius: 20, padding: 24, color: '#fff', marginBottom: 20,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.2)',
            padding: '4px 10px', borderRadius: 10,
          }}>{event.category}</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 12, marginBottom: 8 }}>{event.title}</h2>
          <p style={{ fontSize: 28, fontWeight: 700 }}>£{event.price}</p>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{event.description}</p>

        <div style={{
          background: 'var(--card)', borderRadius: 14, padding: 16,
          border: '1px solid var(--border)', marginBottom: 24,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Date</p>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Time</p>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{event.time}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Spots Left</p>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{event.spotsLeft}</p>
            </div>
          </div>
        </div>

        <button onClick={handleBook} disabled={event.spotsLeft === 0} className="btn-primary">
          {event.spotsLeft === 0 ? 'Sold Out' : `Book Now · £${event.price}`}
        </button>
      </div>
    </div>
  );
}
