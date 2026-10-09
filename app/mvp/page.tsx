'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, X, ChevronDown, Clock, Smartphone, Monitor, Globe,
  Layers, Compass, Rocket, Gift, Film, LayoutTemplate, MessageCircle, Cpu, Target, Scissors,
} from 'lucide-react';

/* ─── config de l'offre ─────────────────────────────── */
const OFFER = {
  price: '5 000 €',
  originalPrice: '10 000 €',
  days: 30,
  years: 5,
  whatsapp: '237694086571',
  whatsappText: 'Bonjour Wilfried, je suis intéressé par l\'offre MVP en 30 jours à 5 000 €. Voici mon projet : ',
  email: 'info.ozirus@gmail.com',
};

const WHATSAPP_URL = `https://wa.me/${OFFER.whatsapp}?text=${encodeURIComponent(OFFER.whatsappText)}`;

const ACCENT = '#7967FF';
const DISPLAY = 'var(--font-display-loaded), Clash Display, sans-serif';

const T = (delay = 0) => ({ duration: 0.55, delay, ease: [0.25, 0, 0, 1] as [number, number, number, number] });
const up = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: T(delay) });
const upView = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: T(delay) });

/* ─── fonds ─────────────────────────────────────────── */
const LineGrid = () => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
    <defs>
      <pattern id="lines-mvp" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0 L0 0 0 48" fill="none" stroke={ACCENT} strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lines-mvp)" />
  </svg>
);

const Glow = ({ top = -120 }: { top?: number }) => (
  <div aria-hidden style={{ position: 'absolute', top, left: '50%', transform: 'translateX(-50%)', width: 760, maxWidth: '100%', height: 520, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
);

/* ─── données ───────────────────────────────────────── */
const PLATFORMS = [
  { icon: Globe, title: 'SaaS web', desc: 'Espace client, tableau de bord, abonnements, rôles et paiements. Prêt à facturer vos premiers utilisateurs.' },
  { icon: Smartphone, title: 'App mobile', desc: 'iOS et Android depuis une seule base de code, publiable sur les stores, avec une vraie expérience native.' },
  { icon: Monitor, title: 'App desktop', desc: 'macOS et Windows pour les outils métier, la création ou le hors-ligne, là où le navigateur ne suffit pas.' },
  { icon: Cpu, title: 'Produit IA', desc: 'Agents, automatisations, assistants branchés sur vos données. L\'IA au service d\'un vrai usage, pas d\'une démo.' },
];

const COMPARISON = [
  { freelance: 'Exécute un cahier des charges', cto: 'Challenge le cahier des charges avant d\'écrire une ligne' },
  { freelance: 'Facture chaque fonctionnalité ajoutée', cto: 'Coupe ce qui ne sert pas votre premier client' },
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
  { days: 'Jours 1 à 5', title: 'Cadrage & design', desc: 'Atelier produit, parcours utilisateur, périmètre verrouillé, maquettes validées ensemble.' },
  { days: 'Jours 6 à 20', title: 'Développement', desc: 'Sprints courts, démo chaque semaine. Vous voyez le produit avancer, vous n\'attendez pas la fin.' },
  { days: 'Jours 21 à 26', title: 'Tests & finitions', desc: 'Recette, corrections, performance, mise en production sur vos comptes.' },
  { days: 'Jours 27 à 30', title: 'Lancement', desc: 'Landing page en ligne, vidéo motion livrée, MVP prêt pour vos premiers utilisateurs.' },
];

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

const FAQS = [
  {
    q: 'Un MVP en 30 jours, c\'est vraiment possible ?',
    a: 'Oui, parce que le périmètre est verrouillé dès la première semaine. Un MVP n\'est pas votre produit final : c\'est la plus petite version capable de prouver que des utilisateurs en veulent. Le rôle du CTO est justement de trouver ce périmètre avec vous.',
  },
  {
    q: 'Qu\'est-ce qui change concrètement avec un CTO cofondateur ?',
    a: 'Vous n\'achetez pas des heures de développement, vous gagnez quelqu\'un qui raisonne comme un associé : il challenge vos idées, coupe le superflu, choisit une architecture qui tiendra la croissance et vous aide à présenter le produit à vos premiers clients ou investisseurs.',
  },
  {
    q: 'Pourquoi 5 000 € au lieu de 10 000 € ?',
    a: 'C\'est une offre de lancement, sur un nombre limité de projets, pour construire avec des fondateurs motivés. Le prix inclut le MVP complet, la landing page et la vidéo motion promo.',
  },
  {
    q: 'À qui appartient le code ?',
    a: 'À vous. Le code source, les comptes d\'hébergement et les accès sont remis à votre nom à la livraison.',
  },
  {
    q: 'Et après les 30 jours ?',
    a: 'Vous êtes libre. Beaucoup de fondateurs continuent avec nous pour la V2, en accompagnement CTO ou en développement continu, mais rien ne vous y oblige.',
  },
  {
    q: 'Mon idée est encore floue, est-ce trop tôt ?',
    a: 'Non. Le premier échange sert justement à clarifier l\'idée, la cible et ce que doit contenir le MVP. Si ce n\'est pas le bon moment, on vous le dira.',
  },
];

/* ─── composants ───────────────────────────────────── */
function CtaButton({ children, href = WHATSAPP_URL, big = false }: { children: React.ReactNode; href?: string; big?: boolean }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(121,103,255,0.5)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: big ? '20px 40px' : '16px 32px', borderRadius: 14,
        background: `linear-gradient(135deg, ${ACCENT} 0%, #6654F0 100%)`,
        color: '#fff', fontSize: big ? 18 : 16, fontWeight: 700, textDecoration: 'none', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(121,103,255,0.3)',
      }}
    >
      <motion.span
        aria-hidden
        animate={{ left: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        style={{ position: 'absolute', top: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
      />
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10 }}>{children}</span>
    </motion.a>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 28px', borderRadius: 14,
        background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div {...upView()} style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>{eyebrow}</p>
      <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: sub ? 18 : 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{sub}</p>}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff' }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>{q}</span>
        <ChevronDown size={18} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.5 }} />
      </button>
      {open && <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', paddingBottom: 24 }}>{a}</p>}
    </div>
  );
}

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #7967FF 0%, #A78BFA 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 28,
};

