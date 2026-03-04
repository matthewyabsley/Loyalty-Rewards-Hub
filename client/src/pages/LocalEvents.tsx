import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Film, ExternalLink, X } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 bg-card border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-text-main"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-text-main">Wilmslow Local</h1>
      </div>

      <div className="flex gap-2 px-5 mt-4">
        <button
          onClick={() => setTab('events')}
          className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
            tab === 'events'
              ? 'bg-primary text-white'
              : 'bg-card text-text-main border border-border'
          }`}
        >
          Local Events
        </button>
        <button
          onClick={() => setTab('cinema')}
          className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
            tab === 'cinema'
              ? 'bg-primary text-white'
              : 'bg-card text-text-main border border-border'
          }`}
        >
          Rex Cinema
        </button>
      </div>

      <div className="p-5">
        {tab === 'events' ? (
          <div className="flex flex-col gap-3">
            {LOCAL_EVENTS.map(event => (
              <div
                key={event.id}
                className="bg-card rounded-[14px] p-4 border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                  {event.category}
                </span>
                <h3 className="text-[15px] font-semibold text-text-main mt-2 mb-1">{event.title}</h3>
                <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">{event.description}</p>
                <div className="flex flex-col gap-1 mb-3">
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                  </span>
                  <button
                    onClick={() => setMapLocation(event.location)}
                    className="text-xs text-primary flex items-center gap-1 bg-transparent p-0"
                  >
                    <MapPin size={13} /> {event.location}
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/book-table?date=${event.date}`)}
                  className="text-xs font-semibold text-accent-dark bg-accent/10 px-3.5 py-1.5 rounded-lg transition-colors hover:bg-accent/20"
                >
                  Book a table after →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className="rounded-[14px] p-4 text-white mb-1"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Film size={18} />
                <span className="text-[15px] font-bold">Rex Cinema Wilmslow</span>
              </div>
              <p className="text-xs opacity-70">Now showing</p>
            </div>
            {CINEMA.map(film => (
              <div
                key={film.id}
                className="bg-card rounded-[14px] p-4 border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[15px] font-semibold text-text-main">{film.title}</h3>
                  <span className="text-[10px] font-semibold border border-border px-2 py-0.5 rounded-md text-text-main">
                    {film.rating}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-2.5">{film.time}</p>
                <button
                  onClick={() => navigate('/book-table')}
                  className="text-xs font-semibold text-accent-dark bg-accent/10 px-3.5 py-1.5 rounded-lg transition-colors hover:bg-accent/20"
                >
                  Book a table after →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {mapLocation && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setMapLocation(null)}
        >
          <div
            className="bg-card w-full max-w-[480px] rounded-t-[20px] p-5 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-text-main">{mapLocation}</h3>
              <button
                onClick={() => setMapLocation(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface text-text-secondary"
              >
                <X size={18} />
              </button>
            </div>
            <div className="w-full h-[250px] rounded-xl overflow-hidden border border-border">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`}
                className="w-full h-full border-none"
                title="Map"
              />
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(mapLocation)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 mt-3 py-2.5 text-[13px] font-semibold text-primary"
            >
              <ExternalLink size={14} /> Open in Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
