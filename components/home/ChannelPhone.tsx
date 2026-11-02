'use client';

/**
 * Écran iPhone du stepper Ozirus OS (étapes « Le client commande », « Il paie », « Il revient ») :
 * l'interface prend celle de la plateforme choisie par le visiteur.
 *   - WhatsApp : vraie UI WhatsApp Business (fond papier peint, bulles vertes, coches bleues,
 *     message interactif → WhatsApp Flow en feuille, message « commande » + feuille de paiement,
 *     modèle fidélité avec bouton).
 *   - Instagram (DM), Facebook (Messenger), Site web (widget de chat) : leurs codes visuels.
 * Les couleurs de marque appartiennent aux plateformes imitées, pas à la DA Ozirus OS.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Camera,
  Check,
  CheckCheck,
  ChevronLeft,
  Ellipsis,
  Gift,
  Image as ImageIcon,
  ListChecks,
  Lock,
  Mic,
  Minus,
  Phone,
  Plus,
  SendHorizontal,
  ShoppingBag,
  Smile,
  Sparkles,
  Sticker,
  ThumbsUp,
  Video,
  X,
} from 'lucide-react';
import { IOSStatusBar, SAFE_TOP } from '@/app/mvp/devices';
import { formatMoney, type ChannelId, type Sector } from './osData';

const SANS = 'var(--font-sans-loaded), sans-serif';
const DISPLAY = 'var(--font-display-loaded), var(--font-sans-loaded), sans-serif';

/* Contenu du WhatsApp Flow et de la commande, par secteur. */
type FlowDef = { title: string; pick: [string, string]; slot: [string, string[]]; summary: string; line: string };
const FLOW: Record<string, FlowDef> = {
  commerce: { title: 'Votre commande', pick: ['Article', 'Robe wax bleue · taille M'], slot: ['Livraison', ['Demain avant 14 h', 'Retrait en boutique']], summary: 'Robe wax bleue (M) · livraison demain', line: 'Robe wax bleue (M)' },
  restaurant: { title: 'Votre réservation', pick: ['Table', 'Terrasse · 4 personnes'], slot: ['Heure', ['20 h 15', '21 h 00']], summary: 'Table pour 4 · 20 h 15 · poulet DG', line: 'Précommande poulet DG ×4' },
  beaute: { title: 'Votre rendez-vous', pick: ['Prestation', 'Knotless · avec Kelia'], slot: ['Samedi', ['9 h 00', '13 h 00']], summary: 'Knotless · samedi 9 h', line: 'Acompte knotless' },
  sante: { title: 'Votre consultation', pick: ['Médecin', 'Dr Mbarga · cardiologie'], slot: ['Jeudi', ['10 h 00', '15 h 30']], summary: 'Cardiologie · jeudi 10 h', line: 'Consultation cardiologie' },
  immobilier: { title: 'Votre visite', pick: ['Bien', '3 pièces · centre-ville'], slot: ['Demain', ['17 h 00', '18 h 30']], summary: 'Visite 3 pièces · demain 17 h', line: 'Frais de dossier visite' },
  formation: { title: 'Votre inscription', pick: ['Formation', 'Développement web · 3 mois'], slot: ['Séance d’essai', ['Samedi 10 h', 'Mercredi 18 h']], summary: 'Dev web · essai samedi 10 h', line: 'Inscription dev web (1er mois)' },
};

/** Nombre d'étapes d'animation écoulées depuis le dernier changement de `key`. */
function useStage(times: number[], key: string) {
  const [n, setN] = useState(0);
  const sig = times.join(',');
  useEffect(() => {
    setN(0);
    const ids = sig ? sig.split(',').map((t, i) => window.setTimeout(() => setN(i + 1), Number(t))) : [];
    return () => ids.forEach(id => window.clearTimeout(id));
  }, [key, sig]);
  return n;
}

export type PhoneProps = { sector: Sector; channel: ChannelId; step: number; last: number };

export default function ChannelPhone(props: PhoneProps) {
  return props.channel === 'whatsapp' ? <WhatsAppScreen {...props} /> : <ChatScreen {...props} />;
}

