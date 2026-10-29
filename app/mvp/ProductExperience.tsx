'use client';

// Section signature de la landing MVP, plein écran : le visiteur choisit un type de produit
// (mobile, SaaS web, desktop) et le scroll joue le produit fictif étape par étape.
//
// Grand écran : la section est épinglée (100vh, bord à bord). La progression de la piste
// (`track`, 0 → 1) pilote une intro (titre plein écran qui s'efface, appareil qui entre), puis
// `story` (0 → STEPS) : la partie entière donne l'étape affichée, la partie décimale anime l'écran
// image par image dans les deux sens de scroll. Un clic sur une étape fait défiler la page jusqu'à
// sa position : le scroll reste l'unique source de vérité, sans boucle.
// Mobile / mouvement réduit : pas d'épinglage ; boutons, étapes et glissement sur l'appareil,
// chaque étape se joue toute seule (ou s'affiche directement si le mouvement est réduit).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence, animate, motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue,
} from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Box, Calendar, ChartColumn, Check, CheckCircle2, Download, FileText,
  Folder, Globe, Inbox, LayoutGrid, LifeBuoy, LoaderCircle, Monitor, MousePointer2, Package, Pointer, Search, Settings,
  ShieldCheck, Smartphone, Smile, Sparkles, Timer, TrendingUp, Truck, Zap,
} from 'lucide-react';
import {
  DesktopMonitor, HAIRLINE, IOS, IOSStatusBar, IPhone, MACBOOK_H, MACBOOK_W, MONITOR_H, MONITOR_W, MacBookPro14, PHONE_H, PHONE_W,
  SAFE_TOP, SCREEN_RADIUS, SCREEN_W, SF_MONO, iosType, useFitBox,
} from './devices';
import {
  ArrowRight as SFArrowRight, ArrowUp, ArrowUturnLeft, Bell, BellFill, BoltFill, CalendarSym, CheckCircleFill, Checkmark, ChevronRight, Clock, CreditCardFill,
  Ellipsis, FigureRun, FlameFill, HeartFill, HouseFill, Magnifier, Person2Fill, PersonFill, Sparkles as SFSparkles, StarFill, XMark,
} from './sfSymbols';
import { trackMvp } from './analytics';
import { openMvpBooking } from './bookingEvents';
import { sfx, useCrossing } from './sound';
import { clamp01, trackScrollY, useMedia, usePinned, useStepped, useTrackProgress } from './scroll';
import { ACCENT, ACCENT_INK, ACCENT_SOFT, DISPLAY, EASE, FAINT, GREEN, INK, LINE, MUTED } from './theme';

type Product = 'mobile' | 'web' | 'desktop';
type StepDef = { label: string; title: string; desc: string; built: string[] };

const PRODUCTS: { id: Product; label: string; short: string; icon: typeof Globe; pitch: string; ambient: string; steps: StepDef[] }[] = [
  {
    id: 'mobile',
    label: 'Application mobile',
    short: 'Mobile',
    icon: Smartphone,
    pitch: 'Exemple : l\'app de réservation d\'un studio sportif, en design iOS Liquid Glass.',
    ambient: 'radial-gradient(70% 60% at 70% 40%, #FFE3CF 0%, rgba(255,227,207,0) 70%), radial-gradient(60% 60% at 20% 80%, #E7E1FF 0%, rgba(231,225,255,0) 70%), #FBF8F4',
    steps: [
      { label: 'Bienvenue', title: 'Du splash à l\'onboarding, sans friction', desc: 'Un écran de lancement aux couleurs de la marque, puis trois écrans qui montrent le produit au lieu de l\'expliquer. Un seul bouton, et « Passer » toujours à portée.', built: ['Onboarding court et passable', 'Design iOS natif'] },
      { label: 'Essai guidé', title: 'Apprendre en réservant pour de vrai', desc: 'Pas de diaporama : une astuce contextuelle pointe le bon cours, l\'utilisateur réserve lui-même dès la première minute.', built: ['Astuces contextuelles', 'Disponibilités en temps réel'] },
      { label: 'Confirmation', title: 'La permission demandée au bon moment', desc: 'Les rappels sont proposés juste après la réservation, avec leur bénéfice expliqué. Puis le billet, prêt dans le Wallet.', built: ['Notifications', 'Back-office du studio'] },
    ],
  },
  {
    id: 'web',
    label: 'SaaS / application web',
    short: 'SaaS web',
    icon: Globe,
    pitch: 'Exemple : Lumen, un agent IA qui répond aux clients d\'une boutique en ligne, apprend de sa documentation et rend compte de ce qu\'il fait.',
    ambient: 'radial-gradient(60% 60% at 75% 35%, #E3DEFF 0%, rgba(227,222,255,0) 70%), radial-gradient(50% 60% at 15% 85%, #D5F5EE 0%, rgba(213,245,238,0) 70%), #F5F5FA',
    steps: [
      { label: 'Onboarding', title: 'L\'IA apprend votre produit en deux minutes', desc: 'On branche le centre d\'aide, la boîte support et la doc : l\'agent lit tout, en tire les règles de la maison et choisit son ton. Aucun prompt à écrire.', built: ['Connexion des sources', 'Indexation et recherche (RAG)'] },
      { label: 'Agent', title: 'Il enquête, répond et agit', desc: 'Commande retrouvée, suivi vérifié, règle appliquée : la réponse cite ses sources et l\'action est exécutée. Sous un seuil de confiance, un humain prend le relais.', built: ['Agent et outils', 'Citations et garde-fous'] },
      { label: 'Analyses', title: 'Il rend des comptes, chiffres à l\'appui', desc: 'Taux de résolution, temps gagné, sujets qui montent : le tableau de bord se lit en trois secondes, et l\'IA propose la prochaine action.', built: ['Tableau de bord', 'Synthèses IA'] },
    ],
  },
  {
    id: 'desktop',
    label: 'Application desktop',
    short: 'Desktop',
    icon: Monitor,
    pitch: 'Exemple : un logiciel de gestion de production pour un atelier, utilisable hors ligne.',
    ambient: 'radial-gradient(60% 60% at 70% 40%, #DCE6F5 0%, rgba(220,230,245,0) 70%), radial-gradient(50% 60% at 20% 85%, #EDE6DA 0%, rgba(237,230,218,0) 70%), #F5F6F8',
    steps: [
      { label: 'Navigation', title: 'Des repères de logiciel de bureau', desc: 'Barre de menus, arborescence, raccourcis clavier : l\'outil s\'utilise toute la journée, il doit être rapide à parcourir.', built: ['macOS et Windows', 'Navigation clavier'] },
      { label: 'Espace principal', title: 'Le détail sans changer d\'écran', desc: 'La liste des commandes à gauche, l\'inspecteur à droite. L\'atelier voit l\'état de chaque commande d\'un coup d\'œil.', built: ['Base de données locale', 'Synchronisation'] },
      { label: 'Action métier', title: 'Lancer la production en un clic', desc: 'Le bon de fabrication est généré, le stock réservé, l\'équipe prévenue. Même sans connexion, la synchro reprend ensuite.', built: ['Génération de documents', 'Mode hors ligne'] },
    ],
  },
];

const STEPS = 3;
const INTRO = 0.04; // part de la piste consacrée à l'entrée en scène
// Sortie + entrée de `screenSlide` : l'animation d'une étape ne démarre qu'une fois son écran en place.
const SCREEN_SETTLE = 0.85;
const STEP_PLAY = 2.4; // durée de lecture d'une étape lancée par les flèches, les onglets ou un glissement

const frNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Progression locale (0 → 1) de l'étape `step` dans l'histoire. */
function useLocal(story: MotionValue<number>, step: number) {
  return useTransform(story, v => clamp01((v - step) * 1.15));
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' | 'green' | 'amber' }) {
  const tones = { neutral: ['#F1F1F3', MUTED], accent: [ACCENT_SOFT, ACCENT_INK], green: ['#DCFCE7', '#15803D'], amber: ['#FEF3C7', '#B45309'] } as const;
  const [bg, fg] = tones[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: bg, color: fg, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{children}</span>;
}

/* ═══ SaaS web : Lumen, agent IA de support client ═══
   Interface sombre façon outils IA récents : fond quasi noir, filets à 7 % de blanc, une seule
   couleur d'accent (dégradé violet → menthe) réservée à ce que fait l'IA. */
const AI = {
  bg: '#0A0A0D',
  panel: '#111116',
  raised: '#17171D',
  line: 'rgba(255,255,255,0.07)',
  text: '#EDEDF2',
  muted: '#8C8C99',
  faint: '#5C5C68',
  violet: '#8B7BFF',
  mint: '#5EEAD4',
  green: '#4ADE80',
  amber: '#FBBF24',
} as const;
const AI_GRADIENT = `linear-gradient(135deg, ${AI.violet}, ${AI.mint})`;

/** Orbe de l'agent : sphère en dégradé qui tourne doucement. */
function Orb({ size, glow = true }: { size: number; glow?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'block', width: size, height: size, flexShrink: 0 }}>
      {glow && <span aria-hidden style={{ position: 'absolute', inset: -size * 0.35, borderRadius: '50%', background: `radial-gradient(circle, rgba(139,123,255,0.35), rgba(94,234,212,0.08) 55%, transparent 70%)` }} />}
      <motion.span
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from 0deg, ${AI.violet}, ${AI.mint}, #C4B5FD, ${AI.violet})`, boxShadow: 'inset 0 -6px 14px rgba(0,0,0,0.35), inset 0 4px 10px rgba(255,255,255,0.35)' }}
      />
      <span aria-hidden style={{ position: 'absolute', inset: '14% 22% 52% 22%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%)' }} />
    </span>
  );
}

const AI_NAV = [[Inbox, 'Demandes', '12'], [Zap, 'Agent', null], [BookOpen, 'Connaissances', null], [ChartColumn, 'Analyses', null], [Settings, 'Réglages', null]] as const;

function AIChrome({ children, nav }: { children: React.ReactNode; nav: number | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: AI.bg, color: AI.text, textAlign: 'left', fontSize: 14 }}>
      {/* barre des menus macOS (sombre) : laisse la place à l'encoche du MacBook */}
      <div style={{ height: 30, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 18, padding: '0 16px', background: 'rgba(20,20,26,0.9)', fontSize: 12.5, color: '#C9C9D3' }}>
        <span style={{ fontWeight: 700, color: AI.text }}>Lumen</span>
        {['Fichier', 'Édition', 'Présentation', 'Fenêtre'].map(m => <span key={m}>{m}</span>)}
        <span style={{ marginLeft: 'auto' }}>lun. 9:41</span>
      </div>
      <div style={{ height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: `1px solid ${AI.line}`, background: '#0E0E12' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 110px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', fontSize: 12, color: AI.muted }}><ShieldCheck size={12} /> app.lumen.ai</span>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {nav !== null && (
          <aside style={{ width: 220, flexShrink: 0, padding: '18px 14px', borderRight: `1px solid ${AI.line}`, background: '#0D0D11', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px', marginBottom: 20 }}>
              <Orb size={26} glow={false} />
              <div style={{ lineHeight: 1.2 }}><p style={{ fontWeight: 700, fontSize: 14.5 }}>Lumen</p><p style={{ fontSize: 11.5, color: AI.muted }}>Maison Alba</p></div>
            </div>
            {AI_NAV.map(([Icon, label, badge], i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, fontSize: 13.5, fontWeight: i === nav ? 600 : 500, background: i === nav ? 'rgba(255,255,255,0.06)' : 'transparent', color: i === nav ? AI.text : AI.muted }}>
                <Icon size={15} /> {label}
                {badge && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: 'rgba(139,123,255,0.18)', color: '#C4B9FF' }}>{badge}</span>}
              </span>
            ))}
            <div style={{ marginTop: 'auto', padding: 12, borderRadius: 12, border: `1px solid ${AI.line}`, background: AI.panel }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: AI.green, boxShadow: `0 0 8px ${AI.green}` }} /> Agent actif</p>
              <p style={{ fontSize: 11.5, color: AI.muted, marginTop: 4 }}>72 % des demandes résolues seul</p>
            </div>
          </aside>
        )}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── 1. onboarding : brancher les sources, l'IA apprend, choisir le ton ─── */
