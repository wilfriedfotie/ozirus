'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, TrendingUp, TrendingDown, ShoppingBag, Users,
  Package, Truck, CheckCircle2, Clock, AlertTriangle,
  BarChart3, MessageSquare, Star, Zap, RefreshCw,
  ChevronDown, ChevronUp, Eye, X, Settings,
  DollarSign, Activity, Target, Filter,
} from 'lucide-react';

// ─── Design tokens — same as /admin ─────────────────────────────────────────
const C = {
  bg:        '#F1F5F9',
  panel:     '#FFFFFF',
  border:    '#E2E8F0',
  divider:   '#F1F5F9',
  primary:   '#7967FF',
  primaryBg: '#7967FF15',
  primaryBd: '#7967FF33',
  ink:       '#0F172A',
  mid:       '#475569',
  muted:     '#64748B',
  faint:     '#94A3B8',
  surface:   '#F8FAFC',
  success:   '#10B981',
  danger:    '#EF4444',
  warn:      '#F59E0B',
} as const;

// ─── Mock data ───────────────────────────────────────────────────────────────

const SECTORS = ['Restauration', 'Logistique', 'Boutique', 'Immobilier', 'B2B'];

const KPI_DATA = {
  ca_today:       { value: '1 284 500', unit: 'FCFA', trend: +12.4, label: 'CA du jour' },
  orders_today:   { value: '147',        unit: 'cmd',  trend: +8.2,  label: 'Commandes' },
  active_agents:  { value: '5',          unit: 'actifs', trend: 0,  label: 'Agents IA' },
  avg_response:   { value: '1m 12s',     unit: '',     trend: -18,   label: 'Tps réponse' },
  conversions:    { value: '68%',        unit: '',     trend: +5.1,  label: 'Taux conversion' },
  satisfaction:   { value: '4.8',        unit: '/5',   trend: +0.2,  label: 'Satisfaction' },
};

const ORDERS: Order[] = [
  { id: '#2025-1847', client: 'Fatou Ngo',       sector: 'Restauration', product: 'Ndolé + Poulet DG',         amount: 9500,    status: 'delivered', agent: 'Lina',   time: '18:42', channel: 'WhatsApp' },
  { id: '#2025-1846', client: 'Eric Mbarga',      sector: 'Boutique',     product: 'Sneakers Air Max T42',      amount: 45000,   status: 'pending',   agent: 'Amina',  time: '18:38', channel: 'WhatsApp' },
  { id: '#2025-1845', client: 'M. Kamga',          sector: 'Immobilier',   product: 'Villa Bastos — Caution',    amount: 50000,   status: 'delivered', agent: 'Ismaël', time: '18:21', channel: 'WhatsApp' },
  { id: '#2025-1844', client: 'Syscom SARL',       sector: 'B2B',          product: 'Audit comptable F-2025-041',amount: 1800000, status: 'pending',   agent: 'Solène', time: '17:55', channel: 'Email' },
  { id: '#2025-1843', client: 'Carine Essoh',      sector: 'Boutique',     product: 'Robe satinée noire T40',    amount: 24000,   status: 'delivered', agent: 'Amina',  time: '17:41', channel: 'WhatsApp' },
  { id: '#2025-1842', client: 'M. Nkoa',           sector: 'Logistique',   product: 'Colis #0041 — COD',         amount: 12500,   status: 'transit',   agent: 'Balla',  time: '17:30', channel: 'WhatsApp' },
  { id: '#2025-1841', client: 'Isabelle Fouda',    sector: 'Boutique',     product: 'Vente privée VIP — 3 art.', amount: 72000,   status: 'delivered', agent: 'Amina',  time: '17:12', channel: 'WhatsApp' },
  { id: '#2025-1840', client: 'M. Biyong (DG)',    sector: 'B2B',          product: 'Optimisation fiscale Q2',   amount: 650000,  status: 'pending',   agent: 'Solène', time: '16:58', channel: 'Email' },
  { id: '#2025-1839', client: 'Mme Bella',         sector: 'Logistique',   product: 'Colis #0034 — COD',         amount: 8900,    status: 'failed',    agent: 'Balla',  time: '16:40', channel: 'WhatsApp' },
  { id: '#2025-1838', client: 'Restaurant Palme',  sector: 'Restauration', product: 'Fidélité QR — 14 inscrits', amount: 0,       status: 'delivered', agent: 'Lina',   time: '16:22', channel: 'QR Code' },
  { id: '#2025-1837', client: 'M. Diop',           sector: 'Immobilier',   product: 'Appartement Biyem-Assi',    amount: 50000,   status: 'transit',   agent: 'Ismaël', time: '15:55', channel: 'WhatsApp' },
  { id: '#2025-1836', client: 'Fouko SARL',        sector: 'B2B',          product: 'CRM — Pipeline setup',      amount: 490000,  status: 'delivered', agent: 'Solène', time: '15:31', channel: 'WhatsApp' },
];

