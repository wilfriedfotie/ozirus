// Contenu de la roadmap marketing de l'offre MVP (mvp.ozirus.agency).
// Les chiffres de l'offre doivent rester alignés avec `OFFER` dans app/mvp/page.tsx.

export const OFFER = {
  name: 'MVP en 30 jours avec un CTO cofondateur',
  price: 5000,
  originalPrice: 10000,
  url: 'https://mvp.ozirus.agency',
  bonuses: ['Landing page de lancement', 'Vidéo motion promo'],
};

// Fenêtre de l'objectif : du 10 au 31 octobre 2026.
export const GOAL = {
  label: '1 client signé avec acompte encaissé',
  start: '10 oct.',
  end: '31 oct.',
  days: 22,
};

/* ─── Funnel ─────────────────────────────────────────────────────────────── */
// Hypothèses par défaut du calculateur, modifiables dans le panneau gauche.
export interface FunnelInputs {
  closeRate: number;      // % d'appels de découverte qualifiés qui signent
  showRate: number;       // % de RDV réservés qui ont lieu
  outboundReply: number;  // % de messages de prospection qui obtiennent une réponse
  replyToCall: number;    // % de réponses qui débouchent sur un RDV
  landingToCall: number;  // % des visiteurs (ads) de la landing qui réservent un RDV
  cpc: number;            // coût par clic moyen des ads (€)
}

export const DEFAULT_FUNNEL: FunnelInputs = {
  closeRate: 25,
  showRate: 80,
  outboundReply: 12,
  replyToCall: 25,
  landingToCall: 2,
  cpc: 1.8,
};

