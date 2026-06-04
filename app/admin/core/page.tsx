'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Zap, Bot, Clock, Sparkles, X, Info,
  CheckCircle2, BarChart3, TrendingUp, TrendingDown, RefreshCw,
  AlertTriangle, Activity, User, Briefcase, ChevronRight,
  LayoutDashboard, MessageSquare, Heart, Package, Star,
  UtensilsCrossed, ShoppingBag, Home, Truck, Users, Phone,
  MoreVertical, Paperclip, Mic, Camera, Smile, Smartphone,
  CheckCheck,
} from 'lucide-react';
import { SECTORS, PILLARS, SectorData, SectorId, PillarId, Deliverable } from './coreData';

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Manager mock data ────────────────────────────────────────────────────────

const HOURLY_CA = [
  { h: '8h',  v: 24000  }, { h: '9h',  v: 87000  }, { h: '10h', v: 142000 },
  { h: '11h', v: 198000 }, { h: '12h', v: 312000 }, { h: '13h', v: 285000 },
  { h: '14h', v: 196000 }, { h: '15h', v: 231000 }, { h: '16h', v: 178000 },
  { h: '17h', v: 241000 }, { h: '18h', v: 189000 },
];

const MGR_AGENTS = [
  { name: 'Lina',   avatar: '/agents/lina-3d.png', sector: 'Restauration', msgs: 312, conversions: 78, satisfaction: 4.9 },
  { name: 'Amina',  avatar: '/agents/amina-3d.png', sector: 'Boutique',     msgs: 241, conversions: 65, satisfaction: 4.8 },
  { name: 'Balla',  avatar: '/agents/balla-3d.png', sector: 'Logistique',   msgs: 189, conversions: 91, satisfaction: 4.7 },
  { name: 'Ismaël', avatar: '/agents/ismael-3d.png', sector: 'Immobilier',   msgs: 94,  conversions: 58, satisfaction: 4.9 },
  { name: 'Solène', avatar: '/agents/solene-3d.png', sector: 'B2B',          msgs: 77,  conversions: 72, satisfaction: 4.7 },
];

type OrderStatus = 'delivered' | 'pending' | 'transit' | 'failed';
interface Order {
  id: string; client: string; sector: string; product: string;
  amount: number; status: OrderStatus; agent: string; time: string; channel: string;
}
type ManagerAgent = { name: string; avatar: string; sector: string; msgs: number; conversions: number; satisfaction: number };
type ManagerAlert = { type: 'warn' | 'info' | 'success'; text: string; time: string };
type ManagerKpi = { key: string; label: string; value: string; unit: string; trend: number };
type ManagerSectorData = {
  kpis: ManagerKpi[];
  hourly: { h: string; v: number }[];
  orders: Order[];
  split: { label: string; pct: number; msgs: number }[];
  agents: ManagerAgent[];
  alerts: ManagerAlert[];
};

const ORDERS: Order[] = [
  { id: '#2025-1847', client: 'Fatou Ngo',      sector: 'Restauration', product: 'Ndolé + Poulet DG',          amount: 9500,    status: 'delivered', agent: 'Lina',   time: '18:42', channel: 'WhatsApp' },
  { id: '#2025-1846', client: 'Eric Mbarga',     sector: 'Boutique',     product: 'Sneakers Air Max T42',       amount: 45000,   status: 'pending',   agent: 'Amina',  time: '18:38', channel: 'WhatsApp' },
  { id: '#2025-1845', client: 'M. Kamga',        sector: 'Immobilier',   product: 'Villa Bastos — Caution',     amount: 50000,   status: 'delivered', agent: 'Ismaël', time: '18:21', channel: 'WhatsApp' },
  { id: '#2025-1844', client: 'Syscom SARL',     sector: 'B2B',          product: 'Audit F-2025-041',           amount: 1800000, status: 'pending',   agent: 'Solène', time: '17:55', channel: 'Email'    },
  { id: '#2025-1843', client: 'Carine Essoh',    sector: 'Boutique',     product: 'Robe satinée noire T40',     amount: 24000,   status: 'delivered', agent: 'Amina',  time: '17:41', channel: 'WhatsApp' },
  { id: '#2025-1842', client: 'M. Nkoa',         sector: 'Logistique',   product: 'Colis #0041 — COD',          amount: 12500,   status: 'transit',   agent: 'Balla',  time: '17:30', channel: 'WhatsApp' },
  { id: '#2025-1841', client: 'Isabelle Fouda',  sector: 'Boutique',     product: 'Vente privée VIP — 3 art.', amount: 72000,   status: 'delivered', agent: 'Amina',  time: '17:12', channel: 'WhatsApp' },
  { id: '#2025-1840', client: 'M. Biyong (DG)',  sector: 'B2B',          product: 'Optimisation fiscale Q2',    amount: 650000,  status: 'pending',   agent: 'Solène', time: '16:58', channel: 'Email'    },
  { id: '#2025-1839', client: 'Mme Bella',       sector: 'Logistique',   product: 'Colis #0034 — COD',          amount: 8900,    status: 'failed',    agent: 'Balla',  time: '16:40', channel: 'WhatsApp' },
  { id: '#2025-1838', client: 'Restaurant Palme',sector: 'Restauration', product: 'Fidélité QR — 14 inscrits',  amount: 0,       status: 'delivered', agent: 'Lina',   time: '16:22', channel: 'QR Code'  },
  { id: '#2025-1837', client: 'M. Diop',         sector: 'Immobilier',   product: 'Appartement Biyem-Assi',     amount: 50000,   status: 'transit',   agent: 'Ismaël', time: '15:55', channel: 'WhatsApp' },
  { id: '#2025-1836', client: 'Fouko SARL',      sector: 'B2B',          product: 'CRM — Pipeline setup',       amount: 490000,  status: 'delivered', agent: 'Solène', time: '15:31', channel: 'WhatsApp' },
];

const baseKpis = (ca: string, orders: string, agents: string, response: string, conversion: string, satisfaction: string): ManagerKpi[] => [
  { key: 'ca',           label: 'CA du jour',    value: ca,           unit: 'FCFA',   trend: +12.4 },
  { key: 'orders',       label: 'Opérations',    value: orders,       unit: '',       trend: +8.2  },
  { key: 'agents',       label: 'Agents IA',     value: agents,       unit: 'actifs', trend: 0     },
  { key: 'response',     label: 'Tps réponse',   value: response,     unit: '',       trend: -18   },
  { key: 'conversion',   label: 'Conversion',    value: conversion,   unit: '',       trend: +5.1  },
  { key: 'satisfaction', label: 'Satisfaction',  value: satisfaction, unit: '/5',     trend: +0.2  },
];

const makeHourly = (values: number[]) => ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'].map((h, i) => ({ h, v: values[i] }));

