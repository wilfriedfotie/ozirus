import { NextRequest, NextResponse } from 'next/server';
import { BookingError, bookingPagesService, bookingsService } from '@/lib/booking/service';
import { toPublicPage } from '@/lib/booking/publicPage';
import { addDaysKey, isValidTimeZone } from '@/lib/booking/slots';

// API publique du widget de réservation (landing MVP, sites clients en iframe…).
// GET  /api/booking/<slug>?from=YYYY-MM-DD&to=YYYY-MM-DD → page + créneaux libres
// POST /api/booking/<slug>                               → crée la réservation

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

async function loadPage(slug: string) {
  const page = await bookingPagesService.getBySlug(slug);
  if (!page || !page.active) throw new BookingError('Page de réservation introuvable.', 404);
  return page;
}

const fail = (error: unknown) => {
  if (error instanceof BookingError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error('[booking]', error);
  return NextResponse.json({ error: 'Erreur serveur, réessayez dans un instant.' }, { status: 500 });
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const page = await loadPage(slug);
    const from = req.nextUrl.searchParams.get('from');
    const to = req.nextUrl.searchParams.get('to');
    if (!from || !to) return NextResponse.json({ page: toPublicPage(page) });
    if (!DAY.test(from) || !DAY.test(to) || to < from || to > addDaysKey(from, 62)) throw new BookingError('Plage de dates invalide.');
    const slots = await bookingsService.slots(page, from, to);
    return NextResponse.json({ page: toPublicPage(page), slots }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const page = await loadPage(slug);
    const body = await req.json().catch(() => ({}));

    // Champ piège invisible : un humain ne le remplit jamais.
    if (clean(body.website)) return NextResponse.json({ error: 'Requête refusée.' }, { status: 400 });

    const name = clean(body.name, 120);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 40);
    if (!name) throw new BookingError('Votre nom est obligatoire.');
    if (page.contact.email === 'required' && !email) throw new BookingError('Votre email est obligatoire.');
    if (email && !EMAIL.test(email)) throw new BookingError('Adresse email invalide.');
    if (page.contact.phone === 'required' && !phone) throw new BookingError('Votre téléphone est obligatoire.');

    const partySize = page.partySize.enabled ? Math.round(Number(body.partySize)) : 1;
    if (page.partySize.enabled && !(partySize >= page.partySize.min && partySize <= page.partySize.max)) {
      throw new BookingError(`${page.partySize.label} : entre ${page.partySize.min} et ${page.partySize.max}.`);
    }

    const rawAnswers = body.answers && typeof body.answers === 'object' ? body.answers as Record<string, unknown> : {};
    const answers: Record<string, string> = {};
    for (const field of page.fields) {
      const value = clean(rawAnswers[field.id], 2000);
      if (field.required && !value) throw new BookingError(`« ${field.label} » est obligatoire.`);
      if (field.type === 'select' && value && !field.options?.includes(value)) throw new BookingError(`Valeur invalide pour « ${field.label} ».`);
      if (value) answers[field.id] = value;
    }

    const guestTimezone = clean(body.guestTimezone, 64);
    const booking = await bookingsService.create(page, {
      start: clean(body.start, 40),
      name,
      email,
      phone,
      partySize,
      answers,
      guestTimezone: guestTimezone && isValidTimeZone(guestTimezone) ? guestTimezone : page.timezone,
      source: clean(body.source, 300) || clean(req.headers.get('referer'), 300),
    });

    return NextResponse.json({
      booking: { id: booking.id, start: booking.start, end: booking.end, status: booking.status, partySize: booking.partySize },
      manageUrl: `/book/manage/${booking.id}?t=${booking.token}`,
    }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
