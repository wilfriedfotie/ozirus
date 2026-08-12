'use client';

import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Plus, Trash2, Copy, Check, ArrowLeft, Target, Zap, BarChart2,
  Users, MessageSquare, TrendingUp, Filter, Download, Play, Clock,
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp,
  Phone, Globe, Mail, Star, Settings
} from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, serverTimestamp, writeBatch
} from 'firebase/firestore';

/* ─── AUTH CONFIG ─────────────────────────────────── */
const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];
const PRIMARY = '#7967FF';
const ADMIN_USER_ID = 'admin';

/* ─── TYPES ───────────────────────────────────────── */
type Campaign = {
  id: string;
  userId: string;
  niche: string;
  city: string;
  country: string;
  offer: string;
  targetCount: number;
  channel: 'whatsapp' | 'email' | 'linkedin' | 'call';
  status: 'draft' | 'running' | 'completed' | 'failed';
  totalProspectsFound: number;
  totalQualifiedLeads: number;
  createdAt: any;
  updatedAt: any;
};

type Prospect = {
  id: string;
  campaignId: string;
  userId: string;
  name: string;
  category?: string;
  city: string;
  country: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  source: 'google_places' | 'manual';
  sourceUrl?: string;
  googleRating?: number;
  googleReviewsCount?: number;
  status: 'new' | 'enriching' | 'analyzed' | 'qualified' | 'to_contact' | 'contacted' | 'replied' | 'meeting_booked' | 'won' | 'lost';
  createdAt: any;
  updatedAt: any;
};

type LeadScore = {
  id: string;
  prospectId: string;
  campaignId: string;
  userId: string;
  score: number;
  priority: 'cold' | 'warm' | 'hot';
  detectedProblem: string;
  recommendedAngle: string;
  reason: string;
  budgetPotential: 'low' | 'medium' | 'high' | 'unknown';
  conversionDifficulty: 'easy' | 'medium' | 'hard';
  createdAt: any;
};

type LeadMessage = {
  id: string;
  prospectId: string;
  campaignId: string;
  userId: string;
  channel: 'whatsapp' | 'email' | 'linkedin' | 'call';
  subject?: string;
  message: string;
  tone: 'friendly' | 'professional' | 'direct';
  status: 'draft' | 'approved' | 'used';
  createdAt: any;
  updatedAt: any;
};

type ProspectEnrichment = {
  id: string;
  prospectId: string;
  campaignId: string;
  userId: string;
  hasWebsite: boolean;
  hasWhatsapp: boolean;
  hasEmail: boolean;
  hasBooking: boolean;
  hasOnlineOrder: boolean;
  hasDigitalMenu: boolean;
  hasSocialLinks: boolean;
  whatsappNumber?: string;
  emails: string[];
  socialLinks: { facebook?: string; instagram?: string; linkedin?: string; tiktok?: string };
  websiteSummary?: string;
  weaknesses: string[];
  opportunities: string[];
  rawTextSnapshot?: string;
  createdAt: any;
};

type EnrichedProspect = Prospect & {
  score?: LeadScore;
  message?: LeadMessage;
  enrichment?: ProspectEnrichment;
};

type SimStep = 'idle' | 'searching' | 'enriching' | 'scoring' | 'messaging' | 'done';

/* ─── HELPERS ──────────────────────────────────────── */
function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