/** Timeline commune : ce qui est visible à chaque étape (0 = commande, 1 = paiement, last = fidélité). */
function useStory({ sector, channel, step, last }: PhoneProps) {
  const key = `${step}-${channel}-${sector.id}`;
  const live = step === 0;
  // étape 0 : réponse IA, 2e message client, message interactif, ouverture du Flow
  const a = useStage(live ? [1100, 2300, 3400, 4400] : [], key);
  // étape 1 : réponse du Flow + message IA, carte commande, feuille de paiement, succès, fermeture
  const b = useStage(step === 1 ? [500, 1300, 2200, 3600, 4600] : [], key);
  const c = useStage(step === last ? [500] : [], key);
  const done0 = !live;
  const done1 = step > 1;
  return {
    flow: FLOW[sector.id] ?? FLOW.commerce,
    amount: sector.events.find(e => e.amount)?.amount ?? 25,
    seg: sector.loyalty.segments[0],
    aiReply: done0 || a >= 1,
    client2: done0 || a >= 2,
    interactive: done0 || a >= 3,
    flowOpen: live && a >= 4,
    typing: live && (a === 0 || a === 2),
    // le client tape sa 2e réponse au clavier
    draft: live && a === 1 ? sector.thread.msgs[2]?.text ?? '' : '',
    response: step >= 1 && (done1 || b >= 1),
    order: step >= 1 && (done1 || b >= 2),
    paySheet: step === 1 && b >= 3 && b < 5,
    paySuccess: b >= 4,
    paid: done1 || b >= 4,
    loyalty: step === last && c >= 1,
  };
}

/* ═══════════════════════ WhatsApp ═══════════════════════ */

const WA = {
  bar: '#F6F6F6',
  wall: '#EFE7DE',
  out: '#D9FDD3',
  ink: '#111B21',
  meta: '#667781',
  tick: '#53BDEB',
  green: '#25D366',
  teal: '#008069',
  action: '#00A884',
};
const WALLPAPER = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="none" stroke="#C9BFAF" stroke-width="1.4" stroke-linecap="round" opacity="0.55"><circle cx="18" cy="20" r="6"/><path d="M60 12l6 10h-12z"/><path d="M96 18c4-6 12-6 14 0"/><rect x="14" y="62" width="12" height="9" rx="2"/><path d="M58 64c3 4 9 4 12 0"/><circle cx="100" cy="66" r="3"/><path d="M20 100l8 6M28 100l-8 6"/><path d="M62 98h12M68 92v12"/><path d="M94 104c3-5 9-5 12 0"/></svg>',
)}")`;
const TIME = '21:47';
const WA_BAR = 52;

