import {
  Coins,
  Crown,
  Dice5,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';
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

type RouletteLevelKey = 'beginner' | 'medium' | 'hard' | 'supreme';

const ROULETTE_LEVELS: Record<RouletteLevelKey, { label: string; range: string; description: string; values: number[]; accent: string; gradient: string }> = {
  beginner: {
    label: 'Iniciante', range: 'R$ 50 a R$ 300', description: 'Pra entrar na brincadeira sem assustar o bolso.',
    values: [50, 60, 80, 100, 120, 150, 180, 200, 250, 300], accent: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    gradient: 'conic-gradient(#d1fae5 0deg 36deg, #6ee7b7 36deg 72deg, #a7f3d0 72deg 108deg, #34d399 108deg 144deg, #d1fae5 144deg 180deg, #6ee7b7 180deg 216deg, #a7f3d0 216deg 252deg, #34d399 252deg 288deg, #d1fae5 288deg 324deg, #6ee7b7 324deg 360deg)',
  },
  medium: {
    label: 'Médio', range: 'R$ 300 a R$ 800', description: 'Já entrou no modo: hoje eu vim pro casamento.',
    values: [300, 350, 400, 450, 500, 600, 700, 800], accent: 'border-amber-200 bg-amber-50 text-amber-900',
    gradient: 'conic-gradient(#fef3c7 0deg 45deg, #fcd34d 45deg 90deg, #fde68a 90deg 135deg, #f59e0b 135deg 180deg, #fef3c7 180deg 225deg, #fcd34d 225deg 270deg, #fde68a 270deg 315deg, #f59e0b 315deg 360deg)',
  },
  hard: {
    label: 'Hard', range: 'R$ 1.000 a R$ 4.000', description: 'Aqui a amizade com os noivos será colocada à prova.',
    values: [1000, 1250, 1500, 2000, 2500, 3000, 3500, 4000], accent: 'border-red-200 bg-red-50 text-red-800',
    gradient: 'conic-gradient(#fee2e2 0deg 45deg, #fca5a5 45deg 90deg, #fecaca 90deg 135deg, #ef4444 135deg 180deg, #fee2e2 180deg 225deg, #fca5a5 225deg 270deg, #fecaca 270deg 315deg, #ef4444 315deg 360deg)',
  },
  supreme: {
    label: 'Sorte Suprema', range: 'R$ 500 a R$ 10.000', description: 'Pode sair barato. Pode virar história contada por anos.',
    values: [500, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000], accent: 'border-yellow-300 bg-yellow-50 text-yellow-950',
    gradient: 'conic-gradient(#fef9c3 0deg 40deg, #facc15 40deg 80deg, #fde047 80deg 120deg, #ca8a04 120deg 160deg, #fef08a 160deg 200deg, #eab308 200deg 240deg, #fef9c3 240deg 280deg, #facc15 280deg 320deg, #a16207 320deg 360deg)',
  },
};

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
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
  const [form, setForm] = useState({ fullName: '', amount: '', note: '' });
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [rouletteLevel, setRouletteLevel] = useState<RouletteLevelKey>('beginner');
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  const [roulettePreview, setRoulettePreview] = useState<number | null>(null);
  const [rouletteRotation, setRouletteRotation] = useState(0);

  async function loadData(query = searchTerm, showLoader = true) {
    if (!token) return;
    if (showLoader) setLoading(true);
    try {
      const response = await getAdminTieRaffle(token, query);
      setData(response); setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar a hora da gravata');
    } finally { if (showLoader) setLoading(false); }
  }

  useEffect(() => { loadData(); }, [token]);
  useEffect(() => {
    if (!token) return;
    const interval = window.setInterval(() => loadData(searchTerm, false), 5000);
    return () => window.clearInterval(interval);
  }, [token, searchTerm]);
  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => loadData(searchTerm), 250);
    return () => window.clearTimeout(timeout);
  }, [searchTerm, token]);
  useEffect(() => {
    if (!token) return;
    if (userQuery.trim().length < 2) { setUserSuggestions([]); return; }
    const timeout = window.setTimeout(async () => {
      try { setUserSuggestions(await searchTieRaffleUsers(token, userQuery)); } catch { setUserSuggestions([]); }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [token, userQuery]);

  const filteredParticipants = useMemo(() => data?.summary.participants.slice(0, 12) || [], [data]);

  function selectUser(user: TieRaffleUserLookup) {
    setSelectedUser(user); setForm((current) => ({ ...current, fullName: user.name })); setUserQuery(''); setUserSuggestions([]);
  }

  async function handleCreateEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!token) return;
    try {
      setSaving(true);
      await createTieRaffleEntry(token, { fullName: form.fullName, amount: Number(form.amount || 0), note: form.note, userId: selectedUser?.id || null });
      setForm({ fullName: '', amount: '', note: '' }); setSelectedUser(null); setUserQuery(''); await loadData(searchTerm, false);
    } catch (err) { alert(err instanceof Error ? err.message : 'Erro ao registrar valor da gravata'); }
    finally { setSaving(false); }
  }

  async function handleDeleteEntry(entryId: string, label: string) {
    if (!token || !window.confirm(`Remover o lancamento de ${label}?`)) return;
    try { await deleteTieRaffleEntry(token, entryId); await loadData(searchTerm, false); }
    catch (err) { alert(err instanceof Error ? err.message : 'Erro ao remover lancamento'); }
  }

  async function handleDraw() {
    if (!token) return;
    try { setDrawing(true); await drawTieRaffleWinner(token); await loadData(searchTerm, false); }
    catch (err) { alert(err instanceof Error ? err.message : 'Erro ao sortear ganhador'); }
    finally { setDrawing(false); }
  }

  async function handleResetWinner() {
    if (!token || !window.confirm('Limpar a revelacao atual para preparar um novo sorteio?')) return;
    try { setDrawing(true); await resetTieRaffleWinner(token); await loadData(searchTerm, false); }
    catch (err) { alert(err instanceof Error ? err.message : 'Erro ao reiniciar o sorteio'); }
    finally { setDrawing(false); }
  }

  function openRoulette() {
    if (!form.fullName.trim()) { alert('Digite o nome da pessoa antes de abrir a roleta.'); return; }
    setRouletteResult(null); setRoulettePreview(null); setRouletteOpen(true);
  }

  function spinRoulette() {
    if (rouletteSpinning) return;
    const level = ROULETTE_LEVELS[rouletteLevel];
    const selectedIndex = Math.floor(Math.random() * level.values.length);
    const selectedValue = level.values[selectedIndex];
    const segmentAngle = 360 / level.values.length;
    setRouletteSpinning(true); setRouletteResult(null); setRoulettePreview(level.values[0]);
    setRouletteRotation((current) => current + 360 * 7 + (360 - selectedIndex * segmentAngle) + segmentAngle / 2);
    const previewInterval = window.setInterval(() => setRoulettePreview(level.values[Math.floor(Math.random() * level.values.length)]), 90);
    window.setTimeout(() => {
      window.clearInterval(previewInterval); setRoulettePreview(selectedValue); setRouletteResult(selectedValue); setRouletteSpinning(false);
    }, 3200);
  }

  function applyRouletteResult() {
    if (rouletteResult === null) return;
    const level = ROULETTE_LEVELS[rouletteLevel];
    setForm((current) => ({ ...current, amount: String(rouletteResult), note: current.note.trim() ? `${current.note} · Roleta ${level.label}` : `Roleta ${level.label}` }));
    setRouletteOpen(false);
  }

  const currentLevel = ROULETTE_LEVELS[rouletteLevel];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Experiências ao vivo</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Hora da gravata</h1>
        <p className="mt-2 max-w-3xl text-[var(--wedding-text-light)]">Registre as contribuições, desafie os convidados na roleta e faça o sorteio final com peso maior para quem contribuiu mais.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total arrecadado', money(data?.summary.totalAmount || 0)],
          ['Participantes', String(data?.summary.participantCount || 0)],
          ['Lançamentos', String(data?.summary.totalEntries || 0)],
          ['Maior volume atual', filteredParticipants[0] ? `${filteredParticipants[0].fullName} · ${filteredParticipants[0].ticketCount} fichas` : 'Aguardando lances'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
            <p className="text-sm text-[var(--wedding-text-light)]">{label}</p><p className="mt-2 text-xl text-[var(--wedding-text)]">{value}</p>
          </div>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleCreateEntry} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-6"><h2 className="text-2xl text-[var(--wedding-text)]">Registrar contribuição</h2><p className="text-sm text-[var(--wedding-text-light)]">Valor manual ou roleta: você escolhe o nível e o destino escolhe o PIX.</p></div>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="mb-2 block text-sm text-[var(--wedding-text)]">Puxar usuário cadastrado</label>
              {selectedUser ? (
                <div className="flex items-center justify-between rounded-lg border border-[var(--wedding-beige)] bg-[var(--wedding-offwhite)] px-4 py-3">
                  <div><p className="text-sm text-[var(--wedding-text)]">{selectedUser.name}</p><p className="text-xs text-[var(--wedding-text-light)]">{selectedUser.email}</p></div>
                  <button type="button" onClick={() => setSelectedUser(null)} className="rounded-lg border border-[var(--wedding-beige)] px-3 py-2 text-xs">Remover</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--wedding-beige)] px-4 py-3"><Search className="h-4 w-4 text-[var(--wedding-text-light)]" /><input value={userQuery} onChange={(event) => setUserQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Buscar por nome ou email" /></div>
                  {userSuggestions.length > 0 && <div className="absolute z-20 mt-2 w-full rounded-lg border border-[var(--wedding-beige)] bg-white shadow-xl">{userSuggestions.map((user) => <button key={user.id} type="button" onClick={() => selectUser(user)} className="flex w-full items-start justify-between gap-4 border-b border-[var(--wedding-beige)] px-4 py-3 text-left last:border-0 hover:bg-[var(--wedding-offwhite)]"><span><span className="block text-sm">{user.name}</span><span className="block text-xs text-[var(--wedding-text-light)]">{user.email}</span></span><UserRound className="mt-1 h-4 w-4 text-[var(--wedding-gold)]" /></button>)}</div>}
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm text-[var(--wedding-text)]">Nome completo</label><input required value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Nome completo" /></div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3"><label className="block text-sm text-[var(--wedding-text)]">Valor</label><button type="button" onClick={openRoulette} className="inline-flex items-center gap-1 rounded-full bg-[var(--wedding-text)] px-3 py-1 text-xs font-medium text-white"><Sparkles className="h-3.5 w-3.5" />Desafiar a sorte</button></div>
                <input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="0,00" />
              </div>
            </div>
            <div><label className="mb-2 block text-sm text-[var(--wedding-text)]">Observação</label><input value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} className="w-full rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" placeholder="Mesa da gravata, PIX na hora, dinheiro..." /></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white disabled:opacity-50"><Plus className="h-4 w-4" />{saving ? 'Salvando...' : 'Adicionar lançamento'}</button>
            <button type="button" disabled={drawing || !data?.summary.totalEntries} onClick={handleDraw} className="inline-flex items-center gap-2 rounded-lg border border-[var(--wedding-text)] px-5 py-3 text-sm"><Dice5 className="h-4 w-4" />{drawing ? 'Sorteando...' : 'Sortear agora'}</button>
            <button type="button" disabled={drawing} onClick={handleResetWinner} className="inline-flex items-center gap-2 rounded-lg border border-[var(--wedding-beige)] px-5 py-3 text-sm text-[var(--wedding-text-light)]"><RefreshCcw className="h-4 w-4" />Reiniciar revelação</button>
          </div>
        </form>

        <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-2xl text-[var(--wedding-text)]">Vencedor atual</h2><p className="text-sm text-[var(--wedding-text-light)]">Também aparece na página pública da gravata.</p></div><Trophy className="h-6 w-6 text-[var(--wedding-gold)]" /></div>
          {data?.winner ? <div className="rounded-lg bg-[var(--wedding-offwhite)] p-6 text-center"><p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Grande vencedor</p><h3 className="mt-3 text-3xl text-[var(--wedding-text)]">{data.winner.name}</h3><p className="mt-2 text-lg text-[var(--wedding-text-light)]">Sorteado a partir de {money(data.winner.totalAmount)} em contribuições</p><p className="mt-3 text-sm text-[var(--wedding-text-light)]">{formatDate(data.winner.drawnAt)}</p></div> : <div className="rounded-lg border border-dashed border-[var(--wedding-beige)] p-6 text-sm text-[var(--wedding-text-light)]">Nenhum sorteio realizado ainda.</div>}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[var(--wedding-beige)] p-4"><div className="mb-2 flex items-center gap-2"><Wallet className="h-4 w-4 text-[var(--wedding-gold)]" /> Total acumulado</div><p className="text-2xl">{money(data?.summary.totalAmount || 0)}</p></div>
            <div className="rounded-lg border border-[var(--wedding-beige)] p-4"><div className="mb-2 flex items-center gap-2"><Coins className="h-4 w-4 text-[var(--wedding-gold)]" /> Líder em fichas</div><p className="text-sm">{filteredParticipants[0] ? `${filteredParticipants[0].fullName} com ${filteredParticipants[0].ticketCount} fichas` : 'Aguardando registros'}</p></div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-5"><h2 className="text-2xl text-[var(--wedding-text)]">Ranking de fichas</h2><p className="text-sm text-[var(--wedding-text-light)]">1 ficha para cada R$ 10,00 acumulados por participante.</p></div>
          {loading ? <p className="text-[var(--wedding-text-light)]">Carregando ranking...</p> : filteredParticipants.length === 0 ? <p className="text-[var(--wedding-text-light)]">Nenhuma participação cadastrada ainda.</p> : <div className="space-y-4">{filteredParticipants.map((participant, index) => <article key={participant.key} className="rounded-lg border border-[var(--wedding-beige)] p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-[var(--wedding-text-light)]">#{index + 1}</p><p className="text-lg">{participant.fullName}</p><p className="text-sm text-[var(--wedding-text-light)]">{participant.entriesCount} lançamento(s)</p></div><div className="text-right"><p className="text-lg">{money(participant.totalAmount)}</p><p className="text-sm text-[var(--wedding-gold)]">{participant.ticketCount} fichas</p></div></div></article>)}</div>}
        </section>

        <section className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h2 className="text-2xl text-[var(--wedding-text)]">Lançamentos registrados</h2><p className="text-sm text-[var(--wedding-text-light)]">Atualização automática a cada poucos segundos.</p></div><div className="flex items-center gap-3 rounded-lg bg-[var(--wedding-beige)] px-4 py-3"><Search className="h-4 w-4 text-[var(--wedding-text-light)]" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="bg-transparent outline-none" placeholder="Buscar nome ou email" /></div></div>
          {loading ? <p className="text-[var(--wedding-text-light)]">Carregando lançamentos...</p> : !data || data.entries.length === 0 ? <p className="text-[var(--wedding-text-light)]">Nenhum valor cadastrado ainda.</p> : <div className="space-y-4">{data.entries.map((entry) => <article key={entry._id} className="flex flex-col gap-4 rounded-lg border border-[var(--wedding-beige)] p-4 md:flex-row md:items-center md:justify-between"><div><p className="text-lg">{entry.fullName}</p><p className="text-sm text-[var(--wedding-text-light)]">{entry.email || 'Sem email'} · {entry.note || 'Sem observação'} · {formatDate(entry.createdAt)}</p></div><div className="flex items-center gap-3"><p className="text-lg">{money(entry.amount)}</p><button type="button" onClick={() => handleDeleteEntry(entry._id, `${entry.fullName} - ${money(entry.amount)}`)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-700" title="Excluir lançamento"><Trash2 className="h-4 w-4" /></button></div></article>)}</div>}
        </section>
      </div>

      {rouletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm md:p-6">
          <div className="relative max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl md:p-8">
            <button type="button" disabled={rouletteSpinning} onClick={() => setRouletteOpen(false)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 disabled:opacity-30"><X className="h-5 w-5" /></button>
            <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--wedding-gold)]">Desafio da gravata</p><h2 className="mt-2 text-3xl text-[var(--wedding-text)] md:text-5xl">A sorte de {form.fullName.split(' ')[0]}</h2><p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--wedding-text-light)] md:text-base">Escolha a coragem, toque na roleta e aceite o valor escolhido pelo destino.</p></div>

            <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
              {(Object.keys(ROULETTE_LEVELS) as RouletteLevelKey[]).map((key) => {
                const level = ROULETTE_LEVELS[key]; const active = rouletteLevel === key;
                return <button key={key} type="button" disabled={rouletteSpinning} onClick={() => { setRouletteLevel(key); setRouletteResult(null); setRoulettePreview(null); }} className={`rounded-2xl border p-3 text-left transition md:p-4 ${active ? `${level.accent} ring-2 ring-black/10` : 'border-black/10 bg-white hover:bg-black/[0.02]'}`}><span className="block text-sm font-semibold md:text-base">{key === 'supreme' ? '👑 ' : ''}{level.label}</span><span className="mt-1 block text-xs opacity-70">{level.range}</span></button>;
              })}
            </div>

            <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="relative mx-auto aspect-square w-full max-w-[440px]">
                <div className="absolute left-1/2 top-[-10px] z-20 h-0 w-0 -translate-x-1/2 border-x-[18px] border-t-[34px] border-x-transparent border-t-[var(--wedding-text)] drop-shadow-lg" />
                <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]" style={{ background: currentLevel.gradient, transform: `rotate(${rouletteRotation}deg)`, transition: rouletteSpinning ? 'transform 3.2s cubic-bezier(0.12, 0.72, 0.08, 1)' : 'none' }} />
                <div className="absolute inset-[15%] flex items-center justify-center rounded-full border-8 border-white bg-[var(--wedding-text)] p-5 text-center text-white shadow-xl"><div><p className="text-xs uppercase tracking-[0.22em] text-white/65">{rouletteSpinning ? 'Girando...' : rouletteResult ? 'O destino escolheu' : currentLevel.label}</p><p className="mt-2 text-3xl font-semibold tabular-nums md:text-5xl">{money(roulettePreview ?? rouletteResult ?? currentLevel.values[0])}</p></div></div>
              </div>

              <div>
                <div className={`rounded-3xl border p-6 ${currentLevel.accent}`}><div className="flex items-center gap-3">{rouletteLevel === 'supreme' ? <Crown className="h-7 w-7" /> : <Dice5 className="h-7 w-7" />}<div><p className="text-xl font-semibold">{currentLevel.label}</p><p className="text-sm opacity-70">{currentLevel.range}</p></div></div><p className="mt-4 text-sm leading-relaxed">{currentLevel.description}</p></div>
                {rouletteResult === 10000 && <div className="mt-4 animate-pulse rounded-3xl bg-[var(--wedding-text)] p-5 text-center text-white"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">Jackpot da gravata</p><p className="mt-2 text-2xl font-semibold">🚨 R$ 10.000 🚨</p></div>}
                <button type="button" onClick={spinRoulette} disabled={rouletteSpinning} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--wedding-text)] px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"><Sparkles className="h-5 w-5" />{rouletteSpinning ? 'Aguenta o coração...' : rouletteResult ? 'Girar de novo' : 'GIRAR A ROLETA'}</button>
                {rouletteResult !== null && !rouletteSpinning && <button type="button" onClick={applyRouletteResult} className="mt-3 w-full rounded-2xl border-2 border-[var(--wedding-text)] px-6 py-4 font-semibold text-[var(--wedding-text)]">Fechou! Usar {money(rouletteResult)} no PIX 😂</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