/* ─── Personas ───────────────────────────────────────────────────────────── */
export interface Persona {
  id: string;
  name: string;
  tagline: string;
  priority: 'Prioritaire' | 'Secondaire';
  who: string;
  pains: string[];
  triggers: string[];
  objections: string[];
  where: string[];
  hook: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'non-tech',
    name: 'Le fondateur non-tech',
    tagline: 'Une idée validée, pas de cofondateur technique',
    priority: 'Prioritaire',
    who: '28–45 ans, salarié ou consultant en France, Belgique, Suisse ou Québec. A parlé de son idée à des clients potentiels, a 5 à 15 k€ d\'épargne ou de love money.',
    pains: [
      'Des devis d\'agences à 20–40 k€ et 4 à 6 mois de délai',
      'Peur de se faire avoir faute de savoir juger un devis technique',
      'Cherche un CTO associé depuis des mois, sans succès',
    ],
    triggers: [
      'Vient de recevoir un devis trop cher',
      'A un prospect ou un investisseur qui attend une démo',
      'S\'est lancé sur Bubble / ChatGPT et bloque à 80 %',
    ],
    objections: ['« C\'est encore cher pour moi »', '« 30 jours, c\'est trop beau »', '« Je peux le faire avec ChatGPT »'],
    where: ['LinkedIn (groupes et posts entrepreneuriat)', 'Groupes Facebook de créateurs d\'entreprise', 'Recherches Google « prix développer une application »'],
    hook: 'Vous n\'avez pas besoin d\'un devis à 30 000 €. Vous avez besoin d\'un associé technique pendant 30 jours.',
  },
  {
    id: 'expert',
    name: 'L\'expert qui productise',
    tagline: 'Consultant, coach ou formateur avec une audience',
    priority: 'Prioritaire',
    who: 'Indépendant ou dirigeant de petite structure, déjà payé pour son expertise. Veut transformer sa méthode en outil SaaS pour vendre sans vendre son temps.',
    pains: [
      'Ses revenus plafonnent à son nombre d\'heures',
      'Utilise des tableurs et Notion bricolés avec ses clients',
      'Ne sait pas par où commencer côté technique',
    ],
    triggers: ['Fin d\'année : réflexion sur le modèle 2027', 'Une demande client récurrente qu\'il gère à la main', 'Voit un concurrent lancer son outil'],
    objections: ['« Je n\'ai pas le temps de piloter un projet tech »', '« Et si personne ne paie l\'abonnement ? »'],
    where: ['LinkedIn (très actif)', 'Podcasts et newsletters de son secteur', 'Communautés de freelances'],
    hook: 'Votre méthode vaut un abonnement. En 30 jours, elle devient un produit que vos clients paient chaque mois.',
  },
  {
    id: 'startup',
    name: 'La startup incubée',
    tagline: 'Un démo day ou une levée à préparer',
    priority: 'Secondaire',
    who: 'Équipe de 1 à 3 fondateurs en incubateur, accélérateur ou prêt d\'honneur (BPI, French Tech, écoles). A une échéance claire et un petit budget non dilutif.',
    pains: ['Échéance de démo day ou de comité', 'Prestataire précédent qui a disparu ou livré un code inutilisable', 'Doit montrer de la traction, pas des maquettes'],
    triggers: ['Date de démo day fixée', 'Subvention ou prêt d\'honneur obtenu', 'Retour d\'investisseur : « revenez avec un produit »'],
    objections: ['« On cherche un CTO associé avec equity »', '« L\'incubateur nous a recommandé un autre prestataire »'],
    where: ['Programmes d\'incubateurs (contacter les chargés d\'affaires)', 'Slack et Discord startups FR', 'LinkedIn'],
    hook: 'Votre démo day est dans 6 semaines ? Arrivez avec un produit en ligne et vos premiers utilisateurs.',
  },
  {
    id: 'diaspora',
    name: 'L\'entrepreneur de la diaspora',
    tagline: 'Un projet pour l\'Afrique, un budget en euros',
    priority: 'Secondaire',
    who: 'Africain de la diaspora (France, Belgique, Canada) qui lance une fintech, edtech, logistique ou marketplace pour son pays d\'origine. Cherche quelqu\'un qui comprend les deux marchés.',
    pains: ['Prestataires locaux peu fiables, agences européennes qui ignorent le Mobile Money', 'Pilote le projet à distance'],
    triggers: ['Retour de vacances au pays avec une idée', 'Associé local prêt à opérer', 'Concours ou programme d\'accélération Afrique'],
    objections: ['« Je préfère un développeur sur place »', '« Le prix en euros est élevé »'],
    where: ['Réseau personnel et WhatsApp', 'Associations et événements de la diaspora', 'LinkedIn'],
    hook: 'Un produit pensé pour le Mobile Money et le marché africain, construit avec les standards d\'une startup européenne.',
  },
];

/* ─── Canaux & budget ────────────────────────────────────────────────────── */
export interface Channel {
  id: string;
  name: string;
  kind: 'Payant' | 'Gratuit';
  share: number; // part du budget ads (%), 0 pour les canaux gratuits
  role: string;
  actions: string[];
  kpi: string;
}

