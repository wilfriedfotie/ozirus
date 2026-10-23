// Accès Firestore du système de réservation. Utilisé côté serveur (routes /api/booking) et
// côté admin (/admin/bookings) — même client Firebase (`lib/firebase.ts`).
//
// Collections :
// - `booking_pages` : configuration des pages (une par offre / établissement).
// - `bookings`      : les réservations.
// - `booking_days`  : occupation par page et par jour (`{pageId}__{YYYY-MM-DD}` → entries[]).
//   Toute réservation passe par une transaction sur ce doc : c'est lui qui empêche deux
//   clients de prendre le même créneau en même temps (y compris les créneaux qui se
//   chevauchent sans avoir la même heure de début).
import {
  collection, doc, documentId, getDoc, getDocs, limit, orderBy, query, runTransaction, setDoc, updateDoc, where,
  type Transaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addDaysKey, computeSlots, dateKey, usedUnits } from './slots';
import { ACTIVE_STATUSES, type Booking, type BookingPage, type BookingStatus, type DayEntry } from './types';

const PAGES = 'booking_pages';
const BOOKINGS = 'bookings';
const DAYS = 'booking_days';

export class BookingError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// Firestore rejette `undefined` (même besoin que documentsService).
const stripUndefined = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const normalizeSlug = (value: string) => value
  .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const dayRef = (pageId: string, key: string) => doc(db, DAYS, `${pageId}__${key}`);

async function readDayEntries(pageId: string, fromKey: string, toKey: string): Promise<DayEntry[]> {
  // Plage sur l'ID du document : aucun index composite nécessaire.
  const snap = await getDocs(query(
    collection(db, DAYS),
    where(documentId(), '>=', `${pageId}__${fromKey}`),
    where(documentId(), '<=', `${pageId}__${toKey}`),
  ));
  return snap.docs.flatMap(item => (item.data().entries as DayEntry[] | undefined) ?? []);
}

/** Jours (fuseau de la page) dont l'occupation peut chevaucher [start, end]. */
const daysAround = (page: BookingPage, start: number, end: number) => {
  const first = addDaysKey(dateKey(start, page.timezone), -1);
  const last = addDaysKey(dateKey(end, page.timezone), 1);
  const keys: string[] = [];
  for (let key = first; key <= last; key = addDaysKey(key, 1)) keys.push(key);
  return keys;
};

async function reserveInTransaction(tx: Transaction, page: BookingPage, entry: DayEntry) {
  const keys = daysAround(page, entry.start, entry.end);
  const snaps = await Promise.all(keys.map(key => tx.get(dayRef(page.id, key))));
  const entries = snaps.flatMap(snap => (snap.data()?.entries as DayEntry[] | undefined) ?? []);
  const used = usedUnits(entries, entry.start, entry.end, page.bufferMinutes * 60_000, entry.bookingId);
  if (used + entry.units > page.capacity) throw new BookingError('Ce créneau vient d\'être pris. Choisissez-en un autre.', 409);
  const homeKey = dateKey(entry.start, page.timezone);
  const home = snaps[keys.indexOf(homeKey)];
  const homeEntries = ((home.data()?.entries as DayEntry[] | undefined) ?? []).filter(item => item.bookingId !== entry.bookingId);
  tx.set(dayRef(page.id, homeKey), { pageId: page.id, date: homeKey, entries: [...homeEntries, entry] });
}

async function releaseInTransaction(tx: Transaction, page: BookingPage | null, booking: Booking) {
  const timezone = page?.timezone ?? 'UTC';
  const ref = dayRef(booking.pageId, dateKey(Date.parse(booking.start), timezone));
  const snap = await tx.get(ref);
  if (!snap.exists()) return;
  const entries = ((snap.data().entries as DayEntry[] | undefined) ?? []).filter(item => item.bookingId !== booking.id);
  tx.update(ref, { entries });
}

