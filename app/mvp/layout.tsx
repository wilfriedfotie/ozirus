import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MVP en 15 ou 30 jours — à partir de 2 500 € | Ozirus',
  description:
    'Deux formats pour lancer votre MVP : 15 jours à partir de 2 500 € ou 30 jours à 5 000 € HT. Retours illimités, prix fixe, code à votre nom et mise en ligne incluse.',
  alternates: { canonical: 'https://mvp.ozirus.agency' },
  openGraph: {
    title: 'Votre MVP en 15 ou 30 jours — retours illimités',
    description:
      'Un MVP cadré, construit et mis en ligne avec un CTO. 15 jours à 2 500 € ou 30 jours à 5 000 € HT.',
    url: 'https://mvp.ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus — MVP en 15 ou 30 jours' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Votre MVP en 15 ou 30 jours — retours illimités',
    description: 'Deux formats, prix fixe, retours illimités et code à votre nom.',
    images: ['/og-image.jpg'],
  },
};

export default function MvpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
