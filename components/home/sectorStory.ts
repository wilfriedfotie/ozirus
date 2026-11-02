/**
 * Textes par secteur : carrousel « Secteurs » (ce que l'IA change pour ce métier) et
 * usages mis en avant dans la préview d'Ozirus OS (section Produits).
 * Clés = `id` des secteurs de `osData.ts`. Les « stats » décrivent ce que fait l'outil,
 * pas des résultats clients : aucun chiffre de performance inventé ici.
 */
export type SectorStory = {
  kicker: string;
  title: string;
  body: string;
  stats: { v: string; l: string }[];
  glow: string; // teinte du visuel et des points du carrousel
  /** Photo d'illustration du carrousel (Unsplash, sans personne). */
  image: string;
  usages: string[]; // ce qu'Ozirus OS fait pour ce secteur
  /** Gestion de stock (indispensable en Afrique) : article vendu dans le flow + inventaire. */
  stock: {
    note: string; // ligne système côté client pendant l'étape stock
    items: { name: string; qty: number; max: number; unit: string }[]; // le 1er est celui vendu
    alert: string; // rupture anticipée par l'IA
  };
};

export const STORY: Record<string, SectorStory> = {
  commerce: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80',
    kicker: 'Commerce & boutiques',
    title: 'Vendre sur WhatsApp et Instagram, même la nuit',
    body: 'Un agent IA répond aux questions de prix et de stock, prend la commande et envoie le lien de paiement.',
    stats: [
      { v: '24/7', l: 'Réponses clients' },
      { v: '< 5 s', l: 'Délai de réponse' },
      { v: '1', l: 'Fiche par client' },
    ],
    glow: '#F59E0B',
    usages: ['Commandes et paiements par lien, depuis la conversation', 'Relance automatique des paniers abandonnés', 'Points fidélité crédités à chaque achat'],
    stock: {
      note: '📦 Commande en préparation',
      items: [{ name: 'Robe wax bleue (M)', qty: 3, max: 20, unit: 'pcs' }, { name: 'Sac cuir camel', qty: 12, max: 15, unit: 'pcs' }, { name: 'Sandales tressées', qty: 9, max: 24, unit: 'paires' }, { name: 'Foulard soie', qty: 18, max: 30, unit: 'pcs' }],
      alert: 'Robe wax bleue : rupture dans 2 jours, commande fournisseur prête',
    },
  },
  restaurant: {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80',
    kicker: 'Restaurants & traiteurs',
    title: 'Commandes et réservations, sans décrocher le téléphone',
    body: 'L’IA présente le menu, réserve les tables, prend les précommandes et rappelle les clients la veille.',
    stats: [
      { v: '0', l: 'Double réservation' },
      { v: '24/7', l: 'Prise de commande' },
      { v: '10ᵉ', l: 'Repas suivi' },
    ],
    glow: '#F97316',
    usages: ['Réservations de tables et précommandes sur WhatsApp', 'Carte fidélité et dessert d’anniversaire automatiques', 'Plat du jour publié sur vos réseaux'],
    stock: {
      note: '👨‍🍳 Commande transmise en cuisine',
      items: [{ name: 'Poulet DG (portions)', qty: 6, max: 40, unit: 'portions' }, { name: 'Plantain mûr', qty: 14, max: 30, unit: 'kg' }, { name: 'Poisson braisé', qty: 9, max: 25, unit: 'pcs' }, { name: 'Jus de bissap', qty: 22, max: 40, unit: 'L' }],
      alert: 'Poulet : stock bas pour ce soir, commande au fournisseur suggérée',
    },
  },
  beaute: {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80',
    kicker: 'Beauté & bien-être',
    title: 'Un agenda qui se remplit tout seul',
    body: 'Les clientes réservent en DM, versent un acompte et reçoivent un rappel. Les retouches sont relancées au bon moment.',
    stats: [
      { v: 'J-1', l: 'Rappel automatique' },
      { v: 'DM', l: 'Réservation directe' },
      { v: '24/7', l: 'Agenda ouvert' },
    ],
    glow: '#EC4899',
    usages: ['Rendez-vous et acomptes pris en DM Instagram', 'Rappel des retouches et des soins à prévoir', 'Avant / après publiés chaque semaine'],
    stock: {
      note: '✨ Créneau confirmé, produits réservés',
      items: [{ name: 'Mèches knotless', qty: 5, max: 30, unit: 'paquets' }, { name: 'Gel coiffant', qty: 11, max: 20, unit: 'pots' }, { name: 'Soin hydratant', qty: 7, max: 15, unit: 'flacons' }, { name: 'Huile de ricin', qty: 13, max: 20, unit: 'flacons' }],
      alert: 'Mèches knotless : réassort conseillé avant samedi',
    },
  },
  sante: {
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=700&q=80',
    kicker: 'Santé & cliniques',
    title: 'Moins d’appels, plus de temps pour les patients',
    body: 'Prise de rendez-vous, consignes avant consultation et rappels de contrôle, sur le canal préféré du patient.',
    stats: [
      { v: '24/7', l: 'Prise de rendez-vous' },
      { v: 'J-1', l: 'Rappel patient' },
      { v: '1', l: 'Dossier unifié' },
    ],
    glow: '#14B8A6',
    usages: ['Agenda des médecins réservable sur WhatsApp et le site', 'Rappels de contrôles, vaccins et résultats', 'Conseils santé publiés sur Facebook'],
    stock: {
      note: '🩺 Consultation enregistrée',
      items: [{ name: 'Kits de prélèvement', qty: 8, max: 50, unit: 'kits' }, { name: 'Gants nitrile', qty: 14, max: 40, unit: 'boîtes' }, { name: 'Paracétamol 500 mg', qty: 36, max: 60, unit: 'boîtes' }, { name: 'Seringues 5 ml', qty: 120, max: 300, unit: 'pcs' }],
      alert: 'Kits de prélèvement : seuil atteint, bon de commande prêt',
    },
  },
  immobilier: {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    kicker: 'Immobilier',
    title: 'Chaque prospect qualifié avant la première visite',
    body: 'L’IA demande budget, quartier et délai, propose les biens qui correspondent et réserve la visite.',
    stats: [
      { v: '3', l: 'Critères qualifiés' },
      { v: '24/7', l: 'Prospects suivis' },
      { v: '1', l: 'Pipeline unique' },
    ],
    glow: '#3B82F6',
    usages: ['Qualification des prospects du site et de Facebook', 'Alertes quand un nouveau bien correspond', 'Visites vidéo diffusées sur TikTok'],
    stock: {
      note: '🔑 Visite planifiée',
      items: [{ name: 'Studios disponibles', qty: 2, max: 12, unit: 'lots' }, { name: '3 pièces centre', qty: 4, max: 10, unit: 'lots' }, { name: 'Villas Kribi', qty: 3, max: 6, unit: 'lots' }, { name: 'Bureaux', qty: 5, max: 8, unit: 'lots' }],
      alert: 'Studios : forte demande, 2 lots restants à mettre en avant',
    },
  },
  formation: {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=80',
    kicker: 'Écoles & formations',
    title: 'Des inscriptions qui ne tombent plus dans l’oubli',
    body: 'Réponses sur les programmes, séances d’essai réservées, échéances rappelées aux parents et aux élèves.',
    stats: [
      { v: '24/7', l: 'Réponses programmes' },
      { v: 'J-3', l: 'Rappel d’échéance' },
      { v: '1', l: 'Dossier par élève' },
    ],
    glow: '#8B5CF6',
    usages: ['Séances d’essai réservées depuis TikTok et Instagram', 'Rappels de paiement aux parents', 'Projets d’élèves mis en avant sur vos réseaux'],
    stock: {
      note: '🎓 Place réservée',
      items: [{ name: 'Places dev web (oct.)', qty: 4, max: 25, unit: 'places' }, { name: 'Places design', qty: 9, max: 20, unit: 'places' }, { name: 'Kits pédagogiques', qty: 12, max: 40, unit: 'kits' }, { name: 'Places data', qty: 15, max: 20, unit: 'places' }],
      alert: 'Dev web : dernière session presque complète, ouvrir une nouvelle classe',
    },
  },
};

