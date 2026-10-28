'use client';

// Cadres d'appareils de la landing MVP (repris de l'ancienne maquette du hero) : MacBook Pro 14",
// iPhone et écran de bureau. Ils sont dessinés en pixels « design » puis mis à l'échelle de leur
// conteneur par useFitBox : les proportions réelles des appareils restent justes à toute largeur.

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from './theme';

export function useFitBox(ref: React.RefObject<HTMLDivElement | null>, designW: number, designH: number) {
  const [box, setBox] = useState({ scale: 0, width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / designW, height ? height / designH : Infinity);
      setBox({ scale: Number.isFinite(scale) ? scale : 0, width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, designW, designH]);
  return box;
}

/* ─── MacBook Pro 14" ─────────────────────────────── */
export const MACBOOK_W = 1260;
export const MACBOOK_H = 870;

// Dalle 3024×1964 (≈ 1,54), bordures fines, encoche, base aluminium. `play` ouvre le capot.
export function MacBookPro14({ play, delay = 0, children }: { play: boolean; delay?: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: MACBOOK_W, perspective: 2200, perspectiveOrigin: '50% 100%' }}>
      <motion.div
        initial={{ rotateX: -84 }}
        animate={play ? { rotateX: 0 } : {}}
        transition={{ duration: 1.4, ease: EASE, delay }}
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
            transition={{ duration: 0.7, ease: 'easeOut', delay: delay + 1 }}
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

/* ─── iPhone ──────────────────────────────────────── */
export const PHONE_W = 238;
export const PHONE_H = Math.round(PHONE_W * 163.4 / 78);
// Écran : cadre métal 3 px + bordure noire 6 px de chaque côté. Le contenu de l'écran est rendu à
// la taille réelle d'un iPhone 15 (393 × 852 pt ; 1 px CSS = 1 pt), puis réduit d'un bloc par une
// transform : le navigateur choisit ainsi la même coupe optique de SF Pro qu'iOS (Display à partir
// de 20 pt, Text en dessous). Rendu en petit, un titre de 34 pt tomberait en SF Pro Text.
const PHONE_BEZEL = 6;
const SCREEN_INSET = 3 + PHONE_BEZEL;
const SCREEN_RADIUS_PX = 35;
const IOS_SCALE = (PHONE_W - 2 * SCREEN_INSET) / 393;
// Cotes de l'écran, en points iOS.
export const SCREEN_W = 393;
export const SCREEN_H = (PHONE_H - 2 * SCREEN_INSET) / IOS_SCALE;
export const SCREEN_RADIUS = SCREEN_RADIUS_PX / IOS_SCALE;
const ISLAND = { w: 126, h: 37, top: 11 };
export const SAFE_TOP = 54;
/** Filet iOS : épaissi pour rester visible une fois l'appareil réduit. */
export const HAIRLINE = 0.5 / IOS_SCALE;

// SF Pro, chargée par app/mvp/layout.tsx : la police d'iOS sur tous les appareils, pas seulement Apple.
export const SF = 'var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif';
export const SF_MONO = 'var(--font-sf-mono), ui-monospace, monospace';

// Couleurs système iOS (mode clair).
export const IOS = {
  label: '#000000',
  secondary: 'rgba(60,60,67,0.6)',
  tertiary: 'rgba(60,60,67,0.3)',
  separator: 'rgba(60,60,67,0.29)',
  groupedBg: '#F2F2F7',
  green: '#34C759',
} as const;

// Échelle typographique iOS, Dynamic Type « Large » par défaut : [taille, interligne, graisse,
// tracking] en pt, d'après les tableaux de la HIG « Typography ».
const TYPE = {
  largeTitle: [34, 41, 700, 0.4],
  title2: [22, 28, 700, -0.26],
  title3: [20, 25, 600, -0.45],
  headline: [17, 22, 600, -0.43],
  body: [17, 22, 400, -0.43],
  subheadline: [15, 20, 400, -0.23],
  footnote: [13, 18, 400, -0.08],
  caption1: [12, 16, 400, 0],
  tabLabel: [10, 12, 600, 0.12],
} as const;
export type IOSTextStyle = keyof typeof TYPE;

export function iosType(style: IOSTextStyle, weight?: number): React.CSSProperties {
  const [size, line, w, track] = TYPE[style];
  return { fontSize: size, lineHeight: `${line}px`, fontWeight: weight ?? w, letterSpacing: `${(track / size).toFixed(4)}em` };
}

// Icônes de la barre d'état (réseau 18×12, Wi-Fi 16×12, batterie 27×13 pt) en SVG pour rester nettes.
function StatusIcons({ color }: { color: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <svg width={18} height={12} viewBox="0 0 18 12" aria-hidden>
        {[0, 1, 2, 3].map(i => <rect key={i} x={i * 5} y={7.5 - i * 2.5} width="3" height={4.5 + i * 2.5} rx="1" fill={color} />)}
      </svg>
      <svg width={16} height={12.3} viewBox="0 0 13 10" aria-hidden>
        <path d="M6.5 2.2c1.9 0 3.6.7 4.9 1.9l1-1A8.3 8.3 0 0 0 6.5.7 8.3 8.3 0 0 0 .6 3.1l1 1a6.9 6.9 0 0 1 4.9-1.9Z" fill={color} />
        <path d="M6.5 5.1c1.1 0 2.1.4 2.9 1.1l1-1A5.6 5.6 0 0 0 6.5 3.6c-1.5 0-2.9.6-3.9 1.6l1 1a4.1 4.1 0 0 1 2.9-1.1Z" fill={color} />
        <path d="M6.5 6.6c-.6 0-1.2.2-1.6.7L6.5 9l1.6-1.7a2.3 2.3 0 0 0-1.6-.7Z" fill={color} />
      </svg>
      <svg width={27} height={13} viewBox="0 0 22 11" aria-hidden>
        <rect x="0.6" y="0.6" width="18.6" height="9.8" rx="3" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1.1" />
        <rect x="2.2" y="2.2" width="13.4" height="6.6" rx="1.6" fill={color} />
        <path d="M20.4 3.7v3.6c.8-.3 1.2-1 1.2-1.8s-.4-1.5-1.2-1.8Z" fill={color} fillOpacity="0.45" />
      </svg>
    </span>
  );
}

// Barre d'état posée en haut de l'écran : heure (17 pt semi-gras) centrée dans l'« oreille » gauche,
// icônes dans la droite, l'une et l'autre alignées sur le centre de l'île. `tone="light"` sur un
// fond sombre, comme le style `.lightContent` d'iOS.
export function IOSStatusBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const color = tone === 'light' ? '#fff' : IOS.label;
  const ear: React.CSSProperties = { flex: 1, height: ISLAND.h, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SAFE_TOP, display: 'flex', alignItems: 'flex-start', paddingTop: ISLAND.top, color, zIndex: 4, pointerEvents: 'none' }}>
      <span style={{ ...ear, ...iosType('headline'), fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ width: ISLAND.w, flexShrink: 0 }} />
      <span style={ear}><StatusIcons color={color} /></span>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div aria-hidden style={{ position: 'absolute', top: ISLAND.top, left: '50%', width: ISLAND.w, height: ISLAND.h, marginLeft: -ISLAND.w / 2, borderRadius: ISLAND.h, background: '#000', zIndex: 5 }}>
      {/* lentille de la caméra frontale, côté droit de l'île */}
      <span style={{ position: 'absolute', right: ISLAND.h * 0.32, top: '50%', width: ISLAND.h * 0.42, height: ISLAND.h * 0.42, marginTop: -ISLAND.h * 0.21, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #2B3350, #0A0B10 65%)' }} />
    </div>
  );
}

