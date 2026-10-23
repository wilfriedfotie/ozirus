'use client';

// Lien de gestion remis au client après réservation : /book/manage/<id>?t=<token>.
import React, { Suspense, use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarDays, Clock, LoaderCircle, Users, XCircle } from 'lucide-react';
import { STATUS_META, type Booking, type PublicBookingPage } from '@/lib/booking/types';

type PublicBooking = Omit<Booking, 'token' | 'notes' | 'source'>;

export default function ManageBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Suspense fallback={null}><ManageBookingContent id={id} /></Suspense>;
}

function ManageBookingContent({ id }: { id: string }) {
  const token = useSearchParams().get('t') ?? '';
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [page, setPage] = useState<PublicBookingPage | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetch(`/api/booking/manage/${id}?t=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Lien invalide.');
        setBooking(data.booking);
        setPage(data.page);
      })
      .catch(err => setError(err.message));
  }, [id, token]);

  const cancel = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/booking/manage/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token, action: 'cancel' }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Annulation impossible.');
      setBooking(data.booking);
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Annulation impossible.');
    } finally {
      setBusy(false);
    }
  };

  const zone = booking?.guestTimezone || page?.timezone || 'Europe/Paris';
  const fmt = (iso: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-FR', { timeZone: zone, ...options }).format(new Date(iso));
  const status = booking ? STATUS_META[booking.status] : null;
  const isPast = booking ? Date.parse(booking.start) < Date.now() : false;

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', padding: '64px 16px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', color: '#0F172A' }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 18, padding: 28, boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
        {!booking && !error && <div style={{ display: 'flex', justifyContent: 'center', color: '#94A3B8' }}><LoaderCircle size={22} /></div>}
        {error && !booking && <p style={{ color: '#B91C1C', fontSize: 14, margin: 0 }}>{error}</p>}
        {booking && status && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: status.color, background: status.bg }}>{status.label}</span>
              <h1 style={{ fontSize: 22, margin: '12px 0 4px' }}>{booking.pageTitle}</h1>
              {page && <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>{page.hostName}</p>}
            </div>
            <div style={{ display: 'grid', gap: 9, fontSize: 14, padding: 16, borderRadius: 14, background: '#F8FAFC' }}>
              <span style={{ display: 'flex', gap: 9, alignItems: 'center' }}><CalendarDays size={15} /> {fmt(booking.start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Clock size={15} /> {fmt(booking.start, { hour: '2-digit', minute: '2-digit' })} – {fmt(booking.end, { hour: '2-digit', minute: '2-digit' })} <span style={{ color: '#94A3B8' }}>({zone.replace(/_/g, ' ')})</span></span>
              {booking.kind === 'table' && <span style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Users size={15} /> {booking.partySize} {page?.partySize.label.toLowerCase() ?? 'personnes'}</span>}
              <span style={{ color: '#64748B' }}>Au nom de {booking.name}</span>
            </div>
            {error && <p style={{ color: '#B91C1C', fontSize: 13, margin: 0 }}>{error}</p>}
            {booking.status !== 'cancelled' && !isPast && (confirming ? (
              <div style={{ display: 'grid', gap: 10 }}>
                <p style={{ fontSize: 14, margin: 0 }}>Annuler définitivement cette réservation ?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={cancel} disabled={busy} style={{ flex: 1, padding: '12px', borderRadius: 999, border: 'none', background: '#DC2626', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{busy ? 'Annulation…' : 'Oui, annuler'}</button>
                  <button onClick={() => setConfirming(false)} style={{ flex: 1, padding: '12px', borderRadius: 999, border: '1px solid #E2E8F0', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Garder</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 999, border: '1px solid #FECACA', background: '#fff', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}>
                <XCircle size={16} /> Annuler la réservation
              </button>
            ))}
            {booking.status === 'cancelled' && page && (
              <a href={`/book/${page.slug}`} style={{ textAlign: 'center', padding: '12px', borderRadius: 999, background: page.color || '#0F172A', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Choisir un nouveau créneau</a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
