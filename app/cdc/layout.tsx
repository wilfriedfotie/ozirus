import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ozirus CDC — Contenu, stratégie, croissance',
  description:
    'Un système simple pour rendre votre entreprise visible, attirer les bons prospects et transformer l’attention en demandes clients.',
  alternates: { canonical: 'https://cdc.ozirus.agency' },
  openGraph: {
    title: 'Contenu, stratégie, croissance — Ozirus CDC',
    description:
      'Contenu utile, stratégie claire et outils digitaux pour développer votre entreprise au Cameroun.',
    url: 'https://cdc.ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus CDC' }],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function CdcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
