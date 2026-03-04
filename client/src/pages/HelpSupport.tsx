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
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Help & Support</h1>
      </div>

      <div style={{ padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>FAQ</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              background: 'var(--card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', padding: '14px 16px', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1, paddingRight: 8 }}>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Contact Us</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {[
            { icon: Phone, label: 'Call Us', detail: '01625 000 000' },
            { icon: Mail, label: 'Email', detail: 'hello@tapyard.co.uk' },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--card)', borderRadius: 12, padding: 14,
              border: '1px solid var(--border)',
            }}>
              <c.icon size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{c.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowMessage(!showMessage)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <MessageCircle size={18} /> Send a Message
        </button>

        {showMessage && (
          <div style={{ marginTop: 16 }}>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue or question..."
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--border)',
                fontSize: 14, minHeight: 100, resize: 'vertical', background: 'var(--card)', marginBottom: 12,
              }}
            />
            <button onClick={handleSend} className="btn-primary" disabled={!message.trim()}>
              {sent ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
