# Tap Yard - Restaurant Loyalty App

## Overview
A web-based restaurant loyalty app built with React + Vite that allows customers to:
- Sign up via social media (Google, Apple, Facebook) or email
- Book tables with date/time/guest selection
- Browse menu and order food at the table
- Browse and book restaurant events
- View loyalty points and tier status (Bronze/Silver/Gold/Platinum)
- Claim rewards via QR code cards
- Track transaction history
- Purchase gift vouchers (£25-£150)
- Browse Wilmslow local events and cinema listings

## Tech Stack
- **Frontend**: React + Vite + TypeScript (web SPA)
- **Backend**: Express (API server on port 3001)
- **Routing**: React Router DOM
- **State Management**: React Context + localStorage
- **Fonts**: Poppins (Google Fonts)
- **Styling**: CSS variables + inline styles (burgundy/gold theme)
- **Icons**: lucide-react
- **QR Codes**: qrcode.react

## Project Structure
```
client/
  index.html              - HTML entry point
  src/
    main.tsx              - React root render
    App.tsx               - Router + providers setup
    App.css               - Global styles + CSS variables
    contexts/
      AuthContext.tsx      - Authentication state (localStorage)
      DataContext.tsx      - App data (menu, bookings, events, rewards, etc.)
    components/
      TabLayout.tsx       - Bottom tab navigation (Home, Rewards, Points, Profile)
    pages/
      Welcome.tsx         - Sign-up/sign-in screen
      Home.tsx            - Dashboard with quick actions
      Rewards.tsx         - QR code reward cards with navigation
      Points.tsx          - Points balance, tier progress, transactions
      Profile.tsx         - User profile & settings menu
      BookTable.tsx       - Calendar date picker + time/guest selection
      Menu.tsx            - Food menu with categories, options, cart
      Cart.tsx            - Order review, table selection, checkout
      Events.tsx          - Event listing
      EventDetail.tsx     - Event details and booking
      GiftVouchers.tsx    - Gift voucher purchase (£25-£150)
      LocalEvents.tsx     - Wilmslow events & Rex Cinema listings
      OrderHistory.tsx    - Past orders with receipt download
      SavedItems.tsx      - Bookmarked menu items
      PaymentMethods.tsx  - Card management (add/remove/set default)
      Notifications.tsx   - Read/unread notifications
      HelpSupport.tsx     - FAQ accordion, contact, message form
      TermsPrivacy.tsx    - Terms of Service & Privacy Policy

server/
  index.ts               - Express server entry point
  routes.ts              - API routes
  storage.ts             - Data access layer

vite.config.ts           - Vite configuration
```

## Color Theme
- Primary: #8B1A2B (burgundy)
- Accent: #D4A853 (gold)
- Background: #F7F6F3

## Workflows
- **Start application**: Vite dev server on port 5000 (webview)
- **Start Backend**: Express API server on port 3001 (console)

## User Preferences
- App name: "Tap Yard"
- British pounds (£) for currency

## Recent Changes
- Mar 2026: Complete rebuild from Expo/React Native to web React + Vite
- Mar 2026: All features ported: auth, booking, menu, cart, events, rewards, points, gift vouchers, local events, order history, notifications, help, terms
- Feb 2026: Original Expo/React Native prototype completed
