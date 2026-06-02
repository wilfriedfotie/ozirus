'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShoppingBag,
  UtensilsCrossed,
  Pill,
  Scissors,
  Truck,
  Building2,
  GraduationCap,
  Heart,
  Sparkles,
  Tractor,
  Landmark,
  ShoppingCart,
  Hotel,
  HardHat,
  TrendingUp,
  Clock,
  Users,
  RefreshCw,
  Star,
  Zap,
  MapPin,
  Wheat,
} from 'lucide-react';

/* ─── animation helpers ──────────────────────────────── */
const T = (delay = 0): Transition => ({ duration: 0.55, delay, ease: [0.25, 0, 0, 1] });

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: T(delay),
});

const upView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: T(delay),
});

/* ─── data ───────────────────────────────────────────── */
const STATS = [
  { v: '35+', l: 'PME accompagnées au Cameroun' },
  { v: '280%', l: 'ROI moyen observé sur 6 mois' },
  { v: '92%', l: 'des clients renouvellent leur contrat' },
];

const WHY = [
  { icon: MapPin, title: 'On pense local', body: 'Mobile Money, WhatsApp, pidgin, électricité aléatoire — nos solutions sont conçues pour les réalités camerounaises.' },
  { icon: TrendingUp, title: 'ROI rapide et mesurable', body: 'Chaque solution est chiffrée avant démarrage. Vous savez exactement ce que vous allez gagner.' },
  { icon: RefreshCw, title: 'Accompagnement A à Z', body: 'Diagnostic → développement → formation → suivi continu. On ne disparaît pas après la livraison.' },
  { icon: Zap, title: 'De l\'idée au produit en 90j', body: 'Pas de tunnel de 6 mois. Vous voyez le produit avancer et vous donnez votre avis à chaque étape.' },
];

