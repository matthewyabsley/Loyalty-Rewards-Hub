import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Card, DarkCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, TrendingDown, Calendar, Star, Gift, Diamond } from 'lucide-react';

const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: '#CD7F32' },
  { name: 'Silver', min: 500, max: 1999, color: '#A8A8A8' },
  { name: 'Gold', min: 2000, max: 4999, color: '#D4A853' },
  { name: 'Platinum', min: 5000, max: 99999, color: '#B0B0B8' },
];

export default function Points() {
  const { user } = useAuth();
  const { transactions } = useData();
  const points = user?.points || 0;
  const tierIndex = TIERS.findIndex(t => t.name === user?.tier) ?? 0;
  const tier = TIERS[tierIndex >= 0 ? tierIndex : 0];
  const nextTier = TIERS[tierIndex + 1];
  const progress = Math.min(((points - tier.min) / (tier.max - tier.min)) * 100, 100);

  const thisMonth = transactions
    .filter(t => t.type === 'earned' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.points, 0);
  const lifetime = transactions
    .filter(t => t.type === 'earned')
    .reduce((s, t) => s + t.points, 0);
  const redeemed = Math.abs(
    transactions
      .filter(t => t.type === 'spent')
      .reduce((s, t) => s + t.points, 0)
  );

  return (
    <div className="pb-6">
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-bold text-text-main">Points</h1>
      </div>

      <div className="px-5 mb-5 animate-fade-in-up">
        <DarkCard className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center"
              style={{ borderColor: tier.color, backgroundColor: `${tier.color}15` }}
            >
              <Diamond size={24} color={tier.color} />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{tier.name}</p>
              <p className="text-[11px] tracking-[1.5px] text-white/40 uppercase">Member</p>
            </div>
          </div>

          <div className="text-center mb-5">
            <p className="text-4xl font-bold text-white">{points.toLocaleString()}</p>
            <p className="text-[11px] tracking-[1.5px] text-white/40 mt-1 uppercase">total points</p>
          </div>

          <div className="mb-2">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: nextTier
                    ? `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`
                    : tier.color,
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-white/35">{tier.name}</span>
              <span className="text-[11px] text-accent font-semibold">
                {nextTier
                  ? `${tier.max - points + 1} pts to ${nextTier.name}`
                  : 'Max tier reached'}
              </span>
            </div>
          </div>
        </DarkCard>
      </div>

      <div className="px-5 mb-5 flex gap-3 animate-fade-in-up stagger-2">
        <Card className="flex-1 p-4 text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-blue-500/10">
            <Calendar size={18} className="text-blue-500" />
          </div>
          <p className="text-lg font-bold text-text-main">{thisMonth}</p>
          <p className="text-xs text-text-muted">This Month</p>
        </Card>
        <Card className="flex-1 p-4 text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-success/10">
            <Star size={18} className="text-success" />
          </div>
          <p className="text-lg font-bold text-text-main">{lifetime}</p>
          <p className="text-xs text-text-muted">Lifetime</p>
        </Card>
        <Card className="flex-1 p-4 text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-error/10">
            <Gift size={18} className="text-error" />
          </div>
          <p className="text-lg font-bold text-text-main">{redeemed}</p>
          <p className="text-xs text-text-muted">Redeemed</p>
        </Card>
      </div>

      <div className="px-5 mb-5 animate-fade-in-up stagger-3">
        <h2 className="text-base font-semibold text-text-main mb-3">Transaction History</h2>
        <Card className="divide-y divide-border overflow-hidden">
          {transactions.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">No transactions yet</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: tx.type === 'earned' ? '#1DB26415' : '#E03E3E15',
                    }}
                  >
                    {tx.type === 'earned' ? (
                      <TrendingUp size={18} className="text-success" />
                    ) : (
                      <TrendingDown size={18} className="text-error" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-main">{tx.description}</p>
                    <p className="text-[11px] text-text-secondary">
                      {new Date(tx.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[15px] font-semibold",
                    tx.type === 'earned' ? 'text-success' : 'text-error'
                  )}
                >
                  {tx.type === 'earned' ? '+' : ''}
                  {tx.points}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>

      <div className="px-5 pb-4 animate-fade-in-up stagger-4">
        <h2 className="text-base font-semibold text-text-main mb-3">Tier Levels</h2>
        <Card className="divide-y divide-border overflow-hidden">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5",
                t.name === tier.name && 'bg-surface'
              )}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-main">{t.name}</p>
                <p className="text-xs text-text-muted">
                  {t.name === 'Platinum'
                    ? `${t.min.toLocaleString()}+ points`
                    : `${t.min.toLocaleString()} - ${t.max.toLocaleString()} points`}
                </p>
              </div>
              {t.name === tier.name && (
                <Badge variant="default">Current</Badge>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
