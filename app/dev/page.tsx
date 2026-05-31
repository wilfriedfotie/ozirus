'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Star, TrendingUp,
  Smartphone, Globe, Zap, Code2, Layers, Shield,
  RefreshCw, Clock, Users, MessageCircle,
  ShoppingBag, Landmark, GraduationCap, Heart,
  UtensilsCrossed, Hotel, HardHat, Truck,
  Send, ArrowDownLeft, MoreHorizontal,
  Banknote, RefreshCcw, Coffee,
  Flame, Activity, Timer, ChevronRight, Dumbbell,
  RotateCcw, Zap as ZapIcon,
  MapPin, Search, Bell, ShoppingCart, Star as StarIcon,
  Clock as ClockIcon, ChevronDown, Pizza, Beef,
  Package, BarChart2,
  LayoutDashboard, Settings, Users as UsersIcon,
  PlusCircle, DollarSign,
  AlertCircle, Calendar, ChefHat, ClipboardList,
  Download, Filter, Percent, Pill, Stethoscope, UserCheck,
  ShoppingBag as BagIcon,
} from 'lucide-react';

/* ─── bg patterns ──────────────────────────────────── */
const DotGrid = ({ opacity = 0.1 }: { opacity?: number }) => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
    <defs>
      <pattern id="dots-dev" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#7967FF" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots-dev)" />
  </svg>
);

const LineGrid = ({ opacity = 0.05 }: { opacity?: number }) => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
    <defs>
      <pattern id="lines-dev" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0 L0 0 0 48" fill="none" stroke="#7967FF" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lines-dev)" />
  </svg>
);

const T = (delay = 0) => ({ duration: 0.5, delay, ease: [0.25, 0, 0, 1] as [number, number, number, number] });
const up = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: T(delay) });
const upView = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: T(delay) });

/* ─── data ─────────────────────────────────────────── */
const OFFERS = [
  {
    id: 'mobile',
    icon: Smartphone,
    cat: 'Application Mobile',
    title: 'Votre app iOS & Android, pensée pour vos utilisateurs.',
    pitch: 'Une app mobile qui convertit dès le premier écran. On part de vos utilisateurs réels, pas d\'une spec PowerPoint.',
    desc: 'On conçoit et développe votre application mobile de A à Z — discovery, design, développement Flutter, tests, déploiement sur les stores. Chaque décision est validée avec vous avant d\'être codée.',
    stack: ['Flutter (iOS & Android)', 'Firebase / Supabase', 'API REST ou GraphQL', 'Paiement Mobile Money & Stripe'],
    steps: ['1 semaine de discovery utilisateurs', 'Wireframes validés avant le code', 'Sprints de 2 semaines, démos à chaque étape', 'Déploiement App Store & Play Store inclus'],
    gains: ['MVP livrable en 6 à 10 semaines', 'Code source 100 % propriété du client', 'App Store & Play Store gérés par nous', 'Support 3 mois post-lancement inclus'],
    from: '1 200 000',
    cta: 'Démarrer mon app mobile',
  },
  {
    id: 'saas',
    icon: Globe,
    cat: 'Plateforme SaaS',
    title: 'Votre SaaS de zéro au premier client payant.',
    pitch: 'Un produit SaaS rentable commence par le bon périmètre. On vous aide à définir ce qui compte, puis on le construit.',
    desc: 'De l\'idée à la plateforme en production. On gère la stratégie produit, l\'architecture technique, le développement front et back, l\'onboarding utilisateurs et la mise en place du billing.',
    stack: ['Next.js / React', 'Node.js ou Python (API)', 'PostgreSQL / MongoDB', 'Stripe, Lemon Squeezy ou Mobile Money'],
    steps: ['Cadrage produit et définition du MVP', 'Architecture technique scalable dès le départ', 'Interface admin + espace client', 'Intégration billing et onboarding utilisateur'],
    gains: ['Premier client en 8 à 12 semaines', 'Architecture scalable dès J1', 'Tableau de bord admin complet', 'Documentation technique livrée'],
    from: '1 500 000',
    cta: 'Construire mon SaaS',
  },
  {
    id: 'interface',
    icon: Layers,
    cat: 'Interface Métier',
    title: 'Un outil interne que vos équipes utiliseront vraiment.',
    pitch: 'Les outils internes ratés coûtent cher. On conçoit des interfaces simples que vos équipes adoptent sans formation.',
    desc: 'Tableaux de bord, outils de gestion, CRM sur mesure, back-office — on construit les interfaces qui remplacent vos fichiers Excel et vos processus manuels par quelque chose qui fonctionne.',
    stack: ['React ou Next.js', 'Connexion à vos données existantes', 'Exports PDF / Excel automatiques', 'Droits et rôles utilisateurs'],
    steps: ['Audit de vos processus actuels', 'Design centré sur les utilisateurs finaux', 'Connexion à vos APIs et bases de données', 'Formation équipe incluse'],
    gains: ['Prise en main sans formation longue', 'Remplacement des fichiers Excel', 'Gain de 5 à 15h/semaine par équipe', 'Accès rôles granulaires par profil'],
    from: '600 000',
    cta: 'Moderniser mes outils internes',
  },
];

const PROCESS = [
  {
    n: '01', week: 'Semaine 1–2', icon: Users,
    title: 'Discovery & cadrage',
    body: 'On part de vos utilisateurs, pas de vos hypothèses. Interviews, analyse concurrente, définition du scope minimum viable. Vous validez chaque décision avant qu\'on démarre.',
  },
  {
    n: '02', week: 'Semaine 2–3', icon: Layers,
    title: 'Architecture & design',
    body: 'Wireframes, maquettes haute fidélité, choix de la stack technique. Tout est soumis à votre approbation avant la première ligne de code.',
  },
  {
    n: '03', week: 'Semaines 4–10', icon: Code2,
    title: 'Build en sprints',
    body: 'Développement par itérations de 2 semaines. Une démo à la fin de chaque sprint. Vous voyez le produit prendre forme et pouvez ajuster en temps réel.',
  },
  {
    n: '04', week: 'Semaine 10–12', icon: Zap,
    title: 'Tests & lancement',
    body: 'Tests de performance, sécurité, UX. Déploiement en production, soumission stores si mobile, monitoring mis en place. Vous repartez avec les accès à tout.',
  },
];

const STACK_MOBILE = [
  { label: 'Flutter', desc: 'Une seule codebase iOS + Android. Performances natives.' },
  { label: 'Firebase', desc: 'Auth, base de données, push notifications, storage.' },
  { label: 'Supabase', desc: 'Postgres open-source, temps réel, REST API auto-générée.' },
  { label: 'Mobile Money', desc: 'MTN, Orange, Wave — paiements intégrés nativement.' },
];

const STACK_WEB = [
  { label: 'Next.js', desc: 'React SSR/SSG, SEO optimisé, déploiement edge.' },
  { label: 'Node / Python', desc: 'API robuste, scalable, documentée automatiquement.' },
  { label: 'PostgreSQL', desc: 'Base de données relationnelle fiable pour vos données critiques.' },
  { label: 'Stripe / Lemon', desc: 'Billing, abonnements, facturation automatique.' },
];

const REALIZATIONS = [
  {
    tag: 'App Mobile — Restauration',
    title: 'App de commande & fidélité',
    result: '+38 % de commandes répétées en 2 mois',
    body: 'Application Flutter pour chaîne de restaurants. Commande en ligne, paiement Mobile Money, programme de points, push notifications. Lancée sur iOS et Android en 9 semaines.',
    icon: UtensilsCrossed,
  },
  {
    tag: 'SaaS — Éducation',
    title: 'Plateforme de gestion scolaire',
    result: '3 établissements onboardés, 0 papier',
    body: 'SaaS de gestion des inscriptions, paiements, planning et bulletins pour écoles privées. Intégration Mobile Money, espace parent, tableau de bord direction. MVP en 10 semaines.',
    icon: GraduationCap,
  },
  {
    tag: 'Interface Métier — Santé',
    title: 'Back-office clinique',
    result: '−12h de saisie manuelle par semaine',
    body: 'Interface de gestion des rendez-vous, dossiers patients et stocks. Remplacement de 4 fichiers Excel. Formation équipe en 1 journée. Adoption à 100 % dès la semaine 1.',
    icon: Heart,
  },
  {
    tag: 'App Mobile — Commerce',
    title: 'App catalogue & commandes B2B',
    result: '+60 % de commandes traitées avec la même équipe',
    body: 'Application mobile pour grossiste permettant à ses revendeurs de passer commande, suivre les livraisons et consulter leurs factures. Zéro appel téléphonique pour les commandes courantes.',
    icon: ShoppingBag,
  },
];

const SECTORS_FIT = [
  { icon: UtensilsCrossed, label: 'Restauration',     fit: 'App commande + fidélité' },
  { icon: ShoppingBag,     label: 'Commerce',          fit: 'Catalogue & commandes B2B' },
  { icon: GraduationCap,   label: 'Éducation',         fit: 'SaaS gestion scolaire' },
  { icon: Heart,           label: 'Santé',              fit: 'Dossier patient & RDV' },
  { icon: Landmark,        label: 'Microfinance',       fit: 'App crédit & épargne' },
  { icon: Hotel,           label: 'Hôtellerie',         fit: 'Réservation & check-in' },
  { icon: Truck,           label: 'Transport',          fit: 'Suivi flotte & dispatch' },
  { icon: HardHat,         label: 'BTP',                fit: 'Suivi chantier mobile' },
];

const WHY = [
  { icon: Code2,    title: 'On code ce qu\'on conçoit', body: 'Pas d\'intermédiaire, pas de freelance inconnu. L\'équipe qui fait le discovery est la même qui écrit le code.' },
  { icon: RefreshCw, title: 'Itératif et transparent',  body: 'Vous voyez le produit avancer toutes les 2 semaines. Pas de tunnel de 3 mois avec une surprise à la fin.' },
  { icon: Shield,   title: 'Vous êtes propriétaire',    body: 'Code source, comptes stores, accès infra — tout est à vous dès le premier jour. Zéro dépendance à vie.' },
  { icon: Zap,      title: 'Pensé pour évoluer',        body: 'Architecture propre, documentation technique livrée, code commenté. Votre équipe peut reprendre le projet n\'importe quand.' },
];

