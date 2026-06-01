import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  createAdminDayScheduleItem,
  deleteAdminDayScheduleItem,
  getAdminDaySchedule,
  updateAdminDayScheduleItem,
  type DaySchedulePayload,
} from '../../services/adminDayScheduleApi';
import type { DayScheduleItem, WeddingDayKey } from '../../types';

const dayLabels: Record<WeddingDayKey, string> = {
  friday: 'Sexta',
  saturday: 'Sabado',
  sunday: 'Domingo',
};

const initialForm: DaySchedulePayload = {
  dayKey: 'friday',
  startTime: '',
  endTime: '',
  title: '',
  location: '',
  notes: '',
};

export function AdminDaySchedulePage() {
  const { token } = useAuth();
  const [items, setItems] = useState<DayScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DaySchedulePayload>(initialForm);

  async function loadItems() {
    if (!token) return;
    setLoading(true);
    try {
      setItems(await getAdminDaySchedule(token));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [token]);

  const groupedItems = useMemo(() => {
    return {
      friday: items.filter((item) => item.dayKey === 'friday'),
      saturday: items.filter((item) => item.dayKey === 'saturday'),
      sunday: items.filter((item) => item.dayKey === 'sunday'),
    };
  }, [items]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      if (editingId) {
        await updateAdminDayScheduleItem(token, editingId, form);
      } else {
        await createAdminDayScheduleItem(token, form);
      }

      setEditingId(null);
      setForm(initialForm);
      await loadItems();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar compromisso');
    }
  }

  function startEdit(item: DayScheduleItem) {
    setEditingId(item._id);
    setForm({
      dayKey: item.dayKey,
      startTime: item.startTime,
      endTime: item.endTime || '',
      title: item.title,
      location: item.location || '',
      notes: item.notes || '',
    });
  }

  async function handleDelete(item: DayScheduleItem) {
    if (!token || !window.confirm(`Excluir "${item.title}"?`)) return;
    await deleteAdminDayScheduleItem(token, item._id);
    await loadItems();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--wedding-gold)]">Planejamento</p>
        <h1 className="mt-2 text-4xl text-[var(--wedding-text)]">Organizacao do dia</h1>
        <p className="mt-2 text-[var(--wedding-text-light)]">
          Monte a agenda completa de sexta a domingo para acompanhar cada horario do casamento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-[var(--wedding-gold)]" />
          <h2 className="text-2xl text-[var(--wedding-text)]">{editingId ? 'Editar compromisso' : 'Novo compromisso'}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <select value={form.dayKey} onChange={(event) => setForm((current) => ({ ...current, dayKey: event.target.value as WeddingDayKey }))} className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none">
            <option value="friday">Sexta</option>
            <option value="saturday">Sabado</option>
            <option value="sunday">Domingo</option>
          </select>
          <input type="time" value={form.startTime} onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" required />
          <input type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none" />
          <input type="text" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none md:col-span-2 xl:col-span-3" placeholder="Titulo do compromisso" required />
          <input type="text" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none md:col-span-2 xl:col-span-3" placeholder="Local" />
          <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="min-h-28 rounded-lg bg-[var(--wedding-beige)] px-4 py-3 outline-none md:col-span-2 xl:col-span-3" placeholder="Observacoes" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--wedding-text)] px-5 py-3 text-sm text-white">
            <Plus className="h-4 w-4" />
            {editingId ? 'Salvar alteracoes' : 'Adicionar compromisso'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded-lg border border-[var(--wedding-beige)] px-5 py-3 text-sm text-[var(--wedding-text)]">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-[var(--wedding-text-light)]">Carregando organizacao...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {(Object.keys(dayLabels) as WeddingDayKey[]).map((dayKey) => (
            <section key={dayKey} className="rounded-lg border border-[var(--wedding-beige)] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl text-[var(--wedding-text)]">{dayLabels[dayKey]}</h2>

              {groupedItems[dayKey].length === 0 ? (
                <p className="text-[var(--wedding-text-light)]">Nenhum compromisso cadastrado.</p>
              ) : (
                <div className="space-y-4">
                  {groupedItems[dayKey].map((item) => (
                    <article key={item._id} className="rounded-lg border border-[var(--wedding-beige)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.16em] text-[var(--wedding-gold)]">
                            {item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}
                          </p>
                          <h3 className="mt-2 text-xl text-[var(--wedding-text)]">{item.title}</h3>
                          {item.location && <p className="mt-2 text-sm text-[var(--wedding-text-light)]">{item.location}</p>}
                          {item.notes && <p className="mt-3 text-sm text-[var(--wedding-text)]">{item.notes}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEdit(item)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--wedding-beige)] text-[var(--wedding-text)]">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => handleDelete(item)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
