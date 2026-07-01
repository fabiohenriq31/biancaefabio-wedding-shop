import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocialNotifications, type SocialNotification } from '../../services/socialApi';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getSocialNotifications(token).then(setNotifications).catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar notificacoes.'));
  }, [token]);

  return (
    <main className="min-h-screen border-r border-[var(--wedding-beige)] bg-white">
      <header className="sticky top-20 z-10 border-b border-[var(--wedding-beige)] bg-white/90 px-5 py-4 backdrop-blur">
        <h1 className="text-xl font-semibold">Notificacoes</h1>
        <p className="text-xs text-[var(--wedding-text-light)]">Atividades recentes do B&F Social</p>
      </header>
      {error && <p className="m-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="divide-y divide-[var(--wedding-beige)]">
        {notifications.map((item) => (
          <article key={item.id} className="flex gap-4 px-5 py-4">
            <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--wedding-beige)] text-[var(--wedding-gold)]"><Bell className="h-5 w-5" /></span>
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--wedding-text-light)]">{item.message}</p>
              <p className="mt-2 text-xs text-[var(--wedding-text-light)]">{formatDate(item.createdAt)}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
