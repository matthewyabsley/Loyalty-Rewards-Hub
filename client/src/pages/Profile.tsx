import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  User, ClipboardList, Bookmark, CreditCard, Bell,
  HelpCircle, FileText, LogOut, ChevronRight
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { notifications } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { label: 'Order History', icon: ClipboardList, path: '/order-history' },
    { label: 'Saved Items', icon: Bookmark, path: '/saved-items' },
    { label: 'Payment Methods', icon: CreditCard, path: '/payment-methods' },
    { label: 'Notifications', icon: Bell, path: '/notifications', badge: unreadCount },
    { label: 'Help & Support', icon: HelpCircle, path: '/help-support' },
    { label: 'Terms & Privacy', icon: FileText, path: '/terms-privacy' },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        padding: '32px 20px', color: '#fff', textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36, background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <User size={32} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.name}</h1>
        <p style={{ fontSize: 13, opacity: 0.7 }}>{user?.email}</p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--accent)', borderRadius: 20, padding: '4px 14px',
          fontSize: 12, fontWeight: 600, marginTop: 12,
        }}>
          {user?.tier} · {user?.points} pts
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{
          background: 'var(--card)', borderRadius: 16,
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          {menuItems.map((item, i) => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '14px 16px', background: 'none', border: 'none',
              borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <item.icon size={20} color="var(--text-secondary)" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.badge ? <span className="badge">{item.badge}</span> : null}
                <ChevronRight size={18} color="var(--text-secondary)" />
              </div>
            </button>
          ))}
        </div>

        <button onClick={signOut} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: 14, marginTop: 24, borderRadius: 12,
          background: '#E03E3E15', color: 'var(--error)', border: 'none',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}
