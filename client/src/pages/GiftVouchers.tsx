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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background max-w-[480px] mx-auto w-full px-10 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-5">
          <Check size={32} className="text-success" />
        </div>
        <h2 className="text-[22px] font-bold text-text-main mb-2">Voucher Purchased!</h2>
        <p className="text-sm text-text-secondary mb-6">
          £{selectedAmount} gift voucher has been {delivery === 'wallet' ? 'added to wallet' : 'sent successfully'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-[280px] py-4 rounded-2xl font-semibold text-white text-[15px] transition-transform active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 bg-card border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-text-main"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-text-main">Gift Vouchers</h1>
      </div>

      <div className="p-5">
        <h2 className="text-base font-semibold text-text-main mb-3">Choose Amount</h2>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {DENOMINATIONS.map(amt => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={`rounded-[14px] py-4 px-2 text-center transition-transform active:scale-[0.97] ${
                selectedAmount === amt
                  ? 'text-white shadow-lg'
                  : 'bg-card text-text-main border border-border'
              }`}
              style={selectedAmount === amt ? { background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' } : undefined}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Gift size={14} className={selectedAmount === amt ? 'text-white' : 'text-text-secondary'} />
                <span className={`text-[11px] font-semibold ${selectedAmount === amt ? 'opacity-80' : 'text-text-secondary'}`}>
                  Tap Yard
                </span>
              </div>
              <p className="text-[22px] font-bold">£{amt}</p>
            </button>
          ))}
        </div>

        <h2 className="text-base font-semibold text-text-main mb-3">Delivery Method</h2>
        <div className="flex flex-col gap-2 mb-6">
          {DELIVERY_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setDelivery(opt.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                delivery === opt.id
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card border border-border'
              }`}
            >
              <opt.icon
                size={20}
                className={delivery === opt.id ? 'text-primary' : 'text-text-secondary'}
              />
              <span className={`text-sm ${delivery === opt.id ? 'font-semibold text-text-main' : 'text-text-main'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {delivery !== 'wallet' && (
          <div className="mb-6">
            <h2 className="text-base font-semibold text-text-main mb-3">Recipient Details</h2>
            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Recipient Name"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="px-3.5 py-3 rounded-xl border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/60 focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <input
                type={delivery === 'email' ? 'email' : 'tel'}
                placeholder={delivery === 'email' ? 'Email Address' : 'Phone Number'}
                value={recipientContact}
                onChange={e => setRecipientContact(e.target.value)}
                className="px-3.5 py-3 rounded-xl border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/60 focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <textarea
                placeholder="Personal message (optional)"
                value={personalMessage}
                onChange={e => setPersonalMessage(e.target.value)}
                className="px-3.5 py-3 rounded-xl border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/60 min-h-[60px] resize-y focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="w-[18px] h-[18px] accent-primary rounded"
          />
          <span className="text-[13px] text-text-secondary">
            I agree to the gift voucher terms & conditions
          </span>
        </label>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!selectedAmount || !agreed}
          className="w-full py-4 rounded-2xl font-semibold text-white text-[15px] transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
        >
          Purchase · £{selectedAmount || 0}
        </button>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-card w-full max-w-[480px] rounded-t-[20px] p-5 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-text-main">Confirm Purchase</h2>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface text-text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="rounded-2xl p-5 text-white mb-5 text-center"
              style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Gift size={16} />
                <span className="text-xs font-semibold">Tap Yard</span>
              </div>
              <p className="text-[32px] font-bold">£{selectedAmount}</p>
              <p className="text-xs opacity-70 tracking-wider">GIFT VOUCHER</p>
            </div>

            <div className="text-[13px] text-text-secondary mb-4 space-y-1">
              <p>Delivery: {DELIVERY_OPTIONS.find(o => o.id === delivery)?.label}</p>
              {defaultPayment && (
                <p>Payment: {defaultPayment.type.toUpperCase()} •••• {defaultPayment.last4}</p>
              )}
            </div>

            <button
              onClick={handlePurchase}
              className="w-full py-4 rounded-2xl font-semibold text-white text-[15px] transition-transform active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
            >
              Confirm & Pay £{selectedAmount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
