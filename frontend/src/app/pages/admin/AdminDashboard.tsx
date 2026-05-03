import { Camera, CheckCircle2, EyeOff, Package, ShoppingBag, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminRequest } from '../../services/adminApi';
import type { AdminSummary } from '../../types';

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Package }) {
  return (
    <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
      <Icon className="mb-4 h-5 w-5 text-[var(--wedding-gold)]" />
      <p className="text-sm text-[var(--wedding-text-light)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--wedding-text)]">{value}</p>
    </div>
  );
}

export function AdminDashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    adminRequest<AdminSummary>(token, '/api/admin/summary')
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard'));
  }, [token]);

  if (error) {
    return <p className="text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Painel central</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Dashboard administrativo</h1>
        <p className="mt-2 text-[var(--wedding-text-light)]">
          Visão geral dos presentes, pedidos e fotos enviadas pelos convidados.
        </p>
      </div>

      {!summary ? (
        <p className="text-[var(--wedding-text-light)]">Carregando resumo...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Produtos ativos" value={summary.activeProducts} icon={Package} />
            <StatCard label="Pedidos" value={summary.totalOrders} icon={ShoppingBag} />
            <StatCard label="Fotos enviadas" value={summary.totalPhotos} icon={Camera} />
            <StatCard label="Fotos ocultadas" value={summary.hiddenPhotos} icon={EyeOff} />
            <StatCard label="Convidados no RSVP" value={summary.totalGuests} icon={Users} />
            <StatCard label="Presenças confirmadas" value={summary.confirmedGuests} icon={CheckCircle2} />
            <StatCard label="Não confirmados" value={summary.notConfirmedGuests} icon={XCircle} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Últimas fotos recebidas</h2>
              <div className="grid grid-cols-3 gap-3">
                {summary.latestPhotos.map((photo) => (
                  <img
                    key={photo._id}
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.guestName}
                    className="aspect-square rounded-lg object-cover"
                  />
                ))}
              </div>
              {summary.latestPhotos.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhuma foto enviada ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Últimos convidados</h2>
              <div className="space-y-4">
                {summary.latestGuests.map((guest) => (
                  <div key={guest._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{guest.name}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {guest.email || 'Sem email'} · {guest.status === 'confirmed' ? 'Confirmado' : 'Não confirmado'}
                    </p>
                  </div>
                ))}
              </div>
              {summary.latestGuests.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhuma confirmação recebida ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Últimos pedidos</h2>
              <div className="space-y-4">
                {summary.latestOrders.map((order) => (
                  <div key={order.id || (order as any)._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{order.customerName}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {order.customerEmail} · R$ {Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              {summary.latestOrders.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhum pedido registrado ainda.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
