'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { useMainSiteHref } from '@/lib/useMainSiteHref';

interface NavAnchor { label: string; href: string }

/** Thème imposé par la page affichée (événement `ozirus:nav-theme`). */
export interface NavTheme {
  dark: boolean;
  bg: string;
  ctaBg?: string;
  ctaColor?: string;
  accent?: string;
  activeId?: string;
}

interface Props {
  anchors?: NavAnchor[];
  ctaLabel?: string;
  ctaHref?: string;
  dark?: boolean;
  onContactClick?: () => void;
}

const LANDING_ANCHORS: NavAnchor[] = [
  { label: 'Services', href: '#services' },
  { label: 'Produits', href: '#produits' },
  { label: 'Résultats', href: '#realisations' },
];

export default function SharedNav({ anchors: propAnchors, ctaLabel: propCtaLabel, ctaHref: propCtaHref, dark: propDark = false, onContactClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const siteHref = useMainSiteHref();
  // Route réellement rendue (sur un sous-domaine, `pathname` vaut `/` quelle que soit la page).
  const route = segment ? `/${segment}` : pathname;
  const isLanding = route === '/';

  /* ── auto-config based on route ── */
  const config = {
    ctaLabel: propCtaLabel || 'Obtenir mon diagnostic gratuit',
    ctaHref: propCtaHref || '#contact',
    dark: propDark,
  };

  const { ctaLabel, ctaHref } = config;

  // Sur la landing page, exactement 3 ancres de la page courante
  const navLinks = isLanding
    ? (propAnchors ?? LANDING_ANCHORS)
    : [
        { label: 'Accueil', href: siteHref('/') },
        { label: 'Services', href: siteHref('/#services') },
        { label: 'Produits', href: siteHref('/#produits') },
        { label: 'Résultats', href: siteHref('/#realisations') },
      ];

  // Une page peut piloter la couleur de la nav (ex. la home : la nav prend la couleur de la page
  // affichée) via l'événement `ozirus:nav-theme`. Réinitialisé à chaque changement de route.
  const [pageTheme, setPageTheme] = useState<NavTheme | null>(null);
  useEffect(() => {
    setPageTheme(null);
    const onTheme = (e: Event) => setPageTheme((e as CustomEvent<NavTheme | null>).detail);
    window.addEventListener('ozirus:nav-theme', onTheme);
    return () => window.removeEventListener('ozirus:nav-theme', onTheme);
  }, [route]);

  const dark = pageTheme ? pageTheme.dark : config.dark;
  const activeId = pageTheme?.activeId;

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#contact' && onContactClick) {
      e.preventDefault();
      onContactClick();
      setMenuOpen(false);
      return;
    }
    // Ancre de la page : si la page gère elle-même la navigation (home paginée), elle annule
    // l'événement `ozirus:goto-anchor` et on n'effectue pas le saut natif.
    if (href.startsWith('#')) {
      const evt = new CustomEvent('ozirus:goto-anchor', { detail: href.slice(1), cancelable: true });
      if (!window.dispatchEvent(evt)) e.preventDefault();
      setMenuOpen(false);
    }
  };

  /* ── responsive detection ── */
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* close menu on resize to desktop */
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // `segment` suit la route rendue (et non l'URL) : sur mvp.ozirus.agency, l'URL est `/`
  // mais la page rendue est `/mvp`. Les landings sur sous-domaine ont leur propre header.
  if (pathname.startsWith('/admin') || segment === 'mvp' || segment === 'formation-ia' || segment === 'resto' || segment === 'cdc' || segment === 'book') return null;

  /* ── theme tokens ── */
  const textColor     = dark ? 'rgba(255,255,255,0.65)' : '#555';
  const borderColor   = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const bgColor       = pageTheme ? pageTheme.bg : dark ? 'rgba(10,10,15,0.92)' : 'rgba(255,255,255,0.92)';
  const ctaBg         = pageTheme?.ctaBg ?? '#7967FF';
  const accent        = pageTheme?.accent ?? '#7967FF'; // lien actif / survol de la barre
  const ctaColor      = pageTheme?.ctaColor ?? '#fff';
  const logoFilter    = dark
    ? 'brightness(0) invert(1)'
    : 'brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(2126%) hue-rotate(224deg) brightness(101%) contrast(101%)';

  /* burger bar colors */
  const burgerBarBg = dark ? 'rgba(255,255,255,0.85)' : '#0F172A';
  const burgerBtnBg = dark ? 'rgba(255,255,255,0.08)' : '#F1F4F9';
  const burgerBtnBorder = dark ? 'rgba(255,255,255,0.12)' : '#E4E8EF';

  /* mobile drawer colors */
  const drawerBg = dark ? '#0A0A0F' : '#fff';
  const drawerBorder = dark ? 'rgba(255,255,255,0.06)' : '#E4E8EF';
  const drawerLinkColor = dark ? 'rgba(255,255,255,0.7)' : '#475569';
  const drawerSectionLabel = dark ? 'rgba(255,255,255,0.3)' : '#bbb';

  const showBurger = isMobile;

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${borderColor}`,
        background: bgColor, backdropFilter: 'blur(12px)',
        transition: 'background-color .9s cubic-bezier(.22,1,.36,1), border-color .9s',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
        }}>
          {/* logo */}
          <a
            href={isLanding ? '#accueil' : siteHref('/')}
            onClick={e => {
              if (isLanding) handleAnchorClick(e, '#accueil');
            }}
            style={{ flexShrink: 0 }}
          >
            <img src="/logo.png" alt="Ozirus" style={{ height: 30, filter: logoFilter }} />
          </a>

          {/* desktop nav (hidden on mobile) */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
              {navLinks.map(({ href, label }) => {
                const isAnchor = href.startsWith('#');
                const anchorId = isAnchor ? href.slice(1) : null;
                const isActive = anchorId ? activeId === anchorId : false;

                return (
                  <a
                    key={href}
                    href={href}
                    onClick={e => {
                      if (isAnchor) handleAnchorClick(e, href);
                    }}
                    style={{
                      color: isActive ? accent : textColor,
                      textDecoration: 'none', fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      transition: 'color 0.15s', whiteSpace: 'nowrap',
                      position: 'relative',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? accent : textColor)}
                  >
                    {label}
                    {isActive && (
                      <span style={{
                        position: 'absolute', bottom: -4, left: 0, right: 0,
                        height: 2, borderRadius: 99, background: accent,
                      }} />
                    )}
                  </a>
                );
              })}
            </nav>
          )}

          {/* right side: CTA (desktop only) + burger (mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* CTA desktop */}
            {!showBurger && (
              <a
                href={ctaHref}
                onClick={(e) => handleAnchorClick(e, ctaHref)}
                style={{
                  background: ctaBg, color: ctaColor, padding: '10px 20px',
                  borderRadius: 8, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', transition: 'background 0.4s, color 0.4s, opacity 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {ctaLabel}
              </a>
            )}

            {/* burger button — mobile */}
            {showBurger && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuOpen}
                style={{
                  background: burgerBtnBg,
                  border: `1.5px solid ${burgerBtnBorder}`,
                  borderRadius: 8,
                  width: 38, height: 38,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 5, cursor: 'pointer',
                }}
              >
                <span style={{
                  width: 16, height: 1.5, background: burgerBarBg, borderRadius: 1, display: 'block',
                  transition: 'transform 0.2s',
                  transform: menuOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
                }} />
                <span style={{
                  width: 16, height: 1.5, background: burgerBarBg, borderRadius: 1, display: 'block',
                  opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s',
                }} />
                <span style={{
                  width: 16, height: 1.5, background: burgerBarBg, borderRadius: 1, display: 'block',
                  transition: 'transform 0.2s',
                  transform: menuOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
                }} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen drawer ── */}
      {showBurger && menuOpen && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 48,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            }}
          />

          {/* drawer */}
          <div style={{
            position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
            zIndex: 49,
            background: drawerBg,
            borderTop: `1px solid ${drawerBorder}`,
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ flex: 1, padding: '24px 24px 32px', display: 'flex', flexDirection: 'column' }}>

              {/* pages navigation */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: drawerSectionLabel, marginBottom: 12 }}>
                  Sur cette page
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {navLinks.map(({ href, label }) => {
                    const isAnchor = href.startsWith('#');
                    const anchorId = isAnchor ? href.slice(1) : null;
                    const isActive = anchorId ? activeId === anchorId : false;

                    return (
                      <a
                        key={href}
                        href={href}
                        onClick={(e) => {
                          if (isAnchor) handleAnchorClick(e, href);
                          setMenuOpen(false);
                        }}
                        style={{
                          display: 'block', padding: '12px 14px',
                          fontSize: 15, fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#7967FF' : drawerLinkColor,
                          textDecoration: 'none', borderRadius: 8,
                          background: isActive ? 'rgba(121,103,255,0.08)' : 'transparent',
                          transition: 'background 0.12s, color 0.12s',
                        }}
                      >
                        {label}
                        {isActive && (
                          <span style={{
                            display: 'inline-block', marginLeft: 8,
                            width: 6, height: 6, borderRadius: '50%', background: '#7967FF',
                            verticalAlign: 'middle',
                          }} />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* separator before CTA */}
              <div style={{ height: 1, background: drawerBorder, marginBottom: 24, marginTop: 'auto' }} />

              {/* CTA */}
              <a
                href={ctaHref}
                onClick={(e) => {
                  handleAnchorClick(e, ctaHref);
                  setMenuOpen(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#7967FF', color: '#fff',
                  padding: '14px 20px', borderRadius: 8,
                  fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(121,103,255,0.3)',
                  transition: 'background 0.15s',
                }}
              >
                {ctaLabel}
              </a>

            </div>
          </div>
        </>
      )}
    </>
  );
}
