import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Check, ChevronDown } from 'lucide-react';

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-10 text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <Check size={36} className="text-success" />
        </div>
        <h2 className="text-[22px] font-bold text-text-main mb-2">Order Placed!</h2>
        <p className="text-sm text-text-secondary mb-8">
          Your order is being prepared for Table {tableNum}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-[280px] py-4 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-semibold text-[15px] shadow-lg active:scale-[0.98] transition-transform"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm px-5 pt-[67px] pb-3 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-card shadow-sm"
        >
          <ArrowLeft size={20} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-5">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4">
            <ShoppingCart size={32} className="text-text-secondary" />
          </div>
          <p className="text-base text-text-secondary mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-semibold text-sm shadow-lg active:scale-[0.98] transition-transform"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="px-5">
          <div className="flex flex-col gap-3 mb-5">
            {cart.map(c => {
              const optionsPrice = c.selectedOptions ? Object.values(c.selectedOptions).reduce((s, o) => s + o.price, 0) : 0;
              const unitPrice = c.item.price + optionsPrice;
              return (
                <div key={c.cartId} className="bg-card rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-main mb-1">{c.item.name}</h3>
                      {c.selectedOptions && (
                        <p className="text-[11px] text-text-secondary">
                          {Object.values(c.selectedOptions).map(o => o.name).join(', ')}
                        </p>
                      )}
                      {c.notes && (
                        <p className="text-[11px] text-text-secondary italic mt-0.5">{c.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(c.cartId)}
                      className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
                    >
                      <Trash2 size={15} className="text-error" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCartQuantity(c.cartId, c.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <Minus size={14} className="text-text-main" />
                      </button>
                      <span className="text-sm font-semibold text-text-main w-5 text-center">{c.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(c.cartId, c.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <Plus size={14} className="text-text-main" />
                      </button>
                    </div>
                    <span className="text-[15px] font-bold text-primary">
                      £{(unitPrice * c.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-5">
            <label className="text-sm font-semibold text-text-main mb-2 block">Table Number</label>
            <div className="relative">
              <select
                value={tableNum}
                onChange={e => setTableNum(Number(e.target.value))}
                className="w-full py-3 px-4 rounded-xl border border-border bg-card text-sm text-text-main appearance-none"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Table {n}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            </div>
          </div>

          <div className="bg-card rounded-[18px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-5">
            <div className="flex justify-between mb-2">
              <span className="text-[13px] text-text-secondary">Subtotal</span>
              <span className="text-[13px] text-text-main">£{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[13px] text-text-secondary">Service charge</span>
              <span className="text-[13px] text-text-main">£0.00</span>
            </div>
            <div className="h-px bg-border my-3" />
            <div className="flex justify-between">
              <span className="text-base font-bold text-text-main">Total</span>
              <span className="text-base font-bold text-primary">£{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleOrder}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-semibold text-[15px] shadow-lg active:scale-[0.98] transition-transform"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
