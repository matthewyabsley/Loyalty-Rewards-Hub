# Tap Yard - Restaurant Loyalty App

## Overview
A web-based restaurant loyalty app built with React + Vite + Tailwind CSS + shadcn/ui, designed to run inside Capacitor for native mobile deployment. Premium iOS-style design with glassmorphism, modern gradients, smooth animations, and card-based UI. Customers can:
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
- **Frontend**: React + Vite + TypeScript (web SPA, Capacitor-ready)
- **UI Library**: shadcn/ui components (Button, Card, Badge, Input, Sheet)
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin) with custom theme
- **Animations**: CSS animations (fadeInUp, slideUp, scaleIn) with stagger delays
- **Effects**: Glassmorphism (backdrop-blur), modern gradients, card-based layout
- **Backend**: Express (API server on port 3001)
- **Routing**: React Router DOM
- **State Management**: React Context + localStorage
- **Fonts**: Poppins (Google Fonts)
- **Icons**: lucide-react
- **QR Codes**: qrcode.react
- **Mobile**: Capacitor (@capacitor/core, @capacitor/cli)
- **Utilities**: class-variance-authority, clsx, tailwind-merge, @radix-ui primitives

## Project Structure
```
client/
  index.html              - HTML entry point
  src/
    main.tsx              - React root render
    App.tsx               - Router + providers setup
    App.css               - Tailwind imports + custom theme + animations + glass classes
    lib/
      utils.ts            - cn() utility (clsx + tailwind-merge)
    contexts/
      AuthContext.tsx      - Authentication state (localStorage)
      DataContext.tsx      - App data (menu, bookings, events, rewards, etc.)
    components/
      ui/
        button.tsx        - Button component (7 variants: default/accent/outline/ghost/destructive/glass/dark)
        card.tsx          - Card, GlassCard, DarkCard components
        badge.tsx         - Badge component (7 variants)
        input.tsx         - Input component
        sheet.tsx         - Sheet (bottom drawer) component
      TabLayout.tsx       - Bottom tab navigation with glassmorphism
    pages/
      Welcome.tsx         - Sign-up/sign-in with gradient + glassmorphism
      Home.tsx            - Dashboard with DarkCard, quick actions grid
      Rewards.tsx         - QR code reward cards with snap carousel
      Points.tsx          - Points balance, tier progress, transactions
      Profile.tsx         - User profile & settings menu
      BookTable.tsx       - Calendar date picker + time/guest selection
      Menu.tsx            - Food menu with categories, Sheet for item details
      Cart.tsx            - Order review, table selection, checkout
      Events.tsx          - Event listing
      EventDetail.tsx     - Event details and booking
      GiftVouchers.tsx    - Gift voucher purchase (£25-£150)
      LocalEvents.tsx     - Wilmslow events & Rex Cinema listings
      OrderHistory.tsx    - Past orders with receipt download
      SavedItems.tsx      - Bookmarked menu items
      PaymentMethods.tsx  - Card management with Sheet for add form
      Notifications.tsx   - Read/unread notifications
      HelpSupport.tsx     - FAQ accordion, contact, message form
      TermsPrivacy.tsx    - Terms of Service & Privacy Policy

server/
  index.ts               - Express server entry point
  routes.ts              - API routes
  storage.ts             - Data access layer

capacitor.config.ts      - Capacitor configuration (appId: com.tapyard.app)
vite.config.ts           - Vite + Tailwind + React configuration
```

## Design System
- **Glass effects**: `.glass` (white 70% + blur 20px), `.glass-dark`, `.glass-primary`
- **Animations**: `.animate-fade-in-up`, `.animate-slide-up`, `.animate-scale-in` with `.stagger-1` through `.stagger-6`
- **Layout**: max-w-[480px] mx-auto, mobile-first, momentum scrolling

## Theme Colors
- primary: #8B1A2B (burgundy)
- primary-light: #A82040
- primary-dark: #6B1420
- accent: #D4A853 (gold)
- accent-light: #E8C778
- accent-dark: #B8903F
- background: #F8F7F4
- card: #FFFFFF
- surface: #F0EFE9
- text-main: #1A1A1A
- text-secondary: #6B6B6B
- text-muted: #9A9A9A
- border: #E8E5DE
- border-light: #F0EDE6
- success: #22C55E
- error: #EF4444
- warning: #F59E0B

## Workflows
- **Start application**: Vite dev server on port 5000 (webview) + proxy on 8081
- **Start Backend**: Express API server on port 3001 (console)

## Deployment Artifacts
- **prebuildv1.zip**: Source code (pre-build) for development
- **web1.zip**: Built production bundle (dist/)

## User Preferences
- App name: "Tap Yard"
- British pounds (£) for currency
- Premium iOS-style design aesthetic

## Recent Changes
- Mar 2026: Complete UI rebuild with shadcn/ui + glassmorphism + premium animations
- Mar 2026: Added shadcn/ui component library (Button, Card, Badge, Input, Sheet)
- Mar 2026: Added Capacitor configuration for native mobile builds
- Mar 2026: Complete rebuild from Expo/React Native to web React + Vite
