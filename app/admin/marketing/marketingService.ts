import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  DEFAULT_MARKETING_PREFS,
  DEFAULT_MARKETING_SECTORS,
  DailyTodo,
  MarketingPrefs,
  TodoState,
  buildDailyTodos,
  createEmptyTodos,
  getTodayKey,
} from './marketingService.mock';

const PREFS_DOC = 'marketing/prefs';
const todoStateDocId = (date: string) => `marketing/todoState-${date}`;

export const marketingService = {
  async loadPrefs(): Promise<MarketingPrefs> {
    const snap = await getDoc(doc(db, PREFS_DOC));
    if (!snap.exists()) return DEFAULT_MARKETING_PREFS;

    const data = snap.data() as Partial<MarketingPrefs>;
    const objective = data.objective ?? DEFAULT_MARKETING_PREFS.objective;
    const dailyTodos = data.dailyTodos?.length ? data.dailyTodos : buildDailyTodos(objective);
    const sectors = data.sectors?.length ? data.sectors : DEFAULT_MARKETING_SECTORS;
    return { objective, dailyTodos, sectors };
  },

  async savePrefs(prefs: MarketingPrefs): Promise<void> {
    await setDoc(doc(db, PREFS_DOC), {
      objective: prefs.objective ?? null,
      dailyTodos: prefs.dailyTodos,
      sectors: prefs.sectors,
      updatedAt: new Date().toISOString(),
    });
  },

  async loadDailyTodoState(dailyTodos: DailyTodo[]): Promise<TodoState> {
    const emptyState = createEmptyTodos(dailyTodos);
    const snap = await getDoc(doc(db, todoStateDocId(getTodayKey())));
    if (!snap.exists()) return emptyState;
    return { ...emptyState, ...(snap.data() as TodoState) };
  },

  async saveDailyTodoState(todoState: TodoState): Promise<void> {
    await setDoc(doc(db, todoStateDocId(getTodayKey())), todoState);
  },

  async resetDailyTodoState(): Promise<void> {
    await deleteDoc(doc(db, todoStateDocId(getTodayKey())));
  },
};
