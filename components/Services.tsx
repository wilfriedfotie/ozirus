'use client';

import { motion } from 'framer-motion';
import { Smartphone, Globe, Brain, Palette, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Globe,
    color: '#1A56DB',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    label: 'Solutions SaaS',
    desc: 'Des logiciels métier sur mesure accessibles partout, tout le temps. Gestion, facturation, CRM — adaptés à votre secteur.',
    items: ['CRM & gestion commerciale', 'Plateformes B2B & marketplace', 'Tableaux de bord & reporting', 'Intégration Mobile Money'],
    link: '/dev',
  },
  {
    icon: Smartphone,
    color: '#008751',
    bgColor: '#E6F4EE',
    borderColor: '#A7D7BC',
    label: 'Applications Mobiles',
    desc: 'iOS & Android performants, optimisés pour les réseaux africains. Vos clients vous ont dans la poche.',
    items: ['Apps e-commerce & livraison', 'Réservation en ligne', 'Notifications push & fidélité', 'UX pensée pour le marché local'],
    link: '/dev',
  },
  {
    icon: Brain,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    label: 'Intelligence Artificielle',
    desc: 'Chatbots, automatisation, analyse prédictive. L\'IA au service de vos opérations quotidiennes pour un vrai ROI.',
    items: ['Chatbots WhatsApp & web', 'Automatisation des processus', 'Prévision des ventes', 'Analyse comportementale'],
    link: '/#contact',
  },

];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 1.02, 0.73, 0.99] } },
};

export default function Services() {
  return (
    <section id="services" style={{ padding: '104px 0', background: '#F8F9FC', position: 'relative', overflow: 'hidden' }}>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none', opacity: 0.6,
      }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Nos Expertises</p>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            Quatre expertises.<br />
            <span className="text-gradient">Une seule ambition : votre croissance.</span>
          </h2>
          <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto' }}>
            Que vous partiez de zéro ou que vous cherchiez à moderniser l&apos;existant, nous avons les compétences pour vous accompagner.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="card"
                style={{
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  cursor: 'default',
                  background: '#FFFFFF',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: service.bgColor,
                  border: `1.5px solid ${service.borderColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={service.color} />
                </div>

                {/* Label + Desc */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 className="heading-sm">{service.label}</h3>
                  <p className="body-sm" style={{ lineHeight: 1.75 }}>{service.desc}</p>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {service.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: service.color, flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Link */}
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #E4E8EF' }}>
                  <Link
                    href={service.link || '/'}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.8125rem', fontWeight: 700,
                      color: service.color, fontFamily: 'DM Sans, sans-serif',
                      display: 'flex', alignItems: 'center', gap: 4, padding: 0,
                      transition: 'gap 0.2s', textDecoration: 'none'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.gap = '8px')}
                    onMouseLeave={e => (e.currentTarget.style.gap = '4px')}
                  >
                    En savoir plus <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
