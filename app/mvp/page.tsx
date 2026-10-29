'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, animate, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform,
} from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import type { MuxPlayerRefAttributes } from '@mux/mux-player-react';
import {
  ArrowRight, CheckCircle2, X, ChevronDown, Layers, Compass, Rocket, Gift, Film, LayoutTemplate, Mail,
  Target, Scissors, Bot, Eye, ShieldCheck, Sparkles, AlertTriangle, Play, CalendarDays, KeyRound, Percent, RotateCcw,
  Volume2, VolumeX,
} from 'lucide-react';
import { useMainSiteHref } from '@/lib/useMainSiteHref';
import dynamic from 'next/dynamic';
import { OPEN_BOOKING_EVENT, openMvpBooking } from './bookingEvents';
import MethodScroll from './MethodScroll';
import { trackMvp } from './analytics';
import { setSoundEnabled, sfx, useCrossing, useSoundEnabled } from './sound';
import { PIN_QUERY, isLiteNetwork, isSlowNetwork, usePinned } from './scroll';

// Chargés à la demande (faible débit) : la modale au premier clic sur un CTA, la Product
// Experience quand on approche de sa section. Rien de tout cela n'est utile au premier affichage.
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false });
const ProductExperience = dynamic(() => import('./ProductExperience'), { ssr: false });
import {
  ACCENT, ACCENT_INK, ACCENT_SOFT, AMBER, DISPLAY, EASE, FAINT, GREEN, INK, LINE, MUTED, OFFER, RED,
} from './theme';

const OFFERS = [
  {
    days: 15,
    price: 3000,
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

// Lecteur Mux (streaming adaptatif HLS) : chargé seulement au clic sur « Play », hors du bundle initial.
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false });

// Vidéo de présentation. Renseigner `muxPlaybackId` (recommandé : la qualité s'adapte au réseau,
// démarrage rapide même en 3G), OU `src` (MP4, ex. '/videos/mvp.mp4'), OU `youtubeId`. Tant que
// tout est vide, l'affiche reste visible avec « Bientôt disponible ».
// Mux : dashboard.mux.com → Assets → importer la vidéo (sous-titres à ajouter sur l'asset), puis
// copier le « Playback ID » d'une politique **public**.
const VIDEO = {
  muxPlaybackId: '',
  src: '',
  youtubeId: '',
  // Vide + Mux : la vignette de l'asset Mux est utilisée.
  poster: '',
  // Sous-titres WebVTT (ex. '/videos/mvp.fr.vtt'), utilisés par le lecteur natif.
  captions: '',
  photo: '',
  duration: '',
  chapters: ['Qui je suis', 'Pourquoi un CTO', 'Ma méthode avec l\'IA', 'Les deux formats'],
};

// Formatage fr-FR fait à la main : la méthode Intl dépend de l'ICU du moteur (Node et le
// navigateur n'emploient pas toujours la même espace insécable), d'où des erreurs d'hydratation.
const frNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
const eur = (n: number) => `${frNum(n)} €`;


const T = (delay = 0) => ({ duration: 0.7, delay, ease: EASE });
const upView = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: T(delay),
});

/* ─── données ───────────────────────────────────────── */
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

const PROBLEMS = [
  { risk: 'Construire trop tôt, sans avoir clarifié le besoin', answer: CTO_POINTS[0] },
  { risk: 'Empiler les fonctionnalités sans périmètre clair', answer: CTO_POINTS[1] },
  { risk: 'Livrer un prototype impressionnant, mais fragile', answer: CTO_POINTS[2] },
];

const OWNERSHIP = [
  { icon: KeyRound, title: 'Code et accès à votre nom', desc: 'Le code source, les comptes d\'hébergement et les accès vous sont remis à la livraison.' },
  { icon: Percent, title: '0 % de prise de participation', desc: 'Forfait fixe : aucun equity, aucun pourcentage sur votre société.' },
  { icon: Compass, title: 'Libre pour la suite', desc: 'Après la mise en ligne, vous continuez seul, avec votre équipe ou avec Ozirus pour la V2.' },
];


// Ajustements encadrés par le périmètre validé au cadrage (et non « illimités ») : attractif, sans
// exposer le forfait aux demandes sans fin.
const REVISION_PROMISE = 'Ajustements inclus jusqu\'à la mise en ligne. Tous les 2 jours, vous testez la nouvelle version et demandez des modifications dans le périmètre validé au cadrage. Une nouvelle fonctionnalité hors périmètre est chiffrée à part, ou remplace une fonctionnalité prévue : pas de surprise sur le prix.';