const AGENTS = [
  { name: 'Lina',    avatar: '/agents/lina-3d.png', sector: 'Restauration', msgs: 312, conversions: 78, satisfaction: 4.9, status: 'online' },
  { name: 'Amina',   avatar: '/agents/amina-3d.png',  sector: 'Boutique',     msgs: 241, conversions: 65, satisfaction: 4.8, status: 'online' },
  { name: 'Balla',   avatar: '/agents/balla-3d.png',  sector: 'Logistique',   msgs: 189, conversions: 91, satisfaction: 4.7, status: 'online' },
  { name: 'Ismaël',  avatar: '/agents/ismael-3d.png', sector: 'Immobilier',   msgs: 94,  conversions: 58, satisfaction: 4.9, status: 'online' },
  { name: 'Solène',  avatar: '/agents/solene-3d.png',  sector: 'B2B',          msgs: 77,  conversions: 72, satisfaction: 4.7, status: 'online' },
];

function AgentAvatar({ avatar, size = 20, style = {} }: { avatar: string; size?: number; style?: React.CSSProperties }) {
  const [isOpen, setIsOpen] = useState(false);
  const isImage = avatar.startsWith('/') || avatar.startsWith('http');
  if (isImage) {
    return (
      <>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }
          }}
          style={{ display: 'inline-flex', width: size, height: size, cursor: 'zoom-in', borderRadius: 8, overflow: 'hidden', ...style }}
          title="Voir l'agent"
        >
          <img src={avatar} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
        </span>
        {isOpen && (
          <div
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.72)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', width: 'min(520px, 88vw)', aspectRatio: '1 / 1', borderRadius: 24, overflow: 'hidden', background: '#FFF', boxShadow: '0 30px 80px rgba(0,0,0,0.35)' }}
            >
              <img src={avatar} alt="Agent IA" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(255,255,255,0.55)', background: 'rgba(15,23,42,0.58)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
  return <span style={{ fontSize: size, ...style }}>{avatar}</span>;
}

const HOURLY_CA = [
  { h: '8h',  v: 24000  },
  { h: '9h',  v: 87000  },
  { h: '10h', v: 142000 },
  { h: '11h', v: 198000 },
  { h: '12h', v: 312000 },
  { h: '13h', v: 285000 },
  { h: '14h', v: 196000 },
  { h: '15h', v: 231000 },
  { h: '16h', v: 178000 },
  { h: '17h', v: 241000 },
  { h: '18h', v: 189000 },
];

const SECTOR_SPLIT = [
  { label: 'Restauration', pct: 28, msgs: 312 },
  { label: 'Boutique',     pct: 24, msgs: 241 },
  { label: 'Logistique',   pct: 20, msgs: 189 },
  { label: 'B2B',          pct: 17, msgs: 77  },
  { label: 'Immobilier',   pct: 11, msgs: 94  },
];

