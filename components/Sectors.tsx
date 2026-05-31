'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sectors = [
  {
    id: 'retail',
    icon: '🛒',
    label: 'Commerce & Retail',
    color: '#7967FF',
    colorLight: 'rgba(121,103,255,0.12)',
    colorBorder: 'rgba(121,103,255,0.2)',
    headline: 'Vos stocks vous échappent, vos clients aussi.',
    problems: [
      'Ruptures de stock fréquentes qui font fuir les clients',
      'Trop d\'invendus en fin de semaine = pertes directes',
      'Zéro visibilité sur les produits qui se vendent vraiment',
      'Relances clients manuelles, chronophages et peu efficaces',
    ],
    solutions: [
      { title: 'IA de gestion prédictive des stocks', desc: 'Anticipez les ruptures et surstocks avant qu\'ils se produisent.' },
      { title: 'Chatbot de vente WhatsApp', desc: 'Commandes, disponibilité, paiement Mobile Money — en automatique 24h/24.' },
      { title: 'Tableau de bord performance produits', desc: 'Identifiez vos best-sellers et éliminez les produits à faible rotation.' },
      { title: 'Relances clients automatisées', desc: 'Panier abandonné, fidélité, promo ciblée — sans effort manuel.' },
    ],
  },
  {
    id: 'agro',
    icon: '🌾',
    label: 'Agroalimentaire',
    color: '#10B981',
    colorLight: 'rgba(16,185,129,0.10)',
    colorBorder: 'rgba(16,185,129,0.2)',
    headline: 'La production est là. Le marché, lui, ne vous attend pas.',
    problems: [
      'Prix du marché imprévisibles, marges qui s\'effondrent sans prévenir',
      'Pertes post-récolte faute d\'acheteurs trouvés à temps',
      'Production déconnectée de la demande réelle',
      'Pas de traçabilité = impossibilité d\'accéder aux marchés exports',
    ],
    solutions: [
      { title: 'Analyse IA des prix en temps réel', desc: 'Suivez les fluctuations marché et vendez au bon moment, au bon acheteur.' },
      { title: 'Matching acheteurs-producteurs automatisé', desc: 'Connectez votre production aux distributeurs et grossistes dès la récolte.' },
      { title: 'Prévision de demande hebdomadaire', desc: 'Calibrez votre production sur la demande réelle pour éliminer les pertes.' },
      { title: 'Module traçabilité & certification', desc: 'Documentez chaque étape de la chaîne pour accéder aux marchés premium.' },
    ],
  },
  {
    id: 'finance',
    icon: '💼',
    label: 'Services & Finance',
    color: '#F59E0B',
    colorLight: 'rgba(245,158,11,0.10)',
    colorBorder: 'rgba(245,158,11,0.2)',
    headline: 'Vous perdez des heures sur des tâches qui devraient se faire seules.',
    problems: [
      'Facturation manuelle chronophage, erreurs fréquentes',
      'Impayés qui s\'accumulent faute de relances systématiques',
      'Reportings financiers produits à la main chaque fin de mois',
      'Aucune visibilité temps réel sur la trésorerie',
    ],
    solutions: [
      { title: 'Automatisation de la facturation', desc: 'Génération, envoi et archivage des factures sans intervention humaine.' },
      { title: 'Système de relances automatiques', desc: 'Rappels par email/SMS/WhatsApp aux bons moments pour maximiser le recouvrement.' },
      { title: 'Dashboard financier temps réel', desc: 'Trésorerie, impayés, marges — visualisés en un coup d\'œil.' },
      { title: 'IA de scoring client', desc: 'Identifiez vos clients à risque avant d\'accorder des délais de paiement.' },
    ],
  },
  {
    id: 'health',
    icon: '🏥',
    label: 'Santé & Cliniques',
    color: '#F472B6',
    colorLight: 'rgba(244,114,182,0.10)',
    colorBorder: 'rgba(244,114,182,0.2)',
    headline: 'Vos patients attendent. Votre équipe, elle, est submergée.',
    problems: [
      'Prise de rendez-vous manuelle = files d\'attente et absences non prévenues',
      'Dossiers patients éparpillés, historiques difficiles à retrouver',
      'Suivi post-consultation inexistant, taux de retour faible',
      'Gestion des ordonnances et stocks médicaments non automatisée',
    ],
    solutions: [
      { title: 'Agenda intelligent & rappels automatiques', desc: 'Réduction des absences de 40% avec des rappels SMS et WhatsApp automatisés.' },
      { title: 'Dossier patient numérique centralisé', desc: 'Historique complet, prescriptions et résultats accessibles en 3 secondes.' },
      { title: 'Chatbot de triage et orientation', desc: 'Qualifiez les urgences et dirigez les patients avant même leur arrivée.' },
      { title: 'Suivi post-consultation automatisé', desc: 'Rappels de traitement, renouvellement d\'ordonnance, satisfaction patient.' },
    ],
  },
  {
    id: 'transport',
    icon: '🚚',
    label: 'Transport & Logistique',
    color: '#38BDF8',
    colorLight: 'rgba(56,189,248,0.10)',
    colorBorder: 'rgba(56,189,248,0.2)',
    headline: 'Chaque kilomètre non optimisé, c\'est de l\'argent jeté.',
    problems: [
      'Tournées planifiées à la main, temps de livraison imprévisibles',
      'Flotte sous-utilisée les jours creux, saturée aux pics',
      'Clients non informés du statut de leur livraison en temps réel',
      'Aucune donnée exploitable sur les performances conducteurs',
    ],
    solutions: [
      { title: 'Optimisation IA des tournées', desc: 'Réduction des km parcourus et des délais — pour chaque livraison, chaque jour.' },
      { title: 'Tracking temps réel & notifications client', desc: 'Vos clients savent où est leur colis à chaque instant, sans appel entrant.' },
      { title: 'Prévision des pics de demande', desc: 'Anticipez les besoins en flotte pour ne jamais être en sous-capacité.' },
      { title: 'Dashboard performance conducteurs', desc: 'Vitesse, ponctualité, consommation — pilotez votre flotte avec des données.' },
    ],
  },
  {
    id: 'education',
    icon: '🎓',
    label: 'Éducation & Formation',
    color: '#A78BFA',
    colorLight: 'rgba(167,139,250,0.10)',
    colorBorder: 'rgba(167,139,250,0.2)',
    headline: 'Vous formez bien. Mais vos apprenants décrochent trop vite.',
    problems: [
      'Suivi des apprenants individuel impossible à l\'échelle',
      'Administratif lourd : inscriptions, paiements, attestations',
      'Taux d\'abandon élevé faute de relance et de personnalisation',
      'Aucune donnée sur ce qui fonctionne vraiment pédagogiquement',
    ],
    solutions: [
      { title: 'Plateforme d\'apprentissage IA', desc: 'Parcours adaptatifs qui s\'ajustent au rythme et au niveau de chaque apprenant.' },
      { title: 'Automatisation administrative complète', desc: 'Inscriptions, rappels de paiement, génération d\'attestations — sans effort.' },
      { title: 'Détection précoce du décrochage', desc: 'L\'IA identifie les apprenants à risque et déclenche des actions de réengagement.' },
      { title: 'Analytics pédagogiques', desc: 'Identifiez les modules qui convertissent et ceux qui font fuir.' },
    ],
  },
];

