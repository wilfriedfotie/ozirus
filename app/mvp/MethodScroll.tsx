'use client';

// Méthode Ozirus en défilement horizontal : sur grand écran, la section est épinglée et le scroll
// vertical fait glisser les quatre phases de droite à gauche ; l'illustration de chaque phase se
// joue au rythme du scroll (dans les deux sens). Mobile / mouvement réduit : phases empilées,
// chacune s'anime à son entrée à l'écran (ou s'affiche finie si le mouvement est réduit).

import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { Check, CheckCircle2, Globe, KeyRound, Rocket, Sparkles } from 'lucide-react';
import { clamp01, useMedia, usePinned, useStepped, useTrackProgress } from './scroll';
import { sfx, useCrossing } from './sound';
import { ACCENT, ACCENT_INK, ACCENT_SOFT, DISPLAY, FAINT, GREEN, INK, LINE, MUTED } from './theme';

// Le déroulé réel du format 30 jours, nommé par verbe d'action.
const PHASES = [
  { verb: 'Cadrer et concevoir', days: 'Jours 1 à 5', title: 'Cadrage & design', desc: 'Atelier produit, parcours utilisateur, priorités claires et premières maquettes validées ensemble. On y ajoute ce à quoi on ne pense pas : tracking, alertes, sauvegardes, RGPD.' },
  { verb: 'Construire', days: 'Jours 6 à 20', title: 'Itérations rapides', desc: 'Une version fonctionnelle tous les 2 jours. Vous testez, vous demandez, on ajuste immédiatement.' },
  { verb: 'Tester', days: 'Jours 21 à 26', title: 'Tests & finitions', desc: 'Recette, corrections, performance, mise en production sur vos comptes.' },
  { verb: 'Livrer', days: 'Jours 27 à 30', title: 'Lancement', desc: 'Landing page en ligne, vidéo motion livrée, MVP prêt pour vos premiers utilisateurs.' },
];

