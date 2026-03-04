import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  CalendarDays, UtensilsCrossed, Music, Gift, CreditCard, MapPin,
  Bell, Diamond, ChevronRight, ShoppingCart, Clock, Users
} from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

interface ActionCardProps {
  label: string;
  subtitle: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
}

function ActionCard({ label, subtitle, icon: Icon, gradientFrom, gradientTo, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start rounded-2xl p-4 text-left transition-transform active:scale-[0.97]"
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/25 mb-3">
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-[13px] font-semibold text-white">{label}</span>
      <span className="text-[11px] text-white/60 mt-0.5">{subtitle}</span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, notifications, bookings, rewards } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;
  const upcomingBooking = bookings.find(b => b.status === 'confirmed');
  const activeRewards = rewards.filter(r => !r.claimed).length;
  const initial = (user?.name || 'G').charAt(0).toUpperCase();

  const actions: ActionCardProps[] = [
    { label: 'Book Table', subtitle: 'Reserve a spot', icon: CalendarDays, gradientFrom: '#4A90D9', gradientTo: '#357ABD', onClick: () => navigate('/book-table') },
    { label: 'Order Food', subtitle: 'Browse menu', icon: UtensilsCrossed, gradientFrom: '#E8895A', gradientTo: '#D4703E', onClick: () => navigate('/menu') },
    { label: 'Events', subtitle: 'What\'s on', icon: Music, gradientFrom: '#9B6FC0', gradientTo: '#7E4FA8', onClick: () => navigate('/events') },
    { label: 'Rewards', subtitle: `${activeRewards} available`, icon: Gift, gradientFrom: '#E07098', gradientTo: '#C85880', onClick: () => navigate('/rewards') },
    { label: 'Gift Vouchers', subtitle: 'Send a gift', icon: CreditCard, gradientFrom: '#3DAA6D', gradientTo: '#2D8E55', onClick: () => navigate('/gift-vouchers') },
    { label: 'Local Area', subtitle: 'Explore nearby', icon: MapPin, gradientFrom: '#3AAFA9', gradientTo: '#2B9A8F', onClick: () => navigate('/local-events') },
  ];

  return (
    <div className="pb-5">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B1A2B, #A82040)' }}
            >
              <span className="text-white text-lg font-bold">{initial}</span>
            </button>
            <div>
              <p className="text-text-secondary text-sm">{getGreeting()}</p>
              <h1 className="text-[26px] font-bold text-text-main leading-tight">{user?.name || 'Guest'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={() => navigate('/cart')}
                className="relative w-10 h-10 rounded-xl bg-surface flex items-center justify-center"
              >
                <ShoppingCart size={20} className="text-text-main" />
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cart.length}
                </span>
              </button>
            )}
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 rounded-xl bg-surface flex items-center justify-center"
            >
              <Bell size={20} className="text-text-main" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className="rounded-[22px] p-[22px]"
          style={{ background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] tracking-[1.5px] text-white/45 font-medium uppercase mb-1">Points Balance</p>
              <p className="text-[38px] font-bold text-white leading-none">{user?.points || 0}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-accent/15 rounded-full px-3 py-1.5">
              <Diamond size={14} className="text-accent" />
              <span className="text-accent text-xs font-semibold">{user?.tier || 'Bronze'}</span>
            </div>
          </div>
          <div className="h-px bg-white/[0.08] my-4" />
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-white text-base font-semibold">£{user?.credits || 0}</p>
              <p className="text-white/45 text-[11px] mt-0.5">Credits</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="text-center flex-1">
              <p className="text-white text-base font-semibold">{activeRewards}</p>
              <p className="text-white/45 text-[11px] mt-0.5">Rewards</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="text-center flex-1">
              <p className="text-white text-base font-semibold">{bookings.filter(b => b.status === 'confirmed').length}</p>
              <p className="text-white/45 text-[11px] mt-0.5">Bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {actions.map(action => (
            <ActionCard key={action.label} {...action} />
          ))}
        </div>

        {upcomingBooking && (
          <div className="bg-card rounded-[18px] p-4 border border-border mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock size={16} className="text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-text-main">Upcoming Booking</h3>
              </div>
              <span className="text-[11px] font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-text-secondary">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                <span>
                  {new Date(upcomingBooking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{upcomingBooking.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>{upcomingBooking.guests} guests</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/order-history')}
          className="flex items-center justify-between w-full bg-card rounded-[18px] p-4 border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-text-main">Order History</p>
              <p className="text-xs text-text-secondary">View past orders & receipts</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-text-secondary" />
        </button>
      </div>
    </div>
  );
}
