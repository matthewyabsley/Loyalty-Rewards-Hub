import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, X, Bookmark, UtensilsCrossed, Coffee, Wine, IceCream } from 'lucide-react';
import type { MenuItem } from '../contexts/DataContext';

const categoryIcons: Record<string, React.ReactNode> = {
  Mains: <UtensilsCrossed size={22} className="text-white" />,
  Starters: <Star size={22} className="text-white" />,
  Desserts: <IceCream size={22} className="text-white" />,
  Drinks: <Coffee size={22} className="text-white" />,
};

const categoryColors: Record<string, string> = {
  Mains: 'bg-primary',
  Starters: 'bg-accent',
  Desserts: 'bg-pink-400',
  Drinks: 'bg-teal-500',
};

export default function Menu() {
  const navigate = useNavigate();
  const { menu, cart, addToCart, savedItems, toggleSavedItem } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { name: string; price: number }>>({});
  const [itemNotes, setItemNotes] = useState('');

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];
  const filtered = activeCategory === 'All' ? menu : menu.filter(m => m.category === activeCategory);

  function openItem(item: MenuItem) {
    setSelectedItem(item);
    setSelectedOptions({});
    setItemNotes('');
  }

  function handleAddToCart() {
    if (!selectedItem) return;
    const missingRequired = selectedItem.options?.filter(o => o.required && !selectedOptions[o.id]);
    if (missingRequired && missingRequired.length > 0) {
      alert('Please select all required options');
      return;
    }
    addToCart(selectedItem, Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined, itemNotes || undefined);
    setSelectedItem(null);
  }

  const itemPrice = selectedItem
    ? selectedItem.price + Object.values(selectedOptions).reduce((s, o) => s + o.price, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm px-5 pt-[67px] pb-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-card shadow-sm"
        >
          <ArrowLeft size={20} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Menu</h1>
        <button
          onClick={() => navigate('/cart')}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary shadow-sm"
        >
          <ShoppingCart size={18} className="text-white" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="px-5 pt-2 pb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md'
                : 'bg-card text-text-main border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-3">
        {filtered.map(item => {
          const isSaved = savedItems.some(s => s.menuItemId === item.id);
          return (
            <div
              key={item.id}
              onClick={() => openItem(item)}
              className="bg-card rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex gap-3">
                <div className={`w-16 h-16 rounded-xl ${categoryColors[item.category] || 'bg-primary'} flex items-center justify-center shrink-0`}>
                  {categoryIcons[item.category] || <UtensilsCrossed size={22} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-text-main truncate">{item.name}</h3>
                    {item.popular && (
                      <span className="text-[10px] font-semibold text-accent-dark bg-accent/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">£{item.price.toFixed(2)}</span>
                    <button
                      onClick={e => { e.stopPropagation(); toggleSavedItem(item); }}
                      className="p-1"
                    >
                      <Bookmark
                        size={16}
                        className={isSaved ? 'text-accent fill-accent' : 'text-text-secondary'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-card w-full max-w-[480px] rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-main">{selectedItem.name}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center"
              >
                <X size={18} className="text-text-secondary" />
              </button>
            </div>

            <p className="text-[13px] text-text-secondary mb-5">{selectedItem.description}</p>

            {selectedItem.options?.map(opt => (
              <div key={opt.id} className="mb-5">
                <p className="text-[13px] font-semibold text-text-main mb-2">
                  {opt.label}
                  {opt.required && <span className="text-error ml-1">*</span>}
                </p>
                <div className="flex flex-col gap-2">
                  {opt.choices.map(choice => {
                    const isSelected = selectedOptions[opt.id]?.name === choice.name;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.id]: { name: choice.name, price: choice.price } }))}
                        className={`flex justify-between items-center px-4 py-3 rounded-xl text-[13px] transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-surface border border-border'
                        }`}
                      >
                        <span className={isSelected ? 'font-semibold text-text-main' : 'text-text-main'}>{choice.name}</span>
                        {choice.price > 0 && (
                          <span className="text-text-secondary">+£{choice.price.toFixed(2)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mb-6">
              <p className="text-[13px] font-semibold text-text-main mb-2">Notes</p>
              <textarea
                value={itemNotes}
                onChange={e => setItemNotes(e.target.value)}
                placeholder="Any special requests..."
                className="w-full p-3 rounded-xl border border-border bg-surface text-[13px] text-text-main min-h-[60px] resize-y placeholder:text-text-secondary/60"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-dark to-primary text-white font-semibold text-[15px] shadow-lg active:scale-[0.98] transition-transform"
            >
              Add to Cart · £{itemPrice.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
