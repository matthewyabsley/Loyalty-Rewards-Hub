import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TERMS = [
  { title: '1. Acceptance of Terms', content: 'By downloading, installing, or using the Tap Yard app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
  { title: '2. Account Registration', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.' },
  { title: '3. Loyalty Programme', content: 'Points are earned based on qualifying purchases. We reserve the right to modify the points structure, tier levels, and rewards at any time. Points have no cash value and cannot be transferred or sold.' },
  { title: '4. Bookings & Cancellations', content: 'Table reservations can be cancelled up to 2 hours before the booking time. Late cancellations or no-shows may result in restrictions on future bookings.' },
  { title: '5. Gift Vouchers', content: 'Gift vouchers are non-refundable and cannot be exchanged for cash. They are valid for 12 months from the date of purchase unless otherwise stated.' },
  { title: '6. Limitation of Liability', content: 'Tap Yard shall not be liable for any indirect, incidental, special, or consequential damages arising from use of the app or services.' },
];

const PRIVACY = [
  { title: '1. Information We Collect', content: 'We collect personal information you provide (name, email, phone number) and usage data (booking history, order history, points activity) to provide and improve our services.' },
  { title: '2. How We Use Your Data', content: 'Your data is used to manage your account, process bookings and orders, administer the loyalty programme, send relevant communications, and improve our services.' },
  { title: '3. Data Sharing', content: 'We do not sell your personal data. We may share information with service providers who help us operate the app, process payments, or deliver communications on our behalf.' },
  { title: '4. Data Security', content: 'We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.' },
  { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time through the app settings.' },
  { title: '6. Cookies & Analytics', content: 'We use cookies and analytics tools to understand app usage patterns and improve user experience. You can manage cookie preferences in your device settings.' },
];

export default function TermsPrivacy() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');
  const sections = tab === 'terms' ? TERMS : PRIVACY;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
          <ArrowLeft size={22} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Terms & Privacy</h1>
      </div>

      <div className="flex gap-2 px-5 mt-1">
        <button
          onClick={() => setTab('terms')}
          className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
            tab === 'terms'
              ? 'bg-primary text-white'
              : 'bg-card text-text-main border border-border'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-colors ${
            tab === 'privacy'
              ? 'bg-primary text-white'
              : 'bg-card text-text-main border border-border'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      <div className="p-5">
        <p className="text-xs text-text-secondary mb-4">Last updated: February 2026</p>
        <div className="flex flex-col gap-4">
          {sections.map((s, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-text-main mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-text-secondary leading-[1.6]">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
