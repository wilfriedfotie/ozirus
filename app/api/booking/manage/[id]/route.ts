import { NextRequest, NextResponse } from 'next/server';
import { BookingError, bookingPagesService, bookingsService } from '@/lib/booking/service';
import { toPublicBooking, toPublicPage } from '@/lib/booking/publicPage';

// Lien de gestion remis au client après réservation : /book/manage/<id>?t=<token>.
// GET → récapitulatif ; POST { t, action: 'cancel' } → annulation (libère le créneau).

async function authorize(id: string, token: string | null) {
  const booking = await bookingsService.get(id);
  if (!booking || !token || booking.token !== token) throw new BookingError('Lien de réservation invalide.', 404);
  return booking;
}

const fail = (error: unknown) => {
  if (error instanceof BookingError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error('[booking:manage]', error);
  return NextResponse.json({ error: 'Erreur serveur, réessayez dans un instant.' }, { status: 500 });
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await authorize(id, req.nextUrl.searchParams.get('t'));
    const page = await bookingPagesService.get(booking.pageId);
    return NextResponse.json({ booking: toPublicBooking(booking), page: page ? toPublicPage(page) : null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const booking = await authorize(id, typeof body.t === 'string' ? body.t : null);
    if (body.action !== 'cancel') throw new BookingError('Action inconnue.');
    if (booking.status === 'cancelled') return NextResponse.json({ booking: toPublicBooking(booking) });
    if (Date.parse(booking.start) < Date.now()) throw new BookingError('Ce rendez-vous est déjà passé.');
    const updated = await bookingsService.setStatus(id, 'cancelled');
    return NextResponse.json({ booking: toPublicBooking(updated) });
  } catch (error) {
    return fail(error);
  }
}
