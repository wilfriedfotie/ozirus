'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  GraduationCap,
  HardHat,
  Heart,
  Hotel,
  Landmark,
  LayoutGrid,
  ListChecks,
  RefreshCw,
  Save,
  Scissors,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Tractor,
  Truck,
  UtensilsCrossed,
  Wheat,
  Zap,
} from 'lucide-react';
import {
  DEFAULT_MARKETING_PREFS,
  DailyTodo,
  MarketingObjective,
  MarketingPrefs,
  MarketingSector,
  SectorGoal,
  TodoState,
  buildDailyTodos,
  createEmptyTodos,
  getTodayKey,
} from './marketingService.mock';
import { marketingService } from './marketingService';

const ADMIN_SECRET_KEY = 'ozirus_admin_2026';

const ICONS = {
  building: Building2,
  cart: ShoppingCart,
  graduation: GraduationCap,
  hardhat: HardHat,
  heart: Heart,
  hotel: Hotel,
  landmark: Landmark,
  scissors: Scissors,
  shopping: ShoppingBag,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  tractor: Tractor,
  truck: Truck,
  utensils: UtensilsCrossed,
  wheat: Wheat,
};

const ICON_OPTIONS = [
  { key: 'shopping', label: 'Commerce' },
  { key: 'wheat', label: 'Agro' },
  { key: 'utensils', label: 'Resto' },
  { key: 'stethoscope', label: 'Santé' },
  { key: 'scissors', label: 'Artisan' },
  { key: 'truck', label: 'Transport' },
  { key: 'building', label: 'Immo' },
  { key: 'graduation', label: 'Éducation' },
  { key: 'heart', label: 'Santé 2' },
  { key: 'sparkles', label: 'Beauté' },
  { key: 'tractor', label: 'Agriculture' },
  { key: 'landmark', label: 'Finance' },
  { key: 'cart', label: 'E-com' },
  { key: 'hotel', label: 'Hôtel' },
  { key: 'hardhat', label: 'BTP' },
];

const getSectorIcon = (iconKey: string) => ICONS[iconKey as keyof typeof ICONS] ?? Target;

