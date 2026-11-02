'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MessageCircle,
} from 'lucide-react';
import SectorCarousel from '@/components/home/SectorCarousel';
import OsStepper from '@/components/home/OsStepper';
import { usePagedScroll } from '@/components/home/usePagedScroll';
import { CAROUSEL } from '@/components/home/sectorStory';
import type { NavTheme } from '@/components/SharedNav';

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: EASE },
});

const openContactModal = () => window.dispatchEvent(new CustomEvent('ozirus:open-contact-modal'));

const WHATSAPP =
  'https://wa.me/237694086571?text=Bonjour%20Ozirus%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20IA%20pour%20mon%20entreprise.';

/* Pages de la home : fond (fondu au changement de page) et thème du texte. */
/* `nav` : thème transmis au header fixe (SharedNav), qui prend la couleur de la page affichée. */
const PAGES: { id: string; label: string; bg: string; dark: boolean; nav: NavTheme }[] = [
  { id: 'accueil', label: 'Accueil', bg: '#FFFFFF', dark: false, nav: { dark: false, bg: 'rgba(255,255,255,0.86)' } },
  { id: 'secteurs', label: 'Secteurs', bg: '#F4F4F5', dark: false, nav: { dark: false, bg: 'rgba(244,244,245,0.86)' } },
  { id: 'services', label: 'Services', bg: '#0A0A0A', dark: true, nav: { dark: true, bg: 'rgba(10,10,10,0.86)' } },
  { id: 'produits', label: 'Produits', bg: '#FFFFFF', dark: false, nav: { dark: false, bg: 'rgba(255,255,255,0.86)' } },
  { id: 'realisations', label: 'Résultats', bg: '#F4F4F5', dark: false, nav: { dark: false, bg: 'rgba(244,244,245,0.86)' } },
  { id: 'contact', label: 'Contact', bg: '#7967FF', dark: true, nav: { dark: true, bg: 'rgba(121,103,255,0.9)', ctaBg: '#fff', ctaColor: '#0A0A0A', accent: '#fff' } },
];

const CAPABILITIES = ['Agents IA', 'WhatsApp Business', 'CRM', 'Gestion de stock', 'Automatisations', 'Applications mobiles', 'Mobile Money', 'Stripe', 'Chatbots', 'Tableaux de bord'];

const SERVICES = [
  { title: 'Intégration IA', body: 'On identifie les tâches où l’IA vous fait gagner du temps, puis on la branche sur vos outils existants.' },
  { title: 'Agents IA & automatisations', body: 'Des assistants qui répondent, vendent et qualifient sur WhatsApp et le web ; relances, devis et reporting qui tournent seuls.' },
  { title: 'Lancement de projets IA', body: 'Vous avez l’idée : on cadre, on prototype et on met en ligne votre produit IA, avec un CTO partenaire.' },
  { title: 'Logiciels sur mesure', body: 'Plateformes web, SaaS et applications mobiles quand aucun outil du marché ne colle à votre métier.' },
];

const METHOD = ['Diagnostic', 'Prototype', 'Mise en production', 'Suivi'];

const STATS = [
  { v: '35+', l: 'PME accompagnées' },
  { v: '280 %', l: 'ROI moyen sur 6 mois' },
  { v: '92 %', l: 'des clients renouvellent' },
];

const CASES = [
  {
    metric: '−42 %',
    metricLabel: 'de pertes de stock',
    title: 'Supérette Bonamoussadi · Commerce',
    body: 'Gestion IA des stocks et alertes WhatsApp automatiques.',
  },
  {
    metric: '+2,8 M FCFA',
    metricLabel: 'par mois',
    title: 'Transformation de manioc · Agroalimentaire',
    body: 'Prédiction des prix du marché et planification de la production.',
  },
];

