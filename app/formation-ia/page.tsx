'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SharedNav from '../../components/SharedNav';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Play, Clock, Users, Star,
  TrendingUp, Shield, Zap, BookOpen, Award, ChevronDown,
} from 'lucide-react';

const DotGrid = () => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
    <defs>
      <pattern id="dots-f" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#7967FF" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots-f)" />
  </svg>
);

const LineGrid = () => (
  <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
    <defs>
      <pattern id="lines-f" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0 L0 0 0 48" fill="none" stroke="#7967FF" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lines-f)" />
  </svg>
);

const MODULES = [
  { n: '01', title: 'Le marché IA en Afrique', desc: 'Cartographie des opportunités pays par pays. Où sont les argents faciles en 2026 ?' },
  { n: '02', title: '15 secteurs, 15 scripts de vente', desc: 'Les secteurs les plus rentables et exactement quoi dire pour décrocher un premier client.' },
  { n: '03', title: 'Créer et revendre vos produits IA', desc: 'Accès marque blanche à tous nos produits. Vous les vendez comme les vôtres, vous gardez la marge.' },
  { n: '04', title: 'Vendre sans coder', desc: 'WhatsApp, Facebook local, terrain. Les vraies techniques qui marchent sur le marché africain.' },
  { n: '05', title: 'Pricing et closing', desc: 'Comment fixer vos prix, structurer vos contrats et fermer les ventes sans négocier à la baisse.' },
  { n: '06', title: 'Livrer en 4 à 8 semaines', desc: 'Le process exact pour livrer un projet IA sans stress, sans dépassement, avec un client satisfait.' },
  { n: '07', title: 'Scaler : de 300K à 5M FCFA/mois', desc: 'Recruter, sous-traiter, multiplier les clients. La roadmap pour passer à l\'échelle.' },
  { n: '08', title: 'Mindset et cashflow', desc: 'Gérer sa trésorerie, rester focus, ne pas abandonner au premier obstacle. Le module que personne ne fait.' },
];

const TESTIMONIALS = [
  { quote: 'J\'ai signé mon premier client à 350 000 FCFA/mois seulement 6 semaines après la formation. Je n\'aurais jamais cru ça possible aussi vite.', name: 'Aïcha K.', city: 'Abidjan', result: '350K FCFA/mois' },
  { quote: 'J\'ai revendu 11 produits digitaux le premier mois. La marque blanche, c\'est la clé. Tu revends ce qu\'Ozirus a déjà construit.', name: 'Ibrahim D.', city: 'Dakar', result: '11 ventes mois 1' },
  { quote: 'En 3 mois j\'avais 4 clients récurrents. Aujourd\'hui je gère une petite équipe de 2 personnes. La formation m\'a donné le système.', name: 'Christelle M.', city: 'Douala', result: '4 clients récurrents' },
];

const BONUSES = [
  { icon: BookOpen, title: 'Accès marque blanche à vie', desc: 'Tous nos produits IA à revendre sous votre nom. Valeur réelle : 600 000 FCFA.' },
  { icon: Users,    title: 'Groupe WhatsApp privé 3 mois', desc: 'Accompagnement direct, questions répondues en moins de 24h, réseau d\'alumni.' },
  { icon: Award,    title: 'Templates & scripts complets', desc: 'Contrats, propositions commerciales, scripts de vente. Prêts à utiliser.' },
  { icon: Star,     title: 'Certificat officiel Ozirus Africa', desc: 'Crédibilité immédiate auprès de vos clients et prospects.' },
];