const formatAmount = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} XAF`;

const formatDate = (value: string) => {
  const raw = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(`${value}T00:00:00`));
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const getObjectiveEndDate = (startDate: string, durationDays: number) => {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + Math.max(1, durationDays) - 1);
  return date;
};

const formatDateFull = (date: Date) => {
  const raw = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const formatPeriod = (startDate: string, durationDays: number) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = getObjectiveEndDate(startDate, durationDays);
  const startFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(start);
  const endFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(end);
  const result = `${startFmt} → ${endFmt}`;
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const getDefaultObjectiveTitle = (durationDays: number) => `Sprint commercial ${durationDays} jours`;

const getSavedObjectiveTitle = (title: string, durationDays: number) => {
  const cleanTitle = title.trim();
  if (!cleanTitle || /^Sprint commercial \d+ jours$/i.test(cleanTitle)) {
    return getDefaultObjectiveTitle(durationDays);
  }
  return cleanTitle;
};

const toNumber = (value: string) => {
  const parsed = Number(value.replace(/\s/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const createSectorDrafts = (
  sectors: MarketingSector[],
  objective?: MarketingObjective | null,
) => (
  sectors.reduce<Record<string, { enabled: boolean; targetContracts: string; avgTicket: string }>>((acc, sector) => {
    const goal = objective?.sectors.find(item => item.sectorId === sector.id);
    acc[sector.id] = {
      enabled: !!goal || sector.id === 'pharma' || sector.id === 'resto',
      targetContracts: String(goal?.targetContracts ?? (sector.id === 'immo' ? 1 : 2)),
      avgTicket: String(goal?.avgTicket ?? 1000000),
    };
    return acc;
  }, {})
);

export default function MarketingPage() {
  return (
    <Suspense fallback={<MarketingSkeleton />}>
      <MarketingContent />
    </Suspense>
  );
}

function Sk({ w = '100%', h = 16, radius = 8 }: { w?: number | string; h?: number; radius?: number }) {
  return (
    <div style={{
      width: w,
      height: h,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      flexShrink: 0,
    }} />
  );
}

function MarketingSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#F8FAFC', fontFamily: 'var(--font-sans, "DM Sans"), sans-serif' }}>

        {/* Sidebar skeleton */}
        <aside style={{ width: 280, height: '100%', background: '#FFF', borderRight: '1px solid #E2E8F0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Sk w={160} h={20} />
            <Sk w={120} h={12} />
          </div>
          <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
                <Sk w={32} h={32} radius={8} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Sk w="70%" h={12} />
                  <Sk w="45%" h={10} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#F0EEFF', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Sk w={80} h={10} />
              <Sk w="80%" h={22} />
              <Sk w="60%" h={12} />
              <Sk w="100%" h={6} radius={99} />
              <Sk w="100%" h={6} radius={99} />
            </div>
            <Sk w={100} h={10} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 12 }}>
                <Sk w={32} h={32} radius={9} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Sk w="60%" h={12} />
                  <Sk w="40%" h={10} />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main skeleton */}
        <main style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '28px 40px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Sk w={120} h={11} />
            <Sk w={260} h={26} />
          </div>
          <div style={{ flex: 1, padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(158px, 1fr))', gap: 10 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Sk w="50%" h={10} />
                    <Sk w={26} h={26} radius={7} />
                  </div>
                  <Sk w="70%" h={18} />
                </div>
              ))}
            </div>
            {/* Two panels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Sk w={80} h={10} />
                  <Sk w="60%" h={22} />
                  <Sk w="100%" h={6} radius={99} />
                  <Sk w="100%" h={6} radius={99} />
                  <Sk w="100%" h={6} radius={99} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} style={{ background: '#F8FAFC', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Sk w="50%" h={10} />
                        <Sk w="70%" h={14} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function MarketingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prefs, setPrefs] = useState<MarketingPrefs>(DEFAULT_MARKETING_PREFS);
  const [todoState, setTodoState] = useState<TodoState>(() => createEmptyTodos(DEFAULT_MARKETING_PREFS.dailyTodos));
  const [activeTodoId, setActiveTodoId] = useState(DEFAULT_MARKETING_PREFS.dailyTodos[0]?.id ?? '');

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(getTodayKey());
  const [targetRevenue, setTargetRevenue] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [currentRevenue, setCurrentRevenue] = useState('');
  const [currentContracts, setCurrentContracts] = useState('');
  const [sectorDrafts, setSectorDrafts] = useState<Record<string, { enabled: boolean; targetContracts: string; avgTicket: string }>>(() => (
    createSectorDrafts(DEFAULT_MARKETING_PREFS.sectors, DEFAULT_MARKETING_PREFS.objective)
  ));
  const [selectedSectorId, setSelectedSectorId] = useState(DEFAULT_MARKETING_PREFS.sectors[0]?.id ?? '');
  const [sectorName, setSectorName] = useState('');
  const [sectorSub, setSectorSub] = useState('');
  const [sectorPitch, setSectorPitch] = useState('');
  const [sectorColor, setSectorColor] = useState('#7967FF');
  const [sectorIconKey, setSectorIconKey] = useState('shopping');
  const [activeTab, setActiveTab] = useState<'results' | 'todo' | 'objective' | 'sectors'>('results');

  const objective = prefs.objective;
  const dailyTodos = prefs.dailyTodos;
  const sectors = prefs.sectors;
  const selectedSector = sectors.find(sector => sector.id === selectedSectorId) ?? null;
  const activeTodo = dailyTodos.find(todo => todo.id === activeTodoId) ?? dailyTodos[0];
  const checkedCount = dailyTodos.filter(todo => todoState[todo.id]).length;
  const todoProgress = dailyTodos.length ? Math.round((checkedCount / dailyTodos.length) * 100) : 0;

  const objectiveProgress = useMemo(() => {
    if (!objective) return { revenue: 0, contracts: 0, days: 0, elapsedDays: 0 };

    const start = new Date(`${objective.startDate}T00:00:00`);
    const now = new Date();
    const elapsedDays = Math.min(
      objective.durationDays,
      Math.max(0, Math.ceil((now.getTime() - start.getTime()) / 86400000) + 1),
    );
    return {
      revenue: objective.targetRevenue ? Math.min(100, (objective.currentRevenue / objective.targetRevenue) * 100) : 0,
      contracts: objective.targetContracts ? Math.min(100, (objective.currentContracts / objective.targetContracts) * 100) : 0,
      days: Math.min(100, (elapsedDays / objective.durationDays) * 100),
      elapsedDays,
    };
  }, [objective]);

  const projectedRevenue = Object.values(sectorDrafts).reduce((sum, sector) => {
    if (!sector.enabled) return sum;
    return sum + toNumber(sector.targetContracts) * toNumber(sector.avgTicket);
  }, 0);

  const analytics = useMemo(() => {
    const targetRevenueValue = objective?.targetRevenue ?? 0;
    const currentRevenueValue = objective?.currentRevenue ?? 0;
    const targetContractsValue = objective?.targetContracts ?? 0;
    const currentContractsValue = objective?.currentContracts ?? 0;
    const remainingRevenue = Math.max(0, targetRevenueValue - currentRevenueValue);
    const remainingContracts = Math.max(0, targetContractsValue - currentContractsValue);
    const elapsedDays = objectiveProgress.elapsedDays;
    const remainingDays = objective ? Math.max(1, objective.durationDays - Math.max(0, elapsedDays)) : 1;

    return {
      remainingRevenue,
      remainingContracts,
      remainingDays,
      dailyRevenueTarget: Math.ceil(remainingRevenue / remainingDays),
      dailyContractTarget: Math.ceil(remainingContracts / remainingDays),
      sectorCount: objective?.sectors.length ?? 0,
      todoDone: checkedCount,
      todoTotal: dailyTodos.length,
      todoProgress,
      periodLabel: objective ? formatPeriod(objective.startDate, objective.durationDays) : '-',
    };
  }, [objective, objectiveProgress.elapsedDays, checkedCount, dailyTodos.length, todoProgress]);

  const activeTodoDetails = useMemo(() => activeTodo ? getTodoDetails(activeTodo, prefs) : null, [activeTodo, prefs]);

  useEffect(() => {
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin/marketing');
      return;
    }

    if (storedAuth !== 'true') {
      setIsAuthorized(false);
      router.replace('/login');
      return;
    }

    marketingService.loadPrefs().then(loadedPrefs => {
      marketingService.loadDailyTodoState(loadedPrefs.dailyTodos).then(loadedTodoState => {
        setPrefs(loadedPrefs);
        setTodoState(loadedTodoState);
        setActiveTodoId(loadedPrefs.dailyTodos[0]?.id ?? '');
        setSectorDrafts(createSectorDrafts(loadedPrefs.sectors, loadedPrefs.objective));
        setIsAuthorized(true);
        setIsLoading(false);
        if (loadedPrefs.objective) fillFormFromObjective(loadedPrefs.objective);
        if (loadedPrefs.sectors[0]) {
          setSelectedSectorId(loadedPrefs.sectors[0].id);
          fillSectorForm(loadedPrefs.sectors[0]);
        }
      });
    });
  }, [router, searchParams]);

  useEffect(() => {
    if (isAuthorized) marketingService.saveDailyTodoState(todoState);
  }, [isAuthorized, todoState]);

  const fillFormFromObjective = (nextObjective: MarketingObjective) => {
    setTitle(nextObjective.title);
    setStartDate(nextObjective.startDate);
    setTargetRevenue(String(nextObjective.targetRevenue));
    setDurationDays(String(nextObjective.durationDays));
    setCurrentRevenue(String(nextObjective.currentRevenue));
    setCurrentContracts(String(nextObjective.currentContracts));
    setSectorDrafts(prev => {
      const next = { ...prev };
      sectors.forEach(sector => {
        const goal = nextObjective.sectors.find(item => item.sectorId === sector.id);
        next[sector.id] = {
          enabled: !!goal,
          targetContracts: String(goal?.targetContracts ?? next[sector.id].targetContracts),
          avgTicket: String(goal?.avgTicket ?? next[sector.id].avgTicket),
        };
      });
      return next;
    });
  };

  const fillSectorForm = (sector: MarketingSector) => {
    setSectorName(sector.name);
    setSectorSub(sector.sub);
    setSectorPitch(sector.pitch);
    setSectorColor(sector.color);
    setSectorIconKey(sector.iconKey);
  };

  const saveObjective = () => {
    const parsedDurationDays = Math.max(1, toNumber(durationDays));
    const selectedSectors: SectorGoal[] = sectors
      .filter(sector => sectorDrafts[sector.id].enabled)
      .map(sector => ({
        sectorId: sector.id,
        name: sector.name,
        targetContracts: Math.max(1, toNumber(sectorDrafts[sector.id].targetContracts)),
        avgTicket: Math.max(0, toNumber(sectorDrafts[sector.id].avgTicket)),
      }));

    const nextObjective: MarketingObjective = {
      id: objective?.id ?? `objective-${Date.now()}`,
      title: getSavedObjectiveTitle(title, parsedDurationDays),
      startDate: startDate || getTodayKey(),
      durationDays: parsedDurationDays,
      targetRevenue: toNumber(targetRevenue) || projectedRevenue,
      targetContracts: selectedSectors.reduce((sum, sector) => sum + sector.targetContracts, 0),
      currentRevenue: toNumber(currentRevenue),
      currentContracts: toNumber(currentContracts),
      sectors: selectedSectors,
    };

    const nextTodos = buildDailyTodos(nextObjective);
    const nextPrefs = { ...prefs, objective: nextObjective, dailyTodos: nextTodos };
    marketingService.savePrefs(nextPrefs).then(() => {
      setPrefs(nextPrefs);
      marketingService.loadDailyTodoState(nextTodos).then(state => {
        setTodoState(state);
        setActiveTodoId(nextTodos[0]?.id ?? '');
      });
    });
  };

  const updateObjectiveProgress = () => {
    if (!objective) return;

    const nextPrefs = {
      ...prefs,
      objective: {
        ...objective,
        currentRevenue: toNumber(currentRevenue),
        currentContracts: toNumber(currentContracts),
      },
    };
    marketingService.savePrefs(nextPrefs).then(() => setPrefs(nextPrefs));
  };

  const startNewSector = () => {
    const id = `custom-${Date.now()}`;
    setSelectedSectorId(id);
    setSectorName('Nouveau secteur');
    setSectorSub('Segment cible');
    setSectorPitch('Décris le problème métier, les canaux de prospection et la promesse IA.');
    setSectorColor('#7967FF');
    setSectorIconKey('shopping');
  };

  const saveSector = () => {
    const cleanName = sectorName.trim() || 'Nouveau secteur';
    const sector: MarketingSector = {
      id: selectedSector?.id ?? (selectedSectorId || `custom-${Date.now()}`),
      name: cleanName,
      sub: sectorSub.trim() || 'Segment cible',
      pitch: sectorPitch.trim() || 'Décris le problème métier et la promesse IA.',
      color: sectorColor || '#7967FF',
      iconKey: sectorIconKey,
    };

    const exists = sectors.some(item => item.id === sector.id);
    const nextSectors = exists
      ? sectors.map(item => item.id === sector.id ? sector : item)
      : [...sectors, sector];

    const nextObjective = objective
      ? {
        ...objective,
        sectors: objective.sectors.map(goal => goal.sectorId === sector.id ? { ...goal, name: sector.name } : goal),
      }
      : objective;

    const nextTodos = buildDailyTodos(nextObjective);
    const nextPrefs = { ...prefs, sectors: nextSectors, objective: nextObjective, dailyTodos: nextTodos };
    marketingService.savePrefs(nextPrefs).then(() => {
      setPrefs(nextPrefs);
      marketingService.loadDailyTodoState(nextTodos).then(state => setTodoState(state));
      setSelectedSectorId(sector.id);
      setSectorDrafts(prev => ({
        ...createSectorDrafts(nextSectors, nextObjective),
        ...prev,
        [sector.id]: prev[sector.id] ?? { enabled: false, targetContracts: '1', avgTicket: '1000000' },
      }));
    });
  };

  const deleteSector = () => {
    if (!selectedSector || sectors.length <= 1) return;

    const nextSectors = sectors.filter(sector => sector.id !== selectedSector.id);
    const nextObjective = objective
      ? {
        ...objective,
        sectors: objective.sectors.filter(goal => goal.sectorId !== selectedSector.id),
      }
      : objective;
    const nextTodos = buildDailyTodos(nextObjective);
    const nextPrefs = { ...prefs, sectors: nextSectors, objective: nextObjective, dailyTodos: nextTodos };

    marketingService.savePrefs(nextPrefs).then(() => {
      setPrefs(nextPrefs);
      marketingService.loadDailyTodoState(nextTodos).then(state => setTodoState(state));
      setSectorDrafts(createSectorDrafts(nextSectors, nextObjective));
      const nextSelected = nextSectors[0];
      if (nextSelected) {
        setSelectedSectorId(nextSelected.id);
        fillSectorForm(nextSelected);
      }
    });
  };

  const toggleTodo = (id: string) => {
    setTodoState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetToday = () => {
    marketingService.resetDailyTodoState().then(() => {
      setTodoState(createEmptyTodos(dailyTodos));
    });
  };

  if (isAuthorized === false) return null;
  if (isAuthorized === null || isLoading) return <MarketingSkeleton />;

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#F8FAFC', fontFamily: 'var(--font-sans, "DM Sans"), sans-serif' }}>
      <aside style={{ width: 280, height: '100%', background: '#FFF', color: '#0F172A', display: 'flex', flexDirection: 'column', borderRight: '1px solid #E2E8F0', flexShrink: 0 }}>
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #F1F5F9' }}>
          <h1 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Target size={20} color="#7967FF" />
            Ozirus Marketing
          </h1>
          <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 5, fontWeight: 700 }}>Objectifs + daily execution</p>
        </div>

        <nav style={{ padding: '14px 12px 0' }}>
          <SidebarNav activeTab={activeTab} onChange={setActiveTab} todoProgress={todoProgress} />
        </nav>

        <div style={{ padding: '0 16px 20px', flex: 1, overflowY: 'auto', marginTop: 16 }}>
          <SidebarObjective objective={objective} progress={objectiveProgress} />

          <p style={sidebarLabel}>Secteurs ciblés</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(objective?.sectors.length ? objective.sectors : sectors.slice(0, 2).map(sector => ({ sectorId: sector.id, name: sector.name, targetContracts: 0, avgTicket: 0 }))).map(goal => {
              const sector = sectors.find(item => item.id === goal.sectorId);
              const Icon = getSectorIcon(sector?.iconKey ?? '');

              return (
                <div key={goal.sectorId} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${sector?.color ?? '#7967FF'}15`, color: sector?.color ?? '#7967FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{goal.name}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{goal.targetContracts || '-'} contrat(s) cible</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={() => router.push('/admin')} style={{ ...secondaryButton, width: '100%', fontSize: 12 }}>← Retour Admin</button>
        </div>

      </aside>

      <main style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 40px 0', flexShrink: 0, background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Pilotage commercial</p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', margin: '0 0 20px' }}>
            {activeTab === 'results' && 'Résultats & analytics'}
            {activeTab === 'todo' && 'Daily todo'}
            {activeTab === 'objective' && 'Objectif commercial'}
            {activeTab === 'sectors' && 'Catalogue secteurs'}
          </h2>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 40px 36px' }}>
          {activeTab === 'results' && (
            <>
              <AnalyticsPanel analytics={analytics} />
              <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20, alignItems: 'start', marginBottom: 20 }}>
                <ObjectiveProgress objective={objective} progress={objectiveProgress} />
                <ResultBreakdown objective={objective} analytics={analytics} />
              </section>
            </>
          )}

          {activeTab === 'todo' && (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20, alignItems: 'start', marginBottom: 20, gridAutoRows: '1fr' }}>
              <TodoTimeline
                todos={dailyTodos}
                todoState={todoState}
                activeTodoId={activeTodo?.id ?? ''}
                objectiveTitle={objective?.title ?? 'Objectif commercial'}
                progress={todoProgress}
                checkedCount={checkedCount}
                onSelect={setActiveTodoId}
                onToggle={toggleTodo}
                onReset={resetToday}
              />
              <TodoDetails todo={activeTodo} details={activeTodoDetails} />
            </section>
          )}

          {activeTab === 'objective' && (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20, alignItems: 'start', marginBottom: 20 }}>
              <ObjectiveForm
                sectors={sectors}
                title={title}
                setTitle={setTitle}
                startDate={startDate}
                setStartDate={setStartDate}
                targetRevenue={targetRevenue}
                setTargetRevenue={setTargetRevenue}
                durationDays={durationDays}
                setDurationDays={setDurationDays}
                currentRevenue={currentRevenue}
                setCurrentRevenue={setCurrentRevenue}
                currentContracts={currentContracts}
                setCurrentContracts={setCurrentContracts}
                sectorDrafts={sectorDrafts}
                setSectorDrafts={setSectorDrafts}
                projectedRevenue={projectedRevenue}
                onSave={saveObjective}
                onProgressSave={updateObjectiveProgress}
                hasObjective={!!objective}
              />
              <ObjectiveProgress objective={objective} progress={objectiveProgress} />
            </section>
          )}

          {activeTab === 'sectors' && (
            <SectorCatalog
              sectors={sectors}
              selectedSectorId={selectedSectorId}
              onSelectSector={id => {
                setSelectedSectorId(id);
                const sector = sectors.find(item => item.id === id);
                if (sector) fillSectorForm(sector);
              }}
              name={sectorName}
              setName={setSectorName}
              sub={sectorSub}
              setSub={setSectorSub}
              pitch={sectorPitch}
              setPitch={setSectorPitch}
              color={sectorColor}
              setColor={setSectorColor}
              iconKey={sectorIconKey}
              setIconKey={setSectorIconKey}
              onNew={startNewSector}
              onSave={saveSector}
              onDelete={deleteSector}
              canDelete={!!selectedSector && sectors.length > 1}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarNav({ activeTab, onChange, todoProgress }: {
  activeTab: 'results' | 'todo' | 'objective' | 'sectors';
  onChange: (tab: 'results' | 'todo' | 'objective' | 'sectors') => void;
  todoProgress: number;
}) {
  const tabs = [
    { id: 'results' as const, label: 'Résultats', sub: 'Analytics', icon: BarChart2 },
    { id: 'todo' as const, label: 'Daily todo', sub: `${todoProgress}%`, icon: ListChecks },
    { id: 'objective' as const, label: 'Objectif', sub: 'Setup', icon: Settings2 },
    { id: 'sectors' as const, label: 'Secteurs', sub: 'CRUD', icon: LayoutGrid },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: active ? '#F0EEFF' : 'transparent',
              color: active ? '#7967FF' : '#64748B',
              border: 'none',
              borderRadius: 10,
              padding: '10px 12px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? '#7967FF' : '#F1F5F9', color: active ? '#FFF' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: active ? '#7967FF' : '#0F172A', lineHeight: 1 }}>{tab.label}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: active ? '#A99FFF' : '#94A3B8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tab.sub}</p>
            </div>
            {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#7967FF', flexShrink: 0 }} />}
          </button>
        );
      })}
    </div>
  );
}