export const CHANNELS: Channel[] = [
  {
    id: 'outbound',
    name: 'Prospection LinkedIn directe',
    kind: 'Gratuit',
    share: 0,
    role: 'Canal n°1 pour signer ce mois-ci : un client à 5 000 € se signe en conversation, rarement sur un clic.',
    actions: [
      '20 demandes de connexion ciblées par jour (personas 1 et 2), avec note personnalisée',
      'Message d\'ouverture 24 h après acceptation, relance à J+3 et J+7',
      'Essai gratuit de Sales Navigator (1 mois) pour filtrer « fondateur », « CEO », « 1–10 salariés »',
    ],
    kpi: '12 % de réponses · 25 % des réponses en RDV',
  },
  {
    id: 'content',
    name: 'Contenu LinkedIn',
    kind: 'Gratuit',
    share: 0,
    role: 'Rend la prospection crédible : le prospect regarde votre profil avant de répondre.',
    actions: [
      'Profil optimisé : bannière « MVP en 30 jours », lien vers mvp.ozirus.agency en vedette',
      '1 post par jour ouvré : coulisses, avant/après, erreurs de MVP, méthode IA',
      'Publier la vidéo motion en natif (pas en lien YouTube)',
    ],
    kpi: '1 post/jour · 2 DM entrants/semaine',
  },
  {
    id: 'network',
    name: 'Réseau & apporteurs d\'affaires',
    kind: 'Gratuit',
    share: 0,
    role: 'Le chemin le plus court : une recommandation se signe 3 fois plus vite.',
    actions: [
      'Message personnel à 50 contacts (anciens clients, collègues, amis entrepreneurs)',
      'Commission d\'apport de 10 % (500 €) sur le premier client signé',
      'Contacter 5 incubateurs / chargés d\'affaires avec une fiche offre en PDF',
    ],
    kpi: '50 messages · 5 introductions',
  },
  {
    id: 'google',
    name: 'Google Ads (Search)',
    kind: 'Payant',
    share: 45,
    role: 'Capte l\'intention chaude : les gens qui cherchent déjà à faire développer leur produit.',
    actions: [
      'Mots-clés : « créer un MVP », « développer une application prix », « agence développement SaaS », « CTO freelance », « faire développer une app »',
      'Ciblage : France, Belgique, Suisse, Canada (FR) · exclure « gratuit », « formation », « emploi »',
      'Une annonce par angle : prix (5 000 €), délai (30 jours), CTO associé',
    ],
    kpi: 'CPC < 2,50 € · 2 % des clics en RDV',
  },
  {
    id: 'meta',
    name: 'Meta Ads (Facebook / Instagram)',
    kind: 'Payant',
    share: 40,
    role: 'Fait connaître l\'offre avec la vidéo, puis nourrit le retargeting.',
    actions: [
      'Campagne vidéo (30 s) : intérêts entrepreneuriat, création d\'entreprise, startups, SaaS · 28–50 ans',
      'Objectif « prospects » ou « messages WhatsApp » plutôt que « trafic »',
      'Tester 3 accroches différentes, couper les perdantes après 3 jours',
    ],
    kpi: 'Coût par prospect < 25 €',
  },
  {
    id: 'retargeting',
    name: 'Retargeting',
    kind: 'Payant',
    share: 15,
    role: 'Rattrape les visiteurs de la landing qui n\'ont pas réservé (la majorité).',
    actions: [
      'Audience : visiteurs mvp.ozirus.agency des 30 derniers jours (pixel Meta + tag Google)',
      'Créas : FAQ « pourquoi pas ChatGPT ? », comparatif freelance vs CTO, places limitées',
      'Fréquence max 3 par jour',
    ],
    kpi: '3 à 5 % des visiteurs reviennent',
  },
];

export const DEFAULT_ADS_BUDGET = 800; // € sur la période

/* ─── Messages & scripts ─────────────────────────────────────────────────── */
export interface Script {
  id: string;
  title: string;
  context: string;
  text: string;
}

