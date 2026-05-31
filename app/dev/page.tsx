'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SharedNav from '../../components/SharedNav';
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
    from: '1 500 000',
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
    from: '2 000 000',
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
    from: '800 000',
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
  const sx = bz, sy = bz, sw = W - bz * 2, sh = H - bz * 2;
  return (
    <div style={{ position: 'relative', width: W, height: H, flexShrink: 0 }}>
      {/* shadow */}
      <div style={{ position: 'absolute', inset: 6, borderRadius: R - 2, boxShadow: '0 40px 70px rgba(0,0,0,0.38), 0 10px 28px rgba(0,0,0,0.22)', zIndex: 0 }} />

      {/* screen content — zIndex 1, below chassis overlay */}
      <div style={{ position: 'absolute', top: sy, left: sx, width: sw, height: sh, borderRadius: sR, overflow: 'hidden', zIndex: 1 }}>
        {children}
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 96, height: 30, background: '#000', borderRadius: 99, zIndex: 20 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 52, zIndex: 19, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px 7px', pointerEvents: 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.3px', color: tc }}>9:41</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill={tc}><rect x="0" y="3" width="2.5" height="7" rx="1"/><rect x="3.5" y="2" width="2.5" height="8" rx="1"/><rect x="7" y="0" width="2.5" height="10" rx="1"/><rect x="10.5" y="1" width="2.5" height="8" rx="1" opacity="0.35"/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill={tc}><path d="M7 1.5C4.8 1.5 2.8 2.4 1.4 3.9L0 2.4C1.8.9 4.3 0 7 0s5.2.9 7 2.4L12.6 3.9C11.2 2.4 9.2 1.5 7 1.5zm0 3.5C5.6 5 4.3 5.6 3.4 6.6L2 5.1C3.3 3.8 5.1 3 7 3s3.7.8 5 2.1L10.6 6.6C9.7 5.6 8.4 5 7 5z"/><circle cx="7" cy="8.5" r="1.5"/></svg>
            <div style={{ width: 22, height: 11, border: `1.5px solid ${tc}`, borderRadius: 3, padding: 1.5, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '72%', height: '100%', background: tc, borderRadius: 1 }}/>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)', width: 90, height: 4, background: tc, borderRadius: 99, opacity: 0.22, zIndex: 20, pointerEvents: 'none' }}/>
      </div>

      {/* chassis SVG — evenodd punch-through: only the bezel ring is drawn, screen area is transparent */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} fill="none">
        <defs>
          <linearGradient id="chA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DADADA"/><stop offset="40%" stopColor="#B8B8B8"/><stop offset="100%" stopColor="#888"/>
          </linearGradient>
          <clipPath id="outerClip"><rect x="0" y="0" width={W} height={H} rx={R}/></clipPath>
        </defs>
        {/* bezel ring via evenodd — outer shape minus screen hole */}
        <path
          fillRule="evenodd"
          fill="url(#chA)"
          d={[
            `M${R} 1 L${W-R} 1 Q${W-1} 1 ${W-1} ${R} L${W-1} ${H-R} Q${W-1} ${H-1} ${W-R} ${H-1} L${R} ${H-1} Q1 ${H-1} 1 ${H-R} L1 ${R} Q1 1 ${R} 1 Z`,
            `M${sx+sR} ${sy} L${sx+sw-sR} ${sy} Q${sx+sw} ${sy} ${sx+sw} ${sy+sR} L${sx+sw} ${sy+sh-sR} Q${sx+sw} ${sy+sh} ${sx+sw-sR} ${sy+sh} L${sx+sR} ${sy+sh} Q${sx} ${sy+sh} ${sx} ${sy+sh-sR} L${sx} ${sy+sR} Q${sx} ${sy} ${sx+sR} ${sy} Z`,
          ].join(' ')}
        />
        {/* left highlight */}
        <rect x="1" y="1" width={bz+4} height={H-2} fill="rgba(255,255,255,0.28)" clipPath="url(#outerClip)"/>
        {/* right shadow */}
        <rect x={W-bz-5} y="1" width={bz+4} height={H-2} fill="rgba(0,0,0,0.15)" clipPath="url(#outerClip)"/>
        {/* outer stroke */}
        <rect x="1" y="1" width={W-2} height={H-2} rx={R} fill="none" stroke="#888" strokeWidth="0.8"/>
        {/* inner screen border */}
        <rect x={sx} y={sy} width={sw} height={sh} rx={sR} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1"/>
        {/* side buttons */}
        <rect x="-2" y="120" width="4" height="34" rx="2" fill="#B0B0B0" stroke="#909090" strokeWidth="0.5"/>
        <rect x="-2" y="168" width="4" height="56" rx="2" fill="#B0B0B0" stroke="#909090" strokeWidth="0.5"/>
        <rect x="-2" y="236" width="4" height="56" rx="2" fill="#B0B0B0" stroke="#909090" strokeWidth="0.5"/>
        <rect x={W-2} y="170" width="4" height="72" rx="2" fill="#B0B0B0" stroke="#909090" strokeWidth="0.5"/>
      </svg>
    </div>
  );
}

