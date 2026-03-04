import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  credits: number;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (provider: string, name: string, email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  function signIn(provider: string, name: string, email: string) {
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      provider,
      tier: 'Bronze',
      points: 150,
      credits: 25,
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }

  function signOut() {
    localStorage.removeItem('user');
    setUser(null);
  }

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
