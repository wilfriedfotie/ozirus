import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import LayoutClientWrapper from '@/components/LayoutClientWrapper';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans-loaded',
  // 800 est utilisé partout (landings, admin) : sans lui, le navigateur synthétise un faux gras.
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

// Approche 1 (active) : police auto-hébergée, indépendante de Fontshare.
// Fiable en local (Fontshare bloque les requêtes venant de localhost) et en prod,
// et plus rapide dans les deux cas : pas de requête vers un domaine tiers.
const clashDisplay = localFont({
  variable: '--font-display-loaded',
  display: 'swap',
  src: [
    { path: './fonts/ClashDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ClashDisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/ClashDisplay-Semibold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/ClashDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ozirus.agency'),
  title: 'Ozirus Agency — Agence IA & Développement Logiciel | Afrique • Europe • Amérique',
  description: 'Ozirus Agency conçoit et déploie des agents IA, solutions SaaS, applications mobiles et automatisations WhatsApp pour les PME en Afrique (Cameroun, Côte d’Ivoire, Sénégal), en Europe (France, Suisse, Belgique) et en Amérique du Nord (Canada, USA).',
  keywords: 'agent IA Afrique, agence IA France, agence IA Suisse, solutions IA Belgique, agence digitale Canada, automatisation WhatsApp PME, CRM IA PME, chatbot IA entreprise, transformation digitale PME, développement SaaS sur mesure',
  authors: [{ name: 'Ozirus Agency' }],
  creator: 'Ozirus Agency',
  publisher: 'Ozirus Agency',
  robots: 'index, follow',
  openGraph: {
    title: 'Ozirus Agency — Solutions IA & Logiciels pour PME | Afrique • Europe • Amérique',
    description: 'Déployez des agents IA et des logiciels sur mesure. Nous accompagnons la transformation digitale des PME en Afrique, Europe (France, Suisse, Belgique) et Amérique du Nord (Canada, USA).',
    url: 'https://ozirus.agency',
    siteName: 'Ozirus Agency',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Ozirus Agency - Solutions IA et Digitales' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ozirus Agency — Agents IA & Logiciels sur mesure',
    description: 'Agents IA, SaaS et Applications Mobiles — des solutions concrètes pour la croissance des PME en Afrique, en Europe et en Amérique du Nord.',
    images: ['/og-image.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Ozirus Agency',
  url: 'https://ozirus.agency',
  logo: 'https://ozirus.agency/logo.png',
  description: 'Agence internationale en Intelligence Artificielle, développement de logiciels SaaS, applications mobiles et automatisation WhatsApp pour PME.',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Afrique' },
    { '@type': 'AdministrativeArea', name: 'Europe' },
    { '@type': 'AdministrativeArea', name: 'Amérique du Nord' },
    { '@type': 'Country', name: 'France' },
    { '@type': 'Country', name: 'Suisse' },
    { '@type': 'Country', name: 'Belgique' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'Cameroun' },
    { '@type': 'Country', name: 'Côte d’Ivoire' },
    { '@type': 'Country', name: 'Sénégal' },
  ],
  serviceType: [
    'Agents IA & Chatbots WhatsApp',
    'Développement SaaS & Logiciels sur mesure',
    'Applications Mobiles',
    'Automatisation des Ventes & CRM',
    'Intégration Paiements (Stripe, Mobile Money, Apple Pay)',
  ],
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`scroll-smooth ${dmSans.variable} ${clashDisplay.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          Approche 2 (désactivée) : Clash Display via l'URL Fontshare.
          Gardée en référence — plus lente (round-trip vers un domaine tiers) et
          peu fiable : Fontshare bloque les requêtes envoyées depuis localhost,
          donc la police ne charge jamais en dev avec cette méthode.
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
        */}
      </head>
      <body style={{ fontFamily: 'var(--font-sans-loaded, "DM Sans"), -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>
      </body>
    </html>
  );
}
