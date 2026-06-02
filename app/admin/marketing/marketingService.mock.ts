export type SectorGoal = {
  sectorId: string;
  name: string;
  targetContracts: number;
  avgTicket: number;
};

export type MarketingSector = {
  id: string;
  name: string;
  sub: string;
  pitch: string;
  color: string;
  iconKey: string;
};

export type MarketingObjective = {
  id: string;
  title: string;
  startDate: string;
  durationDays: number;
  targetRevenue: number;
  targetContracts: number;
  currentRevenue: number;
  currentContracts: number;
  sectors: SectorGoal[];
};

export type DailyTodo = {
  id: string;
  label: string;
  sub: string;
  category: string;
};

export type MarketingPrefs = {
  objective: MarketingObjective | null;
  dailyTodos: DailyTodo[];
  sectors: MarketingSector[];
};

export type TodoState = Record<string, boolean>;

const PREFS_KEY = 'ozirus_marketing_prefs';
const DAILY_TODOS_PREFIX = 'ozirus_marketing_daily_todos';

export const DEFAULT_MARKETING_SECTORS: MarketingSector[] = [
  { id: 'commerce', name: 'Commerce', sub: 'Boutiques & Supérettes', color: '#7967FF', iconKey: 'shopping', pitch: 'Stocks, caisse, crédits clients, commandes WhatsApp et pertes sur produits périssables.' },
  { id: 'agro', name: 'Agroalimentaire', sub: 'Transformation & Production', color: '#84CC16', iconKey: 'wheat', pitch: 'Prix marché, production calibrée, marges réelles, traçabilité et contrats acheteurs.' },
  { id: 'resto', name: 'Restauration', sub: 'Restaurants, Maquis, Snacks', color: '#F59E0B', iconKey: 'utensils', pitch: 'Commandes WhatsApp, menu du jour, gaspillage, fidélité et réconciliation caisse.' },
  { id: 'pharma', name: 'Pharmacies', sub: 'Officines & Parapharmacies', color: '#10B981', iconKey: 'stethoscope', pitch: 'Ruptures, périmés, ordonnances, CRM patients, marges fournisseurs et conseils vendeurs.' },
  { id: 'artisans', name: 'Artisans', sub: 'Coiffure, Couture, Mécanique', color: '#EC4899', iconKey: 'scissors', pitch: 'Agenda WhatsApp, devis, relances impayés, suivi client et fidélisation.' },
  { id: 'transport', name: 'Transport', sub: 'Livraison & Flotte', color: '#0EA5E9', iconKey: 'truck', pitch: 'Optimisation tournées, carburant, tracking livraison, dispatch et preuves numériques.' },
  { id: 'immo', name: 'Immobilier', sub: 'Agences & Promoteurs', color: '#3B82F6', iconKey: 'building', pitch: 'Qualification prospects, visites, loyers, portefeuille biens, CRM et rapports propriétaires.' },
  { id: 'education', name: 'Éducation', sub: 'Écoles privées, Centres, Académies', color: '#8B5CF6', iconKey: 'graduation', pitch: 'Inscriptions, recouvrement scolarité, présences, planning, communication parents et suivi pédagogique.' },
  { id: 'sante', name: 'Santé', sub: 'Cabinets & Centres Médicaux', color: '#EF4444', iconKey: 'heart', pitch: 'Rendez-vous, no-shows, dossiers patients, stocks consommables et suivi chronique.' },
  { id: 'beaute', name: 'Beauté', sub: 'Salons, Boutiques, Instituts', color: '#D946EF', iconKey: 'sparkles', pitch: 'Réservations, lapins, fidélité, stocks produits, rentabilité services et vitrine WhatsApp.' },
  { id: 'agriculture', name: 'Agriculture', sub: 'Producteurs & Exploitants', color: '#22C55E', iconKey: 'tractor', pitch: 'Prix marché, météo, intrants, acheteurs directs, journal financier et accès crédit.' },
  { id: 'microfinance', name: 'Microfinance', sub: 'IMF, Tontines, Assureurs', color: '#64748B', iconKey: 'landmark', pitch: 'Scoring crédit, relances remboursement, fraude interne, mobile banking et dossiers rapides.' },
  { id: 'ecommerce', name: 'E-commerce', sub: 'Vente en ligne & Marketplaces', color: '#F97316', iconKey: 'cart', pitch: 'Paniers abandonnés, catalogue, livraison, recommandations, paiements Mobile Money et support client.' },
  { id: 'hotellerie', name: 'Hôtellerie', sub: 'Hôtels, Lodges, Agences de voyage', color: '#14B8A6', iconKey: 'hotel', pitch: 'Réservations, pricing dynamique, overbooking, fidélisation, avis Google et restauration.' },
  { id: 'btp', name: 'BTP', sub: 'Entreprises de BTP & Promoteurs', color: '#A16207', iconKey: 'hardhat', pitch: 'Budget chantier, matériaux, rapports quotidiens, portail client, factures et planning prédictif.' },
];