export const SCRIPTS: Script[] = [
  {
    id: 'li-connect',
    title: 'Note de connexion LinkedIn',
    context: 'Persona 1 ou 2 · max 300 caractères',
    text: 'Bonjour {prénom}, je vois que vous lancez {projet / secteur}. J\'accompagne des fondateurs non techniques comme associé technique le temps de sortir leur MVP. Ravi d\'échanger si le sujet vous parle.',
  },
  {
    id: 'li-open',
    title: 'Message d\'ouverture (24 h après acceptation)',
    context: 'Ne pas vendre : poser une question',
    text: 'Merci pour la connexion {prénom} ! Question rapide : votre produit, il en est où aujourd\'hui ? Idée, maquettes, ou déjà un premier prototype ?\n\nJe demande parce que je vois beaucoup de fondateurs bloqués au même endroit : un devis d\'agence à 30 k€ d\'un côté, ChatGPT qui les emmène à 80 % de l\'autre.',
  },
  {
    id: 'li-pitch',
    title: 'Réponse quand le prospect a un projet',
    context: 'Proposer l\'appel, pas le prix',
    text: 'Clair, merci. Ce que je fais : je rejoins le projet comme CTO cofondateur pendant 30 jours et on sort le MVP ensemble (web, mobile ou desktop), avec la landing et une vidéo de lancement.\n\nLe plus utile serait un appel de 30 min : je vous dis honnêtement ce qui tient en 30 jours et ce qu\'il faut couper. Ça vous va {jour} à {heure}, ou vous préférez choisir ici : {lien calendrier} ?',
  },
  {
    id: 'li-follow',
    title: 'Relance J+3 / J+7',
    context: 'Courte, avec de la valeur',
    text: 'Je me permets de revenir vers vous {prénom} : j\'ai mis en ligne une page qui explique la méthode (et pourquoi l\'IA seule ne suffit pas pour les 20 % restants) : mvp.ozirus.agency\n\nSi ce n\'est pas le bon moment, aucun souci, dites-le-moi simplement.',
  },
  {
    id: 'network',
    title: 'Message au réseau',
    context: 'WhatsApp / e-mail perso, 50 contacts',
    text: 'Salut {prénom} ! Petit service : je lance une offre pour les fondateurs qui veulent sortir leur application en 30 jours (5 000 € au lieu de 10 000, je deviens leur CTO le temps du projet).\n\nTu connais quelqu\'un qui a une idée d\'app ou de SaaS et pas de cofondateur technique ? Si ça aboutit, je te reverse 500 € pour l\'intro. Merci 🙏',
  },
  {
    id: 'email',
    title: 'E-mail froid (incubateurs, startups)',
    context: 'Objet : Démo day — un MVP en 30 jours ?',
    text: 'Bonjour {prénom},\n\nVos startups en {programme} ont souvent besoin d\'un produit en ligne avant leur démo day, et rarement d\'un CTO à temps plein.\n\nJe propose une offre simple : je rejoins l\'équipe comme CTO cofondateur pendant 30 jours et je livre le MVP (web, mobile ou desktop), avec la landing page et une vidéo de lancement. 5 000 € au lieu de 10 000 € pour les premiers projets.\n\nEst-ce que je peux vous envoyer une fiche à partager avec vos fondateurs ?\n\nWilfried — Ozirus · mvp.ozirus.agency',
  },
];

export interface Objection {
  q: string;
  a: string;
}

export const OBJECTIONS: Objection[] = [
  { q: '« C\'est trop cher. »', a: 'Comparé à quoi ? Une agence vous a demandé combien, et en combien de mois ? Ici c\'est 5 000 € pour un produit en ligne en 30 jours, landing et vidéo comprises. Et on peut étaler : 50 % à la signature, 50 % à la livraison.' },
  { q: '« Je peux le faire avec ChatGPT. »', a: 'Pour un prototype, oui. Combien de temps vous y avez déjà passé ? Ce qui coûte cher, ce sont les 20 % restants : sécurité, paiements, mise en production, stores. Votre temps de fondateur vaut plus sur la vente que sur le débogage.' },
  { q: '« 30 jours, c\'est impossible. »', a: 'Ça l\'est si on construit tout. On verrouille le périmètre la première semaine : la plus petite version qui prouve que des gens paient. Je vous montre une démo chaque semaine, vous voyez le produit avancer.' },
  { q: '« Je dois réfléchir / en parler à mon associé. »', a: 'Bien sûr. Qu\'est-ce qui vous ferait dire oui ou non ? (écouter) Je vous propose qu\'on se rappelle {date} à trois, je garde votre créneau de démarrage jusque-là.' },
  { q: '« Je cherche un CTO associé avec equity. »', a: 'C\'est souvent le bon objectif à terme. Mais un CTO associé se trouve beaucoup plus facilement avec un produit en ligne et des premiers utilisateurs. Le MVP sert justement à ça, et le code vous appartient.' },
];