const board: React.CSSProperties = { position: 'relative', width: '100%', height: '100%', borderRadius: 22, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(16,16,20,0.04), 0 24px 60px rgba(16,16,20,0.08)', overflow: 'hidden' };

/* ─── 1. Cadrer : les idées sont triées, le MVP se dessine ─── */
const IDEAS = [
  { label: 'Inscription', mvp: true, from: [8, 14] },
  { label: 'Paiement', mvp: true, from: [56, 8] },
  { label: 'Avatar 3D qui parle', mvp: false, from: [30, 44] },
  { label: 'Tableau de bord', mvp: true, from: [62, 52] },
  { label: 'Version Apple Watch', mvp: false, from: [12, 70] },
  { label: 'Fidélité en NFT', mvp: false, from: [44, 78] },
  { label: 'Mode réalité augmentée', mvp: false, from: [52, 30] },
];

// Ce qu'un fondateur non technique ne pense pas à demander : ajouté au MVP une fois le tri fait.
// Ordre choisi pour que les étiquettes tiennent à deux par ligne dans la colonne, même sur mobile.
const ESSENTIALS = ['Tracking', 'SEO', 'Alertes bugs', 'RGPD', 'Emails auto', 'Sauvegardes'];

function Idea({ t, idea, slot }: { t: MotionValue<number>; idea: typeof IDEAS[number]; slot: number }) {
  const to = idea.mvp ? [6, 21 + slot * 11] : [54, 24 + slot * 11];
  const left = useTransform(t, [0.05, 0.45], [`${idea.from[0]}%`, `${to[0]}%`]);
  const top = useTransform(t, [0.05, 0.45], [`${idea.from[1]}%`, `${to[1]}%`]);
  const rotate = useTransform(t, [0.05, 0.45], [((slot % 3) - 1) * 6, 0]);
  const fade = useTransform(t, [0.35, 0.5], [1, idea.mvp ? 1 : 0.45]);
  return (
    <motion.span style={{ position: 'absolute', left, top, rotate, opacity: fade, padding: '8px 12px', borderRadius: 10, background: idea.mvp ? '#FFF6D6' : '#F4F4F5', border: `1px solid ${idea.mvp ? '#F5DFA0' : LINE}`, fontSize: 13, fontWeight: 600, color: INK, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(16,16,20,0.06)' }}>
      {idea.label}
    </motion.span>
  );
}

function Essential({ t, label, index }: { t: MotionValue<number>; label: string; index: number }) {
  const start = 0.6 + index * 0.055;
  const appear = useTransform(t, [start, start + 0.08], [0, 1]);
  const y = useTransform(appear, [0, 1], [10, 0]);
  return (
    <motion.span style={{ opacity: appear, y, padding: '4px 8px', borderRadius: 8, background: ACCENT_SOFT, border: `1px solid ${ACCENT}`, color: ACCENT_INK, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </motion.span>
  );
}

function FrameIllustration({ t }: { t: MotionValue<number> }) {
  const columns = useTransform(t, [0.25, 0.4], [0, 1]);
  const caption = useTransform(t, [0.52, 0.6], [0, 1]);
  let mvpSlot = 0;
  let laterSlot = 0;
  return (
    <div style={board}>
      <motion.div style={{ position: 'absolute', left: '4%', top: '8%', width: '44%', bottom: '8%', borderRadius: 16, border: `1.5px dashed ${ACCENT}`, background: '#FBFAFF', opacity: columns }}>
        <p style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: ACCENT_INK, letterSpacing: '0.06em' }}>MVP · 30 JOURS</p>
      </motion.div>
      <motion.div style={{ position: 'absolute', left: '52%', top: '8%', right: '4%', bottom: '8%', borderRadius: 16, border: `1.5px dashed ${LINE}`, opacity: columns }}>
        <p style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: FAINT, letterSpacing: '0.06em' }}>PLUS TARD · V2</p>
      </motion.div>
      {IDEAS.map(idea => <Idea key={idea.label} t={t} idea={idea} slot={idea.mvp ? mvpSlot++ : laterSlot++} />)}
      <div style={{ position: 'absolute', left: '6%', width: '40%', top: '56%', bottom: '6%' }}>
        <motion.p style={{ opacity: caption, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: ACCENT_INK, letterSpacing: '0.04em', marginBottom: 7 }}>
          <Sparkles size={12} /> ON Y PENSE POUR VOUS
        </motion.p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {ESSENTIALS.map((label, i) => <Essential key={label} t={t} label={label} index={i} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Construire : une version tous les 2 jours ─── */
const VERSIONS = [6, 8, 10, 12, 14, 16, 18, 20];

function BuildIllustration({ t }: { t: MotionValue<number> }) {
  const shipped = useStepped(t, v => Math.round(clamp01((v - 0.05) / 0.8) * VERSIONS.length));
  const blocks = [
    { l: '4%', t: '6%', w: '92%', h: '10%' },
    { l: '4%', t: '20%', w: '22%', h: '72%' },
    { l: '30%', t: '20%', w: '32%', h: '22%' },
    { l: '65%', t: '20%', w: '31%', h: '22%' },
    { l: '30%', t: '46%', w: '66%', h: '24%' },
    { l: '30%', t: '74%', w: '32%', h: '18%' },
    { l: '65%', t: '74%', w: '31%', h: '18%' },
  ];
  const day = VERSIONS[Math.max(0, shipped - 1)] ?? 6;
  return (
    <div style={{ ...board, display: 'grid', gridTemplateRows: '1fr auto' }}>
      <div style={{ position: 'relative', margin: '18px 18px 0', borderRadius: 14, background: '#FAFAFB', border: `1px solid ${LINE}`, overflow: 'hidden' }}>
        {blocks.map((b, i) => {
          const on = i < Math.ceil((shipped / VERSIONS.length) * blocks.length);
          return (
            <motion.span
              key={i}
              animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              style={{ position: 'absolute', left: b.l, top: b.t, width: b.w, height: b.h, borderRadius: 8, background: on ? (i === 4 ? ACCENT_SOFT : '#fff') : '#EFEFF2', border: `1px solid ${on ? (i === 4 ? '#D9D4FF' : LINE) : 'transparent'}` }}
            />
          );
        })}
        <span style={{ position: 'absolute', right: 12, top: 12, padding: '4px 10px', borderRadius: 999, background: INK, color: '#fff', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>v0.{Math.max(1, shipped)}</span>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: MUTED, marginBottom: 10 }}>
          <span>Une version testable tous les 2 jours</span>
          <span style={{ fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>Jour {day}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${VERSIONS.length}, 1fr)`, gap: 6 }}>
          {VERSIONS.map((d, i) => (
            <span key={d} style={{ height: 8, borderRadius: 8, background: i < shipped ? INK : '#ECECEF', transition: 'background .25s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Tester : la recette se coche ─── */
const CHECKS = ['Inscription et connexion', 'Parcours principal', 'Paiement', 'Emails envoyés', 'Affichage mobile', 'Performance au chargement'];

function TestIllustration({ t }: { t: MotionValue<number> }) {
  const passed = useStepped(t, v => Math.round(clamp01((v - 0.05) / 0.75) * CHECKS.length));
  const bar = useTransform(t, v => `${clamp01((v - 0.05) / 0.75) * 100}%`);
  return (
    <div style={{ ...board, padding: 22, display: 'grid', alignContent: 'start', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <p style={{ fontSize: 14, fontWeight: 700 }}>Recette avant mise en ligne</p>
        <p style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{passed}<span style={{ color: FAINT }}>/{CHECKS.length}</span></p>
      </div>
      <div style={{ height: 6, borderRadius: 6, background: '#F1F1F3', overflow: 'hidden', marginBottom: 6 }}><motion.div style={{ height: '100%', width: bar, background: GREEN }} /></div>
      {CHECKS.map((c, i) => {
        const ok = i < passed;
        return (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: ok ? '#F0FDF4' : '#FAFAFB', border: `1px solid ${ok ? '#BBF7D0' : LINE}`, transition: 'background .25s, border-color .25s' }}>
            <motion.span animate={ok ? { scale: [0.6, 1.15, 1] } : { scale: 1 }} transition={{ duration: 0.35 }} style={{ display: 'flex' }}>
              <CheckCircle2 size={18} color={ok ? GREEN : '#D4D4D8'} />
            </motion.span>
            <span style={{ fontSize: 14, fontWeight: 500, color: ok ? INK : MUTED }}>{c}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 4. Livrer : mise en production et remise des clés ─── */
function ShipIllustration({ t }: { t: MotionValue<number> }) {
  const deploy = useTransform(t, v => `${clamp01((v - 0.05) / 0.5) * 100}%`);
  const live = useStepped(t, v => (v >= 0.55 ? 1 : 0)) === 1;
  const keys = useStepped(t, v => Math.round(clamp01((v - 0.55) / 0.35) * 3));
  const rocketY = useTransform(t, [0.45, 0.6], [0, -16]);
  return (
    <div style={{ ...board, padding: 22, display: 'grid', alignContent: 'start', gap: 16 }}>
      <div style={{ borderRadius: 14, border: `1px solid ${LINE}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FAFAFB', borderBottom: `1px solid ${LINE}` }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
          <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: MUTED }}><Globe size={13} /> votre-produit.com</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: live ? GREEN : FAINT }}>
            <span className={live ? 'mvp-pulse' : undefined} style={{ width: 8, height: 8, borderRadius: '50%', background: live ? GREEN : '#D4D4D8' }} /> {live ? 'En ligne' : 'Déploiement…'}
          </span>
        </div>
        <div style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <motion.span style={{ y: rocketY, width: 46, height: 46, borderRadius: 14, background: live ? INK : '#F4F4F5', color: live ? '#fff' : MUTED, display: 'grid', placeItems: 'center', transition: 'background .3s' }}><Rocket size={22} /></motion.span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>Mise en production sur vos comptes</p>
            <div style={{ height: 6, borderRadius: 6, background: '#F1F1F3', overflow: 'hidden' }}><motion.div style={{ height: '100%', width: deploy, background: ACCENT }} /></div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: FAINT, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}><KeyRound size={13} /> REMIS À VOTRE NOM</p>
      {['Code source', 'Comptes et accès d\'hébergement', 'Landing page de lancement (format 30 jours)'].map((k, i) => {
        const ok = i < keys;
        return (
          <motion.div key={k} animate={ok ? { opacity: 1, x: 0 } : { opacity: 0.35, x: 8 }} transition={{ duration: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500 }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: ok ? '#DCFCE7' : '#F4F4F5', color: GREEN, display: 'grid', placeItems: 'center' }}>{ok && <Check size={13} strokeWidth={3} />}</span>
            {k}
          </motion.div>
        );
      })}
    </div>
  );
}

