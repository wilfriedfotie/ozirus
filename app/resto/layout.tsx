import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ozirus Resto — Commandes, stock et fidélisation via WhatsApp',
  description:
    'Gérez vos commandes, votre stock et la fidélisation de vos clients via WhatsApp — pour les restaurants au Cameroun.',
  alternates: { canonical: 'https://resto.ozirus.agency' },
  openGraph: {
    title: 'Ozirus Resto — votre restaurant piloté depuis WhatsApp',
    description:
      'Commandes, stock et fidélisation de vos clients via WhatsApp, pour les restaurants au Cameroun.',
    url: 'https://resto.ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus Resto' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ozirus Resto — votre restaurant piloté depuis WhatsApp',
    description: 'Commandes, stock et fidélisation via WhatsApp, pour les restaurants au Cameroun.',
    images: ['/og-image.jpg'],
  },
};

export default function RestoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
