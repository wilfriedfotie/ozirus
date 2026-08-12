````md
# Ozirus Lead Generator Agent - Architecture Technique

## Objectif

Créer un agent de génération de leads B2B.

L’utilisateur entre :

- niche
- ville
- pays
- offre
- nombre de prospects souhaités
- canal préféré

Le système doit :

1. trouver des prospects
2. enrichir leurs données
3. analyser leur présence digitale
4. scorer leur potentiel
5. générer des messages personnalisés
6. afficher les leads dans un mini CRM

---

# Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

## Backend

- Next.js API Routes ou Server Actions
- Firebase Admin SDK

## Database

- Firebase Firestore

## Auth

- Firebase Auth

## Jobs / Background processing

- Trigger.dev  
ou
- Firebase Cloud Functions

## AI

- OpenAI Responses API
- Structured Outputs JSON

## Scraping / Enrichment

- Google Places API
- Playwright
- Firecrawl optionnel

---

# Architecture globale

```txt
Next.js Dashboard
      |
      v
Campaign API
      |
      v
Firestore
      |
      v
Background Job
      |
      v
Prospect Finder
      |
      v
Data Enrichment
      |
      v
AI Analysis + Scoring
      |
      v
Message Generator
      |
      v
Firestore CRM
      |
      v
Dashboard Leads
````

---

# Collections Firestore

## campaigns

```ts
type Campaign = {
  id: string
  userId: string

  niche: string
  city: string
  country: string
  offer: string

  targetCount: number
  channel: "whatsapp" | "email" | "linkedin" | "call"

  status: "draft" | "running" | "completed" | "failed"

  totalProspectsFound: number
  totalQualifiedLeads: number

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## prospects

```ts
type Prospect = {
  id: string
  campaignId: string
  userId: string

  name: string
  category?: string

  city: string
  country: string
  address?: string

  phone?: string
  website?: string
  email?: string

  source: "google_places" | "google_search" | "manual" | "facebook" | "website"
  sourceUrl?: string

  googleRating?: number
  googleReviewsCount?: number

  status:
    | "new"
    | "enriching"
    | "analyzed"
    | "qualified"
    | "to_contact"
    | "contacted"
    | "replied"
    | "meeting_booked"
    | "won"
    | "lost"

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## prospect_enrichments

```ts
type ProspectEnrichment = {
  id: string
  prospectId: string
  campaignId: string
  userId: string

  hasWebsite: boolean
  hasWhatsapp: boolean
  hasEmail: boolean
  hasBooking: boolean
  hasOnlineOrder: boolean
  hasDigitalMenu: boolean
  hasSocialLinks: boolean

  whatsappNumber?: string
  emails: string[]

  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    tiktok?: string
  }

  websiteSummary?: string

  weaknesses: string[]
  opportunities: string[]

  rawTextSnapshot?: string

  createdAt: Timestamp
}
```

---

## lead_scores

```ts
type LeadScore = {
  id: string
  prospectId: string
  campaignId: string
  userId: string

  score: number
  priority: "cold" | "warm" | "hot"

  detectedProblem: string
  recommendedAngle: string
  reason: string

  budgetPotential:
    | "low"
    | "medium"
    | "high"
    | "unknown"

  conversionDifficulty:
    | "easy"
    | "medium"
    | "hard"

  createdAt: Timestamp
}
```

---

## lead_messages

```ts
type LeadMessage = {
  id: string
  prospectId: string
  campaignId: string
  userId: string

  channel: "whatsapp" | "email" | "linkedin" | "call"

  subject?: string
  message: string

  tone: "friendly" | "professional" | "direct"

  status: "draft" | "approved" | "used"

  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## activity_logs

```ts
type ActivityLog = {
  id: string
  campaignId?: string
  prospectId?: string
  userId: string

  type:
    | "campaign_created"
    | "prospect_found"
    | "prospect_enriched"
    | "prospect_scored"
    | "message_generated"
    | "status_updated"
    | "error"

  message: string
  metadata?: Record<string, any>

  createdAt: Timestamp
}
```

---

# Firestore structure recommandée

```txt
users/{userId}
campaigns/{campaignId}
prospects/{prospectId}
prospect_enrichments/{enrichmentId}
lead_scores/{scoreId}
lead_messages/{messageId}
activity_logs/{logId}
```

Alternative possible :

```txt
users/{userId}/campaigns/{campaignId}/prospects/{prospectId}
```

Pour une V1 simple, utiliser des collections root avec `userId` et `campaignId`.

---

# Flow fonctionnel

## 1. Créer une campagne

Input utilisateur :

```ts
{
  niche: "restaurants",
  city: "Douala",
  country: "Cameroun",
  offer: "Menu digital WhatsApp + agent IA de commande",
  targetCount: 50,
  channel: "whatsapp"
}
```

Actions :

1. valider avec Zod
2. créer un document `campaigns`
3. status = `running`
4. déclencher le job de recherche

---

## 2. Prospect Finder

Responsabilité :

Trouver des entreprises correspondant à :

```txt
{niche} in {city}, {country}
```

Sources V1 :

* Google Places API
* Google Search optionnel
* ajout manuel optionnel

Queries générées :

```txt
restaurants Douala Cameroun
restaurant near Douala
best restaurants in Douala
restaurant WhatsApp Douala
```

Données à sauvegarder :

```ts
{
  name,
  category,
  address,
  phone,
  website,
  googleRating,
  googleReviewsCount,
  source,
  sourceUrl
}
```

Règle importante :

Ne jamais inventer une donnée manquante.

Si le téléphone, email ou site n’existe pas, laisser vide.

---

## 3. Déduplication

Avant insertion d’un prospect, vérifier doublon par ordre :

1. `website`
2. `phone`
3. `name + city`

Pseudo-code :

```ts
async function isDuplicateProspect(prospect) {
  if (prospect.website) check website
  if (prospect.phone) check phone
  check normalizedName + city
}
```

---

## 4. Enrichment

Pour chaque prospect :

1. visiter le site web si disponible
2. extraire texte visible
3. chercher :

   * email
   * WhatsApp
   * liens sociaux
   * bouton réservation
   * bouton commander
   * menu digital
4. sauvegarder dans `prospect_enrichments`

Détection simple :

```ts
const hasWhatsapp = text.includes("wa.me") || text.includes("whatsapp")
const hasBooking = text.includes("réserver") || text.includes("reservation") || text.includes("book")
const hasOnlineOrder = text.includes("commander") || text.includes("order")
```

---

## 5. AI Website Analyst

Prompt système :

```txt
You are a B2B lead analysis agent for an AI automation agency.

Your job is to analyze a business digital presence using only the provided data.

You must detect visible business weaknesses, automation opportunities, and fit with the agency offer.

Never invent facts. If something is not provided, say "unknown".
Return only valid JSON.
```

Input :

```ts
{
  businessName,
  niche,
  city,
  offer,
  websiteText,
  hasWhatsapp,
  hasBooking,
  hasOnlineOrder,
  hasDigitalMenu,
  socialLinks
}
```

Output JSON :

```ts
{
  "summary": "string",
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "fitWithOffer": "low | medium | high",
  "mainProblem": "string"
}
```

---

## 6. Lead Scoring Agent

Score sur 100.

Critères :

```txt
+20 contact disponible
+20 besoin visible
+20 fit avec l’offre
+15 présence digitale faible ou améliorable
+15 business actif
+10 facilité de personnalisation
```

Output JSON :

```ts
{
  "score": 84,
  "priority": "hot",
  "detectedProblem": "No structured WhatsApp ordering flow",
  "recommendedAngle": "Turn WhatsApp into a simple ordering and reservation assistant",
  "reason": "The business has contact information but no visible booking or order automation.",
  "budgetPotential": "medium",
  "conversionDifficulty": "easy"
}
```

Règles :

```txt
0 - 49 = cold
50 - 74 = warm
75 - 100 = hot
```

---

## 7. Message Generator Agent

Prompt système :

```txt
You are an expert B2B outreach copywriter.

Generate short, personalized and respectful outreach messages.

The message must be based only on verified information.

Do not sound spammy.
Do not overpromise.
Use a natural tone.
Return only valid JSON.
```

Input :

```ts
{
  businessName,
  niche,
  city,
  offer,
  detectedProblem,
  recommendedAngle,
  channel
}
```

Output :

```ts
{
  "whatsapp": "string",
  "email": {
    "subject": "string",
    "body": "string"
  },
  "linkedin": "string",
  "callScript": "string"
}
```

---

# API Routes

## POST /api/campaigns

Créer une campagne.

Body :

```ts
{
  niche: string
  city: string
  country: string
  offer: string
  targetCount: number
  channel: "whatsapp" | "email" | "linkedin" | "call"
}
```

Response :

```ts
{
  campaignId: string
  status: "running"
}
```

---

## GET /api/campaigns

Lister les campagnes de l’utilisateur.

---

## GET /api/campaigns/:id

Voir une campagne.

---

## GET /api/campaigns/:id/leads

Lister les prospects + enrichments + scores + messages.

Filtres :

```txt
priority
status
scoreMin
hasWhatsapp
hasWebsite
```

---

## PATCH /api/prospects/:id/status

Modifier le statut CRM.

Body :

```ts
{
  status: "contacted" | "replied" | "meeting_booked" | "won" | "lost"
}
```

---

## POST /api/prospects/:id/regenerate-message

Regénérer un message.

---

## GET /api/campaigns/:id/export

Exporter CSV.

---

# Services backend

## services/campaign.service.ts

```ts
createCampaign()
getCampaign()
listCampaigns()
updateCampaignStatus()
```

---

## services/prospect-finder.service.ts

```ts
findProspectsByGooglePlaces()
normalizeProspect()
deduplicateProspect()
saveProspect()
```

---

## services/enrichment.service.ts

```ts
crawlWebsite()
extractEmails()
extractWhatsapp()
extractSocialLinks()
detectBusinessFeatures()
saveEnrichment()
```

---

## services/ai-analysis.service.ts

```ts
analyzeWebsite()
scoreLead()
generateOutreachMessages()
```

---

## services/crm.service.ts

```ts
updateLeadStatus()
createActivityLog()
getLeadDetails()
```

---

# Jobs

## runCampaignJob

Input :

```ts
{
  campaignId: string
}
```

Steps :

```txt
1. load campaign
2. find prospects
3. save prospects
4. enrich each prospect
5. analyze each prospect with AI
6. score each prospect
7. generate messages
8. update campaign stats
9. mark campaign completed
```

Pseudo-code :

```ts
async function runCampaignJob(campaignId: string) {
  const campaign = await getCampaign(campaignId)

  const prospects = await findProspects({
    niche: campaign.niche,
    city: campaign.city,
    country: campaign.country,
    limit: campaign.targetCount
  })

  for (const prospect of prospects) {
    const savedProspect = await saveProspect(campaign, prospect)

    const enrichment = await enrichProspect(savedProspect)

    const analysis = await analyzeWebsite({
      campaign,
      prospect: savedProspect,
      enrichment
    })

    const score = await scoreLead({
      campaign,
      prospect: savedProspect,
      enrichment,
      analysis
    })

    const messages = await generateMessages({
      campaign,
      prospect: savedProspect,
      enrichment,
      score
    })

    await saveLeadMessages(messages)
  }

  await updateCampaignStatus(campaignId, "completed")
}
```

---

# Frontend Pages

## /dashboard

Résumé :

```txt
Total campaigns
Total leads
Hot leads
Meetings booked
```

---

## /dashboard/campaigns/new

Formulaire :

```txt
Niche
Ville
Pays
Offre
Nombre de leads
Canal préféré
```

---

## /dashboard/campaigns

Liste des campagnes.

Colonnes :

```txt
Niche
Ville
Pays
Leads trouvés
Hot leads
Status
Created at
```

---

## /dashboard/campaigns/[id]

Tabs :

```txt
Leads
Messages
Stats
Logs
```

---

## Lead Card

Afficher :

```txt
Nom
Téléphone
Site web
Score
Priorité
Problème détecté
Angle recommandé
Message généré
Bouton copier
Statut CRM
```

---

# UI Components

```txt
CampaignForm
CampaignTable
LeadTable
LeadCard
ScoreBadge
PriorityBadge
StatusSelect
MessagePreview
CopyButton
ExportButton
ActivityTimeline
```

---

# Sécurité Firestore

Règle de base :

```txt
Un utilisateur ne peut lire/écrire que ses propres documents.
```

Chaque document doit avoir :

```ts
userId: string
```

Security rules simplifiées :

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /prospects/{prospectId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /prospect_enrichments/{id} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /lead_scores/{id} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /lead_messages/{id} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    match /activity_logs/{id} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

# Variables d’environnement

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

OPENAI_API_KEY=
GOOGLE_PLACES_API_KEY=

TRIGGER_SECRET_KEY=
```

---

# Limites importantes V1

Ne pas faire :

```txt
Envoi automatique WhatsApp
Spam email
Scraping LinkedIn agressif
Scraping Instagram agressif
```

Faire :

```txt
Génération de leads
Scoring
Messages prêts
Validation humaine
Copier/coller manuel
Export CSV
```

---

# Roadmap

## V1

```txt
Campagnes
Recherche Google Places
Enrichment site
AI scoring
Messages personnalisés
CRM simple
Export CSV
```

## V2

```txt
PDF audit automatique
Relances planifiées
Historique de contact
Templates par niche
Import CSV
```

## V3

```txt
Intégration WhatsApp Business API
Envoi email via Resend
Calendly integration
Multi-user workspace
Dashboard analytics
```

---

# Definition of Done V1

Une V1 est terminée si :

```txt
1. Je peux créer une campagne
2. Le système trouve au moins 20 prospects
3. Chaque prospect a un score
4. Chaque prospect a un message WhatsApp généré
5. Je peux copier le message
6. Je peux changer le statut CRM
7. Je peux exporter les leads en CSV
```

---

# Prompt global pour Claude

Construis cette application en Next.js TypeScript avec Firebase Firestore.

Respecte une architecture propre :

```txt
/app
/components
/lib/firebase
/lib/services
/lib/ai
/lib/jobs
/lib/types
```

Utilise :

```txt
Tailwind CSS
shadcn/ui
React Hook Form
Zod
Firebase Admin SDK côté serveur
Firestore côté serveur pour les écritures sensibles
OpenAI pour les agents IA
Google Places API pour trouver les prospects
```

Priorité :

```txt
1. créer la structure projet
2. créer les types TypeScript
3. créer les collections Firestore
4. créer le formulaire campagne
5. créer le job runCampaign
6. créer la table leads
7. créer le système de scoring
8. créer la génération des messages
```

Ne fais pas d’envoi automatique de messages en V1.

```
```
