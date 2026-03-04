import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, CreditCard, Plus, Trash2, Check, X } from 'lucide-react';

const CARD_ICONS: Record<string, string> = { visa: '💳', mastercard: '💳', amex: '💳', apple_pay: '🍎' };
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
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Payment Methods</h1>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {paymentMethods.map(pm => (
            <div key={pm.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--card)', borderRadius: 14, padding: 14,
              border: pm.isDefault ? '2px solid var(--primary)' : '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{CARD_ICONS[pm.type]}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>
                    {CARD_LABELS[pm.type]} {pm.last4 && `•••• ${pm.last4}`}
                  </p>
                  {pm.expiryDate && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Expires {pm.expiryDate}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {pm.isDefault ? (
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', background: 'var(--primary)' + '15', padding: '3px 8px', borderRadius: 8 }}>Default</span>
                ) : (
                  <button onClick={() => setDefaultPayment(pm.id)} style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    padding: '3px 8px', borderRadius: 8, cursor: 'pointer',
                  }}>Set Default</button>
                )}
                <button onClick={() => removePaymentMethod(pm.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                }}>
                  <Trash2 size={16} color="var(--error)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowAdd(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Plus size={18} /> Add Payment Method
        </button>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add Card</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Card Type</label>
                <select value={cardType} onChange={e => setCardType(e.target.value as any)} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                  fontSize: 14, background: 'var(--card)',
                }}>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">Amex</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: 'var(--card)',
                }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Expiry Date</label>
                <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: 'var(--card)',
                }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Cardholder Name</label>
                <input type="text" placeholder="Full Name" value={cardName} onChange={e => setCardName(e.target.value)} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: 'var(--card)',
                }} />
              </div>
              <button onClick={handleAdd} className="btn-primary" style={{ marginTop: 4 }}>Add Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
