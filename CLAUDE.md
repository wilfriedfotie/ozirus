# Ozirus — Notes pour Claude Code

Site Next.js (App Router) de l'agence Ozirus + backoffice `/admin`.

## Commandes

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — build prod (Turbopack)
- `pnpm start` — serveur prod

## Landings sur sous-domaine

`lib/subdomains.ts` (`SUBDOMAIN_ROUTES`) est la source unique : `mvp.ozirus.agency` → `/mvp`,
`formation.ozirus.agency` → `/formation-ia`, `resto.ozirus.agency` → `/resto`. `next.config.ts` en génère les rewrites (seul `/`
est réécrit). Sur un sous-domaine, un lien relatif vers `/` resservirait la landing : les liens
vers le site principal passent par `useMainSiteHref()` (`lib/useMainSiteHref.ts`). Chaque
landing a son propre header autonome (ancres de la page + CTA, aucun lien vers le reste du site) :
`SharedNav` se masque pour ces routes, détectées via `useSelectedLayoutSegment` (la route rendue),
pas via `pathname` (qui vaut `/` sur le sous-domaine). Ajouter un sous-domaine = une entrée dans `SUBDOMAIN_ROUTES` + le
domaine dans Vercel (Settings → Domains). Test local : `http://<sub>.localhost:<port>/`.

`/resto` est la landing reprise du projet `whatsapp-resto-saas` (classes Tailwind, pas de styles
inline comme `/mvp`). Le reset `* { margin:0; padding:0 }` de `globals.css` est hors `@layer` et
écrase les utilitaires Tailwind (`mx-auto`, `px-6`…) : la page est enveloppée dans `.resto-landing`,
exclue de ce reset. Ses CTA « essai gratuit » ouvrent WhatsApp (l'onboarding vit dans l'autre projet).

## Styles de formulaire (`lib/adminUi.ts`)

`inputStyle`, `labelStyle`, `tabBtn`, `segmented`, `primaryBtnStyle`, `sectionTitle` : copie conforme des
styles du backoffice (`app/admin/page.tsx`). Tout nouveau formulaire (admin ou public) les importe au lieu
d'inventer un style ; une page d'une autre couleur ne surcharge que l'accent (cf. modale de
`app/formation-ia/page.tsx`, en rouge).

Listes déroulantes : `components/forms/Select.tsx` (jamais de `<select>` natif). Déclencheur au style
`inputStyle`, liste en portal (pas rognée par une modale), clavier complet, prop `accent`.

Police : DM Sans (300 → 800) et Clash Display sont chargées par `next/font` dans `app/layout.tsx`.
Référencer `var(--font-sans-loaded)` / `var(--font-display-loaded)`, jamais `system-ui` (hors design
system). Toute graisse utilisée doit être chargée, sinon le navigateur synthétise un faux gras.

## Structure `/admin`

Backoffice protégé par un auth simple : clé partagée dans l'URL (`?key=...`) ou email
whitelisté (`ADMIN_ALLOWED_EMAILS`), stocké dans `localStorage['ozirus_admin_auth']`.
Ce pattern d'auth est dupliqué dans chaque page `/admin/*` (pas de layout partagé) —
à reproduire à l'identique pour toute nouvelle page admin.

Le hub `/admin` (app/admin/page.tsx) liste les outils sous forme de cartes cliquables
(`sections`), chacune renvoyant vers une page dédiée (`/admin/leads`, `/admin/marketing`,
`/admin/core`, `/admin/manager`, `/admin/brief`...).

### Firestore & règles de sécurité

Client Firebase partagé dans `lib/firebase.ts` (`db`), config via `NEXT_PUBLIC_FIREBASE_*`.
Collections utilisées : `documents`, `marketing`, `campaigns`, `prospects`,
`lead_scores`, `lead_messages`, `formation_preinscriptions` (formulaire public de la landing formation).

`firestore.rules` à la racine reflète les règles de la console Firebase. Il doit
lister **toutes** les collections ci-dessus : déployer un fichier partiel révoque
l'accès aux collections absentes. Les règles sont actuellement ouvertes
(`allow read, write: if true`) car il n'y a pas d'authentification Firebase —
l'auth `/admin` est purement côté client. Une nouvelle collection nécessite une
entrée dans ce fichier **et** un déploiement, sinon les requêtes échouent avec
`FirebaseError: Missing or insufficient permissions`.

## Module Documents (`app/admin/documents/`)