/* ─── OffersPanel ───────────────────────────────────── */
function OffersPanel() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const offer = OFFERS[active];
  const Icon = offer.icon;

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

  /* detail panel content — shared between mobile and desktop layouts */
  const DetailPanel = () => (
    <AnimatePresence mode="wait">
      <motion.div key={active}
        initial={{ opacity: 0, y: isMobile ? 10 : 0, x: isMobile ? 0 : 16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: isMobile ? -6 : 0, x: isMobile ? 0 : -8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{ padding: isMobile ? '24px 20px' : isTablet ? '28px 28px' : '36px 44px' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: '#F0EEFF', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={24} color="#7967FF" />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>{offer.cat}</p>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: isMobile ? 17 : 20, color: '#111', lineHeight: 1.2 }}>{offer.title}</h3>
            </div>
          </div>

          <p style={{ fontSize: 15, color: '#7967FF', fontWeight: 600, lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>« {offer.pitch} »</p>

          <div style={{ height: 1, background: '#EDEAFF', marginBottom: 20 }} />

          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, marginBottom: 24 }}>{offer.desc}</p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24, marginBottom: 24 }}>
            {/* stack */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Stack technique</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {offer.stack.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7967FF', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#444' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* process */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Comment on travaille</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {offer.steps.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <CheckCircle2 size={13} color="#7967FF" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: '#EDEAFF', marginBottom: 20 }} />

          {/* gains */}
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 12 }}>Ce que vous obtenez</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {offer.gains.map(g => (
              <span key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7967FF', background: '#F0EEFF', padding: '5px 12px', borderRadius: 99, fontWeight: 500 }}>
                <CheckCircle2 size={11} color="#7967FF" /> {g}
              </span>
            ))}
          </div>

          {/* price + cta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, color: '#bbb', marginBottom: 2 }}>À partir de</p>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 24, color: '#111' }}>{offer.from} <span style={{ fontSize: 13, fontWeight: 400, color: '#aaa' }}>FCFA</span></p>
            </div>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7967FF', color: '#fff', padding: '13px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
              {offer.cta} <ArrowRight size={13} />
            </a>
          </div>
      </motion.div>
    </AnimatePresence>
  );

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
          {OFFERS.map((o, i) => {
            const OIcon = o.icon;
            const isActive = i === active;
            return (
              <button key={o.id} onClick={() => setActive(i)}
                style={{
                  flexShrink: 0, padding: '12px 16px',
                  background: isActive ? '#F0EEFF' : 'transparent',
                  border: 'none', borderBottom: `2px solid ${isActive ? '#7967FF' : 'transparent'}`,
                  cursor: 'pointer', transition: 'background 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  minWidth: 90,
                }}>
                <div style={{ width: 28, height: 28, background: isActive ? '#7967FF' : '#F5F4FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <OIcon size={13} color={isActive ? '#fff' : '#7967FF'} />
                </div>
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? '#7967FF' : '#888', whiteSpace: 'nowrap' }}>{o.cat.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        <DetailPanel />
      </div>
    );
  }

  /* ── Tablet & Desktop: sidebar grid layout ── */
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '220px 1fr' : '240px 1fr', background: '#fff', borderRadius: 20, border: '1.5px solid #EDEAFF', overflow: 'hidden', boxShadow: '0 4px 32px rgba(121,103,255,0.07)' }}>
      {/* LEFT */}
      <div style={{ borderRight: '1.5px solid #EDEAFF', padding: '8px 0' }}>
        {OFFERS.map((o, i) => {
          const OIcon = o.icon;
          const isActive = i === active;
          return (
            <button key={o.id} onClick={() => setActive(i)}
              style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: isActive ? '#F0EEFF' : 'transparent', border: 'none', borderBottom: '1px solid #F4F2FF', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 12 }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span style={{ width: 3, height: 20, borderRadius: 99, background: isActive ? '#7967FF' : 'transparent', flexShrink: 0, transition: 'background 0.15s' }} />
              <div style={{ width: 32, height: 32, background: isActive ? '#7967FF' : '#F5F4FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                <OIcon size={15} color={isActive ? '#fff' : '#7967FF'} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: isActive ? '#7967FF' : '#bbb', marginBottom: 3 }}>{o.cat}</p>
                <p style={{ fontSize: 12, color: isActive ? '#7967FF' : '#888', fontWeight: 500, lineHeight: 1.3 }}>{o.from} FCFA</p>
              </div>
            </button>
          );
        })}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F4F2FF' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <CheckCircle2 size={13} color="#22c55e" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: '#888', lineHeight: 1.5 }}>Devis précis après diagnostic gratuit</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ padding: isTablet ? '28px 28px' : '36px 44px' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: '#F0EEFF', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={24} color="#7967FF" />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>{offer.cat}</p>
              <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 20, color: '#111', lineHeight: 1.2 }}>{offer.title}</h3>
            </div>
          </div>

          <p style={{ fontSize: 15, color: '#7967FF', fontWeight: 600, lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>« {offer.pitch} »</p>

          <div style={{ height: 1, background: '#EDEAFF', marginBottom: 20 }} />

          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, marginBottom: 24 }}>{offer.desc}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* stack */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Stack technique</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {offer.stack.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7967FF', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#444' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* process */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Comment on travaille</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {offer.steps.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <CheckCircle2 size={13} color="#7967FF" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: '#EDEAFF', marginBottom: 20 }} />

          {/* gains */}
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 12 }}>Ce que vous obtenez</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {offer.gains.map(g => (
              <span key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7967FF', background: '#F0EEFF', padding: '5px 12px', borderRadius: 99, fontWeight: 500 }}>
                <CheckCircle2 size={11} color="#7967FF" /> {g}
              </span>
            ))}
          </div>

          {/* price + cta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, color: '#bbb', marginBottom: 2 }}>À partir de</p>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 24, color: '#111' }}>{offer.from} <span style={{ fontSize: 13, fontWeight: 400, color: '#aaa' }}>FCFA</span></p>
            </div>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7967FF', color: '#fff', padding: '13px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
              {offer.cta} <ArrowRight size={13} />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


/* ─── MockupsShowcase ───────────────────────────────── */

/* ── iPhone chassis ── */
function IPhone({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  const W = 270, H = 560, R = 48, bz = 11, sR = 37;
  const tc = light ? '#111' : '#fff';
  const bleed = light ? 0 : 2;
  const sx = bz - bleed, sy = bz - bleed, sw = W - (bz - bleed) * 2, sh = H - (bz - bleed) * 2;
  const holeX = bz, holeY = bz, holeW = W - bz * 2, holeH = H - bz * 2;
  const statusH = 44;
  const islandW = Math.round(holeW * 0.27);
  const islandH = Math.round(holeW * 0.086);
  const islandTop = 11;
  const statusPadX = 21;
  return (
    <div style={{ position: 'relative', width: W, height: H, flexShrink: 0, maxWidth: '76vw' }}>
      <div style={{ position: 'absolute', inset: 8, borderRadius: R - 2, boxShadow: '0 26px 60px rgba(17,24,39,0.18), 0 8px 20px rgba(17,24,39,0.10)', zIndex: 0 }} />

      <div style={{ position: 'absolute', top: sy, left: sx, width: sw, height: sh, borderRadius: sR, overflow: 'hidden', zIndex: 1, background: light ? '#F5F5F7' : '#0B0B0C' }}>
        {children}
        <div style={{ position: 'absolute', top: islandTop, left: '50%', transform: 'translateX(-50%)', width: islandW, height: islandH, background: '#050505', borderRadius: islandH / 2, zIndex: 20, boxShadow: '0 1px 1px rgba(255,255,255,0.12) inset' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: statusH, zIndex: 19, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `9px ${statusPadX}px 0`, pointerEvents: 'none' }}>
          <span style={{ fontSize: 11.5, lineHeight: '12px', fontWeight: 700, color: tc }}>9:41</span>
          <div style={{ display: 'flex', gap: 4.5, alignItems: 'center', height: 12 }}>
            <svg width="13" height="9" viewBox="0 0 14 10" fill={tc}><rect x="0" y="3" width="2.5" height="7" rx="1"/><rect x="3.5" y="2" width="2.5" height="8" rx="1"/><rect x="7" y="0" width="2.5" height="10" rx="1"/><rect x="10.5" y="1" width="2.5" height="8" rx="1" opacity="0.35"/></svg>
            <svg width="13" height="9" viewBox="0 0 14 10" fill={tc}><path d="M7 1.5C4.8 1.5 2.8 2.4 1.4 3.9L0 2.4C1.8.9 4.3 0 7 0s5.2.9 7 2.4L12.6 3.9C11.2 2.4 9.2 1.5 7 1.5zm0 3.5C5.6 5 4.3 5.6 3.4 6.6L2 5.1C3.3 3.8 5.1 3 7 3s3.7.8 5 2.1L10.6 6.6C9.7 5.6 8.4 5 7 5z"/><circle cx="7" cy="8.5" r="1.5"/></svg>
            <div style={{ width: 20, height: 10, border: `1.35px solid ${tc}`, borderRadius: 3, padding: 1.3, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '72%', height: '100%', background: tc, borderRadius: 1 }}/>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 90, height: 4, background: tc, borderRadius: 99, opacity: 0.18, zIndex: 20, pointerEvents: 'none' }}/>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} fill="none">
        <defs>
          <clipPath id="outerClip"><rect x="0" y="0" width={W} height={H} rx={R}/></clipPath>
        </defs>
        <path
          fillRule="evenodd"
          fill={light ? '#101012' : '#050506'}
          d={[
            `M${R} 1 L${W-R} 1 Q${W-1} 1 ${W-1} ${R} L${W-1} ${H-R} Q${W-1} ${H-1} ${W-R} ${H-1} L${R} ${H-1} Q1 ${H-1} 1 ${H-R} L1 ${R} Q1 1 ${R} 1 Z`,
            `M${holeX+sR} ${holeY} L${holeX+holeW-sR} ${holeY} Q${holeX+holeW} ${holeY} ${holeX+holeW} ${holeY+sR} L${holeX+holeW} ${holeY+holeH-sR} Q${holeX+holeW} ${holeY+holeH} ${holeX+holeW-sR} ${holeY+holeH} L${holeX+sR} ${holeY+holeH} Q${holeX} ${holeY+holeH} ${holeX} ${holeY+holeH-sR} L${holeX} ${holeY+sR} Q${holeX} ${holeY} ${holeX+sR} ${holeY} Z`,
          ].join(' ')}
        />
        <rect x="2" y="2" width={W-4} height={H-4} rx={R - 1} fill="none" stroke={light ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.035)'} strokeWidth="1"/>
        {light && <rect x={holeX} y={holeY} width={holeW} height={holeH} rx={sR} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>}
        <rect x="-2" y="124" width="4" height="34" rx="2" fill="#1C1C1E"/>
        <rect x="-2" y="174" width="4" height="54" rx="2" fill="#1C1C1E"/>
        <rect x="-2" y="240" width="4" height="54" rx="2" fill="#1C1C1E"/>
        <rect x={W-2} y="174" width="4" height="72" rx="2" fill="#1C1C1E"/>
      </svg>
    </div>
  );
}

const appText = '#101014';
const appMuted = '#8E8E93';
const appLine = '#ECECF0';
const appBg = '#F5F5F7';
const appCardShadow = '0 8px 22px rgba(17,24,39,0.055)';
const appSafeBottom = 26;

