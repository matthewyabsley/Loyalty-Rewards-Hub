import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';

export default function SavedItems() {
  const navigate = useNavigate();
  const { savedItems, menu, toggleSavedItem } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
          <ArrowLeft size={22} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Saved Items</h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-text-secondary">
          <Bookmark size={48} />
          <p className="text-sm">No saved items yet</p>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 max-w-[200px] w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold transition-transform active:scale-[0.97]"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 p-5">
          {savedItems.map(item => {
            const menuItem = menu.find(m => m.id === item.menuItemId);
            return (
              <div key={item.id} className="flex justify-between items-center bg-card rounded-[14px] p-3.5 border border-border">
                <div>
                  <h3 className="text-sm font-semibold text-text-main mb-0.5">{item.name}</h3>
                  <p className="text-xs text-text-secondary">{item.category} · £{item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => menuItem && toggleSavedItem(menuItem)}
                  className="p-1.5 bg-transparent"
                >
                  <Trash2 size={18} className="text-error" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