Bibliothèque des propositions commerciales, factures et contrats archivés dans la
collection Firestore `documents`.

- `documentsService.ts` — CRUD (`list`/`get`/`create`/`update`/`setStatus`/`remove`).
  Firestore rejette `undefined` : `stripUndefined()` nettoie récursivement avant
  écriture (même besoin que `app/admin/leads/page.tsx`).
- `page.tsx` — layout split-screen : liste filtrable à gauche (type, statut,
  recherche), aperçu A4 en lecture seule à droite. Le téléchargement PDF capture
  `.doc-preview-page` via html2canvas + jsPDF, comme l'éditeur capture `.a4-page`.

Un document stocke ses métadonnées à plat (`kind`, `status`, `clientName`,
`totalTTC`...) pour pouvoir filtrer sans tout charger, **plus** un `payload` qui est
le dump brut de l'état de l'éditeur — volontairement non typé champ par champ pour
qu'ajouter un champ dans `/admin` ne casse pas la persistance.

`kind` est dérivé du couple `docType`/`docMode` de l'éditeur : le mode CONTRAT prime,
une PROPOSITION COMMERCIALE en mode CONTRAT est archivée comme `CONTRAT`. Les autres
`docType` (badge, carte, social) ne sont pas archivés — seul le brouillon local est écrit.

### Conversion proposition → contrat → facture

`documentsService.convert(sourceId, target)` crée un **nouveau** document dérivé et
laisse la source intacte (la proposition envoyée au client ne doit pas se transformer
sous ses pieds). Chaînage autorisé par `CONVERT_TARGETS` dans `page.tsx` :
proposition → contrat|facture, contrat → facture, facture → terminal.

