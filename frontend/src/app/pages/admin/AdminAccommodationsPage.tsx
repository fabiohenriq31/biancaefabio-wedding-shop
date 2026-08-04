import {
  BedDouble,
  BedSingle,
  Building2,
  ChevronRight,
  CirclePlus,
  EllipsisVertical,
  LayoutList,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  createAccommodation,
  deleteAccommodation,
  getAdminAccommodations,
  updateAccommodation,
  type AccommodationPayload,
} from '../../services/adminAccommodationsApi';
import type {
  Accommodation,
  AccommodationGuest,
  AccommodationStatus,
  AccommodationType,
  AdminAccommodationsData,
} from '../../types';

type AccommodationFilter = 'all' | AccommodationType | 'unavailable';

const filterOptions: Array<{ label: string; value: AccommodationFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Suítes', value: 'suite' },
  { label: 'Quartos Comuns', value: 'common' },
  { label: 'Indisponível', value: 'unavailable' },
];

function roomTypeLabel(type: AccommodationType) {
  return type === 'suite' ? 'Suíte' : 'Comum';
}

function statusLabel(status: AccommodationStatus) {
  return status === 'available' ? 'Disponível' : 'Indisponível';
}

function capacityOf(accommodation: Pick<Accommodation, 'fixedBeds' | 'extraMattresses' | 'extraPlaces'>) {
  return Number(accommodation.fixedBeds || 0) + Number(accommodation.extraMattresses || 0) + Number(accommodation.extraPlaces || 0);
}

function occupancyOf(accommodation: Accommodation) {
  return accommodation.assignedGuests.length;
}

function typeBadgeClass(type: AccommodationType) {
  return type === 'suite'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-amber-50 text-amber-700 border-amber-100';
}

function statusBadgeClass(status: AccommodationStatus) {
  return status === 'available'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-neutral-100 text-neutral-700 border-neutral-200';
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BedDouble;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(98,90,82,0.12)] bg-white px-7 py-5 shadow-[0_10px_30px_rgba(42,37,33,0.05)]">
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[rgba(63,92,68,0.18)] bg-[rgba(246,242,236,0.75)] text-[var(--wedding-text)]">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-4xl leading-none text-[var(--wedding-text)]">{value}</p>
          <p className="mt-2 text-sm text-[var(--wedding-text-light)]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function emptyAccommodationForm(): AccommodationPayload {
  return {
    name: '',
    type: 'common',
    status: 'available',
    bedDescription: '',
    fixedBeds: 0,
    extraMattresses: 0,
    extraPlaces: 0,
    notes: '',
    guestIds: [],
  };
}

