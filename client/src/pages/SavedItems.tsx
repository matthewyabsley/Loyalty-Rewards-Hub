import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';

export default function SavedItems() {
  const navigate = useNavigate();
  const { savedItems, menu, toggleSavedItem } = useData();

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Saved Items</h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="empty-state">
          <Bookmark size={48} />
          <p>No saved items yet</p>
          <button onClick={() => navigate('/menu')} className="btn-primary" style={{ maxWidth: 200, marginTop: 16 }}>Browse Menu</button>
        </div>
      ) : (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {savedItems.map(item => {
            const menuItem = menu.find(m => m.id === item.menuItemId);
            return (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--card)', borderRadius: 14, padding: 14,
                border: '1px solid var(--border)',
              }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.category} · £{item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => menuItem && toggleSavedItem(menuItem)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                }}>
                  <Trash2 size={18} color="var(--error)" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
