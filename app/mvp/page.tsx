'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, animate, useInView, useScroll, useSpring, useTransform,
} from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  ArrowRight, CheckCircle2, X, ChevronDown, Clock, Smartphone, Monitor, Globe,
  Layers, Compass, Rocket, Gift, Film, LayoutTemplate, MessageCircle, Cpu, Target, Scissors,
  Bot, Eye, ShieldCheck, Sparkles, AlertTriangle, Play,
} from 'lucide-react';

/* ─── config de l'offre ─────────────────────────────── */
const OFFER = {
  price: 5000,
  originalPrice: 10000,
  days: 30,
  years: 5,
  whatsapp: '237694086571',
  whatsappText: 'Bonjour Wilfried, je suis intéressé par l\'offre MVP en 30 jours à 5 000 €. Voici mon projet : ',
  email: 'info.ozirus@gmail.com',
};

// Vidéo de présentation. Renseigner `src` (fichier déposé dans public/, ex. '/videos/mvp.mp4')
// OU `youtubeId`. Tant que les deux sont vides, l'affiche reste visible avec « Bientôt disponible ».
const VIDEO = {
  src: '',
  youtubeId: '',
  poster: '',
  photo: '',
  duration: '',
  chapters: ['Qui je suis', 'Pourquoi un CTO cofondateur', 'Ma méthode avec l\'IA', 'L\'offre à 5 000 €'],
};