export function IPhone({ children }: { children: React.ReactNode }) {
  const btn = (side: 'left' | 'right', top: number, h: number) => (
    <span aria-hidden style={{ position: 'absolute', [side]: -4, top, width: 5, height: h, borderRadius: side === 'left' ? '3px 0 0 3px' : '0 3px 3px 0', background: 'linear-gradient(180deg, #C9CBD1, #8B8D94)' }} />
  );
  return (
    <div style={{ position: 'relative', width: PHONE_W, height: PHONE_H, borderRadius: 44, padding: 3, background: 'linear-gradient(90deg, #8E9097, #E4E5E9 30%, #B9BBC2 60%, #7C7E85)', boxShadow: '0 50px 90px -20px rgba(16,16,20,0.4), 0 18px 30px -12px rgba(16,16,20,0.25)' }}>
      {btn('left', 128, 26)}
      {btn('left', 178, 50)}
      {btn('left', 240, 50)}
      {btn('right', 196, 78)}
      <div style={{ width: '100%', height: '100%', borderRadius: 41, padding: PHONE_BEZEL, background: '#050506' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: SCREEN_RADIUS_PX, overflow: 'hidden', background: '#fff' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: SCREEN_W, height: SCREEN_H, transform: `scale(${IOS_SCALE})`, transformOrigin: '0 0', fontFamily: SF, WebkitFontSmoothing: 'antialiased' }}>
          {children}
          <DynamicIsland />
          {/* indicateur d'accueil : 134×5 pt à 8 pt du bas ; la différence le rend clair sur fond
              sombre et sombre sur fond clair, comme sur iOS */}
          <span aria-hidden style={{ position: 'absolute', bottom: 8, left: '50%', width: 134, height: 5, marginLeft: -134 / 2, borderRadius: 5, background: '#fff', mixBlendMode: 'difference', zIndex: 5 }} />
          </div>
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 35%)', zIndex: 6 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── écran de bureau ─────────────────────────────── */
export const MONITOR_W = 1200;
export const MONITOR_H = 880;

// Écran externe 16:10 sur pied : l'application de bureau y tourne dans une fenêtre native.
export function DesktopMonitor({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: MONITOR_W, height: MONITOR_H }}>
      <div style={{ position: 'relative', width: MONITOR_W, height: 750, borderRadius: 22, padding: 18, background: 'linear-gradient(180deg, #D9DBE0, #BFC2C9)', boxShadow: 'inset 0 1px 0 #fff, 0 40px 80px -24px rgba(16,16,20,0.35)' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', background: '#0B0B0D', boxShadow: 'inset 0 0 0 2px #0B0B0D' }}>
          {children}
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 40%)' }} />
        </div>
      </div>
      {/* pied aluminium */}
      <div aria-hidden style={{ width: 220, height: 96, margin: '0 auto', background: 'linear-gradient(90deg, #A9ACB4, #E2E4E8 45%, #B7BAC1)', clipPath: 'polygon(14% 0, 86% 0, 100% 100%, 0 100%)' }} />
      <div aria-hidden style={{ width: 300, height: 12, margin: '0 auto', borderRadius: 6, background: 'linear-gradient(180deg, #E4E6EA, #A9ACB4)', boxShadow: '0 14px 22px -8px rgba(16,16,20,0.35)' }} />
    </div>
  );
}
