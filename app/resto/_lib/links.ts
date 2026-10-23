// L'onboarding et le dashboard vivent dans le projet whatsapp-resto-saas, pas sur ozirus.agency :
// en attendant qu'ils soient en ligne, les CTA « essai gratuit » ouvrent une conversation WhatsApp.
export const RESTO_WHATSAPP_URL = `https://wa.me/237694086571?text=${encodeURIComponent(
  "Bonjour, je souhaite essayer Ozirus Resto pour mon restaurant.",
)}`;
