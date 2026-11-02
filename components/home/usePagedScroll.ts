'use client';

/**
 * Défilement « page par page » de la home sur grand écran : chaque geste (molette, trackpad,
 * clavier) amène pile sur la page suivante ou précédente (`[data-page]`). Une page plus haute
 * que l'écran a deux arrêts (son haut, puis son bas). La page active est remontée dès le
 * départ du saut, pour que la couleur de fond change pendant le mouvement.
 * Désactivé sur petit écran, en mouvement réduit et quand une modale bloque le scroll.
 * Même principe que `useBlockSnap` de la landing MVP (app/mvp/page.tsx), en générique.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { PIN_QUERY, isLiteNetwork } from '@/app/mvp/scroll';

const NAV = 64; // hauteur du header sticky

type Stop = { y: number; page: number };

/**
 * `navOffset` : hauteur réservée en haut de chaque page (header sticky de la home, 64px).
 * Une landing dont le header flotte au-dessus des pages (`/cdc`) passe 0 : chaque page
 * occupe alors tout l'écran.
 */
export function usePagedScroll({ navOffset = NAV }: { navOffset?: number } = {}) {
  const [active, setActive] = useState(0);
  const [paged, setPaged] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const jumping = useRef(false); // vrai pendant un saut : la page active est déjà fixée

  // Mode paginé (classe sur <html>, lue par le CSS) + Lenis.
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    let raf = 0;
    const start = () => {
      const on = mq.matches && !isLiteNetwork();
      setPaged(on);
      document.documentElement.classList.toggle('ozh-paged', on);
      if (on && !lenisRef.current) {
        const lenis = new Lenis({ duration: 1, smoothWheel: true });
        lenisRef.current = lenis;
        const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      } else if (!on && lenisRef.current) {
        cancelAnimationFrame(raf);
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
    start();
    mq.addEventListener('change', start);
    return () => {
      mq.removeEventListener('change', start);
      cancelAnimationFrame(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('ozh-paged');
    };
  }, []);

  // Page active d'après la position (tous écrans) : celle qui occupe le milieu de l'écran.
  useEffect(() => {
    const update = () => {
      const pages = Array.from(document.querySelectorAll<HTMLElement>('[data-page]'));
      const mid = window.innerHeight * 0.5;
      let found = 0;
      pages.forEach((p, i) => { if (p.getBoundingClientRect().top <= mid) found = i; });
      setActive(prev => (jumping.current ? prev : found));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Sauts de page.
  useEffect(() => {
    if (!paged) return;
    let draining = false;
    let drainTimer = 0;
    let safety = 0;
    let acc = 0;
    let accAt = 0;
    let floor = Infinity;

    const stops = (): Stop[] => {
      const vh = window.innerHeight;
      const out: Stop[] = [];
      document.querySelectorAll<HTMLElement>('[data-page]').forEach((el, page) => {
        // Chaque page commence juste sous le header sticky (la 1re démarre donc à 0).
        const top = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - navOffset));
        out.push({ y: top, page });
        const extra = el.offsetHeight + navOffset - vh;
        if (extra > 40) out.push({ y: top + extra, page });
      });
      const max = document.documentElement.scrollHeight - vh;
      return out.map(s => ({ ...s, y: Math.min(s.y, max) })).sort((a, b) => a.y - b.y);
    };

    const drain = () => {
      draining = true;
      window.clearTimeout(drainTimer);
      drainTimer = window.setTimeout(() => { draining = false; }, 180);
    };

    const blocked = () => document.body.style.overflow === 'hidden';

    const jump = (dir: 1 | -1) => {
      const lenis = lenisRef.current;
      if (!lenis || blocked()) return false;
      const y = window.scrollY;
      const list = stops();
      const target = dir > 0 ? list.find(s => s.y > y + 4) : [...list].reverse().find(s => s.y < y - 4);
      if (!target) return false;
      jumping.current = true;
      setActive(target.page);
      window.clearTimeout(safety);
      safety = window.setTimeout(() => { jumping.current = false; }, 1600);
      lenis.scrollTo(target.y, {
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        lock: true,
        force: true,
        onComplete: () => { jumping.current = false; window.clearTimeout(safety); drain(); },
      });
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (blocked()) return;
      if (e.target instanceof Element && e.target.closest('[data-free-scroll]')) return;
      const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (d === 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      e.stopPropagation();
      const abs = Math.abs(d);
      if (jumping.current) { floor = Math.min(floor, abs); return; }
      if (draining) {
        const fresh = abs >= 10 && abs > floor * 2.5;
        floor = Math.min(floor, abs);
        if (!fresh) { drain(); return; }
        draining = false;
      }
      floor = Infinity;
      const dir: 1 | -1 = d > 0 ? 1 : -1;
      const now = performance.now();
      if (now - accAt > 250 || Math.sign(acc) !== dir) acc = 0;
      acc += d;
      accAt = now;
      if (Math.abs(acc) < 6) return;
      acc = 0;
      jump(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      if (el instanceof Element && el.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], [role="region"]')) return;
      const down = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
      const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (!down && !up) return;
      if (jumping.current) { e.preventDefault(); return; }
      if (jump(down ? 1 : -1)) e.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(drainTimer);
      window.clearTimeout(safety);
    };
  }, [paged, navOffset]);

  /** Aller à une page (index) : saut animé en mode paginé, scroll natif sinon. */
  const goTo = useCallback((page: number) => {
    const el = document.querySelectorAll<HTMLElement>('[data-page]')[page];
    if (!el) return;
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
    if (lenisRef.current) {
      jumping.current = true;
      setActive(page);
      lenisRef.current.scrollTo(y, { duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4), lock: true, force: true, onComplete: () => { jumping.current = false; } });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [navOffset]);

  return { active, paged, goTo };
}