/* ══ APP 1 — NeoBank  dark navy + emerald ══ */
function NeoBankApp() {
  return (
    <div style={{ background: 'linear-gradient(160deg,#080C1A 0%,#0D1224 100%)', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', paddingTop: 52, overflow: 'hidden' }}>
      <div style={{ padding: '12px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Solde total</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1 }}>847 500<span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>FCFA</span></p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(52,211,153,0.15)', borderRadius: 99, padding: '3px 8px', marginTop: 5 }}>
            <TrendingUp size={9} color="#34d399" />
            <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700 }}>+4.2% ce mois</span>
          </div>
        </div>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#34d399,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', boxShadow: '0 0 0 3px rgba(52,211,153,0.2)' }}>KF</div>
      </div>
      <div style={{ margin: '4px 16px 14px', borderRadius: 22, padding: '18px 20px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(130deg,#1C3B5A 0%,#0F2540 55%,#071525 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.15) 0%,transparent 65%)' }}/>
        <div style={{ position: 'absolute', bottom: -25, left: -25, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle,rgba(121,103,255,0.12) 0%,transparent 65%)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative' }}>
          <div>
            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginBottom: 5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>NeoBank Visa Infinite</p>
            <div style={{ display: 'flex', gap: 7 }}>
              {['••••','••••','••••','4829'].map(g=><span key={g} style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.18em', fontWeight: 600 }}>{g}</span>)}
            </div>
          </div>
          <div style={{ position: 'relative', width: 40, height: 26 }}>
            <div style={{ position: 'absolute', left: 0, width: 26, height: 26, borderRadius: '50%', background: '#FBBF24', opacity: 0.92 }}/>
            <div style={{ position: 'absolute', left: 14, width: 26, height: 26, borderRadius: '50%', background: '#F97316', opacity: 0.88 }}/>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.07em' }}>KOFI MENSAH</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>07/28</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 16px 14px' }}>
        {[
          {ic:<Send size={15} color="#34d399"/>, bg:'rgba(52,211,153,0.12)', l:'Envoyer'},
          {ic:<ArrowDownLeft size={15} color="#60a5fa"/>, bg:'rgba(96,165,250,0.12)', l:'Recevoir'},
          {ic:<RefreshCcw size={15} color="#f472b6"/>, bg:'rgba(244,114,182,0.12)', l:'Recharger'},
          {ic:<MoreHorizontal size={15} color="#a78bfa"/>, bg:'rgba(167,139,250,0.12)', l:'Plus'},
        ].map(a=>(
          <div key={a.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>{a.ic}</div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{a.l}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.06)', borderBottom: 'none', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>Transactions récentes</p>
          <span style={{ fontSize: 9, color: '#34d399', fontWeight: 700 }}>Voir tout</span>
        </div>
        {[
          {ic:<ShoppingCart size={13} color="#60a5fa"/>, bg:'rgba(96,165,250,0.13)', n:'Mahima Supermarket', d:'Auj. 14:32', a:'-12 400', c:'#f87171'},
          {ic:<Banknote size={13} color="#34d399"/>, bg:'rgba(52,211,153,0.13)', n:'Virement — Agence', d:'Hier 09:15', a:'+250 000', c:'#34d399'},
          {ic:<Smartphone size={13} color="#fbbf24"/>, bg:'rgba(251,191,36,0.13)', n:'MTN Mobile Money', d:'22 Jan', a:'-5 000', c:'#f87171'},
          {ic:<Coffee size={13} color="#f472b6"/>, bg:'rgba(244,114,182,0.13)', n:'Café La Terrasse', d:'21 Jan', a:'-2 800', c:'#f87171'},
        ].map(t=>(
          <div key={t.n} style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.ic}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.n}</p>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.32)', marginTop: 1 }}>{t.d}</p>
            </div>
            <p style={{ fontSize: 11, fontWeight: 800, color: t.c, flexShrink: 0 }}>{t.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ APP 2 — WorkoutAI  charbon + orange ══ */
function FitnessApp() {
  return (
    <div style={{ background: '#0A0A0A', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', paddingTop: 52, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(155deg,#1C0800 0%,#2E1000 100%)', padding: '12px 18px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,146,60,0.22) 0%,transparent 65%)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Lun · Semaine 3</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Flame size={18} color="#fb923c" />
              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Push Day</p>
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#fb923c,#c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>A</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            {v:'1 240', l:'kcal', ic:<Flame size={10} color="#fb923c"/>, bd:'rgba(251,146,60,0.3)'},
            {v:'42', l:'min', ic:<Timer size={10} color="#60a5fa"/>, bd:'rgba(96,165,250,0.3)'},
            {v:'89', l:'bpm', ic:<Activity size={10} color="#f472b6"/>, bd:'rgba(244,114,182,0.3)'},
          ].map(s=>(
            <div key={s.l} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 13, padding: '8px 10px', border: `1px solid ${s.bd}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>{s.ic}<span style={{ fontSize: 7, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.l}</span></div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 18px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg,#fb923c,#f97316)', borderRadius: 99 }}/>
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.42)', fontWeight: 600, whiteSpace: 'nowrap' }}>3 / 5</span>
      </div>
      <div style={{ flex: 1, padding: '8px 14px', overflow: 'hidden' }}>
        {[
          {n:'Développé couché', s:'4×10', kg:'80 kg', done:true, ic:<Dumbbell size={13} color="#fff"/>},
          {n:'Pompes décline', s:'3×15', kg:'Corps', done:true, ic:<Activity size={13} color="#fff"/>},
          {n:'Élévations latérales', s:'3×12', kg:'12 kg', done:false, ic:<RotateCcw size={13} color="#fb923c"/>},
          {n:'Triceps poulie', s:'4×12', kg:'25 kg', done:false, ic:<ZapIcon size={13} color="#fb923c"/>},
        ].map(ex=>(
          <div key={ex.n} style={{ background: ex.done ? 'rgba(251,146,60,0.07)' : 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '10px 12px', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${ex.done ? 'rgba(251,146,60,0.18)' : 'rgba(255,255,255,0.05)'}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: ex.done ? 'linear-gradient(135deg,#fb923c,#c2410c)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ex.ic}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: ex.done ? 'rgba(255,255,255,0.4)' : '#fff', textDecoration: ex.done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.n}</p>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{ex.s} · {ex.kg}</p>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: ex.done ? 'linear-gradient(135deg,#fb923c,#c2410c)' : 'rgba(255,255,255,0.06)', border: ex.done ? 'none' : '1.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {ex.done && <CheckCircle2 size={13} color="#fff" strokeWidth={2.5}/>}
            </div>
          </div>
        ))}
        <div style={{ background: 'linear-gradient(135deg,#fb923c,#c2410c)', borderRadius: 14, padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 8px 28px rgba(251,146,60,0.38)' }}>
          <Dumbbell size={14} color="#fff"/>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Démarrer l'exercice 3</span>
          <ChevronRight size={14} color="#fff"/>
        </div>
      </div>
    </div>
  );
}

/* ══ APP 3 — QuickEat  blanc + coral ══ */
function FoodApp() {
  return (
    <div style={{ background: '#F7F7F8', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', paddingTop: 52, overflow: 'hidden' }}>
      <div style={{ background: '#fff', padding: '10px 16px 11px', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} color="#FF5A5F"/>
              <p style={{ fontSize: 9, color: '#aaa' }}>Livraison à</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>Bastos, Yaoundé</p>
              <ChevronDown size={12} color="#555"/>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFF0F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} color="#FF5A5F"/>
            </div>
            <div style={{ position: 'absolute', top: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#FF5A5F', border: '2px solid #fff' }}/>
          </div>
        </div>
        <div style={{ background: '#F5F5F7', borderRadius: 13, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={13} color="#bbb"/>
          <span style={{ fontSize: 11, color: '#ccc' }}>Restaurants, plats, cuisines…</span>
        </div>
      </div>
      <div style={{ margin: '11px 14px 0', background: 'linear-gradient(125deg,#FF5A5F 0%,#FF8C61 100%)', borderRadius: 20, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -35, right: -25, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <Flame size={10} color="rgba(255,255,255,0.9)"/>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Offre du soir</span>
        </div>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>Livraison offerte<br/>dès 5 000 FCFA</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.22)', borderRadius: 99, padding: '5px 12px' }}>
          <ShoppingCart size={10} color="#fff"/>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>Commander maintenant</span>
        </div>
      </div>
      <div style={{ padding: '11px 14px 8px', display: 'flex', gap: 10 }}>
        {[
          {ic:<UtensilsCrossed size={15} color="#fff"/>, bg:'#FF5A5F', l:'Grillades', on:true},
          {ic:<UtensilsCrossed size={15} color="#FF5A5F"/>, bg:'#FFF0F1', l:'Ndolé', on:false},
          {ic:<Pizza size={15} color="#7C6AF7"/>, bg:'#EEEAFF', l:'Pizza', on:false},
          {ic:<Beef size={15} color="#059669"/>, bg:'#ECFDF5', l:'Burgers', on:false},
        ].map(c=>(
          <div key={c.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: c.on ? '0 6px 18px rgba(255,90,95,0.35)' : 'none' }}>{c.ic}</div>
            <span style={{ fontSize: 9, fontWeight: c.on ? 700 : 400, color: c.on ? '#FF5A5F' : '#aaa' }}>{c.l}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '0 14px', overflow: 'hidden' }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#111', marginBottom: 10 }}>Populaires près de toi</p>
        {[
          {n:'Le Maquis du Coin', cat:'Cuisine locale', t:'20-30', r:'4.8', p:'2 500 F', bg:'linear-gradient(135deg,#FF5A5F,#FF8C61)', ic:<UtensilsCrossed size={18} color="#fff"/>},
          {n:'Pizza House Yaoundé', cat:'Pizza · Fast-food', t:'15-25', r:'4.6', p:'4 000 F', bg:'linear-gradient(135deg,#7C6AF7,#A78BFA)', ic:<Pizza size={18} color="#fff"/>},
          {n:'Chez Mama', cat:'Plats camerounais', t:'25-40', r:'4.9', p:'1 800 F', bg:'linear-gradient(135deg,#10b981,#059669)', ic:<UtensilsCrossed size={18} color="#fff"/>},
        ].map(r=>(
          <div key={r.n} style={{ display: 'flex', gap: 10, marginBottom: 9, alignItems: 'center', background: '#fff', borderRadius: 15, padding: '9px 11px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 50, height: 50, borderRadius: 13, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.14)' }}>{r.ic}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.n}</p>
              <p style={{ fontSize: 8, color: '#bbb', marginTop: 1 }}>{r.cat}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ClockIcon size={8} color="#ccc"/>
                  <span style={{ fontSize: 8, color: '#999' }}>{r.t} min</span>
                </div>
                <span style={{ fontSize: 8, color: '#FF5A5F', fontWeight: 700 }}>Dès {r.p}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
                  <StarIcon size={9} color="#FBBF24" fill="#FBBF24"/>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>{r.r}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ APP 4 — Gestion scolaire  violet clair ══ */
function SchoolApp() {
  return (
    <div style={{ background: '#F3F0FF', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', paddingTop: 52, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(130deg,#7C6AF7 0%,#5B4FE8 100%)', padding: '12px 18px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -35, right: -35, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>Établissement</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Collège Saint-Paul</p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={17} color="#fff"/>
            </div>
            <div style={{ position: 'absolute', top: 2, right: 2, width: 9, height: 9, borderRadius: '50%', background: '#fb923c', border: '2px solid #5B4FE8' }}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            {v:'342', l:'Élèves', ic:<Users size={11} color="#fff"/>},
            {v:'18', l:'Classes', ic:<GraduationCap size={11} color="#fff"/>},
            {v:'94%', l:'Présence', ic:<CheckCircle2 size={11} color="#fff"/>},
          ].map(s=>(
            <div key={s.l} style={{ flex: 1, background: 'rgba(255,255,255,0.13)', borderRadius: 13, padding: '8px 6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>{s.ic}</div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{s.v}</p>
              <p style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>Paiements récents</p>
          <span style={{ fontSize: 9, color: '#7C6AF7', fontWeight: 700 }}>Voir tout</span>
        </div>
        {[
          {n:'Kouassi Emmanuel', cl:'3ème A', a:'45 000 F', s:'Payé', sc:'#10b981', sb:'#ECFDF5', av:'KE', ac:'linear-gradient(135deg,#10b981,#059669)'},
          {n:'Fatima Moussa', cl:'6ème B', a:'45 000 F', s:'Partiel', sc:'#f59e0b', sb:'#FFFBEB', av:'FM', ac:'linear-gradient(135deg,#f59e0b,#d97706)'},
          {n:'David Ngono', cl:'4ème C', a:'45 000 F', s:'En attente', sc:'#ef4444', sb:'#FEF2F2', av:'DN', ac:'linear-gradient(135deg,#f87171,#ef4444)'},
          {n:'Aïssatou Baldé', cl:'5ème A', a:'45 000 F', s:'Payé', sc:'#10b981', sb:'#ECFDF5', av:'AB', ac:'linear-gradient(135deg,#7C6AF7,#5B4FE8)'},
        ].map(p=>(
          <div key={p.n} style={{ background: '#fff', borderRadius: 15, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 10px rgba(124,106,247,0.08)' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: p.ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{p.av}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.n}</p>
              <p style={{ fontSize: 8, color: '#bbb', marginTop: 1 }}>{p.cl}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#111' }}>{p.a}</p>
              <span style={{ fontSize: 8, fontWeight: 700, color: p.sc, background: p.sb, padding: '2px 7px', borderRadius: 99 }}>{p.s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ APP 5 — Clinique  blanc + teal ══ */
function ClinicApp() {
  return (
    <div style={{ background: '#F0FBFC', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', paddingTop: 52, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(130deg,#0891b2 0%,#0e7490 100%)', padding: '12px 18px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -25, right: -25, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>Médecin</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Dr. Amara Kouyaté</p>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={19} color="#fff" fill="rgba(255,255,255,0.4)"/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            {v:'12', l:'RDV auj.', ic:<ClockIcon size={10} color="#67e8f9"/>, bd:'rgba(103,232,249,0.3)'},
            {v:'8', l:'Consultés', ic:<CheckCircle2 size={10} color="#4ade80"/>, bd:'rgba(74,222,128,0.3)'},
            {v:'3', l:'En attente', ic:<Bell size={10} color="#fbbf24"/>, bd:'rgba(251,191,36,0.3)'},
          ].map(s=>(
            <div key={s.l} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '7px 6px', border: `1px solid ${s.bd}` }}>
              <div style={{ marginBottom: 3 }}>{s.ic}</div>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{s.v}</p>
              <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.48)', lineHeight: 1.3, marginTop: 1 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>Rendez-vous du jour</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#e0f9fe', borderRadius: 99, padding: '3px 8px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891b2' }}/>
            <span style={{ fontSize: 8, color: '#0891b2', fontWeight: 700 }}>4 restants</span>
          </div>
        </div>
        {[
          {n:'Marie Koumba', age:'34 ans', h:'09:00', mo:'Consultation générale', s:'Terminé', sc:'#10b981', sb:'#ECFDF5', av:'MK', ac:'linear-gradient(135deg,#10b981,#059669)'},
          {n:'Jean-Luc Biya', age:'52 ans', h:'10:30', mo:'Suivi tension artérielle', s:'En cours', sc:'#0891b2', sb:'#E0F9FE', av:'JB', ac:'linear-gradient(135deg,#0891b2,#0e7490)'},
          {n:'Awa Traoré', age:'28 ans', h:'11:15', mo:'Grossesse — Sem. 24', s:'Attente', sc:'#f59e0b', sb:'#FFFBEB', av:'AT', ac:'linear-gradient(135deg,#f59e0b,#d97706)'},
          {n:'Paul Keza', age:'67 ans', h:'14:00', mo:'Diabète type 2', s:'Attente', sc:'#f59e0b', sb:'#FFFBEB', av:'PK', ac:'linear-gradient(135deg,#a78bfa,#7c3aed)'},
        ].map(p=>(
          <div key={p.n} style={{ background: '#fff', borderRadius: 15, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 10px rgba(8,145,178,0.07)' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: p.ac, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{p.av}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.n}</p>
              <p style={{ fontSize: 8, color: '#aaa', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.age} · {p.mo}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#111' }}>{p.h}</p>
              <span style={{ fontSize: 8, fontWeight: 700, color: p.sc, background: p.sb, padding: '2px 6px', borderRadius: 99 }}>{p.s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ══ shared atoms — thème injecté ══════════════════════ */

function KpiCard({ icon, label, value, delta, ok, bg }: {
  icon: React.ReactNode; label: string; value: string;
  delta: string; ok: boolean; bg: string;
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <span style={{ fontSize: 8, fontWeight: 700, color: ok ? '#16a34a' : '#dc2626', background: ok ? '#f0fdf4' : '#fef2f2', padding: '1px 5px', borderRadius: 99 }}>{delta}</span>
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, color: '#111', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 8, color: '#999', fontWeight: 400 }}>{label}</p>
    </div>
  );
}

function SvgBar({ data, color, trackBg, labels }: { data: number[]; color: string; trackBg: string; labels: string[] }) {
  const max = Math.max(...data);
  const W = 400, H = 76, gap = 6;
  const bW = (W - gap * (data.length - 1)) / data.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 14}`} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bH = Math.max(4, (v / max) * H);
        const x = i * (bW + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - bH} width={bW} height={bH} rx={4}
              fill={v === max ? color : i === data.length - 1 ? color + 'AA' : trackBg} />
            <text x={x + bW / 2} y={H + 12} textAnchor="middle" fontSize={7} fill="#C8C8C8">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SvgLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const W = 400, H = 64;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / (max - min || 1)) * (H - 6) - 3,
  ]);
  const line = pts.map(([x, y], i) => (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)).join(' ');
  const area = line + ' L' + W + ',' + H + ' L0,' + H + ' Z';
  const pi = data.indexOf(max);
  const gid = 'lg' + color.replace('#', '');
  return (
    <svg width="100%" viewBox={'0 0 ' + W + ' ' + H} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={'url(#' + gid + ')'} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pi][0]} cy={pts[pi][1]} r={3.5} fill={color} stroke="#fff" strokeWidth={1.5} />
    </svg>
  );
}

function PBar({ label, value, pct, color, trackColor }: {
  label: string; value: string; pct: number; color: string; trackColor: string;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 8.5, color: '#555', fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: 8.5, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 5, background: trackColor, borderRadius: 99 }}>
        <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

type SNavItem = { ic: React.ReactNode; l: string; a?: boolean };
type STheme = {
  accent: string; navBg: string; navBorder: string;
  activeBg: string; activeBorder: string; activeText: string;
  contentBg: string; cardBorder: string;
};

function SaasShell({ children, slug, nav, theme }: {
  children: React.ReactNode; slug: string; nav: SNavItem[]; theme: STheme;
}) {
  const LW = 540, LH = 362;
  return (
    <div style={{ filter: 'drop-shadow(0 22px 38px rgba(0,0,0,0.18)) drop-shadow(0 3px 8px rgba(0,0,0,0.10))' }}>
      <div style={{ width: LW, background: 'linear-gradient(165deg,#E8E8E8 0%,#CCCCCC 50%,#B8B8B8 100%)', borderRadius: '16px 16px 0 0', padding: '10px 10px 0', boxSizing: 'border-box', border: '1px solid #B6B6B6', borderBottom: 'none', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#2a2a2a' }} />
        <div style={{ background: '#111', borderRadius: '9px 9px 0 0', height: LH - 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* browser bar */}
          <div style={{ background: '#1a1a1c', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, background: '#252528', borderRadius: 5, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 8, color: '#666', fontFamily: 'DM Sans, sans-serif' }}>{slug}</span>
            </div>
          </div>
          {/* sidebar + content */}
          <div style={{ display: 'grid', gridTemplateColumns: '78px 1fr', flex: 1, overflow: 'hidden' }}>
            <div style={{ background: theme.navBg, borderRight: '1px solid ' + theme.navBorder, padding: '11px 0' }}>
              <div style={{ padding: '0 11px 11px' }}>
                <div style={{ width: 22, height: 22, background: theme.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, color: '#fff', fontWeight: 700 }}>OZ</div>
              </div>
              {nav.map((item, j) => (
                <div key={j} style={{ padding: '6px 11px', background: item.a ? theme.activeBg : 'transparent', borderLeft: '2px solid ' + (item.a ? theme.activeBorder : 'transparent'), display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.ic}
                  <span style={{ fontSize: 7.5, fontWeight: item.a ? 600 : 400, color: item.a ? theme.activeText : '#bbb' }}>{item.l}</span>
                </div>
              ))}
            </div>
            <div style={{ overflow: 'hidden', height: '100%', background: theme.contentBg }}>{children}</div>
          </div>
        </div>
      </div>
      <div style={{ width: LW, height: 7, background: 'linear-gradient(180deg,#B8B8B8,#C8C8C8)', borderRadius: '0 0 3px 3px', border: '1px solid #ACACAC', borderTop: 'none' }} />
      <div style={{ width: LW - 46, height: 12, background: 'linear-gradient(180deg,#C8C8C8,#D6D6D6)', borderRadius: '0 0 10px 10px', margin: '0 auto', border: '1px solid #B2B2B2', borderTop: 'none' }} />
    </div>
  );
}

function SBadge({ text, color }: { text: string; color: string }) {
  return <span style={{ fontSize: 7.5, fontWeight: 700, color, background: color + '18', padding: '2px 6px', borderRadius: 99, whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</span>;
}

function SHeader({ cols, headers }: { cols: string; headers: string[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols }}>
      {headers.map(h => <span key={h} style={{ fontSize: 7, fontWeight: 700, color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 5 }}>{h}</span>)}
    </div>
  );
}

function SRow({ cols, cells, border }: { cols: string; cells: React.ReactNode[]; border: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '5px 0', borderTop: '1px solid ' + border }}>
      {cells.map((c, i) => <React.Fragment key={i}>{c}</React.Fragment>)}
    </div>
  );
}

/* ═══ THÈMES ═══════════════════════════════════════════ */

const TH_RESTO: STheme = {
  accent: '#EA580C', navBg: '#FFFBF7', navBorder: '#FFEDD5',
  activeBg: '#FFF7ED', activeBorder: '#F97316', activeText: '#C2410C',
  contentBg: '#FFFAF6', cardBorder: '#FFEDD5',
};
const TH_ECOM: STheme = {
  accent: '#4F46E5', navBg: '#FAFAFE', navBorder: '#E0E7FF',
  activeBg: '#EEF2FF', activeBorder: '#6366F1', activeText: '#3730A3',
  contentBg: '#F5F5FE', cardBorder: '#E0E7FF',
};
const TH_HEALTH: STheme = {
  accent: '#0D9488', navBg: '#FAFEFE', navBorder: '#CCFBF1',
  activeBg: '#F0FDFA', activeBorder: '#0D9488', activeText: '#0F766E',
  contentBg: '#F4FFFE', cardBorder: '#CCFBF1',
};
const TH_IMMO: STheme = {
  accent: '#16A34A', navBg: '#FAFEFB', navBorder: '#BBF7D0',
  activeBg: '#F0FDF4', activeBorder: '#22C55E', activeText: '#15803D',
  contentBg: '#F4FEF7', cardBorder: '#BBF7D0',
};
const TH_RH: STheme = {
  accent: '#7C3AED', navBg: '#FDFAFF', navBorder: '#E9D5FF',
  activeBg: '#F5F3FF', activeBorder: '#7C3AED', activeText: '#6D28D9',
  contentBg: '#F8F5FF', cardBorder: '#E9D5FF',
};

/* ═══ SECTEUR 1 — RESTAURATION  (orange) ══════════════ */
function SaasResto() {
  const nav: SNavItem[] = [
    { ic: <LayoutDashboard size={10} color="#EA580C" />, l: 'Dashboard', a: true },
    { ic: <ClipboardList size={10} color="#ccc" />, l: 'Commandes' },
    { ic: <ChefHat size={10} color="#ccc" />, l: 'Menu' },
    { ic: <Users size={10} color="#ccc" />, l: 'Clients' },
    { ic: <BarChart2 size={10} color="#ccc" />, l: 'Rapports' },
    { ic: <Settings size={10} color="#ccc" />, l: 'Réglages' },
  ];
  return (
    <SaasShell slug="app.ozirus.resto/dashboard" nav={nav} theme={TH_RESTO}>
      <div style={{ padding: '12px 13px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9, boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 12, color: '#111' }}>Dashboard</p>
            <p style={{ fontSize: 7.5, color: '#bbb', marginTop: 1 }}>Samedi 31 Mai — Service du soir</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 6, padding: '3px 8px' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F97316' }} />
              <span style={{ fontSize: 7.5, color: '#EA580C', fontWeight: 600 }}>Service actif</span>
            </div>
            <div style={{ background: '#EA580C', borderRadius: 6, padding: '4px 9px', fontSize: 7.5, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              <PlusCircle size={8} color="#fff" /> Commande
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          <KpiCard icon={<ClipboardList size={10} color="#EA580C" />} label="Commandes" value="47" delta="+8%" ok bg="#FFF7ED" />
          <KpiCard icon={<DollarSign size={10} color="#16a34a" />} label="CA du soir" value="284K F" delta="+15%" ok bg="#F0FDF4" />
          <KpiCard icon={<Users size={10} color="#EA580C" />} label="Couverts" value="112" delta="+6%" ok bg="#FFF7ED" />
          <KpiCard icon={<Clock size={10} color="#EA580C" />} label="Tps moyen" value="18 min" delta="-2 min" ok bg="#FFF7ED" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 9 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_RESTO.cardBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>CA · 7 derniers jours</p>
              <span style={{ fontSize: 7.5, color: '#EA580C', fontWeight: 600 }}>+18% vs semaine passée</span>
            </div>
            <SvgBar data={[180, 240, 195, 310, 265, 420, 284]} color="#F97316" trackBg="#FFEDD5" labels={['L', 'M', 'M', 'J', 'V', 'S', 'D']} />
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_RESTO.cardBorder }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111', marginBottom: 8 }}>Top plats</p>
            <PBar label="Poulet DG" value="34" pct={82} color="#F97316" trackColor="#FFEDD5" />
            <PBar label="Ndolé boeuf" value="28" pct={67} color="#FB923C" trackColor="#FFEDD5" />
            <PBar label="Poisson braisé" value="19" pct={46} color="#FD974A" trackColor="#FFEDD5" />
            <PBar label="Okok" value="11" pct={26} color="#FDBA74" trackColor="#FFF7ED" />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_RESTO.cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Commandes en cours</p>
            <span style={{ fontSize: 7.5, color: '#EA580C', fontWeight: 600 }}>Voir tout</span>
          </div>
          <SHeader cols="32px 1fr 68px 58px" headers={['', 'Commande', 'Montant', 'Statut']} />
          {[
            { t: 'T-04', cmd: 'Poulet DG × 2, Jus gingembre', m: '14 800 F', s: 'En cuisine', c: '#F59E0B' },
            { t: 'T-07', cmd: 'Ndolé boeuf, Castel × 2', m: '18 200 F', s: 'Servi', c: '#22c55e' },
            { t: 'T-12', cmd: 'Poisson braisé, Eau minérale', m: '9 500 F', s: 'Payé', c: '#F97316' },
            { t: 'T-03', cmd: 'Okok, Mbongo tchobi', m: '12 000 F', s: 'Attente', c: '#94A3B8' },
          ].map(o => (
            <SRow key={o.t} cols="32px 1fr 68px 58px" border="#FFF7ED" cells={[
              <div style={{ width: 20, height: 20, borderRadius: 5, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: '#EA580C' }}>{o.t}</div>,
              <span style={{ fontSize: 7.5, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 4 }}>{o.cmd}</span>,
              <span style={{ fontSize: 7.5, fontWeight: 700, color: '#333' }}>{o.m}</span>,
              <SBadge text={o.s} color={o.c} />,
            ]} />
          ))}
        </div>
      </div>
    </SaasShell>
  );
}

/* ═══ SECTEUR 2 — E-COMMERCE  (indigo) ════════════════ */
function SaasEcom() {
  const nav: SNavItem[] = [
    { ic: <LayoutDashboard size={10} color="#4F46E5" />, l: 'Dashboard', a: true },
    { ic: <ShoppingBag size={10} color="#ccc" />, l: 'Commandes' },
    { ic: <Package size={10} color="#ccc" />, l: 'Produits' },
    { ic: <Users size={10} color="#ccc" />, l: 'Clients' },
    { ic: <TrendingUp size={10} color="#ccc" />, l: 'Analytics' },
    { ic: <Settings size={10} color="#ccc" />, l: 'Réglages' },
  ];
  return (
    <SaasShell slug="app.ozirus.shop/dashboard" nav={nav} theme={TH_ECOM}>
      <div style={{ padding: '12px 13px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9, boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 12, color: '#111' }}>Dashboard</p>
            <p style={{ fontSize: 7.5, color: '#bbb', marginTop: 1 }}>Mai 2026 — Vue globale</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E0E7FF', borderRadius: 6, padding: '3px 8px' }}>
              <Filter size={8} color="#6366F1" />
              <span style={{ fontSize: 7.5, color: '#6366F1', fontWeight: 600 }}>Filtrer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #E0E7FF', borderRadius: 6, padding: '3px 8px' }}>
              <Download size={8} color="#888" />
              <span style={{ fontSize: 7.5, color: '#888', fontWeight: 600 }}>Export</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          <KpiCard icon={<ShoppingBag size={10} color="#4F46E5" />} label="Commandes" value="1 482" delta="+12%" ok bg="#EEF2FF" />
          <KpiCard icon={<DollarSign size={10} color="#16a34a" />} label="CA du mois" value="8,4M F" delta="+22%" ok bg="#F0FDF4" />
          <KpiCard icon={<Package size={10} color="#F59E0B" />} label="Paniers abnd." value="23%" delta="-5%" ok bg="#FFF7ED" />
          <KpiCard icon={<Users size={10} color="#4F46E5" />} label="Nvx clients" value="142" delta="+31%" ok bg="#EEF2FF" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 9 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_ECOM.cardBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>CA · 30 derniers jours</p>
              <div style={{ display: 'flex', gap: 5 }}>
                <span style={{ fontSize: 7, color: '#4F46E5', fontWeight: 700, background: '#EEF2FF', padding: '1px 5px', borderRadius: 99 }}>Ce mois</span>
                <span style={{ fontSize: 7, color: '#ccc' }}>Mois préc.</span>
              </div>
            </div>
            <SvgLine data={[120, 145, 180, 165, 210, 195, 240, 280, 260, 310, 295, 340, 380, 350, 420, 395, 445, 480, 460, 510, 490, 540, 580, 555, 620, 600, 650, 690, 660, 710]} color="#6366F1" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {['1 Mai', '8', '15', '22', '31'].map(d => <span key={d} style={{ fontSize: 7, color: '#ccc' }}>{d}</span>)}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_ECOM.cardBorder }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111', marginBottom: 8 }}>Top catégories</p>
            <PBar label="Mode & Vêtements" value="42%" pct={42} color="#4F46E5" trackColor="#E0E7FF" />
            <PBar label="Chaussures" value="28%" pct={28} color="#6366F1" trackColor="#E0E7FF" />
            <PBar label="Beauté" value="18%" pct={18} color="#818CF8" trackColor="#E0E7FF" />
            <PBar label="Accessoires" value="12%" pct={12} color="#A5B4FC" trackColor="#EEF2FF" />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_ECOM.cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Dernières commandes</p>
            <span style={{ fontSize: 7.5, color: '#4F46E5', fontWeight: 600 }}>Voir tout</span>
          </div>
          <SHeader cols="1fr 1fr 68px 55px 66px" headers={['Client', 'Produit', 'Montant', 'Livraison', 'Statut']} />
          {[
            { n: 'Aïcha Koné', av: 'AK', p: 'Robe Ankara', m: '18 500 F', l: 'Express', s: 'Expédié', c: '#4F46E5' },
            { n: 'Paul Mbarga', av: 'PM', p: 'Sneakers Air', m: '34 000 F', l: 'Standard', s: 'Livré', c: '#22c55e' },
            { n: 'Fatou Diallo', av: 'FD', p: 'Kit soin chev.', m: '9 200 F', l: 'Express', s: 'En transit', c: '#F59E0B' },
            { n: 'Bruno Tamba', av: 'BT', p: 'Montre classiq.', m: '52 000 F', l: 'Standard', s: 'Préparation', c: '#94A3B8' },
          ].map(o => (
            <SRow key={o.n} cols="1fr 1fr 68px 55px 66px" border="#EEF2FF" cells={[
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6.5, color: '#fff', fontWeight: 700, flexShrink: 0 }}>{o.av}</div>
                <span style={{ fontSize: 7.5, fontWeight: 600, color: '#111' }}>{o.n}</span>
              </div>,
              <span style={{ fontSize: 7.5, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 4 }}>{o.p}</span>,
              <span style={{ fontSize: 7.5, fontWeight: 700, color: '#333' }}>{o.m}</span>,
              <span style={{ fontSize: 7, color: '#888' }}>{o.l}</span>,
              <SBadge text={o.s} color={o.c} />,
            ]} />
          ))}
        </div>
      </div>
    </SaasShell>
  );
}

/* ═══ SECTEUR 3 — SANTÉ  (teal) ═══════════════════════ */
function SaasHealth() {
  const nav: SNavItem[] = [
    { ic: <LayoutDashboard size={10} color="#0D9488" />, l: 'Dashboard', a: true },
    { ic: <Calendar size={10} color="#ccc" />, l: 'Rendez-vous' },
    { ic: <Users size={10} color="#ccc" />, l: 'Patients' },
    { ic: <Stethoscope size={10} color="#ccc" />, l: 'Médecins' },
    { ic: <Pill size={10} color="#ccc" />, l: 'Stock' },
    { ic: <Settings size={10} color="#ccc" />, l: 'Réglages' },
  ];
  return (
    <SaasShell slug="app.ozirus.clinic/dashboard" nav={nav} theme={TH_HEALTH}>
      <div style={{ padding: '12px 13px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9, boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 12, color: '#111' }}>Dashboard</p>
            <p style={{ fontSize: 7.5, color: '#bbb', marginTop: 1 }}>Samedi 31 Mai — Consultations du jour</p>
          </div>
          <div style={{ background: '#0D9488', borderRadius: 6, padding: '4px 9px', fontSize: 7.5, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            <PlusCircle size={8} color="#fff" /> Nouveau RDV
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          <KpiCard icon={<Calendar size={10} color="#0D9488" />} label="RDV aujourd'hui" value="38" delta="+4" ok bg="#F0FDFA" />
          <KpiCard icon={<UserCheck size={10} color="#16a34a" />} label="Consultés" value="24" delta="63%" ok bg="#F0FDF4" />
          <KpiCard icon={<AlertCircle size={10} color="#dc2626" />} label="No-shows" value="3" delta="-2" ok={false} bg="#FEF2F2" />
          <KpiCard icon={<DollarSign size={10} color="#0D9488" />} label="Recettes" value="142K F" delta="+11%" ok bg="#F0FDFA" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 9 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_HEALTH.cardBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Consultations · 7 jours</p>
              <span style={{ fontSize: 7.5, color: '#0D9488', fontWeight: 600 }}>+14% vs sem. passée</span>
            </div>
            <SvgBar data={[22, 35, 28, 42, 38, 55, 38]} color="#0D9488" trackBg="#CCFBF1" labels={['L', 'M', 'M', 'J', 'V', 'S', 'D']} />
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_HEALTH.cardBorder }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111', marginBottom: 8 }}>Types de consultations</p>
            <PBar label="Médecine générale" value="45%" pct={45} color="#0D9488" trackColor="#CCFBF1" />
            <PBar label="Pédiatrie" value="25%" pct={25} color="#2DD4BF" trackColor="#CCFBF1" />
            <PBar label="Gynécologie" value="18%" pct={18} color="#5EEAD4" trackColor="#CCFBF1" />
            <PBar label="Urgences" value="12%" pct={12} color="#99F6E4" trackColor="#F0FDFA" />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_HEALTH.cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Planning du jour</p>
            <span style={{ fontSize: 7.5, color: '#0D9488', fontWeight: 600 }}>Voir complet</span>
          </div>
          <SHeader cols="44px 1fr 1fr 66px 60px" headers={['Heure', 'Patient', 'Médecin', 'Motif', 'Statut']} />
          {[
            { h: '09:00', p: 'Ngo Biya C.', m: 'Dr. Njoya', mo: 'Fièvre', s: 'Terminé', c: '#22c55e' },
            { h: '09:30', p: 'Enow Martin', m: 'Dr. Foka', mo: 'Tension', s: 'En cours', c: '#0D9488' },
            { h: '10:00', p: 'Samba Ibra.', m: 'Dr. Njoya', mo: 'Pédiatrie', s: 'Salle att.', c: '#F59E0B' },
            { h: '10:30', p: 'Bella Mireille', m: 'Dr. Kamdem', mo: 'Vaccination', s: 'Confirmé', c: '#6366F1' },
          ].map(o => (
            <SRow key={o.h} cols="44px 1fr 1fr 66px 60px" border="#F0FDFA" cells={[
              <span style={{ fontSize: 7.5, fontWeight: 700, color: '#0D9488' }}>{o.h}</span>,
              <span style={{ fontSize: 7.5, fontWeight: 600, color: '#111' }}>{o.p}</span>,
              <span style={{ fontSize: 7.5, color: '#777' }}>{o.m}</span>,
              <span style={{ fontSize: 7, color: '#666' }}>{o.mo}</span>,
              <SBadge text={o.s} color={o.c} />,
            ]} />
          ))}
        </div>
      </div>
    </SaasShell>
  );
}

/* ═══ SECTEUR 4 — IMMOBILIER  (vert) ══════════════════ */
function SaasImmo() {
  const nav: SNavItem[] = [
    { ic: <LayoutDashboard size={10} color="#16A34A" />, l: 'Dashboard', a: true },
    { ic: <BagIcon size={10} color="#ccc" />, l: 'Biens' },
    { ic: <Users size={10} color="#ccc" />, l: 'Locataires' },
    { ic: <DollarSign size={10} color="#ccc" />, l: 'Loyers' },
    { ic: <BarChart2 size={10} color="#ccc" />, l: 'Rapports' },
    { ic: <Settings size={10} color="#ccc" />, l: 'Réglages' },
  ];
  return (
    <SaasShell slug="app.ozirus.immo/dashboard" nav={nav} theme={TH_IMMO}>
      <div style={{ padding: '12px 13px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9, boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 12, color: '#111' }}>Dashboard</p>
            <p style={{ fontSize: 7.5, color: '#bbb', marginTop: 1 }}>Mai 2026 — Portefeuille locatif</p>
          </div>
          <div style={{ background: '#16A34A', borderRadius: 6, padding: '4px 9px', fontSize: 7.5, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            <PlusCircle size={8} color="#fff" /> Ajouter un bien
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          <KpiCard icon={<BagIcon size={10} color="#16A34A" />} label="Biens gérés" value="47" delta="+3" ok bg="#F0FDF4" />
          <KpiCard icon={<DollarSign size={10} color="#16a34a" />} label="Loyers" value="6,2M F" delta="+8%" ok bg="#F0FDF4" />
          <KpiCard icon={<AlertCircle size={10} color="#dc2626" />} label="Impayés" value="5" delta="+2" ok={false} bg="#FEF2F2" />
          <KpiCard icon={<Percent size={10} color="#16A34A" />} label="Taux occupation" value="91%" delta="+3%" ok bg="#F0FDF4" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 9 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_IMMO.cardBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Encaissements · 6 mois</p>
              <span style={{ fontSize: 7.5, color: '#16A34A', fontWeight: 600 }}>+11% vs 6 mois avant</span>
            </div>
            <SvgBar data={[4800, 5200, 5100, 5600, 5900, 6200]} color="#16A34A" trackBg="#BBF7D0" labels={['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai']} />
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_IMMO.cardBorder }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111', marginBottom: 8 }}>Répartition par type</p>
            <PBar label="Appartements" value="52%" pct={52} color="#16A34A" trackColor="#BBF7D0" />
            <PBar label="Studios" value="26%" pct={26} color="#22C55E" trackColor="#BBF7D0" />
            <PBar label="Maisons" value="14%" pct={14} color="#4ADE80" trackColor="#BBF7D0" />
            <PBar label="Commerces" value="8%" pct={8} color="#86EFAC" trackColor="#DCFCE7" />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_IMMO.cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Suivi des loyers — Mai 2026</p>
            <span style={{ fontSize: 7.5, color: '#16A34A', fontWeight: 600 }}>Voir tout</span>
          </div>
          <SHeader cols="1fr 76px 78px 55px 60px" headers={['Locataire', 'Bien', 'Loyer', 'Échéance', 'Statut']} />
          {[
            { n: 'Mireille Foka', b: 'Appt F3 Bali', l: '120 000 F', e: '01 Juin', s: 'Payé', c: '#22c55e' },
            { n: 'Jean-Pierre N.', b: 'Studio Melen', l: '65 000 F', e: '01 Juin', s: 'En retard', c: '#dc2626' },
            { n: 'Grace Mballa', b: 'Maison Odza', l: '250 000 F', e: '05 Juin', s: 'En attente', c: '#F59E0B' },
            { n: 'Ibrahima Sow', b: 'Commerce Akwa', l: '180 000 F', e: '01 Juin', s: 'Payé', c: '#22c55e' },
          ].map(o => (
            <SRow key={o.n} cols="1fr 76px 78px 55px 60px" border="#F0FDF4" cells={[
              <span style={{ fontSize: 7.5, fontWeight: 600, color: '#111' }}>{o.n}</span>,
              <span style={{ fontSize: 7, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.b}</span>,
              <span style={{ fontSize: 7.5, fontWeight: 700, color: '#333' }}>{o.l}</span>,
              <span style={{ fontSize: 7, color: '#777' }}>{o.e}</span>,
              <SBadge text={o.s} color={o.c} />,
            ]} />
          ))}
        </div>
      </div>
    </SaasShell>
  );
}

/* ═══ SECTEUR 5 — RH & PAIE  (violet profond) ═════════ */
function SaasRH() {
  const nav: SNavItem[] = [
    { ic: <LayoutDashboard size={10} color="#7C3AED" />, l: 'Dashboard', a: true },
    { ic: <Users size={10} color="#ccc" />, l: 'Employés' },
    { ic: <DollarSign size={10} color="#ccc" />, l: 'Paie' },
    { ic: <Calendar size={10} color="#ccc" />, l: 'Congés' },
    { ic: <Activity size={10} color="#ccc" />, l: 'Présences' },
    { ic: <Settings size={10} color="#ccc" />, l: 'Réglages' },
  ];
  return (
    <SaasShell slug="app.ozirus.rh/dashboard" nav={nav} theme={TH_RH}>
      <div style={{ padding: '12px 13px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9, boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 12, color: '#111' }}>Dashboard RH</p>
            <p style={{ fontSize: 7.5, color: '#bbb', marginTop: 1 }}>Mai 2026 — 48 employés actifs</p>
          </div>
          <div style={{ background: '#7C3AED', borderRadius: 6, padding: '4px 9px', fontSize: 7.5, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            <PlusCircle size={8} color="#fff" /> Ajouter employé
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          <KpiCard icon={<Users size={10} color="#7C3AED" />} label="Effectif total" value="48" delta="+3" ok bg="#F5F3FF" />
          <KpiCard icon={<DollarSign size={10} color="#16a34a" />} label="Masse salariale" value="12,4M F" delta="+5%" ok bg="#F0FDF4" />
          <KpiCard icon={<Calendar size={10} color="#F59E0B" />} label="Congés en cours" value="7" delta="-2" ok bg="#FFF7ED" />
          <KpiCard icon={<Activity size={10} color="#7C3AED" />} label="Taux présence" value="94%" delta="+2%" ok bg="#F5F3FF" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 9 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_RH.cardBorder }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Masse salariale · 6 mois</p>
              <span style={{ fontSize: 7.5, color: '#7C3AED', fontWeight: 600 }}>+5% vs 6 mois avant</span>
            </div>
            <SvgBar data={[11200, 11500, 11800, 11900, 12100, 12400]} color="#7C3AED" trackBg="#DDD6FE" labels={['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai']} />
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_RH.cardBorder }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111', marginBottom: 8 }}>Par département</p>
            <PBar label="Commercial" value="35%" pct={35} color="#7C3AED" trackColor="#DDD6FE" />
            <PBar label="Technique" value="28%" pct={28} color="#8B5CF6" trackColor="#DDD6FE" />
            <PBar label="Administration" value="22%" pct={22} color="#A78BFA" trackColor="#DDD6FE" />
            <PBar label="Support" value="15%" pct={15} color="#C4B5FD" trackColor="#EDE9FE" />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid ' + TH_RH.cardBorder }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#111' }}>Fiches de paie — Mai 2026</p>
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ fontSize: 7, fontWeight: 600, color: '#22c55e', background: '#F0FDF4', padding: '2px 5px', borderRadius: 99 }}>42 validées</span>
              <span style={{ fontSize: 7, fontWeight: 600, color: '#F59E0B', background: '#FFF7ED', padding: '2px 5px', borderRadius: 99 }}>6 en attente</span>
            </div>
          </div>
          <SHeader cols="1fr 76px 78px 55px 60px" headers={['Employé', 'Poste', 'Salaire net', 'Présences', 'Statut']} />
          {[
            { n: 'Thierry Ondoa', av: 'TO', p: 'Dev Senior', s: '350 000 F', pr: '22/22 j', st: 'Validé', c: '#22c55e' },
            { n: 'Claudine Bika', av: 'CB', p: 'Commerciale', s: '220 000 F', pr: '20/22 j', st: 'Validé', c: '#22c55e' },
            { n: 'Roger Fongang', av: 'RF', p: 'Comptable', s: '280 000 F', pr: '18/22 j', st: 'En attente', c: '#F59E0B' },
            { n: 'Nadège Ateba', av: 'NA', p: 'RH Manager', s: '310 000 F', pr: '22/22 j', st: 'Validé', c: '#22c55e' },
          ].map(o => (
            <SRow key={o.n} cols="1fr 76px 78px 55px 60px" border="#F5F3FF" cells={[
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6.5, color: '#fff', fontWeight: 700, flexShrink: 0 }}>{o.av}</div>
                <span style={{ fontSize: 7.5, fontWeight: 600, color: '#111' }}>{o.n}</span>
              </div>,
              <span style={{ fontSize: 7, color: '#888' }}>{o.p}</span>,
              <span style={{ fontSize: 7.5, fontWeight: 700, color: '#333' }}>{o.s}</span>,
              <span style={{ fontSize: 7, color: '#777' }}>{o.pr}</span>,
              <SBadge text={o.st} color={o.c} />,
            ]} />
          ))}
        </div>
      </div>
    </SaasShell>
  );
}

const SAAS_LIST = [
  { id: 'resto', label: 'Restauration', sub: 'Restaurant & maquis', el: <SaasResto /> },
  { id: 'ecom', label: 'E-commerce', sub: 'Boutique en ligne', el: <SaasEcom /> },
  { id: 'health', label: 'Santé', sub: 'Clinique & cabinet médical', el: <SaasHealth /> },
  { id: 'immo', label: 'Immobilier', sub: 'Gestion locative', el: <SaasImmo /> },
  { id: 'rh', label: 'RH & Paie', sub: 'Ressources humaines', el: <SaasRH /> },
];

const APPS = [
  { id: 'fintech', label: 'Fintech — NeoBank',        sub: 'Application bancaire mobile',   color: '#34d399', light: false, screen: <NeoBankApp /> },
  { id: 'fitness', label: 'Fitness — WorkoutAI',      sub: 'Coach sportif intelligent',     color: '#fb923c', light: false, screen: <FitnessApp /> },
  { id: 'food',    label: 'Food Delivery — QuickEat', sub: 'Livraison de repas locale',      color: '#FF5A5F', light: true,  screen: <FoodApp /> },
  { id: 'school',  label: 'Gestion scolaire',          sub: 'SaaS établissements scolaires', color: '#7C6AF7', light: false, screen: <SchoolApp /> },
  { id: 'clinic',  label: 'Clinique & Santé',           sub: 'Dossier patient & RDV',         color: '#0891b2', light: false, screen: <ClinicApp /> },
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
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.55fr', gap: 48, alignItems: 'center' }}>

        {/* ── MOBILE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 4 }}>
                SaaS — {SAAS_LIST[saasIdx].label}
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#111', fontFamily: 'Clash Display, sans-serif' }}>{SAAS_LIST[saasIdx].sub}</p>
            </div>
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              {SAAS_LIST[saasIdx].el}
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
        )}

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
    <main style={{ background: '#fff', color: '#111', fontFamily: 'DM Sans, sans-serif' }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 30 }} />
          </Link>
          <nav style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 500 }}>
            {[['#offres', 'Offres'], ['#processus', 'Processus'], ['#realisations', 'Réalisations'], ['#contact', 'Contact']].map(([href, label]) => (
              <a key={href} href={href} style={{ color: '#555', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#7967FF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}>{label}</a>
            ))}
          </nav>
          <a href="#contact" style={{ background: '#7967FF', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
            Démarrer un projet
          </a>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}><DotGrid /></div>
        <div aria-hidden style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 24px', textAlign: 'center' }}>

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
            <a href="mailto:contact@ozirus.agency" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7967FF', color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(121,103,255,0.25)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
              Démarrer un projet <ArrowRight size={16} />
            </a>
            <a href="https://wa.me/237000000000" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #25D366', color: '#25D366', padding: '14px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
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
          </div>
        </div>
      </footer>

    </main>
  );
}
