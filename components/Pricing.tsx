'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter IA',
    price: '149 000',
    period: 'FCFA',
    badge: null,
    desc: 'Idéal pour débuter avec un premier outil IA dans votre entreprise.',
    features: [
      'Chatbot WhatsApp basique',
      'Automatisation de 2 processus',
      'Intégration réseaux sociaux',
      'Formation initiale (1h)',
      'Hébergement 3 mois inclus',
      'Support par email',
    ],
    cta: 'Démarrer avec Starter',
    highlighted: false,
    duration: '2 semaines',
  },
  {
    name: 'PME Automatisée',
    price: '349 000',
    period: 'FCFA',
    badge: 'Recommandé',
    desc: 'La solution complète pour transformer la gestion de votre PME.',
    features: [
      'Tout du plan Starter',
      'Chatbot IA avancé (GPT-4)',
      'Automatisation complète CRM/Compta',
      'Dashboard de suivi des performances',
      'Rapports automatiques hebdo',
      'Formation équipe (demi-journée)',
      'Support prioritaire',
    ],
    cta: 'Démarrer avec PME Pro',
    highlighted: true,
    duration: '4 semaines',
  },
  {
    name: 'Sur-mesure',
    price: 'Sur devis',
    period: '',
    badge: null,
    desc: 'Pour les besoins complexes : IA prédictive, intégrations avancées, projets multi-entités.',
    features: [
      'Analyse de données prédictive',
      'IA générative personnalisée',
      'Intégration d\'API complexes',
      'Architecture Cloud scalable',
      'Sécurité & conformité renforcées',
      'Accompagnement stratégique 1 an',
    ],
    cta: 'Discutons de votre projet',
    highlighted: false,
    duration: '1–3 mois',
  },
];

export default function Pricing() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="pricing" style={{ padding: '104px 0', background: '#0A0A0F', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse at 50% 50%, rgba(121,103,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <p className="section-label">Tarifs</p>
          <h2 className="heading-lg" style={{ marginBottom: 14 }}>
            Des tarifs <span className="text-gradient">transparents</span>
          </h2>
          <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto' }}>
            Adaptés aux réalités du marché camerounais. Commencez petit, grandissez vite.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ position: 'relative' }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute',
                  inset: -1,
                  borderRadius: 15,
                  background: 'linear-gradient(135deg, rgba(121,103,255,0.5) 0%, rgba(88,73,204,0.3) 100%)',
                  zIndex: 0,
                }} />
              )}

              <div style={{
                position: 'relative',
                zIndex: 1,
                background: plan.highlighted ? '#13132A' : '#111118',
                border: `1px solid ${plan.highlighted ? 'rgba(121,103,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 14,
                padding: 28,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}>

                {/* Header */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{plan.name}</span>
                    {plan.badge && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#7967FF', background: 'rgba(121,103,255,0.12)', border: '1px solid rgba(121,103,255,0.2)', padding: '3px 10px', borderRadius: 100 }}>
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: plan.price === 'Sur devis' ? '1.75rem' : '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{plan.period}</span>}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#7967FF', fontWeight: 500 }}>⏱ {plan.duration}</span>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: 10 }}>{plan.desc}</p>
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Check size={14} color="#7967FF" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => scrollTo('contact')}
                  className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', gap: 8 }}
                >
                  {plan.cta} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 28, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}
        >
          Consultation gratuite de 15 minutes incluse avec tous les plans · Sans engagement · Paiement sécurisé
        </motion.p>
      </div>
    </section>
  );
}
