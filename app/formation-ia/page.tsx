'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

const FAQS = [
  { q: "Est-ce que j'ai besoin de savoir coder ?", a: "Absolument pas. Nous utilisons des outils 'No-code' et des solutions en marque blanche déjà prêtes. Votre rôle est de comprendre le besoin du client et de configurer la solution IA, pas d'écrire des lignes de code." },
  { q: "Combien de temps avant de voir les premiers revenus ?", a: "La plupart de nos membres signent leur premier client entre la 4ème et la 8ème semaine. Certains récupèrent l'investissement de la formation dès le premier mois grâce à la revente de produits digitaux." },
  { q: "Comment se déroule la formation ?", a: "C'est un mélange de sessions en direct (Live) pour poser vos questions, et d'un accès à une plateforme de cours vidéo disponible 24h/24. Vous avancez à votre rythme tout en étant soutenu par la communauté." },
  { q: "Est-ce adapté si j'ai déjà un emploi ?", a: "Oui. La formation demande environ 4 à 6 heures par semaine. Les sessions live sont enregistrées et consultables à tout moment. C'est le moyen idéal pour construire votre agence en parallèle de votre activité actuelle." },
  { q: "Quelles sont les méthodes de paiement ?", a: "Nous acceptons les paiements via Orange Money, MTN Mobile Money, Wave, ainsi que les virements bancaires classiques. Des facilités de paiement en 2 fois sont possibles sur demande." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#fff' }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>{q}</span>
        <ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', opacity: 0.5 }} />
      </button>
      <div style={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0, transition: 'all 0.3s', marginBottom: open ? 24 : 0 }}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>{a}</p>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { quote: 'J\'ai signé mon premier client à 350 000 FCFA/mois seulement 6 semaines après la formation. Je n\'aurais jamais cru ça possible aussi vite.', name: 'Aïcha K.', city: 'Abidjan', result: '350K FCFA/mois' },
  { quote: 'J\'ai revendu 11 produits digitaux le premier mois. La marque blanche, c\'est la clé. Tu revends ce qu\'Ozirus a déjà construit.', name: 'Ibrahim D.', city: 'Dakar', result: '11 ventes mois 1' },
  { quote: 'En 3 mois j\'avais 4 clients récurrents. Aujourd\'hui je gère une petite équipe de 2 personnes. La formation m\'a donné le système.', name: 'Christelle M.', city: 'Douala', result: '4 clients récurrents' },
];

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 4, h: 12, m: 45, s: 22 });
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        let { d, h, m, s } = prev;
        if (s > 0) s--; else if (m > 0) { m--; s = 59; } else if (h > 0) { h--; m = 59; s = 59; } else if (d > 0) { d--; h = 23; m = 59; s = 59; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
      {timeLeft.d}j {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
    </span>
  );
}

