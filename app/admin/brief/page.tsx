'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, FileDown, ClipboardList, Check, ChevronRight, RotateCcw,
  Rocket, Clock, User, Layout, Briefcase as BriefcaseIcon, AlertTriangle,
} from 'lucide-react';
import {
  PROJECT_TYPES, COMMON_GROUPS, CLOSING_GROUP, PAID_CLOSING_GROUP, ProjectTypeId, FieldDef, FieldGroup,
  CLIENT_STATUSES, ClientStatusId, getClientStatus,
} from './briefData';

/* ─── AUTH CONFIG (same pattern as rest of /admin) ──────────────────────── */
const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];
const PRIMARY = '#7967FF';

type Answers = Record<string, string | string[]>;

export default function BriefPage() {
  return (
    <Suspense fallback={null}>
      <BriefContent />
    </Suspense>
  );
}

function BriefContent() {
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
      router.replace('/admin/brief');
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

  const [projectTypeId, setProjectTypeId] = useState<ProjectTypeId>('website');
  const [clientStatusId, setClientStatusId] = useState<ClientStatusId>('thinking');
  const [answers, setAnswers] = useState<Answers>({});
  const [docNumber, setDocNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExporting, setIsExporting] = useState(false);

  const clientStatus = useMemo(() => getClientStatus(clientStatusId), [clientStatusId]);

  useEffect(() => {
    setDocNumber(`BRIEF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  }, []);

  const projectType = useMemo(() => PROJECT_TYPES.find(p => p.id === projectTypeId) || PROJECT_TYPES[0], [projectTypeId]);
  const isPaid = clientStatusId === 'paid';

  // Client payé : fini la découverte commerciale (problème/budget/décideur), place au cadrage
  // technique de lancement. Le nom du contact reste toujours utile, le reste change de nature.
  const allGroups: FieldGroup[] = useMemo(() => {
    const [clientGroup] = COMMON_GROUPS;
    return isPaid
      ? [clientGroup, ...projectType.paidGroups, PAID_CLOSING_GROUP]
      : [...COMMON_GROUPS, ...projectType.groups, CLOSING_GROUP];
  }, [projectType, isPaid]);

  const [activeGroupId, setActiveGroupId] = useState<string>(allGroups[0].id);
  useEffect(() => {
    setActiveGroupId(allGroups[0].id);
  }, [projectTypeId, isPaid]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = (fieldId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const toggleMulti = (fieldId: string, option: string) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[fieldId]) ? (prev[fieldId] as string[]) : [];
      const next = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const filledCount = useMemo(() => {
    const allFields = allGroups.flatMap(g => g.fields);
    return allFields.filter(f => {
      const v = answers[f.id];
      return v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== '');
    }).length;
  }, [allGroups, answers]);
  const totalFields = allGroups.flatMap(g => g.fields).length;

  const resetAll = () => {
    setAnswers({});
    setClientStatusId('thinking');
    setDocNumber(`BRIEF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { generateBriefDocx, downloadBlob } = await import('./exportDocx');
      const blob = await generateBriefDocx({ projectTypeId, clientStatusId, answers, docNumber, date });
      const clientName = (answers['clientName'] as string) || 'Client';
      const fileName = `Brief_${clientName}_${clientStatus.label}_${docNumber}.docx`.replace(/\s+/g, '_');
      downloadBlob(blob, fileName);
    } catch (err) {
      console.error('Brief export error:', err);
      alert('Erreur lors de la génération du document Word.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  const activeGroup = allGroups.find(g => g.id === activeGroupId) || allGroups[0];
  const groupIcon = (g: FieldGroup) => (g.id === 'client' ? User : g.id === 'closing' ? BriefcaseIcon : Layout);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F1F5F9', overflow: 'hidden' }}>

      {/* ─── LEFT PANEL: CONFIG ─── */}
      <div style={{ width: 480, background: '#FFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '10px 0 30px rgba(0,0,0,0.02)', zIndex: 10 }}>

        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => router.push('/admin')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                <ArrowLeft size={13} /> Admin
              </button>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <ClipboardList size={16} color={PRIMARY} />
                  Brief Client
                </h1>
                <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 1, marginBottom: 0 }}>Collecte d'infos · Export Word</p>
              </div>
            </div>
            <button
              onClick={resetAll}
              title="Réinitialiser le brief"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', color: '#EF4444', border: '1px solid #FEE2E2', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Type de projet</label>
              <select
                value={projectTypeId}
                onChange={e => setProjectTypeId(e.target.value as ProjectTypeId)}
                style={{ ...inputStyle, fontWeight: 700, color: projectType.color, borderColor: `${projectType.color}55` }}
              >
                {PROJECT_TYPES.map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Statut client</label>
              <select
                value={clientStatusId}
                onChange={e => setClientStatusId(e.target.value as ClientStatusId)}
                style={{ ...inputStyle, fontWeight: 700, color: clientStatus.color, borderColor: `${clientStatus.color}55` }}
              >
                {CLIENT_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {(clientStatusId === 'paid' || clientStatusId === 'lost') && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10,
              background: `${clientStatus.color}12`, border: `1px solid ${clientStatus.color}33`,
            }}>
              <AlertTriangle size={14} color={clientStatus.color} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: clientStatus.color, margin: 0 }}>
                {clientStatusId === 'paid'
                  ? 'Client payé — ce brief sert de référence figée pour le projet lancé.'
                  : 'Client perdu — ce brief est archivé, plus besoin de le compléter.'}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1, flexWrap: 'wrap' }}>
            {allGroups.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                style={{ ...tabBtn, padding: '6px 10px', background: activeGroupId === g.id ? '#FFF' : 'transparent', color: activeGroupId === g.id ? PRIMARY : '#64748B' }}
              >
                {g.title.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Local Nav */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid #F1F5F9', gap: 16 }}>
          {allGroups.map(g => {
            const Icon = groupIcon(g);
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                style={{ ...subTab, color: activeGroupId === g.id ? PRIMARY : '#94A3B8', borderBottomColor: activeGroupId === g.id ? PRIMARY : 'transparent' }}
                title={g.title}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {activeGroup && (
            <div>
              <p style={sectionTitle}>{activeGroup.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activeGroup.id === COMMON_GROUPS[0].id && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
                    <div>
                      <label style={labelStyle}>Référence</label>
                      <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Date</label>
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                )}
                {activeGroup.fields.map(field => (
                  <FieldInput key={field.id} field={field} value={answers[field.id]} setValue={setValue} toggleMulti={toggleMulti} accent={projectType.color} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>Champs remplis</span>
            <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 18 }}>{filledCount}/{totalFields}</span>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{ ...primaryBtnStyle, cursor: isExporting ? 'not-allowed' : 'pointer', opacity: isExporting ? 0.7 : 1 }}
          >
            {isExporting ? <Clock size={18} className="animate-spin" /> : <Rocket size={18} />}
            {isExporting ? 'GÉNÉRATION...' : 'EXPORTER EN WORD'}
          </button>
        </div>
      </div>

      {/* ─── RIGHT PANEL: PREVIEW ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BriefPreview projectType={projectType} clientStatus={clientStatus} groups={allGroups} answers={answers} docNumber={docNumber} date={date} />
      </div>
    </div>
  );
}

/* ─── Field renderer ─────────────────────────────────────────────────────── */
function FieldInput({
  field, value, setValue, toggleMulti, accent,
}: {
  field: FieldDef;
  value: string | string[] | undefined;
  setValue: (id: string, v: string | string[]) => void;
  toggleMulti: (id: string, option: string) => void;
  accent: string;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {field.label}{field.required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>

      {field.type === 'text' && (
        <input type="text" value={(value as string) || ''} onChange={e => setValue(field.id, e.target.value)} placeholder={field.placeholder} style={inputStyle} />
      )}

      {field.type === 'textarea' && (
        <textarea value={(value as string) || ''} onChange={e => setValue(field.id, e.target.value)} placeholder={field.placeholder} style={{ ...inputStyle, minHeight: 84, resize: 'vertical' as const }} />
      )}

      {field.type === 'select' && (
        <select value={(value as string) || ''} onChange={e => setValue(field.id, e.target.value)} style={inputStyle}>
          <option value="">Sélectionner...</option>
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      {field.type === 'radio' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {field.options?.map(opt => {
            const isActive = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setValue(field.id, opt)}
                style={{ ...tabBtn, padding: '8px 14px', background: isActive ? accent : '#FFF', color: isActive ? '#FFF' : '#64748B', border: isActive ? 'none' : '1px solid #E2E8F0' }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {field.type === 'multiselect' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {field.options?.map(opt => {
            const selected = Array.isArray(value) && value.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleMulti(field.id, opt)}
                style={{
                  ...tabBtn, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                  background: selected ? `${accent}15` : '#FFF', color: selected ? accent : '#64748B',
                  border: selected ? `1px solid ${accent}55` : '1px solid #E2E8F0',
                }}
              >
                {selected && <Check size={12} />}
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {field.helper && <p style={{ fontSize: 10.5, color: '#94A3B8', margin: '6px 0 0' }}>{field.helper}</p>}
    </div>
  );
}

/* ─── Right panel: live document preview ────────────────────────────────── */
function BriefPreview({
  projectType, clientStatus, groups, answers, docNumber, date,
}: {
  projectType: (typeof PROJECT_TYPES)[number];
  clientStatus: ReturnType<typeof getClientStatus>;
  groups: FieldGroup[];
  answers: Answers;
  docNumber: string;
  date: string;
}) {
  const formatAnswer = (field: FieldDef): string => {
    const v = answers[field.id];
    if (!v) return '—';
    if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
    return String(v).trim() || '—';
  };

  return (
    <div style={{
      width: 720, minHeight: 960, background: '#FFF', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
      borderRadius: 4, padding: '64px 60px', boxSizing: 'border-box', fontFamily: 'Georgia, serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: PRIMARY, letterSpacing: '0.15em', margin: 0, fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif' }}>OZIRUS AGENCY</p>
        <span style={{
          fontSize: 10.5, fontWeight: 800, color: clientStatus.color, background: `${clientStatus.color}15`,
          padding: '4px 10px', borderRadius: 20, fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {clientStatus.label}
        </span>
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: '0 0 18px', fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif' }}>Fiche de collecte — Brief Client</h1>

      <div style={{ display: 'flex', gap: 24, fontSize: 12.5, color: '#64748B', marginBottom: 10, fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif' }}>
        <span>Référence : <b style={{ color: '#0F172A' }}>{docNumber || '—'}</b></span>
        <span>Date : <b style={{ color: '#0F172A' }}>{date ? new Intl.DateTimeFormat('fr-FR').format(new Date(date)) : '—'}</b></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 14, marginBottom: 24, borderBottom: `2px solid ${projectType.color}`, fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif' }}>
        <span style={{ fontSize: 12.5, color: '#64748B' }}>Type de projet :</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: projectType.color }}>{projectType.label}</span>
      </div>

      {groups.map(group => (
        <div key={group.id} style={{ marginBottom: 26 }}>
          <p style={{
            fontSize: 11, fontWeight: 800, color: PRIMARY, letterSpacing: '0.08em', textTransform: 'uppercase',
            margin: '0 0 10px', paddingBottom: 6, borderBottom: '1px solid #E2E8F0', fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif',
          }}>
            {group.title}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.fields.map(field => (
              <div key={field.id} style={{ display: 'flex', gap: 14, fontSize: 12.5, lineHeight: 1.6 }}>
                <span style={{ width: 190, flexShrink: 0, color: '#94A3B8', fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif', fontWeight: 600 }}>{field.label}</span>
                <span style={{ color: '#0F172A', flex: 1 }}>{formatAnswer(field)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p style={{ fontSize: 10.5, color: '#94A3B8', fontStyle: 'italic', marginTop: 40, fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif' }}>
        Document généré par Ozirus Admin — usage interne
      </p>
    </div>
  );
}

/* ─── Shared styles (mirrors Outils Création) ───────────────────────────── */
const tabBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' };
const subTab: React.CSSProperties = { padding: '12px 4px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' };
const sectionTitle: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box', fontFamily: 'inherit' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6, marginLeft: 4 };
const primaryBtnStyle: React.CSSProperties = { width: '100%', background: PRIMARY, color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)' };
