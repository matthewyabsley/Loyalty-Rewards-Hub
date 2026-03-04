import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Shield, TrendingUp, TrendingDown, Award, Calendar, Star, Gift } from 'lucide-react';

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

      <div className="px-5 mb-5">
        <div
          className="rounded-[22px] p-[22px]"
          style={{ background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)' }}
        >
          <div className="flex flex-col items-center mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${tier.color}20` }}
            >
              <Shield size={28} color={tier.color} />
            </div>
            <span
              className="text-sm font-semibold tracking-wide mb-1"
              style={{ color: tier.color }}
            >
              {tier.name} Member
            </span>
            <p className="text-[38px] font-bold text-white leading-none">{points}</p>
            <p className="text-[11px] tracking-[1.5px] text-white/45 mt-1 uppercase">total points</p>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>{tier.name}</span>
              <span>
                {nextTier
                  ? `${tier.max - points + 1} pts to ${nextTier.name}`
                  : 'Max tier reached'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: nextTier
                    ? `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`
                    : tier.color,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-1.5">
              <span>{tier.min} pts</span>
              <span>{tier.max} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-blue-500/10">
              <Calendar size={18} className="text-blue-500" />
            </div>
            <p className="text-xs text-text-secondary mb-0.5">This Month</p>
            <p className="text-xl font-bold text-text-main">{thisMonth}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-success/10">
              <Star size={18} className="text-success" />
            </div>
            <p className="text-xs text-text-secondary mb-0.5">Lifetime</p>
            <p className="text-xl font-bold text-text-main">{lifetime}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-error/10">
              <Gift size={18} className="text-error" />
            </div>
            <p className="text-xs text-text-secondary mb-0.5">Redeemed</p>
            <p className="text-xl font-bold text-text-main">{redeemed}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-5">
        <h2 className="text-base font-semibold text-text-main mb-3">Transaction History</h2>
        <div className="bg-card rounded-[18px] border border-border overflow-hidden">
          {transactions.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">No transactions yet</p>
          ) : (
            transactions.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < transactions.length - 1 ? 'border-b border-border' : ''
                }`}
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
                  className={`text-[15px] font-semibold ${
                    tx.type === 'earned' ? 'text-success' : 'text-error'
                  }`}
                >
                  {tx.type === 'earned' ? '+' : ''}
                  {tx.points}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <h2 className="text-base font-semibold text-text-main mb-3">Tier Levels</h2>
        <div className="bg-card rounded-[18px] border border-border overflow-hidden">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i < TIERS.length - 1 ? 'border-b border-border' : ''
              } ${t.name === tier.name ? 'bg-surface' : ''}`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-main">{t.name}</p>
                <p className="text-[11px] text-text-secondary">
                  {t.name === 'Platinum'
                    ? `${t.min.toLocaleString()}+ points`
                    : `${t.min.toLocaleString()} - ${t.max.toLocaleString()} points`}
                </p>
              </div>
              {t.name === tier.name && (
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
