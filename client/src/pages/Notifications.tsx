import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Bell, CheckCheck, ShoppingCart, Gift, Megaphone, CalendarDays, Settings } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ElementType> = {
  order: ShoppingCart, reward: Gift, promo: Megaphone, booking: CalendarDays, system: Settings,
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
          <ArrowLeft size={22} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main flex-1">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-xs font-semibold text-primary bg-transparent"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-text-secondary">
          <Bell size={48} />
          <p className="text-sm">No notifications</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-5">
          {notifications.map(notif => {
            const Icon = TYPE_ICONS[notif.type] || Bell;
            return (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`flex gap-3 p-3.5 rounded-[14px] w-full text-left transition-colors ${
                  notif.read
                    ? 'bg-card border border-border'
                    : 'bg-primary/[0.08] border border-primary/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center ${
                  notif.read ? 'bg-surface' : 'bg-primary/15'
                }`}>
                  <Icon size={18} className={notif.read ? 'text-text-secondary' : 'text-primary'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className={`text-[13px] ${notif.read ? 'font-medium' : 'font-semibold'} text-text-main`}>{notif.title}</h3>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-text-secondary leading-[1.4]">{notif.message}</p>
                  <p className="text-[11px] text-text-secondary/70 mt-1">
                    {new Date(notif.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
