'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, X, Menu } from 'lucide-react';

interface NavAnchor { label: string; href: string }

interface Props {
  anchors?: NavAnchor[];
  ctaLabel?: string;
  ctaHref?: string;
  dark?: boolean;
  onContactClick?: () => void;
}

const PAGES = [
  { href: '/',             label: 'Accueil PME' },
  { href: '/produits-ia',  label: 'Produits IA' },
  { href: '/formation-ia', label: 'Formation' },
  { href: '/dev',          label: 'Studio Dev' },
];

export default function SharedNav({ anchors: propAnchors, ctaLabel: propCtaLabel, ctaHref: propCtaHref, dark: propDark = false, onContactClick }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorsOpen, setAnchorsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /* ── auto-config based on route ── */
  const config = {
    anchors: propAnchors,
    ctaLabel: propCtaLabel || 'Diagnostic gratuit',
    ctaHref: propCtaHref || '#contact',
    dark: propDark,
  };

  if (!propAnchors) {
    if (pathname === '/') {
      config.anchors = [
        { label: 'Secteurs', href: '#secteurs' },
        { label: 'Processus', href: '#processus' },
        { label: 'Tarifs', href: '#tarifs' },
        { label: 'Contact', href: '#contact' },
      ];
    } else if (pathname === '/produits-ia') {
      config.anchors = [
        { label: 'Produits IA', href: '#produits' },
        { label: 'Formation',   href: '#formation' },
        { label: 'Contact',     href: '#contact' },
      ];
      config.ctaLabel = 'Lancer mon agence IA';
      config.ctaHref = '/formation-ia';
    } else if (pathname === '/formation-ia') {
      config.anchors = [
        { label: 'Programme', href: '#programme' },
        { label: 'Résultats',  href: '#resultats' },
        { label: 'Inscription', href: '#inscription' },
      ];
      config.ctaLabel = 'Réserver ma place';
      config.ctaHref = '#inscription';
      config.dark = true;
    } else if (pathname === '/dev') {
      config.anchors = [
        { label: 'Offres', href: '#offres' },
        { label: 'Processus', href: '#processus' },
        { label: 'Réalisations', href: '#realisations' },
        { label: 'Contact', href: '#contact' },
      ];
      config.ctaLabel = 'Démarrer un projet';
      config.ctaHref = '#contact';
    }
  }

  const { anchors, ctaLabel, ctaHref, dark } = config;

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#contact' && onContactClick) {
      e.preventDefault();
      onContactClick();
      setDropdownOpen(false);
      setMenuOpen(false);
    }
  };

  /* ── responsive detection ── */
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* close menu on resize to desktop */
  useEffect(() => {
    if (!isMobile && !isTablet) setMenuOpen(false);
  }, [isMobile, isTablet]);

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) setAnchorsOpen(false);
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (pathname.startsWith('/admin')) return null;

  /* ── theme tokens ── */
  const textColor     = dark ? 'rgba(255,255,255,0.6)' : '#555';
  const borderColor   = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const bgColor       = dark ? 'rgba(10,10,15,0.92)' : 'rgba(255,255,255,0.92)';
  const dropdownBg    = dark ? '#1A1A2E' : '#fff';
  const dropdownBorder = dark ? 'rgba(121,103,255,0.25)' : '#EDEAFF';
  const dropdownItemColor = dark ? 'rgba(255,255,255,0.7)' : '#444';
  const separatorColor = dark ? 'rgba(255,255,255,0.1)' : '#E8E6FF';
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
  const drawerActiveLinkColor = dark ? '#fff' : '#0F172A';
  const drawerSectionLabel = dark ? 'rgba(255,255,255,0.3)' : '#bbb';

  const showBurger = isMobile || isTablet;

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${borderColor}`,
        background: bgColor, backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
        }}>
          {/* logo */}
          <a href="/" style={{ flexShrink: 0 }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 30, filter: logoFilter }} />
          </a>

          {/* desktop / tablet nav (hidden on mobile) */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>

              {/* dropdown "Sur cette page" — always shown on tablet and desktop */}
              {anchors && anchors.length > 0 && (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 500, color: textColor,
                      transition: 'color 0.15s', padding: 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#7967FF')}
                    onMouseLeave={e => (e.currentTarget.style.color = dropdownOpen ? '#7967FF' : textColor)}
                  >
                    Sur cette page
                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                      background: dropdownBg, border: `1.5px solid ${dropdownBorder}`, borderRadius: 12,
                      boxShadow: '0 8px 32px rgba(121,103,255,0.12)',
                      minWidth: 200, padding: '6px 0', zIndex: 100,
                    }}>
                      {anchors.map(a => (
                        <a
                          key={a.href}
                          href={a.href}
                          onClick={(e) => handleAnchorClick(e, a.href)}
                          style={{
                            display: 'block', padding: '9px 18px',
                            fontSize: 13, fontWeight: 500, color: dropdownItemColor,
                            textDecoration: 'none', transition: 'background 0.12s, color 0.12s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(121,103,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#7967FF'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = dropdownItemColor; }}
                        >
                          {a.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {anchors && anchors.length > 0 && !isTablet && (
                <span style={{ width: 1, height: 16, background: separatorColor }} />
              )}

              {/* page links — hidden on tablet (too many) */}
              {!isTablet && PAGES.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <a
                    key={href}
                    href={href}
                    style={{
                      color: isActive ? '#7967FF' : textColor,
                      textDecoration: 'none', fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      transition: 'color 0.15s', whiteSpace: 'nowrap',
                      position: 'relative',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#7967FF')}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? '#7967FF' : textColor)}
                  >
                    {label}
                    {isActive && (
                      <span style={{
                        position: 'absolute', bottom: -4, left: 0, right: 0,
                        height: 2, borderRadius: 99, background: '#7967FF',
                      }} />
                    )}
                  </a>
                );
              })}
            </nav>
          )}

          {/* right side: CTA (desktop only) + burger (mobile & tablet) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* CTA desktop — hidden on mobile/tablet */}
            {!showBurger && (
              <a
                href={ctaHref}
                onClick={(e) => handleAnchorClick(e, ctaHref)}
                style={{
                  background: '#7967FF', color: '#fff', padding: '10px 20px',
                  borderRadius: 8, fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', transition: 'background 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}
              >
                {ctaLabel}
              </a>
            )}

            {/* burger button — mobile & tablet */}
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

      {/* ── Mobile / Tablet full-screen drawer ── */}
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
            <div style={{ flex: 1, padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* section "Sur cette page" — collapsible on mobile */}
              {anchors && anchors.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <button
                    onClick={() => setAnchorsOpen(!anchorsOpen)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'none', border: 'none', padding: 0, marginBottom: 8, cursor: 'pointer',
                    }}
                  >
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: drawerSectionLabel, margin: 0 }}>
                      Sur cette page
                    </p>
                    <ChevronDown size={14} color={drawerSectionLabel} style={{ transition: 'transform 0.2s', transform: anchorsOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 2,
                    overflow: 'hidden', transition: 'max-height 0.3s ease-in-out, opacity 0.2s',
                    maxHeight: anchorsOpen ? 500 : 0,
                    opacity: anchorsOpen ? 1 : 0,
                  }}>
                    {anchors.map(a => (
                      <a
                        key={a.href}
                        href={a.href}
                        onClick={(e) => {
                          handleAnchorClick(e, a.href);
                          if (a.href !== '#contact') setMenuOpen(false);
                        }}
                        style={{
                          display: 'block', padding: '12px 14px',
                          fontSize: 15, fontWeight: 500, color: drawerLinkColor,
                          textDecoration: 'none', borderRadius: 8,
                          transition: 'background 0.12s, color 0.12s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(121,103,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#7967FF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = drawerLinkColor; }}
                      >
                        {a.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* separator */}
              {anchors && anchors.length > 0 && (
                <div style={{ height: 1, background: drawerBorder, marginBottom: 24 }} />
              )}

              {/* pages navigation */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: drawerSectionLabel, marginBottom: 8 }}>
                  Pages
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {PAGES.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                      <a
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'block', padding: '12px 14px',
                          fontSize: 15, fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#7967FF' : drawerLinkColor,
                          textDecoration: 'none', borderRadius: 8,
                          background: isActive ? 'rgba(121,103,255,0.08)' : 'transparent',
                          transition: 'background 0.12s, color 0.12s',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(121,103,255,0.06)';
                            (e.currentTarget as HTMLElement).style.color = drawerActiveLinkColor;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = drawerLinkColor;
                          }
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
              <div style={{ height: 1, background: drawerBorder, marginBottom: 24 }} />

              {/* CTA */}
              <a
                href={ctaHref}
                onClick={(e) => {
                  handleAnchorClick(e, ctaHref);
                  if (ctaHref !== '#contact') setMenuOpen(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#7967FF', color: '#fff',
                  padding: '14px 20px', borderRadius: 8,
                  fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(121,103,255,0.3)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}
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
