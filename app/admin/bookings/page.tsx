'use client';

// Backoffice du système de réservation : agenda des réservations + configuration des pages
// de réservation (une par offre / établissement), avec aperçu live du widget public.
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, CalendarCheck, CalendarDays, ChevronLeft, ChevronRight, Clock, Code2, Copy, ExternalLink, FileText,
  LayoutList, Mail, Phone, Plus, RefreshCw, Search, Settings2, Trash2, Users, X,
} from 'lucide-react';
import BookingWidget from '@/components/booking/BookingWidget';
import { Select } from '@/components/forms/Select';
import { BookingError, bookingPagesService, bookingsService, normalizeSlug } from '@/lib/booking/service';
import { addDaysKey, dateKey, weekdayOf, zonedToUtc } from '@/lib/booking/slots';
import {
  LOCATION_LABELS, PAGE_TEMPLATES, STATUS_META,
  type Booking, type BookingField, type BookingPage, type BookingStatus, type LocationType, type TimeWindow,
} from '@/lib/booking/types';

const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];
const PRIMARY = '#7967FF';
const INK = '#0F172A';
const MUTED = '#64748B';
const FAINT = '#94A3B8';
const BORDER = '#E2E8F0';
const SURFACE = '#F8FAFC';

const WEEKDAY_LABELS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const TIMEZONES = ['Europe/Paris', 'Europe/Brussels', 'Africa/Douala', 'Africa/Libreville', 'Africa/Abidjan', 'Africa/Dakar', 'Africa/Casablanca', 'America/Montreal', 'UTC'];

type Tab = 'bookings' | 'pages';
type EditorTab = 'general' | 'availability' | 'form' | 'share';
type Period = 'upcoming' | 'past' | 'all';
type Toast = { kind: 'success' | 'error'; message: string };

const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10));

export default function BookingsAdminPage() {
  return <Suspense fallback={null}><BookingsAdminContent /></Suspense>;
}

function BookingsAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('bookings');
  const [pages, setPages] = useState<BookingPage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Réservations
  const [pageFilter, setPageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [period, setPeriod] = useState<Period>('upcoming');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [adminZone, setAdminZone] = useState('Europe/Paris');
  const [weekStart, setWeekStart] = useState('');
  const [manualOpen, setManualOpen] = useState(false);

  // Pages
  const [draft, setDraft] = useState<BookingPage | null>(null);
  const [editorTab, setEditorTab] = useState<EditorTab>('general');
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((kind: Toast['kind'], message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ kind, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    let cancelled = false;
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');
    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setAuthorized(true);
      router.replace('/admin/bookings');
      return;
    }
    const verify = async () => {
      if (storedAuth === 'true') { setAuthorized(true); return; }
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const session = await response.json();
        if (!cancelled && session?.user?.email && ADMIN_ALLOWED_EMAILS.includes(session.user.email)) {
          localStorage.setItem('ozirus_admin_auth', 'true');
          setAuthorized(true);
          return;
        }
      } catch (error) { console.error('Admin session check error:', error); }
      if (!cancelled) { setAuthorized(false); router.replace('/login'); }
    };
    verify();
    return () => { cancelled = true; };
  }, [router, searchParams]);

  useEffect(() => {
    let zone = 'Europe/Paris';
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || zone; } catch { /* défaut */ }
    setAdminZone(zone);
    const today = dateKey(Date.now(), zone);
    setWeekStart(addDaysKey(today, -((weekdayOf(today) + 6) % 7)));
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [loadedPages, loadedBookings] = await Promise.all([bookingPagesService.list(), bookingsService.list()]);
      setPages(loadedPages);
      setBookings(loadedBookings);
    } catch (error) {
      console.error('Unable to load bookings', error);
      setLoadError('Impossible de charger les réservations. Vérifiez la connexion Firestore (règles déployées ?).');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (authorized) reload(); }, [authorized, reload]);

  const pageById = useMemo(() => new Map(pages.map(page => [page.id, page])), [pages]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const now = Date.now();
    return bookings
      .filter(booking => pageFilter === 'ALL' || booking.pageId === pageFilter)
      .filter(booking => statusFilter === 'ALL' || booking.status === statusFilter)
      .filter(booking => period === 'all' || (period === 'upcoming' ? Date.parse(booking.end) >= now : Date.parse(booking.end) < now))
      .filter(booking => !term || [booking.name, booking.email, booking.phone, booking.pageTitle].some(value => value?.toLowerCase().includes(term)))
      .sort((a, b) => (period === 'past' ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start)));
  }, [bookings, pageFilter, statusFilter, period, search]);

  const grouped = useMemo(() => {
    const groups: { key: string; items: Booking[] }[] = [];
    for (const booking of filtered) {
      const key = dateKey(Date.parse(booking.start), adminZone);
      const last = groups[groups.length - 1];
      if (last?.key === key) last.items.push(booking); else groups.push({ key, items: [booking] });
    }
    return groups;
  }, [filtered, adminZone]);

  const stats = useMemo(() => {
    const now = Date.now();
    const upcoming = bookings.filter(booking => Date.parse(booking.start) >= now && booking.status !== 'cancelled');
    return {
      upcoming: upcoming.length,
      pending: bookings.filter(booking => booking.status === 'pending' && Date.parse(booking.start) >= now).length,
      week: upcoming.filter(booking => Date.parse(booking.start) < now + 7 * 86_400_000).length,
    };
  }, [bookings]);

  const selected = bookings.find(booking => booking.id === selectedId) ?? null;

  const changeStatus = async (booking: Booking, status: BookingStatus) => {
    if (status === 'cancelled' && !confirm(`Annuler la réservation de ${booking.name} ? Le créneau sera libéré.`)) return;
    setBusy(true);
    try {
      const updated = await bookingsService.setStatus(booking.id, status);
      setBookings(list => list.map(item => (item.id === booking.id ? updated : item)));
      showToast('success', `Réservation : ${STATUS_META[status].label.toLowerCase()}.`);
    } catch (error) {
      console.error(error);
      showToast('error', error instanceof BookingError ? error.message : 'Erreur lors du changement de statut.');
    } finally {
      setBusy(false);
    }
  };

  const saveNotes = async (booking: Booking, notes: string) => {
    if (notes === booking.notes) return;
    try {
      await bookingsService.updateNotes(booking.id, notes);
      setBookings(list => list.map(item => (item.id === booking.id ? { ...item, notes } : item)));
      showToast('success', 'Note enregistrée.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Impossible d\'enregistrer la note.');
    }
  };

  const createManual = async (page: BookingPage, input: { date: string; time: string; name: string; email: string; phone: string; partySize: number; note: string }) => {
    setBusy(true);
    try {
      const start = new Date(zonedToUtc(input.date, input.time, page.timezone)).toISOString();
      const booking = await bookingsService.create(page, {
        start, name: input.name, email: input.email, phone: input.phone, partySize: input.partySize,
        answers: input.note ? { note: input.note } : {}, guestTimezone: page.timezone, source: 'admin',
      }, { skipSlotCheck: true, status: 'confirmed' });
      setBookings(list => [booking, ...list]);
      setSelectedId(booking.id);
      setManualOpen(false);
      showToast('success', 'Réservation ajoutée.');
    } catch (error) {
      console.error(error);
      showToast('error', error instanceof BookingError ? error.message : 'Impossible d\'ajouter la réservation.');
    } finally {
      setBusy(false);
    }
  };

  /* ─── pages ─── */
  const startPage = (template: keyof typeof PAGE_TEMPLATES) => {
    const base = PAGE_TEMPLATES[template];
    const taken = new Set(pages.map(page => page.slug));
    let slug = base.slug;
    for (let index = 2; taken.has(slug); index += 1) slug = `${base.slug}-${index}`;
    setDraft({ ...structuredClone(base), slug, id: newId(), createdAt: '', updatedAt: '' });
    setEditorTab('general');
  };

  const savePage = async () => {
    if (!draft) return;
    if (!draft.title.trim()) { showToast('error', 'Le titre est obligatoire.'); return; }
    setSaving(true);
    try {
      const saved = await bookingPagesService.save({ ...draft, createdAt: draft.createdAt || undefined });
      setPages(list => [saved, ...list.filter(page => page.id !== saved.id)]);
      setDraft(saved);
      showToast('success', 'Page de réservation enregistrée.');
    } catch (error) {
      console.error(error);
      showToast('error', error instanceof BookingError ? error.message : 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const deactivatePage = async (page: BookingPage) => {
    if (!confirm(`Désactiver « ${page.title} » ? Le lien public ne prendra plus de réservations (l'historique est conservé).`)) return;
    try {
      await bookingPagesService.remove(page.id);
      setPages(list => list.map(item => (item.id === page.id ? { ...item, active: false } : item)));
      if (draft?.id === page.id) setDraft({ ...draft, active: false });
      showToast('success', 'Page désactivée.');
    } catch (error) {
      console.error(error);
      showToast('error', 'Impossible de désactiver la page.');
    }
  };

  if (!authorized) return null;

  const isNewDraft = draft && !pages.some(page => page.id === draft.id);

  return (
    <div style={{ display: 'flex', height: '100vh', background: SURFACE, fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif', color: INK }}>
      {/* ─── PANNEAU GAUCHE ─── */}
      <div style={{ width: 480, flexShrink: 0, background: '#FFF', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => (draft ? setDraft(null) : router.push('/admin'))} style={iconBtn}><ArrowLeft size={16} color={MUTED} /></button>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarCheck size={16} color={PRIMARY} /> {draft ? (isNewDraft ? 'Nouvelle page' : draft.title) : 'Réservations'}
                </h1>
                <p style={{ fontSize: 10, color: FAINT, margin: '1px 0 0' }}>
                  {draft ? `/book/${draft.slug}` : `${stats.upcoming} à venir · ${stats.pending} à confirmer · ${stats.week} sous 7 jours`}
                </p>
              </div>
            </div>
            {!draft && <button onClick={reload} title="Rafraîchir" style={{ ...iconBtn, padding: '6px 10px' }}><RefreshCw size={14} color={MUTED} /></button>}
          </div>

          {!draft && (
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1 }}>
              {([['bookings', 'RÉSERVATIONS'], ['pages', `PAGES (${pages.length})`]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} style={{ ...tabBtn, flex: 1, background: tab === id ? '#FFF' : 'transparent', color: tab === id ? PRIMARY : MUTED }}>{label}</button>
              ))}
            </div>
          )}

          {draft && (
            <div style={{ display: 'flex', gap: 18, borderBottom: `1px solid ${BORDER}`, margin: '0 -24px -20px', padding: '0 24px' }}>
              {([['general', Settings2, 'Général'], ['availability', Clock, 'Disponibilités'], ['form', FileText, 'Formulaire'], ['share', Code2, 'Partage']] as const).map(([id, Icon, label]) => (
                <button key={id} onClick={() => setEditorTab(id)} title={label} style={{ ...subTab, color: editorTab === id ? PRIMARY : FAINT, borderBottomColor: editorTab === id ? PRIMARY : 'transparent', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800 }}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: draft ? 24 : 16 }}>
          {loadError && <p style={{ ...card, color: '#B91C1C', fontSize: 12 }}>{loadError}</p>}

          {!draft && tab === 'bookings' && (
            <BookingsList
              loading={loading}
              pages={pages}
              groups={grouped}
              adminZone={adminZone}
              selectedId={selectedId}
              onSelect={setSelectedId}
              filters={{ pageFilter, statusFilter, period, search }}
              setFilters={{ setPageFilter, setStatusFilter, setPeriod, setSearch }}
              manualOpen={manualOpen}
              setManualOpen={setManualOpen}
              onCreateManual={createManual}
              busy={busy}
            />
          )}

          {!draft && tab === 'pages' && (
            <div style={{ display: 'grid', gap: 10 }}>
              <p style={sectionTitle}>Créer depuis un modèle</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                {([['meeting', 'Rendez-vous', 'Appel, consultation'], ['table', 'Restaurant', 'Tables & couverts'], ['blank', 'Vierge', 'Partir de zéro']] as const).map(([id, label, hint]) => (
                  <button key={id} onClick={() => startPage(id)} style={{ ...card, cursor: 'pointer', textAlign: 'left', display: 'grid', gap: 4 }}>
                    <Plus size={15} color={PRIMARY} />
                    <strong style={{ fontSize: 12 }}>{label}</strong>
                    <span style={{ fontSize: 10.5, color: FAINT }}>{hint}</span>
                  </button>
                ))}
              </div>
              <p style={sectionTitle}>Pages existantes</p>
              {!loading && pages.length === 0 && <p style={{ fontSize: 12, color: MUTED }}>Aucune page pour l&apos;instant : créez-en une depuis un modèle.</p>}
              {pages.map(page => {
                const count = bookings.filter(booking => booking.pageId === page.id && booking.status !== 'cancelled' && Date.parse(booking.start) >= Date.now()).length;
                return (
                  <div key={page.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${page.color}` }}>
                    <button onClick={() => { setDraft(structuredClone(page)); setEditorTab('general'); }} style={{ flex: 1, background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
                      <strong style={{ fontSize: 13, color: INK }}>{page.title}</strong>
                      <span style={{ display: 'block', fontSize: 11, color: FAINT, marginTop: 3 }}>/book/{page.slug} · {page.durationMinutes} min · {count} à venir</span>
                    </button>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: page.active ? '#D1FAE5' : '#F1F5F9', color: page.active ? '#047857' : MUTED }}>{page.active ? 'EN LIGNE' : 'INACTIVE'}</span>
                    <a href={`/book/${page.slug}`} target="_blank" rel="noreferrer" title="Ouvrir la page publique" style={{ ...iconBtn, display: 'flex' }}><ExternalLink size={14} color={MUTED} /></a>
                  </div>
                );
              })}
            </div>
          )}

          {draft && <PageEditor draft={draft} setDraft={setDraft} tab={editorTab} onDeactivate={isNewDraft ? undefined : () => deactivatePage(draft)} showToast={showToast} />}
        </div>

        {draft && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${BORDER}`, background: '#FFF' }}>
            <button onClick={savePage} disabled={saving} style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}>
              <CalendarCheck size={17} /> {saving ? 'Enregistrement…' : isNewDraft ? 'Créer la page' : 'Enregistrer'}
            </button>
          </div>
        )}
      </div>

      {/* ─── PANNEAU DROIT ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 32, position: 'relative' }}>
        {draft ? (
          <div style={{ maxWidth: 980, margin: '0 auto' }}>
            <BookingWidget page={draft} preview />
          </div>
        ) : (
          <WeekAgenda
            weekStart={weekStart}
            setWeekStart={setWeekStart}
            adminZone={adminZone}
            bookings={bookings.filter(booking => booking.status !== 'cancelled' && (pageFilter === 'ALL' || booking.pageId === pageFilter))}
            pageById={pageById}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {!draft && selected && (
          <BookingDetail
            key={selected.id}
            booking={selected}
            page={pageById.get(selected.pageId)}
            adminZone={adminZone}
            busy={busy}
            onClose={() => setSelectedId(null)}
            onStatus={status => changeStatus(selected, status)}
            onNotes={notes => saveNotes(selected, notes)}
          />
        )}
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 18px', borderRadius: 12, fontSize: 12.5, fontWeight: 700, color: '#FFF', background: toast.kind === 'success' ? '#10B981' : '#EF4444', boxShadow: '0 8px 24px rgba(15,23,42,0.22)' }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ─── Liste des réservations (panneau gauche) ─── */
function BookingsList({ loading, pages, groups, adminZone, selectedId, onSelect, filters, setFilters, manualOpen, setManualOpen, onCreateManual, busy }: {
  loading: boolean;
  pages: BookingPage[];
  groups: { key: string; items: Booking[] }[];
  adminZone: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filters: { pageFilter: string; statusFilter: BookingStatus | 'ALL'; period: Period; search: string };
  setFilters: { setPageFilter: (v: string) => void; setStatusFilter: (v: BookingStatus | 'ALL') => void; setPeriod: (v: Period) => void; setSearch: (v: string) => void };
  manualOpen: boolean;
  setManualOpen: (v: boolean) => void;
  onCreateManual: (page: BookingPage, input: { date: string; time: string; name: string; email: string; phone: string; partySize: number; note: string }) => void;
  busy: boolean;
}) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} color={FAINT} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={filters.search} onChange={event => setFilters.setSearch(event.target.value)} placeholder="Nom, email, téléphone…" style={{ ...inputStyle, padding: '10px 12px 10px 34px', fontSize: 12 }} />
        </div>
        <button onClick={() => setManualOpen(!manualOpen)} disabled={pages.length === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, background: PRIMARY, color: '#FFF', border: 'none', padding: '0 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer', opacity: pages.length ? 1 : 0.5 }}>
          <Plus size={14} /> Ajouter
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Select
          value={filters.pageFilter}
          onChange={setFilters.setPageFilter}
          options={[{ value: 'ALL', label: 'Toutes les pages' }, ...pages.map(page => ({ value: page.id, label: page.title }))]}
          style={{ padding: '8px 10px', fontSize: 11.5, fontWeight: 700 }}
        />
        <Select
          value={filters.statusFilter}
          onChange={value => setFilters.setStatusFilter(value as BookingStatus | 'ALL')}
          options={[{ value: 'ALL', label: 'Tous statuts' }, ...Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label }))]}
          style={{ padding: '8px 10px', fontSize: 11.5, fontWeight: 700, width: 140 }}
        />
      </div>
      <div style={{ display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 9, gap: 1 }}>
        {([['upcoming', 'À VENIR'], ['past', 'PASSÉES'], ['all', 'TOUTES']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilters.setPeriod(id)} style={{ ...tabBtn, flex: 1, padding: '6px', background: filters.period === id ? '#FFF' : 'transparent', color: filters.period === id ? PRIMARY : MUTED }}>{label}</button>
        ))}
      </div>

      {manualOpen && <ManualBookingForm pages={pages} busy={busy} onCancel={() => setManualOpen(false)} onSubmit={onCreateManual} />}

      {loading && [0, 1, 2].map(index => <div key={index} style={{ height: 64, borderRadius: 12, background: '#F1F5F9' }} />)}
      {!loading && groups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 12px', color: MUTED, fontSize: 12.5 }}>
          <CalendarDays size={28} color="#CBD5E1" style={{ marginBottom: 8 }} />
          <p style={{ margin: 0 }}>{pages.length === 0 ? 'Créez d\'abord une page de réservation (onglet Pages).' : 'Aucune réservation pour ces filtres.'}</p>
        </div>
      )}
      {groups.map(group => (
        <div key={group.key} style={{ display: 'grid', gap: 6 }}>
          <p style={{ ...sectionTitle, margin: '8px 0 2px', textTransform: 'capitalize' }}>{formatDayKey(group.key)}</p>
          {group.items.map(booking => {
            const meta = STATUS_META[booking.status];
            const isSelected = booking.id === selectedId;
            return (
              <button key={booking.id} onClick={() => onSelect(booking.id)} style={{ ...card, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, borderColor: isSelected ? PRIMARY : BORDER, boxShadow: isSelected ? `0 0 0 3px ${PRIMARY}22` : 'none', opacity: booking.status === 'cancelled' ? 0.55 : 1 }}>
                <span style={{ fontSize: 13, fontWeight: 800, width: 44, color: INK }}>{formatTime(booking.start, adminZone)}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: 12.5, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{booking.name}{booking.kind === 'table' ? ` · ${booking.partySize} pers.` : ''}</strong>
                  <span style={{ fontSize: 11, color: FAINT }}>{booking.pageTitle}</span>
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 999, color: meta.color, background: meta.bg, whiteSpace: 'nowrap' }}>{meta.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ManualBookingForm({ pages, busy, onCancel, onSubmit }: {
  pages: BookingPage[];
  busy: boolean;
  onCancel: () => void;
  onSubmit: (page: BookingPage, input: { date: string; time: string; name: string; email: string; phone: string; partySize: number; note: string }) => void;
}) {
  const [pageId, setPageId] = useState(pages[0]?.id ?? '');
  const [values, setValues] = useState({ date: new Date().toISOString().slice(0, 10), time: '12:00', name: '', email: '', phone: '', partySize: 2, note: '' });
  const page = pages.find(item => item.id === pageId);
  return (
    <form onSubmit={event => { event.preventDefault(); if (page) onSubmit(page, values); }} style={{ ...card, display: 'grid', gap: 10, background: SURFACE }}>
      <p style={{ ...sectionTitle, margin: 0 }}>Réservation manuelle (téléphone, sur place…)</p>
      <Select value={pageId} onChange={setPageId} options={pages.map(item => ({ value: item.id, label: item.title }))} />
      <div style={{ display: 'grid', gridTemplateColumns: page?.partySize.enabled ? '1fr 1fr 80px' : '1fr 1fr', gap: 8 }}>
        <input type="date" required value={values.date} onChange={event => setValues({ ...values, date: event.target.value })} style={inputStyle} />
        <input type="time" required value={values.time} onChange={event => setValues({ ...values, time: event.target.value })} style={inputStyle} />
        {page?.partySize.enabled && <input type="number" min={1} value={values.partySize} onChange={event => setValues({ ...values, partySize: Number(event.target.value) })} style={inputStyle} title={page.partySize.label} />}
      </div>
      <input required placeholder="Nom" value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} style={inputStyle} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input placeholder="Téléphone" value={values.phone} onChange={event => setValues({ ...values, phone: event.target.value })} style={inputStyle} />
        <input type="email" placeholder="Email" value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} style={inputStyle} />
      </div>
      <input placeholder="Note (optionnel)" value={values.note} onChange={event => setValues({ ...values, note: event.target.value })} style={inputStyle} />
      <p style={{ fontSize: 10.5, color: FAINT, margin: 0 }}>Heure exprimée dans le fuseau de la page ({page?.timezone}). Les horaires d&apos;ouverture sont ignorés, la capacité est vérifiée.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={busy} style={{ ...primaryBtnStyle, padding: 10, fontSize: 12 }}>{busy ? 'Ajout…' : 'Ajouter'}</button>
        <button type="button" onClick={onCancel} style={{ ...iconBtn, padding: '0 14px', fontSize: 12, fontWeight: 700 }}>Annuler</button>
      </div>
    </form>
  );
}

/* ─── Agenda de la semaine (panneau droit) ─── */
function WeekAgenda({ weekStart, setWeekStart, adminZone, bookings, pageById, selectedId, onSelect }: {
  weekStart: string;
  setWeekStart: (value: string) => void;
  adminZone: string;
  bookings: Booking[];
  pageById: Map<string, BookingPage>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!weekStart) return null;
  const days = Array.from({ length: 7 }, (_, index) => addDaysKey(weekStart, index));
  const today = dateKey(Date.now(), adminZone);
  const byDay = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const key = dateKey(Date.parse(booking.start), adminZone);
    if (key >= days[0] && key <= days[6]) byDay.set(key, [...(byDay.get(key) ?? []), booking].sort((a, b) => a.start.localeCompare(b.start)));
  }
  const total = [...byDay.values()].reduce((sum, list) => sum + list.length, 0);
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Semaine du {formatDayKey(days[0], { day: 'numeric', month: 'long' })}</h2>
          <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 0' }}>{total} réservation{total > 1 ? 's' : ''} · heures en {adminZone.replace(/_/g, ' ')}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setWeekStart(addDaysKey(weekStart, -7))} style={iconBtn}><ChevronLeft size={16} color={MUTED} /></button>
          <button onClick={() => setWeekStart(addDaysKey(today, -((weekdayOf(today) + 6) % 7)))} style={{ ...iconBtn, padding: '0 12px', fontSize: 11, fontWeight: 800, color: MUTED }}>AUJOURD&apos;HUI</button>
          <button onClick={() => setWeekStart(addDaysKey(weekStart, 7))} style={iconBtn}><ChevronRight size={16} color={MUTED} /></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 10 }}>
        {days.map(key => {
          const list = byDay.get(key) ?? [];
          const isToday = key === today;
          return (
            <div key={key} style={{ background: '#FFF', border: `1px solid ${isToday ? PRIMARY : BORDER}`, borderRadius: 14, minHeight: 420, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 12px', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: isToday ? PRIMARY : FAINT, textTransform: 'uppercase', letterSpacing: '.06em' }}>{formatDayKey(key, { weekday: 'short' })}</span>
                <span style={{ display: 'block', fontSize: 20, fontWeight: 800, color: isToday ? PRIMARY : INK }}>{Number(key.slice(8))}</span>
              </div>
              <div style={{ padding: 8, display: 'grid', gap: 6, alignContent: 'start' }}>
                {list.map(booking => {
                  const color = pageById.get(booking.pageId)?.color ?? PRIMARY;
                  const meta = STATUS_META[booking.status];
                  return (
                    <button key={booking.id} onClick={() => onSelect(booking.id)} style={{ textAlign: 'left', border: 'none', borderLeft: `3px solid ${color}`, borderRadius: 8, padding: '7px 8px', cursor: 'pointer', background: booking.id === selectedId ? `${PRIMARY}1F` : SURFACE, outline: booking.status === 'pending' ? `1px dashed ${meta.color}` : 'none' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: INK }}>{formatTime(booking.start, adminZone)}</span>
                      <span style={{ display: 'block', fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{booking.name}</span>
                      {booking.kind === 'table' && <span style={{ fontSize: 10, color: FAINT }}>{booking.partySize} pers.</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Détail d'une réservation ─── */
function BookingDetail({ booking, page, adminZone, busy, onClose, onStatus, onNotes }: {
  booking: Booking;
  page?: BookingPage;
  adminZone: string;
  busy: boolean;
  onClose: () => void;
  onStatus: (status: BookingStatus) => void;
  onNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(booking.notes ?? '');
  const meta = STATUS_META[booking.status];
  const fieldLabel = (id: string) => page?.fields.find(field => field.id === id)?.label ?? (id === 'note' ? 'Note' : id);
  const actions: { status: BookingStatus; label: string }[] = booking.status === 'cancelled'
    ? [{ status: 'confirmed', label: 'Réactiver' }]
    : [
      ...(booking.status === 'pending' ? [{ status: 'confirmed' as const, label: 'Confirmer' }] : []),
      ...(booking.status !== 'done' ? [{ status: 'done' as const, label: 'Terminé' }] : []),
      ...(booking.status !== 'no_show' ? [{ status: 'no_show' as const, label: 'Absent' }] : []),
      { status: 'cancelled', label: 'Annuler' },
    ];
  const whatsappNumber = booking.phone.replace(/[^\d]/g, '');
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, bottom: 24, width: 380, background: '#FFF', borderRadius: 18, border: `1px solid ${BORDER}`, boxShadow: '0 24px 60px rgba(15,23,42,0.18)', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, color: meta.color, background: meta.bg }}>{meta.label.toUpperCase()}</span>
          <h3 style={{ fontSize: 17, fontWeight: 800, margin: '10px 0 2px' }}>{booking.name}</h3>
          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{booking.pageTitle}</p>
        </div>
        <button onClick={onClose} style={{ ...iconBtn, alignSelf: 'flex-start' }}><X size={15} color={MUTED} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'grid', gap: 16, alignContent: 'start' }}>
        <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
          <span style={detailRow}><CalendarDays size={14} color={FAINT} /> <span style={{ textTransform: 'capitalize' }}>{formatDayKey(dateKey(Date.parse(booking.start), adminZone), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></span>
          <span style={detailRow}><Clock size={14} color={FAINT} /> {formatTime(booking.start, adminZone)} – {formatTime(booking.end, adminZone)}{booking.guestTimezone !== adminZone && <span style={{ color: FAINT }}> · client : {formatTime(booking.start, booking.guestTimezone)} ({booking.guestTimezone})</span>}</span>
          {booking.kind === 'table' && <span style={detailRow}><Users size={14} color={FAINT} /> {booking.partySize} {page?.partySize.label.toLowerCase() ?? 'personnes'}</span>}
          {booking.email && <a href={`mailto:${booking.email}`} style={{ ...detailRow, color: INK }}><Mail size={14} color={FAINT} /> {booking.email}</a>}
          {booking.phone && <span style={detailRow}><Phone size={14} color={FAINT} /> <a href={`tel:${booking.phone}`} style={{ color: INK }}>{booking.phone}</a>{whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" style={{ color: '#16A34A', fontWeight: 700, fontSize: 11.5 }}>WhatsApp</a>}</span>}
        </div>
        {Object.keys(booking.answers ?? {}).length > 0 && (
          <div style={{ display: 'grid', gap: 10 }}>
            <p style={{ ...sectionTitle, margin: 0 }}>Réponses</p>
            {Object.entries(booking.answers).map(([id, value]) => (
              <div key={id} style={{ fontSize: 12.5 }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 3 }}>{fieldLabel(id)}</span>
                <span style={{ whiteSpace: 'pre-line', color: INK, lineHeight: 1.5 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <p style={{ ...sectionTitle, marginBottom: 6 }}>Note interne</p>
          <textarea value={notes} onChange={event => setNotes(event.target.value)} onBlur={() => onNotes(notes)} rows={3} placeholder="Visible uniquement dans l'admin" style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
        </div>
        <p style={{ fontSize: 10.5, color: FAINT, margin: 0, lineHeight: 1.5 }}>
          Reçue le {new Intl.DateTimeFormat('fr-FR', { timeZone: adminZone, dateStyle: 'medium', timeStyle: 'short' }).format(new Date(booking.createdAt))}
          {booking.source ? ` · source : ${booking.source}` : ''}
        </p>
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {actions.map(action => (
          <button key={action.status} disabled={busy} onClick={() => onStatus(action.status)} style={{ flex: 1, minWidth: 90, padding: '10px', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer', border: `1px solid ${action.status === 'cancelled' ? '#FECACA' : BORDER}`, background: action.status === 'confirmed' ? PRIMARY : '#FFF', color: action.status === 'confirmed' ? '#FFF' : action.status === 'cancelled' ? '#DC2626' : INK, opacity: busy ? 0.6 : 1 }}>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Éditeur de page ─── */
function PageEditor({ draft, setDraft, tab, onDeactivate, showToast }: {
  draft: BookingPage;
  setDraft: (page: BookingPage) => void;
  tab: EditorTab;
  onDeactivate?: () => void;
  showToast: (kind: Toast['kind'], message: string) => void;
}) {
  const set = <K extends keyof BookingPage>(key: K, value: BookingPage[K]) => setDraft({ ...draft, [key]: value });
  const [origin, setOrigin] = useState('https://ozirus.agency');
  const [newBlocked, setNewBlocked] = useState('');
  useEffect(() => { setOrigin(window.location.origin); }, []);

  if (tab === 'general') {
    return (
      <div style={{ display: 'grid', gap: 14 }}>
        <p style={sectionTitle}>Identité</p>
        <Field label="Titre"><input value={draft.title} onChange={event => set('title', event.target.value)} style={inputStyle} /></Field>
        <Field label="Lien public">
          <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <span style={{ padding: '0 10px', fontSize: 12, color: FAINT, background: SURFACE, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>/book/</span>
            <input value={draft.slug} onChange={event => set('slug', event.target.value)} onBlur={() => set('slug', normalizeSlug(draft.slug))} style={{ ...inputStyle, border: 'none', borderRadius: 0 }} />
          </div>
        </Field>
        <Field label="Description"><textarea rows={3} value={draft.description} onChange={event => set('description', event.target.value)} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} /></Field>
        <div style={grid2}>
          <Field label="Hôte / établissement"><input value={draft.hostName} onChange={event => set('hostName', event.target.value)} style={inputStyle} /></Field>
          <Field label="Couleur"><input type="color" value={draft.color} onChange={event => set('color', event.target.value)} style={{ ...inputStyle, padding: 4, height: 44 }} /></Field>
        </div>

        <p style={{ ...sectionTitle, marginTop: 8 }}>Type de réservation</p>
        <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1 }}>
          {([['meeting', 'RENDEZ-VOUS'], ['table', 'CAPACITÉ (RESTAURANT…)']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setDraft({
              ...draft, kind: id,
              capacity: id === 'meeting' ? 1 : Math.max(draft.capacity, 20),
              partySize: id === 'meeting' ? { ...draft.partySize, enabled: false } : { enabled: true, min: 1, max: Math.max(draft.partySize.max, 10), label: draft.partySize.label === 'Participants' ? 'Couverts' : draft.partySize.label },
            })} style={{ ...tabBtn, flex: 1, background: draft.kind === id ? '#FFF' : 'transparent', color: draft.kind === id ? PRIMARY : MUTED }}>{label}</button>
          ))}
        </div>
        <div style={grid2}>
          <Field label="Durée (min)"><input type="number" min={5} step={5} value={draft.durationMinutes} onChange={event => set('durationMinutes', Number(event.target.value))} style={inputStyle} /></Field>
          <Field label={draft.kind === 'table' ? 'Capacité simultanée' : 'RDV simultanés'}><input type="number" min={1} value={draft.capacity} onChange={event => set('capacity', Math.max(1, Number(event.target.value)))} style={inputStyle} /></Field>
        </div>
        {draft.kind === 'table' && (
          <div style={grid3}>
            <Field label="Libellé"><input value={draft.partySize.label} onChange={event => set('partySize', { ...draft.partySize, label: event.target.value })} style={inputStyle} /></Field>
            <Field label="Min / résa"><input type="number" min={1} value={draft.partySize.min} onChange={event => set('partySize', { ...draft.partySize, min: Number(event.target.value) })} style={inputStyle} /></Field>
            <Field label="Max / résa"><input type="number" min={1} value={draft.partySize.max} onChange={event => set('partySize', { ...draft.partySize, max: Number(event.target.value) })} style={inputStyle} /></Field>
          </div>
        )}

        <p style={{ ...sectionTitle, marginTop: 8 }}>Lieu</p>
        <div style={grid2}>
          <Field label="Type">
            <Select
              value={draft.location.type}
              onChange={value => set('location', { ...draft.location, type: value as LocationType })}
              options={Object.entries(LOCATION_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="Détail (lien, adresse…)"><input value={draft.location.value} onChange={event => set('location', { ...draft.location, value: event.target.value })} style={inputStyle} /></Field>
        </div>

        <p style={{ ...sectionTitle, marginTop: 8 }}>Confirmation</p>
        <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1 }}>
          {([['auto', 'AUTOMATIQUE'], ['manual', 'À VALIDER DANS L\'ADMIN']] as const).map(([id, label]) => (
            <button key={id} onClick={() => set('confirmation', id)} style={{ ...tabBtn, flex: 1, background: draft.confirmation === id ? '#FFF' : 'transparent', color: draft.confirmation === id ? PRIMARY : MUTED }}>{label}</button>
          ))}
        </div>
        <Field label="Message après réservation"><textarea rows={2} value={draft.confirmationMessage} onChange={event => set('confirmationMessage', event.target.value)} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} /></Field>
        <Field label="WhatsApp à prévenir (ex. 237694086571, vide = pas de bouton)"><input value={draft.whatsapp} onChange={event => set('whatsapp', event.target.value.replace(/[^\d]/g, ''))} style={inputStyle} /></Field>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, marginTop: 8 }}>
          <input type="checkbox" checked={draft.active} onChange={event => set('active', event.target.checked)} /> Page en ligne (accepte les réservations)
        </label>
        {onDeactivate && draft.active && (
          <button onClick={onDeactivate} style={{ ...iconBtn, padding: '10px', display: 'flex', justifyContent: 'center', gap: 6, color: '#DC2626', fontSize: 12, fontWeight: 800, borderColor: '#FECACA' }}>
            <Trash2 size={14} /> Désactiver la page
          </button>
        )}
      </div>
    );
  }

  if (tab === 'availability') {
    const setDay = (day: number, windows: TimeWindow[]) => set('weekly', { ...draft.weekly, [String(day)]: windows });
    return (
      <div style={{ display: 'grid', gap: 14 }}>
        <Field label="Fuseau horaire des disponibilités">
          <Select value={draft.timezone} onChange={value => set('timezone', value)} options={[...new Set([draft.timezone, ...TIMEZONES])].map(zone => ({ value: zone, label: zone }))} />
        </Field>
        <p style={{ ...sectionTitle, marginTop: 4 }}>Horaires hebdomadaires</p>
        {WEEK_ORDER.map(day => {
          const windows = draft.weekly[String(day)] ?? [];
          return (
            <div key={day} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 10, borderBottom: `1px solid #F1F5F9` }}>
              <label style={{ width: 96, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, paddingTop: 10 }}>
                <input type="checkbox" checked={windows.length > 0} onChange={event => setDay(day, event.target.checked ? [{ start: '09:00', end: '17:00' }] : [])} />
                {WEEKDAY_LABELS[day].slice(0, 3)}.
              </label>
              <div style={{ flex: 1, display: 'grid', gap: 6 }}>
                {windows.length === 0 && <span style={{ fontSize: 12, color: FAINT, paddingTop: 10 }}>Fermé</span>}
                {windows.map((window, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="time" value={window.start} onChange={event => setDay(day, windows.map((item, i) => (i === index ? { ...item, start: event.target.value } : item)))} style={{ ...inputStyle, padding: '8px 10px' }} />
                    <span style={{ color: FAINT }}>–</span>
                    <input type="time" value={window.end} onChange={event => setDay(day, windows.map((item, i) => (i === index ? { ...item, end: event.target.value } : item)))} style={{ ...inputStyle, padding: '8px 10px' }} />
                    <button onClick={() => setDay(day, windows.filter((_, i) => i !== index))} style={iconBtn} title="Retirer"><X size={13} color={MUTED} /></button>
                  </div>
                ))}
              </div>
              {windows.length > 0 && <button onClick={() => setDay(day, [...windows, { start: windows[windows.length - 1].end, end: '20:00' }])} style={{ ...iconBtn, marginTop: 4 }} title="Ajouter une plage"><Plus size={13} color={MUTED} /></button>}
            </div>
          );
        })}
        <p style={{ ...sectionTitle, marginTop: 4 }}>Règles</p>
        <div style={grid2}>
          <Field label="Créneau toutes les (min)"><input type="number" min={5} step={5} value={draft.slotIntervalMinutes} onChange={event => set('slotIntervalMinutes', Number(event.target.value))} style={inputStyle} /></Field>
          <Field label="Pause entre RDV (min)"><input type="number" min={0} step={5} value={draft.bufferMinutes} onChange={event => set('bufferMinutes', Number(event.target.value))} style={inputStyle} /></Field>
          <Field label="Préavis minimum (h)"><input type="number" min={0} value={draft.minNoticeHours} onChange={event => set('minNoticeHours', Number(event.target.value))} style={inputStyle} /></Field>
          <Field label="Réservable jusqu'à (jours)"><input type="number" min={1} value={draft.maxDaysAhead} onChange={event => set('maxDaysAhead', Number(event.target.value))} style={inputStyle} /></Field>
        </div>
        <p style={{ ...sectionTitle, marginTop: 4 }}>Jours fermés (congés, jours fériés…)</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="date" value={newBlocked} onChange={event => setNewBlocked(event.target.value)} style={inputStyle} />
          <button onClick={() => { if (newBlocked && !draft.blockedDates.includes(newBlocked)) set('blockedDates', [...draft.blockedDates, newBlocked].sort()); setNewBlocked(''); }} style={{ ...iconBtn, padding: '0 14px', fontSize: 12, fontWeight: 800, color: PRIMARY }}>Bloquer</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {draft.blockedDates.map(key => (
            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: '#FEE2E2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700 }}>
              {formatDayKey(key, { day: 'numeric', month: 'short', year: 'numeric' })}
              <button onClick={() => set('blockedDates', draft.blockedDates.filter(item => item !== key))} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}><X size={12} color="#B91C1C" /></button>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (tab === 'form') {
    const setField = (index: number, patch: Partial<BookingField>) => set('fields', draft.fields.map((field, i) => (i === index ? { ...field, ...patch } : field)));
    return (
      <div style={{ display: 'grid', gap: 14 }}>
        <p style={sectionTitle}>Coordonnées demandées</p>
        <p style={{ fontSize: 12, color: MUTED, margin: '-6px 0 0' }}>Le nom est toujours obligatoire.</p>
        {(['email', 'phone'] as const).map(key => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 90, fontSize: 12.5, fontWeight: 700 }}>{key === 'email' ? 'Email' : 'Téléphone'}</span>
            <div style={{ flex: 1, display: 'flex', background: '#F1F5F9', padding: 3, borderRadius: 9, gap: 1 }}>
              {([['required', 'OBLIGATOIRE'], ['optional', 'OPTIONNEL'], ['hidden', 'MASQUÉ']] as const).map(([value, label]) => (
                <button key={value} onClick={() => set('contact', { ...draft.contact, [key]: value })} style={{ ...tabBtn, flex: 1, padding: '6px', background: draft.contact[key] === value ? '#FFF' : 'transparent', color: draft.contact[key] === value ? PRIMARY : MUTED }}>{label}</button>
              ))}
            </div>
          </div>
        ))}
        <p style={{ ...sectionTitle, marginTop: 8 }}>Questions</p>
        {draft.fields.map((field, index) => (
          <div key={field.id} style={{ ...card, display: 'grid', gap: 8, background: SURFACE }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={field.label} onChange={event => setField(index, { label: event.target.value })} placeholder="Question" style={inputStyle} />
              <button onClick={() => set('fields', draft.fields.filter((_, i) => i !== index))} style={iconBtn} title="Supprimer"><Trash2 size={14} color="#DC2626" /></button>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Select
                value={field.type}
                onChange={value => setField(index, { type: value as BookingField['type'] })}
                options={[{ value: 'text', label: 'Texte court' }, { value: 'textarea', label: 'Texte long' }, { value: 'select', label: 'Liste de choix' }]}
                style={{ padding: '8px 10px' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={field.required} onChange={event => setField(index, { required: event.target.checked })} /> Obligatoire
              </label>
            </div>
            {field.type === 'select' ? (
              <input value={(field.options ?? []).join(', ')} onChange={event => setField(index, { options: event.target.value.split(',').map(option => option.trim()).filter(Boolean) })} placeholder="Choix séparés par des virgules" style={inputStyle} />
            ) : (
              <input value={field.placeholder ?? ''} onChange={event => setField(index, { placeholder: event.target.value })} placeholder="Texte d'aide (optionnel)" style={inputStyle} />
            )}
          </div>
        ))}
        <button onClick={() => set('fields', [...draft.fields, { id: `q${newId()}`, label: '', type: 'text', required: false }])} style={{ ...iconBtn, padding: '10px', display: 'flex', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: PRIMARY }}>
          <Plus size={14} /> Ajouter une question
        </button>
      </div>
    );
  }

  const publicUrl = `${origin}/book/${draft.slug}`;
  const iframe = `<iframe id="ozirus-booking" src="${publicUrl}?embed=1" style="width:100%;border:0;min-height:640px" loading="lazy"></iframe>\n<script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='ozirus-booking:height'){document.getElementById('ozirus-booking').style.height=e.data.height+'px'}})</script>`;
  const react = `import BookingWidget from '@/components/booking/BookingWidget';\n\n<BookingWidget slug="${draft.slug}" source="landing" />`;
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); showToast('success', 'Copié dans le presse-papiers.'); } catch { showToast('error', 'Copie impossible.'); }
  };
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <p style={sectionTitle}>Lien direct</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input readOnly value={publicUrl} style={{ ...inputStyle, fontSize: 12 }} />
        <button onClick={() => copy(publicUrl)} style={iconBtn} title="Copier"><Copy size={14} color={MUTED} /></button>
        <a href={publicUrl} target="_blank" rel="noreferrer" style={{ ...iconBtn, display: 'flex', alignItems: 'center' }} title="Ouvrir"><ExternalLink size={14} color={MUTED} /></a>
      </div>
      <p style={{ fontSize: 11.5, color: MUTED, margin: 0 }}>À coller dans une bio, une signature email, un message WhatsApp… Fonctionne aussi sur les sous-domaines (ex. mvp.ozirus.agency/book/{draft.slug}).</p>
      <p style={{ ...sectionTitle, marginTop: 8 }}>Intégrer sur un autre site (iframe)</p>
      <textarea readOnly rows={6} value={iframe} style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: 11 }} />
      <button onClick={() => copy(iframe)} style={{ ...iconBtn, padding: '10px', display: 'flex', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 800 }}><Copy size={14} /> Copier le code</button>
      <p style={{ ...sectionTitle, marginTop: 8 }}>Dans une page de ce site (landing)</p>
      <textarea readOnly rows={3} value={react} style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: 11 }} />
      {!draft.active && <p style={{ fontSize: 12, color: '#B45309', background: '#FEF3C7', padding: 10, borderRadius: 10, margin: 0 }}>La page est inactive : le lien affichera « introuvable » tant qu&apos;elle n&apos;est pas mise en ligne.</p>}
      <p style={{ fontSize: 11.5, color: MUTED, margin: 0, display: 'flex', gap: 6, alignItems: 'center' }}><LayoutList size={13} /> Enregistrez avant de partager : le lien utilise la version sauvegardée.</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}><span style={labelStyle}>{label}</span>{children}</label>;
}

function formatDayKey(key: string, options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', ...options }).format(new Date(`${key}T12:00:00Z`));
}
function formatTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

const tabBtn = { padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' };
const subTab = { padding: '12px 4px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' };
const sectionTitle = { fontSize: 10, fontWeight: 800, color: FAINT, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12, marginTop: 0 };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: `1px solid ${BORDER}`, fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box' as const, color: INK };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 800, color: MUTED, marginBottom: 6, marginLeft: 4 };
const primaryBtnStyle = { width: '100%', background: PRIMARY, color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)' };
const iconBtn: React.CSSProperties = { background: '#FFF', border: `1px solid ${BORDER}`, borderRadius: 8, padding: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' };
const card: React.CSSProperties = { background: '#FFF', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12 };
const detailRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', textDecoration: 'none' };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 };
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 10 };
