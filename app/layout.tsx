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
  title: 'Ozirus Agency — Agence IA & Digitale | Cameroun & Afrique Francophone',
  description: 'Ozirus Agency déploie des agents IA et solutions digitales sur mesure (SaaS, Mobile) pour les PME au Cameroun et en Afrique Francophone. Automatisation WhatsApp, Chatbots IA et transformation digitale en 90 jours.',
  keywords: 'agent IA Cameroun, agence digitale Afrique francophone, intelligence artificielle Afrique, développement SaaS Cameroun, application mobile Yaoundé, solution IA PME, automatisation WhatsApp Afrique, chatbot IA Cameroun, transformation digitale Afrique',
  authors: [{ name: 'Ozirus Agency' }],
  creator: 'Ozirus Agency',
  publisher: 'Ozirus Agency',
  robots: 'index, follow',
  openGraph: {
    title: 'Ozirus Agency — Leader des Solutions IA en Afrique Francophone',
    description: 'Déployez des agents IA et des solutions SaaS sur mesure. Nous accompagnons la transformation digitale des PME au Cameroun et dans toute l\'Afrique Francophone.',
    url: 'https://ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus Agency - Solutions IA et Digitales' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ozirus Agency — Agents IA & Digital au Cameroun',
    description: 'Agents IA, SaaS et Applications Mobiles — des solutions concrètes pour la croissance des PME en Afrique Francophone.',
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
