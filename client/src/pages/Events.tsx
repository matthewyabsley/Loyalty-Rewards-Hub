import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Users, ChevronRight } from 'lucide-react';

export default function Events() {
  const navigate = useNavigate();
  const { events } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Events</h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 pb-8">
        {events.map((event, index) => (
          <Card
            key={event.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-transform active:scale-[0.98] animate-fade-in-up",
              index === 0 && "stagger-1",
              index === 1 && "stagger-2",
              index === 2 && "stagger-3",
              index === 3 && "stagger-4",
              index === 4 && "stagger-5"
            )}
            onClick={() => navigate(`/event/${event.id}`)}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Badge>{event.category}</Badge>
                <span className="text-lg font-bold text-primary">£{event.price}</span>
              </div>
              <h3 className="text-base font-semibold text-text-main mb-1.5">{event.title}</h3>
              <p className="text-sm text-text-secondary mb-3 leading-relaxed line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-4 mb-3">
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Calendar size={14} className="text-primary/60" />
                  {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock size={14} className="text-primary/60" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Users size={14} className="text-primary/60" />
                  {event.spotsLeft} spots
                </span>
              </div>
              <div className="flex justify-end">
                <Button size="sm" className="gap-1.5">
                  Book Now <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Calendar size={40} className="text-text-muted mb-3" />
            <p className="text-sm text-text-secondary">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
}
