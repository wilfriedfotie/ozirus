'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Plus, Trash2, Printer, 
  Settings, User, FileText, Briefcase, 
  ChevronRight, ArrowLeft, Check, Copy,
  Info, ShieldCheck, Clock, FilePlus,
  Layout, ListChecks, Database, Zap,
  Globe, Shield, Smartphone, Server,
  BarChart3, Target, Rocket
} from 'lucide-react';

/* ─── AUTH CONFIG ─────────────────────────────────── */
const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAIL = 'contact.fotie@gmail.com';
const PRIMARY_COLOR = '#7967FF';
const PRIMARY_LOGO_FALLBACK_FILTER = 'brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(2126%) hue-rotate(224deg) brightness(101%) contrast(101%)';

/* ─── CATALOG DATA ────────────────────────────────── */
const CATALOG = [
  { 
    id: 'dev-mobile', 
    label: 'Application Mobile sur mesure (iOS & Android)', 
    price: 1800000, 
    subs: ['Discovery & UI/UX Design', 'Développement Flutter', 'Dashboard Admin Web', 'Déploiement Stores'] 
  },
  { 
    id: 'dev-saas', 
    label: 'Plateforme SaaS / Logiciel Métier', 
    price: 1500000, 
    subs: ['Analyse des processus', 'Architecture Database', 'Développement Frontend & Backend', 'Hébergement Cloud'] 
  },
  { 
    id: 'ia-chatbot', 
    label: 'Chatbot WhatsApp IA Pro', 
    price: 99000, 
    subs: ['Configuration API WhatsApp Business', 'Entraînement de l\'IA sur vos données', 'Prise de commande automatique', 'Support technique'] 
  },
  { id: 'pack-pme', label: 'Pack PME Automatisée', price: 349000, subs: ['Audit IA initial', 'Chatbot IA Pro', 'Automatisation CRM', 'Formation équipe'] },
];

/* ─── TYPES ───────────────────────────────────────── */
type DocType = 'PROPOSITION COMMERCIALE' | 'FACTURE';
interface LineItem {
  id: string;
  description: string;
  longDescription: string;
  quantity: number;
  unitPrice: number;
  subItems: string[];
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [primaryLogoSrc, setPrimaryLogoSrc] = useState('/logo.png');

  const [docType, setDocType] = useState<DocType>('PROPOSITION COMMERCIALE');
  const [docNumber, setDocNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const [projectContext, setProjectContext] = useState('À la suite de nos échanges, nous avons identifié une opportunité majeure de transformation digitale pour votre structure, visant à automatiser vos opérations et maximiser votre impact sur le marché.');
  const [projectGoals, setProjectGoals] = useState('<ul><li>Optimisation des processus opérationnels</li><li>Amélioration de l\'expérience utilisateur client</li><li>Scalabilité de l\'infrastructure technique</li><li>Sécurisation des données critiques</li></ul>');

  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    let isCancelled = false;
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = logo.naturalWidth;
      canvas.height = logo.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(logo, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = PRIMARY_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isCancelled) {
        setPrimaryLogoSrc(canvas.toDataURL('image/png'));
      }
    };
    logo.src = '/logo.png';

