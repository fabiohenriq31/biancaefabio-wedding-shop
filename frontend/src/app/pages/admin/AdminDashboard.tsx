import {
  Baby,
  Camera,
  CheckCircle2,
  EyeOff,
  HandCoins,
  MessageSquareText,
  Package,
  PiggyBank,
  ShoppingBag,
  Ticket,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
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

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
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

  const latestFinancialEntries = summary?.latestFinancialEntries ?? [];
  const latestPhotos = summary?.latestPhotos ?? [];
  const latestSocialPosts = summary?.latestSocialPosts ?? [];
  const latestGuests = summary?.latestGuests ?? [];
  const latestSuppliers = summary?.latestSuppliers ?? [];
  const latestOrders = summary?.latestOrders ?? [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Painel central</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Dashboard administrativo</h1>
        <p className="mt-2 text-[var(--wedding-text-light)]">
          Visao geral dos presentes, pedidos, fotos e planejamento financeiro.
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
            <StatCard label="Posts no B&F Social" value={summary.totalSocialPosts} icon={MessageSquareText} />
            <StatCard label="Posts ocultos" value={summary.hiddenSocialPosts} icon={EyeOff} />
            <StatCard label="Convidados no RSVP" value={summary.totalGuests} icon={Users} />
            <StatCard label="Presencas confirmadas" value={summary.confirmedGuests} icon={CheckCircle2} />
            <StatCard label="Nao confirmados" value={summary.notConfirmedGuests} icon={XCircle} />
            <StatCard label="Criancas" value={summary.childGuests} icon={Baby} />
            <StatCard label="Pagantes" value={summary.payingGuests} icon={Ticket} />
            <StatCard label="Pagantes confirmados" value={summary.confirmedPayingGuests} icon={Ticket} />
            <StatCard label="Padrinhos/Madrinhas" value={summary.groomsmenGuests} icon={Users} />
            <StatCard label="Fornecedores" value={summary.totalSuppliers} icon={HandCoins} />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <PiggyBank className="mb-4 h-5 w-5 text-[var(--wedding-gold)]" />
              <p className="text-sm text-[var(--wedding-text-light)]">Dinheiro guardado</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--wedding-text)]">
                {money(summary.financialReserveTotal ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <Wallet className="mb-4 h-5 w-5 text-[var(--wedding-gold)]" />
              <p className="text-sm text-[var(--wedding-text-light)]">Ainda falta juntar</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--wedding-text)]">
                {money(summary.remainingToSave ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <p className="text-sm text-[var(--wedding-text-light)]">Custos de fornecedores</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--wedding-text)]">
                {money(summary.supplierTotalCost)}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <p className="text-sm text-[var(--wedding-text-light)]">Valores pagos</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--wedding-text)]">
                {money(summary.supplierTotalPaid)}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <p className="text-sm text-[var(--wedding-text-light)]">Saldo pendente</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--wedding-text)]">
                {money(summary.supplierTotalPending)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Ultimos valores guardados</h2>
              <div className="space-y-4">
                {latestFinancialEntries.map((entry) => (
                  <div key={entry._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{money(entry.amount)}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {entry.note || 'Sem observacao'} · {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(entry.savedAt))}
                    </p>
                  </div>
                ))}
              </div>
              {latestFinancialEntries.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhum valor guardado registrado ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Ultimas fotos recebidas</h2>
              <div className="grid grid-cols-3 gap-3">
                {latestPhotos.map((photo) => (
                  <img
                    key={photo._id}
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.guestName}
                    className="aspect-square rounded-lg object-cover"
                  />
                ))}
              </div>
              {latestPhotos.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhuma foto enviada ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Ultimos posts do B&F Social</h2>
              <div className="space-y-4">
                {latestSocialPosts.map((post) => (
                  <div key={post._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{post.authorName || 'Convidado'}</p>
                    <p className="line-clamp-2 text-sm text-[var(--wedding-text-light)]">{post.message}</p>
                  </div>
                ))}
              </div>
              {latestSocialPosts.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhum post publicado ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Ultimos convidados</h2>
              <div className="space-y-4">
                {latestGuests.map((guest) => (
                  <div key={guest._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{guest.name}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {guest.email || 'Sem email'} · {guest.isAttending || guest.status === 'confirmed' ? 'Confirmado' : 'Nao confirmado'}
                      {' '}· {guest.guestType === 'groomsman' ? 'Padrinho/Madrinha' : 'Convidado'}
                      {' '}· {guest.isChild ? 'Crianca' : 'Pagante'}
                    </p>
                  </div>
                ))}
              </div>
              {latestGuests.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhuma confirmacao recebida ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Ultimos fornecedores</h2>
              <div className="space-y-4">
                {latestSuppliers.map((supplier) => (
                  <div key={supplier._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{supplier.name}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {supplier.category || 'Sem categoria'} · {money(supplier.totalCost)}
                    </p>
                  </div>
                ))}
              </div>
              {latestSuppliers.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhum fornecedor cadastrado ainda.</p>
              )}
            </section>

            <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Ultimos pedidos</h2>
              <div className="space-y-4">
                {latestOrders.map((order) => (
                  <div key={order.id || (order as any)._id} className="border-b border-[var(--wedding-beige)] pb-4 last:border-0">
                    <p className="font-medium text-[var(--wedding-text)]">{order.customerName}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {order.customerEmail} · {money(Number(order.totalAmount || 0))}
                    </p>
                  </div>
                ))}
              </div>
              {latestOrders.length === 0 && (
                <p className="text-[var(--wedding-text-light)]">Nenhum pedido registrado ainda.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
