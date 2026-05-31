'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SharedNav from '../../components/SharedNav';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Star, Zap, Clock, Shield,
  ShoppingBag, Wheat, UtensilsCrossed, Pill, Scissors,
  Truck, Building2, GraduationCap, Heart, Sparkles,
  Tractor, Landmark, ShoppingCart, Hotel, HardHat,
  MessageCircle,
} from 'lucide-react';

const DotGrid = ({ opacity = 0.1 }: { opacity?: number }) => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
    <defs>
      <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#7967FF" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const SECTORS = [
  { icon: ShoppingBag,     label: 'Commerce' },
  { icon: Wheat,           label: 'Agroalimentaire' },
  { icon: UtensilsCrossed, label: 'Restauration' },
  { icon: Pill,            label: 'Pharmacies' },
  { icon: Scissors,        label: 'Artisans' },
  { icon: Truck,           label: 'Transport' },
  { icon: Building2,       label: 'Immobilier' },
  { icon: GraduationCap,   label: 'Éducation' },
  { icon: Heart,           label: 'Santé' },
  { icon: Sparkles,        label: 'Beauté' },
  { icon: Tractor,         label: 'Agriculture' },
  { icon: Landmark,        label: 'Microfinance' },
  { icon: ShoppingCart,    label: 'E-commerce' },
  { icon: Hotel,           label: 'Hôtellerie' },
  { icon: HardHat,         label: 'BTP' },
];

