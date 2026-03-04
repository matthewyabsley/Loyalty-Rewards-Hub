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

  if (booked) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: '#1DB26415', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={32} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Table Booked!</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
          {new Date(selectedDate!).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedTime}
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>{guests} guests</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ maxWidth: 280 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Book a Table</h1>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 16, border: '1px solid var(--border)', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => setCurrentMonth(new Date(year, month - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{monthName}</span>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <ChevronRight size={20} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '4px 0', fontWeight: 600 }}>{d}</div>
            ))}
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPast = new Date(dateStr) < new Date(today.toDateString());
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === today.toISOString().split('T')[0];
              return (
                <button key={i} disabled={isPast} onClick={() => setSelectedDate(dateStr)} style={{
                  width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', fontSize: 13, fontWeight: isSelected || isToday ? 600 : 400,
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#fff' : isPast ? '#ccc' : isToday ? 'var(--primary)' : 'var(--text)',
                  border: isToday && !isSelected ? '2px solid var(--primary)' : 'none', cursor: isPast ? 'default' : 'pointer',
                }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Guests</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <button key={n} onClick={() => setGuests(n)} style={{
                width: 40, height: 40, borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: guests === n ? 'var(--primary)' : 'var(--card)',
                color: guests === n ? '#fff' : 'var(--text)',
                border: guests === n ? 'none' : '1px solid var(--border)', cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Clock size={18} color="var(--text-secondary)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Time</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TIMES.map(t => (
              <button key={t} onClick={() => setSelectedTime(t)} style={{
                padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: selectedTime === t ? 'var(--primary)' : 'var(--card)',
                color: selectedTime === t ? '#fff' : 'var(--text)',
                border: selectedTime === t ? 'none' : '1px solid var(--border)', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Special Requests</span>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any dietary requirements or special requests..."
            style={{
              width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--border)',
              fontSize: 14, minHeight: 80, resize: 'vertical', background: 'var(--card)',
            }}
          />
        </div>

        <button onClick={handleBook} disabled={!selectedDate || !selectedTime} className="btn-primary">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
