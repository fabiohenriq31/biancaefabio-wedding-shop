import { Crown, Dice5, Plus, RefreshCcw, Search, Trash2, Trophy, UserRound, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  createTieRaffleEntry,
  deleteTieRaffleEntry,
  drawTieRaffleWinner,
  getAdminTieRaffle,
  resetTieRaffleWinner,
  searchTieRaffleUsers,
} from '../../services/adminTieRaffleApi';
import type { TieRaffleAdminData, TieRaffleUserLookup } from '../../types';

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AdminTieRafflePage() {
  const { token } = useAuth();
  const [data, setData] = useState<TieRaffleAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<TieRaffleUserLookup[]>([]);
  const [selectedUser, setSelectedUser] = useState<TieRaffleUserLookup | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    amount: '',
    note: '',
  });

  async function loadData(query = searchTerm, showLoader = true) {
    if (!token) return;

    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await getAdminTieRaffle(token, query);
      setData(response);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar a hora da gravata');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const interval = window.setInterval(() => {
      loadData(searchTerm, false);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [token, searchTerm]);

  useEffect(() => {
    if (!token) return;

    const timeout = window.setTimeout(() => {
      loadData(searchTerm);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchTerm, token]);

  useEffect(() => {
    if (!token) return;

    if (userQuery.trim().length < 2) {
      setUserSuggestions([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        const users = await searchTieRaffleUsers(token, userQuery);
        setUserSuggestions(users);
      } catch (err) {
        console.error(err);
        setUserSuggestions([]);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [token, userQuery]);

  const topParticipant = data?.summary.participants[0] || null;

  const filteredParticipants = useMemo(() => {
    if (!data) return [];
    return data.summary.participants.slice(0, 8);
  }, [data]);

  function selectUser(user: TieRaffleUserLookup) {
    setSelectedUser(user);
    setForm((current) => ({ ...current, fullName: user.name }));
    setUserQuery('');
    setUserSuggestions([]);
  }

  function removeSelectedUser() {
    setSelectedUser(null);
  }

  async function handleCreateEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setSaving(true);
      await createTieRaffleEntry(token, {
        fullName: form.fullName,
        amount: Number(form.amount || 0),
        note: form.note,
        userId: selectedUser?.id || null,
      });
      setForm({ fullName: '', amount: '', note: '' });
      setSelectedUser(null);
      setUserQuery('');
      await loadData(searchTerm, false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao registrar valor da gravata');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEntry(entryId: string, label: string) {
    if (!token || !window.confirm(`Remover o lancamento de ${label}?`)) return;

    try {
      await deleteTieRaffleEntry(token, entryId);
      await loadData(searchTerm, false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover lancamento');
    }
  }

  async function handleDraw() {
    if (!token) return;

    try {
      setDrawing(true);
      await drawTieRaffleWinner(token);
      await loadData(searchTerm, false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao sortear ganhador');
    } finally {
      setDrawing(false);
    }
  }

  async function handleResetWinner() {
    if (!token || !window.confirm('Limpar a revelacao atual para preparar um novo sorteio?')) return;

    try {
      setDrawing(true);
      await resetTieRaffleWinner(token);
      await loadData(searchTerm, false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao reiniciar o sorteio');
    } finally {
      setDrawing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Experiencias ao vivo</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Hora da gravata</h1>
        <p className="mt-2 max-w-3xl text-[var(--wedding-text-light)]">
          Cadastre os valores da brincadeira, puxe usuarios cadastrados na hora e sorteie com peso maior para quem contribuiu mais.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Total arrecadado</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{money(data?.summary.totalAmount || 0)}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Participantes</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{data?.summary.participantCount || 0}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Lancamentos</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{data?.summary.totalEntries || 0}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Maior chance agora</p>
          <p className="mt-2 text-lg text-[var(--wedding-text)]">
            {topParticipant ? `${topParticipant.fullName} (${topParticipant.chancePercent.toFixed(2)}%)` : 'Aguardando lances'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleCreateEntry} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl text-[var(--wedding-text)]">Registrar contribuicao</h2>
            <p className="text-sm text-[var(--wedding-text-light)]">
              Voce pode digitar o nome manualmente ou buscar um usuario cadastrado para preencher mais rapido.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="mb-2 block text-sm text-[var(--wedding-text)]">Puxar usuario cadastrado</label>
              {selectedUser ? (
                <div className="flex items-center justify-between rounded-lg border border-[var(--wedding-beige)] bg-[var(--wedding-offwhite)] px-4 py-3">
                  <div>
                    <p className="text-sm text-[var(--wedding-text)]">{selectedUser.name}</p>
                    <p className="text-xs text-[var(--wedding-text-light)]">{selectedUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedUser}
                    className="rounded-lg border border-[var(--wedding-beige)] px-3 py-2 text-xs text-[var(--wedding-text)]"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--wedding-beige)] px-4 py-3">
                    <Search className="h-4 w-4 text-[var(--wedding-text-light)]" />
                    <input
                      value={userQuery}
                      onChange={(event) => setUserQuery(event.target.value)}
                      className="w-full bg-transparent outline-none"
                      placeholder="Buscar por nome ou email"
                    />
                  </div>
                  {userSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-[var(--wedding-beige)] bg-white shadow-lg">
                      {userSuggestions.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => selectUser(user)}
                          className="flex w-full items-start justify-between gap-4 border-b border-[var(--wedding-beige)] px-4 py-3 text-left last:border-0 hover:bg-[var(--wedding-offwhite)]"
                        >
                          <span>
                            <span className="block text-sm text-[var(--wedding-text)]">{user.name}</span>
                            <span className="block text-xs text-[var(--wedding-text-light)]">{user.email}</span>
                          </span>
                          <UserRound className="mt-1 h-4 w-4 text-[var(--wedding-gold)]" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-[var(--wedding-text)]">Nome completo</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--wedding-text)]">Valor</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                  className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[var(--wedding-text)]">Observacao</label>
              <input
                value={form.note}
                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none"
                placeholder="Mesa da gravata, pix na hora, dinheiro..."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white"
            >
              <Plus className="h-4 w-4" />
              {saving ? 'Salvando...' : 'Adicionar lancamento'}
            </button>
            <button
              type="button"
              disabled={drawing || !data?.summary.totalEntries}
              onClick={handleDraw}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--wedding-text)] px-5 py-3 text-sm text-[var(--wedding-text)]"
            >
              <Dice5 className="h-4 w-4" />
              {drawing ? 'Sorteando...' : 'Sortear agora'}
            </button>
            <button
              type="button"
              disabled={drawing}
              onClick={handleResetWinner}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--wedding-beige)] px-5 py-3 text-sm text-[var(--wedding-text-light)]"
            >
              <RefreshCcw className="h-4 w-4" />
              Reiniciar revelacao
            </button>
          </div>
        </form>

        <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl text-[var(--wedding-text)]">Vencedor atual</h2>
              <p className="text-sm text-[var(--wedding-text-light)]">
                Essa informacao tambem aparece na pagina publica da gravata.
              </p>
            </div>
            <Trophy className="h-6 w-6 text-[var(--wedding-gold)]" />
          </div>

          {data?.winner ? (
            <div className="rounded-lg bg-[var(--wedding-offwhite)] p-6 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Grande vencedor</p>
              <h3 className="mt-3 text-3xl text-[var(--wedding-text)]">{data.winner.name}</h3>
              <p className="mt-2 text-lg text-[var(--wedding-text-light)]">
                Chance vencedora baseada em {money(data.winner.totalAmount)}
              </p>
              <p className="mt-3 text-sm text-[var(--wedding-text-light)]">{formatDate(data.winner.drawnAt)}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--wedding-beige)] p-6 text-sm text-[var(--wedding-text-light)]">
              Nenhum sorteio realizado ainda. Assim que voces clicarem em sortear, essa tela e a pagina publica mostram o vencedor.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--wedding-beige)] p-4">
              <div className="mb-2 flex items-center gap-2 text-[var(--wedding-text)]">
                <Wallet className="h-4 w-4 text-[var(--wedding-gold)]" />
                Total acumulado
              </div>
              <p className="text-2xl text-[var(--wedding-text)]">{money(data?.summary.totalAmount || 0)}</p>
            </div>
            <div className="rounded-lg border border-[var(--wedding-beige)] p-4">
              <div className="mb-2 flex items-center gap-2 text-[var(--wedding-text)]">
                <Crown className="h-4 w-4 text-[var(--wedding-gold)]" />
                Participante lider
              </div>
              <p className="text-sm text-[var(--wedding-text)]">
                {topParticipant ? `${topParticipant.fullName} com ${money(topParticipant.totalAmount)}` : 'Aguardando registros'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl text-[var(--wedding-text)]">Ranking de chances</h2>
            <p className="text-sm text-[var(--wedding-text-light)]">Quanto maior o total depositado, maior a probabilidade no sorteio.</p>
          </div>

          {loading ? (
            <p className="text-[var(--wedding-text-light)]">Carregando ranking...</p>
          ) : filteredParticipants.length === 0 ? (
            <p className="text-[var(--wedding-text-light)]">Nenhuma participacao cadastrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {filteredParticipants.map((participant, index) => (
                <article key={participant.key} className="rounded-lg border border-[var(--wedding-beige)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--wedding-text-light)]">#{index + 1}</p>
                      <p className="text-lg text-[var(--wedding-text)]">{participant.fullName}</p>
                      <p className="text-sm text-[var(--wedding-text-light)]">
                        {participant.entriesCount} {participant.entriesCount === 1 ? 'lancamento' : 'lancamentos'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-[var(--wedding-text)]">{money(participant.totalAmount)}</p>
                      <p className="text-sm text-[var(--wedding-gold)]">{participant.chancePercent.toFixed(2)}% de chance</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl text-[var(--wedding-text)]">Lancamentos registrados</h2>
              <p className="text-sm text-[var(--wedding-text-light)]">Atualizacao automatica a cada poucos segundos.</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-[var(--wedding-beige)] px-4 py-3">
              <Search className="h-4 w-4 text-[var(--wedding-text-light)]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="bg-transparent outline-none"
                placeholder="Buscar nome ou email"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-[var(--wedding-text-light)]">Carregando lancamentos...</p>
          ) : !data || data.entries.length === 0 ? (
            <p className="text-[var(--wedding-text-light)]">Nenhum valor cadastrado ainda.</p>
          ) : (
            <div className="space-y-4">
              {data.entries.map((entry) => (
                <article key={entry._id} className="flex flex-col gap-4 rounded-lg border border-[var(--wedding-beige)] p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg text-[var(--wedding-text)]">{entry.fullName}</p>
                    <p className="text-sm text-[var(--wedding-text-light)]">
                      {entry.email || 'Sem email'} · {entry.note || 'Sem observacao'} · {formatDate(entry.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-lg text-[var(--wedding-text)]">{money(entry.amount)}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(entry._id, `${entry.fullName} - ${money(entry.amount)}`)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-700"
                      title="Excluir lancamento"
                      aria-label={`Excluir lancamento de ${entry.fullName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
