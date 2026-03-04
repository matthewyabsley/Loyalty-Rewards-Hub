import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Calendar, Users, MapPin } from 'lucide-react';

export default function Events() {
  const navigate = useNavigate();
  const { events } = useData();

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Events</h1>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {events.map(event => (
          <button key={event.id} onClick={() => navigate(`/event/${event.id}`)} style={{
            background: 'var(--card)', borderRadius: 16, padding: 16,
            border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', width: '100%',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--primary)',
                background: 'var(--primary)' + '12', padding: '3px 10px', borderRadius: 10,
              }}>{event.category}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>£{event.price}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{event.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{event.description}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={14} /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={14} /> {event.spotsLeft} spots
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