const ALERTS = [
  { type: 'warn',    text: 'Colis #0034 — livraison échouée (Mme Bella absente)', time: '16:40' },
  { type: 'info',    text: 'Stock Sneakers T42 — dernier exemplaire réservé', time: '17:55' },
  { type: 'success', text: 'Villa Bastos — caution 50 000 FCFA reçue (M. Diop)', time: '15:55' },
  { type: 'warn',    text: 'Facture F-2025-041 (Syscom) — échéance dans 3 jours', time: '09:00' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus = 'delivered' | 'pending' | 'transit' | 'failed';
interface Order {
  id: string; client: string; sector: string; product: string;
  amount: number; status: OrderStatus; agent: string; time: string; channel: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n === 0 ? '—' : new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

const statusMeta: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  delivered: { label: 'Livré',    color: '#15803D', bg: '#F0FDF4' },
  pending:   { label: 'En cours', color: '#B45309', bg: '#FFFBEB' },
  transit:   { label: 'Transit',  color: '#1D4ED8', bg: '#EFF6FF' },
  failed:    { label: 'Échoué',   color: '#BE123C', bg: '#FFF1F2' },
};

// ─── Page entry ──────────────────────────────────────────────────────────────

export default function ManagerPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif', fontSize: 13, color: C.muted }}>Chargement...</div>}>
      <ManagerDashboard />
    </Suspense>
  );
}

