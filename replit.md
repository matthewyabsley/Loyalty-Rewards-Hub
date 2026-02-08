# Dine & Earn - Restaurant Loyalty App

## Overview
A mobile restaurant loyalty app built with Expo/React Native that allows customers to:
- Sign up via social media (Google, Apple, Facebook) or email
- Book tables with date/time/guest selection
- Browse menu and order food at the table
- Browse and book restaurant events
- View loyalty points and tier status (Bronze/Silver/Gold/Platinum)
- Claim rewards via swipeable QR code cards
- Track transaction history

## Tech Stack
- **Frontend**: Expo Router (file-based routing), React Native
- **Backend**: Express (minimal, mainly landing page)
- **State Management**: React Context + AsyncStorage
- **Fonts**: Poppins (Google Fonts)
- **Styling**: StyleSheet with custom color theme (burgundy/gold)
- **Icons**: @expo/vector-icons (Ionicons)
- **QR Codes**: react-native-qrcode-svg

## Project Structure
```
app/
  _layout.tsx         - Root layout with providers (Auth, Data, QueryClient)
  index.tsx           - Welcome/sign-up screen
  (tabs)/
    _layout.tsx       - Tab navigation (Home, Rewards, Points, Profile)
    index.tsx         - Home dashboard
    rewards.tsx       - Swipeable QR code reward cards
    points.tsx        - Points balance, tier progress, transaction history
    profile.tsx       - User profile & settings (with notification badge)
  book-table.tsx      - Table booking with monthly calendar date picker
  menu.tsx            - Food menu with categories and cart
  cart.tsx            - Order review and checkout (modal)
  events.tsx          - Event listing
  event-detail.tsx    - Event details and booking
  local-events.tsx    - Wilmslow local events & cinema listings with maps and book-a-table
  order-history.tsx   - Past orders with PDF receipt generation
  saved-items.tsx     - Bookmarked menu items with remove/browse
  payment-methods.tsx - Card management (add/remove/set default)
  notifications.tsx   - Notifications with read/unread and mark all read
  help-support.tsx    - FAQ accordion, contact options, message form
  terms-privacy.tsx   - Terms of Service and Privacy Policy with tab switcher

lib/
  auth-context.tsx    - Authentication state (AsyncStorage)
  data-context.tsx    - App data (menu, bookings, events, rewards, transactions, orders, saved items, payment methods, notifications)
  query-client.ts     - React Query setup

constants/
  colors.ts           - Theme colors (burgundy primary, gold accent)
```

## Color Theme
- Primary: #8B1A2B (burgundy)
- Accent: #D4A853 (gold)
- Background: #FAFAF8

## User Preferences
- None recorded yet

## Recent Changes
- Feb 2026: Added Local Events page with full year of Wilmslow events, Rex Cinema listings, Google Maps modal, and "Book a table after" links
- Feb 2026: Updated book-table with full monthly calendar (month navigation, all days grid)
- Feb 2026: Order history now generates PDF receipts via expo-print/expo-sharing
- Feb 2026: Improved menu item modal to 90% width with reduced font sizes
- Feb 2026: Added 6 functional profile sub-pages (Order History, Saved Items, Payment Methods, Notifications, Help & Support, Terms & Privacy)
- Feb 2026: Extended data context with orders, saved items, payment methods, notifications management
- Feb 2026: Initial build of complete loyalty app
