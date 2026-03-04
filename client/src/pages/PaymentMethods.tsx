import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react';

const CARD_LABELS: Record<string, string> = { visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', apple_pay: 'Apple Pay' };

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPayment } = useData();
  const [sheetOpen, setSheetOpen] = useState(false);
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
    setSheetOpen(false);
    setCardNumber(''); setCardExpiry(''); setCardName('');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 max-w-[480px] mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Payment Methods</h1>
        </div>
      </div>

      <div className="flex-1 max-w-[480px] mx-auto w-full overflow-y-auto p-5" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex flex-col gap-2.5 mb-5">
          {paymentMethods.map((pm, idx) => (
            <Card
              key={pm.id}
              className={cn(
                "animate-fade-in-up",
                pm.isDefault && "ring-2 ring-primary",
                idx === 0 && "stagger-1",
                idx === 1 && "stagger-2",
                idx === 2 && "stagger-3"
              )}
            >
              <div className="flex justify-between items-center p-4">
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
                    <Badge variant="default">Default</Badge>
                  ) : (
                    <button
                      onClick={() => setDefaultPayment(pm.id)}
                      className="text-[11px] font-semibold text-text-secondary bg-surface border border-border px-2.5 py-1 rounded-full transition-colors hover:bg-border"
                    >
                      Set Default
                    </button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removePaymentMethod(pm.id)}>
                    <Trash2 size={16} className="text-error" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Plus size={18} /> Add Payment Method
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="p-5 pb-8">
              <h2 className="text-lg font-bold text-text-main mb-5">Add Card</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Card Type</label>
                  <Card className="overflow-hidden">
                    <select
                      value={cardType}
                      onChange={e => setCardType(e.target.value as any)}
                      className="w-full px-4 py-3 text-sm bg-transparent text-text-main border-none outline-none"
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">Amex</option>
                    </select>
                  </Card>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Card Number</label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Expiry Date</label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-text-main mb-1.5 block">Cardholder Name</label>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                  />
                </div>
                <Button onClick={handleAdd} className="w-full mt-1">
                  Add Card
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
