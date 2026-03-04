import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, ShoppingCart, Plus, Bookmark, UtensilsCrossed, Coffee, Wine, IceCream, Star, X } from 'lucide-react';
import type { MenuItem } from '../contexts/DataContext';

const categoryGradients: Record<string, string> = {
  Mains: 'from-[#8B1A2B] to-[#A82040]',
  Starters: 'from-[#D4A853] to-[#E8C778]',
  Desserts: 'from-[#EC4899] to-[#F472B6]',
  Drinks: 'from-[#14B8A6] to-[#2DD4BF]',
};

export default function Menu() {
  const navigate = useNavigate();
  const { menu, cart, addToCart, savedItems, toggleSavedItem } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { name: string; price: number }>>({});
  const [itemNotes, setItemNotes] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];
  const filtered = activeCategory === 'All' ? menu : menu.filter(m => m.category === activeCategory);

  function openItem(item: MenuItem) {
    setSelectedItem(item);
    setSelectedOptions({});
    setItemNotes('');
    setSheetOpen(true);
  }

  function handleAddToCart() {
    if (!selectedItem) return;
    const missingRequired = selectedItem.options?.filter(o => o.required && !selectedOptions[o.id]);
    if (missingRequired && missingRequired.length > 0) {
      alert('Please select all required options');
      return;
    }
    addToCart(selectedItem, Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined, itemNotes || undefined);
    setSheetOpen(false);
    setSelectedItem(null);
  }

  const itemPrice = selectedItem
    ? selectedItem.price + Object.values(selectedOptions).reduce((s, o) => s + o.price, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-20 glass border-b border-white/20 px-5 pt-[67px] pb-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-text-main">Menu</h1>
        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-accent text-white border-0">
              {cart.length}
            </Badge>
          )}
        </Button>
      </div>

      <div className="px-5 pt-4 pb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-all',
              activeCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-card border border-border text-text-main'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-3">
        {filtered.map((item, index) => {
          const isSaved = savedItems.some(s => s.menuItemId === item.id);
          const gradient = categoryGradients[item.category] || 'from-[#8B1A2B] to-[#A82040]';
          return (
            <Card
              key={item.id}
              onClick={() => openItem(item)}
              className={cn(
                'overflow-hidden cursor-pointer active:scale-[0.98] transition-transform animate-fade-in-up',
                index < 6 ? `stagger-${index + 1}` : ''
              )}
            >
              <div className="flex">
                <div className={cn('w-1 self-stretch bg-gradient-to-b', gradient)} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-[15px] font-semibold text-text-main truncate">{item.name}</h3>
                      {item.popular && (
                        <Badge variant="accent" className="text-[10px] px-2 py-0.5 shrink-0">Popular</Badge>
                      )}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); toggleSavedItem(item); }}
                      className="p-1 shrink-0"
                    >
                      <Bookmark
                        size={16}
                        className={isSaved ? 'text-accent fill-accent' : 'text-text-muted'}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">£{item.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={e => { e.stopPropagation(); openItem(item); }}
                    >
                      <Plus size={14} />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="rounded-t-3xl">
          {selectedItem && (
            <div className="p-6 pb-8 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-1 mt-2">
                <h2 className="text-xl font-bold text-text-main">{selectedItem.name}</h2>
                <span className="text-lg font-bold text-primary shrink-0 ml-3">£{selectedItem.price.toFixed(2)}</span>
              </div>

              <p className="text-[13px] text-text-secondary mb-6">{selectedItem.description}</p>

              {selectedItem.options?.map(opt => (
                <div key={opt.id} className="mb-5">
                  <p className="text-[13px] font-semibold text-text-main mb-2">
                    {opt.label}
                    {opt.required && <span className="text-error ml-1">*</span>}
                  </p>
                  <Card className="divide-y divide-border-light overflow-hidden">
                    {opt.choices.map(choice => {
                      const isSelected = selectedOptions[opt.id]?.name === choice.name;
                      return (
                        <button
                          key={choice.id}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.id]: { name: choice.name, price: choice.price } }))}
                          className={cn(
                            'flex justify-between items-center px-4 py-3 w-full text-[13px] transition-all text-left',
                            isSelected ? 'ring-2 ring-inset ring-primary bg-primary/5' : 'hover:bg-surface'
                          )}
                        >
                          <span className={isSelected ? 'font-semibold text-text-main' : 'text-text-main'}>{choice.name}</span>
                          {choice.price > 0 && (
                            <span className="text-text-secondary">+£{choice.price.toFixed(2)}</span>
                          )}
                        </button>
                      );
                    })}
                  </Card>
                </div>
              ))}

              <div className="mb-6">
                <p className="text-[13px] font-semibold text-text-main mb-2">Notes</p>
                <textarea
                  value={itemNotes}
                  onChange={e => setItemNotes(e.target.value)}
                  placeholder="Any special requests..."
                  className="w-full p-3 rounded-xl border border-border bg-surface text-[13px] text-text-main min-h-[60px] resize-y placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleAddToCart}
              >
                Add to Cart · £{itemPrice.toFixed(2)}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}