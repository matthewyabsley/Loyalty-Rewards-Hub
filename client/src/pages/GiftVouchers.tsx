import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeft, Gift, Mail, Smartphone, Wallet, Check } from 'lucide-react';

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
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-5 animate-scale-in">
          <Check size={36} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-2 animate-fade-in-up">Voucher Purchased!</h2>
        <p className="text-sm text-text-secondary mb-8 animate-fade-in-up stagger-1">
          £{selectedAmount} gift voucher has been {delivery === 'wallet' ? 'added to wallet' : 'sent successfully'}
        </p>
        <Button className="w-full max-w-[280px] animate-fade-in-up stagger-2" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-[480px] mx-auto w-full">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Gift Vouchers</h1>
        </div>
      </div>

      <div className="p-5 pb-28">
        <h2 className="text-base font-semibold text-text-main mb-3 animate-fade-in-up">Choose Amount</h2>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {DENOMINATIONS.map((amt, index) => (
            <Card
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={cn(
                "py-4 px-2 text-center cursor-pointer transition-all duration-200 active:scale-[0.97] animate-fade-in-up",
                selectedAmount === amt
                  ? 'ring-2 ring-primary bg-primary/5 border-primary/30'
                  : 'hover:border-border',
                index < 3 ? "stagger-1" : "stagger-2"
              )}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Gift size={14} className={selectedAmount === amt ? 'text-primary' : 'text-text-muted'} />
                <span className={cn("text-[11px] font-semibold", selectedAmount === amt ? 'text-primary' : 'text-text-muted')}>
                  Tap Yard
                </span>
              </div>
              <p className={cn("text-[22px] font-bold", selectedAmount === amt ? 'text-primary' : 'text-text-main')}>£{amt}</p>
            </Card>
          ))}
        </div>

        <h2 className="text-base font-semibold text-text-main mb-3 animate-fade-in-up stagger-3">Delivery Method</h2>
        <div className="flex flex-col gap-2 mb-6 animate-fade-in-up stagger-3">
          {DELIVERY_OPTIONS.map(opt => (
            <Card
              key={opt.id}
              onClick={() => setDelivery(opt.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200",
                delivery === opt.id
                  ? 'ring-2 ring-primary bg-primary/5 border-primary/30'
                  : ''
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                delivery === opt.id ? 'bg-primary/10' : 'bg-surface'
              )}>
                <opt.icon
                  size={18}
                  className={delivery === opt.id ? 'text-primary' : 'text-text-muted'}
                />
              </div>
              <span className={cn("text-sm", delivery === opt.id ? 'font-semibold text-text-main' : 'text-text-main')}>
                {opt.label}
              </span>
              <div className={cn(
                "ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center",
                delivery === opt.id ? 'border-primary' : 'border-border'
              )}>
                {delivery === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
            </Card>
          ))}
        </div>

        {delivery !== 'wallet' && (
          <div className="mb-6 animate-fade-in-up stagger-4">
            <h2 className="text-base font-semibold text-text-main mb-3">Recipient Details</h2>
            <div className="flex flex-col gap-2.5">
              <Input
                type="text"
                placeholder="Recipient Name"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
              <Input
                type={delivery === 'email' ? 'email' : 'tel'}
                placeholder={delivery === 'email' ? 'Email Address' : 'Phone Number'}
                value={recipientContact}
                onChange={e => setRecipientContact(e.target.value)}
              />
              <textarea
                placeholder="Personal message (optional)"
                value={personalMessage}
                onChange={e => setPersonalMessage(e.target.value)}
                className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text-main placeholder:text-text-muted transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[80px] resize-y"
              />
            </div>
          </div>
        )}

        <label className="flex items-center gap-2.5 mb-5 cursor-pointer animate-fade-in-up stagger-5">
          <div className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
            agreed ? 'bg-primary border-primary' : 'border-border'
          )}>
            {agreed && <Check size={12} className="text-white" />}
          </div>
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="hidden"
          />
          <span className="text-[13px] text-text-secondary">
            I agree to the gift voucher terms & conditions
          </span>
        </label>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-white/20 shadow-xl">
        <div className="max-w-[480px] mx-auto p-5">
          <Button
            className="w-full"
            onClick={() => setShowConfirm(true)}
            disabled={!selectedAmount || !agreed}
          >
            Purchase · £{selectedAmount || 0}
          </Button>
        </div>
      </div>

      <Sheet open={showConfirm} onOpenChange={setShowConfirm}>
        <SheetContent>
          <div className="p-5 pt-6">
            <h2 className="text-lg font-bold text-text-main mb-5">Confirm Purchase</h2>

            <Card
              className="p-5 text-center mb-5 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #6B1420, #8B1A2B)' }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Gift size={16} className="text-white" />
                <span className="text-xs font-semibold text-white">Tap Yard</span>
              </div>
              <p className="text-[32px] font-bold text-white">£{selectedAmount}</p>
              <p className="text-xs text-white/60 tracking-wider uppercase">Gift Voucher</p>
            </Card>

            <Card className="p-4 mb-5">
              <div className="text-[13px] text-text-secondary space-y-2">
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-medium text-text-main">{DELIVERY_OPTIONS.find(o => o.id === delivery)?.label}</span>
                </div>
                {defaultPayment && (
                  <div className="flex justify-between">
                    <span>Payment</span>
                    <span className="font-medium text-text-main">{defaultPayment.type.toUpperCase()} •••• {defaultPayment.last4}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-bold text-primary text-base">£{selectedAmount}</span>
                </div>
              </div>
            </Card>

            <Button className="w-full" onClick={handlePurchase}>
              Confirm & Pay £{selectedAmount}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
