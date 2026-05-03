import { Eye, EyeOff, Trash2 } from 'lucide-react';
import type { GuestPhoto } from '../../types';

type Props = {
  photo: GuestPhoto;
  onHide: (photo: GuestPhoto) => void;
  onShow: (photo: GuestPhoto) => void;
  onDelete: (photo: GuestPhoto) => void;
};

export function GuestPhotoModerationCard({ photo, onHide, onShow, onDelete }: Props) {
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(photo.createdAt));

  const isHidden = photo.status === 'hidden';

  return (
    <article className="overflow-hidden rounded-lg border border-[var(--wedding-beige)] bg-white shadow-sm">
      <div className="aspect-[4/3] bg-[var(--wedding-beige)]">
        <img
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={`Foto enviada por ${photo.guestName}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg text-[var(--wedding-text)]">{photo.guestName}</h3>
            <p className="text-sm text-[var(--wedding-text-light)]">{date}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs ${
              isHidden
                ? 'bg-red-50 text-red-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isHidden ? 'Oculta' : 'Visível'}
          </span>
        </div>

        <div className="flex gap-2">
          {isHidden ? (
            <button
              type="button"
              onClick={() => onShow(photo)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--wedding-text)] px-3 py-2 text-sm text-white"
            >
              <Eye className="h-4 w-4" />
              Reexibir
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onHide(photo)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--wedding-beige)] px-3 py-2 text-sm text-[var(--wedding-text)]"
            >
              <EyeOff className="h-4 w-4" />
              Ocultar
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(photo)}
            className="flex items-center justify-center rounded-lg border border-red-100 px-3 py-2 text-red-700"
            aria-label="Excluir foto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
