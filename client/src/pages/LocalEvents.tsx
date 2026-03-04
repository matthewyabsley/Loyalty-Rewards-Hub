import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, DarkCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, MapPin, Calendar, Film, ExternalLink, Star } from 'lucide-react';

const LOCAL_EVENTS = [
  { id: 'l1', title: 'Wilmslow Artisan Market', description: 'Browse local artisan stalls with handmade crafts, fresh produce, and street food.', date: '2026-03-08', time: '10:00 - 16:00', location: 'Grove Street, Wilmslow', category: 'Market' },
  { id: 'l2', title: 'Spring Food Festival', description: 'Celebrate spring with local restaurants showcasing seasonal menus and live cooking demos.', date: '2026-03-22', time: '11:00 - 18:00', location: 'Wilmslow Leisure Centre', category: 'Food' },
  { id: 'l3', title: 'Wilmslow Running Club 5K', description: 'Join the community for a scenic 5K run through Lindow Common.', date: '2026-04-05', time: '09:00', location: 'Lindow Common', category: 'Sports' },
  { id: 'l4', title: 'Live Music at The Coach & Four', description: 'Local bands performing acoustic sets every Friday evening.', date: '2026-03-14', time: '20:00 - 23:00', location: 'The Coach & Four, Wilmslow', category: 'Music' },
  { id: 'l5', title: 'Wilmslow Beer Festival', description: 'Over 40 real ales, craft beers and ciders from local breweries.', date: '2026-04-18', time: '12:00 - 22:00', location: 'Wilmslow Conservative Club', category: 'Food' },
  { id: 'l6', title: 'Easter Egg Hunt', description: 'Family-friendly Easter egg hunt in the park with prizes and activities.', date: '2026-04-04', time: '10:00 - 14:00', location: 'The Carrs Park, Wilmslow', category: 'Family' },
];

const CINEMA = [
  { id: 'c1', title: 'The Grand Budapest Hotel', time: '14:00, 17:30, 20:00', rating: 'PG-13', genre: 'Comedy' },
  { id: 'c2', title: 'Paddington 3', time: '11:00, 13:30, 16:00', rating: 'PG', genre: 'Family' },
  { id: 'c3', title: 'Oppenheimer', time: '18:00, 21:00', rating: '15', genre: 'Drama' },
  { id: 'c4', title: 'Wonka', time: '10:30, 13:00, 15:30', rating: 'PG', genre: 'Fantasy' },
];

export default function LocalEvents() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'events' | 'cinema'>('events');
  const [mapLocation, setMapLocation] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Wilmslow Local</h1>
        </div>
      </div>

      <div className="flex gap-1 mx-5 mt-4 p-1 bg-surface rounded-full">
        <button
          onClick={() => setTab('events')}
          className={cn(
            "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
            tab === 'events'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-text-muted hover:text-text-main'
          )}
        >
          Local Events
        </button>
        <button
          onClick={() => setTab('cinema')}
          className={cn(
            "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
            tab === 'cinema'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-text-muted hover:text-text-main'
          )}
        >
          Rex Cinema
        </button>
      </div>

      <div className="p-5 pb-8">
        {tab === 'events' ? (
          <div className="flex flex-col gap-3">
            {LOCAL_EVENTS.map((event, index) => (
              <Card
                key={event.id}
                className={cn(
                  "p-4 animate-fade-in-up",
                  index === 0 && "stagger-1",
                  index === 1 && "stagger-2",
                  index === 2 && "stagger-3",
                  index === 3 && "stagger-4",
                  index === 4 && "stagger-5",
                  index === 5 && "stagger-6"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge>{event.category}</Badge>
                </div>
                <h3 className="text-[15px] font-semibold text-text-main mb-1">{event.title}</h3>
                <p className="text-xs text-text-secondary mb-3 leading-relaxed">{event.description}</p>
                <div className="flex flex-col gap-1.5 mb-3">
                  <span className="text-xs text-text-muted flex items-center gap-1.5">
                    <Calendar size={13} className="text-primary/60" />
                    {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                  </span>
                  <button
                    onClick={() => setMapLocation(event.location)}
                    className="text-xs text-primary flex items-center gap-1.5 bg-transparent p-0 font-medium"
                  >
                    <MapPin size={13} /> {event.location}
                  </button>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate(`/book-table?date=${event.date}`)}
                >
                  Book a table after
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <DarkCard className="p-5 mb-1 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              <div className="flex items-center gap-2.5 mb-1">
                <Film size={20} className="text-white" />
                <span className="text-[15px] font-bold text-white">Rex Cinema Wilmslow</span>
              </div>
              <p className="text-xs text-white/60">Now showing</p>
            </DarkCard>
            {CINEMA.map((film, index) => (
              <Card
                key={film.id}
                className={cn(
                  "p-4 animate-fade-in-up",
                  index === 0 && "stagger-1",
                  index === 1 && "stagger-2",
                  index === 2 && "stagger-3",
                  index === 3 && "stagger-4"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[15px] font-semibold text-text-main pr-3">{film.title}</h3>
                  <div className="flex gap-1.5 shrink-0">
                    <Badge variant="outline">{film.rating}</Badge>
                    <Badge variant="accent">{film.genre}</Badge>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-3">{film.time}</p>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate('/book-table')}
                >
                  Book a table after
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Sheet open={!!mapLocation} onOpenChange={(open) => { if (!open) setMapLocation(null); }}>
        <SheetContent>
          <div className="p-5 pt-6">
            <h3 className="text-base font-semibold text-text-main mb-4">{mapLocation}</h3>
            <div className="w-full h-[250px] rounded-xl overflow-hidden border border-border">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation || '')}&output=embed`}
                className="w-full h-full border-none"
                title="Map"
              />
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(mapLocation || '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 mt-4 py-2.5 text-[13px] font-semibold text-primary"
            >
              <ExternalLink size={14} /> Open in Google Maps
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
