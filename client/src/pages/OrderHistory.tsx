import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, ClipboardList, FileText } from 'lucide-react';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { orders } = useData();

  function downloadReceipt(order: typeof orders[0]) {
    const html = `
      <html><head><style>
        body { font-family: 'Poppins', sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
        h1 { color: #8B1A2B; font-size: 20px; }
        .item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; margin-top: 12px; }
      </style></head><body>
        <h1>Tap Yard</h1>
        <p>Receipt</p>
        <p>Date: ${new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p>Table: ${order.tableNumber}</p>
        <hr />
        ${order.items.map(i => `<div class="item"><span>${i.quantity}x ${i.name}${i.options ? ' (' + i.options.join(', ') + ')' : ''}</span><span>£${i.price.toFixed(2)}</span></div>`).join('')}
        <div class="total">Total: £${order.total.toFixed(2)}</div>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">Thank you for dining with us!</p>
      </body></html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${order.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusColors: Record<string, string> = {
    completed: 'var(--success)', preparing: 'var(--warning)', delivered: '#3498DB', cancelled: 'var(--error)',
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={22} /></button>
        <h1>Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={48} />
          <p>No orders yet</p>
        </div>
      ) : (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => (
            <div key={order.id} style={{
              background: 'var(--card)', borderRadius: 14, padding: 16,
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>
                    {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Table {order.tableNumber}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: statusColors[order.status],
                  background: statusColors[order.status] + '15', padding: '3px 10px', borderRadius: 10,
                  textTransform: 'capitalize',
                }}>{order.status}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.name}</span>
                    <span>£{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>£{order.total.toFixed(2)}</span>
                <button onClick={() => downloadReceipt(order)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                  color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  <FileText size={14} /> Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
