/**
 * Données de démonstration d'Ozirus OS (section interactive de la home).
 *
 * Tous les secteurs partagent la même boucle : conversation → vente/rdv → paiement →
 * fiche client → fidélisation, pilotée par l'IA. Seul le vocabulaire et les contenus
 * changent. Les montants sont en euros ; la démo les convertit en FCFA à la volée.
 */
import {
  ShoppingBag,
  UtensilsCrossed,
  Scissors,
  Stethoscope,
  Building2,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export type ChannelId = 'whatsapp' | 'instagram' | 'facebook' | 'tiktok' | 'web';

export const CHANNELS: { id: ChannelId; label: string; color: string; soft: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp', color: '#16A34A', soft: '#DCFCE7' },
  { id: 'instagram', label: 'Instagram', color: '#DB2777', soft: '#FCE7F3' },
  { id: 'facebook', label: 'Facebook', color: '#2563EB', soft: '#DBEAFE' },
  { id: 'tiktok', label: 'TikTok', color: '#0F172A', soft: '#E2E8F0' },
  { id: 'web', label: 'Site web', color: '#7967FF', soft: '#EEEBFF' },
];

export const channelById = (id: ChannelId) => CHANNELS.find(c => c.id === id)!;

export type Tier = 'VIP' | 'Fidèle' | 'Nouveau' | 'À relancer';

export type Contact = {
  name: string;
  channel: ChannelId;
  value: number; // € cumulés
  tier: Tier;
  last: string;
  next: string; // action suggérée par l'IA
};

export type Msg = { from: 'client' | 'ai'; text: string };

export type Sector = {
  id: string;
  label: string;
  icon: LucideIcon;
  business: string;
  people: string; // « clients », « patients »…
  deal: string; // « commande », « réservation »…
  baseRevenue: number; // € / mois avec 1 canal, IA coupée
  contacts: Contact[];
  thread: { name: string; channel: ChannelId; msgs: Msg[] };
  loyalty: { program: string; segments: { label: string; count: number; action: string }[] };
  posts: { day: number; channel: ChannelId; title: string }[];
  events: { channel: ChannelId; text: string; amount?: number }[];
  scenario: string[];
};

export const SECTORS: Sector[] = [
  {
    id: 'commerce',
    label: 'Commerce',
    icon: ShoppingBag,
    business: 'Boutique Nala',
    people: 'clients',
    deal: 'commande',
    baseRevenue: 4200,
    contacts: [
      { name: 'Awa Diallo', channel: 'whatsapp', value: 640, tier: 'VIP', last: 'il y a 2 h', next: 'Proposer la nouvelle collection' },
      { name: 'Kevin M.', channel: 'instagram', value: 185, tier: 'Fidèle', last: 'hier', next: 'Relancer le panier abandonné' },
      { name: 'Sarah Ndong', channel: 'tiktok', value: 42, tier: 'Nouveau', last: 'il y a 20 min', next: 'Envoyer le code -10 %' },
      { name: 'Paul Essomba', channel: 'facebook', value: 310, tier: 'À relancer', last: 'il y a 45 j', next: 'Offre de retour personnalisée' },
      { name: 'Inès B.', channel: 'web', value: 98, tier: 'Fidèle', last: 'il y a 3 j', next: 'Demander un avis client' },
    ],
    thread: {
      name: 'Awa Diallo',
      channel: 'whatsapp',
      msgs: [
        { from: 'client', text: 'Bonsoir, la robe wax bleue existe en M ?' },
        { from: 'ai', text: 'Bonsoir Awa ! Oui, il en reste 2 en M. Je vous la réserve ?' },
        { from: 'client', text: 'Oui, livraison demain possible ?' },
        { from: 'ai', text: 'C’est noté : livraison demain avant 14 h. Voici votre lien de paiement 👇' },
      ],
    },
    loyalty: {
      program: '1 point par euro · 100 points = 10 € offerts',
      segments: [
        { label: 'Clientes VIP', count: 48, action: 'Avant-première collection' },
        { label: 'Panier abandonné', count: 23, action: 'Relance + livraison offerte' },
        { label: 'Inactifs 60 j', count: 112, action: 'Code retour -15 %' },
      ],
    },
    posts: [
      { day: 0, channel: 'instagram', title: 'Carrousel nouvelle collection' },
      { day: 1, channel: 'tiktok', title: 'Essayage en 15 s' },
      { day: 2, channel: 'facebook', title: 'Avis client de la semaine' },
      { day: 3, channel: 'whatsapp', title: 'Statut : arrivages' },
      { day: 4, channel: 'instagram', title: 'Story : sondage couleurs' },
      { day: 5, channel: 'tiktok', title: 'Coulisses du shooting' },
    ],
    events: [
      { channel: 'whatsapp', text: 'Commande payée · robe wax', amount: 45 },
      { channel: 'instagram', text: 'Question prix en DM → réponse IA', },
      { channel: 'tiktok', text: 'Nouveau contact depuis une vidéo' },
      { channel: 'web', text: 'Commande en ligne · 2 articles', amount: 72 },
      { channel: 'facebook', text: 'Panier relancé et récupéré', amount: 38 },
    ],
    scenario: ['Message WhatsApp', 'Produit trouvé par l’IA', 'Paiement en lien', 'Fiche cliente enrichie', 'Points fidélité crédités'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: UtensilsCrossed,
    business: 'Chez Mama Lou',
    people: 'clients',
    deal: 'commande',
    baseRevenue: 6800,
    contacts: [
      { name: 'Jean-Marc T.', channel: 'whatsapp', value: 520, tier: 'VIP', last: 'il y a 1 h', next: 'Réserver sa table du vendredi' },
      { name: 'Fatou K.', channel: 'instagram', value: 140, tier: 'Fidèle', last: 'hier', next: 'Offrir le dessert anniversaire' },
      { name: 'Brice N.', channel: 'web', value: 26, tier: 'Nouveau', last: 'il y a 10 min', next: 'Proposer la carte fidélité' },
      { name: 'Linda O.', channel: 'facebook', value: 230, tier: 'À relancer', last: 'il y a 30 j', next: 'Menu du chef -20 %' },
      { name: 'Eric F.', channel: 'tiktok', value: 18, tier: 'Nouveau', last: 'il y a 2 h', next: 'Inviter à la soirée grillades' },
    ],
    thread: {
      name: 'Jean-Marc T.',
      channel: 'whatsapp',
      msgs: [
        { from: 'client', text: 'Une table pour 4 ce soir à 20 h ?' },
        { from: 'ai', text: 'Bonsoir Jean-Marc ! Il reste une table en terrasse à 20 h 15, ça vous va ?' },
        { from: 'client', text: 'Parfait. Et vous avez encore le poulet DG ?' },
        { from: 'ai', text: 'Oui ! Je l’ajoute en précommande pour 4. À ce soir 🙌' },
      ],
    },
    loyalty: {
      program: '10ᵉ repas offert · dessert le jour de l’anniversaire',
      segments: [
        { label: 'Habitués du midi', count: 86, action: 'Formule midi en avant-première' },
        { label: 'Anniversaires du mois', count: 14, action: 'Dessert offert' },
        { label: 'Pas venus depuis 30 j', count: 64, action: 'Menu du chef -20 %' },
      ],
    },
    posts: [
      { day: 0, channel: 'instagram', title: 'Plat du jour en Reel' },
      { day: 1, channel: 'whatsapp', title: 'Statut : menu du midi' },
      { day: 2, channel: 'tiktok', title: 'En cuisine avec le chef' },
      { day: 3, channel: 'facebook', title: 'Événement soirée grillades' },
      { day: 4, channel: 'instagram', title: 'Story : réservations ouvertes' },
      { day: 6, channel: 'facebook', title: 'Photos du week-end' },
    ],
    events: [
      { channel: 'whatsapp', text: 'Commande livrée · 3 plats', amount: 34 },
      { channel: 'web', text: 'Table réservée pour 6 · samedi' },
      { channel: 'instagram', text: 'Demande de privatisation → devis IA' },
      { channel: 'facebook', text: 'Avis 5 ★ publié' },
      { channel: 'tiktok', text: 'Nouveau contact depuis une vidéo' },
    ],
    scenario: ['Demande de table', 'Créneau proposé par l’IA', 'Précommande payée', 'Historique client mis à jour', '10ᵉ repas suivi'],
  },
  {
    id: 'beaute',
    label: 'Beauté & salon',
    icon: Scissors,
    business: 'Studio Kelia',
    people: 'clientes',
    deal: 'rendez-vous',
    baseRevenue: 3600,
    contacts: [
      { name: 'Grâce M.', channel: 'instagram', value: 410, tier: 'VIP', last: 'il y a 3 h', next: 'Rappel retouche tresses' },
      { name: 'Nadia S.', channel: 'whatsapp', value: 190, tier: 'Fidèle', last: 'hier', next: 'Proposer le soin hydratant' },
      { name: 'Clarisse E.', channel: 'tiktok', value: 0, tier: 'Nouveau', last: 'il y a 15 min', next: 'Envoyer les créneaux libres' },
      { name: 'Mireille A.', channel: 'facebook', value: 260, tier: 'À relancer', last: 'il y a 50 j', next: 'Offre retour -15 %' },
      { name: 'Yasmine D.', channel: 'web', value: 75, tier: 'Fidèle', last: 'il y a 6 j', next: 'Demander un avis Google' },
    ],
    thread: {
      name: 'Grâce M.',
      channel: 'instagram',
      msgs: [
        { from: 'client', text: 'Coucou, dispo samedi pour des knotless ?' },
        { from: 'ai', text: 'Coucou Grâce ! Samedi 9 h ou 13 h avec Kelia. Lequel préférez-vous ?' },
        { from: 'client', text: '9 h stp' },
        { from: 'ai', text: 'Réservé ✨ Acompte de 15 € par lien, rappel la veille.' },
      ],
    },
    loyalty: {
      program: '5ᵉ prestation -50 % · parrainage = soin offert',
      segments: [
        { label: 'Retouche à prévoir', count: 37, action: 'Rappel automatique J-3' },
        { label: 'Ambassadrices', count: 12, action: 'Code parrainage' },
        { label: 'Inactives 45 j', count: 58, action: 'Offre retour -15 %' },
      ],
    },
    posts: [
      { day: 0, channel: 'instagram', title: 'Avant / après du jour' },
      { day: 1, channel: 'tiktok', title: 'Tuto entretien tresses' },
      { day: 2, channel: 'whatsapp', title: 'Statut : créneaux libres' },
      { day: 4, channel: 'instagram', title: 'Reel : nouvelle coiffeuse' },
      { day: 5, channel: 'facebook', title: 'Promo parrainage' },
      { day: 6, channel: 'tiktok', title: 'Trend coiffure du week-end' },
    ],
    events: [
      { channel: 'instagram', text: 'Rendez-vous réservé · samedi 9 h', amount: 15 },
      { channel: 'whatsapp', text: 'Rappel J-1 confirmé par la cliente' },
      { channel: 'tiktok', text: 'Nouvelle cliente depuis une vidéo' },
      { channel: 'web', text: 'Carte cadeau achetée', amount: 50 },
      { channel: 'facebook', text: 'Parrainage validé' },
    ],
    scenario: ['DM Instagram', 'Créneau proposé par l’IA', 'Acompte encaissé', 'Rappel automatique', 'Retouche relancée'],
  },
  {
    id: 'sante',
    label: 'Santé & clinique',
    icon: Stethoscope,
    business: 'Clinique Horizon',
    people: 'patients',
    deal: 'consultation',
    baseRevenue: 9400,
    contacts: [
      { name: 'M. Fotso', channel: 'whatsapp', value: 380, tier: 'Fidèle', last: 'il y a 1 h', next: 'Rappel contrôle tension' },
      { name: 'Mme Abena', channel: 'web', value: 120, tier: 'Nouveau', last: 'il y a 30 min', next: 'Envoyer la fiche pré-consultation' },
      { name: 'Famille Ngo', channel: 'facebook', value: 910, tier: 'VIP', last: 'il y a 4 j', next: 'Bilan pédiatrique annuel' },
      { name: 'Alain K.', channel: 'whatsapp', value: 60, tier: 'À relancer', last: 'il y a 90 j', next: 'Résultats à récupérer' },
      { name: 'Sophie L.', channel: 'instagram', value: 45, tier: 'Nouveau', last: 'hier', next: 'Confirmer le rendez-vous' },
    ],
    thread: {
      name: 'M. Fotso',
      channel: 'whatsapp',
      msgs: [
        { from: 'client', text: 'Bonjour, je voudrais voir le cardiologue.' },
        { from: 'ai', text: 'Bonjour M. Fotso. Dr Mbarga reçoit jeudi à 10 h ou 15 h 30.' },
        { from: 'client', text: '10 h, merci.' },
        { from: 'ai', text: 'Confirmé. Pensez à venir à jeun, je vous rappelle la veille.' },
      ],
    },
    loyalty: {
      program: 'Suivi de soins : rappels, contrôles et résultats',
      segments: [
        { label: 'Contrôles à planifier', count: 74, action: 'Rappel avec créneaux' },
        { label: 'Résultats disponibles', count: 19, action: 'Notification sécurisée' },
        { label: 'Vaccins à renouveler', count: 31, action: 'Campagne de rappel' },
      ],
    },
    posts: [
      { day: 0, channel: 'facebook', title: 'Conseil santé : hypertension' },
      { day: 2, channel: 'instagram', title: 'Présentation de l’équipe' },
      { day: 3, channel: 'whatsapp', title: 'Statut : horaires de garde' },
      { day: 4, channel: 'facebook', title: 'Journée de dépistage' },
      { day: 5, channel: 'tiktok', title: '3 gestes de premiers secours' },
    ],
    events: [
      { channel: 'whatsapp', text: 'Consultation réservée · cardiologie', amount: 35 },
      { channel: 'web', text: 'Fiche pré-consultation remplie' },
      { channel: 'facebook', text: 'Inscription à la journée de dépistage' },
      { channel: 'whatsapp', text: 'Rappel de vaccin confirmé' },
      { channel: 'instagram', text: 'Question horaires → réponse IA' },
    ],
    scenario: ['Demande de rendez-vous', 'Agenda médecin consulté', 'Consultation confirmée', 'Dossier patient à jour', 'Rappel de contrôle'],
  },
  {
    id: 'immobilier',
    label: 'Immobilier',
    icon: Building2,
    business: 'Kribi Habitat',
    people: 'prospects',
    deal: 'visite',
    baseRevenue: 12500,
    contacts: [
      { name: 'Hervé D.', channel: 'facebook', value: 1800, tier: 'VIP', last: 'il y a 2 h', next: 'Envoyer 3 biens similaires' },
      { name: 'Claire V.', channel: 'web', value: 0, tier: 'Nouveau', last: 'il y a 5 min', next: 'Qualifier budget et quartier' },
      { name: 'Samuel O.', channel: 'whatsapp', value: 650, tier: 'Fidèle', last: 'hier', next: 'Planifier la 2ᵉ visite' },
      { name: 'Diane M.', channel: 'instagram', value: 0, tier: 'À relancer', last: 'il y a 21 j', next: 'Nouveau bien dans son budget' },
      { name: 'Rodrigue T.', channel: 'tiktok', value: 0, tier: 'Nouveau', last: 'il y a 1 h', next: 'Proposer une visite vidéo' },
    ],
    thread: {
      name: 'Claire V.',
      channel: 'web',
      msgs: [
        { from: 'client', text: 'Je cherche un 3 pièces à louer, budget 450 €.' },
        { from: 'ai', text: 'Bonjour Claire ! J’ai 4 biens dans ce budget. Quel quartier vous intéresse ?' },
        { from: 'client', text: 'Près du centre si possible.' },
        { from: 'ai', text: 'Voici 2 biens au centre. Visite possible demain à 17 h, je réserve ?' },
      ],
    },
    loyalty: {
      program: 'Suivi acquéreurs : alertes biens et parrainage',
      segments: [
        { label: 'Prospects chauds', count: 27, action: 'Visites prioritaires' },
        { label: 'Alertes de biens', count: 140, action: 'Nouveaux biens matchés' },
        { label: 'Anciens clients', count: 66, action: 'Programme parrainage' },
      ],
    },
    posts: [
      { day: 0, channel: 'facebook', title: 'Bien de la semaine' },
      { day: 1, channel: 'tiktok', title: 'Visite vidéo en 30 s' },
      { day: 2, channel: 'instagram', title: 'Carrousel : avant/après rénovation' },
      { day: 4, channel: 'whatsapp', title: 'Statut : nouveaux biens' },
      { day: 5, channel: 'facebook', title: 'Guide : acheter son premier bien' },
    ],
    events: [
      { channel: 'web', text: 'Prospect qualifié · budget validé' },
      { channel: 'facebook', text: 'Visite planifiée · villa 4 pièces' },
      { channel: 'whatsapp', text: 'Dossier locataire reçu' },
      { channel: 'tiktok', text: 'Nouveau prospect depuis une vidéo' },
      { channel: 'instagram', text: 'Frais d’agence encaissés', amount: 450 },
    ],
    scenario: ['Formulaire du site', 'Qualification par l’IA', 'Visite réservée', 'Pipeline mis à jour', 'Alertes de biens'],
  },
  {
    id: 'formation',
    label: 'École & formation',
    icon: GraduationCap,
    business: 'Académie Lumen',
    people: 'élèves',
    deal: 'inscription',
    baseRevenue: 7200,
    contacts: [
      { name: 'Parents Mballa', channel: 'whatsapp', value: 850, tier: 'VIP', last: 'il y a 1 h', next: 'Rappel échéance du trimestre' },
      { name: 'Junior A.', channel: 'tiktok', value: 0, tier: 'Nouveau', last: 'il y a 25 min', next: 'Inviter à la séance d’essai' },
      { name: 'Estelle N.', channel: 'instagram', value: 240, tier: 'Fidèle', last: 'hier', next: 'Proposer le module avancé' },
      { name: 'Olivier P.', channel: 'web', value: 120, tier: 'À relancer', last: 'il y a 40 j', next: 'Relancer l’inscription' },
      { name: 'Marie-Ange T.', channel: 'facebook', value: 380, tier: 'Fidèle', last: 'il y a 5 j', next: 'Demander un témoignage' },
    ],
    thread: {
      name: 'Junior A.',
      channel: 'tiktok',
      msgs: [
        { from: 'client', text: 'C’est combien la formation en dev web ?' },
        { from: 'ai', text: 'Salut Junior ! 3 mois, 180 € par mois. Une séance d’essai gratuite samedi ?' },
        { from: 'client', text: 'Oui je veux bien' },
        { from: 'ai', text: 'Inscrit pour samedi 10 h 🎓 Je t’envoie le programme ici.' },
      ],
    },
    loyalty: {
      program: 'Parrainage élève · réduction fratrie · suivi des progrès',
      segments: [
        { label: 'Échéances à venir', count: 92, action: 'Rappel de paiement' },
        { label: 'Fin de module', count: 35, action: 'Module suivant -10 %' },
        { label: 'Essais non convertis', count: 44, action: 'Relance personnalisée' },
      ],
    },
    posts: [
      { day: 0, channel: 'tiktok', title: 'Un jour à l’académie' },
      { day: 1, channel: 'instagram', title: 'Projet d’élève du mois' },
      { day: 2, channel: 'facebook', title: 'Portes ouvertes samedi' },
      { day: 3, channel: 'whatsapp', title: 'Statut : places restantes' },
      { day: 5, channel: 'tiktok', title: 'Astuce code en 20 s' },
    ],
    events: [
      { channel: 'tiktok', text: 'Séance d’essai réservée' },
      { channel: 'whatsapp', text: 'Mensualité payée', amount: 180 },
      { channel: 'web', text: 'Inscription complète en ligne', amount: 180 },
      { channel: 'facebook', text: 'Inscription aux portes ouvertes' },
      { channel: 'instagram', text: 'Question programme → réponse IA' },
    ],
    scenario: ['Question sur TikTok', 'Réponse et essai par l’IA', 'Inscription payée', 'Dossier élève créé', 'Rappels d’échéance'],
  },
];

export const TIER_STYLE: Record<Tier, { color: string; bg: string }> = {
  VIP: { color: '#7967FF', bg: '#EEEBFF' },
  Fidèle: { color: '#0D9488', bg: '#CCFBF1' },
  Nouveau: { color: '#2563EB', bg: '#DBEAFE' },
  'À relancer': { color: '#C2410C', bg: '#FFEDD5' },
};

export const EUR_TO_XAF = 655.957;

export function formatMoney(eur: number, currency: 'EUR' | 'XAF') {
  if (currency === 'XAF') {
    const v = Math.round((eur * EUR_TO_XAF) / 100) * 100;
    return `${new Intl.NumberFormat('fr-FR').format(v)} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);
}

/** Format court pour les tuiles KPI (« 3,9 M FCFA », « 6,1 k € »). */
export function formatMoneyCompact(eur: number, currency: 'EUR' | 'XAF') {
  const v = currency === 'XAF' ? eur * EUR_TO_XAF : eur;
  const n = new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  return currency === 'XAF' ? `${n} FCFA` : `${n} €`;
}