const PRODUCTS = [
  /* ── Essentiels ── */
  {
    id: 'chatbot',
    title: 'Chatbot WhatsApp IA Pro',
    price: '149 000 FCFA',
    type: 'Paiement unique – accès à vie',
    desc: 'Votre assistant 24h/24 qui répond à vos clients exactement comme vous le feriez. Il prend les commandes, encaisse via Mobile Money, relance les impayés, envoie des promotions ciblées et fidélise automatiquement — même à 3h du matin.',
    features: ['Réponses automatiques personnalisées 24h/24', 'Prise de commande + encaissement Mobile Money', 'Relances impayés automatiques par message', 'Programme de fidélité intégré (points, coupons)', 'Tableau de bord des conversations en temps réel', 'Personnalisation au ton et vocabulaire de votre marque'],
    gains: ['+35 % de ventes en moyenne dès le 1er mois', '−70 % du temps passé à répondre au téléphone', 'Clients qui reviennent 2× plus souvent'],
    for: 'Boutiques, restaurants, salons, services',
    cta: 'Je veux ce chatbot',
  },
  {
    id: 'stocks',
    title: 'Gestionnaire de Stocks Intelligent',
    price: '89 000 FCFA',
    type: 'Paiement unique',
    desc: 'L\'IA prédit exactement ce qui va se vendre, quand et en quelle quantité — en tenant compte de la météo, des jours fériés et des habitudes locales. Elle alerte avant les ruptures et les périmés, et génère automatiquement les bons de commande fournisseurs.',
    features: ['Prévision des ventes par produit et par jour', 'Alertes automatiques avant rupture ou péremption', 'Génération des bons de commande fournisseurs', 'Suivi multi-sites (plusieurs boutiques ou entrepôts)', 'Rapport hebdo sur les produits qui dorment', 'Intégration WhatsApp pour les alertes urgentes'],
    gains: ['−40 % de pertes sur stocks en moyenne', '800 000 à 2,5M FCFA économisés par mois', 'Zéro rupture sur les produits clés'],
    for: 'Boutiques, pharmacies, agroalimentaire, restaurants',
    cta: 'Je veux maîtriser mes stocks',
  },
  {
    id: 'facturation',
    title: 'Facturation & Relance Clients IA',
    price: '69 000 FCFA',
    type: 'Paiement unique',
    desc: 'Générez une facture professionnelle en 3 secondes, envoyez-la automatiquement par WhatsApp, et laissez l\'IA relancer vos clients avec votre ton de voix — sans jamais avoir à faire la police vous-même.',
    features: ['Devis et factures PDF en 3 secondes', 'Envoi automatique WhatsApp + email', 'Relances échelonnées J+3, J+7, J+15 personnalisées', 'Suivi de l\'état de chaque paiement en temps réel', 'Tableau de bord créances clients', 'Compatible Mobile Money, Wave, virement, espèces'],
    gains: ['+25 à 40 % de taux de recouvrement', 'Image professionnelle dès le premier envoi', '3 à 5h/semaine économisées sur la gestion admin'],
    for: 'Artisans, services, commerçants, petites entreprises',
    cta: 'Je veux être payé plus vite',
  },
  {
    id: 'crm',
    title: 'Mini-CRM IA',
    price: '99 000 FCFA',
    type: 'Paiement unique',
    desc: 'Un CRM conçu pour fonctionner entièrement depuis WhatsApp. L\'IA qualifie chaque lead entrant, lui attribue un score d\'achat, programme vos relances et vous dit chaque matin sur qui concentrer vos efforts du jour.',
    features: ['Capture automatique des leads WhatsApp/formulaires', 'Scoring IA de probabilité d\'achat (0–100)', 'Pipeline visuel prospect → client', 'Relances automatiques personnalisées par segment', 'Historique complet des échanges par contact', 'Rapport quotidien : top 5 des prospects à rappeler'],
    gains: ['+45 % de taux de conversion moyen', 'Aucune opportunité oubliée ou mal relancée', 'Temps commercial réduit de moitié'],
    for: 'Commerciaux, agences, consultants, services B2B',
    cta: 'Je veux ce CRM',
  },
  {
    id: 'booking',
    title: 'Booking Intelligent',
    price: '79 000 FCFA',
    type: 'Paiement unique',
    desc: 'Votre agenda se remplit tout seul. Les clients réservent depuis WhatsApp, reçoivent des rappels automatiques, et l\'IA gère les annulations, les remplacements de créneaux et le programme de fidélité sans que vous n\'ayez à intervenir.',
    features: ['Réservation en libre-service via WhatsApp', 'Rappels automatiques 24h et 2h avant le rendez-vous', 'Gestion intelligente des annulations et remplacements', 'Programme de fidélité intégré (x visites = cadeau)', 'Synchronisation agenda Google/Outlook', 'Statistiques remplissage et taux de no-show'],
    gains: ['−50 % de no-shows grâce aux rappels', '+40 % de fidélisation sur 6 mois', '8 à 12h/semaine récupérées sur la gestion agenda'],
    for: 'Salons, cliniques, hôtels, coaches, formateurs',
    cta: 'Je veux ce système',
  },

  /* ── Restauration ── */
  {
    id: 'menu-predictif',
    title: 'Menu Prédictif IA',
    price: '59 000 FCFA',
    type: 'Paiement unique',
    desc: 'L\'IA croise vos ventes passées, la météo, les jours fériés locaux et les habitudes de votre quartier pour vous dire exactement quels plats préparer chaque jour — et en quelle quantité. Fini le gaspillage, fini les ruptures à 13h.',
    features: ['Prévision quotidienne des plats à préparer', 'Intégration météo et calendrier local', 'Calcul des quantités par plat et par service', 'Alertes stocks cuisine avant le rush', 'Analyse des plats les moins/plus rentables', 'Rapport hebdo gaspillage et marges par plat'],
    gains: ['−40 % de gaspillage alimentaire en moyenne', '+18 à 28 % de marge brute récupérée', 'Ruptures de plats phares divisées par 3'],
    for: 'Restaurants, maquis, snacks, cantines',
    cta: 'Je veux ce menu intelligent',
  },
  {
    id: 'commandes-resto',
    title: 'Prise de Commandes WhatsApp',
    price: '69 000 FCFA',
    type: 'Paiement unique',
    desc: 'Un assistant IA sur WhatsApp qui prend les commandes, confirme les tables, gère les pré-commandes et encaisse via Mobile Money — même pendant les rushs du midi quand vous ne pouvez pas décrocher.',
    features: ['Menu interactif envoyé automatiquement sur WhatsApp', 'Prise de commande + confirmation de table', 'Pré-commandes et commandes à emporter', 'Encaissement Mobile Money avant l\'arrivée', 'Transmission directe en cuisine (ticket numérique)', 'Historique des commandes par client'],
    gains: ['+30 % de commandes traitées pendant les rushs', 'Zéro commande perdue ou mal saisie', 'Paiements encaissés avant l\'arrivée du client'],
    for: 'Restaurants, maquis, fast-foods, traiteurs',
    cta: 'Je veux automatiser mes commandes',
  },
  {
    id: 'tableau-cuisine',
    title: 'Tableau de Bord Cuisine IA',
    price: '49 000 FCFA',
    type: 'Paiement unique',
    desc: 'Chaque matin à 7h, un rapport WhatsApp vous attend : plats à préparer en priorité, stocks à réapprovisionner, ventes de la veille, chiffre de la semaine. Tout ça sans ouvrir un ordinateur ni un fichier Excel.',
    features: ['Rapport matinal automatique à 7h sur WhatsApp', 'Classement des plats par vitesse de rotation', 'Alerte réapprovisionnement stocks cuisine', 'Résumé ventes J-1 et tendance semaine', 'Comparaison même jour semaine précédente', 'Export CSV mensuel pour votre comptable'],
    gains: ['1 à 3h de gestion économisées chaque jour', 'Décisions cuisine basées sur des données réelles', 'Visibilité totale sans ordinateur ni logiciel'],
    for: 'Chefs, gérants de restaurant, responsables cuisine',
    cta: 'Je veux ce tableau de bord',
  },

  /* ── Immobilier ── */
  {
    id: 'immo-assistant',
    title: 'Assistant IA Immobilier',
    price: '119 000 FCFA',
    type: 'Paiement unique',
    desc: 'Un assistant IA qui répond instantanément aux demandes de visites, qualifie les acheteurs/locataires potentiels, envoie les fiches descriptives et planifie les visites — pendant que vous vous concentrez sur la négociation et la signature.',
    features: ['Réponse automatique aux demandes de visite (WhatsApp/SMS)', 'Qualification acheteur/locataire par questionnaire IA', 'Envoi automatique des fiches et photos des biens', 'Planification des visites + rappels automatiques', 'Relance des contacts inactifs après 7/14/30 jours', 'Tableau de bord pipeline biens et contacts'],
    gains: ['+60 % de visites effectivement planifiées', 'Aucun prospect non relancé', '5 à 8h/semaine économisées sur les échanges téléphoniques'],
    for: 'Agents immobiliers, promoteurs, agences',
    cta: 'Je veux cet assistant',
  },

  /* ── Agriculture ── */
  {
    id: 'agri-prix',
    title: 'Prédicteur de Prix Agricoles IA',
    price: '129 000 FCFA',
    type: 'Paiement unique',
    desc: 'L\'IA analyse les prix des marchés locaux, les données météo et les cycles saisonniers pour prédire les prix de vos cultures 2 à 4 semaines à l\'avance. Vendez au bon moment, stockez au bon moment.',
    features: ['Prévision des prix à 2, 3 et 4 semaines', 'Couverture des principaux marchés locaux et régionaux', 'Alertes WhatsApp quand les prix montent ou baissent', 'Recommandation : vendre maintenant ou stocker', 'Analyse comparative entre marchés (trouver le meilleur acheteur)', 'Historique des prix sur 24 mois pour votre culture'],
    gains: ['+20 à 35 % de revenus par vente au meilleur moment', 'Fin des ventes à perte faute d\'information', 'Décisions de stockage basées sur des données réelles'],
    for: 'Agriculteurs, coopératives, grossistes agroalimentaires',
    cta: 'Je veux ce prédicteur',
  },

  /* ── Éducation ── */
  {
    id: 'ecole-ia',
    title: 'Assistant Admin École IA',
    price: '89 000 FCFA',
    type: 'Paiement unique',
    desc: 'Un assistant IA qui gère toute la communication de votre école : inscriptions par WhatsApp, bulletins automatiques, rappels de frais de scolarité, convocations parents — sans secrétaire supplémentaire.',
    features: ['Inscription en ligne via WhatsApp avec confirmation auto', 'Envoi automatique des bulletins aux parents par WhatsApp', 'Rappels de paiement des frais de scolarité (doux puis fermes)', 'Convocations et circulaires aux parents en masse', 'Suivi des présences et alertes absences aux parents', 'Tableau de bord : inscriptions, paiements, effectifs'],
    gains: ['−80 % du temps de secrétariat sur la communication', '+40 % de recouvrement des frais de scolarité', 'Parents informés en temps réel sans effort'],
    for: 'Écoles primaires, collèges, lycées, centres de formation',
    cta: 'Je veux cet assistant',
  },

  /* ── Digital-first ── */
  {
    id: 'scoring-lead',
    title: 'Scoring & Qualification Lead IA',
    price: '89 000 FCFA',
    type: 'Paiement unique',
    desc: 'L\'IA analyse chaque prospect entrant (via WhatsApp, formulaire ou réseaux sociaux), lui attribue un score de probabilité d\'achat et vous dit exactement dans quel ordre les rappeler. Arrêtez de perdre du temps sur les mauvais leads.',
    features: ['Capture leads multi-canal (WhatsApp, formulaire, Facebook)', 'Score IA 0–100 basé sur le profil et le comportement', 'Classement quotidien : les prospects à contacter en premier', 'Séquences de nurturing automatiques pour les leads froids', 'Alertes en temps réel pour les leads très chauds', 'Rapport hebdo : leads convertis vs perdus avec analyse'],
    gains: ['+45 % de taux de closing', 'Temps commercial divisé par 2', 'Aucun prospect chaud ne passe entre les mailles'],
    for: 'Agences immobilières, assurances, B2B, e-commerce, formation',
    cta: 'Je veux qualifier mes leads',
  },
];