export function AdminAccommodationsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminAccommodationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<AccommodationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAccommodationId, setEditingAccommodationId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [guestSearch, setGuestSearch] = useState('');
  const [form, setForm] = useState<AccommodationPayload>(emptyAccommodationForm());

  async function loadAccommodations() {
    if (!token) return;

    setLoading(true);

    try {
      const response = await getAdminAccommodations(token);
      setData(response);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar hospedagens');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccommodations();
  }, [token]);

  const visibleAccommodations = useMemo(() => {
    const items = data?.accommodations || [];
    const query = searchQuery.trim().toLowerCase();

    return items.filter((accommodation) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'unavailable' ? accommodation.status === 'unavailable' : accommodation.type === activeFilter);

      const haystack = [
        accommodation.name,
        accommodation.bedDescription,
        accommodation.notes,
        ...accommodation.assignedGuests.map((guest) => guest.name),
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || haystack.includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, data?.accommodations, searchQuery]);

  const guestOptions = useMemo(() => {
    const guests = data?.guests || [];
    const query = guestSearch.trim().toLowerCase();

    return guests.filter((guest) => {
      if (!query) return true;
      return guest.name.toLowerCase().includes(query);
    });
  }, [data?.guests, guestSearch]);

  const filteredCounts = useMemo(() => {
    const items = data?.accommodations || [];

    return {
      all: items.length,
      suite: items.filter((item) => item.type === 'suite').length,
      common: items.filter((item) => item.type === 'common').length,
      unavailable: items.filter((item) => item.status === 'unavailable').length,
    };
  }, [data?.accommodations]);

  const mattressBreakdown = useMemo(() => {
    const items = data?.accommodations || [];
    const total = items.reduce((sum, item) => sum + Number(item.extraMattresses || 0), 0);

    return [
      { label: 'Solteiro', quantity: total },
      { label: 'Casal', quantity: 0 },
      { label: 'Inflável solteiro', quantity: 0 },
      { label: 'Inflável casal', quantity: 0 },
    ];
  }, [data?.accommodations]);

  const extraLocations = useMemo(() => {
    return (data?.accommodations || [])
      .filter((item) => Number(item.extraPlaces || 0) > 0)
      .map((item) => ({
        label: item.name,
        quantity: Number(item.extraPlaces || 0),
      }));
  }, [data?.accommodations]);

  function openCreateForm() {
    setShowCreateForm(true);
    setEditingAccommodationId(null);
    setGuestSearch('');
    setForm(emptyAccommodationForm());
  }

  function openEditForm(accommodation: Accommodation) {
    setShowCreateForm(true);
    setEditingAccommodationId(accommodation._id);
    setGuestSearch('');
    setForm({
      name: accommodation.name,
      type: accommodation.type,
      status: accommodation.status,
      bedDescription: accommodation.bedDescription || '',
      fixedBeds: Number(accommodation.fixedBeds || 0),
      extraMattresses: Number(accommodation.extraMattresses || 0),
      extraPlaces: Number(accommodation.extraPlaces || 0),
      notes: accommodation.notes || '',
      guestIds: [...accommodation.guestIds],
    });
  }

  function closeForm() {
    setShowCreateForm(false);
    setEditingAccommodationId(null);
    setGuestSearch('');
    setForm(emptyAccommodationForm());
  }

  function toggleGuest(guest: AccommodationGuest) {
    setForm((current) => {
      const alreadySelected = current.guestIds.includes(guest._id);
      return {
        ...current,
        guestIds: alreadySelected
          ? current.guestIds.filter((id) => id !== guest._id)
          : [...current.guestIds, guest._id],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      setSaving(true);

      if (editingAccommodationId) {
        await updateAccommodation(token, editingAccommodationId, form);
      } else {
        await createAccommodation(token, form);
      }

      closeForm();
      await loadAccommodations();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar hospedagem');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(accommodation: Accommodation) {
    if (!token || !window.confirm(`Excluir ${accommodation.name}?`)) return;

    try {
      await deleteAccommodation(token, accommodation._id);
      await loadAccommodations();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir hospedagem');
    }
  }

  const summary = data?.summary;

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-5xl leading-tight text-[var(--wedding-text)]">Hospedagens</h1>
          <p className="mt-2 text-base text-[var(--wedding-text-light)]">
            Gerencie quartos, camas, capacidade e os convidados alocados em cada local.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(98,90,82,0.16)] bg-white px-5 py-3 text-sm text-[var(--wedding-text)] shadow-[0_8px_24px_rgba(42,37,33,0.04)]"
          >
            <LayoutList className="h-4 w-4" />
            Relatório de ocupação
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2f5a3d] px-5 py-3 text-sm text-white shadow-[0_12px_30px_rgba(47,90,61,0.22)]"
          >
            <Plus className="h-4 w-4" />
            Adicionar hospedagem
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={BedDouble} value={summary.totalRooms} label="Hospedagens cadastradas" />
          <StatCard icon={BedSingle} value={summary.fixedBeds} label="Camas fixas disponíveis" />
          <StatCard icon={Building2} value={summary.extraMattresses} label="Colchões avulsos disponíveis" />
          <StatCard icon={CirclePlus} value={summary.extraPlaces} label="Locais extras disponíveis" />
          <StatCard icon={Users} value={summary.totalCapacity} label="Capacidade total" />
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[rgba(98,90,82,0.12)] bg-white p-6 shadow-[0_14px_40px_rgba(42,37,33,0.06)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl text-[var(--wedding-text)]">
                {editingAccommodationId ? 'Editar hospedagem' : 'Adicionar hospedagem'}
              </h2>
              <p className="mt-1 text-sm text-[var(--wedding-text-light)]">
                Vincule os convidados do quarto e ajuste a capacidade total do local.
              </p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-[rgba(98,90,82,0.16)] px-4 py-2 text-sm text-[var(--wedding-text)]"
            >
              Fechar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none"
                  placeholder="Nome da hospedagem"
                />
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as AccommodationType }))}
                  className="rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none"
                >
                  <option value="suite">Suíte</option>
                  <option value="common">Comum</option>
                </select>
                <textarea
                  value={form.bedDescription}
                  onChange={(event) => setForm((current) => ({ ...current, bedDescription: event.target.value }))}
                  className="min-h-24 rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none md:col-span-2"
                  placeholder="Descrição das camas"
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.fixedBeds}
                  onChange={(event) => setForm((current) => ({ ...current, fixedBeds: Number(event.target.value || 0) }))}
                  className="rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none"
                  placeholder="Camas fixas"
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.extraMattresses}
                  onChange={(event) => setForm((current) => ({ ...current, extraMattresses: Number(event.target.value || 0) }))}
                  className="rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none"
                  placeholder="Colchões avulsos"
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.extraPlaces}
                  onChange={(event) => setForm((current) => ({ ...current, extraPlaces: Number(event.target.value || 0) }))}
                  className="rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none"
                  placeholder="Locais extras"
                />
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as AccommodationStatus }))}
                  className="rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none"
                >
                  <option value="available">Disponível</option>
                  <option value="unavailable">Indisponível</option>
                </select>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  className="min-h-24 rounded-2xl border border-[rgba(98,90,82,0.14)] bg-[#fbfaf7] px-4 py-3 outline-none md:col-span-2"
                  placeholder="Observações"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[rgba(98,90,82,0.12)] bg-[#fcfaf6] p-5">
              <div className="mb-4">
                <h3 className="text-lg text-[var(--wedding-text)]">Convidados hospedados</h3>
                <p className="mt-1 text-sm text-[var(--wedding-text-light)]">
                  Selecione as pessoas que ficarão neste local.
                </p>
              </div>

              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[rgba(98,90,82,0.12)] bg-white px-4 py-3">
                <Search className="h-4 w-4 text-[var(--wedding-text-light)]" />
                <input
                  value={guestSearch}
                  onChange={(event) => setGuestSearch(event.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Buscar convidado"
                />
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {guestOptions.map((guest) => {
                  const selected = form.guestIds.includes(guest._id);
                  return (
                    <label
                      key={guest._id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                        selected
                          ? 'border-[rgba(47,90,61,0.28)] bg-[rgba(47,90,61,0.06)]'
                          : 'border-[rgba(98,90,82,0.12)] bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleGuest(guest)}
                        className="mt-1 h-4 w-4"
                      />
                      <span>
                        <span className="block text-sm text-[var(--wedding-text)]">{guest.name}</span>
                        <span className="block text-xs text-[var(--wedding-text-light)]">
                          {guest.status === 'confirmed' ? 'Confirmado' : 'Não confirmado'} · {guest.isChild ? 'Criança' : 'Pagante'}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm text-[var(--wedding-text-light)]">
                Ocupação atual do formulário: <strong className="text-[var(--wedding-text)]">{form.guestIds.length}</strong> de{' '}
                <strong className="text-[var(--wedding-text)]">{capacityOf(form)}</strong> vagas.
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#2f5a3d] px-6 py-3 text-sm text-white shadow-[0_12px_30px_rgba(47,90,61,0.22)] disabled:opacity-60"
            >
              {saving ? 'Salvando...' : editingAccommodationId ? 'Salvar alterações' : 'Adicionar hospedagem'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl border border-[rgba(98,90,82,0.16)] px-6 py-3 text-sm text-[var(--wedding-text)]"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <section className="rounded-3xl border border-[rgba(98,90,82,0.12)] bg-white shadow-[0_14px_40px_rgba(42,37,33,0.06)]">
        <div className="flex flex-col gap-4 border-b border-[rgba(98,90,82,0.12)] px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex flex-wrap gap-6">
            {filterOptions.map((item) => {
              const count =
                item.value === 'all'
                  ? filteredCounts.all
                  : item.value === 'suite'
                    ? filteredCounts.suite
                    : item.value === 'common'
                      ? filteredCounts.common
                      : filteredCounts.unavailable;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveFilter(item.value)}
                  className={`border-b-2 pb-3 text-sm transition ${
                    activeFilter === item.value
                      ? 'border-[#2f5a3d] text-[var(--wedding-text)]'
                      : 'border-transparent text-[var(--wedding-text-light)]'
                  }`}
                >
                  {item.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3 rounded-2xl border border-[rgba(98,90,82,0.12)] bg-white px-4 py-3">
              <Search className="h-4 w-4 text-[var(--wedding-text-light)]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="bg-transparent outline-none"
                placeholder="Buscar hospedagem..."
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(98,90,82,0.12)] bg-white px-4 py-3 text-sm text-[var(--wedding-text)]"
            >
              <EllipsisVertical className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-2 pb-2 lg:px-4">
          <table className="min-w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-[var(--wedding-text-light)]">
                <th className="px-4 py-3">Hospedagem</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Descrição das camas</th>
                <th className="px-4 py-3">Camas Fixas</th>
                <th className="px-4 py-3">Colchões Avulsos</th>
                <th className="px-4 py-3">Locais Extras</th>
                <th className="px-4 py-3">Capacidade Total</th>
                <th className="px-4 py-3">Ocupadas</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-[var(--wedding-text-light)]" colSpan={10}>
                    Carregando hospedagens...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-6 text-red-700" colSpan={10}>
                    {error}
                  </td>
                </tr>
              ) : visibleAccommodations.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-[var(--wedding-text-light)]" colSpan={10}>
                    Nenhuma hospedagem encontrada.
                  </td>
                </tr>
              ) : (
                visibleAccommodations.map((accommodation) => (
                  <tr
                    key={accommodation._id}
                    className="rounded-2xl bg-white text-sm shadow-[0_6px_18px_rgba(42,37,33,0.03)]"
                  >
                    <td className="rounded-l-2xl px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(98,90,82,0.12)] bg-[#fcfaf6]">
                          <BedDouble className="h-4 w-4 text-[var(--wedding-text)]" />
                        </span>
                        <span className="font-medium text-[var(--wedding-text)]">{accommodation.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs ${typeBadgeClass(accommodation.type)}`}>
                        {roomTypeLabel(accommodation.type)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[var(--wedding-text-light)]">
                      <div className="max-w-[280px] whitespace-pre-line leading-6">{accommodation.bedDescription || 'Sem descrição'}</div>
                    </td>
                    <td className="px-4 py-4 text-[var(--wedding-text)]">{accommodation.fixedBeds}</td>
                    <td className="px-4 py-4 text-[var(--wedding-text)]">{accommodation.extraMattresses}</td>
                    <td className="px-4 py-4 text-[var(--wedding-text)]">{accommodation.extraPlaces}</td>
                    <td className="px-4 py-4 text-[var(--wedding-text)]">{capacityOf(accommodation)} pessoas</td>
                    <td className="px-4 py-4 text-[var(--wedding-text)]">{occupancyOf(accommodation)} pessoas</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusBadgeClass(accommodation.status)}`}>
                        {statusLabel(accommodation.status)}
                      </span>
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(accommodation)}
                          className="rounded-xl border border-[rgba(98,90,82,0.12)] p-2 text-[var(--wedding-text)]"
                          title="Editar hospedagem"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(accommodation)}
                          className="rounded-xl border border-red-100 p-2 text-red-700"
                          title="Excluir hospedagem"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-[rgba(98,90,82,0.12)] bg-white p-6 shadow-[0_12px_30px_rgba(42,37,33,0.05)]">
          <h2 className="text-3xl text-[var(--wedding-text)]">Colchões Avulsos</h2>
          <p className="mt-1 text-sm text-[var(--wedding-text-light)]">
            Gerencie os colchões extras disponíveis para acomodação.
          </p>
          <div className="mt-6 grid grid-cols-[90px_1fr] gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[rgba(98,90,82,0.12)] bg-[#fcfaf6]">
              <Building2 className="h-10 w-10 text-[var(--wedding-text)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--wedding-text-light)]">Total disponível</p>
              <p className="mt-1 text-5xl leading-none text-[var(--wedding-text)]">{summary?.extraMattresses || 0}</p>
              <p className="mt-2 text-sm text-[var(--wedding-text-light)]">colchões avulsos</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {mattressBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-[rgba(98,90,82,0.08)] pb-3 text-sm last:border-0">
                <span className="text-[var(--wedding-text)]">{item.label}</span>
                <span className="text-[var(--wedding-text-light)]">{item.quantity}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(98,90,82,0.14)] px-4 py-3 text-sm text-[var(--wedding-text)]"
          >
            <Plus className="h-4 w-4" />
            Adicionar hospedagem
          </button>
        </section>

        <section className="rounded-3xl border border-[rgba(98,90,82,0.12)] bg-white p-6 shadow-[0_12px_30px_rgba(42,37,33,0.05)]">
          <h2 className="text-3xl text-[var(--wedding-text)]">Locais Extras</h2>
          <p className="mt-1 text-sm text-[var(--wedding-text-light)]">
            Locais onde ainda é possível encaixar colchões ou hóspedes.
          </p>
          <div className="mt-6 grid grid-cols-[90px_1fr] gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-[rgba(47,90,61,0.35)] bg-[#fcfaf6]">
              <CirclePlus className="h-10 w-10 text-[#2f5a3d]" />
            </div>
            <div>
              <p className="text-sm text-[var(--wedding-text-light)]">Total disponível</p>
              <p className="mt-1 text-5xl leading-none text-[var(--wedding-text)]">{summary?.extraPlaces || 0}</p>
              <p className="mt-2 text-sm text-[var(--wedding-text-light)]">locais extras</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {extraLocations.length === 0 ? (
              <p className="text-sm text-[var(--wedding-text-light)]">Nenhum local extra cadastrado ainda.</p>
            ) : (
              extraLocations.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-[rgba(98,90,82,0.08)] pb-3 text-sm last:border-0">
                  <span className="text-[var(--wedding-text)]">{item.label}</span>
                  <span className="text-[var(--wedding-text-light)]">{item.quantity}</span>
                </div>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(98,90,82,0.14)] px-4 py-3 text-sm text-[var(--wedding-text)]"
          >
            <Plus className="h-4 w-4" />
            Adicionar local extra
          </button>
        </section>

        <section className="rounded-3xl border border-[rgba(98,90,82,0.12)] bg-white p-6 shadow-[0_12px_30px_rgba(42,37,33,0.05)]">
          <h2 className="text-3xl text-[var(--wedding-text)]">Adicionar acomodação</h2>
          <p className="mt-1 text-sm text-[var(--wedding-text-light)]">
            Cadastre rápido novos espaços de acomodação para o sítio.
          </p>
          <div className="mt-6 space-y-3">
            {[
              { icon: BedDouble, title: 'Adicionar Dormitório', subtitle: 'Cadastrar um novo quarto ou suíte' },
              { icon: Building2, title: 'Adicionar Colchões', subtitle: 'Cadastrar colchões avulsos' },
              { icon: CirclePlus, title: 'Adicionar Local Extra', subtitle: 'Cadastrar local para colchões' },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={openCreateForm}
                className="flex w-full items-center justify-between rounded-2xl border border-[rgba(98,90,82,0.12)] bg-white px-4 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(98,90,82,0.12)] bg-[#fcfaf6]">
                    <item.icon className="h-5 w-5 text-[var(--wedding-text)]" />
                  </span>
                  <span>
                    <span className="block text-sm text-[var(--wedding-text)]">{item.title}</span>
                    <span className="block text-xs text-[var(--wedding-text-light)]">{item.subtitle}</span>
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--wedding-text-light)]" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {summary && (
        <section className="rounded-2xl border border-[rgba(47,90,61,0.15)] bg-[rgba(246,242,236,0.9)] px-5 py-4 shadow-[0_8px_20px_rgba(42,37,33,0.04)]">
          <div className="flex flex-col gap-4 text-sm text-[var(--wedding-text)] xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-8">
              <span>Capacidade atual: {summary.totalCapacity} pessoas</span>
              <span>Ocupadas: {summary.occupiedPlaces} pessoas ({summary.totalCapacity ? Math.round((summary.occupiedPlaces / summary.totalCapacity) * 100) : 0}%)</span>
              <span>Disponíveis: {summary.availablePlaces} pessoas ({summary.totalCapacity ? Math.round((summary.availablePlaces / summary.totalCapacity) * 100) : 0}%)</span>
            </div>
            <button type="button" className="inline-flex items-center gap-2 text-sm text-[var(--wedding-text)]">
              Ver relatório completo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
