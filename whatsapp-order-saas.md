# Micro-SaaS — Plateforme de Gestion Restaurant (Commande, Stock, Fidélisation) via WhatsApp

> Todo prête à importer dans **GitHub Projects** (colonnes suggérées : `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`).
> Convention : chaque `##` = une Epic (à créer comme *Milestone* ou *Label*), chaque case = une *Issue*.

## Positionnement produit

- **Cible** : restaurants moyen/haut de gamme, lancement au **Cameroun**, expansion Afrique ensuite.
- **Canal de commande client** : catalogue **WhatsApp Business** (natif) et/ou **mini-site** généré automatiquement (sous-domaine `resto.tonapp.com`) pour les restaurants qui le souhaitent.
- **Paiement** : **NotchPay**, paiement **direct au restaurant** (compte/sous-compte NotchPay propre à chaque resto — le SaaS ne touche pas les fonds, pas de reversement à gérer).
- **Au-delà de la commande**, le produit devient un outil de gestion complet pour le patron :
  - Fidélisation client & relance marketing (data capturée à la commande)
  - Gestion de stock avec alertes automatiques
  - Suppression des factures papier → facturation digitale + compta
  - Agent IA : alertes météo (impact sur affluence/appro), détection d'écarts de consommation suspects en cuisine, prédiction de rupture de stock
- **Modèle économique** : abonnement SaaS mensuel par restaurant (le SaaS ne prélève pas de commission sur les paiements, NotchPay allant directement au resto).

**Stack recommandée** : Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, WhatsApp Business Cloud API (Meta), NotchPay API, Firestore ou Postgres (Neon/Supabase), Vercel. Agent IA via un LLM (function calling / tool use) branché sur les données stock/ventes/météo.

---

## 0. Cadrage & Setup projet

- [ ] Valider le persona précis (type de restaurant moyen/haut de gamme visé : gastronomique, brunch, lounge, etc.) et 2-3 villes cibles au Cameroun (Douala, Yaoundé...)
- [ ] Cartographier le parcours complet : découverte → commande (WhatsApp ou mini-site) → paiement NotchPay → cuisine → livraison/service → fidélisation post-commande
- [ ] Définir les plans d'abonnement SaaS (ex: Starter / Pro / Business) et ce que chaque plan débloque (stock, IA, mini-site, multi-staff...)
- [ ] Créer le repo GitHub + structure Next.js (App Router, TS, Tailwind, shadcn/ui)
- [ ] Configurer ESLint/Prettier + CI (lint + typecheck + build)
- [ ] Créer le GitHub Project avec colonnes Kanban et labels par epic (`epic:whatsapp`, `epic:minisite`, `epic:commande`, `epic:paiement`, `epic:stock`, `epic:fidelisation`, `epic:compta`, `epic:ia`, `epic:dashboard`, `bug`, `chore`)
- [ ] Provisionner la base de données (Firestore ou Postgres) et modéliser les entités principales (`Restaurant`, `Menu`, `Order`, `Customer`, `StockItem`, `StaffAction`, `Conversation`)
- [ ] Configurer les environnements dev / preview / prod (Vercel)

---

## 1. Intégration WhatsApp Business (fondations)

- [ ] Créer un compte Meta Business + WhatsApp Business Platform
- [ ] Configurer un numéro WhatsApp Business par restaurant (ou numéro mutualisé multi-tenant avec routage)
- [ ] Obtenir et sécuriser les tokens API (System User token permanent) par restaurant
- [ ] Implémenter le webhook entrant (`app/api/whatsapp/webhook/route.ts`) avec vérification de signature Meta, réponse < 5s
- [ ] Implémenter l'envoi de messages sortants (texte, boutons, listes)
- [ ] Configurer et soumettre les **templates WhatsApp** à validation Meta (confirmation commande, alerte stock, relance client, alerte météo patron)
- [ ] Implémenter le **catalogue produit WhatsApp** (WhatsApp Business Catalog / Commerce API) synchronisé avec le menu du dashboard
- [ ] Support des messages interactifs (boutons, listes, réponses rapides) pour naviguer le catalogue
- [ ] Support des médias (photos plats, PDF menu)
- [ ] Gestion de session/conversation persistante par numéro client, liée au restaurant concerné (multi-tenant)
- [ ] Gestion des erreurs API (rate limit, token expiré, numéro invalide) avec retry/backoff
- [ ] Logs structurés de tous les messages entrants/sortants (traçabilité + support)

