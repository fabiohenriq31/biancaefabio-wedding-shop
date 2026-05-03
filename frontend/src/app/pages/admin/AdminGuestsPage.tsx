import { CheckCircle2, Plus, Search, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  confirmGuest,
  createAdminGuest,
  getAdminGuests,
  unconfirmGuest,
  type GuestFilter,
} from '../../services/adminGuestsApi';
import type { Guest } from '../../types';

const filters: Array<{ label: string; value: GuestFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Não confirmados', value: 'not_confirmed' },
];

export function AdminGuestsPage() {
  const { token } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<GuestFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    companions: '',
    message: '',
    guestType: 'guest' as 'guest' | 'groomsman',
    status: 'confirmed' as 'confirmed' | 'not_confirmed',
  });

  async function loadGuests() {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      setGuests(await getAdminGuests(token, filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar convidados');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuests();
  }, [token, filter]);

  const filteredGuests = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return guests.filter((guest) => (
      guest.name.toLowerCase().includes(query) ||
      String(guest.email || '').toLowerCase().includes(query) ||
      String(guest.companions || '').toLowerCase().includes(query)
    ));
  }, [guests, searchQuery]);

  const counters = useMemo(() => ({
    total: guests.length,
    confirmed: guests.filter((guest) => guest.status === 'confirmed').length,
    notConfirmed: guests.filter((guest) => guest.status === 'not_confirmed').length,
  }), [guests]);

  async function runAction(action: () => Promise<unknown>) {
    try {
      await action();
      await loadGuests();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar convidado');
    }
  }

  async function handleCreateGuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) return;

    setIsCreating(true);

    try {
      await createAdminGuest(token, newGuest);
      setNewGuest({
        name: '',
        email: '',
        companions: '',
        message: '',
        guestType: 'guest',
        status: 'confirmed',
      });
      setShowCreateForm(false);
      setFilter('all');
      await loadGuests();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao adicionar convidado');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">RSVP</p>
          <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Lista de convidados</h1>
          <p className="mt-2 text-[var(--wedding-text-light)]">
            Confirmações recebidas pelo site principal e status de presença.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <button
            type="button"
            onClick={() => setShowCreateForm((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white"
          >
            <Plus className="h-4 w-4" />
            Adicionar convidado
          </button>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-2 text-sm ${
                  filter === item.value
                    ? 'bg-[var(--wedding-text)] text-white'
                    : 'bg-white text-[var(--wedding-text)] border border-[var(--wedding-beige)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateGuest}
          className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm"
        >
          <div className="mb-5">
            <h2 className="text-2xl text-[var(--wedding-text)]">Adicionar convidado</h2>
            <p className="text-sm text-[var(--wedding-text-light)]">
              Inclua manualmente um convidado na lista e escolha o status de presença.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-[var(--wedding-text)]">Nome</span>
              <input
                type="text"
                value={newGuest.name}
                onChange={(event) => setNewGuest((guest) => ({ ...guest, name: event.target.value }))}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--wedding-text)]">Email</span>
              <input
                type="email"
                value={newGuest.email}
                onChange={(event) => setNewGuest((guest) => ({ ...guest, email: event.target.value }))}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-[var(--wedding-text)]">Acompanhantes</span>
              <input
                type="text"
                value={newGuest.companions}
                onChange={(event) => setNewGuest((guest) => ({ ...guest, companions: event.target.value }))}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
                placeholder="Ex: Maria, João e Ana"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm text-[var(--wedding-text)]">Observação</span>
              <textarea
                value={newGuest.message}
                onChange={(event) => setNewGuest((guest) => ({ ...guest, message: event.target.value }))}
                className="min-h-24 w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--wedding-text)]">Status</span>
              <select
                value={newGuest.status}
                onChange={(event) => setNewGuest((guest) => ({
                  ...guest,
                  status: event.target.value as 'confirmed' | 'not_confirmed',
                }))}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
              >
                <option value="confirmed">Confirmado</option>
                <option value="not_confirmed">Não confirmado</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--wedding-text)]">Tipo</span>
              <select
                value={newGuest.guestType}
                onChange={(event) => setNewGuest((guest) => ({
                  ...guest,
                  guestType: event.target.value as 'guest' | 'groomsman',
                }))}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
              >
                <option value="guest">Convidado</option>
                <option value="groomsman">Padrinho/Madrinha</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white disabled:opacity-60"
            >
              {isCreating ? 'Adicionando...' : 'Salvar convidado'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg border border-[var(--wedding-beige)] px-5 py-3 text-sm text-[var(--wedding-text)]"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Neste filtro</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{counters.total}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Confirmados</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{counters.confirmed}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Não confirmados</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{counters.notConfirmed}</p>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-[var(--wedding-text-light)]" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou acompanhantes..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>

      {loading && <p className="text-[var(--wedding-text-light)]">Carregando convidados...</p>}
      {error && <p className="text-red-700">{error}</p>}

      <div className="space-y-4">
        {!loading && !error && filteredGuests.length === 0 && (
          <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-8 text-center text-[var(--wedding-text-light)]">
            Nenhum convidado encontrado.
          </div>
        )}

        {filteredGuests.map((guest) => {
          const isConfirmed = guest.status === 'confirmed';
          const date = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(new Date(guest.createdAt));

          return (
            <article key={guest._id} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl text-[var(--wedding-text)]">{guest.name}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs ${
                      isConfirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {isConfirmed ? 'Confirmado' : 'Não confirmado'}
                    </span>
                    <span className="rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-xs text-[var(--wedding-text)]">
                      {guest.guestType === 'groomsman' ? 'Padrinho/Madrinha' : 'Convidado'}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--wedding-text-light)]">
                    {guest.email || 'Sem email'} · Recebido em {date}
                  </p>
                  {guest.companions && (
                    <p className="text-sm text-[var(--wedding-text)]">
                      <strong>Acompanhantes:</strong> {guest.companions}
                    </p>
                  )}
                  {guest.message && (
                    <p className="rounded-lg bg-[var(--wedding-beige)] p-3 text-sm italic text-[var(--wedding-text)]">
                      "{guest.message}"
                    </p>
                  )}
                </div>

                <div className="flex min-w-fit gap-2">
                  {isConfirmed ? (
                    <button
                      type="button"
                      onClick={() => token && runAction(() => unconfirmGuest(token, guest._id))}
                      className="flex items-center gap-2 rounded-lg bg-[var(--wedding-beige)] px-4 py-2 text-sm text-[var(--wedding-text)]"
                    >
                      <XCircle className="h-4 w-4" />
                      Marcar não confirmado
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => token && runAction(() => confirmGuest(token, guest._id))}
                      className="flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-4 py-2 text-sm text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmar presença
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
