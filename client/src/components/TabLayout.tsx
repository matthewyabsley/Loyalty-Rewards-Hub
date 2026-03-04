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
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 w-full max-w-[480px] mx-auto h-full overflow-y-auto pb-[88px]" style={{ WebkitOverflowScrolling: 'touch' }}>
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 rounded-t-2xl shadow-xl z-50 flex justify-center">
        <div className="flex w-full max-w-[480px] justify-around pt-2.5 pb-6">
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] font-medium px-4 py-1 transition-colors duration-300 no-underline ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
