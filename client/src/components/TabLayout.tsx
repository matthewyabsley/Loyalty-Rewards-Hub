import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Gift, Star, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/rewards', label: 'Rewards', icon: Gift },
  { path: '/points', label: 'Points', icon: Star },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function TabLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </div>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'center', zIndex: 50,
      }}>
        <div style={{
          display: 'flex', maxWidth: 480, width: '100%',
          justifyContent: 'space-around', padding: '8px 0 20px',
        }}>
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, fontSize: 11, fontWeight: 500, padding: '4px 16px',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                textDecoration: 'none', transition: 'color 0.2s',
              })}
            >
              <tab.icon size={22} />
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
