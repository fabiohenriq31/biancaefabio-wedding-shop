import { Send } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getChatMessages, sendChatMessage, type ChatMessage } from '../../services/socialApi';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function ChatPage() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!token) return;
    getChatMessages(token).then(setMessages).catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar chat.'));
  }, [token]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || !message.trim()) return;
    try {
      const saved = await sendChatMessage(token, message);
      setMessages((current) => [...current, saved]);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem.');
    }
  }

  return (
    <main className="flex min-h-screen flex-col border-r border-[var(--wedding-beige)] bg-white pb-[calc(136px+env(safe-area-inset-bottom))] lg:pb-0">
      <header className="sticky top-0 z-10 border-b border-[var(--wedding-beige)] bg-white/95 px-5 py-4 text-[var(--wedding-text)] backdrop-blur lg:top-20 lg:bg-white/90">
        <h1 className="text-xl font-semibold">Bate-papo</h1>
        <p className="text-xs text-[var(--wedding-text-light)]">Grupo geral com todos os convidados</p>
      </header>
      {error && <p className="m-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <section className="flex-1 space-y-4 px-5 py-5">
        {messages.map((item) => {
          const mine = item.authorId === user?.id;
          return (
            <div key={item._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${mine ? 'bg-[var(--wedding-text)] text-white' : 'bg-[var(--wedding-beige)] text-[var(--wedding-text)]'}`}>
                {!mine && <p className="mb-1 text-xs font-semibold">{item.authorName}</p>}
                <p className="text-sm leading-6">{item.message}</p>
                <p className={`mt-1 text-right text-[11px] ${mine ? 'text-white/70' : 'text-[var(--wedding-text-light)]'}`}>{formatTime(item.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </section>
      <form onSubmit={handleSubmit} className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 flex gap-3 border-t border-[var(--wedding-beige)] bg-white p-4 lg:sticky lg:bottom-0 lg:inset-x-auto">
        <input value={message} onChange={(event) => setMessage(event.target.value)} className="flex-1 rounded-full bg-[var(--wedding-beige)] px-5 py-3 outline-none" placeholder="Mensagem para o grupo..." maxLength={500} />
        <button type="submit" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wedding-text)] text-white"><Send className="h-5 w-5" /></button>
      </form>
    </main>
  );
}
