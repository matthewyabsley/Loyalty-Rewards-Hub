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
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} style={{
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
            color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer',
          }}>
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <p>No notifications</p>
        </div>
      ) : (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(notif => {
            const Icon = TYPE_ICONS[notif.type] || Bell;
            return (
              <button key={notif.id} onClick={() => markNotificationRead(notif.id)} style={{
                display: 'flex', gap: 12, padding: 14, borderRadius: 14,
                background: notif.read ? 'var(--card)' : 'var(--primary)' + '08',
                border: `1px solid ${notif.read ? 'var(--border)' : 'var(--primary)' + '20'}`,
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: notif.read ? 'var(--surface)' : 'var(--primary)' + '15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={notif.read ? 'var(--text-secondary)' : 'var(--primary)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <h3 style={{ fontSize: 13, fontWeight: notif.read ? 500 : 600 }}>{notif.title}</h3>
                    {!notif.read && <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)' }} />}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{notif.message}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, opacity: 0.7 }}>
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
