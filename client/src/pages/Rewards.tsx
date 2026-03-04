import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import { Gift, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    const children = el.children;
    if (children.length === 0) return;
    const cardWidth = (children[0] as HTMLElement).offsetWidth + 16;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(idx, 0), activeRewards.length - 1));
  };

  if (rewards.length === 0) {
    return (
      <div className="pb-5">
        <div className="px-5 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-text-main">Rewards</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-secondary animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center">
            <Gift size={32} strokeWidth={1.5} className="text-text-muted" />
          </div>
          <p className="text-sm text-center px-8">No rewards available yet. Keep dining to earn rewards!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-5">
      <div className="px-5 pt-6 pb-4 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-text-main">Rewards</h1>
        <p className="text-sm text-text-secondary mt-1">
          {activeRewards.length} active reward{activeRewards.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 hide-scrollbar animate-fade-in-up stagger-1"
        style={{ scrollPaddingLeft: 24 }}
      >
        {activeRewards.map((reward) => (
          <Card
            key={reward.id}
            className="snap-center shrink-0 overflow-hidden border-0 shadow-lg"
            style={{ width: 'calc(100% - 48px)', minWidth: 'calc(100% - 48px)' }}
          >
            <div
              className="p-6 text-white relative"
              style={{ background: typeGradients[reward.type] || typeGradients.discount }}
            >
              <Badge
                className="mb-3 bg-white/20 border-0 text-white text-[11px]"
              >
                {reward.type}
              </Badge>
              <div className="text-3xl font-bold mb-1">{reward.value}</div>
              <h2 className="text-lg font-semibold mb-1">{reward.title}</h2>
              <p className="text-sm text-white/80">{reward.description}</p>
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="bg-surface rounded-2xl p-4 mb-3">
                <QRCodeSVG value={reward.code} size={110} />
              </div>
              <p className="text-[11px] tracking-[1.5px] text-text-muted font-semibold mb-2 uppercase">
                {reward.code}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
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
              <Button
                variant="dark"
                className="w-full"
                onClick={() => claimReward(reward.id)}
              >
                <Gift size={16} />
                Claim Reward
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {activeRewards.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2 mb-4">
          {activeRewards.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIndex ? "w-7 bg-primary" : "w-2 bg-border"
              )}
            />
          ))}
        </div>
      )}

      {claimedRewards.length > 0 && (
        <div className="px-5 mt-4 animate-fade-in-up stagger-2">
          <h2 className="text-[15px] font-semibold text-text-secondary mb-3">Claimed Rewards</h2>
          <div className="flex flex-col gap-3">
            {claimedRewards.map((reward) => (
              <Card
                key={reward.id}
                className="p-4 flex items-center gap-3.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${typeColors[reward.type]}15` }}
                >
                  <Check size={18} style={{ color: typeColors[reward.type] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-main truncate">{reward.title}</p>
                  <p className="text-xs text-text-secondary">
                    {reward.value} &middot; Claimed
                  </p>
                </div>
                <Badge
                  className="shrink-0 text-[11px]"
                  style={{
                    background: `${typeColors[reward.type]}12`,
                    color: typeColors[reward.type],
                    border: 'none',
                  }}
                >
                  {reward.type}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
