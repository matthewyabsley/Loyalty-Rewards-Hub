import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Users, Clock, Check } from 'lucide-react';

const TIMES = ['12:00', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export default function BookTable() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { addBooking } = useData();

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
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-5">
          <Check size={32} className="text-success" />
        </div>
        <h2 className="text-[22px] font-bold text-text-main mb-2">Table Booked!</h2>
        <p className="text-sm text-text-secondary mb-2">
          {new Date(selectedDate!).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedTime}
        </p>
        <p className="text-sm text-text-secondary mb-6">{guests} guests</p>
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-[280px] py-3.5 rounded-xl text-white font-semibold text-[15px] bg-gradient-to-r from-primary to-primary-light active:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[480px] mx-auto flex items-center gap-3 px-5 py-3.5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main">Book a Table</h1>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 pt-5">
        <div className="bg-card rounded-2xl p-4 border border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-5">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-text-main" />
            </button>
            <span className="text-[15px] font-semibold text-text-main">{monthName}</span>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center"
            >
              <ChevronRight size={18} className="text-text-main" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-[11px] font-semibold text-text-secondary py-1">{d}</div>
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
                  className={`w-9 h-9 mx-auto rounded-xl text-[13px] flex items-center justify-center transition-all
                    ${isSelected
                      ? 'bg-gradient-to-br from-primary to-primary-light text-white font-semibold shadow-md'
                      : isToday
                        ? 'border-2 border-primary text-primary font-semibold bg-card'
                        : isPast
                          ? 'opacity-30 cursor-default text-text-main'
                          : 'bg-card text-text-main shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-surface font-normal'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-text-secondary" />
            <span className="text-sm font-semibold text-text-main">Guests</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <button
                key={n}
                onClick={() => setGuests(n)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold flex items-center justify-center transition-all
                  ${guests === n
                    ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-md'
                    : 'bg-card text-text-main border border-border hover:bg-surface'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-text-secondary" />
            <span className="text-sm font-semibold text-text-main">Time</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all
                  ${selectedTime === t
                    ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-md'
                    : 'bg-card text-text-main border border-border hover:bg-surface'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <span className="text-sm font-semibold text-text-main block mb-2">Special Requests</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any dietary requirements or special requests..."
            className="w-full p-3 rounded-xl border border-border bg-card text-sm text-text-main placeholder:text-text-secondary/60 min-h-[80px] resize-y focus:border-primary/40 transition-colors"
          />
        </div>

        {canBook && (
          <div className="bg-card rounded-[20px] p-5 border border-border shadow-[0_4px_16px_rgba(0,0,0,0.05)] mb-6">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-semibold text-text-main">Booking Summary</span>
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">+20 pts</span>
            </div>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium text-text-main">
                  {new Date(selectedDate!).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-medium text-text-main">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span className="font-medium text-text-main">{guests}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-[480px] mx-auto px-5 py-4">
          <button
            onClick={handleBook}
            disabled={!canBook}
            className={`w-full py-3.5 rounded-xl text-white font-semibold text-[15px] transition-all
              ${canBook
                ? 'bg-gradient-to-r from-primary to-primary-light active:opacity-90 shadow-lg shadow-primary/20'
                : 'bg-border text-text-secondary cursor-not-allowed'
              }
            `}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
