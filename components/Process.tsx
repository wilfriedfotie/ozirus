'use client';

import { motion } from 'framer-motion';
import { Search, Lightbulb, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    color: '#1A56DB',
    bgColor: '#EEF2FF',
    title: 'Obtenir mon diagnostic gratuit',
    duration: '1 semaine',
    desc: 'On analyse vos processus actuels, identifie les tâches chronophages et évalue le potentiel d\'automatisation IA pour votre PME — sans engagement.',
    deliverables: ['Rapport d\'analyse complet', 'Cas d\'usage prioritaires', 'Estimation du ROI potentiel'],
  },
  {
    number: '02',
    icon: Lightbulb,
    color: '#F97316',
    bgColor: '#FFF4ED',
    title: 'Pilot IA',
    duration: '4 à 6 semaines',
    desc: 'On construit et déploie une première version fonctionnelle de votre solution IA, adaptée à votre budget, votre secteur et vos outils existants.',
    deliverables: ['Solution IA fonctionnelle', 'Tests qualité rigoureux', 'Plan d\'intégration'],
  },
  {
    number: '03',
    icon: Code2,
    color: '#008751',
    bgColor: '#E6F4EE',
    title: 'Déploiement complet',
    duration: 'Phase 3',
    desc: 'Intégration complète dans vos outils (WhatsApp, ERP, CRM, web, Mobile Money). Automatisations, connecteurs et tableaux de bord mis en production.',
    deliverables: ['Produit opérationnel 100%', 'Documentation technique', 'Intégrations validées'],
  },
  {
    number: '04',
    icon: Rocket,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    title: 'Formation & accompagnement continu',
    duration: 'En continu',
    desc: 'Formation de vos équipes, suivi des performances et optimisation continue. On reste à vos côtés pour garantir les résultats et faire évoluer la solution.',
    deliverables: ['Formation dédiée', 'Support prioritaire', 'Optimisation continue'],
  },
];

export default function Process() {
  return (
    <section id="process" style={{ padding: '104px 0', background: '#FFFFFF', position: 'relative' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#E4E8EF' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: '#E4E8EF' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 560, marginBottom: 64 }}
        >
          <p className="section-label">Notre processus</p>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            De l'idée au produit opérationnel <span className="text-gradient">en 90 jours max</span>
          </h2>
          <p className="body-lg">
            Une méthode éprouvée pour intégrer l'IA dans votre PME sans friction, ni mauvaise surprise.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '88px 1fr auto',
                  gap: 32,
                  padding: '36px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid #E4E8EF' : 'none',
                  alignItems: 'start',
                }}
                className="process-step"
              >
                {/* Number + Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                  <span style={{
                    fontFamily: 'Clash Display, sans-serif',
                    fontSize: '0.6875rem', fontWeight: 700,
                    color: step.color, letterSpacing: '0.1em',
                  }}>{step.number}</span>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: step.bgColor,
                    border: `1.5px solid ${step.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={step.color} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <h3 className="heading-sm">{step.title}</h3>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 600,
                      color: step.color,
                      background: step.bgColor,
                      border: `1px solid ${step.color}33`,
                      padding: '3px 10px', borderRadius: 100,
                    }}>{step.duration}</span>
                  </div>
                  <p className="body-md" style={{ maxWidth: 480 }}>{step.desc}</p>
                </div>

                {/* Deliverables */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220 }}>
                  <p style={{
                    fontSize: '0.6875rem', fontWeight: 700,
                    color: '#94A3B8', letterSpacing: '0.08em',
                    textTransform: 'uppercase', marginBottom: 4,
                  }}>Livrables</p>
                  {step.deliverables.map((d, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6.5" stroke={`${step.color}40`} />
                        <path d="M4 7l2 2L10 5" stroke={step.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .process-step {
            grid-template-columns: 56px 1fr !important;
          }
          .process-step > div:last-child {
            grid-column: 2;
            min-width: unset !important;
          }
        }
      `}</style>
    </section>
  );
}
