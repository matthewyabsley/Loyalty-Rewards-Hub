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
    profile.tsx       - User profile & settings
  book-table.tsx      - Table booking with date/time/guest selection
  menu.tsx            - Food menu with categories and cart
  cart.tsx            - Order review and checkout (modal)
  events.tsx          - Event listing
  event-detail.tsx    - Event details and booking

lib/
  auth-context.tsx    - Authentication state (AsyncStorage)
  data-context.tsx    - App data (menu, bookings, events, rewards, transactions)
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
- Feb 2026: Initial build of complete loyalty app
