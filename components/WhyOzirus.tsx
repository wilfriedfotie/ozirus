'use client';

import { motion } from 'framer-motion';

const reasons = [
  {
    emoji: '🎯',
    title: 'Nous comprenons vos défis',
    desc: 'Électricité, connexion limitée, budget serré, ressources humaines restreintes — nous concevons nos solutions pour les réalités camerounaises, pas pour les startups de la Silicon Valley.',
    color: '#7967FF',
  },
  {
    emoji: '📈',
    title: 'ROI rapide et mesurable',
    desc: 'Nous mettons l\'IA au service de vos résultats business. Chaque solution est conçue pour générer un retour sur investissement mesurable dès les premières semaines.',
    color: '#10B981',
  },
  {
    emoji: '🤝',
    title: 'Accompagnement de A à Z',
    desc: 'De l\'audit initial à la formation continue, en passant par le développement et le déploiement, nous sommes à vos côtés à chaque étape sans jamais vous laisser seul.',
    color: '#F59E0B',
  },
  {
    emoji: '🇨🇲',
    title: 'On pense local',
    desc: 'On travaille en français, on intègre Mobile Money, WhatsApp, pidgin si nécessaire. Nos solutions fonctionnent dans le contexte camerounais, pas en théorie.',
    color: '#F472B6',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 1.02, 0.73, 0.99] } },
};

export default function WhyOzirus() {
  return (
    <section id="pourquoi" style={{ padding: '104px 0', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      {/* Glow left */}
      <div style={{ position: 'absolute', top: '20%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,135,81,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64, alignItems: 'center' }}
          className="why-grid-header"
        >
          <div>
            <p className="section-label">Pourquoi Ozirus ?</p>
            <h2 className="heading-lg">
              On ne vend pas de la tech.<br />
              <span className="text-gradient">On crée des résultats.</span>
            </h2>
          </div>
          <p className="body-lg">
            Chez Ozirus Agency, nous ne vendons pas de la technologie pour la technologie. Nous créons des solutions digitales{' '}
            <strong style={{ color: '#0F172A', fontWeight: 700 }}>concrètes, accessibles et rentables</strong> spécialement conçues pour les réalités des PME camerounaises.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card"
              style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Emoji icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${reason.color}12`, border: `1px solid ${reason.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {reason.emoji}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 className="heading-sm">{reason.title}</h3>
                <p className="body-sm" style={{ lineHeight: 1.7 }}>{reason.desc}</p>
              </div>

              {/* Accent bottom line */}
              <div style={{ height: 2, background: `linear-gradient(90deg, ${reason.color}40, transparent)`, borderRadius: 1 }} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-grid-header {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
