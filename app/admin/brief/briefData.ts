import {
  Globe, Smartphone, Zap, Sparkles,
} from 'lucide-react';

export type ProjectTypeId = 'website' | 'app' | 'automation' | 'other';

export type ClientStatusId = 'thinking' | 'negotiating' | 'paid' | 'lost';

export interface ClientStatusDef {
  id: ClientStatusId;
  label: string;
  color: string;
}

export const CLIENT_STATUSES: ClientStatusDef[] = [
  { id: 'thinking', label: 'En réflexion', color: '#F59E0B' },
  { id: 'negotiating', label: 'En négociation', color: '#3B82F6' },
  { id: 'paid', label: 'Payé', color: '#10B981' },
  { id: 'lost', label: 'Perdu', color: '#EF4444' },
];

export function getClientStatus(id: ClientStatusId): ClientStatusDef {
  return CLIENT_STATUSES.find(s => s.id === id) || CLIENT_STATUSES[0];
}

export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'radio';

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  helper?: string;
}

export interface FieldGroup {
  id: string;
  title: string;
  fields: FieldDef[];
}

export interface ProjectTypeDef {
  id: ProjectTypeId;
  label: string;
  shortLabel: string;
  description: string;
  icon: any;
  color: string;
  /** Champs à collecter tant que le client n'a pas encore payé (découverte, vente). */
  groups: FieldGroup[];
  /** Champs de cadrage technique une fois le client payé — remplacent `groups` + CLOSING_GROUP. */
  paidGroups: FieldGroup[];
}

/* ─── Champs communs à tous les types de projet ─────────────────────────── */
export const COMMON_GROUPS: FieldGroup[] = [
  {
    id: 'client',
    title: 'Informations client',
    fields: [
      { id: 'clientName', label: 'Nom du contact', type: 'text', placeholder: 'Ex: Jean Mbarga', required: true },
      { id: 'clientCompany', label: 'Entreprise / Structure', type: 'text', placeholder: 'Ex: SARL Le Palmier' },
      { id: 'clientPhone', label: 'Téléphone', type: 'text', placeholder: '+237 6XX XX XX XX' },
      { id: 'clientEmail', label: 'Email', type: 'text', placeholder: 'contact@exemple.com' },
      { id: 'clientSector', label: "Secteur d'activité", type: 'text', placeholder: 'Ex: Restauration, Immobilier, Retail...' },
    ],
  },
  {
    id: 'context',
    title: 'Contexte & objectifs',
    fields: [
      { id: 'problem', label: 'Quel problème veut-il résoudre ?', type: 'textarea', placeholder: 'Ex: Perte de temps sur la prise de commande, pas de visibilité en ligne...', required: true },
      { id: 'goals', label: 'Objectifs principaux du projet', type: 'textarea', placeholder: 'Ex: Automatiser les commandes, générer des leads, vendre en ligne...' },
      { id: 'targetAudience', label: 'Public / utilisateurs cibles', type: 'text', placeholder: 'Ex: Clients particuliers, équipe interne, partenaires B2B...' },
      { id: 'competitors', label: 'Concurrents ou références appréciées', type: 'textarea', placeholder: 'Sites, apps ou outils que le client aime ou veut égaler' },
    ],
  },
];

export const CLOSING_GROUP: FieldGroup = {
  id: 'closing',
  title: 'Budget, délais & remarques',
  fields: [
    { id: 'budget', label: 'Budget estimé', type: 'select', options: ['< 200 000 FCFA', '200 000 – 500 000 FCFA', '500 000 – 1 500 000 FCFA', '1 500 000 – 5 000 000 FCFA', '> 5 000 000 FCFA', 'Non défini'] },
    { id: 'timeline', label: 'Délai souhaité', type: 'select', options: ['Urgent (< 2 semaines)', '2 à 4 semaines', '1 à 3 mois', '3 mois et plus', 'Flexible'] },
    { id: 'decisionMaker', label: 'Qui décide / valide le projet ?', type: 'text', placeholder: 'Ex: Le client lui-même, un associé, un board...' },
    { id: 'notes', label: 'Remarques complémentaires', type: 'textarea', placeholder: 'Toute information utile non couverte plus haut' },
  ],
};

