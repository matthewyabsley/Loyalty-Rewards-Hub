import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  spotsLeft: number;
  category: string;
  icon: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'offer' | 'credit';
  value: string;
  expiryDate: string;
  code: string;
  claimed: boolean;
}

export interface PointsTransaction {
  id: string;
  description: string;
  points: number;
  date: string;
  type: 'earned' | 'spent';
}

interface DataContextValue {
  menu: MenuItem[];
  cart: CartItem[];
  bookings: Booking[];
  events: Event[];
  rewards: Reward[];
  transactions: PointsTransaction[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  bookEvent: (eventId: string) => Promise<void>;
  claimReward: (rewardId: string) => Promise<void>;
  addTransaction: (tx: Omit<PointsTransaction, 'id'>) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

const SAMPLE_MENU: MenuItem[] = [
  { id: '1', name: 'Truffle Risotto', description: 'Creamy arborio rice with black truffle and parmesan', price: 24.99, category: 'Mains', image: 'restaurant', popular: true },
  { id: '2', name: 'Wagyu Burger', description: 'Premium wagyu beef with caramelised onions and brioche bun', price: 28.99, category: 'Mains', image: 'restaurant', popular: true },
  { id: '3', name: 'Lobster Bisque', description: 'Rich and velvety with a touch of brandy cream', price: 14.99, category: 'Starters', image: 'restaurant', popular: false },
  { id: '4', name: 'Caesar Salad', description: 'Romaine hearts, anchovies, croutons, aged parmesan', price: 12.99, category: 'Starters', image: 'restaurant', popular: true },
  { id: '5', name: 'Pan-Seared Salmon', description: 'Atlantic salmon with lemon dill sauce and asparagus', price: 26.99, category: 'Mains', image: 'restaurant', popular: false },
  { id: '6', name: 'Chocolate Fondant', description: 'Warm molten centre with vanilla bean ice cream', price: 11.99, category: 'Desserts', image: 'restaurant', popular: true },
  { id: '7', name: 'Tiramisu', description: 'Classic Italian with mascarpone and espresso', price: 10.99, category: 'Desserts', image: 'restaurant', popular: false },
  { id: '8', name: 'Prawn Cocktail', description: 'Tiger prawns with Marie Rose sauce and avocado', price: 13.99, category: 'Starters', image: 'restaurant', popular: false },
  { id: '9', name: 'Grilled Ribeye', description: '28-day aged ribeye with peppercorn sauce', price: 34.99, category: 'Mains', image: 'restaurant', popular: true },
  { id: '10', name: 'Craft Lemonade', description: 'Fresh squeezed with elderflower and mint', price: 5.99, category: 'Drinks', image: 'restaurant', popular: false },
  { id: '11', name: 'Espresso Martini', description: 'Vodka, fresh espresso, coffee liqueur', price: 12.99, category: 'Drinks', image: 'restaurant', popular: true },
  { id: '12', name: 'Crème Brûlée', description: 'Madagascar vanilla with caramelised sugar top', price: 10.99, category: 'Desserts', image: 'restaurant', popular: false },
];

const SAMPLE_EVENTS: Event[] = [
  { id: '1', title: 'Wine Tasting Evening', description: 'Explore 12 premium wines from Tuscany with our sommelier. Includes cheese pairings and light bites.', date: '2026-02-20', time: '19:00', price: 45, spotsLeft: 8, category: 'Tasting', icon: 'wine' },
  { id: '2', title: 'Chef\'s Table Experience', description: 'An intimate 7-course meal prepared tableside by our head chef. Limited to 10 guests.', date: '2026-02-28', time: '19:30', price: 95, spotsLeft: 3, category: 'Dining', icon: 'restaurant' },
  { id: '3', title: 'Live Jazz & Dinner', description: 'Enjoy live jazz performances while savouring our special 3-course set menu.', date: '2026-03-05', time: '20:00', price: 55, spotsLeft: 15, category: 'Entertainment', icon: 'musical-notes' },
  { id: '4', title: 'Cocktail Masterclass', description: 'Learn to craft 5 signature cocktails with our award-winning mixologist.', date: '2026-03-12', time: '18:00', price: 35, spotsLeft: 12, category: 'Workshop', icon: 'beer' },
  { id: '5', title: 'Sunday Brunch Special', description: 'Bottomless brunch with mimosas, live DJ and our famous pancake station.', date: '2026-03-15', time: '11:00', price: 40, spotsLeft: 20, category: 'Dining', icon: 'sunny' },
];

const SAMPLE_REWARDS: Reward[] = [
  { id: '1', title: '20% Off Your Next Visit', description: 'Valid on all food items. Excludes drinks.', type: 'discount', value: '20%', expiryDate: '2026-03-15', code: 'DINE20-' + Math.random().toString(36).substr(2, 8).toUpperCase(), claimed: false },
  { id: '2', title: 'Free Dessert', description: 'Choose any dessert from our menu on your next visit.', type: 'offer', value: 'Free', expiryDate: '2026-04-01', code: 'SWEET-' + Math.random().toString(36).substr(2, 8).toUpperCase(), claimed: false },
  { id: '3', title: 'Birthday Special', description: 'Complimentary bottle of Prosecco for your birthday dinner.', type: 'offer', value: 'Free', expiryDate: '2026-12-31', code: 'BDAY-' + Math.random().toString(36).substr(2, 8).toUpperCase(), claimed: false },
  { id: '4', title: 'Loyalty Credit', description: 'Use towards any purchase at the restaurant.', type: 'credit', value: '£15', expiryDate: '2026-05-01', code: 'CREDIT-' + Math.random().toString(36).substr(2, 8).toUpperCase(), claimed: false },
  { id: '5', title: '2-for-1 Cocktails', description: 'Buy one get one free on all cocktails during happy hour.', type: 'offer', value: '2-for-1', expiryDate: '2026-03-30', code: 'COCKTAIL-' + Math.random().toString(36).substr(2, 8).toUpperCase(), claimed: false },
];

const SAMPLE_TRANSACTIONS: PointsTransaction[] = [
  { id: '1', description: 'Dinner for 2', points: 50, date: '2026-02-01', type: 'earned' },
  { id: '2', description: 'Wine Tasting Event', points: 30, date: '2026-01-28', type: 'earned' },
  { id: '3', description: 'Redeemed Free Starter', points: -40, date: '2026-01-25', type: 'spent' },
  { id: '4', description: 'Weekend Brunch', points: 35, date: '2026-01-20', type: 'earned' },
  { id: '5', description: 'Referral Bonus', points: 75, date: '2026-01-15', type: 'earned' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);
  const [rewards, setRewards] = useState<Reward[]>(SAMPLE_REWARDS);
  const [transactions, setTransactions] = useState<PointsTransaction[]>(SAMPLE_TRANSACTIONS);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [bookingsData, rewardsData, transactionsData] = await Promise.all([
        AsyncStorage.getItem('bookings'),
        AsyncStorage.getItem('rewards'),
        AsyncStorage.getItem('transactions'),
      ]);
      if (bookingsData) setBookings(JSON.parse(bookingsData));
      if (rewardsData) setRewards(JSON.parse(rewardsData));
      if (transactionsData) setTransactions(JSON.parse(transactionsData));
    } catch (e) {
      console.error('Failed to load data', e);
    }
  }

  function addToCart(item: MenuItem) {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  }

  function removeFromCart(itemId: string) {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  }

  function updateCartQuantity(itemId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity: qty } : c));
  }

  function clearCart() {
    setCart([]);
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  async function addBooking(booking: Omit<Booking, 'id'>) {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    await AsyncStorage.setItem('bookings', JSON.stringify(updated));
  }

  async function bookEvent(eventId: string) {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, spotsLeft: Math.max(0, e.spotsLeft - 1) } : e
    ));
  }

  async function claimReward(rewardId: string) {
    const updated = rewards.map(r =>
      r.id === rewardId ? { ...r, claimed: true } : r
    );
    setRewards(updated);
    await AsyncStorage.setItem('rewards', JSON.stringify(updated));
  }

  async function addTransaction(tx: Omit<PointsTransaction, 'id'>) {
    const newTx: PointsTransaction = {
      ...tx,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem('transactions', JSON.stringify(updated));
  }

  const value = useMemo(() => ({
    menu: SAMPLE_MENU,
    cart,
    bookings,
    events,
    rewards,
    transactions,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    addBooking,
    bookEvent,
    claimReward,
    addTransaction,
  }), [cart, bookings, events, rewards, transactions, cartTotal]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
