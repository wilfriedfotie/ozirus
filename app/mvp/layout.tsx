import type { Metadata } from 'next';
import localFont from 'next/font/local';

// SF Pro (Apple), réservée à l'écran iPhone de la Product Experience : sous-ensemble latin variable
// (graisses 400 → 800, taille optique 17 → 28 : le navigateur bascule seul de SF Pro Text à Display
// à partir de 20 px, comme iOS). Pas de préchargement : le téléphone est sous la ligne de flottaison.
const sfPro = localFont({
  src: './fonts/SFPro-latin.woff2',
  weight: '400 800',
  display: 'swap',
  preload: false,
  variable: '--font-sf-pro',
});

// SF Mono pour les libellés techniques de la maquette (références, colonnes de billet).
const sfMono = localFont({
  src: [
    { path: './fonts/SFMono-Regular-latin.woff2', weight: '400' },
    { path: './fonts/SFMono-Medium-latin.woff2', weight: '500' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-sf-mono',
});

export const metadata: Metadata = {
  title: 'MVP en 15 ou 30 jours — à partir de 3 000 € | Ozirus',
  description:
    'Deux formats pour lancer votre MVP : 15 jours à partir de 3 000 € ou 30 jours à 5 000 € HT. Retours illimités, prix fixe, code à votre nom et mise en ligne incluse.',
  alternates: { canonical: 'https://mvp.ozirus.agency' },
  openGraph: {
    title: 'Votre MVP en 15 ou 30 jours — retours illimités',
    description:
      'Un MVP cadré, construit et mis en ligne avec un CTO. 15 jours à 3 000 € ou 30 jours à 5 000 € HT.',
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
  return <div className={`${sfPro.variable} ${sfMono.variable}`} style={{ display: 'contents' }}>{children}</div>;
}