const SOURCES = [
  { icon: LifeBuoy, name: 'Centre d\'aide', detail: '214 articles', at: 0.12 },
  { icon: Inbox, name: 'Boîte support', detail: '12 400 conversations', at: 0.28 },
  { icon: FileText, name: 'Docs produit et CGV', detail: '86 pages', at: 0.44 },
];
const FACTS = [
  { text: 'Retours acceptés sous 30 jours', at: 0.46 },
  { text: 'Livraison offerte dès 60 €', at: 0.56 },
  { text: 'Colis bloqué > 48 h : renvoi gratuit', at: 0.66 },
];
const TONES = ['Chaleureux', 'Précis', 'Concis'];

function WebConnect({ t }: { t: MotionValue<number> }) {
  const connected = useStepped(t, v => SOURCES.filter(s => v >= s.at + 0.08).length);
  const syncing = useStepped(t, v => SOURCES.findIndex(s => v >= s.at && v < s.at + 0.08));
  const facts = useStepped(t, v => FACTS.filter(f => v >= f.at).length);
  const tone = useStepped(t, v => (v >= 0.8 ? 0 : -1));
  const ready = useStepped(t, v => (v >= 0.88 ? 1 : 0)) === 1;
  const docs = useTransform(t, v => frNum(clamp01((v - 0.12) / 0.6) * 12700));
  const bar = useTransform(t, v => `${clamp01((v - 0.12) / 0.6) * 100}%`);
  const orbScale = useTransform(t, [0.1, 0.5, 0.75], [0.85, 1.05, 1]);
  return (
    <AIChrome nav={null}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(45% 55% at 72% 42%, rgba(139,123,255,0.16), transparent 70%), radial-gradient(35% 40% at 85% 75%, rgba(94,234,212,0.08), transparent 70%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'grid', gridTemplateColumns: '440px 1fr', gap: 56, padding: '40px 64px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
            {['Connecter', 'Apprendre', 'Activer'].map((s, i) => {
              const done = i === 0 ? connected === 3 : i === 1 ? facts === 3 : ready;
              return <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: done ? AI.text : AI.faint }}><span style={{ width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 10.5, background: done ? AI_GRADIENT : 'rgba(255,255,255,0.06)', color: done ? '#0A0A0D' : AI.muted }}>{done ? <Check size={11} strokeWidth={3} /> : i + 1}</span>{s}</span>;
            })}
          </div>
          <p style={{ fontSize: 34, fontWeight: 650, letterSpacing: '-0.03em', lineHeight: 1.08 }}>Apprenez votre boutique à&nbsp;Lumen</p>
          <p style={{ fontSize: 15, color: AI.muted, margin: '12px 0 26px', lineHeight: 1.55 }}>Branchez vos sources : l&apos;agent lit tout et en tire vos règles. Aucun prompt à écrire.</p>
          <div style={{ display: 'grid', gap: 10 }}>
            {SOURCES.map((s, i) => {
              const on = i < connected;
              const busy = i === syncing;
              return (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px', borderRadius: 14, border: `1px solid ${on ? 'rgba(94,234,212,0.25)' : AI.line}`, background: on ? 'rgba(94,234,212,0.05)' : AI.panel, transition: 'background .3s, border-color .3s' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', color: on ? AI.mint : AI.muted }}><s.icon size={17} /></span>
                  <div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>{s.name}</p><p style={{ fontSize: 12.5, color: AI.muted }}>{s.detail}</p></div>
                  {on
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: AI.mint }}><Check size={13} strokeWidth={3} /> Synchronisé</span>
                    : busy
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: AI.muted }}><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, ease: 'linear', repeat: Infinity }} style={{ display: 'grid' }}><LoaderCircle size={14} /></motion.span> Lecture…</span>
                      : <span style={{ padding: '7px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.08)', fontSize: 12.5, fontWeight: 600 }}>Connecter</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 22 }}>
          <motion.div style={{ scale: orbScale }}><Orb size={150} /></motion.div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{facts === 3 ? 'Lumen connaît votre boutique' : 'Lumen apprend votre boutique…'}</p>
            <p style={{ fontSize: 13, color: AI.muted, marginTop: 4 }}><motion.span style={{ color: AI.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{docs}</motion.span> documents indexés</p>
          </div>
          <div style={{ width: 340, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}><motion.div style={{ height: '100%', width: bar, background: AI_GRADIENT }} /></div>
          <div style={{ display: 'grid', gap: 8, width: 380, minHeight: 124 }}>
            {FACTS.map((f, i) => (
              <motion.div key={f.text} initial={false} animate={{ opacity: i < facts ? 1 : 0, y: i < facts ? 0 : 8 }} transition={{ duration: 0.35 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, background: AI.panel, border: `1px solid ${AI.line}`, fontSize: 13 }}>
                <Sparkles size={14} color={AI.violet} /> <span style={{ flex: 1 }}>{f.text}</span><span style={{ fontSize: 11, color: AI.faint }}>règle apprise</span>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: AI.muted, marginRight: 4 }}>Ton</span>
            {TONES.map((tn, i) => <span key={tn} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, border: `1px solid ${i === tone ? 'transparent' : AI.line}`, background: i === tone ? '#fff' : 'transparent', color: i === tone ? '#0A0A0D' : AI.muted, transition: 'all .25s' }}>{tn}</span>)}
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 12, fontWeight: 600, background: ready ? AI_GRADIENT : 'rgba(255,255,255,0.06)', color: ready ? '#0A0A0D' : AI.faint, boxShadow: ready ? '0 10px 30px rgba(139,123,255,0.35)' : 'none', transition: 'all .35s' }}>Activer l&apos;agent <ArrowRight size={15} /></span>
        </div>
      </div>
    </AIChrome>
  );
}

/* ─── 2. agent : il enquête, répond en citant ses sources, puis agit ─── */
const TICKETS = [
  ['EL', 'Emma Laurent', 'Commande #4821 — colis non reçu', 'à l\'instant', null],
  ['TM', 'Théo Martin', 'Changer de taille avant envoi ?', '4 min', 'Résolu'],
  ['SB', 'Sarah Benali', 'Code promo refusé au paiement', '12 min', 'Résolu'],
  ['JP', 'Jules Petit', 'Facture pour ma société', '25 min', 'Résolu'],
  ['NC', 'Nina Costa', 'Retour d\'un article soldé', '1 h', 'Humain'],
] as const;
const STEPS_AI = [
  { label: 'Commande #4821 retrouvée', tool: 'shopify.orders', at: 0.08 },
  { label: 'Suivi : bloqué à Lyon depuis 3 jours', tool: 'colissimo.track', at: 0.2 },
  { label: 'Règle : colis bloqué > 48 h → renvoi offert', tool: 'connaissances', at: 0.32 },
];
const REPLY = 'Bonjour Emma, désolée pour l\'attente : votre colis est bloqué au centre de Lyon depuis trois jours. Je viens de vous renvoyer la commande, sans frais, en Colissimo suivi. Nouveau numéro : 6A2 845 913 07.';

function WebPipeline({ t }: { t: MotionValue<number> }) {
  const steps = useStepped(t, v => STEPS_AI.filter(s => v >= s.at).length);
  const chars = useStepped(t, v => Math.round(clamp01((v - 0.42) / 0.36) * REPLY.length));
  const acted = useStepped(t, v => (v >= 0.84 ? 1 : 0)) === 1;
  const resolved = useStepped(t, v => (v >= 0.92 ? 1 : 0)) === 1;
  const confidence = useTransform(t, v => `${Math.round(60 + clamp01((v - 0.1) / 0.6) * 34)} %`);
  const confBar = useTransform(t, v => `${60 + clamp01((v - 0.1) / 0.6) * 34}%`);
  return (
    <AIChrome nav={0}>
      <div style={{ display: 'grid', gridTemplateColumns: '256px 1fr 224px', height: '100%' }}>
        <div style={{ borderRight: `1px solid ${AI.line}`, padding: '16px 10px', display: 'grid', alignContent: 'start', gap: 4 }}>
          <p style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 10px', fontSize: 13, fontWeight: 600 }}>Boîte de réception <span style={{ color: AI.muted, fontWeight: 500 }}>12</span></p>
          {TICKETS.map(([ini, name, subject, when, state], i) => (
            <div key={name} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 11, background: i === 0 ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, background: i === 0 ? AI_GRADIENT : 'rgba(255,255,255,0.08)', color: i === 0 ? '#0A0A0D' : AI.muted }}>{ini}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>{name}<span style={{ fontSize: 11, fontWeight: 400, color: AI.faint }}>{when}</span></p>
                <p style={{ fontSize: 12, color: AI.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject}</p>
                {(state || (i === 0 && resolved)) && <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10.5, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: state === 'Humain' ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)', color: state === 'Humain' ? AI.amber : AI.green }}>{state === 'Humain' ? 'Transmis à l\'équipe' : 'Résolu par Lumen'}</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 15, fontWeight: 650, whiteSpace: 'nowrap' }}>Commande #4821 — colis non reçu</p>
            <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', background: resolved ? 'rgba(74,222,128,0.12)' : 'rgba(139,123,255,0.15)', color: resolved ? AI.green : '#C4B9FF', transition: 'all .3s' }}>{resolved ? '✓ Résolu en 38 s' : 'Lumen traite la demande'}</span>
          </div>
          <div style={{ alignSelf: 'flex-start', maxWidth: 460, padding: '12px 14px', borderRadius: '14px 14px 14px 4px', background: AI.raised, fontSize: 13.5, lineHeight: 1.55 }}>
            Bonjour, ma commande #4821 devait arriver lundi et le suivi ne bouge plus. Je commence à m&apos;inquiéter…
            <p style={{ fontSize: 11, color: AI.faint, marginTop: 6 }}>Emma Laurent · par e-mail</p>
          </div>
          <div style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(139,123,255,0.25)', background: 'linear-gradient(180deg, rgba(139,123,255,0.08), rgba(139,123,255,0.02))' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}><Orb size={18} glow={false} /> Lumen <span style={{ color: AI.faint, fontWeight: 500 }}>· agent</span></p>
            <div style={{ display: 'grid', gap: 7, marginBottom: 14 }}>
              {STEPS_AI.map((s, i) => (
                <motion.p key={s.tool} initial={false} animate={{ opacity: i < steps ? 1 : 0.25 }} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  {i < steps ? <Check size={13} color={AI.mint} strokeWidth={3} /> : <span style={{ width: 13 }} />}
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: AI.faint }}>{s.tool}</span>
                </motion.p>
              ))}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, minHeight: 92 }}>
              {REPLY.slice(0, chars)}{chars < REPLY.length && chars > 0 && <span className="mvp-caret" />}
              {chars >= REPLY.length && <><sup style={{ color: AI.violet, fontWeight: 700, marginLeft: 3 }}>1</sup><sup style={{ color: AI.violet, fontWeight: 700, marginLeft: 2 }}>2</sup></>}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', background: acted ? 'rgba(74,222,128,0.12)' : '#fff', color: acted ? AI.green : '#0A0A0D', transition: 'all .3s' }}>
                {acted ? <><Check size={14} strokeWidth={3} /> Renvoi créé · client prévenu</> : <><Truck size={14} /> Renvoyer le colis (offert)</>}
              </span>
              <span style={{ fontSize: 12.5, color: AI.muted, whiteSpace: 'nowrap' }}>Modifier</span>
            </div>
          </div>
        </div>
        <div style={{ borderLeft: `1px solid ${AI.line}`, padding: 18, display: 'grid', alignContent: 'start', gap: 18, fontSize: 12.5 }}>
          <div>
            <p style={{ color: AI.faint, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>CLIENTE</p>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Emma Laurent</p>
            {[['Cliente depuis', '2023'], ['Commandes', '6'], ['Panier moyen', '82 €']].map(([k, v]) => <p key={k} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: AI.muted }}>{k}<span style={{ color: AI.text }}>{v}</span></p>)}
          </div>
          <div>
            <p style={{ color: AI.faint, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>SOURCES CITÉES</p>
            {['Politique de livraison §3', 'Suivi Colissimo #6A2…'].map((src, i) => <p key={src} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, color: AI.muted }}><span style={{ width: 18, height: 18, borderRadius: 5, display: 'grid', placeItems: 'center', fontSize: 10.5, fontWeight: 700, background: 'rgba(139,123,255,0.18)', color: '#C4B9FF' }}>{i + 1}</span>{src}</p>)}
          </div>
          <div>
            <p style={{ display: 'flex', justifyContent: 'space-between', color: AI.faint, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>CONFIANCE <motion.span style={{ color: AI.text }}>{confidence}</motion.span></p>
            <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}><motion.div style={{ height: '100%', width: confBar, background: AI_GRADIENT }} /></div>
            <p style={{ color: AI.faint, marginTop: 8, lineHeight: 1.45 }}>Sous 80 %, la demande est transmise à un humain.</p>
          </div>
        </div>
      </div>
    </AIChrome>
  );
}

