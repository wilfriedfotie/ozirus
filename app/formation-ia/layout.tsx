import type { Metadata } from 'next';

// Servie sur formation.ozirus.agency (voir lib/subdomains.ts) : l'URL canonique est le sous-domaine.
export const metadata: Metadata = {
  title: 'Formation « Votre métier + l\'IA = un 2e revenu » | Ozirus',
  description:
    'Formation Ozirus pour salariés et indépendants : en 5 semaines, transformez votre métier en une offre vendue avec l\'IA, pour un revenu complémentaire sans quitter votre emploi. 100 000 FCFA, payable en 3 fois.',
  alternates: { canonical: 'https://formation.ozirus.agency' },
  openGraph: {
    title: 'Votre métier + l\'IA = un 2e revenu — Formation Ozirus',
    description:
      'Transformez votre métier en offre avec l\'IA : 4 semaines en groupe + 1 semaine en 1:1. 100 000 FCFA en 3 fois.',
    url: 'https://formation.ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus — Formation revenus complémentaires avec l\'IA' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Votre métier + l\'IA = un 2e revenu — Formation Ozirus',
    description: 'Un revenu complémentaire avec l\'IA, sans quitter votre emploi. 100 000 FCFA en 3 fois.',
    images: ['/og-image.jpg'],
  },
};

export default function FormationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
