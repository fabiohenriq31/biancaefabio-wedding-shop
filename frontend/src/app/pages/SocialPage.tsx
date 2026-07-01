import { Camera, Heart, Home, ImagePlus, MessageCircle, MoreHorizontal, Plus, Repeat2, Save, Send, Share, Sparkles, User, UserPlus, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { createSocialPost, deleteSocialPost, getSocialPosts, likeSocialPost, updateSocialPost } from '../services/socialPostsApi';
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

function UserAvatar({ src, name, className = 'h-11 w-11' }: { src?: string | null; name?: string; className?: string }) {
  if (src) return <img src={src} alt={name || 'Convidado'} className={`${className} rounded-full object-cover`} />;
  return <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[var(--wedding-gold)] text-white`}>{avatarInitial(name)}</span>;
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState('');
  const [showMobileComposer, setShowMobileComposer] = useState(false);

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
    if (!message.trim()) return setError('Escreva uma mensagem para publicar.');

    try {
      setSending(true);
      if (!token) return;
      const data = await createSocialPost({ token, message, image });
      setPosts((current) => [data.post, ...current]);
      setMessage('');
      setImage(null);
      setShowMobileComposer(false);
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

  function startEditing(post: SocialPost) {
    setEditingId(post._id);
    setEditingMessage(post.message);
    setOpenMenuId(null);
  }

  async function saveEditing(postId: string) {
    try {
      if (!token || !editingMessage.trim()) return;
      const updated = await updateSocialPost(token, postId, editingMessage);
      setPosts((current) => current.map((post) => (post._id === postId ? updated : post)));
      setEditingId(null);
      setEditingMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel editar.');
    }
  }

  async function removePost(postId: string) {
    if (!token || !window.confirm('Excluir este post?')) return;
    try {
      await deleteSocialPost(token, postId);
      setPosts((current) => current.filter((post) => post._id !== postId));
      setOpenMenuId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel excluir.');
    }
  }

  return (
    <>
      <main className="min-h-screen border-white/10 bg-black pb-20 text-white lg:border-r lg:border-[var(--wedding-beige)] lg:bg-white lg:pb-0 lg:text-[var(--wedding-text)]">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/95 backdrop-blur lg:top-20 lg:border-[var(--wedding-beige)] lg:bg-white/90">
          <div className="flex items-center justify-between px-4 py-3 lg:px-5 lg:py-4">
            <div className="flex items-center gap-3 lg:block">
              <div className="lg:hidden">
                <UserAvatar src={user?.avatarUrl} name={user?.name} className="h-9 w-9" />
              </div>
              <div className="lg:hidden">
                <span className="block text-3xl leading-none">X</span>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-[var(--wedding-text)]">B&F Social</h1>
                <p className="text-xs text-[var(--wedding-text-light)]">Todos os convidados ja seguem todos</p>
              </div>
            </div>
            <UserPlus className="h-6 w-6 text-white/80 lg:hidden" />
            <Sparkles className="hidden h-5 w-5 text-[var(--wedding-gold)] lg:block" />
          </div>
          <div className="grid grid-cols-2 text-center text-sm font-semibold">
            <button type="button" className="relative px-4 py-4 text-white lg:text-[var(--wedding-text)]">Para voce<span className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-[#1d9bf0] lg:w-16 lg:bg-[var(--wedding-gold)]" /></button>
            <button type="button" className="px-4 py-4 text-white/45 lg:text-[var(--wedding-text-light)]">Todo mundo</button>
          </div>
        </header>

        <section id="bf-social-compose" className="hidden border-b border-[var(--wedding-beige)] px-5 py-4 lg:block">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <UserAvatar src={user?.avatarUrl} name={user?.name} className="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-20 w-full resize-none border-0 bg-transparent py-2 text-xl text-[var(--wedding-text)] outline-none placeholder:text-[var(--wedding-text-light)]" placeholder="O que esta acontecendo?" maxLength={280} required />
              {image && <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-[var(--wedding-beige)] px-3 py-1 text-sm text-[var(--wedding-text)]"><Camera className="h-4 w-4 text-[var(--wedding-gold)]" /><span className="truncate">{image.name}</span><button type="button" onClick={() => setImage(null)} className="font-semibold text-[var(--wedding-gold)]">remover</button></div>}
              {feedback && <p className="mb-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p>}
              {error && <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="flex items-center justify-between border-t border-[var(--wedding-beige)] pt-3">
                <div className="flex items-center gap-2 text-[var(--wedding-gold)]">
                  <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-[var(--wedding-beige)]" title="Adicionar foto"><ImagePlus className="h-5 w-5" /><input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={(event) => setImage(event.target.files?.[0] || null)} /></label>
                </div>
                <button type="submit" disabled={sending || !message.trim()} className="inline-flex items-center gap-2 rounded-full bg-[var(--wedding-text)] px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" />{sending ? 'Postando...' : 'Postar'}</button>
              </div>
            </div>
          </form>
        </section>

        {loading ? <p className="px-5 py-8 text-white/60 lg:text-[var(--wedding-text-light)]">Carregando B&F Social...</p> : posts.length === 0 ? (
          <div className="px-8 py-20 text-center text-white/60 lg:text-[var(--wedding-text-light)]"><Camera className="mx-auto mb-3 h-8 w-8 text-[#1d9bf0] lg:text-[var(--wedding-gold)]" /><p className="text-lg text-white lg:text-[var(--wedding-text)]">Ainda nao tem posts por aqui.</p><p>Seja a primeira pessoa a movimentar o feed do casamento.</p></div>
        ) : posts.map((post) => {
          const isOwner = post.authorId === user?.id;
          return (
            <article key={post._id} className="border-b border-white/10 px-4 py-3 transition hover:bg-white/[0.03] lg:border-[var(--wedding-beige)] lg:px-5 lg:py-4 lg:hover:bg-[#fbf9f7]">
              <div className="flex gap-3">
                <UserAvatar src={post.authorAvatarUrl} name={post.authorName} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-white lg:text-[var(--wedding-text)]"><span className="font-semibold">{post.authorName || 'Convidado'}</span><span className="ml-2 text-white/45 lg:text-[var(--wedding-text-light)]">@convidado - {formatDate(post.createdAt)}</span></p>
                    <div className="relative">
                      <button type="button" onClick={() => setOpenMenuId((current) => current === post._id ? null : post._id)} className="rounded-full p-2 text-white/50 hover:bg-white/10 lg:text-[var(--wedding-text-light)] lg:hover:bg-[var(--wedding-beige)]"><MoreHorizontal className="h-5 w-5" /></button>
                      {openMenuId === post._id && (
                        <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-[var(--wedding-beige)] bg-white shadow-lg">
                          {isOwner ? (
                            <>
                              <button type="button" onClick={() => startEditing(post)} className="block w-full px-4 py-3 text-left text-sm hover:bg-[var(--wedding-beige)]">Editar post</button>
                              <button type="button" onClick={() => removePost(post._id)} className="block w-full px-4 py-3 text-left text-sm text-red-700 hover:bg-red-50">Excluir post</button>
                            </>
                          ) : <p className="px-4 py-3 text-sm text-[var(--wedding-text-light)]">Acoes disponiveis apenas para o autor.</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {editingId === post._id ? (
                    <div className="mt-2 space-y-3">
                      <textarea value={editingMessage} onChange={(event) => setEditingMessage(event.target.value)} className="min-h-24 w-full resize-none rounded-xl bg-[var(--wedding-beige)] px-4 py-3 outline-none" maxLength={280} />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => saveEditing(post._id)} className="inline-flex items-center gap-2 rounded-full bg-[var(--wedding-text)] px-4 py-2 text-sm font-semibold text-white"><Save className="h-4 w-4" />Salvar</button>
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-full bg-[var(--wedding-beige)] px-4 py-2 text-sm">Cancelar</button>
                      </div>
                    </div>
                  ) : <p className="mt-1 whitespace-pre-line text-[15px] leading-6 text-white/90 lg:text-[var(--wedding-text)]">{post.message}</p>}

                  {post.imageUrl && <img src={post.imageUrl} alt={`Post de ${post.authorName}`} className="mt-3 max-h-[620px] w-full rounded-2xl border border-white/10 object-cover lg:border-[var(--wedding-beige)]" loading="lazy" />}
                  <div className="mt-3 flex max-w-md items-center justify-between text-sm text-white/45 lg:text-[var(--wedding-text-light)]">
                    <button type="button" className="group inline-flex items-center gap-2 rounded-full transition hover:text-[var(--wedding-gold)]"><span className="rounded-full p-2 group-hover:bg-[var(--wedding-beige)]"><MessageCircle className="h-4 w-4" /></span>0</button>
                    <button type="button" className="group inline-flex items-center gap-2 rounded-full transition hover:text-emerald-600"><span className="rounded-full p-2 group-hover:bg-emerald-50"><Repeat2 className="h-4 w-4" /></span>0</button>
                    <button type="button" onClick={() => handleLike(post._id)} className="group inline-flex items-center gap-2 rounded-full transition hover:text-rose-600"><span className="rounded-full p-2 group-hover:bg-rose-50"><Heart className="h-4 w-4" /></span>{post.likeCount || 0}</button>
                    <button type="button" className="group inline-flex items-center gap-2 rounded-full transition hover:text-[var(--wedding-gold)]"><span className="rounded-full p-2 group-hover:bg-[var(--wedding-beige)]"><Share className="h-4 w-4" /></span></button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      <aside className="sticky top-20 hidden h-[calc(100vh-80px)] bg-white/70 px-5 py-6 xl:block">
        <div className="rounded-2xl bg-[#f4eee8] p-5"><h2 className="text-xl font-semibold">Rede fechada</h2><p className="mt-2 text-sm leading-6 text-[var(--wedding-text-light)]">Todos os convidados ja estao conectados. Nao precisa seguir ninguem: todo post visivel aparece para todo mundo.</p></div>
        <div className="mt-5 rounded-2xl border border-[var(--wedding-beige)] bg-white p-5">
          <h2 className="text-xl font-semibold">Atalhos</h2>
          <div className="mt-4 space-y-3">
            <Link to="/shopping/profile" className="flex items-center gap-3 hover:text-[var(--wedding-gold)]"><User className="h-5 w-5" />Editar perfil</Link>
            <Link to="/shopping/products" className="flex items-center gap-3 hover:text-[var(--wedding-gold)]"><Sparkles className="h-5 w-5" />Lista de presentes</Link>
            <Link to="/shopping" className="flex items-center gap-3 hover:text-[var(--wedding-gold)]"><Home className="h-5 w-5" />Inicio do shopping</Link>
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setShowMobileComposer(true)}
        className="fixed bottom-20 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#1d9bf0] text-white shadow-2xl lg:hidden"
        aria-label="Postar"
      >
        <Plus className="h-8 w-8" />
      </button>

      {showMobileComposer && (
        <div className="fixed inset-0 z-50 bg-black text-white lg:hidden">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <button type="button" onClick={() => setShowMobileComposer(false)} className="rounded-full p-2 hover:bg-white/10">
                <X className="h-6 w-6" />
              </button>
              <button type="submit" disabled={sending || !message.trim()} className="rounded-full bg-[#1d9bf0] px-5 py-2 font-semibold text-white disabled:opacity-50">
                {sending ? 'Postando...' : 'Postar'}
              </button>
            </div>

            <div className="flex flex-1 gap-3 px-4 py-4">
              <UserAvatar src={user?.avatarUrl} name={user?.name} className="h-11 w-11" />
              <div className="min-w-0 flex-1">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="h-52 w-full resize-none bg-transparent text-xl text-white outline-none placeholder:text-white/45"
                  placeholder="O que esta acontecendo?"
                  maxLength={280}
                  required
                  autoFocus
                />
                {image && <p className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/80">{image.name}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4 text-[#1d9bf0]">
              <label className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
                <ImagePlus className="h-6 w-6" />
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={(event) => setImage(event.target.files?.[0] || null)} />
              </label>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
