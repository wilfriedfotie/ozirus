// Tokens de la landing MVP, partagés entre page.tsx, la Product Experience et la modale de
// réservation. Fichier séparé : un page.tsx ne peut exporter que ce que Next attend d'une page.

export const OFFER = {
  price: 5000,
  days: 30,
  years: 5,
  email: 'info.ozirus@gmail.com',
};

// Page de réservation (/admin/bookings) qui alimente la modale.
export const BOOKING_SLUG = 'mvp-appel';

export const ACCENT = '#7967FF';
export const DISPLAY = 'var(--font-display-loaded), Clash Display, sans-serif';
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── palette claire ────────────────────────────────── */
export const INK = '#0E0E10';
export const MUTED = '#62626D';
export const FAINT = '#9A9AA5';
export const LINE = '#E9E9EC';
export const ACCENT_INK = '#5B47F5';
export const ACCENT_SOFT = '#EFECFF';
export const GREEN = '#16A34A';
export const AMBER = '#D97706';
export const RED = '#DC2626';
