'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, animate, useInView, useMotionValue, useScroll, useSpring, useTransform,
  MotionValue,
} from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  ArrowRight, CheckCircle2, X, ChevronDown, Clock, Smartphone, Monitor, Globe,
  Layers, Compass, Rocket, Gift, Film, LayoutTemplate, MessageCircle, Cpu, Target, Scissors,
  Bot, Eye, ShieldCheck, Sparkles, AlertTriangle, Play,
} from 'lucide-react';
import BookingWidget from '@/components/booking/BookingWidget';

/* ─── configuration des offres ──────────────────────── */
const OFFER = {
  price: 5000,
  days: 30,
  years: 5,
  whatsapp: '237694086571',
  whatsappText: 'Bonjour Wilfried, je suis intéressé par l\'offre MVP en 30 jours à 5 000 € HT. Voici mon projet : ',
  email: 'info.ozirus@gmail.com',
};

const OFFERS = [
  {
    days: 15,
    price: 2500,
    name: 'Sprint MVP',
    label: 'Pour valider une idée rapidement',
    desc: 'Le cœur de votre produit, cadré, construit et mis entre les mains de vos premiers utilisateurs.',
    features: ['Cadrage du produit et des priorités', 'Une livraison fonctionnelle tous les 2 jours', 'Itérations continues pendant tout le sprint', 'Prototype en ligne dès les premiers jours', 'Code source et accès remis à votre nom'],
  },
  {
    days: 30,
    price: 5000,
    name: 'MVP complet',
    label: 'Pour lancer et commencer à vendre',
    desc: 'Une première version prête pour vos utilisateurs, vos premiers paiements et vos premiers apprentissages.',
    features: ['Atelier produit et maquettes UI/UX', 'Une livraison fonctionnelle tous les 2 jours', 'MVP web, mobile ou desktop', 'Authentification, base de données et back-office', 'Itérations continues jusqu’à la mise en ligne', 'Landing page + vidéo de lancement 60 s', 'Mise en production et déploiement', 'Code source et accès remis à votre nom'],
  },
];

// Vidéo de présentation. Renseigner `src` (fichier déposé dans public/, ex. '/videos/mvp.mp4')
// OU `youtubeId`. Tant que les deux sont vides, l'affiche reste visible avec « Bientôt disponible ».
const VIDEO = {
  src: '',
  youtubeId: '',
  poster: '',
  photo: '',
  duration: '',
  chapters: ['Qui je suis', 'Pourquoi un CTO', 'Ma méthode avec l\'IA', 'Les deux formats'],
};

const whatsappUrl = (days: number, price: number) => `https://wa.me/${OFFER.whatsapp}?text=${encodeURIComponent(`Bonjour Wilfried, je suis intéressé par l'offre MVP en ${days} jours à ${price} € HT. Voici mon projet : `)}`;
const WHATSAPP_URL = whatsappUrl(OFFER.days, OFFER.price);
// Formatage fr-FR fait à la main : la méthode Intl dépend de l'ICU du moteur (Node et le
// navigateur n'emploient pas toujours la même espace insécable), d'où des erreurs d'hydratation.
const frNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
const eur = (n: number) => `${frNum(n)} €`;

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
  { freelance: 'Compteur de fonctionnalités et devis qui grossit', cto: 'Fait évoluer le produit par itérations rapides' },
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
  { days: 'Jours 1 à 5', title: 'Cadrage & design', desc: 'Atelier produit, parcours utilisateur, priorités claires et premières maquettes validées ensemble.' },
  { days: 'Jours 6 à 20', title: 'Itérations rapides', desc: 'Une version fonctionnelle tous les 2 jours. Vous testez, vous demandez, on ajuste immédiatement.' },
  { days: 'Jours 21 à 26', title: 'Tests & finitions', desc: 'Recette, corrections, performance, mise en production sur vos comptes.' },
  { days: 'Jours 27 à 30', title: 'Lancement', desc: 'Landing page en ligne, vidéo motion livrée, MVP prêt pour vos premiers utilisateurs.' },
];

