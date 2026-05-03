import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  addSupplierPayment,
  createSupplier,
  deleteSupplier,
  getAdminSuppliers,
} from '../../services/adminSuppliersApi';
import type { Supplier } from '../../types';

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function paidTotal(supplier: Supplier) {
  return (supplier.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

export function AdminSuppliersPage() {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [paymentBySupplier, setPaymentBySupplier] = useState<Record<string, { amount: string; note: string }>>({});
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    category: '',
    contact: '',
    notes: '',
    totalCost: '',
    initialPayment: '',
  });

  async function loadSuppliers() {
    if (!token) return;
    setLoading(true);
    try {
      setSuppliers(await getAdminSuppliers(token));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, [token]);

  const totals = useMemo(() => {
    return suppliers.reduce(
      (acc, supplier) => {
        const paid = paidTotal(supplier);
        acc.cost += Number(supplier.totalCost || 0);
        acc.paid += paid;
        return acc;
      },
      { cost: 0, paid: 0 }
    );
  }, [suppliers]);

  async function handleCreateSupplier(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      await createSupplier(token, {
        ...newSupplier,
        totalCost: Number(newSupplier.totalCost || 0),
        initialPayment: Number(newSupplier.initialPayment || 0),
      });
      setNewSupplier({
        name: '',
        category: '',
        contact: '',
        notes: '',
        totalCost: '',
        initialPayment: '',
      });
      setShowCreateForm(false);
      await loadSuppliers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar fornecedor');
    }
  }

  async function handlePayment(supplier: Supplier) {
    if (!token) return;

    const payment = paymentBySupplier[supplier._id] || { amount: '', note: '' };

    try {
      await addSupplierPayment(token, supplier._id, {
        amount: Number(payment.amount || 0),
        note: payment.note,
      });
      setPaymentBySupplier((current) => ({
        ...current,
        [supplier._id]: { amount: '', note: '' },
      }));
      await loadSuppliers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao inserir pagamento');
    }
  }

  async function handleDelete(supplier: Supplier) {
    if (!token || !window.confirm(`Excluir ${supplier.name}?`)) return;
    await deleteSupplier(token, supplier._id);
    await loadSuppliers();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Financeiro</p>
          <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Fornecedores</h1>
          <p className="mt-2 text-[var(--wedding-text-light)]">
            Custos contratados, pagamentos realizados e saldo pendente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white"
        >
          <Plus className="h-4 w-4" />
          Adicionar fornecedor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Custo total</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(totals.cost)}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Pago</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(totals.paid)}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Pendente</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(Math.max(totals.cost - totals.paid, 0))}</p>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateSupplier} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">Novo fornecedor</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Nome" required value={newSupplier.name} onChange={(e) => setNewSupplier((s) => ({ ...s, name: e.target.value }))} />
            <input className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Categoria" value={newSupplier.category} onChange={(e) => setNewSupplier((s) => ({ ...s, category: e.target.value }))} />
            <input className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Contato" value={newSupplier.contact} onChange={(e) => setNewSupplier((s) => ({ ...s, contact: e.target.value }))} />
            <input type="number" min="0" step="0.01" className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Custo total" required value={newSupplier.totalCost} onChange={(e) => setNewSupplier((s) => ({ ...s, totalCost: e.target.value }))} />
            <input type="number" min="0" step="0.01" className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Valor ja pago" value={newSupplier.initialPayment} onChange={(e) => setNewSupplier((s) => ({ ...s, initialPayment: e.target.value }))} />
            <textarea className="min-h-24 rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none md:col-span-2" placeholder="Observacoes" value={newSupplier.notes} onChange={(e) => setNewSupplier((s) => ({ ...s, notes: e.target.value }))} />
          </div>
          <div className="mt-6 flex gap-3">
            <button className="rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white">Salvar fornecedor</button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="rounded-lg border border-[var(--wedding-beige)] px-5 py-3 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-[var(--wedding-text-light)]">Carregando fornecedores...</p>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => {
            const paid = paidTotal(supplier);
            const pending = Math.max(Number(supplier.totalCost || 0) - paid, 0);
            const payment = paymentBySupplier[supplier._id] || { amount: '', note: '' };

            return (
              <article key={supplier._id} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl text-[var(--wedding-text)]">{supplier.name}</h2>
                      {supplier.category && <span className="rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-xs">{supplier.category}</span>}
                    </div>
                    {supplier.contact && <p className="mt-1 text-sm text-[var(--wedding-text-light)]">{supplier.contact}</p>}
                    {supplier.notes && <p className="mt-3 text-sm text-[var(--wedding-text)]">{supplier.notes}</p>}
                  </div>
                  <button type="button" onClick={() => handleDelete(supplier)} className="h-fit rounded-lg border border-red-100 px-3 py-2 text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-[var(--wedding-beige)] p-4"><p className="text-xs">Custo</p><strong>{money(supplier.totalCost)}</strong></div>
                  <div className="rounded-lg bg-[var(--wedding-beige)] p-4"><p className="text-xs">Pago</p><strong>{money(paid)}</strong></div>
                  <div className="rounded-lg bg-[var(--wedding-beige)] p-4"><p className="text-xs">Pendente</p><strong>{money(pending)}</strong></div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr_auto]">
                  <input type="number" min="0" step="0.01" className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Valor pago" value={payment.amount} onChange={(e) => setPaymentBySupplier((current) => ({ ...current, [supplier._id]: { ...payment, amount: e.target.value } }))} />
                  <input className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Observacao do pagamento" value={payment.note} onChange={(e) => setPaymentBySupplier((current) => ({ ...current, [supplier._id]: { ...payment, note: e.target.value } }))} />
                  <button type="button" onClick={() => handlePayment(supplier)} className="rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white">Adicionar pagamento</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