/* ─── 3. analyses : chiffres clés, courbe IA vs humain, ce que l'IA a remarqué ─── */
const KPIS = [
  { icon: Zap, label: 'Résolues par l\'agent', to: 72, unit: ' %' },
  { icon: Timer, label: 'Première réponse', to: 38, unit: ' s' },
  { icon: Smile, label: 'Satisfaction', to: 4.8, unit: ' / 5', decimals: 1 },
  { icon: TrendingUp, label: 'Heures économisées', to: 126, unit: ' h' },
];
const INSIGHTS = [
  { text: 'Les questions « délai de livraison » ont doublé depuis mardi.', action: 'Rédiger un article d\'aide', at: 0.55 },
  { text: '3 clientes signalent un code promo refusé sur mobile.', action: 'Prévenir l\'équipe produit', at: 0.7 },
];

function Kpi({ t, k }: { t: MotionValue<number>; k: typeof KPIS[number] }) {
  const value = useTransform(t, v => {
    const n = clamp01((v - 0.05) / 0.45) * k.to;
    return (k.decimals ? n.toFixed(k.decimals).replace('.', ',') : Math.round(n)) + k.unit;
  });
  return (
    <div style={{ padding: 16, borderRadius: 14, background: AI.panel, border: `1px solid ${AI.line}` }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: AI.muted }}><k.icon size={14} /> {k.label}</p>
      <motion.p style={{ fontSize: 28, fontWeight: 650, letterSpacing: '-0.02em', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{value}</motion.p>
    </div>
  );
}

function WebCopilot({ t }: { t: MotionValue<number> }) {
  const draw = useTransform(t, [0.1, 0.6], [0, 1]);
  const insights = useStepped(t, v => INSIGHTS.filter(i => v >= i.at).length);
  const picked = useStepped(t, v => (v >= 0.86 ? 1 : 0)) === 1;
  const ai = 'M0 150 C 60 140, 100 120, 160 112 S 260 80, 320 70 S 420 40, 480 34 S 560 24, 620 18';
  const human = 'M0 120 C 60 126, 100 132, 160 138 S 260 150, 320 152 S 420 160, 480 162 S 560 166, 620 168';
  return (
    <AIChrome nav={3}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(40% 40% at 85% 20%, rgba(139,123,255,0.12), transparent 70%)' }} />
      <div style={{ position: 'relative', height: '100%', padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><p style={{ fontSize: 20, fontWeight: 650, letterSpacing: '-0.02em' }}>Analyses</p><p style={{ fontSize: 12.5, color: AI.muted, marginTop: 2 }}>Semaine du 10 au 16 mars · 412 demandes</p></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ padding: '8px 12px', borderRadius: 9, border: `1px solid ${AI.line}`, fontSize: 12.5, color: AI.muted }}>7 derniers jours</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.08)', fontSize: 12.5, fontWeight: 600 }}><Download size={13} /> Exporter</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {KPIS.map(k => <Kpi key={k.label} t={t} k={k} />)}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 12 }}>
          <div style={{ padding: 18, borderRadius: 14, background: AI.panel, border: `1px solid ${AI.line}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <p style={{ fontWeight: 600 }}>Demandes résolues</p>
              <p style={{ display: 'flex', gap: 14, color: AI.muted, fontSize: 12 }}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 3, borderRadius: 3, background: AI_GRADIENT }} />Lumen</span><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 3, borderRadius: 3, background: AI.faint }} />Équipe</span></p>
            </div>
            <svg viewBox="0 0 620 190" preserveAspectRatio="none" style={{ flex: 1, width: '100%', marginTop: 12 }}>
              <defs>
                <linearGradient id="lumenLine" x1="0" x2="1"><stop offset="0" stopColor={AI.violet} /><stop offset="1" stopColor={AI.mint} /></linearGradient>
                <linearGradient id="lumenFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={AI.violet} stopOpacity="0.28" /><stop offset="1" stopColor={AI.violet} stopOpacity="0" /></linearGradient>
              </defs>
              {[40, 80, 120, 160].map(y => <line key={y} x1="0" x2="620" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />)}
              <motion.path d={`${ai} L620 190 L0 190 Z`} fill="url(#lumenFill)" style={{ opacity: draw }} />
              <motion.path d={human} fill="none" stroke={AI.faint} strokeWidth="2" strokeDasharray="4 5" style={{ pathLength: draw }} />
              <motion.path d={ai} fill="none" stroke="url(#lumenLine)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: draw }} />
            </svg>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: AI.faint, marginTop: 6 }}>{['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'].map(d => <span key={d}>{d}</span>)}</p>
          </div>
          <div style={{ padding: 18, borderRadius: 14, border: '1px solid rgba(139,123,255,0.25)', background: 'linear-gradient(180deg, rgba(139,123,255,0.08), rgba(17,17,22,1) 60%)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}><Orb size={18} glow={false} /> Ce que Lumen a remarqué</p>
            {INSIGHTS.map((ins, i) => (
              <motion.div key={ins.text} initial={false} animate={{ opacity: i < insights ? 1 : 0, y: i < insights ? 0 : 10 }} transition={{ duration: 0.35 }} style={{ padding: 13, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${AI.line}` }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.5 }}>{ins.text}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '7px 11px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: i === 0 && picked ? AI_GRADIENT : 'rgba(255,255,255,0.08)', color: i === 0 && picked ? '#0A0A0D' : AI.text, transition: 'all .3s' }}>
                  {i === 0 && picked ? <><Check size={13} strokeWidth={3} /> Brouillon d&apos;article prêt</> : <>{ins.action} <ArrowUpRight size={13} /></>}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AIChrome>
  );
}

/* ═══ Mobile : app de réservation iOS 26 ══════════════
   Règles appliquées (Apple HIG « Materials », « Typography », « Layout », « Tab bars »,
   « Onboarding » ; WWDC25 « Meet Liquid Glass ») :
   - l'écran est rendu en points iOS (1 px = 1 pt) : marges de 16 à 24 pt, cibles tactiles de 44 pt
     minimum, échelle Dynamic Type (`iosType`), SF Pro / SF Mono, vrais SF Symbols (`sfSymbols.tsx`) ;
   - le verre est réservé à la navigation et aux contrôles (boutons ronds, titre en capsule, barre
     d'onglets), jamais au contenu ; jamais de verre sur du verre ;
   - onboarding court (trois écrans qui montrent le produit, pas un tutoriel), « Passer » toujours
     visible, un seul bouton ; permission demandée en contexte, juste après la réservation. */
const glassRegular: React.CSSProperties = {
  background: 'rgba(255,255,255,0.62)',
  backdropFilter: 'blur(25px) saturate(180%)', WebkitBackdropFilter: 'blur(25px) saturate(180%)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.9), inset 0 -1.5px 0 rgba(255,255,255,0.35), 0 0 0 1px rgba(0,0,0,0.05), 0 14px 40px rgba(16,16,20,0.1)',
};
// verre sombre des illustrations de l'onboarding (cartes posées sur fond noir)
const glassDark: React.CSSProperties = {
  background: 'rgba(58,58,64,0.55)',
  backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.45)',
};

const MARGIN = 16;
const NAV_H = 44;
const DARK_BG = '#141416';
const DARK_SECONDARY = 'rgba(235,235,245,0.6)';
const WARM_BG = '#ECEBE8';
const INK_IOS = '#1C1C1E';
const monoLabel: React.CSSProperties = { fontFamily: SF_MONO, fontSize: 13, lineHeight: '16px', letterSpacing: '0.02em', textTransform: 'uppercase', color: '#8E8E93' };

/* ─── onboarding : trois pages jouées par le scroll ─── */
const PAGES = [
  'Réservez vos cours en un seul geste',
  'Yoga, boxe, pilates : tout le planning en direct',
  'Prévenu dès qu\'une place se libère',
] as const;
// Le scroll de l'étape joue d'abord l'écran de lancement (splash), puis les trois pages.
const SPLASH = 0.16;
const SEG = (1 - SPLASH) / PAGES.length;

/** Visibilité d'une page : fondu et glissement horizontal autour de sa tranche du scroll. */
function usePage(t: MotionValue<number>, i: number) {
  const a = SPLASH + i * SEG;
  const b = a + SEG;
  // fondus sans chevauchement : la page sortante a disparu quand l'entrante commence à venir
  const input = [i === 0 ? -1 : a, i === 0 ? -0.9 : a + 0.05, i === PAGES.length - 1 ? 2 : b - 0.05, i === PAGES.length - 1 ? 3 : b];
  return {
    opacity: useTransform(t, input, [0, 1, 1, 0]),
    x: useTransform(t, input, [48, 0, 0, -48]),
    local: useTransform(t, [a, b], [0, 1]),
  };
}

