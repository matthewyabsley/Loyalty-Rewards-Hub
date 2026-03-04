import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Film, ExternalLink } from 'lucide-react';

const LOCAL_EVENTS = [
  { id: 'l1', title: 'Wilmslow Artisan Market', description: 'Browse local artisan stalls with handmade crafts, fresh produce, and street food.', date: '2026-03-08', time: '10:00 - 16:00', location: 'Grove Street, Wilmslow', category: 'Market' },
  { id: 'l2', title: 'Spring Food Festival', description: 'Celebrate spring with local restaurants showcasing seasonal menus and live cooking demos.', date: '2026-03-22', time: '11:00 - 18:00', location: 'Wilmslow Leisure Centre', category: 'Food' },
  { id: 'l3', title: 'Wilmslow Running Club 5K', description: 'Join the community for a scenic 5K run through Lindow Common.', date: '2026-04-05', time: '09:00', location: 'Lindow Common', category: 'Sports' },
  { id: 'l4', title: 'Live Music at The Coach & Four', description: 'Local bands performing acoustic sets every Friday evening.', date: '2026-03-14', time: '20:00 - 23:00', location: 'The Coach & Four, Wilmslow', category: 'Music' },
  { id: 'l5', title: 'Wilmslow Beer Festival', description: 'Over 40 real ales, craft beers and ciders from local breweries.', date: '2026-04-18', time: '12:00 - 22:00', location: 'Wilmslow Conservative Club', category: 'Food' },
  { id: 'l6', title: 'Easter Egg Hunt', description: 'Family-friendly Easter egg hunt in the park with prizes and activities.', date: '2026-04-04', time: '10:00 - 14:00', location: 'The Carrs Park, Wilmslow', category: 'Family' },
];

const CINEMA = [
  { id: 'c1', title: 'The Grand Budapest Hotel', time: '14:00, 17:30, 20:00', rating: 'PG-13' },
  { id: 'c2', title: 'Paddington 3', time: '11:00, 13:30, 16:00', rating: 'PG' },
  { id: 'c3', title: 'Oppenheimer', time: '18:00, 21:00', rating: '15' },
  { id: 'c4', title: 'Wonka', time: '10:30, 13:00, 15:30', rating: 'PG' },
];

export default function LocalEvents() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'events' | 'cinema'>('events');
  const [mapLocation, setMapLocation] = useState<string | null>(null);

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Wilmslow Local</h1>
      </div>

      <div style={{ display: 'flex', padding: '0 20px', gap: 8, marginTop: 4 }}>
        <button onClick={() => setTab('events')} style={{
          flex: 1, padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          background: tab === 'events' ? 'var(--primary)' : 'var(--card)',
          color: tab === 'events' ? '#fff' : 'var(--text)',
          border: tab === 'events' ? 'none' : '1px solid var(--border)',
        }}>Local Events</button>
        <button onClick={() => setTab('cinema')} style={{
          flex: 1, padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          background: tab === 'cinema' ? 'var(--primary)' : 'var(--card)',
          color: tab === 'cinema' ? '#fff' : 'var(--text)',
          border: tab === 'cinema' ? 'none' : '1px solid var(--border)',
        }}>Rex Cinema</button>
      </div>

      <div style={{ padding: 20 }}>
        {tab === 'events' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LOCAL_EVENTS.map(event => (
              <div key={event.id} style={{
                background: 'var(--card)', borderRadius: 14, padding: 16,
                border: '1px solid var(--border)',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: 'var(--primary)',
                  background: 'var(--primary)' + '12', padding: '2px 8px', borderRadius: 8,
                }}>{event.category}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 8, marginBottom: 4 }}>{event.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{event.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} /> {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                  </span>
                  <button onClick={() => setMapLocation(event.location)} style={{
                    fontSize: 12, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}>
                    <MapPin size={13} /> {event.location}
                  </button>
                </div>
                <button onClick={() => navigate(`/book-table?date=${event.date}`)} style={{
                  fontSize: 12, fontWeight: 600, color: 'var(--accent-dark)',
                  background: '#D4A85315', border: 'none', padding: '6px 14px',
                  borderRadius: 8, cursor: 'pointer',
                }}>Book a table after →</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              borderRadius: 14, padding: 16, color: '#fff', marginBottom: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Film size={18} />
                <span style={{ fontSize: 15, fontWeight: 700 }}>Rex Cinema Wilmslow</span>
              </div>
              <p style={{ fontSize: 12, opacity: 0.7 }}>Now showing</p>
            </div>
            {CINEMA.map(film => (
              <div key={film.id} style={{
                background: 'var(--card)', borderRadius: 14, padding: 16,
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{film.title}</h3>
                  <span style={{
                    fontSize: 10, fontWeight: 600, border: '1px solid var(--border)',
                    padding: '2px 8px', borderRadius: 6,
                  }}>{film.rating}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{film.time}</p>
                <button onClick={() => navigate(`/book-table`)} style={{
                  fontSize: 12, fontWeight: 600, color: 'var(--accent-dark)',
                  background: '#D4A85315', border: 'none', padding: '6px 14px',
                  borderRadius: 8, cursor: 'pointer',
                }}>Book a table after →</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {mapLocation && (
        <div className="modal-overlay" onClick={() => setMapLocation(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{mapLocation}</h3>
              <button onClick={() => setMapLocation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{
              width: '100%', height: 250, borderRadius: 12, overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Map"
              />
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(mapLocation)}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginTop: 12, padding: 10, fontSize: 13, fontWeight: 600,
                color: 'var(--primary)', textDecoration: 'none',
              }}
            >
              <ExternalLink size={14} /> Open in Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
