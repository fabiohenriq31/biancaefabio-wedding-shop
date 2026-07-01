import {
  Bell,
  Camera,
  Heart,
  Home,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Search,
  Send,
  Share,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { createSocialPost, getSocialPosts, likeSocialPost } from '../services/socialPostsApi';
import type { SocialPost } from '../types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function avatarInitial(name?: string) {
  return (name || 'B').charAt(0).toUpperCase();
}

function UserAvatar({
  src,
  name,
  className = 'h-11 w-11',
}: {
  src?: string | null;
  name?: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={name || 'Convidado'} className={`${className} rounded-full object-cover`} />;
  }

  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[var(--wedding-gold)] text-white`}>
      {avatarInitial(name)}
    </span>
  );
}

export function SocialPage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  async function loadPosts() {
    try {
      setError('');
      if (!token) return;
      const data = await getSocialPosts(token);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar feed.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback('');
    setError('');

    if (!message.trim()) {
      setError('Escreva uma mensagem para publicar.');
      return;
    }

    try {
      setSending(true);
      if (!token) return;
      const data = await createSocialPost({ token, message, image });
      setPosts((current) => [data.post, ...current]);
      setMessage('');
      setImage(null);
      setFeedback(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel publicar.');
    } finally {
      setSending(false);
    }
  }

  async function handleLike(postId: string) {
    try {
      if (!token) return;
      const updated = await likeSocialPost(token, postId);
      setPosts((current) => current.map((post) => (post._id === postId ? updated : post)));
    } catch {
      setError('Nao foi possivel curtir agora.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fbf9f7] text-[var(--wedding-text)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[260px_minmax(0,640px)_320px]">
        <aside className="sticky top-20 hidden h-[calc(100vh-80px)] border-r border-[var(--wedding-beige)] bg-white/70 px-4 py-6 lg:block">
          <Link to="/shopping" className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wedding-text)] text-lg font-semibold text-white">
            B&F
          </Link>

          <nav className="space-y-2">
            {[
              { label: 'Pagina inicial', icon: Home, to: '/shopping/social' },
              { label: 'Explorar', icon: Search, to: '/shopping/products' },
              { label: 'Notificacoes', icon: Bell, to: '/shopping/social' },
              { label: 'Bate-papo', icon: MessageCircle, to: '/shopping/social' },
              { label: 'Convidados', icon: Users, to: '/shopping/social' },
              { label: 'Perfil', icon: User, to: '/shopping/profile' },
            ].map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-4 rounded-full px-4 py-3 text-lg text-[var(--wedding-text)] transition hover:bg-[var(--wedding-beige)]"
              >
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <a
            href="#bf-social-compose"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-[var(--wedding-text)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Postar
          </a>

          <Link to="/shopping/profile" className="absolute bottom-6 left-4 right-4 flex items-center gap-3 rounded-full p-3 hover:bg-[var(--wedding-beige)]">
            <UserAvatar src={user?.avatarUrl} name={user?.name} className="h-11 w-11" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[var(--wedding-text)]">{user?.name}</p>
              <p className="truncate text-sm text-[var(--wedding-text-light)]">{user?.email}</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-[var(--wedding-text-light)]" />
          </Link>
        </aside>

        <main className="min-h-screen border-r border-[var(--wedding-beige)] bg-white">
          <header className="sticky top-20 z-10 border-b border-[var(--wedding-beige)] bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h1 className="text-xl font-semibold text-[var(--wedding-text)]">B&F Social</h1>
                <p className="text-xs text-[var(--wedding-text-light)]">Todos os convidados ja seguem todos</p>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--wedding-gold)]" />
            </div>
            <div className="grid grid-cols-2 text-center text-sm font-semibold">
              <button type="button" className="relative px-4 py-4 text-[var(--wedding-text)]">
                Para voce
                <span className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-[var(--wedding-gold)]" />
              </button>
              <button type="button" className="px-4 py-4 text-[var(--wedding-text-light)]">
                Todo mundo
              </button>
            </div>
          </header>

          <section id="bf-social-compose" className="border-b border-[var(--wedding-beige)] px-5 py-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <UserAvatar src={user?.avatarUrl} name={user?.name} className="h-12 w-12" />

              <div className="min-w-0 flex-1">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="min-h-20 w-full resize-none border-0 bg-transparent py-2 text-xl text-[var(--wedding-text)] outline-none placeholder:text-[var(--wedding-text-light)]"
                  placeholder="O que esta acontecendo?"
                  maxLength={280}
                  required
                />

                {image && (
                  <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-sm text-[var(--wedding-text)]">
                    <Camera className="h-4 w-4 text-[var(--wedding-gold)]" />
                    <span className="truncate">{image.name}</span>
                    <button type="button" onClick={() => setImage(null)} className="font-semibold text-[var(--wedding-gold)]">
                      remover
                    </button>
                  </div>
                )}

                {feedback && <p className="mb-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p>}
                {error && <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                <div className="flex items-center justify-between border-t border-[var(--wedding-beige)] pt-3">
                  <div className="flex items-center gap-2 text-[var(--wedding-gold)]">
                    <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-[var(--wedding-beige)]" title="Adicionar foto">
                      <ImagePlus className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                        className="hidden"
                        onChange={(event) => setImage(event.target.files?.[0] || null)}
                      />
                    </label>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[var(--wedding-beige)]" title="Mensagem">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[var(--wedding-beige)]" title="Destaque">
                      <Sparkles className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--wedding-text)] px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? 'Postando...' : 'Postar'}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {loading ? (
            <p className="px-5 py-8 text-[var(--wedding-text-light)]">Carregando B&F Social...</p>
          ) : posts.length === 0 ? (
            <div className="px-8 py-16 text-center text-[var(--wedding-text-light)]">
              <Camera className="mx-auto mb-3 h-8 w-8 text-[var(--wedding-gold)]" />
              <p className="text-lg text-[var(--wedding-text)]">Ainda nao tem posts por aqui.</p>
              <p>Seja a primeira pessoa a movimentar o feed do casamento.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="border-b border-[var(--wedding-beige)] px-5 py-4 transition hover:bg-[#fbf9f7]">
                <div className="flex gap-3">
                  <UserAvatar src={post.authorAvatarUrl} name={post.authorName} className="h-11 w-11" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[var(--wedding-text)]">
                          <span className="font-semibold">{post.authorName || 'Convidado'}</span>
                          <span className="ml-2 text-[var(--wedding-text-light)]">@convidado · {formatDate(post.createdAt)}</span>
                        </p>
                      </div>
                      <button type="button" className="rounded-full p-2 text-[var(--wedding-text-light)] hover:bg-[var(--wedding-beige)]">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="mt-1 whitespace-pre-line text-[15px] leading-6 text-[var(--wedding-text)]">{post.message}</p>

                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={`Post de ${post.authorName}`}
                        className="mt-3 max-h-[620px] w-full rounded-2xl border border-[var(--wedding-beige)] object-cover"
                        loading="lazy"
                      />
                    )}

                    <div className="mt-3 flex max-w-md items-center justify-between text-sm text-[var(--wedding-text-light)]">
                      <button type="button" className="group inline-flex items-center gap-2 rounded-full transition hover:text-[var(--wedding-gold)]">
                        <span className="rounded-full p-2 group-hover:bg-[var(--wedding-beige)]"><MessageCircle className="h-4 w-4" /></span>
                        0
                      </button>
                      <button type="button" className="group inline-flex items-center gap-2 rounded-full transition hover:text-emerald-600">
                        <span className="rounded-full p-2 group-hover:bg-emerald-50"><Repeat2 className="h-4 w-4" /></span>
                        0
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLike(post._id)}
                        className="group inline-flex items-center gap-2 rounded-full transition hover:text-rose-600"
                      >
                        <span className="rounded-full p-2 group-hover:bg-rose-50"><Heart className="h-4 w-4" /></span>
                        {post.likeCount || 0}
                      </button>
                      <button type="button" className="group inline-flex items-center gap-2 rounded-full transition hover:text-[var(--wedding-gold)]">
                        <span className="rounded-full p-2 group-hover:bg-[var(--wedding-beige)]"><Share className="h-4 w-4" /></span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </main>

        <aside className="sticky top-20 hidden h-[calc(100vh-80px)] bg-white/70 px-5 py-6 xl:block">
          <div className="rounded-2xl bg-[#f4eee8] p-5">
            <h2 className="text-xl font-semibold text-[var(--wedding-text)]">Rede fechada</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--wedding-text-light)]">
              Todos os convidados ja estao conectados. Nao precisa seguir ninguem: todo post visivel aparece para todo mundo.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--wedding-beige)] bg-white p-5">
            <h2 className="text-xl font-semibold text-[var(--wedding-text)]">Atalhos</h2>
            <div className="mt-4 space-y-3">
              <Link to="/shopping/profile" className="flex items-center gap-3 text-[var(--wedding-text)] hover:text-[var(--wedding-gold)]">
                <User className="h-5 w-5" />
                Editar perfil
              </Link>
              <Link to="/shopping/products" className="flex items-center gap-3 text-[var(--wedding-text)] hover:text-[var(--wedding-gold)]">
                <Sparkles className="h-5 w-5" />
                Lista de presentes
              </Link>
              <Link to="/shopping" className="flex items-center gap-3 text-[var(--wedding-text)] hover:text-[var(--wedding-gold)]">
                <Home className="h-5 w-5" />
                Inicio do shopping
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--wedding-beige)] bg-white p-5">
            <h2 className="text-xl font-semibold text-[var(--wedding-text)]">No feed</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--wedding-text-light)]">
              Mensagens, fotos, bastidores, chegada dos convidados e lembrancas do casamento ficam em uma timeline unica.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