export const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getDailyTodosKey = () => `${DAILY_TODOS_PREFIX}:${getTodayKey()}`;

export const buildDailyTodos = (objective: MarketingObjective | null): DailyTodo[] => {
  if (!objective) {
    return [
      { id: 'setup-objective', label: 'Créer l’objectif commercial', sub: 'Définir le CA cible, la durée, les secteurs et le nombre de contrats à signer.', category: 'Setup' },
      { id: 'prepare-offers', label: 'Clarifier les offres', sub: 'Lister les packs, prix et promesses par secteur avant de prospecter.', category: 'Offre' },
    ];
  }

  const sectorTodos = objective.sectors.flatMap(sector => [
    {
      id: `leads-${sector.sectorId}`,
      label: `Trouver ${Math.max(10, sector.targetContracts * 10)} leads ${sector.name}`,
      sub: `Sources: Google Maps, WhatsApp Business, LinkedIn, Instagram. Ticket moyen visé: ${sector.avgTicket.toLocaleString('fr-FR')} XAF.`,
      category: 'Prospection',
    },
    {
      id: `messages-${sector.sectorId}`,
      label: `Envoyer ${Math.max(10, sector.targetContracts * 8)} messages ${sector.name}`,
      sub: 'Message court, problème métier concret, proposition de diagnostic gratuit.',
      category: 'Outbound',
    },
  ]);

  return [
    ...sectorTodos,
    { id: 'follow-up-hot-leads', label: 'Relancer les prospects chauds', sub: 'Reprendre tous les échanges ouverts hier et proposer un créneau précis.', category: 'Closing' },
    { id: 'book-calls', label: 'Planifier les appels diagnostic', sub: 'Objectif: obtenir au moins 2 rendez-vous qualifiés aujourd’hui.', category: 'RDV' },
    { id: 'update-progress', label: 'Mettre à jour le CA et les contrats', sub: 'Reporter les signatures, acomptes et opportunités gagnées dans le tableau.', category: 'Suivi' },
  ];
};

const DEFAULT_OBJECTIVE: MarketingObjective = {
  id: 'default-objective',
  title: 'Sprint commercial 30 jours',
  startDate: getTodayKey(),
  durationDays: 30,
  targetRevenue: 5000000,
  targetContracts: 6,
  currentRevenue: 0,
  currentContracts: 0,
  sectors: [
    { sectorId: 'pharma', name: 'Pharmacies', targetContracts: 2, avgTicket: 1200000 },
    { sectorId: 'resto', name: 'Restauration', targetContracts: 2, avgTicket: 1000000 },
    { sectorId: 'immo', name: 'Agences Immobilières', targetContracts: 1, avgTicket: 1500000 },
    { sectorId: 'education', name: 'Éducation', targetContracts: 1, avgTicket: 1000000 },
  ],
};

export const DEFAULT_MARKETING_PREFS: MarketingPrefs = {
  objective: DEFAULT_OBJECTIVE,
  dailyTodos: buildDailyTodos(DEFAULT_OBJECTIVE),
  sectors: DEFAULT_MARKETING_SECTORS,
};

export const createEmptyTodos = (dailyTodos: DailyTodo[]) => (
  dailyTodos.reduce<TodoState>((state, todo) => {
    state[todo.id] = false;
    return state;
  }, {})
);

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const marketingMockService = {
  loadPrefs(): MarketingPrefs {
    const prefs = safeParse<MarketingPrefs>(localStorage.getItem(PREFS_KEY), DEFAULT_MARKETING_PREFS);
    const objective = prefs.objective ?? DEFAULT_MARKETING_PREFS.objective;
    const dailyTodos = prefs.dailyTodos?.length ? prefs.dailyTodos : buildDailyTodos(objective);
    const sectors = prefs.sectors?.length ? prefs.sectors : DEFAULT_MARKETING_SECTORS;
    return { objective, dailyTodos, sectors };
  },

  savePrefs(prefs: MarketingPrefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  },

  loadDailyTodoState(dailyTodos: DailyTodo[]): TodoState {
    const emptyState = createEmptyTodos(dailyTodos);
    const savedState = safeParse<TodoState>(localStorage.getItem(getDailyTodosKey()), emptyState);
    return { ...emptyState, ...savedState };
  },

  saveDailyTodoState(todoState: TodoState) {
    localStorage.setItem(getDailyTodosKey(), JSON.stringify(todoState));
  },

  resetDailyTodoState() {
    localStorage.removeItem(getDailyTodosKey());
  },
};