const REVISION_PROMISE = 'Pas de quota de fonctionnalités : pendant le sprint, on avance par itérations. Tous les 2 jours, vous recevez une nouvelle version, vous testez et nous priorisons la suite ensemble.';

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
  { icon: Sparkles, title: 'Le temps gagné va au produit', desc: 'Ce que l\'IA fait gagner sert à affiner votre produit et à intégrer vos retours, pas à gonfler la facture.' },
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
    q: 'Un MVP en 15 ou 30 jours, c\'est vraiment possible ?',
    a: 'Oui. Le produit avance par cycles courts : tous les 2 jours, une nouvelle version est livrée. Vous testez, vous demandez les changements souhaités et nous priorisons ensemble ce qui apporte le plus de valeur dans le temps disponible.',
  },
  {
    q: 'Qu\'est-ce qui change concrètement avec un CTO cofondateur ?',
    a: 'Vous n\'achetez pas des heures de développement, vous gagnez quelqu\'un qui raisonne comme un associé : il challenge vos idées, coupe le superflu, choisit une architecture qui tiendra la croissance et vous aide à présenter le produit à vos premiers clients ou investisseurs.',
  },
  {
    q: 'Comment fonctionnent les itérations tous les 2 jours ?',
    a: `${REVISION_PROMISE} Chaque cycle sert à faire avancer le produit : nouvelle fonctionnalité, amélioration, correction ou détail d\'expérience.`,
  },
  {
    q: 'À qui appartient le code ?',
    a: 'À vous. Le code source, les comptes d\'hébergement et les accès sont remis à votre nom à la livraison.',
  },
  {
    q: 'Est-ce que vous prenez des parts dans ma société ?',
    a: 'Non. Ozirus fonctionne au forfait : aucune prise de participation, aucun equity et aucun pourcentage sur votre société. Vous gardez 100 % de votre capital, de votre code et de vos comptes.',
  },
  {
    q: 'Et après les 15 ou 30 jours ?',
    a: 'Vous repartez avec votre code, vos accès et une version en ligne. Vous êtes libre de continuer seul, avec votre équipe ou avec Ozirus pour la V2.',
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
    .mvp-compare-row p { padding: 14px 12px !important; font-size: 13px !important; }
  }
  .mvp-glass {
    background: linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.32));
    backdrop-filter: blur(16px) saturate(140%); -webkit-backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid rgba(255,255,255,0.8);
    box-shadow: inset 0 1px 0 #fff, inset 0 -1px 1px rgba(255,255,255,0.5), 0 1px 2px rgba(16,16,20,0.05), 0 8px 22px rgba(16,16,20,0.07);
  }
  .mvp-glass-pill {
    position: absolute; top: 5px; bottom: 5px; left: 5px; width: calc((100% - 10px) / 3); border-radius: 24px;
    background: rgba(14,14,16,0.06); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
    animation: mvp-tab 7.5s cubic-bezier(.5,1.6,.4,1) infinite;
  }
  @keyframes mvp-tab { 0%, 28% { transform: translateX(0); } 33%, 61% { transform: translateX(100%); } 66%, 95% { transform: translateX(200%); } 100% { transform: translateX(0); } }
  .mvp-blob { animation: mvp-blob 12s ease-in-out infinite alternate; }
  .mvp-blob-b { animation-duration: 15s; animation-direction: alternate-reverse; }
  .mvp-blob-c { animation-duration: 18s; }
  @keyframes mvp-blob { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(60px, 50px) scale(1.15); } 100% { transform: translate(-30px, 110px) scale(0.9); } }
  @media (prefers-reduced-motion: reduce) {
    .mvp-pulse, .mvp-glass-pill, .mvp-blob { animation: none; }
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

function CountUp({ from = 0, to, duration = 1.6, delay = 0, format = frNum, play }: {
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

// La scène est dessinée en pixels « design » puis mise à l'échelle de son conteneur :
// les cadres gardent les proportions réelles des appareils quelle que soit la largeur.
const SCENE_W = 1400;
const SCENE_H = 900;

function useFitScale(ref: React.RefObject<HTMLDivElement | null>, designWidth: number) {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / designWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, designWidth]);
  return scale;
}

// MacBook Pro 14" : dalle 3024×1964 (≈ 1,54), bordures fines, encoche, base aluminium.
function MacBookPro14({ play, delay, children }: { play: boolean; delay: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 20, width: 1260, perspective: 2200, perspectiveOrigin: '50% 100%' }}>
      <motion.div
        initial={{ rotateX: -84 }}
        animate={play ? { rotateX: 0 } : {}}
        transition={{ duration: 1.7, ease: EASE, delay }}
        style={{ position: 'relative', width: 1220, height: 800, margin: '0 auto', transformOrigin: '50% 100%', borderRadius: '30px 30px 10px 10px', padding: '16px 16px 24px', background: 'linear-gradient(180deg, #1C1C1F, #0B0B0D)', boxShadow: 'inset 0 0 0 1.5px #3A3A3F, inset 0 0 0 4px #0B0B0D, 0 40px 80px -20px rgba(16,16,20,0.35)' }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '14px 14px 4px 4px', overflow: 'hidden', background: '#000' }}>
          {children}
          {/* reflet de la dalle */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%)' }} />
          {/* écran qui s'allume une fois le capot ouvert */}
          <motion.div
            aria-hidden
            initial={{ opacity: 1 }}
            animate={play ? { opacity: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: delay + 1.2 }}
            style={{ position: 'absolute', inset: 0, background: '#000', pointerEvents: 'none' }}
          />
        </div>
        {/* encoche */}
        <div aria-hidden style={{ position: 'absolute', top: 16, left: '50%', width: 186, height: 30, marginLeft: -93, borderRadius: '0 0 12px 12px', background: '#0B0B0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #2C3550, #050507 70%)' }} />
        </div>
      </motion.div>

      {/* charnière + base aluminium */}
      <div aria-hidden style={{ position: 'relative', width: 1180, height: 8, margin: '0 auto', background: 'linear-gradient(180deg, #2A2A2E, #6B6B72)', borderRadius: '0 0 4px 4px' }} />
      <div aria-hidden style={{ position: 'relative', height: 22, marginTop: -2, borderRadius: '3px 3px 40px 40px / 3px 3px 22px 22px', background: 'linear-gradient(180deg, #E9EAEE 0%, #D3D5DB 45%, #A9ABB3 100%)', boxShadow: 'inset 0 1px 0 #FFFFFF, inset 0 -2px 3px rgba(0,0,0,0.12)' }}>
        <span style={{ position: 'absolute', top: 0, left: '50%', width: 200, height: 9, marginLeft: -100, borderRadius: '0 0 12px 12px', background: 'linear-gradient(180deg, #B7B9C0, #D8DAE0)' }} />
      </div>
      <div aria-hidden style={{ width: '94%', height: 30, margin: '-12px auto 0', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(16,16,20,0.28), transparent 70%)', filter: 'blur(6px)' }} />
    </div>
  );
}