export const CALL_SCRIPT = [
  { step: '0–3 min', title: 'Cadre', text: 'Remercier, annoncer le déroulé : « je vous pose des questions, je vous dis franchement si ça tient en 30 jours, et on voit la suite ». Demander combien de temps il a.' },
  { step: '3–15 min', title: 'Découverte', text: 'Le problème, pour qui, comment c\'est géré aujourd\'hui. Ce qui existe déjà (maquettes, prototype). L\'échéance (démo, levée, client). Le budget prévu et qui décide.' },
  { step: '15–22 min', title: 'Périmètre en direct', text: 'Reformuler le MVP en 3 à 5 fonctionnalités. Dire ce qu\'on coupe et pourquoi. C\'est le moment où il voit le CTO à l\'œuvre.' },
  { step: '22–27 min', title: 'Offre', text: '30 jours, 5 000 € au lieu de 10 000 €, landing + vidéo offertes, code à son nom. Démarrage possible le {date}. Paiement 50/50.' },
  { step: '27–30 min', title: 'Engagement', text: '« Qu\'est-ce qui vous empêcherait de démarrer le {date} ? » Traiter l\'objection. Envoyer la proposition (Admin › Documents) dans l\'heure, fixer le rappel.' },
];

/* ─── Script vidéo ───────────────────────────────────────────────────────── */
export interface VideoBeat {
  time: string;
  part: string;
  voice: string;
  visual: string;
}

export const VIDEO_SCRIPT: VideoBeat[] = [
  { time: '0–5 s', part: 'Accroche', voice: 'Vous avez une idée d\'application. On vous a demandé 30 000 euros et six mois pour la construire.', visual: 'Face caméra, plan serré. Texte à l\'écran : « 30 000 € · 6 mois ».' },
  { time: '5–15 s', part: 'Problème', voice: 'Alors vous avez essayé ChatGPT. Ça avance vite… jusqu\'à 80 %. Puis viennent la sécurité, les paiements, la mise en ligne. Et là, ça bloque.', visual: 'Capture d\'écran d\'un prototype IA, barre de progression qui s\'arrête à 80 %.' },
  { time: '15–30 s', part: 'Solution', voice: 'Je m\'appelle Wilfried. Pendant 30 jours, je deviens votre CTO cofondateur. On coupe ce qui ne sert pas votre premier client, et on livre un vrai produit.', visual: 'Face caméra, puis maquette Mac + iPhone de la landing.' },
  { time: '30–45 s', part: 'Méthode', voice: 'L\'IA écrit le code répétitif, je relis chaque ligne. Vous voyez une démo chaque semaine. Le code est à votre nom.', visual: 'Timeline animée : cadrage, développement, tests, lancement.' },
  { time: '45–55 s', part: 'Offre', voice: 'Votre MVP en 30 jours, pour 5 000 euros au lieu de 10 000, avec la landing page et la vidéo de lancement offertes.', visual: 'Prix animé 10 000 → 5 000 €, badges « Landing » et « Vidéo motion ».' },
  { time: '55–60 s', part: 'Appel à l\'action', voice: 'Il reste deux places pour novembre. Réservez un appel de 30 minutes sur mvp.ozirus.agency.', visual: 'URL à l\'écran, bouton « Réserver mon MVP ».' },
];

export const VIDEO_CUTS = [
  { format: '60 s · 16:9', use: 'Section vidéo de la landing, YouTube, e-mails' },
  { format: '30 s · 9:16', use: 'Meta Ads (Reels / Stories) : accroche + offre + CTA' },
  { format: '15 s · 9:16', use: 'Retargeting : une seule objection (« pourquoi pas ChatGPT ? »)' },
];

export const AD_HOOKS = [
  'On vous a demandé 30 000 € pour votre app ? Voici l\'alternative.',
  'ChatGPT vous emmène à 80 %. Les 20 % restants coûtent le plus cher.',
  'Pas de cofondateur technique ? Prenez-en un pendant 30 jours.',
  'Votre démo day approche et votre produit n\'existe pas encore ?',
];

/* ─── Plan d'action ─────────────────────────────────────────────────────── */
export interface Week {
  id: string;
  label: string;
  dates: string;
  goal: string;
  tasks: { id: string; text: string }[];
}

