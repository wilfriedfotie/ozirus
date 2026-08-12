import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'documents';

/**
 * Catégorie de document telle qu'affichée dans la bibliothèque. Elle est dérivée du
 * couple docType/docMode de l'éditeur (`/admin`) : une PROPOSITION COMMERCIALE en
 * mode CONTRAT est archivée comme un contrat, pas comme une proposition.
 */
export type DocumentKind = 'PROPOSITION' | 'FACTURE' | 'CONTRAT';

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  PROPOSITION: 'Proposition commerciale',
  FACTURE: 'Facture',
  CONTRAT: 'Contrat',
};

export type DocumentStatus = 'BROUILLON' | 'ENVOYE' | 'SIGNE' | 'PAYE' | 'ANNULE';

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  BROUILLON: 'Brouillon',
  ENVOYE: 'Envoyé',
  SIGNE: 'Signé',
  PAYE: 'Payé',
  ANNULE: 'Annulé',
};

export const DOCUMENT_STATUS_COLORS: Record<DocumentStatus, string> = {
  BROUILLON: '#94A3B8',
  ENVOYE: '#0EA5E9',
  SIGNE: '#7967FF',
  PAYE: '#10B981',
  ANNULE: '#EF4444',
};

/**
 * `payload` est le dump brut de l'état de l'éditeur (mêmes clés que l'ancien
 * `localStorage['ozirus_editor_save']`). Il n'est pas typé champ par champ pour que
 * l'ajout d'un champ dans l'éditeur ne casse pas la persistance ; les métadonnées
 * au-dessus sont dupliquées à plat pour pouvoir lister/filtrer sans tout charger.
 */
export interface StoredDocument {
  id: string;
  kind: DocumentKind;
  status: DocumentStatus;
  docNumber: string;
  date: string;
  clientName: string;
  clientCompany: string;
  currency: string;
  totalTTC: number;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type DocumentDraft = Omit<StoredDocument, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Le payload est stocké sérialisé en JSON, pas en map Firestore : l'état de l'éditeur
 * contient des tableaux imbriqués (`TableData.rows: string[][]`, `LineItem.subItems`)
 * que Firestore refuse (« Nested arrays are not supported »). Sérialiser règle aussi
 * le rejet des `undefined` au passage. Aucune requête ne porte sur le contenu du
 * payload — les champs filtrables sont dupliqués à plat — donc rien n'est perdu.
 */
function encodePayload(payload: Record<string, unknown>): string {
  return JSON.stringify(payload ?? {});
}

function decodePayload(raw: unknown): Record<string, unknown> {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      console.error('Payload document illisible, document ignoré partiellement');
      return {};
    }
  }
  // Documents écrits avant la sérialisation (map Firestore brute).
  return (raw as Record<string, unknown>) ?? {};
}

/** Prépare un draft pour Firestore : payload sérialisé, `undefined` éliminés. */
function toFirestore(draft: DocumentDraft) {
  return {
    kind: draft.kind,
    status: draft.status,
    docNumber: draft.docNumber ?? '',
    date: draft.date ?? '',
    clientName: draft.clientName ?? '',
    clientCompany: draft.clientCompany ?? '',
    currency: draft.currency ?? 'FCFA',
    totalTTC: Number.isFinite(draft.totalTTC) ? draft.totalTTC : 0,
    payload: encodePayload(draft.payload),
  };
}

function fromFirestore(id: string, data: Record<string, unknown>): StoredDocument {
  return {
    ...(data as Omit<StoredDocument, 'id' | 'payload'>),
    id,
    payload: decodePayload(data.payload),
  };
}

export const documentsService = {
  async list(): Promise<StoredDocument[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('updatedAt', 'desc')));
    return snap.docs.map((d) => fromFirestore(d.id, d.data()));
  },

  async get(id: string): Promise<StoredDocument | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return fromFirestore(snap.id, snap.data());
  },

  async create(draft: DocumentDraft): Promise<string> {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(db, COLLECTION), {
      ...toFirestore(draft),
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  },

  /** Met à jour un document existant en conservant sa date de création. */
  async update(id: string, draft: DocumentDraft): Promise<void> {
    const existing = await getDoc(doc(db, COLLECTION, id));
    const createdAt = existing.exists()
      ? ((existing.data() as StoredDocument).createdAt ?? new Date().toISOString())
      : new Date().toISOString();
    await setDoc(doc(db, COLLECTION, id), {
      ...toFirestore(draft),
      createdAt,
      updatedAt: new Date().toISOString(),
    });
  },

  /** Changement de statut seul : ne réécrit pas le payload. */
  async setStatus(id: string, status: DocumentStatus): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  /**
   * Crée un NOUVEAU document dérivé d'un existant (proposition → contrat / facture).
   * La source n'est pas modifiée : on garde la proposition telle qu'elle a été envoyée
   * au client, et le contrat/facture vit sa propre vie (numéro, statut, dates).
   * Renvoie l'id du document créé, à ouvrir dans l'éditeur via `/admin?doc=<id>`.
   */
  async convert(sourceId: string, target: DocumentKind): Promise<string> {
    const source = await documentsService.get(sourceId);
    if (!source) throw new Error('Document source introuvable');

    const today = new Date().toISOString().split('T')[0];
    const payload = { ...source.payload } as Record<string, unknown>;

    // Aligne l'état de l'éditeur sur le type cible : `docType`/`docMode` pilotent
    // le rendu (articles contractuels, tableau de facturation...) dans /admin.
    payload.docType = target === 'FACTURE' ? 'FACTURE' : 'PROPOSITION COMMERCIALE';
    payload.docMode = target === 'CONTRAT' ? 'CONTRAT' : 'PROPOSITION';
    payload.docNumber = buildDocNumber(target);
    payload.date = today;

    if (target === 'CONTRAT') {
      // Un contrat prend effet, il n'expire pas comme une offre.
      payload.contractStartDate = payload.contractStartDate || today;
      payload.validUntil = '';
    } else if (target === 'FACTURE') {
      // Échéance de paiement à 30 jours par défaut.
      const due = new Date();
      due.setDate(due.getDate() + 30);
      payload.validUntil = due.toISOString().split('T')[0];
    }

    return documentsService.create({
      kind: target,
      status: 'BROUILLON',
      docNumber: payload.docNumber as string,
      date: today,
      clientName: source.clientName,
      clientCompany: source.clientCompany,
      currency: source.currency,
      totalTTC: source.totalTTC,
      payload,
    });
  },
};

/** Même convention de numérotation que l'éditeur (`/admin`). */
function buildDocNumber(kind: DocumentKind): string {
  const prefix = kind === 'FACTURE' ? 'F' : kind === 'CONTRAT' ? 'CTR' : 'PC';
  const seq = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${new Date().getFullYear()}-${seq}`;
}
