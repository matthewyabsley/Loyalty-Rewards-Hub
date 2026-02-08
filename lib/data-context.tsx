import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MenuOption {
  id: string;
  label: string;
  choices: { id: string; name: string; price: number }[];
  required?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
  options?: MenuOption[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  cartId: string;
  selectedOptions?: Record<string, { name: string; price: number }>;
  notes?: string;
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

export interface Order {
  id: string;
  items: { name: string; quantity: number; price: number; options?: string[] }[];
  total: number;
  date: string;
  status: 'completed' | 'preparing' | 'delivered' | 'cancelled';
  tableNumber: number;
}

export interface SavedItem {
  id: string;
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  savedDate: string;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'apple_pay';
  last4: string;
  expiryDate: string;
  isDefault: boolean;
  cardholderName: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'reward' | 'promo' | 'booking' | 'system';
}

interface DataContextValue {
  menu: MenuItem[];
  cart: CartItem[];
  bookings: Booking[];
  events: Event[];
  rewards: Reward[];
  transactions: PointsTransaction[];
  orders: Order[];
  savedItems: SavedItem[];
  paymentMethods: PaymentMethod[];
  notifications: AppNotification[];
  tableNumber: number | null;
  setTableNumber: (num: number | null) => void;
  addToCart: (item: MenuItem, options?: Record<string, { name: string; price: number }>, notes?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  bookEvent: (eventId: string) => Promise<void>;
  claimReward: (rewardId: string) => Promise<void>;
  addTransaction: (tx: Omit<PointsTransaction, 'id'>) => Promise<void>;
  toggleSavedItem: (item: MenuItem) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPayment: (methodId: string) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  placeOrder: (items: CartItem[], tableNum: number) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

const SAMPLE_MENU: MenuItem[] = [
  {
    id: '1', name: 'Truffle Risotto', description: 'Creamy arborio rice with black truffle and parmesan', price: 24.99, category: 'Mains', image: 'restaurant', popular: true,
    options: [
      { id: 'portion', label: 'Portion Size', required: true, choices: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'large', name: 'Large', price: 4.00 },
      ]},
      { id: 'extras', label: 'Extra Toppings', choices: [
        { id: 'truffle', name: 'Extra Truffle Shavings', price: 3.50 },
        { id: 'parmesan', name: 'Extra Parmesan', price: 1.50 },
        { id: 'mushroom', name: 'Wild Mushrooms', price: 2.50 },
      ]},
    ],
  },
  {
    id: '2', name: 'Wagyu Burger', description: 'Premium wagyu beef with caramelised onions and brioche bun', price: 28.99, category: 'Mains', image: 'restaurant', popular: true,
    options: [
      { id: 'cook', label: 'How would you like it cooked?', required: true, choices: [
        { id: 'rare', name: 'Rare', price: 0 },
        { id: 'medium-rare', name: 'Medium Rare', price: 0 },
        { id: 'medium', name: 'Medium', price: 0 },
        { id: 'well-done', name: 'Well Done', price: 0 },
      ]},
      { id: 'side', label: 'Choose a Side', required: true, choices: [
        { id: 'fries', name: 'Skin-on Fries', price: 0 },
        { id: 'sweet-fries', name: 'Sweet Potato Fries', price: 1.50 },
        { id: 'salad', name: 'Side Salad', price: 0 },
        { id: 'onion-rings', name: 'Onion Rings', price: 1.00 },
      ]},
      { id: 'extras', label: 'Add Extras', choices: [
        { id: 'bacon', name: 'Smoked Bacon', price: 2.00 },
        { id: 'cheese', name: 'Cheddar Cheese', price: 1.50 },
        { id: 'egg', name: 'Fried Egg', price: 1.50 },
        { id: 'avocado', name: 'Avocado', price: 2.00 },
      ]},
    ],
  },
  {
    id: '3', name: 'Lobster Bisque', description: 'Rich and velvety with a touch of brandy cream', price: 14.99, category: 'Starters', image: 'restaurant', popular: false,
    options: [
      { id: 'portion', label: 'Portion Size', required: true, choices: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'large', name: 'Large', price: 3.00 },
      ]},
      { id: 'extras', label: 'Add Extras', choices: [
        { id: 'bread', name: 'Sourdough Bread', price: 2.00 },
        { id: 'cream', name: 'Extra Cream', price: 1.00 },
      ]},
    ],
  },
  {
    id: '4', name: 'Caesar Salad', description: 'Romaine hearts, anchovies, croutons, aged parmesan', price: 12.99, category: 'Starters', image: 'restaurant', popular: true,
    options: [
      { id: 'protein', label: 'Add Protein', choices: [
        { id: 'chicken', name: 'Grilled Chicken', price: 3.50 },
        { id: 'prawns', name: 'King Prawns', price: 4.50 },
        { id: 'salmon', name: 'Smoked Salmon', price: 5.00 },
      ]},
      { id: 'extras', label: 'Extras', choices: [
        { id: 'croutons', name: 'Extra Croutons', price: 1.00 },
        { id: 'parmesan', name: 'Extra Parmesan', price: 1.50 },
      ]},
    ],
  },
  {
    id: '5', name: 'Pan-Seared Salmon', description: 'Atlantic salmon with lemon dill sauce and asparagus', price: 26.99, category: 'Mains', image: 'restaurant', popular: false,
    options: [
      { id: 'side', label: 'Choose a Side', required: true, choices: [
        { id: 'asparagus', name: 'Grilled Asparagus', price: 0 },
        { id: 'mash', name: 'Creamy Mash', price: 0 },
        { id: 'rice', name: 'Steamed Rice', price: 0 },
      ]},
      { id: 'sauce', label: 'Sauce', choices: [
        { id: 'dill', name: 'Lemon Dill (included)', price: 0 },
        { id: 'hollandaise', name: 'Hollandaise', price: 1.50 },
        { id: 'teriyaki', name: 'Teriyaki Glaze', price: 1.00 },
      ]},
    ],
  },
  {
    id: '6', name: 'Chocolate Fondant', description: 'Warm molten centre with vanilla bean ice cream', price: 11.99, category: 'Desserts', image: 'restaurant', popular: true,
    options: [
      { id: 'ice-cream', label: 'Ice Cream Flavour', required: true, choices: [
        { id: 'vanilla', name: 'Vanilla Bean', price: 0 },
        { id: 'salted-caramel', name: 'Salted Caramel', price: 0 },
        { id: 'raspberry', name: 'Raspberry Sorbet', price: 0 },
      ]},
      { id: 'extras', label: 'Add Extra', choices: [
        { id: 'cream', name: 'Whipped Cream', price: 1.00 },
        { id: 'berries', name: 'Fresh Berries', price: 2.00 },
      ]},
    ],
  },
  {
    id: '7', name: 'Tiramisu', description: 'Classic Italian with mascarpone and espresso', price: 10.99, category: 'Desserts', image: 'restaurant', popular: false,
    options: [
      { id: 'portion', label: 'Portion', required: true, choices: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'sharing', name: 'Sharing (for 2)', price: 5.00 },
      ]},
    ],
  },
  {
    id: '8', name: 'Prawn Cocktail', description: 'Tiger prawns with Marie Rose sauce and avocado', price: 13.99, category: 'Starters', image: 'restaurant', popular: false,
    options: [
      { id: 'portion', label: 'Portion Size', required: true, choices: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'large', name: 'Large', price: 3.50 },
      ]},
    ],
  },
  {
    id: '9', name: 'Grilled Ribeye', description: '28-day aged ribeye with peppercorn sauce', price: 34.99, category: 'Mains', image: 'restaurant', popular: true,
    options: [
      { id: 'cook', label: 'How would you like it cooked?', required: true, choices: [
        { id: 'rare', name: 'Rare', price: 0 },
        { id: 'medium-rare', name: 'Medium Rare', price: 0 },
        { id: 'medium', name: 'Medium', price: 0 },
        { id: 'well-done', name: 'Well Done', price: 0 },
      ]},
      { id: 'side', label: 'Choose a Side', required: true, choices: [
        { id: 'fries', name: 'Triple-Cooked Chips', price: 0 },
        { id: 'mash', name: 'Truffle Mash', price: 2.00 },
        { id: 'salad', name: 'Rocket Salad', price: 0 },
      ]},
      { id: 'sauce', label: 'Extra Sauce', choices: [
        { id: 'bearnaise', name: 'B\u00e9arnaise', price: 1.50 },
        { id: 'blue-cheese', name: 'Blue Cheese', price: 1.50 },
      ]},
    ],
  },
  {
    id: '10', name: 'Craft Lemonade', description: 'Fresh squeezed with elderflower and mint', price: 5.99, category: 'Drinks', image: 'restaurant', popular: false,
    options: [
      { id: 'size', label: 'Size', required: true, choices: [
        { id: 'regular', name: 'Regular', price: 0 },
        { id: 'large', name: 'Large', price: 1.50 },
      ]},
      { id: 'extras', label: 'Extras', choices: [
        { id: 'ice', name: 'Extra Ice', price: 0 },
        { id: 'mint', name: 'Fresh Mint', price: 0.50 },
      ]},
    ],
  },
  {
    id: '11', name: 'Espresso Martini', description: 'Vodka, fresh espresso, coffee liqueur', price: 12.99, category: 'Drinks', image: 'restaurant', popular: true,
    options: [
      { id: 'style', label: 'Style', required: true, choices: [
        { id: 'classic', name: 'Classic', price: 0 },
        { id: 'vanilla', name: 'Vanilla', price: 1.00 },
        { id: 'salted-caramel', name: 'Salted Caramel', price: 1.00 },
      ]},
      { id: 'strength', label: 'Strength', choices: [
        { id: 'single', name: 'Single Shot', price: 0 },
        { id: 'double', name: 'Double Shot', price: 2.00 },
      ]},
    ],
  },
  {
    id: '12', name: 'Cr\u00e8me Br\u00fbl\u00e9e', description: 'Madagascar vanilla with caramelised sugar top', price: 10.99, category: 'Desserts', image: 'restaurant', popular: false,
    options: [
      { id: 'flavour', label: 'Flavour', required: true, choices: [
        { id: 'vanilla', name: 'Classic Vanilla', price: 0 },
        { id: 'lavender', name: 'Lavender', price: 1.00 },
        { id: 'pistachio', name: 'Pistachio', price: 1.00 },
      ]},
    ],
  },
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

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord1', date: '2026-02-07T19:30:00', status: 'completed', tableNumber: 5, total: 72.47,
    items: [
      { name: 'Wagyu Burger', quantity: 1, price: 30.49, options: ['Medium Rare', 'Sweet Potato Fries'] },
      { name: 'Truffle Risotto', quantity: 1, price: 28.99, options: ['Large'] },
      { name: 'Espresso Martini', quantity: 1, price: 12.99, options: ['Classic'] },
    ],
  },
  {
    id: 'ord2', date: '2026-02-03T20:00:00', status: 'completed', tableNumber: 12, total: 48.97,
    items: [
      { name: 'Pan-Seared Salmon', quantity: 1, price: 26.99, options: ['Grilled Asparagus'] },
      { name: 'Caesar Salad', quantity: 1, price: 12.99 },
      { name: 'Craft Lemonade', quantity: 1, price: 5.99, options: ['Large'] },
    ],
  },
  {
    id: 'ord3', date: '2026-01-28T18:45:00', status: 'completed', tableNumber: 8, total: 58.97,
    items: [
      { name: 'Grilled Ribeye', quantity: 1, price: 34.99, options: ['Medium', 'Triple-Cooked Chips'] },
      { name: 'Lobster Bisque', quantity: 1, price: 14.99, options: ['Regular'] },
      { name: 'Chocolate Fondant', quantity: 1, price: 11.99, options: ['Vanilla Bean'] },
    ],
  },
  {
    id: 'ord4', date: '2026-01-20T13:00:00', status: 'completed', tableNumber: 3, total: 35.97,
    items: [
      { name: 'Caesar Salad', quantity: 2, price: 25.98, options: ['Grilled Chicken'] },
      { name: 'Tiramisu', quantity: 1, price: 10.99 },
    ],
  },
];

