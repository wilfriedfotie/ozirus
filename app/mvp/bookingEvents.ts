// Ouverture de la modale de réservation, découplée de la modale elle-même : les CTA n'importent
// que ce petit module, et le code de la modale (widget de créneaux compris) n'est chargé qu'au
// premier clic (cf. LazyBooking dans page.tsx).
export const OPEN_BOOKING_EVENT = 'ozirus:mvp-booking';

export function openMvpBooking(source: string) {
  window.dispatchEvent(new CustomEvent(OPEN_BOOKING_EVENT, { detail: { source } }));
}
