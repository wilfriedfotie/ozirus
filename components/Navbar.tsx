'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Services', id: 'services' },
  { label: 'Secteurs', id: 'secteurs' },
  { label: 'Processus', id: 'process' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid #E4E8EF' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <nav style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>

            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <img 
                src="/logo.png" 
                alt="Ozirus Agency" 
                style={{ 
                  height: 34,
                  filter: 'brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(2126%) hue-rotate(224deg) brightness(101%) contrast(101%)'
                }} 
              />
            </button>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: 'DM Sans, sans-serif',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.color = '#0F172A';
                    (e.target as HTMLButtonElement).style.background = '#F1F4F9';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.color = '#475569';
                    (e.target as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => scrollTo('contact')}
                className="btn-secondary hidden sm:inline-flex"
                style={{ padding: '9px 18px', fontSize: '0.8125rem' }}
              >
                Nous contacter
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="btn-primary"
                style={{ padding: '9px 20px', fontSize: '0.8125rem' }}
              >
                Diagnostic gratuit →
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden"
                style={{
                  background: '#F1F4F9',
                  border: '1.5px solid #E4E8EF',
                  borderRadius: 8,
                  width: 38,
                  height: 38,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  cursor: 'pointer',
                }}
              >
                <span style={{ width: 16, height: 1.5, background: '#0F172A', borderRadius: 1, display: 'block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(3.5px)' : 'none' }} />
                <span style={{ width: 16, height: 1.5, background: '#0F172A', borderRadius: 1, display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
                <span style={{ width: 16, height: 1.5, background: '#0F172A', borderRadius: 1, display: 'block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none' }} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 66, left: 0, right: 0,
              zIndex: 49,
              background: '#FFFFFF',
              borderBottom: '1px solid #E4E8EF',
              padding: '16px 24px 24px',
              boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    fontFamily: 'DM Sans, sans-serif',
                    padding: '12px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => scrollTo('contact')} className="btn-secondary" style={{ justifyContent: 'center' }}>Nous contacter</button>
                <button onClick={() => scrollTo('contact')} className="btn-primary" style={{ justifyContent: 'center' }}>Diagnostic gratuit →</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}