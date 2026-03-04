import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Gift, Mail, Smartphone, Wallet, Check, X } from 'lucide-react';

const DENOMINATIONS = [25, 50, 75, 100, 125, 150];
const DELIVERY_OPTIONS = [
  { id: 'wallet', label: 'Add to Wallet', icon: Wallet },
  { id: 'email', label: 'Send via Email', icon: Mail },
  { id: 'sms', label: 'Send via SMS', icon: Smartphone },
];

export default function GiftVouchers() {
  const navigate = useNavigate();
  const { paymentMethods } = useData();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [delivery, setDelivery] = useState('wallet');
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const defaultPayment = paymentMethods.find(p => p.isDefault);

  function handlePurchase() {
    setPurchased(true);
    setShowConfirm(false);
  }

  if (purchased) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: '#1DB26415', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={32} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Voucher Purchased!</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
          £{selectedAmount} gift voucher has been {delivery === 'wallet' ? 'added to wallet' : 'sent successfully'}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ maxWidth: 280 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Gift Vouchers</h1>
      </div>

      <div style={{ padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Choose Amount</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {DENOMINATIONS.map(amt => (
            <button key={amt} onClick={() => setSelectedAmount(amt)} style={{
              background: selectedAmount === amt
                ? 'linear-gradient(135deg, var(--primary-dark), var(--primary))'
                : 'var(--card)',
              color: selectedAmount === amt ? '#fff' : 'var(--text)',
              border: selectedAmount === amt ? 'none' : '1px solid var(--border)',
              borderRadius: 14, padding: '16px 8px', cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                <Gift size={14} />
                <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>Tap Yard</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700 }}>£{amt}</p>
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Delivery Method</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {DELIVERY_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setDelivery(opt.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderRadius: 12, cursor: 'pointer',
              background: delivery === opt.id ? 'var(--primary)' + '10' : 'var(--card)',
              border: delivery === opt.id ? '2px solid var(--primary)' : '1px solid var(--border)',
            }}>
              <opt.icon size={20} color={delivery === opt.id ? 'var(--primary)' : 'var(--text-secondary)'} />
              <span style={{ fontSize: 14, fontWeight: delivery === opt.id ? 600 : 400 }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {delivery !== 'wallet' && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recipient Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text" placeholder="Recipient Name" value={recipientName} onChange={e => setRecipientName(e.target.value)}
                style={{
                  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)',
                  fontSize: 14, background: 'var(--card)',
                }}
              />
              <input
                type={delivery === 'email' ? 'email' : 'tel'}
                placeholder={delivery === 'email' ? 'Email Address' : 'Phone Number'}
                value={recipientContact} onChange={e => setRecipientContact(e.target.value)}
                style={{
                  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)',
                  fontSize: 14, background: 'var(--card)',
                }}
              />
              <textarea
                placeholder="Personal message (optional)" value={personalMessage} onChange={e => setPersonalMessage(e.target.value)}
                style={{
                  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)',
                  fontSize: 14, background: 'var(--card)', minHeight: 60, resize: 'vertical',
                }}
              />
            </div>
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 18, height: 18 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>I agree to the gift voucher terms & conditions</span>
        </label>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!selectedAmount || !agreed}
          className="btn-primary"
        >
          Purchase · £{selectedAmount || 0}
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Confirm Purchase</h2>
              <button onClick={() => setShowConfirm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
              borderRadius: 16, padding: 20, color: '#fff', marginBottom: 20, textAlign: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                <Gift size={16} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Tap Yard</span>
              </div>
              <p style={{ fontSize: 32, fontWeight: 700 }}>£{selectedAmount}</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>GIFT VOUCHER</p>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              <p style={{ marginBottom: 4 }}>Delivery: {DELIVERY_OPTIONS.find(o => o.id === delivery)?.label}</p>
              {defaultPayment && <p>Payment: {defaultPayment.type.toUpperCase()} •••• {defaultPayment.last4}</p>}
            </div>
            <button onClick={handlePurchase} className="btn-primary">Confirm & Pay £{selectedAmount}</button>
          </div>
        </div>
      )}
    </div>
  );
}