function ProductsPanel() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const product = PRODUCTS[active];

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setIsTablet(w >= 640 && w < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Mobile layout: horizontal scrollable tabs + detail below ── */
  if (isMobile) {
    return (
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #EDEAFF', overflow: 'hidden', boxShadow: '0 4px 32px rgba(121,103,255,0.07)' }}>
        {/* horizontal tab bar */}
        <div style={{
          display: 'flex', overflowX: 'auto', gap: 0,
          borderBottom: '1.5px solid #EDEAFF',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
        }}>
          {PRODUCTS.map((p, i) => {
            const isActive = i === active;
            return (
              <button key={p.id} onClick={() => setActive(i)}
                style={{
                  flexShrink: 0, padding: '12px 16px',
                  background: isActive ? '#F0EEFF' : 'transparent',
                  border: 'none', borderBottom: `2px solid ${isActive ? '#7967FF' : 'transparent'}`,
                  cursor: 'pointer', transition: 'background 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
                  minWidth: 120,
                }}>
                <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? '#7967FF' : '#555', whiteSpace: 'nowrap' }}>
                  {p.title.length > 18 ? p.title.slice(0, 18) + '…' : p.title}
                </span>
                <span style={{ fontSize: 10, color: isActive ? '#A78BFA' : '#aaa', fontWeight: 600 }}>{p.price}</span>
              </button>
            );
          })}
        </div>

        {/* detail panel below */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa' }}>Pour : {product.for}</p>
            </div>
            <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 20, color: '#111', lineHeight: 1.2, marginBottom: 6 }}>{product.title}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
              <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 22, color: '#7967FF' }}>{product.price}</span>
              <span style={{ fontSize: 11, color: '#aaa' }}>{product.type}</span>
            </div>
            <div style={{ height: 1, background: '#EDEAFF', marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, marginBottom: 20 }}>{product.desc}</p>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 10 }}>Ce qui est inclus</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
              {product.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle2 size={12} color="#A78BFA" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 10 }}>Ce que vous gagnez</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {product.gains.map(g => (
                <div key={g} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#7967FF', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, color: '#111', fontWeight: 600, lineHeight: 1.4 }}>{g}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#F8F7FF', borderRadius: 10, padding: '10px 12px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={11} color="#7967FF" />
                <span style={{ fontSize: 11, color: '#666' }}>Activation en moins de 24h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={11} color="#22c55e" />
                <span style={{ fontSize: 11, color: '#666' }}>Garantie satisfait ou remboursé 14 jours</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="https://wa.me/237000000000" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7967FF', color: '#fff', padding: '11px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
                {product.cta} <ArrowRight size={13} />
              </a>
              <Link href="/formation-ia" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1.5px solid #EDEAFF', color: '#666', padding: '11px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C4BCFF')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#EDEAFF')}>
                Marque blanche
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ── Tablet & Desktop: grid layout ── */
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '220px 1fr' : '260px 1fr', background: '#fff', borderRadius: 20, border: '1.5px solid #EDEAFF', overflow: 'hidden', boxShadow: '0 4px 32px rgba(121,103,255,0.07)' }}>
      {/* LEFT */}
      <div style={{ borderRight: '1.5px solid #EDEAFF', padding: '8px 0' }}>
        {PRODUCTS.map((p, i) => {
          const isActive = i === active;
          return (
            <button key={p.id} onClick={() => setActive(i)}
              style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: isActive ? '#F0EEFF' : 'transparent', border: 'none', borderBottom: '1px solid #F4F2FF', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 10 }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span style={{ width: 3, height: 20, borderRadius: 99, background: isActive ? '#7967FF' : 'transparent', flexShrink: 0, transition: 'background 0.15s' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? '#7967FF' : '#444', lineHeight: 1.3 }}>{p.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  <p style={{ fontSize: 11, color: isActive ? '#A78BFA' : '#aaa', fontWeight: 600 }}>{p.price}</p>
                </div>
              </div>
            </button>
          );
        })}
        <div style={{ padding: '16px 20px', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <CheckCircle2 size={13} color="#22c55e" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>Garantie satisfait ou remboursé 14 jours</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ padding: isTablet ? '28px 28px' : '40px 44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa' }}>Idéal pour : {product.for}</p>
          </div>
          <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: isTablet ? 20 : 24, color: '#111', lineHeight: 1.2, marginBottom: 8 }}>{product.title}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
            <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: isTablet ? 22 : 26, color: '#7967FF' }}>{product.price}</span>
            <span style={{ fontSize: 12, color: '#aaa' }}>{product.type}</span>
          </div>
          <div style={{ height: 1, background: '#EDEAFF', marginBottom: 20 }} />
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.75, marginBottom: 24 }}>{product.desc}</p>

          <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Ce qui est inclus */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Ce qui est inclus</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <CheckCircle2 size={13} color="#A78BFA" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Ce que vous gagnez */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Ce que vous gagnez</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {product.gains.map(g => (
                  <div key={g} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <span style={{ fontSize: 14, color: '#7967FF', fontWeight: 700, flexShrink: 0, lineHeight: 1.4 }}>→</span>
                    <span style={{ fontSize: 14, color: '#111', fontWeight: 600, lineHeight: 1.4 }}>{g}</span>
                  </div>
                ))}
              </div>
              {/* activation info */}
              <div style={{ background: '#F8F7FF', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={12} color="#7967FF" />
                  <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>Activation en moins de 24h</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={12} color="#22c55e" />
                  <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>Garantie satisfait ou remboursé 14 jours</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="https://wa.me/237000000000" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7967FF', color: '#fff', padding: '12px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
              {product.cta} <ArrowRight size={13} />
            </a>
            <Link href="/formation-ia" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1.5px solid #EDEAFF', color: '#666', padding: '12px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#C4BCFF')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#EDEAFF')}>
              Revendre en marque blanche
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function ProduitsPage() {
  return (
    <main style={{ background: '#fff', color: '#111', fontFamily: 'DM Sans, sans-serif' }}>

      <SharedNav
        anchors={[
          { label: 'Produits IA', href: '#produits' },
          { label: 'Formation',   href: '#formation' },
          { label: 'Contact',     href: '#contact' },
        ]}
        ctaLabel="Lancer mon agence IA"
        ctaHref="/formation-ia"
      />

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}><DotGrid /></div>
        <div aria-hidden style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '80px 24px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* copy centré */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ maxWidth: 680 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 16 }}>
              Produits IA — Ozirus Africa
            </p>
            <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.0, letterSpacing: '-0.025em', color: '#111', marginBottom: 20 }}>
              Achetez aujourd'hui.{' '}
              <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Utilisez demain.
              </span>
            </h1>
            <p style={{ fontSize: 16, color: '#555', lineHeight: 1.75, marginBottom: 32 }}>
              13 outils IA prêts à l'emploi pour PME africaines — commerce, restauration, immobilier, agriculture, éducation et plus.
              <br />Paiement Mobile Money, Wave, Orange ou MTN. Activation en moins de 24h. Garantie 14 jours.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
              <a href="#produits"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7967FF', color: '#fff', padding: '13px 26px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(121,103,255,0.3)', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
                Voir les produits <ArrowRight size={14} />
              </a>
              <a href="https://wa.me/237000000000" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1.5px solid #25D366', color: '#25D366', padding: '13px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366'; }}>
                <MessageCircle size={14} /> Commander via WhatsApp
              </a>
            </div>
          </motion.div>

          {/* vidéo centrée, large */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ width: '100%', maxWidth: 820, position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '16/9', background: '#0A0A0F', boxShadow: '0 24px 80px rgba(121,103,255,0.18), 0 0 0 1.5px rgba(121,103,255,0.15)' }}
          >
            <video
              autoPlay muted loop playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            >
              {/* <source src="/video/produits-ia.mp4" type="video/mp4" /> */}
            </video>

            {/* overlay dégradé */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(121,103,255,0.2) 0%, rgba(10,10,15,0.55) 100%)' }} />

            {/* bouton play centré */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'transform 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}><polygon points="5,3 19,12 5,21" /></svg>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: '0.05em' }}>
                Voir comment ça marche — 2 min
              </p>
            </div>

            {/* barre bas */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: 'linear-gradient(0deg, rgba(10,10,15,0.7) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.05em' }}>
                Ozirus — Démo produits IA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>En production</span>
              </div>
            </div>
          </motion.div>

          {/* chips secteurs sous la vidéo */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pour :</span>
            {SECTORS.slice(0, 7).map(s => {
              const Icon = s.icon;
              return (
                <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FAFAFA', border: '1px solid #EDEAFF', borderRadius: 99, padding: '4px 12px', fontSize: 12, color: '#666', fontWeight: 500 }}>
                  <Icon size={10} /> {s.label}
                </span>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* PRODUCTS PANEL */}
      <section style={{ padding: '0 24px 96px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <ProductsPanel />

          {/* WhatsApp CTA bas de panel */}
          <div style={{ marginTop: 32, borderTop: '1.5px solid #EDEAFF', paddingTop: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', align: 'center', gap: 8, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13, color: '#888' }}>Une question sur un produit ?</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>On répond en moins de 2h.</span>
            </div>
            <a href="https://wa.me/237000000000" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              <MessageCircle size={15} /> Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ padding: '80px 24px', background: '#FAFAFA', borderTop: '1.5px solid #F0EEFF' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>Mise en route</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, color: '#111', letterSpacing: '-0.02em' }}>
              De l'achat à l'utilisation en 24h
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { n: '01', icon: MessageCircle, title: 'Vous commandez', body: 'Choisissez votre outil et payez via Mobile Money, Wave, Orange Money ou MTN. Confirmation immédiate sur WhatsApp.' },
              { n: '02', icon: Zap, title: 'On configure pour vous', body: 'Notre équipe paramètre l\'outil à votre activité, vos produits et votre ton de voix. Vous ne touchez rien.' },
              { n: '03', icon: Clock, title: 'Vous validez en 30 min', body: 'On vous présente le résultat via WhatsApp. Vous testez, vous ajustez si besoin, on finalise ensemble.' },
              { n: '04', icon: Star, title: 'Vous utilisez dès demain', body: 'L\'outil est en ligne. Vos clients commencent à interagir avec lui. Vous commencez à voir les résultats dans la semaine.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1.5px solid #EDEAFF', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: '#F0EEFF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="#7967FF" />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#D4CFFF', letterSpacing: '0.1em' }}>{step.n}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 8 }}>{step.title}</p>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{step.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: '80px 24px', background: '#fff', borderTop: '1.5px solid #F0EEFF' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>Ils l'utilisent déjà</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, color: '#111', letterSpacing: '-0.02em' }}>
              Des résultats réels, pas des promesses.
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
            {[
              { quote: 'Mon chatbot WhatsApp répond à mes clients la nuit. Je me réveille avec des commandes et des paiements déjà encaissés. J\'ai augmenté mes ventes de 40 % en 6 semaines.', name: 'Sandrine B.', city: 'Douala', role: 'Boutique mode', product: 'Chatbot WhatsApp IA Pro', result: '+40 % de ventes' },
              { quote: 'Avant je perdais 300 000 FCFA par mois en produits périmés. Maintenant le système me dit exactement quoi commander et quand. Les pertes ont presque disparu.', name: 'Moussa K.', city: 'Abidjan', role: 'Gérant pharmacie', product: 'Gestionnaire de Stocks', result: '−90 % de pertes' },
              { quote: 'Mes clients paient maintenant avant même d\'arriver au salon. Le système de booking avec rappels a divisé mes no-shows par 3. Je remplis tout mon agenda.', name: 'Fatoumata D.', city: 'Dakar', role: 'Salon de coiffure', product: 'Booking Intelligent', result: '−66 % de no-shows' },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ background: '#FAFAFA', border: '1.5px solid #EDEAFF', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>« {t.quote} »</p>
                <div style={{ height: 1, background: '#EDEAFF' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: '#aaa' }}>{t.role} · {t.city}</p>
                    <p style={{ fontSize: 11, color: '#7967FF', marginTop: 3 }}>{t.product}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#7967FF', background: '#F0EEFF', padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap' }}>{t.result}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ background: 'linear-gradient(135deg, #F0EEFF, #E8E6FF)', borderRadius: 16, padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
            {[
              { v: '13', l: 'outils disponibles', sub: 'prêts à l\'emploi' },
              { v: '150+', l: 'entreprises actives', sub: 'en Afrique francophone' },
              { v: '24h', l: 'délai d\'activation', sub: 'garanti ou remboursé' },
              { v: '14j', l: 'garantie remboursement', sub: 'sans condition' },
            ].map(s => (
              <div key={s.v} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 32, color: '#7967FF', lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginTop: 4 }}>{s.l}</p>
                <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA FORMATION */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '72px 24px', background: '#0A0A0F' }}>
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 14 }}>Aller plus loin</p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Vous voulez vendre ces produits à d'autres ?
          </h2>
          <p style={{ fontSize: 15, color: '#888', lineHeight: 1.75, marginBottom: 28 }}>
            Notre formation vous donne accès à tous ces produits en marque blanche + tout ce qu'il faut pour lancer votre agence IA et facturer 300 000 à 800 000 FCFA/mois.
          </p>
          <Link href="/formation-ia" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7967FF', color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(121,103,255,0.3)', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
            Découvrir la formation <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1.5px solid #F0EEFF', padding: '24px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 22, opacity: 0.5 }} />
            <span style={{ fontSize: 13, color: '#aaa' }}>© {new Date().getFullYear()} Ozirus Agency</span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/formation-ia" style={{ color: '#aaa', textDecoration: 'none' }}>Formation</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
