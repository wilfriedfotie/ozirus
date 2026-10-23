// Données de démo de la section « Gestion de stock » : reprises des mocks de l'outil Stock du
// dashboard (whatsapp-resto-saas, features/dashboard/mocks/{menu,stock,ai}.ts).
// Les heures sont figées en texte (heure de Douala) pour éviter un écart d'hydratation
// selon le fuseau du navigateur.

export type StockAlertLevel = "ok" | "low" | "critical";

export interface DemoStockItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  alertLevel: StockAlertLevel;
  supplier: string;
}

export interface DemoStockMovement {
  id: string;
  type: "in" | "out" | "adjustment";
  itemName: string;
  quantity: number;
  unit: string;
  reason: string;
  time: string;
  author: string;
}

export const DEMO_STOCK_ITEMS: DemoStockItem[] = [
  { id: "s4", name: "Huile de palme", unit: "L", quantity: 1, threshold: 5, alertLevel: "critical", supplier: "Huilerie du Littoral" },
  { id: "s7", name: "Laitue", unit: "kg", quantity: 0, threshold: 3, alertLevel: "critical", supplier: "Marché Central Frais" },
  { id: "s2", name: "Plantain mûr", unit: "kg", quantity: 6, threshold: 8, alertLevel: "low", supplier: "Marché Central Frais" },
  { id: "s3", name: "Feuilles de ndolé", unit: "kg", quantity: 3, threshold: 5, alertLevel: "low", supplier: "Marché Central Frais" },
  { id: "s6", name: "Bœuf (brochette)", unit: "kg", quantity: 4, threshold: 4, alertLevel: "low", supplier: "Marché Central Frais" },
  { id: "s1", name: "Poulet entier", unit: "pièce", quantity: 14, threshold: 10, alertLevel: "ok", supplier: "Volailles du Wouri" },
  { id: "s5", name: "Bar frais", unit: "pièce", quantity: 9, threshold: 6, alertLevel: "ok", supplier: "Poissonnerie Akwa" },
];

export const DEMO_STOCK_MOVEMENTS: DemoStockMovement[] = [
  { id: "mv2", type: "out", itemName: "Plantain mûr", quantity: -3, unit: "kg", reason: "Commande #CMD-1040 — Poulet DG", time: "12:50", author: "Système" },
  { id: "mv1", type: "out", itemName: "Huile de palme", quantity: -2, unit: "L", reason: "Commande #CMD-1042 — Eru + miondo", time: "12:42", author: "Système" },
  { id: "mv4", type: "in", itemName: "Poulet entier", quantity: 20, unit: "pièce", reason: "Livraison — Volailles du Wouri", time: "09:15", author: "Junior (Cuisine)" },
  { id: "mv5", type: "adjustment", itemName: "Laitue", quantity: -2, unit: "kg", reason: "Inventaire — écart constaté", time: "Hier", author: "Aïcha (Manager)" },
];

export const DEMO_SUPPLIER_SUGGESTION = {
  supplierName: "Huilerie du Littoral",
  lines: [
    { id: "sl1", label: "Huile de palme — 20 L", reason: "Stock critique + ventes x1,4 ce week-end" },
    { id: "sl2", label: "Sel fin — 10 kg", reason: "Seuil bas atteint dans 4 jours" },
  ],
  totalEstimateFcfa: 68000,
  basedOn: ["Ventes des 30 derniers jours", "Météo du week-end", "Rythme de vente"],
};

export const DEMO_ACTIVE_SUPPLIERS = 3;