export const bookingPagesService = {
  async list(): Promise<BookingPage[]> {
    const snap = await getDocs(query(collection(db, PAGES), orderBy('updatedAt', 'desc')));
    return snap.docs.map(item => ({ ...item.data(), id: item.id } as BookingPage));
  },
  async get(id: string): Promise<BookingPage | null> {
    const snap = await getDoc(doc(db, PAGES, id));
    return snap.exists() ? ({ ...snap.data(), id: snap.id } as BookingPage) : null;
  },
  async getBySlug(slug: string): Promise<BookingPage | null> {
    const snap = await getDocs(query(collection(db, PAGES), where('slug', '==', slug), limit(1)));
    const item = snap.docs[0];
    return item ? ({ ...item.data(), id: item.id } as BookingPage) : null;
  },
  async save(page: Omit<BookingPage, 'createdAt' | 'updatedAt'> & { createdAt?: string }): Promise<BookingPage> {
    const slug = normalizeSlug(page.slug);
    if (!slug) throw new BookingError('Le lien (slug) est obligatoire.');
    if (slug === 'manage') throw new BookingError('« manage » est réservé, choisissez un autre lien.');
    const clash = await this.getBySlug(slug);
    if (clash && clash.id !== page.id) throw new BookingError(`Le lien « ${slug} » est déjà utilisé par « ${clash.title} ».`, 409);
    const now = new Date().toISOString();
    const saved = stripUndefined({ ...page, slug, createdAt: page.createdAt ?? now, updatedAt: now }) as BookingPage;
    const { id, ...data } = saved;
    await setDoc(doc(db, PAGES, id), data);
    return saved;
  },
  async remove(id: string): Promise<void> {
    // Les réservations existantes sont conservées (historique) : on désactive seulement.
    await updateDoc(doc(db, PAGES, id), { active: false, updatedAt: new Date().toISOString() });
  },
};

export const bookingsService = {
  async slots(page: BookingPage, fromKey: string, toKey: string) {
    const entries = await readDayEntries(page.id, addDaysKey(fromKey, -1), addDaysKey(toKey, 1));
    return computeSlots(page, fromKey, toKey, entries);
  },

  async list(): Promise<Booking[]> {
    const snap = await getDocs(query(collection(db, BOOKINGS), orderBy('start', 'desc'), limit(1000)));
    return snap.docs.map(item => ({ ...item.data(), id: item.id } as Booking));
  },

  async get(id: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, BOOKINGS, id));
    return snap.exists() ? ({ ...snap.data(), id: snap.id } as Booking) : null;
  },

  /** Crée une réservation après avoir vérifié que `start` est un créneau proposé et libre. */
  async create(page: BookingPage, input: Omit<Booking, 'id' | 'pageId' | 'pageSlug' | 'pageTitle' | 'kind' | 'end' | 'status' | 'notes' | 'token' | 'createdAt' | 'updatedAt'>, options: { skipSlotCheck?: boolean; status?: BookingStatus } = {}): Promise<Booking> {
    const start = Date.parse(input.start);
    if (Number.isNaN(start)) throw new BookingError('Date de créneau invalide.');
    const end = start + page.durationMinutes * 60_000;
    const units = page.partySize.enabled ? input.partySize : 1;

    if (!options.skipSlotCheck) {
      // Le créneau doit faire partie de ceux que la page propose (horaires, préavis, jours fermés).
      const key = dateKey(start, page.timezone);
      const offered = computeSlots(page, key, key, [], Date.now(), true);
      if (!offered.some(slot => Date.parse(slot.start) === start)) throw new BookingError('Ce créneau n\'est pas disponible.', 409);
    }

    const ref = doc(collection(db, BOOKINGS));
    const now = new Date().toISOString();
    const booking: Booking = stripUndefined({
      ...input,
      id: ref.id,
      pageId: page.id,
      pageSlug: page.slug,
      pageTitle: page.title,
      kind: page.kind,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      partySize: units,
      status: options.status ?? (page.confirmation === 'manual' ? 'pending' : 'confirmed'),
      notes: '',
      token: crypto.randomUUID().replace(/-/g, ''),
      createdAt: now,
      updatedAt: now,
    });

    await runTransaction(db, async tx => {
      await reserveInTransaction(tx, page, { bookingId: booking.id, start, end, units });
      const { id, ...data } = booking;
      tx.set(ref, data);
    });
    return booking;
  },

  /** Change le statut ; annuler libère le créneau, réactiver le reprend (s'il est encore libre). */
  async setStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    const current = await this.get(id);
    if (!current) throw new BookingError('Réservation introuvable.', 404);
    const page = await bookingPagesService.get(current.pageId);
    const wasActive = ACTIVE_STATUSES.includes(current.status);
    const willBeActive = ACTIVE_STATUSES.includes(status);
    const updatedAt = new Date().toISOString();
    const patch: Partial<Booking> = { status, updatedAt, ...(notes !== undefined ? { notes } : {}) };

    await runTransaction(db, async tx => {
      const ref = doc(db, BOOKINGS, id);
      if (wasActive && !willBeActive) {
        await releaseInTransaction(tx, page, current);
      } else if (!wasActive && willBeActive) {
        if (!page) throw new BookingError('La page de réservation n\'existe plus.', 404);
        await reserveInTransaction(tx, page, { bookingId: id, start: Date.parse(current.start), end: Date.parse(current.end), units: current.partySize || 1 });
      }
      tx.update(ref, patch);
    });
    return { ...current, ...patch };
  },

  async updateNotes(id: string, notes: string) {
    await updateDoc(doc(db, BOOKINGS, id), { notes, updatedAt: new Date().toISOString() });
  },
};
