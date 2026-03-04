import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import { Gift, Clock, Check } from 'lucide-react';

const typeGradients: Record<string, string> = {
  discount: 'linear-gradient(135deg, #E8735A, #D45A42)',
  credit: 'linear-gradient(135deg, #22C970, #1DB264)',
  offer: 'linear-gradient(135deg, #E8C778, #D4A853)',
};

const typeColors: Record<string, string> = {
  discount: '#D45A42',
  credit: '#1DB264',
  offer: '#D4A853',
};

export default function Rewards() {
  const { rewards, claimReward } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = el.scrollWidth / rewards.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(idx, rewards.length - 1));
  };

  if (rewards.length === 0) {
    return (
      <div className="pb-5">
        <div className="px-5 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-text-main">Rewards</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-secondary">
          <Gift size={48} strokeWidth={1.5} />
          <p className="text-sm text-center px-8">No rewards available yet. Keep dining to earn rewards!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-5">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-text-main">Rewards</h1>
        <p className="text-sm text-text-secondary mt-1">
          {activeRewards.length} reward{activeRewards.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-7 pb-4 hide-scrollbar"
        style={{ scrollPaddingLeft: 28 }}
      >
        {rewards.filter(r => !r.claimed).map((reward) => (
          <div
            key={reward.id}
            className="snap-center shrink-0 rounded-3xl shadow-lg bg-card overflow-hidden"
            style={{ width: 'calc(100% - 56px)', minWidth: 'calc(100% - 56px)' }}
          >
            <div
              className="p-5 pb-6 text-white relative"
              style={{ background: typeGradients[reward.type] || typeGradients.discount }}
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className="text-[11px] font-semibold uppercase px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                >
                  {reward.type}
                </span>
                <span className="text-[26px] font-bold leading-none">{reward.value}</span>
              </div>
              <h2 className="text-[17px] font-bold mb-1">{reward.title}</h2>
              <p className="text-[13px] opacity-80">{reward.description}</p>
            </div>

            <div className="p-5 flex flex-col items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
                <QRCodeSVG value={reward.code} size={100} />
              </div>
              <p className="text-[11px] tracking-[2px] font-semibold text-text-secondary mb-2">
                {reward.code}
              </p>
              <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-4">
                <Clock size={13} />
                <span>
                  Expires{' '}
                  {new Date(reward.expiryDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <button
                onClick={() => claimReward(reward.id)}
                className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-transform active:scale-[0.97]"
                style={{ background: '#1A1A1A' }}
              >
                Claim Reward
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeRewards.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2 mb-4">
          {activeRewards.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-200"
              style={{
                width: i === activeIndex ? 28 : 8,
                background: i === activeIndex ? '#8B1A2B' : '#E5E2DC',
              }}
            />
          ))}
        </div>
      )}

      {claimedRewards.length > 0 && (
        <div className="px-5 mt-4">
          <h2 className="text-[15px] font-semibold text-text-secondary mb-3">Claimed Rewards</h2>
          <div className="flex flex-col gap-3">
            {claimedRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-card rounded-2xl p-4 flex items-center gap-3.5 shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${typeColors[reward.type]}15` }}
                >
                  <Check size={18} style={{ color: typeColors[reward.type] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-text-main truncate">{reward.title}</p>
                  <p className="text-[12px] text-text-secondary">
                    {reward.value} &middot; Claimed
                  </p>
                </div>
                <span
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    background: `${typeColors[reward.type]}12`,
                    color: typeColors[reward.type],
                  }}
                >
                  {reward.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
