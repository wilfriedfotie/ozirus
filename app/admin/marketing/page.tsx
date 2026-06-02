'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Target, TrendingUp, Users, CheckCircle2, Circle, 
  MessageSquare, Phone, Calendar, ArrowRight, Shield,
  Stethoscope, UtensilsCrossed, Building2, GraduationCap
} from 'lucide-react';

/* ─── AUTH CONFIG ─────────────────────────────────── */
const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];

/* ─── DATA CONSTANTS ──────────────────────────────── */
const SECTORS = [
  { id: 'pharma', name: 'Pharmacies', icon: Stethoscope, color: '#10B981', target: '1.0M - 1.5M', goal: 2, pitch: "« Bonjour [Prénom], je vois que vous gérez [Nom Pharmacie]. On aide les pharmacies à automatiser les commandes WhatsApp et la gestion de stocks avec un agent IA. On réduit les pertes de 40 % en 21 jours. Diagnostic gratuit 10 min ? »" },
  { id: 'resto', name: 'Restaurants / Maquis', icon: UtensilsCrossed, color: '#F59E0B', target: '900k - 1.3M', goal: 2, pitch: "« Bonjour, on aide les maquis et restaurants à ne plus rater de commandes WhatsApp et à fidéliser les clients avec un agent IA qui répond 24/7. ROI en 15 jours. Intéressé par un diagnostic gratuit ? »" },
  { id: 'immo', name: 'Agences Immobilières', icon: Building2, color: '#3B82F6', target: '1.2M - 1.8M', goal: 1, pitch: "« Bonjour, optimisez vos visites et le suivi de vos prospects locataires/acheteurs avec un agent IA WhatsApp dédié à l\'immobilier. Qualification automatique 24/7. »" },
  { id: 'ecole', name: 'Écoles & Formation', icon: GraduationCap, color: '#8B5CF6', target: '800k - 1.4M', goal: 1, pitch: "« Bonjour, gérez les inscriptions, relances de paiements et la communication parents d\'élèves automatiquement grâce à l\'IA WhatsApp. »" },
];

const WEEKS = [
  { day: '1-7', title: 'Préparation + Lancement', focus: 'Pharmacies & Restaurants', leads: 80 },
  { day: '8-14', title: 'Accélération', focus: 'Immobilier', leads: 120 },
  { day: '15-21', title: 'Explosion', focus: 'Écoles & Formations', leads: 150 },
  { day: '22-30', title: 'Closing & Cashflow', focus: 'Tous secteurs (Suivi chaud)', leads: 'N/A' },
];

export default function MarketingPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>}>
      <MarketingContent />
    </Suspense>
  );
}

function MarketingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  // Daily To-Do State
  const [todos, setTodos] = useState({
    leadsPharma: false,
    leadsResto: false,
    messagesSent: false,
    callsMade: false,
  });

  const [activeWeek, setActiveWeek] = useState(0);

  // Authorization check
  useEffect(() => {
    let isCancelled = false;
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin/marketing');
      return;
    }

    const verifySession = async () => {
      if (storedAuth === 'true') {
        setIsAuthorized(true);
        return;
      }
      setIsAuthorized(false);
      router.replace('/login');
    };

    verifySession();
    
    // Load Todos
    const savedTodos = localStorage.getItem('ozirus_marketing_todos');
    const lastSavedDate = localStorage.getItem('ozirus_marketing_date');
    const today = new Date().toDateString();
    
    if (savedTodos && lastSavedDate === today) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Reset for a new day
      localStorage.setItem('ozirus_marketing_date', today);
    }

    return () => { isCancelled = true; };
  }, [searchParams, router]);

  // Save Todos on change
  useEffect(() => {
    localStorage.setItem('ozirus_marketing_todos', JSON.stringify(todos));
  }, [todos]);

  const toggleTodo = (key: keyof typeof todos) => {
    setTodos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const progress = Object.values(todos).filter(Boolean).length / Object.values(todos).length * 100;

  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'var(--font-sans, "DM Sans"), sans-serif' }}>
      
      {/* ─── SIDEBAR ─── */}
      <div style={{ width: 320, background: '#0F172A', color: '#FFF', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ padding: 30, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-display, "Clash Display"), sans-serif', color: '#FFF', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={24} color="#7967FF" />
            Ozirus Marketing
          </h1>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8, fontWeight: 600 }}>PLAN D’ACTION 30 JOURS</p>
        </div>

        <div style={{ padding: 30, flex: 1, overflowY: 'auto' }}>
          <div style={{ background: '#1E293B', padding: 24, borderRadius: 16, border: '1px solid rgba(121,103,255,0.2)', marginBottom: 30 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', marginBottom: 8 }}>OBJECTIF GLOBAL</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-display, "Clash Display"), sans-serif', lineHeight: 1 }}>5 000 000</p>
            <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>XAF de CA en 30 jours (6-8 contrats)</p>
          </div>

          <p style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.1em', marginBottom: 15, textTransform: 'uppercase' }}>To-Do du Jour</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TodoItem 
              checked={todos.leadsPharma} 
              onClick={() => toggleTodo('leadsPharma')}
              label="15 Leads Pharmacies" 
              sub="(Google Maps + LinkedIn)" 
            />
            <TodoItem 
              checked={todos.leadsResto} 
              onClick={() => toggleTodo('leadsResto')}
              label="15 Leads Restos/Maquis" 
              sub="(Google Maps + Instagram)" 
            />
            <TodoItem 
              checked={todos.messagesSent} 
              onClick={() => toggleTodo('messagesSent')}
              label="30 Messages DM/WhatsApp" 
              sub="Pitch Secteur Spécifique" 
            />
            <TodoItem 
              checked={todos.callsMade} 
              onClick={() => toggleTodo('callsMade')}
              label="8 Appels / RDV" 
              sub="Zoom ou Présentiel" 
            />
          </div>

          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8 }}>
              <span>Progression Quotidienne</span>
              <span style={{ color: progress === 100 ? '#10B981' : '#7967FF' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: \`\${progress}%\`, background: progress === 100 ? '#10B981' : '#7967FF', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: '#64748B', textAlign: 'center' }}>
          Règles d'or: Google Maps est ton meilleur ami.
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>Les 4 Secteurs Prioritaires</h2>
          <button onClick={() => router.push('/admin')} style={{ padding: '10px 20px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 800, color: '#0F172A', cursor: 'pointer' }}>Retour Admin Docs</button>
        </div>

        {/* Sectors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 50 }}>
          {SECTORS.map(s => (
            <div key={s.id} style={{ background: '#FFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: \`\${s.color}15\`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{s.name}</h3>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Objectif: {s.goal} contrats</p>
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                  {s.target}
                </div>
              </div>
              
              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px dashed #E2E8F0' }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', marginBottom: 8, letterSpacing: '0.05em' }}>PITCH SUGGÉRÉ</p>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5, fontStyle: 'italic' }}>{s.pitch}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-display, "Clash Display"), sans-serif', marginBottom: 24 }}>Timeline des 30 Jours</h2>
        
        <div style={{ display: 'flex', gap: 16 }}>
          {WEEKS.map((w, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveWeek(idx)}
              style={{ 
                flex: 1, 
                padding: 20, 
                borderRadius: 16, 
                cursor: 'pointer',
                background: activeWeek === idx ? '#7967FF' : '#FFF',
                color: activeWeek === idx ? '#FFF' : '#0F172A',
                border: activeWeek === idx ? 'none' : '1px solid #E2E8F0',
                boxShadow: activeWeek === idx ? '0 15px 30px rgba(121,103,255,0.2)' : '0 5px 15px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', opacity: activeWeek === idx ? 0.8 : 0.5, marginBottom: 8 }}>JOURS {w.day}</p>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{w.title}</p>
              <p style={{ fontSize: 12, fontWeight: 600, opacity: activeWeek === idx ? 0.9 : 0.6 }}>Focus: {w.focus}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, background: '#FFF', borderRadius: 20, padding: 30, border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          {activeWeek === 0 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Semaine 1 : Focus 100% Pharmacies & Restos</h3>
              <ul style={{ paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Finaliser les 3 packs d'offres et créer le catalogue WhatsApp Business.</li>
                <li>Créer un compte LinkedIn pro et Instagram "Agence IA".</li>
                <li>Poster 3 contenus (Avant/Après automatisation IA).</li>
                <li>Objectif de fin de semaine : <b>1 contrat signé</b>.</li>
              </ul>
            </div>
          )}
          {activeWeek === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Semaine 2 : Accélération & Immobilier</h3>
              <ul style={{ paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Continuer le suivi de 20 leads Pharmacies/Restos.</li>
                <li>Attaquer 20 nouveaux leads <b>Agences Immobilières</b>.</li>
                <li>Commencer la livraison du premier client (sous-traiter si besoin).</li>
                <li>Objectif de fin de semaine : <b>2 contrats signés</b> (1 Immo + 1 Pharma/Resto).</li>
              </ul>
            </div>
          )}
          {activeWeek === 2 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Semaine 3 : Explosion & Écoles</h3>
              <ul style={{ paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Lancer Facebook Ads (Budget: 200-300k XAF, ciblage Gérants PME).</li>
                <li>Attaquer 15 nouveaux leads <b>Écoles Privées / Centres de formation</b>.</li>
                <li>Demander des témoignages et recommandations aux premiers clients.</li>
                <li>Objectif de fin de semaine : <b>2 contrats signés</b>.</li>
              </ul>
            </div>
          )}
          {activeWeek === 3 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Semaine 4 : Closing Final & Cashflow</h3>
              <ul style={{ paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Mélange équilibré: Suivi très chaud sur les "peut-être".</li>
                <li>8 à 10 rendez-vous par jour pour fermer les deals.</li>
                <li>Livraison des projets, facturation finale et encaissement.</li>
                <li>Objectif final : <b>Dépasser les 5 000 000 XAF</b>.</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function TodoItem({ checked, onClick, label, sub }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        padding: '12px 16px', 
        background: checked ? 'rgba(16, 185, 129, 0.1)' : '#1E293B', 
        borderRadius: 12, 
        cursor: 'pointer',
        border: checked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      {checked ? <CheckCircle2 size={20} color="#10B981" /> : <Circle size={20} color="#64748B" />}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: checked ? '#10B981' : '#FFF', textDecoration: checked ? 'line-through' : 'none' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#64748B' }}>{sub}</span>
      </div>
    </div>
  );
}