const openContact = () => window.dispatchEvent(new Event('ozirus:open-contact-modal'));

/* ─── page ─────────────────────────────────────────── */
export default function MvpOfferPage() {
  return (
    <main style={{ background: '#0A0A0F', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── BARRE OFFRE ── */}
      <div style={{ background: `linear-gradient(90deg, ${ACCENT}, #6654F0)`, padding: '10px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 600 }}>
          ⚡ Offre spéciale — MVP en {OFFER.days} jours à <strong>{OFFER.price}</strong>{' '}
          <span style={{ opacity: 0.75, textDecoration: 'line-through' }}>{OFFER.originalPrice}</span>{' '}
          · Landing page + vidéo motion offertes
        </p>
      </div>

      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="https://ozirus.agency" aria-label="Ozirus Agency">
            <img src="/logo.png" alt="Ozirus" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
          </a>
          <a href="#offre" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: ACCENT, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Voir l&apos;offre <ArrowRight size={15} />
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '88px 24px 72px' }}>
        <LineGrid />
        <Glow />
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...up()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, border: '1px solid rgba(121,103,255,0.35)', background: 'rgba(121,103,255,0.1)', fontSize: 13, fontWeight: 600, color: '#C4B9FF', marginBottom: 28 }}>
            <Clock size={14} /> {OFFER.days} jours chrono · {OFFER.years} ans d&apos;expérience
          </motion.div>

          <motion.h1 {...up(0.05)} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.6rem, 7vw, 5.4rem)', lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 28 }}>
            Votre MVP en {OFFER.days} jours,
            <br />
            <span style={gradientText}>avec un CTO cofondateur.</span>
          </motion.h1>

          <motion.p {...up(0.1)} style={{ fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: 680, margin: '0 auto 40px' }}>
            SaaS, application mobile, desktop ou produit IA : je construis votre MVP comme si c&apos;était le mien.
            Pas un prestataire de plus, <strong style={{ color: '#fff' }}>un associé technique pendant {OFFER.days} jours</strong>, avec {OFFER.years} ans
            de produits livrés derrière lui.
          </motion.p>

          <motion.div {...up(0.15)} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 44 }}>
            <CtaButton big>
              <MessageCircle size={20} /> Réserver mon MVP
            </CtaButton>
            <SecondaryButton onClick={() => document.getElementById('offre')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir ce qui est inclus <ChevronDown size={16} />
            </SecondaryButton>
          </motion.div>

          <motion.div {...up(0.2)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 600 }}>{OFFER.price}</span>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{OFFER.originalPrice}</span>
            <span style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.12)', color: '#4ADE80', fontSize: 13, fontWeight: 700 }}>-50 %</span>
          </motion.div>
          <motion.p {...up(0.22)} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>
            + Landing page et vidéo motion promo offertes
          </motion.p>
        </div>
      </section>

      {/* ── CHIFFRES ── */}
      <section style={{ padding: '0 24px 88px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { value: `${OFFER.years} ans`, label: 'à concevoir et livrer des produits' },
            { value: '15+', label: 'applications déployées en production' },
            { value: `${OFFER.days} jours`, label: 'de l\'idée au produit en ligne' },
            { value: '1', label: 'interlocuteur : le CTO, du début à la fin' },
          ].map((s, i) => (
            <motion.div key={s.label} {...upView(i * 0.05)} style={{ ...card, textAlign: 'center' }}>
              <p style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 600, ...gradientText }}>{s.value}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.5 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POURQUOI UN CTO ── */}
      <section style={{ position: 'relative', padding: '88px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <SectionHead
          eyebrow="La vraie différence"
          title={<>Un CTO cofondateur <span style={gradientText}>change radicalement</span> un MVP.</>}
          sub="La plupart des MVP ratés ne le sont pas à cause du code, mais des décisions prises avant. C'est là qu'un CTO fait toute la différence."
        />

        <div style={{ maxWidth: 1000, margin: '0 auto 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {CTO_POINTS.map((p, i) => (
            <motion.div key={p.title} {...upView(i * 0.05)} style={card}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(121,103,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <p.icon size={22} color={ACCENT} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...upView()} style={{ maxWidth: 900, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.04)' }}>
            <p style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Un prestataire classique</p>
            <p style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(121,103,255,0.08)' }}>Un CTO cofondateur</p>
          </div>
          {COMPARISON.map(row => (
            <div key={row.cto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ display: 'flex', gap: 10, padding: '16px 20px', fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.45)' }}>
                <X size={16} style={{ flexShrink: 0, marginTop: 2, color: '#F87171' }} /> {row.freelance}
              </p>
              <p style={{ display: 'flex', gap: 10, padding: '16px 20px', fontSize: 14, lineHeight: 1.55, color: '#fff', background: 'rgba(121,103,255,0.05)' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2, color: '#4ADE80' }} /> {row.cto}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── PLATEFORMES ── */}
      <section style={{ padding: '88px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <SectionHead
          eyebrow="Ce qu'on construit"
          title={<>SaaS, mobile, desktop. <span style={gradientText}>Même délai.</span></>}
          sub="Le format suit votre marché, pas l'inverse. Dans tous les cas, votre produit est en ligne en 30 jours."
        />
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {PLATFORMS.map((p, i) => (
            <motion.div key={p.title} {...upView(i * 0.05)} style={card}>
              <p.icon size={26} color={ACCENT} style={{ marginBottom: 18 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 30 JOURS ── */}
      <section style={{ padding: '88px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <SectionHead
          eyebrow="30 jours chrono"
          title={<>De l&apos;idée au lancement, <span style={gradientText}>semaine par semaine.</span></>}
        />
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {TIMELINE.map((step, i) => (
            <motion.div key={step.title} {...upView(i * 0.05)} style={{ ...card, position: 'relative' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{step.days}</p>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)' }}>{step.desc}</p>
              {i === TIMELINE.length - 1 && <Rocket size={20} color={ACCENT} style={{ position: 'absolute', top: 26, right: 26 }} />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OFFRE ── */}
      <section id="offre" style={{ position: 'relative', overflow: 'hidden', padding: '96px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', scrollMarginTop: 64 }}>
        <Glow top={40} />
        <SectionHead eyebrow="L'offre" title={<>Tout ce qu&apos;il faut pour <span style={gradientText}>lancer.</span></>} />

        <motion.div {...upView()} style={{ position: 'relative', maxWidth: 760, margin: '0 auto', borderRadius: 28, padding: 'clamp(28px, 5vw, 48px)', background: 'linear-gradient(160deg, rgba(121,103,255,0.14) 0%, rgba(255,255,255,0.02) 60%)', border: '1.5px solid rgba(121,103,255,0.35)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 600 }}>MVP en {OFFER.days} jours</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>{OFFER.originalPrice}</span>
              <span style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 600 }}>{OFFER.price}</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Forfait unique, HT. Prix de lancement, nombre de projets limité.</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'grid', gap: 14 }}>
            {INCLUDED.map(item => (
              <li key={item} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}>
                <CheckCircle2 size={18} color="#4ADE80" style={{ flexShrink: 0, marginTop: 2 }} /> {item}
              </li>
            ))}
          </ul>

          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.14)', paddingTop: 28, marginBottom: 36 }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>
              <Gift size={16} /> Bonus offerts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {BONUSES.map(b => (
                <div key={b.title} style={{ borderRadius: 16, padding: 20, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <b.icon size={22} color="#FBBF24" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{b.title}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <CtaButton big>
              <MessageCircle size={20} /> Réserver mon MVP sur WhatsApp
            </CtaButton>
            <SecondaryButton onClick={openContact}>Écrire un message</SecondaryButton>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '88px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <SectionHead eyebrow="Questions" title="Avant de vous lancer" />
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '104px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <LineGrid />
        <Glow top={-60} />
        <motion.div {...upView()} style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.02, letterSpacing: '-0.025em', marginBottom: 22 }}>
            Dans {OFFER.days} jours, <span style={gradientText}>votre produit est en ligne.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: 36 }}>
            Parlez-moi de votre idée. On voit ensemble si elle tient en {OFFER.days} jours, et ce que doit contenir votre MVP.
          </p>
          <CtaButton big>
            Démarrer mon MVP à {OFFER.price} <ArrowRight size={20} />
          </CtaButton>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 18 }}>
            Ou par email : <a href={`mailto:${OFFER.email}`} style={{ color: 'rgba(255,255,255,0.7)' }}>{OFFER.email}</a>
          </p>
        </motion.div>
      </section>

      <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <a href="https://ozirus.agency">
          <img src="/logo.png" alt="Ozirus" style={{ height: 22, filter: 'brightness(0) invert(1)', opacity: 0.4 }} />
        </a>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>© {new Date().getFullYear()} Ozirus Agency</p>
      </footer>
    </main>
  );
}
