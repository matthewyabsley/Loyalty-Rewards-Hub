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
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 w-full max-w-[480px] mx-auto pb-20">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.06)] rounded-t-2xl z-50 flex justify-center">
        <div className="flex w-full max-w-[480px] justify-around pt-2 pb-5">
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-[11px] font-medium px-4 py-1 transition-colors duration-200 no-underline ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`
              }
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
