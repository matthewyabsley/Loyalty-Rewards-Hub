import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';

export default function SavedItems() {
  const navigate = useNavigate();
  const { savedItems, menu, toggleSavedItem } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 max-w-[480px] mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Saved Items</h1>
        </div>
      </div>

      <div className="flex-1 max-w-[480px] mx-auto w-full overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] gap-3 text-text-secondary">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center">
              <Bookmark size={32} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium">No saved items yet</p>
            <p className="text-xs text-text-muted mb-2">Save your favourite dishes for quick access</p>
            <Button variant="outline" onClick={() => navigate('/menu')}>
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 p-5">
            {savedItems.map((item, idx) => {
              const menuItem = menu.find(m => m.id === item.menuItemId);
              return (
                <Card
                  key={item.id}
                  className={cn(
                    "animate-fade-in-up",
                    idx === 0 && "stagger-1",
                    idx === 1 && "stagger-2",
                    idx === 2 && "stagger-3",
                    idx === 3 && "stagger-4",
                    idx === 4 && "stagger-5",
                    idx === 5 && "stagger-6"
                  )}
                >
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-text-main mb-0.5">{item.name}</h3>
                      <p className="text-xs text-text-secondary">{item.category}</p>
                      <p className="text-sm font-bold text-primary mt-1">£{item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => menuItem && toggleSavedItem(menuItem)}
                    >
                      <Trash2 size={18} className="text-error" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
