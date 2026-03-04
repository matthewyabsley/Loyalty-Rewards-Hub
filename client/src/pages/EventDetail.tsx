import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, DarkCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Users, Check, Ticket } from 'lucide-react';

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { events, bookEvent } = useData();
  const [booked, setBooked] = useState(false);

  const event = events.find(e => e.id === id);
  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
        <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
          <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={22} />
            </Button>
            <h1 className="text-lg font-semibold text-text-main">Event</h1>
          </div>
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
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-5 animate-scale-in">
          <Check size={36} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-2 animate-fade-in-up">Event Booked!</h2>
        <p className="text-sm text-text-secondary mb-1 animate-fade-in-up stagger-1">{event.title}</p>
        <p className="text-[13px] text-text-muted mb-8 animate-fade-in-up stagger-2">
          {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {event.time}
        </p>
        <Card className="w-full p-4 mb-8 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Ticket size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Ticket confirmed</p>
              <p className="text-sm font-semibold text-text-main">1 x {event.title}</p>
            </div>
            <span className="ml-auto text-lg font-bold text-primary">£{event.price}</span>
          </div>
        </Card>
        <Button className="w-full max-w-[280px] animate-fade-in-up stagger-4" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Event Details</h1>
        </div>
      </div>

      <div className="p-5 pb-28">
        <DarkCard className="p-6 mb-5 animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #6B1420 0%, #8B1A2B 50%, #3D0A14 100%)' }}>
          <Badge className="bg-white/20 text-white border-white/10 mb-3">{event.category}</Badge>
          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          <p className="text-[28px] font-bold text-white">£{event.price}</p>
        </DarkCard>

        <div className="grid grid-cols-3 gap-3 mb-5 animate-fade-in-up stagger-1">
          <Card className="p-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Calendar size={18} className="text-primary" />
            </div>
            <p className="text-[11px] text-text-muted mb-0.5">Date</p>
            <p className="text-xs font-semibold text-text-main">
              {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </p>
          </Card>
          <Card className="p-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Clock size={18} className="text-primary" />
            </div>
            <p className="text-[11px] text-text-muted mb-0.5">Time</p>
            <p className="text-xs font-semibold text-text-main">{event.time}</p>
          </Card>
          <Card className="p-3 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Users size={18} className="text-primary" />
            </div>
            <p className="text-[11px] text-text-muted mb-0.5">Spots</p>
            <p className="text-xs font-semibold text-text-main">{event.spotsLeft} left</p>
          </Card>
        </div>

        <Card className="p-5 mb-5 animate-fade-in-up stagger-2">
          <h3 className="text-sm font-semibold text-text-main mb-2">About this event</h3>
          <p className="text-sm text-text-secondary leading-[1.7]">{event.description}</p>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-white/20 shadow-xl">
        <div className="max-w-[480px] mx-auto p-5">
          <Button
            className="w-full"
            onClick={handleBook}
            disabled={event.spotsLeft === 0}
          >
            {event.spotsLeft === 0 ? 'Sold Out' : `Book Now · £${event.price}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