const ILLUSTRATIONS = [FrameIllustration, BuildIllustration, TestIllustration, ShipIllustration];

function PhasePanel({ index, t, wide }: { index: number; t: MotionValue<number>; wide: boolean }) {
  const phase = PHASES[index];
  const Illustration = ILLUSTRATIONS[index];
  return (
    <article style={{ display: 'grid', gridTemplateColumns: wide ? 'minmax(260px, 0.8fr) minmax(0, 1.2fr)' : '1fr', gap: wide ? 'clamp(28px, 4vw, 56px)' : 22, alignItems: 'center', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: FAINT, fontVariantNumeric: 'tabular-nums' }}>{String(index + 1).padStart(2, '0')}</span>
          <span style={{ height: 1, width: 40, background: LINE }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>{phase.days}</span>
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: wide ? 'clamp(2.4rem, 4.2vw, 3.8rem)' : 'clamp(2rem, 9vw, 2.6rem)', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.035em', marginBottom: 14 }}>{phase.verb}</h3>
        <p style={{ fontSize: 14, fontWeight: 600, color: ACCENT_INK, marginBottom: 10 }}>{phase.title}</p>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: MUTED, maxWidth: 420 }}>{phase.desc}</p>
      </div>
      <div style={{ height: wide ? 'min(440px, 52vh)' : 380 }}>
        <Illustration t={t} />
      </div>
    </article>
  );
}