function WhatsAppScreen(props: PhoneProps) {
  const { sector } = props;
  const s = useStory(props);
  const t = sector.thread;
  const sheet = s.flowOpen || s.paySheet;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: WA.wall, backgroundImage: WALLPAPER, color: WA.ink, fontFamily: SANS }}>
      {/* en-tête de conversation */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SAFE_TOP + 56, background: WA.bar, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8, padding: `${SAFE_TOP}px 14px 0 6px`, zIndex: 3 }}>
        <span style={{ display: 'flex', alignItems: 'center', color: WA.ink, fontSize: 16 }}><ChevronLeft size={30} strokeWidth={2.2} /><span style={{ marginLeft: -4 }}>12</span></span>
        <span style={{ width: 38, height: 38, borderRadius: '50%', background: WA.teal, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{sector.business.charAt(0)}</span>
        <span style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 16.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {sector.business}
            <BadgeCheck size={16} fill={WA.green} color="#fff" strokeWidth={2.2} />
          </span>
          <span style={{ display: 'block', fontSize: 12.5, color: s.typing ? WA.action : WA.meta }}>{s.typing ? 'écrit…' : 'Compte professionnel'}</span>
        </span>
        <Video size={24} strokeWidth={1.8} />
        <Phone size={21} strokeWidth={1.8} style={{ marginLeft: 14 }} />
      </div>

      {/* conversation, ancrée en bas comme dans l'app */}
      <div style={{ position: 'absolute', top: SAFE_TOP + 56, left: 0, right: 0, bottom: KB_H + WA_BAR, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 5, padding: '10px 12px' }}>
        <span style={{ alignSelf: 'center', background: '#fff', color: WA.meta, fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 8, boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)', marginBottom: 6 }}>Aujourd’hui</span>
        <span style={{ alignSelf: 'center', background: '#FFEECD', color: '#54656F', fontSize: 11.5, textAlign: 'center', lineHeight: 1.35, padding: '5px 10px', borderRadius: 8, maxWidth: '86%', marginBottom: 6 }}>
          <Lock size={10} style={{ verticalAlign: -1, marginRight: 3 }} />Ce compte professionnel utilise un assistant IA pour vous répondre.
        </span>
        <WaBubble me text={t.msgs[0].text} />
        {s.aiReply && <WaBubble text={t.msgs[1].text} ai />}
        {s.client2 && t.msgs[2] && <WaBubble me text={t.msgs[2].text} />}
        {s.interactive && (
          <WaBubble text={`Parfait ! Validez les détails de votre ${sector.deal} en 2 clics 👇`} ai buttons={[[ListChecks, `Finaliser ma ${sector.deal}`]]} />
        )}
        {s.response && (
          <WaBubble me>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: WA.teal, fontWeight: 600, marginBottom: 2 }}><ListChecks size={14} /> Réponse envoyée</span>
            {s.flow.summary}
          </WaBubble>
        )}
        {s.order && <WaOrder sector={sector} flow={s.flow} amount={s.amount} paid={s.paid} />}
        {s.loyalty && (
          <WaBubble ai buttons={[[Gift, 'Voir mes avantages']]}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 3 }}>🎁 +120 points fidélité</span>
            Merci pour votre {sector.deal} ! Votre avantage du moment : {props.sector.loyalty.segments[0].action.toLowerCase()}.
            <span style={{ display: 'block', fontSize: 12.5, color: WA.meta, marginTop: 4 }}>{sector.loyalty.program}</span>
          </WaBubble>
        )}
        {s.typing && <WaTyping />}
      </div>

      {/* barre de saisie, posée sur le clavier */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: KB_H, height: WA_BAR, background: WA.bar, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', zIndex: 3 }}>
        <Plus size={26} strokeWidth={1.8} />
        <span style={{ flex: 1, minWidth: 0, height: 36, borderRadius: 18, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px 0 12px', color: WA.meta }}>
          <Draft text={s.draft} />
          <Sticker size={20} strokeWidth={1.8} style={{ flexShrink: 0 }} />
        </span>
        {s.draft ? (
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: WA.action, color: '#fff', display: 'grid', placeItems: 'center' }}><SendHorizontal size={17} /></span>
        ) : (
          <>
            <Camera size={24} strokeWidth={1.8} />
            <Mic size={23} strokeWidth={1.8} />
          </>
        )}
      </div>
      <Keyboard />

      {/* voile + feuilles (WhatsApp Flow, paiement) */}
      <AnimatePresence>
        {sheet && (
          <motion.div key="veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 5 }} />
        )}
        {s.flowOpen && <WaFlowSheet key="flow" sector={sector} flow={s.flow} />}
        {s.paySheet && <WaPaySheet key="pay" sector={sector} amount={s.amount} success={s.paySuccess} />}
      </AnimatePresence>
      <IOSStatusBar />
    </div>
  );
}

type Btn = [React.ComponentType<{ size?: number; strokeWidth?: number }>, string];