function AnalyticsPanel({ analytics }: {
  analytics: {
    remainingRevenue: number;
    remainingContracts: number;
    remainingDays: number;
    dailyRevenueTarget: number;
    dailyContractTarget: number;
    sectorCount: number;
    todoDone: number;
    todoTotal: number;
    todoProgress: number;
    periodLabel: string;
  };
}) {
  const kpis = [
    {
      label: 'Période',
      value: analytics.periodLabel,
      icon: CalendarDays,
      accent: '#7967FF',
      bg: '#F0EEFF',
      small: true,
    },
    {
      label: 'Reste à signer',
      value: formatAmount(analytics.remainingRevenue),
      icon: ArrowUp,
      accent: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      label: 'Contrats restants',
      value: String(analytics.remainingContracts),
      icon: FileText,
      accent: '#F97316',
      bg: '#FFF7ED',
    },
    {
      label: 'CA/jour requis',
      value: formatAmount(analytics.dailyRevenueTarget),
      icon: Zap,
      accent: '#7967FF',
      bg: '#F0EEFF',
    },
    {
      label: 'Contrats/jour',
      value: String(analytics.dailyContractTarget),
      icon: ArrowDown,
      accent: '#0EA5E9',
      bg: '#F0F9FF',
    },
    {
      label: 'Jours restants',
      value: String(analytics.remainingDays),
      icon: Clock,
      accent: '#10B981',
      bg: '#ECFDF5',
    },
    {
      label: 'Secteurs actifs',
      value: String(analytics.sectorCount),
      icon: Target,
      accent: '#8B5CF6',
      bg: '#F5F3FF',
    },
    {
      label: 'Todo du jour',
      value: `${analytics.todoDone}/${analytics.todoTotal}`,
      icon: ListChecks,
      accent: '#06B6D4',
      bg: '#ECFEFF',
    },
    {
      label: 'Exécution',
      value: `${analytics.todoProgress}%`,
      icon: TrendingUp,
      accent: analytics.todoProgress >= 80 ? '#10B981' : analytics.todoProgress >= 40 ? '#F97316' : '#EF4444',
      bg: analytics.todoProgress >= 80 ? '#ECFDF5' : analytics.todoProgress >= 40 ? '#FFF7ED' : '#FEF2F2',
      isProgress: true,
      progress: analytics.todoProgress,
    },
  ];

  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 158px), 1fr))', gap: 10 }}>
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              style={{
                background: '#FFF',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: kpi.accent, borderRadius: '14px 14px 0 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.3 }}>{kpi.label}</p>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: kpi.bg, color: kpi.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} />
                </div>
              </div>
              <p style={{ fontSize: kpi.small ? 12 : 16, fontWeight: 900, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word' }}>{kpi.value}</p>
              {kpi.isProgress && (
                <div style={{ height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, kpi.progress ?? 0)}%`, background: kpi.accent, borderRadius: 99, transition: 'width 0.3s ease' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ResultBreakdown({ objective, analytics }: { objective: MarketingObjective | null; analytics: { dailyRevenueTarget: number; dailyContractTarget: number; remainingDays: number; periodLabel: string } }) {
  return (
    <section style={panelStyle}>
      <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Lecture business</p>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0 }}>Ce que les chiffres disent</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        <Insight text={objective ? `Il faut encore générer environ ${formatAmount(analytics.dailyRevenueTarget)} par jour sur ${analytics.remainingDays} jour(s).` : 'Crée un objectif pour obtenir une lecture business.'} />
        <Insight text={objective ? `Le rythme minimum est de ${analytics.dailyContractTarget} contrat(s) par jour pour atteindre la cible.` : 'Les analytics se calculent depuis le CA cible, les contrats et la durée.'} />
        <Insight text={objective ? `Période de l’objectif: ${analytics.periodLabel}.` : 'La date de début permet de calculer automatiquement la date de fin.'} />
        <Insight text={objective?.sectors.length ? `Secteurs actifs: ${objective.sectors.map(sector => sector.name).join(', ')}.` : 'Aucun secteur actif dans l’objectif.'} />
      </div>
    </section>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 13 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7967FF', marginTop: 7, flexShrink: 0 }} />
      <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}

function TodoTimeline(props: {
  todos: DailyTodo[];
  todoState: TodoState;
  activeTodoId: string;
  objectiveTitle: string;
  progress: number;
  checkedCount: number;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <section style={panelStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#7967FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Daily todo - {getTodayKey()}</p>
          <p style={{ fontSize: 20, fontWeight: 950, color: '#0F172A', marginTop: 4 }}>{props.objectiveTitle}</p>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{props.checkedCount}/{props.todos.length} tâches terminées</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: '#F0EEFF', color: '#7967FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950 }}>
            {props.progress}%
          </div>
          <button onClick={props.onReset} style={secondaryButton}><RefreshCw size={14} /> Reset</button>
        </div>
      </div>

      {props.todos.map((todo, index) => {
        const checked = !!props.todoState[todo.id];
        const active = props.activeTodoId === todo.id;

        return (
          <button
            key={todo.id}
            onClick={() => props.onSelect(todo.id)}
            style={{ ...timelineItemStyle, background: active ? '#F8F7FF' : '#FFF', borderColor: active ? '#C4BCFF' : '#E2E8F0' }}
          >
            <div style={{ position: 'relative', width: 34, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              {index < props.todos.length - 1 && (
                <span style={{ position: 'absolute', top: 30, bottom: -30, left: '50%', borderLeft: '2px dashed #CBD5E1', transform: 'translateX(-50%)' }} />
              )}
              <span
                onClick={e => {
                  e.stopPropagation();
                  props.onToggle(todo.id);
                }}
                style={{ position: 'relative', zIndex: 1, width: 30, height: 30, borderRadius: '50%', background: checked ? '#ECFDF5' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: checked ? '1.5px solid #10B981' : '1.5px solid #CBD5E1' }}
              >
                {checked ? <CheckCircle2 size={19} color="#10B981" /> : <Circle size={19} color="#94A3B8" />}
              </span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 950, color: checked ? '#10B981' : '#7967FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{todo.category}</p>
              <p style={{ fontSize: 14, fontWeight: 900, color: checked ? '#047857' : '#0F172A', lineHeight: 1.35, marginTop: 4 }}>{todo.label}</p>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.45, marginTop: 4 }}>{todo.sub}</p>
            </div>
          </button>
        );
      })}
    </section>
  );
}

function TodoDetails({ todo, details }: { todo?: DailyTodo; details: ReturnType<typeof getTodoDetails> | null }) {
  if (!todo || !details) {
    return (
      <aside style={panelStyle}>
        <p style={{ fontSize: 14, color: '#64748B' }}>Sélectionne une tâche pour voir les détails.</p>
      </aside>
    );
  }

  return (
    <aside style={panelStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: '#F0EEFF', color: '#7967FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Target size={21} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#7967FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{todo.category}</p>
          <h2 style={{ fontSize: 22, fontWeight: 950, color: '#0F172A', marginTop: 4 }}>{todo.label}</h2>
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 18 }}>{details.context}</p>

      <DetailBlock title="À faire concrètement" items={details.steps} />
      <DetailBlock title="Conseils" items={details.tips} />
      <DetailBlock title="Message / script utile" items={details.scripts} />
    </aside>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16, marginTop: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 950, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.map(item => (
          <div key={item} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7967FF', marginTop: 7, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.55 }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectorCatalog(props: {
  sectors: MarketingSector[];
  selectedSectorId: string;
  onSelectSector: (id: string) => void;
  name: string;
  setName: (value: string) => void;
  sub: string;
  setSub: (value: string) => void;
  pitch: string;
  setPitch: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  iconKey: string;
  setIconKey: (value: string) => void;
  onNew: () => void;
  onSave: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const Icon = getSectorIcon(props.iconKey);

  return (
    <section style={{ ...panelStyle, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Catalogue secteurs</p>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0 }}>CRUD des cibles commerciales</h3>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={props.onNew} style={secondaryButton}>Nouveau secteur</button>
          <button onClick={props.onSave} style={primaryButton}><Save size={14} /> Enregistrer secteur</button>
          <button onClick={props.onDelete} disabled={!props.canDelete} style={{ ...dangerButton, opacity: props.canDelete ? 1 : 0.45 }}>Supprimer</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(min(100%, 280px), 0.8fr) minmax(0, 1.2fr)', gap: 16, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sélectionner un secteur</span>
            <select
              value={props.selectedSectorId}
              onChange={e => props.onSelectSector(e.target.value)}
              style={selectStyle}
            >
              {props.sectors.map(sector => (
                <option key={sector.id} value={sector.id}>{sector.name} - {sector.sub}</option>
              ))}
            </select>
          </label>

          <div style={{ border: `1.5px solid ${props.color}`, background: `${props.color}10`, borderRadius: 12, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#FFF', color: props.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>{props.name || 'Nouveau secteur'}</p>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{props.sub || 'Segment cible'}</p>
              <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, marginTop: 8 }}>{props.pitch || 'Pitch non renseigné.'}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 12, minWidth: 0 }}>
          <Field label="Nom" value={props.name} onChange={props.setName} placeholder="Commerce" />
          <Field label="Sous-segment" value={props.sub} onChange={props.setSub} placeholder="Boutiques & Supérettes" />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Icône</span>
            <select value={props.iconKey} onChange={e => props.setIconKey(e.target.value)} style={selectStyle}>
              {ICON_OPTIONS.map(option => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </label>
          <Field label="Couleur" value={props.color} onChange={props.setColor} placeholder="#7967FF" />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, gridColumn: '1 / -1' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pitch / angle de prospection</span>
            <textarea
              value={props.pitch}
              onChange={e => props.setPitch(e.target.value)}
              rows={3}
              style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', border: '1.5px solid #E2E8F0', borderRadius: 9, padding: '11px 12px', fontSize: 13, fontWeight: 700, color: '#0F172A', outline: 'none', background: '#FFF', resize: 'vertical' }}
              placeholder="Décris les problèmes métier et la promesse IA."
            />
          </label>
        </div>
      </div>
    </section>
  );
}

function ObjectiveForm(props: {
  sectors: MarketingSector[];
  title: string;
  setTitle: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  targetRevenue: string;
  setTargetRevenue: (value: string) => void;
  durationDays: string;
  setDurationDays: (value: string) => void;
  currentRevenue: string;
  setCurrentRevenue: (value: string) => void;
  currentContracts: string;
  setCurrentContracts: (value: string) => void;
  sectorDrafts: Record<string, { enabled: boolean; targetContracts: string; avgTicket: string }>;
  setSectorDrafts: React.Dispatch<React.SetStateAction<Record<string, { enabled: boolean; targetContracts: string; avgTicket: string }>>>;
  projectedRevenue: number;
  onSave: () => void;
  onProgressSave: () => void;
  hasObjective: boolean;
}) {
  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Créer / modifier</p>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0 }}>Objectif commercial</h3>
        </div>
        <button onClick={props.onSave} style={primaryButton}><Save size={14} /> Enregistrer</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: 12, marginBottom: 16 }}>
        <Field label="Nom de l’objectif" value={props.title} onChange={props.setTitle} placeholder={`Sprint commercial ${props.durationDays || 'X'} jours`} />
        <Field label="Date de début" type="date" value={props.startDate} onChange={props.setStartDate} />
        <Field label="Prix / CA cible" value={props.targetRevenue} onChange={props.setTargetRevenue} placeholder={String(props.projectedRevenue || 5000000)} />
        <Field label="Durée" value={props.durationDays} onChange={props.setDurationDays} placeholder="Nombre de jours" />
      </div>

      <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Secteurs et prix moyens</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 10, marginBottom: 16 }}>
        {props.sectors.map(sector => {
          const Icon = getSectorIcon(sector.iconKey);
          const draft = props.sectorDrafts[sector.id];
          if (!draft) return null;

          return (
            <div key={sector.id} style={{ border: `1.5px solid ${draft.enabled ? sector.color : '#E2E8F0'}`, borderRadius: 12, padding: 14, background: draft.enabled ? `${sector.color}08` : '#FFF', minWidth: 0, boxSizing: 'border-box' }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', marginBottom: 10 }}>
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={e => props.setSectorDrafts(prev => ({ ...prev, [sector.id]: { ...prev[sector.id], enabled: e.target.checked } }))}
                />
                <Icon size={16} color={sector.color} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#0F172A' }}>{sector.name}</span>
              </label>
              <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.45, minHeight: 32 }}>{sector.pitch}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.7fr) minmax(0, 1fr)', gap: 8, marginTop: 10 }}>
                <Field compact label="Contrats" value={draft.targetContracts} onChange={value => props.setSectorDrafts(prev => ({ ...prev, [sector.id]: { ...prev[sector.id], targetContracts: value } }))} />
                <Field compact label="Ticket XAF" value={draft.avgTicket} onChange={value => props.setSectorDrafts(prev => ({ ...prev, [sector.id]: { ...prev[sector.id], avgTicket: value } }))} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: 12, alignItems: 'end', borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
        <Field label="CA réalisé" value={props.currentRevenue} onChange={props.setCurrentRevenue} placeholder="0" />
        <Field label="Contrats signés" value={props.currentContracts} onChange={props.setCurrentContracts} placeholder="0" />
        <button onClick={props.onProgressSave} disabled={!props.hasObjective} style={{ ...secondaryButton, opacity: props.hasObjective ? 1 : 0.45 }}>
          <TrendingUp size={14} /> Mettre à jour
        </button>
      </div>
    </div>
  );
}

function ObjectiveProgress({ objective, progress }: {
  objective: MarketingObjective | null;
  progress: { revenue: number; contracts: number; days: number; elapsedDays: number };
}) {
  return (
    <div style={panelStyle}>
      <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Avancement</p>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0 }}>{objective?.title ?? 'Aucun objectif actif'}</h3>
      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginTop: 8 }}>
        {objective ? `${formatAmount(objective.currentRevenue)} réalisés sur ${formatAmount(objective.targetRevenue)}.` : 'Crée un objectif pour générer automatiquement le plan d’action quotidien.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: 10, marginTop: 18 }}>
        <Metric label="Période" value={objective ? formatPeriod(objective.startDate, objective.durationDays) : '-'} />
        <Metric label="CA cible" value={objective ? formatAmount(objective.targetRevenue) : '-'} />
        <Metric label="Contrats" value={objective ? `${objective.currentContracts}/${objective.targetContracts}` : '-'} />
        <Metric label="Jour" value={objective ? `${progress.elapsedDays}/${objective.durationDays}` : '-'} />
      </div>

      <ProgressLine label="Progression CA" value={progress.revenue} />
      <ProgressLine label="Progression contrats" value={progress.contracts} />
      <ProgressLine label="Temps écoulé" value={progress.days} />
    </div>
  );
}

function SidebarObjective({ objective, progress }: { objective: MarketingObjective | null; progress: { revenue: number; contracts: number } }) {
  return (
    <div style={{ background: '#F0EEFF', padding: 18, borderRadius: 14, border: '1px solid #C4BCFF', marginBottom: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: '#7967FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Objectif actif</p>
      <p style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>{objective ? formatAmount(objective.targetRevenue) : 'À créer'}</p>
      <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 5 }}>{objective?.title ?? 'Définis ton prix cible, tes secteurs et tes contrats.'}</p>
      <div style={{ marginTop: 14 }}>
        <ProgressLine label="CA" value={progress.revenue} />
        <ProgressLine label="Contrats" value={progress.contracts} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, compact = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; compact?: boolean; type?: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: compact ? 10 : 11, fontWeight: 800, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', border: '1.5px solid #E2E8F0', borderRadius: 9, padding: compact ? '9px 10px' : '11px 12px', fontSize: 13, fontWeight: 700, color: '#0F172A', outline: 'none', background: '#FFF' }}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, minWidth: 0, boxSizing: 'border-box' }}>
      <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 900, color: '#0F172A' }}>{value}</p>
    </div>
  );
}

function ProgressLine({ label, value, color = '#7967FF', dark = false }: { label: string; value: number; color?: string; dark?: boolean }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: dark ? '#94A3B8' : '#64748B', marginBottom: 6 }}>
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 7, background: dark ? '#0F172A' : '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, background: color, transition: 'width 0.25s ease' }} />
      </div>
    </div>
  );
}

function getTodoDetails(todo: DailyTodo, prefs: MarketingPrefs) {
  const objective = prefs.objective;
  const sector = objective?.sectors.find(item => todo.id.includes(item.sectorId));
  const sectorName = sector?.name ?? 'la cible';
  const ticket = sector?.avgTicket ? `${sector.avgTicket.toLocaleString('fr-FR')} XAF` : 'le ticket moyen défini';

  if (todo.category === 'Prospection') {
    return {
      context: `But: créer une liste courte mais exploitable de prospects ${sectorName}, avec contacts et angle d’approche.`,
      steps: [
        `Chercher ${sectorName} sur Google Maps, Instagram, LinkedIn et groupes WhatsApp locaux.`,
        'Noter nom, quartier, téléphone/WhatsApp, responsable, signal d’intérêt et problème visible.',
        'Prioriser les structures qui ont déjà une activité WhatsApp or une douleur opérationnelle visible.',
      ],
      tips: [
        'Ne cherche pas la perfection: une fiche prospect imparfaite mais contactable vaut mieux qu’une fiche vide.',
        `Filtre par capacité à payer autour de ${ticket}.`,
        'Ajoute une note courte: “stock”, “réservations”, “paiements”, “relances”, etc.',
      ],
      scripts: [
        `Bonjour, je travaille avec des ${sectorName}. On met en place des agents IA WhatsApp pour automatiser les demandes, relances et suivis. Diagnostic gratuit 10 min ?`,
      ],
    };
  }

  if (todo.category === 'Outbound') {
    return {
      context: `But: transformer la liste de prospects ${sectorName} en conversations qualifiées aujourd’hui.`,
      steps: [
        'Envoyer un message court, personnalisé avec le nom ou le contexte du prospect.',
        'Proposer une seule action: diagnostic gratuit ou appel de 10 minutes.',
        'Marquer chaque réponse: chaud, à relancer, pas intéressé, mauvais contact.',
      ],
      tips: [
        'Évite les longs pitchs. Un bon message doit tenir sur un écran WhatsApp.',
        'Parle d’un problème métier précis avant de parler d’IA.',
        'Relance les non-réponses après quelques heures with une question simple.',
      ],
      scripts: [
        `J’ai vu votre activité ${sectorName}. On aide ce type de structure à automatiser WhatsApp et réduire les pertes. Vous êtes dispo pour un diagnostic gratuit ?`,
      ],
    };
  }

  if (todo.category === 'Closing') {
    return {
      context: 'But: ne laisser aucune conversation chaude mourir sans prochaine étape.',
      steps: [
        'Reprendre tous les échanges ouverts hier et ce matin.',
        'Proposer deux créneaux précis au lieu de demander “quand êtes-vous disponible ?”.',
        'Identifier l’objection principale: prix, timing, confiance, besoin flou.',
      ],
      tips: [
        'Le closing avance quand la prochaine action est datée.',
        'Si le prospect hésite, propose un diagnostic limité et concret.',
        'Note la prochaine relance dès que tu finis la conversation.',
      ],
      scripts: [
        'Je peux vous montrer concrètement ce qu’on automatiserait chez vous. Vous préférez aujourd’hui 16h ou demain 10h ?',
      ],
    };
  }

  return {
    context: 'But: garder le système à jour pour que les objectifs et la todo de demain restent réalistes.',
    steps: [
      'Mettre à jour le CA signé, les acomptes et le nombre de contrats.',
      'Ajouter les nouveaux prospects chauds dans ta liste de suivi.',
      'Noter les blocages récurrents pour ajuster le script demain.',
    ],
    tips: [
      'Fais cette étape en fin de journée, pas le lendemain matin.',
      'Un suivi simple mais quotidien bat un CRM parfait non rempli.',
      'Les chiffres doivent refléter les signatures réelles, pas les promesses.',
    ],
    scripts: [
      'Résumé fin de journée: prospects contactés, réponses, RDV bookés, offres envoyées, signatures, prochaine action.',
    ],
  };
}

const panelStyle: React.CSSProperties = {
  background: '#FFF',
  border: '1px solid #E2E8F0',
  borderRadius: 16,
  padding: 22,
  boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
  minWidth: 0,
  boxSizing: 'border-box',
};

const timelineItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  gap: 12,
  textAlign: 'left',
  border: '1.5px solid #E2E8F0',
  borderRadius: 12,
  padding: 14,
  marginBottom: 12,
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const sidebarLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  color: '#64748B',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: 12,
};

const primaryButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#7967FF',
  color: '#FFF',
  border: 'none',
  borderRadius: 9,
  padding: '11px 14px',
  fontSize: 13,
  fontWeight: 900,
  cursor: 'pointer',
  boxSizing: 'border-box',
  minWidth: 0,
};

const secondaryButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#FFF',
  color: '#0F172A',
  border: '1.5px solid #E2E8F0',
  borderRadius: 9,
  padding: '11px 14px',
  fontSize: 13,
  fontWeight: 900,
  cursor: 'pointer',
  boxSizing: 'border-box',
  minWidth: 0,
};

const dangerButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: '#FFF',
  color: '#DC2626',
  border: '1.5px solid #FECACA',
  borderRadius: 9,
  padding: '11px 14px',
  fontSize: 13,
  fontWeight: 900,
  cursor: 'pointer',
  boxSizing: 'border-box',
  minWidth: 0,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  border: '1.5px solid #E2E8F0',
  borderRadius: 9,
  padding: '11px 12px',
  fontSize: 13,
  fontWeight: 800,
  color: '#0F172A',
  outline: 'none',
  background: '#FFF',
};
