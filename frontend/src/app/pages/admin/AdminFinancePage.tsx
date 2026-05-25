import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  createAdminFinanceEntry,
  deleteAdminFinanceEntry,
  getAdminFinanceEntries,
} from '../../services/adminFinanceApi';
import { adminRequest } from '../../services/adminApi';
import type { AdminSummary, FinancialEntry } from '../../types';

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function AdminFinancePage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    amount: '',
    note: '',
    savedAt: toDateInput(new Date()),
  });

  async function loadData() {
    if (!token) return;

    setLoading(true);

    try {
      const [financeEntries, dashboardSummary] = await Promise.all([
        getAdminFinanceEntries(token),
        adminRequest<AdminSummary>(token, '/api/admin/summary'),
      ]);
      setEntries(financeEntries);
      setSummary(dashboardSummary);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  const reservedTotal = useMemo(
    () => entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
    [entries]
  );

  async function handleCreateEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      await createAdminFinanceEntry(token, {
        amount: Number(newEntry.amount || 0),
        note: newEntry.note,
        savedAt: newEntry.savedAt,
      });
      setNewEntry({
        amount: '',
        note: '',
        savedAt: toDateInput(new Date()),
      });
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao registrar valor guardado');
    }
  }

  async function handleDeleteEntry(entry: FinancialEntry) {
    if (!token || !window.confirm(`Remover o lançamento de ${money(entry.amount)}?`)) return;

    try {
      await deleteAdminFinanceEntry(token, entry._id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover lançamento');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Planejamento</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Financeiro</h1>
        <p className="mt-2 text-[var(--wedding-text-light)]">
          Registre o dinheiro já guardado e acompanhe quanto ainda falta para cobrir os fornecedores.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Dinheiro guardado</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(reservedTotal)}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Falta pagar fornecedores</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(summary?.supplierTotalPending || 0)}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Ainda falta juntar</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(summary?.remainingToSave || 0)}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Lançamentos</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{entries.length}</p>
        </div>
      </div>

      <form onSubmit={handleCreateEntry} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl text-[var(--wedding-text)]">Adicionar valor guardado</h2>
          <p className="text-sm text-[var(--wedding-text-light)]">
            Use um lançamento para cada entrada de reserva, assim o histórico fica fácil de acompanhar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={newEntry.amount}
            onChange={(event) => setNewEntry((current) => ({ ...current, amount: event.target.value }))}
            className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
            placeholder="Valor guardado"
          />
          <input
            type="date"
            required
            value={newEntry.savedAt}
            onChange={(event) => setNewEntry((current) => ({ ...current, savedAt: event.target.value }))}
            className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
          />
          <input
            type="text"
            value={newEntry.note}
            onChange={(event) => setNewEntry((current) => ({ ...current, note: event.target.value }))}
            className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
            placeholder="Observação"
          />
        </div>

        <div className="mt-6">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white">
            <Plus className="h-4 w-4" />
            Salvar lançamento
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--wedding-beige)] text-[var(--wedding-text)]">
            <PiggyBank className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl text-[var(--wedding-text)]">Histórico de valores guardados</h2>
            <p className="text-sm text-[var(--wedding-text-light)]">Mais recentes primeiro.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-[var(--wedding-text-light)]">Carregando lançamentos...</p>
        ) : entries.length === 0 ? (
          <p className="text-[var(--wedding-text-light)]">Nenhum valor guardado registrado ainda.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <article key={entry._id} className="flex flex-col gap-4 rounded-lg border border-[var(--wedding-beige)] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg text-[var(--wedding-text)]">{money(entry.amount)}</p>
                  <p className="text-sm text-[var(--wedding-text-light)]">
                    {entry.note || 'Sem observação'} · {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(entry.savedAt))}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteEntry(entry)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-700"
                  aria-label={`Excluir lançamento de ${money(entry.amount)}`}
                  title="Excluir lançamento"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