const SAMPLE_SAVED: SavedItem[] = [
  { id: 's1', menuItemId: '2', name: 'Wagyu Burger', description: 'Premium wagyu beef with caramelised onions and brioche bun', price: 28.99, category: 'Mains', savedDate: '2026-02-06' },
  { id: 's2', menuItemId: '6', name: 'Chocolate Fondant', description: 'Warm molten centre with vanilla bean ice cream', price: 11.99, category: 'Desserts', savedDate: '2026-02-03' },
  { id: 's3', menuItemId: '11', name: 'Espresso Martini', description: 'Vodka, fresh espresso, coffee liqueur', price: 12.99, category: 'Drinks', savedDate: '2026-01-28' },
];

const SAMPLE_PAYMENTS: PaymentMethod[] = [
  { id: 'pm1', type: 'visa', last4: '4242', expiryDate: '08/27', isDefault: true, cardholderName: 'Guest User' },
  { id: 'pm2', type: 'mastercard', last4: '8888', expiryDate: '12/26', isDefault: false, cardholderName: 'Guest User' },
  { id: 'pm3', type: 'apple_pay', last4: '', expiryDate: '', isDefault: false, cardholderName: 'Guest User' },
];

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Order Confirmed', message: 'Your order at Table 5 has been confirmed and is being prepared.', date: '2026-02-08T10:30:00', read: false, type: 'order' },
  { id: 'n2', title: 'New Reward Unlocked', message: 'You\'ve earned a 20% discount on your next visit. Check your rewards!', date: '2026-02-07T14:00:00', read: false, type: 'reward' },
  { id: 'n3', title: 'Weekend Special', message: 'Join us this Saturday for our Chef\'s Table experience. Book now!', date: '2026-02-06T09:00:00', read: true, type: 'promo' },
  { id: 'n4', title: 'Booking Reminder', message: 'Your table reservation for tomorrow at 7:30 PM is confirmed.', date: '2026-02-05T18:00:00', read: true, type: 'booking' },
  { id: 'n5', title: 'Points Earned', message: 'You earned 50 points from your last visit. Keep dining to reach Silver tier!', date: '2026-02-01T20:00:00', read: true, type: 'reward' },
  { id: 'n6', title: 'Happy Hour Tonight', message: '2-for-1 cocktails from 5-7 PM. See you at the bar!', date: '2026-01-30T12:00:00', read: true, type: 'promo' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);
  const [rewards, setRewards] = useState<Reward[]>(SAMPLE_REWARDS);
  const [transactions, setTransactions] = useState<PointsTransaction[]>(SAMPLE_TRANSACTIONS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(SAMPLE_SAVED);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(SAMPLE_PAYMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [bookingsData, rewardsData, transactionsData, ordersData, savedData, paymentsData, notifsData] = await Promise.all([
        AsyncStorage.getItem('bookings'),
        AsyncStorage.getItem('rewards'),
        AsyncStorage.getItem('transactions'),
        AsyncStorage.getItem('orders'),
        AsyncStorage.getItem('savedItems'),
        AsyncStorage.getItem('paymentMethods'),
        AsyncStorage.getItem('notifications'),
      ]);
      if (bookingsData) setBookings(JSON.parse(bookingsData));
      if (rewardsData) setRewards(JSON.parse(rewardsData));
      if (transactionsData) setTransactions(JSON.parse(transactionsData));
      if (ordersData) setOrders(JSON.parse(ordersData));
      if (savedData) setSavedItems(JSON.parse(savedData));
      if (paymentsData) setPaymentMethods(JSON.parse(paymentsData));
      if (notifsData) setNotifications(JSON.parse(notifsData));
    } catch (e) {
      console.error('Failed to load data', e);
    }
  }

  function addToCart(item: MenuItem, options?: Record<string, { name: string; price: number }>, notes?: string) {
    const cartId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setCart(prev => [...prev, { item, quantity: 1, cartId, selectedOptions: options, notes }]);
  }

  function removeFromCart(cartId: string) {
    setCart(prev => prev.filter(c => c.cartId !== cartId));
  }

  function updateCartQuantity(cartId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(c => c.cartId === cartId ? { ...c, quantity: qty } : c));
  }

  function clearCart() {
    setCart([]);
  }

  const cartTotal = cart.reduce((sum, c) => {
    const optionsPrice = c.selectedOptions
      ? Object.values(c.selectedOptions).reduce((s, o) => s + o.price, 0)
      : 0;
    return sum + (c.item.price + optionsPrice) * c.quantity;
  }, 0);

  async function addBooking(booking: Omit<Booking, 'id'>) {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    await AsyncStorage.setItem('bookings', JSON.stringify(updated));
  }

  async function cancelBooking(bookingId: string) {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    );
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

  async function toggleSavedItem(item: MenuItem) {
    const existing = savedItems.find(s => s.menuItemId === item.id);
    let updated: SavedItem[];
    if (existing) {
      updated = savedItems.filter(s => s.menuItemId !== item.id);
    } else {
      const newSaved: SavedItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        menuItemId: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        savedDate: new Date().toISOString().split('T')[0],
      };
      updated = [newSaved, ...savedItems];
    }
    setSavedItems(updated);
    await AsyncStorage.setItem('savedItems', JSON.stringify(updated));
  }

  async function addPaymentMethod(method: Omit<PaymentMethod, 'id'>) {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [...paymentMethods, newMethod];
    setPaymentMethods(updated);
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(updated));
  }

  async function removePaymentMethod(methodId: string) {
    const updated = paymentMethods.filter(m => m.id !== methodId);
    setPaymentMethods(updated);
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(updated));
  }

  async function setDefaultPayment(methodId: string) {
    const updated = paymentMethods.map(m => ({ ...m, isDefault: m.id === methodId }));
    setPaymentMethods(updated);
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(updated));
  }

  async function markNotificationRead(notifId: string) {
    const updated = notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  }

  async function markAllNotificationsRead() {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  }

  async function placeOrder(items: CartItem[], tableNum: number) {
    const orderItems = items.map(ci => {
      const optsList = ci.selectedOptions ? Object.values(ci.selectedOptions).map(o => o.name) : undefined;
      const optionsPrice = ci.selectedOptions ? Object.values(ci.selectedOptions).reduce((s, o) => s + o.price, 0) : 0;
      return {
        name: ci.item.name,
        quantity: ci.quantity,
        price: (ci.item.price + optionsPrice) * ci.quantity,
        options: optsList && optsList.length > 0 ? optsList : undefined,
      };
    });
    const total = orderItems.reduce((s, oi) => s + oi.price, 0);
    const newOrder: Order = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      items: orderItems,
      total,
      date: new Date().toISOString(),
      status: 'preparing',
      tableNumber: tableNum,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    await AsyncStorage.setItem('orders', JSON.stringify(updated));
  }

  const value = useMemo(() => ({
    menu: SAMPLE_MENU,
    cart,
    bookings,
    events,
    rewards,
    transactions,
    orders,
    savedItems,
    paymentMethods,
    notifications,
    tableNumber,
    setTableNumber,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    addBooking,
    cancelBooking,
    bookEvent,
    claimReward,
    addTransaction,
    toggleSavedItem,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPayment,
    markNotificationRead,
    markAllNotificationsRead,
    placeOrder,
  }), [cart, bookings, events, rewards, transactions, orders, savedItems, paymentMethods, notifications, cartTotal, tableNumber]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
