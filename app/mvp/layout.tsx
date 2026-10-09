import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MVP en 30 jours — 5 000 € avec un CTO cofondateur | Ozirus',
  description:
    'Offre spéciale : votre MVP SaaS, mobile ou desktop livré en 30 jours chrono pour 5 000 € au lieu de 10 000 €. Landing page et vidéo motion promo offertes. 5 ans d\'expérience, un CTO cofondateur à vos côtés.',
  alternates: { canonical: 'https://mvp.ozirus.agency' },
  openGraph: {
    title: 'Votre MVP en 30 jours chrono — 5 000 € au lieu de 10 000 €',
    description:
      'Un CTO cofondateur pour construire votre SaaS, app mobile ou desktop. Landing page + vidéo motion promo offertes.',
    url: 'https://mvp.ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus — MVP en 30 jours' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Votre MVP en 30 jours chrono — 5 000 €',
    description: 'Un CTO cofondateur, 5 ans d\'expérience. Landing page + vidéo motion promo offertes.',
    images: ['/og-image.jpg'],
  },
};

export default function MvpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