/* ─── Secteurs supplémentaires du carrousel ─────────────────────────────────
   Ils n'ont pas leur propre jeu de données Ozirus OS : la démo (section Produits) reprend celui
   du secteur le plus proche (`base`), avec le nom de commerce du secteur choisi (`business`). */
export type CarouselStory = Omit<SectorStory, 'stock' | 'usages'>;

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

export const EXTRA_STORY: Record<string, CarouselStory> = {
  pharmacie: {
    image: U('photo-1587854692152-cbe660dbde88'),
    kicker: 'Pharmacies',
    title: 'Ordonnances et disponibilités, réponse immédiate',
    body: 'Les clients envoient leur ordonnance sur WhatsApp, l’IA vérifie le stock et prépare la commande à retirer.',
    stats: [{ v: '24/7', l: 'Disponibilités' }, { v: 'J-0', l: 'Alerte péremption' }, { v: '1', l: 'Stock unifié' }],
    glow: '#14B8A6',
  },
  hotellerie: {
    image: U('photo-1566073771259-6a8506099945'),
    kicker: 'Hôtels & résidences',
    title: 'Réservations directes, sans commission',
    body: 'L’IA répond aux demandes, propose les chambres libres, encaisse l’acompte et prépare l’arrivée.',
    stats: [{ v: '24/7', l: 'Réservations' }, { v: '0 %', l: 'Commission' }, { v: 'J-1', l: 'Rappel arrivée' }],
    glow: '#0EA5E9',
  },
  logistique: {
    image: U('photo-1601584115197-04ecc0da31d7'),
    kicker: 'Transport & logistique',
    title: 'Chaque colis suivi, chaque client informé',
    body: 'Devis, prise en charge et suivi de livraison envoyés automatiquement, sans appels à répétition.',
    stats: [{ v: 'Live', l: 'Suivi colis' }, { v: '< 5 s', l: 'Devis' }, { v: '1', l: 'Tableau flotte' }],
    glow: '#3B82F6',
  },
  agriculture: {
    image: U('photo-1574943320219-553eb213f72d'),
    kicker: 'Agriculture & agro',
    title: 'Produire au bon moment, vendre au bon prix',
    body: 'Suivi des récoltes et des stocks, prix du marché et commandes des acheteurs, au même endroit.',
    stats: [{ v: 'Prix', l: 'Du marché' }, { v: '1', l: 'Stock récoltes' }, { v: '24/7', l: 'Commandes' }],
    glow: '#16A34A',
  },
  btp: {
    image: U('photo-1541888946425-d81bb19240f5'),
    kicker: 'BTP & construction',
    title: 'Devis, chantiers et matériaux sous contrôle',
    body: 'Devis générés plus vite, avancement des chantiers partagé au client, matériaux suivis par chantier.',
    stats: [{ v: '< 1 h', l: 'Devis envoyé' }, { v: '1', l: 'Fiche chantier' }, { v: 'Photo', l: 'Suivi client' }],
    glow: '#F59E0B',
  },
  garage: {
    image: U('photo-1486262715619-67b85e0b08d3'),
    kicker: 'Garages & auto',
    title: 'Rendez-vous, devis et pièces suivis',
    body: 'Prise de rendez-vous en ligne, devis validé par WhatsApp, rappel d’entretien envoyé au bon moment.',
    stats: [{ v: 'DM', l: 'Rendez-vous' }, { v: 'Devis', l: 'Validé en ligne' }, { v: 'Rappel', l: 'Entretien' }],
    glow: '#64748B',
  },
  sport: {
    image: U('photo-1534438327276-14e5300c3a48'),
    kicker: 'Salles de sport',
    title: 'Abonnements renouvelés, membres fidèles',
    body: 'Inscriptions, paiements récurrents et relances des membres inactifs, sans tableur.',
    stats: [{ v: 'Auto', l: 'Renouvellement' }, { v: '24/7', l: 'Inscriptions' }, { v: 'Relance', l: 'Inactifs' }],
    glow: '#EF4444',
  },
  evenementiel: {
    image: U('photo-1511795409834-ef04bbd61622'),
    kicker: 'Événementiel',
    title: 'Des demandes de devis traitées en minutes',
    body: 'L’IA qualifie la demande (date, invités, budget), envoie un devis et suit l’acompte.',
    stats: [{ v: '3', l: 'Critères qualifiés' }, { v: '< 5 min', l: 'Devis' }, { v: '1', l: 'Planning' }],
    glow: '#EC4899',
  },
  finance: {
    image: U('photo-1554224155-6726b3ff858f'),
    kicker: 'Microfinance & services financiers',
    title: 'Dossiers complets, échéances respectées',
    body: 'Collecte des pièces par WhatsApp, suivi des dossiers et rappels d’échéance automatiques.',
    stats: [{ v: 'J-3', l: 'Rappel échéance' }, { v: '1', l: 'Dossier client' }, { v: '24/7', l: 'Questions' }],
    glow: '#7967FF',
  },
  ecommerce: {
    image: U('photo-1563013544-824ae1b704d3'),
    kicker: 'E-commerce',
    title: 'Votre boutique en ligne qui vend toute seule',
    body: 'Site, paiements, paniers relancés et service client IA, branchés sur le même stock.',
    stats: [{ v: '24/7', l: 'Service client' }, { v: 'Auto', l: 'Paniers relancés' }, { v: '1', l: 'Stock unique' }],
    glow: '#8B5CF6',
  },
  distribution: {
    image: U('photo-1586528116311-ad8dd3c8310d'),
    kicker: 'Distribution & grossistes',
    title: 'Commandes revendeurs et entrepôt synchronisés',
    body: 'Les revendeurs commandent sur WhatsApp, le stock d’entrepôt et les livraisons suivent.',
    stats: [{ v: '24/7', l: 'Commandes' }, { v: '1', l: 'Entrepôt' }, { v: 'Auto', l: 'Réassort' }],
    glow: '#F97316',
  },
};

