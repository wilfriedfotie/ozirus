import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import GlobalLoader from '@/components/GlobalLoader';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ozirus Agency — Agence Digitale Cameroun | SaaS, IA, Applications',
  description: 'Ozirus Agency conçoit des solutions digitales sur mesure pour les PME camerounaises : SaaS, applications mobiles, intelligence artificielle et branding. Livraison en 90 jours.',
  keywords: 'agence digitale Cameroun, développement SaaS, application mobile Cameroun, solution IA PME, agence tech Yaoundé, startup tech Cameroun',
  authors: [{ name: 'Ozirus Agency' }],
  creator: 'Ozirus Agency',
  publisher: 'Ozirus Agency',
  robots: 'index, follow',
  openGraph: {
    title: 'Ozirus Agency — Votre partenaire digital au Cameroun',
    description: 'SaaS, Applications Mobiles et Intelligence Artificielle pour les PME et startups camerounaises.',
    url: 'https://ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus Agency' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ozirus Agency — Agence Digitale Cameroun',
    description: 'SaaS, Applications Mobiles, IA — des solutions digitales concrètes pour les PME camerounaises.',
    images: ['/og-image.jpg'],
  },
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`scroll-smooth ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-sans, "DM Sans"), -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <GlobalLoader />
        {children}
      </body>
    </html>
  );
}
