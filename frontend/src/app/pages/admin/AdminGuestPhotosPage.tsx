import { useEffect, useMemo, useState } from 'react';
import { GuestPhotoModerationCard } from '../../components/admin/GuestPhotoModerationCard';
import { useAuth } from '../../contexts/AuthContext';
import {
  deleteGuestPhoto,
  getAdminGuestPhotos,
  hideGuestPhoto,
  showGuestPhoto,
  type GuestPhotoFilter,
} from '../../services/adminGuestPhotosApi';
import type { GuestPhoto } from '../../types';

const filters: Array<{ label: string; value: GuestPhotoFilter }> = [
  { label: 'Todas', value: 'all' },
  { label: 'Visíveis', value: 'approved' },
  { label: 'Ocultas', value: 'hidden' },
];

export function AdminGuestPhotosPage() {
  const { token } = useAuth();
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [filter, setFilter] = useState<GuestPhotoFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPhotos() {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      setPhotos(await getAdminGuestPhotos(token, filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fotos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, [token, filter]);

  const counts = useMemo(() => ({
    all: photos.length,
    visible: photos.filter((photo) => photo.status === 'approved').length,
    hidden: photos.filter((photo) => photo.status === 'hidden').length,
  }), [photos]);

  async function runAction(action: () => Promise<unknown>) {
    try {
      await action();
      await loadPhotos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar foto');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Galeria pública</p>
          <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Fotos dos convidados</h1>
          <p className="mt-2 text-[var(--wedding-text-light)]">
            Oculte, reexiba ou remova fotos do mural público do casamento.
          </p>
        </div>

        <div className="flex gap-2">
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
          <p className="text-sm text-[var(--wedding-text-light)]">Listadas neste filtro</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{counts.all}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Visíveis</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{counts.visible}</p>
        </div>
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-5">
          <p className="text-sm text-[var(--wedding-text-light)]">Ocultas</p>
          <p className="mt-2 text-2xl text-[var(--wedding-text)]">{counts.hidden}</p>
        </div>
      </div>

      {loading && <p className="text-[var(--wedding-text-light)]">Carregando fotos...</p>}
      {error && <p className="text-red-700">{error}</p>}

      {!loading && !error && photos.length === 0 && (
        <div className="rounded-lg border border-[var(--wedding-beige)] bg-white p-8 text-center text-[var(--wedding-text-light)]">
          Nenhuma foto encontrada.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo) => (
          <GuestPhotoModerationCard
            key={photo._id}
            photo={photo}
            onHide={(item) => token && runAction(() => hideGuestPhoto(token, item._id))}
            onShow={(item) => token && runAction(() => showGuestPhoto(token, item._id))}
            onDelete={(item) => {
              if (!token) return;
              if (window.confirm('Excluir esta foto definitivamente?')) {
                runAction(() => deleteGuestPhoto(token, item._id));
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
