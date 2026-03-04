import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Calendar, Users } from 'lucide-react';

export default function Events() {
  const navigate = useNavigate();
  const { events } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 bg-card border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-text-main"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-text-main">Events</h1>
      </div>

      <div className="flex flex-col gap-3.5 p-5">
        {events.map(event => (
          <button
            key={event.id}
            onClick={() => navigate(`/event/${event.id}`)}
            className="bg-card rounded-2xl p-4 border border-border text-left w-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-2.5">
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-[10px]">
                {event.category}
              </span>
              <span className="text-base font-bold text-primary">
                £{event.price}
              </span>
            </div>
            <h3 className="text-base font-semibold text-text-main mb-1.5">{event.title}</h3>
            <p className="text-xs text-text-secondary mb-2.5 leading-relaxed">{event.description}</p>
            <div className="flex gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {event.spotsLeft} spots
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