export default function FormationPage() {
  return (
    <main style={{ background: '#0A0A0F', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>

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
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#7967FF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 40px rgba(121,103,255,0.4)' }}>
                <Play size={32} fill="#fff" color="#fff" style={{ marginLeft: 5 }} />
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#inscription" style={{ background: '#7967FF', color: '#fff', padding: '16px 32px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(121,103,255,0.3)' }}>Réserver ma place maintenant</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
              <Users size={16} /> 14 entrepreneurs déjà inscrits
            </div>
          </div>
        </div>
      </section>

      {/* ── POUR QUI ? ── */}
      <section style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Cette formation est pour vous si...</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { t: 'Freelances & Agences', b: 'Vous voulez ajouter des services IA à haute valeur ajoutée pour facturer plus cher.' },
              { t: 'Entrepreneurs', b: 'Vous cherchez un business model rentable et moderne à lancer sur le marché africain.' },
              { t: 'Salariés en reconversion', b: 'Vous voulez construire une source de revenus indépendante en parallèle de votre job.' },
            ].map(item => (
              <div key={item.t} style={{ padding: 24, borderRadius: 16, background: 'rgba(121,103,255,0.03)', border: '1px solid rgba(121,103,255,0.1)' }}>
                <CheckCircle2 size={20} color="#7967FF" style={{ marginBottom: 16 }} />
                <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{item.t}</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI MAINTENANT ? ── */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ background: '#111', borderRadius: 24, padding: '48px', border: '1px solid rgba(121,103,255,0.15)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px 24px', background: '#7967FF', fontSize: 12, fontWeight: 800, borderRadius: '0 0 0 16px' }}>OPPORTUNITÉ 2026</div>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, fontWeight: 600, marginBottom: 32, maxWidth: 500 }}>Pourquoi lancer votre agence IA au Cameroun maintenant ?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
              {[
                { t: 'Adoption massive', b: 'Les PME locales cherchent désespérément à réduire leurs coûts face à l\'inflation.' },
                { t: 'Zéro concurrence', b: 'Le marché est immense et il n\'y a quasiment aucune agence spécialisée sérieuse.' },
                { t: 'Coûts dérisoires', b: 'Vous n\'avez besoin d\'aucun stock physique, juste d\'une connexion internet.' },
              ].map(item => (
                <div key={item.t}>
                  <p style={{ fontWeight: 800, fontSize: 18, color: '#7967FF', marginBottom: 8 }}>{item.t}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{item.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CE QUI EST INCLUS ── */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, transparent, rgba(121,103,255,0.05) 50%, transparent)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 24 }}>Tout ce qu'il vous faut pour réussir.</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 32 }}>On ne vous donne pas juste des cours. On vous donne l'infrastructure complète d'une agence IA opérationnelle.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Accès à vie à la communauté privée (WhatsApp/Discord)',
                  'Modèles de contrats et devis prêts à l\'emploi',
                  'Scripts de vente WhatsApp et techniques de closing',
                  'Droit de revente en marque blanche (Ozirus products)',
                  'Coaching de groupe hebdomadaire pendant 3 mois',
                  'Certificat de fin de formation Ozirus Agency',
                ].map(l => (
                  <div key={l} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Zap size={16} color="#7967FF" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#111', borderRadius: 24, padding: 32, border: '1px solid rgba(121,103,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Award size={32} color="#7967FF" />
                <p style={{ fontWeight: 800, fontSize: 18 }}>Valeur totale : +850 000 F</p>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Inclus gratuitement pour les membres de cette session.</p>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />
              <a href="#inscription" style={{ display: 'block', textAlign: 'center', background: '#fff', color: '#7967FF', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Accéder à tout le pack</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ── */}
      <section id="programme" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Le programme complet</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>8 modules intensifs pour passer de zéro à vos premiers 500 000 FCFA de chiffre d'affaires.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {MODULES.map(m => (
              <div key={m.n} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#7967FF', display: 'block', marginBottom: 12 }}>MODULE {m.n}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS ── */}
      <section id="resultats" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Ce qu'ils en pensent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: 'linear-gradient(135deg, rgba(121,103,255,0.05) 0%, transparent 100%)', borderRadius: 20, padding: 32, border: '1px solid rgba(121,103,255,0.1)' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#7967FF" color="#7967FF" />)}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>"{t.quote}"</p>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{t.city} · <span style={{ color: '#34C759', fontWeight: 700 }}>{t.result}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Questions fréquentes</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Tout ce que vous devez savoir avant de nous rejoindre.</p>
          </div>
          <div style={{ background: '#111', borderRadius: 20, padding: '8px 32px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {FAQS.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTIE ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(52,199,89,0.05) 0%, transparent 100%)', borderRadius: 24, padding: '48px 40px', border: '1px solid rgba(52,199,89,0.2)', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,199,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={40} color="#34C759" />
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#34C759' }}>Garantie 100% Satisfait ou Remboursé</h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Testez la formation pendant 14 jours. Si vous n'êtes pas absolument convaincu par la valeur du programme, nous vous remboursons intégralement, sans poser de questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSCRIPTION ── */}
      <section id="inscription" style={{ padding: '80px 24px 120px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#7967FF', borderRadius: 24, padding: '56px 40px', textAlign: 'center', boxShadow: '0 40px 100px rgba(121,103,255,0.3)' }}>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Rejoindre la session</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 40, fontSize: 16 }}>Prêt à changer de dimension ? Réservez votre place pour la session du 15 Juin.</p>

          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 40, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>Prix de la formation</span>
              <span style={{ fontSize: 14, textDecoration: 'line-through', opacity: 0.6 }}>450 000 FCFA</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Tarif exceptionnel</span>
              <span style={{ fontSize: 28, fontWeight: 900 }}>195 000 FCFA</span>
            </div>
          </div>

          <a href="https://wa.me/237694086571?text=Bonjour%20Ozirus%2C%20je%20souhaiterais%20avoir%20plus%20d%27informations%20sur%20votre%20formation%20%27Vendre%20avec%20l%27IA%27." target="_blank" rel="noreferrer" style={{ display: 'block', background: '#fff', color: '#7967FF', padding: '18px', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', marginBottom: 20 }}>Réserver via WhatsApp</a>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Paiement sécurisé via Mobile Money (Orange/MTN) ou Virement.</p>
        </div>
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