    return () => {
      isCancelled = true;
    };
  }, []);
  const [applyTVA, setApplyTVA] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [acompte, setAcompte] = useState(0);

  const [timeline, setTimeline] = useState('6 à 12 semaines');
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'PROJET' | 'FINANCE' | 'LEGAL'>('CLIENT');
  const [currency, setCurrency] = useState<'FCFA' | '€' | '$'>('FCFA');
  const [isGenerating, setIsGenerating] = useState(false);

  // Authorization check
  useEffect(() => {
    let isCancelled = false;
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin');
      return;
    }

    const verifySession = async () => {
      if (storedAuth === 'true') {
        setIsAuthorized(true);
        return;
      }

      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const session = await response.json();
        const email = session?.user?.email;

        if (!isCancelled && email === ADMIN_ALLOWED_EMAIL) {
          localStorage.setItem('ozirus_admin_auth', 'true');
          setIsAuthorized(true);
          return;
        }
      } catch (err) {
        console.error('Admin session check error:', err);
      }

      if (!isCancelled) {
        setIsAuthorized(false);
        router.replace('/login');
      }
    };

    verifySession();

    return () => {
      isCancelled = true;
    };
  }, [searchParams, router]);

  // Defaults
  useEffect(() => {
    const prefix = docType === 'PROPOSITION COMMERCIALE' ? 'PC' : 'F';
    setDocNumber(`${prefix}-${new Date().getFullYear()}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`);
    const d = new Date(); d.setDate(d.getDate() + 30);
    setValidUntil(d.toISOString().split('T')[0]);
  }, [docType]);

  const addItem = (catalogId: string) => {
    const p = CATALOG.find(x => x.id === catalogId);
    if (!p) return;
    setItems([...items, { 
      id: Math.random().toString(36).substr(2,9), 
      description: p.label, 
      longDescription: `Solution technologique avancée conçue pour offrir performance, fiabilité et une expérience utilisateur optimale.`,
      unitPrice: p.price, 
      quantity: 1, 
      subItems: [...p.subs] 
    }]);
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof LineItem, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  const addSubItem = (itemId: string) => setItems(items.map(i => i.id === itemId ? { ...i, subItems: [...i.subItems, 'Nouvel élément...'] } : i));
  const updateSubItem = (itemId: string, idx: number, val: string) => setItems(items.map(i => i.id === itemId ? { ...i, subItems: i.subItems.map((s, si) => si === idx ? val : s) } : i));
  const removeSubItem = (itemId: string, idx: number) => setItems(items.map(i => i.id === itemId ? { ...i, subItems: i.subItems.filter((_, si) => si !== idx) } : i));

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0), [items]);
  const totalHT = subtotal - discount;
  const tvaAmount = applyTVA ? totalHT * 0.1925 : 0;
  const totalTTC = totalHT + tvaAmount;
  const netAPayer = totalTTC - acompte;

  const formatPrice = (p: number) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(p);
    return currency === 'FCFA' ? `${formatted} FCFA` : `${currency} ${formatted}`;
  };

  const exportToPDF = async () => {
    setIsGenerating(true);
    try {
      const pages = document.querySelectorAll('.a4-page');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          windowWidth: 794, 
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const fileName = `${docType.split(' ')[0]}_${clientCompany || 'OZIRUS'}_${docNumber}.pdf`.replace(/\s+/g, '_');
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF Generation error:", err);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F1F5F9', overflow: 'hidden' }}>
      
      {/* ─── LEFT PANEL: CONFIG ─── */}
      <div style={{ width: 480, background: '#FFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '10px 0 30px rgba(0,0,0,0.02)', zIndex: 10 }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Settings size={20} color="#7967FF" />
              Ozirus Admin
            </h1>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Digital Excellence Framework</p>
          </div>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10 }}>
            <button onClick={() => setDocType('PROPOSITION COMMERCIALE')} style={{ ...tabBtn, background: docType.includes('PROP') ? '#FFF' : 'transparent', color: docType.includes('PROP') ? '#7967FF' : '#64748B' }}>PROP</button>
            <button onClick={() => setDocType('FACTURE')} style={{ ...tabBtn, background: docType === 'FACTURE' ? '#FFF' : 'transparent', color: docType === 'FACTURE' ? '#7967FF' : '#64748B' }}>FACT</button>
          </div>
        </div>

        {/* Local Nav */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid #F1F5F9', gap: 16 }}>
          <button onClick={() => setActiveTab('CLIENT')} style={{ ...subTab, color: activeTab === 'CLIENT' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'CLIENT' ? '#7967FF' : 'transparent' }}><User size={14} /></button>
          <button onClick={() => setActiveTab('PROJET')} style={{ ...subTab, color: activeTab === 'PROJET' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'PROJET' ? '#7967FF' : 'transparent' }}><Layout size={14} /></button>
          <button onClick={() => setActiveTab('FINANCE')} style={{ ...subTab, color: activeTab === 'FINANCE' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'FINANCE' ? '#7967FF' : 'transparent' }}><Briefcase size={14} /></button>
          <button onClick={() => setActiveTab('LEGAL')} style={{ ...subTab, color: activeTab === 'LEGAL' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'LEGAL' ? '#7967FF' : 'transparent' }}><ShieldCheck size={14} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {activeTab === 'CLIENT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={sectionTitle}>Identité Client</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="text" placeholder="Nom du contact" value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Entreprise" value={clientCompany} onChange={e => setClientCompany(e.target.value)} style={inputStyle} />
                  <input type="email" placeholder="Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={inputStyle} />
                  <textarea placeholder="Adresse complète" value={clientAddress} onChange={e => setClientAddress(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
                </div>
              </div>
              <div>
                <p style={sectionTitle}>Document</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} style={inputStyle} />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PROJET' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <p style={sectionTitle}>Vision du projet</p>
                <div style={{ marginBottom: 12 }}>
                   <label style={labelStyle}>Contexte stratégique</label>
                   <RichEditor value={projectContext} onChange={setProjectContext} />
                </div>
                <div>
                   <label style={labelStyle}>Objectifs de performance</label>
                   <RichEditor value={projectGoals} onChange={setProjectGoals} />
                </div>
              </div>
              <div>
                <p style={sectionTitle}>Ingénierie & Services</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <select onChange={(e) => { addItem(e.target.value); e.target.value=''; }} style={{ ...inputStyle, flex: 1 }}>
                    <option value="">+ Catalogue Standard</option>
                    {CATALOG.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <button 
                    onClick={() => setItems([...items, { 
                      id: Math.random().toString(36).substr(2,9), 
                      description: 'Nouveau Module', 
                      longDescription: 'Détails de l\'architecture technique et fonctionnelle...', 
                      unitPrice: 0, 
                      quantity: 1, 
                      subItems: [] 
                    }])}
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '0 12px', color: '#7967FF', fontWeight: 700, fontSize: 20 }}
                  >+</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} style={{ ...inputStyle, fontWeight: 700, flex: 1 }} />
                        <button onClick={() => removeItem(item.id)} style={{ color: '#EF4444' }}><Trash2 size={16} /></button>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <RichEditor value={item.longDescription} onChange={(val) => updateItem(item.id, 'longDescription', val)} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                        {item.subItems.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input type="text" value={s} onChange={e => updateSubItem(item.id, idx, e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: '6px 10px' }} />
                            <button onClick={() => removeSubItem(item.id, idx)} style={{ color: '#94A3B8' }}><Trash2 size={12} /></button>
                          </div>
                        ))}
                        <button onClick={() => addSubItem(item.id)} style={{ fontSize: 11, fontWeight: 700, color: '#7967FF', textAlign: 'left', marginTop: 4 }}>+ Spécificité technique</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                        <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value)||0)} placeholder="Qté" style={inputStyle} />
                        <input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value)||0)} placeholder="Prix" style={inputStyle} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FINANCE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={sectionTitle}>Réglages Financiers</p>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Devise de facturation</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['FCFA', '€', '$'].map(curr => (
                      <button 
                        key={curr} 
                        onClick={() => setCurrency(curr as any)}
                        style={{ 
                          flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          border: '1px solid #E2E8F0', cursor: 'pointer',
                          background: currency === curr ? '#7967FF' : '#FFF',
                          color: currency === curr ? '#FFF' : '#64748B'
                        }}
                      >{curr}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Remise ({currency})</label>
                    <input type="number" value={discount} onChange={e => setDiscount(parseInt(e.target.value)||0)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Acompte perçu</label>
                    <input type="number" value={acompte} onChange={e => setAcompte(parseInt(e.target.value)||0)} style={inputStyle} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={applyTVA} onChange={e => setApplyTVA(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#7967FF' }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Appliquer TVA (19.25%)</span>
                </label>
              </div>
              <div>
                <p style={sectionTitle}>Logistique</p>
                <label style={labelStyle}>Délai de réalisation</label>
                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} style={inputStyle} />
              </div>
            </div>
          )}

          {activeTab === 'LEGAL' && (
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Cadre Juridique Standardisé :</p>
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><b>Retards :</b> Pénalités automatiques de 10% / mois + frais de recouvrement.</li>
                <li><b>IP :</b> Cession totale des droits après apurement du solde.</li>
                <li><b>Démarrage :</b> Versement de l'acompte (50%) requis pour planification.</li>
                <li><b>Service Level :</b> Support prioritaire 90 jours post-déploiement.</li>
              </ul>
            </div>
          )}

        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Total à régler</span>
            <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 18 }}>{formatPrice(netAPayer)}</span>
          </div>
          <button 
            onClick={exportToPDF} 
            disabled={isGenerating}
            style={{ width: '100%', background: '#7967FF', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)', opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? <Clock size={18} className="animate-spin" /> : <Rocket size={18} />}
            {isGenerating ? 'GÉNÉRATION...' : 'GÉNÉRER LE PDF PRO'}
          </button>
        </div>
      </div>

      {/* ─── RIGHT PANEL: PREVIEW ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }} className="no-print">
        
        {/* PAGE 1: COVER */}
        <div className="a4-page">
          <div style={{ height: '100%', border: '1px solid #7967FF', padding: '40mm 20mm', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
             <img src={primaryLogoSrc} alt="Ozirus" style={{ height: 60, filter: primaryLogoSrc === '/logo.png' ? PRIMARY_LOGO_FALLBACK_FILTER : 'none', marginBottom: 60 }} />
             <div style={{ width: 80, height: 4, background: '#7967FF', marginBottom: 40 }} />
             <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', textAlign: 'center', letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{docType}</h2>
             <p style={{ width: '100%', fontSize: 18, color: '#7967FF', fontWeight: 600, marginTop: 10, fontFamily: 'var(--font-display, "Clash Display"), sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Digital Excellence & Intelligent Systems</p>
             
             <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 15 }}>À l'attention de</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{clientCompany || '(Client Corporate)'}</p>
                <p style={{ fontSize: 16, color: '#7967FF', fontWeight: 600, marginTop: 4 }}>{clientName}</p>
             </div>

             <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 100, borderTop: '1px solid #E2E8F0', paddingTop: 20 }}>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>RÉFÉRENCE : {docNumber}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{new Date().getFullYear()} — CONFIDENTIEL</p>
             </div>
          </div>
        </div>

        {/* PAGE 2: METHODOLOGY */}
        <div className="a4-page">
           <Header docType={docType} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />
           <div style={{ marginTop: 40 }}>
              <SectionTitle title="NOTRE MÉTHODOLOGIE : L'APPROCHE OZIRUS" />
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#475569', marginBottom: 30 }}>
                Ozirus Agency déploie des solutions digitales fondées sur des <b>standards technologiques internationaux</b>. Notre approche est conçue pour garantir la pérennité de vos investissements.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                 <MethodoBox step="01" title="DISCOVERY & ARCHITECTURE" text="Analyse approfondie de vos processus métiers et conception d'une architecture technique évolutive (Scalable). Nous ne construisons pas seulement des outils, nous bâtissons votre patrimoine digital." />
                 <MethodoBox step="02" title="AGILE BUILD & CONTINUOUS DELIVERY" text="Développement itératif par cycles de 2 semaines. Vous disposez d'un accès permanent à l'environnement de staging pour valider chaque fonctionnalité en temps réel." />
                 <MethodoBox step="03" title="DEPLOYMENT & SCALE" text="Optimisation des performances et déploiement sur des infrastructures cloud élastiques. Nous assurons l'accompagnement au changement pour garantir l'adoption par vos utilisateurs." />
              </div>

              <div style={{ marginTop: 40 }}>
                <SectionTitle title="TECH STACK & SCALABILITÉ" />
                <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
                   Nous utilisons des technologies de pointe permettant une <b>scalabilité horizontale</b> sans limite, assurant ainsi la stabilité de votre solution lors des pics de charge.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
                   <StackItem icon={<Globe size={14}/>} label="Web Engine" tech="Next.js / React" />
                   <StackItem icon={<Smartphone size={14}/>} label="Native App" tech="Flutter / Swift" />
                   <StackItem icon={<Database size={14}/>} label="Data Core" tech="PostgreSQL / Supabase" />
                   <StackItem icon={<Server size={14}/>} label="Infrastructure" tech="Vercel / AWS" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 40 }}>
                 <div style={guaranteeCard}>
                    <p style={guaranteeTitle}><Shield size={12} style={{marginRight:6}}/> GARANTIES TECHNIQUES</p>
                    <ul style={guaranteeList}>
                       <li><b>Sécurité :</b> Chiffrement de bout-en-bout et conformité RGPD/Data Privacy.</li>
                       <li><b>Disponibilité :</b> SLA de 99.9% sur les infrastructures cloud gérées.</li>
                       <li><b>Transfert :</b> Cession intégrale de la propriété intellectuelle (Code & Assets).</li>
                    </ul>
                 </div>
                 <div style={guaranteeCard}>
                    <p style={guaranteeTitle}><Zap size={12} style={{marginRight:6}}/> PERFORMANCE & SUIVI</p>
                    <ul style={guaranteeList}>
                       <li><b>Real-time Tracking :</b> Accès dédié à votre dashboard de projet (Jira/Linear).</li>
                       <li><b>Direct Channel :</b> Groupe de support dédié (Slack/WhatsApp Corporate).</li>
                       <li><b>Audit :</b> Revue de code et tests d'intrusion avant chaque mise en production.</li>
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* PAGE 3: CONTEXT & SOLUTIONS */}
        <div className="a4-page">
           <Header docType={docType} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />
           
           <div style={{ marginTop: 40 }}>
              <SectionTitle title="1. CONTEXTE STRATÉGIQUE" />
              <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: projectContext }} />
              <div style={{ background: '#F1F5F966', padding: 25, borderRadius: 15, borderLeft: '4px solid #7967FF' }}>
                 <p style={{ fontSize: 10, fontWeight: 900, color: '#7967FF', marginBottom: 12, letterSpacing: '0.1em' }}>OBJECTIFS DE PERFORMANCE :</p>
                 <div style={{ fontSize: 11, lineHeight: 1.8, color: '#0F172A' }} dangerouslySetInnerHTML={{ __html: projectGoals }} />
              </div>
           </div>

           <div style={{ marginTop: 40 }}>
              <SectionTitle title="2. INGÉNIERIE DE LA SOLUTION" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                 {items.map((item, idx) => (
                   <div key={idx} style={{ paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                         <p style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>{idx+1}. {item.description}</p>
                         <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>MODULE {idx+1}</p>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6, marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.longDescription }} />
                      {item.subItems.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: '15px', background: '#F8FAFC', borderRadius: '10px' }}>
                           {item.subItems.map((s, si) => (
                             <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{width:4, height:4, borderRadius:'50%', background:'#7967FF'}}/>
                                <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>{s}</span>
                             </div>
                           ))}
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* PAGE 4: FINANCE */}
        <div className="a4-page">
           <Header docType={docType} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />

           <div style={{ marginTop: 40 }}>
              <SectionTitle title="3. CADRE FINANCIER" />
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #7967FF' }}>
                    <th style={{ textAlign: 'left', padding: '15px 0', fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em' }}>DESCRIPTION</th>
                    <th style={{ textAlign: 'center', padding: '15px 0', fontSize: 10, color: '#94A3B8', width: 60 }}>QTÉ</th>
                    <th style={{ textAlign: 'right', padding: '15px 0', fontSize: 10, color: '#94A3B8', width: 120 }}>UNITÉ ({currency})</th>
                    <th style={{ textAlign: 'right', padding: '15px 0', fontSize: 10, color: '#94A3B8', width: 120 }}>TOTAL ({currency})</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '18px 0', fontSize: 12, fontWeight: 700 }}>{item.description}</td>
                      <td style={{ padding: '18px 0', fontSize: 12, textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '18px 0', fontSize: 12, textAlign: 'right' }}>{formatPrice(item.unitPrice).replace(currency, '').replace('FCFA','').trim()}</td>
                      <td style={{ padding: '18px 0', fontSize: 12, fontWeight: 800, textAlign: 'right' }}>{formatPrice(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 280, background: '#F8FAFC', padding: 25, borderRadius: 15, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 12 }}>
                   <SummaryLine label="Sous-total Brut" value={formatPrice(subtotal)} />
                   {discount > 0 && <SummaryLine label="Remise commerciale" value={`-${formatPrice(discount)}`} color="#EF4444" />}
                   <SummaryLine label="Total HT" value={formatPrice(totalHT)} weight={700} />
                   {applyTVA && <SummaryLine label="TVA (19.25%)" value={formatPrice(tvaAmount)} />}
                   <div style={{ height: 1, background: '#E2E8F0', margin: '5px 0' }} />
                   <SummaryLine label="TOTAL TTC" value={formatPrice(totalTTC)} weight={900} color="#7967FF" size={18} />
                   {acompte > 0 && <SummaryLine label="Acompte versé" value={`-${formatPrice(acompte)}`} color="#22C55E" />}
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, borderTop: '2px solid #7967FF', paddingTop: 12, marginTop: 5 }}>
                      <span>NET À PAYER</span>
                      <span>{formatPrice(netAPayer)}</span>
                   </div>
                </div>
              </div>
           </div>

           <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
              <div>
                 <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', marginBottom: 15, letterSpacing: '0.1em' }}>ÉCHÉANCIER DE PAIEMENT :</p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <PaymentStep step="01" label="Signature & Engagement" percent="50%" />
                    <PaymentStep step="02" label="Validation Prototype / MVP" percent="30%" />
                    <PaymentStep step="03" label="Livraison & Mise en service" percent="20%" />
                 </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <p style={{ fontSize: 11, fontWeight: 900, color: '#0F172A', marginBottom: 60 }}>POUR ACCORD (Cachet et Signature)</p>
                 <div style={{ width: 180, height: 100, border: '1px dashed #CBD5E1', borderRadius: 12, marginLeft: 'auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{fontSize:9, color:'#CBD5E1'}}>Signature Client</span>
                 </div>
              </div>
           </div>
        </div>

        {/* PAGE 5: CGV */}
        <div className="a4-page">
           <Header docType={docType} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />
           <div style={{ marginTop: 40 }}>
              <SectionTitle title="4. CONDITIONS GÉNÉRALES & CADRE LÉGAL" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                 <CGVItem title="DÉLAIS ET LIVRAISON" text={`La durée estimée du projet est de ${timeline}. Tout retard imputable au client (validation tardive, absence de données) entraînera un décalage équivalent du planning de livraison.`} />
                 <CGVItem title="GESTION DES IMPAYÉS" text="Conformément aux usages commerciaux internationaux, tout retard de paiement entraîne l'application de plein droit de pénalités au taux annuel de 10%, majorées d'une indemnité forfaitaire pour frais de recouvrement de 26 250 FCFA (40€)." />
                 <CGVItem title="PROPRIÉTÉ INTELLECTUELLE" text="La pleine propriété du code source, des designs et de l'architecture est transférée au client uniquement après le règlement intégral du solde facturé. Ozirus Agency conserve le droit d'usage des références à des fins promotionnelles." />
                 <CGVItem title="OBLIGATIONS DES PARTIES" text="Ozirus Agency s'engage à une obligation de moyens. Le client s'engage à collaborer activement et à fournir les accès nécessaires à la réalisation technique du projet." />
              </div>
              
              <div style={{ marginTop: 50, padding: 25, background: '#0F172A', borderRadius: 15, color: '#FFF' }}>
                 <p style={{ fontSize: 10, fontWeight: 900, color: '#7967FF', marginBottom: 15, letterSpacing: '0.1em' }}>MODALITÉS DE RÈGLEMENT :</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                    <div>
                       <p style={{ fontSize: 11, fontWeight: 800, marginBottom: 8 }}>{currency === 'FCFA' ? 'MOBILE MONEY (CAMEROUN)' : 'TRANSFERT INTERNATIONAL'}</p>
                       <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{currency === 'FCFA' ? 'MTN & Orange Money : +237 694 08 65 71\nFrais à la charge du donneur d\'ordre.' : 'Ozirus Agency Worldwide Account\nIBAN : [DEMANDER LE RIB INTERNATIONAL]\nBIC/SWIFT : [SWIFT CODE]'}</p>
                    </div>
                    <div>
                       <p style={{ fontSize: 11, fontWeight: 800, marginBottom: 8 }}>IDENTITÉ FISCALE</p>
                       <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Ozirus Agency SARL<br/>NUI : M03211568940J<br/>RCCM : RC/YAO/2021/B/145<br/>Siège : Bastos, Yaoundé</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <style jsx global>{`
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          background: #FFF;
          box-shadow: 0 0 50px rgba(0,0,0,0.08);
          padding: 20mm;
          box-sizing: border-box;
          position: relative;
          font-family: var(--font-sans, "DM Sans"), sans-serif;
          display: flex;
          flex-direction: column;
        }
        @media print {
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .no-print { display: none !important; }
          .a4-page { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important;
            height: 100% !important;
            page-break-before: always;
            border: none !important;
          }
          .a4-page:first-child { page-break-before: avoid; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── HELPER COMPONENTS ─── */

function RichEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);
  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', background: '#FFF' }}>
      <div style={{ display: 'flex', gap: 5, padding: '6px 10px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <button onClick={() => exec('bold')} style={toolBtnStyle}>B</button>
        <button onClick={() => exec('italic')} style={toolBtnStyle}>I</button>
        <button onClick={() => exec('insertUnorderedList')} style={toolBtnStyle}>• Liste</button>
      </div>
      <div ref={editorRef} contentEditable onInput={(e) => onChange(e.currentTarget.innerHTML)} style={{ padding: '12px', minHeight: 80, outline: 'none', fontSize: 13, lineHeight: 1.6 }} />
    </div>
  );
}

function MethodoBox({ step, title, text }: any) {
  return (
    <div style={methodoStyle}>
       <div style={methodoIconStyle}>{step}</div>
       <div>
          <p style={methodoTitleStyle}>{title}</p>
          <p style={methodoTextStyle}>{text}</p>
       </div>
    </div>
  );
}

function StackItem({ icon, label, tech }: any) {
  return (
    <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
       <div style={{ color: '#7967FF', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
       <p style={{ fontSize: '8px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</p>
       <p style={{ fontSize: '9px', fontWeight: 800, color: '#0F172A' }}>{tech}</p>
    </div>
  );
}

function SummaryLine({ label, value, weight = 600, color = '#475569', size = 12 }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: size }}>
       <span style={{ color: '#64748B' }}>{label}</span>
       <span style={{ fontWeight: weight, color }}>{value}</span>
    </div>
  );
}

function PaymentStep({ step, label, percent }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
       <span style={{ fontSize: 10, fontWeight: 900, color: '#7967FF' }}>{step}</span>
       <span style={{ fontSize: 11, flex: 1, fontWeight: 600 }}>{label}</span>
       <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{percent}</span>
    </div>
  );
}

function CGVItem({ title, text }: any) {
  return (
    <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1px solid #F1F5F9' }}>
       <p style={{ fontSize: 9, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '0.05em' }}>{title}</p>
       <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

function Header({ docType, docNumber, date, currency, logoSrc }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 25, borderBottom: '1px solid #F1F5F9' }}>
      <div>
        <img src={logoSrc} alt="Ozirus" style={{ height: 35, filter: logoSrc === '/logo.png' ? PRIMARY_LOGO_FALLBACK_FILTER : 'none', marginBottom: 12 }} />
        <p style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-display, "Clash Display"), sans-serif', letterSpacing: '0.05em' }}>OZIRUS AGENCY — SOLUTIONS IA & DIGITAL</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 16, fontWeight: 900, color: '#7967FF', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{docType}</p>
        <p style={{ fontSize: 10, color: '#64748B', marginTop: 5, fontWeight: 600 }}>RÉF: {docNumber} | DATE: {date} | DEVISE: {currency}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 style={{ fontSize: 13, fontWeight: 900, color: '#7967FF', letterSpacing: '0.1em', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 15, fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>
      {title}
      <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
    </h3>
  );
}

const tabBtn = { padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' };
const subTab = { padding: '12px 4px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' };
const sectionTitle = { fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6, marginLeft: 4 };
const toolBtnStyle = { background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 4, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 800, color: '#475569' };

const methodoStyle = { display: 'flex', gap: 20, alignItems: 'flex-start', padding: '20px', background: '#F8FAFC', borderRadius: '15px', border: '1px solid #F1F5F9' };
const methodoIconStyle = { width: '40px', height: '40px', background: '#7967FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '14px', fontWeight: 900, flexShrink: 0 };
const methodoTitleStyle = { fontSize: '11px', fontWeight: 900, color: '#0F172A', marginBottom: '5px', letterSpacing: '0.05em' };
const methodoTextStyle = { fontSize: '11px', color: '#64748B', lineHeight: '1.6' };
const guaranteeCard: React.CSSProperties = { padding: '20px', border: '1px solid #7967FF22', borderRadius: '15px', background: '#F8FAFC' };
const guaranteeTitle: React.CSSProperties = { fontSize: 10, fontWeight: 900, color: '#7967FF', marginBottom: 12, letterSpacing: '0.1em', display: 'flex', alignItems: 'center' };
const guaranteeList: React.CSSProperties = { paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px', color: '#475569', lineHeight: 1.5 };
