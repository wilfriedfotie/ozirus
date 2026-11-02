'use client';

/**
 * Ozirus OS en stepper (section Produits de la home). Le visiteur avance étape par étape ; un seul
 * appareil est montré à la fois : l'iPhone (Liquid Glass) pour ce que vit le client, une fenêtre
 * macOS pour ce que voit le commerçant dans Ozirus OS.
 *   1. commande sur le canal du client (on s'adapte : WhatsApp, Instagram, Facebook, site)
 *   2. paiement en un clic       3. tous les modules (lanceur, fenêtre macOS)
 *   4. commandes reçues (fenêtre) 5. l'IA notifie et fait les rapports (fenêtre)   6. le client revient
 * Côté logiciel, animations volontairement minimales : seuls les changements d'état de l'histoire bougent.
 * Contenus par secteur : osData.ts + sectorStory.ts. DA : voir C ci-dessous (aucun dégradé).
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  Store,
  ChevronsUpDown,
  Plus,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';
import { IPhone, PHONE_W, PHONE_H } from '@/app/mvp/devices';
import { CHANNELS, SECTORS, channelById, formatMoney, type ChannelId, type Sector } from './osData';
import { STORY } from './sectorStory';
import ChannelPhone from './ChannelPhone';

/* Direction artistique Ozirus OS : logiciel sobre, niveau international.
   DM Sans (interface) + Clash Display (titres, chiffres) ; primaire #7967FF seul accent ;
   neutres zinc ; couleurs d'état réservées aux statuts ; aucun dégradé. */
const C = {
  ink: '#18181B',
  muted: '#71717A',
  faint: '#A1A1AA',
  line: '#E4E4E7',
  panel: '#FAFAFA',
  violet: '#7967FF',
  tint: '#F4F2FF',
  green: '#16A34A',
  amber: '#D97706',
  red: '#DC2626',
};
const DISPLAY = 'var(--font-display-loaded), var(--font-sans-loaded), sans-serif';
const SANS = 'var(--font-sans-loaded), sans-serif';

type Device = 'phone' | 'mac';
const STEPS: { title: string; body: string; device: Device }[] = [
  { title: 'Le client commande', body: 'Sur WhatsApp, Instagram, Facebook ou votre site : on s’adapte. L’IA lui répond.', device: 'phone' },
  { title: 'Il paie', body: 'Mobile Money ou carte, dans la conversation.', device: 'phone' },
  { title: 'Tout votre business, un seul outil', body: 'Ventes, stock, finance, rendez-vous, RH… On active les modules dont vous avez besoin.', device: 'mac' },
  { title: 'Vous recevez tout', body: 'Commandes et paiements arrivent dans Ozirus OS.', device: 'mac' },
  { title: 'L’IA vous prévient', body: 'Stock bas, clients à relancer, paiements : l’IA vous notifie et prépare vos rapports.', device: 'mac' },
  { title: 'Il revient', body: 'Points et offres de fidélité envoyés automatiquement.', device: 'phone' },
];

const LAST = STEPS.length - 1;
const SOCIAL: ChannelId[] = ['whatsapp', 'instagram', 'facebook', 'web'];