---

## 2. Mini-site par restaurant (optionnel, activable)

- [ ] Génération automatique d'un mini-site (`resto-slug.tonapp.com`) à partir des données du dashboard (menu, horaires, branding, logo)
- [ ] Template de mini-site responsive (vitrine + catalogue commandable + bouton "Commander sur WhatsApp" ou panier intégré)
- [ ] Système de thème/branding léger (couleur principale, logo, cover photo) configurable depuis le dashboard
- [ ] Génération de sous-domaine automatique à l'activation (wildcard DNS + SSL automatique)
- [ ] Option ON/OFF du mini-site dans les paramètres restaurant
- [ ] SEO de base (title, meta description, structured data restaurant/menu) pour visibilité Google

---

## 3. Onboarding restaurateur

- [ ] Page d'inscription (nom resto, adresse, ville, horaires, numéro WhatsApp business)
- [ ] Authentification (email/password + Google) via Firebase Auth / NextAuth
- [ ] Wizard de configuration initiale (étapes guidées : menu → stock initial → paiement → WhatsApp → mini-site)
- [ ] Formulaire de création du menu (catégories, plats, prix, options, suppléments, allergènes)
- [ ] Upload photos des plats (Firebase Storage / Vercel Blob)
- [ ] Configuration des zones/frais de livraison et/ou service sur place
- [ ] Configuration des horaires d'ouverture / fermeture / jours fériés
- [ ] Connexion du compte **NotchPay** du restaurant (OAuth/API key) pour encaissement direct
- [ ] Génération du lien WhatsApp "Commander" (wa.me + message pré-rempli) + QR code téléchargeable pour la salle/vitrine
- [ ] Import initial du stock (matières premières + quantités + seuils d'alerte)

---

## 4. Tunnel de commande (WhatsApp catalogue + mini-site)

- [ ] Concevoir l'arbre de conversation WhatsApp : accueil → catalogue → sélection → panier → mode de service → paiement → confirmation
- [ ] Message de bienvenue + présentation du catalogue (liste interactive par catégorie)
- [ ] Ajout au panier + gestion des quantités et options/suppléments
- [ ] Récapitulatif de panier modifiable (ajout/suppression) côté WhatsApp et mini-site
- [ ] Choix du mode (sur place / à emporter / livraison) + collecte adresse ou position (partage de localisation WhatsApp)
- [ ] Calcul automatique du total (plats + livraison + taxes)
- [ ] Génération d'un **lien de paiement NotchPay** envoyé dans le chat ou intégré au checkout du mini-site
- [ ] Webhook de confirmation de paiement NotchPay → mise à jour statut commande en temps réel
- [ ] Message de confirmation avec récapitulatif + numéro de commande, une fois le paiement confirmé
- [ ] Notification instantanée au restaurateur (dashboard + son + WhatsApp) dès nouvelle commande payée
- [ ] Gestion des cas d'erreur/paiement échoué (relance automatique du lien de paiement)
- [ ] Fallback humain si le bot ne comprend pas la demande
- [ ] "Recommander la même chose" pour les clients fidèles (accélère la conversion)

---

## 5. Suivi de commande & statuts

- [ ] Modéliser les statuts (Reçue → Payée → En préparation → Prête/En livraison → Servie/Livrée → Annulée)
- [ ] Notifications WhatsApp automatiques au client à chaque changement de statut
- [ ] Interface dashboard pour changer le statut (drag & drop ou boutons rapides)
- [ ] Vue "cuisine" simplifiée style KDS (Kitchen Display System) sur tablette
- [ ] Gestion des annulations avec motif et remboursement NotchPay si applicable
- [ ] Estimation et communication du temps de préparation/livraison au client

---

## 6. Gestion de stock & prévention

- [ ] Modèle de données stock (ingrédients/matières premières liés aux recettes de chaque plat)
- [ ] Décrément automatique du stock à chaque commande validée (basé sur les recettes)
- [ ] Configuration des seuils d'alerte par ingrédient
- [ ] **Alertes automatiques de rupture/stock bas** envoyées au patron (WhatsApp + dashboard)
- [ ] Historique des mouvements de stock (entrées, sorties, ajustements manuels)
- [ ] Interface de réception de livraison fournisseur (mise à jour stock en masse)
- [ ] Rapprochement stock théorique vs stock réel (inventaire périodique)
- [ ] **Détection d'écarts de consommation suspects** (ex : sorties de stock anormales sans commande correspondante) avec alerte au patron
- [ ] Suggestions de réapprovisionnement basées sur la vélocité de vente

---

## 7. Fidélisation client & marketing

- [ ] Fiche client enrichie (historique commandes, panier moyen, fréquence, plats préférés)
- [ ] Segmentation automatique des clients (nouveaux, réguliers, inactifs/à risque de churn)
- [ ] Campagnes de relance WhatsApp automatisées (client inactif depuis X jours, anniversaire, offre ciblée)
- [ ] Programme de fidélité configurable (points, paliers, récompenses) suivi par client
- [ ] Envoi de promotions/nouveautés menu via template WhatsApp (opt-in obligatoire)
- [ ] Demande d'avis/note automatique après commande livrée
- [ ] Tableau de bord fidélisation (taux de rétention, valeur vie client, taux de réachat)

---

## 8. Facturation digitale & comptabilité

- [ ] Génération automatique de factures digitales (PDF) à chaque commande, envoyées au client par WhatsApp/email
- [ ] Suppression du processus papier : archivage digital de toutes les factures/tickets
- [ ] Export comptable (CSV/Excel) compatible avec les outils courants des comptables locaux
- [ ] Rapport de caisse journalier automatique (CA, moyens de paiement, nombre de commandes)
- [ ] Gestion de la TVA/taxes locales applicables au Cameroun
- [ ] Réconciliation automatique des paiements NotchPay avec les commandes (statut payé/en attente/échoué)

---

## 9. Agent IA (V1 — inclus dès le lancement)

- [ ] Définir l'architecture de l'agent (LLM + tool calling sur les données restaurant : stock, ventes, météo, historique staff)
- [ ] Intégration d'une **API météo** et corrélation avec l'affluence historique (ex: alerte "pluie prévue demain, baisse d'affluence probable, ajuster les commandes fournisseurs")
- [ ] Agent d'**alerte stock prédictive** (anticiper la rupture avant le seuil, en tenant compte de la saisonnalité/évènements)
- [ ] Agent de **détection de consommation suspecte en cuisine** (écarts entre sorties de stock déclarées et ventes réelles, patterns inhabituels par employé/service)
- [ ] Génération automatique de résumés quotidiens/hebdomadaires pour le patron (WhatsApp ou dashboard) : "aujourd'hui il s'est passé X, attention à Y"
- [ ] Agent de recommandation marketing (quels clients relancer, quelle offre pousser cette semaine)
- [ ] Interface de configuration des seuils de confiance / sensibilité des alertes IA (éviter le bruit)
- [ ] Garde-fous : toute alerte IA sensible (accusation de vol/écart suspect) doit être formulée factuellement, sans accusation directe, avec les données brutes à l'appui
- [ ] **Upsell IA en temps réel dans la conversation** : suggestion de plat/boisson complémentaire pendant la commande, basée sur l'heure, la météo, l'historique du client et les ventes du jour (augmente le panier moyen sans effort humain)
- [ ] **Suggestion d'achat fournisseur automatique** : liste de commande fournisseur prête à envoyer, générée en croisant historique de ventes, météo et événements locaux (jours fériés, matchs, etc.)
- [ ] **"Revenue Leak Detector"** : rapport hebdomadaire chiffré des pertes évitables (ruptures de stock sur best-sellers, clients réguliers inactifs, etc.) formulé en FCFA perdus — argument de vente choc pour la démo
- [ ] **Checklist de clôture de service par photo** : comptage stock en fin de shift envoyé via WhatsApp, alimente l'IA en données fraîches et responsabilise l'équipe sans accusation frontale

---

## 10. Paiements NotchPay & facturation SaaS

- [ ] Intégration API NotchPay : création de lien de paiement, webhook de confirmation
- [ ] Connexion du compte/sous-compte NotchPay propre à chaque restaurant (paiement direct, pas de fonds transitant par le SaaS)
- [ ] Gestion des paiements Mobile Money (Orange Money, MTN MoMo) via NotchPay
- [ ] Gestion des échecs de paiement + relance automatique du lien
- [ ] Abonnement SaaS des restaurateurs (facturation récurrente séparée, via NotchPay ou Stripe selon disponibilité)
- [ ] Page facturation/abonnement dans le dashboard restaurateur (plan actuel, historique factures SaaS)
- [ ] Essai gratuit configurable + gestion de l'expiration/downgrade

---

## 11. Dashboard de visualisation (restaurateur)

- [ ] Accueil dashboard : vue du jour (commandes, CA, alertes stock/IA en attente)
- [ ] Liste des commandes temps réel avec filtres (statut, date, canal WhatsApp/mini-site)
- [ ] Détail commande (client, articles, montant, historique conversation WhatsApp, statut paiement NotchPay)
- [ ] Vue cuisine/KDS
- [ ] Gestion du menu (CRUD plats, catégories, prix, disponibilité, liaison recettes ↔ stock)
- [ ] Statistiques de vente (CA par période, plats les plus vendus, heures de pointe)
- [ ] Graphiques (courbes CA, répartition catégories, taux de conversion tunnel, taux de rétention client)
- [ ] Vue stock (niveaux actuels, alertes actives, historique mouvements)
- [ ] Vue fidélisation (segments clients, campagnes actives, résultats)
- [ ] Centre d'alertes unifié (stock, météo, IA anomalies) avec statut lu/traité
- [ ] Export des données (CSV/PDF) pour comptabilité
- [ ] Gestion multi-utilisateurs (rôles : propriétaire, manager, staff cuisine, staff livraison) avec permissions
- [ ] Paramètres du compte (infos resto, horaires, zones, NotchPay, WhatsApp, mini-site)
- [ ] Notifications in-app + son pour nouvelle commande/alerte critique

---

## 12. Administration plateforme (côté opérateur SaaS)

- [ ] Dashboard admin global (liste restaurants clients, statut d'activation, plan d'abonnement)
- [ ] Monitoring santé des intégrations (tokens WhatsApp expirés, webhooks NotchPay en échec, agent IA en erreur)
- [ ] Métriques business globales (MRR, churn, nombre de commandes traitées plateforme, adoption IA/mini-site)
- [ ] Outils de support (impersonation, logs de conversation pour debug)
- [ ] Suivi du statut d'approbation des templates WhatsApp par restaurant

---

## 13. Qualité, sécurité & conformité

- [ ] Validation stricte des inputs (Zod) sur tous les endpoints API
- [ ] Sécurisation des webhooks (WhatsApp signature + NotchPay signature)
- [ ] Consentement opt-in explicite pour messages marketing WhatsApp (conformité Meta + bonnes pratiques)
- [ ] Chiffrement des données sensibles (tokens API, clés NotchPay, données stock/staff)
- [ ] Contrôle d'accès strict par rôle (un staff cuisine ne voit pas les données financières globales)
- [ ] Tests unitaires sur le tunnel de commande et le moteur de décrément de stock
- [ ] Tests d'intégration webhook WhatsApp + NotchPay (mocks)
- [ ] Gestion des rate limits Meta (throttling envois en masse pour campagnes marketing)
- [ ] Politique de sauvegarde de la base de données
- [ ] Revue éthique/légale de l'usage IA pour détection d'anomalies staff (droit du travail camerounais)

---

## 14. Lancement & itération

- [ ] Programme pilote avec 2-3 restaurants moyen/haut de gamme à Douala ou Yaoundé
- [ ] Collecte de feedback structuré (formulaire + entretiens patrons et staff)
- [ ] Landing page de présentation (pitch, démo, pricing, cible Cameroun)
- [ ] Documentation d'onboarding (guide PDF/vidéo, en français)
- [ ] Support client dédié (WhatsApp support + email)
- [ ] Roadmap V2 (expansion autres pays Afrique, intégration livreurs tiers, multi-langue, marketplace inter-restaurants)

---

## Notes d'implémentation

- Le webhook WhatsApp doit répondre en < 5s à Meta (accusé de réception rapide, traitement métier en asynchrone).
- Modèle de données central dès le départ : `Restaurant → Menu/Recipe → StockItem → Order → Customer → Conversation`, pour que le décrément de stock et les insights IA branchent proprement dessus.
- Les templates WhatsApp doivent être soumis et approuvés par Meta **avant** le lancement (délai de validation à anticiper).
- NotchPay : vérifier les modalités exactes de compte/sous-compte par restaurant (KYC par resto) et le format des webhooks avant de démarrer l'epic paiement.
- Séparer clairement le "moteur de conversation" (état de la commande en cours) du reste de l'app pour le tester isolément.
- L'agent IA doit rester un assistant d'aide à la décision, jamais une autorité automatique (pas de sanction auto sur détection d'anomalie staff).
