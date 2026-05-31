'use client';

import { motion } from 'framer-motion';

const footerLinks = [
  {
    title: 'Solutions',
    links: [
      { label: 'SaaS sur mesure', href: '#' },
      { label: 'Applications Mobiles', href: '#' },
      { label: 'IA & Automatisation', href: '#' },
      { label: 'Design & UI/UX', href: '#' }
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '#' },
      { label: 'Cas clients', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Blog', href: '#' }
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Conditions', href: '/terms' },
      { label: 'Confidentialité', href: '/privacy' }
    ],
  },
];

export default function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer style={{ background: '#FFFFFF', borderTop: '1.5px solid #E4E8EF', paddingTop: 64, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 2fr',
          gap: 64,
          marginBottom: 56,
        }} className="footer-grid">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 320 }}
          >
            <img src="/logo.png" alt="Ozirus Agency" style={{ height: 30 }} />
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.7 }}>
              Votre partenaire digital au Cameroun. Nous concevons des solutions SaaS, applications mobiles et outils IA pour les PME qui veulent grandir.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { name: 'LinkedIn', path: 'M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.853 0-2.136 1.445-2.136 2.939v5.667H7.575V9h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 110-3.096 1.548 1.548 0 010 3.096zm-1.337 9.763H6.34V9H3.667v7.338zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34C18.402 19 19 18.418 19 17.701V2.298C19 1.581 18.402 1 17.668 1z', viewBox: '0 0 20 20' },
                { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', viewBox: '0 0 24 24' },
              ].map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: '#F1F4F9',
                    border: '1.5px solid #E4E8EF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#EEF2FF';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C7D2FE';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#F1F4F9';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E4E8EF';
                  }}
                >
                  <svg viewBox={s.viewBox} fill="#64748B" style={{ width: 14, height: 14 }}>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}
          >
            {footerLinks.map((group) => (
              <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: '0.6875rem', fontWeight: 700,
                  color: '#94A3B8', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 4,
                }}>{group.title}</p>
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: '0.875rem', color: '#475569', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#1A56DB')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 24, borderTop: '1px solid #E4E8EF',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            © {new Date().getFullYear()} Ozirus Agency. Tous droits réservés.
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
            Conçu avec ❤️ à Yaoundé, Cameroun 🇨🇲
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
}