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

const FAQS = [
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

/* ─── styles partagés ───────────────────────────────── */
const gradientText: React.CSSProperties = {
  background: 'linear-gradient(120deg, #7967FF 0%, #B9A9FF 45%, #7967FF 90%)',
  backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 28,
};

const PAGE_CSS = `
  .mvp-spot { position: relative; overflow: hidden; transition: border-color .35s ease, background .35s ease; }
  .mvp-spot::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s ease;
    background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(121,103,255,0.16), transparent 45%);
  }
  .mvp-spot:hover { border-color: rgba(121,103,255,0.35) !important; }
  .mvp-spot:hover::before { opacity: 1; }
  .mvp-marquee { mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
  .mvp-shimmer { animation: mvp-shimmer 6s ease-in-out infinite; }
  @keyframes mvp-shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  .mvp-pulse { animation: mvp-pulse 2s ease-out infinite; }
  @keyframes mvp-pulse { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,.55); } 100% { box-shadow: 0 0 0 10px rgba(74,222,128,0); } }
  @media (max-width: 720px) {
    .mvp-hide-sm { display: none !important; }
    .mvp-mock-main { padding: 14px !important; }
    .mvp-compare-row p { padding: 14px 12px !important; font-size: 13px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mvp-shimmer, .mvp-pulse { animation: none; }
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

type Segment = { text: string; gradient?: boolean; br?: boolean };

// Révélation mot par mot, chaque mot remonte derrière un masque.
function Words({ segments, delay = 0, play, stagger = 0.055 }: { segments: Segment[]; delay?: number; play?: boolean; stagger?: number }) {
  let i = 0;
  const trigger = play === undefined
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } }
    : { initial: 'hidden', animate: play ? 'show' : 'hidden' };
  return (
    <motion.span {...trigger} style={{ display: 'inline' }}>
      {segments.map((seg, s) => (
        <React.Fragment key={s}>
          {seg.text.split(' ').filter(Boolean).map(word => {
            const index = i++;
            return (
              <span key={`${s}-${index}`} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
                <motion.span
                  className={seg.gradient ? 'mvp-shimmer' : undefined}
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    show: { y: '0%', opacity: 1, transition: { duration: 0.85, ease: EASE, delay: delay + index * stagger } },
                  }}
                  style={{ display: 'inline-block', ...(seg.gradient ? gradientText : null) }}
                >
                  {word}
                </motion.span>
                {' '}
              </span>
            );
          })}
          {seg.br && <br />}
        </React.Fragment>
      ))}
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

/* ─── fonds ─────────────────────────────────────────── */
const LineGrid = ({ opacity = 0.05 }: { opacity?: number }) => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, maskImage: 'radial-gradient(ellipse at 50% 30%, #000 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, #000 20%, transparent 70%)' }}>
    <defs>
      <pattern id="lines-mvp" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0 L0 0 0 48" fill="none" stroke={ACCENT} strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lines-mvp)" />
  </svg>
);

function Aurora() {
  const blobs = [
    { color: 'rgba(121,103,255,0.28)', size: 620, top: -220, left: '18%', x: [0, 80, -40, 0], y: [0, 40, 90, 0], d: 22 },
    { color: 'rgba(56,189,248,0.12)', size: 520, top: -120, left: '58%', x: [0, -70, 30, 0], y: [0, 70, 20, 0], d: 26 },
    { color: 'rgba(167,139,250,0.16)', size: 440, top: 260, left: '40%', x: [0, 50, -60, 0], y: [0, -40, 30, 0], d: 30 },
  ];
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: b.top, left: b.left, width: b.size, height: b.size, marginLeft: -b.size / 2, borderRadius: '50%', background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`, filter: 'blur(20px)' }}
        />
      ))}
    </div>
  );
}

