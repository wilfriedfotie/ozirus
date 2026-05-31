'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" style={{ padding: '104px 0', background: '#F8F9FC', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#E4E8EF' }} />

      {/* Glow */}
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(26,86,219,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 36 }}
          >
            <div>
              <p className="section-label">Contact</p>
              <h2 className="heading-lg" style={{ marginBottom: 16 }}>
                Prêt à passer à<br /><span className="text-gradient">l'IA&nbsp;?</span>
              </h2>
              <p className="body-lg">
                Réservez votre audit IA gratuit de 30 minutes. On analyse votre entreprise et on vous propose une solution concrète — sans engagement.
              </p>
            </div>

            {/* Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Analyse complète de vos processus',
                'Identification des gains rapides',
                'Stratégie IA personnalisée',
                'Réponse sous 24h garantie',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle size={16} color="#008751" />
                  <span style={{ fontSize: '0.9375rem', color: '#475569', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 24, borderTop: '1px solid #E4E8EF' }}>
              {[
                { icon: Mail, label: 'contact.fotie@gmail.com', href: 'mailto:contact.fotie@gmail.com' },
                { icon: Phone, label: '+237 678 61 56 77', href: 'tel:+237678615677' },
                { icon: MapPin, label: 'Yaoundé, Cameroun', href: null },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EEF2FF', border: '1.5px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="#1A56DB" />
                    </div>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: '0.875rem', color: '#475569', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#1A56DB')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>{item.label}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Testimonial */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E4E8EF', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 12 }}>⭐</span>)}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, fontStyle: 'italic' }}>
                "Ozirus a divisé notre temps de facturation par 10 grâce à l'IA. Un investissement rentabilisé dès le premier mois."
              </p>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 10 }}>— Directeur, PME Camerounaise</p>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="card" style={{ padding: 32 }}>
              {!sent ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EEF2FF', border: '1.5px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={16} color="#1A56DB" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A', fontFamily: 'Clash Display, sans-serif' }}>Réserver mon audit gratuit</p>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Réponse sous 24h · Sans engagement</p>
                    </div>
                  </div>

                  <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Nom complet</label>
                        <input
                          className="input"
                          required
                          placeholder="Jean Kamdem"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Email professionnel</label>
                        <input
                          className="input"
                          type="email"
                          required
                          placeholder="jean@monentreprise.cm"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Nom de votre entreprise</label>
                      <input
                        className="input"
                        placeholder="Mon Entreprise SARL"
                        value={form.company}
                        onChange={e => setForm({ ...form, company: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Décrivez votre besoin</label>
                      <textarea
                        className="input"
                        rows={4}
                        placeholder="Je cherche à automatiser... / J'ai besoin d'un chatbot pour..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 22px', fontSize: '0.9375rem', marginTop: 6 }}>
                      Envoyer ma demande →
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8' }}>
                      🔒 Vos données sont protégées et ne seront jamais partagées.
                    </p>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E6F4EE', border: '1.5px solid #A7D7BC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={24} color="#008751" />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', fontFamily: 'Clash Display, sans-serif' }}>Demande envoyée !</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: 280, lineHeight: 1.6 }}>
                    Notre équipe vous contacte dans les 24h pour planifier votre audit IA gratuit.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