const MANAGER_BY_SECTOR: Record<SectorId, ManagerSectorData> = {
  restaurant: {
    kpis: baseKpis('1 284 500', '147 cmd', '1', '1m 12s', '68%', '4.8'),
    hourly: HOURLY_CA,
    orders: ORDERS.filter(o => o.sector === 'Restauration'),
    split: [
      { label: 'Commandes WhatsApp', pct: 48, msgs: 148 },
      { label: 'Réservations', pct: 26, msgs: 81 },
      { label: 'Avis & fidélité', pct: 18, msgs: 56 },
      { label: 'Stock cuisine', pct: 8, msgs: 27 },
    ],
    agents: [MGR_AGENTS[0]],
    alerts: [
      { type: 'success', text: '12 commandes WhatsApp encaissées automatiquement ce soir', time: '18:42' },
      { type: 'warn', text: 'Poulet bientôt en rupture — commande fournisseur recommandée', time: '17:18' },
      { type: 'info', text: '41 clients inactifs ciblés pour la relance weekend', time: '16:50' },
    ],
  },
  realestate: {
    kpis: baseKpis('150 000', '23 leads', '1', '2m 05s', '58%', '4.9'),
    hourly: makeHourly([8000, 12000, 18000, 25000, 50000, 30000, 42000, 50000, 22000, 18000, 15000]),
    orders: ORDERS.filter(o => o.sector === 'Immobilier'),
    split: [
      { label: 'Prospects qualifiés', pct: 42, msgs: 39 },
      { label: 'Visites planifiées', pct: 28, msgs: 26 },
      { label: 'Cautions reçues', pct: 20, msgs: 18 },
      { label: 'Documents envoyés', pct: 10, msgs: 11 },
    ],
    agents: [MGR_AGENTS[3]],
    alerts: [
      { type: 'success', text: 'Villa Bastos — caution 50 000 FCFA reçue', time: '18:21' },
      { type: 'info', text: '3 prospects chauds à rappeler avant 19h', time: '17:05' },
      { type: 'warn', text: 'M. Diop en transit dossier — pièce d’identité manquante', time: '15:55' },
    ],
  },
  logistics: {
    kpis: baseKpis('587 500', '47 colis', '1', '52s', '91%', '4.7'),
    hourly: makeHourly([24000, 52000, 73000, 84000, 96000, 72000, 68000, 78000, 52000, 61000, 47000]),
    orders: ORDERS.filter(o => o.sector === 'Logistique'),
    split: [
      { label: 'Suivi colis', pct: 44, msgs: 83 },
      { label: 'Paiements COD', pct: 31, msgs: 59 },
      { label: 'Reprogrammations', pct: 16, msgs: 31 },
      { label: 'Preuves photo', pct: 9, msgs: 16 },
    ],
    agents: [MGR_AGENTS[2]],
    alerts: [
      { type: 'warn', text: 'Colis #0034 — livraison échouée, client absent', time: '16:40' },
      { type: 'success', text: '0 FCFA d’écart caisse sur les encaissements du jour', time: '16:15' },
      { type: 'info', text: 'Jean-Baptiste meilleur livreur : 14 livraisons', time: '15:30' },
    ],
  },
  retail: {
    kpis: baseKpis('528 000', '39 ventes', '1', '1m 04s', '65%', '4.8'),
    hourly: makeHourly([18000, 35000, 48000, 71000, 62000, 58000, 79000, 84000, 92000, 71000, 54000]),
    orders: ORDERS.filter(o => o.sector === 'Boutique'),
    split: [
      { label: 'Catalogue WhatsApp', pct: 43, msgs: 104 },
      { label: 'Stock & réservations', pct: 27, msgs: 65 },
      { label: 'Paniers relancés', pct: 18, msgs: 43 },
      { label: 'VIP & fidélité', pct: 12, msgs: 29 },
    ],
    agents: [MGR_AGENTS[1]],
    alerts: [
      { type: 'info', text: 'Stock Sneakers T42 — dernier exemplaire réservé', time: '17:55' },
      { type: 'success', text: '9 paniers abandonnés récupérés cette semaine', time: '17:20' },
      { type: 'warn', text: 'Ceintures homme : faible rotation depuis 30 jours', time: '14:10' },
    ],
  },
  b2b: {
    kpis: baseKpis('2 940 000', '18 dossiers', '1', '2m 40s', '72%', '4.7'),
    hourly: makeHourly([0, 180000, 320000, 0, 850000, 0, 490000, 650000, 450000, 0, 0]),
    orders: ORDERS.filter(o => o.sector === 'B2B'),
    split: [
      { label: 'Pipeline commercial', pct: 36, msgs: 28 },
      { label: 'Facturation', pct: 29, msgs: 22 },
      { label: 'KYC prospects', pct: 22, msgs: 17 },
      { label: 'Support client', pct: 13, msgs: 10 },
    ],
    agents: [MGR_AGENTS[4]],
    alerts: [
      { type: 'warn', text: 'Facture F-2025-041 — échéance dans 3 jours', time: '09:00' },
      { type: 'success', text: 'Syscom SARL qualifié, budget estimé 3–5M FCFA', time: '15:55' },
      { type: 'info', text: '3 opportunités chaudes prévues en signature ce mois', time: '11:20' },
    ],
  },
  pharmacy: {
    kpis: baseKpis('612 400', '74 ord.', '1', '48s', '58%', '4.7'),
    hourly: makeHourly([32000, 48000, 78000, 92000, 84000, 61000, 54000, 69000, 74000, 63000, 57000]),
    orders: [
      { id: '#2025-2107', client: 'Mme Ngo', sector: 'Pharmacies', product: 'Ordonnance — 3/4 produits', amount: 18700, status: 'pending', agent: 'Nora', time: '18:12', channel: 'WhatsApp' },
      { id: '#2025-2106', client: 'M. Talla', sector: 'Pharmacies', product: 'Renouvellement tension', amount: 23500, status: 'delivered', agent: 'Nora', time: '17:40', channel: 'WhatsApp' },
      { id: '#2025-2105', client: 'Carine Essoh', sector: 'Pharmacies', product: 'Parapharmacie fidélité', amount: 16400, status: 'delivered', agent: 'Nora', time: '16:18', channel: 'Comptoir' },
    ],
    split: [
      { label: 'Ordonnances WhatsApp', pct: 45, msgs: 74 },
      { label: 'Demandes disponibilité', pct: 30, msgs: 49 },
      { label: 'Renouvellements', pct: 17, msgs: 28 },
      { label: 'Livraisons', pct: 8, msgs: 13 },
    ],
    agents: [{ name: 'Nora', avatar: '/agents/nora-3d.png', sector: 'Pharmacies', msgs: 164, conversions: 58, satisfaction: 4.7 }],
    alerts: [
      { type: 'warn', text: 'Amoxicilline 500 mg : rupture estimée demain 11h', time: '17:12' },
      { type: 'success', text: '41 renouvellements traitement confirmés cette semaine', time: '16:40' },
      { type: 'info', text: '12 lots proches péremption à mettre en avant', time: '09:30' },
    ],
  },
  education: {
    kpis: baseKpis('1 240 000', '64 adm.', '1', '1m 35s', '41%', '4.8'),
    hourly: makeHourly([0, 85000, 140000, 185000, 220000, 110000, 0, 170000, 210000, 120000, 0]),
    orders: [
      { id: '#2025-3104', client: 'Mme Essomba', sector: 'Éducation', product: '2e tranche scolarité — Kevin', amount: 85000, status: 'pending', agent: 'Maya', time: '18:05', channel: 'WhatsApp' },
      { id: '#2025-3103', client: 'M. Fotso', sector: 'Éducation', product: 'Frais test entrée 4e', amount: 15000, status: 'delivered', agent: 'Maya', time: '16:30', channel: 'Mobile Money' },
      { id: '#2025-3102', client: 'Mme Talla', sector: 'Éducation', product: 'Certificat absence Sarah', amount: 0, status: 'delivered', agent: 'Maya', time: '14:20', channel: 'WhatsApp' },
    ],
    split: [
      { label: 'Admissions', pct: 36, msgs: 64 },
      { label: 'Scolarité', pct: 28, msgs: 51 },
      { label: 'Absences parents', pct: 22, msgs: 39 },
      { label: 'Notes & bulletins', pct: 14, msgs: 25 },
    ],
    agents: [{ name: 'Maya', avatar: '/agents/maya-3d.png', sector: 'Éducation', msgs: 179, conversions: 41, satisfaction: 4.8 }],
    alerts: [
      { type: 'success', text: '9 inscriptions confirmées via WhatsApp cette semaine', time: '17:05' },
      { type: 'warn', text: '12 dossiers scolarité critiques à +30 jours', time: '15:50' },
      { type: 'info', text: '67 élèves à risque détectés pour soutien scolaire', time: '11:15' },
    ],
  },
};

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  delivered: { label: 'Livré',    color: '#15803D', bg: '#F0FDF4' },
  pending:   { label: 'En cours', color: '#B45309', bg: '#FFFBEB' },
  transit:   { label: 'Transit',  color: '#1D4ED8', bg: '#EFF6FF' },
  failed:    { label: 'Échoué',   color: '#BE123C', bg: '#FFF1F2' },
};

const fmtFCFA = (n: number) =>
  n === 0 ? '—' : new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

