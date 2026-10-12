'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArrowLeft, CalendarDays, Check, Download, LoaderCircle, Plus, Trash2, Users } from 'lucide-react';
import { documentsService, StoredDocument } from '../documents/documentsService';
import { planningService, StoredPlanning } from './planningService';

const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];
const PRIMARY = '#7967FF';
const TEAL = '#14B8A6';
const INK = '#0F172A';
const MUTED = '#64748B';
const BORDER = '#E2E8F0';

type Responsibility = 'ME' | 'YAKA';
type TeamMember = { id: string; name: string; role: string };
type PlanningTask = { id: string; title: string; owner: string; responsibility: Responsibility; dayOffset: number; condition?: string };

const initialTeam: TeamMember[] = [
  { id: 'wilfried', name: 'Wilfried Fotie', role: 'Pilotage & réalisation · Ozirus' },
  { id: 'yaka-ismael', name: 'Ismael Tsioba Thaty', role: 'Direction projet · Yaka' },
  { id: 'yaka-emmanuella', name: 'Emmanuella Moumossi Iké', role: 'Direction projet · Yaka' },
];

const initialTasks: PlanningTask[] = [
  { id: 't1', title: 'Kick-off, architecture et dépôt du dossier Meta Business', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 0 },
  { id: 't2', title: 'Fournir RCCM, NIF, justificatif d’adresse et numéro WhatsApp dédié', owner: 'Équipe Yaka', responsibility: 'YAKA', dayOffset: 0 },
  { id: 't3', title: 'Adapter l’onboarding restaurant et structurer le catalogue', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 0 },
  { id: 't4', title: 'Fournir les 15 restaurants, menus, prix, photos et coordonnées', owner: 'Équipe Yaka', responsibility: 'YAKA', dayOffset: 0 },
  { id: 't5', title: 'Développer les parcours livraison et commande sur place par QR code', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 1 },
  { id: 't6', title: 'Développer notifications, suivi des sources et consentement marketing', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 2 },
  { id: 't7', title: 'Ouvrir et faire valider les comptes marchands SingPay / Airtel / Moov', owner: 'Équipe Yaka + opérateurs', responsibility: 'YAKA', dayOffset: 0 },
  { id: 't8', title: 'Intégrer Mobile Money, paiement à la livraison et au comptoir', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 3 },
  { id: 't9', title: 'Livrer la plateforme Yaka, les campagnes et le parrainage', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 3 },
  { id: 't10', title: 'Livrer le backoffice marchand cloisonné et les indicateurs', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 4 },
  { id: 't11', title: 'Tester avec les restaurants pilotes et centraliser les retours', owner: 'Équipe Yaka', responsibility: 'YAKA', dayOffset: 4 },
  { id: 't12', title: 'Corriger, documenter et préparer la mise en production', owner: 'Wilfried Fotie', responsibility: 'ME', dayOffset: 5 },
  { id: 't13', title: 'Recette finale et validation de mise en service', owner: 'Équipe Yaka', responsibility: 'YAKA', dayOffset: 5 },
];

const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 9, color: INK, background: '#FFF', fontSize: 12, outline: 'none' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 800, color: MUTED, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' };

function addDays(date: string, offset: number) {
  const result = new Date(`${date}T12:00:00`);
  result.setDate(result.getDate() + offset);
  return result;
}

function formatDate(date: Date, long = false) {
  return new Intl.DateTimeFormat('fr-FR', long
    ? { weekday: 'long', day: '2-digit', month: 'long' }
    : { weekday: 'short', day: '2-digit', month: 'short' }).format(date);
}

function projectWeeks(start: string, count: number) {
  const days: { offset: number; date: Date }[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    days.push({ offset, date: addDays(start, offset * 7) });
  }
  return days;
}

export default function PlanningPage() {
  return <Suspense fallback={null}><PlanningContent /></Suspense>;
}

function PlanningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [title, setTitle] = useState('Planning de réalisation');
  const [startDate, setStartDate] = useState('2026-08-12');
  const [duration, setDuration] = useState(6);
  const [meetingTime, setMeetingTime] = useState('17:00');
  const [myName, setMyName] = useState('Wilfried Fotie');
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [tasks, setTasks] = useState<PlanningTask[]>(initialTasks);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [loadingEditor, setLoadingEditor] = useState(false);
  const [contracts, setContracts] = useState<StoredDocument[]>([]);
  const [storedPlannings, setStoredPlannings] = useState<StoredPlanning[]>([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
  const [clientCompany, setClientCompany] = useState('Projet');
  const [contractNumber, setContractNumber] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');
    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setAuthorized(true);
      router.replace('/admin/planning');
      return;
    }
    const verify = async () => {
      if (storedAuth === 'true') { setAuthorized(true); return; }
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const session = await response.json();
        if (!cancelled && session?.user?.email && ADMIN_ALLOWED_EMAILS.includes(session.user.email)) {
          localStorage.setItem('ozirus_admin_auth', 'true');
          setAuthorized(true);
          return;
        }
      } catch (error) { console.error('Admin session check error:', error); }
      if (!cancelled) { setAuthorized(false); router.replace('/login'); }
    };
    verify();
    return () => { cancelled = true; };
  }, [router, searchParams]);

  const applyPlanning = (data: Record<string, any>) => {
      if (data.title) setTitle(data.title);
      if (data.startDate) setStartDate(data.startDate);
      if (data.duration) setDuration(data.duration);
      if (data.meetingTime || data.eveningMeeting) setMeetingTime(data.meetingTime || data.eveningMeeting);
      if (data.myName) setMyName(data.myName);
      if (data.team) setTeam(data.team);
      if (data.tasks) setTasks((data.tasks as PlanningTask[]).map(task => task.id === 'yaka-restaurants' ? {
        ...task,
        title: 'Compléter les modèles de contenu fournis par Ozirus : messages, catalogue et éléments de marque',
        condition: 'Requis avant l’intégration des contenus définitifs',
      } : task));
  };

  useEffect(() => {
    if (!authorized) return;
    setLoadingLibrary(true);
    let contractsDone = false;
    let planningsDone = false;
    const finish = () => { if (contractsDone && planningsDone) setLoadingLibrary(false); };
    documentsService.list().then(all => {
      setContracts(all.filter(document => document.kind === 'CONTRAT' && document.status === 'SIGNE'));
    }).catch(error => console.error('Unable to load signed contracts', error)).finally(() => { contractsDone = true; finish(); });
    planningService.list().then(setStoredPlannings).catch(error => console.error('Unable to load saved plannings', error)).finally(() => { planningsDone = true; finish(); });
  }, [authorized]);

  useEffect(() => {
    const contract = contracts.find(item => item.id === selectedContractId);
    if (!contract) return;
    let cancelled = false;
    const hydrate = async () => {
      setLoadingEditor(true);
      const stored = await planningService.getByContract(contract.id);
      if (cancelled) return;
      setClientCompany(contract.clientCompany || contract.clientName || 'Projet');
      setContractNumber(contract.docNumber);
      if (stored) { applyPlanning(stored.payload); setLoadingEditor(false); return; }
      const payload = contract.payload as Record<string, any>;
      const names = String(contract.clientName || '').split(/\s+&\s+|,\s*/).filter(Boolean);
      const contractItems = Array.isArray(payload.items) ? payload.items : [];
      const weeks = Math.max(1, Math.min(12, Number(String(payload.timeline || '6').match(/\d+/)?.[0] || 6)));
      setTitle(`Planning de réalisation — ${contract.clientCompany || contract.clientName}`);
      setStartDate(payload.contractStartDate || contract.date || new Date().toISOString().split('T')[0]);
      setDuration(weeks);
      setTeam([
        { id: 'ozirus-lead', name: 'Wilfried Fotie', role: 'Pilotage & réalisation · Ozirus' },
        ...names.map((name, index) => ({ id: `client-${index}`, name, role: `Référent projet · ${contract.clientCompany || 'Client'}` })),
      ]);
      const generated = contractItems.map((item: any, index: number) => {
        const description = String(item.description || 'Livrable technique');
        const normalized = description.toLowerCase();
        const needsMeta = /whatsapp|catalogue|notification/.test(normalized);
        const needsPayment = /paiement|mobile money/.test(normalized);
        const isAutonomousFoundation = /plateforme|dashboard|backoffice|parrainage|campagne|acquisition|qr code|parcours|onboarding/.test(normalized);
        // Les fondations autonomes occupent les semaines 1 et 2. Meta ne commence
        // jamais avant S3 et le paiement jamais avant S4.
        const independentWeek = isAutonomousFoundation ? index % 2 : 1;
        return {
          id: item.id || `task-${index}`,
          title: description,
          owner: 'Wilfried Fotie',
          responsibility: 'ME' as const,
          dayOffset: needsPayment
            ? Math.min(weeks - 1, 3)
            : needsMeta
              ? Math.min(weeks - 1, 2)
              : independentWeek,
          condition: needsPayment
            ? 'Si les comptes marchands et accès API sont disponibles'
            : needsMeta
              ? 'Si Meta Business, le numéro et les accès sont disponibles'
              : undefined,
        };
      });
      const scope = contractItems.map((item: any) => `${item.description || ''} ${item.longDescription || ''}`).join(' ').toLowerCase();
      const dynamicClientTasks: PlanningTask[] = [];
      if (/whatsapp|meta|message|notification/.test(scope)) {
        dynamicClientTasks.push(
          { id: 'client-meta-docs', title: 'Fournir les documents de vérification Meta, le numéro dédié et valider le nom d’affichage', owner: contract.clientCompany, responsibility: 'YAKA', dayOffset: 0, condition: 'Prérequis à la connexion du compte WhatsApp Business' },
          { id: 'client-message-templates', title: 'Compléter et valider les templates de messages transactionnels et marketing préparés par Ozirus', owner: contract.clientCompany, responsibility: 'YAKA', dayOffset: 1, condition: 'Requis avant leur soumission et leur approbation par Meta' },
        );
      }
      if (/catalogue|photo|restaurant|produit|menu/.test(scope)) {
        dynamicClientTasks.push({ id: 'client-content-templates', title: 'Compléter les modèles de contenu fournis par Ozirus : catalogue, textes, prix, visuels et éléments de marque', owner: contract.clientCompany, responsibility: 'YAKA', dayOffset: 1, condition: 'Requis avant l’intégration des contenus définitifs' });
      }
      if (/paiement|mobile money|singpay|airtel|moov/.test(scope)) {
        dynamicClientTasks.push({ id: 'client-payment-accounts', title: 'Ouvrir et faire valider les comptes marchands et transmettre les accès techniques', owner: `${contract.clientCompany} + fournisseurs`, responsibility: 'YAKA', dayOffset: 0, condition: 'Délais externes non garantis par Ozirus' });
      }
      const administrativeTasks: PlanningTask[] = dynamicClientTasks.length ? dynamicClientTasks : [
        { id: 'client-prerequisites', title: 'Gérer les démarches administratives, comptes fournisseurs, accès, contenus et données', owner: contract.clientCompany || 'Client', responsibility: 'YAKA', dayOffset: 0 },
      ];
      setTasks([
        ...administrativeTasks,
        ...generated,
        { id: 'client-validation', title: 'Recette finale et validation de mise en service', owner: contract.clientCompany || 'Client', responsibility: 'YAKA', dayOffset: weeks - 1 },
      ]);
      setLoadingEditor(false);
    };
    hydrate().catch(error => { console.error('Unable to load planning', error); setLoadingEditor(false); });
    return () => { cancelled = true; };
  }, [selectedContractId, contracts]);

  const days = useMemo(() => projectWeeks(startDate, Math.max(1, duration)), [startDate, duration]);
  const normalizedTasks = useMemo(() => tasks.map(task => ({ ...task, dayOffset: Math.min(Math.max(0, task.dayOffset), days.length - 1) })), [tasks, days.length]);
  const planningPages = useMemo(() => {
    const pages: typeof days[] = [];
    let page: typeof days = [];
    let usedHeight = 0;
    days.forEach((day, index) => {
      const weekTasks = normalizedTasks.filter(task => task.dayOffset === index);
      // Hauteur du bloc telle qu'elle sera rendue : base de la semaine + lignes de
      // texte supplémentaires selon leur longueur + éventuelles conditions.
      const requiredHeight = Math.max(46, 18 + weekTasks.reduce((sum, task) => {
        const titleLines = Math.max(1, Math.ceil(task.title.length / 78));
        const conditionLines = task.condition ? Math.max(1, Math.ceil(task.condition.length / 88)) : 0;
        return sum + 8 + titleLines * 11 + conditionLines * 9;
      }, 0));
      // La première portion vient remplir l'espace restant sous la présentation ;
      // les portions suivantes disposent d'une page presque entière.
      const availableHeight = pages.length === 0 ? 330 : 955;
      if (page.length && usedHeight + requiredHeight > availableHeight) {
        pages.push(page);
        page = [];
        usedHeight = 0;
      }
      page.push(day);
      usedHeight += requiredHeight;
    });
    if (page.length) pages.push(page);
    return pages;
  }, [days, normalizedTasks]);
  const tasksByResponsibility = (responsibility: Responsibility) => normalizedTasks.filter(task => task.responsibility === responsibility);

  const updateTeam = (id: string, field: 'name' | 'role', value: string) => setTeam(current => current.map(member => member.id === id ? { ...member, [field]: value } : member));
  const updateTask = (id: string, field: keyof PlanningTask, value: string | number) => setTasks(current => current.map(task => task.id === id ? { ...task, [field]: value } : task));
  const saveDraft = async () => {
    if (!selectedContractId) return;
    setSaving(true);
    try {
      await planningService.save(selectedContractId, { contractId: selectedContractId, contractNumber, clientCompany, payload: { title, startDate, duration, meetingTime, myName, team, tasks } });
      setStoredPlannings(await planningService.list());
      setSaved(true); window.setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const exportPdf = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const pages = previewRef.current.querySelectorAll<HTMLElement>('.planning-pdf-page');
      const pdf = new jsPDF('p', 'mm', 'a4');
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], { scale: 2.5, useCORS: true, backgroundColor: '#FFFFFF' });
        if (index > 0) pdf.addPage('a4', 'p');
        pdf.addImage(canvas.toDataURL('image/jpeg', .96), 'JPEG', 0, 0, 210, 297);
      }
      pdf.save(`Planning_${clientCompany}_${startDate}.pdf`.replace(/\s+/g, '_'));
    } catch (error) { console.error('Planning PDF generation error:', error); }
    finally { setGenerating(false); }
  };

  if (authorized !== true) return null;

  if (view === 'LIST') {
    return <PlanningLibrary
      contracts={contracts}
      plannings={storedPlannings}
      loading={loadingLibrary}
      onBack={() => router.push('/admin')}
      onOpen={(contractId) => { setSelectedContractId(contractId); setView('EDITOR'); }}
    />;
  }

  const totalPdfPages = planningPages.length + 1;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F1F5F9', fontFamily: 'var(--font-sans-loaded, "DM Sans"), sans-serif' }}>
      <aside style={{ width: 480, flexShrink: 0, background: '#FFF', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 22, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setView('LIST')} style={{ border: `1px solid ${BORDER}`, background: '#F8FAFC', color: MUTED, borderRadius: 8, padding: '7px 9px', cursor: 'pointer', display: 'flex' }}><ArrowLeft size={14} /></button>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#7967FF16', color: PRIMARY, display: 'grid', placeItems: 'center' }}><CalendarDays size={18} /></div>
            <div><h1 style={{ margin: 0, fontSize: 15, color: INK }}>Plannings</h1><p style={{ margin: '2px 0 0', fontSize: 10, color: '#94A3B8' }}>Contrats signés · Firebase · PDF</p></div>
          </div>
        </header>

        <div style={{ padding: '20px 22px 28px', overflowY: 'auto', flex: 1 }}>
          <label style={labelStyle}>Contrat signé</label>
          <select value={selectedContractId} onChange={event => setSelectedContractId(event.target.value)} style={{ ...inputStyle, marginBottom: 24 }}>
            {contracts.length === 0 && <option value="">Aucun contrat signé</option>}
            {contracts.map(contract => <option key={contract.id} value={contract.id}>{contract.clientCompany || contract.clientName} · {contract.docNumber}</option>)}
          </select>
          <h2 style={{ margin: '0 0 14px', fontSize: 11, letterSpacing: '.08em', color: PRIMARY }}>CADRAGE</h2>
          <label style={labelStyle}>Titre du document</label><input value={title} onChange={event => setTitle(event.target.value)} style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <div><label style={labelStyle}>Début</label><input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Semaines (contrat : 6–12)</label><input type="number" min={6} max={12} value={duration} onChange={event => setDuration(Number(event.target.value))} style={inputStyle} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Call hebdomadaire · mercredi (heure de Paris)</label><input type="time" value={meetingTime} onChange={event => setMeetingTime(event.target.value)} style={inputStyle} /></div>
          </div>
          <div style={{ marginTop: 12 }}><label style={labelStyle}>Mon nom</label><input value={myName} onChange={event => setMyName(event.target.value)} style={inputStyle} /></div>

          <h2 style={{ margin: '28px 0 12px', fontSize: 11, letterSpacing: '.08em', color: PRIMARY }}>ÉQUIPE {clientCompany.toUpperCase()}</h2>
          {team.map(member => <div key={member.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px', gap: 7, marginBottom: 8 }}>
            <input value={member.name} onChange={event => updateTeam(member.id, 'name', event.target.value)} style={inputStyle} aria-label="Nom" />
            <input value={member.role} onChange={event => updateTeam(member.id, 'role', event.target.value)} style={inputStyle} aria-label="Rôle" />
            <button onClick={() => setTeam(current => current.filter(item => item.id !== member.id))} style={{ border: 0, background: '#FEF2F2', color: '#EF4444', borderRadius: 8, cursor: 'pointer' }}><Trash2 size={13} /></button>
          </div>)}
          <button onClick={() => setTeam(current => [...current, { id: crypto.randomUUID(), name: 'À renseigner', role: `Rôle ${clientCompany}` }])} style={{ border: `1px dashed ${BORDER}`, background: '#FFF', color: PRIMARY, borderRadius: 8, padding: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer', width: '100%' }}><Plus size={12} /> Ajouter un membre</button>

          <h2 style={{ margin: '26px 0 12px', fontSize: 11, letterSpacing: '.08em', color: PRIMARY }}>ACTIONS & DÉPENDANCES</h2>
          {tasks.map(task => <div key={task.id} style={{ padding: 10, border: `1px solid ${BORDER}`, borderRadius: 10, marginBottom: 9, background: '#F8FAFC' }}>
            <input value={task.title} onChange={event => updateTask(task.id, 'title', event.target.value)} style={{ ...inputStyle, marginBottom: 7 }} aria-label="Action" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr 1fr 28px', gap: 6 }}>
              <select value={task.dayOffset} onChange={event => updateTask(task.id, 'dayOffset', Number(event.target.value))} style={inputStyle}>{days.map((day, index) => <option key={day.offset} value={index}>{formatDate(day.date)}</option>)}</select>
              <select value={task.responsibility} onChange={event => updateTask(task.id, 'responsibility', event.target.value)} style={inputStyle}><option value="ME">Dépend de moi</option><option value="YAKA">Ne dépend pas de moi</option></select>
              <input value={task.owner} onChange={event => updateTask(task.id, 'owner', event.target.value)} style={inputStyle} aria-label="Responsable" />
              <button onClick={() => setTasks(current => current.filter(item => item.id !== task.id))} style={{ border: 0, background: '#FEF2F2', color: '#EF4444', borderRadius: 8, cursor: 'pointer' }}><Trash2 size={13} /></button>
            </div>
            <input value={task.condition || ''} onChange={event => updateTask(task.id, 'condition', event.target.value)} placeholder="Condition éventuelle : si les accès sont disponibles…" style={{ ...inputStyle, marginTop: 7, color: '#B45309', background: '#FFFBEB', borderColor: '#FDE68A' }} aria-label="Condition" />
          </div>)}
          <button onClick={() => setTasks(current => [...current, { id: crypto.randomUUID(), title: 'Nouvelle action', owner: myName, responsibility: 'ME', dayOffset: 0 }])} style={{ border: `1px dashed ${BORDER}`, background: '#FFF', color: PRIMARY, borderRadius: 8, padding: 9, fontSize: 11, fontWeight: 800, cursor: 'pointer', width: '100%' }}><Plus size={12} /> Ajouter une action</button>
        </div>

        <footer style={{ padding: 18, borderTop: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 9 }}>
          <button onClick={saveDraft} disabled={saving} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: '#FFF', color: saved ? '#059669' : MUTED, fontWeight: 800, cursor: saving ? 'wait' : 'pointer' }}>{saving ? <><LoaderCircle size={13} className="animate-spin" /> Sauvegarde…</> : saved ? <><Check size={13} /> Enregistré</> : 'Sauvegarder'}</button>
          <button onClick={exportPdf} disabled={generating} style={{ border: 0, borderRadius: 10, padding: 13, background: PRIMARY, color: '#FFF', fontWeight: 900, cursor: generating ? 'wait' : 'pointer', boxShadow: '0 6px 18px #7967FF38' }}>{generating ? <LoaderCircle size={14} className="animate-spin" /> : <Download size={14} />} {generating ? 'GÉNÉRATION…' : 'GÉNÉRER LE PDF'}</button>
        </footer>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', padding: '34px 28px' }}>
        {loadingEditor && <LoadingState label="Chargement du planning…" overlay />}
        <div ref={previewRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <PdfPage title={title} company={clientCompany} page={`01 / ${String(totalPdfPages).padStart(2, '0')}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 26 }}>
              <div><p style={{ margin: 0, fontSize: 11, color: MUTED }}>Période</p><p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 800, color: INK }}>{formatDate(days[0].date, true)} — {formatDate(days[days.length - 1].date, true)}</p></div>
              <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: 11, color: MUTED }}>Call de suivi</p><p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 800, color: PRIMARY }}>Mercredi · {meetingTime} Paris</p></div>
            </div>
            <SectionTitle icon={<Users size={15} />} title="Équipe projet" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 25 }}>
              {team.map((member, index) => <div key={member.id} style={{ border: `1px solid ${BORDER}`, padding: 12, borderRadius: 10, borderTop: `3px solid ${index === 0 ? PRIMARY : TEAL}` }}><p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: INK }}>{member.name}</p><p style={{ margin: '4px 0 0', fontSize: 9, color: MUTED }}>{member.role}</p></div>)}
            </div>
            <SectionTitle icon={<CalendarDays size={15} />} title="Rendez-vous hebdomadaire" />
            <div style={{ marginBottom: 25 }}>
              <MeetingCard time={`${meetingTime} · heure de Paris`} label="Chaque mercredi" text="Avancement technique, blocages, validations attendues et priorités de la semaine suivante." color={PRIMARY} />
            </div>
            <div style={{ marginTop: 28, padding: 18, borderRadius: 12, background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: INK }}>Lecture du document</p>
              <p style={{ margin: '7px 0 0', fontSize: 10, lineHeight: 1.55, color: MUTED }}>Le planning commence directement ci-dessous et se poursuit sur la page suivante uniquement si l’espace disponible est dépassé.</p>
            </div>
            <div style={{ marginTop: 12 }}>
              <SectionTitle icon={<Check size={15} />} title="Planning opérationnel" />
              <div style={{ marginBottom: 10, padding: '8px 10px', borderRadius: 8, background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: 8, lineHeight: 1.4, color: '#92400E' }}><strong>Ordre :</strong> développement autonome en premier ; intégrations externes si les prérequis sont disponibles.</div>
              <PlanningRows pageDays={planningPages[0] || []} tasks={normalizedTasks} />
            </div>
          </PdfPage>

          {planningPages.slice(1).map((pageDays, pageIndex) => <PdfPage key={`planning-${pageIndex}`} title="Planning opérationnel · suite" company={clientCompany} page={`${String(pageIndex + 2).padStart(2, '0')} / ${String(totalPdfPages).padStart(2, '0')}`} compact>
            <PlanningRows pageDays={pageDays} tasks={normalizedTasks} continuation />
          </PdfPage>)}

          <PdfPage title="Matrice des responsabilités" company={clientCompany} page={`${String(totalPdfPages).padStart(2, '0')} / ${String(totalPdfPages).padStart(2, '0')}`}>
            <p style={{ margin: '-8px 0 25px', maxWidth: 540, fontSize: 11, lineHeight: 1.6, color: MUTED }}>Le développement et la technique relèvent d’Ozirus. Les démarches administratives, comptes, contenus et validations relèvent de {clientCompany} ou des fournisseurs externes.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start', gap: 14 }}>
              <ResponsibilityColumn title={`Dépend de ${myName || 'moi'}`} subtitle="Développement, intégrations et livraison technique" color={PRIMARY} tasks={tasksByResponsibility('ME')} days={days} compact />
              <ResponsibilityColumn title="Ne dépend pas de moi" subtitle={`${clientCompany}, administrations et fournisseurs`} color={TEAL} tasks={tasksByResponsibility('YAKA')} days={days} compact />
            </div>
            <div style={{ marginTop: 18, padding: 15, borderRadius: 12, background: '#0F172A', color: '#FFF' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800 }}>Règle de fonctionnement</p>
              <p style={{ margin: '6px 0 0', fontSize: 9.5, lineHeight: 1.5, color: '#CBD5E1' }}>Les blocages et validations attendues sont centralisés avant le call du mercredi à {meetingTime}, heure de Paris.</p>
            </div>
          </PdfPage>
        </div>
      </main>
    </div>
  );
}

function PlanningLibrary({ contracts, plannings, loading, onBack, onOpen }: { contracts: StoredDocument[]; plannings: StoredPlanning[]; loading: boolean; onBack: () => void; onOpen: (id: string) => void }) {
  return <div style={{ minHeight: '100vh', background: '#F1F5F9', color: INK, fontFamily: 'var(--font-sans-loaded, "DM Sans"), sans-serif' }}>
    <header style={{ height: 72, boxSizing: 'border-box', padding: '0 36px', background: '#FFF', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, border: `1px solid ${BORDER}`, background: '#F8FAFC', color: MUTED, borderRadius: 9, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><ArrowLeft size={15} /></button>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: '#7967FF16', color: PRIMARY, display: 'grid', placeItems: 'center' }}><CalendarDays size={19} /></div>
        <div><h1 style={{ margin: 0, fontSize: 17 }}>Plannings</h1><p style={{ margin: '3px 0 0', fontSize: 11, color: MUTED }}>Contrats signés et plannings enregistrés</p></div>
      </div>
      <span style={{ padding: '7px 11px', borderRadius: 20, background: '#F0EEFF', color: PRIMARY, fontSize: 10, fontWeight: 800 }}>{contracts.length} CONTRAT{contracts.length > 1 ? 'S' : ''} SIGNÉ{contracts.length > 1 ? 'S' : ''}</span>
    </header>
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '42px 28px 70px' }}>
      <div style={{ marginBottom: 26 }}><h2 style={{ margin: 0, fontSize: 25, fontFamily: 'var(--font-display-loaded, "Clash Display"), sans-serif' }}>Bibliothèque des plannings</h2><p style={{ margin: '8px 0 0', fontSize: 13, color: MUTED }}>Sélectionnez un contrat signé pour créer ou modifier son planning.</p></div>
      {loading ? <LoadingState label="Chargement des contrats et plannings…" /> : contracts.length === 0 ? <div style={{ padding: 42, textAlign: 'center', border: `1px dashed ${BORDER}`, borderRadius: 15, background: '#FFF', color: MUTED }}>Aucun contrat signé disponible.</div> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {contracts.map(contract => {
            const planning = plannings.find(item => item.contractId === contract.id);
            return <button key={contract.id} onClick={() => onOpen(contract.id)} style={{ padding: 0, textAlign: 'left', border: `1px solid ${BORDER}`, borderRadius: 15, background: '#FFF', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 3px 12px rgba(15,23,42,.04)' }}>
              <div style={{ height: 4, background: planning ? PRIMARY : '#CBD5E1' }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}><div><p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: PRIMARY }}>{contract.docNumber}</p><h3 style={{ margin: '7px 0 0', fontSize: 17, color: INK }}>{contract.clientCompany || contract.clientName}</h3></div><span style={{ padding: '5px 8px', borderRadius: 7, background: planning ? '#ECFDF5' : '#F8FAFC', color: planning ? '#059669' : MUTED, fontSize: 9, fontWeight: 800 }}>{planning ? 'ENREGISTRÉ' : 'À CRÉER'}</span></div>
                <p style={{ margin: '9px 0 18px', fontSize: 11, color: MUTED }}>{contract.clientName}</p>
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 13, display: 'flex', justifyContent: 'space-between', color: MUTED, fontSize: 10 }}><span>Contrat signé le {contract.date}</span><strong style={{ color: PRIMARY }}>{planning ? 'Modifier →' : 'Créer →'}</strong></div>
              </div>
            </button>;
          })}
        </div>}
    </main>
  </div>;
}

function LoadingState({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return <div style={overlay ? { position: 'fixed', inset: 0, zIndex: 50, display: 'grid', placeItems: 'center', background: 'rgba(241,245,249,.82)', backdropFilter: 'blur(3px)' } : { minHeight: 220, display: 'grid', placeItems: 'center', border: `1px solid ${BORDER}`, borderRadius: 15, background: '#FFF' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: MUTED, fontSize: 12, fontWeight: 700 }}><LoaderCircle size={25} color={PRIMARY} className="animate-spin" /><span>{label}</span></div>
  </div>;
}

function PdfPage({ title, company, page, children, compact = false }: { title: string; company: string; page: string; children: React.ReactNode; compact?: boolean }) {
  return <section className="planning-pdf-page" style={{ width: 794, height: 1123, boxSizing: 'border-box', background: '#FFF', padding: compact ? '24px 50px 42px' : '42px 50px', boxShadow: '0 18px 45px rgba(15,23,42,.12)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 230, height: 7, background: PRIMARY }} /><div style={{ position: 'absolute', top: 0, left: 230, width: 82, height: 7, background: TEAL }} />
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: compact ? 'center' : 'flex-start', paddingBottom: compact ? 10 : 23, marginBottom: compact ? 12 : 28, borderBottom: `1px solid ${BORDER}` }}>
      <div>{!compact && <p style={{ margin: '0 0 7px', color: PRIMARY, fontWeight: 900, fontSize: 11, letterSpacing: '.12em' }}>PROJET {company.toUpperCase()}</p>}<h1 style={{ margin: 0, maxWidth: 540, fontFamily: 'var(--font-display-loaded, "Clash Display"), sans-serif', fontSize: compact ? 15 : 27, lineHeight: 1.1, color: INK }}>{title}</h1></div>
      <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: 12, fontWeight: 900, color: INK }}>OZIRUS</p><p style={{ margin: '3px 0 0', fontSize: 8, color: MUTED }}>Digital Excellence Framework</p></div>
    </header>
    {children}
    <footer style={{ position: 'absolute', left: 50, right: 50, bottom: 26, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 10, fontSize: 8.5, color: '#94A3B8' }}><span>Document de pilotage · {company}</span><span>{page}</span></footer>
  </section>;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) { return <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11, color: PRIMARY }}><span style={{ display: 'grid', placeItems: 'center' }}>{icon}</span><h2 style={{ margin: 0, fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>{title}</h2></div>; }
function MeetingCard({ time, label, text, color }: { time: string; label: string; text: string; color: string }) { return <div style={{ border: `1px solid ${BORDER}`, borderRadius: 11, padding: 14, position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: color }} /><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ fontSize: 12, color: INK }}>{label}</strong><strong style={{ fontSize: 12, color }}>{time}</strong></div><p style={{ margin: '7px 0 0', fontSize: 9.5, lineHeight: 1.5, color: MUTED }}>{text}</p></div>; }
function PlanningRows({ pageDays, tasks, continuation = false }: { pageDays: { offset: number; date: Date }[]; tasks: PlanningTask[]; continuation?: boolean }) {
  return <div style={{ border: `1px solid ${BORDER}`, borderRadius: continuation ? '0 0 11px 11px' : 11, overflow: 'hidden' }}>
    {pageDays.map((day, localIndex) => {
      const weekTasks = tasks.filter(task => task.dayOffset === day.offset);
      return <div key={day.offset} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', borderBottom: localIndex === pageDays.length - 1 ? 0 : `1px solid ${BORDER}`, minHeight: 48 }}>
        <div style={{ padding: '12px', background: day.offset % 2 ? '#FAFAFF' : '#F8FAFC', fontSize: 9.5, fontWeight: 800, color: INK, textTransform: 'capitalize' }}>S{day.offset + 1}<br /><span style={{ fontSize: 8, color: MUTED }}>dès le {formatDate(day.date)}</span></div>
        <div style={{ padding: '9px 12px' }}>{weekTasks.length ? weekTasks.map(task => <div key={task.id} style={{ margin: '2px 0 7px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 9.5, color: INK }}><span style={{ width: 6, height: 6, borderRadius: 8, background: task.responsibility === 'ME' ? PRIMARY : TEAL, flexShrink: 0 }} />{task.title}</div>{task.condition && <p style={{ margin: '3px 0 0 13px', fontSize: 7.8, lineHeight: 1.35, color: '#B45309' }}>Si disponible : {task.condition.replace(/^Si\s+/i, '')}</p>}</div>) : <span style={{ fontSize: 9, color: '#CBD5E1' }}>Production et suivi des actions en cours</span>}</div>
      </div>;
    })}
  </div>;
}
function ResponsibilityColumn({ title, subtitle, color, tasks, days, compact = false }: { title: string; subtitle: string; color: string; tasks: PlanningTask[]; days: { date: Date }[]; compact?: boolean }) { return <div style={{ border: `1px solid ${BORDER}`, borderRadius: 11, overflow: 'hidden' }}><div style={{ background: `${color}12`, borderBottom: `1px solid ${color}28`, padding: compact ? '11px 12px' : '14px 17px' }}><h2 style={{ margin: 0, fontSize: compact ? 12.5 : 15, color }}>{title}</h2><p style={{ margin: '4px 0 0', fontSize: compact ? 8 : 9.5, lineHeight: 1.35, color: MUTED }}>{subtitle}</p></div><div style={{ padding: compact ? '3px 11px' : '5px 17px' }}>{tasks.map((task, index) => <div key={task.id} style={{ display: 'grid', gridTemplateColumns: compact ? '19px 1fr' : '28px 1fr 110px', alignItems: 'start', gap: compact ? 7 : 10, padding: compact ? '7px 0' : '11px 0', borderBottom: index === tasks.length - 1 ? 0 : `1px solid ${BORDER}` }}><span style={{ width: compact ? 17 : 22, height: compact ? 17 : 22, borderRadius: 6, background: `${color}16`, color, display: 'grid', placeItems: 'center', fontSize: 8, fontWeight: 900 }}>{index + 1}</span><div><p style={{ margin: 0, fontSize: compact ? 8.5 : 10.5, lineHeight: 1.3, color: INK, fontWeight: 700 }}>{task.title}</p><p style={{ margin: '3px 0 0', fontSize: compact ? 7.2 : 8.5, color: MUTED }}>{task.owner} · {days[task.dayOffset] ? `S${task.dayOffset + 1}` : 'À planifier'}</p>{task.condition && <p style={{ margin: '2px 0 0', fontSize: compact ? 6.8 : 8, lineHeight: 1.25, color: '#B45309' }}>Si disponible : {task.condition.replace(/^Si\s+/i, '')}</p>}</div>{!compact && <span style={{ textAlign: 'right', fontSize: 8.5, fontWeight: 800, color }}>{days[task.dayOffset] ? formatDate(days[task.dayOffset].date) : 'À planifier'}</span>}</div>)}</div></div>; }