function ClassCard({ title, meta, accent }: { title: string; meta: string; accent?: boolean }) {
  return (
    <div style={{ ...glassDark, padding: 16, borderRadius: 24, color: '#fff' }}>
      <p style={iosType('headline')}>{title}</p>
      <p style={{ ...iosType('subheadline'), color: DARK_SECONDARY, marginTop: 2 }}>{meta}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
        {([[Clock, '45 min'], [Person2Fill, '6 places']] as const).map(([Icon, label]) => (
          <span key={label} style={{ ...iosType('footnote', 500), display: 'flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>
            <Icon size={13} />{label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', width: 32, height: 32, borderRadius: '50%', background: accent ? '#fff' : 'rgba(255,255,255,0.18)', color: INK_IOS, display: 'grid', placeItems: 'center' }}><ArrowUp size={15} /></span>
      </div>
    </div>
  );
}

function OnboardBook({ t }: { t: MotionValue<number> }) {
  const { opacity, x, local } = usePage(t, 0);
  const front = useTransform(local, [0, 1], [24, -12]);
  const back = useTransform(local, [0, 1], [-10, 18]);
  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity, x }}>
      <motion.div style={{ position: 'absolute', left: 176, top: 92, width: 196, y: back, rotate: 11, filter: 'blur(1.5px)', opacity: 0.55 }}>
        <div style={{ padding: 16, height: 150, borderRadius: 24, background: 'linear-gradient(160deg, rgba(255,154,98,0.55), rgba(121,103,255,0.35))' }} />
      </motion.div>
      <motion.div style={{ position: 'absolute', left: 30, top: 266, width: 196, y: back, rotate: -9, filter: 'blur(1.5px)', opacity: 0.5 }}>
        <div style={{ height: 140, borderRadius: 24, background: 'linear-gradient(160deg, rgba(121,103,255,0.5), rgba(30,158,140,0.35))' }} />
      </motion.div>
      <motion.div style={{ position: 'absolute', left: 60, right: 60, top: 170, y: front }}>
        <ClassCard title="Renfo express" meta="Mar. 11 · 12:15 · Studio 2" accent />
      </motion.div>
    </motion.div>
  );
}

const TILES = [
  { icon: HeartFill, bg: '#FF5C7A', x: 62, y: 92, r: -9, z: 0 },
  { icon: BoltFill, bg: '#FFB020', x: 168, y: 70, r: 0, z: 0 },
  { icon: SFSparkles, bg: '#7967FF', x: 272, y: 96, r: 9, z: 0 },
  { icon: FlameFill, bg: '#FF6A3D', x: 84, y: 282, r: 7, z: 2 },
  { icon: FigureRun, bg: '#34C759', x: 170, y: 298, r: -3, z: 2 },
  { icon: StarFill, bg: '#3EA8F5', x: 254, y: 280, r: -8, z: 2 },
] as const;

function OnboardPlanning({ t }: { t: MotionValue<number> }) {
  const { opacity, x, local } = usePage(t, 1);
  const spread = useTransform(local, [0, 0.6], [0.8, 1]);
  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity, x }}>
      {TILES.map(({ icon: Icon, bg, x: left, y: top, r, z }) => (
        <motion.span key={bg} style={{ position: 'absolute', left, top, width: 60, height: 60, borderRadius: 15, rotate: r, scale: spread, zIndex: z, background: `linear-gradient(160deg, ${bg}, ${bg}CC)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 28px rgba(0,0,0,0.4)', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <Icon size={28} />
        </motion.span>
      ))}
      <div style={{ ...glassDark, position: 'absolute', left: 40, right: 40, top: 168, padding: '16px 18px', borderRadius: 24, color: '#fff', zIndex: 1 }}>
        <p style={{ ...iosType('footnote', 500), color: DARK_SECONDARY }}>Cette semaine au studio</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 48, marginTop: 10 }}>
          {[0.5, 0.8, 0.65, 1, 0.75, 0.45, 0.3].map((h, i) => <span key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 5, background: i === 3 ? '#fff' : 'rgba(255,255,255,0.22)' }} />)}
        </div>
      </div>
      <span style={{ ...glassDark, ...iosType('headline'), position: 'absolute', left: '50%', top: 378, transform: 'translateX(-50%)', height: 40, padding: '0 18px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, color: '#fff', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>42</span> cours par semaine
      </span>
    </motion.div>
  );
}

function Notification({ title, body, when, style }: { title: string; body: string; when: string; style?: React.ComponentProps<typeof motion.div>['style'] }) {
  return (
    <motion.div style={{ ...glassDark, position: 'absolute', left: 16, right: 16, padding: 14, borderRadius: 26, display: 'flex', gap: 12, color: '#fff', ...style }}>
      <span style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(145deg, #FF9A62, #7967FF 70%)', display: 'grid', placeItems: 'center' }}><FigureRun size={20} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={iosType('subheadline', 600)}>{title}</p>
          <p style={{ ...iosType('footnote'), color: DARK_SECONDARY }}>{when}</p>
        </div>
        <p style={{ ...iosType('subheadline'), color: 'rgba(255,255,255,0.85)' }}>{body}</p>
      </div>
    </motion.div>
  );
}

function OnboardAlert({ t }: { t: MotionValue<number> }) {
  const { opacity, x, local } = usePage(t, 2);
  const bannerY = useTransform(local, [0, 0.35], [-60, 0]);
  const bannerOpacity = useTransform(local, [0, 0.25], [0, 1]);
  const booked = useTransform(local, [0.45, 0.6], [0, 1]);
  const bookedY = useTransform(local, [0.45, 0.6], [12, 0]);
  return (
    <motion.div style={{ position: 'absolute', inset: 0, opacity, x }}>
      {/* écran verrouillé : date et heure en grand */}
      <p style={{ ...iosType('headline'), position: 'absolute', top: 20, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>mardi 11 mars</p>
      <p style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', fontSize: 92, lineHeight: '100px', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.92)' }}>16:42</p>
      <Notification title="Studio Centre" when="il y a 2 h" body="Rappel : Renfo express à 12:15, Studio 2." style={{ top: 214, scale: 0.94, opacity: 0.45 }} />
      <Notification title="Studio Centre" when="maintenant" body="Une place s'est libérée en Pilates, 18:30. Touchez pour la réserver." style={{ top: 186, y: bannerY, opacity: bannerOpacity }} />
      <motion.span style={{ ...glassDark, ...iosType('subheadline', 600), position: 'absolute', left: '50%', top: 322, x: '-50%', y: bookedY, opacity: booked, height: 40, padding: '0 16px 0 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8, color: '#fff', whiteSpace: 'nowrap' }}>
        <CheckCircleFill size={20} color={IOS.green} /> Pilates 18:30 réservé
      </motion.span>
    </motion.div>
  );
}

function OnboardTitle({ t, i }: { t: MotionValue<number>; i: number }) {
  const { opacity, x } = usePage(t, i);
  return <motion.p style={{ position: 'absolute', left: 0, right: 0, bottom: 0, opacity, x, fontSize: 30, lineHeight: '36px', fontWeight: 600, letterSpacing: '-0.012em' }}>{PAGES[i]}</motion.p>;
}

function MobileWelcome({ t }: { t: MotionValue<number> }) {
  const page = useStepped(t, v => Math.max(0, Math.min(PAGES.length - 1, Math.floor((v - SPLASH) / SEG))));
  // splash : le logo se pose, puis s'agrandit en s'effaçant pendant que l'onboarding apparaît
  const logoScale = useTransform(t, [0, 0.08, SPLASH], [0.85, 1, 1.25]);
  const splashOpacity = useTransform(t, [SPLASH - 0.05, SPLASH], [1, 0]);
  const chrome = useTransform(t, [SPLASH - 0.03, SPLASH + 0.05], [0, 1]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: DARK_BG, color: '#fff', textAlign: 'left' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 35% at 50% 34%, rgba(121,103,255,0.22), rgba(121,103,255,0) 70%)' }} />
      {/* « Passer » : bouton texte de la barre de navigation, toujours accessible */}
      <motion.span style={{ ...iosType('body'), position: 'absolute', top: SAFE_TOP, right: 20, height: NAV_H, display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.85)', opacity: chrome }}>Passer <ChevronRight size={14} /></motion.span>
      <motion.div style={{ position: 'absolute', left: 0, right: 0, top: 104, height: 430, opacity: chrome }}>
        <OnboardBook t={t} />
        <OnboardPlanning t={t} />
        <OnboardAlert t={t} />
      </motion.div>
      <motion.div style={{ position: 'absolute', left: 24, right: 24, bottom: 132, opacity: chrome }}>
        <div style={{ position: 'relative', height: 108 }}>
          {PAGES.map((_, i) => <OnboardTitle key={i} t={t} i={i} />)}
        </div>
        {/* contrôle de page, aligné sur le titre */}
        <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
          {PAGES.map((_, i) => <span key={i} style={{ width: i === page ? 18 : 6, height: 6, borderRadius: 3, background: i === page ? '#fff' : 'rgba(255,255,255,0.28)', transition: 'width .3s, background .3s' }} />)}
        </div>
      </motion.div>
      <motion.div style={{ ...iosType('headline'), position: 'absolute', left: 24, right: 24, bottom: 40, height: 56, borderRadius: 999, background: '#fff', color: INK_IOS, display: 'grid', placeItems: 'center', opacity: chrome }}>
        {page === PAGES.length - 1 ? 'Commencer' : 'Continuer'}
      </motion.div>
      {/* écran de lancement : fond de l'app et logo seul, sans texte (HIG « Launching ») */}
      <motion.div aria-hidden style={{ position: 'absolute', inset: 0, background: DARK_BG, opacity: splashOpacity, display: 'grid', placeItems: 'center', zIndex: 3, pointerEvents: 'none' }}>
        <motion.span style={{ scale: logoScale, width: 96, height: 96, borderRadius: 22, background: 'linear-gradient(145deg, #FF9A62, #7967FF 70%)', boxShadow: '0 20px 60px rgba(121,103,255,0.35), inset 0 1px 0 rgba(255,255,255,0.3)', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <FigureRun size={50} />
        </motion.span>
      </motion.div>
      <IOSStatusBar tone="light" />
    </div>
  );
}

/* ─── barre de navigation iOS 26 : boutons ronds et titre en capsule, en verre ─── */
function GlassCircle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span style={{ ...glassRegular, width: NAV_H, height: NAV_H, borderRadius: '50%', display: 'grid', placeItems: 'center', color: INK_IOS, ...style }}>{children}</span>;
}

function NavBar({ left, title, right, mono }: { left: React.ReactNode; title: string; right: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ position: 'absolute', top: SAFE_TOP, left: MARGIN, right: MARGIN, height: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
      <GlassCircle>{left}</GlassCircle>
      <span style={{ ...glassRegular, ...(mono ? { fontFamily: SF_MONO, fontSize: 15, fontWeight: 500, letterSpacing: '0.02em' } : iosType('headline')), height: NAV_H, padding: '0 18px', borderRadius: 999, display: 'flex', alignItems: 'center', color: INK_IOS }}>{title}</span>
      <GlassCircle>{right}</GlassCircle>
    </div>
  );
}

const TABS = [[HouseFill, 'Accueil'], [CalendarSym, 'Planning'], [CreditCardFill, 'Pass'], [PersonFill, 'Profil']] as const;
const TAB_H = 62;
const TAB_INSET = 20;
const TAB_GAP = 10;
const TAB_W = SCREEN_W - 2 * TAB_INSET - TAB_H - TAB_GAP;

// Barre d'onglets iOS 26 : capsule de verre flottante, onglet actif teinté sur une « lentille »,
// bouton de recherche séparé à droite. Réduite, elle ne montre plus que l'onglet courant.
function TabBar({ active, minimized }: { active: number; minimized: boolean }) {
  const item = TAB_H - 8;
  return (
    <motion.div
      animate={{ width: minimized ? TAB_H : TAB_W }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      style={{ ...glassRegular, position: 'absolute', left: TAB_INSET, bottom: TAB_INSET, height: TAB_H, borderRadius: TAB_H / 2, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 4px', zIndex: 3 }}
    >
      {TABS.map(([Icon, label], i) => (minimized && i !== active ? null : (
        <span key={label} style={{ flex: 1, minWidth: item, height: item, borderRadius: item / 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, background: i === active && !minimized ? 'rgba(0,0,0,0.06)' : 'transparent', color: i === active ? ACCENT_INK : INK_IOS }}>
          <Icon size={20} />
          {!minimized && <span style={iosType('tabLabel')}>{label}</span>}
        </span>
      )))}
    </motion.div>
  );
}

const DAYS = [['lun.', '10'], ['mar.', '11'], ['mer.', '12'], ['jeu.', '13'], ['ven.', '14']] as const;
const CLASSES = [['07:30', 'Yoga', 'Léa', '3 places'], ['12:15', 'Renfo express', 'Inès', '6 places'], ['17:00', 'Stretching', 'Hugo', '8 places'], ['18:30', 'Pilates', 'Léa', 'Complet'], ['19:45', 'Boxe', 'Karim', '4 places'], ['20:30', 'Yoga doux', 'Inès', '5 places']] as const;
const ROW_H = 66;
const TIME_W = 52;
const CELL_RADIUS = 26;

function MobilePlanning({ t }: { t: MotionValue<number> }) {
  const scrollY = useTransform(t, [0.1, 0.5], [0, -40]);
  const minimized = useStepped(t, v => (v > 0.3 && v < 0.85 ? 1 : 0)) === 1;
  const tapped = useStepped(t, v => (v > 0.62 ? 1 : 0)) === 1;
  const tipOpacity = useTransform(t, [0.15, 0.3, 0.6, 0.66], [0, 1, 1, 0]);
  const finger = useTransform(t, [0.5, 0.6, 0.68], [0, 1, 0]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: WARM_BG, color: INK_IOS, textAlign: 'left', overflow: 'hidden' }}>
      <motion.div style={{ y: scrollY, paddingTop: SAFE_TOP + NAV_H + 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, padding: `0 ${MARGIN}px` }}>
          {DAYS.map(([d, n], i) => {
            const on = i === 1;
            return (
              <span key={n} style={{ height: 66, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: on ? INK_IOS : '#fff', color: on ? '#fff' : INK_IOS, boxShadow: on ? '0 10px 24px rgba(28,28,30,0.25)' : 'none' }}>
                <span style={{ ...iosType('caption1', 500), color: on ? 'rgba(255,255,255,0.65)' : '#8E8E93' }}>{d}</span>
                <span style={iosType('title3')}>{n}</span>
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '26px 32px 8px' }}>
          <span style={monoLabel}>Mardi 11 mars</span><span style={monoLabel}>6 cours</span>
        </div>
        <div style={{ margin: `0 ${MARGIN}px`, borderRadius: CELL_RADIUS, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          {CLASSES.map(([time, name, coach, seats], i) => {
            const full = seats === 'Complet';
            const booked = i === 1 && tapped;
            return (
              <div key={name} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, minHeight: ROW_H, padding: '0 16px' }}>
                {i > 0 && <span aria-hidden style={{ position: 'absolute', top: 0, left: 16 + TIME_W + 12, right: 0, height: HAIRLINE, background: IOS.separator }} />}
                <span style={{ fontFamily: SF_MONO, fontSize: 15, fontWeight: 500, width: TIME_W, flexShrink: 0, color: full ? '#C7C7CC' : INK_IOS }}>{time}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...iosType('body', 500), whiteSpace: 'nowrap', color: full ? '#C7C7CC' : INK_IOS }}>{name}</p>
                  <p style={{ ...iosType('subheadline'), whiteSpace: 'nowrap', color: '#8E8E93' }}>{coach} · {booked ? 'Réservé' : seats}</p>
                </div>
                {booked
                  ? <CheckCircleFill size={24} color={IOS.green} />
                  : !full && <span style={{ ...iosType('subheadline', 600), height: 34, padding: '0 14px', borderRadius: 999, display: 'flex', alignItems: 'center', background: '#F2F1EF', color: INK_IOS }}>Réserver</span>}
                {i === 1 && (
                  <>
                    {/* astuce façon TipKit, en popover au-dessus du bouton qu'elle désigne */}
                    <motion.div style={{ position: 'absolute', right: 12, bottom: 'calc(100% - 4px)', width: 260, opacity: tipOpacity, display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 20, background: INK_IOS, color: '#fff', boxShadow: '0 18px 50px rgba(0,0,0,0.3)', zIndex: 3 }}>
                      <span style={{ color: '#FFD60A', paddingTop: 1 }}><SFSparkles size={17} /></span>
                      <div style={{ flex: 1 }}>
                        <p style={iosType('headline')}>Réservez en un geste</p>
                        <p style={{ ...iosType('subheadline'), color: DARK_SECONDARY, marginTop: 2 }}>Touchez « Réserver » : la place est gardée pour vous.</p>
                      </div>
                      <XMark size={13} color="rgba(255,255,255,0.4)" />
                      <span aria-hidden style={{ position: 'absolute', right: 42, bottom: -6, width: 14, height: 14, background: INK_IOS, transform: 'rotate(45deg)', borderRadius: 3 }} />
                    </motion.div>
                    <motion.span aria-hidden style={{ position: 'absolute', right: 39, top: '50%', width: 44, height: 44, marginTop: -22, borderRadius: '50%', background: 'rgba(0,0,0,0.16)', border: '2.5px solid rgba(255,255,255,0.85)', opacity: finger, scale: finger }} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
      {/* bords de défilement : le contenu se fond sous les barres, en haut comme en bas */}
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, height: SAFE_TOP + NAV_H + 14, background: `linear-gradient(180deg, ${WARM_BG} 70%, rgba(236,235,232,0))`, zIndex: 2 }} />
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(0deg, rgba(236,235,232,0.95) 30%, rgba(236,235,232,0))', zIndex: 2 }} />
      <NavBar left={<PersonFill size={17} />} title="Planning" right={<Bell size={17} />} />
      <TabBar active={1} minimized={minimized} />
      <span style={{ ...glassRegular, position: 'absolute', right: TAB_INSET, bottom: TAB_INSET, width: TAB_H, height: TAB_H, borderRadius: '50%', display: 'grid', placeItems: 'center', zIndex: 3, color: INK_IOS }}><Magnifier size={19} /></span>
      <IOSStatusBar />
    </div>
  );
}

/* ─── confirmation : billet papier + feuille de réservation ─── */
const TICKET_ROWS = [['Salle', 'Studio 2'], ['Niveau', 'Tous niveaux'], ['Matériel', 'Fourni'], ['Places', '6 / 14']] as const;

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span style={{ ...iosType('subheadline', 500), height: 44, padding: '0 14px 0 6px', borderRadius: 999, background: '#F2F1EF', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
      {icon}{label}
    </span>
  );
}

function MobileConfirm({ t }: { t: MotionValue<number> }) {
  const paperY = useTransform(t, [0, 0.25], [-40, 0]);
  const paperOpacity = useTransform(t, [0, 0.15], [0, 1]);
  const sheetY = useTransform(t, [0.05, 0.3], [460, 0]);
  const confirmed = useStepped(t, v => (v > 0.38 ? 1 : 0)) === 1;
  const press = useTransform(t, [0.56, 0.6, 0.64], [1, 0.95, 1]);
  const accepted = useStepped(t, v => (v > 0.6 ? 1 : 0)) === 1;
  const bannerY = useTransform(t, [0.78, 0.9], [-160, 0]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: WARM_BG, color: INK_IOS, textAlign: 'left', overflow: 'hidden' }}>
      <NavBar left={<ArrowUturnLeft size={17} />} title="RÉS-0412" right={<Ellipsis size={17} />} mono />
      {/* billet « papier » au coin plié */}
      <motion.div style={{ position: 'absolute', left: 28, right: 28, top: SAFE_TOP + NAV_H + 20, height: 420, y: paperY, opacity: paperOpacity, filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.06))' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#fff', clipPath: 'polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 0 100%)', padding: '22px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><p style={monoLabel}>Cours</p><p style={{ ...iosType('body', 500), marginTop: 4 }}>Renfo express</p><p style={{ ...iosType('subheadline'), color: '#8E8E93' }}>45 min</p></div>
            <div><p style={monoLabel}>Coach</p><p style={{ ...iosType('body', 500), marginTop: 4 }}>Inès</p><p style={{ ...iosType('subheadline'), color: '#8E8E93' }}>Rappel auto</p></div>
          </div>
          <div style={{ height: HAIRLINE, background: IOS.separator, margin: '18px 0 4px' }} />
          {TICKET_ROWS.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44, borderBottom: `${HAIRLINE}px solid rgba(60,60,67,0.12)` }}>
              <span style={{ ...iosType('body'), color: '#3A3A3C' }}>{k}</span><span style={{ fontFamily: SF_MONO, fontSize: 15, color: INK_IOS }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}><span style={monoLabel}>Pass 10 séances</span><span style={{ ...monoLabel, color: INK_IOS }}>−1</span></div>
        </div>
        <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, width: 44, height: 44, borderRadius: '0 0 0 10px', background: 'linear-gradient(225deg, #E4E3E0 50%, #F7F7F5 50%)', boxShadow: '-3px 3px 8px rgba(0,0,0,0.08)' }} />
      </motion.div>
      {/* feuille de réservation : décollée de 8 pt, coins concentriques à l'écran */}
      <motion.div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, y: sheetY, borderRadius: SCREEN_RADIUS - 8, padding: '30px 22px 22px', background: '#fff', boxShadow: '0 -10px 40px rgba(0,0,0,0.08)', zIndex: 2 }}>
        <span aria-hidden style={{ position: 'absolute', top: 6, left: '50%', width: 36, height: 5, marginLeft: -18, borderRadius: 999, background: 'rgba(60,60,67,0.2)' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 30, lineHeight: '34px', fontWeight: 600, letterSpacing: '-0.012em' }}>Réservation</p>
            <p style={{ ...monoLabel, marginTop: 4 }}>RÉS-0412</p>
          </div>
          <span style={{ ...iosType('subheadline', 600), height: 36, padding: '0 14px 0 10px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, color: '#fff', background: confirmed ? IOS.green : '#FF9F0A', transition: 'background .3s' }}>
            {confirmed ? <Checkmark size={14} /> : <Clock size={14} />}{confirmed ? 'Confirmée' : 'En attente'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '18px 4px 8px' }}><span style={monoLabel}>De</span><span style={monoLabel}>Pour</span></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Chip icon={<span style={{ ...iosType('subheadline', 600), width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(145deg, #FFB37A, #FF6A3D)', color: '#fff', display: 'grid', placeItems: 'center' }}>C</span>} label="Camille" />
          <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: '50%', background: '#F2F1EF', display: 'grid', placeItems: 'center', color: '#8E8E93' }}><SFArrowRight size={16} /></span>
          <Chip icon={<span style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(145deg, #FF9A62, #7967FF 70%)', color: '#fff', display: 'grid', placeItems: 'center' }}><FigureRun size={17} /></span>} label="Studio Centre" />
        </div>
        <div style={{ borderTop: '1.5px dashed rgba(60,60,67,0.15)', margin: '20px 0 16px' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
          <p style={{ fontSize: 52, lineHeight: '54px', fontWeight: 500, letterSpacing: '-0.02em' }}>12<span style={{ color: '#C7C7CC' }}>:15</span></p>
          <div style={{ paddingBottom: 4 }}>
            <p style={monoLabel}>Quand</p>
            <p style={{ ...iosType('body', 500), marginTop: 2 }}>Mar. 11 mars</p>
            <p style={{ ...iosType('subheadline', 500), color: ACCENT_INK }}>dans 2 h</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <motion.div style={{ ...iosType('headline'), scale: press, flex: 1, height: 56, borderRadius: 999, background: INK_IOS, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {accepted ? <><CheckCircleFill size={20} color={IOS.green} /> Rappels activés</> : <><BellFill size={18} /> Activer les rappels</>}
          </motion.div>
          <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#F2F1EF', display: 'grid', placeItems: 'center', color: INK_IOS }}><Ellipsis size={18} /></span>
        </div>
      </motion.div>
      {/* le billet rejoint le Wallet : bannière système en haut de l'écran */}
      <motion.div style={{ ...glassRegular, position: 'absolute', left: 10, right: 10, top: SAFE_TOP + 4, y: bannerY, height: 64, padding: '0 14px', borderRadius: 26, display: 'flex', alignItems: 'center', gap: 12, zIndex: 6 }}>
        <span style={{ width: 38, height: 38, borderRadius: 9, background: INK_IOS, color: '#fff', display: 'grid', placeItems: 'center' }}><CreditCardFill size={18} /></span>
        <div style={{ flex: 1 }}><p style={iosType('subheadline', 600)}>Ajouté à Apple Wallet</p><p style={{ ...iosType('footnote'), color: '#8E8E93' }}>Billet Renfo express · 12:15</p></div>
      </motion.div>
      <IOSStatusBar />
    </div>
  );
}

/* ═══ Desktop : gestion de production ════════════════ */
const ORDERS = [
  ['CMD-1042', 'Table chêne 180', 'Prête à lancer', 'accent'],
  ['CMD-1041', 'Bibliothèque murale', 'En production', 'amber'],
  ['CMD-1039', 'Bureau assis-debout', 'En production', 'amber'],
  ['CMD-1036', 'Banc d\'entrée', 'Livrée', 'green'],
  ['CMD-1035', 'Étagère sur mesure', 'Livrée', 'green'],
] as const;

function DesktopScreen({ step, t }: { step: number; t: MotionValue<number> }) {
  const navHighlight = useStepped(t, v => (step === 0 ? Math.min(3, Math.floor(v * 4)) : 1));
  const inspectorX = useTransform(t, [0, 0.4], [300, 0]);
  const build = useTransform(t, [0.15, 0.75], ['0%', '100%']);
  const done = useStepped(t, v => (step === 2 ? Math.min(3, Math.floor(clamp01((v - 0.2) / 0.6) * 4)) : 0));
  const launched = step === 2 && done >= 3;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #C9CEDA, #E8E3DA)', fontSize: 13, color: INK, textAlign: 'left' }}>
      <div style={{ height: 26, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(10px)', fontSize: 12 }}>
        <span style={{ fontWeight: 700 }}>Atelier</span>
        {['Fichier', 'Édition', 'Commandes', 'Fenêtre', 'Aide'].map(m => <span key={m} style={{ color: '#3A3A40' }}>{m}</span>)}
        <span style={{ marginLeft: 'auto', color: '#3A3A40' }}>mar. 9:41</span>
      </div>
      <div style={{ position: 'absolute', left: 34, right: 34, top: 50, bottom: 34, borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 30px 70px rgba(16,16,20,0.3), 0 0 0 1px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: '#F3F3F5', borderBottom: `1px solid ${LINE}` }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          <span style={{ marginLeft: 14, fontWeight: 600 }}>{['Vue d\'ensemble', 'Commandes', 'Planning', 'Stock'][navHighlight]}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', borderRadius: 7, background: '#fff', border: `1px solid ${LINE}`, color: FAINT, fontSize: 12, width: 200 }}><Search size={13} /> Rechercher <span style={{ marginLeft: 'auto' }}>⌘K</span></span>
        </div>
        <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
          <aside style={{ width: 200, padding: '14px 10px', background: '#F8F8FA', borderRight: `1px solid ${LINE}`, display: 'grid', alignContent: 'start', gap: 2 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: FAINT, padding: '4px 8px' }}>ATELIER</p>
            {([[LayoutGrid, 'Vue d\'ensemble'], [Box, 'Commandes'], [Calendar, 'Planning'], [Package, 'Stock']] as const).map(([Icon, label], i) => {
              const on = i === navHighlight;
              return <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', borderRadius: 7, fontWeight: on ? 600 : 500, background: on ? ACCENT_SOFT : 'transparent', color: on ? ACCENT_INK : '#3A3A40', transition: 'background .2s' }}><Icon size={15} /> {label}{step === 0 && <span style={{ marginLeft: 'auto', fontSize: 10.5, color: FAINT }}>⌘{i + 1}</span>}</span>;
            })}
            <p style={{ fontSize: 11, fontWeight: 700, color: FAINT, padding: '14px 8px 4px' }}>CLIENTS</p>
            {['Particuliers', 'Professionnels'].map(label => <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', color: '#3A3A40' }}><Folder size={15} /> {label}</span>)}
          </aside>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px', padding: '9px 16px', fontSize: 11.5, fontWeight: 600, color: FAINT, borderBottom: `1px solid ${LINE}` }}><span>N°</span><span>Article</span><span>État</span></div>
            {ORDERS.map(([id, item, state, tone], i) => {
              const sel = i === 0 && step > 0;
              return (
                <div key={id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${LINE}`, background: sel ? '#2563EB' : i % 2 ? '#FAFAFB' : '#fff', color: sel ? '#fff' : INK }}>
                  <span style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.8 }}>{id}</span><span style={{ fontWeight: 500 }}>{item}</span>
                  <span>{sel ? <span style={{ fontSize: 11.5, fontWeight: 600 }}>{launched ? 'En production' : state}</span> : <Pill tone={tone}>{state}</Pill>}</span>
                </div>
              );
            })}
          </div>
          {step > 0 && (
            <motion.aside style={{ x: step === 1 ? inspectorX : 0, width: 290, padding: 18, borderLeft: `1px solid ${LINE}`, background: '#FBFBFC', display: 'grid', alignContent: 'start', gap: 14 }}>
              <div><p style={{ fontSize: 11.5, color: FAINT }}>CMD-1042</p><p style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>Table chêne 180</p></div>
              {[['Client', 'M. et Mme Roux'], ['Livraison', '24 mars'], ['Bois', 'Chêne massif · 2,4 m³'], ['Stock', 'Disponible']].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}><span style={{ color: FAINT }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}
              <div style={{ padding: '10px 12px', borderRadius: 8, background: launched ? '#DCFCE7' : '#2563EB', color: launched ? '#15803D' : '#fff', textAlign: 'center', fontWeight: 600 }}>
                {launched ? '✓ Production lancée' : 'Lancer la production'}
              </div>
            </motion.aside>
          )}
          {step === 2 && (
            <div style={{ position: 'absolute', top: 0, left: '50%', width: 380, marginLeft: -190, padding: 20, borderRadius: '0 0 12px 12px', background: '#fff', boxShadow: '0 24px 60px rgba(16,16,20,0.25), 0 0 0 1px rgba(0,0,0,0.06)', display: 'grid', gap: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 15 }}>Bon de fabrication</p>
              <div style={{ height: 6, borderRadius: 6, background: '#F1F1F3', overflow: 'hidden' }}><motion.div style={{ height: '100%', width: build, background: '#2563EB' }} /></div>
              {['Fiche de débit (14 pièces)', 'Bois réservé en stock', 'Équipe atelier prévenue'].map((label, i) => (
                <p key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: i < done ? INK : FAINT, transition: 'color .2s' }}>
                  <CheckCircle2 size={16} color={i < done ? GREEN : '#D4D4D8'} /> {label}
                </p>
              ))}
            </div>
          )}
        </div>
        <div style={{ height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderTop: `1px solid ${LINE}`, background: '#F3F3F5', fontSize: 11.5, color: MUTED }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN }} /> Synchronisé · fonctionne hors ligne
          <span style={{ marginLeft: 'auto' }}>5 commandes</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ scène : appareil + écran piloté ════════════════ */