export default function OsStepper({ sectorId, business, intro }: { sectorId: string; business?: string; intro?: React.ReactNode }) {
  const base = SECTORS.find(s => s.id === sectorId) ?? SECTORS[0];
  // secteur du carrousel sans données propres : données du secteur proche, nom de commerce à lui
  const sector = business ? { ...base, business } : base;
  const [step, setStep] = useState(0);
  const [channel, setChannel] = useState<ChannelId>('whatsapp');
  useEffect(() => setStep(0), [sectorId, business]);

  const device = STEPS[step].device;
  const go = (i: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
  // mobile : balayer l'appareil pour changer d'étape
  const [touchX, setTouchX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(step + (dx < 0 ? 1 : -1));
    setTouchX(null);
  };

  return (
    <div className="ozh-step">
      {/* appareil : très grand, il déborde de l'écran à gauche (et le téléphone sort par le bas) */}
      <div className="ozh-step-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait">
            {device === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="ozh-step-phone"
              >
                <div style={{ width: PHONE_W, height: PHONE_H, transform: 'scale(var(--phone-scale))', transformOrigin: 'top left' }}>
                  <IPhone>
                    <ChannelPhone sector={sector} channel={channel} step={step} last={LAST} />
                  </IPhone>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mac"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="ozh-step-mac"
              >
                {/* orientation 3D : côté gauche (barre latérale) vers le visiteur */}
                <div className="ozh-step-3d">
                  <Scaled w={SCREEN_W} h={SCREEN_H}>
                    <Bezel>
                      <MacScreen sector={sector} channel={channel} step={step} onOpen={go} />
                    </Bezel>
                  </Scaled>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* intro + étapes */}
      <div className="ozh-step-side">
      {intro && <div className="ozh-step-intro">{intro}</div>}
      <ol className="ozh-step-list">
        {STEPS.map((s, i) => {
          const active = i === step;
          return (
            <li key={s.title} data-active={active ? '' : undefined} data-done={i < step ? '' : undefined}>
              <button onClick={() => go(i)} aria-current={active ? 'step' : undefined} className="ozh-step-head">
                <span className="ozh-step-n">{i < step ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                <span className="ozh-step-title">{s.title}</span>
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="ozh-step-body">
                      <p>{s.body}</p>
                      {i === 0 && (
                        <div className="ozh-chips" role="group" aria-label="Canal du client">
                          {SOCIAL.map(id => {
                            const ch = channelById(id);
                            return (
                              <button key={id} onClick={() => setChannel(id)} aria-pressed={channel === id} className="ozh-chip">
                                <span style={{ width: 7, height: 7, borderRadius: 99, background: ch.color }} />
                                {ch.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <div className="ozh-step-nav">
          <button onClick={() => go(step - 1)} disabled={step === 0} aria-label="Étape précédente"><ArrowLeft size={16} /></button>
          <span className="ozh-step-count">
            Étape {step + 1} / {STEPS.length}
          </span>
          {/* mobile : progression compacte (la liste n'affiche que l'étape active) */}
          <span className="ozh-step-dots" role="group" aria-label="Étapes">
            {STEPS.map((s, i) => (
              <button key={s.title} onClick={() => go(i)} aria-label={`Étape ${i + 1} : ${s.title}`} aria-current={i === step ? 'step' : undefined} data-done={i < step ? '' : undefined} />
            ))}
          </span>
          <button onClick={() => go(step + 1)} disabled={step === STEPS.length - 1} aria-label="Étape suivante" data-primary>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}

/** Contenu dessiné en pixels « design », mis à la largeur de son conteneur. */
function Scaled({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [el, w]);
  return (
    <div ref={setEl} style={{ position: 'relative', width: '100%', aspectRatio: `${w} / ${h}` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left', opacity: scale ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
}

/** Vrai après `ms` : laisse une animation d'entrée se jouer avant la suivante. */
function useAfter(ms: number, key: unknown) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    const id = window.setTimeout(() => setOn(true), ms);
    return () => window.clearTimeout(id);
  }, [ms, key]);
  return on;
}

/* ═══ iPhone : ce que vit le client — UI de la plateforme choisie, voir ChannelPhone.tsx ═══ */

/* ═══ Fenêtre macOS : Ozirus OS côté commerçant (noir et blanc) ═══ */

/** Vrai logo Ozirus (public/ozirus-mark.png, l'icône du favicon) sur une tuile d'application.
    `mono` : logo passé en noir pour le logiciel en noir et blanc. */
function Mark({ size, mono }: { size: number; mono?: boolean }) {
  return (
    <span style={{ width: size, height: size, borderRadius: size * 0.26, flexShrink: 0, background: '#fff', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)', display: 'grid', placeItems: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ozirus-mark.png" alt="Ozirus" style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain', filter: mono ? 'brightness(0)' : undefined }} />
    </span>
  );
}

/* Palette du logiciel : noir et blanc (fond blanc, texte et boutons noirs, gris neutres) ; aucune
   couleur, même pour les statuts. */
const D = {
  bg: '#FFFFFF',
  panel: '#FAFAFA',
  raised: '#F4F4F5',
  line: '#E4E4E7',
  ink: '#0A0A0A',
  muted: '#71717A',
  faint: '#A1A1AA',
  violet: '#0A0A0A', // accent = noir (boutons, élément actif)
  tint: '#F4F4F5', // élément actif / ligne mise en avant
  green: '#0A0A0A', // « Payé » : noir
  amber: '#71717A', // en attente : gris
  red: '#0A0A0A', // niveau bas : noir (signalé par le libellé)
};

/* ═══ Écran logiciel : tableau de bord Ozirus OS ═══
   Référence visée : dashboard SaaS « premium » (barre latérale riche, cartes de chiffres avec
   graphiques en points, prévision, transactions). Base blanche et neutre, de la couleur pour ce qui
   compte : primaire Ozirus (boutons, actif), une couleur par module, statuts colorés, graphiques.
   Dessiné en APP_W × APP_H puis mis à l'échelle. */
const APP_W = 1120;
const APP_H = 760;
const BEZEL = 16;
const SCREEN_W = APP_W + BEZEL * 2;
const SCREEN_H = APP_H + BEZEL * 2;
const V = { dot: '#7967FF', dot2: '#F97316', dot3: '#FACC15', off: '#ECECEE', up: '#16A34A', down: '#DC2626' };

/** Écran à bordure noire (encoche), comme une dalle de MacBook vue de près. */
function Bezel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: SCREEN_W, height: SCREEN_H, borderRadius: 30, padding: BEZEL, background: '#0B0B0D', boxShadow: 'inset 0 0 0 1.5px #3A3A3F, 0 50px 100px -30px rgba(16,16,20,0.45)' }}>
      <div style={{ position: 'relative', width: APP_W, height: APP_H, borderRadius: 14, overflow: 'hidden', background: D.bg }}>
        {children}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(115deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 40%)' }} />
      </div>
      <div aria-hidden style={{ position: 'absolute', top: BEZEL, left: '50%', width: 170, height: 26, marginLeft: -85, borderRadius: '0 0 12px 12px', background: '#0B0B0D' }} />
    </div>
  );
}

const P = '#7967FF'; // primaire Ozirus : boutons, élément actif, graphiques
const MENU: { group: string | null; items: [string, string, string | null][] }[] = [
  { group: null, items: [['dashboard', 'Tableau de bord', null]] },
  { group: 'Ventes', items: [['pos', 'Point de vente', '6'], ['payments', 'Paiements', null], ['site', 'Mon site', null]] },
  { group: 'Clients', items: [['crm', 'Relation client', null], ['loyalty', 'Fidélité', null], ['booking', 'Rendez-vous', null], ['social', 'Réseaux sociaux', null], ['ai', 'Agent IA', null]] },
  { group: 'Gestion', items: [['stock', 'Stock', null], ['inventory', 'Inventaire', null], ['suppliers', 'Fournisseurs', null], ['services', 'Prestations', null]] },
  { group: 'Finance', items: [['finance', 'Finance', null], ['accounting', 'Comptabilité', null], ['journal', 'Journal', null]] },
  { group: 'Équipe', items: [['hr', 'Ressources humaines', null], ['settings', 'Paramètres', null]] },
];

function MacScreen({ sector, channel, step, onOpen }: { sector: Sector; channel: ChannelId; step: number; onOpen: (i: number) => void }) {
  if (step === 2) return <Launcher sector={sector} onOpen={onOpen} />;
  const view = step === 4 ? 'ai' : 'dashboard';
  return (
    <div style={{ position: 'relative', width: APP_W, height: APP_H, display: 'flex', fontFamily: SANS, fontSize: 13, color: D.ink, background: '#FBFBFB' }}>
      <Sidebar sector={sector} active={view} />
      <main style={{ flex: 1, minWidth: 0, padding: '30px 28px 0', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {view === 'dashboard' ? <Dashboard sector={sector} channel={channel} /> : <AiPage sector={sector} />}
        </motion.div>
      </main>
    </div>
  );
}

function Sidebar({ sector, active }: { sector: Sector; active: string }) {
  return (
    <aside style={{ width: 228, flexShrink: 0, padding: '18px 12px 12px', background: '#fff', borderRight: `1px solid ${D.line}`, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px', marginBottom: 12 }}>
        <Mark size={26} />
        <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600 }}>Ozirus</span>
        <span style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: 6, border: `1px solid ${D.line}`, display: 'grid', placeItems: 'center', color: D.muted }}><ChevronLeft size={12} /></span>
      </div>
      {/* sélecteur d'espace */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: D.raised, marginBottom: 6 }}>
        <Store size={15} />
        <span style={{ fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sector.business}</span>
        <ChevronsUpDown size={14} color={D.muted} />
      </div>
      {MENU.map(sec => (
        <div key={sec.group ?? 'home'}>
          {sec.group && <div style={{ padding: '8px 10px 2px', fontSize: 11, fontWeight: 600, color: D.faint }}>{sec.group}</div>}
          {sec.items.map(([id, label, badge]) => {
            const on = id === active;
            return (
              <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px', borderRadius: 8, fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? D.ink : '#3F3F46', background: on ? '#F1EFFF' : 'transparent' }}>
                <ModuleGlyph id={id} size={17} /> {label}
                {badge && <span style={{ marginLeft: 'auto', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 99, background: P, color: '#fff', fontSize: 10.5, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{badge}</span>}
              </span>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

/** Graphique en barres de points (une colonne de points par valeur). */
function DotBars({ values, rows = 10, color, size = 4, gap = 3 }: { values: number[]; rows?: number; color: string; size?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', gap, alignItems: 'flex-end' }}>
      {values.map((v, c) => (
        <div key={c} style={{ display: 'flex', flexDirection: 'column-reverse', gap }}>
          {Array.from({ length: rows }, (_, r) => (
            <span key={r} style={{ width: size, height: size, borderRadius: 9, background: r < v ? color : 'transparent' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Delta({ v, up = true }: { v: string; up?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: up ? V.up : V.down }}>
      {up ? '▲' : '▼'} {v}
      <span style={{ color: D.muted, fontWeight: 500, marginLeft: 3 }}>vs semaine dernière</span>
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: '#fff', border: `1px solid ${D.line}`, borderRadius: 16, padding: 18, ...style }}>{children}</div>;
}

function CardTitle({ icon, tint, children, right }: { icon?: React.ReactNode; tint?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 600 }}>
      {icon && <span style={{ width: 28, height: 28, borderRadius: 8, background: tint ?? D.raised, display: 'grid', placeItems: 'center' }}>{icon}</span>}
      {children}
      {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
    </div>
  );
}

const WEEK = [5, 7, 4, 8, 6, 9, 7, 10, 6, 8, 9, 7, 10, 8, 9, 6, 8, 10];
const PENDING = [3, 2, 4, 3, 5, 2, 3, 4, 2, 3, 4, 3];

function Dashboard({ sector, channel }: { sector: Sector; channel: ChannelId }) {
  const owner = sector.business.replace(/^(Chez |Studio |Boutique |Clinique |Académie )/, '');
  const amount = sector.events.find(e => e.amount)?.amount ?? 25;
  const t = sector.thread;
  const paid = useAfter(1200, sector.id);
  const month = sector.baseRevenue * 1.6;
  const rows = [
    { id: '#2481', name: t.name, product: sector.thread.msgs[0].text.split(/[,.?!]/)[0].slice(0, 26), qty: 1, amount, ch: channel, fresh: true },
    ...sector.contacts.filter(c => c.name !== t.name).slice(0, 2).map((c, i) => ({ id: `#${2480 - i}`, name: c.name, product: STORY[sector.id].stock.items[i + 1].name, qty: i + 2, amount: Math.max(15, Math.round(c.value / 6)), ch: c.channel, fresh: false })),
  ];
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>Bon retour, {owner}</div>
          <div style={{ fontSize: 12.5, color: D.muted, marginTop: 4 }}>Mis à jour il y a 30 s</div>
        </div>
        <span style={{ marginLeft: 'auto', height: 34, padding: '0 14px', borderRadius: 10, background: P, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600 }}><Plus size={14} /> Nouvelle vente</span>
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFEDD5', color: '#C2410C', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{owner.charAt(0)}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 14 }}>
        <Card>
          <CardTitle icon={<ShoppingBag size={14} color="#F97316" />} tint="#FFF1E6" right={<ArrowUpRight size={15} color={D.muted} />}>Commandes cette semaine</CardTitle>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 600, lineHeight: 1 }}>{paid ? 313 : 312}</div>
              <div style={{ marginTop: 8 }}><Delta v="12,4 %" /></div>
            </div>
            <DotBars values={WEEK} color={V.dot} />
          </div>
        </Card>
        <Card>
          <CardTitle icon={<Clock size={14} color="#D97706" />} tint="#FEF3C7">En attente de paiement</CardTitle>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 600, lineHeight: 1 }}>{paid ? 3 : 4}</div>
              <div style={{ marginTop: 8 }}><Delta v="2,1 %" up={false} /></div>
            </div>
            <DotBars values={PENDING} color="#F97316" />
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle
          right={<span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: '#FFF1E6', color: '#C2410C' }}>Objectif atteint <b>91 %</b></span>
            <span style={{ display: 'flex', borderRadius: 8, border: `1px solid ${D.line}`, overflow: 'hidden', fontSize: 11.5 }}>
              {['Jour', 'Semaine', 'Mois'].map((x, i) => <span key={x} style={{ padding: '4px 9px', background: i === 2 ? P : '#fff', color: i === 2 ? '#fff' : D.muted, fontWeight: 600 }}>{x}</span>)}
            </span>
          </span>}
        >
          Prévision du chiffre d’affaires
        </CardTitle>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 600 }}>{formatMoney(month, 'XAF')}</span>
          <Delta v="8,2 %" />
        </div>
        <Forecast />
      </Card>

      <Card style={{ padding: '16px 0 4px' }}>
        <div style={{ padding: '0 18px 10px' }}><CardTitle>Transactions récentes</CardTitle></div>
        <div style={{ display: 'flex', padding: '8px 18px', fontSize: 12, color: D.muted, fontWeight: 500, borderTop: `1px solid ${D.line}`, borderBottom: `1px solid ${D.line}`, background: D.panel }}>
          <span style={{ width: 70 }}>ID</span><span style={{ flex: 1.2 }}>Client</span><span style={{ flex: 1.4 }}>Produit</span><span style={{ width: 50 }}>Qté</span><span style={{ width: 120 }}>Montant</span><span style={{ width: 90 }}>Statut</span>
        </div>
        {rows.map(row => (
          <motion.div
            key={row.id}
            initial={row.fresh ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', padding: '9px 18px', borderBottom: `1px solid ${D.line}`, background: row.fresh ? D.panel : '#fff' }}
          >
            <span style={{ width: 70, color: D.muted, fontWeight: 500 }}>{row.id}</span>
            <span style={{ flex: 1.2, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: channelById(row.ch).soft, color: channelById(row.ch).color, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>{row.name.charAt(0)}</span>
              {row.name}
              {row.fresh && <span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: '#F1EFFF', color: P }}>Nouveau</span>}
            </span>
            <span style={{ flex: 1.4, display: 'flex', alignItems: 'center', gap: 8, color: '#3F3F46', minWidth: 0 }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: ['#FFEDD5', '#DCFCE7', '#E0E7FF'][rows.indexOf(row) % 3], flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.product}</span>
            </span>
            <span style={{ width: 50 }}>{row.qty}</span>
            <span style={{ width: 120, fontWeight: 600 }}>{formatMoney(row.amount, 'XAF')}</span>
            <span style={{ width: 90 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 99, ...(!row.fresh || paid ? { background: '#DCFCE7', color: '#15803D' } : { background: '#FEF3C7', color: '#B45309' }) }}>
                {!row.fresh || paid ? <><Check size={12} /> Payé</> : <><Clock size={12} /> En attente</>}
              </span>
            </span>
          </motion.div>
        ))}
      </Card>
    </>
  );
}

/** Prévision en matrice de points : passé plein (3 tons de violet), futur en gris, repère « aujourd'hui ». */
function Forecast() {
  const cols = 46;
  const rows = 9;
  const today = 26;
  const height = (c: number) => Math.round(4 + 3.2 * Math.sin(c / 6) + c / 12);
  return (
    <div style={{ position: 'relative', marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: cols }, (_, c) => {
          const h = Math.min(rows, height(c));
          return (
            <div key={c} style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4 }}>
              {Array.from({ length: rows }, (_, r) => {
                const on = r < h;
                const past = c < today;
                const color = !on ? 'transparent' : !past ? V.off : r >= h - 2 ? V.dot : r >= h - 4 ? V.dot2 : V.dot3;
                return <span key={r} style={{ width: 6, height: 6, borderRadius: 9, background: color }} />;
              })}
            </div>
          );
        })}
      </div>
      <span style={{ position: 'absolute', left: today * 10 - 3, top: -6, bottom: -4, width: 1.5, background: D.ink }} />
      <span style={{ position: 'absolute', right: 0, top: -30, display: 'flex', gap: 12, fontSize: 11.5, color: D.muted }}>
        {[['Au-dessus de l’objectif', V.dot], ['Dans l’objectif', V.dot2], ['En dessous', V.dot3]].map(([l, c]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 9, background: c }} />{l}</span>)}
      </span>
      <span style={{ position: 'absolute', left: today * 10 + 10, top: 4, fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: '#fff', border: `1px solid ${D.line}` }}>+16 % projeté</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: D.muted }}>
        <span>1 nov.</span><span style={{ color: D.ink, fontWeight: 600 }}>Aujourd’hui</span><span>30 nov.</span>
      </div>
    </div>
  );
}

/** Assistant IA (étape 5) : il rédige le rapport de la semaine sous les yeux du visiteur, prépare
    les décisions à valider en un clic et pousse les alertes en direct (fil + notification macOS).
    Chronologie : rapport tapé (~2,6 s) ; alertes à 0,6 / 1,6 / 2,6 s ; la 1re décision est validée
    à 4 s. Données simulées, adaptées au secteur. */
const AI_T = { feed: [600, 1600, 2600], toast: 2600, toastOut: 6200, approve: 4000 };

function useTicker(total: number, ms: number, key: unknown) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const v = Math.min(total, Math.round(((t - start) / ms) * total));
      setN(v);
      if (v < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, ms, key]);
  return n;
}

function AiPage({ sector }: { sector: Sector }) {
  const story = STORY[sector.id];
  const item = story.stock.items[0];
  const seg = sector.loyalty.segments[0];
  const amount = sector.events.find(e => e.amount)?.amount ?? 25;
  const owner = sector.business.replace(/^(Chez |Studio |Boutique |Clinique |Académie )/, '');
  const week = Math.round((sector.baseRevenue * 1.3) / 4);

  // rapport rédigé : segments (gras = chiffres clés), révélés caractère par caractère
  const report: [string, boolean?][] = [
    [`Bonjour ${owner}, très bonne semaine : `],
    [`${formatMoney(week, 'XAF')} de ventes`, true],
    [' (+12,4 %). WhatsApp reste votre meilleur canal avec '],
    ['48 % des ventes', true],
    ['. Point de vigilance : '],
    [`${item.name.toLowerCase()} en rupture dans 2 jours`, true],
    ['. J’ai préparé 3 actions pour vous.'],
  ];
  const total = report.reduce((n, [t]) => n + t.length, 0);
  const typed = useTicker(total, 2600, sector.id);
  const feedN = [useAfter(AI_T.feed[0], sector.id), useAfter(AI_T.feed[1], sector.id), useAfter(AI_T.feed[2], sector.id)].filter(Boolean).length;
  const toastIn = useAfter(AI_T.toast, sector.id);
  const toastOut = useAfter(AI_T.toastOut, sector.id);
  const approved = useAfter(AI_T.approve, sector.id);

  let left = typed;
  const shown = report.map(([t, bold], i) => {
    const part = t.slice(0, Math.max(0, left));
    left -= t.length;
    return part ? <span key={i} style={bold ? { fontWeight: 700, color: D.ink, background: '#F1EFFF', borderRadius: 4, padding: '0 3px' } : undefined}>{part}</span> : null;
  });

  const kpis: { label: string; value: string; delta: string; color: string; bars: number[] }[] = [
    { label: 'Ventes', value: formatMoney(week, 'XAF'), delta: '+12,4 %', color: P, bars: [4, 5, 4, 6, 5, 7, 8] },
    { label: `Nouveaux ${sector.people}`, value: '38', delta: '+9', color: MOD_COLOR.crm, bars: [3, 4, 6, 4, 5, 6, 7] },
    { label: 'Réponses IA', value: '412', delta: '< 5 s', color: MOD_COLOR.ai, bars: [5, 6, 5, 7, 6, 8, 8] },
  ];

  const decisions = [
    { mod: 'stock', title: `Commander 20 × ${item.name}`, sub: 'Bon de commande prêt · fournisseur habituel', cta: 'Valider', done: 'Envoyé au fournisseur' },
    { mod: 'loyalty', title: `Relancer ${seg.count} ${sector.people}`, sub: `${seg.label} · ${seg.action}`, cta: 'Envoyer', done: '' },
    { mod: 'social', title: sector.posts[0].title, sub: 'Rédigé par l’IA · meilleur créneau : jeudi 19 h', cta: 'Programmer', done: '' },
  ];

  const feed = [
    { mod: 'payments', title: 'Paiement reçu', body: `${formatMoney(amount, 'XAF')} · Mobile Money`, tag: 'WhatsApp' },
    { mod: 'loyalty', title: `${seg.count} ${sector.people} à relancer`, body: seg.action, tag: 'Fidélité' },
    { mod: 'stock', title: 'Rupture dans 2 jours', body: story.stock.alert, tag: 'Stock', hot: true },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12.5, color: D.muted, fontWeight: 500 }}>Lundi 3 novembre</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1, marginTop: 2 }}>Votre IA a travaillé cette nuit</div>
        </div>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 99, background: '#fff', border: `1px solid ${D.line}` }}>
          <motion.span animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: 9, background: V.up }} />
          Surveillance active · 24 h/24
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 14 }}>
        {/* ── rapport rédigé en direct ── */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ModuleGlyph id="ai" size={26} />
            <span style={{ fontSize: 14.5, fontWeight: 600 }}>Rapport de la semaine</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: '#F1EFFF', color: P }}>
              {typed < total ? 'L’IA rédige…' : 'Envoyé sur WhatsApp · 8:00'}
            </span>
          </div>
          <p style={{ margin: 0, padding: '12px 18px 0', minHeight: 92, fontSize: 15, lineHeight: 1.6, color: '#3F3F46' }}>
            {shown}
            {typed < total && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ display: 'inline-block', width: 2, height: 17, marginLeft: 2, verticalAlign: -3, background: P }} />}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', margin: '14px 18px 0', border: `1px solid ${D.line}`, borderRadius: 12 }}>
            {kpis.map((k, i) => (
              <div key={k.label} style={{ padding: '10px 12px', borderLeft: i ? `1px solid ${D.line}` : 'none', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: D.muted, whiteSpace: 'nowrap' }}>{k.label}</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>{k.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: V.up }}>{k.delta}</div>
                </div>
                <DotBars values={k.bars} rows={8} color={k.color} size={4} gap={2} />
              </div>
            ))}
          </div>

          {/* décisions préparées par l'IA */}
          <div style={{ padding: '16px 18px 6px', fontSize: 12, fontWeight: 600, color: D.faint, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prêt à valider</div>
          {decisions.map((d, i) => {
            const isDone = i === 0 && approved;
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: typed >= total || i === 0 ? 1 : 0.35, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 * i }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderTop: `1px solid ${D.line}`, background: isDone ? '#F0FDF4' : '#fff', transition: 'background .4s' }}
              >
                <span style={{ width: 34, height: 34, borderRadius: 10, background: MOD_COLOR[d.mod] + '1A', display: 'grid', placeItems: 'center', flexShrink: 0 }}><ModuleGlyph id={d.mod} size={20} /></span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: D.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.sub}</div>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.span key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: V.up, whiteSpace: 'nowrap' }}>
                      <Check size={14} strokeWidth={3} /> {d.done}
                    </motion.span>
                  ) : (
                    <motion.span key="cta" exit={{ opacity: 0, scale: 0.9 }} style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '7px 10px', borderRadius: 9, color: D.muted }}>Plus tard</span>
                      <motion.span
                        animate={i === 0 && typed >= total && !approved ? { scale: [1, 0.94, 1] } : {}}
                        transition={{ duration: 0.3, delay: 0.9 }}
                        style={{ fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 9, background: i === 0 ? P : '#fff', color: i === 0 ? '#fff' : D.ink, border: i === 0 ? `1px solid ${P}` : `1px solid ${D.line}` }}
                      >
                        {d.cta}
                      </motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </Card>

        {/* ── fil d'alertes en direct ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Card style={{ padding: '16px 0 4px' }}>
            <div style={{ padding: '0 18px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>En direct</span>
              <span style={{ marginLeft: 'auto', minWidth: 20, height: 20, padding: '0 6px', borderRadius: 99, background: P, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{feedN}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              <AnimatePresence initial={false}>
                {feed.slice(0, feedN).map(n => (
                  <motion.div
                    key={n.title}
                    layout
                    initial={{ opacity: 0, y: -14, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    style={{ overflow: 'hidden', borderTop: `1px solid ${D.line}`, background: n.hot ? '#FFFBEB' : '#fff' }}
                  >
                    <div style={{ display: 'flex', gap: 11, padding: '11px 18px' }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, background: MOD_COLOR[n.mod] + '1A', display: 'grid', placeItems: 'center', flexShrink: 0 }}><ModuleGlyph id={n.mod} size={18} /></span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 11, color: D.faint, whiteSpace: 'nowrap' }}>maintenant</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#52525B', marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
                        <span style={{ display: 'inline-block', marginTop: 6, fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 99, color: MOD_COLOR[n.mod], background: MOD_COLOR[n.mod] + '14' }}>{n.tag}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {feedN === 0 && <div style={{ padding: '18px', borderTop: `1px solid ${D.line}`, fontSize: 12.5, color: D.faint }}>L’IA analyse votre activité…</div>}
          </Card>

          {/* où l'IA prévient */}
          <Card style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>L’IA vous prévient sur</div>
            {[['WhatsApp', 'Alertes urgentes', '#25D366'], ['E-mail', 'Rapport chaque lundi', '#2563EB'], ['Ozirus OS', 'Tout, en temps réel', P]].map(([l, d, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ width: 8, height: 8, borderRadius: 9, background: c }} />
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{l}</span>
                <span style={{ fontSize: 12, color: D.muted }}>{d}</span>
                <span style={{ marginLeft: 'auto' }}><Toggle on /></span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* demander à l'IA : question posée, réponse chiffrée */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px 10px 14px', borderRadius: 14, background: '#fff', border: `1px solid ${D.line}` }}>
        <ModuleGlyph id="ai" size={20} />
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>« Que dois-je commander cette semaine ? »</span>
        <span style={{ fontSize: 12.5, color: D.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
          → 20 × {item.name.toLowerCase()} et {story.stock.items[1].name.toLowerCase()} : basé sur vos 8 dernières semaines.
        </span>
        <span style={{ width: 32, height: 32, borderRadius: 10, background: P, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><ArrowUpRight size={16} /></span>
      </div>

      {/* notification macOS : l'alerte urgente sort de l'appli */}
      <AnimatePresence>
        {toastIn && !toastOut && (
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ position: 'absolute', top: 14, right: 14, width: 340, padding: '12px 14px', borderRadius: 18, display: 'flex', gap: 11, zIndex: 10, background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 18px 40px -10px rgba(16,16,20,0.3)' }}
          >
            <Mark size={36} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 12.5, fontWeight: 700 }}>
                Ozirus OS<span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: D.muted }}>maintenant</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 1 }}>⚠️ {item.name} : rupture dans 2 jours</div>
              <div style={{ fontSize: 12, color: '#52525B', marginTop: 1 }}>Bon de commande prêt. Valider ?</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, padding: '6px 0', borderRadius: 8, background: 'rgba(0,0,0,0.06)' }}>Plus tard</span>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, padding: '6px 0', borderRadius: 8, background: P, color: '#fff' }}>Valider</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══ Modules : la page « Vos modules » d'Ozirus OS (étape 3) ═══
   Même langage que le tableau de bord : barre latérale + cartes blanches. Seuls les modules
   parlants sont montrés ; l'Agent IA s'active sous les yeux du visiteur. */