function WaBubble({ text, me, ai, buttons, children }: { text?: string; me?: boolean; ai?: boolean; buttons?: Btn[]; children?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '80%', position: 'relative', flexShrink: 0 }}
    >
      <Tail me={me} />
      <div style={{ background: me ? WA.out : '#fff', borderRadius: 8, borderTopRightRadius: me ? 0 : 8, borderTopLeftRadius: me ? 8 : 0, boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)', overflow: 'hidden' }}>
        <div style={{ padding: '6px 9px 7px', fontSize: 15.5, lineHeight: 1.35 }}>
          {ai && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: WA.teal, marginBottom: 2 }}><Sparkles size={11} /> Assistant IA</span>}
          {children ?? text}
          <span style={{ float: 'right', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: WA.meta, margin: '8px 0 -4px 10px' }}>
            {TIME}
            {me && <CheckCheck size={15} color={WA.tick} strokeWidth={2.2} />}
          </span>
        </div>
        {buttons?.map(([Icon, label]) => (
          <div key={label} style={{ borderTop: '1px solid rgba(0,0,0,0.08)', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: WA.action, fontSize: 15, fontWeight: 600 }}>
            <Icon size={17} strokeWidth={2} /> {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/** Pointe de bulle WhatsApp (coin supérieur). */
function Tail({ me }: { me?: boolean }) {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" style={{ position: 'absolute', top: 0, [me ? 'right' : 'left']: -7, transform: me ? 'scaleX(-1)' : undefined }} aria-hidden>
      <path d="M8 0H1.5C0.3 0-0.3 1.4 0.5 2.3L8 11z" fill={me ? WA.out : '#fff'} />
    </svg>
  );
}

function WaTyping() {
  return (
    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '11px 13px', borderRadius: 8, borderTopLeftRadius: 0, background: '#fff', boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)', position: 'relative', flexShrink: 0 }}>
      <Tail />
      {[0, 1, 2].map(i => (
        <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} style={{ width: 7, height: 7, borderRadius: 99, background: WA.meta }} />
      ))}
    </div>
  );
}

/** Message « commande » de WhatsApp Business (order details), avec bouton de paiement. */
function WaOrder({ sector, flow, amount, paid }: { sector: Sector; flow: FlowDef; amount: number; paid: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ alignSelf: 'flex-start', width: '80%', position: 'relative', flexShrink: 0 }}
    >
      <Tail />
      <div style={{ background: '#fff', borderRadius: 8, borderTopLeftRadius: 0, boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)', overflow: 'hidden' }}>
        <div style={{ margin: 4, borderRadius: 6, background: '#F0F2F5', padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 44, height: 44, borderRadius: 6, background: '#fff', display: 'grid', placeItems: 'center', color: WA.teal }}><ShoppingBag size={22} /></span>
          <span style={{ lineHeight: 1.25, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600 }}>{flow.line}</span>
            <span style={{ display: 'block', fontSize: 12.5, color: WA.meta }}>1 article · {sector.business}</span>
          </span>
        </div>
        <div style={{ padding: '4px 10px 8px', fontSize: 14.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: WA.meta }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>{formatMoney(amount, 'XAF')}</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 600, color: paid ? WA.teal : '#B26B00' }}>{paid ? '✓ Payée · Mobile Money' : 'En attente de paiement'}</div>
          <span style={{ display: 'block', textAlign: 'right', fontSize: 11, color: WA.meta, marginTop: -2 }}>{TIME}</span>
        </div>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: WA.action, fontSize: 15, fontWeight: 600 }}>
          {paid ? 'Voir le reçu' : 'Revoir et payer'}
        </div>
      </div>
    </motion.div>
  );
}

const sheetMotion = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { type: 'spring' as const, stiffness: 300, damping: 34 },
};

function SheetHead({ title }: { title: string }) {
  return (
    <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
      <X size={22} />
      <span style={{ fontSize: 16, fontWeight: 600 }}>{title}</span>
      <Ellipsis size={22} />
    </div>
  );
}

/** WhatsApp Flow : formulaire natif ouvert en feuille depuis le message interactif. */
function WaFlowSheet({ sector, flow }: { sector: Sector; flow: FlowDef }) {
  const [slotLabel, slots] = flow.slot;
  return (
    <motion.div {...sheetMotion} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: SAFE_TOP + 10, background: '#fff', borderRadius: '14px 14px 0 0', zIndex: 6, display: 'flex', flexDirection: 'column' }}>
      <SheetHead title={sector.business} />
      <div style={{ padding: '18px 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{flow.title}</div>
          <div style={{ fontSize: 14, color: WA.meta, marginTop: 2 }}>Vérifiez puis confirmez, on s’occupe du reste.</div>
        </div>
        <Field label={flow.pick[0]}>
          <Option label={flow.pick[1]} selected />
        </Field>
        <Field label="Quantité">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 16, fontWeight: 600 }}>
            <span style={roundBtn}><Minus size={16} /></span>1<span style={roundBtn}><Plus size={16} /></span>
          </div>
        </Field>
        <Field label={slotLabel}>
          {slots.map((o, i) => <Option key={o} label={o} selected={i === 0} radio />)}
        </Field>
      </div>
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ height: 48, borderRadius: 24, background: WA.action, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 600 }}>Confirmer</div>
        <div style={{ textAlign: 'center', fontSize: 12, color: WA.meta, marginTop: 10 }}>
          Géré par {sector.business}. <span style={{ color: WA.action }}>En savoir plus</span>
        </div>
      </div>
    </motion.div>
  );
}

const roundBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)', display: 'grid', placeItems: 'center' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: WA.meta, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function Option({ label, selected, radio }: { label: string; selected?: boolean; radio?: boolean }) {
  return (
    <div style={{ height: 46, borderRadius: 10, border: `1.5px solid ${selected ? WA.action : 'rgba(0,0,0,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 15.5 }}>
      {label}
      {radio ? (
        <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? WA.action : '#B0B7BB'}`, display: 'grid', placeItems: 'center' }}>
          {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: WA.action }} />}
        </span>
      ) : (
        selected && <Check size={18} color={WA.action} strokeWidth={3} />
      )}
    </div>
  );
}

/** Feuille de paiement (Mobile Money) ouverte depuis « Revoir et payer ». */
function WaPaySheet({ sector, amount, success }: { sector: Sector; amount: number; success: boolean }) {
  const methods: [string, string, boolean][] = [['MTN Mobile Money', '#FFCC00', true], ['Orange Money', '#FF7900', false], ['Carte bancaire', '#1A1F71', false]];
  return (
    <motion.div {...sheetMotion} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 230, background: '#fff', borderRadius: '14px 14px 0 0', zIndex: 6, display: 'flex', flexDirection: 'column' }}>
      <SheetHead title="Paiement" />
      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 70 }}>
          <span style={{ width: 64, height: 64, borderRadius: '50%', background: WA.action, color: '#fff', display: 'grid', placeItems: 'center' }}><Check size={34} strokeWidth={3} /></span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Paiement réussi</span>
          <span style={{ fontSize: 14, color: WA.meta }}>{formatMoney(amount, 'XAF')} payés à {sector.business}</span>
        </motion.div>
      ) : (
        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, color: WA.meta }}>Montant à payer</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, marginBottom: 6 }}>{formatMoney(amount, 'XAF')}</div>
          {methods.map(([m, color, sel]) => (
            <div key={m} style={{ height: 46, borderRadius: 10, border: `1.5px solid ${sel ? WA.action : 'rgba(0,0,0,0.12)'}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 15 }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: color }} />
              <span style={{ flex: 1 }}>{m}</span>
              {sel && <Check size={18} color={WA.action} strokeWidth={3} />}
            </div>
          ))}
          <div style={{ marginTop: 10, height: 48, borderRadius: 24, background: WA.action, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 600 }}>Payer {formatMoney(amount, 'XAF')}</div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════ Instagram, Messenger, site web ═══════════════ */

type Skin = {
  bg: string;
  meBg: string;
  meInk: string;
  themBg: string;
  accent: string;
  radius: number;
  subtitle: (s: Sector) => string;
  header: 'light' | 'brand';
  input: 'instagram' | 'messenger' | 'web';
};
const slug = (b: string) => b.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '.');
const SKINS: Record<Exclude<ChannelId, 'whatsapp'>, Skin> = {
  instagram: { bg: '#fff', meBg: 'linear-gradient(160deg, #A033FF 0%, #6A4BFF 55%, #3797F0 100%)', meInk: '#fff', themBg: '#EFEFEF', accent: '#3797F0', radius: 22, subtitle: s => slug(s.business), header: 'light', input: 'instagram' },
  facebook: { bg: '#fff', meBg: '#0866FF', meInk: '#fff', themBg: '#F0F0F0', accent: '#0866FF', radius: 18, subtitle: () => 'En ligne', header: 'light', input: 'messenger' },
  tiktok: { bg: '#fff', meBg: '#FE2C55', meInk: '#fff', themBg: '#F1F1F2', accent: '#FE2C55', radius: 14, subtitle: s => `@${slug(s.business)}`, header: 'light', input: 'web' },
  web: { bg: '#F7F7FB', meBg: '#7967FF', meInk: '#fff', themBg: '#fff', accent: '#7967FF', radius: 18, subtitle: () => 'Chat du site · répond tout de suite', header: 'brand', input: 'web' },
};

function ChatScreen(props: PhoneProps) {
  const { sector } = props;
  const skin = SKINS[props.channel as Exclude<ChannelId, 'whatsapp'>] ?? SKINS.web;
  const s = useStory(props);
  const t = sector.thread;
  const brand = skin.header === 'brand';
  const dark = '#000';

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: skin.bg, color: dark, fontFamily: SANS }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SAFE_TOP + 58, padding: `${SAFE_TOP}px 16px 0 8px`, display: 'flex', alignItems: 'center', gap: 10, background: brand ? skin.accent : '#fff', color: brand ? '#fff' : dark, borderBottom: brand ? 'none' : '1px solid rgba(0,0,0,0.08)', zIndex: 3 }}>
        <ChevronLeft size={30} strokeWidth={2} color={brand || props.channel === 'instagram' ? undefined : skin.accent} />
        <span style={{ padding: props.channel === 'instagram' ? 2 : 0, borderRadius: '50%', background: props.channel === 'instagram' ? 'linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF)' : 'none', flexShrink: 0 }}>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: brand ? '#fff' : '#1C1C1E', color: brand ? skin.accent : '#fff', border: props.channel === 'instagram' ? '2px solid #fff' : 'none', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 15 }}>{sector.business.charAt(0)}</span>
        </span>
        <span style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {sector.business}
            {!brand && <BadgeCheck size={15} fill={skin.accent} color="#fff" strokeWidth={2.2} />}
          </span>
          <span style={{ display: 'block', fontSize: 12.5, opacity: brand ? 0.85 : 1, color: brand ? '#fff' : '#737373' }}>{s.typing ? 'écrit…' : skin.subtitle(sector)}</span>
        </span>
        {brand ? <X size={22} /> : (
          <>
            <Phone size={22} strokeWidth={1.9} color={props.channel === 'facebook' ? skin.accent : dark} />
            <Video size={25} strokeWidth={1.9} color={props.channel === 'facebook' ? skin.accent : dark} style={{ marginLeft: 12 }} />
          </>
        )}
      </div>

      <div style={{ position: 'absolute', top: SAFE_TOP + 58, left: 0, right: 0, bottom: KB_H + CHAT_BAR, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6, padding: '10px 14px' }}>
        <div style={{ alignSelf: 'center', fontSize: 12, color: '#8E8E93', fontWeight: 500, marginBottom: 4 }}>Aujourd’hui {TIME}</div>
        <ChatBubble skin={skin} me text={t.msgs[0].text} />
        {s.aiReply && <ChatBubble skin={skin} ai text={t.msgs[1].text} />}
        {s.client2 && t.msgs[2] && <ChatBubble skin={skin} me text={t.msgs[2].text} />}
        {s.order && t.msgs[3] && <ChatBubble skin={skin} ai text={t.msgs[3].text} />}
        {s.order && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ alignSelf: 'flex-start', width: '80%', background: '#fff', borderRadius: 20, padding: 14, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px rgba(16,16,20,0.06)', flexShrink: 0 }}
          >
            <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>{s.flow.line}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, margin: '2px 0 10px' }}>{formatMoney(s.amount, 'XAF')}</div>
            <div style={{ height: 44, borderRadius: 999, background: s.paid ? '#16A34A' : skin.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 600, transition: 'background .4s' }}>
              {s.paid ? <><Check size={17} strokeWidth={3} /> Payé</> : 'Payer avec Mobile Money'}
            </div>
          </motion.div>
        )}
        {s.loyalty && <ChatBubble skin={skin} ai text={`🎁 +120 points fidélité ! ${sector.loyalty.segments[0].action}.`} />}
        {s.typing && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '13px 15px', borderRadius: skin.radius, background: skin.themBg, flexShrink: 0 }}>
            {[0, 1, 2].map(i => (
              <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} style={{ width: 7, height: 7, borderRadius: 99, background: '#8E8E93' }} />
            ))}
          </div>
        )}
      </div>

      <ChatInput skin={skin} draft={s.draft} />
      <Keyboard />
      <IOSStatusBar tone={brand ? 'light' : 'dark'} />
    </div>
  );
}

function ChatBubble({ skin, text, me, ai }: { skin: Skin; text: string; me?: boolean; ai?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '78%', padding: '9px 14px', borderRadius: skin.radius, background: me ? skin.meBg : skin.themBg, color: me ? skin.meInk : '#000', fontSize: 15.5, lineHeight: 1.35, flexShrink: 0, boxShadow: !me && skin.themBg === '#fff' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}
    >
      {ai && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: skin.accent, marginBottom: 2 }}><Sparkles size={11} /> Réponse IA</span>}
      {text}
    </motion.div>
  );
}

const CHAT_BAR = 60;

function ChatInput({ skin, draft }: { skin: Skin; draft: string }) {
  const wrap: React.CSSProperties = { position: 'absolute', left: 0, right: 0, bottom: KB_H, height: CHAT_BAR, background: '#fff', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 3 };
  if (skin.input === 'instagram') {
    return (
      <div style={wrap}>
        <span style={{ flex: 1, height: 46, borderRadius: 23, background: '#EFEFEF', display: 'flex', alignItems: 'center', gap: 12, padding: '0 6px', color: '#000' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: skin.accent, color: '#fff', display: 'grid', placeItems: 'center' }}><Camera size={18} /></span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex' }}><Draft text={draft} placeholder="Message…" color="#737373" /></span>
          <Mic size={21} strokeWidth={1.8} /><ImageIcon size={21} strokeWidth={1.8} /><Sticker size={21} strokeWidth={1.8} style={{ marginRight: 8 }} />
        </span>
      </div>
    );
  }
  if (skin.input === 'messenger') {
    const c = skin.accent;
    return (
      <div style={wrap}>
        <Plus size={24} color={c} strokeWidth={2.2} /><Camera size={23} color={c} /><ImageIcon size={23} color={c} /><Mic size={23} color={c} />
        <span style={{ flex: 1, minWidth: 0, height: 38, borderRadius: 19, background: '#F0F2F5', display: 'flex', alignItems: 'center', padding: '0 14px' }}><Draft text={draft} placeholder="Aa" color="#65676B" /></span>
        <ThumbsUp size={24} color={c} fill={c} />
      </div>
    );
  }
  return (
    <div style={{ ...wrap, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
      <span style={{ flex: 1, minWidth: 0, height: 44, borderRadius: 22, border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', padding: '0 16px' }}><Draft text={draft} placeholder="Écrivez un message…" color="#8E8E93" /></span>
      <span style={{ width: 44, height: 44, borderRadius: '50%', background: skin.accent, color: '#fff', display: 'grid', placeItems: 'center' }}><SendHorizontal size={19} /></span>
    </div>
  );
}

/* ═══════════════ Clavier iOS (AZERTY) ═══════════════
   Toujours ouvert, comme pendant une vraie conversation. Sur grand écran le bas du téléphone est
   coupé (clip + fondu) : seules les premières rangées restent visibles, le reste de l'histoire
   (bulles, feuilles Flow et paiement) est donc dessiné au-dessus de cette limite. */
export const KB_H = 300;
const ROWS = ['AZERTYUIOP', 'QSDFGHJKLM', "WXCVBN'"];

function Keyboard() {
  const key: React.CSSProperties = { height: 42, borderRadius: 6, background: '#fff', boxShadow: '0 1px 0 rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center', fontSize: 22, color: '#000' };
  const fn: React.CSSProperties = { ...key, background: '#ABB0BA', fontSize: 15 };
  const row: React.CSSProperties = { display: 'flex', gap: 6, justifyContent: 'center' };
  return (
    <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: KB_H, background: '#D1D4DA', padding: '8px 3px 0', display: 'flex', flexDirection: 'column', gap: 11, zIndex: 3, fontFamily: SANS }}>
      {ROWS.slice(0, 2).map(r => (
        <div key={r} style={row}>{r.split('').map(c => <span key={c} style={{ ...key, flex: 1 }}>{c}</span>)}</div>
      ))}
      <div style={row}>
        <span style={{ ...fn, width: 44, flexShrink: 0 }}>⇧</span>
        <span style={{ flex: 1, display: 'flex', gap: 6, padding: '0 6px' }}>{ROWS[2].split('').map(c => <span key={c} style={{ ...key, flex: 1 }}>{c}</span>)}</span>
        <span style={{ ...fn, width: 44, flexShrink: 0 }}>⌫</span>
      </div>
      <div style={row}>
        <span style={{ ...fn, width: 92, flexShrink: 0 }}>123</span>
        <span style={{ ...key, flex: 1, fontSize: 15 }}>espace</span>
        <span style={{ ...fn, width: 92, flexShrink: 0 }}>retour</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 20px 0', color: '#50555C' }}>
        <Smile size={26} strokeWidth={1.7} />
        <Mic size={24} strokeWidth={1.7} />
      </div>
    </div>
  );
}

/** Contenu du champ de saisie : texte en cours de frappe + curseur, sinon le placeholder. */
function Draft({ text, placeholder = '', color = WA.meta }: { text: string; placeholder?: string; color?: string }) {
  return (
    <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', direction: 'ltr', color: text ? '#000' : color }}>
      {text || placeholder}
      {text && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ display: 'inline-block', width: 2, height: 19, background: WA.action, verticalAlign: -4, marginLeft: 1 }} />}
    </span>
  );
}
