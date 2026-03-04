import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import TabLayout from './components/TabLayout';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Rewards from './pages/Rewards';
import Points from './pages/Points';
import Profile from './pages/Profile';
import BookTable from './pages/BookTable';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import GiftVouchers from './pages/GiftVouchers';
import LocalEvents from './pages/LocalEvents';
import OrderHistory from './pages/OrderHistory';
import SavedItems from './pages/SavedItems';
import PaymentMethods from './pages/PaymentMethods';
import Notifications from './pages/Notifications';
import HelpSupport from './pages/HelpSupport';
import TermsPrivacy from './pages/TermsPrivacy';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Welcome />} />
      </Routes>
    );
  }

  return (
    <DataProvider>
      <Routes>
        <Route element={<TabLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/points" element={<Points />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/gift-vouchers" element={<GiftVouchers />} />
        <Route path="/local-events" element={<LocalEvents />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/saved-items" element={<SavedItems />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/terms-privacy" element={<TermsPrivacy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </DataProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
