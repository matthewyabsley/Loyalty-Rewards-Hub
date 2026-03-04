import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Check } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, cartTotal, updateCartQuantity, removeFromCart, placeOrder, tableNumber, setTableNumber } = useData();
  const [tableNum, setTableNum] = useState(tableNumber || 1);
  const [ordered, setOrdered] = useState(false);

  function handleOrder() {
    if (cart.length === 0) return;
    setTableNumber(tableNum);
    placeOrder(cart, tableNum);
    setOrdered(true);
  }

  if (ordered) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: '#1DB26415', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={32} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Your order is being prepared for Table {tableNum}</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ maxWidth: 280 }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={48} />
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/menu')} className="btn-primary" style={{ maxWidth: 200, marginTop: 16 }}>Browse Menu</button>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {cart.map(c => {
              const optionsPrice = c.selectedOptions ? Object.values(c.selectedOptions).reduce((s, o) => s + o.price, 0) : 0;
              const unitPrice = c.item.price + optionsPrice;
              return (
                <div key={c.cartId} style={{
                  background: 'var(--card)', borderRadius: 14, padding: 14,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.item.name}</h3>
                      {c.selectedOptions && (
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {Object.values(c.selectedOptions).map(o => o.name).join(', ')}
                        </p>
                      )}
                      {c.notes && <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{c.notes}</p>}
                    </div>
                    <button onClick={() => removeFromCart(c.cartId)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    }}>
                      <Trash2 size={16} color="var(--error)" />
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onClick={() => updateCartQuantity(c.cartId, c.quantity - 1)} style={{
                        width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer',
                      }}><Minus size={14} /></button>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{c.quantity}</span>
                      <button onClick={() => updateCartQuantity(c.cartId, c.quantity + 1)} style={{
                        width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer',
                      }}><Plus size={14} /></button>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                      £{(unitPrice * c.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Table Number</label>
            <select value={tableNum} onChange={e => setTableNum(Number(e.target.value))} style={{
              width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)',
              fontSize: 14, background: 'var(--card)',
            }}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>Table {n}</option>
              ))}
            </select>
          </div>

          <div style={{
            background: 'var(--card)', borderRadius: 14, padding: 16,
            border: '1px solid var(--border)', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontSize: 13 }}>£{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Service charge</span>
              <span style={{ fontSize: 13 }}>£0.00</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>£{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleOrder} className="btn-primary">Place Order</button>
        </div>
      )}
    </div>
  );
}