const SECTORS = [
  {
    icon: ShoppingBag,
    label: 'Commerce',
    sub: 'Boutiques & Supérettes',
    roi: '−40 % pertes',
    challenges: [
      'Vous commandez à l\'aveugle — impossible de savoir ce qui va se vendre cette semaine à Bonamoussadi ou Ngousso.',
      'Les produits périment avant d\'être vendus : huile, farine, lait — des milliers de FCFA perdus chaque semaine.',
      'Les clients à crédit ne remboursent pas et vous n\'avez pas le temps de courir après chacun.',
      'Un employé vole en caisse ou sur les stocks et vous ne le détectez qu\'après de lourdes pertes.',
      'Vous perdez des ventes par rupture sur les 20 articles qui font 80 % de votre chiffre d\'affaires.',
      'La concurrence des supermarchés Mahima ou Casino vous grignote des clients chaque mois.',
    ],
    solutions: [
      'L\'IA analyse vos ventes + les fêtes locales (fin du mois, Noël, rentrée) pour prédire exactement ce que vous devez commander chaque semaine.',
      'Alertes WhatsApp automatiques 5 jours avant chaque péremption — vous vendez en promotion avant de perdre.',
      'Relances automatiques des clients à crédit par WhatsApp avec votre ton de voix : doux d\'abord, ferme ensuite.',
      'Tableau de bord temps réel qui détecte les anomalies de stock : si 10 unités disparaissent sans vente enregistrée, vous êtes alerté.',
      'Chatbot WhatsApp qui prend les commandes, encaisse en Mobile Money (MTN, Orange) et met à jour le stock automatiquement.',
      'Rapports hebdomadaires : top 10 des produits, marge par article, produits à liquider — directement sur votre téléphone.',
    ],
    gains: ['−30 à 45 % de pertes sur stocks', '+15 à 25 % de chiffre d\'affaires', '−70 % de temps passé à la caisse', 'Détection des vols en temps réel'],
  },
  {
    icon: Wheat,
    label: 'Agroalimentaire',
    sub: 'Transformation & Production',
    roi: '+2,8M FCFA/mois',
    challenges: [
      'Le prix du manioc, du plantain ou du maïs change chaque semaine à Bafoussam ou Dschang — impossible de planifier.',
      'Vous produisez trop certaines semaines et tout part à la poubelle, pas assez d\'autres et vous perdez des commandes.',
      'Vos acheteurs sont peu fidèles : revendeurs au marché qui négocient au dernier moment, pas de contrats stables.',
      'Vous n\'avez aucune visibilité sur vos marges réelles — vous savez que vous gagnez de l\'argent mais pas combien.',
      'La traçabilité est nulle : un lot contaminé et vous ne savez pas où il est parti ni comment le rappeler.',
      'Les charges cachées (groupe électrogène, main d\'œuvre informelle, emballages) explosent vos coûts sans que vous le voyiez.',
    ],
    solutions: [
      'L\'IA surveille les prix des marchés de Douala, Yaoundé et Bafoussam en temps réel et vous alerte quand c\'est le bon moment d\'acheter ou vendre.',
      'Prédiction de la demande hebdomadaire basée sur la saison, les fêtes et l\'historique — vous produisez exactement ce qu\'il faut.',
      'Mise en relation avec des acheteurs réguliers (supérettes, restaurants, hôtels) qui signent des contrats mensuels stables.',
      'Tableau de bord des marges par produit, par lot, par client — vous voyez enfin ce qui est vraiment rentable.',
      'Traçabilité IA de chaque lot : ingrédients utilisés, date de production, destination — rappel produit possible en 10 minutes.',
      'Analyse automatique des charges : l\'IA détecte les postes de coût qui explosent et vous suggère des optimisations concrètes.',
    ],
    gains: ['+1,5 à 3 millions FCFA/mois', 'Production calibrée à ±5 % de la demande réelle', '−35 % de pertes post-production', 'Contrats récurrents avec des acheteurs stables'],
  },
  {
    icon: UtensilsCrossed,
    label: 'Restauration',
    sub: 'Restaurants, Maquis, Snacks',
    roi: '−40 % gaspillage',
    challenges: [
      'Chaque midi vous cuisinez pour 80 personnes et 40 viennent — le reste finit à la poubelle. Tous les jours.',
      'Le vendredi soir c\'est le rush : les commandes WhatsApp fusent, vous en perdez la moitié, des clients partent sans être servis.',
      'Votre cuisinier commande les ingrédients à sa tête — vous découvrez les achats en fin de mois sur le relevé.',
      'Impossible de savoir si le ndolé se vend mieux que le poulet DG, ni à quelle heure vous faites le plus de couverts.',
      'Les clients viennent une fois puis ne reviennent plus — zéro fidélisation, zéro programme de récompense.',
      'Les paiements en espèces créent des trous en caisse : difficile de savoir ce qui a réellement été encaissé.',
    ],
    solutions: [
      'L\'IA prédit combien de plats vous vendrez demain, par heure, en croisant l\'historique, la météo et le jour de la semaine.',
      'Bot WhatsApp qui prend les commandes, affiche le menu du jour avec photos et prix, encaisse en Mobile Money et envoie l\'heure de retrait.',
      'Suivi des achats ingrédients : chaque achat est saisi sur WhatsApp et comparé au nombre de plats produits — les anomalies ressortent immédiatement.',
      'Dashboard en temps réel : plats vendus, heures de pointe, marge par plat, ingrédients à commander — tout sur votre téléphone.',
      'Programme de fidélité automatique : après 5 repas, le client reçoit un bon de réduction par WhatsApp. Zéro carte papier.',
      'Réconciliation caisse automatique : l\'IA compare les commandes enregistrées avec les paiements reçus et signale les écarts.',
    ],
    gains: ['−40 % de gaspillage alimentaire', '+18 à 28 % de marge brute', '+35 % de clients fidèles sur 6 mois', 'Rush géré sans stress grâce au bot WhatsApp'],
  },
  {
    icon: Pill,
    label: 'Pharmacies',
    sub: 'Officines & Parapharmacies',
    roi: '−35 % périmés',
    challenges: [
      'Les médicaments phares (Paracétamol, Amoxicilline, Coartem) sont en rupture 2 à 3 fois par mois — les clients vont chez le concurrent.',
      'Des médicaments périment sur les étagères : vous les découvrez lors de l\'inventaire mensuel, trop tard pour les vendre.',
      'Le suivi des ordonnances est manuel : vous ne savez pas quels clients reviennent régulièrement ni ce qu\'ils prennent.',
      'Vos vendeurs ne savent pas toujours orienter un client qui décrit des symptômes — perte de crédibilité et de vente.',
      'La gestion des prix fluctuants des grossistes (LABOREX, UBIPHARM) est faite à la main — erreurs fréquentes de marge.',
      'Les fournisseurs livrent en retard et vous n\'avez aucune visibilité sur les délais réels.',
    ],
    solutions: [
      'L\'IA prédit les ruptures 10 jours à l\'avance en croisant votre historique et les tendances saisonnières (paludisme en saison des pluies, etc.).',
      'Alertes WhatsApp automatiques 30, 15 et 5 jours avant chaque péremption avec suggestion du prix de liquidation.',
      'CRM patients : historique des achats, rappels de renouvellement d\'ordonnance, fidélisation sans effort.',
      'Assistant IA pour vos vendeurs : le client décrit ses symptômes, l\'IA suggère les produits adaptés et les contre-indications.',
      'Suivi automatique des marges par produit et par fournisseur — vous voyez en un clic où vous gagnez vraiment.',
      'Tableau de bord fournisseurs : délais de livraison historiques, fiabilité, comparaison des prix — vous négociez mieux.',
    ],
    gains: ['−35 % de pertes sur périmés', 'Zéro rupture sur les 50 médicaments phares', '+20 % de CA sur produits à forte rotation', '−80 % de temps passé aux inventaires'],
  },
  {
    icon: Scissors,
    label: 'Artisans',
    sub: 'Coiffure, Couture, Mécanique',
    roi: '+40 % fidélisation',
    challenges: [
      'Votre agenda est dans votre tête ou sur un carnet : deux clients sur le même créneau, des oublis, le chaos.',
      'Les clients posent des lapins : ils réservent, ne viennent pas et ne préviennent pas — vous perdez le créneau et l\'argent.',
      'Vous passez des heures à relancer les clients qui doivent encore de l\'argent pour une robe ou une réparation.',
      'Pas de suivi des clients fidèles : vous ne savez pas qui vient depuis 2 ans ni comment les récompenser.',
      'Les devis sont faits à la main, souvent sous-estimés — vous finissez parfois à travailler presque à perte.',
      'La communication avec les clients (photos de modèles, suivi de commande) se perd dans les fils WhatsApp.',
    ],
    solutions: [
      'Agenda intelligent sur WhatsApp : le client choisit son créneau, vous confirmez en un clic, tout synchronisé en temps réel.',
      'Rappels automatiques 24h et 2h avant le rendez-vous avec lien pour confirmer ou reprogrammer — les lapins chutent de 50 %.',
      'Facturation automatique à la fin de chaque prestation + relance douce à J+3, J+7, J+14 avec votre ton de voix.',
      'Programme de fidélité IA : après X passages, le client reçoit une récompense personnalisée par WhatsApp.',
      'Générateur de devis intelligent : décrivez la prestation en vocal, l\'IA génère un devis PDF professionnel en 30 secondes.',
      'Fil de discussion dédié par projet avec photos, messages et historique — tout au même endroit, rien de perdu.',
    ],
    gains: ['+8 à 12 heures récupérées par semaine', '+40 % de fidélisation', '−50 % de lapins', 'Recouvrement des impayés sans conflit'],
  },
  {
    icon: Truck,
    label: 'Transport',
    sub: 'Livraison & Flotte',
    roi: '−25 % carburant',
    challenges: [
      'Vos chauffeurs perdent 30 minutes chaque matin dans les bouchons de Deido ou Akwa faute de route optimisée.',
      'Un client appelle pour savoir où est sa livraison — votre chauffeur ne répond pas ou donne une estimation inexacte.',
      'Vous ne savez pas la rentabilité réelle de chaque tournée : carburant, temps, usure — c\'est un mystère.',
      'Les chauffeurs déclarent plus de carburant qu\'en consomment — difficile à vérifier sans suivi.',
      'La coordination de plusieurs véhicules se fait par appels WhatsApp en cascade — erreurs et retards fréquents.',
      'Les documents de livraison (bons, signatures) se perdent — litiges fréquents avec les clients.',
    ],
    solutions: [
      'Optimisation des tournées en temps réel : l\'IA calcule le meilleur itinéraire selon les bouchons, les points de livraison et le carburant disponible.',
      'Suivi GPS partagé avec le client par WhatsApp : lien de tracking direct, heure d\'arrivée estimée mise à jour en continu.',
      'Tableau de bord de rentabilité par véhicule et par tournée : coût réel, marge, taux de remplissage — vous voyez ce qui est profitable.',
      'Rapprochement automatique entre carburant déclaré et kilomètres parcourus — les anomalies ressortent immédiatement.',
      'Dispatch intelligent : l\'IA affecte les courses aux chauffeurs disponibles les plus proches selon leur position GPS.',
      'Bon de livraison numérique signé sur WhatsApp avec photo — archivé automatiquement, infalsifiable.',
    ],
    gains: ['−20 à 30 % de coûts carburant', '−60 % de retards de livraison', '+25 % de courses traitées avec la même flotte', 'Zéro litige sur les livraisons'],
  },
  {
    icon: Building2,
    label: 'Immobilier',
    sub: 'Agences & Promoteurs',
    roi: '+35 % baux',
    challenges: [
      'Vous faites visiter des appartements à des clients qui ne correspondent pas du tout au bien — perte de temps massive.',
      'Les dossiers de location (fiches, contrats, quittances) s\'accumulent sur papier — un dossier perdu et c\'est un litige.',
      'Les loyers impayés à Yaoundé ou Douala sont un fléau : vous courez après les locataires chaque fin de mois.',
      'Les prospects contactent 5 agences simultanément et signent ailleurs parce que vous avez tardé à rappeler.',
      'Pas de visibilité sur votre portefeuille : quels biens sont vides, depuis combien de temps, quel est le manque à gagner.',
      'Les propriétaires vous demandent des comptes et vous n\'avez pas de rapport mensuel clair à leur envoyer.',
    ],
    solutions: [
      'Bot WhatsApp de qualification : avant toute visite, l\'IA pose 5 questions au prospect (budget, quartier, surface) et ne vous remonte que les profils compatibles.',
      'Visites virtuelles 360° partagées par WhatsApp : le client visite depuis son téléphone — seuls les vraiment intéressés se déplacent.',
      'Relances de loyers entièrement automatisées : rappel à J-3, J0, J+5 avec ton progressif — vous n\'appelez que les cas graves.',
      'CRM immobilier IA : chaque prospect est suivi et relancé au bon moment, avec rappel sur les biens qui correspondent à son profil.',
      'Tableau de bord portefeuille en temps réel : taux d\'occupation, vacance par bien, loyers à recevoir, commissions à facturer.',
      'Rapport manuel automatique pour chaque propriétaire : état du bien, paiements reçus, dépenses — généré et envoyé sans intervention.',
    ],
    gains: ['+35 % de baux signés', '−80 % de visites inutiles', '+40 % de recouvrement des loyers', 'Rapport propriétaire automatique chaque mois'],
  },
  {
    icon: GraduationCap,
    label: 'Éducation',
    sub: 'Écoles privées, Centres, Académies',
    roi: '+35 % recouvrement',
    challenges: [
      'Les parents paient en plusieurs tranches et vous perdez le fil : qui a payé, combien, quand — le cahier ne suffit plus.',
      'Le planning des profs change chaque semaine : remplacements de dernière minute, salles mal attribuées, cours qui se chevauchent.',
      'Les élèves absentéistes ne sont signalés aux parents que des semaines après — trop tard pour corriger.',
      'Les inscriptions en début d\'année se font dans le désordre : files d\'attente, dossiers incomplets, parents qui attendent des heures.',
      'Vous ne savez pas quels élèves sont en difficulté avant les examens — les mauvaises notes arrivent comme une surprise.',
      'La communication avec les parents est chaotique : convocations perdues, annulations non communiquées à temps.',
    ],
    solutions: [
      'Suivi des scolarités en temps réel : l\'IA enregistre chaque paiement, calcule le solde restant et relance les parents par WhatsApp à chaque tranche due.',
      'Planning intelligent : l\'IA génère automatiquement l\'emploi du temps selon les disponibilités, salles et matières — ajustement en un clic.',
      'Présences numériques : l\'appel se fait sur téléphone, et tout parent d\'élève absent reçoit un WhatsApp dans la minute.',
      'Inscription en ligne via WhatsApp : le parent remplit le dossier depuis son téléphone, paie par Mobile Money, reçoit son reçu — la file d\'attente disparaît.',
      'IA de suivi pédagogique : détecte les élèves en décrochage 3 semaines avant les examens pour une intervention à temps.',
      'Messagerie parent-école centralisée : convocations, bulletins, annonces — tout par WhatsApp avec accusé de lecture.',
    ],
    gains: ['+25 à 40 % de recouvrement', '−90 % d\'oublis de paiement', 'Détection précoce des élèves en difficulté', '+50 % de satisfaction des parents'],
  },
  {
    icon: Heart,
    label: 'Santé',
    sub: 'Cabinets & Centres Médicaux',
    roi: '−50 % no-shows',
    challenges: [
      'Votre secrétaire passe la moitié de sa journée à prendre des rendez-vous alors que des patients attendent devant elle.',
      'Des patients posent des lapins : le créneau est bloqué, le médecin attend, personne ne prévient.',
      'Les dossiers papier s\'accumulent : retrouver l\'historique d\'un patient prend 10 minutes minimum.',
      'Les stocks de médicaments et consommables (seringues, gants, tests de palu) tombent en rupture sans prévenir.',
      'Les patients chroniques (diabète, hypertension) oublient leurs rendez-vous de suivi — leur état se dégrade inutilement.',
      'Pas de visibilité sur les revenus réels : quelles consultations ont été payées, lesquelles sont en attente.',
    ],
    solutions: [
      'Bot de prise de rendez-vous WhatsApp 24h/24 : le patient choisit le médecin et le créneau, décrit son motif — aucune intervention humaine.',
      'Rappels automatiques à J-1 et H-2 avec confirmation obligatoire : si le patient ne confirme pas, le créneau est libéré automatiquement.',
      'Dossier patient numérique accessible en 3 secondes : historique des consultations, ordonnances, résultats d\'analyses — depuis le téléphone.',
      'Alertes de stock intelligentes : seuil minimum configurable par produit, commande suggérée au fournisseur quand le seuil est atteint.',
      'Suivi automatique des patients chroniques : rappel personnalisé tous les X jours selon le protocole du médecin.',
      'Tableau de bord financier : consultations du jour, encaissements, impayés, CA mensuel — sans comptable.',
    ],
    gains: ['−50 % de no-shows', '+10 à 15 heures libérées par semaine', 'Dossier patient en 3 secondes', 'Zéro rupture de consommables critiques'],
  },
  {
    icon: Sparkles,
    label: 'Beauté',
    sub: 'Salons, Boutiques, Instituts',
    roi: '+22 % CA',
    challenges: [
      'Le téléphone sonne en continu pour les réservations pendant que vous êtes les mains dans les cheveux d\'une cliente.',
      'Des clientes réservent et ne viennent pas — le fauteuil reste vide, le temps est perdu, le chiffre s\'envole.',
      'Vos meilleures clientes partent chez la concurrence faute de programme de fidélité attractif.',
      'Les stocks de produits (shampooings, teintures, soins) sont gérés à l\'intuition — manques fréquents en plein service.',
      'Vous ne savez pas quels services rapportent le plus : coiffure, soins, ongles — la comptabilité est approximative.',
      'Les nouvelles clientes cherchent vos tarifs sur WhatsApp et vous ne répondez pas assez vite — elles vont ailleurs.',
    ],
    solutions: [
      'Bot de réservation WhatsApp avec le catalogue de vos services, les photos de vos réalisations et vos disponibilités en temps réel.',
      'Confirmation obligatoire H-24 + caution Mobile Money optionnelle sur les créneaux premium pour éliminer les lapins.',
      'Programme de fidélité IA : l\'IA suit les passages et déclenche des récompenses personnalisées (soin offert, réduction) au bon moment.',
      'Gestion de stock prédictive : l\'IA anticipe les besoins en produits selon le planning des rendez-vous de la semaine.',
      'Analyse de rentabilité par service : temps moyen, produits utilisés, prix — vous savez quel service mettre en avant.',
      'Vitrine WhatsApp automatique : nouvelles réalisations, promotions du mois, disponibilités — diffusées à votre liste de clientes.',
    ],
    gains: ['+22 % de CA en 3 mois', '−50 % de lapins', '+40 % de rétention des clientes', 'Stocks jamais en rupture pendant le service'],
  },
  {
    icon: Tractor,
    label: 'Agriculture',
    sub: 'Producteurs & Exploitants',
    roi: '+32 % revenus',
    challenges: [
      'Vous récoltez au bon moment mais le prix au marché est bas ce jour-là — vous vendez à perte ou stockez sans capacité.',
      'Vous épandez des engrais et des pesticides sans savoir les bonnes doses ni le bon moment — gaspillage et mauvais rendements.',
      'Les intermédiaires (collecteurs) fixent leurs prix et vous n\'avez pas les informations pour négocier.',
      'Les aléas climatiques (pluies tardives à l\'Ouest, sécheresse dans le Nord) ruinent une récolte sur trois.',
      'Les pertes post-récolte (stockage, transport) représentent 20 à 40 % de votre production.',
      'Vous n\'avez aucun accès au crédit formel car vous n\'avez pas d\'historique financier documenté.',
    ],
    solutions: [
      'Alerte de prix en temps réel : l\'IA surveille les marchés de Douala, Bafoussam et Ngaoundéré et vous dit le meilleur moment et endroit pour vendre.',
      'Conseils de fertilisation par WhatsApp : selon votre culture, votre sol et la saison, l\'IA vous dit quoi épandre, quand et en quelle quantité.',
      'Accès aux prix des grossistes et négociants — vous arrivez à la négociation avec les vrais prix du marché en main.',
      'Alertes météo hyper-locales avec recommandations : "pluie dans 3 jours — récoltez le maïs de la parcelle B dès demain".',
      'Mise en relation directe avec des acheteurs (restaurants, hôtels, supérettes) qui paient à la livraison sans intermédiaire.',
      'Journal de bord numérique automatique : chaque vente et achat d\'intrant est enregistré — historique financier pour accéder au crédit.',
    ],
    gains: ['+25 à 40 % de revenu net par récolte', '−30 % de gaspillage d\'intrants', 'Accès direct aux acheteurs', 'Historique financier pour demander un crédit'],
  },
  {
    icon: Landmark,
    label: 'Microfinance',
    sub: 'IMF, Tontines, Assureurs',
    roi: '−30 % risques',
    challenges: [
      'L\'analyse d\'un dossier de crédit prend 3 à 5 jours et repose sur le jugement subjectif d\'un agent — lent et risqué.',
      'Votre taux de défaut dépasse 15 % : certains clients empruntent sans intention de rembourser, difficile à détecter.',
      'Les relances de remboursement sont faites par téléphone une par une — des heures perdues pour un résultat aléatoire.',
      'Les tontines informelles qui vous concurrencent mobilisent l\'argent plus vite et sans paperasse.',
      'Pas d\'application mobile : vos clients déposent et retirent uniquement en agence — contraignant pour eux.',
      'La fraude interne (agents qui approuvent des dossiers bidons) est difficile à détecter avec les processus manuels.',
    ],
    solutions: [
      'Scoring crédit IA en 10 minutes : l\'IA analyse le comportement Mobile Money, l\'historique des remboursements et les données sociales.',
      'Détection des profils à risque élevé avant l\'octroi : l\'IA repère les patterns des mauvais payeurs avant que vous ne leur prêtiez.',
      'Relances automatiques personnalisées par WhatsApp : ton adapté au profil du client, escalade progressive, sans mobiliser un seul agent.',
      'Produits de crédit rapides façon tontine : approbation en 2h via WhatsApp pour les petits montants avec décaissement Mobile Money.',
      'Mini-app WhatsApp pour les clients : consultation du solde, simulation de crédit, demande de remboursement depuis le téléphone.',
      'Audit automatique des décisions : l\'IA signale les dossiers approuvés qui dévient des critères standards — fraude interne détectée.',
    ],
    gains: ['−30 % de taux de défaut', '+50 % de dossiers traités par agent', 'Approbation des petits crédits en 2h', 'Fraude interne détectée automatiquement'],
  },
  {
    icon: ShoppingCart,
    label: 'E-commerce',
    sub: 'Vente en ligne & Marketplaces',
    roi: '+30 % conversion',
    challenges: [
      'Les clients ajoutent des produits au panier et disparaissent — vous ne savez pas pourquoi ni comment les récupérer.',
      'Votre catalogue change souvent mais la mise à jour du site prend du temps — des clients commandent des articles en rupture.',
      'Les livraisons à Douala ou Yaoundé sont un casse-tête : prestataires peu fiables, clients mécontents, remboursements fréquents.',
      'Vous montrez les mêmes produits à tout le monde, qu\'il soit à Garoua ou à Kribi — zéro personnalisation.',
      'Les paiements Mobile Money sont mal intégrés — abandons au moment de payer parce que le process est trop compliqué.',
      'Vous ne savez pas quels produits méritent d\'être mis en avant : promotions au hasard, pas de stratégie basée sur les données.',
    ],
    solutions: [
      'Récupération automatique des paniers abandonnés : 1h après l\'abandon, le client reçoit un WhatsApp avec son panier et une offre pour finir.',
      'Mise à jour de catalogue en temps réel : quand un article est épuisé, l\'IA le masque et propose des alternatives similaires.',
      'Chatbot de suivi de commande sur WhatsApp : le client envoie son numéro, reçoit la position de sa livraison — zéro appel au service client.',
      'Recommandations personnalisées par zone et historique d\'achat : un client de Douala-Akwa voit des produits différents d\'un client de Bafoussam.',
      'Paiement simplifié en un clic via Mobile Money avec confirmation automatique et reçu instantané par WhatsApp.',
      'Analyse des ventes IA : les 20 % de produits qui font 80 % du CA sont identifiés — vous concentrez stocks et promotions sur eux.',
    ],
    gains: ['+30 % de taux de conversion', '−60 % d\'abandon de panier', '+45 % de commandes répétées', 'Support client assuré à 80 % par le bot'],
  },
  {
    icon: Hotel,
    label: 'Hôtellerie',
    sub: 'Hôtels, Lodges, Agences de voyage',
    roi: '+28 % occupation',
    challenges: [
      'Votre taux d\'occupation s\'effondre en basse saison (hors CAN, hors fêtes) sans stratégie pour l\'améliorer.',
      'Vous pratiquez les mêmes prix toute l\'année : pas de pricing dynamique selon la demande, les événements ou la concurrence.',
      'Les réservations viennent principalement par téléphone — vous êtes absent des plateformes de réservation en ligne.',
      'Les clients séjournent une fois et ne reviennent plus : pas de programme de fidélisation, pas de suivi post-séjour.',
      'Le risque de réservations doubles (overbooking) crée des situations embarrassantes avec des clients en attente.',
      'Le restaurant de l\'hôtel est géré séparément — pertes importantes, stocks non maîtrisés, marges floues.',
    ],
    solutions: [
      'Pricing dynamique IA : les tarifs s\'ajustent automatiquement selon le taux d\'occupation, les événements locaux et la concurrence.',
      'Bot de réservation WhatsApp avec disponibilités en temps réel, paiement d\'arrhes par Mobile Money et confirmation automatique.',
      'Intégration aux plateformes (Booking.com, Expedia) synchronisée avec votre calendrier interne — zéro overbooking.',
      'Programme de fidélité automatique : après 3 séjours, le client est upgradé et reçoit des offres personnalisées par WhatsApp.',
      'Enquête de satisfaction automatique à J+1 du départ : les avis positifs sont redirigés vers Google, les négatifs vous remontent.',
      'Gestion restauration intégrée : l\'IA prédit le nombre de petits-déjeuners selon les réservations et optimise les achats.',
    ],
    gains: ['+18 à 35 % de taux d\'occupation', '+20 % de revenu par chambre', '−50 % de réservations perdues', 'Note Google améliorée en 60 jours'],
  },
  {
    icon: HardHat,
    label: 'BTP',
    sub: 'Entreprises de BTP & Promoteurs',
    roi: '−20 % dépassements',
    challenges: [
      'Vos chantiers à Douala ou Yaoundé dépassent presque toujours le budget initial — la cause est identifiée trop tard.',
      'Les matériaux (ciment, fer à béton, carrelage) sont commandés à l\'intuition : trop ou pas assez, gaspillage ou arrêt de chantier.',
      'La coordination des équipes sur plusieurs chantiers se fait par appels téléphoniques — confusion, erreurs, doublons.',
      'Les clients vous demandent où en est leur maison et vous ne pouvez pas répondre sans appeler le chef chantier.',
      'Les factures fournisseurs arrivent en retard, parfois en double, et votre trésorerie de chantier est floue.',
      'Les délais glissent sans que vous le voyiez venir : chaque semaine un petit retard, en fin de projet c\'est un mois de décalage.',
    ],
    solutions: [
      'Budget chantier en temps réel : chaque dépense est saisie sur WhatsApp par le chef chantier avec alerte automatique dès 10 % de dépassement.',
      'Commande de matériaux pilotée par l\'IA : selon l\'avancement réel, l\'IA vous dit quoi commander, en quelle quantité et quand.',
      'Rapport quotidien du chef chantier en vocal ou texte sur WhatsApp — photos horodatées, tout archivé automatiquement.',
      'Portail client via QR code : le client scanne et voit les photos du jour, le taux d\'avancement et la prochaine étape.',
      'Rapprochement automatique des factures fournisseurs avec les bons de commande — doublons et erreurs détectés instantanément.',
      'Planning prédictif : l\'IA détecte les glissements 2 semaines à l\'avance et propose des actions correctives avant que ce soit irréversible.',
    ],
    gains: ['−15 à 25 % de dépassements budget', '−30 % de gaspillage de matériaux', '+40 % de satisfaction client', 'Retards détectés 2 semaines à l\'avance'],
  },
];