function ManagerDashboard() {
  const router = useRouter();
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'commandes' | 'agents' | 'alertes'>('commandes');

  const orders = ORDERS.filter(o => {
    if (sectorFilter !== 'all' && o.sector !== sectorFilter) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const totalFiltered = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, overflow: 'hidden', fontFamily: 'var(--font-sans-loaded), "DM Sans", sans-serif' }}>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.push('/admin')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, color: C.muted, cursor: 'pointer' }}>
            <ArrowLeft size={13} /> Admin
          </button>
          <div style={{ width: 1, height: 22, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={15} color={C.primary} />
            </div>
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: 0 }}>Backoffice Manager</h1>
              <p style={{ fontSize: 10, color: C.faint, margin: 0 }}>Vue opérationnelle temps réel</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.success, boxShadow: `0 0 0 3px ${C.success}22` }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: C.success }}>LIVE</span>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: C.muted, cursor: 'pointer' }}
          >
            <RefreshCw size={12} />
            {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </button>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* KPI strip */}
        <div style={{ padding: '16px 28px 0', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, flexShrink: 0 }}>
          {Object.entries(KPI_DATA).map(([key, k]) => (
            <KpiCard key={key} {...k} />
          ))}
        </div>

        {/* Main 2-col layout */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px 28px 20px', gap: 16 }}>

          {/* ── LEFT: chart + table ──────────────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden', minWidth: 0 }}>

            {/* CA Chart */}
            <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 20px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0 }}>CA horaire — aujourd'hui</p>
                  <p style={{ fontSize: 10, color: C.faint, margin: '2px 0 0' }}>En FCFA · mis à jour à {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.success, background: '#F0FDF4', padding: '3px 9px', borderRadius: 6 }}>+12.4% vs hier</span>
              </div>
              <BarChart data={HOURLY_CA} />
            </div>

            {/* Orders table */}
            <div style={{ flex: 1, background: C.panel, borderRadius: 14, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0 }}>Commandes</p>
                  <span style={{ fontSize: 10, fontWeight: 700, background: C.primaryBg, color: C.primary, padding: '2px 8px', borderRadius: 5 }}>{orders.length}</span>
                </div>
                {/* Filters */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <select
                    value={sectorFilter}
                    onChange={e => setSectorFilter(e.target.value)}
                    style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="all">Tous secteurs</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="all">Tous statuts</option>
                    <option value="delivered">Livrés</option>
                    <option value="pending">En cours</option>
                    <option value="transit">Transit</option>
                    <option value="failed">Échoués</option>
                  </select>
                  {totalFiltered > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '5px 10px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.ink }}>{fmt(totalFiltered)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Table head */}
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px 130px 90px 80px', gap: 0, padding: '8px 18px', background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                {['Réf', 'Client & Produit', 'Secteur', 'Montant', 'Statut', 'Agent'].map(h => (
                  <span key={h} style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {orders.map(o => {
                  const s = statusMeta[o.status];
                  const isSelected = selectedOrder?.id === o.id;
                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrder(isSelected ? null : o)}
                      style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px 130px 90px 80px', gap: 0, padding: '11px 18px', borderBottom: `1px solid ${C.divider}`, cursor: 'pointer', background: isSelected ? C.primaryBg : 'transparent', transition: 'background 0.12s' }}
                    >
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: isSelected ? C.primary : C.ink, margin: 0 }}>{o.id}</p>
                        <p style={{ fontSize: 9, color: C.faint, margin: '2px 0 0' }}>{o.time}</p>
                      </div>
                      <div style={{ paddingRight: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, margin: 0 }}>{o.client}</p>
                        <p style={{ fontSize: 10, color: C.muted, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.product}</p>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, alignSelf: 'center' }}>{o.sector}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: C.ink, alignSelf: 'center' }}>{o.amount > 0 ? fmt(o.amount) : <span style={{ color: C.faint }}>—</span>}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 5, alignSelf: 'center', display: 'inline-flex', alignItems: 'center', height: 22 }}>{s.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'center' }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <AgentAvatar avatar={AGENTS.find(a => a.name === o.agent)?.avatar || ''} size={22} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>{o.agent}</span>
                      </div>
                    </div>
                  );
                })}
                {orders.length === 0 && (
                  <div style={{ padding: 32, textAlign: 'center', color: C.faint, fontSize: 12 }}>Aucune commande pour ce filtre</div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT sidebar ────────────────────────────────────────── */}
          <div style={{ width: 296, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>

            {/* Order detail */}
            {selectedOrder ? (
              <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            ) : (
              <>
                {/* Tab selector */}
                <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  <div style={{ display: 'flex', background: C.divider, padding: 4, margin: 14, borderRadius: 9, gap: 2, flexShrink: 0 }}>
                    {(['commandes', 'agents', 'alertes'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: activeTab === t ? 800 : 600, background: activeTab === t ? C.panel : 'transparent', color: activeTab === t ? C.primary : C.muted, boxShadow: activeTab === t ? '0 1px 3px rgba(0,0,0,0.07)' : 'none', transition: 'all 0.12s', textTransform: 'capitalize' }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px' }}>
                    {activeTab === 'commandes' && <SectorSplit />}
                    {activeTab === 'agents'    && <AgentsPanel />}
                    {activeTab === 'alertes'   && <AlertsPanel />}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────

function KpiCard({ value, unit, trend, label }: { value: string; unit: string; trend: number; label: string }) {
  const up = trend > 0;
  const neutral = trend === 0;
  return (
    <div style={{ background: C.panel, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: C.ink, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>{unit}</span>}
      </div>
      {!neutral && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {up ? <TrendingUp size={11} color={C.success} /> : <TrendingDown size={11} color={C.danger} />}
          <span style={{ fontSize: 10, fontWeight: 800, color: up ? C.success : C.danger }}>{up ? '+' : ''}{trend}%</span>
          <span style={{ fontSize: 9, color: C.faint }}>vs hier</span>
        </div>
      )}
      {neutral && <span style={{ fontSize: 9, color: C.faint }}>En ligne</span>}
    </div>
  );
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { h: string; v: number }[] }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {data.map((d, i) => {
        const pct = (d.v / max) * 100;
        const isNow = i === data.length - 1;
        return (
          <div key={d.h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <div
              title={`${d.h} : ${new Intl.NumberFormat('fr-FR').format(d.v)} FCFA`}
              style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                background: isNow ? C.primary : C.primaryBg,
                border: isNow ? 'none' : `1px solid ${C.primaryBd}`,
                height: `${pct}%`,
                minHeight: 4,
                transition: 'height 0.4s ease',
                cursor: 'help',
              }}
            />
            <span style={{ fontSize: 9, color: C.faint, whiteSpace: 'nowrap' }}>{d.h}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── ORDER DETAIL ─────────────────────────────────────────────────────────────

function OrderDetail({ order: o, onClose }: { order: Order; onClose: () => void }) {
  const s = statusMeta[o.status];
  const agent = AGENTS.find(a => a.name === o.agent);
  return (
    <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: C.ink, margin: 0 }}>{o.id}</p>
        <button onClick={onClose} style={{ width: 24, height: 24, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={12} color={C.muted} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Status */}
        <span style={{ fontSize: 10, fontWeight: 800, color: s.color, background: s.bg, padding: '4px 10px', borderRadius: 6, alignSelf: 'flex-start' }}>{s.label}</span>
        {/* Client */}
        <div style={{ background: C.surface, borderRadius: 9, padding: 12, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Client</p>
          <p style={{ fontSize: 13, fontWeight: 800, color: C.ink, margin: 0 }}>{o.client}</p>
          <p style={{ fontSize: 10, color: C.muted, margin: '3px 0 0' }}>{o.sector} · {o.channel}</p>
        </div>
        {/* Product */}
        <div style={{ background: C.surface, borderRadius: 9, padding: 12, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Produit</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, margin: 0 }}>{o.product}</p>
        </div>
        {/* Amount */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: o.amount > 0 ? C.primaryBg : C.surface, borderRadius: 9, border: `1px solid ${o.amount > 0 ? C.primaryBd : C.border}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>Montant</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: o.amount > 0 ? C.primary : C.faint }}>{fmt(o.amount)}</span>
        </div>
        {/* Time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: C.faint }}>Heure</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>{o.time}</span>
        </div>
        {/* Agent */}
        {agent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: C.ink, borderRadius: 10, marginTop: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <AgentAvatar avatar={agent.avatar || ''} size={34} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#FFF', margin: 0 }}>{agent.name}</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>Satisfaction {agent.satisfaction}/5</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
              <span style={{ fontSize: 9, color: C.success, fontWeight: 700 }}>En ligne</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTOR SPLIT ─────────────────────────────────────────────────────────────

function SectorSplit() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>Messages par secteur</p>
      {SECTOR_SPLIT.map(s => (
        <div key={s.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.primary }}>{s.msgs} msg</span>
          </div>
          <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${s.pct}%`, background: C.primary, borderRadius: 3, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <span style={{ fontSize: 9, color: C.faint }}>{s.pct}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AGENTS PANEL ─────────────────────────────────────────────────────────────

function AgentsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {AGENTS.map(a => (
        <div key={a.name} style={{ padding: '10px 12px', background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <AgentAvatar avatar={a.avatar} size={34} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0 }}>{a.name}</p>
              <p style={{ fontSize: 9, color: C.muted, margin: '1px 0 0' }}>{a.sector}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: C.success }}>En ligne</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            <Micro label="Messages" value={String(a.msgs)} />
            <Micro label="Conversion" value={`${a.conversions}%`} />
            <Micro label="Note" value={`${a.satisfaction}★`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Micro({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.panel, borderRadius: 7, padding: '6px 8px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
      <p style={{ fontSize: 12, fontWeight: 900, color: C.ink, margin: 0 }}>{value}</p>
      <p style={{ fontSize: 8, color: C.faint, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
    </div>
  );
}

// ─── ALERTS PANEL ─────────────────────────────────────────────────────────────

function AlertsPanel() {
  const icon = (type: string) => {
    if (type === 'warn')    return <AlertTriangle size={13} color={C.warn} />;
    if (type === 'success') return <CheckCircle2 size={13} color={C.success} />;
    return <Activity size={13} color={C.primary} />;
  };
  const bg = (type: string) => {
    if (type === 'warn')    return '#FFFBEB';
    if (type === 'success') return '#F0FDF4';
    return C.primaryBg;
  };
  const bd = (type: string) => {
    if (type === 'warn')    return '#FDE68A';
    if (type === 'success') return '#BBF7D0';
    return C.primaryBd;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ALERTS.map((a, i) => (
        <div key={i} style={{ padding: '10px 12px', background: bg(a.type), border: `1px solid ${bd(a.type)}`, borderRadius: 10, display: 'flex', gap: 8 }}>
          <div style={{ flexShrink: 0, marginTop: 1 }}>{icon(a.type)}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.ink, margin: 0, lineHeight: 1.4 }}>{a.text}</p>
            <p style={{ fontSize: 9, color: C.faint, margin: '4px 0 0' }}>{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