// ─── Sector taglines & stats for onboarding ───────────────────────────────────
const SECTOR_ONBOARDING = [
  { id: 'restaurant', stat: '6 livrables',  description: 'Commandes, fidélité, avis clients' },
  { id: 'realestate', stat: '6 livrables',  description: 'Pipeline, visites, signature' },
  { id: 'logistics',  stat: '6 livrables',  description: 'Suivi colis, COD, preuves' },
  { id: 'retail',     stat: '6 livrables',  description: 'Catalogue WhatsApp, stock, VIP' },
  { id: 'b2b',        stat: '6 livrables',  description: 'KYC, CRM, facturation' },
  { id: 'pharmacy',   stat: '6 livrables',  description: 'Ordonnances, stock, renouvellements' },
  { id: 'education',  stat: '6 livrables',  description: 'Admissions, scolarité, parents' },
];

const SECTOR_TAB_LABEL: Record<SectorId, string> = {
  restaurant: 'Resto',
  realestate: 'Immo',
  logistics: 'Logistique',
  retail: 'Retail',
  b2b: 'B2B',
  pharmacy: 'Pharma',
  education: 'Éducation',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TopView = 'catalogue' | 'manager';

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

// ─── Entry ───────────────────────────────────────────────────────────────────
export default function CorePage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', fontSize: 13, color: C.muted }}>
        Chargement...
      </div>
    }>
      <CoreRoot />
    </Suspense>
  );
}

