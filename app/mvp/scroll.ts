'use client';

// Primitives des séquences pilotées au scroll de la landing MVP (vidéo, Product Experience,
// méthode). La progression est lue directement dans la position de la section à chaque scroll :
// juste au montage (page rechargée au milieu d'une section) comme pendant un défilement Lenis.

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useMotionValueEvent, type MotionValue } from 'framer-motion';

export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return match;
}

/** Séquences épinglées : grand écran, assez haut, et mouvement non réduit. */
export const PIN_QUERY = '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Progression 0 → 1 d'une piste épinglée : 0 quand son haut atteint le haut de l'écran,
 * 1 quand son bas atteint le bas de l'écran.
 */
export function useTrackProgress(ref: React.RefObject<HTMLElement | null>, enabled: boolean): MotionValue<number> {
  const progress = useMotionValue(0);
  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      progress.set(range > 0 ? clamp01(-el.getBoundingClientRect().top / range) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref, enabled, progress]);
  return progress;
}

/** Position de scroll (px) qui amène une piste épinglée à la progression `p`. */
export function trackScrollY(el: HTMLElement, p: number) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  return top + (el.offsetHeight - window.innerHeight) * p;
}

/**
 * Valeur React qui suit un MotionValue, mise à jour seulement quand le résultat de `map` change.
 * La mise à jour passe par une microtâche : un useTransform recalculé pendant le rendu d'un
 * parent émet « change » à ce moment-là, et un setState synchrone y serait interdit par React.
 */
export function useStepped(mv: MotionValue<number>, map: (v: number) => number) {
  const [value, setValue] = useState(() => map(mv.get()));
  const last = useRef(value);
  useMotionValueEvent(mv, 'change', v => {
    const next = map(v);
    if (next === last.current) return;
    last.current = next;
    queueMicrotask(() => setValue(next));
  });
  return value;
}

type NetworkInfo = { saveData?: boolean; effectiveType?: string };
const connection = () => (typeof navigator === 'undefined' ? undefined : (navigator as Navigator & { connection?: NetworkInfo }).connection);

/**
 * Connexion à économiser absolument : mode « économie de données » du navigateur, ou vraie 2G
 * (Network Information API, Chrome / Android). La landing passe alors en version légère : pas
 * d'épinglage, pas de Lenis, pas de scroll par blocs, pas de préchargement.
 * La « 3g » n'en fait pas partie : Chrome l'annonce dès que la latence dépasse ~300 ms, y compris
 * sur des connexions tout à fait correctes, et l'expérience complète y reste fluide.
 */
export function isLiteNetwork() {
  const c = connection();
  return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? '');
}

/** Connexion modeste (3G ou moins, ou économie de données) : on évite seulement les préchargements. */
export function isSlowNetwork() {
  const c = connection();
  return isLiteNetwork() || c?.effectiveType === '3g';
}

/** Séquences épinglées actives : grand écran, mouvement non réduit, et connexion non bridée. */
export function usePinned() {
  const pinQuery = useMedia(PIN_QUERY);
  const [lite, setLite] = useState(false);
  useEffect(() => setLite(isLiteNetwork()), []);
  return pinQuery && !lite;
}