export default function HomePage() {
  const { active, paged, goTo } = usePagedScroll();
  const [sectorIdx, setSectorIdx] = useState(1);

  const car = CAROUSEL[sectorIdx];
  const page = PAGES[active] ?? PAGES[0];
  // Le header fixe suit la page affichée (couleur), et ses liens d'ancre passent par le même
  // saut animé que la molette en mode paginé.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ozirus:nav-theme', { detail: page.nav }));
  }, [page]);
  useEffect(() => () => { window.dispatchEvent(new CustomEvent('ozirus:nav-theme', { detail: null })); }, []);
  useEffect(() => {
    const onAnchor = (e: Event) => {
      const idx = PAGES.findIndex(p => p.id === (e as CustomEvent<string>).detail);
      if (idx < 0 || !paged) return; // hors mode paginé : saut natif (scroll-padding-top gère le header)
      e.preventDefault();
      goTo(idx);
    };
    window.addEventListener('ozirus:goto-anchor', onAnchor);
    return () => window.removeEventListener('ozirus:goto-anchor', onAnchor);
  }, [paged, goTo]);


  return (
    <main className="ozh" style={{ color: '#0A0A0A' }}>
      {/* Fond global : change de couleur à chaque page (mode paginé, grand écran). */}
      <div aria-hidden className="ozh-backdrop" style={{ background: page.bg }} />

      {/* Indicateur de page (grand écran) */}
      {paged && (
        <nav className="ozh-rail" aria-label="Pages" data-dark={page.dark ? '' : undefined}>
          {PAGES.map((p, i) => (
            <button key={p.id} onClick={() => goTo(i)} aria-current={i === active ? 'true' : undefined} aria-label={p.label}>
              <span className="ozh-rail-label">{p.label}</span>
              <span className="ozh-rail-dot" />
            </button>
          ))}
        </nav>
      )}

      {/* ══ 01 · ACCUEIL ══ */}
      <section id="accueil" data-page className="ozh-page" style={{ ['--page-bg' as string]: PAGES[0].bg }}>
        <div className="ozh-container" style={{ textAlign: 'center' }}>
          <motion.h1
            className="ozh-h1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          >
            L’IA dans votre entreprise.
            <br />
            <span style={{ color: '#7967FF' }}>Ou au cœur de votre projet.</span>
          </motion.h1>
          <motion.p
            className="ozh-lead"
            style={{ margin: '0 auto 36px', maxWidth: 600 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
          >
            Vous dirigez une PME : on identifie avec vous les cas d’usage IA à forte valeur ajoutée, puis on les met en place.
            Vous portez un projet IA : on le conçoit, le développe et le lance avec vous.
          </motion.p>
          <motion.div
            style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
          >
            <button onClick={openContactModal} className="ozh-pill-btn ozh-pill-dark">
              Diagnostic gratuit <ArrowRight size={15} />
            </button>
            <Link href="/mvp" className="ozh-pill-btn ozh-pill-light">
              Lancer mon projet IA
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="ozh-marquee"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="ozh-marquee-track">
            {[...CAPABILITIES, ...CAPABILITIES].map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ 02 · SECTEURS ══ */}
      <section id="secteurs" data-page className="ozh-page" style={{ ['--page-bg' as string]: PAGES[1].bg }}>
        <div className="ozh-container" style={{ textAlign: 'center' }}>
          <motion.div {...reveal(0)}>
            <h2 className="ozh-h2" style={{ marginBottom: 'clamp(28px, 5vh, 48px)' }}>Ce que l’IA change dans votre métier</h2>
          </motion.div>
        </div>
        <motion.div {...reveal(0.1)}>
          <SectorCarousel index={sectorIdx} onChange={setSectorIdx} onSeeTool={() => goTo(3)} />
        </motion.div>
        <div className="ozh-container" style={{ textAlign: 'center', marginTop: 'clamp(24px, 4vh, 40px)' }}>
          <button onClick={openContactModal} className="ozh-pill-btn ozh-pill-dark">
            Parler de mon secteur
          </button>
        </div>
      </section>

      {/* ══ 03 · SERVICES ══ */}
      <section id="services" data-page className="ozh-page ozh-dark" style={{ ['--page-bg' as string]: PAGES[2].bg }}>
        <div className="ozh-container ozh-split">
          <motion.div {...reveal(0)}>
            <h2 className="ozh-h2" style={{ color: '#fff' }}>
              L’IA, intégrée
              <br />
              <span style={{ color: '#A99DFF' }}>sans jargon ni chantier.</span>
            </h2>
            <p className="ozh-lead" style={{ color: '#A3A3A3', maxWidth: 420 }}>
              Pour une entreprise qui veut gagner du temps comme pour un fondateur qui lance son produit : une seule équipe,
              du diagnostic à la mise en production.
            </p>
            <div className="ozh-method">
              {METHOD.map((m, i) => (
                <span key={m}>
                  {i > 0 && <i>→ </i>}
                  {m}
                </span>
              ))}
            </div>
          </motion.div>
          <div>
            {SERVICES.map((s, i) => (
              <motion.div key={s.title} {...reveal(0.06 * i)} className="ozh-service-row">
                <span className="ozh-service-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 500, letterSpacing: '-0.02em', color: '#fff' }}>{s.title}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: '#A3A3A3', margin: '6px 0 0' }}>{s.body}</p>
                </div>
                <ArrowUpRight size={18} className="ozh-service-arrow" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 04 · PRODUITS ══ */}
      <section id="produits" data-page className="ozh-page" style={{ ['--page-bg' as string]: PAGES[3].bg }}>
        <div className="ozh-container">
          <motion.div {...reveal(0)}>
            <OsStepper
              sectorId={car.base}
              business={car.business}
              intro={
                <>
                  <h2 className="ozh-h2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>Ozirus OS</h2>
                  <p className="ozh-lead" style={{ margin: 0 }}>Notre outil de gestion : ventes, stock, finance, clients, équipe et IA, au même endroit.</p>
                </>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ══ 05 · RÉSULTATS ══ */}
      <section id="realisations" data-page className="ozh-page" style={{ ['--page-bg' as string]: PAGES[4].bg }}>
        <div className="ozh-container">
          <motion.div {...reveal(0)} className="ozh-res-head">
            <h2 className="ozh-h2" style={{ margin: 0 }}>Des chiffres, pas des promesses</h2>
            <p className="ozh-lead" style={{ margin: 0, maxWidth: 340 }}>Résultats mesurés chez nos clients, sur leurs propres données.</p>
          </motion.div>

          <div className="ozh-res-grid">
            {/* chiffre phare */}
            <motion.div {...reveal(0)} className="ozh-res-card ozh-res-hero">
              <div className="ozh-res-dots" aria-hidden>
                {Array.from({ length: 84 }, (_, i) => <span key={i} style={{ opacity: ((i * 37) % 11) / 10 }} />)}
              </div>
              <div className="ozh-res-big">{STATS[0].v}</div>
              <div className="ozh-res-label" style={{ color: 'rgba(255,255,255,.85)' }}>{STATS[0].l}</div>
            </motion.div>

            {/* ROI */}
            <motion.div {...reveal(0.06)} className="ozh-res-card">
              <div className="ozh-res-v">{STATS[1].v}</div>
              <div className="ozh-res-label">{STATS[1].l}</div>
              <div className="ozh-res-bars" aria-hidden>
                {[3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10].map((h, c) => (
                  <span key={c}>{Array.from({ length: 10 }, (_, r) => <i key={r} style={{ background: r < h ? '#7967FF' : '#ECEBF5' }} />)}</span>
                ))}
              </div>
            </motion.div>

            {/* renouvellement */}
            <motion.div {...reveal(0.12)} className="ozh-res-card ozh-res-ring-card">
              <svg viewBox="0 0 120 120" className="ozh-res-ring" aria-hidden>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#ECEBF5" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#7967FF" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${0.92 * 314} 314`} transform="rotate(-90 60 60)" />
              </svg>
              <div>
                <div className="ozh-res-v">{STATS[2].v}</div>
                <div className="ozh-res-label">{STATS[2].l}</div>
              </div>
            </motion.div>

            {/* cas clients */}
            {CASES.map((c, i) => (
              <motion.div key={c.title} {...reveal(0.08 * i)} className="ozh-res-card ozh-res-case">
                <span className="ozh-res-tag">{c.title.split(' · ')[1] ?? 'Client'}</span>
                <div className="ozh-res-metric">
                  {c.metric} <span>{c.metricLabel}</span>
                </div>
                <div className="ozh-res-client">{c.title.split(' · ')[0]}</div>
                <p className="ozh-res-desc">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 06 · CONTACT ══ */}
      <section id="contact" data-page className="ozh-page ozh-dark ozh-page-last" style={{ ['--page-bg' as string]: PAGES[5].bg }}>
        <div className="ozh-container" style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div {...reveal(0)}>
            <h2 className="ozh-h1" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)' }}>
              Une entreprise à faire grandir,
              <br />
              un projet IA à lancer&nbsp;?
            </h2>
            <p className="ozh-lead" style={{ color: 'rgba(255,255,255,.8)', margin: '0 auto 32px', maxWidth: 520 }}>
              30 minutes pour comprendre votre besoin et repartir avec un plan clair et chiffré. Gratuit, sans engagement.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={openContactModal} className="ozh-pill-btn" style={{ background: '#fff', color: '#0A0A0A' }}>
                Obtenir mon diagnostic <ArrowRight size={15} />
              </button>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="ozh-pill-btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}>
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
        <footer className="ozh-container ozh-footer">
          <span>© {new Date().getFullYear()} Ozirus Agency</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/terms">Conditions</Link>
            <Link href="/privacy">Confidentialité</Link>
            <a href="mailto:info.ozirus@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} /> info.ozirus@gmail.com
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