const DESIGN: Record<Product, { w: number; h: number }> = {
  web: { w: MACBOOK_W, h: MACBOOK_H },
  mobile: { w: PHONE_W + 40, h: PHONE_H + 40 },
  desktop: { w: MONITOR_W, h: MONITOR_H },
};

const screenSlide = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.3, ease: EASE } },
};

function StepScreen({ product, step, story }: { product: Product; step: number; story: MotionValue<number> }) {
  const t = useLocal(story, step);
  if (product === 'web') return step === 0 ? <WebConnect t={t} /> : step === 1 ? <WebPipeline t={t} /> : <WebCopilot t={t} />;
  if (product === 'mobile') return step === 0 ? <MobileWelcome t={t} /> : step === 1 ? <MobilePlanning t={t} /> : <MobileConfirm t={t} />;
  return <DesktopScreen step={step} t={t} />;
}

function Scene({ product, step, story, onSwipe }: { product: Product; step: number; story: MotionValue<number>; onSwipe: (dir: 1 | -1) => void }) {
  // Souris : les appareils sont des aperçus, pas des interfaces cliquables. Curseur « interdit »
  // et pas de glisser. Tactile : le balayage horizontal change d'étape.
  const finePointer = useMedia('(pointer: fine)');
  const boxRef = useRef<HTMLDivElement>(null);
  const { w, h } = DESIGN[product];
  const { scale, width, height } = useFitBox(boxRef, w, h);
  const inView = useInView(boxRef, { once: true, amount: 0.3 });
  const screen = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={step} {...screenSlide} style={{ position: 'absolute', inset: 0 }}>
        <StepScreen product={product} step={step} story={story} />
      </motion.div>
    </AnimatePresence>
  );
  return (
    <motion.div
      ref={boxRef}
      drag={finePointer ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      dragSnapToOrigin
      onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) onSwipe(info.offset.x < 0 ? 1 : -1); }}
      style={{ position: 'relative', width: '100%', height: '100%', touchAction: 'pan-y', cursor: finePointer ? 'not-allowed' : undefined }}
    >
      {/* Mise à l'échelle sur un div statique : une transform posée sur le motion.div serait
          écrasée par ses propres valeurs animées (y, scale). */}
      <div aria-hidden style={{ position: 'absolute', left: (width - w * scale) / 2, top: (height - h * scale) / 2, width: w, height: h, transformOrigin: '0 0', transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden', pointerEvents: 'none', userSelect: 'none' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={product}
            initial={{ opacity: 0, y: 80, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.97 }}
            transition={{ duration: 0.65, ease: EASE }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {product === 'web' && <MacBookPro14 play={inView && scale > 0}><div style={{ position: 'absolute', inset: 0, background: '#0A0A0D' }}>{screen}</div></MacBookPro14>}
            {product === 'mobile' && <div style={{ padding: 20 }}><IPhone>{screen}</IPhone></div>}
            {product === 'desktop' && <DesktopMonitor>{screen}</DesktopMonitor>}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══ écran de choix ═════════════════════════════════ */
// Appareils illustrés en CSS pour les cartes de choix : chacun montre un aperçu de son expérience
// (onboarding mobile, pipeline du SaaS, liste de l'application desktop).
function DeviceGlyph({ id }: { id: Product }) {
  const shadow = '0 22px 40px rgba(16,16,20,0.16)';
  const bar = (w: number | string, o = 0.12, h = 5) => <span style={{ display: 'block', width: w, height: h, borderRadius: h, background: `rgba(14,14,16,${o})` }} />;
  if (id === 'mobile') {
    return (
      <span style={{ position: 'relative', display: 'block', width: 74, height: 150, borderRadius: 20, padding: 4, background: 'linear-gradient(90deg, #8E9097, #E4E5E9 30%, #B9BBC2 60%, #7C7E85)', boxShadow: shadow }}>
        <span style={{ position: 'relative', display: 'grid', alignContent: 'end', gap: 5, width: '100%', height: '100%', borderRadius: 16, padding: '0 8px 12px', overflow: 'hidden', background: 'radial-gradient(70% 30% at 50% 30%, rgba(121,103,255,0.35), rgba(121,103,255,0) 70%), #141416' }}>
          <span style={{ position: 'absolute', top: 5, left: '50%', width: 22, height: 7, marginLeft: -11, borderRadius: 7, background: '#000' }} />
          <span style={{ position: 'absolute', left: 12, right: 12, top: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }} />
          {[['85%', 0.9], ['60%', 0.9]].map(([w, o]) => <span key={w} style={{ display: 'block', width: w, height: 6, borderRadius: 6, background: `rgba(255,255,255,${o})` }} />)}
          <span style={{ display: 'block', height: 14, marginTop: 6, borderRadius: 14, background: '#fff' }} />
        </span>
      </span>
    );
  }
  if (id === 'web') {
    return (
      <span style={{ display: 'grid', justifyItems: 'center' }}>
        <span style={{ display: 'grid', gridTemplateColumns: '28px 1fr', width: 176, height: 112, borderRadius: '10px 10px 3px 3px', padding: 5, background: '#111113', boxShadow: shadow }}>
          <span style={{ display: 'grid', alignContent: 'start', gap: 5, padding: 5, borderRadius: '6px 0 0 2px', background: '#0D0D11', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: 'conic-gradient(#8B7BFF, #5EEAD4, #8B7BFF)' }} />
            {[0.5, 0.2, 0.2].map((o, k) => <span key={k} style={{ display: 'block', height: 4, borderRadius: 4, background: `rgba(255,255,255,${o})` }} />)}
          </span>
          <span style={{ position: 'relative', display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 6, borderRadius: '0 6px 2px 0', background: 'radial-gradient(60% 60% at 50% 40%, rgba(139,123,255,0.3), transparent 70%), #0A0A0D' }}>
            <span style={{ display: 'block', width: 26, height: 26, borderRadius: '50%', background: 'conic-gradient(#8B7BFF, #5EEAD4, #C4B5FD, #8B7BFF)', boxShadow: '0 0 18px rgba(139,123,255,0.6)' }} />
            <span style={{ display: 'block', width: 70, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.6)' }} />
            <span style={{ display: 'block', width: 50, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
          </span>
        </span>
        <span style={{ display: 'block', width: 206, height: 9, borderRadius: '2px 2px 9px 9px', background: 'linear-gradient(180deg, #E9EAEE, #A9ABB3)' }} />
      </span>
    );
  }
  return (
    <span style={{ display: 'grid', justifyItems: 'center' }}>
      <span style={{ display: 'block', width: 176, height: 112, borderRadius: 8, padding: 6, background: 'linear-gradient(180deg, #D9DBE0, #BFC2C9)', boxShadow: shadow }}>
        <span style={{ display: 'grid', gridTemplateRows: '9px 1fr', width: '100%', height: '100%', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px', background: '#F3F3F5' }}>{['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 4, height: 4, borderRadius: '50%', background: c }} />)}</span>
          <span style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: 4, padding: 4 }}>
            <span style={{ display: 'grid', alignContent: 'start', gap: 4 }}>{bar('100%', 0.12)}{bar('100%', 0.12)}{bar('100%', 0.12)}</span>
            <span style={{ display: 'grid', alignContent: 'start', gap: 3 }}>
              <span style={{ display: 'block', height: 9, borderRadius: 2, background: '#2563EB' }} />
              {[0, 1, 2, 3].map(k => <span key={k} style={{ display: 'block', height: 9, borderRadius: 2, background: k % 2 ? '#FAFAFB' : '#F1F1F3' }} />)}
            </span>
          </span>
        </span>
      </span>
      <span style={{ display: 'block', width: 26, height: 22, background: 'linear-gradient(90deg, #A9ACB4, #E2E4E8 45%, #B7BAC1)', clipPath: 'polygon(18% 0, 82% 0, 100% 100%, 0 100%)' }} />
      <span style={{ display: 'block', width: 76, height: 6, borderRadius: 4, background: 'linear-gradient(180deg, #E4E6EA, #A9ACB4)' }} />
    </span>
  );
}

function ChoiceCard({ p, compact, onChoose, customCursor }: { p: typeof PRODUCTS[number]; compact: boolean; onChoose: (id: Product) => void; customCursor?: boolean }) {
  return (
    <motion.button
      type="button"
      data-choice={p.id}
      onClick={() => onChoose(p.id)}
      onMouseEnter={() => sfx.hover()}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={{ rest: { y: 0 }, hover: { y: -6 } }}
      style={{ position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: compact ? '96px 1fr' : '1fr', alignItems: 'center', justifyItems: compact ? 'start' : 'center', gap: compact ? 16 : 22, padding: compact ? '18px 18px' : 'clamp(20px, 4vh, 40px) 28px clamp(18px, 3vh, 30px)', borderRadius: 26, border: 'none', background: '#fff', boxShadow: '0 2px 4px rgba(20,12,90,0.12), 0 30px 70px rgba(20,12,90,0.28)', cursor: customCursor ? 'none' : 'pointer', textAlign: compact ? 'left' : 'center', color: INK, width: '100%' }}
    >
      <span aria-hidden style={{ position: 'absolute', inset: 0, background: p.ambient, opacity: 0.4 }} />
      <span style={{ position: 'relative', height: compact ? 96 : 'clamp(110px, 17vh, 160px)', display: 'grid', placeItems: 'center', transform: compact ? 'scale(0.55)' : undefined, transformOrigin: 'left center' }}>
        <motion.span variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.08, rotate: -2 } }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} style={{ display: 'block' }}>
          <DeviceGlyph id={p.id} />
        </motion.span>
      </span>
      <span style={{ position: 'relative', display: 'grid', gap: 8 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: compact ? 22 : 'clamp(1.5rem, 2.2vw, 2rem)', fontWeight: 600, letterSpacing: '-0.02em' }}>{p.label}</span>
        <span style={{ fontSize: 14, lineHeight: 1.55, color: MUTED }}>{p.pitch.replace(/^Exemple : (.)/, (_, c: string) => c.toUpperCase())}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: compact ? 'flex-start' : 'center', gap: 6, fontSize: 14, fontWeight: 600, color: ACCENT_INK, marginTop: 4 }}>Entrer dans l'expérience <ArrowRight size={15} /></span>
      </span>
    </motion.button>
  );
}

// Curseur de l'écran de choix (souris uniquement) : une flèche qui suit la souris et devient un
// grand doigt de sélection au survol d'une carte. Le vrai curseur est masqué dans la zone.
function ChoiceCursor({ areaRef }: { areaRef: React.RefObject<HTMLDivElement | null> }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.4 });
  const [inside, setInside] = useState(false);
  const [onCard, setOnCard] = useState(false);
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setInside(true);
      setOnCard(Boolean((e.target as HTMLElement).closest('[data-choice]')));
    };
    const leave = () => setInside(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    area.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
      area.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [areaRef, x, y]);
  return (
    <motion.div aria-hidden style={{ position: 'fixed', left: 0, top: 0, x: sx, y: sy, zIndex: 80, pointerEvents: 'none', opacity: inside ? 1 : 0 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {onCard ? (
          <motion.div
            key="finger"
            initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
            animate={{ scale: pressed ? 0.88 : 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            style={{ position: 'absolute', left: -42, top: -14, width: 84, height: 84, borderRadius: '50%', display: 'grid', placeItems: 'center', background: INK, boxShadow: '0 0 0 6px rgba(255,255,255,0.85), 0 18px 40px rgba(20,12,90,0.4)' }}
          >
            <Pointer size={42} color={INK} fill="#fff" strokeWidth={1.4} />
          </motion.div>
        ) : (
          <motion.div key="arrow" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: 'absolute', left: -3, top: -2 }}>
            <MousePointer2 size={24} color="#fff" fill={INK} strokeWidth={1.4} style={{ filter: 'drop-shadow(0 2px 4px rgba(16,16,20,0.3))' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Plein bleu Ozirus : couleur de marque en aplat, avec un léger relief lumineux.
const chooserBg = `radial-gradient(60% 60% at 80% 10%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), linear-gradient(160deg, ${ACCENT} 0%, ${ACCENT_INK} 60%, #3F2CD6 100%)`;

function ChooserHeading({ compact }: { compact: boolean }) {
  return (
    <div style={{ position: 'relative', textAlign: 'center', maxWidth: 880 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Choisissez votre produit</p>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: compact ? 'clamp(2.1rem, 9vw, 3rem)' : 'clamp(2.2rem, min(5.4vw, 8vh), 5rem)', lineHeight: 0.98, letterSpacing: '-0.04em', color: '#fff' }}>
        Imaginez votre idée <span style={{ color: 'rgba(255,255,255,0.55)' }}>sous cette forme.</span>
      </h2>
      <p style={{ fontSize: compact ? 15 : 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginTop: 16 }}>Choisissez un type de produit : vous entrez dedans, et le scroll le fait vivre.</p>
    </div>
  );
}

// Grand écran : piste courte épinglée. Transition de page nette : un panneau plein bleu monte du
// bas de l'écran (bord droit, sans arrondi) et le recouvre ; le titre et les trois choix, présents
// d'emblée côte à côte, entrent ensemble juste derrière.
function PinnedChooser({ onChoose, trackRef }: { onChoose: (id: Product) => void; trackRef: React.RefObject<HTMLDivElement | null> }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const finePointer = useMedia('(pointer: fine)');
  const raw = useTrackProgress(trackRef, true);
  const p = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.4 });
  const cover = useTransform(raw, [0, 0.22], [100, 0]);
  // Son d'arrivée quand le bleu recouvre tout l'écran.
  useCrossing(raw, 0.22, 0.08, sfx.arrive);
  const clip = useTransform(cover, v => `inset(${v}% 0 0 0)`);
  const contentY = useTransform(p, [0.2, 0.38], [90, 0]);
  const contentOpacity = useTransform(p, [0.2, 0.32], [0, 1]);
  return (
    <div ref={trackRef} style={{ position: 'relative', height: '170vh' }}>
      <div ref={areaRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', cursor: finePointer ? 'none' : undefined }}>
        <motion.div style={{ position: 'absolute', inset: 0, clipPath: clip, WebkitClipPath: clip, background: chooserBg }} />
        <motion.div style={{ position: 'relative', height: '100%', display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 'clamp(18px, 4vh, 52px)', padding: '32px 32px', y: contentY, opacity: contentOpacity }}>
          <ChooserHeading compact={false} />
          <div role="group" aria-label="Type de produit" style={{ width: '100%', maxWidth: 1180, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {PRODUCTS.map(prod => <ChoiceCard key={prod.id} p={prod} compact={false} onChoose={onChoose} customCursor={finePointer} />)}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Ou continuez à défiler pour découvrir la méthode.</p>
        </motion.div>
        {finePointer && <ChoiceCursor areaRef={areaRef} />}
      </div>
    </div>
  );
}

function CompactChooser({ onChoose }: { onChoose: (id: Product) => void }) {
  return (
    <div style={{ position: 'relative', minHeight: '100svh', display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 26, padding: '72px 16px 56px' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: chooserBg }} />
      <ChooserHeading compact />
      <div role="group" aria-label="Type de produit" style={{ position: 'relative', width: '100%', display: 'grid', gap: 12 }}>
        {PRODUCTS.map(prod => <ChoiceCard key={prod.id} p={prod} compact onChoose={onChoose} />)}
      </div>
      <p style={{ position: 'relative', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Ou continuez à défiler pour découvrir la méthode.</p>
    </div>
  );
}

/* ═══ section ════════════════════════════════════════ */
/* ═══ lecture automatique ═════════════════════════════
   Après le choix d'un produit, la démo se joue seule : la lecture fait défiler la vraie page (le
   scroll reste l'unique source de vérité), avec des temps d'arrêt (« beats ») sur les écrans qui le
   méritent. Le moindre geste (molette, toucher, clavier) l'interrompt et rend la main au scroll. */
type Beat = { at: number; hold: number }; // `at` : progression locale de l'écran (0 → 1), `hold` en s
const DEFAULT_BEATS: Beat[] = [{ at: 1, hold: 0 }];
// Calés sur les animations de chaque écran (voir les seuils dans leurs `useTransform`/`useStepped`).
const BEATS: Partial<Record<Product, Beat[][]>> = {
  mobile: [
    // arrêt sur le splash, puis sur chaque page de l'onboarding une fois son animation jouée
    [{ at: 0.07, hold: 1.1 }, ...PAGES.map((_, i) => ({ at: SPLASH + SEG * (i + 0.8), hold: 1.5 }))],
    // astuce affichée, puis cours réservé
    [{ at: 0.4, hold: 1.2 }, { at: 1, hold: 0.8 }],
    // feuille en attente, confirmée, rappels activés, billet dans le Wallet
    [{ at: 0.3, hold: 0.8 }, { at: 0.5, hold: 0.8 }, { at: 0.7, hold: 0.6 }, { at: 1, hold: 1.2 }],
  ],
  web: [
    // sources synchronisées une à une, règles apprises, ton choisi, agent activable
    [{ at: 0.2, hold: 0.4 }, { at: 0.36, hold: 0.4 }, { at: 0.72, hold: 0.8 }, { at: 1, hold: 1.2 }],
    // raisonnement de l'agent, réponse rédigée, action exécutée
    [{ at: 0.38, hold: 0.8 }, { at: 0.8, hold: 0.5 }, { at: 1, hold: 1.2 }],
    // chiffres et courbe, puis ce que l'IA a remarqué et l'action choisie
    [{ at: 0.6, hold: 0.6 }, { at: 0.75, hold: 0.6 }, { at: 1, hold: 1.2 }],
  ],
  desktop: [
    // parcours des sections au clavier
    [{ at: 0.3, hold: 0.5 }, { at: 0.55, hold: 0.5 }, { at: 0.8, hold: 0.5 }, { at: 1, hold: 1 }],
    // l'inspecteur s'ouvre sur la commande
    [{ at: 0.45, hold: 1 }, { at: 1, hold: 0.6 }],
    // bon de fabrication coché ligne à ligne, production lancée
    [{ at: 0.4, hold: 0.5 }, { at: 0.6, hold: 0.5 }, { at: 0.85, hold: 1 }, { at: 1, hold: 0.6 }],
  ],
};
const beatsFor = (product: Product, step: number) => BEATS[product]?.[step] ?? DEFAULT_BEATS;
/** Position dans l'histoire (0 → STEPS) d'une progression locale : inverse de `useLocal`. */
const storyAt = (step: number, local: number) => step + Math.min(0.95, local / 1.15);
const DWELL = 1.2; // pause sur la fin d'une étape avant d'enchaîner la suivante, en s

type ScrollToY = (y: number, options?: { immediate?: boolean; duration?: number; easing?: (t: number) => number }) => void;
// Lecture régulière (l'easing par défaut de Lenis jouerait presque toute l'étape d'un coup).
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export default function ProductExperience({ scrollToY }: { scrollToY: ScrollToY }) {
  // Rien n'est choisi au départ : l'écran de choix occupe tout l'écran et la page défile
  // normalement. Un choix ouvre l'expérience (piste épinglée) ; le bouton en haut à droite
  // ramène à l'écran de choix.
  const [product, setProduct] = useState<Product | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const pinned = usePinned();
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const chooserRef = useRef<HTMLDivElement>(null);
  const viewed = useRef(new Set<string>());
  // Lecture automatique : minuteries de la séquence en cours (grand écran) et enchaînement des
  // étapes (petit écran). Une nouvelle lecture ou un geste de l'utilisateur annule tout.
  const timers = useRef<number[]>([]);
  const autoAdvance = useRef(false);
  const stopAuto = useCallback(() => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current = [];
    autoAdvance.current = false;
  }, []);

  const track = useTrackProgress(trackRef, pinned && product !== null);
  const story = useMotionValue(0);
  const intro = useTransform(track, [0, INTRO], [0, 1]);
  const stageScale = useTransform(intro, [0, 1], [0.94, 1]);
  const barWidth = useTransform(story, v => `${(v / STEPS) * 100}%`);

  const current = PRODUCTS.find(p => p.id === product) ?? PRODUCTS[1];
  const step = current.steps[activeStep];

  // Épinglé : la piste pilote l'histoire et l'étape affichée.
  useEffect(() => {
    if (!pinned || !product) return;
    const sync = (p: number) => {
      const s = clamp01((p - INTRO) / (1 - INTRO)) * STEPS;
      story.set(s);
      const next = Math.min(STEPS - 1, Math.floor(s));
      setActiveStep(prev => (prev === next ? prev : next));
    };
    sync(track.get());
    return track.on('change', sync);
  }, [pinned, product, track, story]);

  // Non épinglé : chaque étape se joue toute seule à son arrivée (mêmes temps d'arrêt qu'en grand
  // écran), puis enchaîne la suivante tant que l'utilisateur n'a pas repris la main.
  useEffect(() => {
    if (pinned || !product) return;
    if (reduced) { story.set(activeStep + 1); return; }
    story.set(activeStep);
    const values = [activeStep, activeStep];
    const at = [0, SCREEN_SETTLE];
    let prev = 0;
    for (const b of beatsFor(product, activeStep)) {
      const d = Math.max(0.9, (b.at - prev) * STEP_PLAY);
      prev = b.at;
      values.push(storyAt(activeStep, b.at), storyAt(activeStep, b.at));
      at.push(at[at.length - 1] + d, at[at.length - 1] + d + b.hold);
    }
    values.push(activeStep + 1);
    at.push(at[at.length - 1] + 0.3);
    const total = at[at.length - 1];
    let next = 0;
    const controls = animate(story, values, {
      duration: total,
      times: at.map(v => v / total),
      ease: 'easeInOut',
      onComplete: () => {
        if (!autoAdvance.current || activeStep >= STEPS - 1) return;
        next = window.setTimeout(() => setActiveStep(activeStep + 1), DWELL * 1000);
      },
    });
    return () => { controls.stop(); window.clearTimeout(next); };
  }, [pinned, reduced, activeStep, product, story]);

  const sectionTop = () => (sectionRef.current ? sectionRef.current.getBoundingClientRect().top + window.scrollY : 0);

  const stepY = useCallback((at: number) => {
    const el = trackRef.current;
    return el ? trackScrollY(el, INTRO + (1 - INTRO) * (at / STEPS)) : 0;
  }, []);

  // Un geste de l'utilisateur interrompt la lecture : le scroll reprend la main là où il est.
  useEffect(() => {
    const keys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);
    const onKey = (e: KeyboardEvent) => { if (keys.has(e.key)) stopAuto(); };
    window.addEventListener('wheel', stopAuto, { passive: true });
    window.addEventListener('touchstart', stopAuto, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      stopAuto();
      window.removeEventListener('wheel', stopAuto);
      window.removeEventListener('touchstart', stopAuto);
      window.removeEventListener('keydown', onKey);
    };
  }, [stopAuto]);

  // Lit la démo à partir de l'étape `from` jusqu'à la fin. Grand écran : une suite de défilements
  // programmés (entrée de l'écran, temps d'arrêt, pause, étape suivante). `smooth` : on arrive en
  // douceur depuis l'écran de choix au lieu de sauter au début de l'étape.
  const play = useCallback((p: Product, from: number, smooth = false) => {
    stopAuto();
    const start = Math.min(STEPS - 1, Math.max(0, from));
    if (!pinned) { autoAdvance.current = true; setActiveStep(start); return; }
    if (reduced) { scrollToY(stepY(start + 0.95), { immediate: true }); return; }
    const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
    let ms = 0;
    for (let s = start; s < STEPS; s++) {
      const entry = stepY(s + 0.01);
      if (s === start && !smooth) later(ms, () => scrollToY(entry, { immediate: true }));
      else {
        later(ms, () => scrollToY(entry, { duration: 0.7, easing: easeInOutSine }));
        ms += 700;
      }
      ms += SCREEN_SETTLE * 1000;
      let prev = 0;
      for (const b of beatsFor(p, s)) {
        const d = Math.max(0.9, (b.at - prev) * STEP_PLAY);
        prev = b.at;
        later(ms, () => scrollToY(stepY(storyAt(s, b.at)), { duration: d, easing: easeInOutSine }));
        ms += (d + b.hold) * 1000;
      }
      ms += DWELL * 1000;
    }
    later(ms, () => { timers.current = []; });
  }, [pinned, reduced, scrollToY, stepY, stopAuto]);

  const goTo = useCallback((i: number) => { if (product) play(product, i); }, [product, play]);

  const choose = (id: Product) => {
    setProduct(id);
    setActiveStep(0);
    story.set(0);
    trackMvp('product_type_selected', { product: id });
    sfx.select();
    // L'expérience démarre exactement là où était l'écran de choix, puis se joue toute seule une
    // fois l'appareil entré en scène.
    stopAuto();
    window.requestAnimationFrame(() => scrollToY(sectionTop()));
    timers.current.push(window.setTimeout(() => play(id, 0, true), 700));
  };

  const backToChooser = () => {
    sfx.open();
    stopAuto();
    setProduct(null);
    // Grand écran : on revient au moment où le bloc de choix est plein écran.
    window.requestAnimationFrame(() => scrollToY(sectionTop() + (pinned ? window.innerHeight * 0.45 : 0)));
  };

  // Petit déclic à chaque changement d'étape (pas au démarrage d'une démo, déjà sonorisé par le choix).
  const lastStep = useRef<string | null>(null);
  useEffect(() => {
    const key = product ? `${product}-${activeStep}` : null;
    if (key && lastStep.current && lastStep.current.split('-')[0] === product && lastStep.current !== key) sfx.step();
    lastStep.current = key;
  }, [product, activeStep]);

  useEffect(() => {
    if (!product) return;
    const key = `${product}-${activeStep}`;
    if (viewed.current.has(key)) return;
    viewed.current.add(key);
    trackMvp('product_demo_step_viewed', { product, step: activeStep + 1 });
    if (activeStep === STEPS - 1) trackMvp('product_demo_completed', { product });
  }, [product, activeStep]);

  if (!product) {
    return (
      <section id="experience" ref={sectionRef} aria-label="Exemples de produits" style={{ position: 'relative', borderTop: `1px solid ${LINE}` }}>
        {pinned ? <PinnedChooser onChoose={choose} trackRef={chooserRef} /> : <CompactChooser onChoose={choose} />}
      </section>
    );
  }

  // Choix replié en haut à droite : un clic ramène à l'écran de choix.
  const switcher = (
    <button type="button" onClick={backToChooser} aria-label={`${current.label} — changer de type de produit`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 8px 8px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)', boxShadow: '0 1px 2px rgba(16,16,20,0.05), 0 10px 30px rgba(16,16,20,0.1)', color: INK, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
      <current.icon size={16} /> {current.short}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 999, background: INK, color: '#fff', fontSize: 12.5 }}><LayoutGrid size={13} /> Changer</span>
    </button>
  );

  const stepNav = (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: `repeat(${STEPS}, 1fr)`, gap: 8 }}>
      {current.steps.map((s, i) => (
        <li key={s.label}>
          <StepTab index={i} label={s.label} active={i === activeStep} story={story} onClick={() => goTo(i)} />
        </li>
      ))}
    </ol>
  );

  const controls = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button type="button" onClick={() => goTo(activeStep - 1)} disabled={activeStep === 0} aria-label="Étape précédente" style={{ ...roundBtn, opacity: activeStep === 0 ? 0.35 : 1, cursor: activeStep === 0 ? 'default' : 'pointer', transition: 'opacity .2s' }}><ArrowLeft size={17} /></button>
      <button type="button" onClick={() => goTo(activeStep + 1)} disabled={activeStep === STEPS - 1} aria-label="Étape suivante" style={{ ...roundBtn, opacity: activeStep === STEPS - 1 ? 0.35 : 1, cursor: activeStep === STEPS - 1 ? 'default' : 'pointer', transition: 'opacity .2s' }}><ArrowRight size={17} /></button>
    </div>
  );

  const copy = (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={`${product}-${activeStep}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: EASE }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: ACCENT_INK, marginBottom: 10, fontVariantNumeric: 'tabular-nums' }}>{String(activeStep + 1).padStart(2, '0')} — {step.label}</p>
          <h3 style={{ fontFamily: DISPLAY, fontSize: pinned ? 'clamp(1.9rem, 3vw, 2.7rem)' : 'clamp(1.5rem, 6vw, 1.9rem)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.06, marginBottom: 14 }}>{step.title}</h3>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: MUTED, marginBottom: 14 }}>{step.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{step.built.map(b => <Pill key={b}>{b}</Pill>)}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const cta = (
    <button type="button" onClick={() => openMvpBooking(`experience-${product}`)} style={{ justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 999, border: 'none', background: INK, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
      Parler de mon produit <ArrowRight size={16} />
    </button>
  );

  const disclaimer = <p style={{ fontSize: 12, color: FAINT, lineHeight: 1.5 }}>{current.pitch} Interfaces illustratives, pas un produit client réel.</p>;
  const ambient = <div aria-hidden style={{ position: 'absolute', inset: 0, background: current.ambient }} />;

  if (pinned) {
    return (
      <section id="experience" ref={sectionRef} aria-label="Exemples de produits" style={{ position: 'relative', borderTop: `1px solid ${LINE}` }}>
        <div ref={trackRef} style={{ position: 'relative', height: `${100 + STEPS * 120}vh` }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
            {ambient}
            <motion.div style={{ position: 'absolute', inset: 0, scale: stageScale }}>
              <div style={{ position: 'absolute', top: 24, right: 'max(24px, 3vw)', zIndex: 3 }}>{switcher}</div>
              <div style={{ position: 'absolute', left: 'max(32px, 5vw)', top: 80, bottom: 56, width: 'min(400px, 30vw)', display: 'grid', alignContent: 'center', gap: 22, zIndex: 2 }}>
                {stepNav}
                {copy}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>{cta}{controls}</div>
              </div>
              <div style={{ position: 'absolute', left: 'calc(max(32px, 5vw) + min(400px, 30vw) + 3vw)', right: 'max(24px, 3vw)', top: 84, bottom: 44 }}>
                <Scene product={product} step={activeStep} story={story} onSwipe={dir => goTo(activeStep + dir)} />
              </div>
              <div style={{ position: 'absolute', left: 'max(32px, 5vw)', bottom: 18, maxWidth: 560, zIndex: 2 }}>{disclaimer}</div>
              <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(14,14,16,0.06)' }}>
                <motion.div style={{ height: '100%', width: barWidth, background: INK }} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" ref={sectionRef} aria-label="Exemples de produits" style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh', padding: '92px 0 56px', borderTop: `1px solid ${LINE}`, scrollMarginTop: 0 }}>
      {ambient}
      <div ref={trackRef} style={{ position: 'relative', maxWidth: 760, margin: '0 auto', padding: '0 16px', display: 'grid', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{switcher}</div>
        <div style={{ width: '100%', height: product === 'mobile' ? 'min(560px, 120vw)' : 'min(440px, 72vw)' }}>
          <Scene product={product} step={activeStep} story={story} onSwipe={dir => goTo(activeStep + dir)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>{stepNav}</div>
          {controls}
        </div>
        {copy}
        {cta}
        {disclaimer}
      </div>
    </section>
  );
}

function StepTab({ index, label, active, story, onClick }: { index: number; label: string; active: boolean; story: MotionValue<number>; onClick: () => void }) {
  const fill = useTransform(story, v => `${clamp01(v - index) * 100}%`);
  return (
    <button type="button" onClick={onClick} aria-current={active ? 'step' : undefined} style={{ width: '100%', display: 'grid', gap: 8, padding: '6px 0', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: active ? INK : FAINT }}>
      <span style={{ display: 'block', height: 3, borderRadius: 3, background: 'rgba(14,14,16,0.1)', overflow: 'hidden' }}>
        <motion.span style={{ display: 'block', height: '100%', width: fill, background: INK }} />
      </span>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

const roundBtn: React.CSSProperties = { width: 44, height: 44, borderRadius: 999, border: `1px solid ${LINE}`, background: 'rgba(255,255,255,0.85)', color: INK, display: 'grid', placeItems: 'center', cursor: 'pointer' };
