import { Crown, Gift, Sparkles, Trophy, Wallet } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { getTieRaffleStatus } from '../services/tieRaffleApi';
import type { TieRafflePublicData } from '../types';

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatDate(value?: string) {
  if (!value) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function TieRafflePage() {
  const { user, isLoggedIn } = useAuth();
  const [data, setData] = useState<TieRafflePublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const seenDrawToken = useRef<string>('');

  async function loadData(showLoader = true) {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await getTieRaffleStatus();
      setData(response);
      setError('');

      const currentToken = response.winner?.drawToken || '';
      if (currentToken && currentToken !== seenDrawToken.current) {
        seenDrawToken.current = currentToken;
        setShowCelebration(true);
      }
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
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadData(false);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showCelebration) return;

    const timeout = window.setTimeout(() => {
      setShowCelebration(false);
    }, 12000);

    return () => window.clearTimeout(timeout);
  }, [showCelebration]);

  const isWinnerUser = Boolean(
    data?.winner &&
    user?.email &&
    data.winner.email &&
    user.email.toLowerCase() === data.winner.email.toLowerCase()
  );

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[var(--wedding-offwhite)] py-12">
      {showCelebration && data?.winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(38,31,28,0.78)] px-6">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(18)].map((_, index) => (
              <span
                key={index}
                className="absolute h-3 w-3 rounded-full bg-[var(--wedding-gold)] opacity-80 animate-ping"
                style={{
                  left: `${(index % 6) * 18 + 6}%`,
                  top: `${Math.floor(index / 6) * 24 + 10}%`,
                  animationDuration: `${1.2 + (index % 4) * 0.35}s`,
                  animationDelay: `${(index % 5) * 0.15}s`,
                }}
              />
            ))}
            {[...Array(18)].map((_, index) => (
              <span
                key={`spark-${index}`}
                className="absolute text-white/85 animate-bounce"
                style={{
                  left: `${(index % 6) * 16 + 10}%`,
                  top: `${Math.floor(index / 6) * 22 + 18}%`,
                  animationDuration: `${1 + (index % 3) * 0.25}s`,
                  animationDelay: `${(index % 4) * 0.2}s`,
                }}
              >
                ✦
              </span>
            ))}
          </div>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--wedding-beige)] text-[var(--wedding-gold)]">
              <Trophy className="h-10 w-10" />
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[var(--wedding-gold)]">Temos um vencedor</p>
            <h2 className="mt-4 text-5xl text-[var(--wedding-text)]">{data.winner.name}</h2>
            <p className="mt-4 text-lg text-[var(--wedding-text-light)]">
              Entrou no sorteio com {money(data.winner.totalAmount)} em contribuicoes.
            </p>
            {isWinnerUser && (
              <div className="mt-6 rounded-2xl bg-[var(--wedding-offwhite)] px-6 py-5">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Parabens</p>
                <p className="mt-3 text-2xl text-[var(--wedding-text)]">
                  Voce foi o grande vencedor da hora da gravata!
                </p>
              </div>
            )}
            <div className="mt-8 flex justify-center gap-4 text-[var(--wedding-gold)]">
              <Sparkles className="h-6 w-6 animate-pulse" />
              <Crown className="h-6 w-6 animate-bounce" />
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <button
              type="button"
              onClick={() => setShowCelebration(false)}
              className="mt-8 rounded-lg bg-[var(--wedding-text)] px-6 py-3 text-sm text-white"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[24px] bg-white px-6 py-10 shadow-sm md:px-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--wedding-gold)]">Ao vivo</p>
          <h1 className="mt-4 text-5xl text-[var(--wedding-text)]">Hora da gravata</h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--wedding-text-light)]">
            Deixe essa pagina aberta para acompanhar a revelacao do vencedor. Quando o sorteio acontecer, a tela se atualiza sozinha e mostra a celebracao.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {!isLoggedIn ? (
              <Button onClick={() => window.location.assign('/shopping/login')}>
                <Gift className="h-5 w-5" />
                Entrar no shopping
              </Button>
            ) : (
              <Button onClick={() => window.location.assign('/shopping/profile')}>
                <Crown className="h-5 w-5" />
                Ver meu perfil
              </Button>
            )}
            <Button variant="outline" onClick={() => loadData(false)}>
              Atualizar agora
            </Button>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-[var(--wedding-gold)]" />
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Total arrecadado</p>
                <p className="mt-1 text-3xl text-[var(--wedding-text)]">{money(data?.totalAmount || 0)}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-[var(--wedding-gold)]" />
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Pessoas participando</p>
                <p className="mt-1 text-3xl text-[var(--wedding-text)]">{data?.participantCount || 0}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[var(--wedding-gold)]" />
              <div>
                <p className="text-sm text-[var(--wedding-text-light)]">Ultima atualizacao</p>
                <p className="mt-1 text-lg text-[var(--wedding-text)]">{formatDate(data?.updatedAt || '') || 'Aguardando'}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="overflow-hidden" padding="none">
            <div className="border-b border-[var(--wedding-beige)] px-6 py-6">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--wedding-gold)]">Resultado</p>
              <h2 className="mt-2 text-3xl text-[var(--wedding-text)]">Painel do sorteio</h2>
            </div>

            <div className="px-6 py-8">
              {loading ? (
                <p className="text-[var(--wedding-text-light)]">Carregando sorteio...</p>
              ) : data?.winner ? (
                <div className="rounded-2xl bg-[var(--wedding-offwhite)] p-8 text-center">
                  <p className="text-sm uppercase tracking-[0.25em] text-[var(--wedding-gold)]">Ganhador revelado</p>
                  <h3 className="mt-4 text-4xl text-[var(--wedding-text)]">{data.winner.name}</h3>
                  <p className="mt-4 text-sm text-[var(--wedding-text-light)]">{formatDate(data.winner.drawnAt)}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--wedding-beige)] p-8 text-center">
                  <p className="text-[var(--wedding-text-light)]">
                    O sorteio ainda nao aconteceu. Deixe essa pagina aberta para acompanhar sem precisar atualizar.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="mt-8">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--wedding-gold)]">Participacao</p>
            <h2 className="mt-2 text-3xl text-[var(--wedding-text)]">Ultimos nomes registrados</h2>
          </div>

          {!data || data.recentEntries.length === 0 ? (
            <p className="text-[var(--wedding-text-light)]">Nenhuma contribuicao apareceu por aqui ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.recentEntries.map((entry) => (
                <div key={entry._id} className="rounded-lg border border-[var(--wedding-beige)] p-4">
                  <p className="text-lg text-[var(--wedding-text)]">{entry.fullName}</p>
                  <p className="mt-2 text-sm text-[var(--wedding-text-light)]">{formatDate(entry.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
