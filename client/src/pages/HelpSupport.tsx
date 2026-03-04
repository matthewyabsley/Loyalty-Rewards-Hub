import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Check } from 'lucide-react';

const FAQS = [
  { q: 'How do I earn loyalty points?', a: 'You earn points every time you dine with us. For every £1 spent, you earn 1 loyalty point. Points are automatically added to your account after payment.' },
  { q: 'How do I redeem rewards?', a: 'Go to the Rewards tab and swipe through your available rewards. Show the QR code to your server when you\'re ready to redeem.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel a booking through the app up to 2 hours before your reservation time. Go to your profile and select your booking to cancel.' },
  { q: 'How do gift vouchers work?', a: 'Gift vouchers can be purchased in denominations from £25 to £150. They can be added to your wallet, sent via email, or SMS to a recipient.' },
  { q: 'What are the loyalty tiers?', a: 'There are four tiers: Bronze (0-199 pts), Silver (200-499 pts), Gold (500-999 pts), and Platinum (1000+ pts). Each tier unlocks exclusive rewards and benefits.' },
  { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption to protect your payment data. We never store your full card number on our servers.' },
];

export default function HelpSupport() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setShowMessage(false); setMessage(''); }, 2000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
          <ArrowLeft size={22} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Help & Support</h1>
      </div>

      <div className="p-5">
        <h2 className="text-base font-semibold text-text-main mb-3">FAQ</h2>
        <div className="flex flex-col gap-2 mb-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-card rounded-[14px] border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex justify-between items-center w-full px-4 py-3.5 bg-transparent text-left"
              >
                <span className="text-sm font-medium text-text-main flex-1 pr-2">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp size={18} className="text-text-secondary shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-text-secondary shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3.5 text-[13px] text-text-secondary leading-[1.6]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-base font-semibold text-text-main mb-3">Contact Us</h2>
        <div className="flex flex-col gap-2.5 mb-6">
          {[
            { icon: Phone, label: 'Call Us', detail: '01625 000 000' },
            { icon: Mail, label: 'Email', detail: 'hello@tapyard.co.uk' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <c.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-main">{c.label}</p>
                <p className="text-xs text-text-secondary">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowMessage(!showMessage)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-text-main text-sm font-semibold bg-card transition-transform active:scale-[0.97]"
        >
          <MessageCircle size={18} /> Send a Message
        </button>

        {showMessage && (
          <div className="mt-4">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue or question..."
              className="w-full p-3.5 rounded-xl border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/50 min-h-[100px] resize-y mb-3"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold transition-transform active:scale-[0.97] disabled:opacity-50"
            >
              {sent ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} /> Sent!
                </span>
              ) : 'Send Message'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
