'use client';

// Widget de réservation Ozirus (type Calendly), réutilisable partout :
// - <BookingWidget slug="mvp-appel" />          → données via /api/booking/<slug>
// - <BookingWidget page={config} preview />     → aperçu live de l'admin (créneaux calculés
//   localement, aucune réservation possible)
// Parcours : calendrier du mois → créneaux du jour → formulaire → confirmation.
// Les heures sont affichées dans le fuseau du visiteur, sauf pour un rendez-vous sur place
// (restaurant…) où seul le fuseau de l'établissement a du sens.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CalendarPlus, Check, ChevronLeft, ChevronRight, Clock, Globe, LoaderCircle, MapPin, MessageCircle, Users, Video, Phone } from 'lucide-react';
import { addDaysKey, computeSlots, dateKey, weekdayOf } from '@/lib/booking/slots';
import { LOCATION_LABELS, type PublicBookingPage, type Slot } from '@/lib/booking/types';
import { Select } from '@/components/forms/Select';

const INK = '#0F172A';
const MUTED = '#64748B';
const FAINT = '#94A3B8';
const BORDER = '#E2E8F0';
const SURFACE = '#F8FAFC';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const COMMON_TIMEZONES = ['Europe/Paris', 'Europe/Brussels', 'Europe/London', 'Africa/Douala', 'Africa/Libreville', 'Africa/Abidjan', 'Africa/Dakar', 'Africa/Casablanca', 'America/Montreal', 'America/New_York', 'UTC'];

type Step = 'date' | 'form' | 'done';
type Result = { status: string; start: string; end: string; partySize: number; manageUrl: string };

interface Props {
  slug?: string;
  page?: PublicBookingPage;
  preview?: boolean;
  /** Origine de l'API (vide = même domaine). */
  apiBase?: string;
  /** Source enregistrée avec la réservation (ex. 'landing-mvp'). */
  source?: string;
  onBooked?: (result: Result) => void;
  /** Affiché à la place du widget si la page est introuvable/inactive (ex. lien WhatsApp). */
  fallback?: React.ReactNode;
}

const monthKey = (key: string) => key.slice(0, 7);
const shiftMonth = (month: string, delta: number) => {
  const [y, m] = month.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
};
const daysInMonth = (month: string) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
};

