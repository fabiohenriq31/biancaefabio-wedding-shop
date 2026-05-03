import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  confirmGuest,
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
