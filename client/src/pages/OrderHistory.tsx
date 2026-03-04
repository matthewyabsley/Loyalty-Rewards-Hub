import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ClipboardList, Download } from 'lucide-react';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  completed: 'success',
  preparing: 'warning',
  delivered: 'default',
  cancelled: 'error',
};

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-30 glass border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3 px-5 pt-[67px] pb-3 max-w-[480px] mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-text-main">Order History</h1>
        </div>
      </div>

      <div className="flex-1 max-w-[480px] mx-auto w-full overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] gap-3 text-text-secondary">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center">
              <ClipboardList size={32} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs text-text-muted">Your order history will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-5">
            {orders.map((order, idx) => (
              <Card
                key={order.id}
                className={cn(
                  "overflow-hidden animate-fade-in-up",
                  idx === 0 && "stagger-1",
                  idx === 1 && "stagger-2",
                  idx === 2 && "stagger-3",
                  idx === 3 && "stagger-4",
                  idx === 4 && "stagger-5",
                  idx === 5 && "stagger-6"
                )}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm font-semibold text-text-main">
                        {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">Table {order.tableNumber}</p>
                    </div>
                    <Badge variant={STATUS_VARIANT[order.status] || 'default'} className="capitalize">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="mb-3 space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[13px]">
                        <span className="text-text-secondary">{item.quantity}x {item.name}</span>
                        <span className="text-text-main font-medium">£{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-border pt-3">
                    <span className="text-base font-bold text-text-main">£{order.total.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadReceipt(order)}
                      className="gap-1.5"
                    >
                      <Download size={14} />
                      Receipt
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