const WHATSAPP_URL = `https://wa.me/${OFFER.whatsapp}?text=${encodeURIComponent(OFFER.whatsappText)}`;
const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`;

const ACCENT = '#7967FF';
const DISPLAY = 'var(--font-display-loaded), Clash Display, sans-serif';
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const T = (delay = 0) => ({ duration: 0.7, delay, ease: EASE });
const upView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: T(delay),
});

/* ─── données ───────────────────────────────────────── */
const PLATFORMS = [
  { icon: Globe, title: 'SaaS web', desc: 'Espace client, tableau de bord, abonnements, rôles et paiements. Prêt à facturer vos premiers utilisateurs.' },
  { icon: Smartphone, title: 'App mobile', desc: 'iOS et Android depuis une seule base de code, publiable sur les stores, avec une vraie expérience native.' },
  { icon: Monitor, title: 'App desktop', desc: 'macOS et Windows pour les outils métier, la création ou le hors-ligne, là où le navigateur ne suffit pas.' },
  { icon: Cpu, title: 'Produit IA', desc: 'Agents, automatisations, assistants branchés sur vos données. L\'IA au service d\'un vrai usage, pas d\'une démo.' },
];

const COMPARISON = [
  { freelance: 'Exécute un cahier des charges', cto: 'Challenge le cahier des charges avant d\'écrire une ligne' },
  { freelance: 'Facture chaque fonctionnalité ajoutée', cto: 'Coupe ce qui ne sert pas votre premier client' },
  { freelance: 'Choisit la stack qu\'il connaît', cto: 'Choisit l\'architecture qui tiendra à 10 000 utilisateurs' },
  { freelance: 'Livre un code, puis disparaît', cto: 'Livre un produit, et pense déjà à la V2 avec vous' },
  { freelance: 'Parle technique', cto: 'Parle utilisateurs, revenus et levée de fonds' },
];

const CTO_POINTS = [
  { icon: Target, title: 'Il pense produit, pas tickets', desc: 'Chaque fonctionnalité est jugée sur une seule question : est-ce qu\'elle aide votre premier client à payer ?' },
  { icon: Scissors, title: 'Il sait couper', desc: 'La moitié d\'un MVP raté, ce sont des fonctionnalités dont personne n\'avait besoin. Couper, c\'est livrer en 30 jours.' },
  { icon: Layers, title: 'Il construit pour la suite', desc: 'Une base propre, documentée et évolutive. Votre V2 se construit dessus, sans tout réécrire.' },
  { icon: Compass, title: 'Il assume les décisions', desc: 'Stack, hébergement, sécurité, coûts : vous n\'avez pas à arbitrer seul des choix que vous ne maîtrisez pas.' },
];

const TIMELINE = [
  { days: 'Jours 1 à 5', title: 'Cadrage & design', desc: 'Atelier produit, parcours utilisateur, périmètre verrouillé, maquettes validées ensemble.' },
  { days: 'Jours 6 à 20', title: 'Développement', desc: 'Sprints courts, démo chaque semaine. Vous voyez le produit avancer, vous n\'attendez pas la fin.' },
  { days: 'Jours 21 à 26', title: 'Tests & finitions', desc: 'Recette, corrections, performance, mise en production sur vos comptes.' },
  { days: 'Jours 27 à 30', title: 'Lancement', desc: 'Landing page en ligne, vidéo motion livrée, MVP prêt pour vos premiers utilisateurs.' },
];

const INCLUDED = [
  'Atelier de cadrage produit avec le CTO',
  'Maquettes UI/UX des écrans clés',
  'Développement du MVP (web, mobile ou desktop)',
  'Authentification, base de données, back-office',
  'Mise en production et déploiement',
  'Démo hebdomadaire et canal direct avec le CTO',
  'Code source et accès remis à votre nom',
];

const BONUSES = [
  { icon: LayoutTemplate, title: 'Landing page de lancement', desc: 'Une page qui présente votre produit, capte les inscriptions et sert à vos premières campagnes.' },
  { icon: Film, title: 'Vidéo motion promo', desc: 'Une vidéo animée qui explique votre produit en quelques secondes, pour vos réseaux, investisseurs et pitchs.' },
];

const STACK = ['Next.js', 'React', 'React Native', 'Flutter', 'Node.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Stripe', 'Electron', 'OpenAI', 'Vercel'];

const AI_METHOD = [
  { icon: Bot, title: 'L\'IA écrit le code répétitif', desc: 'Formulaires, écrans, tests, documentation : des agents IA les produisent en quelques minutes au lieu de quelques jours.' },
  { icon: Eye, title: 'Je relis chaque ligne', desc: 'Rien n\'arrive en production sans avoir été relu, compris et validé. L\'IA propose, le CTO décide.' },
  { icon: ShieldCheck, title: 'La sécurité ne se délègue pas', desc: 'Données, paiements, accès : tout ce qui peut coûter cher est vérifié à la main, pas laissé à un modèle.' },
  { icon: Sparkles, title: 'Le temps gagné va au produit', desc: 'Ce que l\'IA fait gagner sert à affiner votre produit et à livrer en 30 jours, pas à gonfler la facture.' },
];

const TERMINAL_LINES = [
  { who: 'vous', color: '#FBBF24', text: '« Mes clients doivent pouvoir payer en ligne. »', ok: false },
  { who: 'cto', color: '#A78BFA', text: 'Périmètre : 1 abonnement mensuel, paiement Stripe', ok: true },
  { who: 'agent', color: '#38BDF8', text: 'Génère le module abonnements et ses webhooks', ok: true },
  { who: 'agent', color: '#38BDF8', text: 'Écrit 42 tests automatisés', ok: true },
  { who: 'cto', color: '#A78BFA', text: 'Revue : 2 failles corrigées, architecture validée', ok: true },
  { who: 'prod', color: '#4ADE80', text: 'En ligne, démo envoyée au fondateur', ok: true },
];

const LAST_20 = [
  'Sécurité des comptes et des données',
  'Paiements et facturation fiables',
  'Publication sur l\'App Store et Google Play',
  'Performance quand les utilisateurs arrivent',
  'Bugs en production, à corriger vite',
  'Un code qui tient pour la V2',
];

const FAQS = [
  {
    q: 'Pourquoi ne pas le faire moi-même avec Claude ou ChatGPT ?',
    a: 'Pour un prototype, vous pouvez. L\'IA vous emmène vite à 80 % ; les 20 % restants (sécurité, paiements, mise en production, publication sur les stores, bugs) demandent de savoir lire et corriger ce qu\'elle produit. Et votre temps de fondateur vaut plus sur la vente que sur le débogage.',
  },
  {
    q: 'Un MVP en 30 jours, c\'est vraiment possible ?',
    a: 'Oui, parce que le périmètre est verrouillé dès la première semaine. Un MVP n\'est pas votre produit final : c\'est la plus petite version capable de prouver que des utilisateurs en veulent. Le rôle du CTO est justement de trouver ce périmètre avec vous.',
  },
  {
    q: 'Qu\'est-ce qui change concrètement avec un CTO cofondateur ?',
    a: 'Vous n\'achetez pas des heures de développement, vous gagnez quelqu\'un qui raisonne comme un associé : il challenge vos idées, coupe le superflu, choisit une architecture qui tiendra la croissance et vous aide à présenter le produit à vos premiers clients ou investisseurs.',
  },
  {
    q: 'Pourquoi 5 000 € au lieu de 10 000 € ?',
    a: 'C\'est une offre de lancement, sur un nombre limité de projets, pour construire avec des fondateurs motivés. Le prix inclut le MVP complet, la landing page et la vidéo motion promo.',
  },
  {
    q: 'À qui appartient le code ?',
    a: 'À vous. Le code source, les comptes d\'hébergement et les accès sont remis à votre nom à la livraison.',
  },
  {
    q: 'Et après les 30 jours ?',
    a: 'Vous êtes libre. Beaucoup de fondateurs continuent avec nous pour la V2, en accompagnement CTO ou en développement continu, mais rien ne vous y oblige.',
  },
  {
    q: 'Mon idée est encore floue, est-ce trop tôt ?',
    a: 'Non. Le premier échange sert justement à clarifier l\'idée, la cible et ce que doit contenir le MVP. Si ce n\'est pas le bon moment, on vous le dira.',
  },
];

/* ─── palette claire ────────────────────────────────── */
const INK = '#0E0E10';
const MUTED = '#62626D';
const FAINT = '#9A9AA5';
const LINE = '#E9E9EC';
const ACCENT_INK = '#5B47F5';
const ACCENT_SOFT = '#EFECFF';
const GREEN = '#16A34A';
const AMBER = '#D97706';
const RED = '#DC2626';

const card: React.CSSProperties = {
  background: '#fff',
  border: `1px solid ${LINE}`,
  borderRadius: 20,
  padding: 28,
  boxShadow: '0 1px 2px rgba(16,16,20,0.04), 0 8px 24px rgba(16,16,20,0.04)',
};

const PAGE_CSS = `
  body { background: #F4F4F5; }
  .mvp-spot { position: relative; overflow: hidden; transition: border-color .35s ease, box-shadow .35s ease; }
  .mvp-spot::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s ease;
    background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(121,103,255,0.07), transparent 45%);
  }
  .mvp-spot:hover { border-color: #D9D4FF !important; box-shadow: 0 1px 2px rgba(16,16,20,0.04), 0 16px 40px rgba(16,16,20,0.07) !important; }
  .mvp-spot:hover::before { opacity: 1; }
  .mvp-marquee { mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
  .mvp-pulse { animation: mvp-pulse 2s ease-out infinite; }
  @keyframes mvp-pulse { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,.45); } 100% { box-shadow: 0 0 0 9px rgba(22,163,74,0); } }
  .mvp-navlink { color: ${MUTED}; font-size: 14px; font-weight: 500; background: none; border: none; cursor: pointer; padding: 6px 2px; transition: color .2s; }
  .mvp-navlink:hover { color: ${INK}; }
  .mvp-video-chip { bottom: 9%; }
  @media (max-width: 720px) {
    .mvp-video-chip { bottom: auto; top: 7%; }
    .mvp-hide-sm { display: none !important; }
    .mvp-mock-main { padding: 14px !important; }
    .mvp-compare-row p { padding: 14px 12px !important; font-size: 13px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mvp-pulse { animation: none; }
  }
`;

/* ─── hooks & primitives d'animation ────────────────── */

// Le loader global masque la page pendant ~1 s à la première visite :
// on attend sa sortie pour que l'entrée du hero soit visible.
function useLoaderGone() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const loader = document.querySelector('.global-loader');
      const leaving = !loader || loader.classList.contains('global-loader--leaving');
      if ((Date.now() - start > 150 && leaving) || Date.now() - start > 2500) {
        setGone(true);
        window.clearInterval(id);
      }
    }, 60);
    return () => window.clearInterval(id);
  }, []);
  return gone;
}

function CountUp({ from = 0, to, duration = 1.6, delay = 0, format = (v: number) => Math.round(v).toLocaleString('fr-FR'), play }: {
  from?: number; to: number; duration?: number; delay?: number; format?: (v: number) => string; play?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const go = play ?? inView;
  useEffect(() => {
    if (!go) return;
    const controls = animate(from, to, {
      duration, delay, ease: EASE,
      onUpdate: v => { if (ref.current) ref.current.textContent = format(v); },
    });
    return () => controls.stop();
  }, [go]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{format(from)}</span>;
}

// `muted` : seconde partie d'un titre en gris. `pill` : mot clé posé dans une pastille teintée.
type Segment = { text: string; muted?: boolean; pill?: boolean; br?: boolean };

const pillStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.02em 0.24em 0.06em',
  margin: '0 0.04em',
  borderRadius: '0.3em',
  background: ACCENT_SOFT,
  color: ACCENT_INK,
  boxShadow: 'inset 0 -0.06em 0 rgba(91,71,245,0.12), 0 1px 2px rgba(16,16,20,0.05)',
};

// Révélation mot par mot, chaque mot remonte derrière un masque.
function Words({ segments, delay = 0, play, stagger = 0.055 }: { segments: Segment[]; delay?: number; play?: boolean; stagger?: number }) {
  let i = 0;
  const trigger = play === undefined
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } }
    : { initial: 'hidden', animate: play ? 'show' : 'hidden' };

  const word = (text: string, color: string | undefined, trailingSpace: boolean) => {
    const index = i++;
    return (
      <span key={index} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
        <motion.span
          variants={{
            hidden: { y: '110%', opacity: 0 },
            show: { y: '0%', opacity: 1, transition: { duration: 0.85, ease: EASE, delay: delay + index * stagger } },
          }}
          style={{ display: 'inline-block', color }}
        >
          {text}
        </motion.span>
        {trailingSpace && ' '}
      </span>
    );
  };

  return (
    <motion.span {...trigger} style={{ display: 'inline' }}>
      {segments.map((seg, s) => {
        const words = seg.text.split(' ').filter(Boolean);
        if (seg.pill) {
          const first = i;
          return (
            <React.Fragment key={s}>
              <motion.span
                variants={{
                  hidden: { opacity: 0, scale: 0.94 },
                  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE, delay: delay + first * stagger } },
                }}
                style={pillStyle}
              >
                {words.map((w, k) => word(w, undefined, k < words.length - 1))}
              </motion.span>
              {seg.br ? <br /> : ' '}
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={s}>
            {words.map(w => word(w, seg.muted ? FAINT : undefined, true))}
            {seg.br && <br />}
          </React.Fragment>
        );
      })}
    </motion.span>
  );
}

function SpotCard({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} className="mvp-spot" {...upView(delay)} whileHover={{ y: -4 }} style={{ ...card, ...style }}>
      <div style={{ position: 'relative' }}>{children}</div>
    </motion.div>
  );
}

function IconTile({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay }}
      style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: '#F6F6F7', border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── maquette produit du hero ──────────────────────── */
function Skel({ w, h = 8, o = 0.08, r = 4 }: { w: number | string; h?: number; o?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: `rgba(14,14,16,${o})` }} />;
}

function ProductMock({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.35 });
  const play = ready && inView;
  const base = 0.15;
  const pop = (d: number) => ({
    initial: { opacity: 0, y: 14, scale: 0.97 },
    animate: play ? { opacity: 1, y: 0, scale: 1 } : {},
    transition: { duration: 0.7, ease: EASE, delay: base + d },
  });
  const bars = [38, 56, 44, 70, 62, 84, 76, 96];
  const kpis = [
    { label: 'Utilisateurs', to: 1284, fmt: (v: number) => Math.round(v).toLocaleString('fr-FR') },
    { label: 'Revenu mensuel', to: 4920, fmt: eur },
    { label: 'Conversion', to: 6.8, fmt: (v: number) => `${v.toFixed(1).replace('.', ',')} %` },
  ];
  const panel: React.CSSProperties = { borderRadius: 12, background: '#fff', border: `1px solid ${LINE}` };
  const chip: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', border: `1px solid ${LINE}`, fontSize: 12, fontWeight: 600, color: INK, boxShadow: '0 12px 30px rgba(16,16,20,0.1)' };

  return (
    <div ref={rootRef} style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>
      {/* navigateur */}
      <motion.div {...pop(0)} style={{ borderRadius: 18, overflow: 'hidden', background: '#FAFAFB', border: `1px solid ${LINE}`, boxShadow: '0 2px 4px rgba(16,16,20,0.04), 0 40px 100px rgba(16,16,20,0.12)', color: INK }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${LINE}`, background: '#fff' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ padding: '5px 14px', borderRadius: 8, background: '#F4F4F5', fontSize: 11, color: MUTED }}>app.votre-startup.com</span>
          </div>
        </div>

        <div style={{ display: 'flex', minHeight: 360 }}>
          <motion.aside {...pop(0.15)} className="mvp-hide-sm" style={{ width: 170, padding: 18, borderRight: `1px solid ${LINE}`, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: INK }} />
              <Skel w={70} h={9} o={0.16} />
            </div>
            {[0, 1, 2, 3, 4].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, background: n === 0 ? ACCENT_SOFT : 'transparent' }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: n === 0 ? ACCENT : 'rgba(14,14,16,0.12)' }} />
                <Skel w={[64, 54, 72, 48, 60][n]} o={n === 0 ? 0.2 : 0.08} />
              </div>
            ))}
          </motion.aside>

          <div className="mvp-mock-main" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
            <motion.div {...pop(0.2)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700 }}>Tableau de bord</p>
                <p style={{ fontSize: 11, color: FAINT, marginTop: 3 }}>Vos premiers utilisateurs, en temps réel</p>
              </div>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#F2C9A8', border: '2px solid #fff', boxShadow: `0 0 0 1px ${LINE}` }} />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {kpis.map((k, i) => (
                <motion.div key={k.label} {...pop(0.3 + i * 0.1)} style={{ ...panel, padding: 14 }}>
                  <p style={{ fontSize: 10, color: FAINT, marginBottom: 6 }}>{k.label}</p>
                  <p style={{ fontSize: 'clamp(13px, 2vw, 19px)', fontWeight: 700 }}>
                    <CountUp to={k.to} format={k.fmt} duration={2} delay={base + 0.45 + i * 0.1} play={play} />
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div {...pop(0.55)} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12, minHeight: 170 }}>
              <div style={{ ...panel, position: 'relative', padding: 14, overflow: 'hidden' }}>
                <p style={{ fontSize: 10, color: FAINT }}>Inscriptions</p>
                <svg viewBox="0 0 300 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '75%' }}>
                  <motion.path
                    d="M0 100 C 30 95, 50 88, 75 80 S 120 82, 150 62 S 210 50, 235 34 S 280 18, 300 10 L 300 120 L 0 120 Z"
                    fill={ACCENT_SOFT}
                    initial={{ opacity: 0 }}
                    animate={play ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: base + 1.6 }}
                  />
                  <motion.path
                    d="M0 100 C 30 95, 50 88, 75 80 S 120 82, 150 62 S 210 50, 235 34 S 280 18, 300 10"
                    fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={play ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.8, ease: EASE, delay: base + 0.7 }}
                  />
                </svg>
              </div>
              <div style={{ ...panel, padding: 14, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 10, color: FAINT }}>Activité</p>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 12 }}>
                  {bars.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={play ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.8, ease: EASE, delay: base + 0.8 + i * 0.07 }}
                      style={{ flex: 1, height: `${h}%`, borderRadius: 4, transformOrigin: 'bottom', background: i === bars.length - 1 ? INK : '#E4E4E8' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* téléphone */}
      <motion.div
        className="mvp-hide-sm"
        initial={{ opacity: 0, y: 60, rotate: 4 }}
        animate={play ? { opacity: 1, y: 0, rotate: 0 } : {}}
        transition={{ duration: 1, ease: EASE, delay: base + 0.5 }}
        style={{ position: 'absolute', right: -28, bottom: -48, width: 190, borderRadius: 30, padding: 6, background: '#1A1A1D', boxShadow: '0 30px 70px rgba(16,16,20,0.25)' }}
      >
        <div style={{ borderRadius: 25, overflow: 'hidden', background: '#fff', padding: '14px 12px 10px', textAlign: 'left', color: INK }}>
          <div style={{ width: 54, height: 14, borderRadius: 8, background: '#1A1A1D', margin: '-6px auto 12px' }} />
          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Mon espace</p>
          <div style={{ borderRadius: 12, padding: 12, marginBottom: 10, background: INK, color: '#fff' }}>
            <p style={{ fontSize: 9, opacity: 0.6 }}>Ce mois-ci</p>
            <p style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
              <CountUp to={4920} format={eur} duration={2} delay={base + 1} play={play} />
            </p>
          </div>
          {[0, 1, 2, 3].map(n => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: 16 }}
              animate={play ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: base + 1.1 + n * 0.12 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1px solid ${LINE}` }}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: ['#FCD9B8', '#C7F0D2', '#C9E7FB', '#FBD3E6'][n] }} />
              <div style={{ flex: 1, display: 'grid', gap: 4 }}>
                <Skel w="70%" h={6} o={0.16} />
                <Skel w="45%" h={5} o={0.07} />
              </div>
            </motion.div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 10 }}>
            {[0, 1, 2].map(n => <span key={n} style={{ width: 14, height: 14, borderRadius: 5, background: n === 0 ? INK : '#E4E4E8' }} />)}
          </div>
        </div>
      </motion.div>

      {/* pastilles de progression */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={play ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: base + 0.3 }}
        style={{ position: 'absolute', top: 64, left: -24, zIndex: 2 }}
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={chip}>
          <Clock size={14} color={ACCENT_INK} />
          <span>Jour <CountUp from={1} to={OFFER.days} duration={2.6} delay={base + 0.6} play={play} />/{OFFER.days}</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={play ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: base + 3.2 }}
        style={{ position: 'absolute', bottom: 28, left: -18, zIndex: 2 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={chip}>
          <span className="mvp-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
          En ligne · premiers utilisateurs
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── boutons ───────────────────────────────────────── */
function CtaButton({ children, href = WHATSAPP_URL, big = false }: { children: React.ReactNode; href?: string; big?: boolean }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      whileHover={{ y: -2, boxShadow: '0 14px 30px rgba(16,16,20,0.25)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: big ? '17px 30px' : '14px 24px', borderRadius: 999,
        background: INK, color: '#fff', fontSize: big ? 16 : 15, fontWeight: 600, textDecoration: 'none',
        boxShadow: '0 6px 18px rgba(16,16,20,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {children}
    </motion.a>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 10px 24px rgba(16,16,20,0.08)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 26px', borderRadius: 999,
        background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.05)',
        color: INK, fontSize: 15, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── blocs ─────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.span {...upView()} style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 8, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.04)', fontSize: 12, fontWeight: 600, color: INK, marginBottom: 18 }}>
      {children}
    </motion.span>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: Segment[]; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.1rem)', lineHeight: 1.08, letterSpacing: '-0.025em', color: INK, marginBottom: sub ? 16 : 0 }}>
        <Words segments={title} />
      </h2>
      {sub && <motion.p {...upView(0.25)} style={{ fontSize: 17, lineHeight: 1.7, color: MUTED, maxWidth: 620, margin: '0 auto' }}>{sub}</motion.p>}
    </div>
  );
}

function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ position: 'relative', padding: '96px 24px', borderTop: `1px solid ${LINE}`, ...style }}>
      {children}
    </section>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...upView(index * 0.05)} style={{ borderBottom: `1px solid ${LINE}` }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: INK }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ display: 'flex', flexShrink: 0, color: FAINT }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: 15, lineHeight: 1.7, color: MUTED, paddingBottom: 22 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StruckPrice({ play, delay, size }: { play: boolean; delay: number; size: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontSize: size, color: FAINT }}>
      {eur(OFFER.originalPrice)}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={play ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay }}
        style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 2, background: RED, transformOrigin: 'left', borderRadius: 2 }}
      />
    </span>
  );
}

function AgentTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const step = 0.55;
  return (
    <motion.div
      ref={ref}
      {...upView(0.1)}
      style={{ borderRadius: 18, overflow: 'hidden', background: '#111113', border: '1px solid #1F1F23', boxShadow: '0 2px 4px rgba(16,16,20,0.06), 0 30px 70px rgba(16,16,20,0.18)', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>votre-mvp — workflow</span>
      </div>
      <div style={{ padding: '18px 20px 22px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, lineHeight: 1.6, display: 'grid', gap: 10 }}>
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * step }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
          >
            <span style={{ color: line.color, minWidth: 52, flexShrink: 0 }}>{line.who} ›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', flex: 1 }}>{line.text}</span>
            {line.ok && (
              <motion.span
                initial={{ opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.3 + i * step + 0.35 }}
                style={{ color: '#4ADE80', flexShrink: 0 }}
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 1, 1, 0] } : {}}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 + TERMINAL_LINES.length * step }}
          style={{ width: 8, height: 15, background: 'rgba(255,255,255,0.7)', display: 'inline-block' }}
        />
      </div>
    </motion.div>
  );
}

function ProgressRace() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const rows = [
    { label: 'Seul avec Claude, ChatGPT ou Cursor', to: 80, color: AMBER, fill: '#F59E0B', end: 'Bloqué à 80 %', icon: AlertTriangle, duration: 1.4, stall: true },
    { label: 'Avec un CTO qui pilote l\'IA', to: 100, color: GREEN, fill: INK, end: `En ligne en ${OFFER.days} jours`, icon: Rocket, duration: 2.6, stall: false },
  ];
  return (
    <div ref={ref} style={{ display: 'grid', gap: 28 }}>
      {rows.map((row, i) => (
        <div key={row.label}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: i === 0 ? MUTED : INK }}>{row.label}</p>
            <p style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: i === 0 ? AMBER : INK }}>
              <CountUp to={row.to} duration={row.duration} delay={0.2 + i * 0.3} play={inView} />%
            </p>
          </div>
          <motion.div
            animate={inView && row.stall ? { x: [0, -4, 4, -3, 3, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.2 + row.duration + 0.1 }}
            style={{ height: 10, borderRadius: 999, background: '#F0F0F2', overflow: 'hidden' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={inView ? { width: `${row.to}%` } : {}}
              transition={{ duration: row.duration, ease: row.stall ? [0.1, 0.9, 0.2, 1] : EASE, delay: 0.2 + i * 0.3 }}
              style={{ height: '100%', borderRadius: 999, background: row.fill }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.3 + row.duration }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 13, fontWeight: 600, color: row.color }}
          >
            <row.icon size={14} /> {row.end}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

function VideoPosterArt() {
  return (
    <motion.div
      variants={{ rest: { scale: 1 }, hover: { scale: 1.025 } }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ position: 'absolute', inset: 0, background: '#111113', color: '#fff' }}
    >
      <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
        <defs>
          <pattern id="mvp-video-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0 L0 0 0 44" fill="none" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mvp-video-grid)" />
      </svg>
      <span aria-hidden style={{ position: 'absolute', right: '4%', bottom: '-12%', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(140px, 30vw, 340px)', lineHeight: 1, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.05)' }}>
        {OFFER.days}
      </span>
      <div className="mvp-hide-sm" style={{ position: 'absolute', top: '9%', left: '6%', right: '6%' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>Ozirus · Offre MVP</p>
        <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(20px, 4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          Votre MVP en {OFFER.days} jours,
          <br />
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>avec un CTO cofondateur.</span>
        </p>
      </div>
      <div style={{ position: 'absolute', left: '6%', bottom: '9%', display: 'flex', alignItems: 'center', gap: 12 }}>
        {VIDEO.photo ? (
          <img src={VIDEO.photo} alt="Wilfried Fotie" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
        ) : (
          <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT_SOFT, color: ACCENT_INK, fontSize: 15, fontWeight: 700 }}>WF</span>
        )}
        <div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Wilfried Fotie</p>
          <p className="mvp-hide-sm" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>CTO cofondateur · {OFFER.years} ans d&apos;expérience</p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [soon, setSoon] = useState(false);
  const hasVideo = Boolean(VIDEO.src || VIDEO.youtubeId);

  const play = () => {
    if (hasVideo) { setPlaying(true); return; }
    setSoon(true);
    window.setTimeout(() => setSoon(false), 2600);
  };

  return (
    <Section id="video">
      <SectionHead
        eyebrow="En vidéo"
        title={[{ text: 'Je vous explique tout,' }, { text: 'en quelques minutes.', muted: true }]}
        sub={`Qui je suis, comment je travaille avec l'IA, et ce que vous obtenez en ${OFFER.days} jours.`}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: EASE }}
        style={{ maxWidth: 980, margin: '0 auto', padding: 10, borderRadius: 30, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 2px 4px rgba(16,16,20,0.04), 0 40px 100px rgba(16,16,20,0.12)' }}
      >
        <div style={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 22, overflow: 'hidden', background: '#111113' }}>
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0 }}>
                {VIDEO.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${VIDEO.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title="Présentation de l'offre MVP"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 0 }}
                  />
                ) : (
                  <video src={VIDEO.src} poster={VIDEO.poster || undefined} controls autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                )}
              </motion.div>
            ) : (
              <motion.button
                key="poster"
                onClick={play}
                aria-label="Lire la vidéo"
                initial="rest"
                animate="rest"
                whileHover="hover"
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                {VIDEO.poster
                  ? <img src={VIDEO.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <VideoPosterArt />}

                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'relative', width: 'clamp(64px, 9vw, 88px)', aspectRatio: '1' }}>
                    {[0, 1.2].map(delay => (
                      <motion.span
                        key={delay}
                        aria-hidden
                        animate={{ scale: [1, 1.75], opacity: [0.5, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay }}
                        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.6)' }}
                      />
                    ))}
                    <motion.span
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.1 } }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                      style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}
                    >
                      <Play size={28} fill={INK} color={INK} style={{ marginLeft: 4 }} />
                    </motion.span>
                  </span>
                </span>

                <span className="mvp-video-chip" style={{ position: 'absolute', right: '4%', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  {hasVideo ? <><Play size={11} fill="#fff" /> {VIDEO.duration || 'Regarder'}</> : 'Bientôt disponible'}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {soon && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ position: 'absolute', top: 16, left: '50%', translateX: '-50%', padding: '10px 16px', borderRadius: 12, background: '#fff', color: INK, fontSize: 14, fontWeight: 600, boxShadow: '0 12px 30px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}
              >
                La vidéo arrive très bientôt.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {VIDEO.chapters.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 28 }}>
          {VIDEO.chapters.map((chapter, i) => (
            <motion.span
              key={chapter}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.08 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, fontSize: 14, color: INK }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: FAINT, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
              {chapter}
            </motion.span>
          ))}
        </div>
      )}
    </Section>
  );
}

