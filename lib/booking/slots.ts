// Calcul des créneaux — pur (aucune dépendance Firestore) : utilisé par l'API publique, par
// la validation serveur d'une réservation et par l'aperçu live de l'admin.
//
// Les disponibilités sont saisies en heure locale de la page (`page.timezone`) ; les créneaux
// sortent en instants UTC. Les conversions passent par Intl (pas de lib de dates) et gèrent
// les changements d'heure.
import type { BookingPage, DayEntry, Slot } from './types';

const partsFormatter = new Map<string, Intl.DateTimeFormat>();
function formatterFor(timeZone: string) {
  let formatter = partsFormatter.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    partsFormatter.set(timeZone, formatter);
  }
  return formatter;
}

function zonedParts(ms: number, timeZone: string) {
  const parts: Record<string, number> = {};
  for (const part of formatterFor(timeZone).formatToParts(new Date(ms))) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }
  return parts;
}

/** Décalage (ms) du fuseau par rapport à UTC à l'instant donné. */
function offsetAt(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
}

/** '2026-10-23' + '14:30' dans `timeZone` → instant UTC (ms). */
export function zonedToUtc(date: string, time: string, timeZone: string) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const first = guess - offsetAt(guess, timeZone);
  const second = guess - offsetAt(first, timeZone);
  return second;
}

/** Instant → 'YYYY-MM-DD' dans `timeZone`. */
export function dateKey(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

export function addDaysKey(key: string, days: number) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export const weekdayOf = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};

export const isValidTimeZone = (timeZone: string) => {
  try { new Intl.DateTimeFormat('en-US', { timeZone }); return true; } catch { return false; }
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** Unités occupées sur [start, end[ (tampon inclus), toutes réservations confondues. */
export function usedUnits(entries: DayEntry[], start: number, end: number, bufferMs: number, ignoreBookingId?: string) {
  return entries.reduce((sum, entry) => (
    entry.bookingId !== ignoreBookingId && entry.start < end + bufferMs && entry.end + bufferMs > start ? sum + entry.units : sum
  ), 0);
}

/**
 * Créneaux de `page` entre les jours `fromKey` et `toKey` inclus (jours du fuseau de la page).
 * `entries` = occupation existante (toutes dates confondues). Les créneaux complets sont
 * conservés avec `remaining: 0` seulement si `includeFull`.
 */
export function computeSlots(page: BookingPage, fromKey: string, toKey: string, entries: DayEntry[], now = Date.now(), includeFull = false): Slot[] {
  const slots: Slot[] = [];
  const duration = page.durationMinutes * 60_000;
  const step = Math.max(5, page.slotIntervalMinutes || page.durationMinutes) * 60_000;
  const bufferMs = page.bufferMinutes * 60_000;
  const earliest = now + page.minNoticeHours * 3_600_000;
  const lastKey = addDaysKey(dateKey(now, page.timezone), page.maxDaysAhead);
  const blocked = new Set(page.blockedDates);

  for (let key = fromKey; key <= toKey && key <= lastKey; key = addDaysKey(key, 1)) {
    if (blocked.has(key)) continue;
    const windows = page.weekly[String(weekdayOf(key))] ?? [];
    for (const window of windows) {
      const windowStart = toMinutes(window.start);
      const windowEnd = toMinutes(window.end);
      if (!(windowEnd > windowStart)) continue;
      const base = zonedToUtc(key, window.start, page.timezone);
      const limit = base + (windowEnd - windowStart) * 60_000;
      for (let start = base; start + duration <= limit; start += step) {
        if (start < earliest) continue;
        const end = start + duration;
        const remaining = Math.max(0, page.capacity - usedUnits(entries, start, end, bufferMs));
        if (remaining > 0 || includeFull) slots.push({ start: new Date(start).toISOString(), end: new Date(end).toISOString(), remaining });
      }
    }
  }
  return slots.sort((a, b) => a.start.localeCompare(b.start));
}
