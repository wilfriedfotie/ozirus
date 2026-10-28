'use client';

// Modale de réservation unique de la landing MVP : tous les CTA (header, hero, fin de vidéo,
// Product Experience, offres, CTA final, bouton flottant) l'ouvrent via openMvpBooking(source).
// Parcours : introduction → créneaux réels (BookingWidget, page `mvp-appel`) → coordonnées et
// qualification → confirmation. Une fois ouverte, la modale reste montée (masquée) : fermer puis
// rouvrir conserve le créneau choisi et les champs déjà saisis.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type Lenis from 'lenis';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Mail, Video, X } from 'lucide-react';
import BookingWidget from '@/components/booking/BookingWidget';
import { LOCATION_LABELS, type PublicBookingPage } from '@/lib/booking/types';
import { trackMvp } from './analytics';
import { ACCENT_INK, ACCENT_SOFT, BOOKING_SLUG, DISPLAY, EASE, FAINT, INK, LINE, MUTED, OFFER } from './theme';

import { OPEN_BOOKING_EVENT as OPEN_EVENT } from './bookingEvents';

export { openMvpBooking } from './bookingEvents';

type Stage = 'intro' | 'date' | 'form' | 'done';
const STAGES: { id: Stage; label: string }[] = [
  { id: 'intro', label: 'L\'appel' },
  { id: 'date', label: 'Créneau' },
  { id: 'form', label: 'Votre projet' },
  { id: 'done', label: 'Confirmation' },
];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function BookingModal({ lenis, onOpenChange, initialSource }: { lenis: React.RefObject<Lenis | null>; onOpenChange?: (open: boolean) => void; /** Chargée à la demande : source du clic qui l'a fait charger, à ouvrir tout de suite. */ initialSource?: string }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('intro');
  const [page, setPage] = useState<PublicBookingPage | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const openFrom = (source: string) => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setMounted(true);
      setOpen(true);
      trackMvp('booking_opened', { source });
    };
    // Le clic qui a déclenché le chargement de la modale a eu lieu avant son montage.
    if (initialSource) openFrom(initialSource);
    const onOpen = (event: Event) => openFrom((event as CustomEvent<{ source?: string }>).detail?.source ?? 'unknown');
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => setOpen(false), []);

  // Verrouille le scroll de la page (Lenis + natif) et gère le focus à l'ouverture / fermeture.
  useEffect(() => {
    onOpenChange?.(open);
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenis.current?.stop();
    const id = window.requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = previousOverflow;
      lenis.current?.start();
      returnFocus.current?.focus?.();
    };
  }, [open, lenis, onOpenChange]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.stopPropagation(); close(); return; }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const onWidgetStep = useCallback((step: 'date' | 'form' | 'done') => {
    setStage(current => (current === 'intro' && step === 'date' ? 'intro' : step));
    if (step === 'form') trackMvp('booking_slot_selected');
  }, []);

  if (!mounted) return null;

  const duration = page ? (page.durationMinutes >= 60 && page.durationMinutes % 60 === 0 ? `${page.durationMinutes / 60} h` : `${page.durationMinutes} min`) : null;
  const stageIndex = STAGES.findIndex(s => s.id === stage);

  const intro = (
    <div style={{ padding: 'clamp(22px, 4vw, 36px)', display: 'grid', gap: 22 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 8 }}>{page?.hostName ?? 'Wilfried Fotie'} · CTO Ozirus</p>
        <h2 id="mvp-booking-title" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: INK }}>
          Un appel pour cadrer votre MVP.
        </h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {duration && <span style={chip}><Clock size={14} /> {duration}</span>}
        {page && <span style={chip}>{page.location.type === 'video' ? <Video size={14} /> : <CalendarDays size={14} />} {page.location.type === 'custom' ? page.location.value : LOCATION_LABELS[page.location.type]}</span>}
      </div>
      <div style={{ display: 'grid', gap: 14, fontSize: 15, lineHeight: 1.6, color: MUTED }}>
        <p><strong style={{ color: INK }}>Objectif :</strong> clarifier l&apos;idée, la cible et ce que doit contenir le MVP, puis voir lequel des deux formats (15 ou 30 jours) correspond. Si ce n&apos;est pas le bon moment, on vous le dira.</p>
        <p><strong style={{ color: INK }}>Pour qui :</strong> fondateurs et porteurs de projet qui veulent lancer un SaaS, une application mobile, une application desktop ou un produit IA.</p>
        <p style={{ fontSize: 13.5, color: FAINT }}>Vous choisissez un créneau parmi les disponibilités réelles du calendrier, puis quelques questions sur votre projet. L&apos;appel ne vaut pas acceptation automatique du projet.</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
        <button type="button" data-autofocus onClick={() => setStage('date')} style={primaryBtn}>
          Voir les disponibilités <ArrowRight size={17} />
        </button>
        <a href={`mailto:${OFFER.email}`} style={{ fontSize: 14, color: MUTED, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Mail size={15} /> Plutôt par email
        </a>
      </div>
    </div>
  );

  return (
    <div
      role="presentation"
      onMouseDown={event => { if (event.target === event.currentTarget) close(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 900, display: open ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', padding: 'max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom))', background: 'rgba(14,14,16,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mvp-booking-title"
        onKeyDown={onKeyDown}
        initial={false}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        data-lenis-prevent
        style={{ position: 'relative', width: '100%', maxWidth: 980, maxHeight: '100%', overflowY: 'auto', overscrollBehavior: 'contain', borderRadius: 24, background: '#fff', boxShadow: '0 40px 120px rgba(16,16,20,0.35)' }}
      >
        {/* en-tête : progression + fermeture */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 14px 20px', background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${LINE}` }}>
          {stage === 'date' && (
            <button type="button" onClick={() => setStage('intro')} aria-label="Retour à la présentation de l'appel" style={iconBtn}><ArrowLeft size={16} /></button>
          )}
          <ol aria-label="Étapes de la réservation" style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '4px 14px', listStyle: 'none', margin: 0, padding: 0 }}>
            {STAGES.map((s, i) => (
              <li key={s.id} aria-current={i === stageIndex ? 'step' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: i === stageIndex ? INK : i < stageIndex ? MUTED : FAINT }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, background: i === stageIndex ? INK : i < stageIndex ? ACCENT_SOFT : '#F4F4F5', color: i === stageIndex ? '#fff' : i < stageIndex ? ACCENT_INK : FAINT }}>{i + 1}</span>
                <span className={i === stageIndex ? undefined : 'mvp-hide-sm'}>{s.label}</span>
              </li>
            ))}
          </ol>
          <button type="button" onClick={close} aria-label="Fermer la réservation" style={iconBtn}><X size={17} /></button>
        </div>

        {stage === 'intro' && intro}
        {/* Le widget est monté dès l'ouverture (créneaux préchargés pendant l'introduction)
            et masqué tant que l'introduction est affichée. */}
        <div hidden={stage === 'intro'} style={{ padding: 'clamp(10px, 2vw, 18px)' }}>
          {stage !== 'intro' && <h2 id="mvp-booking-title" className="mvp-sr-only">Réserver un appel découverte MVP</h2>}
          <BookingWidget
            slug={BOOKING_SLUG}
            source="landing-mvp"
            onLoaded={setPage}
            onStepChange={onWidgetStep}
            onSubmitStart={() => trackMvp('qualification_submitted')}
            onBooked={() => trackMvp('booking_confirmed')}
            timezone="Europe/Paris"
            whatsapp={false}
            fallback={(
              <div style={{ padding: 28, textAlign: 'center', display: 'grid', gap: 14, justifyItems: 'center' }}>
                <p style={{ fontSize: 15, color: MUTED, maxWidth: 420, lineHeight: 1.6 }}>Le calendrier en ligne est momentanément indisponible. Écrivez-nous directement, réponse rapide.</p>
                <a href={`mailto:${OFFER.email}`} style={{ ...primaryBtn, textDecoration: 'none' }}><Mail size={17} /> {OFFER.email}</a>
              </div>
            )}
          />
        </div>
      </motion.div>
    </div>
  );
}

const chip: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 999, background: '#F6F6F7', border: `1px solid ${LINE}`, fontSize: 13, fontWeight: 600, color: INK };
const primaryBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '14px 24px', borderRadius: 999, border: 'none', background: INK, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' };
const iconBtn: React.CSSProperties = { width: 36, height: 36, flexShrink: 0, borderRadius: 999, border: `1px solid ${LINE}`, background: '#fff', color: INK, display: 'grid', placeItems: 'center', cursor: 'pointer' };