type ModuleDef = { id: string; label: string; desc: string; on: boolean; open?: number };
const MODULES: ModuleDef[] = [
  { id: 'pos', label: 'Point de vente', desc: 'Encaissez en boutique et en ligne', on: true, open: 3 },
  { id: 'stock', label: 'Stock', desc: 'Alerte avant chaque rupture', on: true },
  { id: 'payments', label: 'Paiements', desc: 'Mobile Money et carte', on: true },
  { id: 'crm', label: 'Relation client', desc: 'L’historique de chaque client', on: true },
  { id: 'booking', label: 'Rendez-vous', desc: 'Réservations sans un appel', on: false },
  { id: 'finance', label: 'Finance', desc: 'Recettes, dépenses et marge', on: true },
  { id: 'loyalty', label: 'Fidélité', desc: 'Points et offres automatiques', on: true, open: 5 },
  { id: 'ai', label: 'Agent IA', desc: 'Répond, relance et vous prévient', on: false, open: 4 },
];

/* Une couleur par module : tuile teintée + forme bicolore (ton plein et ton clair). */
const MOD_COLOR: Record<string, string> = {
  dashboard: '#7967FF', pos: '#F97316', finance: '#16A34A', stock: '#F59E0B', inventory: '#0D9488', journal: '#3B82F6',
  services: '#10B981', booking: '#6366F1', accounting: '#EA580C', crm: '#2563EB', hr: '#22C55E', suppliers: '#EC4899',
  payments: '#7967FF', site: '#0891B2', ai: '#8B5CF6', social: '#DB2777', loyalty: '#E11D48', settings: '#64748B',
};