/* ─── Groupe de clôture une fois le client payé : plus de vente, du cadrage ── */
export const PAID_CLOSING_GROUP: FieldGroup = {
  id: 'closing_paid',
  title: 'Lancement & suivi projet',
  fields: [
    { id: 'paymentReceived', label: 'Modalité de paiement reçue', type: 'select', options: ['Acompte (50%)', 'Paiement intégral', 'Paiement échelonné', 'Autre'] },
    { id: 'kickoffDate', label: 'Date de lancement souhaitée', type: 'text', placeholder: 'Ex: 28 juillet 2026' },
    { id: 'mainContact', label: 'Interlocuteur principal pendant le projet', type: 'text', placeholder: 'Nom + moyen de contact préféré (WhatsApp, email...)' },
    { id: 'reportingFrequency', label: 'Fréquence de points d\'avancement souhaitée', type: 'select', options: ['Quotidienne', 'Hebdomadaire', 'À chaque étape clé', 'À la demande'] },
    { id: 'notes', label: 'Remarques complémentaires', type: 'textarea', placeholder: 'Toute information utile non couverte plus haut' },
  ],
};

/* ─── Définitions spécifiques par type de projet ────────────────────────── */
export const PROJECT_TYPES: ProjectTypeDef[] = [
  {
    id: 'website',
    label: 'Site Web',
    shortLabel: 'Site Web',
    description: 'Vitrine, e-commerce, blog, plateforme institutionnelle...',
    icon: Globe,
    color: '#3B82F6',
    groups: [
      {
        id: 'website_vision',
        title: 'Vision du prospect',
        fields: [
          { id: 'clientVision', label: 'Sa vision du site (à décrire avec ses mots)', type: 'textarea', placeholder: "Ex: Je veux un site moderne qui inspire confiance, avec mes réalisations en avant et un moyen simple pour qu'on me contacte...", required: true },
          { id: 'firstImpression', label: 'Ce que le visiteur doit ressentir en arrivant sur le site', type: 'textarea', placeholder: "Ex: Confiance immédiate, sérieux, envie d'en savoir plus, sentiment de modernité..." },
          { id: 'servicesOffered', label: 'Ses services / produits à présenter (détail par service)', type: 'textarea', placeholder: "Lister chaque service/produit avec une courte description : ce qu'il fait, pour qui, ce qui le rend spécial" },
          { id: 'flagshipOffer', label: 'Service ou offre phare à mettre en avant en priorité', type: 'text', placeholder: "Ex: Le service qui rapporte le plus / celui qu'il préfère vendre" },
          { id: 'pricingInfo', label: 'Ses tarifs / pricing à afficher (détail complet)', type: 'textarea', placeholder: "Ex: Grille tarifaire complète, forfaits avec ce qui est inclus dans chacun, prix à partir de X, devis sur demande..." },
          { id: 'pricingDisplay', label: 'Comment afficher les prix sur le site ?', type: 'radio', options: ['Prix affichés clairement', 'Fourchettes / à partir de', 'Sur devis uniquement', 'Pas de prix affichés'] },
          { id: 'differentiators', label: 'Ce qui le différencie de la concurrence', type: 'textarea', placeholder: "Ex: Rapidité, prix, qualité, expérience, garanties, spécialisation..." },
          { id: 'socialProof', label: 'Preuves de confiance disponibles', type: 'multiselect', options: ['Témoignages clients', 'Avis Google', 'Chiffres clés (nb clients, années...)', 'Logos partenaires/clients', 'Certifications / diplômes', 'Portfolio / réalisations', 'Aucune pour le moment'] },
          { id: 'mainCta', label: "Action principale attendue du visiteur", type: 'select', options: ['Prendre contact / demander un devis', 'Acheter en ligne', 'Prendre rendez-vous', "Appeler directement", "S'inscrire / laisser ses coordonnées", 'Télécharger un document'] },
          { id: 'mediaAssets', label: 'Photos / vidéos disponibles pour illustrer le site', type: 'radio', options: ['Oui, shooting professionnel disponible', 'Quelques photos disponibles', 'Aucune, prévoir des visuels/stock'] },
          { id: 'referenceSites', label: "Sites qu'il aime ou veut prendre en exemple", type: 'textarea', placeholder: "URLs ou noms de sites dont il aime le style/l'organisation, et pourquoi" },
          { id: 'toneStyle', label: 'Ton et style souhaités', type: 'select', options: ['Professionnel / corporate', 'Moderne / dynamique', 'Chaleureux / accessible', 'Premium / luxe', 'Fun / décontracté', 'Non défini'] },
        ],
      },
      {
        id: 'website_specs',
        title: 'Spécifications du site',
        fields: [
          { id: 'siteType', label: 'Type de site', type: 'select', options: ['Vitrine / présentation', 'E-commerce / boutique en ligne', 'Blog / média', 'Plateforme / portail', 'Landing page', 'Refonte de site existant'] },
          { id: 'existingSite', label: 'URL du site actuel (si refonte)', type: 'text', placeholder: 'https://...' },
          { id: 'pages', label: 'Pages / sections souhaitées', type: 'textarea', placeholder: 'Ex: Accueil, À propos, Services, Blog, Contact, Boutique...' },
          { id: 'features', label: 'Fonctionnalités attendues', type: 'multiselect', options: ['Formulaire de contact', 'Prise de rendez-vous', 'Paiement en ligne / Mobile Money', 'Espace client / connexion', 'Multilingue', 'Blog / actualités', 'Chat / support en direct', 'Référencement SEO', 'Newsletter'] },
          { id: 'domainHosting', label: 'Nom de domaine & hébergement', type: 'text', placeholder: 'Déjà acquis ? À fournir par Ozirus ?' },
          { id: 'brandAssets', label: 'Charte graphique / logo disponibles ?', type: 'radio', options: ['Oui, tout est prêt', 'Partiellement (logo seul)', 'Non, à créer'] },
          { id: 'contentReady', label: 'Contenus (textes, images) déjà prêts ?', type: 'radio', options: ['Oui', 'Partiellement', 'Non, à produire'] },
        ],
      },
    ],
    paidGroups: [
      {
        id: 'website_kickoff',
        title: 'Cadrage technique (post-paiement)',
        fields: [
          { id: 'domainAccess', label: 'Accès nom de domaine (registrar, identifiants)', type: 'textarea', placeholder: 'Ex: Nom.com, GoDaddy... préciser qui gère l\'accès' },
          { id: 'hostingAccess', label: 'Accès hébergement actuel (si existant)', type: 'textarea', placeholder: 'Identifiants ou contact du prestataire actuel' },
          { id: 'contentDelivery', label: 'Comment les contenus seront livrés', type: 'select', options: ['Google Drive', 'WhatsApp', 'Email', 'Document Word/PDF', 'À définir avec le client'] },
          { id: 'logoFilesReceived', label: 'Fichiers logo / charte reçus', type: 'radio', options: ['Oui, reçus', 'En attente du client', 'Non nécessaire'] },
          { id: 'analyticsNeeds', label: 'Suivi statistiques souhaité', type: 'multiselect', options: ['Google Analytics', 'Meta Pixel', 'Aucun', 'À définir'] },
        ],
      },
    ],
  },
  {
    id: 'app',
    label: 'Application (Mobile / Web App)',
    shortLabel: 'Application',
    description: 'App mobile iOS/Android, logiciel métier, SaaS...',
    icon: Smartphone,
    color: '#10B981',
    groups: [
      {
        id: 'app_vision',
        title: 'Vision du prospect',
        fields: [
          { id: 'clientVision', label: "Sa vision de l'application (à décrire avec ses mots)", type: 'textarea', placeholder: "Ex: Je veux que mes clients puissent commander en 2 clics et suivre leur livraison en temps réel...", required: true },
          { id: 'userJourney', label: "Le parcours idéal de l'utilisateur, du début à la fin", type: 'textarea', placeholder: "Ex: Il ouvre l'app, voit le catalogue, ajoute au panier, paie par Mobile Money, reçoit une confirmation..." },
          { id: 'servicesOffered', label: 'Ses services / offres à intégrer (détail par fonctionnalité)', type: 'textarea', placeholder: "Lister chaque service, produit ou fonctionnalité métier à couvrir, avec ce qu'elle doit permettre de faire" },
          { id: 'flagshipFeature', label: 'Fonctionnalité phare / différenciante à soigner en priorité', type: 'text', placeholder: "Ex: Le suivi en temps réel, le chat intégré, le tableau de bord..." },
          { id: 'pricingInfo', label: 'Son modèle de pricing (abonnement, commission, achat unique...)', type: 'textarea', placeholder: "Ex: Abonnement mensuel 5000 FCFA, commission 5% par vente, achat unique par fonctionnalité..." },
          { id: 'monetization', label: 'Comment l\'application génère des revenus', type: 'select', options: ['Vente directe de produits/services', 'Abonnement récurrent', 'Commission sur transactions', 'Publicité', 'Usage interne (pas de monétisation directe)', 'Autre'] },
          { id: 'differentiators', label: "Ce qui la différencie des solutions existantes", type: 'textarea', placeholder: "Ex: Plus rapide, spécifique au marché local, plus simple à utiliser..." },
          { id: 'successMetric', label: 'Comment il mesurera que l\'app fonctionne bien', type: 'text', placeholder: 'Ex: Nombre de commandes/jour, taux de rétention, gain de temps...' },
          { id: 'referenceSites', label: "Apps qu'il aime ou veut prendre en exemple", type: 'textarea', placeholder: "Noms d'apps dont il aime le fonctionnement/l'ergonomie, et pourquoi" },
        ],
      },
      {
        id: 'app_specs',
        title: "Spécifications de l'application",
        fields: [
          { id: 'appPlatform', label: 'Plateforme(s) visée(s)', type: 'multiselect', options: ['iOS', 'Android', 'Web (navigateur)', 'Desktop'] },
          { id: 'appType', label: "Type d'application", type: 'select', options: ['Application mobile grand public', 'Logiciel métier interne', 'Plateforme SaaS multi-clients', 'Marketplace', 'Application de gestion / ERP léger'] },
          { id: 'coreFeatures', label: 'Fonctionnalités principales', type: 'textarea', placeholder: 'Ex: Gestion de stock, prise de commande, tableau de bord, notifications push...', required: true },
          { id: 'userRoles', label: "Types d'utilisateurs / rôles", type: 'text', placeholder: 'Ex: Admin, Client, Livreur, Vendeur...' },
          { id: 'integrations', label: 'Intégrations nécessaires', type: 'multiselect', options: ['Paiement / Mobile Money', 'WhatsApp Business API', 'SMS', 'Email', 'Cartographie / GPS', 'API tierce existante', 'Base de données existante'] },
          { id: 'offlineNeeds', label: "Besoin d'un mode hors-ligne ?", type: 'radio', options: ['Oui', 'Non', 'Pas sûr'] },
          { id: 'existingSystem', label: 'Système / outil actuel à remplacer', type: 'text', placeholder: 'Ex: Excel, cahier papier, autre logiciel...' },
        ],
      },
    ],
    paidGroups: [
      {
        id: 'app_kickoff',
        title: 'Cadrage technique (post-paiement)',
        fields: [
          { id: 'devAccountsAccess', label: 'Comptes développeur (Apple/Google) disponibles ?', type: 'radio', options: ['Oui, identifiants fournis', 'À créer par Ozirus', 'Non concerné (web app)'] },
          { id: 'backendAccess', label: 'Accès backend/API existants à fournir', type: 'textarea', placeholder: 'Ex: URL API, documentation, identifiants...' },
          { id: 'testDevices', label: 'Appareils de test disponibles côté client', type: 'text', placeholder: 'Ex: 1 iPhone, 2 Android...' },
          { id: 'contentDelivery', label: 'Comment les contenus/données seront livrés', type: 'select', options: ['Google Drive', 'WhatsApp', 'Email', 'Export Excel/CSV', 'À définir avec le client'] },
        ],
      },
    ],
  },
  {
    id: 'automation',
    label: 'Automatisation IA',
    shortLabel: 'Automatisation',
    description: 'Chatbot, agent IA, automatisation de process, WhatsApp...',
    icon: Zap,
    color: '#F59E0B',
    groups: [
      {
        id: 'automation_vision',
        title: 'Vision du prospect',
        fields: [
          { id: 'clientVision', label: "Sa vision de l'automatisation (à décrire avec ses mots)", type: 'textarea', placeholder: "Ex: Je veux que mes clients puissent commander et payer sur WhatsApp sans que j'aie à répondre moi-même...", required: true },
          { id: 'servicesOffered', label: 'Ses services / produits que l\'agent IA doit connaître et proposer', type: 'textarea', placeholder: "Lister chaque service/produit que l'automatisation devra présenter ou vendre" },
          { id: 'pricingInfo', label: 'Ses tarifs à intégrer dans les réponses automatiques', type: 'textarea', placeholder: "Ex: Grille tarifaire, forfaits, prix par service..." },
          { id: 'currentProcess', label: 'Comment il gère ça aujourd\'hui (avant automatisation)', type: 'textarea', placeholder: "Ex: Il répond lui-même sur WhatsApp, cahier papier, tableur Excel..." },
          { id: 'painPoints', label: 'Ce qui lui fait perdre le plus de temps actuellement', type: 'textarea', placeholder: "Ex: Répondre aux mêmes questions, relancer les clients qui ne payent pas, tenir le stock à jour..." },
          { id: 'toneOfVoice', label: 'Ton souhaité pour les réponses de l\'agent IA', type: 'select', options: ['Professionnel / formel', 'Chaleureux / familier', 'Direct / efficace', 'Adapté au client (mix)'] },
        ],
      },
      {
        id: 'automation_specs',
        title: "Spécifications de l'automatisation",
        fields: [
          { id: 'automationType', label: "Type d'automatisation", type: 'select', options: ['Chatbot WhatsApp / Messenger', 'Agent IA de prise de commande', 'Automatisation de tâches internes (CRM, reporting...)', "Génération de contenu / documents automatique", 'Scraping / veille automatisée', 'Autre automatisation'] },
          { id: 'repetitiveTasks', label: 'Tâches répétitives à automatiser', type: 'textarea', placeholder: 'Ex: Répondre aux questions fréquentes, relancer les clients, générer des factures...', required: true },
          { id: 'channels', label: 'Canaux concernés', type: 'multiselect', options: ['WhatsApp', 'Email', 'SMS', 'Site web', 'Instagram / Facebook', 'Interne (outil métier)'] },
          { id: 'dataSource', label: 'Sources de données à connecter', type: 'text', placeholder: 'Ex: Google Sheets, Firestore, CRM existant, catalogue produits...' },
          { id: 'volume', label: 'Volume estimé (messages/commandes par jour)', type: 'text', placeholder: 'Ex: ~50 messages/jour' },
          { id: 'humanHandoff', label: "Besoin d'un transfert vers un humain ?", type: 'radio', options: ['Oui, pour les cas complexes', 'Non, 100% automatique', 'Pas sûr'] },
        ],
      },
    ],
    paidGroups: [
      {
        id: 'automation_kickoff',
        title: 'Cadrage technique (post-paiement)',
        fields: [
          { id: 'whatsappBusinessAccess', label: 'Accès WhatsApp Business / Meta Business Manager', type: 'radio', options: ['Oui, identifiants fournis', 'À créer par Ozirus', 'Non concerné'] },
          { id: 'knowledgeBase', label: 'Base de connaissances / catalogue à fournir', type: 'textarea', placeholder: 'Ex: Liste produits, FAQ, tarifs, horaires...' },
          { id: 'existingToolsAccess', label: 'Accès aux outils existants à connecter', type: 'textarea', placeholder: 'Ex: Google Sheets, CRM, base de données...' },
          { id: 'testContacts', label: 'Numéros/contacts de test disponibles', type: 'text', placeholder: 'Pour valider le flow avant mise en prod' },
        ],
      },
    ],
  },
  {
    id: 'other',
    label: 'Autre prestation',
    shortLabel: 'Autre',
    description: 'Consulting, formation, design, ou tout projet sur mesure...',
    icon: Sparkles,
    color: '#EC4899',
    groups: [
      {
        id: 'other_vision',
        title: 'Vision du prospect',
        fields: [
          { id: 'clientVision', label: 'Sa vision de la prestation (à décrire avec ses mots)', type: 'textarea', placeholder: "Ex: Je veux que mon équipe sache utiliser l'IA au quotidien pour gagner du temps...", required: true },
          { id: 'servicesOffered', label: 'Ce qu\'il attend précisément, service par service', type: 'textarea', placeholder: "Détailler chaque volet attendu de la prestation" },
          { id: 'pricingInfo', label: 'Budget ou tarif déjà évoqué / attendu', type: 'textarea', placeholder: "Ex: Forfait journée, tarif horaire, budget global évoqué..." },
          { id: 'referenceSites', label: 'Exemples ou références qui l\'inspirent', type: 'textarea', placeholder: "Prestataires, formations ou réalisations qu'il apprécie" },
        ],
      },
      {
        id: 'other_specs',
        title: 'Détails de la prestation',
        fields: [
          { id: 'serviceType', label: 'Nature de la prestation', type: 'text', placeholder: 'Ex: Formation IA, audit digital, design graphique, consulting...', required: true },
          { id: 'deliverables', label: 'Livrables attendus', type: 'textarea', placeholder: 'Ex: Rapport d\'audit, supports de formation, maquettes, stratégie...' },
          { id: 'scope', label: 'Périmètre / étendue souhaitée', type: 'textarea', placeholder: "Décrire ce qui est inclus ou attendu" },
          { id: 'successCriteria', label: 'À quoi ressemble le succès ?', type: 'textarea', placeholder: 'Comment le client saura que la prestation a atteint son objectif' },
        ],
      },
    ],
    paidGroups: [
      {
        id: 'other_kickoff',
        title: 'Cadrage (post-paiement)',
        fields: [
          { id: 'materialsAccess', label: 'Ressources / accès nécessaires côté client', type: 'textarea', placeholder: 'Ex: Documents existants, accès à des outils, salle de formation...' },
          { id: 'kickoffDate', label: 'Date de démarrage prévue', type: 'text', placeholder: 'Ex: 1er août 2026' },
        ],
      },
    ],
  },
];

export function getProjectType(id: ProjectTypeId): ProjectTypeDef {
  return PROJECT_TYPES.find(p => p.id === id) || PROJECT_TYPES[0];
}
