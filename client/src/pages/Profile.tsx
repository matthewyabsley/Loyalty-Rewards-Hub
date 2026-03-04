import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  User, ClipboardList, Bookmark, CreditCard, Bell,
  HelpCircle, FileText, LogOut, ChevronRight, Diamond, Calendar
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { notifications } = useData();
  const unreadCount = notifications.filter(n => !n.read).length;

  const joinDate = 'Jan 2026';

  const menuGroup1 = [
    { label: 'Order History', icon: ClipboardList, path: '/order-history' },
    { label: 'Saved Items', icon: Bookmark, path: '/saved-items' },
    { label: 'Payment Methods', icon: CreditCard, path: '/payment-methods' },
  ];

  const menuGroup2 = [
    { label: 'Notifications', icon: Bell, path: '/notifications', badge: unreadCount },
    { label: 'Help & Support', icon: HelpCircle, path: '/help-support' },
    { label: 'Terms & Privacy', icon: FileText, path: '/terms-privacy' },
  ];

  return (
    <div className="pb-5">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-text-main">Profile</h1>
      </div>

      <div className="flex flex-col items-center pt-6 pb-8 px-5">
        <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-content-center justify-center mb-4">
          <span className="text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'G'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-1">{user?.name || 'Guest'}</h2>
        <p className="text-sm text-text-secondary mb-3">{user?.email || 'guest@tapyard.com'}</p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full text-xs font-semibold">
            <Diamond size={12} />
            {user?.tier || 'Bronze'}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-surface text-text-secondary px-3 py-1 rounded-full text-xs font-medium">
            <Calendar size={12} />
            Joined {joinDate}
          </span>
        </div>
      </div>

      <div className="px-5 mb-5">
        <div className="bg-card rounded-2xl border border-border flex items-center">
          <div className="flex-1 text-center py-4">
            <p className="text-lg font-bold text-text-main">{user?.points ?? 150}</p>
            <p className="text-xs text-text-secondary">Points</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 text-center py-4">
            <p className="text-lg font-bold text-text-main">{user?.credits ?? 25}</p>
            <p className="text-xs text-text-secondary">Credits</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 text-center py-4">
            <p className="text-lg font-bold text-accent">{user?.tier || 'Bronze'}</p>
            <p className="text-xs text-text-secondary">Tier</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card rounded-[18px] border border-border overflow-hidden">
          {menuGroup1.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between w-full px-4 py-3.5 bg-transparent hover:bg-surface/50 transition-colors ${
                i < menuGroup1.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
                  <item.icon size={18} className="text-text-secondary" />
                </div>
                <span className="text-sm font-medium text-text-main">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-text-secondary" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="bg-card rounded-[18px] border border-border overflow-hidden">
          {menuGroup2.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between w-full px-4 py-3.5 bg-transparent hover:bg-surface/50 transition-colors ${
                i < menuGroup2.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center">
                  <item.icon size={18} className="text-text-secondary" />
                </div>
                <span className="text-sm font-medium text-text-main">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge ? (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-error text-white text-[11px] font-semibold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
                <ChevronRight size={18} className="text-text-secondary" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-error/8 border border-error/20 text-error text-[15px] font-semibold transition-colors hover:bg-error/15"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
