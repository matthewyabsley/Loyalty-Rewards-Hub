import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, X, Bookmark } from 'lucide-react';
import type { MenuItem } from '../contexts/DataContext';

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
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Menu</h1>
        {cart.length > 0 && (
          <button onClick={() => navigate('/cart')} style={{
            position: 'relative', background: 'var(--primary)', border: 'none',
            borderRadius: 10, padding: '6px 12px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
          }}>
            <ShoppingCart size={16} /> {cart.length}
          </button>
        )}
      </div>

      <div style={{ padding: '12px 20px 0', overflowX: 'auto', display: 'flex', gap: 8 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
            background: activeCategory === cat ? 'var(--primary)' : 'var(--card)',
            color: activeCategory === cat ? '#fff' : 'var(--text)',
            border: activeCategory === cat ? 'none' : '1px solid var(--border)', cursor: 'pointer',
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => {
          const isSaved = savedItems.some(s => s.menuItemId === item.id);
          return (
            <div key={item.id} style={{
              background: 'var(--card)', borderRadius: 16, padding: 16,
              border: '1px solid var(--border)', cursor: 'pointer',
            }} onClick={() => openItem(item)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</h3>
                    {item.popular && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: 'var(--accent-dark)',
                        background: '#D4A85315', padding: '2px 8px', borderRadius: 10,
                      }}>Popular</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{item.description}</p>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>£{item.price.toFixed(2)}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleSavedItem(item); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                }}>
                  <Bookmark size={18} color={isSaved ? 'var(--accent)' : 'var(--text-secondary)'} fill={isSaved ? 'var(--accent)' : 'none'} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{selectedItem.name}</h2>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{selectedItem.description}</p>

            {selectedItem.options?.map(opt => (
              <div key={opt.id} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  {opt.label} {opt.required && <span style={{ color: 'var(--error)' }}>*</span>}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {opt.choices.map(choice => {
                    const isSelected = selectedOptions[opt.id]?.name === choice.name;
                    return (
                      <button key={choice.id} onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.id]: { name: choice.name, price: choice.price } }))} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 14px', borderRadius: 10, fontSize: 13,
                        background: isSelected ? 'var(--primary)' + '10' : 'var(--surface)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        cursor: 'pointer',
                      }}>
                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{choice.name}</span>
                        {choice.price > 0 && <span style={{ color: 'var(--text-secondary)' }}>+£{choice.price.toFixed(2)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Notes</p>
              <textarea
                value={itemNotes} onChange={e => setItemNotes(e.target.value)}
                placeholder="Any special requests..."
                style={{
                  width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--border)',
                  fontSize: 13, minHeight: 60, resize: 'vertical', background: 'var(--surface)',
                }}
              />
            </div>

            <button onClick={handleAddToCart} className="btn-primary">
              Add to Cart · £{itemPrice.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
