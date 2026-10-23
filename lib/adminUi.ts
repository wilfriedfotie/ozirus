import type { CSSProperties } from 'react';

// Styles de champs du backoffice /admin, copie conforme de app/admin/page.tsx.
// À importer pour tout nouveau formulaire (admin ou public) plutôt que d'inventer un style.
export const ADMIN = {
  primary: '#7967FF',
  ink: '#0F172A',
  muted: '#64748B',
  faint: '#94A3B8',
  border: '#E2E8F0',
  surface: '#F8FAFC',
} as const;

export const sectionTitle: CSSProperties = { fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 };
export const inputStyle: CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box' };
export const labelStyle: CSSProperties = { display: 'block', fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6, marginLeft: 4 };
export const tabBtn: CSSProperties = { padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' };
export const primaryBtnStyle: CSSProperties = { width: '100%', background: '#7967FF', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)' };
// Conteneur des pills tabBtn (sélecteur segmenté, cf. FACTURE / DOCS / BADGE…).
export const segmented: CSSProperties = { display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1 };