function ModuleGlyph({ id, size = 34 }: { id: string; size?: number }) {
  const K = MOD_COLOR[id] ?? '#7967FF';
  const G = K + '73';
  const svg = (children: React.ReactNode) => <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden>{children}</svg>;
  switch (id) {
    case 'dashboard': return svg(<><circle cx="10" cy="10" r="6.5" fill={K} /><circle cx="24" cy="10" r="6.5" fill={G} /><circle cx="10" cy="24" r="6.5" fill={G} /><circle cx="24" cy="24" r="6.5" fill={K} /></>);
    case 'pos': return svg(<><rect x="4" y="6" width="26" height="8" rx="2" fill={K} /><path d="M6 14h4v14H6zM15 14h4v14h-4zM24 14h4v14h-4z" fill={G} /></>);
    case 'finance': return svg(<><path d="M5 8l11 9-11 9z" fill={G} /><path d="M29 6v22L16 17z" fill={K} /></>);
    case 'stock': return svg(<><path d="M9 6h16l4 9H5z" fill={K} /><path d="M7 17h20l-3 11H10z" fill={G} /></>);
    case 'inventory': return svg(<><circle cx="15" cy="19" r="10" fill="none" stroke={K} strokeWidth="5" /><path d="M19 4a11 11 0 0 1 11 11H19z" fill={G} /></>);
    case 'journal': return svg(<><path d="M6 5l13 12-13 12z" fill={K} /><path d="M17 9l12 8-12 8z" fill={G} /></>);
    case 'services': return svg(<><path d="M5 5h16a9 9 0 0 1 0 18H5z" fill={G} /><path d="M5 16h18a7 7 0 0 1 0 13H5z" fill={K} /></>);
    case 'booking': return svg(<><rect x="4" y="7" width="26" height="23" rx="5" fill={G} /><rect x="4" y="7" width="26" height="7" rx="3" fill={K} /><path d="M11 21l4 4 8-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>);
    case 'accounting': return svg(<><circle cx="11" cy="11" r="7" fill={K} /><circle cx="23" cy="11" r="7" fill="none" stroke={G} strokeWidth="4" /><circle cx="11" cy="23" r="7" fill="none" stroke={G} strokeWidth="4" /><circle cx="23" cy="23" r="7" fill={K} /></>);
    case 'crm': return svg(<><path d="M4 6l16 22H4z" fill={G} /><circle cx="21" cy="14" r="9" fill={K} /></>);
    case 'hr': return svg(<><circle cx="17" cy="12" r="7.5" fill={K} /><path d="M4 31a13 13 0 0 1 26 0z" fill={G} /></>);
    case 'suppliers': return svg(<><rect x="4" y="13" width="10" height="9" fill={G} /><path d="M14 5h12a6 6 0 0 1 0 12H14z" fill={K} /><path d="M18 17l9 12h-9z" fill={G} /></>);
    case 'payments': return svg(<><rect x="4" y="8" width="26" height="18" rx="4" fill={K} /><rect x="4" y="13" width="26" height="4" fill={G} /><rect x="8" y="20" width="8" height="3" rx="1.5" fill="#fff" /></>);
    case 'site': return svg(<><path d="M15 5a12 12 0 0 0 0 24z" fill={G} /><path d="M18 5a12 12 0 0 1 0 24z" fill={K} /></>);
    case 'ai': return svg(<path d="M17 3l3.5 10.5L31 17l-10.5 3.5L17 31l-3.5-10.5L3 17l10.5-3.5z" fill={K} />);
    case 'social': return svg(<><circle cx="9" cy="17" r="5" fill={G} /><circle cx="25" cy="8" r="5" fill={K} /><circle cx="25" cy="26" r="5" fill={K} /><path d="M9 17L25 8M9 17l16 9" stroke={K} strokeWidth="2.5" /></>);
    case 'loyalty': return svg(<><path d="M17 29S4 21 4 12.5A6.5 6.5 0 0 1 17 9a6.5 6.5 0 0 1 13 3.5C30 21 17 29 17 29z" fill={K} /><circle cx="24" cy="10" r="4" fill={G} /></>);
    case 'settings': return svg(<><path d="M17 4a13 13 0 0 1 13 13H17z" fill={K} /><path d="M17 30A13 13 0 0 1 4 17h13z" fill={K} /><path d="M4 17A13 13 0 0 1 17 4v13z" fill={G} /><path d="M30 17a13 13 0 0 1-13 13V17z" fill={G} /></>);
    default: return null;
  }
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span style={{ display: 'block', width: 34, height: 20, borderRadius: 99, padding: 2, boxSizing: 'border-box', background: on ? P : '#E4E4E7', transition: 'background .35s', flexShrink: 0 }}>
      <motion.span
        initial={false}
        animate={{ x: on ? 14 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)' }}
      />
    </span>
  );
}

function Launcher({ sector, onOpen }: { sector: Sector; onOpen: (i: number) => void }) {
  const aiOn = useAfter(1300, sector.id); // l'Agent IA s'active pendant que le visiteur regarde
  const isOn = (m: ModuleDef) => m.on || (m.id === 'ai' && aiOn);
  const count = MODULES.filter(isOn).length;
  return (
    <div style={{ width: APP_W, height: APP_H, display: 'flex', fontFamily: SANS, fontSize: 13, color: D.ink, background: '#FBFBFB' }}>
      <Sidebar sector={sector} active="settings" />
      <main style={{ flex: 1, minWidth: 0, padding: '30px 28px 0', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>Vos modules</div>
          <div style={{ fontSize: 12.5, color: D.muted, marginTop: 4 }}>
            <b style={{ color: D.ink, fontWeight: 600 }}>{count} actifs</b> sur {MODULES.length} · activez seulement ce qui vous sert
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {MODULES.map((m, i) => {
            const on = isOn(m);
            const can = m.open !== undefined;
            const justOn = m.id === 'ai' && aiOn;
            return (
              <motion.button
                key={m.id}
                type="button"
                className="ozh-modcard"
                data-open={can ? '' : undefined}
                onClick={() => can && onOpen(m.open!)}
                title={can ? `Ouvrir ${m.label}` : undefined}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, boxShadow: justOn ? `0 0 0 2px ${P}, 0 12px 28px -14px rgba(121,103,255,.6)` : '0 0 0 0 rgba(0,0,0,0)' }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '26px 22px', borderRadius: 18, font: 'inherit', color: 'inherit', textAlign: 'left', background: '#fff', border: `1px solid ${D.line}`, opacity: on ? 1 : 0.62 }}
              >
                <span style={{ width: 56, height: 56, borderRadius: 16, background: (MOD_COLOR[m.id] ?? P) + '14', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <ModuleGlyph id={m.id} size={30} />
                </span>
                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600 }}>
                    {m.label}
                    {justOn && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: '#F1EFFF', color: P }}>Activé</motion.span>}
                  </span>
                  <span style={{ display: 'block', fontSize: 13.5, color: D.muted, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.desc}</span>
                </span>
                <Toggle on={on} />
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