const openContact = () => window.dispatchEvent(new Event('ozirus:open-contact-modal'));

/* ─── page ─────────────────────────────────────────── */
export default function MvpOfferPage() {
  const ready = useLoaderGone();
  const lenisRef = useRef<Lenis | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const offerInView = useInView(offerRef, { once: true, margin: '-120px' });

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const mockTilt = useTransform(heroProgress, [0, 0.6], [12, 0]);
  const mockScale = useTransform(heroProgress, [0, 0.6], [0.94, 1]);
  const heroFade = useTransform(heroProgress, [0, 0.5], [1, 0.35]);

  const { scrollYProgress: timelineProgress } = useScroll({ target: timelineRef, offset: ['start 80%', 'end 60%'] });
  const timelineFill = useSpring(timelineProgress, { stiffness: 90, damping: 25 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null; };
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -20, duration: 1.6 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  const heroItem = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {},
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <MotionConfig reducedMotion="user">
      <style>{PAGE_CSS}</style>
      <main style={{ position: 'relative', background: '#F4F4F5', color: INK, minHeight: '100vh', overflowX: 'clip' }}>

        <motion.div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60, background: INK, transformOrigin: 'left', scaleX: progress }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', background: '#FCFCFC', borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }}>

          {/* ── NAV FLOTTANTE ── */}
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ position: 'sticky', top: 14, zIndex: 50, padding: '14px 16px 0' }}
          >
            <div style={{ maxWidth: 760, margin: '0 auto', height: 58, padding: '0 8px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderRadius: 16, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.04), 0 10px 30px rgba(16,16,20,0.06)' }}>
              <a href="https://ozirus.agency" aria-label="Ozirus Agency" style={{ display: 'flex' }}>
                <img src="/logo.png" alt="Ozirus" style={{ height: 24, filter: 'brightness(0)' }} />
              </a>
              <nav className="mvp-hide-sm" style={{ display: 'flex', gap: 22 }}>
                {[['video', 'Vidéo'], ['methode', 'Méthode'], ['ia', 'Et Claude ?'], ['offre', 'Offre'], ['faq', 'FAQ']].map(([id, label]) => (
                  <button key={id} className="mvp-navlink" onClick={() => scrollTo(id)}>{label}</button>
                ))}
              </nav>
              <motion.button
                onClick={() => scrollTo('offre')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 11, background: INK, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Voir l&apos;offre
              </motion.button>
            </div>
          </motion.header>

          {/* ── HERO ── */}
          <section ref={heroRef} style={{ position: 'relative', padding: '72px 24px 120px' }}>
            <motion.div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', textAlign: 'center', opacity: heroFade }}>
              <motion.button
                {...heroItem(0)}
                onClick={() => scrollTo('offre')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '5px 12px 5px 5px', borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.04)', fontSize: 13, fontWeight: 500, color: INK, marginBottom: 28, cursor: 'pointer' }}
              >
                <span style={{ padding: '3px 9px', borderRadius: 999, background: INK, color: '#fff', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>Offre -50 %</span>
                <span style={{ whiteSpace: 'nowrap' }}>{OFFER.days} jours chrono<span className="mvp-hide-sm"> · {OFFER.years} ans d&apos;expérience</span></span>
                <ArrowRight size={13} color={FAINT} />
              </motion.button>

              <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.06, letterSpacing: '-0.035em', color: INK, marginBottom: 24 }}>
                <Words
                  play={ready}
                  delay={0.1}
                  stagger={0.07}
                  segments={[
                    { text: `Votre MVP en ${OFFER.days} jours,`, br: true },
                    { text: 'avec un' },
                    { text: 'CTO cofondateur', pill: true },
                  ]}
                />
              </h1>

              <motion.p {...heroItem(0.55)} style={{ fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.7, color: MUTED, maxWidth: 640, margin: '0 auto 36px' }}>
                SaaS, application mobile, desktop ou produit IA : je construis votre MVP comme si c&apos;était le mien.
                Pas un prestataire de plus, <strong style={{ color: INK, fontWeight: 600 }}>un associé technique pendant {OFFER.days} jours</strong>, avec {OFFER.years} ans
                de produits livrés et une méthode augmentée par l&apos;IA.
              </motion.p>

              <motion.div {...heroItem(0.7)} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
                <CtaButton big>
                  <Sparkles size={17} /> Réserver mon MVP
                </CtaButton>
                <SecondaryButton onClick={() => scrollTo('offre')}>
                  Voir ce qui est inclus
                </SecondaryButton>
              </motion.div>

              <motion.div {...heroItem(0.85)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 600, letterSpacing: '-0.02em', minWidth: '4.6em', textAlign: 'right' }}>
                  <CountUp from={OFFER.originalPrice} to={OFFER.price} format={eur} duration={1.6} delay={1.1} play={ready} />
                </span>
                <StruckPrice play={ready} delay={2.5} size={21} />
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={ready ? { opacity: 1, scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 2.8 }}
                  style={{ padding: '5px 11px', borderRadius: 8, background: '#DCFCE7', color: GREEN, fontSize: 13, fontWeight: 700 }}
                >
                  -50 %
                </motion.span>
              </motion.div>
              <motion.p {...heroItem(1)} style={{ fontSize: 14, color: FAINT, marginTop: 10 }}>
                + Landing page et vidéo motion promo offertes
              </motion.p>
            </motion.div>

            <div style={{ position: 'relative', maxWidth: 960, margin: '80px auto 0', perspective: 1400 }}>
              <motion.div style={{ rotateX: mockTilt, scale: mockScale, transformOrigin: 'center top' }}>
                <ProductMock ready={ready} />
              </motion.div>
            </div>
          </section>

          {/* ── CHIFFRES & STACK ── */}
          <section style={{ padding: '56px 24px 64px', borderTop: `1px solid ${LINE}` }}>
            <div style={{ maxWidth: 1000, margin: '0 auto 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { node: <><CountUp to={OFFER.years} /> ans</>, label: 'à concevoir et livrer des produits' },
                { node: <><CountUp to={15} />+</>, label: 'applications déployées en production' },
                { node: <><CountUp to={OFFER.days} /> jours</>, label: 'de l\'idée au produit en ligne' },
                { node: <CountUp to={1} duration={0.8} />, label: 'interlocuteur : le CTO, du début à la fin' },
              ].map((s, i) => (
                <SpotCard key={s.label} delay={i * 0.08} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', color: INK }}>{s.node}</p>
                  <p style={{ fontSize: 14, color: MUTED, marginTop: 6, lineHeight: 1.5 }}>{s.label}</p>
                </SpotCard>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: FAINT, marginBottom: 22 }}>Des technologies éprouvées, choisies pour votre produit</p>
            <div className="mvp-marquee" style={{ overflow: 'hidden' }}>
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', width: 'max-content', gap: 56 }}
              >
                {[...STACK, ...STACK].map((tech, i) => (
                  <span key={i} style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', color: '#B4B4BC', whiteSpace: 'nowrap' }}>{tech}</span>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── VIDÉO ── */}
          <VideoSection />

          {/* ── POURQUOI UN CTO ── */}
          <Section>
            <SectionHead
              eyebrow="La vraie différence"
              title={[{ text: 'Un CTO cofondateur change' }, { text: 'radicalement un MVP.', muted: true }]}
              sub="La plupart des MVP ratés ne le sont pas à cause du code, mais des décisions prises avant. C'est là qu'un CTO fait toute la différence."
            />

            <div style={{ maxWidth: 1000, margin: '0 auto 64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {CTO_POINTS.map((p, i) => (
                <SpotCard key={p.title} delay={i * 0.08}>
                  <IconTile delay={0.2 + i * 0.08}><p.icon size={20} color={INK} /></IconTile>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTED }}>{p.desc}</p>
                </SpotCard>
              ))}
            </div>

            <motion.div {...upView()} style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, overflow: 'hidden', background: '#fff', border: `1px solid ${LINE}`, boxShadow: card.boxShadow }}>
              <div className="mvp-compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#FAFAFB' }}>
                <p style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Un prestataire classique</p>
                <p style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: ACCENT_INK, textTransform: 'uppercase', letterSpacing: '0.06em', background: ACCENT_SOFT }}>Un CTO cofondateur</p>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.cto} className="mvp-compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${LINE}` }}>
                  <motion.p
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={T(0.1 + i * 0.12)}
                    style={{ display: 'flex', gap: 10, padding: '16px 20px', fontSize: 14, lineHeight: 1.55, color: FAINT }}
                  >
                    <X size={16} style={{ flexShrink: 0, marginTop: 2, color: RED, opacity: 0.7 }} /> {row.freelance}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={T(0.25 + i * 0.12)}
                    style={{ display: 'flex', gap: 10, padding: '16px 20px', fontSize: 14, lineHeight: 1.55, color: INK, background: '#FBFAFF' }}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.45 + i * 0.12 }}
                      style={{ display: 'flex', flexShrink: 0, marginTop: 2 }}
                    >
                      <CheckCircle2 size={16} color={GREEN} />
                    </motion.span>
                    {row.cto}
                  </motion.p>
                </div>
              ))}
            </motion.div>
          </Section>

          {/* ── MÉTHODE IA ── */}
          <Section id="methode">
            <SectionHead
              eyebrow="Ma méthode"
              title={[{ text: 'Un CTO' }, { text: 'augmenté par l\'IA.', muted: true }]}
              sub={`C'est ce qui rend les ${OFFER.days} jours possibles : l'IA apporte la vitesse, ${OFFER.years} ans d'expérience apportent le jugement.`}
            />
            <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div style={{ display: 'grid', gap: 22 }}>
                {AI_METHOD.map((m, i) => (
                  <motion.div key={m.title} {...upView(i * 0.1)} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: '#fff', border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <m.icon size={19} color={INK} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{m.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTED }}>{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <AgentTerminal />
            </div>
          </Section>

          {/* ── ET CLAUDE ? ── */}
          <Section id="ia">
            <SectionHead
              eyebrow="La question qu'on me pose"
              title={[{ text: 'Pourquoi ne pas juste' }, { text: 'le faire avec Claude ?', muted: true }]}
              sub="Claude est excellent : je l'utilise tous les jours. Mais un outil qui écrit du code ne remplace pas quelqu'un qui sait quoi construire, et comment le mettre en production."
            />
            <div style={{ maxWidth: 820, margin: '0 auto' }}>
              <motion.div {...upView()} style={{ ...card, padding: 'clamp(24px, 4vw, 40px)', marginBottom: 40 }}>
                <ProgressRace />
              </motion.div>

              <motion.p {...upView()} style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 18 }}>
                Les 20 % où les projets meurent
              </motion.p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
                {LAST_20.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.07 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 15px', borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.04)', fontSize: 14, color: INK }}
                  >
                    <AlertTriangle size={14} color={AMBER} /> {item}
                  </motion.span>
                ))}
              </div>

              <motion.div {...upView()} style={{ ...card, borderLeft: `3px solid ${INK}`, padding: '28px 32px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: FAINT, marginBottom: 10 }}>Mon conseil honnête</p>
                <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.7, color: MUTED }}>
                  Pour tester une idée en un week-end, lancez-vous seul avec Claude. Pour un produit que de vrais clients vont payer,
                  {' '}<strong style={{ color: INK, fontWeight: 600 }}>entourez-vous de quelqu&apos;un qui sait lire, corriger et assumer ce que l&apos;IA produit.</strong>
                </p>
              </motion.div>
            </div>
          </Section>

          {/* ── PLATEFORMES ── */}
          <Section>
            <SectionHead
              eyebrow="Ce qu'on construit"
              title={[{ text: 'SaaS, mobile, desktop.' }, { text: 'Même délai.', muted: true }]}
              sub="Le format suit votre marché, pas l'inverse. Dans tous les cas, votre produit est en ligne en 30 jours."
            />
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {PLATFORMS.map((p, i) => (
                <SpotCard key={p.title} delay={i * 0.08}>
                  <IconTile delay={0.25 + i * 0.08}><p.icon size={20} color={INK} /></IconTile>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTED }}>{p.desc}</p>
                </SpotCard>
              ))}
            </div>
          </Section>

          {/* ── 30 JOURS ── */}
          <Section>
            <SectionHead
              eyebrow="30 jours chrono"
              title={[{ text: 'De l\'idée au lancement,' }, { text: 'semaine par semaine.', muted: true }]}
            />
            <div ref={timelineRef} style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
              <div aria-hidden className="mvp-hide-sm" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: 2, background: LINE, overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: INK, transformOrigin: 'left', scaleX: timelineFill }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 26 }}>
                {TIMELINE.map((step, i) => {
                  const last = i === TIMELINE.length - 1;
                  return (
                    <SpotCard key={step.title} delay={i * 0.12}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: FAINT }}>{step.days}</p>
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.3 + i * 0.12 }}
                          style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: last ? INK : '#F4F4F5', color: last ? '#fff' : INK, border: last ? 'none' : `1px solid ${LINE}` }}
                        >
                          {last ? <Rocket size={13} /> : i + 1}
                        </motion.span>
                      </div>
                      <h3 style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8 }}>{step.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTED }}>{step.desc}</p>
                    </SpotCard>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* ── OFFRE ── */}
          <Section id="offre" style={{ padding: '104px 24px' }}>
            <SectionHead eyebrow="L'offre" title={[{ text: 'Tout ce qu\'il faut' }, { text: 'pour lancer.', muted: true }]} />

            <motion.div
              ref={offerRef}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ ...card, maxWidth: 760, margin: '0 auto', borderRadius: 28, padding: 'clamp(28px, 5vw, 48px)', boxShadow: '0 2px 4px rgba(16,16,20,0.04), 0 30px 80px rgba(16,16,20,0.1)' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>MVP en {OFFER.days} jours</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <StruckPrice play={offerInView} delay={0.5} size={18} />
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={offerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
                    style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em' }}
                  >
                    {eur(OFFER.price)}
                  </motion.span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: FAINT, marginBottom: 32 }}>Forfait unique, HT. Prix de lancement, nombre de projets limité.</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'grid', gap: 14 }}>
                {INCLUDED.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={offerInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.08 }}
                    style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}
                  >
                    <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} /> {item}
                  </motion.li>
                ))}
              </ul>

              <div style={{ borderTop: `1px dashed ${LINE}`, paddingTop: 28, marginBottom: 36 }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: INK, marginBottom: 16 }}>
                  <motion.span
                    animate={offerInView ? { rotate: [0, -14, 12, -8, 0] } : {}}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    style={{ display: 'flex' }}
                  >
                    <Gift size={16} color={AMBER} />
                  </motion.span>
                  Bonus offerts
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  {BONUSES.map((b, i) => (
                    <motion.div
                      key={b.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={offerInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, ease: EASE, delay: 1.2 + i * 0.12 }}
                      whileHover={{ y: -3 }}
                      style={{ position: 'relative', borderRadius: 16, padding: 20, background: '#FFFBF0', border: '1px solid #FDE7B0' }}
                    >
                      <span style={{ position: 'absolute', top: 14, right: 14, padding: '3px 8px', borderRadius: 6, background: '#FEF3C7', color: '#B45309', fontSize: 11, fontWeight: 600 }}>Offert</span>
                      <b.icon size={21} color={AMBER} style={{ marginBottom: 12 }} />
                      <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{b.title}</p>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: MUTED }}>{b.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <CtaButton big>
                  <MessageCircle size={18} /> Réserver mon MVP sur WhatsApp
                </CtaButton>
                <SecondaryButton onClick={openContact}>Écrire un message</SecondaryButton>
              </div>
            </motion.div>
          </Section>

          {/* ── FAQ ── */}
          <Section id="faq">
            <SectionHead eyebrow="Questions" title={[{ text: 'Avant de' }, { text: 'vous lancer.', muted: true }]} />
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {FAQS.map((f, i) => <FaqItem key={f.q} index={i} {...f} />)}
            </div>
          </Section>

          {/* ── CTA FINAL ── */}
          <Section style={{ padding: '120px 24px', textAlign: 'center' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: 20 }}>
                <Words segments={[{ text: `Dans ${OFFER.days} jours,` }, { text: 'votre produit est en ligne.', muted: true }]} />
              </h2>
              <motion.p {...upView(0.4)} style={{ fontSize: 17, lineHeight: 1.7, color: MUTED, marginBottom: 34 }}>
                Parlez-moi de votre idée. On voit ensemble si elle tient en {OFFER.days} jours, et ce que doit contenir votre MVP.
              </motion.p>
              <motion.div {...upView(0.55)}>
                <CtaButton big>
                  Démarrer mon MVP à {eur(OFFER.price)} <ArrowRight size={18} />
                </CtaButton>
              </motion.div>
              <motion.p {...upView(0.7)} style={{ fontSize: 13, color: FAINT, marginTop: 18 }}>
                Ou par email : <a href={`mailto:${OFFER.email}`} style={{ color: INK }}>{OFFER.email}</a>
              </motion.p>
            </div>
          </Section>

          <footer style={{ padding: '32px 24px', borderTop: `1px solid ${LINE}`, textAlign: 'center' }}>
            <a href="https://ozirus.agency">
              <img src="/logo.png" alt="Ozirus" style={{ height: 20, filter: 'brightness(0)', opacity: 0.35 }} />
            </a>
            <p style={{ fontSize: 12, color: FAINT, marginTop: 12 }}>© {new Date().getFullYear()} Ozirus Agency</p>
          </footer>
        </div>
      </main>
    </MotionConfig>
  );
}