/** Secteurs du carrousel, dans l'ordre : `base` = secteur Ozirus OS utilisé pour la démo. */
export const CAROUSEL: { id: string; base: string; business?: string }[] = [
  { id: 'commerce', base: 'commerce' },
  { id: 'restaurant', base: 'restaurant' },
  { id: 'beaute', base: 'beaute' },
  { id: 'sante', base: 'sante' },
  { id: 'pharmacie', base: 'sante', business: 'Pharmacie du Centre' },
  { id: 'hotellerie', base: 'restaurant', business: 'Hôtel Les Palmiers' },
  { id: 'immobilier', base: 'immobilier' },
  { id: 'btp', base: 'immobilier', business: 'Bâti Pro' },
  { id: 'formation', base: 'formation' },
  { id: 'logistique', base: 'commerce', business: 'Trans-Express' },
  { id: 'distribution', base: 'commerce', business: 'Dépôt Central' },
  { id: 'ecommerce', base: 'commerce', business: 'Nala Shop' },
  { id: 'agriculture', base: 'commerce', business: 'Coop Agri Nord' },
  { id: 'garage', base: 'beaute', business: 'Garage Auto Plus' },
  { id: 'sport', base: 'beaute', business: 'FitZone' },
  { id: 'evenementiel', base: 'restaurant', business: 'Nyota Events' },
  { id: 'finance', base: 'formation', business: 'Crédit Solidaire' },
];

export const carouselStory = (id: string): CarouselStory => EXTRA_STORY[id] ?? STORY[id];
