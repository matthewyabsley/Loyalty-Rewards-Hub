import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ChevronDown, Phone, Mail, MessageCircle, Send, Check } from 'lucide-react';

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
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 max-w-[480px] mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Help & Support</h1>
        </div>
      </div>

      <div className="flex-1 max-w-[480px] mx-auto w-full overflow-y-auto p-5" style={{ WebkitOverflowScrolling: 'touch' }}>
        <h2 className="text-base font-semibold text-text-main mb-3">Frequently Asked Questions</h2>
        <Card className="divide-y divide-border mb-6 overflow-hidden animate-fade-in-up stagger-1">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex justify-between items-center w-full px-4 py-3.5 bg-transparent text-left"
              >
                <span className="text-sm font-medium text-text-main flex-1 pr-3">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-text-secondary shrink-0 transition-transform duration-300",
                    openFaq === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pb-3.5 text-[13px] text-text-secondary leading-[1.6]">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </Card>

        <h2 className="text-base font-semibold text-text-main mb-3">Contact Us</h2>
        <Card className="divide-y divide-border mb-6 overflow-hidden animate-fade-in-up stagger-2">
          {[
            { icon: Phone, label: 'Call Us', detail: '01625 000 000' },
            { icon: Mail, label: 'Email', detail: 'hello@tapyard.co.uk' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <c.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-main">{c.label}</p>
                <p className="text-xs text-text-secondary">{c.detail}</p>
              </div>
            </div>
          ))}
        </Card>

        <Button
          variant="outline"
          className="w-full gap-2 mb-4 animate-fade-in-up stagger-3"
          onClick={() => setShowMessage(!showMessage)}
        >
          <MessageCircle size={18} /> Send a Message
        </Button>

        {showMessage && (
          <Card className="p-4 animate-fade-in-up">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue or question..."
              className="w-full p-3.5 rounded-xl border border-border text-sm bg-card text-text-main placeholder:text-text-muted min-h-[100px] resize-y mb-3 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full gap-2"
            >
              {sent ? (
                <>
                  <Check size={18} /> Sent!
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
