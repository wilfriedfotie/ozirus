'use client';

// Sound design de la landing MVP : sons d'interface très courts, synthétisés en Web Audio (aucun
// fichier à télécharger, donc rien de plus à charger en faible débit).
// - Rien ne sonne avant le premier geste du visiteur (clic, touche) : les navigateurs l'imposent,
//   et on ne surprend personne à l'arrivée.
// - Un interrupteur « Son » dans le header coupe tout ; le choix est mémorisé dans le navigateur.

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { MotionValue } from 'framer-motion';

const STORAGE_KEY = 'ozirus_mvp_sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let unlocked = false;
let enabled = true;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  try { enabled = window.localStorage.getItem(STORAGE_KEY) !== 'off'; } catch { /* stockage indisponible */ }
  // Le premier geste du visiteur déverrouille l'audio (politique d'autoplay des navigateurs).
  const unlock = () => {
    unlocked = true;
    getContext()?.resume().catch(() => {});
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.7;
    // Un léger passe-bas arrondit les aigus : les sons restent doux, jamais stridents.
    const soften = ctx.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = 5200;
    master.connect(soften).connect(ctx.destination);
  }
  return ctx;
}

function ready() {
  if (!enabled || !unlocked) return null;
  const c = getContext();
  if (!c || !master) return null;
  if (c.state === 'suspended') c.resume().catch(() => {});
  return c;
}

/** Note courte : oscillateur avec attaque rapide et extinction exponentielle. */
function tone(freq: number, { at = 0, dur = 0.09, gain = 0.05, type = 'sine' as OscillatorType, slideTo }: { at?: number; dur?: number; gain?: number; type?: OscillatorType; slideTo?: number } = {}) {
  const c = ready();
  if (!c || !master) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** Souffle : bruit filtré dont la fréquence glisse (vers l'aigu en descendant, l'inverse en remontant). */
function whoosh(direction: 1 | -1, dur = 0.42, gain = 0.045) {
  const c = ready();
  if (!c || !master) return;
  const t = c.currentTime;
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.4;
  const [from, to] = direction > 0 ? [380, 1700] : [1700, 380];
  band.frequency.setValueAtTime(from, t);
  band.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(band).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

let lastHover = 0;
let lastArrive = 0;
let lastJump = 0;

export const sfx = {
  /** Survol d'un élément choisissable (limité pour ne pas crépiter). */
  hover() {
    const now = performance.now();
    if (now - lastHover < 90) return;
    lastHover = now;
    tone(1750, { dur: 0.035, gain: 0.018, slideTo: 1450 });
  },
  /** Sélection franche (choix d'un produit). */
  select() {
    tone(660, { dur: 0.1, gain: 0.05, type: 'triangle' });
    tone(990, { at: 0.07, dur: 0.14, gain: 0.045, type: 'triangle' });
  },
  /** Passage d'une étape à l'autre (démo produit, méthode). */
  step() {
    tone(1180, { dur: 0.05, gain: 0.03, slideTo: 980 });
  },
  /** Saut entre deux blocs de la page. */
  jump(direction: 1 | -1) {
    lastJump = performance.now();
    whoosh(direction);
  },
  /** Ouverture d'un panneau (modale de réservation, retour à l'écran de choix). */
  open() {
    tone(520, { dur: 0.12, gain: 0.045, slideTo: 820 });
  },
  /** Fin d'un saut de bloc : on « se pose » (note grave et brève, avec un léger appui). */
  land() {
    // Un seul son de fin par saut : si une séquence est arrivée à son terme pendant ce saut (ou
    // juste avant), son carillon suffit.
    if (lastArrive >= lastJump - 300) return;
    tone(196, { dur: 0.16, gain: 0.05, slideTo: 165 });
    tone(392, { dur: 0.06, gain: 0.018 });
  },
  /** Une séquence du scroll arrive à son terme (vidéo en grand, écran bleu, fin de la méthode…). */
  arrive() {
    lastArrive = performance.now();
    tone(880, { dur: 0.32, gain: 0.03 });
    tone(1318.5, { at: 0.06, dur: 0.38, gain: 0.022 });
  },
  /** Réservation confirmée. */
  success() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { at: i * 0.075, dur: 0.22, gain: 0.04 }));
  },
};

/* ─── interrupteur ─────────────────────────────────── */
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try { window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off'); } catch { /* stockage indisponible */ }
  listeners.forEach(cb => cb());
  if (next) { unlocked = true; sfx.step(); } // retour sonore immédiat quand on réactive
}

/** État de l'interrupteur, partagé entre composants (désactivé côté serveur pour un rendu stable). */
export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, () => enabled, () => false);
}

/**
 * Joue `play` quand `value` franchit `on` (dans le sens indiqué), une seule fois : il faut repasser
 * au-delà de `off` pour réarmer. Évite qu'un son se répète quand on oscille autour d'un seuil.
 */
export function useCrossing(value: MotionValue<number>, on: number, off: number, play: () => void) {
  const armed = useRef(true);
  const playRef = useRef(play);
  playRef.current = play;
  useEffect(() => {
    const rising = on >= off;
    armed.current = rising ? value.get() < on : value.get() > on;
    return value.on('change', v => {
      const reached = rising ? v >= on : v <= on;
      const reset = rising ? v <= off : v >= off;
      if (armed.current && reached) { armed.current = false; playRef.current(); }
      else if (!armed.current && reset) armed.current = true;
    });
  }, [value, on, off]);
}