function CoreRoot() {
  const router = useRouter();
  const [selectedSectorId, setSelectedSectorId] = useState<SectorId | null>(null);
  const [topView, setTopView] = useState<TopView>('catalogue');

  // Once sector chosen, show the main shell
  if (!selectedSectorId) {
    return <SectorOnboarding onSelect={id => setSelectedSectorId(id)} onBack={() => router.push('/admin')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '0 18px',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        zIndex: 100
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <img src="/logo.png" alt="Ozirus" style={{ width: 30, height: 30, objectFit: 'contain', borderRadius: 8 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 900, color: C.ink, margin: 0, lineHeight: 1 }}>Ozirus</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.faint, margin: '2px 0 0', lineHeight: 1 }}>Core</p>
            </div>
          </div>
          <div style={{ width: 1, height: 24, background: C.border }} />
          {/* Back to onboarding */}
          <button
            onClick={() => setSelectedSectorId(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 9,
              padding: '7px 10px', fontSize: 12, fontWeight: 800, color: C.mid,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.surface}
            onMouseLeave={(e) => e.currentTarget.style.background = '#FFF'}
          >
            <ArrowLeft size={14} /> Secteurs
          </button>

          {/* Sector Selector Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            minWidth: 0,
            overflow: 'hidden',
            background: '#F8FAFC',
            border: `1px solid ${C.border}`,
            padding: 3,
            borderRadius: 12
          }}>
            {SECTORS.map(s => {
              const isActive = selectedSectorId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSectorId(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    height: 34,
                    padding: '0 10px', borderRadius: 9, fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', border: 'none',
                    background: isActive ? '#FFF' : 'transparent',
                    color: isActive ? s.color : C.muted,
                    boxShadow: isActive ? '0 1px 5px rgba(15, 23, 42, 0.08)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <s.icon size={14} />
                  {SECTOR_TAB_LABEL[s.id]}
                </button>
              );
            })}
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', background: '#F8FAFC', border: `1px solid ${C.border}`, padding: 3, borderRadius: 12, gap: 2, marginLeft: 12, flexShrink: 0 }}>
          {(['catalogue', 'manager'] as TopView[]).map(v => {
            const isActive = topView === v;
            return (
              <button
                key={v}
                onClick={() => setTopView(v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  height: 34,
                  padding: '0 13px', borderRadius: 9, fontSize: 12, fontWeight: 800,
                  cursor: 'pointer', border: 'none',
                  background: isActive ? '#FFF' : 'transparent',
                  color: isActive ? C.primary : C.muted,
                  boxShadow: isActive ? '0 1px 5px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap'
                }}
              >
                {v === 'catalogue' ? <><Zap size={14} /> Catalogue</> : <><BarChart3 size={14} /> Manager</>}
              </button>
            );
          })}
        </div>

        {topView === 'manager' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 12, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 34, padding: '0 12px', background: '#F0FDF4',
              border: '1px solid #BBF7D0', borderRadius: 12
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: C.success, letterSpacing: 0 }}>Live</span>
            </div>
          </div>
        )}
      </div>

      {/* ── VIEWS ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {topView === 'catalogue'
          ? <CatalogueView sectorId={selectedSectorId} />
          : <ManagerView sectorId={selectedSectorId} />
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING — sector selection screen
// ═══════════════════════════════════════════════════════════════════════════════

function SectorOnboarding({ onSelect, onBack }: { onSelect: (id: SectorId) => void; onBack: () => void }) {
  const [hovered, setHovered] = useState<SectorId | null>(null);

  return (
    <div style={{
      height: '100vh',
      background: '#F8FAFC',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(121, 103, 255, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.05) 0px, transparent 50%)
      `,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .onboarding-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .onboarding-card:hover { transform: translateY(-8px); }
        .stagger-1 { animation: fadeIn 0.5s ease-out forwards; }
        .stagger-2 { animation: fadeIn 0.5s ease-out 0.1s forwards; opacity: 0; }
        .stagger-3 { animation: fadeIn 0.5s ease-out 0.2s forwards; opacity: 0; }
        .stagger-4 { animation: fadeIn 0.5s ease-out 0.3s forwards; opacity: 0; }
      `}</style>

      {/* Top bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '0 24px',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Ozirus" style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 9 }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: 0 }}>Ozirus Core</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>Catalogue IA sectoriel</p>
            </div>
          </div>
          <div style={{ width: 1, height: 24, background: C.border }} />
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '8px 14px', fontSize: 12, fontWeight: 700, color: C.mid,
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.faint; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.borderColor = C.border; }}
          >
            <ArrowLeft size={14} /> Quitter l'Admin
          </button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 16px', background: '#FFF',
          border: `1px solid ${C.border}`, borderRadius: 24,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>42 Solutions Actives</span>
        </div>
      </div>

      {/* Hero Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 24px 20px', maxWidth: 1320, margin: '0 auto', width: '100%', minHeight: 0
      }}>

        <div className="stagger-1" style={{ textAlign: 'center', marginBottom: 22, maxWidth: 760 }}>
          <h1 style={{
            fontSize: 36, fontWeight: 950, color: C.ink,
            margin: '0 0 10px', lineHeight: 1.05, letterSpacing: 0
          }}>
            Déployez l'IA au cœur de{' '}
            <span style={{
              background: 'linear-gradient(90deg, #7967FF 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>votre business.</span>
          </h1>

          <p style={{
            fontSize: 14, color: C.muted, margin: 0,
            lineHeight: 1.45, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
            fontWeight: 500
          }}>
            Choisissez un secteur pour explorer ses automatisations métier, ses agents et ses livrables prêts à vendre.
          </p>
        </div>

        {/* Sector Grid */}
        <div className="stagger-2" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 12,
          width: '100%',
          marginBottom: 20
        }}>
          {SECTORS.map((s, i) => {
            const ob = SECTOR_ONBOARDING.find(x => x.id === s.id)!;
            const isHov = hovered === s.id;

            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className="onboarding-card"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '18px 14px', borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: isHov ? '#FFF' : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: isHov
                    ? `0 20px 40px rgba(121, 103, 255, 0.15), 0 0 0 2px ${C.primary}`
                    : `0 4px 12px rgba(0,0,0,0.03), 0 0 0 1px ${C.border}`,
                  textAlign: 'left', position: 'relative', overflow: 'hidden',
                  backdropFilter: 'blur(8px)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Decorative background icon */}
                <s.icon
                  size={120}
                  style={{
                    position: 'absolute', right: -20, bottom: -20,
                    opacity: isHov ? 0.08 : 0.03, transform: isHov ? 'rotate(-10deg) scale(1.1)' : 'rotate(0deg)',
                    transition: 'all 0.5s ease', pointerEvents: 'none', color: isHov ? C.primary : C.ink
                  }}
                />

                {/* Icon Container */}
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: isHov ? C.primary : '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14, transition: 'all 0.3s',
                  boxShadow: isHov ? '0 8px 16px rgba(121, 103, 255, 0.3)' : '0 2px 6px rgba(0,0,0,0.05)',
                  border: isHov ? 'none' : `1px solid ${C.border}`
                }}>
                  <s.icon size={21} color={isHov ? '#FFF' : C.mid} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 15, fontWeight: 900, color: C.ink,
                    margin: '0 0 6px', lineHeight: 1.15, letterSpacing: 0
                  }}>{s.name}</h3>

                  <p style={{
                    fontSize: 11, color: isHov ? C.mid : C.muted,
                    margin: '0 0 14px', lineHeight: 1.35, fontWeight: 600, minHeight: 30
                  }}>
                    {ob.description}
                  </p>
                </div>

                {/* Footer with Badge */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', width: '100%', marginTop: 'auto'
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800, color: isHov ? '#FFF' : C.primary,
                    background: isHov ? C.primary : C.primaryBg,
                    padding: '5px 8px', borderRadius: 9, transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <Zap size={12} />
                    {ob.stat}
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: isHov ? C.primaryBg : C.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s', transform: isHov ? 'translateX(4px)' : 'none'
                  }}>
                    <ChevronRight size={15} color={isHov ? C.primary : C.faint} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pillars Footer */}
        <div className="stagger-3" style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 10, fontWeight: 800, color: C.faint,
            textTransform: 'uppercase', letterSpacing: 0, marginBottom: 10
          }}>
            Propulsé par la Méthode Ozirus
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {PILLARS.map(p => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', background: 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: `${p.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <p.icon size={12} color={p.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.mid }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Blobs */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(121, 103, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', zIndex: -1, animation: 'float 10s infinite alternate'
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '-5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
        filter: 'blur(80px)', zIndex: -1, animation: 'float 12s infinite alternate-reverse'
      }} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// CATALOGUE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function CatalogueView({ sectorId }: { sectorId: SectorId }) {
  const [activePillar, setActivePillar] = useState<PillarId | 'all'>('all');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const sector = SECTORS.find(s => s.id === sectorId) || SECTORS[0];

  useEffect(() => { setSelectedDeliverable(null); setActivePillar('all'); }, [sectorId]);

  const counts = {
    all:                  sector.deliverables.length,
    backend_office:       sector.deliverables.filter(d => d.pillar === 'backend_office').length,
    communication_client: sector.deliverables.filter(d => d.pillar === 'communication_client').length,
    fidelisation:         sector.deliverables.filter(d => d.pillar === 'fidelisation').length,
  };

  const filtered = activePillar === 'all'
    ? sector.deliverables
    : sector.deliverables.filter(d => d.pillar === activePillar);

  return (
    <>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{ width: 260, background: '#F8FAFC', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '24px 20px 12px' }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: C.faint, letterSpacing: 0, textTransform: 'uppercase', margin: 0 }}>Catégories</p>
          </div>
          <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SidebarBtn label="Tout le catalogue" icon={Sparkles} count={counts.all} isActive={activePillar === 'all'} onClick={() => setActivePillar('all')} />
            <div style={{ height: 1, background: C.border, margin: '8px 8px' }} />
            {PILLARS.map(p => (
              <SidebarBtn key={p.id} label={p.label} icon={p.icon} count={counts[p.id]} isActive={activePillar === p.id} onClick={() => setActivePillar(p.id)} />
            ))}
          </div>

          {/* Agent card */}
          <div style={{ marginTop: 'auto', padding: 20 }}>
            <div style={{
              background: '#FFF', borderRadius: 20, padding: '20px',
              border: `1px solid ${C.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <p style={{
                fontSize: 10, fontWeight: 900, color: C.faint,
                letterSpacing: 0, textTransform: 'uppercase', margin: '0 0 16px'
              }}>Expert Secteur</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: C.primaryBg, border: `1px solid ${C.primaryBd}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(121, 103, 255, 0.1)',
                  overflow: 'hidden'
                }}>
                  <AgentAvatar avatar={sector.intents[0]?.agentAvatar} size={44} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: C.ink, margin: 0 }}>{sector.intents[0]?.agentName}</p>
                  <p style={{ fontSize: 11, color: C.primary, margin: '2px 0 0', fontWeight: 700 }}>{sector.intents[0]?.agentRole}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, boxShadow: `0 0 8px ${C.success}` }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.success }}>EN LIGNE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
          {activePillar === 'all' && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)' }}>
                  <Sparkles size={16} color="#FFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: C.ink, margin: 0, letterSpacing: 0 }}>Expériences Phares</h3>
                  <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>Parcours interactifs complets pour ce secteur.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {sector.intents.map(intent => (
                  <button
                    key={intent.id}
                    onClick={() => {
                      // Create a fake deliverable for the simulator
                      const fakeDeliverable: Deliverable = {
                        id: intent.id,
                        name: intent.name,
                        description: intent.description,
                        pillar: 'communication_client',
                        icon: intent.icon,
                        tags: ['Interactif', 'Flow'],
                        effort: 'Avancé',
                        timeline: '2–4 sem',
                        agent: intent.agentName,
                        agentAvatar: intent.agentAvatar,
                        metrics: intent.metrics,
                        prospectScript: sector.deliverables.find(d => d.id === 'resto_whatsapp_order')?.prospectScript || [],
                        bossScript: sector.deliverables.find(d => d.id === 'resto_whatsapp_order')?.bossScript || [],
                      };
                      setSelectedDeliverable(fakeDeliverable);
                      setShowSimulator(true);
                    }}
                    style={{
                      textAlign: 'left', cursor: 'pointer', padding: '20px', borderRadius: 20, border: 'none',
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
                      display: 'flex', gap: 16, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative', overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(121, 103, 255, 0.12), 0 0 0 1px rgba(121, 103, 255, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)'; }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: C.primaryBg, border: `1px solid ${C.primaryBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <intent.icon size={26} color={C.primary} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 900, color: C.ink, margin: '0 0 6px' }}>{intent.name}</h4>
                      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px', lineHeight: 1.4, fontWeight: 500 }}>{intent.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: C.success, background: '#F0FDF4', padding: '4px 8px', borderRadius: 6 }}>
                          <TrendingUp size={12} /> {intent.impact}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.primary, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Lancer la démo <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activePillar !== 'all' && (() => {
            const p = PILLARS.find(x => x.id === activePillar)!;
            return (
              <div style={{ marginBottom: 18, padding: '10px 12px', background: '#FFF', border: `1px solid ${C.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${p.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p.icon size={14} color={p.color} /></div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0 }}>{p.label}</p>
                  <p style={{ fontSize: 10, color: C.muted, margin: '2px 0 0' }}>{p.description}</p>
                </div>
              </div>
            );
          })()}

          {activePillar === 'all' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {PILLARS.map(p => {
                const items = sector.deliverables.filter(d => d.pillar === p.id);
                if (!items.length) return null;
                return (
                  <div key={p.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: C.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p.icon size={10} color={C.primary} /></div>
                      <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: 0, textTransform: 'uppercase', margin: 0 }}>{p.label}</p>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <span style={{ fontSize: 9, color: C.faint }}>{items.length} livrable{items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {items.map(d => <DeliverableCard key={d.id} deliverable={d} isSelected={selectedDeliverable?.id === d.id} onClick={() => setSelectedDeliverable(prev => prev?.id === d.id ? null : d)} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {filtered.map(d => <DeliverableCard key={d.id} deliverable={d} isSelected={selectedDeliverable?.id === d.id} onClick={() => setSelectedDeliverable(prev => prev?.id === d.id ? null : d)} />)}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div style={{ width: 296, background: C.panel, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          {selectedDeliverable
            ? <DeliverableDetail deliverable={selectedDeliverable} sector={sector} onClose={() => setSelectedDeliverable(null)} onSimulate={() => setShowSimulator(true)} />
            : <EmptyDetail sector={sector} total={sector.deliverables.length} />
          }
        </div>
      </div>

      {showSimulator && selectedDeliverable && (
        <SimulatorModal deliverable={selectedDeliverable} sector={sector} onClose={() => setShowSimulator(false)} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function ManagerView({ sectorId }: { sectorId: SectorId }) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'repartition' | 'agents' | 'alertes'>('repartition');
  const sector = SECTORS.find(s => s.id === sectorId) || SECTORS[0];
  const data = MANAGER_BY_SECTOR[sectorId];

  useEffect(() => {
    setSelectedOrder(null);
    setStatusFilter('all');
    setActiveTab('repartition');
  }, [sectorId]);

  const orders = data.orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });
  const totalFiltered = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* KPI strip */}
      <div style={{ padding: '14px 24px 0', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, flexShrink: 0 }}>
        {data.kpis.map(k => <KpiCard key={k.key} label={k.label} value={k.value} unit={k.unit} trend={k.trend} />)}
      </div>

      {/* Main 2-col */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '14px 24px 18px', gap: 14 }}>

        {/* Left: chart + table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', minWidth: 0 }}>

          {/* CA Chart */}
          <div style={{ background: C.panel, borderRadius: 12, border: `1px solid ${C.border}`, padding: '16px 18px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0 }}>{sector.name} — activité aujourd'hui</p>
                <p style={{ fontSize: 10, color: C.faint, margin: '2px 0 0' }}>FCFA · {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.success, background: '#F0FDF4', padding: '3px 9px', borderRadius: 6 }}>+12.4% vs hier</span>
                <button onClick={() => setLastRefresh(new Date())} style={{ display: 'flex', alignItems: 'center', gap: 4, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 9px', fontSize: 10, fontWeight: 600, color: C.muted, cursor: 'pointer' }}>
                  <RefreshCw size={11} /> Actualiser
                </button>
              </div>
            </div>
            <CaBarChart data={data.hourly} />
          </div>

          {/* Orders */}
          <div style={{ flex: 1, background: C.panel, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0 }}>Flux {SECTOR_TAB_LABEL[sectorId]}</p>
                <span style={{ fontSize: 10, fontWeight: 700, background: C.primaryBg, color: C.primary, padding: '2px 7px', borderRadius: 5 }}>{orders.length}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ fontSize: 11, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: '4px 8px', cursor: 'pointer', outline: 'none' }}>
                  <option value="all">Tous statuts</option>
                  <option value="delivered">Livrés</option>
                  <option value="pending">En cours</option>
                  <option value="transit">Transit</option>
                  <option value="failed">Échoués</option>
                </select>
                {totalFiltered > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '4px 9px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.ink }}>{fmtFCFA(totalFiltered)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Table head */}
            <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr 100px 130px 82px 76px', padding: '7px 16px', background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              {['Réf', 'Client & Produit', 'Secteur', 'Montant', 'Statut', 'Agent'].map(h => (
                <span key={h} style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0 }}>{h}</span>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {orders.map(o => {
                const sm = STATUS_META[o.status];
                const isSel = selectedOrder?.id === o.id;
                return (
                  <div key={o.id} onClick={() => setSelectedOrder(isSel ? null : o)} style={{ display: 'grid', gridTemplateColumns: '88px 1fr 100px 130px 82px 76px', padding: '10px 16px', borderBottom: `1px solid ${C.divider}`, cursor: 'pointer', background: isSel ? C.primaryBg : 'transparent', transition: 'background 0.12s' }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: isSel ? C.primary : C.ink, margin: 0 }}>{o.id}</p>
                      <p style={{ fontSize: 9, color: C.faint, margin: '2px 0 0' }}>{o.time}</p>
                    </div>
                    <div style={{ paddingRight: 10 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.ink, margin: 0 }}>{o.client}</p>
                      <p style={{ fontSize: 10, color: C.muted, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.product}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, alignSelf: 'center' }}>{o.sector}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.ink, alignSelf: 'center' }}>{o.amount > 0 ? fmtFCFA(o.amount) : <span style={{ color: C.faint }}>—</span>}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: sm.color, background: sm.bg, padding: '3px 7px', borderRadius: 5, alignSelf: 'center', display: 'inline-flex', alignItems: 'center', height: 20 }}>{sm.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, alignSelf: 'center' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <AgentAvatar avatar={data.agents.find(a => a.name === o.agent)?.avatar || ''} size={22} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>{o.agent}</span>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && <div style={{ padding: 28, textAlign: 'center', color: C.faint, fontSize: 12 }}>Aucune commande</div>}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          {selectedOrder ? (
            <MgrOrderDetail order={selectedOrder} agents={data.agents} onClose={() => setSelectedOrder(null)} />
          ) : (
            <div style={{ background: C.panel, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: C.divider, padding: 3, margin: 12, borderRadius: 9, gap: 2, flexShrink: 0 }}>
                {(['repartition', 'agents', 'alertes'] as const).map(t => {
                  const labels = { repartition: 'Répartition', agents: 'Agents', alertes: 'Alertes' };
                  return (
                    <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '6px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: activeTab === t ? 800 : 600, background: activeTab === t ? C.panel : 'transparent', color: activeTab === t ? C.primary : C.muted, boxShadow: activeTab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.12s' }}>
                      {labels[t]}
                    </button>
                  );
                })}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
                {activeTab === 'repartition' && <SectorSplit split={data.split} color={sector.color} />}
                {activeTab === 'agents'       && <AgentsPanel agents={data.agents} color={sector.color} />}
                {activeTab === 'alertes'      && <AlertsPanel alerts={data.alerts} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────

function KpiCard({ label, value, unit, trend }: { label: string; value: string; unit: string; trend: number }) {
  const up = trend > 0;
  return (
    <div style={{ background: C.panel, borderRadius: 10, border: `1px solid ${C.border}`, padding: '12px 14px' }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0, margin: '0 0 6px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 5 }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: C.ink, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 9, fontWeight: 700, color: C.muted }}>{unit}</span>}
      </div>
      {trend !== 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {up ? <TrendingUp size={10} color={C.success} /> : <TrendingDown size={10} color={C.danger} />}
          <span style={{ fontSize: 9, fontWeight: 800, color: up ? C.success : C.danger }}>{up ? '+' : ''}{trend}%</span>
          <span style={{ fontSize: 9, color: C.faint }}>vs hier</span>
        </div>
      ) : <span style={{ fontSize: 9, color: C.faint }}>En ligne</span>}
    </div>
  );
}

// ─── CA BAR CHART ─────────────────────────────────────────────────────────────

function CaBarChart({ data }: { data: { h: string; v: number }[] }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 72 }}>
      {data.map((d, i) => {
        const pct = (d.v / max) * 100;
        const isNow = i === data.length - 1;
        return (
          <div key={d.h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <div title={`${d.h} : ${new Intl.NumberFormat('fr-FR').format(d.v)} FCFA`} style={{ width: '100%', borderRadius: '3px 3px 0 0', background: isNow ? C.primary : C.primaryBg, border: isNow ? 'none' : `1px solid ${C.primaryBd}`, height: `${pct}%`, minHeight: 3, cursor: 'help' }} />
            <span style={{ fontSize: 8, color: C.faint }}>{d.h}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── ORDER DETAIL ─────────────────────────────────────────────────────────────

function MgrOrderDetail({ order: o, agents, onClose }: { order: Order; agents: ManagerAgent[]; onClose: () => void }) {
  const sm = STATUS_META[o.status];
  const agent = agents.find(a => a.name === o.agent);
  return (
    <div style={{ background: C.panel, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: C.ink, margin: 0 }}>{o.id}</p>
        <button onClick={onClose} style={{ width: 22, height: 22, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={11} color={C.muted} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: sm.color, background: sm.bg, padding: '3px 9px', borderRadius: 5, alignSelf: 'flex-start' }}>{sm.label}</span>
        <InfoBlock label="Client" value={o.client} sub={`${o.sector} · ${o.channel}`} />
        <InfoBlock label="Produit" value={o.product} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: o.amount > 0 ? C.primaryBg : C.surface, borderRadius: 8, border: `1px solid ${o.amount > 0 ? C.primaryBd : C.border}` }}>
          <span style={{ fontSize: 10, color: C.muted }}>Montant</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: o.amount > 0 ? C.primary : C.faint }}>{fmtFCFA(o.amount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: C.faint }}>Heure</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>{o.time}</span>
        </div>
        {agent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', background: C.ink, borderRadius: 9, marginTop: 2 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <AgentAvatar avatar={agent.avatar || ''} size={34} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#FFF', margin: 0 }}>{agent.name}</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{agent.satisfaction}/5 · {agent.conversions}% conv.</p>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: C.surface, borderRadius: 8, padding: '10px 11px', border: `1px solid ${C.border}` }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0, margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 10, color: C.muted, margin: '2px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── MANAGER SIDEBAR TABS ─────────────────────────────────────────────────────

function SectorSplit({ split, color }: { split: ManagerSectorData['split']; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0, margin: '0 0 2px' }}>Messages du secteur</p>
      {split.map(s => (
        <div key={s.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color }}>{s.msgs}</span>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${s.pct}%`, background: color, borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentsPanel({ agents, color }: { agents: ManagerAgent[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {agents.map(a => (
        <div key={a.name} style={{ padding: '10px 11px', background: C.surface, borderRadius: 9, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <AgentAvatar avatar={a.avatar} size={34} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: C.ink, margin: 0 }}>{a.name}</p>
              <p style={{ fontSize: 9, color: C.muted, margin: '1px 0 0' }}>{a.sector}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.success }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: C.success }}>En ligne</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
            {([['Msgs', String(a.msgs)], ['Conv.', `${a.conversions}%`], ['Note', `${a.satisfaction}/5`]] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ background: C.panel, borderRadius: 6, padding: '5px 6px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 900, color: C.ink, margin: 0 }}>{v}</p>
                <p style={{ fontSize: 8, color: C.faint, margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsPanel({ alerts }: { alerts: ManagerAlert[] }) {
  const meta = {
    warn:    { icon: <AlertTriangle size={12} color={C.warn} />,    bg: '#FFFBEB', bd: '#FDE68A' },
    info:    { icon: <Activity size={12} color={C.primary} />,      bg: C.primaryBg, bd: C.primaryBd },
    success: { icon: <CheckCircle2 size={12} color={C.success} />, bg: '#F0FDF4', bd: '#BBF7D0' },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((a, i) => {
        const m = meta[a.type as keyof typeof meta];
        return (
          <div key={i} style={{ padding: '9px 11px', background: m.bg, border: `1px solid ${m.bd}`, borderRadius: 9, display: 'flex', gap: 8 }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}>{m.icon}</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.ink, margin: 0, lineHeight: 1.45 }}>{a.text}</p>
              <p style={{ fontSize: 9, color: C.faint, margin: '3px 0 0' }}>{a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATALOGUE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function SidebarBtn({ label, icon: Icon, count, isActive, onClick }: { label: string; icon: any; count: number; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: isActive ? '#FFF' : 'transparent',
        color: isActive ? C.primary : C.muted,
        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%', textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 8,
          background: isActive ? C.primaryBg : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s'
        }}>
          <Icon size={14} color={isActive ? C.primary : C.muted} />
        </div>
        <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, lineHeight: 1.3 }}>{label}</span>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
        background: isActive ? C.primary : C.border,
        color: isActive ? '#FFF' : C.mid,
        transition: 'all 0.2s'
      }}>{count}</span>
    </button>
  );
}

function effortStyle(e: string): { bg: string; color: string } {
  if (e === 'Simple') return { bg: '#F0FDF4', color: '#15803D' };
  if (e === 'Moyen')  return { bg: '#FFFBEB', color: '#B45309' };
  return                     { bg: '#FFF1F2', color: '#BE123C' };
}

function DeliverableCard({ deliverable: d, isSelected, onClick }: { deliverable: Deliverable; isSelected: boolean; onClick: () => void }) {
  const es = effortStyle(d.effort);
  const pillar = PILLARS.find(p => p.id === d.pillar)!;
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: '#FFF', borderRadius: 16, padding: '20px', border: 'none',
        boxShadow: isSelected
          ? `0 0 0 2px ${C.primary}, 0 12px 24px rgba(121,103,255,0.12)`
          : `0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px ${C.border}`,
        display: 'flex', flexDirection: 'column', gap: 12,
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: isSelected ? C.primaryBg : C.surface,
          border: `1px solid ${isSelected ? C.primaryBd : C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s'
        }}>
          <d.icon size={20} color={isSelected ? C.primary : C.mid} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
            background: es.bg, color: es.color, textTransform: 'uppercase', letterSpacing: 0
          }}>{d.effort}</span>
          <span style={{ fontSize: 10, color: C.faint, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <Clock size={10} />{d.timeline}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{
          fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif',
          fontSize: 14, fontWeight: 800, color: C.ink,
          margin: '0 0 6px', lineHeight: 1.35, letterSpacing: 0
        }}>{d.name}</h4>
        <p style={{
          fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', fontWeight: 500
        } as any}>{d.description}</p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12, borderTop: `1px solid ${C.divider}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: `${pillar.color}15`, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <pillar.icon size={10} color={pillar.color} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: pillar.color }}>{pillar.label}</span>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 800, color: C.success,
          background: '#F0FDF4', padding: '4px 8px', borderRadius: 6
        }}>
          {d.metrics[0].value}
        </div>
      </div>
    </button>
  );
}

function DeliverableDetail({ deliverable: d, sector, onClose, onSimulate }: { deliverable: Deliverable; sector: SectorData; onClose: () => void; onSimulate: () => void }) {
  const es = effortStyle(d.effort);
  const pillar = PILLARS.find(p => p.id === d.pillar)!;
  return (
    <>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF' }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: C.faint, letterSpacing: 0, textTransform: 'uppercase', margin: 0 }}>Fiche Solution</p>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = C.divider} onMouseLeave={(e) => e.currentTarget.style.background = C.surface}><X size={14} color={C.mid} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 24, background: '#FFF' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: C.primaryBg, border: `1px solid ${C.primaryBd}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(121, 103, 255, 0.1)'
          }}><d.icon size={28} color={C.primary} /></div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: 18, fontWeight: 800, color: C.ink, margin: '0 0 8px', lineHeight: 1.3, letterSpacing: 0 }}>{d.name}</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: es.bg, color: es.color, textTransform: 'uppercase' }}>{d.effort}</span>
              <span style={{ fontSize: 10, color: C.faint, background: C.surface, border: `1px solid ${C.border}`, padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><Clock size={10} />{d.timeline}</span>
            </div>
          </div>
        </div>

        <div style={{ background: C.surface, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, color: C.mid, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{d.description}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px', background: '#FFF', borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${pillar.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><pillar.icon size={14} color={pillar.color} /></div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: 0, letterSpacing: 0 }}>{pillar.label}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: '3px 0 0', lineHeight: 1.4, fontWeight: 500 }}>{pillar.description}</p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 900, color: C.faint, letterSpacing: 0, textTransform: 'uppercase', margin: '0 0 12px' }}>Impact & Métriques</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.metrics.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FFF', borderRadius: 12, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: C.ink }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 900, color: C.faint, letterSpacing: 0, textTransform: 'uppercase', margin: '0 0 12px' }}>Expert Assigné</p>
          <div style={{ padding: '12px 16px', background: C.ink, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AgentAvatar avatar={d.agentAvatar} size={28} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#FFF', margin: 0 }}>{d.agent}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', fontWeight: 500 }}>Agent IA Spécialisé</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 10, background: '#FFF' }}>
        <button
          onClick={onSimulate}
          style={{
            width: '100%', background: 'linear-gradient(135deg, #7967FF 0%, #5B47FF 100%)',
            color: '#FFF', border: 'none', borderRadius: 14, padding: '14px',
            fontSize: 13, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 10px 20px rgba(121, 103, 255, 0.25)', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 28px rgba(121, 103, 255, 0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(121, 103, 255, 0.25)'; }}
        >
          <Bot size={18} /> Simuler l'expérience
        </button>
        <button style={{ width: '100%', background: '#FFF', color: C.mid, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = C.surface} onMouseLeave={(e) => e.currentTarget.style.background = '#FFF'}>
          Intégrer à ma proposition
        </button>
      </div>
    </>
  );
}

function EmptyDetail({ sector, total }: { sector: SectorData; total: number }) {
  const breakdown = PILLARS.map(p => ({ ...p, count: sector.deliverables.filter(d => d.pillar === p.id).length }));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FFF' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: C.faint, letterSpacing: 0, textTransform: 'uppercase', margin: 0 }}>Résumé Secteur</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ background: '#F8FAFC', border: `1px solid ${C.border}`, borderRadius: 24, padding: '24px', marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: C.primaryBg, border: `1px solid ${C.primaryBd}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 16px rgba(121, 103, 255, 0.1)'
          }}><sector.icon size={32} color={C.primary} /></div>
          <h3 style={{ fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif', fontSize: 20, fontWeight: 800, color: C.ink, margin: '0 0 8px', letterSpacing: 0 }}>{sector.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div style={{ padding: '16px', background: '#FFF', borderRadius: 16, border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 32, fontWeight: 950, color: C.primary, margin: 0, lineHeight: 1 }}>{total}</p>
              <p style={{ fontSize: 11, fontWeight: 800, color: C.faint, margin: '8px 0 0', textTransform: 'uppercase', letterSpacing: 0 }}>Solutions Disponibles</p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, fontWeight: 900, color: C.faint, letterSpacing: 0, textTransform: 'uppercase', margin: '0 0 16px' }}>Répartition par Pilier</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {breakdown.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#FFF', borderRadius: 16, border: `1px solid ${C.border}`, transition: 'all 0.2s' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p.icon size={14} color={p.color} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>{p.label}</p>
                <div style={{ marginTop: 6, height: 4, background: C.border, borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(p.count / total) * 100}%`, background: p.color, borderRadius: 10 }} />
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: p.color, flexShrink: 0 }}>{p.count}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '16px', background: C.primaryBg, borderRadius: 16, border: `1px solid ${C.primaryBd}`, marginTop: 32 }}>
          <Info size={16} color={C.primary} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: C.primary, margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
            Sélectionnez une solution dans la grille pour voir les détails, les métriques et lancer une simulation interactive.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATOR MODAL
// ═══════════════════════════════════════════════════════════════════════════════

type SimView = 'prospect' | 'boss';

function SimulatorModal({ deliverable: d, sector, onClose }: { deliverable: Deliverable; sector: SectorData; onClose: () => void }) {
  const [view, setView] = useState<SimView>('prospect');
  const [step, setStep] = useState(0);
  const [simPhase, setSimPhase] = useState<'qr' | 'chat'>('qr');
  const [showCatalogSheet, setShowCatalogSheet] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const messages = view === 'prospect' ? d.prospectScript : d.bossScript;
  const visible = messages.slice(0, step + 1);
  const isLast = step >= messages.length - 1;
  const nextMsg = messages[step + 1];

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [step, view, simPhase]);

  // Handle phase transition if first message is QR
  useEffect(() => {
    if (messages[0]?.type === 'qr' && step === 0 && view === 'prospect') {
      setSimPhase('qr');
    } else {
      setSimPhase('chat');
    }
  }, [view, d.id]);

  useEffect(() => { 
    setStep(0); 
    setShowCatalogSheet(false); 
    setCart({});
  }, [view]);

  const advance = () => {
    if (!isLast) setStep(s => s + 1);
  };

  const addToCart = (itemName: string) => {
    setCart(prev => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1
    }));
  };

  const bold = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>');

  const messageTime = (index: number) => {
    const minute = 42 + index;
    return `18:${String(minute % 60).padStart(2, '0')}`;
  };

  const bubbleStyle = (isRight: boolean): React.CSSProperties => ({
    maxWidth: '84%',
    padding: '7px 8px 5px',
    background: isRight ? '#D9FDD3' : '#FFF',
    borderRadius: isRight ? '7px 0 7px 7px' : '0 7px 7px 7px',
    boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)',
    fontSize: 12,
    color: '#111B21',
    lineHeight: 1.45,
    position: 'relative',
  });

  const BubbleMeta = ({ isRight, i }: { isRight: boolean; i: number }) => (
    <span style={{ float: 'right', marginLeft: 8, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3, color: '#667781', fontSize: 9, lineHeight: 1 }}>
      {messageTime(i)}
      {isRight && <CheckCheck size={12} color="#53BDEB" />}
    </span>
  );

  const renderContent = () => {
    if (simPhase === 'qr' && view === 'prospect') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative', overflow: 'hidden' }}>
          {/* Camera View Simulation */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.6, background: 'url(/dev-assets/resto-plate.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(4px)' }} />
          
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 20 }}>
            <div 
              onClick={() => {
                setSimPhase('chat');
                setStep(1); // Skip the QR instruction message
              }}
              style={{ 
                width: 200, height: 200, background: 'rgba(255,255,255,0.1)', 
                border: '2px solid #FFF', borderRadius: 24, margin: '0 auto 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '4px solid #7967FF', borderLeft: '4px solid #7967FF', borderRadius: '4px 0 0 0' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: '4px solid #7967FF', borderRight: '4px solid #7967FF', borderRadius: '0 4px 0 0' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: '4px solid #7967FF', borderLeft: '4px solid #7967FF', borderRadius: '0 0 0 4px' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '4px solid #7967FF', borderRight: '4px solid #7967FF', borderRadius: '0 0 4px 0' }} />
              
              <img src={sector.intents[0]?.qrData.placeholderUrl || ''} alt="QR Code" style={{ width: 140, height: 140, opacity: 0.9 }} />
              
              {/* Scan Line Animation */}
              <div style={{ position: 'absolute', top: '10%', left: 0, width: '100%', height: 2, background: '#7967FF', boxShadow: '0 0 10px #7967FF', animation: 'scan 2s infinite ease-in-out' }} />
            </div>
            
            <style>{`
              @keyframes scan {
                0% { top: 10%; }
                50% { top: 90%; }
                100% { top: 10%; }
              }
            `}</style>
            
            <h3 style={{ color: '#FFF', fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Scanner le Menu</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Cliquez sur le QR Code pour commander</p>
          </div>
          
          <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', zIndex: 10 }}>
            <button 
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: '12px 24px', color: '#FFF', fontSize: 13, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(10px)' }}
            >
              Annuler
            </button>
          </div>
        </div>
      );
    }

    const currentMsg = messages[step];
    const catalogItems = currentMsg?.type === 'catalog' ? currentMsg.items : [];

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* WA header */}
        <div style={{ padding: '8px 10px', background: '#008069', color: '#FFF', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, zIndex: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.18)' }}>
          <ArrowLeft size={18} color="#FFF" />
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <AgentAvatar avatar={d.agentAvatar} size={38} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: 13, margin: 0 }}>{d.agent}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.82)', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              {view === 'prospect' ? 'en ligne' : 'notifications actives'}
            </p>
          </div>
          <Phone size={17} color="#FFF" />
          <MoreVertical size={18} color="#FFF" />
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minHeight: 0,
            scrollBehavior: 'smooth',
            backgroundColor: '#EFE7DD',
            backgroundImage: 'radial-gradient(rgba(17,27,33,0.07) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          {visible.map((msg, i) => {
            const isRight = msg.from === 'client' || msg.from === 'boss';

            if (msg.type === 'qr') return null;

            if (msg.type === 'catalog' && msg.items) {
              return (
                <div key={`${view}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ ...bubbleStyle(false), width: '86%', maxWidth: '86%', padding: 0, overflow: 'hidden' }}>
                    <div style={{ height: 132, width: '100%', background: '#F8FAFC' }}>
                      <img src={msg.items[0].image} alt="Catalog Header" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ margin: 0, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: bold(msg.text) }} />
                      <BubbleMeta isRight={false} i={i} />
                    </div>
                    <button 
                      onClick={() => setShowCatalogSheet(true)}
                      style={{ width: '100%', padding: '11px', border: 'none', background: '#FFF', borderTop: '1px solid #E9EDEF', color: '#00A884', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      <ShoppingBag size={14} /> Voir les produits
                    </button>
                  </div>
                </div>
              );
            }

            if (msg.type === 'buttons' && msg.options) {
              return (
                <div key={`${view}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={bubbleStyle(false)}>
                    <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: bold(msg.text) }} />
                    <BubbleMeta isRight={false} i={i} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '84%' }}>
                    {msg.options.map((opt, idx) => (
                      <button 
                        key={idx} 
                        onClick={advance}
                        style={{ background: '#FFF', border: 'none', borderRadius: 8, padding: '9px 10px', color: '#00A884', fontSize: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            if (msg.type === 'payment') {
              return (
                <div key={`${view}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0' }}>
                  <div 
                    onClick={advance}
                    style={{ background: '#FFF', borderRadius: 12, padding: 16, boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)', textAlign: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer', width: '86%', margin: '0 auto' }}
                  >
                    <div style={{ width: 44, height: 44, background: '#F59E0B', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Smartphone size={24} color="#FFF" />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, margin: '0 0 4px' }}>Validation de paiement</p>
                    <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>Entrez votre code PIN pour valider la transaction de 6 000 FCFA.</p>
                    <div style={{ height: 3, background: '#00A884', position: 'absolute', bottom: 0, left: 0, width: '100%', animation: 'progress 3s linear forwards' }} />
                  </div>
                  <style>{`
                    @keyframes progress {
                      from { width: 0%; }
                      to { width: 100%; }
                    }
                  `}</style>
                  <div style={{ ...bubbleStyle(false), margin: '0 auto', width: '86%' }}>
                    <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: bold(msg.text) }} />
                    <BubbleMeta isRight={false} i={i} />
                  </div>
                </div>
              );
            }

            if (msg.type === 'receipt' || msg.type === 'order_status') {
              return (
                <div key={`${view}-${i}`} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ ...bubbleStyle(false), width: '86%', maxWidth: '86%', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '9px 10px', background: msg.type === 'receipt' ? '#E7FCEB' : '#E7F3FF', borderLeft: `4px solid ${msg.type === 'receipt' ? '#00A884' : '#53BDEB'}` }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#111B21' }}>{msg.type === 'receipt' ? 'Paiement confirme' : 'Statut de commande'}</p>
                    </div>
                    <div style={{ padding: '9px 10px 7px' }}>
                      <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: bold(msg.text) }} />
                      <BubbleMeta isRight={false} i={i} />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={`${view}-${i}`} style={{ display: 'flex', justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
                <div style={bubbleStyle(isRight)}>
                  <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: bold(msg.text) }} />
                  <BubbleMeta isRight={isRight} i={i} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Catalog Sheet Simulation */}
        {showCatalogSheet && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={() => setShowCatalogSheet(false)}>
            <div 
              style={{ background: '#FFF', height: '85%', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ width: 40, height: 4, background: '#E2E8F0', borderRadius: 2, margin: '12px auto' }} />
              <div style={{ padding: '0 18px 14px', borderBottom: '1px solid #E9EDEF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111B21', margin: 0 }}>Catalogue</h3>
                  <p style={{ fontSize: 11, color: '#667781', margin: '2px 0 0', fontWeight: 600 }}>Restaurant Le Palmier</p>
                </div>
                <button onClick={() => setShowCatalogSheet(false)} style={{ border: 'none', background: '#F0F2F5', color: '#54656F', cursor: 'pointer', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: '#F7F8FA' }}>
                {catalogItems?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, background: '#FFF', borderRadius: 10, padding: 10, boxShadow: '0 1px 0.5px rgba(11,20,26,0.08)' }}>
                    <div style={{ width: 78, height: 78, borderRadius: 8, overflow: 'hidden', background: '#F8FAFC', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p style={{ fontSize: 15, fontWeight: 750, color: C.ink, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{item.name}</p>
                          {cart[item.name] > 0 && (
                            <span style={{ background: '#00A884', color: '#FFF', fontSize: 11, fontWeight: 900, padding: '2px 8px', borderRadius: 12 }}>{cart[item.name]}</span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.4, fontWeight: 450 }}>{item.description}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#111B21', letterSpacing: 0 }}>{item.price}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {cart[item.name] > 0 && (
                            <button 
                              onClick={() => {
                                setCart(prev => {
                                  const newVal = Math.max(0, (prev[item.name] || 0) - 1);
                                  const next = { ...prev, [item.name]: newVal };
                                  if (newVal === 0) delete next[item.name];
                                  return next;
                                });
                              }}
                              style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #00A884', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A884', cursor: 'pointer', fontSize: 18, fontWeight: 600 }}
                            >
                              -
                            </button>
                          )}
                          <button 
                            onClick={() => addToCart(item.name)}
                            style={{ background: '#00A884', color: '#FFF', border: 'none', borderRadius: 18, padding: '7px 13px', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,168,132,0.2)' }}
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {cartCount > 0 && (
                <div style={{ padding: 16, borderTop: '1px solid #E9EDEF', background: '#FFF', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}>
                  <button 
                    onClick={() => {
                      setShowCatalogSheet(false);
                      advance();
                    }}
                    style={{ width: '100%', padding: '13px', background: '#00A884', color: '#FFF', border: 'none', borderRadius: 24, fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                  >
                    <div style={{ position: 'relative' }}>
                      <ShoppingBag size={18} />
                      <span style={{ position: 'absolute', top: -8, right: -10, background: '#FFF', color: '#00A884', fontSize: 10, fontWeight: 950, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #00A884' }}>{cartCount}</span>
                    </div>
                    Envoyer le panier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        {/* Controls */}
        <div style={{ padding: '8px 8px 14px', background: '#F0F2F5', borderTop: '1px solid #D1D7DB', display: 'flex', gap: 7, flexShrink: 0, alignItems: 'center' }}>
          {isLast ? (
            <div style={{ flex: 1, padding: '9px 12px', background: C.primaryBg, borderRadius: 9, border: `1px solid ${C.primaryBd}`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} color={C.primary} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.primary }}>Simulation terminée</span>
            </div>
          ) : (
            <button 
              onClick={advance}
              style={{ flex: 1, minWidth: 0, padding: '9px 12px', borderRadius: 22, border: 'none', cursor: 'pointer', background: '#FFF', color: '#3B4A54', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 1px 0.5px rgba(11,20,26,0.12)' }}
            >
              <Smile size={14} color="#8696A0" />
              {nextMsg?.from === 'agent' ? `Réponse de ${d.agent}` : nextMsg?.from === 'boss' ? 'Réponse du patron' : 'Continuer'}
              <Paperclip size={14} color="#8696A0" />
              <Camera size={14} color="#8696A0" />
            </button>
          )}
          <button onClick={() => { setStep(0); setSimPhase(messages[0]?.type === 'qr' ? 'qr' : 'chat'); setShowCatalogSheet(false); setCart({}); }} style={{ width: 38, height: 38, borderRadius: '50%', background: '#00A884', border: 'none', fontSize: 11, fontWeight: 700, color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLast ? <RefreshCw size={14} /> : <Mic size={16} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#FFFFFF', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 4, gap: 3 }}>
            {(['prospect', 'boss'] as SimView[]).map(v => {
              const isActive = view === v;
              return (
                <button key={v} onClick={() => setView(v)} style={{ height: 36, padding: '0 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: isActive ? C.panel : 'transparent', color: isActive ? C.primary : C.muted, fontSize: 12, fontWeight: isActive ? 800 : 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s', boxShadow: isActive ? '0 1px 4px rgba(15,23,42,0.08)' : 'none' }}>
                  {v === 'prospect' ? <><User size={11} /> Vue Client</> : <><Briefcase size={11} /> Vue Patron</>}
                </button>
              );
            })}
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`, color: C.mid, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color={C.mid} />
          </button>
        </div>

        <div style={{
          height: 'min(817px, calc(100vh - 112px))',
          aspectRatio: '78 / 163.4',
          borderRadius: 56,
          padding: 12,
          background: 'linear-gradient(145deg, #05070C 0%, #1E293B 48%, #020617 100%)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.18)',
          position: 'relative',
        }}>
          {/* Phone Shell Details */}
          <div style={{ position: 'absolute', left: -3, top: 120, width: 3, height: 72, borderRadius: '3px 0 0 3px', background: '#111827' }} />
          <div style={{ position: 'absolute', right: -3, top: 150, width: 3, height: 96, borderRadius: '0 3px 3px 0', background: '#111827' }} />

          <div style={{
            height: '100%',
            borderRadius: 46,
            overflow: 'hidden',
            background: '#E5DDD5',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Notch */}
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 116, height: 32, borderRadius: 999, background: '#050505', zIndex: 100, boxShadow: '0 1px 0 rgba(255,255,255,0.12)' }} />

            {/* Status Bar */}
            <div style={{ height: 48, background: simPhase === 'qr' && view === 'prospect' ? '#000' : '#075E54', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 0', flexShrink: 0, zIndex: 90 }}>
              <span style={{ fontSize: 12, fontWeight: 800 }}>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 9, borderRadius: 3, border: '1.5px solid rgba(255,255,255,0.82)' }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.82)' }} />
              </div>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
