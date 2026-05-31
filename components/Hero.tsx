'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '50+', label: 'PME accompagnées' },
  { value: '90j', label: 'Délai de livraison' },
  { value: '4.9★', label: 'Satisfaction client' },
];

const clients = [
  { name: 'AgriSmart', sector: 'Agroalimentaire' },
  { name: 'PharmaTech', sector: 'Santé' },
  { name: 'FoodRun', sector: 'Restauration' },
  { name: 'BoutiqueX', sector: 'Commerce' },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 80,
        paddingBottom: 0,
        background: '#FFFFFF',
      }}
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 0%, transparent 100%)',
        }}
      />

      {/* Accent blob top */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: '10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(26,86,219,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '5%',
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(0,135,81,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 860,
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}
      >

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="heading-xl">
            Votre business mérite{' '}
            <span className="text-gradient">des outils digitaux</span>
            {' '}de classe mondiale.
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="body-lg"
          style={{ maxWidth: 580 }}
        >
          Nous concevons des <strong style={{ color: '#0F172A', fontWeight: 600 }}>SaaS, applications mobiles et solutions IA</strong> pensées pour les PME et startups camerounaises. Livrés en 90 jours ou moins.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            onClick={() => scrollTo('contact')}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '0.9375rem' }}
          >
            Diagnostic gratuit →
          </button>
          <button
            onClick={() => scrollTo('realizations')}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '0.9375rem' }}
          >
            Voir nos réalisations
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{ display: 'flex', gap: 0 }}>
            {['🇨🇲','🏪','💊','🍽️'].map((emoji, i) => (
              <div
                key={i}
                style={{
                  width: 30, height: 30,
                  borderRadius: '50%',
                  background: '#F1F4F9',
                  border: '2px solid #FFFFFF',
                  marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="body-sm" style={{ fontWeight: 500 }}>
            <span style={{ color: '#0F172A', fontWeight: 700 }}>50+ PME</span> camerounaises nous font confiance
          </p>
        </motion.div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 860,
          margin: '60px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: '#E4E8EF',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1.5px solid #E4E8EF',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: '#FFFFFF',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 6,
            }}>
              {stat.value}
            </p>
            <p className="body-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Agency mockup card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.21, 1.02, 0.73, 0.99] }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 900,
          margin: '40px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            background: '#F8F9FC',
            border: '1.5px solid #E4E8EF',
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
            boxShadow: '0 -24px 80px rgba(26,86,219,0.07), 0 0 0 1px #E4E8EF',
          }}
        >
          {/* Fake browser bar */}
          <div style={{
            padding: '12px 18px',
            borderBottom: '1.5px solid #E4E8EF',
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#FFFFFF',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#60A5FA' }} />
            </div>
            <div style={{
              flex: 1, background: '#F1F4F9', borderRadius: 6, height: 24,
              maxWidth: 300, margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #E4E8EF',
            }}>
              <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>ozirus.agency/dashboard</span>
            </div>
          </div>

          {/* Dashboard preview — agency project tracker */}
          <div style={{ padding: 20, background: '#F8F9FC', minHeight: 300, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 14 }}>

            {/* Sidebar */}
            <div style={{
              background: '#FFFFFF', borderRadius: 12, padding: 16,
              display: 'flex', flexDirection: 'column', gap: 4,
              border: '1.5px solid #E4E8EF',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #F1F4F9' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#0F172A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  fontFamily: 'Clash Display, sans-serif',
                }}>O</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', fontFamily: 'Clash Display, sans-serif' }}>Ozirus Agency</span>
              </div>
              {[
                { label: 'Projets', active: true },
                { label: 'Clients', active: false },
                { label: 'Livrables', active: false },
                { label: 'Facturation', active: false },
              ].map((item) => (
                <div key={item.label} style={{
                  padding: '7px 10px', borderRadius: 7,
                  background: item.active ? '#F1F4F9' : 'transparent',
                  color: item.active ? '#0F172A' : '#94A3B8',
                  fontSize: '0.75rem',
                  fontWeight: item.active ? 600 : 400,
                  cursor: 'pointer',
                }}>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Projets actifs', value: '12', trend: '+3 ce mois', color: '#1A56DB' },
                  { label: 'Livrés à temps', value: '98%', trend: 'objectif 95%', color: '#008751' },
                  { label: 'Satisfaction', value: '4.9/5', trend: '50+ avis', color: '#F97316' },
                ].map((kpi) => (
                  <div key={kpi.label} style={{
                    background: '#FFFFFF', borderRadius: 10, padding: 14,
                    border: '1.5px solid #E4E8EF',
                  }}>
                    <p style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: 6 }}>{kpi.label}</p>
                    <p style={{
                      fontFamily: 'Clash Display, sans-serif',
                      fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', lineHeight: 1,
                    }}>{kpi.value}</p>
                    <p style={{ fontSize: '0.6875rem', color: kpi.color, marginTop: 5, fontWeight: 600 }}>{kpi.trend}</p>
                  </div>
                ))}
              </div>

              {/* Recent projects */}
              <div style={{
                background: '#FFFFFF', borderRadius: 10, padding: 14,
                border: '1.5px solid #E4E8EF', flex: 1,
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 12, fontFamily: 'Clash Display, sans-serif' }}>Projets en cours</p>
                {clients.map((client, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < clients.length - 1 ? '1px solid #F1F4F9' : 'none',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: ['#EEF2FF','#E6F4EE','#FFF4ED','#F1F4F9'][i],
                      border: '1px solid #E4E8EF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                      color: ['#1A56DB','#008751','#F97316','#475569'][i],
                    }}>
                      {client.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0F172A' }}>{client.name}</p>
                      <p style={{ fontSize: '0.625rem', color: '#94A3B8' }}>{client.sector}</p>
                    </div>
                    <span style={{
                      fontSize: '0.625rem', fontWeight: 600,
                      color: '#008751', background: '#E6F4EE',
                      padding: '2px 8px', borderRadius: 100,
                    }}>En cours</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ height: 80, background: 'linear-gradient(to bottom, transparent, #FFFFFF)', marginTop: -2 }} />
      </motion.div>
    </section>
  );
}
