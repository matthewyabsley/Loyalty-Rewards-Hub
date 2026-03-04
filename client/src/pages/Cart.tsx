import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-10 text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 animate-scale-in">
          <Check size={36} className="text-success" />
        </div>
        <h2 className="text-[22px] font-bold text-text-main mb-2">Order Placed!</h2>
        <p className="text-sm text-text-secondary mb-8">
          Your order is being prepared for Table {tableNum}
        </p>
        <Button className="w-full max-w-[280px]" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-20 glass border-b border-white/20 px-5 pt-[67px] pb-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-text-main">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-5 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4">
            <ShoppingCart size={32} className="text-text-muted" />
          </div>
          <p className="text-base text-text-secondary mb-6">Your cart is empty</p>
          <Button variant="outline" onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="px-5 pt-4">
          <div className="flex flex-col gap-3 mb-5">
            {cart.map((c, index) => {
              const optionsPrice = c.selectedOptions ? Object.values(c.selectedOptions).reduce((s, o) => s + o.price, 0) : 0;
              const unitPrice = c.item.price + optionsPrice;
              return (
                <Card
                  key={c.cartId}
                  className={cn('p-4 animate-fade-in-up', index < 6 ? `stagger-${index + 1}` : '')}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-main mb-1">{c.item.name}</h3>
                      {c.selectedOptions && (
                        <p className="text-[11px] text-text-secondary">
                          {Object.values(c.selectedOptions).map(o => o.name).join(', ')}
                        </p>
                      )}
                      {c.notes && (
                        <p className="text-[11px] text-text-muted italic mt-0.5">{c.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-error hover:bg-error/10"
                      onClick={() => removeFromCart(c.cartId)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(c.cartId, c.quantity - 1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="text-sm font-semibold text-text-main w-5 text-center">{c.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(c.cartId, c.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <span className="text-[15px] font-bold text-primary">
                      £{(unitPrice * c.quantity).toFixed(2)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mb-5">
            <label className="text-sm font-semibold text-text-main mb-2 block">Table Number</label>
            <Card className="relative overflow-hidden">
              <select
                value={tableNum}
                onChange={e => setTableNum(Number(e.target.value))}
                className="w-full py-3 px-4 bg-transparent text-sm text-text-main appearance-none cursor-pointer focus:outline-none"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Table {n}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </Card>
          </div>

          <Card className="p-5 mb-5">
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
              <span className="text-xl font-bold text-text-main">Total</span>
              <span className="text-xl font-bold text-primary">£{cartTotal.toFixed(2)}</span>
            </div>
          </Card>

          <Button className="w-full" onClick={handleOrder}>
            Place Order
          </Button>
        </div>
      )}
    </div>
  );
}