const PROCESS = [
  { n: '01', week: 'Semaine 1', title: 'Diagnostic gratuit', price: 'Gratuit', body: 'On analyse votre activité, vos problèmes réels et vos opportunités IA. Vous repartez avec un plan clair et un chiffrage précis — sans engagement.' },
  { n: '02', week: 'Semaines 2–6', title: 'Pilote IA', price: '75 000 – 150 000', body: 'On développe une première version de la solution sur votre cas concret. Vous voyez les résultats réels avant de tout déployer.' },
  { n: '03', week: 'Semaines 7–12', title: 'Déploiement complet', price: '150 000 – 400 000', body: 'Mise en production complète, intégration avec vos outils existants (Mobile Money, WhatsApp, caisse, etc.).' },
  { n: '04', week: 'En continu', title: 'Formation & suivi', price: '15 000 – 30 000 / mois', body: 'Votre équipe est formée et autonome. On reste disponibles pour les ajustements, nouvelles fonctionnalités et suivi des KPIs.' },
];

const PRICING_SECTORS = [
  { sector: 'Commerce & Supérettes', from: '149 000', to: '349 000' },
  { sector: 'Restauration & Maquis', from: '119 000', to: '299 000' },
  { sector: 'Pharmacies', from: '159 000', to: '399 000' },
  { sector: 'Artisans & Services', from: '99 000', to: '249 000' },
  { sector: 'Transport & Logistique', from: '199 000', to: '549 000' },
  { sector: 'Éducation & Écoles', from: '149 000', to: '379 000' },
  { sector: 'Santé & Cliniques', from: '159 000', to: '449 000' },
  { sector: 'Agriculture', from: '119 000', to: '319 000' },
  { sector: 'Immobilier', from: '179 000', to: '479 000' },
  { sector: 'Hôtellerie', from: '229 000', to: '599 000' },
  { sector: 'Microfinance', from: '249 000', to: '699 000' },
  { sector: 'BTP & Construction', from: '299 000', to: '749 000' },
];

