// Système de réservation Ozirus (type Calendly), générique :
// - `meeting` : un créneau = un rendez-vous (capacité 1 en général) — appel découverte MVP…
// - `table`   : un créneau accueille plusieurs réservations jusqu'à `capacity` unités
//               (couverts) — restaurant, atelier, formation…
// Une « page de réservation » (BookingPage) porte toute la configuration ; les réservations
// (Booking) y sont rattachées par `pageId`.

export type BookingKind = 'meeting' | 'table';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'done' | 'no_show';
export type ContactRequirement = 'required' | 'optional' | 'hidden';
export type LocationType = 'video' | 'phone' | 'whatsapp' | 'onsite' | 'custom';

export interface TimeWindow { start: string; end: string } // 'HH:mm', heure locale de la page

export interface BookingField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface BookingPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: BookingKind;
  active: boolean;
  hostName: string;
  color: string;
  timezone: string;
  durationMinutes: number;
  slotIntervalMinutes: number;
  bufferMinutes: number;
  /** Unités simultanées par créneau : 1 rendez-vous, ou N couverts. */
  capacity: number;
  partySize: { enabled: boolean; min: number; max: number; label: string };
  minNoticeHours: number;
  maxDaysAhead: number;
  /** Clé = jour de la semaine (0 = dimanche … 6 = samedi). */
  weekly: Record<string, TimeWindow[]>;
  blockedDates: string[]; // 'YYYY-MM-DD'
  location: { type: LocationType; value: string };
  contact: { email: ContactRequirement; phone: ContactRequirement };
  fields: BookingField[];
  /** `manual` : la réservation arrive en `pending` et doit être confirmée depuis l'admin. */
  confirmation: 'auto' | 'manual';
  confirmationMessage: string;
  /** Numéro WhatsApp (format international sans +) proposé au client après réservation. */
  whatsapp: string;
  createdAt: string;
  updatedAt: string;
}

/** Ce que l'API publique expose d'une page (sans métadonnées internes). */
export type PublicBookingPage = Omit<BookingPage, 'createdAt' | 'updatedAt' | 'active'>;

export interface Booking {
  id: string;
  pageId: string;
  pageSlug: string;
  pageTitle: string;
  kind: BookingKind;
  start: string; // ISO UTC
  end: string;   // ISO UTC
  guestTimezone: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  answers: Record<string, string>;
  status: BookingStatus;
  notes: string;
  /** Jeton du lien de gestion envoyé au client (annulation). */
  token: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

/** Occupation d'un jour pour une page : doc `booking_days/{pageId}__{YYYY-MM-DD}`. */
export interface DayEntry { bookingId: string; start: number; end: number; units: number }

export interface Slot { start: string; end: string; remaining: number }

export const ACTIVE_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'done', 'no_show'];

export const STATUS_META: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'À confirmer', color: '#B45309', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmé', color: '#047857', bg: '#D1FAE5' },
  cancelled: { label: 'Annulé', color: '#B91C1C', bg: '#FEE2E2' },
  done: { label: 'Terminé', color: '#475569', bg: '#E2E8F0' },
  no_show: { label: 'Absent', color: '#7C2D12', bg: '#FFEDD5' },
};

export const LOCATION_LABELS: Record<LocationType, string> = {
  video: 'Visioconférence',
  phone: 'Appel téléphonique',
  whatsapp: 'Appel WhatsApp',
  onsite: 'Sur place',
  custom: 'Autre',
};

const weekdays = (windows: TimeWindow[], days: number[]) =>
  Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map(day => [String(day), days.includes(day) ? windows : []]));

/** Modèles proposés à la création d'une page dans l'admin. */
export const PAGE_TEMPLATES: Record<'meeting' | 'table' | 'blank', Omit<BookingPage, 'id' | 'createdAt' | 'updatedAt'>> = {
  meeting: {
    slug: 'mvp-appel',
    title: 'Appel découverte MVP',
    description: '30 minutes pour parler de votre idée, choisir le bon format (15 ou 30 jours) et verrouiller le périmètre.',
    kind: 'meeting',
    active: true,
    hostName: 'Wilfried Fotie',
    color: '#0F172A',
    timezone: 'Europe/Paris',
    durationMinutes: 30,
    slotIntervalMinutes: 30,
    bufferMinutes: 15,
    capacity: 1,
    partySize: { enabled: false, min: 1, max: 1, label: 'Participants' },
    minNoticeHours: 12,
    maxDaysAhead: 30,
    weekly: weekdays([{ start: '10:00', end: '12:30' }, { start: '14:00', end: '18:00' }], [1, 2, 3, 4, 5]),
    blockedDates: [],
    location: { type: 'video', value: 'Lien Google Meet envoyé avant l\'appel' },
    contact: { email: 'required', phone: 'optional' },
    fields: [
      { id: 'projet', label: 'Votre projet en quelques lignes', type: 'textarea', required: true, placeholder: 'SaaS, app mobile, produit IA… à qui il s\'adresse, ce qu\'il doit faire.' },
      { id: 'format', label: 'Format envisagé', type: 'select', required: false, options: ['Sprint MVP — 15 jours', 'MVP complet — 30 jours', 'Je ne sais pas encore'] },
    ],
    confirmation: 'auto',
    confirmationMessage: 'C\'est noté ! Je vous envoie le lien de l\'appel avant le rendez-vous.',
    whatsapp: '237694086571',
  },
  table: {
    slug: 'restaurant',
    title: 'Réserver une table',
    description: 'Choisissez votre date, votre heure et le nombre de couverts.',
    kind: 'table',
    active: true,
    hostName: 'Restaurant',
    color: '#B91C1C',
    timezone: 'Africa/Douala',
    durationMinutes: 90,
    slotIntervalMinutes: 30,
    bufferMinutes: 0,
    capacity: 40,
    partySize: { enabled: true, min: 1, max: 12, label: 'Couverts' },
    minNoticeHours: 2,
    maxDaysAhead: 60,
    weekly: weekdays([{ start: '12:00', end: '15:00' }, { start: '19:00', end: '23:00' }], [2, 3, 4, 5, 6, 0]),
    blockedDates: [],
    location: { type: 'onsite', value: '' },
    contact: { email: 'optional', phone: 'required' },
    fields: [
      { id: 'occasion', label: 'Occasion', type: 'select', required: false, options: ['Aucune', 'Anniversaire', 'Repas d\'affaires', 'Autre'] },
      { id: 'demande', label: 'Demande particulière', type: 'textarea', required: false, placeholder: 'Allergies, chaise bébé, terrasse…' },
    ],
    confirmation: 'manual',
    confirmationMessage: 'Merci ! Votre demande est enregistrée, nous vous confirmons la table rapidement.',
    whatsapp: '',
  },
  blank: {
    slug: 'nouvelle-page',
    title: 'Nouvelle page de réservation',
    description: '',
    kind: 'meeting',
    active: false,
    hostName: 'Ozirus',
    color: '#7967FF',
    timezone: 'Europe/Paris',
    durationMinutes: 30,
    slotIntervalMinutes: 30,
    bufferMinutes: 0,
    capacity: 1,
    partySize: { enabled: false, min: 1, max: 1, label: 'Participants' },
    minNoticeHours: 4,
    maxDaysAhead: 30,
    weekly: weekdays([{ start: '09:00', end: '17:00' }], [1, 2, 3, 4, 5]),
    blockedDates: [],
    location: { type: 'video', value: '' },
    contact: { email: 'required', phone: 'optional' },
    fields: [],
    confirmation: 'auto',
    confirmationMessage: 'Votre réservation est confirmée.',
    whatsapp: '',
  },
};