function AppShell({ children, tint = '#007AFF', bg = appBg, color = appText }: { children: React.ReactNode; tint?: string; bg?: string; color?: string }) {
  return (
    <div style={{ position: 'relative', background: bg, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', padding: `48px 13px ${appSafeBottom}px`, overflow: 'hidden', color }}>
      <div style={{ position: 'absolute', inset: 0, background: bg, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', gap: 7, minHeight: 0 }}>
        {children}
      </div>
      <div style={{ position: 'absolute', right: 18, bottom: 18, width: 6, height: 6, borderRadius: '50%', background: tint, opacity: 0.14 }} />
    </div>
  );
}

function AppCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: '#fff', border: `1px solid ${appLine}`, borderRadius: 14, boxShadow: appCardShadow, ...style }}>{children}</div>;
}

function RoundIcon({ children, bg = '#F2F2F7', color }: { children: React.ReactNode; bg?: string; color?: string }) {
  return <div style={{ width: 24, height: 24, borderRadius: 9, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</div>;
}

function AppTop({ title, subtitle, icon, tint, color = appText, muted = appMuted, flipped = false }: { title: string; subtitle: string; icon: React.ReactNode; tint: string; color?: string; muted?: string; flipped?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 34, flexShrink: 0, padding: '0 13px' }}>
      <div>
        <p style={{ margin: 0, textAlign: 'left', fontSize: flipped ? 18 : 9, lineHeight: flipped ? 1.05 : undefined, fontWeight: flipped ? 800 : undefined, color: flipped ? color : muted, marginBottom: 2 }}>{flipped ? title : subtitle}</p>
        <h3 style={{ margin: 0, textAlign: 'left', fontSize: flipped ? 9 : 18, lineHeight: 1.05, fontWeight: flipped ? 500 : 800, color: flipped ? muted : color }}>{flipped ? subtitle : title}</h3>
      </div>
      <RoundIcon bg="#fff">{icon}</RoundIcon>
    </div>
  );
}

function BottomTabs({ tint, items }: { tint: string; items: React.ReactNode[] }) {
  return (
    <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.92)', border: `1px solid ${appLine}`, borderRadius: 17, padding: '6px 12px', display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, alignItems: 'center', boxShadow: '0 8px 20px rgba(17,24,39,0.075)', backdropFilter: 'blur(14px)', flexShrink: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{ height: 26, borderRadius: 12, color: i === 0 ? tint : '#BFC0C7', background: i === 0 ? `${tint}14` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', transform: 'scale(0.9)' }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function NeoBankApp() {
  return (
    <AppShell tint="#0A84FF" bg="#F7F7F8">
      <AppTop title="Wallet" subtitle="Bonjour Kofi" tint="#0A84FF" icon={<Bell size={15} color="#0A84FF" />} />
      <AppCard style={{ aspectRatio: '1.586 / 1', padding: 13, background: '#111114', color: '#fff', borderColor: '#111114', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 15, flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.52)', marginBottom: 5 }}>Solde disponible</p>
          <p style={{ fontSize: 21, fontWeight: 800, lineHeight: 1 }}>847 500 <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>FCFA</span></p>
          <div style={{ height: 28, display: 'flex', alignItems: 'end', gap: 4, marginTop: 10 }}>
            {[13, 19, 16, 23, 18, 26, 22, 28].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h, borderRadius: 3, background: i === 7 ? '#0A84FF' : 'rgba(255,255,255,0.16)' }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.42)', marginBottom: 5 }}>Carte principale</p>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>•••• 4829</p>
          </div>
          <div style={{ width: 31, height: 20, borderRadius: 6, border: '1px solid rgba(255,255,255,0.22)' }} />
        </div>
      </AppCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, margin: '1px 0' }}>
        {[
          { ic: <Send size={13} color="#0A84FF" />, l: 'Envoyer' },
          { ic: <ArrowDownLeft size={13} color="#0A84FF" />, l: 'Recevoir' },
          { ic: <RefreshCcw size={13} color="#0A84FF" />, l: 'Changer' },
          { ic: <MoreHorizontal size={13} color="#0A84FF" />, l: 'Plus' },
        ].map(a => (
          <AppCard key={a.l} style={{ padding: '8px 6px', textAlign: 'center', boxShadow: 'none' }}>
            <div style={{ width: 24, height: 24, margin: '0 auto 4px', borderRadius: 9, background: '#EEF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.ic}</div>
            <span style={{ display: 'block', fontSize: 8, color: appMuted, fontWeight: 600 }}>{a.l}</span>
          </AppCard>
        ))}
      </div>
      <AppCard style={{ padding: 13, overflow: 'hidden', minHeight: 0, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 800 }}>Transactions</p>
          <span style={{ fontSize: 9, color: '#0A84FF', fontWeight: 700 }}>Tout</span>
        </div>
        {[
          { ic: <ShoppingCart size={12} color="#0A84FF" />, n: 'Mahima Market', d: 'Aujourd hui', a: '-12 400 F', c: '#FF3B30' },
          { ic: <Banknote size={12} color="#34C759" />, n: 'Virement Agence', d: 'Hier', a: '+250 000 F', c: '#34C759' },
          { ic: <Smartphone size={12} color="#5856D6" />, n: 'Mobile Money', d: '22 Jan', a: '-5 000 F', c: appText },
        ].map(t => (
          <div key={t.n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'center', columnGap: 8, padding: '6px 0', borderTop: `1px solid ${appLine}` }}>
            <RoundIcon>{t.ic}</RoundIcon>
            <div style={{ minWidth: 0, textAlign: 'left', justifySelf: 'stretch' }}>
              <p style={{ fontSize: 10, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{t.n}</p>
              <p style={{ fontSize: 8, color: appMuted, marginTop: 1, textAlign: 'left' }}>{t.d}</p>
            </div>
            <p style={{ fontSize: 10, fontWeight: 800, color: t.c }}>{t.a}</p>
          </div>
        ))}
      </AppCard>
      <BottomTabs tint="#0A84FF" items={[<Landmark size={17}/>, <BarChart2 size={17}/>, <Bell size={17}/>, <Settings size={17}/>]} />
    </AppShell>
  );
}

function FitnessApp() {
  return (
    <AppShell tint="#FF9F0A" bg="#0B0B0C" color="#fff">
      <AppTop title="Push Day" subtitle="Lundi - semaine 3" tint="#FF9F0A" color="#fff" muted="rgba(255,255,255,0.46)" icon={<Flame size={15} color="#FF9F0A" />} />
      <div style={{ background: '#161617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.44)' }}>Bloc actif</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Chest</p>
          </div>
          <div style={{ width: 50, height: 50, borderRadius: '50%', border: '5px solid rgba(255,159,10,0.22)', borderTopColor: '#FF9F0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9F0A', fontSize: 12, fontWeight: 900 }}>60%</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[['1 240','kcal'], ['42','min'], ['89','bpm']].map(([v,l]) => <div key={l} style={{ background: '#202022', borderRadius: 7, padding: 6, textAlign: 'left' }}><p style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{v}</p><p style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)' }}>{l}</p></div>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
        {['L','M','M','J','V','S','D'].map((d,i) => <div key={i} style={{ height: 27, borderRadius: 7, background: i === 1 || i === 3 ? '#FF9F0A' : '#19191B', color: i === 1 || i === 3 ? '#111' : 'rgba(255,255,255,0.48)', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 8, fontSize: 8, fontWeight: 900 }}>{d}</div>)}
      </div>
      <div style={{ background: '#161617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 13, minHeight: 0, textAlign: 'left' }}>
        <p style={{ fontSize: 11, fontWeight: 900, marginBottom: 4, color: '#fff', textAlign: 'left' }}>Exercices</p>
        {[
          { n: 'Développé couché', s: '4 x 10 - 80 kg', done: true },
          { n: 'Pompes déclinées', s: '3 x 15 - poids du corps', done: true },
          { n: 'Élévations latérales', s: '3 x 12 - 12 kg', done: false },
        ].map(ex => (
          <div key={ex.n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <RoundIcon bg={ex.done ? 'rgba(255,159,10,0.16)' : '#222225'}>{ex.done ? <CheckCircle2 size={12} color="#FF9F0A"/> : <Dumbbell size={12} color="rgba(255,255,255,0.44)"/>}</RoundIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: ex.done ? 'rgba(255,255,255,0.36)' : '#fff', textDecoration: ex.done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{ex.n}</p>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.36)', marginTop: 1, textAlign: 'left' }}>{ex.s}</p>
            </div>
          </div>
        ))}
      </div>
      <button style={{ border: 'none', background: '#FF9F0A', color: '#111', borderRadius: 9, padding: '9px 12px', fontSize: 10, fontWeight: 900, flexShrink: 0 }}>Démarrer l'exercice 3</button>
      <BottomTabs tint="#FF9F0A" items={[<Activity size={17}/>, <Timer size={17}/>, <Dumbbell size={17}/>, <Settings size={17}/>]} />
    </AppShell>
  );
}

function FoodApp() {
  return (
    <AppShell tint="#FF6B4A" bg="#FFF8F4">
      <AppTop title="QuickEat" subtitle="Bastos, Yaounde" tint="#FF6B4A" icon={<ShoppingBag size={15} color="#FF6B4A" />} />
      <div style={{ background: '#fff', border: `1px solid ${appLine}`, borderRadius: 14, padding: '8px 13px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <Search size={13} color="#B8B8BE" />
        <span style={{ fontSize: 10, color: appMuted }}>Restaurants, plats, cuisines</span>
      </div>
      <AppCard style={{ padding: 13, display: 'grid', gridTemplateColumns: '1fr 64px', alignItems: 'center', gap: 10, borderColor: '#FFE1D6', background: '#111114', color: '#fff', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.52)', fontWeight: 800, marginBottom: 5 }}>Offre du soir</p>
          <p style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>Livraison offerte</p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.48)', marginTop: 4 }}>Des 5 000 FCFA</p>
        </div>
        <div style={{ height: 64, borderRadius: 13, background: '#FF6B4A', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 7 }}>
          {[Pizza, Beef, Coffee, UtensilsCrossed].map((Icon, i) => <div key={i} style={{ borderRadius: 7, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={11} color="#fff" /></div>)}
        </div>
      </AppCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, margin: '1px 0' }}>
        {[
          ['Grillades', <UtensilsCrossed size={14}/>],
          ['Ndole', <Package size={14}/>],
          ['Pizza', <Pizza size={14}/>],
          ['Burgers', <Beef size={14}/>],
        ].map(([label, ic], i) => (
          <AppCard key={String(label)} style={{ padding: '8px 6px', textAlign: 'center', boxShadow: 'none', borderColor: i === 0 ? '#111114' : '#FFE1D6', background: i === 0 ? '#111114' : '#fff', color: i === 0 ? '#fff' : appText }}>
            <div style={{ width: 24, height: 24, margin: '0 auto 4px', borderRadius: 9, background: i === 0 ? '#FF6B4A' : '#FFF0EB', color: i === 0 ? '#fff' : '#FF6B4A', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.9)' }}>{ic}</div>
            <p style={{ fontSize: 8, fontWeight: 700 }}>{label}</p>
          </AppCard>
        ))}
      </div>
      <AppCard style={{ padding: 13, borderColor: '#FFE1D6', overflow: 'hidden', minHeight: 0, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <p style={{ fontSize: 11, fontWeight: 800 }}>Populaires</p>
          <span style={{ fontSize: 9, color: '#FF6B4A', fontWeight: 800 }}>Tout</span>
        </div>
        {[
          { n: 'Le Maquis du Coin', cat: 'Cuisine locale', t: '20-30 min', r: '4.8', p: '2 500 F', ic: <UtensilsCrossed size={12} color="#FF6B4A"/> },
          { n: 'Pizza House', cat: 'Pizza - fast food', t: '15-25 min', r: '4.6', p: '4 000 F', ic: <Pizza size={12} color="#FF6B4A"/> },
          { n: 'Chez Mama', cat: 'Plats camerounais', t: '25-40 min', r: '4.9', p: '1 800 F', ic: <Package size={12} color="#FF6B4A"/> },
        ].map(r => (
          <div key={r.n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'center', columnGap: 8, padding: '6px 0', borderTop: `1px solid ${appLine}` }}>
            <RoundIcon bg="#FFF0EB">{r.ic}</RoundIcon>
            <div style={{ minWidth: 0, textAlign: 'left', justifySelf: 'stretch' }}>
              <p style={{ fontSize: 10, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.n}</p>
              <p style={{ fontSize: 8, color: appMuted, marginTop: 1 }}>{r.cat} - {r.t}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 9, fontWeight: 800 }}>{r.p}</span>
              <p style={{ fontSize: 8, color: '#FF9F0A', fontWeight: 900, marginTop: 2 }}>★ {r.r}</p>
            </div>
          </div>
        ))}
      </AppCard>
      <BottomTabs tint="#FF6B4A" items={[<Search size={17}/>, <StarIcon size={17}/>, <ShoppingCart size={17}/>, <UserCheck size={17}/>]} />
    </AppShell>
  );
}

function SchoolApp() {
  return (
    <AppShell tint="#5856D6" bg="#F7F4EE">
      <AppTop title="Saint-Paul" subtitle="Etablissement" tint="#5856D6" icon={<GraduationCap size={15} color="#5856D6" />} />
      <AppCard style={{ padding: 13, background: '#171511', color: '#fff', borderColor: '#171511', flexShrink: 0, position: 'relative', overflow: 'hidden', textAlign: 'left' }}>
        <div style={{ position: 'absolute', right: -28, top: -28, width: 88, height: 88, borderRadius: '50%', border: '18px solid rgba(88,86,214,0.22)' }} />
        <div style={{ position: 'absolute', right: 15, bottom: 13, width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,0.08)', transform: 'rotate(-8deg)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>Carnet de bord</p>
            <p style={{ fontSize: 20, fontWeight: 900, marginTop: 2, textAlign: 'left' }}>94%</p>
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.42)', marginTop: 2, textAlign: 'left' }}>Presence hebdo</p>
          </div>
          <span style={{ fontSize: 8, color: '#fff', background: '#5856D6', padding: '4px 7px', borderRadius: 9, fontWeight: 800 }}>+3.4%</span>
        </div>
        <svg width="100%" height="58" viewBox="0 0 224 58" style={{ position: 'relative', display: 'block', overflow: 'visible', marginLeft: 0 }}>
          <path d="M0 45 C28 32 36 38 56 24 C79 8 98 30 119 20 C145 7 158 16 176 10 C197 3 210 12 224 7" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="10" strokeLinecap="round" />
          <path d="M0 45 C28 32 36 38 56 24 C79 8 98 30 119 20 C145 7 158 16 176 10 C197 3 210 12 224 7" fill="none" stroke="#9B8CFF" strokeWidth="3" strokeLinecap="round" />
          {[0, 56, 119, 176, 224].map((x, i) => <circle key={x} cx={x} cy={[45,24,20,10,7][i]} r="3.5" fill={i === 4 ? '#fff' : '#9B8CFF'} />)}
        </svg>
      </AppCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[['342','Eleves'], ['18','Classes'], ['14','Absences']].map(([v,l], i) => <AppCard key={l} style={{ padding: '9px 13px', textAlign: 'left', boxShadow: 'none', borderColor: i === 2 ? '#F7D7D7' : '#E9E2D6', background: i === 0 ? '#FFFDF7' : '#fff' }}><p style={{ fontSize: 15, fontWeight: 800, color: i === 2 ? '#D93D36' : appText, textAlign: 'left', margin: 0 }}>{v}</p><p style={{ fontSize: 7, color: appMuted, marginTop: 1, textAlign: 'left', margin: 0 }}>{l}</p></AppCard>)}
      </div>
      <AppCard style={{ padding: 13, textAlign: 'left', overflow: 'hidden', minHeight: 0, borderColor: '#E9E2D6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textAlign: 'left', margin: 0 }}>Rythme classe</p>
          <span style={{ fontSize: 9, color: '#5856D6', fontWeight: 700 }}>3 alertes</span>
        </div>
        {[
          { n: 'Maths 3eme A', cl: 'Controle vendredi', a: '82%', s: 'Pret', c: '#34C759' },
          { n: 'Sciences 6eme B', cl: 'Chapitre en retard', a: '64%', s: 'Suivi', c: '#FF9F0A' },
          { n: 'Histoire 4eme C', cl: 'Absences groupe', a: '71%', s: 'A voir', c: '#D93D36' },
        ].map(p => (
          <div key={p.n} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr) 42px 34px', alignItems: 'center', columnGap: 8, padding: '6px 0', borderTop: `1px solid ${appLine}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: '#F2EFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#5856D6' }}>{p.n.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
            <div style={{ minWidth: 0, textAlign: 'left', justifySelf: 'stretch' }}>
              <p style={{ fontSize: 10, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{p.n}</p>
              <p style={{ fontSize: 8, color: appMuted, textAlign: 'left' }}>{p.cl}</p>
            </div>
            <p style={{ fontSize: 9, fontWeight: 800, textAlign: 'left', justifySelf: 'start', minWidth: 0 }}>{p.a}</p>
            <span style={{ fontSize: 8, fontWeight: 800, color: p.c, textAlign: 'left', justifySelf: 'start' }}>{p.s}</span>
          </div>
        ))}
      </AppCard>
      <AppCard style={{ padding: 13, borderColor: '#E9E2D6', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textAlign: 'left' }}>Planning</p>
          <span style={{ fontSize: 8, color: appMuted }}>Maths 3A</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>{['Lun','Mar','Mer','Jeu','Ven'].map((d,i) => <div key={d} style={{ flex: 1, height: 28, borderRadius: 9, background: i === 2 ? '#5856D6' : '#F3EFE7', color: i === 2 ? '#fff' : appMuted, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 7, fontSize: 8, fontWeight: 800 }}>{d}</div>)}</div>
      </AppCard>
      <BottomTabs tint="#5856D6" items={[<LayoutDashboard size={17}/>, <Users size={17}/>, <Calendar size={17}/>, <Settings size={17}/>]} />
    </AppShell>
  );
}

function ClinicApp() {
  return (
    <AppShell tint="#007AFF" bg="#F5F5F7">
      <AppTop title="Clinique Horizon" subtitle="Health AI" tint="#007AFF" icon={<Stethoscope size={15} color="#007AFF" />} />
      <AppCard style={{ padding: 13, background: '#fff', color: appText, borderColor: '#E7E7EC', position: 'relative', overflow: 'hidden', flexShrink: 0, textAlign: 'left' }}>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 54px', gap: 10, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 9, color: appMuted }}>Assistant IA</p>
            <p style={{ fontSize: 18, fontWeight: 900, marginTop: 2 }}>Résumé du jour</p>
            <p style={{ fontSize: 8, color: appMuted, marginTop: 4 }}>Un patient nécessite une vérification.</p>
          </div>
          <div style={{ width: 54, height: 54, borderRadius: 18, background: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '5px solid #D8E7FF', borderTopColor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#007AFF' }}>86</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 12 }}>
          {[['12','RDV'], ['1','Priorité'], ['18m','Moy.']].map(([v,l]) => (
            <div key={l} style={{ background: '#F6F7FA', borderRadius: 9, padding: 7, textAlign: 'left' }}>
              <p style={{ fontSize: 12, fontWeight: 900 }}>{v}</p>
              <p style={{ fontSize: 7, color: appMuted, marginTop: 1 }}>{l}</p>
            </div>
          ))}
        </div>
      </AppCard>
      <AppCard style={{ padding: 13, textAlign: 'left', overflow: 'hidden', minHeight: 0, borderColor: '#E7E7EC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <p style={{ fontSize: 11, fontWeight: 800 }}>Suggestions</p>
          <span style={{ fontSize: 9, color: '#007AFF', fontWeight: 800 }}>IA</span>
        </div>
        {[
          { n: 'Jean-Luc Biya', age: '52 ans', mo: 'Contrôler la tension avant 10:45', s: 'Priorité', c: '#FF3B30' },
          { n: 'Awa Traore', age: '28 ans', mo: 'Suivi grossesse stable', s: 'OK', c: '#34C759' },
          { n: 'Marie Koumba', age: '34 ans', mo: 'Synthèse prête pour consultation', s: 'Prêt', c: '#007AFF' },
        ].map(p => (
          <div key={p.n} style={{ display: 'grid', gridTemplateColumns: '24px minmax(0,1fr) 42px', alignItems: 'center', columnGap: 8, padding: '7px 0', borderTop: `1px solid ${appLine}` }}>
            <RoundIcon bg={p.c === '#FF3B30' ? '#FFF1F0' : '#F2F2F7'}><Heart size={11} color={p.c} /></RoundIcon>
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <p style={{ fontSize: 10, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.n}</p>
              <p style={{ fontSize: 8, color: appMuted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.age} - {p.mo}</p>
            </div>
            <span style={{ fontSize: 8, fontWeight: 800, color: p.c, textAlign: 'left' }}>{p.s}</span>
          </div>
        ))}
      </AppCard>
      <AppCard style={{ padding: 13, borderColor: '#E7E7EC', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <p style={{ fontSize: 11, fontWeight: 800 }}>Note intelligente</p>
          <span style={{ fontSize: 8, color: appMuted }}>Auto</span>
        </div>
        <p style={{ fontSize: 9, color: appText, lineHeight: 1.4, fontWeight: 700 }}>Les dossiers du matin sont prêts. Un contrôle rapide est recommandé.</p>
        <div style={{ height: 5, background: '#EAF2FF', borderRadius: 99, overflow: 'hidden', marginTop: 8 }}><div style={{ width: '72%', height: '100%', background: '#007AFF', borderRadius: 99 }} /></div>
      </AppCard>
      <BottomTabs tint="#007AFF" items={[<Calendar size={17}/>, <Users size={17}/>, <Pill size={17}/>, <Settings size={17}/>]} />
    </AppShell>
  );
}


/* ══ SaaS mockups — vues produit minimalistes ═════════ */

function SaasFrame({ children, slug, isMobile }: { children: React.ReactNode; slug: string; isMobile?: boolean }) {
  const LW = 650, LH = 418;
  return (
    <div style={{ 
      filter: 'drop-shadow(0 22px 38px rgba(0,0,0,0.18)) drop-shadow(0 3px 8px rgba(0,0,0,0.10))',
      maxWidth: '100%',
      overflowX: isMobile ? 'auto' : 'hidden',
      WebkitOverflowScrolling: 'touch',
      paddingBottom: isMobile ? 10 : 0,
    }}>
      <div style={{ width: LW, background: 'linear-gradient(165deg,#E8E8E8 0%,#CCCCCC 50%,#B8B8B8 100%)', borderRadius: '16px 16px 0 0', padding: '10px 10px 0', boxSizing: 'border-box', border: '1px solid #B6B6B6', borderBottom: 'none', position: 'relative', margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#2a2a2a' }} />
        <div style={{ background: '#F8F8F6', borderRadius: '9px 9px 0 0', height: LH - 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#F1F0ED', borderBottom: '1px solid #E1DFDA', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, background: '#fff', border: '1px solid #E4E1DC', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />
              <span style={{ fontSize: 8, color: '#8A867D', fontFamily: 'DM Sans, sans-serif' }}>{slug}</span>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
        </div>
      </div>
      <div style={{ width: LW, height: 7, background: 'linear-gradient(180deg,#B8B8B8,#C8C8C8)', borderRadius: '0 0 3px 3px', border: '1px solid #ACACAC', borderTop: 'none', margin: '0 auto' }} />
      <div style={{ width: LW - 46, height: 12, background: 'linear-gradient(180deg,#C8C8C8,#D6D6D6)', borderRadius: '0 0 10px 10px', margin: '0 auto', border: '1px solid #B2B2B2', borderTop: 'none' }} />
    </div>
  );
}

type BackNavItem = { label: string; icon: React.ReactNode; active?: boolean };
type BackOfficeTheme = { accent: string; soft: string; bg: string };

function UiPill({ children, tone = '#111', bg = '#F4F3EF' }: { children: React.ReactNode; tone?: string; bg?: string }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, borderRadius: 999, background: bg, color: tone, padding: '2px 6px', fontSize: 6.8, fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{children}</span>;
}

function BackOfficeShell({ children, title, meta, slug, nav, theme, action, sideNote, isMobile }: {
  children: React.ReactNode;
  title: string;
  meta: string;
  slug: string;
  nav: BackNavItem[];
  theme: BackOfficeTheme;
  action: string;
  sideNote?: { label: string; value: string; hint: string };
  isMobile?: boolean;
}) {
  return (
    <SaasFrame slug={slug} isMobile={isMobile}>
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '108px 1fr', background: theme.bg, textAlign: 'left' }}>
        <aside style={{ background: '#111314', color: '#fff', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 21, height: 21, borderRadius: 6, background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 900 }}>OZ</div>
            <div>
              <p style={{ fontSize: 8.2, fontWeight: 900, lineHeight: 1 }}>Ozirus</p>
              <p style={{ fontSize: 6, color: 'rgba(255,255,255,0.42)', marginTop: 2 }}>Backoffice</p>
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {nav.map(item => (
              <div key={item.label} style={{ height: 23, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, padding: '0 7px', background: item.active ? 'rgba(255,255,255,0.12)' : 'transparent', color: item.active ? '#fff' : 'rgba(255,255,255,0.48)' }}>
                {item.icon}
                <span style={{ fontSize: 6.8, fontWeight: item.active ? 800 : 600 }}>{item.label}</span>
              </div>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ ...cropText, fontSize: 6.4, color: 'rgba(255,255,255,0.45)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{sideNote?.label ?? 'Statut'}</p>
            <p style={{ ...cropText, fontSize: 9.2, color: '#fff', fontWeight: 900, lineHeight: 1.05 }}>{sideNote?.value ?? 'Actif'}</p>
            <p style={{ ...cropText, fontSize: 6.4, color: 'rgba(255,255,255,0.44)', marginTop: 5 }}>{sideNote?.hint ?? 'Mis a jour'}</p>
          </div>
        </aside>
        <section style={{ minWidth: 0, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div style={{ height: 48, background: 'rgba(255,255,255,0.86)', borderBottom: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 900, color: '#111', lineHeight: 1 }}>{title}</p>
              <p style={{ fontSize: 6.8, color: '#9B9489', marginTop: 4 }}>{meta}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 126, height: 22, border: '1px solid #E5E0D8', borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', gap: 5, padding: '0 7px', color: '#A6A19A', fontSize: 6.8, fontWeight: 600 }}>
                <Search size={8} color="#A6A19A" /> Rechercher
              </div>
              <button style={{ height: 22, border: 'none', borderRadius: 6, background: theme.accent, color: '#fff', display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px', fontSize: 6.8, fontWeight: 900 }}>
                <PlusCircle size={8} color="#fff" /> {action}
              </button>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: 10 }}>
            {children}
          </div>
        </section>
      </div>
    </SaasFrame>
  );
}

function PlainCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E9E5DD', borderRadius: 7, boxShadow: '0 1px 2px rgba(15,15,15,0.03)', textAlign: 'left', ...style }}>
      {children}
    </div>
  );
}

function MiniMetric({ label, value, tone, bg }: { label: string; value: string; tone: string; bg: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E9E5DD', borderRadius: 7, padding: '5px 7px' }}>
      <p style={{ fontSize: 6.8, color: '#9B9489', marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 900, color: tone, lineHeight: 1 }}>{value}</p>
      <div style={{ height: 3, borderRadius: 99, background: bg, marginTop: 5 }}>
        <div style={{ width: '68%', height: '100%', borderRadius: 99, background: tone }} />
      </div>
    </div>
  );
}

const cropText: React.CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

function Cell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span style={{ ...cropText, display: 'block', lineHeight: 1.15, ...style }}>{children}</span>;
}

function CustomerSaasShell({ children, slug, brand, title, subtitle, theme, nav, action, isMobile }: {
  children: React.ReactNode;
  slug: string;
  brand: string;
  title: string;
  subtitle: string;
  theme: BackOfficeTheme;
  nav: string[];
  action: string;
  isMobile?: boolean;
}) {
  return (
    <SaasFrame slug={slug} isMobile={isMobile}>
      <div style={{ height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'rgba(255,255,255,0.88)', borderBottom: '1px solid #E8E4DC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: theme.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 900 }}>AI</div>
            <div style={{ minWidth: 0 }}>
              <Cell style={{ fontSize: 11.5, fontWeight: 900, color: '#111' }}>{brand}</Cell>
              <Cell style={{ fontSize: 6.8, color: '#9B9489', marginTop: 3 }}>{subtitle}</Cell>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {nav.map((item, i) => (
              <span key={item} style={{ fontSize: 7, fontWeight: 800, color: i === 0 ? theme.accent : '#7C766E', whiteSpace: 'nowrap' }}>{item}</span>
            ))}
            <button style={{ height: 23, border: 'none', borderRadius: 7, background: theme.accent, color: '#fff', padding: '0 9px', fontSize: 6.8, fontWeight: 900 }}>{action}</button>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 9 }}>
            <div style={{ minWidth: 0 }}>
              <Cell style={{ fontSize: 18, fontWeight: 900, color: '#111', lineHeight: 1.05 }}>{title}</Cell>
              <Cell style={{ fontSize: 7.5, color: '#8A867D', marginTop: 5 }}>{subtitle}</Cell>
            </div>
            <UiPill tone={theme.accent} bg={theme.soft}>Mode IA active</UiPill>
          </div>
          {children}
        </div>
      </div>
    </SaasFrame>
  );
}

function SaasResto({ isMobile }: { isMobile?: boolean }) {
  const theme = { accent: '#10B981', soft: '#F0FDF4', bg: '#F9FAFB' };
  return (
    <CustomerSaasShell
      slug="nutrition.ozirus.ai/dashboard"
      brand="NutriFlow"
      title="Optimisez votre énergie aujourd'hui"
      subtitle="Intelligence Nutritionnelle · Analyse & Coaching"
      action="Ajouter"
      theme={theme}
      nav={['Dashboard', 'Planning', 'Analyses', 'IA Coach']}
      isMobile={isMobile}
    >
      <div style={{ height: 'calc(100% - 34px)', display: 'grid', gridTemplateColumns: '1fr 190px', gap: 10 }}>
        {/* MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          {/* TOP HERO STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 8 }}>
            <PlainCard style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)' }}>
              <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                  <circle cx="24" cy="24" r="21" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="132" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 24 24)" />
                </svg>
                <span style={{ position: 'absolute', fontSize: 10, fontWeight: 900 }}>70%</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 7.5, fontWeight: 800, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em', marginBottom: 2 }}>Calories</p>
                <p style={{ fontSize: 16, fontWeight: 900, lineHeight: 1 }}>1 450</p>
                <p style={{ fontSize: 8, fontWeight: 600, opacity: 0.7, marginTop: 2 }}>/ 2 100 kcal</p>
              </div>
            </PlainCard>
            
            <PlainCard style={{ padding: 10, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 7.5, color: '#6B7280', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Eau</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20, marginBottom: 4 }}>
                {[35, 50, 65, 30, 85, 55, 70].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 4 ? theme.accent : '#D1FAE5', borderRadius: 2 }} />
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 900, color: '#111827', margin: 0 }}>1.8L <span style={{ fontSize: 7.5, color: '#10B981' }}>+12%</span></p>
            </PlainCard>

            <PlainCard style={{ padding: 10, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 7.5, color: '#6B7280', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Protéines</p>
              <div style={{ height: 5, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden', margin: '6px 0' }}>
                <div style={{ width: '65%', height: '100%', background: '#10B981', borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: 10, fontWeight: 900, color: '#111827', margin: 0 }}>92g <span style={{ fontSize: 7.5, color: '#6B7280' }}>/ 140g</span></p>
            </PlainCard>
          </div>

          {/* PLANNING LIST */}
          <PlainCard style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <h4 style={{ fontSize: 9.5, fontWeight: 800, color: '#111827', margin: 0 }}>PLANNING</h4>
              <div style={{ display: 'flex', gap: 3 }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: i === 3 ? theme.accent : 'transparent', color: i === 3 ? '#fff' : '#9CA3AF', fontSize: 7.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
              {[
                { time: '08:00', name: 'Bowl Avoine', cal: '320', status: 'OK', color: '#10B981' },
                { time: '13:00', name: 'Poulet Quinoa', cal: '580', status: 'OK', color: '#10B981' },
                { time: '16:30', name: 'Amandes & Pomme', cal: '150', status: 'Wait', color: '#F59E0B' },
                { time: '20:00', name: 'Poisson Vapeur', cal: '420', status: 'IA', color: '#3B82F6' },
                { time: '22:00', name: 'Infusion', cal: '0', status: 'IA', color: '#6366F1' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 45px 55px', gap: 8, padding: '4px 0', borderBottom: i === 4 ? 'none' : '1px solid #F3F4F6', alignItems: 'center' }}>
                  <Cell style={{ fontSize: 8.5, fontWeight: 700, color: '#9CA3AF' }}>{item.time}</Cell>
                  <Cell style={{ fontSize: 9, fontWeight: 800, color: '#111827' }}>{item.name}</Cell>
                  <Cell style={{ fontSize: 8.5, fontWeight: 700, color: '#374151' }}>{item.cal}k</Cell>
                  <span style={cropText}><UiPill tone={item.color} bg={item.color + '14'}>{item.status}</UiPill></span>
                </div>
              ))}
            </div>
          </PlainCard>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PlainCard style={{ padding: 10, background: '#111827', color: '#fff', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Zap size={10} color={theme.accent} />
              <p style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.02em' }}>IA INSIGHT</p>
            </div>
            <p style={{ fontSize: 8.5, lineHeight: 1.4, color: '#D1D5DB', fontWeight: 500, margin: 0 }}>
              "Apport en <span style={{ color: theme.accent, fontWeight: 800 }}>magnésium</span> faible. Ajoutez des épinards au dîner."
            </p>
          </PlainCard>

          <PlainCard style={{ flex: 1, padding: 10, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 8, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>Courses</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {[
                { n: 'Poulet', q: '800g', c: true },
                { n: 'Quinoa', q: '500g', c: true },
                { n: 'Avocats', q: '3 pcs', c: false },
                { n: 'Épinards', q: '200g', c: false },
                { n: 'Saumon', q: '400g', c: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, border: `1px solid ${item.c ? theme.accent : '#D1D5DB'}`, background: item.c ? theme.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.c && <CheckCircle2 size={7} color="#fff" />}
                  </div>
                  <Cell style={{ fontSize: 9, fontWeight: 600, color: item.c ? '#9CA3AF' : '#374151', textDecoration: item.c ? 'line-through' : 'none' }}>{item.n}</Cell>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 'auto', width: '100%', padding: '6px', borderRadius: 6, background: theme.soft, border: `1px solid ${theme.accent}`, color: theme.accent, fontSize: 8.5, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Download size={9} /> PDF
            </button>
          </PlainCard>
        </div>
      </div>
    </CustomerSaasShell>
  );
}

function BlurredImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: style?.objectPosition,
          filter: loaded ? 'none' : 'blur(20px)',
          transition: 'filter 0.6s ease-in-out',
          display: 'block',
        }}
      />
      {!loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.05)',
          backdropFilter: 'blur(20px)',
          zIndex: 1
        }} />
      )}
    </div>
  );
}

function SaasEcom({ isMobile }: { isMobile?: boolean }) {
  const theme = { accent: '#315BFF', soft: '#E9EEFF', bg: '#F6F7FB' };
  return (
    <BackOfficeShell
      slug="shop.ozirus.app/catalog"
      title="Catalogue boutique"
      meta="Maison Kora · 214 produits · stock synchronise"
      action="Produit"
      theme={theme}
      sideNote={{ label: 'Stock', value: '214 refs', hint: '7 alertes' }}
      nav={[
        { label: 'Catalogue', icon: <Package size={8} />, active: true },
        { label: 'Commandes', icon: <ShoppingBag size={8} /> },
        { label: 'Clients', icon: <Users size={8} /> },
        { label: 'Livraison', icon: <Truck size={8} /> },
        { label: 'Promos', icon: <Percent size={8} /> },
      ]}
      isMobile={isMobile}
    >
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '166px 1fr', gap: 8 }}>
        <PlainCard style={{ overflow: 'hidden' }}>
          <BlurredImage src="/dev-assets/ankara-dress.png" alt="" style={{ width: '100%', height: 146, objectPosition: 'center 43%' }} />
          <div style={{ padding: 8 }}>
            <Cell style={{ fontSize: 9.8, fontWeight: 900, color: '#151515' }}>Robe Ankara Premium</Cell>
            <Cell style={{ fontSize: 7, color: '#8A867D', marginTop: 3 }}>Robe portefeuille midi, coton wax double, manches evasees.</Cell>
            <Cell style={{ fontSize: 7.2, color: theme.accent, fontWeight: 900, marginTop: 5 }}>18 500 FCFA · 42 pieces</Cell>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              {['S', 'M', 'L', 'XL'].map((s, i) => <UiPill key={s} tone={i === 1 ? theme.accent : '#5B5852'} bg={i === 1 ? theme.soft : '#F4F3EF'}>{s}</UiPill>)}
            </div>
          </div>
        </PlainCard>
        <div style={{ display: 'grid', gridTemplateRows: '52px 1fr', gap: 7 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
            <MiniMetric label="Ventes du jour" value="84" tone={theme.accent} bg={theme.soft} />
            <MiniMetric label="Paniers ouverts" value="23" tone="#B45309" bg="#FEF3C7" />
            <MiniMetric label="Livraisons" value="31" tone="#15803D" bg="#DFF3E6" />
          </div>
          <PlainCard style={{ padding: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 72px 54px 58px', gap: 8, color: '#A6A19A', fontSize: 6.3, fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>
              <Cell>Produit</Cell><Cell>Stock</Cell><Cell>Prix</Cell><Cell>Statut</Cell>
            </div>
            {[
              ['Robe Ankara Premium', 'Coton wax · robe midi · manches evasees', '42 pcs', '18 500 F', 'Publie', theme.accent],
              ['Sandales cuir', 'Cuir local · semelle cousue · marron', '18 pcs', '24 000 F', 'Publie', '#15803D'],
              ['Sac tresse', 'Raphia naturel · doublure coton · zip', '9 pcs', '12 000 F', 'Faible', '#B45309'],
              ['Chemise wax', 'Coupe droite · manches courtes · homme', '0 pcs', '16 000 F', 'Masque', '#64748B'],
              ['Boucles laiton', 'Finition mate · lot artisanal · dore', '27 pcs', '7 500 F', 'Publie', '#15803D'],
              ['Pantalon lin', 'Lin beige · taille haute · coupe ample', '14 pcs', '21 000 F', 'Publie', '#315BFF'],
              ['Foulard soie', 'Motif floral · 70x70 · bord roule', '33 pcs', '8 500 F', 'Publie', '#15803D'],
              ['Boubou court', 'Broderie col · coton epais · unisexe', '6 pcs', '29 000 F', 'Faible', '#B45309'],
              ['Kimono court', 'Tissu leger · ceinture assortie', '11 pcs', '19 000 F', 'Publie', '#315BFF'],
              ['Top bustier', 'Wax rouge · dos elastique', '25 pcs', '9 500 F', 'Publie', '#15803D'],
              ['Jupe portefeuille', 'Longueur genou · lien cote', '16 pcs', '14 000 F', 'Publie', '#15803D'],
            ].map(([p, desc, stock, price, status, color]) => (
              <div key={p} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 72px 54px 58px', gap: 8, alignItems: 'center', padding: '3px 0', borderTop: '1px solid #EEF0F5', minHeight: 21 }}>
                <div style={{ minWidth: 0 }}>
                  <Cell style={{ fontSize: 7.4, fontWeight: 900, color: '#171717' }}>{p}</Cell>
                  <Cell style={{ fontSize: 6.2, color: '#8A867D', marginTop: 2 }}>{desc}</Cell>
                </div>
                <Cell style={{ fontSize: 6.9, color: '#6B6760' }}>{stock}</Cell>
                <Cell style={{ fontSize: 6.9, fontWeight: 900, color: '#171717' }}>{price}</Cell>
                <span style={cropText}><UiPill tone={color} bg={color + '14'}>{status}</UiPill></span>
              </div>
            ))}
          </PlainCard>
        </div>
      </div>
    </BackOfficeShell>
  );
}

function SaasHealth({ isMobile }: { isMobile?: boolean }) {
  const theme = { accent: '#0F8A83', soft: '#DDF5F2', bg: '#F4FAF8' };
  return (
    <CustomerSaasShell
      slug="careai.ozirus.app/checkin"
      brand="CareAI"
      title="Ton suivi sante personnalise"
      subtitle="Assistant bien-etre IA · symptomes, habitudes, rappels et conseils"
      action="Analyser"
      theme={theme}
      nav={['Check-in', 'Plan', 'Rappels', 'Journal']}
      isMobile={isMobile}
    >
      <div style={{ height: 'calc(100% - 34px)', display: 'grid', gridTemplateColumns: '154px 1fr 172px', gap: 8 }}>
        <PlainCard style={{ padding: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: theme.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={15} color={theme.accent} />
            </div>
            <div style={{ minWidth: 0 }}>
              <Cell style={{ fontSize: 9.2, fontWeight: 900, color: '#171717' }}>Score bien-etre</Cell>
              <Cell style={{ fontSize: 6.5, color: '#8C948F', marginTop: 2 }}>Mis a jour ce matin</Cell>
            </div>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: theme.accent, lineHeight: 1 }}>82</p>
          <Cell style={{ fontSize: 6.8, color: '#8A867D', marginTop: 3 }}>Sommeil stable, stress modere, hydratation faible.</Cell>
          <div style={{ height: 1, background: '#E4ECE9', margin: '8px 0' }} />
          {[
            ['Sommeil', '7h20'],
            ['Stress', 'Moyen'],
            ['Eau', '1.1L'],
            ['Marche', '6 240'],
            ['Rythme', '74 bpm'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'grid', gridTemplateColumns: '1fr 42px', gap: 8, padding: '3px 0', borderTop: '1px solid #EEF3F1', minHeight: 18 }}>
              <Cell style={{ fontSize: 6.8, color: '#8A867D' }}>{l}</Cell>
              <Cell style={{ fontSize: 7.2, fontWeight: 900, color: '#171717' }}>{v}</Cell>
            </div>
          ))}
        </PlainCard>
        <PlainCard style={{ padding: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr) 58px 58px', gap: 7, fontSize: 6.2, color: '#A6A19A', fontWeight: 900, textTransform: 'uppercase', marginBottom: 4 }}>
            <Cell>Moment</Cell><Cell>Insight IA</Cell><Cell>Impact</Cell><Cell>Action</Cell>
          </div>
          {[
            ['Matin', 'Hydratation sous objectif depuis 3 jours', 'Energie', 'Boire 500ml', '#B45309'],
            ['Midi', 'Repas riche en sel detecte dans le journal', 'Tension', 'Allege soir', '#B45309'],
            ['Apres-midi', 'Pas de pause active depuis 4h', 'Stress', '5 min marche', theme.accent],
            ['Soir', 'Heure de coucher ideale entre 22h30 et 23h', 'Sommeil', 'Rappel 22h', '#15803D'],
            ['Demain', 'Risque fatigue si sommeil < 7h', 'Focus', 'Plan leger', '#315BFF'],
            ['Semaine', 'Objectif marche atteint 4 jours sur 7', 'Cardio', 'Garder rythme', '#15803D'],
          ].map(([time, text, impact, action, color]) => (
            <div key={time} style={{ display: 'grid', gridTemplateColumns: '58px minmax(0,1fr) 52px 54px', gap: 6, padding: '2px 0', borderTop: '1px solid #EDF1EF', minHeight: 17, alignItems: 'center' }}>
              <Cell style={{ fontSize: 6.7, color: theme.accent, fontWeight: 900 }}>{time}</Cell>
              <div style={{ minWidth: 0 }}>
                <Cell style={{ fontSize: 6.8, color: '#403D38', fontWeight: 800 }}>{text}</Cell>
              </div>
              <Cell style={{ fontSize: 6.3, color: '#8A867D' }}>{impact}</Cell>
              <span style={cropText}><UiPill tone={color} bg={color + '14'}>{action}</UiPill></span>
            </div>
          ))}
        </PlainCard>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 112px', gap: 8, minWidth: 0 }}>
        <PlainCard style={{ padding: 8 }}>
          <Cell style={{ fontSize: 7.2, color: '#9B9489', fontWeight: 900, textTransform: 'uppercase', marginBottom: 6 }}>Plan perso</Cell>
          {[
            ['Respiration', '3 min · 14h00'],
            ['Eau', '500ml · avant 15h'],
            ['Sommeil', 'Mode calme 22h'],
          ].map(([name, detail]) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', padding: '4px 0', borderTop: '1px solid #EDF1EF', minHeight: 24 }}>
              <Cell style={{ fontSize: 7.2, fontWeight: 900, color: '#171717' }}>{name}</Cell>
              <Cell style={{ fontSize: 6.2, color: '#8A867D', marginTop: 1 }}>{detail}</Cell>
            </div>
          ))}
        </PlainCard>
        <PlainCard style={{ padding: 8, background: '#10201E', borderColor: '#10201E', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ minWidth: 0 }}>
              <Cell style={{ fontSize: 8.4, fontWeight: 900, color: '#fff' }}>Chat vocal IA</Cell>
              <Cell style={{ fontSize: 6.2, color: 'rgba(255,255,255,0.54)', marginTop: 2 }}>Modal ouverte · écoute active</Cell>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: 99, background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={12} color="#fff" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '30px minmax(0,1fr)', gap: 7, alignItems: 'center', marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={13} color="#7DE3DA" />
            </div>
            <div style={{ minWidth: 0 }}>
              <Cell style={{ fontSize: 7.4, color: '#fff', fontWeight: 800 }}>“Je me sens fatigue apres midi”</Cell>
              <Cell style={{ fontSize: 6.2, color: 'rgba(255,255,255,0.48)', marginTop: 2 }}>Transcription en direct</Cell>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <UiPill tone="#7DE3DA" bg="rgba(125,227,218,0.14)">Analyser fatigue</UiPill>
            <UiPill tone="#fff" bg="rgba(255,255,255,0.11)">Plan 5 min</UiPill>
          </div>
        </PlainCard>
        </div>
      </div>
    </CustomerSaasShell>
  );
}

function SaasImmo({ isMobile }: { isMobile?: boolean }) {
  const theme = { accent: '#2F7D55', soft: '#E8F5EC', bg: '#F7FAF6' };
  return (
    <BackOfficeShell
      slug="immo.ozirus.app/properties"
      title="Gestion locative"
      meta="Agence Akwa · Portefeuille Douala"
      action="Bien"
      theme={theme}
      sideNote={{ label: 'Visites', value: '6 RDV', hint: '3 confirmes' }}
      nav={[
        { label: 'Biens', icon: <Hotel size={8} />, active: true },
        { label: 'Visites', icon: <Calendar size={8} /> },
        { label: 'Leads', icon: <Users size={8} /> },
        { label: 'Baux', icon: <ClipboardList size={8} /> },
        { label: 'Loyers', icon: <DollarSign size={8} /> },
      ]}
      isMobile={isMobile}
    >
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '208px 1fr', gap: 8 }}>
        <PlainCard style={{ overflow: 'hidden' }}>
          <BlurredImage src="/dev-assets/apartment-living.png" alt="" style={{ width: '100%', height: 122 }} />
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
              <div>
                <p style={{ fontSize: 10.2, fontWeight: 900, color: '#171717' }}>F3 Bonapriso</p>
                <p style={{ fontSize: 7, color: '#8A867D', marginTop: 3 }}>2 chambres · balcon · parking</p>
              </div>
              <p style={{ fontSize: 9.4, fontWeight: 900, color: theme.accent }}>250K FCFA/mois</p>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
              <UiPill tone={theme.accent} bg={theme.soft}>Disponible</UiPill>
              <UiPill>3 visites</UiPill>
              <UiPill>Video 360</UiPill>
            </div>
          </div>
        </PlainCard>
        <div style={{ display: 'grid', gridTemplateRows: '52px 1fr', gap: 7 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
            <MiniMetric label="Biens actifs" value="47" tone={theme.accent} bg={theme.soft} />
            <MiniMetric label="Occupation" value="91%" tone="#15803D" bg="#DFF3E6" />
            <MiniMetric label="Impayes" value="5" tone="#B45309" bg="#FEF3C7" />
          </div>
          <PlainCard style={{ padding: 8 }}>
            <p style={{ fontSize: 7.2, color: '#9B9489', fontWeight: 900, textTransform: 'uppercase', marginBottom: 6 }}>Pipeline visites</p>
            {[
              ['10:00', 'M. Talla', 'F3 Bonapriso · 2 chambres', 'Confirme', theme.accent],
              ['11:30', 'Grace Mballa', 'Studio Melen · meuble', 'A rappeler', '#B45309'],
              ['15:00', 'Ibrahima Sow', 'Commerce Akwa · 38m2', 'Dossier recu', '#315BFF'],
              ['17:15', 'Mireille Foka', 'Villa Odza · jardin', 'Visite 360', '#64748B'],
              ['18:00', 'Claudine Bika', 'F2 Bali · balcon', 'Option pose', '#2F7D55'],
              ['18:45', 'Roger Fongang', 'Duplex Makepe · garage', 'Garant demande', '#B45309'],
              ['19:20', 'Aicha Konate', 'Studio Bonamoussadi', 'Message envoye', '#315BFF'],
              ['20:00', 'Paul Ngono', 'F4 Deido · vue ville', 'A qualifier', '#64748B'],
              ['20:30', 'Linda Tamo', 'Bureau Akwa · 62m2', 'Prix envoye', '#2F7D55'],
              ['21:00', 'Yvan Etoundi', 'Villa Logpom · piscine', 'Relance J+1', '#B45309'],
            ].map(([h, name, bien, status, color]) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '38px minmax(0,1fr) 80px 62px', gap: 7, alignItems: 'center', padding: '4px 0', borderTop: '1px solid #EDF0EA', minHeight: 21 }}>
                <span style={{ fontSize: 7.2, fontWeight: 900, color }}>{h}</span>
                <span style={{ ...cropText, fontSize: 7.6, fontWeight: 900, color: '#171717' }}>{name}</span>
                <span style={{ ...cropText, fontSize: 6.8, color: '#8A867D' }}>{bien}</span>
                <span style={cropText}><UiPill tone={color} bg={color + '14'}>{status}</UiPill></span>
              </div>
            ))}
          </PlainCard>
        </div>
      </div>
    </BackOfficeShell>
  );
}

function SaasRH({ isMobile }: { isMobile?: boolean }) {
  const theme = { accent: '#6B4DE6', soft: '#EEEAFE', bg: '#F8F7FB' };
  return (
    <BackOfficeShell
      slug="rh.ozirus.app/payroll"
      title="Paie & presence"
      meta="Mai 2026 · 48 employes · validation finale"
      action="Valider"
      theme={theme}
      sideNote={{ label: 'Paie', value: '42 pretes', hint: '6 a verifier' }}
      nav={[
        { label: 'Paie', icon: <DollarSign size={8} />, active: true },
        { label: 'Equipe', icon: <Users size={8} /> },
        { label: 'Conges', icon: <Calendar size={8} /> },
        { label: 'Presence', icon: <Activity size={8} /> },
        { label: 'Contrats', icon: <ClipboardList size={8} /> },
      ]}
      isMobile={isMobile}
    >
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 154px', gap: 8 }}>
        <PlainCard style={{ padding: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 64px 68px 58px', gap: 8, color: '#A6A19A', fontSize: 6.3, fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>
            <span>Employe</span><span>Presence</span><span>Net</span><span>Statut</span>
          </div>
          {[
            ['Thierry Ondoa', 'Dev senior · prime astreinte', '22/22 j', '350 000 F', 'Pret', '#15803D'],
            ['Claudine Bika', 'Commerciale · commission incluse', '20/22 j', '220 000 F', 'Pret', '#15803D'],
            ['Roger Fongang', 'Comptable · absence justifiee', '18/22 j', '280 000 F', 'Verifier', '#B45309'],
            ['Nadege Ateba', 'RH manager · avance deduite', '22/22 j', '310 000 F', 'Pret', '#15803D'],
            ['Alain Mboa', 'Support · heures supp. 6h', '21/22 j', '180 000 F', 'Pret', '#15803D'],
            ['Fatou Diallo', 'Assistante · transport ajoute', '22/22 j', '160 000 F', 'Pret', '#15803D'],
            ['Bruno Tamba', 'Logistique · retenue materiel', '19/22 j', '195 000 F', 'Verifier', '#B45309'],
            ['Aline Simo', 'Designer · bonus projet', '22/22 j', '260 000 F', 'Pret', '#15803D'],
            ['Jean Nsame', 'Technicien · panier repas', '22/22 j', '175 000 F', 'Pret', '#15803D'],
            ['Mireille Foka', 'Finance · prime cloture', '21/22 j', '300 000 F', 'Pret', '#15803D'],
            ['Kevin Meli', 'Stagiaire · prorata mois', '15/22 j', '90 000 F', 'Verifier', '#B45309'],
          ].map(([n, p, pres, net, st, color]) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 64px 68px 58px', gap: 8, alignItems: 'center', padding: '4px 0', borderTop: '1px solid #ECE9F5', minHeight: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: 99, background: theme.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.accent, fontSize: 6.2, fontWeight: 900, flexShrink: 0 }}>{n.split(' ').map(x => x[0]).join('')}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ ...cropText, fontSize: 7.6, fontWeight: 900, color: '#171717' }}>{n}</p>
                  <p style={{ ...cropText, fontSize: 6.3, color: '#8A867D', marginTop: 1 }}>{p}</p>
                </div>
              </div>
              <span style={{ ...cropText, fontSize: 7.1, color: '#6B6760' }}>{pres}</span>
              <span style={{ ...cropText, fontSize: 7.1, fontWeight: 900, color: '#171717' }}>{net}</span>
              <span style={cropText}><UiPill tone={color} bg={color + '14'}>{st}</UiPill></span>
            </div>
          ))}
        </PlainCard>
        <PlainCard style={{ padding: 8, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: 7.2, fontWeight: 900, color: '#A6A19A', textTransform: 'uppercase', marginBottom: 8 }}>A payer</p>
          <p style={{ fontSize: 23, fontWeight: 900, color: '#171717', lineHeight: 1 }}>12,4M</p>
          <p style={{ fontSize: 7, color: '#8A867D', marginTop: 3 }}>FCFA net total</p>
          <div style={{ height: 1, background: '#ECE9F5', margin: '9px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <UiPill tone={theme.accent} bg={theme.soft}>42 fiches pretes</UiPill>
            <UiPill tone="#B45309" bg="#FEF3C7">6 a verifier</UiPill>
            <UiPill>Virement vendredi</UiPill>
          </div>
          <button style={{ marginTop: 'auto', width: '100%', height: 24, border: 'none', borderRadius: 6, background: theme.accent, color: '#fff', fontSize: 6.8, fontWeight: 900, textAlign: 'left', padding: '0 9px' }}>Generer les bulletins</button>
        </PlainCard>
      </div>
    </BackOfficeShell>
  );
}

const SAAS_LIST = [
  { id: 'mealai', label: 'MealAI', sub: 'Assistant nutrition IA', el: (isMobile: boolean) => <SaasResto isMobile={isMobile} /> },
  { id: 'ecom', label: 'E-commerce', sub: 'Boutique en ligne', el: (isMobile: boolean) => <SaasEcom isMobile={isMobile} /> },
  { id: 'careai', label: 'CareAI', sub: 'Suivi santé personnel IA', el: (isMobile: boolean) => <SaasHealth isMobile={isMobile} /> },
  { id: 'immo', label: 'Immobilier', sub: 'Gestion locative', el: (isMobile: boolean) => <SaasImmo isMobile={isMobile} /> },
  { id: 'rh', label: 'RH & Paie', sub: 'Ressources humaines', el: (isMobile: boolean) => <SaasRH isMobile={isMobile} /> },
];

const APPS = [
  { id: 'fintech', label: 'Fintech — NeoBank',        sub: 'Application bancaire mobile',   color: '#0A84FF', light: true, screen: <NeoBankApp /> },
  { id: 'fitness', label: 'Fitness — WorkoutAI',      sub: 'Coach sportif intelligent',     color: '#FF9F0A', light: false, screen: <FitnessApp /> },
  { id: 'food',    label: 'Food Delivery — QuickEat', sub: 'Livraison de repas locale',      color: '#FF5A5F', light: true,  screen: <FoodApp /> },
  { id: 'school',  label: 'Gestion scolaire',          sub: 'SaaS établissements scolaires', color: '#5856D6', light: true, screen: <SchoolApp /> },
  { id: 'clinic',  label: 'Clinique & Santé',           sub: 'Dossier patient & RDV',         color: '#00A7A7', light: true, screen: <ClinicApp /> },
];


function MockupsShowcase() {
  const [phoneIdx, setPhoneIdx] = React.useState(0);
  const [saasIdx, setSaasIdx] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const NavBtn = ({ dir, onClick }: { dir: '‹' | '›'; onClick: () => void }) => (
    <button onClick={onClick}
      style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #EDEAFF', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#7967FF', transition: 'background 0.15s', flexShrink: 0 }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F0EEFF')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>{dir}</button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.28 }}
      style={{ marginTop: 64, width: '100%' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? 64 : 48, alignItems: 'center', width: '100%' }}>

        {/* ── MOBILE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ marginBottom: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 4 }}>App Mobile</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111', fontFamily: 'Clash Display, sans-serif' }}>{APPS[phoneIdx].label}</p>
            <p style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{APPS[phoneIdx].sub}</p>
          </div>
          <IPhone light={APPS[phoneIdx].light}>{APPS[phoneIdx].screen}</IPhone>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <NavBtn dir="‹" onClick={() => setPhoneIdx(i => (i - 1 + APPS.length) % APPS.length)} />
            <div style={{ display: 'flex', gap: 6 }}>
              {APPS.map((app, i) => (
                <button key={i} onClick={() => setPhoneIdx(i)}
                  style={{ width: i === phoneIdx ? 20 : 8, height: 8, borderRadius: 99, background: i === phoneIdx ? app.color : '#EDEAFF', border: 'none', cursor: 'pointer', transition: 'all 0.25s', padding: 0 }} />
              ))}
            </div>
            <NavBtn dir="›" onClick={() => setPhoneIdx(i => (i + 1) % APPS.length)} />
          </div>
        </div>

        {/* ── SAAS 5 secteurs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minWidth: 0 }}>
          <div style={{ marginBottom: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 4 }}>
              SaaS — {SAAS_LIST[saasIdx].label}
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111', fontFamily: 'Clash Display, sans-serif' }}>{SAAS_LIST[saasIdx].sub}</p>
          </div>
          <div style={{ width: '100%', minWidth: 0 }}>
            {SAAS_LIST[saasIdx].el(isMobile)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <NavBtn dir="‹" onClick={() => setSaasIdx(i => (i - 1 + SAAS_LIST.length) % SAAS_LIST.length)} />
            <div style={{ display: 'flex', gap: 6 }}>
              {SAAS_LIST.map((s, i) => (
                <button key={i} onClick={() => setSaasIdx(i)}
                  style={{ width: i === saasIdx ? 20 : 8, height: 8, borderRadius: 99, background: i === saasIdx ? '#7967FF' : '#EDEAFF', border: 'none', cursor: 'pointer', transition: 'all 0.25s', padding: 0 }} />
              ))}
            </div>
            <NavBtn dir="›" onClick={() => setSaasIdx(i => (i + 1) % SAAS_LIST.length)} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

/* ─── StatsGrid ─────────────────────────────────────── */
function StatsGrid() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return (
    <div style={{ borderTop: '1.5px solid #F0EEFF', borderBottom: '1.5px solid #F0EEFF', background: '#FAFAFA' }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto',
        display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        padding: '0 24px',
      }}>
        {[
          { v: '6–12', u: 'sem', l: 'pour un MVP en production' },
          { v: '100%', u: '', l: 'propriété code source & stores' },
          { v: '3', u: 'mois', l: 'de support post-lancement inclus' },
          { v: '2', u: 'sem', l: 'entre chaque démo produit' },
        ].map(({ v, u, l }, i) => (
          <div key={v + l} style={{ padding: '40px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid #E8E6FF' : 'none' }}>
            <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 36, color: '#7967FF', lineHeight: 1 }}>
              {v}<span style={{ fontSize: 16, fontWeight: 500, color: '#A78BFA', marginLeft: 3 }}>{u}</span>
            </p>
            <p style={{ fontSize: 13, color: '#777', marginTop: 8, lineHeight: 1.5 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
export default function DevPage() {
  return (
    <main style={{ background: '#fff', color: '#111', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}><DotGrid /></div>
        <div aria-hidden style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px', textAlign: 'center' }}>

          <motion.h1 {...up(0)} style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2.8rem, 7vw, 5.8rem)', lineHeight: 0.97, letterSpacing: '-0.025em', color: '#111', margin: '0 auto' }}>
            On construit le produit
            <br />
            <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              que vos utilisateurs attendent.
            </span>
          </motion.h1>

          <motion.p {...up(0.08)} style={{ maxWidth: 560, marginTop: 24, fontSize: 18, lineHeight: 1.75, color: '#555', margin: '24px auto 0' }}>
            Applications mobiles iOS & Android, plateformes SaaS, interfaces métier — conçus avec rigueur, livrés en sprints visibles, propriété totale à vous.
          </motion.p>

          <motion.div {...up(0.2)} style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#offres" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7967FF', color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(121,103,255,0.3)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
              Voir les offres <ArrowRight size={16} />
            </a>
            <a href="#processus" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #E0DEFF', color: '#555', padding: '14px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7967FF'; e.currentTarget.style.color = '#7967FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E0DEFF'; e.currentTarget.style.color = '#555'; }}>
              Comment on travaille
            </a>
          </motion.div>

          <MockupsShowcase />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────── */}
      <StatsGrid />

      {/* ── OFFRES PANEL ─────────────────────── */}
      <section id="offres" style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>Nos offres</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Choisissez ce que{' '}
              <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                vous voulez construire.
              </span>
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginTop: 12 }}>Sélectionnez une offre pour voir le détail, la stack et comment on travaille.</p>
          </div>
          <OffersPanel />
        </div>
      </section>

      {/* ── SECTEURS ─────────────────────────── */}
      <section style={{ padding: '0 24px 96px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ background: '#FAFAFA', border: '1.5px solid #EDEAFF', borderRadius: 20, padding: '36px 40px' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 20 }}>Secteurs où on a déjà livré :</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {SECTORS_FIT.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fff', border: '1px solid #EDEAFF', borderRadius: 12 }}>
                    <div style={{ width: 32, height: 32, background: '#F0EEFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="#7967FF" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{s.label}</p>
                      <p style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{s.fit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ─────────────────────────── */}
      <section id="processus" style={{ position: 'relative', overflow: 'hidden', padding: '96px 24px', background: '#FAFAFA' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}><DotGrid /></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>Notre processus</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Vous savez ce qui se passe.{' '}
              <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                À chaque étape.
              </span>
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginTop: 12 }}>Pas de boîte noire. Pas de "ça avance". Chaque sprint = une démo = une décision.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {PROCESS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.n} {...upView(i * 0.08)}
                  style={{ background: '#fff', border: '1.5px solid #EDEAFF', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, background: '#7967FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 32, color: '#EDEAFF' }}>{s.n}</span>
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7967FF', marginTop: 20 }}>{s.week}</p>
                  <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 16, color: '#111', marginTop: 6 }}>{s.title}</p>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, marginTop: 8, flex: 1 }}>{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STACK ─────────────────────────────── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div {...upView()} style={{ background: 'linear-gradient(135deg, #7967FF 0%, #6654F0 100%)', borderRadius: 24, padding: 'clamp(36px, 5vw, 64px)' }}>
            <div style={{ maxWidth: 560, marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>Stack technique</p>
              <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', lineHeight: 1.1, color: '#fff' }}>
                Des technologies modernes, pas à la mode.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginTop: 12 }}>
                On choisit les outils selon votre besoin, pas selon les tendances. Chaque choix est justifié et documenté.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Mobile</p>
                {STACK_MOBILE.map(s => (
                  <div key={s.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ width: 28, height: 28, minWidth: 28, background: 'rgba(255,255,255,0.15)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{s.label[0]}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.label}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Web & SaaS</p>
                {STACK_WEB.map(s => (
                  <div key={s.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ width: 28, height: 28, minWidth: 28, background: 'rgba(255,255,255,0.15)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{s.label[0]}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.label}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Ce qu'on ne fait pas</p>
                {['WordPress ou no-code pour des apps critiques', 'Architecture non documentée', 'Accès infra gardés par nous', 'Code sans tests sur les parties critiques'].map(n => (
                  <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ width: 16, height: 16, minWidth: 16, borderRadius: '50%', background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, fontSize: 9, color: '#f87171', fontWeight: 700 }}>✕</span>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{n}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RÉALISATIONS ─────────────────────── */}
      <section id="realisations" style={{ padding: '0 24px 96px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 48px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>Réalisations</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Des produits en production, pas des maquettes.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {REALIZATIONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div key={r.title} {...upView(i * 0.08)}
                  style={{ background: '#fff', border: '1.5px solid #EDEAFF', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(121,103,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, background: '#F0EEFF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} color="#7967FF" />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#7967FF', background: '#F0EEFF', padding: '3px 10px', borderRadius: 99 }}>{r.tag}</span>
                  </div>
                  <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 16, color: '#111', marginBottom: 10 }}>{r.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F0EEFF', borderRadius: 9, padding: '9px 14px', marginBottom: 14 }}>
                    <TrendingUp size={14} color="#7967FF" />
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#7967FF' }}>{r.result}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{r.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── POURQUOI OZIRUS ──────────────────── */}
      <section style={{ padding: '96px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 48px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>Pourquoi Ozirus</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Pas une agence qui livre et disparaît.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title} {...upView(i * 0.07)}
                  style={{ background: '#fff', border: '1.5px solid #EDEAFF', borderRadius: 16, padding: 28 }}>
                  <div style={{ width: 44, height: 44, background: '#F0EEFF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#7967FF" />
                  </div>
                  <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 16, color: '#111', marginTop: 20 }}>{w.title}</p>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, marginTop: 8 }}>{w.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────── */}
      <section id="contact" style={{ position: 'relative', overflow: 'hidden', padding: '96px 24px' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}><DotGrid /></div>
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 16 }}>Démarrons</p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#111', marginBottom: 16 }}>
            Votre prochain produit commence par une conversation.
          </h2>
          <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 36px' }}>
            Décrivez votre idée, votre contexte et vos utilisateurs cibles. On revient avec une estimation et une approche claire — sans engagement.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <a href="mailto:contact.fotie@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7967FF', color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(121,103,255,0.25)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
              Démarrer un projet <ArrowRight size={16} />
            </a>
            <a href="https://wa.me/237694086571?text=Bonjour%20Ozirus%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20de%20d%C3%A9veloppement%20digital%20(App%20Mobile%2C%20SaaS%20ou%20Interface%20M%C3%A9tier)%20vu%20sur%20la%20page%20Dev." target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #25D366', color: '#25D366', padding: '14px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366'; }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Estimation gratuite', 'Réponse sous 24h', 'Sans engagement'].map(l => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888' }}>
                <CheckCircle2 size={13} color="#7967FF" /> {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer style={{ borderTop: '1.5px solid #F0EEFF', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 24, opacity: 0.5 }} />
            <span style={{ fontSize: 13, color: '#aaa' }}>© {new Date().getFullYear()} Ozirus Agency</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/produits-ia" style={{ color: '#aaa', textDecoration: 'none' }}>Produits IA</Link>
            <Link href="/formation-ia" style={{ color: '#aaa', textDecoration: 'none' }}>Formation</Link>
            <Link href="/terms" style={{ color: '#aaa', textDecoration: 'none' }}>Conditions</Link>
            <Link href="/privacy" style={{ color: '#aaa', textDecoration: 'none' }}>Confidentialité</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