/* ── Countdown ── */
function Countdown() {
  const [time, setTime] = useState({ h: 47, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(t => {
        if (t.s > 0) return { ...t, s: t.s - 1 };
        if (t.m > 0) return { ...t, m: t.m - 1, s: 59 };
        if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
        return t;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {[['h', time.h], ['m', time.m], ['s', time.s]].map(([l, v]) => (
        <React.Fragment key={l as string}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 10px', textAlign: 'center', minWidth: 44 }}>
            <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', lineHeight: 1 }}>{pad(v as number)}</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{l as string}</p>
          </div>
          {l !== 's' && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: 700 }}>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── FAQ ── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{q}</span>
        <ChevronDown size={18} color="#7967FF" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      {open && <p style={{ fontSize: 14, color: '#888', lineHeight: 1.75, paddingBottom: 20 }}>{a}</p>}
    </div>
  );
}

export default function FormationPage() {
  return (
    <main style={{ background: '#0A0A0F', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>

      <SharedNav
        dark
        anchors={[
          { label: 'Programme', href: '#programme' },
          { label: 'Résultats',  href: '#resultats' },
          { label: 'Inscription', href: '#inscription' },
        ]}
        ctaLabel="Réserver ma place"
        ctaHref="#inscription"
      />

      {/* ── URGENCE BAR ── */}
      <div style={{ background: 'linear-gradient(90deg, #7967FF, #6654F0)', padding: '10px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
          ⚡ Session du 15 Juin 2026 — <span style={{ opacity: 0.85 }}>Il ne reste que</span> <strong>11 places</strong> <span style={{ opacity: 0.85 }}>sur 25 — Fermeture dans</span>{' '}
          <Countdown />
        </p>
      </div>

      {/* ── HERO VSL ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 64px' }}>
        <LineGrid />
        <div aria-hidden style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 20 }}>
              Formation · Agence IA Africa
            </p>
            <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 5rem)', lineHeight: 0.98, letterSpacing: '-0.025em', color: '#fff', marginBottom: 24 }}>
              Lancez votre
              <br />
              <span style={{ background: 'linear-gradient(135deg, #7967FF 0%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                agence IA rentable.
              </span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 640, margin: '0 auto 40px' }}>
              Passez de "je rêve de me lancer" à "je facture déjà mes premiers clients" au <strong style={{ color: '#fff' }}>Cameroun</strong>, en <strong style={{ color: '#fff' }}>Côte d'Ivoire</strong> ou au <strong style={{ color: '#fff' }}>Sénégal</strong>. Le programme complet pour entrepreneurs africains.
            </p>
          </motion.div>

          {/* ── VIDEO ── */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '16/9', background: '#111', border: '1.5px solid rgba(121,103,255,0.3)', boxShadow: '0 32px 80px rgba(121,103,255,0.2)', marginBottom: 48 }}>
            <video autoPlay muted loop playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}>
              {/* <source src="/video/formation-vsl.mp4" type="video/mp4" /> */}
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(121,103,255,0.3) 0%, rgba(10,10,15,0.7) 100%)' }} />
            {/* play overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(121,103,255,0.9)', boxShadow: '0 0 0 12px rgba(121,103,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Regarder la présentation complète (12 min)</p>
            </div>
            {/* bottom bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                {[['25+', 'alumni actifs'], ['8', 'modules complets'], ['300K+', 'FCFA/mois possible']].map(([v, l]) => (
                  <div key={v} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>{v}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{l}</p>
                  </div>
                ))}
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.4)', padding: '5px 12px', borderRadius: 99, backdropFilter: 'blur(4px)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> En direct
              </span>
            </div>
          </motion.div>

          {/* CTA principal */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <a href="#inscription"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#7967FF', color: '#fff', padding: '16px 36px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(121,103,255,0.4)', transition: 'background 0.15s, transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#6654F0'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#7967FF'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
              Je veux lancer mon agence IA <ArrowRight size={18} />
            </a>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 12 }}>100 000 FCFA · 11 places restantes · Session 15 Juin 2026</p>
          </motion.div>
        </div>
      </section>

      {/* ── ACCROCHE — LE PROBLÈME ── */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 20 }}>La réalité du terrain</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em', marginBottom: 28 }}>
              L'IA est là. L'argent est là.<br />
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Mais personne ne vous a montré comment en profiter.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: '📱', text: 'En Afrique francophone, 90 % des PME n\'ont aucun outil IA. Ce sont vos futurs clients.' },
                { icon: '💰', text: 'Un seul client IA moyen = 150 000 à 400 000 FCFA/mois en récurrent. 3 clients = vous avez changé de vie.' },
                { icon: '🚀', text: 'Vous n\'avez pas besoin de coder. Ni d\'un bac +5. Ni de capital de départ. Juste le bon système.' },
                { icon: '⏱️', text: 'Ceux qui se lancent maintenant prennent le marché. Dans 18 mois il sera saturé.' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CE QUE VOUS ALLEZ APPRENDRE ── */}
      <section id="programme" style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}><DotGrid /></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 14 }}>Le programme</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em' }}>
              8 modules. Rien de superflu.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
            {MODULES.map((m, i) => (
              <motion.div key={m.n}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{ display: 'flex', gap: 16, padding: '20px 22px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                <span style={{ width: 32, height: 32, minWidth: 32, background: '#7967FF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 2 }}>{m.n}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 6 }}>{m.title}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS CONCRETS ── */}
      <section id="resultats" style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 14 }}>Ils l'ont fait</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em' }}>
              Des vrais résultats, pas des promesses.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>« {t.quote} »</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.city}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#7967FF', background: 'rgba(121,103,255,0.15)', padding: '4px 10px', borderRadius: 99 }}>{t.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BONUS ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 14 }}>Inclus dans la formation</p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em' }}>
              Pas juste une formation. Un arsenal complet.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 40 }}>
            {BONUSES.map(b => {
              const Icon = b.icon;
              return (
                <div key={b.title} style={{ display: 'flex', gap: 16, padding: '20px 22px', background: 'rgba(121,103,255,0.07)', border: '1px solid rgba(121,103,255,0.2)', borderRadius: 14 }}>
                  <div style={{ width: 40, height: 40, minWidth: 40, background: 'rgba(121,103,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="#A78BFA" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 4 }}>{b.title}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* garantie */}
          <div style={{ display: 'flex', gap: 16, padding: '24px 28px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, alignItems: 'flex-start' }}>
            <Shield size={28} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#22c55e', marginBottom: 6 }}>Garantie 30 jours — Satisfait ou remboursé</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                Si après 30 jours vous estimez que la formation ne correspond pas à vos attentes, on vous rembourse intégralement. Sans question, sans délai. On croit dans ce qu'on vend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSCRIPTION ── */}
      <section id="inscription" style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px' }}>
        <LineGrid />
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 580, margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(121,103,255,0.35)', borderRadius: 24, padding: '44px 40px', textAlign: 'center' }}>
            {/* urgence */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 99, padding: '7px 16px', marginBottom: 28 }}>
              <Clock size={13} color="#F59E0B" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>Session 15 Juin 2026 — 11 places restantes</span>
            </div>

            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Réservez votre place maintenant.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.6 }}>
              25 places maximum. Groupe fermé. Accès au réseau d'alumni pour toujours.
            </p>

            {/* prix */}
            <div style={{ marginBottom: 28, padding: '20px', background: 'rgba(121,103,255,0.1)', borderRadius: 14 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', marginBottom: 4 }}>Prix normal : 200 000 FCFA</p>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, fontSize: 44, color: '#fff', lineHeight: 1 }}>100 000 <span style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>FCFA</span></p>
              <p style={{ fontSize: 13, color: '#A78BFA', marginTop: 6 }}>ou 3 × 40 000 FCFA — paiement en 3 fois sans frais</p>
            </div>

            {/* ce qui est inclus */}
            <div style={{ textAlign: 'left', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['8 modules vidéo à vie', 'Accès marque blanche à tous les produits', 'Groupe WhatsApp privé 3 mois', 'Templates & scripts prêts à l\'emploi', 'Certificat officiel Ozirus Africa', 'Garantie satisfait ou remboursé 30 jours'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={15} color="#7967FF" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                </div>
              ))}
            </div>

            <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#7967FF', color: '#fff', padding: '16px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(121,103,255,0.35)', transition: 'background 0.15s, transform 0.15s', width: '100%' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#6654F0'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#7967FF'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
              Je réserve ma place — 100 000 FCFA <ArrowRight size={16} />
            </a>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>
              Paiement sécurisé · Mobile Money, Wave, Orange Money, MTN · Accès immédiat après confirmation
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em', marginBottom: 36, textAlign: 'center' }}>
            Questions fréquentes
          </h2>
          <FAQ q="Est-ce qu'il faut savoir coder ?" a="Absolument pas. Tout ce qu'on vous apprend est fait pour être utilisé sans écrire une seule ligne de code. On utilise des outils no-code et des produits déjà construits qu'il suffit de configurer et de revendre." />
          <FAQ q="En combien de temps vais-je avoir mon premier client ?" a="La plupart de nos alumni signent leur premier client entre la semaine 4 et la semaine 8. Certains dès la semaine 2 s'ils appliquent immédiatement les scripts de vente du module 4." />
          <FAQ q="Est-ce que ça marche dans mon pays ?" a="La formation a été conçue pour toute l'Afrique francophone : Cameroun, Côte d'Ivoire, Sénégal, Mali, Burkina, RDC, Madagascar et bien d'autres. Le module 1 couvre les spécificités par pays." />
          <FAQ q="Qu'est-ce que la marque blanche exactement ?" a="Vous avez accès à tous nos produits digitaux (chatbot WhatsApp, gestionnaire de stocks, facturation, CRM, booking) que vous pouvez revendre sous votre propre nom à n'importe quel prix. Vous achetez une fois, vous revendez à l'infini." />
          <FAQ q="Et si ça ne marche pas pour moi ?" a="On vous rembourse. Garantie 30 jours sans condition. On croit dans cette formation, et on ne veut pas d'un client qui n'est pas satisfait." />
          <FAQ q="Comment fonctionne le paiement en 3 fois ?" a="Vous payez 40 000 FCFA à l'inscription, puis 40 000 FCFA à J+30, et le dernier versement à J+60. Accès complet dès le premier paiement, sans frais supplémentaires." />
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 16 }}>Dernière chance</p>
        <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Demain vous aurez soit commencé,<br />soit regretté de ne pas l'avoir fait.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>11 places restantes · Session 15 Juin 2026</p>
        <a href="#inscription" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#7967FF', color: '#fff', padding: '16px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 32px rgba(121,103,255,0.35)', transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
          onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}>
          Je réserve ma place maintenant <ArrowRight size={16} />
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 22, filter: 'brightness(0) invert(1)', opacity: 0.4 }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Ozirus Agency</span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/produits-ia" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Produits IA</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