/* ─── REAL API CALLS ───────────────────────────────── */
async function fetchProspects(campaign: Campaign): Promise<Omit<Prospect, 'id'>[]> {
  const res = await fetch('/api/leads/places', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      niche: campaign.niche,
      city: campaign.city,
      country: campaign.country,
      limit: campaign.targetCount,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const { prospects } = await res.json();

  return prospects.map((p: any) => ({
    campaignId: campaign.id,
    userId: ADMIN_USER_ID,
    name: p.name,
    category: p.category,
    city: campaign.city,
    country: campaign.country,
    address: p.address,
    phone: p.phone,
    website: p.website,
    source: 'google_places' as const,
    sourceUrl: p.sourceUrl,
    googleRating: p.googleRating,
    googleReviewsCount: p.googleReviewsCount,
    status: 'analyzed' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }));
}

async function fetchScore(
  prospectId: string,
  prospect: Omit<Prospect, 'id'>,
  campaign: Campaign
): Promise<Omit<LeadScore, 'id'>> {
  const res = await fetch('/api/leads/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospect, campaign }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return {
    prospectId,
    campaignId: campaign.id,
    userId: ADMIN_USER_ID,
    score: data.score,
    priority: data.priority,
    detectedProblem: data.detectedProblem,
    recommendedAngle: data.recommendedAngle,
    reason: data.reason,
    budgetPotential: data.budgetPotential,
    conversionDifficulty: data.conversionDifficulty,
    createdAt: Timestamp.now(),
  };
}

async function fetchMessage(
  prospectId: string,
  prospect: Omit<Prospect, 'id'>,
  campaign: Campaign,
  score: Omit<LeadScore, 'id'>
): Promise<Omit<LeadMessage, 'id'>> {
  const res = await fetch('/api/leads/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospect, campaign, score }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return {
    prospectId,
    campaignId: campaign.id,
    userId: ADMIN_USER_ID,
    channel: campaign.channel,
    subject: data.subject ?? undefined,
    message: data.message,
    tone: 'friendly',
    status: 'draft',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

/* ─── SHARED STYLES ────────────────────────────────── */
const card: React.CSSProperties = {
  background: '#FFF',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  border: '1px solid #E2E8F0',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #E2E8F0',
  fontSize: 13,
  outline: 'none',
  background: '#FAFAFA',
  color: '#0F172A',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#64748B',
  display: 'block',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/* ─── CHANNEL LABELS ───────────────────────────────── */
const CHANNEL_LABELS: Record<Campaign['channel'], string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  linkedin: 'LinkedIn',
  call: 'Appel',
};

const STATUS_PROSPECT_LABELS: Record<Prospect['status'], string> = {
  new: 'Nouveau',
  enriching: 'Enrichissement',
  analyzed: 'Analysé',
  qualified: 'Qualifié',
  to_contact: 'À contacter',
  contacted: 'Contacté',
  replied: 'A répondu',
  meeting_booked: 'RDV pris',
  won: 'Gagné',
  lost: 'Perdu',
};

/* ─── ROOT EXPORT ──────────────────────────────────── */
export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsContent />
    </Suspense>
  );
}

/* ─── MAIN COMPONENT ───────────────────────────────── */
function LeadsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // View state
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Data
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [prospects, setProspects] = useState<EnrichedProspect[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingProspects, setLoadingProspects] = useState(false);

  // Campaign form
  const [showNewForm, setShowNewForm] = useState(false);
  const [formNiche, setFormNiche] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formCountry, setFormCountry] = useState('Cameroun');
  const [formOffer, setFormOffer] = useState('');
  const [formTargetCount, setFormTargetCount] = useState(10);
  const [formChannel, setFormChannel] = useState<Campaign['channel']>('whatsapp');
  const [savingCampaign, setSavingCampaign] = useState(false);

  // Simulation
  const [simStep, setSimStep] = useState<SimStep>('idle');
  const [simProgress, setSimProgress] = useState(0);
  const [simCampaignId, setSimCampaignId] = useState<string | null>(null);

  // Filters (leads view)
  const [filterPriority, setFilterPriority] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Prospect['status']>('all');
  const [filterHasWhatsapp, setFilterHasWhatsapp] = useState(false);

  // Expanded message
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  /* ─── AUTH ─── */
  useEffect(() => {
    let cancelled = false;
    const key = searchParams.get('key');
    const stored = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin/leads');
      return;
    }

    const verify = async () => {
      if (stored === 'true') { setIsAuthorized(true); return; }
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        const session = await res.json();
        const email = session?.user?.email;
        if (!cancelled && email && ADMIN_ALLOWED_EMAILS.includes(email)) {
          localStorage.setItem('ozirus_admin_auth', 'true');
          setIsAuthorized(true);
          return;
        }
      } catch {}
      if (!cancelled) { setIsAuthorized(false); router.replace('/login'); }
    };

    verify();
    return () => { cancelled = true; };
  }, [searchParams, router]);

  /* ─── LOAD CAMPAIGNS ─── */
  const loadCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    try {
      const q = query(collection(db, 'campaigns'), where('userId', '==', ADMIN_USER_ID));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
      data.sort((a, b) => {
        const at = a.createdAt?.toMillis?.() ?? 0;
        const bt = b.createdAt?.toMillis?.() ?? 0;
        return bt - at;
      });
      setCampaigns(data);
    } catch (err) {
      console.error('Firestore load campaigns error:', err);
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) loadCampaigns();
  }, [isAuthorized, loadCampaigns]);

  /* ─── LOAD PROSPECTS ─── */
  const loadProspects = useCallback(async (campaign: Campaign) => {
    setLoadingProspects(true);
    try {
      const [pSnap, sSnap, mSnap] = await Promise.all([
        getDocs(query(collection(db, 'prospects'), where('campaignId', '==', campaign.id))),
        getDocs(query(collection(db, 'lead_scores'), where('campaignId', '==', campaign.id))),
        getDocs(query(collection(db, 'lead_messages'), where('campaignId', '==', campaign.id))),
      ]);

      const scoresMap = new Map<string, LeadScore>();
      sSnap.docs.forEach(d => {
        const s = { id: d.id, ...d.data() } as LeadScore;
        scoresMap.set(s.prospectId, s);
      });

      const messagesMap = new Map<string, LeadMessage>();
      mSnap.docs.forEach(d => {
        const m = { id: d.id, ...d.data() } as LeadMessage;
        messagesMap.set(m.prospectId, m);
      });

      const enriched: EnrichedProspect[] = pSnap.docs.map(d => {
        const p = { id: d.id, ...d.data() } as Prospect;
        return {
          ...p,
          score: scoresMap.get(p.id),
          message: messagesMap.get(p.id),
        };
      });

      enriched.sort((a, b) => (b.score?.score ?? 0) - (a.score?.score ?? 0));
      setProspects(enriched);
    } catch (err) {
      console.error('Firestore load prospects error:', err);
      setProspects([]);
    } finally {
      setLoadingProspects(false);
    }
  }, []);

  /* ─── SELECT CAMPAIGN ─── */
  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('leads');
    setFilterPriority('all');
    setFilterStatus('all');
    setFilterHasWhatsapp(false);
    setExpandedMessageId(null);
    loadProspects(campaign);
  };

  /* ─── CREATE CAMPAIGN ─── */
  const handleCreateCampaign = async () => {
    if (!formNiche.trim() || !formCity.trim() || !formOffer.trim()) return;
    setSavingCampaign(true);
    try {
      const data: Omit<Campaign, 'id'> = {
        userId: ADMIN_USER_ID,
        niche: formNiche.trim(),
        city: formCity.trim(),
        country: formCountry.trim(),
        offer: formOffer.trim(),
        targetCount: formTargetCount,
        channel: formChannel,
        status: 'draft',
        totalProspectsFound: 0,
        totalQualifiedLeads: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, 'campaigns'), data);
      const newCampaign: Campaign = { id: ref.id, ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
      setCampaigns(prev => [newCampaign, ...prev]);
      setShowNewForm(false);
      setFormNiche(''); setFormCity(''); setFormOffer('');
      setFormTargetCount(10); setFormChannel('whatsapp');
    } catch (err) {
      console.error('Firestore create campaign error:', err);
    } finally {
      setSavingCampaign(false);
    }
  };

  /* ─── RUN CAMPAIGN ─── */
  const handleRunSimulation = async (campaign: Campaign) => {
    if (simStep !== 'idle') return;
    setSimCampaignId(campaign.id);
    setSimStep('searching');
    setSimProgress(5);

    try {
      await updateDoc(doc(db, 'campaigns', campaign.id), { status: 'running', updatedAt: serverTimestamp() });
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'running' } : c));

      // 1. Google Places
      const rawProspects = await fetchProspects(campaign);
      setSimStep('enriching');
      setSimProgress(30);

      // 2. Save prospects to Firestore
      const savedProspects: (Omit<Prospect, 'id'> & { id: string })[] = [];
      for (const p of rawProspects) {
        const ref = await addDoc(collection(db, 'prospects'), stripUndefined(p));
        savedProspects.push({ id: ref.id, ...p });
      }
      setSimStep('scoring');
      setSimProgress(55);

      // 3. OpenAI scoring — parallel by batches of 3
      const enrichedResults: EnrichedProspect[] = [];
      const batchSize = 3;
      for (let i = 0; i < savedProspects.length; i += batchSize) {
        const batch = savedProspects.slice(i, i + batchSize);
        const scored = await Promise.all(batch.map(async sp => {
          const scoreData = await fetchScore(sp.id, sp, campaign);
          const scoreRef = await addDoc(collection(db, 'lead_scores'), stripUndefined(scoreData));
          return { prospect: sp, score: { id: scoreRef.id, ...scoreData } };
        }));
        enrichedResults.push(...scored.map(({ prospect, score }) => ({ ...prospect, score })));
        setSimProgress(55 + Math.round(((i + batchSize) / savedProspects.length) * 20));
      }

      setSimStep('messaging');
      setSimProgress(75);

      // 4. OpenAI messages — parallel by batches of 3
      for (let i = 0; i < enrichedResults.length; i += batchSize) {
        const batch = enrichedResults.slice(i, i + batchSize);
        await Promise.all(batch.map(async ep => {
          const msgData = await fetchMessage(ep.id, ep, campaign, ep.score!);
          const msgRef = await addDoc(collection(db, 'lead_messages'), stripUndefined(msgData));
          ep.message = { id: msgRef.id, ...msgData };
        }));
        setSimProgress(75 + Math.round(((i + batchSize) / enrichedResults.length) * 20));
      }

      const count = savedProspects.length;
      const hotCount = enrichedResults.filter(e => e.score?.priority === 'hot').length;

      await updateDoc(doc(db, 'campaigns', campaign.id), {
        status: 'completed',
        totalProspectsFound: count,
        totalQualifiedLeads: hotCount,
        updatedAt: serverTimestamp(),
      });

      const updatedCampaign: Campaign = { ...campaign, status: 'completed', totalProspectsFound: count, totalQualifiedLeads: hotCount };
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? updatedCampaign : c));
      enrichedResults.sort((a, b) => (b.score?.score ?? 0) - (a.score?.score ?? 0));

      setSimProgress(100);
      setSimStep('done');

      setSelectedCampaign(updatedCampaign);
      setProspects(enrichedResults);
      setActiveTab('leads');
    } catch (err) {
      console.error('Campaign error:', err);
      await updateDoc(doc(db, 'campaigns', campaign.id), { status: 'failed', updatedAt: serverTimestamp() }).catch(() => {});
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: 'failed' } : c));
    } finally {
      setTimeout(() => { setSimStep('idle'); setSimProgress(0); setSimCampaignId(null); }, 1500);
    }
  };

  /* ─── DELETE CAMPAIGN ─── */
  const handleDeleteCampaign = async (campaignId: string) => {
    setDeletingCampaignId(campaignId);
    try {
      const batch = writeBatch(db);

      // Delete all sub-documents
      const [pSnap, sSnap, mSnap] = await Promise.all([
        getDocs(query(collection(db, 'prospects'), where('campaignId', '==', campaignId))),
        getDocs(query(collection(db, 'lead_scores'), where('campaignId', '==', campaignId))),
        getDocs(query(collection(db, 'lead_messages'), where('campaignId', '==', campaignId))),
      ]);
      pSnap.docs.forEach(d => batch.delete(d.ref));
      sSnap.docs.forEach(d => batch.delete(d.ref));
      mSnap.docs.forEach(d => batch.delete(d.ref));
      batch.delete(doc(db, 'campaigns', campaignId));
      await batch.commit();

      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    } catch (err) {
      console.error('Delete campaign error:', err);
    } finally {
      setDeletingCampaignId(null);
      setConfirmDeleteId(null);
    }
  };

  /* ─── UPDATE PROSPECT STATUS ─── */
  const handleUpdateProspectStatus = async (prospectId: string, newStatus: Prospect['status']) => {
    try {
      await updateDoc(doc(db, 'prospects', prospectId), { status: newStatus, updatedAt: serverTimestamp() });
      setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error('Update prospect error:', err);
    }
  };

  /* ─── COPY MESSAGE ─── */
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ─── EXPORT CSV ─── */
  const handleExportCSV = () => {
    if (!prospects.length || !selectedCampaign) return;
    const rows = [
      ['Nom', 'Ville', 'Pays', 'Téléphone', 'Site web', 'Email', 'Score', 'Priorité', 'Statut', 'Problème détecté'].join(','),
      ...filteredProspects.map(p => [
        `"${p.name}"`,
        `"${p.city}"`,
        `"${p.country}"`,
        `"${p.phone ?? ''}"`,
        `"${p.website ?? ''}"`,
        `"${p.email ?? ''}"`,
        p.score?.score ?? '',
        p.score?.priority ?? '',
        p.status,
        `"${(p.score?.detectedProblem ?? '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${selectedCampaign.niche}_${selectedCampaign.city}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── FILTERED PROSPECTS ─── */
  const filteredProspects = useMemo(() => {
    return prospects.filter(p => {
      if (filterPriority !== 'all' && p.score?.priority !== filterPriority) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterHasWhatsapp && !p.phone) return false;
      return true;
    });
  }, [prospects, filterPriority, filterStatus, filterHasWhatsapp]);

  /* ─── STATS ─── */
  const stats = useMemo(() => ({
    total: prospects.length,
    hot: prospects.filter(p => p.score?.priority === 'hot').length,
    warm: prospects.filter(p => p.score?.priority === 'warm').length,
    meetings: prospects.filter(p => p.status === 'meeting_booked').length,
  }), [prospects]);

  /* ─── GUARD ─── */
  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  /* ─── RENDER ─── */
  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ background: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: `${PRIMARY}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} color={PRIMARY} />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>Leads IA</h1>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Génération & qualification automatique</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/admin')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            <Settings size={13} /> Admin
          </button>
          <button onClick={() => router.push('/admin/core')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}33`, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
            <Zap size={13} /> Ozirus Core
          </button>
          <button onClick={() => router.push('/admin/marketing')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#10B98115', color: '#10B981', border: '1px solid #10B98133', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
            <TrendingUp size={13} /> Marketing
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px', maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* ─── CAMPAIGNS VIEW ─── */}
        {activeTab === 'campaigns' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>Campagnes de prospection</h2>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{campaigns.length} campagne{campaigns.length !== 1 ? 's' : ''} au total</p>
              </div>
              <button
                onClick={() => setShowNewForm(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: PRIMARY, color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${PRIMARY}40` }}
              >
                <Plus size={16} /> Nouvelle Campagne
              </button>
            </div>

            {/* New campaign form */}
            {showNewForm && (
              <div style={{ ...card, padding: 24, border: `2px solid ${PRIMARY}30` }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 20 }}>Nouvelle campagne de prospection</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Niche / Secteur *</label>
                    <input value={formNiche} onChange={e => setFormNiche(e.target.value)} placeholder="ex: Restaurants, Hôtels, Pharmacies..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ville *</label>
                    <input value={formCity} onChange={e => setFormCity(e.target.value)} placeholder="ex: Douala, Paris, Abidjan..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Pays</label>
                    <input value={formCountry} onChange={e => setFormCountry(e.target.value)} placeholder="ex: Cameroun, France..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nombre de leads cibles</label>
                    <input type="number" min={1} max={50} value={formTargetCount} onChange={e => setFormTargetCount(parseInt(e.target.value) || 10)} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Offre commerciale *</label>
                    <textarea
                      value={formOffer}
                      onChange={e => setFormOffer(e.target.value)}
                      placeholder="ex: Chatbot WhatsApp IA — automatisez vos commandes 24h/24 pour 99 000 FCFA/mois..."
                      style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Canal de contact</label>
                    <select value={formChannel} onChange={e => setFormChannel(e.target.value as Campaign['channel'])} style={inputStyle}>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="call">Appel téléphonique</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button
                    onClick={handleCreateCampaign}
                    disabled={savingCampaign || !formNiche || !formCity || !formOffer}
                    style={{ background: PRIMARY, color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: savingCampaign ? 'not-allowed' : 'pointer', opacity: (!formNiche || !formCity || !formOffer) ? 0.6 : 1 }}
                  >
                    {savingCampaign ? 'Enregistrement...' : 'Créer la campagne'}
                  </button>
                  <button onClick={() => setShowNewForm(false)} style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Campaigns table */}
            {loadingCampaigns ? (
              <div style={{ ...card, padding: 40, textAlign: 'center', color: '#94A3B8' }}>
                <Clock size={24} style={{ marginBottom: 8 }} />
                <p style={{ margin: 0 }}>Chargement des campagnes...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div style={{ ...card, padding: 60, textAlign: 'center' }}>
                <Target size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#64748B', margin: '0 0 4px' }}>Aucune campagne</p>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Créez votre première campagne pour démarrer la prospection automatique.</p>
              </div>
            ) : (
              <div style={{ ...card, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Niche', 'Ville', 'Canal', 'Prospects', 'Hot Leads', 'Statut', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => {
                      const isRunning = simStep !== 'idle' && simCampaignId === c.id;
                      return (
                        <tr
                          key={c.id}
                          style={{ borderBottom: i < campaigns.length - 1 ? '1px solid #F1F5F9' : 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFF')}
                          onMouseLeave={e => (e.currentTarget.style.background = '')}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              onClick={() => c.status === 'completed' && handleSelectCampaign(c)}
                              style={{ background: 'none', border: 'none', cursor: c.status === 'completed' ? 'pointer' : 'default', padding: 0, textAlign: 'left' }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{c.niche}</span>
                            </button>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{c.city}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: 6 }}>{CHANNEL_LABELS[c.channel]}</span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{c.totalProspectsFound}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: c.totalQualifiedLeads > 0 ? '#EF4444' : '#94A3B8' }}>{c.totalQualifiedLeads}</span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <StatusBadge status={c.status} />
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: '#94A3B8' }}>
                            {formatDate(c.createdAt)}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              {c.status === 'completed' && (
                                <button
                                  onClick={() => handleSelectCampaign(c)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${PRIMARY}15`, color: PRIMARY, border: 'none', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                >
                                  <Users size={12} /> Voir leads
                                </button>
                              )}
                              {(c.status === 'draft' || c.status === 'failed') && (
                                <button
                                  onClick={() => handleRunSimulation(c)}
                                  disabled={simStep !== 'idle'}
                                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: isRunning ? '#F1F5F9' : '#0F172A', color: isRunning ? '#64748B' : '#FFF', border: 'none', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: simStep !== 'idle' ? 'not-allowed' : 'pointer' }}
                                >
                                  {isRunning ? <Clock size={12} /> : <Play size={12} />}
                                  {isRunning ? getSimLabel(simStep) : 'Lancer l\'analyse'}
                                </button>
                              )}
                              {isRunning && (
                                <div style={{ width: 80, height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${simProgress}%`, background: PRIMARY, borderRadius: 2, transition: 'width 0.5s ease' }} />
                                </div>
                              )}
                              {/* Delete button */}
                              {!isRunning && (
                                confirmDeleteId === c.id ? (
                                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>Confirmer ?</span>
                                    <button
                                      onClick={() => handleDeleteCampaign(c.id)}
                                      disabled={deletingCampaignId === c.id}
                                      style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
                                    >
                                      {deletingCampaignId === c.id ? '...' : 'Oui'}
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteId(null)}
                                      style={{ background: '#F1F5F9', color: '#64748B', border: 'none', padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      Non
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteId(c.id)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#FFF', color: '#CBD5E1', border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'pointer' }}
                                    title="Supprimer la campagne"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── LEADS VIEW ─── */}
        {activeTab === 'leads' && selectedCampaign && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Back + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => { setActiveTab('campaigns'); setSelectedCampaign(null); setProspects([]); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                <ArrowLeft size={14} /> Retour
              </button>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {selectedCampaign.niche} — {selectedCampaign.city}
                </h2>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>
                  {CHANNEL_LABELS[selectedCampaign.channel]} · {selectedCampaign.totalProspectsFound} prospects trouvés
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <StatCard icon={<Users size={20} color={PRIMARY} />} label="Total prospects" value={stats.total} color={PRIMARY} />
              <StatCard icon={<Zap size={20} color="#EF4444" />} label="Hot leads" value={stats.hot} color="#EF4444" />
              <StatCard icon={<TrendingUp size={20} color="#F59E0B" />} label="Warm leads" value={stats.warm} color="#F59E0B" />
              <StatCard icon={<CheckCircle size={20} color="#10B981" />} label="RDV pris" value={stats.meetings} color="#10B981" />
            </div>

            {/* Filters + export */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} color="#64748B" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Filtres :</span>
              </div>

              <div style={{ display: 'flex', gap: 4 }}>
                {(['all', 'hot', 'warm', 'cold'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                      background: filterPriority === p ? priorityColor(p === 'all' ? 'hot' : p) + '20' : '#F1F5F9',
                      color: filterPriority === p ? (p === 'all' ? PRIMARY : priorityColor(p)) : '#64748B',
                    }}
                  >
                    {p === 'all' ? 'Tous' : p === 'hot' ? 'Hot' : p === 'warm' ? 'Warm' : 'Cold'}
                  </button>
                ))}
              </div>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                style={{ ...inputStyle, width: 'auto', padding: '6px 10px', fontSize: 12 }}
              >
                <option value="all">Tous les statuts</option>
                {(Object.keys(STATUS_PROSPECT_LABELS) as Prospect['status'][]).map(s => (
                  <option key={s} value={s}>{STATUS_PROSPECT_LABELS[s]}</option>
                ))}
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filterHasWhatsapp}
                  onChange={e => setFilterHasWhatsapp(e.target.checked)}
                  style={{ accentColor: PRIMARY, width: 14, height: 14 }}
                />
                Avec téléphone
              </label>

              <div style={{ marginLeft: 'auto' }}>
                <button
                  onClick={handleExportCSV}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0F172A', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Leads table */}
            {loadingProspects ? (
              <div style={{ ...card, padding: 40, textAlign: 'center', color: '#94A3B8' }}>
                <Clock size={24} style={{ marginBottom: 8 }} />
                <p style={{ margin: 0 }}>Chargement des prospects...</p>
              </div>
            ) : filteredProspects.length === 0 ? (
              <div style={{ ...card, padding: 40, textAlign: 'center' }}>
                <AlertCircle size={32} color="#CBD5E1" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>Aucun prospect correspondant aux filtres</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, ...card, overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 80px 100px 140px 40px', gap: 0, background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Établissement', 'Ville', 'Téléphone', 'Site web', 'Score', 'Priorité', 'Statut CRM', ''].map(h => (
                    <div key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                  ))}
                </div>

                {filteredProspects.map((p, i) => {
                  const isExpanded = expandedMessageId === p.id;
                  const score = p.score?.score ?? null;
                  const scoreColor = score === null ? '#94A3B8' : score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

                  return (
                    <div key={p.id} style={{ borderBottom: i < filteredProspects.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <div
                        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 80px 100px 140px 40px', alignItems: 'center', padding: '4px 0', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FAFBFF')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        {/* Name */}
                        <div style={{ padding: '10px 14px' }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{p.name}</p>
                          {p.score?.detectedProblem && (
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>{p.score.detectedProblem}</p>
                          )}
                        </div>

                        {/* City */}
                        <div style={{ padding: '10px 14px', fontSize: 12, color: '#475569' }}>{p.city}</div>

                        {/* Phone */}
                        <div style={{ padding: '10px 14px' }}>
                          {p.phone ? (
                            <a href={`tel:${p.phone}`} style={{ fontSize: 12, color: '#0F172A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Phone size={11} color="#64748B" /> {p.phone}
                            </a>
                          ) : (
                            <span style={{ fontSize: 12, color: '#CBD5E1' }}>—</span>
                          )}
                        </div>

                        {/* Website */}
                        <div style={{ padding: '10px 14px' }}>
                          {p.website ? (
                            <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: PRIMARY, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Globe size={11} /> Site web
                            </a>
                          ) : (
                            <span style={{ fontSize: 12, color: '#CBD5E1' }}>—</span>
                          )}
                        </div>

                        {/* Score */}
                        <div style={{ padding: '10px 14px' }}>
                          <span style={{ display: 'inline-block', background: scoreColor + '18', color: scoreColor, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                            {score !== null ? score : '—'}
                          </span>
                        </div>

                        {/* Priority */}
                        <div style={{ padding: '10px 14px' }}>
                          <PriorityBadge priority={p.score?.priority} />
                        </div>

                        {/* Status select */}
                        <div style={{ padding: '6px 14px' }}>
                          <select
                            value={p.status}
                            onChange={e => handleUpdateProspectStatus(p.id, e.target.value as Prospect['status'])}
                            style={{ ...inputStyle, padding: '5px 8px', fontSize: 11, width: '100%' }}
                          >
                            {(Object.keys(STATUS_PROSPECT_LABELS) as Prospect['status'][]).map(s => (
                              <option key={s} value={s}>{STATUS_PROSPECT_LABELS[s]}</option>
                            ))}
                          </select>
                        </div>

                        {/* Toggle message */}
                        <div style={{ padding: '10px 8px', display: 'flex', justifyContent: 'center' }}>
                          {p.message && (
                            <button
                              onClick={() => setExpandedMessageId(isExpanded ? null : p.id)}
                              style={{ background: isExpanded ? `${PRIMARY}15` : '#F1F5F9', color: isExpanded ? PRIMARY : '#64748B', border: 'none', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Voir le message"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <MessageSquare size={13} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded message */}
                      {isExpanded && p.message && (
                        <div style={{ margin: '0 14px 16px', background: '#F8FAFC', border: `1px solid ${PRIMARY}20`, borderRadius: 10, padding: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, background: PRIMARY + '15', color: PRIMARY, padding: '3px 8px', borderRadius: 6 }}>{CHANNEL_LABELS[p.message.channel]}</span>
                              <span style={{ fontSize: 11, color: '#94A3B8' }}>Message personnalisé</span>
                            </div>
                            <button
                              onClick={() => handleCopy(p.id, p.message!.message)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, background: copiedId === p.id ? '#10B98115' : '#FFF', color: copiedId === p.id ? '#10B981' : '#475569', border: '1px solid #E2E8F0', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                            >
                              {copiedId === p.id ? <Check size={12} /> : <Copy size={12} />}
                              {copiedId === p.id ? 'Copié !' : 'Copier'}
                            </button>
                          </div>
                          <pre style={{ margin: 0, fontSize: 12, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{p.message.message}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SMALL COMPONENTS ─────────────────────────────── */
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#FFF', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, background: color + '15', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#0F172A' }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign['status'] }) {
  const config: Record<Campaign['status'], { label: string; bg: string; color: string }> = {
    draft: { label: 'Brouillon', bg: '#F1F5F9', color: '#64748B' },
    running: { label: 'En cours', bg: '#DBEAFE', color: '#2563EB' },
    completed: { label: 'Terminé', bg: '#DCFCE7', color: '#16A34A' },
    failed: { label: 'Erreur', bg: '#FEE2E2', color: '#DC2626' },
  };
  const c = config[status];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 20 }}>
      {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority?: LeadScore['priority'] }) {
  if (!priority) return <span style={{ fontSize: 12, color: '#CBD5E1' }}>—</span>;
  const config: Record<LeadScore['priority'], { label: string; dot: string; bg: string; color: string }> = {
    hot: { label: 'Hot', dot: '🔴', bg: '#FEE2E2', color: '#DC2626' },
    warm: { label: 'Warm', dot: '🟡', bg: '#FEF9C3', color: '#CA8A04' },
    cold: { label: 'Cold', dot: '🔵', bg: '#DBEAFE', color: '#2563EB' },
  };
  const c = config[priority];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {c.dot} {c.label}
    </span>
  );
}

/* ─── HELPERS ──────────────────────────────────────── */
function priorityColor(p: LeadScore['priority']): string {
  return p === 'hot' ? '#EF4444' : p === 'warm' ? '#F59E0B' : '#3B82F6';
}

function getSimLabel(step: SimStep): string {
  const labels: Record<SimStep, string> = {
    idle: '',
    searching: 'Recherche...',
    enriching: 'Enrichissement...',
    scoring: 'Scoring IA...',
    messaging: 'Messages...',
    done: 'Terminé',
  };
  return labels[step];
}

function formatDate(ts: any): string {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return '—';
  }
}
