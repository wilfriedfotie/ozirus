import { track } from '@vercel/analytics';

// Événements de conversion de la landing MVP, envoyés à Vercel Analytics (déjà monté dans
// LayoutClientWrapper). Jamais de nom, d'email ni de réponse libre dans les propriétés :
// uniquement des identifiants techniques (source du CTA, type de produit, étape).
export type MvpEvent =
  | 'hero_cta_clicked'
  | 'video_started'
  | 'video_completed'
  | 'product_type_selected'
  | 'product_demo_step_viewed'
  | 'product_demo_completed'
  | 'booking_opened'
  | 'booking_slot_selected'
  | 'qualification_submitted'
  | 'booking_confirmed';

export function trackMvp(event: MvpEvent, props?: Record<string, string | number | boolean>) {
  try {
    track(event, props);
  } catch {
    // L'analytics ne doit jamais casser le parcours.
  }
}
