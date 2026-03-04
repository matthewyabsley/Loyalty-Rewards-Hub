import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Calendar, Clock, Users, Check } from 'lucide-react';

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { events, bookEvent } = useData();
  const [booked, setBooked] = useState(false);

  const event = events.find(e => e.id === id);
  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 bg-card border-b border-border">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-text-main"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-text-main">Event</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary text-sm">Event not found</p>
        </div>
      </div>
    );
  }

  function handleBook() {
    bookEvent(event!.id);
    setBooked(true);
  }

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background max-w-[480px] mx-auto w-full px-10 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-5">
          <Check size={32} className="text-success" />
        </div>
        <h2 className="text-[22px] font-bold text-text-main mb-2">Event Booked!</h2>
        <p className="text-sm text-text-secondary mb-1">{event.title}</p>
        <p className="text-[13px] text-text-secondary mb-6">
          {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {event.time}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-[280px] py-4 rounded-2xl font-semibold text-white text-[15px] transition-transform active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 bg-card border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-text-main"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-text-main">Event Details</h1>
      </div>

      <div className="p-5">
        <div
          className="rounded-[20px] p-6 text-white mb-5"
          style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
        >
          <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-[10px]">
            {event.category}
          </span>
          <h2 className="text-[22px] font-bold mt-3 mb-2">{event.title}</h2>
          <p className="text-[28px] font-bold">£{event.price}</p>
        </div>

        <p className="text-sm text-text-secondary leading-[1.7] mb-5">{event.description}</p>

        <div className="bg-card rounded-[14px] p-4 border border-border mb-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2.5">
            <Calendar size={18} className="text-primary" />
            <div>
              <p className="text-[11px] text-text-secondary">Date</p>
              <p className="text-[13px] font-semibold text-text-main">
                {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-primary" />
            <div>
              <p className="text-[11px] text-text-secondary">Time</p>
              <p className="text-[13px] font-semibold text-text-main">{event.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Users size={18} className="text-primary" />
            <div>
              <p className="text-[11px] text-text-secondary">Spots Left</p>
              <p className="text-[13px] font-semibold text-text-main">{event.spotsLeft}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={event.spotsLeft === 0}
          className="w-full py-4 rounded-2xl font-semibold text-white text-[15px] transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
        >
          {event.spotsLeft === 0 ? 'Sold Out' : `Book Now · £${event.price}`}
        </button>
      </div>
    </div>
  );
}
