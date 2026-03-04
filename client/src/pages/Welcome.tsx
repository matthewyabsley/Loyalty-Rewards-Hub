import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
    <div
      className="h-full flex flex-col items-center justify-between px-6 py-12 overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #6B1420 0%, #8B1A2B 40%, #3D0A14 100%)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[360px]">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl glass-dark flex items-center justify-center mx-auto mb-5 border border-white/10">
            <UtensilsCrossed size={36} className="text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Tap Yard</h1>
          <p className="text-[15px] text-white/60">Your loyalty, rewarded</p>
        </div>

        <div className="flex flex-col gap-4 mb-10 w-full opacity-0 animate-fade-in-up stagger-1">
          {[
            { icon: <Gift size={20} className="text-accent" />, text: 'Earn rewards with every visit' },
            { icon: <CalendarDays size={20} className="text-accent" />, text: 'Book tables in seconds' },
            { icon: <QrCode size={20} className="text-accent" />, text: 'Scan & redeem instantly' },
          ].map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 opacity-0 animate-fade-in-up",
                i === 0 && "stagger-2",
                i === 1 && "stagger-3",
                i === 2 && "stagger-4"
              )}
            >
              {item.icon}
              <span className="text-white/80 text-[15px]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[360px] opacity-0 animate-fade-in-up stagger-5">
        {!showEmail ? (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <Button
                variant="glass"
                className="w-full py-4 h-auto text-[15px] font-semibold gap-2.5 bg-white/90 border-white/30 text-gray-800 hover:bg-white"
                onClick={() => handleSocial('google')}
              >
                <Chrome size={20} /> Continue with Google
              </Button>
              <Button
                variant="dark"
                className="w-full py-4 h-auto text-[15px] font-semibold gap-2.5"
                onClick={() => handleSocial('apple')}
              >
                <Apple size={20} /> Continue with Apple
              </Button>
              <Button
                variant="glass"
                className="w-full py-4 h-auto text-[15px] font-semibold gap-2.5 bg-[#1877F2] border-[#1877F2]/30 text-white hover:bg-[#1565D8]"
                onClick={() => handleSocial('facebook')}
              >
                <Facebook size={20} /> Continue with Facebook
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/25" />
              <span className="text-white/60 text-[13px]">or sign up with email</span>
              <div className="flex-1 h-px bg-white/25" />
            </div>

            <Button
              variant="ghost"
              className="w-full py-4 h-auto text-[15px] font-semibold gap-2.5 text-white border-2 border-white/30 hover:bg-white/10"
              onClick={() => setShowEmail(true)}
            >
              <Mail size={20} /> Sign up with Email
            </Button>
          </>
        ) : (
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="py-3.5 px-4 rounded-xl text-[15px] bg-white/10 backdrop-blur-sm text-white border border-white/15 placeholder:text-white/40 focus:border-white/30 transition-colors"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="py-3.5 px-4 rounded-xl text-[15px] bg-white/10 backdrop-blur-sm text-white border border-white/15 placeholder:text-white/40 focus:border-white/30 transition-colors"
            />
            <Button
              type="submit"
              variant="accent"
              className="w-full py-3.5 h-auto text-[15px] font-semibold mt-1"
            >
              Get Started
            </Button>
            <button
              type="button"
              onClick={() => setShowEmail(false)}
              className="py-3 bg-transparent text-white/70 text-sm active:scale-[0.97] transition-transform"
            >
              Back to sign in options
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
