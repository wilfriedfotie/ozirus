'use client';

import { motion } from 'framer-motion';

const cases = [
  {
    category: 'Commerce de détail',
    title: 'Supérette Bonamoussadi — Gestion IA des stocks',
    desc: 'Un système IA gère les stocks en temps réel, prédit les ventes et envoie des alertes automatiques. Chatbot WhatsApp pour les commandes et paiements Mobile Money intégrés.',
    metrics: [
      { value: '-42%', label: 'de pertes sur stocks' },
      { value: '8 sem.', label: 'pour obtenir les résultats' },
    ],
    tags: ['Gestion stocks IA', 'Chatbot WhatsApp', 'Mobile Money'],
    color: '#7967FF',
  },
  {
    category: 'Agroalimentaire',
    title: 'Unité de transformation manioc, Bafoussam',
    desc: 'L\'IA analyse les prix du marché en temps réel, prédit la demande et calibre la production semaine par semaine. Identification des meilleurs acheteurs automatisée.',
    metrics: [
      { value: '+2.8M', label: 'FCFA/mois de gain' },
      { value: '-38%', label: 'de pertes post-production' },
    ],
    tags: ['Prédiction prix', 'Planification IA', 'Analyse marché'],
    color: '#10B981',
  },
  {
    category: 'Automatisation',
    title: 'Facturation et relances clients automatisées',
    desc: 'Connexion des ventes aux outils comptables pour générer, envoyer et relancer les factures impayées sans intervention manuelle — pour une PME de services à Yaoundé.',
    metrics: [
      { value: '20h', label: 'économisées par mois' },
      { value: '+30%', label: 'taux de recouvrement' },
    ],
    tags: ['Make', 'Automatisation', 'Facturation'],
    color: '#F59E0B',
  },
  {
    category: 'IA Prédictive',
    title: 'Dashboard de prévision des ventes — Restaurant Douala',
    desc: 'Tableau de bord intelligent analysant les historiques de vente pour anticiper les plats porteurs, optimiser les achats d\'ingrédients et réduire massivement le gaspillage.',
    metrics: [
      { value: '-40%', label: 'de gaspillage alimentaire' },
      { value: '+23%', label: 'de marge brute' },
    ],
    tags: ['Machine Learning', 'Prévision ventes', 'Dashboard'],
    color: '#F472B6',
  },
];

export default function Realizations() {
  return (
    <section id="realizations" style={{ padding: '104px 0', background: '#FFFFFF', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#E4E8EF' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: '#E4E8EF' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <p className="section-label">Cas clients</p>
            <h2 className="heading-lg">
              Réalisations — <span className="text-gradient">des résultats réels</span>
            </h2>
          </div>
          <p className="body-md" style={{ maxWidth: 340 }}>
            Des PME camerounaises ont fait confiance à Ozirus. Voici leurs résultats mesurables.
          </p>
        </motion.div>

        {/* Cases grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {/* Top */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: c.color, background: `${c.color}12`, border: `1px solid ${c.color}22`, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {c.category}
                </span>
              </div>

              {/* Title + Desc */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', lineHeight: 1.35, letterSpacing: '-0.01em', fontFamily: 'Clash Display, sans-serif' }}>{c.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.65 }}>{c.desc}</p>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: 16 }}>
                {c.metrics.map((m, j) => (
                  <div key={j}>
                    <p style={{ fontSize: '1.375rem', fontWeight: 800, color: c.color, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'Clash Display, sans-serif' }}>{m.value}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: 3, fontWeight: 500 }}>{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 12, borderTop: '1px solid #E4E8EF' }}>
                {c.tags.map((tag, j) => (
                  <span key={j} style={{ fontSize: '0.6875rem', color: '#64748B', background: '#F1F4F9', border: '1px solid #E4E8EF', padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
