'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Rocket, Clock, Target, Users, Megaphone, MessageSquare, Film, ListChecks,
  Copy, Check, RotateCcw, FileDown,
} from 'lucide-react';
import {
  OFFER, GOAL, DEFAULT_FUNNEL, FunnelInputs, PERSONAS, CHANNELS, DEFAULT_ADS_BUDGET,
  SCRIPTS, OBJECTIONS, CALL_SCRIPT, VIDEO_SCRIPT, VIDEO_CUTS, AD_HOOKS, WEEKS, DAILY_ROUTINE, KPIS,
} from './roadmapData';

/* ─── AUTH CONFIG (same pattern as rest of /admin) ──────────────────────── */
const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];
const PRIMARY = '#7967FF';

// Progression (cases cochées) + hypothèses : propres à ce navigateur, pas de Firestore.
const STORAGE_KEY = 'ozirus_mvp_roadmap';

type TabId = 'goal' | 'personas' | 'channels' | 'messages' | 'video' | 'plan';
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'goal', label: 'Objectif', icon: Target },
  { id: 'personas', label: 'Personas', icon: Users },
  { id: 'channels', label: 'Canaux', icon: Megaphone },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'video', label: 'Vidéo', icon: Film },
  { id: 'plan', label: 'Plan', icon: ListChecks },
];

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function MvpRoadmapPage() {
  return (
    <Suspense fallback={null}>
      <MvpRoadmapContent />
    </Suspense>
  );
}

function MvpRoadmapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin/mvp-roadmap');
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
        if (!isCancelled && email && ADMIN_ALLOWED_EMAILS.includes(email)) {
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
    return () => { isCancelled = true; };
  }, [searchParams, router]);

  const [activeTab, setActiveTab] = useState<TabId>('goal');
  const [funnel, setFunnel] = useState<FunnelInputs>(DEFAULT_FUNNEL);
  const [budget, setBudget] = useState(DEFAULT_ADS_BUDGET);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const showToast = React.useCallback((kind: 'success' | 'error', message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) {
        if (saved.funnel) setFunnel({ ...DEFAULT_FUNNEL, ...saved.funnel });
        if (typeof saved.budget === 'number') setBudget(saved.budget);
        if (saved.done) setDone(saved.done);
      }
    } catch { /* stockage indisponible : on garde les valeurs par défaut */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ funnel, budget, done })); } catch { /* ignore */ }
  }, [loaded, funnel, budget, done]);

  // Le funnel part de l'objectif (1 client) et remonte jusqu'à l'effort nécessaire.
  const math = useMemo(() => {
    const calls = Math.ceil(1 / (funnel.closeRate / 100));
    const bookings = Math.ceil(calls / (funnel.showRate / 100));
    const replies = Math.ceil(bookings / (funnel.replyToCall / 100));
    const messages = Math.ceil(replies / (funnel.outboundReply / 100));
    const clicks = Math.ceil(bookings / (funnel.landingToCall / 100));
    const adsBudgetNeeded = clicks * funnel.cpc;
    const paidShare = CHANNELS.filter(c => c.kind === 'Payant').reduce((s, c) => s + c.share, 0) || 100;
    const searchAndSocialBudget = budget * (CHANNELS.filter(c => c.id !== 'retargeting' && c.kind === 'Payant').reduce((s, c) => s + c.share, 0) / paidShare);
    const bookingsFromAds = (searchAndSocialBudget / funnel.cpc) * (funnel.landingToCall / 100);
    return { calls, bookings, replies, messages, clicks, adsBudgetNeeded, bookingsFromAds, perDay: Math.ceil(messages / 15) };
  }, [funnel, budget]);

  const allTasks = WEEKS.flatMap(w => w.tasks);
  const doneCount = allTasks.filter(t => done[t.id]).length;

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(c => (c === id ? null : c)), 1500);
    } catch {
      showToast('error', 'Copie impossible dans ce navigateur.');
    }
  };

  const goTo = (tab: TabId) => {
    setActiveTab(tab);
    document.getElementById(`rm-${tab}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetAll = () => {
    setFunnel(DEFAULT_FUNNEL);
    setBudget(DEFAULT_ADS_BUDGET);
    setDone({});
    showToast('success', 'Roadmap réinitialisée.');
  };

  // Une seule capture de la feuille, découpée ensuite en pages A4.
  const handleExport = async () => {
    if (!sheetRef.current) return;
    setIsExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(sheetRef.current, { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeightPx = Math.floor(canvas.width * (297 / 210));
      for (let y = 0, page = 0; y < canvas.height; y += pageHeightPx, page += 1) {
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = Math.min(pageHeightPx, canvas.height - y);
        slice.getContext('2d')!.drawImage(canvas, 0, y, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
        if (page > 0) pdf.addPage('a4', 'p');
        pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, (slice.height * 210) / canvas.width);
      }
      pdf.save('Roadmap_Marketing_MVP_Ozirus.pdf');
      showToast('success', 'PDF téléchargé.');
    } catch (err) {
      console.error('Roadmap PDF export error:', err);
      showToast('error', 'Erreur lors de la génération du PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  const setF = (k: keyof FunnelInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setFunnel(prev => ({ ...prev, [k]: Number.isFinite(v) && v > 0 ? v : prev[k] }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F1F5F9', overflow: 'hidden' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          padding: '12px 18px', borderRadius: 12, fontSize: 12.5, fontWeight: 700, color: '#FFF',
          background: toast.kind === 'success' ? '#10B981' : '#EF4444', boxShadow: '0 8px 24px rgba(15,23,42,0.22)',
        }}>
          {toast.message}
        </div>
      )}

      {/* ─── LEFT PANEL ─── */}
      <div style={{ width: 480, flexShrink: 0, background: '#FFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '10px 0 30px rgba(0,0,0,0.02)', zIndex: 10 }}>

        <div style={{ padding: 24, borderBottom: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => router.push('/admin')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                <ArrowLeft size={13} /> Admin
              </button>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <Rocket size={16} color={PRIMARY} />
                  Roadmap Marketing MVP
                </h1>
                <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 1, marginBottom: 0 }}>Objectif : {GOAL.label} · {GOAL.start} → {GOAL.end}</p>
              </div>
            </div>
            <button onClick={resetAll} title="Réinitialiser" style={{ display: 'flex', alignItems: 'center', background: '#FFF', color: '#EF4444', border: '1px solid #FEE2E2', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>
              <RotateCcw size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => goTo(t.id)} style={{ ...tabBtn, padding: '6px 10px', background: activeTab === t.id ? '#FFF' : 'transparent', color: activeTab === t.id ? PRIMARY : '#64748B' }}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid #F1F5F9', gap: 16 }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => goTo(id)} title={label} style={{ ...subTab, color: activeTab === id ? PRIMARY : '#94A3B8', borderBottomColor: activeTab === id ? PRIMARY : 'transparent' }}>
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {activeTab === 'goal' && (
            <>
              <p style={sectionTitle}>Hypothèses du funnel</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <NumField label="Closing après appel (%)" value={funnel.closeRate} onChange={setF('closeRate')} />
                <NumField label="RDV honorés (%)" value={funnel.showRate} onChange={setF('showRate')} />
                <NumField label="Réponses prospection (%)" value={funnel.outboundReply} onChange={setF('outboundReply')} />
                <NumField label="Réponse → RDV (%)" value={funnel.replyToCall} onChange={setF('replyToCall')} />
                <NumField label="Visiteur ads → RDV (%)" value={funnel.landingToCall} onChange={setF('landingToCall')} step={0.5} />
                <NumField label="Coût par clic (€)" value={funnel.cpc} onChange={setF('cpc')} step={0.1} />
              </div>
              <InfoBox>
                Pour <b>1 client</b> : {math.calls} appels tenus → {math.bookings} RDV réservés. Soit <b>{fmt(math.messages)} messages</b> de prospection (≈ {math.perDay}/jour ouvré), ou <b>{fmt(math.clicks)} clics</b> d&apos;ads (≈ {fmt(math.adsBudgetNeeded)} €).
              </InfoBox>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>Mélangez les deux : la prospection et le réseau signent, les ads alimentent le haut du funnel.</p>
            </>
          )}

          {activeTab === 'personas' && (
            <>
              <p style={sectionTitle}>Accroches par persona</p>
              {PERSONAS.map(p => (
                <CopyCard key={p.id} title={p.name} subtitle={p.priority} text={p.hook} copied={copiedId === `hook-${p.id}`} onCopy={() => copy(`hook-${p.id}`, p.hook)} />
              ))}
            </>
          )}

          {activeTab === 'channels' && (
            <>
              <p style={sectionTitle}>Budget ads sur la période</p>
              <div>
                <label style={labelStyle}>Budget total (€) : {fmt(budget)} €</label>
                <input type="range" min={200} max={3000} step={50} value={budget} onChange={e => setBudget(Number(e.target.value))} style={{ width: '100%', accentColor: PRIMARY }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CHANNELS.filter(c => c.kind === 'Payant').map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '10px 12px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>{c.name} · {c.share} %</span>
                    <b style={{ color: '#0F172A' }}>{fmt((budget * c.share) / 100)} €</b>
                  </div>
                ))}
              </div>
              <InfoBox>
                ≈ {fmt(budget / GOAL.days)} €/jour. Avec ces hypothèses, Google + Meta apportent ≈ <b>{math.bookingsFromAds.toFixed(1).replace('.', ',')} RDV</b> sur la période.
              </InfoBox>
            </>
          )}

          {activeTab === 'messages' && (
            <>
              <p style={sectionTitle}>Scripts à copier</p>
              {SCRIPTS.map(s => (
                <CopyCard key={s.id} title={s.title} subtitle={s.context} text={s.text} copied={copiedId === s.id} onCopy={() => copy(s.id, s.text)} />
              ))}
            </>
          )}

          {activeTab === 'video' && (
            <>
              <p style={sectionTitle}>Script vidéo (60 s)</p>
              <CopyCard
                title="Voix off complète"
                subtitle="À lire face caméra"
                text={VIDEO_SCRIPT.map(b => b.voice).join('\n\n')}
                copied={copiedId === 'video'}
                onCopy={() => copy('video', VIDEO_SCRIPT.map(b => b.voice).join('\n\n'))}
              />
              <p style={sectionTitle}>Accroches ads à tester</p>
              {AD_HOOKS.map((h, i) => (
                <CopyCard key={h} title={`Accroche ${i + 1}`} text={h} copied={copiedId === `adhook-${i}`} onCopy={() => copy(`adhook-${i}`, h)} />
              ))}
            </>
          )}

          {activeTab === 'plan' && (
            <>
              {WEEKS.map(w => (
                <div key={w.id}>
                  <p style={sectionTitle}>{w.label} · {w.dates}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {w.tasks.map(t => (
                      <label key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, border: '1px solid #E2E8F0', background: done[t.id] ? '#F0FDF4' : '#FFF', cursor: 'pointer' }}>
                        <input type="checkbox" checked={!!done[t.id]} onChange={() => setDone(d => ({ ...d, [t.id]: !d[t.id] }))} style={{ marginTop: 2, accentColor: PRIMARY }} />
                        <span style={{ fontSize: 12.5, lineHeight: 1.5, color: done[t.id] ? '#94A3B8' : '#0F172A', textDecoration: done[t.id] ? 'line-through' : 'none' }}>{t.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ padding: 24, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Actions faites</span>
            <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 18 }}>{doneCount}/{allTasks.length}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
            <div style={{ width: `${(doneCount / allTasks.length) * 100}%`, height: '100%', background: PRIMARY, transition: 'width .3s' }} />
          </div>
          <button onClick={handleExport} disabled={isExporting} style={{ ...primaryBtnStyle, cursor: isExporting ? 'not-allowed' : 'pointer', opacity: isExporting ? 0.7 : 1 }}>
            {isExporting ? <Clock size={18} /> : <FileDown size={18} />}
            {isExporting ? 'GÉNÉRATION...' : 'TÉLÉCHARGER EN PDF'}
          </button>
        </div>
      </div>

      {/* ─── RIGHT PANEL: DOCUMENT ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div ref={sheetRef} style={{ width: 794, background: '#FFF', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', borderRadius: 4, padding: '56px 56px 64px', boxSizing: 'border-box', color: '#0F172A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: PRIMARY, letterSpacing: '0.15em', margin: 0 }}>OZIRUS AGENCY · USAGE INTERNE</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 6px' }}>Roadmap marketing — Offre MVP</h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px' }}>{OFFER.name} · {fmt(OFFER.price)} € au lieu de {fmt(OFFER.originalPrice)} € · {OFFER.url.replace('https://', '')}</p>

          {/* Objectif */}
          <Section id="goal" title="1. Objectif & funnel">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
              <Stat value="1" label="client signé" accent />
              <Stat value={`${GOAL.days} j`} label={`${GOAL.start} → ${GOAL.end}`} />
              <Stat value={`${fmt(OFFER.price)} €`} label="CA visé" />
              <Stat value={`${fmt(budget)} €`} label="budget ads" />
            </div>
            <p style={para}>Le funnel est calculé à l&apos;envers, depuis l&apos;objectif. Avec {funnel.closeRate} % de closing et {funnel.showRate} % de RDV honorés :</p>
            <FunnelRow steps={[
              ['Messages envoyés', fmt(math.messages)],
              ['Réponses', fmt(math.replies)],
              ['RDV réservés', String(math.bookings)],
              ['Appels tenus', String(math.calls)],
              ['Client', '1'],
            ]} />
            <p style={para}>Équivalent 100 % ads : <b>{fmt(math.clicks)} clics</b> à {String(funnel.cpc).replace('.', ',')} € ≈ <b>{fmt(math.adsBudgetNeeded)} €</b>. Un client à {fmt(OFFER.price)} € se signe en conversation : la prospection directe et le réseau portent l&apos;objectif, les ads remplissent le calendrier et le retargeting.</p>
            <SubTitle>Indicateurs à suivre</SubTitle>
            <Table rows={KPIS.map(k => [k.label, k.target])} />
          </Section>

          {/* Personas */}
          <Section id="personas" title="2. Personas cibles">
            {PERSONAS.map(p => (
              <div key={p.id} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 12, breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{p.name} <span style={{ fontWeight: 500, color: '#64748B', fontSize: 13 }}>— {p.tagline}</span></p>
                  <span style={{ fontSize: 10, fontWeight: 800, color: p.priority === 'Prioritaire' ? PRIMARY : '#64748B', background: p.priority === 'Prioritaire' ? '#7967FF15' : '#F1F5F9', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>{p.priority.toUpperCase()}</span>
                </div>
                <p style={{ ...para, marginBottom: 10 }}>{p.who}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <MiniList title="Douleurs" items={p.pains} />
                  <MiniList title="Déclencheurs d'achat" items={p.triggers} />
                  <MiniList title="Objections" items={p.objections} />
                  <MiniList title="Où le trouver" items={p.where} />
                </div>
                <p style={{ fontSize: 12.5, margin: '10px 0 0', padding: '8px 12px', borderLeft: `3px solid ${PRIMARY}`, background: '#F8FAFC', fontStyle: 'italic' }}>« {p.hook} »</p>
              </div>
            ))}
          </Section>

          {/* Canaux */}
          <Section id="channels" title="3. Canaux & budget">
            <Table
              head={['Canal', 'Type', 'Budget', 'KPI']}
              rows={CHANNELS.map(c => [c.name, c.kind, c.share ? `${fmt((budget * c.share) / 100)} €` : '0 €', c.kpi])}
            />
            {CHANNELS.map(c => (
              <div key={c.id} style={{ marginTop: 14, breakInside: 'avoid' }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, margin: '0 0 4px' }}>{c.name}</p>
                <p style={{ ...para, marginBottom: 6 }}>{c.role}</p>
                <MiniList items={c.actions} />
              </div>
            ))}
          </Section>

          {/* Messages */}
          <Section id="messages" title="4. Messages, appel & objections">
            {SCRIPTS.map(s => (
              <div key={s.id} style={{ marginBottom: 14, breakInside: 'avoid' }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, margin: '0 0 2px' }}>{s.title}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 6px' }}>{s.context}</p>
                <p style={{ fontSize: 12.5, lineHeight: 1.6, margin: 0, padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, whiteSpace: 'pre-line' }}>{s.text}</p>
              </div>
            ))}
            <SubTitle>Appel de découverte (30 min)</SubTitle>
            <Table rows={CALL_SCRIPT.map(c => [`${c.step} · ${c.title}`, c.text])} />
            <SubTitle>Réponses aux objections</SubTitle>
            <Table rows={OBJECTIONS.map(o => [o.q, o.a])} />
          </Section>

          {/* Vidéo */}
          <Section id="video" title="5. Script vidéo">
            <Table head={['Temps', 'Voix off', 'Visuel']} rows={VIDEO_SCRIPT.map(b => [`${b.time}\n${b.part}`, b.voice, b.visual])} />
            <SubTitle>Déclinaisons</SubTitle>
            <Table rows={VIDEO_CUTS.map(c => [c.format, c.use])} />
            <SubTitle>Accroches ads à tester</SubTitle>
            <MiniList items={AD_HOOKS} />
          </Section>

          {/* Plan */}
          <Section id="plan" title="6. Plan d'action semaine par semaine">
            {WEEKS.map(w => (
              <div key={w.id} style={{ marginBottom: 16, breakInside: 'avoid' }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, margin: '0 0 2px' }}>{w.label} · {w.dates}</p>
                <p style={{ fontSize: 12, color: PRIMARY, fontWeight: 700, margin: '0 0 8px' }}>{w.goal}</p>
                {w.tasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, lineHeight: 1.55, marginBottom: 5 }}>
                    <span style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2, borderRadius: 4, border: `1.5px solid ${done[t.id] ? '#10B981' : '#CBD5E1'}`, background: done[t.id] ? '#10B981' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done[t.id] && <Check size={10} color="#FFF" strokeWidth={3} />}
                    </span>
                    <span style={{ color: done[t.id] ? '#94A3B8' : '#0F172A' }}>{t.text}</span>
                  </div>
                ))}
              </div>
            ))}
            <SubTitle>Routine quotidienne (≈ 2 h)</SubTitle>
            <Table rows={DAILY_ROUTINE.map(r => [r.time, r.task])} />
          </Section>

          <p style={{ fontSize: 10.5, color: '#94A3B8', fontStyle: 'italic', marginTop: 32 }}>Document généré par Ozirus Admin — usage interne</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Left panel blocks ─────────────────────────────────────────────────── */
function NumField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; step?: number }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="number" min={0} step={step} value={value} onChange={onChange} style={inputStyle} />
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '12px 14px', borderRadius: 10, background: '#7967FF0F', border: '1px solid #7967FF33', fontSize: 12.5, lineHeight: 1.6, color: '#334155' }}>{children}</div>;
}

function CopyCard({ title, subtitle, text, copied, onCopy }: { title: string; subtitle?: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 10.5, color: '#94A3B8', margin: '2px 0 0' }}>{subtitle}</p>}
        </div>
        <button onClick={onCopy} style={{ ...tabBtn, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', background: copied ? '#10B981' : '#F1F5F9', color: copied ? '#FFF' : '#475569', flexShrink: 0 }}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'COPIÉ' : 'COPIER'}
        </button>
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.55, color: '#475569', margin: 0, whiteSpace: 'pre-line' }}>{text}</p>
    </div>
  );
}

/* ─── Document blocks ───────────────────────────────────────────────────── */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`rm-${id}`} style={{ marginTop: 28, scrollMarginTop: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: PRIMARY, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px', paddingBottom: 6, borderBottom: '2px solid #7967FF' }}>{title}</p>
      {children}
    </section>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '18px 0 8px' }}>{children}</p>;
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 10, background: accent ? PRIMARY : '#F8FAFC', border: accent ? 'none' : '1px solid #E2E8F0', color: accent ? '#FFF' : '#0F172A' }}>
      <p style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{value}</p>
      <p style={{ fontSize: 10.5, margin: '2px 0 0', opacity: accent ? 0.85 : 1, color: accent ? '#FFF' : '#64748B' }}>{label}</p>
    </div>
  );
}

function FunnelRow({ steps }: { steps: [string, string][] }) {
  return (
    <div style={{ display: 'flex', gap: 6, margin: '4px 0 12px' }}>
      {steps.map(([label, value], i) => (
        <div key={label} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', borderRadius: 8, background: `rgba(121,103,255,${0.06 + i * 0.06})` }}>
          <p style={{ fontSize: 17, fontWeight: 900, margin: 0, color: i === steps.length - 1 ? PRIMARY : '#0F172A' }}>{value}</p>
          <p style={{ fontSize: 10, color: '#64748B', margin: '2px 0 0' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function MiniList({ title, items }: { title?: string; items: string[] }) {
  return (
    <div>
      {title && <p style={{ fontSize: 10.5, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{title}</p>}
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map(it => <li key={it} style={{ fontSize: 12, lineHeight: 1.55, color: '#334155', marginBottom: 2 }}>{it}</li>)}
      </ul>
    </div>
  );
}

function Table({ head, rows }: { head?: string[]; rows: string[][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, lineHeight: 1.5 }}>
      {head && (
        <thead>
          <tr>{head.map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: 10.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>)}</tr>
        </thead>
      )}
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((cell, j) => (
              <td key={j} style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', verticalAlign: 'top', whiteSpace: 'pre-line', fontWeight: j === 0 ? 700 : 400, color: j === 0 ? '#0F172A' : '#334155', width: j === 0 && r.length === 2 ? '34%' : undefined }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Shared styles (mirrors Outils Création) ───────────────────────────── */
const para: React.CSSProperties = { fontSize: 12.5, lineHeight: 1.65, color: '#334155', margin: '0 0 10px' };
const tabBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' };
const subTab: React.CSSProperties = { padding: '12px 4px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' };
const sectionTitle: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box', fontFamily: 'inherit' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6, marginLeft: 4 };
const primaryBtnStyle: React.CSSProperties = { width: '100%', background: PRIMARY, color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)' };
