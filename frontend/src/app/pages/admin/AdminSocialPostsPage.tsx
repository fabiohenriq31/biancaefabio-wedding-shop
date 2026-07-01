import { Eye, EyeOff, Heart, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  deleteSocialPost,
  getAdminSocialPosts,
  hideSocialPost,
  showSocialPost,
  type SocialPostFilter,
} from '../../services/adminSocialPostsApi';
import type { SocialPost } from '../../types';

const filters: { label: string; value: SocialPostFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Visiveis', value: 'approved' },
  { label: 'Ocultos', value: 'hidden' },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AdminSocialPostsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [filter, setFilter] = useState<SocialPostFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const counters = useMemo(() => ({
    total: posts.length,
    visible: posts.filter((post) => post.status === 'approved').length,
    hidden: posts.filter((post) => post.status === 'hidden').length,
  }), [posts]);

  async function loadPosts() {
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      const data = await getAdminSocialPosts(token, filter);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [token, filter]);

  async function runAction(action: () => Promise<unknown>) {
    try {
      await action();
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar acao.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">B&F Social</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Posts dos convidados</h1>
        <p className="mt-2 text-[var(--wedding-text-light)]">
          Modere mensagens, fotos e curtidas publicadas no mural social.
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5"><p className="text-sm text-[var(--wedding-text-light)]">Carregados</p><p className="mt-2 text-2xl text-[var(--wedding-text)]">{counters.total}</p></div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5"><p className="text-sm text-[var(--wedding-text-light)]">Visiveis</p><p className="mt-2 text-2xl text-[var(--wedding-text)]">{counters.visible}</p></div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5"><p className="text-sm text-[var(--wedding-text-light)]">Ocultos</p><p className="mt-2 text-2xl text-[var(--wedding-text)]">{counters.hidden}</p></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-4 py-2 text-sm ${filter === item.value ? 'bg-[var(--wedding-text)] text-white' : 'bg-white text-[var(--wedding-text)]'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--wedding-text-light)]">Carregando posts...</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {posts.map((post) => {
            const visible = post.status === 'approved';
            return (
              <article key={post._id} className="overflow-hidden rounded-lg border border-[var(--wedding-beige)] bg-white shadow-sm">
                {post.imageUrl && (
                  <img src={post.thumbnailUrl || post.imageUrl} alt={post.authorName} className="h-64 w-full object-cover" />
                )}
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl text-[var(--wedding-text)]">{post.authorName || 'Convidado'}</h2>
                      <p className="text-sm text-[var(--wedding-text-light)]">{formatDate(post.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${visible ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {visible ? 'Visivel' : 'Oculto'}
                    </span>
                  </div>
                  <p className="text-[var(--wedding-text)]">{post.message}</p>
                  <p className="inline-flex items-center gap-2 text-sm text-[var(--wedding-text-light)]">
                    <Heart className="h-4 w-4 text-[var(--wedding-gold)]" />
                    {post.likeCount || 0} curtidas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {visible ? (
                      <button type="button" onClick={() => token && runAction(() => hideSocialPost(token, post._id))} className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-beige)] px-4 py-2 text-sm text-[var(--wedding-text)]"><EyeOff className="h-4 w-4" />Ocultar</button>
                    ) : (
                      <button type="button" onClick={() => token && runAction(() => showSocialPost(token, post._id))} className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-4 py-2 text-sm text-white"><Eye className="h-4 w-4" />Reexibir</button>
                    )}
                    <button type="button" onClick={() => { if (token && window.confirm('Excluir este post definitivamente?')) runAction(() => deleteSocialPost(token, post._id)); }} className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-4 py-2 text-sm text-red-700"><Trash2 className="h-4 w-4" />Excluir</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 text-[var(--wedding-text-light)]">
          Nenhum post encontrado.
        </p>
      )}
    </div>
  );
}