// Seuil (en phase) à partir duquel la section est épinglée : la piste démarre à -START_PHASE.
const START_PHASE = 0.85;

function PinnedPanel({ index, phase }: { index: number; phase: MotionValue<number> }) {
  // `phase` vaut i quand la phase i est en place ; son illustration se joue en y arrivant.
  const scrubbed = useTransform(phase, v => clamp01((v - index + 0.5) / 0.8));
  // La 1re phase se joue toute seule, en entier, dès que la section s'épingle (pendant la pause
  // de départ, la rangée ne bouge pas) : liée au scroll, elle restait à moitié triée si on
  // s'arrêtait en arrivant. Elle se rejoue si on remonte au-dessus de la section.
  const played = useMotionValue(0);
  const playing = useRef<ReturnType<typeof animate> | null>(null);
  useMotionValueEvent(phase, 'change', v => {
    if (index !== 0) return;
    if (v > -START_PHASE + 0.01 && !playing.current) playing.current = animate(played, 1, { duration: 2.8, ease: 'easeInOut' });
    else if (v <= -START_PHASE && playing.current) { playing.current.stop(); playing.current = null; played.set(0); }
  });
  useEffect(() => () => playing.current?.stop(), []);
  // Pas d'atténuation de la 1re phase pendant la pause de départ (phase négative) : elle est en place.
  const opacity = useTransform(phase, v => 1 - Math.min(0.6, Math.abs(index === 0 ? Math.max(0, v) : v - index) * 0.6));
  return (
    <motion.div style={{ flex: '0 0 auto', width: 'min(1100px, 78vw)', height: '100%', opacity }}>
      <PhasePanel index={index} t={index === 0 ? played : scrubbed} wide />
    </motion.div>
  );
}

