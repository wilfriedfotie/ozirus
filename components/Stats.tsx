'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Rocket, Zap, CheckCircle2, Shield } from 'lucide-react';

const stats = [
  { number: 35, suffix: '+', label: 'PME accompagnées', desc: 'au Cameroun et en Afrique centrale', color: '#1A56DB', bg: '#EEF2FF', icon: <Rocket className="w-8 h-8 text-purple-500" /> },
  { number: 280, suffix: '%', label: 'ROI moyen sur 6 mois', desc: 'sur l\'ensemble de nos projets', color: '#F97316', bg: '#FFF4ED', icon: <Zap className="w-8 h-8 text-primary" /> },
  { number: 92, suffix: '%', label: 'de clients renouvellent', desc: 'notre collaboration chaque année', color: '#008751', bg: '#E6F4EE', icon: <CheckCircle2 className="w-8 h-8 text-green-500" /> },
  { number: 90, suffix: 'j', label: 'Livraison max garantie', desc: 'de l\'idée au lancement produit', color: '#7C3AED', bg: '#F5F3FF', icon: <Shield className="w-8 h-8 text-blue-500" /> },
];

const pillars = [
  { icon: '⚡', title: 'Rapidité d\'exécution', desc: 'Vos premières fonctionnalités livrées en moins de 30 jours.', color: '#F97316', bg: '#FFF4ED' },
  { icon: '🌍', title: 'Expertise locale', desc: 'Nous connaissons le Cameroun, ses contraintes et ses opportunités.', color: '#008751', bg: '#E6F4EE' },
  { icon: '🤖', title: 'IA au cœur de tout', desc: 'Chaque solution intègre l\'IA pour un impact maximal sur votre ROI.', color: '#7C3AED', bg: '#F5F3FF' },
];

function Counter({ end, suffix, color }: { end: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    let startTime: number;
    const isDecimal = end % 1 !== 0;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? Math.round(easeOut * end * 10) / 10 : Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end]);

  return (
    <span ref={ref} style={{
      fontFamily: 'Clash Display, sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1,
      color,
      letterSpacing: '-0.04em',
    }}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section style={{ padding: '104px 0', background: '#F8F9FC' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Nos résultats</p>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            Les chiffres{' '}
            <span className="text-gradient">parlent d&apos;eux-mêmes.</span>
          </h2>
          <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto' }}>
            Pas de promesses vagues. Des résultats concrets, mesurables, obtenus avec nos clients camerounais.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 80,
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E4E8EF',
                borderRadius: 16,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Counter end={stat.number} suffix={stat.suffix} color={stat.color} />
              <p style={{
                fontFamily: 'Clash Display, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#0F172A',
                marginTop: 4,
              }}>{stat.label}</p>
              <p className="body-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <h2 className="heading-md">Pourquoi choisir Ozirus ?</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E4E8EF',
                borderRadius: 16,
                padding: '28px 24px',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: p.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {p.icon}
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'Clash Display, sans-serif',
                  fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: 6,
                }}>{p.title}</h3>
                <p className="body-sm" style={{ lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}