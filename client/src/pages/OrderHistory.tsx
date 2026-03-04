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
    completed: '#1DB264',
    preparing: '#E8A830',
    delivered: '#3498DB',
    cancelled: '#E03E3E',
  };

  const statusBg: Record<string, string> = {
    completed: 'bg-success/15',
    preparing: 'bg-warning/15',
    delivered: 'bg-blue-500/15',
    cancelled: 'bg-error/15',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-[67px] pb-3">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-surface">
          <ArrowLeft size={22} className="text-text-main" />
        </button>
        <h1 className="text-xl font-bold text-text-main">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-text-secondary">
          <ClipboardList size={48} />
          <p className="text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-5">
          {orders.map(order => (
            <div key={order.id} className="bg-card rounded-[14px] p-4 border border-border">
              <div className="flex justify-between items-center mb-2.5">
                <div>
                  <p className="text-sm font-semibold text-text-main">
                    {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-text-secondary">Table {order.tableNumber}</p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-[10px] capitalize ${statusBg[order.status]}`}
                  style={{ color: statusColors[order.status] }}
                >
                  {order.status}
                </span>
              </div>
              <div className="mb-2.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-[3px] text-[13px]">
                    <span className="text-text-secondary">{item.quantity}x {item.name}</span>
                    <span className="text-text-main">£{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-border pt-2.5">
                <span className="text-base font-bold text-text-main">£{order.total.toFixed(2)}</span>
                <button
                  onClick={() => downloadReceipt(order)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-transparent"
                >
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
