import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'Ozirus - De l\'idée au produit en 90 jours',
  description: 'Transformez votre vision en produit digital révolutionnaire grâce à notre expertise en développement rapide et nos technologies de pointe.',
  keywords: 'développement rapide, SaaS, applications mobiles, IA, automatisation, startup, MVP',
  authors: [{ name: 'Ozirus' }],
  creator: 'Ozirus',
  publisher: 'Ozirus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Ozirus - De l\'idée au produit en 90 jours',
    description: 'Transformez votre vision en produit digital révolutionnaire en 90 jours.',
    url: 'https://ozirus.com',
    siteName: 'Ozirus',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ozirus - Développement ultra-rapide',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ozirus - De l\'idée au produit en 90 jours',
    description: 'Transformez votre vision en produit digital révolutionnaire en 90 jours.',
    images: ['/og-image.jpg'],
    creator: '@ozirus',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${manrope.variable} font-manrope antialiased`}>
        {children}
      </body>
    </html>
  );
}