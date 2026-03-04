import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import { Gift, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';

export default function Rewards() {
  const { rewards, claimReward } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(rewards.length - 1, i + 1));

  if (rewards.length === 0) {
    return (
      <div className="page">
        <div style={{ padding: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>My Rewards</h1>
        </div>
        <div className="empty-state">
          <Gift size={48} />
          <p>No rewards available yet. Keep dining to earn rewards!</p>
        </div>
      </div>
    );
  }

  const reward = rewards[currentIndex];
  const typeColors = { discount: '#E67E22', offer: '#9B59B6', credit: '#1DB264' };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ padding: '24px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>My Rewards</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {rewards.filter(r => !r.claimed).length} rewards available
        </p>
      </div>

      <div style={{ position: 'relative', padding: '0 20px' }}>
        <div style={{
          background: `linear-gradient(135deg, var(--primary-dark), var(--primary))`,
          borderRadius: 20, padding: 24, color: '#fff', minHeight: 320,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                background: typeColors[reward.type], textTransform: 'uppercase',
              }}>{reward.type}</span>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{reward.value}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{reward.title}</h2>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>{reward.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: 0.7 }}>
              <Clock size={14} /> Expires {new Date(reward.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
            {reward.claimed ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.2)', borderRadius: 12,
                padding: '10px 20px', fontSize: 14, fontWeight: 600,
              }}>
                <Check size={18} /> Claimed
              </div>
            ) : (
              <>
                <div style={{
                  background: '#fff', borderRadius: 12, padding: 12, marginBottom: 12,
                }}>
                  <QRCodeSVG value={reward.code} size={100} />
                </div>
                <p style={{ fontSize: 12, letterSpacing: 2, fontWeight: 600, opacity: 0.8 }}>{reward.code}</p>
                <button onClick={() => claimReward(reward.id)} style={{
                  marginTop: 12, padding: '10px 32px', borderRadius: 10,
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}>
                  Claim Reward
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, padding: '0 8px',
        }}>
          <button onClick={prev} disabled={currentIndex === 0} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
            padding: 8, cursor: 'pointer', opacity: currentIndex === 0 ? 0.3 : 1,
          }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {rewards.map((_, i) => (
              <div key={i} style={{
                width: i === currentIndex ? 20 : 6, height: 6, borderRadius: 3,
                background: i === currentIndex ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
          <button onClick={next} disabled={currentIndex === rewards.length - 1} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
            padding: 8, cursor: 'pointer', opacity: currentIndex === rewards.length - 1 ? 0.3 : 1,
          }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
