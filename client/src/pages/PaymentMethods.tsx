import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, CreditCard, Plus, Trash2, X } from 'lucide-react';

const CARD_LABELS: Record<string, string> = { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', apple_pay: 'Apple Pay' };

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPayment } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex'>('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardName, setCardName] = useState('');

  function handleAdd() {
    if (!cardNumber || !cardExpiry || !cardName) return;
    addPaymentMethod({
      type: cardType, last4: cardNumber.slice(-4), expiryDate: cardExpiry,
      isDefault: paymentMethods.length === 0, cardholderName: cardName,
    });
    setShowAdd(false);
    setCardNumber(''); setCardExpiry(''); setCardName('');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
          <ArrowLeft size={22} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Payment Methods</h1>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-2.5 mb-5">
          {paymentMethods.map(pm => (
            <div
              key={pm.id}
              className={`flex justify-between items-center bg-card rounded-[14px] p-3.5 ${pm.isDefault ? 'border-2 border-primary' : 'border border-border'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                  <CreditCard size={20} className="text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">
                    {CARD_LABELS[pm.type]} {pm.last4 && `•••• ${pm.last4}`}
                  </p>
                  {pm.expiryDate && <p className="text-xs text-text-secondary">Expires {pm.expiryDate}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pm.isDefault ? (
                  <span className="text-[11px] font-semibold text-primary bg-primary/15 px-2 py-[3px] rounded-lg">Default</span>
                ) : (
                  <button
                    onClick={() => setDefaultPayment(pm.id)}
                    className="text-[11px] font-semibold text-text-secondary bg-surface border border-border px-2 py-[3px] rounded-lg"
                  >
                    Set Default
                  </button>
                )}
                <button onClick={() => removePaymentMethod(pm.id)} className="p-1 bg-transparent">
                  <Trash2 size={16} className="text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-text-main text-sm font-semibold bg-card transition-transform active:scale-[0.97]"
        >
          <Plus size={18} /> Add Payment Method
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowAdd(false)}>
          <div
            className="bg-card w-full max-w-[480px] rounded-t-[20px] p-5 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-text-main">Add Card</h2>
              <button onClick={() => setShowAdd(false)} className="bg-transparent">
                <X size={22} className="text-text-secondary" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Card Type</label>
                <select
                  value={cardType}
                  onChange={e => setCardType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm bg-card text-text-main"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">Amex</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/50"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/50"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm bg-card text-text-main placeholder:text-text-secondary/50"
                />
              </div>
              <button
                onClick={handleAdd}
                className="mt-1 w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold transition-transform active:scale-[0.97]"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
