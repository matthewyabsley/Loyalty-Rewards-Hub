import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'apple' | 'facebook' | 'email';
  joinedDate: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalPoints: number;
  availableCredits: number;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (provider: string, name: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  spendCredits: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getTier(points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (points >= 5000) return 'Platinum';
  if (points >= 2000) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(provider: string, name: string, email: string) {
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: name.charAt(0).toUpperCase(),
      provider: provider as User['provider'],
      joinedDate: new Date().toISOString(),
      tier: 'Bronze',
      totalPoints: 150,
      availableCredits: 25,
    };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }

  async function signOut() {
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  async function updatePoints(points: number) {
    if (!user) return;
    const updated = {
      ...user,
      totalPoints: user.totalPoints + points,
      tier: getTier(user.totalPoints + points),
    };
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  }

  async function spendCredits(amount: number) {
    if (!user || user.availableCredits < amount) return;
    const updated = {
      ...user,
      availableCredits: user.availableCredits - amount,
    };
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  }

  const value = useMemo(() => ({
    user,
    isLoading,
    signIn,
    signOut,
    updatePoints,
    spendCredits,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
