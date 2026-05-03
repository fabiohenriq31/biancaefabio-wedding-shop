import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminRequest } from '../../services/adminApi';
import type { Order } from '../../types';

export function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    adminRequest<Order[]>(token, '/api/orders')
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos'))
      .finally(() => setLoading(false));
  }, [token]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return orders.filter((order: any) => {
      const id = String(order._id || order.id || '').toLowerCase();
      return (
        id.includes(query) ||
        String(order.customerName || '').toLowerCase().includes(query) ||
        String(order.customerEmail || '').toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Shopping</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Pedidos</h1>
      </div>

      <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-[var(--wedding-text-light)]" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou pedido..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>

      {loading && <p className="text-[var(--wedding-text-light)]">Carregando pedidos...</p>}
      {error && <p className="text-red-700">{error}</p>}

      <div className="space-y-4">
        {filteredOrders.map((order: any) => {
          const items = Array.isArray(order.items) ? order.items : [];
          return (
            <article key={order._id || order.id} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <p className="text-sm text-[var(--wedding-text-light)]">Pedido #{order._id || order.id}</p>
                  <h2 className="text-xl text-[var(--wedding-text)]">{order.customerName}</h2>
                  <p className="text-sm text-[var(--wedding-text-light)]">{order.customerEmail}</p>
                </div>
                <span className="h-fit rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-sm">
                  {order.paymentStatus === 'paid' ? 'Pago' : 'Aguardando'}
                </span>
              </div>

              <div className="my-5 space-y-2">
                {items.map((item: any, index: number) => (
                  <div key={`${item.productId}-${index}`} className="flex justify-between text-sm">
                    <span className="text-[var(--wedding-text-light)]">{item.quantity}x {item.productName}</span>
                    <span>R$ {Number((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-[var(--wedding-beige)] pt-4">
                <span className="text-[var(--wedding-text-light)]">Total</span>
                <strong>R$ {Number(order.totalAmount || 0).toFixed(2)}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
