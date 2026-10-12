# Ozirus — Notes pour Codex

Site Next.js (App Router) de l'agence Ozirus + backoffice `/admin`.

## Commandes

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — build prod (Turbopack)
- `pnpm start` — serveur prod

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
`lead_scores`, `lead_messages`.

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