La conversion réécrit `docType`/`docMode` dans le payload (ce sont eux qui pilotent le
rendu de l'éditeur), régénère le numéro selon le préfixe du type (`PC`/`CTR`/`F`), puis
ouvre `/admin?doc=<nouvel id>`. Un contrat reçoit une `contractStartDate` et perd son
`validUntil` (il prend effet, il n'expire pas) ; une facture reçoit une échéance à 30 jours.

⚠️ L'effet « Defaults » de `app/admin/page.tsx` régénère numéro et `validUntil` à chaque
changement de `docType`/`docMode`. Il est gardé par le ref `isEditingStoredDoc`, posé
**avant** le fetch Firestore : sans ce garde, ouvrir un document archivé écraserait son
numéro au chargement. « DUPLIQUER » remet le ref à `false` pour obtenir un numéro neuf.

### Aller-retour éditeur ↔ bibliothèque

Dans `app/admin/page.tsx`, `buildPayload()` / `applyPayload()` sont les deux moitiés
de la sérialisation et doivent rester synchronisées à chaque nouveau champ d'état.
`/admin?doc=<id>` charge un document existant dans l'éditeur (`currentDocId` non nul
⇒ « Sauvegarder » fait un update ; « DUPLIQUER » détache l'id pour créer une copie).

### Pas d'`alert()` dans le backoffice

`alert()` gèle la page entière (et bloque toute automatisation navigateur). Les
confirmations et erreurs passent par le toast non bloquant local à chaque page
(`showToast(kind, message)`). Seul le `confirm()` de suppression est conservé,
volontairement, parce que l'action est destructive.

### Design system des outils admin

Toutes les pages d'outils suivent le même layout **split-screen** (voir
`app/admin/page.tsx`, section "Outils Création") :

- Panneau gauche fixe **480px**, fond blanc, scrollable, avec :
  - header (retour + titre + icône `lucide-react`)
  - sélecteurs de haut niveau en `<select>` ou pills (`tabBtn`)
  - navigation locale par icônes (`subTab`) entre groupes de champs
  - formulaire scrollable (`sectionTitle`, `labelStyle`, `inputStyle`)
  - footer sticky avec bouton d'action principal (`primaryBtnStyle`, fond `#7967FF`)
- Panneau droit flexible : **aperçu live** du document final (feuille blanche avec
  ombre portée, pas juste un résumé de formulaire)

Couleur primaire : `#7967FF`. Tokens de couleur habituels : ink `#0F172A`,
muted `#64748B`, faint `#94A3B8`, border `#E2E8F0`, surface `#F8FAFC`.

Ne pas réinventer un nouveau design pattern pour un outil admin — copier ce layout.

## Module Roadmap MVP (`app/admin/mvp-roadmap/`)

Plan marketing de l'offre MVP (mvp.ozirus.agency) : objectif et funnel calculé à l'envers depuis
« 1 client », personas, canaux et budget ads, scripts de prospection et d'appel, script vidéo,
plan semaine par semaine. Tout le contenu est dans `roadmapData.ts` (prix à garder aligné avec
`OFFER` de `app/mvp/page.tsx`). Hypothèses, budget et cases cochées sont stockés dans
`localStorage['ozirus_mvp_roadmap']` (propre au navigateur, pas de Firestore). Export PDF :
une capture html2canvas de la feuille, découpée en pages A4.

## Module Brief Client (`app/admin/brief/`)

Outil de collecte d'informations client, adaptatif selon le type de projet vendu
(site web, application, automatisation IA, autre prestation). Objectif : un seul
formulaire qui "parle à tout le monde" quel que soit le type de client, rempli par
l'agence pendant l'échange avec le client (pas un formulaire public envoyé au client).

- `briefData.ts` — définit les types de projet (`PROJECT_TYPES`), les statuts client
  (`CLIENT_STATUSES` : en réflexion / en négociation / payé / perdu), les groupes de
  champs communs (`COMMON_GROUPS`) et de clôture commerciale (`CLOSING_GROUP`).
- `exportDocx.ts` — génère le `.docx` via la lib `docx` (v9). **Toujours importé
  dynamiquement** (`await import('./exportDocx')`) au moment du clic export, jamais
  en import statique en tête de `page.tsx` — un import statique fait planter
  Turbopack en dev avec `SyntaxError: 'super' keyword unexpected here`.
- `page.tsx` — layout split-screen standard (voir plus haut). Pas de sauvegarde
  serveur/Firestore par choix explicite du client : tout reste en state React côté
  navigateur, seul l'export `.docx` fait sortir la donnée.

### Statut client change le contenu du formulaire, pas juste son apparence

Le statut client (`ClientStatusId`) pilote quelles questions sont posées, pas
seulement un badge visuel — décision explicite du client Ozirus :

- Tant que non payé (`thinking`/`negotiating`/`lost`) : `COMMON_GROUPS` (infos client +
  contexte/objectifs commerciaux) + `projectType.groups` (specs de vente par type) +
  `CLOSING_GROUP` (budget/délai/décideur) — c'est un brief de **découverte commerciale**.
- Dès `paid` : seul le premier groupe de `COMMON_GROUPS` (identité du contact) est
  gardé ; le reste bascule sur `projectType.paidGroups` (accès techniques, comptes,
  contenus à fournir — spécifique à chaque type de projet) + `PAID_CLOSING_GROUP`
  (modalités de paiement reçues, date de lancement, interlocuteur, cadence de reporting).
  C'est un brief de **cadrage/kickoff**, plus de questions de vente (budget, "qui décide").

Cette bascule est dupliquée à l'identique dans `page.tsx` (aperçu live) et
`exportDocx.ts` (export Word) — les deux doivent rester synchronisés si on ajoute un
groupe. Tout nouveau `ProjectTypeDef` dans `PROJECT_TYPES` doit définir `paidGroups`
(le champ est obligatoire dans l'interface, pas optionnel).

## Système de réservation (`lib/booking/`, `/book/<slug>`, `/admin/bookings`)

Calendly maison, générique : une **page de réservation** (`booking_pages`) porte toute la config
(type `meeting` = rendez-vous, ou `table` = capacité en unités/couverts pour un resto), horaires
hebdo dans le fuseau de la page, préavis, tampon, jours fermés, questions, confirmation auto/manuelle.
- `lib/booking/slots.ts` — calcul pur des créneaux (Intl, gère les changements d'heure).
- `lib/booking/service.ts` — Firestore. Toute prise de créneau passe par une transaction sur
  `booking_days/{pageId}__{YYYY-MM-DD}` (verrou anti double-réservation, chevauchements inclus).
- `app/api/booking/[slug]` (créneaux + création, validée serveur) et `app/api/booking/manage/[id]`
  (lien d'annulation à jeton remis au client).
- `components/booking/BookingWidget.tsx` — widget réutilisable (landing MVP : page `mvp-appel`,
  repli WhatsApp si la page n'existe pas) ; `/book/<slug>?embed=1` pour l'iframe sur un site tiers.
- Pas encore d'email de notification : le client peut prévenir via WhatsApp depuis la confirmation.
