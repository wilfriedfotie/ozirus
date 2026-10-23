import type { Booking, BookingPage, PublicBookingPage } from './types';

export function toPublicPage(page: BookingPage): PublicBookingPage {
  const { createdAt, updatedAt, active, ...rest } = page;
  return rest;
}

/** Ce que le client voit de sa réservation sur le lien de gestion. */
export function toPublicBooking(booking: Booking) {
  const { token, notes, source, ...rest } = booking;
  return rest;
}
