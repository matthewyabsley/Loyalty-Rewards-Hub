import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Card, DarkCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  color: string;
  onClick: () => void;
  className?: string;
}

function ActionCard({ label, subtitle, icon: Icon, color, onClick, className }: ActionCardProps) {
  return (
    <Card
      className={cn("overflow-hidden cursor-pointer transition-transform active:scale-[0.97]", className)}
      onClick={onClick}
    >
      <div className="h-[6px]" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }} />
      <div className="p-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <p className="font-semibold text-sm text-text-main">{label}</p>
        <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
      </div>
    </Card>
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

  const actions: (ActionCardProps & { stagger: string })[] = [
    { label: 'Book Table', subtitle: 'Reserve a spot', icon: CalendarDays, color: '#3B82F6', onClick: () => navigate('/book-table'), stagger: 'animate-fade-in-up stagger-1' },
    { label: 'Order Food', subtitle: 'Browse menu', icon: UtensilsCrossed, color: '#F97316', onClick: () => navigate('/menu'), stagger: 'animate-fade-in-up stagger-2' },
    { label: 'Events', subtitle: "What's on", icon: Music, color: '#8B5CF6', onClick: () => navigate('/events'), stagger: 'animate-fade-in-up stagger-3' },
    { label: 'Rewards', subtitle: `${activeRewards} available`, icon: Gift, color: '#EC4899', onClick: () => navigate('/rewards'), stagger: 'animate-fade-in-up stagger-4' },
    { label: 'Gift Vouchers', subtitle: 'Send a gift', icon: CreditCard, color: '#22C55E', onClick: () => navigate('/gift-vouchers'), stagger: 'animate-fade-in-up stagger-5' },
    { label: 'Local Area', subtitle: 'Explore nearby', icon: MapPin, color: '#14B8A6', onClick: () => navigate('/local-events'), stagger: 'animate-fade-in-up stagger-6' },
  ];

  return (
    <div className="pb-6">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-full p-0 shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B1A2B, #A82040)' }}
            >
              <span className="text-white text-lg font-bold">{initial}</span>
            </Button>
            <div>
              <p className="text-text-secondary text-sm">{getGreeting()}</p>
              <h1 className="text-2xl font-bold text-text-main leading-tight">{user?.name || 'Guest'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cart')}
                className="relative w-10 h-10 rounded-xl bg-surface"
              >
                <ShoppingCart size={20} className="text-text-main" />
                <Badge className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] bg-accent text-white border-0 justify-center">
                  {cart.length}
                </Badge>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 rounded-xl bg-surface"
            >
              <Bell size={20} className="text-text-main" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] bg-error text-white border-0 justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <DarkCard className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] tracking-[1.5px] text-white/40 font-medium uppercase mb-1">Points Balance</p>
              <p className="text-4xl font-bold text-white leading-none">{user?.points || 0}</p>
            </div>
            <Badge variant="accent">
              <Diamond size={14} />
              {user?.tier || 'Bronze'}
            </Badge>
          </div>
          <div className="h-px bg-white/[0.08] my-4" />
          <div className="grid grid-cols-3 gap-0">
            <div className="text-center">
              <p className="text-xl font-bold text-white">£{user?.credits || 0}</p>
              <p className="text-white/40 text-[11px] mt-0.5">Credits</p>
            </div>
            <div className="text-center border-x border-white/[0.08]">
              <p className="text-xl font-bold text-white">{activeRewards}</p>
              <p className="text-white/40 text-[11px] mt-0.5">Rewards</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'confirmed').length}</p>
              <p className="text-white/40 text-[11px] mt-0.5">Bookings</p>
            </div>
          </div>
        </DarkCard>
      </div>

      <div className="px-5">
        <h2 className="text-lg font-bold text-text-main mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {actions.map(({ stagger, ...action }) => (
            <ActionCard key={action.label} {...action} className={stagger} />
          ))}
        </div>

        {upcomingBooking && (
          <Card className="border-l-4 border-l-success p-4 mb-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock size={16} className="text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-text-main">Upcoming Booking</h3>
              </div>
              <Badge variant="success">Confirmed</Badge>
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
          </Card>
        )}

        <Card
          className="p-4 cursor-pointer transition-transform active:scale-[0.98] animate-fade-in-up"
          onClick={() => navigate('/order-history')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">Order History</p>
                <p className="text-xs text-text-secondary">View past orders & receipts</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-secondary" />
          </div>
        </Card>
      </div>
    </div>
  );
}
