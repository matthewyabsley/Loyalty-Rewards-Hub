import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClipboardList, Bookmark, CreditCard, Bell,
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
    <div className="pb-6">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-text-main">Profile</h1>
      </div>

      <div className="flex flex-col items-center pt-6 pb-8 px-5 animate-fade-in-up">
        <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/25" style={{ background: 'linear-gradient(135deg, #8B1A2B, #A82040)' }}>
          <span className="text-white text-4xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'G'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-1">{user?.name || 'Guest'}</h2>
        <p className="text-sm text-text-secondary mb-3">{user?.email || 'guest@tapyard.com'}</p>
        <div className="flex items-center gap-2">
          <Badge variant="accent">
            <Diamond size={12} />
            {user?.tier || 'Bronze'}
          </Badge>
          <span className="inline-flex items-center gap-1.5 bg-surface text-text-secondary px-3 py-1 rounded-full text-xs font-medium">
            <Calendar size={12} />
            Joined {joinDate}
          </span>
        </div>
      </div>

      <div className="px-5 mb-5 animate-fade-in-up stagger-1">
        <Card className="flex-row divide-x divide-border overflow-hidden">
          <div className="flex-1 text-center py-4">
            <p className="text-lg font-bold text-primary">{user?.points ?? 150}</p>
            <p className="text-xs text-text-muted">Points</p>
          </div>
          <div className="flex-1 text-center py-4">
            <p className="text-lg font-bold text-primary">{user?.credits ?? 25}</p>
            <p className="text-xs text-text-muted">Credits</p>
          </div>
          <div className="flex-1 text-center py-4">
            <p className="text-lg font-bold text-primary">{user?.tier || 'Bronze'}</p>
            <p className="text-xs text-text-muted">Tier</p>
          </div>
        </Card>
      </div>

      <div className="px-5 mb-4 animate-fade-in-up stagger-2">
        <Card className="divide-y divide-border overflow-hidden">
          {menuGroup1.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between w-full px-4 py-3.5 bg-transparent hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center">
                  <item.icon size={18} className="text-text-secondary" />
                </div>
                <span className="text-sm font-medium text-text-main">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-text-muted" />
            </button>
          ))}
        </Card>
      </div>

      <div className="px-5 mb-6 animate-fade-in-up stagger-3">
        <Card className="divide-y divide-border overflow-hidden">
          {menuGroup2.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between w-full px-4 py-3.5 bg-transparent hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center">
                  <item.icon size={18} className="text-text-secondary" />
                </div>
                <span className="text-sm font-medium text-text-main">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge ? (
                  <Badge className="min-w-[20px] h-5 px-1.5 bg-error text-white text-[11px] font-semibold">
                    {item.badge}
                  </Badge>
                ) : null}
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            </button>
          ))}
        </Card>
      </div>

      <div className="px-5 pb-4 animate-fade-in-up stagger-4">
        <Button
          variant="destructive"
          onClick={signOut}
          className="w-full"
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