export const WEEKS: Week[] = [
  {
    id: 'w1',
    label: 'Semaine 1',
    dates: '10 – 16 oct.',
    goal: 'Tout est prêt, la prospection démarre',
    tasks: [
      { id: 'w1-video', text: 'Tourner la vidéo (60 s) et la mettre dans la section vidéo de la landing (VIDEO dans app/mvp/page.tsx)' },
      { id: 'w1-calendar', text: 'Créer le lien de réservation (Calendly / Cal.com, 30 min) et le brancher sur les CTA de la landing' },
      { id: 'w1-tracking', text: 'Installer le pixel Meta et le tag Google Ads sur mvp.ozirus.agency, avec un événement « RDV réservé »' },
      { id: 'w1-profile', text: 'Optimiser le profil LinkedIn (bannière, titre, lien en vedette)' },
      { id: 'w1-list', text: 'Construire une liste de 150 prospects (personas 1 et 2) dans Admin › Leads IA' },
      { id: 'w1-network', text: 'Envoyer le message au réseau (50 contacts) avec la commission d\'apport' },
      { id: 'w1-google', text: 'Lancer Google Ads Search (budget jour ≈ 1/3 du Google sur la période)' },
      { id: 'w1-posts', text: 'Publier 3 posts LinkedIn dont l\'annonce de l\'offre' },
    ],
  },
  {
    id: 'w2',
    label: 'Semaine 2',
    dates: '17 – 23 oct.',
    goal: 'Volume : 5 appels de découverte réservés',
    tasks: [
      { id: 'w2-outbound', text: '20 connexions + 20 messages LinkedIn par jour ouvré, relances J+3 / J+7' },
      { id: 'w2-meta', text: 'Lancer Meta Ads vidéo 30 s avec 3 accroches, couper les perdantes à J+3' },
      { id: 'w2-retarget', text: 'Activer le retargeting des visiteurs de la landing' },
      { id: 'w2-incub', text: 'Écrire à 5 incubateurs / chargés d\'affaires (e-mail froid + fiche PDF)' },
      { id: 'w2-calls', text: 'Tenir les premiers appels avec le script de découverte et remplir Admin › Brief Client' },
      { id: 'w2-proposals', text: 'Envoyer chaque proposition (Admin › Documents) dans l\'heure qui suit l\'appel' },
      { id: 'w2-review', text: 'Bilan vendredi : coût par RDV par canal, réallouer le budget vers le meilleur' },
    ],
  },
  {
    id: 'w3',
    label: 'Semaine 3',
    dates: '24 – 31 oct.',
    goal: 'Closing : 1 contrat signé + acompte encaissé',
    tasks: [
      { id: 'w3-follow', text: 'Relancer toutes les propositions envoyées (appel, pas e-mail)' },
      { id: 'w3-scarcity', text: 'Annoncer « 2 places pour un démarrage en novembre » (post + retargeting + relances)' },
      { id: 'w3-calls', text: 'Continuer 3 à 5 appels de découverte, prioriser les prospects avec échéance' },
      { id: 'w3-contract', text: 'Convertir la proposition acceptée en contrat (Admin › Documents › Convertir)' },
      { id: 'w3-deposit', text: 'Encaisser l\'acompte de 50 % et fixer la date de l\'atelier de cadrage' },
      { id: 'w3-case', text: 'Demander l\'accord du client pour documenter le projet en étude de cas' },
    ],
  },
];

export const DAILY_ROUTINE = [
  { time: '9h – 9h30', task: 'Publier le post du jour, répondre aux commentaires' },
  { time: '9h30 – 10h30', task: '20 connexions + 20 messages de prospection' },
  { time: '14h – 14h20', task: 'Relances (J+3, J+7) et réponses' },
  { time: '17h – 17h15', task: 'Vérifier les ads (dépense, coût par prospect), noter les chiffres du jour' },
];

export const KPIS = [
  { label: 'Messages de prospection envoyés', target: '300 sur la période' },
  { label: 'Appels de découverte tenus', target: '5 à 8' },
  { label: 'Propositions envoyées', target: '3' },
  { label: 'Coût par RDV (ads)', target: '< 120 €' },
  { label: 'Contrat signé + acompte', target: '1' },
];
