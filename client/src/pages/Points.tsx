import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Star, TrendingUp, TrendingDown, Award } from 'lucide-react';

const TIERS = [
  { name: 'Bronze', min: 0, max: 200, color: '#CD7F32' },
  { name: 'Silver', min: 200, max: 500, color: '#C0C0C0' },
  { name: 'Gold', min: 500, max: 1000, color: '#FFD700' },
  { name: 'Platinum', min: 1000, max: 2000, color: '#E5E4E2' },
];

export default function Points() {
  const { user } = useAuth();
  const { transactions } = useData();
  const points = user?.points || 0;
  const tier = TIERS.find(t => t.name === user?.tier) || TIERS[0];
  const progress = Math.min(((points - tier.min) / (tier.max - tier.min)) * 100, 100);

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        padding: '24px 20px 32px', color: '#fff',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Points & Tier</h1>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.15)', borderRadius: 24,
            padding: '6px 16px', marginBottom: 12,
          }}>
            <Award size={18} color={tier.color} />
            <span style={{ fontWeight: 600 }}>{tier.name} Member</span>
          </div>
          <p style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{points}</p>
          <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>total points</p>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
            <span>{tier.name}</span>
            <span>{tier.max - points} pts to {TIERS[TIERS.indexOf(tier) + 1]?.name || 'max'}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: 8,
              background: `linear-gradient(90deg, var(--accent), var(--accent-light))`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24,
        }}>
          <div style={{
            background: 'var(--card)', borderRadius: 16, padding: 16,
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TrendingUp size={18} color="var(--success)" />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Earned</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700 }}>
              {transactions.filter(t => t.type === 'earned').reduce((s, t) => s + t.points, 0)}
            </p>
          </div>
          <div style={{
            background: 'var(--card)', borderRadius: 16, padding: 16,
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TrendingDown size={18} color="var(--error)" />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Spent</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700 }}>
              {Math.abs(transactions.filter(t => t.type === 'spent').reduce((s, t) => s + t.points, 0))}
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Transaction History</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transactions.map(tx => (
            <div key={tx.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--card)', borderRadius: 12, padding: '12px 16px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: tx.type === 'earned' ? '#1DB26415' : '#E03E3E15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {tx.type === 'earned' ? <TrendingUp size={18} color="var(--success)" /> : <TrendingDown size={18} color="var(--error)" />}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{tx.description}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              <span style={{
                fontSize: 15, fontWeight: 600,
                color: tx.type === 'earned' ? 'var(--success)' : 'var(--error)',
              }}>
                {tx.type === 'earned' ? '+' : ''}{tx.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
