'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Play, Clock, Users, Star,
  TrendingUp, Shield, Zap, BookOpen, Award, ChevronDown,
  Code2, Layers, Clapperboard, Package, UserRound,
} from 'lucide-react';
import { useMainSiteHref } from '@/lib/useMainSiteHref';

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

// 4 semaines en groupe, 2 modules par semaine, puis une semaine en 1:1 (voir ONE_TO_ONE).
const MODULES = [
  { week: 1, n: '01', title: 'Les outils IA qui rapportent', desc: 'Claude, ChatGPT, Cursor, générateurs d\'images et de vidéos : le kit de base, les bons prompts et le workflow pour produire 5 fois plus vite.' },
  { week: 1, n: '02', title: 'Coder avec l\'IA', desc: 'Sites vitrines, landing pages, petites apps : livrer en quelques jours ce qui prenait des semaines, même sans être ingénieur.' },
  { week: 2, n: '03', title: 'Vendre du développement', desc: 'Trouver ses premiers clients, chiffrer un site ou une app, cadrer le périmètre et livrer sans dépassement.' },
  { week: 2, n: '04', title: 'Lancer un micro-SaaS', desc: 'De l\'idée à un produit en ligne avec abonnement et paiement Mobile Money. Comment trouver ses premiers utilisateurs payants.' },
  { week: 3, n: '05', title: 'Motion design avec l\'IA', desc: 'Vidéos promo, pubs pour les réseaux, logos animés : produire des contenus pro avec l\'IA, sans studio ni matériel coûteux.' },
  { week: 3, n: '06', title: 'Vendre la vidéo aux entreprises', desc: 'Les offres qui marchent auprès des PME : vidéo de lancement, packs de contenus mensuels, contrats récurrents.' },
  { week: 4, n: '07', title: 'Packager son offre', desc: 'Transformer une compétence en produit à prix fixe : nom, périmètre, livrables, délai, prix. Exactement comme nos offres Ozirus.' },
  { week: 4, n: '08', title: 'Vendre et encaisser', desc: 'Landing page, prospection WhatsApp, appel de closing, paiement en plusieurs fois : le système pour signer et encaisser.' },
];

const WEEK_THEMES: Record<number, string> = {
  1: 'Fondations & code',
  2: 'Dev & SaaS',
  3: 'Motion design',
  4: 'Packaging & vente',
};

const ONE_TO_ONE = [
  'Choix de votre modèle : code, SaaS, motion design ou un mix',
  'Construction de votre offre packagée avec vous (prix, livrables, délai)',
  'Revue de votre landing page et de votre message de prospection',
  'Simulation d\'un appel de vente et corrections',
  'Plan d\'action sur 90 jours avec objectifs chiffrés',
];

const FAQS = [
  { q: "Est-ce que j'ai besoin de savoir coder ?", a: "Non. Le module code part de zéro : l'IA écrit l'essentiel, vous apprenez à la piloter, à vérifier et à livrer. Si vous codez déjà, vous irez beaucoup plus vite et vous pourrez viser le SaaS." },
  { q: "Faut-il choisir entre code, SaaS et motion design ?", a: "Vous voyez les trois pendant le mois pour savoir ce qui vous correspond. Pendant la semaine en 1:1, on choisit ensemble votre modèle et on construit votre offre autour de lui." },
  { q: "Comment se déroule la formation ?", a: "4 semaines en groupe : sessions live chaque semaine (enregistrées), exercices pratiques et suivi sur le groupe privé. Puis 1 semaine de coaching individuel : des appels en tête-à-tête pour construire et lancer votre offre." },
  { q: "Comment fonctionne le paiement en 3 fois ?", a: "Le total est de 100 000 FCFA, payable en une fois ou en 3 versements pendant le mois de formation : 40 000 FCFA à l'inscription, 30 000 FCFA à J+10, 30 000 FCFA à J+20. Orange Money, MTN Mobile Money, Wave ou virement." },
  { q: "Est-ce adapté si j'ai déjà un emploi ?", a: "Oui. Comptez 5 à 7 heures par semaine. Les lives sont enregistrés et les créneaux de la semaine en 1:1 se calent sur votre emploi du temps." },
  { q: "Quel matériel faut-il ?", a: "Un ordinateur et une connexion internet. Les outils utilisés ont des versions gratuites ; on vous indique les quelques abonnements utiles quand ils deviennent rentables." },
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

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const t = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
      {timeLeft.d}j {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
    </span>
  );
}

function NeonButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(121,103,255,0.5)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 40px',
        borderRadius: 14,
        background: 'linear-gradient(135deg, #7967FF 0%, #6654F0 100%)',
        color: '#fff',
        fontSize: 18,
        fontWeight: 700,
        textDecoration: 'none',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(121,103,255,0.3)',
      }}
    >
      {/* Subtle shine effect */}
      <motion.div
        animate={{
          left: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1
        }}
        style={{
          position: 'absolute',
          top: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
        {children}
      </span>
    </motion.a>
  );
}

export default function FormationPage() {
  const siteHref = useMainSiteHref();
  const [now, setNow] = useState<Date | null>(null);
  
  useEffect(() => {
    setNow(new Date());
  }, []);

  // Configuration de la session
  const config = {
    prix: '100 000',
    // Trois versements étalés sur le mois de formation (total = prix).
    versements: [
      { montant: '40 000', quand: 'à l\'inscription' },
      { montant: '30 000', quand: 'à J+10' },
      { montant: '30 000', quand: 'à J+20' },
    ],
    placesTotales: 25,
    placesPrises: 14,
    prochaineSession: new Date(2026, 10, 2), // 2 novembre 2026
  };

  const placesRestantes = config.placesTotales - config.placesPrises;
  // Date formatée à la main plutôt que via Intl : rendu identique côté serveur et navigateur.
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const s = config.prochaineSession;
  const dateSessionCourte = `${s.getDate()} ${MOIS[s.getMonth()]}`;
  const dateSessionStr = `${dateSessionCourte} ${s.getFullYear()}`;

  return (
    <main style={{ background: '#0A0A0F', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .fo-navlink { color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; text-decoration: none; transition: color .15s; }
        .fo-navlink:hover { color: #fff; }
        @media (max-width: 720px) { .fo-nav { display: none !important; } }
      `}</style>

      {/* ── HEADER (autonome : la page vit sur formation.ozirus.agency) ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <a href="#" aria-label="Haut de page" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA', padding: '3px 8px', borderRadius: 6, background: 'rgba(121,103,255,0.12)', border: '1px solid rgba(121,103,255,0.25)' }}>Formation</span>
          </a>
          <nav className="fo-nav" style={{ display: 'flex', gap: 28 }}>
            {[['#programme', 'Programme'], ['#resultats', 'Résultats'], ['#faq', 'FAQ']].map(([href, label]) => (
              <a key={href} href={href} className="fo-navlink">{label}</a>
            ))}
          </nav>
          <a href="#inscription" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 18px', borderRadius: 10, background: '#7967FF', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(121,103,255,0.3)' }}>
            Réserver ma place
          </a>
        </div>
      </header>

      {/* ── URGENCE BAR ── */}
      <div style={{ background: 'linear-gradient(90deg, #7967FF, #6654F0)', padding: '10px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
          ⚡ Session du {dateSessionStr} — <span style={{ opacity: 0.85 }}>Il ne reste que</span> <strong>{placesRestantes} places</strong> <span style={{ opacity: 0.85 }}>sur {config.placesTotales} — Fermeture dans</span>{' '}
          {now && <Countdown targetDate={config.prochaineSession} />}
        </p>
      </div>

      {/* ── HERO VSL ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 64px' }}>
        <LineGrid />
        <div aria-hidden style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(121,103,255,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 20 }}>
              Formation · Gagner de l'argent avec l'IA
            </p>
            <h1 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 5rem)', lineHeight: 0.98, letterSpacing: '-0.025em', color: '#fff', marginBottom: 24 }}>
              Gagnez de l&apos;argent
              <br />
              <span style={{ background: 'linear-gradient(135deg, #7967FF 0%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                avec l&apos;IA.
              </span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 640, margin: '0 auto 28px' }}>
              <strong style={{ color: '#fff' }}>1 mois</strong> pour apprendre à vendre du code, lancer un SaaS et produire du motion design avec l&apos;IA, puis <strong style={{ color: '#fff' }}>packager votre propre offre</strong>. Suivi d&apos;<strong style={{ color: '#fff' }}>1 semaine de coaching en tête-à-tête</strong> pour la lancer.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              {[
                { icon: Code2, label: 'Code' },
                { icon: Layers, label: 'SaaS' },
                { icon: Clapperboard, label: 'Motion design' },
                { icon: Package, label: 'Packaging' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 99, background: 'rgba(121,103,255,0.08)', border: '1px solid rgba(121,103,255,0.25)', fontSize: 14, fontWeight: 600 }}>
                  <Icon size={15} color="#A78BFA" /> {label}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 40 }}>
              <strong style={{ color: '#fff', fontSize: 17 }}>{config.prix} FCFA</strong> · payable en 3 fois sur le mois
            </p>
          </motion.div>

          {/* ── VIDEO ── */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ 
              position: 'relative', 
              borderRadius: 24, 
              overflow: 'hidden', 
              aspectRatio: '16/9', 
              background: '#0A0A0F', 
              border: '1.5px solid rgba(121,103,255,0.2)', 
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(121,103,255,0.1)', 
              marginBottom: 48 
            }}>
            
            <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
              <DotGrid />
            </div>

            {/* Gradient overlay */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(160deg, rgba(121,103,255,0.15) 0%, rgba(10,10,15,0.7) 100%)' 
            }} />

            {/* Play button */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, zIndex: 2 }}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  width: 80, height: 80, borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', 
                  boxShadow: '0 0 50px rgba(121,103,255,0.3)',
                }}>
                <Play size={32} fill="#fff" color="#fff" style={{ marginLeft: 5 }} />
              </motion.div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Découvrir le programme en vidéo</p>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <NeonButton href="#inscription">
              Réserver ma place maintenant
              <ArrowRight size={20} />
            </NeonButton>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `hsl(${250 + i * 20}, 70%, 60%)`,
                      border: '2px solid #0A0A0F',
                      marginLeft: i === 1 ? 0 : -10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {['A', 'M', 'K', 'S'][i - 1]}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}
                />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                  <strong style={{ color: '#fff' }}>{config.placesPrises} entrepreneurs</strong> déjà inscrits
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POUR QUI ? ── */}
      <section style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Cette formation est pour vous si...</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { t: 'Étudiants & débutants', b: 'Vous voulez une compétence qui se vend tout de suite : sites, apps, vidéos, sans années d\'études.' },
              { t: 'Freelances & créatifs', b: 'Vous codez ou faites du design et voulez produire plus vite avec l\'IA, et facturer plus cher.' },
              { t: 'Salariés en reconversion', b: 'Vous voulez construire une source de revenus en parallèle de votre job, avec une offre claire à vendre.' },
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
            <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 28, fontWeight: 600, marginBottom: 32, maxWidth: 500 }}>Pourquoi se lancer avec l'IA maintenant ?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
              {[
                { t: 'Une personne = un studio', b: 'Avec l\'IA, une seule personne livre un site, une app ou une vidéo pro en quelques jours.' },
                { t: 'Demande en hausse', b: 'Les PME veulent être en ligne, vendre sur les réseaux et automatiser : il manque des gens pour le faire.' },
                { t: 'Investissement minimal', b: 'Un ordinateur et une connexion. Pas de stock, pas de local, pas de matériel coûteux.' },
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
              <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 24 }}>Tout ce qu'il vous faut pour réussir.</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 32 }}>Pas juste des cours : les outils, les templates et l'accompagnement pour transformer ce que vous apprenez en une offre que vous vendez.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  '4 semaines de formation en groupe, lives enregistrés',
                  '1 semaine de coaching individuel en tête-à-tête',
                  'Templates de code, de SaaS et de projets motion design',
                  'Modèles de devis, contrats et fiches d\'offre packagée',
                  'Scripts de prospection WhatsApp et de closing',
                  'Accès à vie au groupe privé et certificat Ozirus',
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
                <p style={{ fontWeight: 800, fontSize: 18 }}>{config.prix} FCFA, tout compris</p>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>1 mois de formation + 1 semaine en 1:1. Payable en 3 fois :</p>
              <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
                {config.versements.map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Versement {i + 1} · {v.quand}</span>
                    <strong>{v.montant} F</strong>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />
              <a href="#inscription" style={{ display: 'block', textAlign: 'center', background: '#fff', color: '#7967FF', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Réserver ma place</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ── */}
      <section id="programme" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Le programme complet</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto' }}>4 semaines en groupe, 8 modules pratiques, puis 1 semaine en tête-à-tête pour lancer votre offre.</p>
          </div>
          <div style={{ display: 'grid', gap: 32 }}>
            {[1, 2, 3, 4].map(week => (
              <div key={week}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                  <span style={{ color: '#7967FF' }}>Semaine {week}</span> · {WEEK_THEMES[week]}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                  {MODULES.filter(m => m.week === week).map(m => (
                    <div key={m.n} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#7967FF', display: 'block', marginBottom: 12 }}>MODULE {m.n}</span>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{m.title}</h3>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: 'linear-gradient(135deg, rgba(121,103,255,0.14) 0%, rgba(121,103,255,0.03) 100%)', border: '1px solid rgba(121,103,255,0.35)', borderRadius: 20, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <UserRound size={22} color="#A78BFA" />
                <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span style={{ color: '#A78BFA' }}>Semaine 5</span> · Coaching 1:1
                </p>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Une semaine en tête-à-tête pour lancer votre offre</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {ONE_TO_ONE.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} color="#7967FF" style={{ marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS ── */}
      <section id="resultats" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Ce qu'ils en pensent</h2>
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
            <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Questions fréquentes</h2>
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
          <h2 style={{ fontFamily: 'var(--font-display-loaded), Clash Display, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 16 }}>Rejoindre la session</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 40, fontSize: 16 }}>Réservez votre place pour la session du {dateSessionCourte}.</p>

          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 40, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Formation complète</span>
              <span style={{ fontSize: 28, fontWeight: 900, whiteSpace: 'nowrap' }}>{config.prix} FCFA</span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 18 }}>1 mois en groupe + 1 semaine de coaching 1:1</p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Ou en 3 versements</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {config.versements.map((v, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                  <p style={{ fontSize: 15, fontWeight: 800 }}>{v.montant} F</p>
                  <p style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{v.quand}</p>
                </div>
              ))}
            </div>
          </div>

          <a href="https://wa.me/237694086571?text=Bonjour%20Ozirus%2C%20je%20souhaiterais%20avoir%20plus%20d%27informations%20sur%20votre%20formation%20%27Gagner%20de%20l%27argent%20avec%20l%27IA%27%20(100%20000%20FCFA%2C%20payable%20en%203%20fois)." target="_blank" rel="noreferrer" style={{ display: 'block', background: '#fff', color: '#7967FF', padding: '18px', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', marginBottom: 20 }}>Réserver via WhatsApp</a>
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
            <Link href={siteHref('/')} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Accueil</Link>
            {/* Produits IA masqué pour l'instant
            <Link href={siteHref('/produits-ia')} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Produits IA</Link> */}
            <Link href={siteHref('/terms')} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Conditions</Link>
            <Link href={siteHref('/privacy')} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Confidentialité</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
