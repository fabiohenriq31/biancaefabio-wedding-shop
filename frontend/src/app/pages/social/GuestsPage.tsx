import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocialUsers, type SocialUser } from '../../services/socialApi';

export function GuestsPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<SocialUser[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getSocialUsers(token).then(setUsers).catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar convidados.'));
  }, [token]);

  return (
    <main className="min-h-screen border-r border-[var(--wedding-beige)] bg-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/95 px-5 py-4 text-white backdrop-blur lg:top-20 lg:border-[var(--wedding-beige)] lg:bg-white/90 lg:text-[var(--wedding-text)]">
        <h1 className="text-xl font-semibold">Convidados</h1>
        <p className="text-xs text-[var(--wedding-text-light)]">Todos os perfis cadastrados ja aparecem para todo mundo</p>
      </header>
      {error && <p className="m-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="divide-y divide-[var(--wedding-beige)]">
        {users.map((guest) => (
          <article key={guest.id} className="flex items-center gap-4 px-5 py-4">
            {guest.avatarUrl ? (
              <img src={guest.avatarUrl} alt={guest.name} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--wedding-gold)] text-lg text-white">{guest.name.charAt(0).toUpperCase()}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{guest.name}</p>
              <p className="truncate text-sm text-[var(--wedding-text-light)]">{guest.email}</p>
            </div>
            <span className="rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-xs text-[var(--wedding-text)]">Conectado</span>
          </article>
        ))}
      </div>
      {users.length === 0 && !error && (
        <div className="px-8 py-16 text-center text-[var(--wedding-text-light)]">
          <Users className="mx-auto mb-3 h-8 w-8 text-[var(--wedding-gold)]" />
          Nenhum perfil cadastrado ainda.
        </div>
      )}
    </main>
  );
}
