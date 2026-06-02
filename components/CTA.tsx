'use client';

import { motion } from 'framer-motion';

export default function CTA() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section style={{ padding: '104px 0', background: '#0F172A', position: 'relative', overflow: 'hidden' }}>

      {/* Accent blobs */}
      <div style={{
        position: 'absolute', top: -100, right: '15%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,135,81,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: '10%',
        width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
        >
          {/* Badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,135,81,0.12)',
            border: '1px solid rgba(0,135,81,0.25)',
            color: '#34D399',
            padding: '5px 14px', borderRadius: 100,
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Obtenir mon diagnostic gratuit — Sans engagement
          </span>

          {/* Heading */}
          <h2 style={{
            fontFamily: 'Clash Display, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
          }}>
            Prêt à transformer votre entreprise{' '}
            <span style={{
              background: 'linear-gradient(135deg, #34D399 0%, #059669 50%, #008751 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              avec l&apos;IA ?
            </span>
          </h2>

          {/* Body */}
          <p style={{
            fontSize: '1.0625rem', lineHeight: 1.65,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 520,
          }}>
            Rejoignez les 35 PME camerounaises qui ont transformé leur business grâce à l&apos;IA. Obtenez votre diagnostic gratuit dès aujourd&apos;hui.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            <button
              onClick={() => scrollTo('contact')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF',
                color: '#0F172A',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '14px 28px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,255,255,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Obtenir mon diagnostic IA gratuit →
            </button>
            <button
              onClick={() => scrollTo('realizations')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                fontSize: '0.9375rem',
                padding: '14px 28px',
                borderRadius: 10,
                border: '1.5px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
              }}
            >
              Voir nos réalisations
            </button>
          </div>

          {/* Trust */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
            {[
              '✓ Réponse sous 24h',
              '✓ Sans engagement',
              '✓ Livraison en 90j',
            ].map((item, i) => (
              <span key={i} style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}