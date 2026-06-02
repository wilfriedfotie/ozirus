'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, CheckCircle, User, Briefcase, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Pour activer l'envoi réel, remplace 'YOUR_FORMSPREE_ID' par ton ID Formspree
      // Crée un compte sur https://formspree.io/ pour obtenir ton ID gratuitement
      const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; 

      if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
         // Simulation si l'ID n'est pas renseigné
         await new Promise(resolve => setTimeout(resolve, 1500));
         console.log('Simulation: Email prêt à être envoyé via Formspree', form);
      } else {
         const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               name: form.name,
               email: form.email,
               company: form.company,
               message: form.message,
               _subject: `Nouveau message de ${form.name} (Ozirus Agency)`
            })
         });

         if (!response.ok) throw new Error('Erreur lors de l\'envoi');
      }

      setStatus('success');
      setForm({ name: '', email: '', company: '', message: '' });
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Email send error:', error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={overlayStyle}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={modalStyle}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} style={closeBtnStyle}>
              <X size={20} />
            </button>

            {status === 'success' ? (
              <div style={successContainerStyle}>
                <div style={successIconStyle}>
                  <CheckCircle size={40} color="#22C55E" />
                </div>
                <h2 style={titleStyle}>Message Envoyé !</h2>
                <p style={subtitleStyle}>
                  Merci {form.name.split(' ')[0]}, nous avons bien reçu votre demande. 
                  L'équipe Ozirus vous répondra sous 24h à l'adresse {form.email}.
                </p>
                <button onClick={onClose} style={primaryBtnStyle}>Fermer</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={titleStyle}>Parlons de votre projet</h2>
                  <p style={subtitleStyle}>
                    Décrivez-nous votre besoin. Nous reviendrons vers vous avec une approche sur mesure.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}><User size={14} /> Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Jean Kamdem"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div style={inputGroupStyle}>
                    <label style={labelStyle}><Mail size={14} /> Email professionnel</label>
                    <input
                      type="email"
                      required
                      placeholder="jean@entreprise.cm"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div style={inputGroupStyle}>
                    <label style={labelStyle}><Briefcase size={14} /> Entreprise</label>
                    <input
                      type="text"
                      placeholder="Nom de votre structure"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div style={inputGroupStyle}>
                    <label style={labelStyle}><MessageSquare size={14} /> Votre message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'none' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    style={{ ...primaryBtnStyle, marginTop: 8, opacity: status === 'sending' ? 0.7 : 1 }}
                  >
                    {status === 'sending' ? 'Envoi en cours...' : 'Envoyer mon message'}
                    <Send size={18} style={{ marginLeft: 8 }} />
                  </button>

                  {status === 'error' && (
                    <p style={{ color: '#EF4444', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
                      Une erreur est survenue. Veuillez réessayer ou nous contacter à info.ozirus@gmail.com
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(15, 23, 42, 0.8)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const modalStyle: React.CSSProperties = {
  background: '#FFF',
  width: '100%',
  maxWidth: 480,
  borderRadius: 24,
  padding: 40,
  position: 'relative',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 24,
  right: 24,
  background: '#F1F5F9',
  border: 'none',
  width: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#64748B',
  transition: 'all 0.2s',
};

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: '#0F172A',
  fontFamily: 'Clash Display, sans-serif',
  marginBottom: 8,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#64748B',
  lineHeight: 1.6,
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#475569',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const inputStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  border: '1.5px solid #E2E8F0',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
};

const primaryBtnStyle: React.CSSProperties = {
  background: '#7967FF',
  color: '#FFF',
  border: 'none',
  padding: '14px 24px',
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  boxShadow: '0 10px 15px -3px rgba(121, 103, 255, 0.3)',
};

const successContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
};

const successIconStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: '#F0FDF4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 8,
};
