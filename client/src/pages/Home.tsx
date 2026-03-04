import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  CalendarDays, UtensilsCrossed, Calendar, Gift, MapPin,
  Bell, Star, ChevronRight, ShoppingCart
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, notifications, bookings } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;
  const upcomingBooking = bookings.find(b => b.status === 'confirmed');

  const quickActions = [
    { label: 'Book Table', icon: CalendarDays, color: 'var(--primary)', path: '/book-table' },
    { label: 'Menu', icon: UtensilsCrossed, color: '#E67E22', path: '/menu' },
    { label: 'Events', icon: Calendar, color: '#9B59B6', path: '/events' },
    { label: 'Gift Vouchers', icon: Gift, color: 'var(--accent-dark)', path: '/gift-vouchers' },
    { label: 'Local Events', icon: MapPin, color: '#1DB264', path: '/local-events' },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        padding: '24px 20px 28px', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 2 }}>Welcome back</p>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{user?.name || 'Guest'}</h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {cart.length > 0 && (
              <button onClick={() => navigate('/cart')} style={{
                position: 'relative', background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: 12, padding: 10, color: '#fff', cursor: 'pointer',
              }}>
                <ShoppingCart size={20} />
                <span style={{
                  position: 'absolute', top: -4, right: -4, background: 'var(--accent)',
                  color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 8,
                  minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cart.length}</span>
              </button>
            )}
            <button onClick={() => navigate('/notifications')} style={{
              position: 'relative', background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: 12, padding: 10, color: '#fff', cursor: 'pointer',
            }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4, background: 'var(--error)',
                  color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 8,
                  minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{unreadCount}</span>
              )}
            </button>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <div>
            <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>Your Points</p>
            <p style={{ fontSize: 28, fontWeight: 700 }}>{user?.points || 0}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'var(--accent)', borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 600,
            }}>
              <Star size={14} /> {user?.tier || 'Bronze'}
            </div>
            <p style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>£{user?.credits || 0} credit</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12, marginBottom: 24,
        }}>
          {quickActions.map(action => (
            <button key={action.label} onClick={() => navigate(action.path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '16px 8px', borderRadius: 16, background: 'var(--card)',
              border: '1px solid var(--border)', cursor: 'pointer',
              transition: 'transform 0.1s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: action.color + '15', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <action.icon size={22} color={action.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{action.label}</span>
            </button>
          ))}
        </div>

        {upcomingBooking && (
          <div style={{
            background: 'var(--card)', borderRadius: 16, padding: 16,
            border: '1px solid var(--border)', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Upcoming Booking</h3>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--success)',
                background: '#1DB26415', padding: '3px 10px', borderRadius: 20,
              }}>Confirmed</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {new Date(upcomingBooking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {upcomingBooking.time} · {upcomingBooking.guests} guests
            </p>
          </div>
        )}

        <button onClick={() => navigate('/order-history')} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--card)', borderRadius: 16, padding: 16,
          border: '1px solid var(--border)', width: '100%', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--primary)' + '15',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UtensilsCrossed size={20} color="var(--primary)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Order History</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>View past orders & receipts</p>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </button>
      </div>
    </div>
  );
}