export default function Sectors() {
  const [active, setActive] = useState(0);
  const sector = sectors[active];

  return (
    <section
      id="secteurs"
      style={{ padding: '104px 0', background: '#0D0D16', position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: `radial-gradient(ellipse, ${sector.color}08 0%, transparent 70%)`, pointerEvents: 'none', transition: 'background 0.5s ease' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 56 }}
        >
          <p className="section-label">Votre secteur</p>
          <h2 className="heading-lg" style={{ maxWidth: 640 }}>
            L&apos;IA qui comprend{' '}
            <span className="text-gradient">vos vrais problèmes</span>
          </h2>
          <p className="body-md" style={{ marginTop: 16, maxWidth: 520, color: 'rgba(255,255,255,0.45)' }}>
            Sélectionnez votre secteur. Découvrez vos blocages et la manière dont Ozirus les résout — concrètement.
          </p>
        </motion.div>

        {/* Sector tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}>
          {sectors.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 100,
                border: `1px solid ${active === i ? s.color : 'rgba(255,255,255,0.08)'}`,
                background: active === i ? s.colorLight : 'rgba(255,255,255,0.02)',
                color: active === i ? s.color : 'rgba(255,255,255,0.45)',
                fontSize: '0.8125rem',
                fontWeight: active === i ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              borderRadius: 20,
              overflow: 'hidden',
              border: `1px solid ${sector.colorBorder}`,
            }}
          >
            {/* LEFT — Problems */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px 36px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '1.75rem' }}>{sector.icon}</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: sector.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sector.label}</span>
              </div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#fff', lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 28 }}>
                {sector.headline}
              </h3>

              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Ce que vous vivez au quotidien
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sector.problems.map((pb, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                  >
                    <span style={{ marginTop: 2, width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,80,80,0.6)', flexShrink: 0, boxShadow: '0 0 6px rgba(255,80,80,0.4)' }} />
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>{pb}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT — Solutions */}
            <div style={{ background: sector.colorLight, padding: '40px 36px' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: sector.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Comment Ozirus vous aide
              </p>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: 28, opacity: 0.7 }}>
                Des solutions concrètes, déployées en quelques semaines.
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sector.solutions.map((sol, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1, duration: 0.3 }}
                    style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                  >
                    <div style={{ marginTop: 3, width: 22, height: 22, borderRadius: '50%', background: sector.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 12px ${sector.color}40` }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.5L4 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 2 }}>{sol.title}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{sol.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ marginTop: 32 }}>
                <a
                  href="#contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '11px 22px',
                    borderRadius: 100,
                    background: sector.color,
                    color: '#fff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    boxShadow: `0 4px 20px ${sector.color}40`,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Discuter de mon projet {sector.icon}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 32, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.2)' }}
        >
          Votre secteur n&apos;est pas dans la liste ?{' '}
          <a href="#contact" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.15)' }}>
            Parlez-nous de votre cas spécifique →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