// iPhone Duo : deux écrans reliés par une charnière, fermé au premier regard puis
// déplié progressivement quand le mockup entre dans le viewport au scroll.
const PHONE_W = 238;
const PHONE_H = Math.round(PHONE_W * 163.4 / 78);
const HINGE_W = 12;
const DUO_W = PHONE_W * 2 + HINGE_W;
// Écran : cadre métal 3 px + bordure noire 6 px de chaque côté. Les cotes de la zone sûre suivent
// un iPhone 15 (393 pt de large, île 126×37 à 11 pt du haut, barre d'état 54 pt) ramenées à l'échelle.
const PHONE_BEZEL = 6;
const SCREEN_W = PHONE_W - 2 * (3 + PHONE_BEZEL);
const IOS_SCALE = SCREEN_W / 393;
const ISLAND = { w: Math.round(126 * IOS_SCALE), h: Math.round(37 * IOS_SCALE), top: Math.round(11 * IOS_SCALE) };
const SAFE_TOP = Math.round(54 * IOS_SCALE);

// Icônes de la barre d'état iOS (réseau, Wi-Fi, batterie) dessinées en SVG pour rester nettes.
function StatusIcons() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
      <svg width="14" height="9.5" viewBox="0 0 15 10" aria-hidden>
        {[0, 1, 2, 3].map(i => <rect key={i} x={i * 4} y={7 - i * 2.2} width="2.8" height={3 + i * 2.2} rx="0.8" fill={INK} />)}
      </svg>
      <svg width="12" height="9.5" viewBox="0 0 13 10" aria-hidden>
        <path d="M6.5 2.2c1.9 0 3.6.7 4.9 1.9l1-1A8.3 8.3 0 0 0 6.5.7 8.3 8.3 0 0 0 .6 3.1l1 1a6.9 6.9 0 0 1 4.9-1.9Z" fill={INK} />
        <path d="M6.5 5.1c1.1 0 2.1.4 2.9 1.1l1-1A5.6 5.6 0 0 0 6.5 3.6c-1.5 0-2.9.6-3.9 1.6l1 1a4.1 4.1 0 0 1 2.9-1.1Z" fill={INK} />
        <path d="M6.5 6.6c-.6 0-1.2.2-1.6.7L6.5 9l1.6-1.7a2.3 2.3 0 0 0-1.6-.7Z" fill={INK} />
      </svg>
      <svg width="21" height="10.5" viewBox="0 0 22 11" aria-hidden>
        <rect x="0.6" y="0.6" width="18.6" height="9.8" rx="3" fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="1.1" />
        <rect x="2.2" y="2.2" width="13.4" height="6.6" rx="1.6" fill={INK} />
        <path d="M20.4 3.7v3.6c.8-.3 1.2-1 1.2-1.8s-.4-1.5-1.2-1.8Z" fill={INK} fillOpacity="0.45" />
      </svg>
    </span>
  );
}

// Barre d'état : heure centrée dans l'« oreille » gauche, icônes dans la droite, île au milieu.
// `inset` annule le padding horizontal du conteneur : les oreilles prennent toute la largeur d'écran.
function IOSStatusBar({ inset = 0 }: { inset?: number }) {
  const ear: React.CSSProperties = { flex: 1, height: ISLAND.h, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 1 };
  return (
    <div style={{ position: 'relative', height: SAFE_TOP, flexShrink: 0, display: 'flex', alignItems: 'flex-start', margin: `0 ${-inset}px`, paddingTop: ISLAND.top, color: INK }}>
      <span style={{ ...ear, paddingLeft: 8, fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ width: ISLAND.w + 8, flexShrink: 0 }} />
      <span style={{ ...ear, paddingRight: 8 }}><StatusIcons /></span>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div aria-hidden style={{ position: 'absolute', top: ISLAND.top, left: '50%', width: ISLAND.w, height: ISLAND.h, marginLeft: -ISLAND.w / 2, borderRadius: ISLAND.h, background: '#000', zIndex: 3 }}>
      {/* lentille de la caméra frontale, côté droit de l'île */}
      <span style={{ position: 'absolute', right: ISLAND.h * 0.32, top: '50%', width: ISLAND.h * 0.42, height: ISLAND.h * 0.42, marginTop: -ISLAND.h * 0.21, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #2B3350, #0A0B10 65%)' }} />
    </div>
  );
}

function DuoSidePanel() {
  return (
    <div style={{ position: 'relative', height: '100%', padding: '0 16px 22px', background: '#F7F7F8', color: INK, textAlign: 'left' }}>
      {/* Second écran sans île : date à gauche et poignée multitâche « ••• » centrée, comme sur iPadOS. */}
      <div style={{ position: 'relative', height: SAFE_TOP, paddingTop: ISLAND.top + 1 }}>
        <span style={{ height: ISLAND.h, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 600, color: MUTED }}>lun. 23 oct.</span>
        <span aria-hidden style={{ position: 'absolute', top: ISLAND.top + 1, left: '50%', height: ISLAND.h, display: 'flex', alignItems: 'center', gap: 3, transform: 'translateX(-50%)' }}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(14,14,16,0.28)' }} />)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0 16px' }}>
        <div>
          <p style={{ fontSize: 11, color: FAINT }}>Votre prochaine étape</p>
          <p style={{ fontSize: 21, fontWeight: 700, marginTop: 3, letterSpacing: '-0.03em' }}>V2 prête</p>
        </div>
        <span style={{ width: 32, height: 32, borderRadius: '50%', background: ACCENT_SOFT, display: 'grid', placeItems: 'center', color: ACCENT_INK, fontSize: 12, fontWeight: 800 }}>02</span>
      </div>
      <div style={{ padding: 14, borderRadius: 18, background: '#fff', border: `1px solid ${LINE}`, marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: FAINT, marginBottom: 8 }}>Signal produit</p>
        <p style={{ fontSize: 18, fontWeight: 700 }}>+28 %</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 48, marginTop: 12 }}>
          {[30, 42, 36, 58, 51, 72, 86].map((height, i) => <span key={i} style={{ flex: 1, height: `${height}%`, borderRadius: 4, background: i === 6 ? ACCENT : '#E6E4F5' }} />)}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {['Feedbacks triés', 'V2 priorisée', 'Roadmap partagée'].map((label, i) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10, background: i === 0 ? ACCENT_SOFT : '#fff', border: `1px solid ${LINE}`, fontSize: 11, fontWeight: 600 }}><CheckCircle2 size={13} color={i === 0 ? ACCENT_INK : GREEN} />{label}</div>)}
      </div>
    </div>
  );
}

