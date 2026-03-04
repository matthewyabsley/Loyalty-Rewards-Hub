import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bell, CheckCheck, ShoppingCart, Gift, Megaphone, CalendarDays, Settings } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ElementType> = {
  order: ShoppingCart, reward: Gift, promo: Megaphone, booking: CalendarDays, system: Settings,
};

const TYPE_COLORS: Record<string, string> = {
  order: '#3B82F6',
  reward: '#8B5CF6',
  promo: '#F97316',
  booking: '#22C55E',
  system: '#6B6B6B',
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 max-w-[480px] mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main flex-1">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="gap-1.5 text-primary">
              <CheckCheck size={16} /> Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-[480px] mx-auto w-full overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] gap-3 text-text-secondary">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center">
              <Bell size={32} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs text-text-muted">You're all caught up</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-5">
            {notifications.map((notif, idx) => {
              const Icon = TYPE_ICONS[notif.type] || Bell;
              const color = TYPE_COLORS[notif.type] || '#6B6B6B';
              return (
                <Card
                  key={notif.id}
                  className={cn(
                    "cursor-pointer transition-colors animate-fade-in-up",
                    !notif.read && "border-l-4 border-l-primary bg-primary/[0.03]",
                    idx === 0 && "stagger-1",
                    idx === 1 && "stagger-2",
                    idx === 2 && "stagger-3",
                    idx === 3 && "stagger-4",
                    idx === 4 && "stagger-5",
                    idx === 5 && "stagger-6"
                  )}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className="flex gap-3 p-4">
                    <div
                      className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h3 className={cn("text-[13px] text-text-main", !notif.read ? "font-semibold" : "font-medium")}>
                          {notif.title}
                        </h3>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2" />}
                      </div>
                      <p className="text-xs text-text-secondary leading-[1.4]">{notif.message}</p>
                      <p className="text-[11px] text-text-muted mt-1">
                        {new Date(notif.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
