import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, Users, Clock, Check, Calendar } from 'lucide-react';

const TIMES = ['12:00', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export default function BookTable() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { addBooking } = useData();
  const { user } = useAuth();

  const preselectedDate = params.get('date');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(preselectedDate ? new Date(preselectedDate) : today);
  const [selectedDate, setSelectedDate] = useState<string | null>(preselectedDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [booked, setBooked] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  function handleBook() {
    if (!selectedDate || !selectedTime) return;
    addBooking({ date: selectedDate, time: selectedTime, guests, status: 'confirmed', notes });
    setBooked(true);
  }

  const canBook = selectedDate && selectedTime;

  if (booked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-10 text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 animate-scale-in">
          <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
            <Check size={32} className="text-success" strokeWidth={3} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-2 animate-fade-in-up">Booking Confirmed</h2>
        <p className="text-sm text-text-secondary mb-6 animate-fade-in-up stagger-1">Your table has been reserved</p>

        <Card className="w-full max-w-[320px] p-5 mb-8 animate-fade-in-up stagger-2">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Date</span>
              <span className="font-semibold text-text-main">
                {new Date(selectedDate!).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="text-text-secondary">Time</span>
              <span className="font-semibold text-text-main">{selectedTime}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="text-text-secondary">Guests</span>
              <span className="font-semibold text-text-main">{guests}</span>
            </div>
          </div>
        </Card>

        <Button
          onClick={() => navigate('/')}
          className="w-full max-w-[320px] bg-gradient-to-r from-primary to-primary-light animate-fade-in-up stagger-3"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 glass border-b border-white/20 shadow-sm">
        <div className="max-w-[480px] mx-auto flex items-center gap-3 px-5 py-3.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Book a Table</h1>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 pt-5">
        <Card className="p-4 mb-5 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className="w-8 h-8"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="text-[15px] font-semibold text-text-main">{monthName}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className="w-8 h-8"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-[11px] font-semibold text-text-muted uppercase py-1">{d}</div>
            ))}
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPast = new Date(dateStr) < new Date(today.toDateString());
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === today.toISOString().split('T')[0];
              return (
                <button
                  key={i}
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "w-full aspect-square rounded-xl text-[13px] flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold"
                      : isToday
                        ? "ring-2 ring-primary/30 text-primary font-semibold bg-card"
                        : isPast
                          ? "opacity-25 pointer-events-none text-text-main"
                          : "bg-card hover:bg-surface border border-border-light text-text-main"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mb-5 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-text-secondary" />
            <span className="text-sm font-semibold text-text-main">Time</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={cn(
                  "rounded-xl px-5 py-3 text-[13px] font-medium transition-all",
                  selectedTime === t
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-card text-text-main border border-border hover:bg-surface"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-text-secondary" />
            <span className="text-sm font-semibold text-text-main">Guests</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <button
                key={n}
                onClick={() => setGuests(n)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                  guests === n
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-card text-text-main border border-border hover:bg-surface"
                )}
              >
                <Users size={14} />
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 animate-fade-in-up stagger-3">
          <span className="text-sm font-semibold text-text-main block mb-2">Special Requests</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any dietary requirements or special requests..."
            className="w-full p-3.5 rounded-xl border border-border bg-card text-sm text-text-main placeholder:text-text-muted min-h-[80px] resize-y focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
          />
        </div>

        {canBook && (
          <GlassCard className="p-5 mb-6 animate-fade-in-up stagger-4">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-text-main">Booking Summary</span>
              <Badge variant="accent">+20 pts</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Calendar size={14} />
                  Date
                </span>
                <span className="font-medium text-text-main">
                  {new Date(selectedDate!).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Clock size={14} />
                  Time
                </span>
                <span className="font-medium text-text-main">{selectedTime}</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Users size={14} />
                  Guests
                </span>
                <span className="font-medium text-text-main">{guests}</span>
              </div>
              {notes && (
                <>
                  <div className="h-px bg-border/60" />
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Notes</span>
                    <span className="font-medium text-text-main text-right max-w-[200px] truncate">{notes}</span>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-white/20">
        <div className="max-w-[480px] mx-auto px-5 py-4">
          <Button
            onClick={handleBook}
            disabled={!canBook}
            className={cn(
              "w-full",
              canBook
                ? "bg-gradient-to-r from-primary to-primary-light shadow-lg shadow-primary/20"
                : "bg-border text-text-secondary"
            )}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
