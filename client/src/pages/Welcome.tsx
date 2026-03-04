import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UtensilsCrossed, Mail, Chrome, Apple, Facebook, Gift, CalendarDays, QrCode } from 'lucide-react';

export default function Welcome() {
  const { signIn } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSocial(provider: string) {
    signIn(provider, 'Guest User', `guest@${provider}.com`);
  }

  function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn('email', name.trim(), email.trim());
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #6B1420 0%, #8B1A2B 50%, #3D0A14 100%)' }}>

      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-accent/15 backdrop-blur-[10px] flex items-center justify-center mx-auto mb-5">
          <UtensilsCrossed size={36} className="text-accent" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontSize: 36 }}>Tap Yard</h1>
        <p className="text-[15px] text-white/60">Your loyalty, rewarded</p>
      </div>

      <div className="flex flex-col gap-5 mb-10 w-full max-w-[360px]">
        {[
          { icon: <Gift size={20} className="text-accent" />, text: 'Earn rewards with every visit' },
          { icon: <CalendarDays size={20} className="text-accent" />, text: 'Book tables in seconds' },
          { icon: <QrCode size={20} className="text-accent" />, text: 'Scan & redeem instantly' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.icon}
            <span className="text-white/85 text-[15px]">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[360px]">
        {!showEmail ? (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => handleSocial('google')}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold bg-white text-gray-800 active:scale-[0.98] transition-transform"
              >
                <Chrome size={20} /> Continue with Google
              </button>
              <button
                onClick={() => handleSocial('apple')}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold bg-[#1A1A1A] text-white active:scale-[0.98] transition-transform"
              >
                <Apple size={20} /> Continue with Apple
              </button>
              <button
                onClick={() => handleSocial('facebook')}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold bg-[#1877F2] text-white active:scale-[0.98] transition-transform"
              >
                <Facebook size={20} /> Continue with Facebook
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/25" />
              <span className="text-white/60 text-[13px]">or sign up with email</span>
              <div className="flex-1 h-px bg-white/25" />
            </div>

            <button
              onClick={() => setShowEmail(true)}
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold bg-transparent text-white border-2 border-white/30 active:scale-[0.98] transition-transform"
            >
              <Mail size={20} /> Sign up with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="py-3.5 px-4 rounded-xl border-none text-[15px] bg-white/10 text-white backdrop-blur-[10px] placeholder:text-white/40"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="py-3.5 px-4 rounded-xl border-none text-[15px] bg-white/10 text-white backdrop-blur-[10px] placeholder:text-white/40"
            />
            <button
              type="submit"
              className="py-3.5 px-5 rounded-xl text-[15px] font-semibold bg-accent text-white mt-1 active:scale-[0.98] transition-transform"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setShowEmail(false)}
              className="py-3 bg-transparent text-white/70 text-sm"
            >
              Back to sign in options
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