function IPhoneDuo({ play, delay, foldAngle, children }: { play: boolean; delay: number; foldAngle: MotionValue<number>; children: React.ReactNode }) {
  const metal = 'linear-gradient(90deg, #8E9097, #E4E5E9 30%, #B9BBC2 60%, #7C7E85)';
  const btn = (side: 'left' | 'right', top: number, h: number) => (
    <span aria-hidden style={{ position: 'absolute', [side]: -4, top, width: 5, height: h, borderRadius: side === 'left' ? '3px 0 0 3px' : '0 3px 3px 0', background: 'linear-gradient(180deg, #C9CBD1, #8B8D94)' }} />
  );
  return (
    <div style={{ position: 'absolute', left: SCENE_W - DUO_W - 12, top: SCENE_H - PHONE_H - 14, width: DUO_W, height: PHONE_H, perspective: 3600 }}>
      <motion.div
        initial={{ opacity: 0, x: 220, y: 40, rotateY: -70, rotateZ: 10 }}
        animate={play ? { opacity: 1, x: 0, y: 0, rotateY: -8, rotateZ: 0 } : {}}
        transition={{ duration: 1.5, ease: EASE, delay }}
        style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotateX: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
        >
          {/* Une seule machine : coins arrondis à l'extérieur, angles serrés côté charnière. */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: PHONE_W, height: PHONE_H, borderRadius: '44px 12px 12px 44px', padding: 3, background: metal, boxShadow: '0 50px 90px -20px rgba(16,16,20,0.45), 0 18px 30px -12px rgba(16,16,20,0.3)', transformStyle: 'preserve-3d' }}>
            {btn('left', 128, 26)}
            {btn('left', 178, 50)}
            {btn('left', 240, 50)}
            <div style={{ width: '100%', height: '100%', borderRadius: '41px 10px 10px 41px', padding: PHONE_BEZEL, background: '#050506' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '35px 5px 5px 35px', overflow: 'hidden', background: '#fff' }}>
                {children}
                <DynamicIsland />
                <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 35%)' }} />
              </div>
            </div>
          </div>

          {/* charnière : cylindre entre les deux moitiés, sur toute la hauteur utile */}
          <span aria-hidden style={{ position: 'absolute', left: PHONE_W - 2, top: 18, width: HINGE_W + 4, height: PHONE_H - 36, borderRadius: HINGE_W, background: 'linear-gradient(90deg, #6C6E75, #E4E5E9 45%, #9C9EA5 70%, #5E6067)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} />

          {/* Seconde moitié : pivote autour de la charnière, vers l'arrière, et finit à plat (0°). */}
          <motion.div
            style={{ position: 'absolute', left: PHONE_W + HINGE_W, top: 0, width: PHONE_W, height: PHONE_H, transformOrigin: `${-HINGE_W / 2}px 50%`, rotateY: foldAngle, transformStyle: 'preserve-3d' }}
          >
            {btn('right', 196, 78)}
            {btn('right', 330, 44)}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '12px 44px 44px 12px', padding: 3, background: metal, boxShadow: '0 50px 90px -20px rgba(16,16,20,0.35)', backfaceVisibility: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '10px 41px 41px 10px', padding: PHONE_BEZEL, background: '#050506' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '5px 35px 35px 5px', overflow: 'hidden', background: '#fff' }}>
                  <DuoSidePanel />
                  <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 35%)' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProductMock({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.3 });
  const scale = useFitScale(rootRef, SCENE_W);
  const { scrollYProgress: duoScroll } = useScroll({ target: rootRef, offset: ['start end', 'center center'] });
  // Angle positif = la moitié droite part vers l'arrière (au-delà de 90°, sa face est masquée :
  // l'appareil paraît fermé) ; 0° en fin de course pour que les deux écrans soient alignés.
  const duoFoldTarget = useTransform(duoScroll, [0, 0.62, 1], [120, 40, 0]);
  const duoFold = useSpring(duoFoldTarget, { stiffness: 120, damping: 24, mass: 0.7 });
  const play = ready && inView && scale > 0;
  const base = 0.15;
  const screenOn = base + 1.5;

  // Inclinaison 3D qui suit la souris.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 80, damping: 18 });
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 80, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  const pop = (d: number) => ({
    initial: { opacity: 0, y: 14, scale: 0.97 },
    animate: play ? { opacity: 1, y: 0, scale: 1 } : {},
    transition: { duration: 0.7, ease: EASE, delay: screenOn + d },
  });
  const bars = [38, 56, 44, 70, 62, 84, 76, 96];
  const kpis = [
    { label: 'Utilisateurs', to: 1284, fmt: frNum },
    { label: 'Revenu mensuel', to: 4920, fmt: eur },
    { label: 'Conversion', to: 6.8, fmt: (v: number) => `${v.toFixed(1).replace('.', ',')} %` },
  ];
  const panel: React.CSSProperties = { borderRadius: 14, background: '#fff', border: `1px solid ${LINE}` };
  const chip: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', border: `1px solid ${LINE}`, fontSize: 12, fontWeight: 600, color: INK, boxShadow: '0 12px 30px rgba(16,16,20,0.1)' };

  return (
    <div ref={rootRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ position: 'relative', width: '100%', aspectRatio: `${SCENE_W} / ${SCENE_H}` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SCENE_W, height: SCENE_H, transformOrigin: '0 0', transform: `scale(${scale})`, opacity: scale ? 1 : 0, perspective: 2600 }}>
        <motion.div style={{ position: 'absolute', inset: 0, rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}>

          <MacBookPro14 play={play} delay={base}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFB', color: INK, textAlign: 'left' }}>
              {/* barre des menus macOS */}
              <div style={{ height: 30, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 18, padding: '0 16px', background: 'rgba(255,255,255,0.85)', borderBottom: `1px solid ${LINE}`, fontSize: 12.5 }}>
                <svg width="13" height="15" viewBox="0 0 814 1000" aria-hidden><path fill={INK} d="M788 341c-6 4-108 62-108 190 0 149 131 201 135 203-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-164-40c-77 0-104 41-166 41s-106-57-156-127C46 792 0 666 0 546c0-193 125-295 249-295 66 0 121 43 162 43 39 0 101-46 176-46 29 0 131 3 201 93zM555 159c31-37 53-88 53-139 0-7-1-14-2-20-51 2-111 34-147 76-28 32-55 83-55 135 0 8 1 16 2 18 3 1 9 2 14 2 45 0 102-30 135-72z" /></svg>
                <span style={{ fontWeight: 700 }}>Safari</span>
                {['Fichier', 'Édition', 'Présentation', 'Historique'].map(m => <span key={m} style={{ color: '#3A3A40' }}>{m}</span>)}
                <span style={{ marginLeft: 'auto', color: '#3A3A40', fontVariantNumeric: 'tabular-nums' }}>lun. 9:41</span>
              </div>

              {/* fenêtre Safari */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderBottom: `1px solid ${LINE}`, background: '#fff', flexShrink: 0 }}>
                {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <span style={{ padding: '6px 120px', borderRadius: 9, background: '#F4F4F5', fontSize: 12, color: MUTED }}>app.votre-startup.com</span>
                </div>
              </div>

              <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                <motion.aside {...pop(0)} style={{ width: 210, padding: 20, borderRight: `1px solid ${LINE}`, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 7, background: INK }} />
                    <Skel w={80} h={10} o={0.16} />
                  </div>
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 9px', borderRadius: 8, background: n === 0 ? ACCENT_SOFT : 'transparent' }}>
                      <span style={{ width: 13, height: 13, borderRadius: 4, background: n === 0 ? ACCENT : 'rgba(14,14,16,0.12)' }} />
                      <Skel w={[74, 60, 84, 54, 68, 58][n]} o={n === 0 ? 0.2 : 0.08} />
                    </div>
                  ))}
                </motion.aside>

                <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <motion.div {...pop(0.05)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 19, fontWeight: 700 }}>Tableau de bord</p>
                      <p style={{ fontSize: 12.5, color: FAINT, marginTop: 4 }}>Vos premiers utilisateurs, en temps réel</p>
                    </div>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#F2C9A8', border: '2px solid #fff', boxShadow: `0 0 0 1px ${LINE}` }} />
                  </motion.div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    {kpis.map((k, i) => (
                      <motion.div key={k.label} {...pop(0.15 + i * 0.1)} style={{ ...panel, padding: 18 }}>
                        <p style={{ fontSize: 12, color: FAINT, marginBottom: 8 }}>{k.label}</p>
                        <p style={{ fontSize: 26, fontWeight: 700 }}>
                          <CountUp to={k.to} format={k.fmt} duration={2} delay={screenOn + 0.3 + i * 0.1} play={play} />
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div {...pop(0.4)} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
                    <div style={{ ...panel, position: 'relative', padding: 18, overflow: 'hidden' }}>
                      <p style={{ fontSize: 12, color: FAINT }}>Inscriptions</p>
                      <svg viewBox="0 0 300 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '78%' }}>
                        <motion.path
                          d="M0 100 C 30 95, 50 88, 75 80 S 120 82, 150 62 S 210 50, 235 34 S 280 18, 300 10 L 300 120 L 0 120 Z"
                          fill={ACCENT_SOFT}
                          initial={{ opacity: 0 }}
                          animate={play ? { opacity: 1 } : {}}
                          transition={{ duration: 1, delay: screenOn + 1.5 }}
                        />
                        <motion.path
                          d="M0 100 C 30 95, 50 88, 75 80 S 120 82, 150 62 S 210 50, 235 34 S 280 18, 300 10"
                          fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={play ? { pathLength: 1 } : {}}
                          transition={{ duration: 1.8, ease: EASE, delay: screenOn + 0.6 }}
                        />
                      </svg>
                    </div>
                    <div style={{ ...panel, padding: 18, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: 12, color: FAINT }}>Activité</p>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 14 }}>
                        {bars.map((h, i) => (
                          <motion.span
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={play ? { scaleY: 1 } : {}}
                            transition={{ duration: 0.8, ease: EASE, delay: screenOn + 0.7 + i * 0.07 }}
                            style={{ flex: 1, height: `${h}%`, borderRadius: 5, transformOrigin: 'bottom', background: i === bars.length - 1 ? INK : '#E4E4E8' }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </MacBookPro14>

          <IPhoneDuo play={play} delay={base + 0.9} foldAngle={duoFold}>
            {/* Fond d'écran vivant : c'est lui que le verre réfracte. */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#F3F3F5' }}>
              <span className="mvp-blob" style={{ position: 'absolute', width: 260, height: 260, left: -70, top: 40, borderRadius: '50%', background: '#DCDCE2', filter: 'blur(28px)' }} />
              <span className="mvp-blob mvp-blob-b" style={{ position: 'absolute', width: 220, height: 220, right: -60, top: 230, borderRadius: '50%', background: '#E6E3F5', filter: 'blur(28px)' }} />
              <span className="mvp-blob mvp-blob-c" style={{ position: 'absolute', width: 240, height: 240, left: 10, bottom: -40, borderRadius: '50%', background: '#D5D6DC', filter: 'blur(30px)' }} />
            </div>

            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '0 12px', textAlign: 'left', color: INK }}>
              <IOSStatusBar inset={12} />

              {/* même gabarit (surtitre + titre) que l'en-tête du second écran, pour aligner les deux titres */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 2px 12px' }}>
                <div>
                  <p style={{ fontSize: 11, color: '#6B6B75' }}>Bonjour Awa</p>
                  <p style={{ fontSize: 21, fontWeight: 700, marginTop: 3, letterSpacing: '-0.03em' }}>Mon espace</p>
                </div>
                <span className="mvp-glass" style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#D9D9DE' }} />
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={play ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: base + 1.7 }}
                className="mvp-glass"
                style={{ borderRadius: 24, padding: '13px 16px', marginBottom: 10 }}
              >
                <p style={{ fontSize: 11, color: '#3A3A44' }}>Ce mois-ci</p>
                <p style={{ fontSize: 28, fontWeight: 700, marginTop: 2, letterSpacing: '-0.02em' }}>
                  <CountUp to={4920} format={eur} duration={2} delay={base + 1.8} play={play} />
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: GREEN, marginTop: 2 }}>+18 % vs mois dernier</p>
              </motion.div>

              <div className="mvp-glass" style={{ borderRadius: 24, padding: '4px 14px' }}>
                {/* 3 lignes : au-delà, la liste repousse la barre d'onglets sur l'indicateur d'accueil */}
                {[0, 1, 2].map(n => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, x: 16 }}
                    animate={play ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE, delay: base + 1.9 + n * 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: n < 2 ? '1px solid rgba(14,14,16,0.06)' : 'none' }}
                  >
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: n === 0 ? '#E8E5FA' : '#E4E4E8', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.7)' }} />
                    <div style={{ flex: 1, display: 'grid', gap: 5 }}>
                      <Skel w="70%" h={7} o={0.22} />
                      <Skel w="45%" h={6} o={0.1} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* barre d'onglets flottante en verre, la bulle active glisse d'un onglet à l'autre */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 26px' }}>
                <div className="mvp-glass" style={{ position: 'relative', flex: 1, height: 58, borderRadius: 29, display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                  <span className="mvp-glass-pill" />
                  {[0, 1, 2].map(n => (
                    <span key={n} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(14,14,16,0.7)' }} />
                      <Skel w={26} h={4} o={0.35} />
                    </span>
                  ))}
                </div>
                <span className="mvp-glass" style={{ width: 58, height: 58, flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(14,14,16,0.75)' }} />
                </span>
              </div>
              {/* indicateur d'accueil : 134×5 pt sur iPhone, à 8 pt du bas */}
              <span style={{ position: 'absolute', bottom: Math.round(8 * IOS_SCALE) + 2, left: '50%', width: Math.round(134 * IOS_SCALE), height: 4, marginLeft: -Math.round(134 * IOS_SCALE) / 2, borderRadius: 3, background: INK }} />
            </div>
          </IPhoneDuo>
        </motion.div>
      </div>

      {/* pastilles de progression */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={play ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: base + 1.2 }}
        style={{ position: 'absolute', top: '10%', left: -24, zIndex: 2 }}
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={chip}>
          <Clock size={14} color={ACCENT_INK} />
          <span>Jour <CountUp from={1} to={OFFER.days} duration={2.6} delay={base + 1.4} play={play} />/{OFFER.days}</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={play ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: base + 4 }}
        style={{ position: 'absolute', bottom: '14%', left: -18, zIndex: 2 }}
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
          Votre MVP en {OFFERS[0].days} ou {OFFERS[1].days} jours,
          <br />
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>avec un CTO qui pilote.</span>
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
          <p className="mvp-hide-sm" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>CTO · {OFFER.years} ans d&apos;expérience</p>
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
    // Suite directe du hero (prix → vidéo) : pas de <Section> (bordure, eyebrow), un simple pont.
    <div id="video" style={{ position: 'relative', paddingTop: 56, scrollMarginTop: 90 }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ display: 'block', width: 1, height: 56, margin: '0 auto 24px', background: `linear-gradient(to bottom, transparent, ${FAINT})`, transformOrigin: 'top' }}
        />
        <motion.p {...upView(0.1)} style={{ fontSize: 12, fontWeight: 600, color: FAINT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
          Avant de réserver
        </motion.p>
        <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)', lineHeight: 1.12, letterSpacing: '-0.025em', color: INK, marginBottom: 14 }}>
          <Words segments={[{ text: 'Regardez comment' }, { text: 'on construit votre MVP.', muted: true }]} />
        </h2>
        <motion.p {...upView(0.25)} style={{ fontSize: 16, lineHeight: 1.65, color: MUTED, margin: 0 }}>
          Qui je suis, comment l&apos;IA et le CTO se partagent le travail, et lequel des deux formats vous correspond.
        </motion.p>
      </div>

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
    </div>
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

  // Lien partageable (ex. mvp.ozirus.agency/#calendrier) : le saut natif du navigateur part
  // avant la fin du loader et le chargement du widget, on le rejoue une fois la page prête.
  useEffect(() => {
    if (!ready) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !document.getElementById(id)) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -90, immediate: true });
      else target.scrollIntoView({ block: 'start' });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [ready]);

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

        <div style={{ position: 'relative', maxWidth: 1760, margin: '0 auto', background: '#FCFCFC', borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }}>

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
                {[['video', 'Vidéo'], ['methode', 'Méthode'], ['offre', 'Offre'], ['faq', 'FAQ']].map(([id, label]) => (
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
                <span style={{ padding: '3px 9px', borderRadius: 999, background: INK, color: '#fff', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>2 formats</span>
                <span style={{ whiteSpace: 'nowrap' }}>15 ou 30 jours<span className="mvp-hide-sm"> · une version tous les 2 jours</span></span>
                <ArrowRight size={13} color={FAINT} />
              </motion.button>

              <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.06, letterSpacing: '-0.035em', color: INK, marginBottom: 24 }}>
                <Words
                  play={ready}
                  delay={0.1}
                  stagger={0.07}
                  segments={[
                    { text: 'Votre MVP en', br: true },
                    { text: '15 ou 30 jours,', pill: true },
                    { text: 'avec un CTO qui pilote.', br: true },
                  ]}
                />
              </h1>

              <motion.p {...heroItem(0.55)} style={{ fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.7, color: MUTED, maxWidth: 640, margin: '0 auto 36px' }}>
                SaaS, application mobile, desktop ou produit IA : on cadre le bon périmètre, on le construit et vous pouvez demander des ajustements jusqu&apos;à la mise en ligne.
                <strong style={{ color: INK, fontWeight: 600 }}> Une version tous les 2 jours, itérations continues, délai fixe et prix clair — sans prise de participation.</strong>
              </motion.p>

              <motion.div {...heroItem(0.7)} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
                <CtaButton big href="#reserver">
                  <Sparkles size={17} /> Réserver mon MVP
                </CtaButton>
                <SecondaryButton onClick={() => scrollTo('offre')}>
                  Voir ce qui est inclus
                </SecondaryButton>
              </motion.div>

              <motion.div {...heroItem(0.85)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 600, letterSpacing: '-0.02em', minWidth: '4.6em', textAlign: 'right' }}>
                À partir de {eur(OFFERS[0].price)}
                </span>
              </motion.div>
              <motion.p {...heroItem(1)} style={{ fontSize: 14, color: FAINT, marginTop: 10 }}>
                Sprint 15 jours : {eur(OFFERS[0].price)} HT · MVP complet 30 jours : {eur(OFFERS[1].price)} HT
              </motion.p>
            </motion.div>

            {/* Vidéo de présentation directement sous le prix dans le hero. */}
            <VideoSection />

            <div style={{ position: 'relative', maxWidth: 1060, margin: '80px auto 0', perspective: 1400 }}>
              <motion.div style={{ rotateX: mockTilt, scale: mockScale, transformOrigin: 'center top' }}>
                <ProductMock ready={ready} />
              </motion.div>
            </div>
          </section>

          {/* ── CHIFFRES ── */}
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
          </section>

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
              {COMPARISON.slice(0, 3).map((row, i) => (
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
                {AI_METHOD.slice(0, 2).map((m, i) => (
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

          {/* ── PLATEFORMES ── */}
          <Section>
            <SectionHead
              eyebrow="Ce qu'on construit"
              title={[{ text: 'SaaS, mobile, desktop.' }, { text: 'Même délai.', muted: true }]}
              sub="Le format suit votre marché, pas l'inverse. Choisissez un sprint de 15 jours pour lancer une première version, ou 30 jours pour multiplier les itérations et aller plus loin."
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
            <SectionHead eyebrow="Deux formats, un même engagement" title={[{ text: 'Choisissez votre' }, { text: 'vitesse de lancement.', muted: true }]} sub={REVISION_PROMISE} />

            <div ref={offerRef} style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
              {OFFERS.map((offer, index) => (
                <motion.div
                  key={offer.name}
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: EASE, delay: index * 0.12 }}
                  style={{ ...card, position: 'relative', borderRadius: 24, padding: 'clamp(26px, 4vw, 38px)', borderColor: index === 1 ? ACCENT : LINE, boxShadow: index === 1 ? '0 18px 55px rgba(91,71,245,0.14)' : card.boxShadow }}
                >
                  {index === 1 && <span style={{ position: 'absolute', top: 18, right: 18, padding: '5px 10px', borderRadius: 999, background: ACCENT_SOFT, color: ACCENT_INK, fontSize: 11, fontWeight: 700 }}>Le plus choisi</span>}
                  <p style={{ fontSize: 12, fontWeight: 700, color: index === 1 ? ACCENT_INK : FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{offer.days} jours</p>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>{offer.name}</h3>
                  <p style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 8 }}>{offer.label}</p>
                  <p style={{ minHeight: 50, fontSize: 14, lineHeight: 1.6, color: MUTED, marginBottom: 22 }}>{offer.desc}</p>
                  <p style={{ fontFamily: DISPLAY, fontSize: 42, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>{eur(offer.price)}</p>
                  <p style={{ fontSize: 12, color: FAINT, marginBottom: 12 }}>Forfait fixe, HT · nombre de projets limité</p>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: INK, fontWeight: 700, marginBottom: 24 }}>0 % de prise de participation<br /><span style={{ color: MUTED, fontWeight: 500 }}>Vous gardez 100 % de votre capital.</span></p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'grid', gap: 13 }}>
                    {offer.features.map(item => <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.5 }}><CheckCircle2 size={17} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} /> {item}</li>)}
                  </ul>
                  <CtaButton big href={whatsappUrl(offer.days, offer.price)}><MessageCircle size={18} /> Parler de ce format</CtaButton>
                </motion.div>
              ))}
            </div>

            <motion.div {...upView(0.2)} style={{ maxWidth: 1040, margin: '22px auto 0', padding: '18px 22px', borderRadius: 16, background: '#FFFBF0', border: '1px solid #FDE7B0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Gift size={18} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED }}><strong style={{ color: INK }}>Dans les deux formats :</strong> une version tous les 2 jours, accès direct au CTO, itérations priorisées ensemble, propriété du code et mise en ligne sur vos comptes. La landing page et la vidéo motion promo sont incluses dans le format 30 jours.</p>
            </motion.div>
          </Section>

          {/* ── FAQ ── */}
          <Section id="faq">
            <SectionHead eyebrow="Questions" title={[{ text: 'Avant de' }, { text: 'vous lancer.', muted: true }]} />
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {FAQS.slice(0, 4).map((f, i) => <FaqItem key={f.q} index={i} {...f} />)}
            </div>
          </Section>

          {/* ── CTA FINAL ── */}
          <Section id="reserver" style={{ padding: '120px 24px', textAlign: 'center' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: 20 }}>
                <Words segments={[{ text: 'Dans 15 ou 30 jours,' }, { text: 'votre produit est en ligne.', muted: true }]} />
              </h2>
              <motion.p {...upView(0.4)} style={{ fontSize: 17, lineHeight: 1.7, color: MUTED, marginBottom: 34 }}>
                Parlez-moi de votre idée. On choisit le bon format, on lance les premières priorités et vous gardez la main sur les itérations jusqu&apos;à la mise en ligne.
              </motion.p>
            </div>
            {/* Réservation de l'appel découverte : page `mvp-appel` gérée dans /admin/bookings.
                Si elle n'existe pas ou est désactivée, on retombe sur le CTA WhatsApp. */}
            <motion.div id="calendrier" {...upView(0.55)} style={{ maxWidth: 980, margin: '0 auto', textAlign: 'left', scrollMarginTop: 90 }}>
              <BookingWidget
                slug="mvp-appel"
                source="landing-mvp"
                fallback={(
                  <div style={{ textAlign: 'center' }}>
                    <CtaButton big>
                      Choisir mon format <ArrowRight size={18} />
                    </CtaButton>
                  </div>
                )}
              />
            </motion.div>
            <motion.p {...upView(0.7)} style={{ fontSize: 13, color: FAINT, marginTop: 22, textAlign: 'center' }}>
              Plutôt par écrit ? <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: INK }}>WhatsApp</a> ou <a href={`mailto:${OFFER.email}`} style={{ color: INK }}>{OFFER.email}</a>
            </motion.p>
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