const fmt = (iso: string, timeZone: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone, ...options }).format(new Date(iso));
const fmtTime = (iso: string, timeZone: string) => fmt(iso, timeZone, { hour: '2-digit', minute: '2-digit' });
const fmtDay = (key: string) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${key}T12:00:00Z`));
const fmtMonth = (month: string) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(`${month}-15T12:00:00Z`));

const icsStamp = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function LocationIcon({ type, size = 15 }: { type: string; size?: number }) {
  if (type === 'video') return <Video size={size} />;
  if (type === 'phone') return <Phone size={size} />;
  if (type === 'whatsapp') return <MessageCircle size={size} />;
  return <MapPin size={size} />;
}

export default function BookingWidget({ slug, page: pageProp, preview = false, apiBase = '', source, onBooked, fallback }: Props) {
  const [page, setPage] = useState<PublicBookingPage | null>(pageProp ?? null);
  const [loadError, setLoadError] = useState('');
  const [browserZone, setBrowserZone] = useState('Europe/Paris');
  const [zone, setZone] = useState<string | null>(null);
  const [month, setMonth] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [step, setStep] = useState<Step>('date');
  const [form, setForm] = useState({ name: '', email: '', phone: '', website: '' });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [narrow, setNarrow] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => { if (pageProp) setPage(pageProp); }, [pageProp]);

  useEffect(() => {
    try { setBrowserZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris'); } catch { /* fuseau par défaut */ }
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 720));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Chargement de la configuration (mode API).
  useEffect(() => {
    if (pageProp || !slug) return;
    let cancelled = false;
    fetch(`${apiBase}/api/booking/${encodeURIComponent(slug)}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Réservation indisponible.');
        if (!cancelled) setPage(data.page);
      })
      .catch(err => { if (!cancelled) setLoadError(err.message); });
    return () => { cancelled = true; };
  }, [slug, pageProp, apiBase]);

  const onsite = page?.location.type === 'onsite';
  const displayZone = onsite || !page ? (page?.timezone ?? browserZone) : (zone ?? browserZone);
  const units = page?.partySize.enabled ? partySize : 1;

  useEffect(() => {
    if (!page) return;
    if (page.partySize.enabled) setPartySize(value => Math.min(page.partySize.max, Math.max(page.partySize.min, value)));
    if (!month) setMonth(monthKey(dateKey(Date.now(), displayZone)));
  }, [page, month, displayZone]);

  // Créneaux du mois affiché (on déborde d'un jour de chaque côté pour les écarts de fuseau).
  const loadSlots = useCallback(async () => {
    if (!page || !month) return;
    const from = addDaysKey(`${month}-01`, -1);
    const to = addDaysKey(`${month}-${String(daysInMonth(month)).padStart(2, '0')}`, 1);
    if (preview) { setSlots(computeSlots({ ...page, active: true, createdAt: '', updatedAt: '' }, from, to, [])); return; }
    setLoadingSlots(true);
    try {
      const response = await fetch(`${apiBase}/api/booking/${encodeURIComponent(page.slug)}?from=${from}&to=${to}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de charger les créneaux.');
      setSlots(data.slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les créneaux.');
    } finally {
      setLoadingSlots(false);
    }
  }, [page, month, preview, apiBase]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      if (slot.remaining < units) continue;
      const key = dateKey(Date.parse(slot.start), displayZone);
      map.set(key, [...(map.get(key) ?? []), slot]);
    }
    return map;
  }, [slots, units, displayZone]);

  // Sélectionne automatiquement le premier jour disponible du mois.
  useEffect(() => {
    if (step !== 'date') return;
    if (selectedDay && monthKey(selectedDay) === month && slotsByDay.has(selectedDay)) return;
    const first = [...slotsByDay.keys()].filter(key => monthKey(key) === month).sort()[0];
    setSelectedDay(first ?? '');
  }, [slotsByDay, month, selectedDay, step]);

  const todayMonth = monthKey(dateKey(Date.now(), displayZone));
  const accent = page?.color || INK;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!page || !selectedSlot) return;
    setError('');
    // Le Select maison n'a pas la validation native `required` d'un <select>.
    const missing = page.fields.find(field => field.type === 'select' && field.required && !answers[field.id]);
    if (missing) { setError(`Choisissez une réponse pour « ${missing.label} ».`); return; }
    if (preview) { setError('Aperçu : la réservation est désactivée ici.'); return; }
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/api/booking/${encodeURIComponent(page.slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, start: selectedSlot.start, partySize, answers, guestTimezone: displayZone, source: source ?? (typeof window !== 'undefined' ? window.location.href : '') }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) { setStep('date'); setSelectedSlot(null); loadSlots(); }
        throw new Error(data.error || 'La réservation a échoué.');
      }
      const booked = { ...data.booking, manageUrl: `${apiBase || window.location.origin}${data.manageUrl}` } as Result;
      setResult(booked);
      setStep('done');
      onBooked?.(booked);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La réservation a échoué.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    if (fallback) return <>{fallback}</>;
    return <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 14 }}>{loadError}</div>;
  }
  if (!page || !month) {
    return <div style={{ padding: 48, display: 'flex', justifyContent: 'center', color: FAINT }}><LoaderCircle size={22} className="ozb-spin" /><style>{spinCss}</style></div>;
  }

  /* ─── panneau d'infos (gauche) ─── */
  const info = (
    <div style={{ padding: narrow ? '22px 22px 16px' : 28, borderRight: narrow ? 'none' : `1px solid ${BORDER}`, borderBottom: narrow ? `1px solid ${BORDER}` : 'none' }}>
      {step === 'form' && (
        <button type="button" onClick={() => { setStep('date'); setError(''); }} style={{ ...ghostBtn, marginBottom: 18, color: accent, borderColor: BORDER }}>
          <ArrowLeft size={15} />
        </button>
      )}
      <p style={{ fontSize: 13, fontWeight: 600, color: MUTED, margin: '0 0 6px' }}>{page.hostName}</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: INK, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>{page.title}</h2>
      <div style={{ display: 'grid', gap: 10, fontSize: 14, color: MUTED }}>
        <span style={metaRow}><Clock size={15} /> {page.durationMinutes >= 60 && page.durationMinutes % 60 === 0 ? `${page.durationMinutes / 60} h` : `${page.durationMinutes} min`}</span>
        <span style={metaRow}><LocationIcon type={page.location.type} /> {page.location.type === 'custom' ? page.location.value : LOCATION_LABELS[page.location.type]}</span>
        {selectedSlot && step !== 'date' && (
          <span style={{ ...metaRow, color: INK, fontWeight: 600 }}>
            <CalendarDays size={15} /> {fmt(selectedSlot.start, displayZone, { weekday: 'long', day: 'numeric', month: 'long' })}, {fmtTime(selectedSlot.start, displayZone)} – {fmtTime(selectedSlot.end, displayZone)}
          </span>
        )}
        {page.partySize.enabled && step !== 'date' && <span style={metaRow}><Users size={15} /> {partySize} {page.partySize.label.toLowerCase()}</span>}
        {!onsite && <span style={metaRow}><Globe size={15} /> {displayZone.replace(/_/g, ' ')}</span>}
      </div>
      {page.description && <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED, margin: '18px 0 0', whiteSpace: 'pre-line' }}>{page.description}</p>}
    </div>
  );

  /* ─── étape 1 : date + créneau ─── */
  const firstWeekday = (weekdayOf(`${month}-01`) + 6) % 7; // lundi = 0
  const cells: (string | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth(month) }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`)];
  const daySlots = slotsByDay.get(selectedDay) ?? [];

  const datePicker = (
    <div style={{ padding: narrow ? 20 : 28, display: 'grid', gridTemplateColumns: narrow || !selectedDay ? '1fr' : 'minmax(0, 1fr) 180px', gap: 24 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 16px' }}>Choisissez une date</h3>
        {page.partySize.enabled && (
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 12, marginBottom: 16, fontSize: 14, color: INK }}>
            <span style={metaRow}><Users size={15} /> {page.partySize.label}</span>
            <Select
              value={String(partySize)}
              onChange={value => { setPartySize(Number(value)); setSelectedSlot(null); }}
              options={Array.from({ length: page.partySize.max - page.partySize.min + 1 }, (_, index) => String(page.partySize.min + index)).map(value => ({ value, label: value }))}
              accent={accent}
              style={{ ...inputBase, width: 'auto', minWidth: 76, padding: '6px 10px' }}
            />
          </label>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: INK, textTransform: 'capitalize' }}>{fmtMonth(month)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" aria-label="Mois précédent" disabled={month <= todayMonth} onClick={() => setMonth(shiftMonth(month, -1))} style={{ ...ghostBtn, opacity: month <= todayMonth ? 0.35 : 1 }}><ChevronLeft size={16} /></button>
            <button type="button" aria-label="Mois suivant" onClick={() => setMonth(shiftMonth(month, 1))} style={ghostBtn}><ChevronRight size={16} /></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
          {WEEKDAYS.map((label, index) => <span key={index} style={{ fontSize: 11, fontWeight: 600, color: FAINT, padding: '4px 0' }}>{label}</span>)}
          {cells.map((key, index) => {
            if (!key) return <span key={`empty-${index}`} />;
            const available = slotsByDay.has(key);
            const selected = key === selectedDay;
            return (
              <button
                key={key}
                type="button"
                disabled={!available}
                onClick={() => { setSelectedDay(key); setSelectedSlot(null); }}
                style={{
                  aspectRatio: '1', maxHeight: 46, borderRadius: 999, border: 'none', fontSize: 14, cursor: available ? 'pointer' : 'default',
                  fontWeight: available ? 700 : 400,
                  background: selected ? accent : available ? `${accent}14` : 'transparent',
                  color: selected ? '#fff' : available ? accent : '#CBD5E1',
                }}
              >
                {Number(key.slice(8))}
              </button>
            );
          })}
        </div>
        {loadingSlots && <p style={{ fontSize: 12, color: FAINT, margin: '12px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}><LoaderCircle size={13} className="ozb-spin" /> Chargement des disponibilités…</p>}
        {!loadingSlots && slotsByDay.size === 0 && <p style={{ fontSize: 13, color: MUTED, margin: '14px 0 0' }}>Aucune disponibilité ce mois-ci — essayez le mois suivant.</p>}
        {!onsite && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontSize: 13, color: MUTED }}>
            <Globe size={14} />
            <Select
              value={displayZone}
              onChange={setZone}
              options={[...new Set([browserZone, displayZone, ...COMMON_TIMEZONES])].map(value => ({ value, label: value.replace(/_/g, ' ') }))}
              accent={accent}
              style={{ ...inputBase, width: 'auto', padding: '6px 8px', fontSize: 13, border: 'none', background: 'transparent', color: MUTED }}
            />
          </label>
        )}
      </div>
      {selectedDay && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: INK, margin: '0 0 14px', textTransform: 'capitalize' }}>{fmtDay(selectedDay)}</h3>
          <div data-lenis-prevent style={{ display: 'grid', gridTemplateColumns: narrow ? 'repeat(auto-fill, minmax(92px, 1fr))' : '1fr', gap: 8, maxHeight: narrow ? 'none' : 380, overflowY: 'auto', paddingRight: 2 }}>
            {daySlots.map(slot => {
              const selected = selectedSlot?.start === slot.start;
              return (
                <div key={slot.start} style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{ flex: 1, padding: '11px 8px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: `1px solid ${selected ? INK : `${accent}66`}`, background: selected ? '#475569' : '#fff', color: selected ? '#fff' : accent }}
                  >
                    {fmtTime(slot.start, displayZone)}
                  </button>
                  {selected && (
                    <button type="button" onClick={() => { setStep('form'); setError(''); }} style={{ flex: 1, padding: '11px 8px', borderRadius: 10, border: 'none', background: accent, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                      Suivant
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  /* ─── étape 2 : formulaire ─── */
  const contactField = (key: 'email' | 'phone', label: string, type: string) => page.contact[key] === 'hidden' ? null : (
    <label style={fieldLabel}>
      {label}{page.contact[key] === 'required' && ' *'}
      <input type={type} required={page.contact[key] === 'required'} value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} style={inputBase} autoComplete={key === 'email' ? 'email' : 'tel'} />
    </label>
  );

  const formStep = (
    <form onSubmit={submit} style={{ padding: narrow ? 20 : 28, display: 'grid', gap: 16, alignContent: 'start' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0 }}>Vos informations</h3>
      <label style={fieldLabel}>
        Nom complet *
        <input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} style={inputBase} autoComplete="name" />
      </label>
      {contactField('email', 'Email', 'email')}
      {contactField('phone', 'Téléphone / WhatsApp', 'tel')}
      {page.fields.map(field => (
        <label key={field.id} style={fieldLabel}>
          {field.label}{field.required && ' *'}
          {field.type === 'textarea' ? (
            <textarea required={field.required} rows={4} placeholder={field.placeholder} value={answers[field.id] ?? ''} onChange={event => setAnswers({ ...answers, [field.id]: event.target.value })} style={{ ...inputBase, resize: 'vertical', fontFamily: 'inherit' }} />
          ) : field.type === 'select' ? (
            <Select
              value={answers[field.id] ?? ''}
              onChange={value => setAnswers({ ...answers, [field.id]: value })}
              options={(field.options ?? []).map(option => ({ value: option, label: option }))}
              placeholder="Choisir…"
              accent={accent}
              style={inputBase}
            />
          ) : (
            <input required={field.required} placeholder={field.placeholder} value={answers[field.id] ?? ''} onChange={event => setAnswers({ ...answers, [field.id]: event.target.value })} style={inputBase} />
          )}
        </label>
      ))}
      {/* Champ piège anti-spam, invisible pour un humain. */}
      <input tabIndex={-1} autoComplete="off" aria-hidden value={form.website} onChange={event => setForm({ ...form, website: event.target.value })} name="website" style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }} />
      <button type="submit" disabled={submitting} style={{ marginTop: 4, padding: '14px 20px', borderRadius: 999, border: 'none', background: accent, color: '#fff', fontSize: 15, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1 }}>
        {submitting && <LoaderCircle size={16} className="ozb-spin" />}
        {page.kind === 'table' ? 'Réserver la table' : 'Confirmer le rendez-vous'}
      </button>
    </form>
  );

  /* ─── étape 3 : confirmation ─── */
  const doneStep = result && (() => {
    const pending = result.status === 'pending';
    const where = page.location.type === 'custom' ? page.location.value : `${LOCATION_LABELS[page.location.type]}${page.location.value ? ` — ${page.location.value}` : ''}`;
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${page.title} — ${page.hostName}`)}&dates=${icsStamp(result.start)}/${icsStamp(result.end)}&details=${encodeURIComponent(`${where}\nGérer : ${result.manageUrl}`)}`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ozirus//Booking//FR', 'BEGIN:VEVENT', `UID:${result.manageUrl.split('/').pop()}@ozirus.agency`, `DTSTAMP:${icsStamp(new Date().toISOString())}`, `DTSTART:${icsStamp(result.start)}`, `DTEND:${icsStamp(result.end)}`, `SUMMARY:${page.title} — ${page.hostName}`, `DESCRIPTION:${where.replace(/\n/g, ' ')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const whatsappText = `Bonjour, je viens de réserver « ${page.title} » le ${fmt(result.start, displayZone, { weekday: 'long', day: 'numeric', month: 'long' })} à ${fmtTime(result.start, displayZone)} (${displayZone}). Mon nom : ${form.name}.`;
    return (
      <div style={{ padding: narrow ? 28 : 44, textAlign: 'center', display: 'grid', justifyItems: 'center', gap: 14 }}>
        <span style={{ width: 52, height: 52, borderRadius: 999, background: pending ? '#FEF3C7' : '#D1FAE5', color: pending ? '#B45309' : '#047857', display: 'grid', placeItems: 'center' }}><Check size={26} /></span>
        <h3 style={{ fontSize: 21, fontWeight: 700, color: INK, margin: 0 }}>{pending ? 'Demande envoyée' : 'Réservation confirmée'}</h3>
        <p style={{ fontSize: 14.5, color: MUTED, margin: 0, maxWidth: 420, lineHeight: 1.6 }}>{page.confirmationMessage}</p>
        <div style={{ width: '100%', maxWidth: 420, padding: 16, border: `1px solid ${BORDER}`, borderRadius: 14, textAlign: 'left', display: 'grid', gap: 8, fontSize: 14, color: INK }}>
          <strong>{page.title}</strong>
          <span style={metaRow}><CalendarDays size={15} /> {fmt(result.start, displayZone, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span style={metaRow}><Clock size={15} /> {fmtTime(result.start, displayZone)} – {fmtTime(result.end, displayZone)} {!onsite && <span style={{ color: FAINT }}>({displayZone.replace(/_/g, ' ')})</span>}</span>
          {page.partySize.enabled && <span style={metaRow}><Users size={15} /> {result.partySize} {page.partySize.label.toLowerCase()}</span>}
          <span style={metaRow}><LocationIcon type={page.location.type} /> {where}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          <a href={googleUrl} target="_blank" rel="noreferrer" style={linkBtn}><CalendarPlus size={15} /> Google Agenda</a>
          <a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download="reservation.ics" style={linkBtn}><CalendarDays size={15} /> Fichier .ics</a>
          {page.whatsapp && <a href={`https://wa.me/${page.whatsapp}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" style={{ ...linkBtn, background: '#25D366', borderColor: '#25D366', color: '#fff' }}><MessageCircle size={15} /> Prévenir sur WhatsApp</a>}
        </div>
        <p style={{ fontSize: 12.5, color: FAINT, margin: '6px 0 0', maxWidth: 420, lineHeight: 1.5 }}>
          Un empêchement ? <a href={result.manageUrl} target="_blank" rel="noreferrer" style={{ color: MUTED }}>Gérer ou annuler ma réservation</a> — gardez ce lien.
        </p>
      </div>
    );
  })();

  return (
    <div ref={containerRef} style={{ background: '#fff', color: INK, fontFamily: 'inherit', borderRadius: 18, border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(15,23,42,0.06)', overflow: 'hidden', width: '100%' }}>
      <style>{spinCss}</style>
      {preview && <div style={{ padding: '8px 16px', background: SURFACE, borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '.06em', textTransform: 'uppercase' }}>Aperçu — les créneaux ignorent les réservations existantes</div>}
      {step === 'done' ? doneStep : (
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'minmax(220px, 300px) minmax(0, 1fr)' }}>
          {info}
          <div style={{ position: 'relative' }}>
            {step === 'date' ? datePicker : formStep}
            {error && <p role="alert" style={{ margin: narrow ? '0 20px 20px' : '0 28px 24px', padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', color: '#B91C1C', fontSize: 13 }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

const spinCss = '@keyframes ozb-spin{to{transform:rotate(360deg)}}.ozb-spin{animation:ozb-spin 0.9s linear infinite}';
const metaRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9 };
const ghostBtn: React.CSSProperties = { width: 34, height: 34, borderRadius: 999, border: `1px solid ${BORDER}`, background: '#fff', color: INK, display: 'inline-grid', placeItems: 'center', cursor: 'pointer' };
const inputBase: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '11px 13px', border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 14, color: INK, background: '#fff', outline: 'none' };
const fieldLabel: React.CSSProperties = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: INK };
const linkBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 999, border: `1px solid ${BORDER}`, color: INK, fontSize: 13, fontWeight: 600, textDecoration: 'none', background: '#fff' };