/* ─── maquette produit du hero ──────────────────────── */
function Skel({ w, h = 8, o = 0.12, r = 4 }: { w: number | string; h?: number; o?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: `rgba(255,255,255,${o})` }} />;
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

  return (
    <div ref={rootRef} style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>
      {/* navigateur */}
      <motion.div {...pop(0)} style={{ borderRadius: 18, overflow: 'hidden', background: 'linear-gradient(180deg, #14131E 0%, #0E0D16 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(121,103,255,0.08), 0 0 80px rgba(121,103,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ padding: '5px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>app.votre-startup.com</span>
          </div>
        </div>

        <div style={{ display: 'flex', minHeight: 360 }}>
          <motion.aside {...pop(0.15)} className="mvp-hide-sm" style={{ width: 170, padding: 18, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: `linear-gradient(135deg, ${ACCENT}, #A78BFA)` }} />
              <Skel w={70} h={9} o={0.25} />
            </div>
            {[0, 1, 2, 3, 4].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, background: n === 0 ? 'rgba(121,103,255,0.14)' : 'transparent' }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: n === 0 ? ACCENT : 'rgba(255,255,255,0.14)' }} />
                <Skel w={[64, 54, 72, 48, 60][n]} o={n === 0 ? 0.35 : 0.12} />
              </div>
            ))}
          </motion.aside>

          <div className="mvp-mock-main" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
            <motion.div {...pop(0.2)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700 }}>Tableau de bord</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Vos premiers utilisateurs, en temps réel</p>
              </div>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }} />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {kpis.map((k, i) => (
                <motion.div key={k.label} {...pop(0.3 + i * 0.1)} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{k.label}</p>
                  <p style={{ fontSize: 'clamp(13px, 2vw, 19px)', fontWeight: 700 }}>
                    <CountUp to={k.to} format={k.fmt} duration={2} delay={base + 0.45 + i * 0.1} play={play} />
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div {...pop(0.55)} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12, minHeight: 170 }}>
              <div style={{ position: 'relative', padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>Inscriptions</p>
                <svg viewBox="0 0 300 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '75%' }}>
                  <defs>
                    <linearGradient id="mvp-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 100 C 30 95, 50 88, 75 80 S 120 82, 150 62 S 210 50, 235 34 S 280 18, 300 10 L 300 120 L 0 120 Z"
                    fill="url(#mvp-area)"
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
              <div style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>Activité</p>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 12 }}>
                  {bars.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={play ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.8, ease: EASE, delay: base + 0.8 + i * 0.07 }}
                      style={{ flex: 1, height: `${h}%`, borderRadius: 4, transformOrigin: 'bottom', background: i === bars.length - 1 ? ACCENT : 'rgba(121,103,255,0.35)' }}
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
        style={{ position: 'absolute', right: -28, bottom: -48, width: 190, borderRadius: 30, padding: 7, background: '#1B1A24', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
      >
        <div style={{ borderRadius: 24, overflow: 'hidden', background: '#0E0D16', padding: '14px 12px 10px', textAlign: 'left' }}>
          <div style={{ width: 54, height: 14, borderRadius: 8, background: '#000', margin: '-6px auto 12px' }} />
          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Mon espace</p>
          <div style={{ borderRadius: 12, padding: 12, marginBottom: 10, background: `linear-gradient(135deg, ${ACCENT}, #5B4BE0)` }}>
            <p style={{ fontSize: 9, opacity: 0.8 }}>Ce mois-ci</p>
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
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: ['#F59E0B', '#22C55E', '#38BDF8', '#F472B6'][n], opacity: 0.85 }} />
              <div style={{ flex: 1, display: 'grid', gap: 4 }}>
                <Skel w="70%" h={6} o={0.3} />
                <Skel w="45%" h={5} o={0.12} />
              </div>
            </motion.div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 10 }}>
            {[0, 1, 2].map(n => <span key={n} style={{ width: 14, height: 14, borderRadius: 5, background: n === 0 ? ACCENT : 'rgba(255,255,255,0.15)' }} />)}
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
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(20,19,30,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 600, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
          <Clock size={14} color={ACCENT} />
          <span>Jour <CountUp from={1} to={OFFER.days} duration={2.6} delay={base + 0.6} play={play} />/{OFFER.days}</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={play ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: base + 3.2 }}
        style={{ position: 'absolute', bottom: 28, left: -18, zIndex: 2 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'rgba(20,19,30,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(74,222,128,0.3)', fontSize: 12, fontWeight: 600, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
          <span className="mvp-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />
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
      whileHover={{ scale: 1.03, boxShadow: '0 14px 44px rgba(121,103,255,0.55)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: big ? '20px 40px' : '16px 32px', borderRadius: 14,
        background: `linear-gradient(135deg, ${ACCENT} 0%, #6654F0 100%)`,
        color: '#fff', fontSize: big ? 18 : 16, fontWeight: 700, textDecoration: 'none', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(121,103,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      <motion.span
        aria-hidden
        animate={{ left: ['-60%', '160%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
        style={{ position: 'absolute', top: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', transform: 'skewX(-20deg)' }}
      />
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10 }}>{children}</span>
    </motion.a>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.25)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 28px', borderRadius: 14,
        background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── blocs ─────────────────────────────────────────── */
function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: Segment[]; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
      <motion.p {...upView()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 18 }}>
        <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} style={{ width: 18, height: 1.5, background: ACCENT, transformOrigin: 'right' }} />
        {eyebrow}
        <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} style={{ width: 18, height: 1.5, background: ACCENT, transformOrigin: 'left' }} />
      </motion.p>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: sub ? 18 : 0 }}>
        <Words segments={title} />
      </h2>
      {sub && <motion.p {...upView(0.25)} style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{sub}</motion.p>}
    </div>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...upView(index * 0.05)} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: open ? '#fff' : 'rgba(255,255,255,0.85)' }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ display: 'flex', flexShrink: 0, opacity: 0.5 }}>
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
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', paddingBottom: 24 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StruckPrice({ play, delay, size }: { play: boolean; delay: number; size: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontSize: size, color: 'rgba(255,255,255,0.35)' }}>
      {eur(OFFER.originalPrice)}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={play ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay }}
        style={{ position: 'absolute', left: -4, right: -4, top: '52%', height: 2, background: '#F87171', transformOrigin: 'left', borderRadius: 2 }}
      />
    </span>
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

  const scrollToOffer = () => {
    const target = document.getElementById('offre');
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -40, duration: 1.6 });
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
      <main style={{ position: 'relative', background: '#0A0A0F', color: '#fff', minHeight: '100vh', overflowX: 'clip' }}>

        <motion.div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60, background: `linear-gradient(90deg, ${ACCENT}, #B9A9FF)`, transformOrigin: 'left', scaleX: progress }} />

        {/* ── BARRE OFFRE ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{ background: `linear-gradient(90deg, ${ACCENT}, #6654F0)`, padding: '10px 24px', textAlign: 'center' }}
        >
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            ⚡ Offre spéciale — MVP en {OFFER.days} jours à <strong>{eur(OFFER.price)}</strong>{' '}
            <span style={{ opacity: 0.75, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>{eur(OFFER.originalPrice)}</span>{' '}
            · Landing page + vidéo motion offertes
          </p>
        </motion.div>

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.72)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{ maxWidth: 1080, margin: '0 auto', height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="https://ozirus.agency" aria-label="Ozirus Agency">
              <img src="/logo.png" alt="Ozirus" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
            </a>
            <motion.button
              onClick={scrollToOffer}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: ACCENT, color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Voir l&apos;offre <ArrowRight size={15} />
            </motion.button>
          </div>
        </motion.header>

        {/* ── HERO ── */}
        <section ref={heroRef} style={{ position: 'relative', padding: '64px 24px 120px' }}>
          <Aurora />
          <LineGrid opacity={0.07} />
          <motion.div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', textAlign: 'center', opacity: heroFade }}>
            <motion.div {...heroItem(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 999, border: '1px solid rgba(121,103,255,0.35)', background: 'rgba(121,103,255,0.1)', fontSize: 13, fontWeight: 600, color: '#C4B9FF', marginBottom: 24 }}>
              <span className="mvp-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
              {OFFER.days} jours chrono · {OFFER.years} ans d&apos;expérience
            </motion.div>

            <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.04, letterSpacing: '-0.03em', marginBottom: 24 }}>
              <Words
                play={ready}
                delay={0.1}
                stagger={0.07}
                segments={[
                  { text: `Votre MVP en ${OFFER.days} jours,`, br: true },
                  { text: 'avec un CTO cofondateur.', gradient: true },
                ]}
              />
            </h1>

            <motion.p {...heroItem(0.55)} style={{ fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: 680, margin: '0 auto 40px' }}>
              SaaS, application mobile, desktop ou produit IA : je construis votre MVP comme si c&apos;était le mien.
              Pas un prestataire de plus, <strong style={{ color: '#fff' }}>un associé technique pendant {OFFER.days} jours</strong>, avec {OFFER.years} ans
              de produits livrés derrière lui.
            </motion.p>

            <motion.div {...heroItem(0.7)} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 44 }}>
              <CtaButton big>
                <MessageCircle size={20} /> Réserver mon MVP
              </CtaButton>
              <SecondaryButton onClick={scrollToOffer}>
                Voir ce qui est inclus <ChevronDown size={16} />
              </SecondaryButton>
            </motion.div>

            <motion.div {...heroItem(0.85)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 600, minWidth: '4.6em', textAlign: 'right' }}>
                <CountUp from={OFFER.originalPrice} to={OFFER.price} format={eur} duration={1.6} delay={1.1} play={ready} />
              </span>
              <StruckPrice play={ready} delay={2.5} size={22} />
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={ready ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 2.8 }}
                style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.14)', color: '#4ADE80', fontSize: 13, fontWeight: 700 }}
              >
                -50 %
              </motion.span>
            </motion.div>
            <motion.p {...heroItem(1)} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>
              + Landing page et vidéo motion promo offertes
            </motion.p>
          </motion.div>

          <div style={{ position: 'relative', maxWidth: 960, margin: '80px auto 0', perspective: 1400 }}>
            <motion.div style={{ rotateX: mockTilt, scale: mockScale, transformOrigin: 'center top' }}>
              <ProductMock ready={ready} />
            </motion.div>
          </div>
        </section>

        {/* ── CHIFFRES ── */}
        <section style={{ padding: '40px 24px 48px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { node: <><CountUp to={OFFER.years} /> ans</>, label: 'à concevoir et livrer des produits' },
              { node: <><CountUp to={15} />+</>, label: 'applications déployées en production' },
              { node: <><CountUp to={OFFER.days} /> jours</>, label: 'de l\'idée au produit en ligne' },
              { node: <CountUp to={1} duration={0.8} />, label: 'interlocuteur : le CTO, du début à la fin' },
            ].map((s, i) => (
              <SpotCard key={s.label} delay={i * 0.08} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: DISPLAY, fontSize: 42, fontWeight: 600, ...gradientText }}>{s.node}</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.5 }}>{s.label}</p>
              </SpotCard>
            ))}
          </div>
        </section>

        {/* ── STACK ── */}
        <section style={{ padding: '24px 0 88px' }}>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 22 }}>Des technologies éprouvées, choisies pour votre produit</p>
          <div className="mvp-marquee" style={{ overflow: 'hidden' }}>
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', width: 'max-content', gap: 56 }}
            >
              {[...STACK, ...STACK].map((tech, i) => (
                <span key={i} style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 500, color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap' }}>{tech}</span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── POURQUOI UN CTO ── */}
        <section style={{ position: 'relative', padding: '96px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHead
            eyebrow="La vraie différence"
            title={[{ text: 'Un CTO cofondateur' }, { text: 'change radicalement', gradient: true }, { text: 'un MVP.' }]}
            sub="La plupart des MVP ratés ne le sont pas à cause du code, mais des décisions prises avant. C'est là qu'un CTO fait toute la différence."
          />

          <div style={{ maxWidth: 1000, margin: '0 auto 64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {CTO_POINTS.map((p, i) => (
              <SpotCard key={p.title} delay={i * 0.08}>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 + i * 0.08 }}
                  style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(121,103,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}
                >
                  <p.icon size={22} color={ACCENT} />
                </motion.div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
              </SpotCard>
            ))}
          </div>

          <motion.div {...upView()} style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mvp-compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.04)' }}>
              <p style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Un prestataire classique</p>
              <p style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(121,103,255,0.08)' }}>Un CTO cofondateur</p>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.cto} className="mvp-compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <motion.p
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={T(0.1 + i * 0.12)}
                  style={{ display: 'flex', gap: 10, padding: '16px 20px', fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.45)' }}
                >
                  <X size={16} style={{ flexShrink: 0, marginTop: 2, color: '#F87171' }} /> {row.freelance}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={T(0.25 + i * 0.12)}
                  style={{ display: 'flex', gap: 10, padding: '16px 20px', fontSize: 14, lineHeight: 1.55, color: '#fff', background: 'rgba(121,103,255,0.05)' }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.45 + i * 0.12 }}
                    style={{ display: 'flex', flexShrink: 0, marginTop: 2 }}
                  >
                    <CheckCircle2 size={16} color="#4ADE80" />
                  </motion.span>
                  {row.cto}
                </motion.p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── PLATEFORMES ── */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHead
            eyebrow="Ce qu'on construit"
            title={[{ text: 'SaaS, mobile, desktop.' }, { text: 'Même délai.', gradient: true }]}
            sub="Le format suit votre marché, pas l'inverse. Dans tous les cas, votre produit est en ligne en 30 jours."
          />
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {PLATFORMS.map((p, i) => (
              <SpotCard key={p.title} delay={i * 0.08}>
                <motion.div
                  initial={{ rotate: -12, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.25 + i * 0.08 }}
                  style={{ display: 'inline-flex', marginBottom: 18 }}
                >
                  <p.icon size={26} color={ACCENT} />
                </motion.div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
              </SpotCard>
            ))}
          </div>
        </section>

        {/* ── 30 JOURS ── */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHead
            eyebrow="30 jours chrono"
            title={[{ text: 'De l\'idée au lancement,' }, { text: 'semaine par semaine.', gradient: true }]}
          />
          <div ref={timelineRef} style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
            <div aria-hidden className="mvp-hide-sm" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #B9A9FF)`, transformOrigin: 'left', scaleX: timelineFill }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 26 }}>
              {TIMELINE.map((step, i) => (
                <SpotCard key={step.title} delay={i * 0.12}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{step.days}</p>
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.3 + i * 0.12 }}
                      style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: i === TIMELINE.length - 1 ? ACCENT : 'rgba(121,103,255,0.14)', color: i === TIMELINE.length - 1 ? '#fff' : ACCENT }}
                    >
                      {i === TIMELINE.length - 1 ? <Rocket size={14} /> : i + 1}
                    </motion.span>
                  </div>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>{step.desc}</p>
                </SpotCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── OFFRE ── */}
        <section id="offre" style={{ position: 'relative', overflow: 'hidden', padding: '104px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div aria-hidden style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 900, maxWidth: '120%', height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <SectionHead eyebrow="L'offre" title={[{ text: 'Tout ce qu\'il faut pour' }, { text: 'lancer.', gradient: true }]} />

          <motion.div
            ref={offerRef}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ position: 'relative', maxWidth: 760, margin: '0 auto', borderRadius: 28, padding: 1.5, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(121,103,255,0.12)' }}
          >
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', left: '50%', top: '50%', width: 'max(250%, 1800px)', aspectRatio: '1', x: '-50%', y: '-50%', background: 'conic-gradient(from 0deg, rgba(121,103,255,0.15) 0deg, rgba(185,169,255,0.95) 50deg, rgba(121,103,255,0.15) 110deg, rgba(121,103,255,0.15) 360deg)' }}
            />
            <div style={{ position: 'relative', borderRadius: 26.5, padding: 'clamp(28px, 5vw, 48px)', background: 'linear-gradient(160deg, #17142A 0%, #0D0C14 55%)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600 }}>MVP en {OFFER.days} jours</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <StruckPrice play={offerInView} delay={0.5} size={18} />
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={offerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
                    style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 600 }}
                  >
                    {eur(OFFER.price)}
                  </motion.span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Forfait unique, HT. Prix de lancement, nombre de projets limité.</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'grid', gap: 14 }}>
                {INCLUDED.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={offerInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.08 }}
                    style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}
                  >
                    <CheckCircle2 size={18} color="#4ADE80" style={{ flexShrink: 0, marginTop: 2 }} /> {item}
                  </motion.li>
                ))}
              </ul>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.14)', paddingTop: 28, marginBottom: 36 }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
                  <motion.span
                    animate={offerInView ? { rotate: [0, -14, 12, -8, 0] } : {}}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    style={{ display: 'flex' }}
                  >
                    <Gift size={16} />
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
                      whileHover={{ y: -3, borderColor: 'rgba(251,191,36,0.45)' }}
                      style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, padding: 20, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}
                    >
                      <motion.span
                        aria-hidden
                        initial={{ left: '-60%' }}
                        animate={offerInView ? { left: '160%' } : {}}
                        transition={{ duration: 1.2, ease: 'easeInOut', delay: 1.6 + i * 0.15 }}
                        style={{ position: 'absolute', top: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.18), transparent)', transform: 'skewX(-20deg)' }}
                      />
                      <span style={{ position: 'absolute', top: 14, right: 14, padding: '3px 8px', borderRadius: 6, background: 'rgba(251,191,36,0.15)', color: '#FBBF24', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Offert</span>
                      <b.icon size={22} color="#FBBF24" style={{ marginBottom: 12 }} />
                      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{b.title}</p>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>{b.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <CtaButton big>
                  <MessageCircle size={20} /> Réserver mon MVP sur WhatsApp
                </CtaButton>
                <SecondaryButton onClick={openContact}>Écrire un message</SecondaryButton>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: '96px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHead eyebrow="Questions" title={[{ text: 'Avant de vous lancer' }]} />
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {FAQS.map((f, i) => <FaqItem key={f.q} index={i} {...f} />)}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Aurora />
          <LineGrid />
          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.06, letterSpacing: '-0.025em', marginBottom: 22 }}>
              <Words segments={[{ text: `Dans ${OFFER.days} jours,` }, { text: 'votre produit est en ligne.', gradient: true }]} />
            </h2>
            <motion.p {...upView(0.4)} style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: 36 }}>
              Parlez-moi de votre idée. On voit ensemble si elle tient en {OFFER.days} jours, et ce que doit contenir votre MVP.
            </motion.p>
            <motion.div {...upView(0.55)}>
              <CtaButton big>
                Démarrer mon MVP à {eur(OFFER.price)} <ArrowRight size={20} />
              </CtaButton>
            </motion.div>
            <motion.p {...upView(0.7)} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 18 }}>
              Ou par email : <a href={`mailto:${OFFER.email}`} style={{ color: 'rgba(255,255,255,0.7)' }}>{OFFER.email}</a>
            </motion.p>
          </div>
        </section>

        <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <a href="https://ozirus.agency">
            <img src="/logo.png" alt="Ozirus" style={{ height: 22, filter: 'brightness(0) invert(1)', opacity: 0.4 }} />
          </a>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>© {new Date().getFullYear()} Ozirus Agency</p>
        </footer>
      </main>
    </MotionConfig>
  );
}
