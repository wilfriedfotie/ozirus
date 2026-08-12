'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Eye,
  FileText,
  FilePlus,
  FolderOpen,
  Pencil,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import {
  DOCUMENT_KIND_LABELS,
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
  DocumentKind,
  DocumentStatus,
  StoredDocument,
  documentsService,
} from './documentsService';

const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const PRIMARY_COLOR = '#7967FF';

const KIND_FILTERS: { id: DocumentKind | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Tout' },
  { id: 'PROPOSITION', label: 'Propositions' },
  { id: 'FACTURE', label: 'Factures' },
  { id: 'CONTRAT', label: 'Contrats' },
];

/** Conversions possibles depuis chaque type. Une facture est terminale. */
const CONVERT_TARGETS: Record<DocumentKind, DocumentKind[]> = {
  PROPOSITION: ['CONTRAT', 'FACTURE'],
  CONTRAT: ['FACTURE'],
  FACTURE: [],
};

const KIND_ICONS: Record<DocumentKind, React.ReactNode> = {
  PROPOSITION: <FileText size={16} color={PRIMARY_COLOR} />,
  FACTURE: <ReceiptText size={16} color="#10B981" />,
  CONTRAT: <ShieldCheck size={16} color="#F59E0B" />,
};

export default function DocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsContent />
    </Suspense>
  );
}

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kindFilter, setKindFilter] = useState<DocumentKind | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Notification non bloquante : `alert()` gèle la page et empêche toute interaction.
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = React.useCallback((kind: 'success' | 'error', message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  useEffect(() => {
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin/documents');
      return;
    }

    if (storedAuth !== 'true') {
      setIsAuthorized(false);
      router.replace('/login');
      return;
    }

    setIsAuthorized(true);
  }, [router, searchParams]);

  const reload = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const docs = await documentsService.list();
      setDocuments(docs);
    } catch (e) {
      console.error('Failed to load documents', e);
      setError('Impossible de charger les documents. Vérifiez la connexion Firestore.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) reload();
  }, [isAuthorized, reload]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documents.filter((d) => {
      if (kindFilter !== 'ALL' && d.kind !== kindFilter) return false;
      if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
      if (!term) return true;
      return [d.docNumber, d.clientName, d.clientCompany]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(term));
    });
  }, [documents, kindFilter, statusFilter, search]);

  const selected = useMemo(
    () => filtered.find((d) => d.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  // Garde une sélection valide quand un filtre exclut le document affiché.
  useEffect(() => {
    if (selectedId && !filtered.some((d) => d.id === selectedId)) setSelectedId(null);
  }, [filtered, selectedId]);

  const totals = useMemo(() => {
    const byKind = { PROPOSITION: 0, FACTURE: 0, CONTRAT: 0 } as Record<DocumentKind, number>;
    documents.forEach((d) => { byKind[d.kind] = (byKind[d.kind] ?? 0) + 1; });
    return byKind;
  }, [documents]);

  const handleDelete = async (docItem: StoredDocument) => {
    const label = `${DOCUMENT_KIND_LABELS[docItem.kind]} ${docItem.docNumber || ''}`.trim();
    if (!confirm(`Supprimer définitivement « ${label} » ?\nCette action est irréversible.`)) return;
    setBusyId(docItem.id);
    try {
      await documentsService.remove(docItem.id);
      setDocuments((prev) => prev.filter((d) => d.id !== docItem.id));
      if (selectedId === docItem.id) setSelectedId(null);
    } catch (e) {
      console.error('Failed to delete document', e);
      showToast('error', 'Erreur lors de la suppression.');
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusChange = async (docItem: StoredDocument, status: DocumentStatus) => {
    setBusyId(docItem.id);
    try {
      await documentsService.setStatus(docItem.id, status);
      setDocuments((prev) => prev.map((d) => (d.id === docItem.id ? { ...d, status } : d)));
    } catch (e) {
      console.error('Failed to update status', e);
      showToast('error', 'Erreur lors du changement de statut.');
    } finally {
      setBusyId(null);
    }
  };

  /**
   * Proposition → contrat / facture. Crée un nouveau document (la source reste
   * intacte) puis ouvre directement l'éditeur dessus pour compléter les champs
   * propres au type cible (parties signataires, échéancier...).
   */
  const handleConvert = async (docItem: StoredDocument, target: DocumentKind) => {
    setBusyId(docItem.id);
    try {
      const newId = await documentsService.convert(docItem.id, target);
      router.push(`/admin?doc=${newId}`);
    } catch (e) {
      console.error('Failed to convert document', e);
      showToast('error', `Erreur lors de la création du ${DOCUMENT_KIND_LABELS[target].toLowerCase()}.`);
      setBusyId(null);
    }
  };

  /**
   * Le PDF est TOUJOURS produit par l'éditeur (`/admin`), jamais ici : lui seul rend
   * le document complet (sections personnalisées, tableaux, articles contractuels,
   * pagination A4). L'aperçu du panneau droit est une vignette d'identification, pas
   * une source d'export — le capturer produirait un PDF amputé.
   */
  const handleDownload = (docItem: StoredDocument) => {
    router.push(`/admin?doc=${docItem.id}&print=1`);
  };

  if (isAuthorized === null || isAuthorized === false) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ─── PANNEAU GAUCHE : LISTE ─── */}
      <div style={{ width: 480, flexShrink: 0, background: '#FFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => router.push('/admin')}
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}
              >
                <ArrowLeft size={16} color="#64748B" />
              </button>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <FolderOpen size={16} color={PRIMARY_COLOR} />
                  Documents
                </h1>
                <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 1, marginBottom: 0 }}>
                  {totals.PROPOSITION} propositions · {totals.FACTURE} factures · {totals.CONTRAT} contrats
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={reload}
                title="Rafraîchir"
                style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex' }}
              >
                <RefreshCw size={14} color="#64748B" />
              </button>
              <button
                onClick={() => router.push('/admin')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: PRIMARY_COLOR, color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                <FilePlus size={14} /> Nouveau
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1, marginBottom: 12 }}>
            {KIND_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setKindFilter(f.id)}
                style={{ ...tabBtn, flex: 1, padding: '6px 8px', background: kindFilter === f.id ? '#FFF' : 'transparent', color: kindFilter === f.id ? PRIMARY_COLOR : '#64748B' }}
              >
                {f.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Client, entreprise, numéro..."
                style={{ ...inputStyle, padding: '10px 12px 10px 34px', fontSize: 12 }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'ALL')}
              style={{ ...inputStyle, width: 130, padding: '10px 12px', fontSize: 12, fontWeight: 700 }}
            >
              <option value="ALL">Tous statuts</option>
              {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 92, borderRadius: 12, background: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 37%,#F1F5F9 63%)', backgroundSize: '400% 100%', animation: 'docSkeleton 1.4s ease infinite' }} />
              ))}
            </div>
          ) : error ? (
            <EmptyState icon={<X size={28} color="#EF4444" />} title="Erreur de chargement" text={error} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FolderOpen size={28} color="#CBD5E1" />}
              title={documents.length === 0 ? 'Aucun document archivé' : 'Aucun résultat'}
              text={
                documents.length === 0
                  ? 'Créez une proposition, une facture ou un contrat depuis les Outils Création, puis cliquez sur « Sauvegarder ».'
                  : 'Aucun document ne correspond à ces filtres.'
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((d) => (
                <DocumentCard
                  key={d.id}
                  document={d}
                  isSelected={selectedId === d.id}
                  isBusy={busyId === d.id}
                  onSelect={() => setSelectedId(selectedId === d.id ? null : d.id)}
                  onEdit={() => router.push(`/admin?doc=${d.id}`)}
                  onDelete={() => handleDelete(d)}
                  onDownload={() => handleDownload(d)}
                  onStatusChange={(status) => handleStatusChange(d, status)}
                  onConvert={(target) => handleConvert(d, target)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── PANNEAU DROIT : APERÇU ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        {selected ? (
          <DocumentPreview document={selected} />
        ) : (
          <div style={{ marginTop: 120, textAlign: 'center', maxWidth: 360 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Eye size={26} color="#CBD5E1" />
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>Aperçu du document</h2>
            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
              Sélectionnez un document dans la liste pour afficher son aperçu, le télécharger en PDF ou l&apos;ouvrir dans l&apos;éditeur.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px', borderRadius: 12, fontSize: 12.5, fontWeight: 700, color: '#FFF',
            background: toast.kind === 'success' ? '#10B981' : '#EF4444',
            boxShadow: '0 8px 24px rgba(15,23,42,0.22)',
          }}
        >
          <X size={15} /> {toast.message}
        </div>
      )}

      <style>{`@keyframes docSkeleton { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }`}</style>
    </div>
  );
}

function DocumentCard({
  document: d,
  isSelected,
  isBusy,
  onSelect,
  onEdit,
  onDelete,
  onDownload,
  onStatusChange,
  onConvert,
}: {
  document: StoredDocument;
  isSelected: boolean;
  isBusy: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onStatusChange: (status: DocumentStatus) => void;
  onConvert: (target: DocumentKind) => void;
}) {
  // Une proposition se transforme en contrat ou en facture ; un contrat signé se
  // facture. Une facture est terminale (rien à en dériver).
  const convertTargets = CONVERT_TARGETS[d.kind];

  return (
    <div
      onClick={onSelect}
      style={{
        border: `1px solid ${isSelected ? PRIMARY_COLOR : '#E2E8F0'}`,
        borderRadius: 12,
        background: '#FFF',
        padding: 14,
        cursor: 'pointer',
        boxShadow: isSelected ? '0 4px 12px rgba(121,103,255,0.15)' : 'none',
        opacity: isBusy ? 0.6 : 1,
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, minWidth: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {KIND_ICONS[d.kind]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {d.clientCompany || d.clientName || 'Client non renseigné'}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
              {DOCUMENT_KIND_LABELS[d.kind]}{d.docNumber ? ` · ${d.docNumber}` : ''}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.05em',
            padding: '4px 8px',
            borderRadius: 999,
            color: DOCUMENT_STATUS_COLORS[d.status],
            background: `${DOCUMENT_STATUS_COLORS[d.status]}18`,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {DOCUMENT_STATUS_LABELS[d.status].toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>
          {formatDate(d.date)} · <strong style={{ color: '#0F172A' }}>{formatPrice(d.totalTTC, d.currency)}</strong>
        </div>
        <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
          <select
            value={d.status}
            onChange={(e) => onStatusChange(e.target.value as DocumentStatus)}
            disabled={isBusy}
            title="Changer le statut"
            style={{ border: '1px solid #E2E8F0', borderRadius: 6, padding: '4px 6px', fontSize: 10, fontWeight: 700, color: '#475569', background: '#FFF', cursor: 'pointer', outline: 'none' }}
          >
            {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <IconAction title="Modifier" onClick={onEdit} disabled={isBusy}><Pencil size={13} color="#475569" /></IconAction>
          <IconAction title="Ouvrir dans l'éditeur pour générer le PDF complet" onClick={onDownload} disabled={isBusy}><Download size={13} color="#475569" /></IconAction>
          <IconAction title="Supprimer" onClick={onDelete} disabled={isBusy}><Trash2 size={13} color="#EF4444" /></IconAction>
        </div>
      </div>

      {convertTargets.length > 0 && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px dashed #E2E8F0' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span style={{ fontSize: 9.5, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Générer
          </span>
          {convertTargets.map((target) => (
            <button
              key={target}
              onClick={() => onConvert(target)}
              disabled={isBusy}
              title={`Créer un ${DOCUMENT_KIND_LABELS[target].toLowerCase()} à partir de ce document`}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 999,
                padding: '4px 10px', fontSize: 10, fontWeight: 800, color: '#475569',
                cursor: isBusy ? 'not-allowed' : 'pointer',
              }}
            >
              <ArrowRight size={11} color="#94A3B8" />
              {DOCUMENT_KIND_LABELS[target].toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function IconAction({ title, onClick, disabled, children }: { title: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 6, padding: '4px 7px', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
    >
      {children}
    </button>
  );
}

/**
 * Aperçu A4 en lecture seule reconstruit depuis le payload archivé. Il reste
 * volontairement plus simple que le rendu complet de l'éditeur (`/admin`) : il sert à
 * identifier/vérifier un document et à produire le PDF téléchargeable.
 */
function DocumentPreview({ document: d }: { document: StoredDocument }) {
  const p = d.payload as any;
  const items: any[] = Array.isArray(p?.items) ? p.items : [];
  const subtotal = items.reduce((sum, i) => sum + (Number(i.unitPrice) || 0) * (Number(i.quantity) || 0), 0);
  const discount = Number(p?.discount) || 0;
  const totalHT = subtotal - discount;
  const tva = p?.applyTVA ? totalHT * 0.1925 : 0;
  const totalTTC = totalHT + tva;
  const acompte = Number(p?.acompte) || 0;
  const money = (v: number) => formatPrice(v, d.currency);

  // Ce qui existe dans le document mais n'est pas rendu dans cette vignette.
  const customSections: any[] = Array.isArray(p?.customSections) ? p.customSections : [];
  const notRendered = [
    customSections.length && `${customSections.length} section${customSections.length > 1 ? 's' : ''} personnalisée${customSections.length > 1 ? 's' : ''}`,
    p?.projectGoals && 'objectifs',
    p?.projectExclusions && 'exclusions',
    d.kind === 'CONTRAT' && 'articles contractuels',
    'échéancier et conditions',
  ].filter(Boolean) as string[];

  return (
    <div style={{ width: 210 * 3.7795 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '10px 14px', background: '#FEF9E7', border: '1px solid #F5D98B', borderRadius: 10 }}>
        <Eye size={15} color="#B7791F" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 11, color: '#7C5E10', lineHeight: 1.5 }}>
          <strong>Aperçu partiel</strong> — vignette d&apos;identification. Non affichés ici :{' '}
          {notRendered.join(', ')}. Utilisez « Télécharger » pour le document complet.
        </div>
      </div>

      <div
        className="doc-preview-page"
        style={{
          width: '100%',
          minHeight: 297 * 3.7795,
          background: '#FFF',
          boxShadow: '0 10px 40px rgba(15,23,42,0.12)',
          padding: '56px 52px',
          boxSizing: 'border-box',
          color: '#0F172A',
        }}
      >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: `3px solid ${PRIMARY_COLOR}` }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>OZIRUS</div>
          <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>Agence IA · Yaoundé, Cameroun</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: PRIMARY_COLOR, letterSpacing: '0.04em' }}>
            {DOCUMENT_KIND_LABELS[d.kind].toUpperCase()}
          </div>
          <div style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>N° {d.docNumber || '—'}</div>
          <div style={{ fontSize: 10, color: '#64748B' }}>{formatDate(d.date)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <PreviewBox
          title="Client"
          lines={[d.clientCompany, d.clientName, p?.clientEmail, p?.clientAddress, p?.clientTaxId && `NIU : ${p.clientTaxId}`].filter(Boolean)}
        />
        <PreviewBox
          title="Statut"
          lines={[
            DOCUMENT_STATUS_LABELS[d.status],
            p?.validUntil ? `Valable jusqu'au ${formatDate(p.validUntil)}` : '',
            p?.timeline ? `Délai : ${p.timeline}` : '',
          ].filter(Boolean)}
        />
      </div>

      {p?.projectContext && (
        <PreviewSection title="Contexte">
          <div style={{ fontSize: 10.5, lineHeight: 1.7, color: '#334155' }} dangerouslySetInnerHTML={{ __html: p.projectContext }} />
        </PreviewSection>
      )}

      {items.length > 0 && (
        <PreviewSection title="Détail de la prestation">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.5 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={thStyle}>Désignation</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 50 }}>Qté</th>
                <th style={{ ...thStyle, textAlign: 'right', width: 90 }}>P.U.</th>
                <th style={{ ...thStyle, textAlign: 'right', width: 100 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id ?? idx}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700 }}>{item.description || '—'}</div>
                    {item.longDescription && <div style={{ color: '#64748B', fontSize: 9.5, marginTop: 2 }}>{item.longDescription}</div>}
                    {Array.isArray(item.subItems) && item.subItems.filter(Boolean).length > 0 && (
                      <ul style={{ margin: '4px 0 0', paddingLeft: 14, color: '#64748B', fontSize: 9.5, lineHeight: 1.6 }}>
                        {item.subItems.filter(Boolean).map((sub: string, i: number) => <li key={i}>{sub}</li>)}
                      </ul>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{money(Number(item.unitPrice) || 0)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>
                    {money((Number(item.unitPrice) || 0) * (Number(item.quantity) || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16, marginLeft: 'auto', width: 250 }}>
            <TotalLine label="Sous-total" value={money(subtotal)} />
            {discount > 0 && <TotalLine label="Remise" value={`- ${money(discount)}`} />}
            {p?.applyTVA && <TotalLine label="TVA (19,25 %)" value={money(tva)} />}
            <TotalLine label="Total TTC" value={money(totalTTC)} strong />
            {acompte > 0 && (
              <>
                <TotalLine label="Acompte versé" value={`- ${money(acompte)}`} />
                <TotalLine label="Net à payer" value={money(totalTTC - acompte)} strong />
              </>
            )}
          </div>
        </PreviewSection>
      )}

        <div style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid #E2E8F0', fontSize: 9, color: '#94A3B8', textAlign: 'center' }}>
          Ozirus · Document archivé le {formatDate(d.updatedAt)} · Aperçu partiel, non destiné à l&apos;envoi client.
        </div>
      </div>
    </div>
  );
}

function PreviewBox({ title, lines }: { title: string; lines: (string | undefined)[] }) {
  return (
    <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{title}</div>
      {lines.filter(Boolean).map((line, i) => (
        <div key={i} style={{ fontSize: 10.5, color: i === 0 ? '#0F172A' : '#475569', fontWeight: i === 0 ? 800 : 400, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 900, color: PRIMARY_COLOR, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function TotalLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: strong ? '1px solid #E2E8F0' : 'none', fontSize: strong ? 12 : 10.5, fontWeight: strong ? 900 : 500, color: strong ? '#0F172A' : '#475569' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: '#94A3B8', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function formatPrice(value: number, currency: string) {
  const formatted = new Intl.NumberFormat('fr-FR').format(Math.round(value || 0));
  return currency === 'FCFA' ? `${formatted} FCFA` : `${currency} ${formatted}`;
}

function formatDate(value: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR').format(parsed);
}

const tabBtn = { borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' } as const;
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box' as const };
const thStyle = { textAlign: 'left' as const, padding: '8px 10px', fontSize: 9, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' };
const tdStyle = { padding: '8px 10px', borderBottom: '1px solid #F1F5F9', verticalAlign: 'top' as const, color: '#334155' };
