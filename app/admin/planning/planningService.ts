import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'plannings';

export interface StoredPlanning {
  id: string;
  contractId: string;
  contractNumber: string;
  clientCompany: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const decode = (value: unknown) => {
  if (typeof value !== 'string') return (value as Record<string, unknown>) ?? {};
  try { return JSON.parse(value) as Record<string, unknown>; } catch { return {}; }
};

export const planningService = {
  async list(): Promise<StoredPlanning[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy('updatedAt', 'desc')));
    return snap.docs.map(item => ({ ...item.data(), id: item.id, payload: decode(item.data().payload) } as StoredPlanning));
  },
  async getByContract(contractId: string): Promise<StoredPlanning | null> {
    const snap = await getDoc(doc(db, COLLECTION, contractId));
    if (!snap.exists()) return null;
    return { ...snap.data(), id: snap.id, payload: decode(snap.data().payload) } as StoredPlanning;
  },
  async save(contractId: string, data: Omit<StoredPlanning, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const ref = doc(db, COLLECTION, contractId);
    const existing = await getDoc(ref);
    const now = new Date().toISOString();
    await setDoc(ref, { ...data, payload: JSON.stringify(data.payload), createdAt: existing.data()?.createdAt ?? now, updatedAt: now });
  },
};