function StackedPanel({ index, reduced }: { index: number; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const t = useMotionValue(reduced ? 1 : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(t, 1, { duration: 2.2, ease: 'easeInOut' });
    return () => controls.stop();
  }, [inView, reduced, t]);
  return <div ref={ref}><PhasePanel index={index} t={t} wide={false} /></div>;
}

export default function MethodScroll() {
  const pinned = usePinned();
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const progress = useTrackProgress(trackRef, pinned);
  // Pause au début et à la fin de la piste : la 1re illustration se joue avant que la rangée
  // ne glisse, la dernière reste à l'écran avant de rendre la main.
  const last = PHASES.length - 1;
  const phase = useTransform(progress, v => ((v - 0.2) / 0.7) * last);
  // Fin de la frise horizontale : la dernière phase est en place.
  useCrossing(progress, 0.92, 0.75, sfx.arrive);
  const x = useTransform(phase, v => -clamp01(v / last) * distance);
  const bar = useTransform(phase, v => `${clamp01(v / last) * 100}%`);
  const current = useStepped(phase, v => Math.min(last, Math.max(0, Math.round(v))));
  // Déclic quand une nouvelle phase arrive au centre (pas au montage).
  const shownPhase = useRef(current);
  useEffect(() => {
    if (shownPhase.current !== current) sfx.step();
    shownPhase.current = current;
  }, [current]);

  // Distance horizontale à parcourir : largeur de la rangée moins la largeur visible.
  useEffect(() => {
    if (!pinned) return;
    const row = rowRef.current;
    if (!row) return;
    const measure = () => setDistance(Math.max(0, row.scrollWidth - (row.parentElement?.clientWidth ?? window.innerWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [pinned]);

  const heading = (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: FAINT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>La méthode Ozirus</p>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.04, letterSpacing: '-0.03em', color: INK }}>
        Cadrer, construire, <span style={{ color: FAINT }}>tester, livrer.</span>
      </h2>
      <p style={{ fontSize: 15.5, lineHeight: 1.6, color: MUTED, marginTop: 10, maxWidth: 560 }}>Quatre phases et une version testable tous les 2 jours. Voici le déroulé du format 30 jours.</p>
    </div>
  );

  if (pinned) {
    return (
      <section id="methode" aria-label="La méthode Ozirus" style={{ position: 'relative', borderTop: `1px solid ${LINE}` }}>
        <div ref={trackRef} style={{ position: 'relative', height: `${100 + PHASES.length * 75}vh` }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #FCFCFC 0%, #F6F5FB 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, padding: '56px max(32px, 6vw) 0' }}>
              {heading}
              <div style={{ display: 'flex', gap: 8 }} aria-hidden>
                {PHASES.map((p, i) => (
                  <span key={p.verb} style={{ padding: '7px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: i === current ? INK : '#fff', color: i === current ? '#fff' : MUTED, border: `1px solid ${i === current ? INK : LINE}`, transition: 'background .25s, color .25s' }}>{p.verb}</span>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
              <motion.div ref={rowRef} style={{ x, display: 'flex', gap: '6vw', padding: '0 max(32px, 6vw)', height: 'min(460px, 56vh)', width: 'max-content' }}>
                {PHASES.map((p, i) => <PinnedPanel key={p.verb} index={i} phase={phase} />)}
              </motion.div>
            </div>
            <div aria-hidden style={{ height: 3, margin: '0 max(32px, 6vw) 32px', borderRadius: 3, background: 'rgba(14,14,16,0.08)', overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', width: bar, background: INK }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="methode" aria-label="La méthode Ozirus" style={{ position: 'relative', padding: '88px 20px', borderTop: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 760, margin: '0 auto 48px' }}>{heading}</div>
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 72 }}>
        {PHASES.map((p, i) => <StackedPanel key={p.verb} index={i} reduced={reduced} />)}
      </div>
    </section>
  );
}
