import type { Metadata } from 'next';

// Servie sur formation.ozirus.agency (voir lib/subdomains.ts) : l'URL canonique est le sous-domaine.
export const metadata: Metadata = {
  title: 'Formation « Gagner de l\'argent avec l\'IA » — Code, SaaS, motion design | Ozirus',
  description:
    'Formation Ozirus : 1 mois pour gagner de l\'argent avec l\'IA (code, SaaS, motion design) et packager votre propre offre, puis 1 semaine de coaching individuel. 100 000 FCFA, payable en 3 fois.',
  alternates: { canonical: 'https://formation.ozirus.agency' },
  openGraph: {
    title: 'Gagnez de l\'argent avec l\'IA — Formation Ozirus',
    description:
      'Code, SaaS, motion design et packaging : 1 mois de formation + 1 semaine en 1:1. 100 000 FCFA en 3 fois.',
    url: 'https://formation.ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus — Formation gagner de l\'argent avec l\'IA' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gagnez de l\'argent avec l\'IA — Formation Ozirus',
    description: 'Code, SaaS, motion design : 1 mois + 1 semaine en 1:1. 100 000 FCFA en 3 fois.',
    images: ['/og-image.jpg'],
  },
};

export default function FormationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