const INCLUDED = [
  'Atelier de cadrage produit avec le CTO',
  'Maquettes UI/UX des écrans clés',
  'Développement du MVP (web, mobile ou desktop)',
  'Authentification, base de données, back-office',
  'Mise en production et déploiement',
  'Point hebdomadaire et canal direct avec le CTO',
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
  { who: 'prod', color: '#4ADE80', text: 'En ligne, lien envoyé au fondateur', ok: true },
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
    q: 'Qu\'est-ce qui change concrètement avec un CTO partenaire ?',
    a: 'Vous n\'achetez pas des heures de développement, vous gagnez quelqu\'un qui s\'engage sur votre produit comme si c\'était le sien : il challenge vos idées, coupe le superflu, choisit une architecture qui tiendra la croissance et vous aide à présenter le produit à vos premiers clients ou investisseurs.',
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
  .mvp-show-sm { display: none; }
  @media (max-width: 720px) { .mvp-show-sm { display: inline; } }
  .mvp-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  .mvp-caret { display: inline-block; width: 1.5px; height: 1.05em; margin-left: 2px; vertical-align: -0.15em; background: ${INK}; animation: mvp-caret 1s steps(1) infinite; }
  @keyframes mvp-caret { 50% { opacity: 0; } }
  .mvp-float { position: fixed; z-index: 70; right: 20px; bottom: max(20px, env(safe-area-inset-bottom)); }
  @media (max-width: 720px) { .mvp-float { right: 12px; bottom: max(12px, env(safe-area-inset-bottom)); } }
  main button:focus-visible, main a:focus-visible, [role="dialog"] button:focus-visible, [role="dialog"] a:focus-visible { outline: 2px solid ${ACCENT_INK}; outline-offset: 2px; }
  /* Entrées du hero en CSS pur : elles se jouent dès l'affichage du HTML, sans attendre le JS
     (en faible débit, le titre et les CTA ne restent plus invisibles pendant le chargement). */
  .mvp-rise { animation: mvp-rise .9s cubic-bezier(.22,1,.36,1) backwards; }
  @keyframes mvp-rise { from { opacity: 0; transform: translateY(24px); filter: blur(8px); } }
  .mvp-word-mask { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .12em; margin-bottom: -.12em; word-spacing: .14em; }
  .mvp-word { display: inline-block; animation: mvp-word .85s cubic-bezier(.22,1,.36,1) backwards; }
  @keyframes mvp-word { from { opacity: 0; transform: translateY(110%); } }
  .mvp-pop { animation: mvp-pop .7s cubic-bezier(.22,1,.36,1) backwards; }
  @keyframes mvp-pop { from { opacity: 0; transform: scale(.94); } }
  @media (prefers-reduced-motion: reduce) {
    .mvp-pulse, .mvp-caret, .mvp-rise, .mvp-word, .mvp-pop { animation: none; }
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
// Titre du hero : même rendu que <Words>, mais animé en CSS pour être visible sans JavaScript.
function HeroTitle({ segments, delay = 0.1, stagger = 0.07 }: { segments: Segment[]; delay?: number; stagger?: number }) {
  let i = 0;
  const word = (text: string, color: string | undefined, trailingSpace: boolean) => {
    const index = i++;
    return (
      <span key={index} className="mvp-word-mask">
        <span className="mvp-word" style={{ color, animationDelay: `${delay + index * stagger}s` }}>{text}</span>
        {trailingSpace && ' '}
      </span>
    );
  };
  return (
    <>
      {segments.map((seg, s) => {
        const words = seg.text.split(' ').filter(Boolean);
        if (seg.pill) {
          const first = i;
          return (
            <React.Fragment key={s}>
              <span className="mvp-pop" style={{ ...pillStyle, animationDelay: `${delay + first * stagger}s` }}>
                {words.map((w, k) => word(w, undefined, k < words.length - 1))}
              </span>
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
    </>
  );
}

function Words({ segments, delay = 0, play, stagger = 0.055 }: { segments: Segment[]; delay?: number; play?: boolean; stagger?: number }) {
  let i = 0;
  const trigger = play === undefined
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-60px' } }
    : { initial: 'hidden', animate: play ? 'show' : 'hidden' };

  const word = (text: string, color: string | undefined, trailingSpace: boolean) => {
    const index = i++;
    return (
      <span key={index} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em', wordSpacing: '0.14em' }}>
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

/* ─── boutons ───────────────────────────────────────── */
function BookButton({ children, source, big = false, onClick }: { children: React.ReactNode; source: string; big?: boolean; onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => { onClick?.(); openMvpBooking(source); }}
      whileHover={{ y: -2, boxShadow: '0 14px 30px rgba(16,16,20,0.25)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: big ? '17px 30px' : '14px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
        background: INK, color: '#fff', fontSize: big ? 16 : 15, fontWeight: 600,
        boxShadow: '0 6px 18px rgba(16,16,20,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
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
      <div style={{ position: 'absolute', top: '9%', left: '6%', right: '6%' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 'clamp(6px, 1.5vw, 14px)' }}>Vidéo · avant de réserver</p>
        <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(20px, 4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          Comment on construit
          <br />
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>votre MVP.</span>
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

// Vidéo de présentation. Sur grand écran, la section est épinglée et le scroll agrandit la vidéo ;
// arrivée à sa taille maximale, elle la garde et la page reprend son défilement (elle ne rétrécit
// qu'en remontant). Un clic sur lecture la garde grande ; quitter la section l'arrête.
function VideoSection() {
  const pinned = usePinned();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const muxRef = useRef<MuxPlayerRefAttributes>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [soon, setSoon] = useState(false);
  const [stage, setStage] = useState({ w: 1200, h: 800 });
  const hasVideo = Boolean(VIDEO.muxPlaybackId || VIDEO.src || VIDEO.youtubeId);
  const poster = VIDEO.poster || (VIDEO.muxPlaybackId ? `https://image.mux.com/${VIDEO.muxPlaybackId}/thumbnail.webp?width=1600&time=1` : '');
  const inView = useInView(trackRef, { amount: 0.05 });

  // Progression qui démarre dès que la section entre par le bas de l'écran (avant l'épinglage) :
  // 0 quand son haut touche le bas de l'écran, 1 à mi-parcours de la partie épinglée.
  const progress = useMotionValue(0);
  useEffect(() => {
    if (!pinned) return;
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const range = el.offsetHeight - vh;
      progress.set(Math.min(1, Math.max(0, (vh - el.getBoundingClientRect().top) / (vh + range * 0.5))));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pinned, progress]);
  const held = useMotionValue(0);
  // Agrandissement dès l'épinglage ; une fois grande, la vidéo le reste et la page reprend son
  // défilement (elle ne rétrécit qu'en remontant).
  const grow = useTransform(progress, [0.15, 1], [0, 1]);
  const size = useTransform([grow, held], ([g, h]: number[]) => Math.max(g, h));
  // Son d'arrivée quand la vidéo atteint sa grande taille au scroll.
  useCrossing(grow, 0.98, 0.6, sfx.arrive);
  // Taille finale : 86 % de l'écran au plus, en 16:9 (la vidéo n'est jamais rognée).
  const smallW = Math.min(920, stage.w - 48, ((stage.h - 200) * 16) / 9);
  const bigW = Math.max(smallW, Math.min(stage.w * 0.86, ((stage.h * 0.86) * 16) / 9));
  const width = useTransform(size, v => smallW + (bigW - smallW) * v);
  const height = useTransform(size, v => ((smallW + (bigW - smallW) * v) * 9) / 16);
  const radius = useTransform(size, v => 22 - 6 * v);
  const frame = useTransform(size, v => 10 * (1 - v));
  const around = useTransform(size, [0.25, 0.6], [1, 0]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStage({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [pinned]);

  // En lecture : plein écran maintenu. Hors lecture : la taille revient au scroll.
  useEffect(() => {
    const controls = animate(held, playing ? 1 : 0, { duration: 0.6, ease: EASE });
    return () => controls.stop();
  }, [playing, held]);

  // Quitter la section arrête la lecture (et démonte le lecteur YouTube).
  useEffect(() => {
    if (inView) return;
    videoRef.current?.pause();
    muxRef.current?.pause();
    setPlaying(false);
  }, [inView]);

  const play = () => {
    if (hasVideo) { setPlaying(true); setEnded(false); trackMvp('video_started'); return; }
    setSoon(true);
    window.setTimeout(() => setSoon(false), 2600);
  };

  const card = (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#111113' }}>
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0 }}>
            {VIDEO.muxPlaybackId ? (
              <MuxPlayer
                ref={muxRef}
                playbackId={VIDEO.muxPlaybackId}
                streamType="on-demand"
                autoPlay
                playsInline
                poster={poster || undefined}
                accentColor={ACCENT}
                metadata={{ video_title: 'Présentation de l\'offre MVP', player_name: 'landing-mvp' }}
                onPlay={() => setEnded(false)}
                onEnded={() => { setEnded(true); setPlaying(false); trackMvp('video_completed'); }}
                style={{ width: '100%', height: '100%', ['--media-object-fit' as string]: 'contain', background: '#000' }}
              />
            ) : VIDEO.youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO.youtubeId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`}
                title="Présentation de l'offre MVP"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            ) : (
              <video
                ref={videoRef}
                src={VIDEO.src}
                poster={VIDEO.poster || undefined}
                controls
                autoPlay
                playsInline
                onPlay={() => setEnded(false)}
                onEnded={() => { setEnded(true); setPlaying(false); trackMvp('video_completed'); }}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              >
                {VIDEO.captions && <track kind="subtitles" src={VIDEO.captions} srcLang="fr" label="Français" default />}
              </video>
            )}
            <button type="button" onClick={() => { videoRef.current?.pause(); muxRef.current?.pause(); setPlaying(false); }} style={{ position: 'absolute', top: 'max(16px, 2.5vh)', right: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <X size={14} /> Réduire
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="poster"
            type="button"
            onClick={play}
            aria-label="Lire la vidéo de présentation"
            initial="rest"
            animate="rest"
            whileHover="hover"
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          >
            {poster
              ? <img src={poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <VideoPosterArt />}

            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ position: 'relative', width: 'clamp(64px, 9vw, 96px)', aspectRatio: '1' }}>
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

      {/* Fin de la vidéo : proposition discrète, jamais d'ouverture automatique de la modale. */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: 'absolute', left: '50%', bottom: '12%', translateX: '-50%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.96)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', width: 'max-content', maxWidth: '90%' }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>On en parle pour votre projet&nbsp;?</span>
            <BookButton source="video-end"><CalendarDays size={16} /> Réserver un appel</BookButton>
            <button type="button" onClick={() => setEnded(false)} aria-label="Masquer l'invitation" style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${LINE}`, background: '#fff', color: MUTED, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><RotateCcw size={15} /></button>
          </motion.div>
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
  );

  // Simple trait qui se dessine entre le hero et la vidéo : le titre est porté par l'affiche.
  const divider = (
    <motion.span
      aria-hidden
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ display: 'block', width: 1, height: 64, margin: '0 auto', background: `linear-gradient(to bottom, transparent, ${FAINT})`, transformOrigin: 'top' }}
    />
  );

  const chapters = VIDEO.chapters.length > 0 && (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
      {VIDEO.chapters.map((chapter, i) => (
        <span key={chapter} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, fontSize: 14, color: INK }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: FAINT, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
          {chapter}
        </span>
      ))}
    </div>
  );

  if (pinned) {
    const smallH = (smallW * 9) / 16;
    return (
      // Bord à bord : on annule le padding horizontal du hero.
      <>
      <div style={{ margin: '56px auto 0' }}>{divider}</div>
      <div id="video" ref={trackRef} style={{ position: 'relative', height: '170vh', margin: '0 -24px' }}>
        <div ref={stageRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <motion.div
            style={{ position: 'absolute', left: '50%', top: '50%', x: '-50%', y: '-50%', width, height, padding: frame, borderRadius: radius, background: '#fff', boxShadow: '0 2px 4px rgba(16,16,20,0.04), 0 40px 100px rgba(16,16,20,0.14)', zIndex: 2 }}
          >
            <motion.div style={{ width: '100%', height: '100%', borderRadius: radius, overflow: 'hidden' }}>{card}</motion.div>
          </motion.div>
          <motion.div style={{ position: 'absolute', left: 0, right: 0, top: `calc(50% + ${smallH / 2 + 28}px)`, padding: '0 24px', opacity: around }}>
            {chapters}
          </motion.div>
        </div>
      </div>
      </>
    );
  }

  return (
    <div id="video" ref={trackRef} style={{ position: 'relative', paddingTop: 56, scrollMarginTop: 90 }}>
      <div style={{ marginBottom: 32 }}>{divider}</div>
      <div ref={stageRef} style={{ maxWidth: 980, margin: '0 auto', padding: 8, borderRadius: 26, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 2px 4px rgba(16,16,20,0.04), 0 30px 80px rgba(16,16,20,0.12)' }}>
        <div style={{ aspectRatio: '16 / 9', borderRadius: 20, overflow: 'hidden' }}>{card}</div>
      </div>
      <div style={{ marginTop: 24 }}>{chapters}</div>
    </div>
  );
}

// Vrai tant qu'une des sections observées est à l'écran (sert à masquer le bouton flottant
// là où un CTA de réservation est déjà visible).
function useAnyInView(ids: string[]) {
  const [visible, setVisible] = useState(true);
  const key = ids.join(',');
  useEffect(() => {
    // Lecture directe des positions plutôt qu'un IntersectionObserver posé au montage : certaines
    // sections (Product Experience) n'existent qu'après leur chargement à la demande.
    const update = () => {
      const limit = window.innerHeight * 0.85;
      const any = key.split(',').some(id => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r ? r.bottom > 0 && r.top < limit : false;
      });
      setVisible(prev => (prev === any ? prev : any));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [key]);
  return visible;
}

// Monte son contenu quand il approche de l'écran (≈ 0,6 écran d'avance). En attendant, un bloc de
// même hauteur minimale réserve la place, sans saut de mise en page à l'écran.
function LazySection({ children, minHeight }: { children: React.ReactNode; minHeight: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setShow(true); }, { rootMargin: '60% 0px' });
    // On attend que la mise en page soit stabilisée (bascule en mode épinglé, sections au-dessus à
    // leur vraie hauteur) : sinon la section paraît proche au premier rendu et se charge d'emblée.
    const timer = window.setTimeout(() => io.observe(el), 700);
    return () => { window.clearTimeout(timer); io.disconnect(); };
  }, [show]);
  if (show) return <>{children}</>;
  return <div ref={ref} aria-hidden style={{ minHeight }} />;
}

// Vrai pendant une séquence plein écran (vidéo agrandie, expérience produit ou méthode épinglées) :
// la nav s'efface pour laisser tout l'écran à la scène.
const IMMERSIVE: { id: string; from: number; to: number }[] = [
  { id: 'video', from: 0, to: 1 },
  { id: 'experience', from: 0, to: 1 },
  { id: 'methode', from: 0, to: 1 },
];

// Défilement par blocs entre le hero, la vidéo (à sa grande taille) et l'écran de choix bleu :
// quelle que soit l'amplitude du geste (molette, trackpad, clavier), on arrive pile sur le bloc
// suivant ou précédent. Au-delà du dernier bloc, le défilement redevient libre. Grand écran
// uniquement, avec Lenis (donc mouvement non réduit), et jamais modale ouverte.
function useBlockSnap(lenisRef: React.RefObject<Lenis | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const pin = window.matchMedia(PIN_QUERY);
    let animating = false;
    let draining = false; // ignore l'inertie du trackpad qui suit un saut
    let drainTimer = 0;
    let safetyTimer = 0;
    let jumpDir: 1 | -1 = 1;

    const points = () => {
      const out = [0];
      const vh = window.innerHeight;
      const video = document.getElementById('video');
      if (video) {
        const top = video.getBoundingClientRect().top + window.scrollY;
        out.push(Math.round(top + (video.offsetHeight - vh) * 0.5)); // vidéo à sa taille maximale
      }
      const chooser = document.getElementById('experience')?.firstElementChild as HTMLElement | null;
      if (chooser && chooser.querySelector('[data-choice]')) {
        const top = chooser.getBoundingClientRect().top + window.scrollY;
        out.push(Math.round(top + (chooser.offsetHeight - vh) * 0.4)); // écran bleu, choix affichés
      }
      return out.sort((a, b) => a - b);
    };

    const drain = () => {
      draining = true;
      window.clearTimeout(drainTimer);
      drainTimer = window.setTimeout(() => { draining = false; }, 180);
    };

    // Renvoie vrai si le geste a été pris en charge par un saut de bloc.
    const jump = (direction: 1 | -1) => {
      const lenis = lenisRef.current;
      if (!lenis || !pin.matches || isLiteNetwork()) return false;
      const y = window.scrollY;
      const pts = points();
      const last = pts[pts.length - 1];
      let target: number | undefined;
      if (y > last + 2) {
        // Juste sous le dernier bloc, en remontant : on se recale dessus plutôt que d'y arriver à moitié.
        if (direction > 0 || y > last + window.innerHeight * 0.9) return false;
        target = last;
      } else {
        if (y >= last - 2 && direction > 0) return false; // au-delà du dernier bloc : défilement libre
        target = direction > 0 ? pts.find(pt => pt > y + 2) : [...pts].reverse().find(pt => pt < y - 2);
      }
      if (target === undefined) return false;
      animating = true;
      // Filet de sécurité : si le saut est interrompu sans onComplete, on ne reste pas bloqué.
      jumpDir = direction;
      window.clearTimeout(safetyTimer);
      safetyTimer = window.setTimeout(() => { animating = false; }, 1900);
      // En descendant : courbe qui démarre tout de suite et ralentit à l'arrivée (ease-out), la
      // vidéo grandit dans la partie lente. En remontant, c'est au départ que la vidéo rétrécit et
      // que l'écran bleu se replie : une courbe douce aux deux bouts (ease-in-out sinus), un peu plus
      // longue, évite cet effet brutal.
      const touchesVideo = target === pts[1] || Math.abs(y - pts[1]) < 4;
      const up = direction < 0;
      sfx.jump(direction);
      lenis.scrollTo(target, {
        duration: up ? (touchesVideo ? 1.4 : 1.2) : (touchesVideo ? 1.3 : 1),
        easing: up ? (t: number) => -(Math.cos(Math.PI * t) - 1) / 2 : (t: number) => 1 - Math.pow(1 - t, 4),
        lock: true,
        force: true,
        onComplete: () => { animating = false; window.clearTimeout(safetyTimer); sfx.land(); drain(); },
      });
      return true;
    };

    // Le geste concerne-t-il la zone des blocs ? (même règle que jump, sans sauter)
    const inZone = (direction: 1 | -1) => {
      if (!lenisRef.current || !pin.matches || isLiteNetwork()) return false;
      const y = window.scrollY;
      const pts = points();
      const last = pts[pts.length - 1];
      if (y > last + 2) return direction < 0 && y <= last + window.innerHeight * 0.9;
      return !(y >= last - 2 && direction > 0);
    };

    let acc = 0; // petits deltas cumulés (trackpad doux, molette en lignes)
    let accAt = 0;
    let floor = Infinity; // plus petit delta vu pendant l'inertie en cours

    const onWheel = (e: WheelEvent) => {
      // Deltas en pixels quel que soit le périphérique (Firefox compte parfois en lignes ou pages).
      const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (d === 0) return;
      const direction: 1 | -1 = d > 0 ? 1 : -1;
      const abs = Math.abs(d);

      if (animating) {
        e.preventDefault();
        e.stopPropagation();
        // Geste franc dans l'autre sens : on interrompt le saut et on repart aussitôt.
        if (direction !== jumpDir && abs >= 10) { animating = false; floor = Infinity; jump(direction); return; }
        floor = Math.min(floor, abs);
        return;
      }
      if (!inZone(direction)) { draining = false; acc = 0; return; } // défilement libre hors zone

      // Dans la zone, rien ne défile librement : chaque delta est soit absorbé, soit un saut.
      e.preventDefault();
      e.stopPropagation();

      if (draining) {
        // Inertie qui décroît : on l'absorbe. Un delta qui repart nettement au-dessus du creux de
        // l'inertie est un nouveau geste : on le traite tout de suite au lieu de l'avaler.
        const fresh = abs >= 10 && abs > floor * 2.5;
        floor = Math.min(floor, abs);
        if (!fresh) { drain(); return; }
        draining = false;
      }
      floor = Infinity;

      const now = performance.now();
      if (now - accAt > 250 || Math.sign(acc) !== direction) acc = 0;
      acc += d;
      accAt = now;
      if (Math.abs(acc) < 6) return;
      acc = 0;
      jump(direction);
    };

    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      if (el instanceof Element && el.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey;
      const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (!down && !up) return;
      if (animating) {
        e.preventDefault();
        if ((down ? 1 : -1) !== jumpDir) { animating = false; jump(down ? 1 : -1); }
        return;
      }
      if (jump(down ? 1 : -1)) e.preventDefault();
    };

    // Capture : passe avant l'écouteur de Lenis, qui ne reçoit pas les gestes absorbés.
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(drainTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [lenisRef, enabled]);
}

function useImmersive() {
  const [immersive, setImmersive] = useState(false);
  useEffect(() => {
    const pin = window.matchMedia(PIN_QUERY);
    const update = () => {
      let on = false;
      if (pin.matches && !isLiteNetwork()) {
        for (const { id, from, to } of IMMERSIVE) {
          // la piste épinglée est l'élément lui-même (#video) ou son premier enfant
          const section = document.getElementById(id);
          const el = id === 'video' ? section : section?.firstElementChild as HTMLElement | null;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (id === 'video') {
            const vh = window.innerHeight;
            if (rect.top <= vh * 0.45 && rect.bottom >= vh * 0.55) { on = true; break; }
            continue;
          }
          const range = el.offsetHeight - window.innerHeight;
          // Écran unique (écran de choix des produits) : plein écran tant qu'il couvre la vue.
          if (range <= 40) {
            if (rect.top <= 40 && rect.bottom >= window.innerHeight - 40) { on = true; break; }
            continue;
          }
          const p = -rect.top / range;
          if (p >= from && p <= to) { on = true; break; }
        }
      }
      setImmersive(prev => (prev === on ? prev : on));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    pin.addEventListener('change', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      pin.removeEventListener('change', update);
    };
  }, []);
  return immersive;
}

// Interrupteur du sound design (sons d'interface synthétisés, cf. sound.ts), mémorisé par navigateur.
function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label={on ? 'Couper le son' : 'Activer le son'}
      title={on ? 'Couper le son' : 'Activer le son'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 12px', borderRadius: 999, border: `1px solid ${LINE}`, background: '#fff', color: on ? INK : MUTED, fontSize: 13, cursor: 'pointer' }}
    >
      {on ? <Volume2 size={15} /> : <VolumeX size={15} />} {on ? 'Son activé' : 'Son coupé'}
    </button>
  );
}

// Liens partageables qui menaient au calendrier intégré : ils ouvrent désormais la modale.
const BOOKING_HASHES = ['calendrier', 'reserver'];

/* ─── page ─────────────────────────────────────────── */
export default function MvpOfferPage() {
  const ready = useLoaderGone();
  const lenisRef = useRef<Lenis | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const mainHref = useMainSiteHref();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Source du premier clic sur un CTA : c'est lui qui déclenche le chargement de la modale. Une
  // fois montée, la modale écoute elle-même les clics suivants.
  const [bookingSource, setBookingSource] = useState<string | null>(null);
  useEffect(() => {
    if (bookingSource) return;
    const onOpen = (event: Event) => setBookingSource((event as CustomEvent<{ source?: string }>).detail?.source ?? 'unknown');
    window.addEventListener(OPEN_BOOKING_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_BOOKING_EVENT, onOpen);
  }, [bookingSource]);
  // Connexion confortable : on précharge le code de la modale quand le navigateur est inactif,
  // pour que le premier clic l'ouvre sans attente. Connexion modeste (3G ou moins) : rien n'est préchargé.
  useEffect(() => {
    if (isSlowNetwork()) return;
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const warm = () => { void import('./BookingModal'); };
    const id = idle ? idle(warm) : window.setTimeout(warm, 2500);
    return () => { if (!idle) window.clearTimeout(id); };
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  useMotionValueEvent(scrollY, 'change', y => setScrolled(y > 24));

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroFade = useTransform(heroProgress, [0, 0.5], [1, 0.35]);

  const ctaInView = useAnyInView(['hero', 'experience', 'offre', 'reserver']);
  // Son d'arrivée sur le CTA final, une fois par passage.
  const finalSeen = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const r = document.getElementById('reserver')?.getBoundingClientRect();
      finalSeen.set(r ? Math.max(0, Math.min(1, (window.innerHeight - r.top) / (r.height * 0.6))) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [finalSeen]);
  useCrossing(finalSeen, 1, 0.3, sfx.arrive);
  const immersive = useImmersive();
  useBlockSnap(lenisRef, !bookingOpen);
  const showFloating = ready && !ctaInView && !bookingOpen;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLiteNetwork()) return;
    // Le layout racine pose `scroll-behavior: smooth` sur <html> : avec Lenis, chaque position
    // qu'il écrit serait re-lissée par le navigateur (retards, à-coups). On le neutralise ici.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    const lenis = new Lenis({ duration: 0.9, smoothWheel: true });
    lenisRef.current = lenis;
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null; root.style.scrollBehavior = previousBehavior; };
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -20, duration: 1.6 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToY = (y: number, { immediate = false, duration = 1, easing }: { immediate?: boolean; duration?: number; easing?: (t: number) => number } = {}) => {
    if (lenisRef.current) lenisRef.current.scrollTo(y, immediate ? { immediate: true } : { duration, easing });
    else window.scrollTo({ top: y, behavior: immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  // Lien partageable (ex. mvp.ozirus.agency/#offre) : le saut natif du navigateur part avant la
  // fin du loader, on le rejoue une fois la page prête. #calendrier / #reserver ouvrent la modale.
  useEffect(() => {
    if (!ready) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const timer = window.setTimeout(() => {
      if (BOOKING_HASHES.includes(id)) { openMvpBooking('lien-partage'); return; }
      const target = document.getElementById(id);
      if (!target) return;
      if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -90, immediate: true });
      else target.scrollIntoView({ block: 'start' });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <MotionConfig reducedMotion="user">
      <style>{PAGE_CSS}</style>
      <main style={{ position: 'relative', background: '#F4F4F5', color: INK, minHeight: '100vh', overflowX: 'clip' }}>

        <motion.div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 60, background: INK, transformOrigin: 'left', scaleX: progress }} />

        <div style={{ position: 'relative', maxWidth: 1760, margin: '0 auto', background: '#FCFCFC', borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }}>

          {/* ── 01 HEADER ── transparent en haut de page, verre dépoli dès le premier scroll */}
          <motion.header
            initial={false}
            animate={immersive ? { opacity: 0, y: -90 } : { opacity: 1, y: 0 }}
            transition={{ duration: immersive ? 0.35 : 0.5, ease: EASE }}
            aria-hidden={immersive || undefined}
            inert={immersive || undefined}
            style={{ position: 'sticky', top: 14, zIndex: 50, padding: '14px 16px 0' }}
          >
            <div style={{ maxWidth: 820, margin: '0 auto', height: 58, padding: '0 8px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderRadius: 16, transition: 'background .3s, border-color .3s, box-shadow .3s', background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0)', backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none', border: `1px solid ${scrolled ? LINE : 'transparent'}`, boxShadow: scrolled ? '0 1px 2px rgba(16,16,20,0.04), 0 10px 30px rgba(16,16,20,0.06)' : 'none' }}>
              <a href="https://ozirus.agency" aria-label="Ozirus Agency" style={{ display: 'flex' }}>
                <img src="/logo.png" alt="Ozirus" style={{ height: 24, filter: 'brightness(0)' }} />
              </a>
              <nav aria-label="Sections de la page" className="mvp-hide-sm" style={{ display: 'flex', gap: 22 }}>
                {[['methode', 'Méthode'], ['offre', 'Offre'], ['faq', 'FAQ']].map(([id, label]) => (
                  <button key={id} type="button" className="mvp-navlink" onClick={() => scrollTo(id)}>{label}</button>
                ))}
              </nav>
              <motion.button
                type="button"
                onClick={() => openMvpBooking('header')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: 11, background: INK, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <CalendarDays size={15} /> Réserver un appel
              </motion.button>
            </div>
          </motion.header>

          {/* ── 02 HERO : proposition de valeur + vidéo ── */}
          <section id="hero" ref={heroRef} style={{ position: 'relative', padding: '72px 24px 104px' }}>
            <motion.div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', textAlign: 'center', opacity: heroFade }}>
              <motion.button
                className="mvp-rise"
                type="button"
                onClick={() => scrollTo('offre')}
                style={{ animationDelay: '0s', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '5px 12px 5px 5px', borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.04)', fontSize: 13, fontWeight: 500, color: INK, marginBottom: 28, cursor: 'pointer' }}
              >
                <span style={{ padding: '3px 9px', borderRadius: 999, background: INK, color: '#fff', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>2 formats</span>
                <span style={{ whiteSpace: 'nowrap' }}>15 ou 30 jours<span className="mvp-hide-sm"> · une version tous les 2 jours</span></span>
                <ArrowRight size={13} color={FAINT} />
              </motion.button>

              <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', lineHeight: 1.06, letterSpacing: '-0.035em', color: INK, marginBottom: 24 }}>
                <HeroTitle
                  segments={[
                    { text: 'Votre MVP en', br: true },
                    { text: '15 ou 30 jours,', pill: true },
                    { text: 'avec un CTO qui pilote.', br: true },
                  ]}
                />
              </h1>

              <motion.p className="mvp-rise" style={{ animationDelay: '0.55s', fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.7, color: MUTED, maxWidth: 660, margin: '0 auto 36px' }}>
                Pour les fondateurs de SaaS et de startups : on cadre le bon périmètre, on construit votre application web, mobile, desktop ou produit IA, et vous demandez des ajustements jusqu&apos;à la mise en ligne.
                <strong style={{ color: INK, fontWeight: 600 }}> Une version tous les 2 jours, délai fixe et prix clair — sans prise de participation.</strong>
              </motion.p>

              <motion.div className="mvp-rise" style={{ animationDelay: '0.7s', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
                <BookButton big source="hero" onClick={() => trackMvp('hero_cta_clicked', { cta: 'booking' })}>
                  <CalendarDays size={17} /> Réserver un appel
                </BookButton>
              </motion.div>

              <motion.div className="mvp-rise" style={{ animationDelay: '0.85s', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 600, letterSpacing: '-0.02em' }}>
                  À partir de {eur(OFFERS[0].price)}
                </span>
              </motion.div>
              <motion.p className="mvp-rise" style={{ animationDelay: '1s', fontSize: 14, color: FAINT, marginTop: 10 }}>
                Sprint 15 jours : {eur(OFFERS[0].price)} HT · MVP complet 30 jours : {eur(OFFERS[1].price)} HT
              </motion.p>
            </motion.div>

            <VideoSection />
          </section>

          {/* ── 03 + 04 TRANSITION ET PRODUCT EXPERIENCE ── */}
          <LazySection minHeight="100svh">
            <ProductExperience scrollToY={scrollToY} />
          </LazySection>

          {/* ── 05 ENJEUX ── */}
          <Section id="enjeux">
            <SectionHead
              eyebrow="Le vrai enjeu"
              title={[{ text: 'Le code n\'est pas' }, { text: 'le plus difficile.', muted: true }]}
              sub="La plupart des MVP ratés ne le sont pas à cause du code, mais des décisions prises avant. C'est là qu'un CTO fait toute la différence."
            />
            <div style={{ maxWidth: 1000, margin: '0 auto', borderTop: `1px solid ${LINE}` }}>
              {PROBLEMS.map((p, i) => (
                <motion.div key={p.risk} {...upView(i * 0.08)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px 48px', padding: '30px 0', borderBottom: `1px solid ${LINE}` }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: FAINT, fontVariantNumeric: 'tabular-nums', paddingTop: 3 }}>{String(i + 1).padStart(2, '0')}</span>
                    <p style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.25rem, 2.4vw, 1.6rem)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em' }}>{p.risk}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: ACCENT_SOFT, display: 'grid', placeItems: 'center' }}><p.answer.icon size={18} color={ACCENT_INK} /></span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{p.answer.title}</h3>
                      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: MUTED }}>{p.answer.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p {...upView(0.1)} style={{ maxWidth: 680, margin: '36px auto 56px', textAlign: 'center', fontSize: 15.5, lineHeight: 1.7, color: MUTED }}>
              <strong style={{ color: INK }}>{CTO_POINTS[3].title}.</strong> {CTO_POINTS[3].desc}
            </motion.p>

            <motion.div {...upView()} style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, overflow: 'hidden', background: '#fff', border: `1px solid ${LINE}`, boxShadow: card.boxShadow }}>
              <div className="mvp-compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#FAFAFB' }}>
                <p style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Un prestataire classique</p>
                <p style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: ACCENT_INK, textTransform: 'uppercase', letterSpacing: '0.06em', background: ACCENT_SOFT }}>Un CTO partenaire</p>
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
                    <CheckCircle2 size={16} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                    {row.cto}
                  </motion.p>
                </div>
              ))}
            </motion.div>
          </Section>

          {/* ── 06 MÉTHODE ── défilement horizontal piloté par le scroll, puis le rôle de l'IA */}
          <MethodScroll />
          <Section>
            <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <motion.h3 {...upView()} style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.12, marginBottom: 12 }}>
                  Un CTO <span style={{ color: FAINT }}>augmenté par l&apos;IA.</span>
                </motion.h3>
                <motion.p {...upView(0.1)} style={{ fontSize: 15.5, lineHeight: 1.7, color: MUTED, marginBottom: 26 }}>
                  L&apos;IA accélère l&apos;exécution. Le cadrage, l&apos;architecture, la relecture, les tests et la responsabilité de la livraison restent ceux du CTO.
                </motion.p>
                <div style={{ display: 'grid', gap: 20 }}>
                  {AI_METHOD.map((m, i) => (
                    <motion.div key={m.title} {...upView(i * 0.08)} style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: '#fff', border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <m.icon size={18} color={INK} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{m.title}</h4>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTED }}>{m.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <AgentTerminal />
            </div>
          </Section>

          {/* ── 07 LIVRABLES ── */}
          <Section id="livrables">
            <SectionHead
              eyebrow="Livrables"
              title={[{ text: 'Ce que vous' }, { text: 'récupérez.', muted: true }]}
              sub="Un produit en ligne, et tout ce qu'il faut pour le faire vivre ensuite. Le détail par format est dans l'offre juste en dessous."
            />
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <motion.div {...upView()} style={{ ...card, padding: 'clamp(24px, 4vw, 34px)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Le socle livré</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 13 }}>
                  {INCLUDED.map(item => <li key={item} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.5 }}><CheckCircle2 size={17} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} /> {item}</li>)}
                </ul>
              </motion.div>
              <div style={{ display: 'grid', gap: 16 }}>
                <motion.div {...upView(0.08)} style={{ ...card, padding: 'clamp(22px, 3.5vw, 30px)' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>En plus dans le format 30 jours</h3>
                  <div style={{ display: 'grid', gap: 16 }}>
                    {BONUSES.map(b => (
                      <div key={b.title} style={{ display: 'flex', gap: 14 }}>
                        <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: '#F6F6F7', border: `1px solid ${LINE}`, display: 'grid', placeItems: 'center' }}><b.icon size={17} color={INK} /></span>
                        <div><p style={{ fontSize: 15, fontWeight: 600 }}>{b.title}</p><p style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, marginTop: 3 }}>{b.desc}</p></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div {...upView(0.16)} style={{ ...card, padding: 'clamp(22px, 3.5vw, 30px)', background: '#FAFAFB' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Après la mise en ligne</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: MUTED }}>Vous repartez avec votre code, vos accès et une version en ligne. La suite (V2, nouvelles fonctionnalités) ne fait pas partie du forfait : vous la menez seul, avec votre équipe ou avec Ozirus.</p>
                </motion.div>
              </div>
            </div>
            <motion.div {...upView(0.1)} style={{ maxWidth: 1000, margin: '28px auto 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: FAINT, marginRight: 4 }}>Technologies selon le projet :</span>
              {STACK.map(t => <span key={t} style={{ padding: '6px 12px', borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, fontSize: 13, color: MUTED }}>{t}</span>)}
            </motion.div>
          </Section>

          {/* ── 08 OFFRE ── */}
          <Section id="offre" style={{ padding: '104px 24px' }}>
            <SectionHead eyebrow="Deux formats, un même engagement" title={[{ text: 'Choisissez votre' }, { text: 'vitesse de lancement.', muted: true }]} sub={REVISION_PROMISE} />

            <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 16px' }}>
                    <BookButton big source={`offre-${offer.days}j`}>Discuter de mon projet <ArrowRight size={17} /></BookButton>
                    <a href={`mailto:${OFFER.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: MUTED }}>
                      <Mail size={15} /> ou par email
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div {...upView(0.2)} style={{ maxWidth: 1040, margin: '22px auto 0', padding: '18px 22px', borderRadius: 16, background: '#FFFBF0', border: '1px solid #FDE7B0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Gift size={18} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED }}><strong style={{ color: INK }}>Dans les deux formats :</strong> une version tous les 2 jours, accès direct au CTO, itérations priorisées ensemble, propriété du code et mise en ligne sur vos comptes. La landing page et la vidéo motion promo sont incluses dans le format 30 jours.</p>
            </motion.div>
          </Section>

          {/* ── 09 PREUVES ET OBJECTIONS ── */}
          <Section id="faq">
            <SectionHead eyebrow="Avant de vous lancer" title={[{ text: 'Ce qui reste' }, { text: 'à vous.', muted: true }]} />
            <div style={{ maxWidth: 1000, margin: '0 auto 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { node: <><CountUp to={OFFER.years} /> ans</>, label: 'à concevoir et livrer des produits' },
                { node: <><CountUp to={15} />+</>, label: 'applications déployées en production' },
                { node: <><CountUp to={OFFER.days} /> jours</>, label: 'de l\'idée au produit en ligne' },
                { node: <CountUp to={1} duration={0.8} />, label: 'interlocuteur : le CTO, du début à la fin' },
              ].map((stat, i) => (
                <SpotCard key={stat.label} delay={i * 0.08} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', color: INK }}>{stat.node}</p>
                  <p style={{ fontSize: 14, color: MUTED, marginTop: 6, lineHeight: 1.5 }}>{stat.label}</p>
                </SpotCard>
              ))}
            </div>
            <div style={{ maxWidth: 1000, margin: '0 auto 72px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, padding: '28px 4px 0' }}>
              {OWNERSHIP.map((o, i) => (
                <motion.div key={o.title} {...upView(i * 0.08)} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 11, background: ACCENT_SOFT, display: 'grid', placeItems: 'center' }}><o.icon size={18} color={ACCENT_INK} /></span>
                  <div><h3 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 4 }}>{o.title}</h3><p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED }}>{o.desc}</p></div>
                </motion.div>
              ))}
            </div>
            <h3 style={{ maxWidth: 760, margin: '0 auto 6px', fontFamily: DISPLAY, fontSize: 24, fontWeight: 600, letterSpacing: '-0.015em' }}>Questions fréquentes</h3>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {FAQS.map((f, i) => <FaqItem key={f.q} index={i} {...f} />)}
            </div>
          </Section>

          {/* ── 10 CTA FINAL ── (#calendrier conservé : les anciens liens ouvrent la modale) */}
          <Section id="reserver" style={{ padding: '120px 24px', textAlign: 'center' }}>
            <div id="calendrier" style={{ maxWidth: 760, margin: '0 auto' }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: 20 }}>
                <Words segments={[{ text: 'Parlons de' }, { text: 'votre MVP.', muted: true }]} />
              </h2>
              <motion.p {...upView(0.3)} style={{ fontSize: 17, lineHeight: 1.7, color: MUTED, marginBottom: 34 }}>
                Un appel pour clarifier l&apos;idée, la cible et ce que doit contenir le MVP, puis choisir le bon format. Si ce n&apos;est pas le bon moment, on vous le dira.
              </motion.p>
              <motion.div {...upView(0.4)}>
                <BookButton big source="final"><CalendarDays size={18} /> Réserver un appel</BookButton>
              </motion.div>
              <motion.p {...upView(0.5)} style={{ fontSize: 13, color: FAINT, marginTop: 22 }}>
                Plutôt par écrit ? <a href={`mailto:${OFFER.email}`} style={{ color: INK }}>{OFFER.email}</a>
              </motion.p>
            </div>
          </Section>

          {/* ── 11 FOOTER ── */}
          <footer style={{ padding: '36px 24px', borderTop: `1px solid ${LINE}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 18, maxWidth: 1100, margin: '0 auto' }}>
            <div>
              <a href="https://ozirus.agency" aria-label="Ozirus Agency">
                <img src="/logo.png" alt="Ozirus" style={{ height: 20, filter: 'brightness(0)', opacity: 0.4 }} />
              </a>
              <p style={{ fontSize: 12, color: FAINT, marginTop: 10 }}>© {new Date().getFullYear()} Ozirus Agency</p>
            </div>
            <nav aria-label="Liens utiles" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 20px', fontSize: 13 }}>
              <a href={`mailto:${OFFER.email}`} style={{ color: MUTED }}>{OFFER.email}</a>
              <a href={mainHref('/terms')} style={{ color: MUTED }}>Conditions</a>
              <a href={mainHref('/privacy')} style={{ color: MUTED }}>Confidentialité</a>
              <SoundToggle />
            </nav>
          </footer>
        </div>

        {/* Bouton flottant : seulement hors des zones qui ont déjà un CTA de réservation. */}
        <AnimatePresence>
          {showFloating && (
            <motion.button
              type="button"
              className="mvp-float"
              onClick={() => openMvpBooking('floating')}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: INK, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 12px 30px rgba(16,16,20,0.28)' }}
            >
              <CalendarDays size={16} /> Réserver un appel
            </motion.button>
          )}
        </AnimatePresence>

        {bookingSource && <BookingModal lenis={lenisRef} onOpenChange={setBookingOpen} initialSource={bookingSource} />}
      </main>
    </MotionConfig>
  );
}