const REALIZATIONS = [
  {
    tag: 'Commerce de détail',
    title: 'Supérette Bonamoussadi',
    result: '-42 % de pertes stocks en 8 semaines',
    body: 'Mise en place d\'un système de gestion IA des stocks avec alertes WhatsApp automatiques. La supérette a éliminé les ruptures sur les 20 produits phares et réduit le gaspillage de 42 %.',
  },
  {
    tag: 'Agroalimentaire',
    title: 'Unité de transformation de manioc — Bafoussam',
    result: '+2,8 millions FCFA/mois',
    body: 'Système de prédiction des prix du marché et d\'optimisation de la production. L\'entreprise sait maintenant exactement combien produire chaque semaine et à quel moment vendre.',
  },
];

/* ─── SectorsPanel ───────────────────────────────────── */
/* ─── SectorsPanel ───────────────────────────────────── */
function SectorsPanel() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sector = SECTORS[active];
  const Icon = sector.icon;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section id="secteurs" style={{ padding: 'clamp(48px, 8vw, 96px) 24px', background: '#FAFAFA', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* header */}
        <div style={{ maxWidth: 640, marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>
            15 secteurs accompagnés
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
            Comment pouvons-nous{' '}
            <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              vous aider ?
            </span>
          </h2>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginTop: 12 }}>
            Sélectionnez votre secteur pour voir comment on résout vos problèmes avec l'IA.
          </p>
        </div>

        {/* chips - visible on all, useful for quick selection */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {SECTORS.map((s, i) => {
            const SIcon = s.icon;
            const isActive = i === active;
            return (
              <button
                key={s.label}
                onClick={() => setActive(i)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: isActive ? '#7967FF' : '#fff',
                  border: `1.5px solid ${isActive ? '#7967FF' : '#EDEAFF'}`,
                  borderRadius: 99, padding: '7px 14px',
                  fontSize: 13, fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#fff' : '#555',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.borderColor = '#C4BCFF'; (e.currentTarget as HTMLElement).style.color = '#7967FF'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.borderColor = '#EDEAFF'; (e.currentTarget as HTMLElement).style.color = '#555'; } }}
              >
                <SIcon size={13} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '240px 1fr',
          background: '#fff', borderRadius: 20,
          border: '1.5px solid #EDEAFF', overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(121,103,255,0.07)',
          alignItems: 'stretch',
          minHeight: 600,
        }}>

          {/* LEFT — Hidden on very small screens, or we can make it a dropdown/tabs */}
          {!isMobile && (
            <div style={{ borderRight: '1.5px solid #EDEAFF', padding: '8px 0', overflowY: 'auto' }}>
              {SECTORS.map((s, i) => {
                const SIcon = s.icon;
                const isActive = i === active;
                return (
                  <button
                    key={s.label}
                    onClick={() => setActive(i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '13px 18px',
                      background: isActive ? '#F0EEFF' : 'transparent',
                      border: 'none', borderBottom: '1px solid #F4F2FF',
                      cursor: 'pointer', transition: 'background 0.15s',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ width: 3, height: 18, borderRadius: 99, background: isActive ? '#7967FF' : 'transparent', flexShrink: 0, transition: 'background 0.15s' }} />
                    <SIcon size={14} color={isActive ? '#7967FF' : '#aaa'} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? '#7967FF' : '#444', lineHeight: 1.3 }}>{s.label}</p>
                      <p style={{ fontSize: 10, color: isActive ? '#A78BFA' : '#bbb', marginTop: 2, fontWeight: 600 }}>{s.roi}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* RIGHT — détail secteur */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: isMobile ? 0 : 16, y: isMobile ? 12 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: isMobile ? 0 : -8, y: isMobile ? -8 : 0 }}
              transition={{ duration: 0.22 }}
              style={{ padding: 'clamp(24px, 5vw, 44px)' }}
            >
              {/* title row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ width: 48, height: 48, background: '#F0EEFF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color="#7967FF" />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 22, color: '#111', lineHeight: 1.2 }}>{sector.label}</h3>
                  <p style={{ fontSize: 13, color: '#999', marginTop: 3 }}>{sector.sub}</p>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F0EEFF', borderRadius: 99, padding: '6px 14px',
                  fontSize: 12, fontWeight: 700, color: '#7967FF', whiteSpace: 'nowrap',
                }}>
                  <TrendingUp size={12} /> {sector.roi}
                </div>
              </div>

              <div style={{ height: 1, background: '#EDEAFF', marginBottom: 24 }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, marginBottom: 24 }}>
                {/* défis */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Vos problèmes au quotidien</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sector.challenges.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ width: 18, height: 18, minWidth: 18, borderRadius: '50%', background: '#FFF0F0', border: '1px solid #FFD6D6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F87171' }} />
                        </span>
                        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{c}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* solutions */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7967FF', marginBottom: 12 }}>Ce que l'IA met en place</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sector.solutions.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ width: 18, height: 18, minWidth: 18, borderRadius: '50%', background: '#F0EEFF', border: '1px solid #C4BCFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7967FF' }} />
                        </span>
                        <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* gains */}
              <div style={{ height: 1, background: '#EDEAFF', marginBottom: 20 }} />
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', marginBottom: 12 }}>Résultats observés chez nos clients</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                {sector.gains.map(g => (
                  <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={15} color="#7967FF" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{g}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#7967FF', color: '#fff',
                  padding: '12px 22px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}
              >
                Obtenir un diagnostic gratuit <ArrowRight size={13} />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─── page ───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main className="bg-white text-[#111]" style={{ fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

      {/* ══ HERO ═════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 'min(800px, 100vw)', height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(121,103,255,0.09) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 860, margin: '0 auto',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(40px, 10vh, 80px) 24px',
          textAlign: 'center',
        }}>
          <motion.h1
            {...up(0)}
            style={{
              fontFamily: 'Clash Display, sans-serif',
              fontSize: 'clamp(2.4rem, 8vw, 5.5rem)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: '#111',
              margin: '0 auto',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            L'Intelligence Artificielle{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7967FF, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              au service de votre PME
            </span>
          </motion.h1>

          <motion.p
            {...up(0.1)}
            style={{ maxWidth: 640, marginTop: 28, fontSize: 'clamp(16px, 4vw, 18px)', lineHeight: 1.75, color: '#555', margin: '28px auto 0' }}
          >
            Nous transformons vos problèmes quotidiens en solutions simples, rentables et intelligentes pour les PME au <strong style={{ color: '#111' }}>Cameroun</strong> et en <strong style={{ color: '#111' }}>Afrique Francophone</strong>.
          </motion.p>

          <motion.div
            {...up(0.15)}
            style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <a
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#7967FF', color: '#fff',
                padding: '14px 28px', borderRadius: 8,
                fontSize: 15, fontWeight: 600,
                boxShadow: '0 4px 20px rgba(121,103,255,0.3)',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}
            >
              Obtenir un diagnostic IA gratuit <ArrowRight size={16} />
            </a>
            <a
              href="#secteurs"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '1.5px solid #E0DEFF', color: '#555',
                padding: '14px 28px', borderRadius: 8,
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7967FF'; e.currentTarget.style.color = '#7967FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E0DEFF'; e.currentTarget.style.color = '#555'; }}
            >
              Voir mon secteur
            </a>
          </motion.div>

          {/* social proof */}
          <motion.div
            {...up(0.2)}
            style={{
              display: 'flex', gap: 8, alignItems: 'center', marginTop: 48,
              background: '#FAFAFA', border: '1.5px solid #EDEAFF',
              borderRadius: 99, padding: '10px 20px',
              fontSize: 13, color: '#666',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex' }}>
              {['#7967FF', '#A78BFA', '#C4BCFF', '#6654F0'].map((c, i) => (
                <div key={c} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: c, border: '2px solid #fff',
                  marginLeft: i === 0 ? 0 : -8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#fff', fontWeight: 700,
                }}>
                  {['A', 'K', 'M', 'F'][i]}
                </div>
              ))}
            </div>
            <span><strong style={{ color: '#111' }}>35+ PME</strong> au Cameroun font confiance à Ozirus</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#7967FF" color="#7967FF" />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════ */}
      <div style={{ borderTop: '1.5px solid #F0EEFF', borderBottom: '1.5px solid #F0EEFF', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', padding: '0 24px' }}>
          {STATS.map(({ v, l }, i) => (
            <div key={v} style={{ padding: '44px 24px', textAlign: 'center', borderRight: i < STATS.length - 1 ? '1px solid #E8E6FF' : 'none' }}>
              <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(32px, 5vw, 44px)', color: '#7967FF' }}>{v}</p>
              <p style={{ fontSize: 14, color: '#777', marginTop: 6, lineHeight: 1.5 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ POURQUOI OZIRUS ══════════════════════════════ */}
      <section id="pourquoi" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>
              Pourquoi choisir Ozirus Agency ?
            </p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Nous ne vendons pas de la technologie.{' '}
              <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Nous créons des résultats.
              </span>
            </h2>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, marginTop: 16 }}>
              Des solutions concrètes, accessibles et rentables, spécialement conçues pour les réalités des PME camerounaises.
            </p>
          </div>

          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', display: 'grid', gap: 16 }}>
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div
                  key={w.title}
                  {...upView(i * 0.07)}
                  style={{
                    background: '#fff', border: '1.5px solid #EDEAFF',
                    borderRadius: 16, padding: 28,
                    boxShadow: '0 2px 8px rgba(121,103,255,0.04)',
                  }}
                >
                  <div style={{ width: 44, height: 44, background: '#F0EEFF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#7967FF" />
                  </div>
                  <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 16, color: '#111', marginTop: 20 }}>{w.title}</p>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, marginTop: 8 }}>{w.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ NOS EXPERTISES IA ════════════════════════════ */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div
            {...upView()}
            style={{
              background: 'linear-gradient(135deg, #7967FF 0%, #6654F0 100%)',
              borderRadius: 24, padding: 'clamp(36px, 5vw, 64px)',
            }}
          >
            <div style={{ maxWidth: 560, marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
                Notre expertise
              </p>
              <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', lineHeight: 1.1, color: '#fff' }}>
                L'Intelligence Artificielle concrète, pensée pour vous.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginTop: 12 }}>
                Des solutions IA qui fonctionnent dans votre réalité — avec Mobile Money, WhatsApp, et même sans connexion stable.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { title: 'Chatbots & Agents WhatsApp', body: 'Répondent à vos clients 24h/24, prennent les commandes et gèrent les paiements Mobile Money.' },
                { title: 'Prédiction & Analyse IA', body: 'Stocks, ventes, prix du marché, risques — l\'IA prédit pour que vous agissiez au bon moment.' },
                { title: 'Automatisation des process', body: 'Facturation, relances, planning, reporting — vos tâches répétitives disparaissent.' },
                { title: 'Tableaux de bord intelligents', body: 'Vos KPIs en temps réel, accessibles depuis votre téléphone, sans formation technique.' },
              ].map(({ title, body }) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: 24, backdropFilter: 'blur(4px)' }}>
                  <CheckCircle2 size={16} color="rgba(255,255,255,0.7)" />
                  <p style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginTop: 14 }}>{title}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginTop: 6 }}>{body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ SECTEURS — panel interactif ══════════════════ */}
      <SectorsPanel />

      {/* ══ RÉALISATIONS ═════════════════════════════════ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>
              Réalisations
            </p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Des résultats concrets, pas des promesses.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {REALIZATIONS.map((r, i) => (
              <motion.div
                key={r.title}
                {...upView(i * 0.1)}
                style={{
                  background: '#fff', border: '1.5px solid #EDEAFF',
                  borderRadius: 20, padding: 32,
                  boxShadow: '0 2px 12px rgba(121,103,255,0.06)',
                }}
              >
                <span style={{
                  display: 'inline-block', background: '#F0EEFF',
                  borderRadius: 99, padding: '4px 12px',
                  fontSize: 11, fontWeight: 700, color: '#7967FF', marginBottom: 20,
                }}>
                  {r.tag}
                </span>
                <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 18, color: '#111' }}>{r.title}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#F0EEFF', borderRadius: 10, padding: '10px 16px',
                  marginTop: 16,
                }}>
                  <TrendingUp size={16} color="#7967FF" />
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#7967FF' }}>{r.result}</p>
                </div>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginTop: 16 }}>{r.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESSUS ════════════════════════════════════ */}
      <section id="processus" style={{ padding: '96px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 56px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>
              Notre processus
            </p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              De A à Z.{' '}
              <span style={{ background: 'linear-gradient(135deg, #7967FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                En 90 jours.
              </span>
            </h2>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, marginTop: 16 }}>
              Diagnostic gratuit, pilote rapide, déploiement complet et formation de votre équipe. Vous repartez autonome et propriétaire de tout.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {PROCESS.map((s, i) => (
              <motion.div
                key={s.n}
                {...upView(i * 0.08)}
                style={{
                  background: '#fff', border: '1.5px solid #EDEAFF',
                  borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: '#7967FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.n}</span>
                  </div>
                  <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 32, color: '#EDEAFF' }}>{s.n}</span>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7967FF', marginTop: 20 }}>{s.week}</p>
                <p style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 16, color: '#111', marginTop: 6 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65, marginTop: 8, flex: 1 }}>{s.body}</p>
                <div style={{
                  marginTop: 20, paddingTop: 16, borderTop: '1px solid #F0EEFF',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.price === 'Gratuit' ? '#22c55e' : '#7967FF' }}>
                    {s.price === 'Gratuit' ? '✓ Gratuit' : `${s.price} FCFA`}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ TARIFS PAR SECTEUR ═══════════════════════════ */}
      <section id="tarifs" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, margin: '0 auto 48px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 12 }}>
              Tarifs par secteur
            </p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#111' }}>
              Des prix adaptés à la réalité camerounaise.
            </h2>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginTop: 14 }}>
              Fourchette pour un déploiement complet (pilote + production + formation). Chaque projet est chiffré précisément après le diagnostic gratuit.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {PRICING_SECTORS.map((p, i) => (
              <motion.div
                key={p.sector}
                {...upView(Math.floor(i / 3) * 0.06)}
                style={{
                  background: '#fff', border: '1.5px solid #EDEAFF',
                  borderRadius: 14, padding: '18px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{p.sector}</p>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#7967FF', whiteSpace: 'nowrap' }}>
                    {p.from} – {p.to}
                  </p>
                  <p style={{ fontSize: 10, color: '#bbb', fontWeight: 600 }}>FCFA</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...upView(0.15)}
            style={{ marginTop: 32, textAlign: 'center' }}
          >
            <a
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#7967FF', color: '#fff',
                padding: '14px 28px', borderRadius: 8,
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(121,103,255,0.25)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}
            >
              Obtenir mon chiffrage précis — gratuit <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ TRUST ════════════════════════════════════════ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.div
            {...upView()}
            style={{
              background: 'linear-gradient(135deg, #7967FF 0%, #6654F0 100%)',
              borderRadius: 24, padding: 'clamp(40px, 6vw, 72px)', textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
              Pourquoi travailler avec nous
            </p>
            <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1, color: '#fff', maxWidth: 620, margin: '0 auto' }}>
              Nous comprenons vos défis. Électricité, connexion, budget, ressources limitées.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, maxWidth: 540, margin: '16px auto 0' }}>
              On travaille en français, on pense local (Mobile Money, WhatsApp, pidgin) et on livre des solutions qui fonctionnent vraiment dans votre contexte.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 44, textAlign: 'left' }}>
              {[
                { icon: Users, t: '35+ PME accompagnées', b: 'Cameroun et Afrique subsaharienne, tous secteurs confondus.' },
                { icon: TrendingUp, t: 'ROI moyen de 280 %', b: 'Sur 6 mois, mesuré sur nos projets déployés en production.' },
                { icon: RefreshCw, t: '92 % de renouvellement', b: 'Nos clients continuent parce que les résultats sont là.' },
                { icon: Clock, t: '90 jours max', b: 'De la première conversation au produit opérationnel.' },
              ].map(({ icon: Icon, t, b }) => (
                <div key={t} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 22 }}>
                  <Icon size={18} color="rgba(255,255,255,0.7)" />
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginTop: 12 }}>{t}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginTop: 6 }}>{b}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ CONTACT / CTA FINAL ══════════════════════════ */}
      <section id="contact" style={{ padding: '96px 24px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7967FF', marginBottom: 16 }}>
            Démarrons ensemble
          </p>
          <h2 style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 600, fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#111' }}>
            Prêt à transformer votre entreprise avec l'IA ?
          </h2>
          <p style={{ fontSize: 17, color: '#666', lineHeight: 1.7, marginTop: 20, maxWidth: 540, margin: '20px auto 0' }}>
            Obtenez votre diagnostic IA gratuit. On analyse votre activité, on identifie les opportunités et on vous propose un plan clair — sans engagement.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:info.ozirus@gmail.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#7967FF', color: '#fff',
                padding: '14px 28px', borderRadius: 8,
                fontSize: 15, fontWeight: 600,
                boxShadow: '0 4px 20px rgba(121,103,255,0.25)',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6654F0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7967FF')}
            >
              Obtenir mon diagnostic gratuit <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/237694086571?text=Bonjour%20Ozirus%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20digital%20pour%20mon%20entreprise."
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '1.5px solid #25D366', color: '#25D366',
                padding: '14px 28px', borderRadius: 8,
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366'; }}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>

          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              'Diagnostic 100 % gratuit',
              'Réponse sous 24h',
              'Sans engagement',
            ].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666' }}>
                <CheckCircle2 size={14} color="#7967FF" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════ */}
      <footer style={{ borderTop: '1.5px solid #F0EEFF', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Ozirus" style={{ height: 24, opacity: 0.5 }} />
            <span style={{ fontSize: 13, color: '#aaa' }}>© {new Date().getFullYear()} Ozirus Agency — Cameroun</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/terms" style={{ fontSize: 13, color: '#aaa', textDecoration: 'none' }}>Conditions</Link>
            <Link href="/privacy" style={{ fontSize: 13, color: '#aaa', textDecoration: 'none' }}>Confidentialité</Link>
            <a href="mailto:info.ozirus@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#aaa', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7967FF')}
              onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}>
              <Phone size={13} /> info.ozirus@gmail.com
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
