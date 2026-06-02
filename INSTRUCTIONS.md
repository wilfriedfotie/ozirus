# Instructions de configuration - Ozirus

## 🚀 Site Optimisé et Prêt !

## ✅ Améliorations apportées

### 🚀 Nouvelle proposition marketing (21 jours au lieu de 90)
- **Délai réduit** : Passage de 90 jours à 21 jours pour une proposition plus compétitive
- **Messaging mis à jour** : Tous les textes ont été adaptés au nouveau délai
- **Positionnement premium** : Accent sur la rapidité d'exécution

### 💰 Pricing compétitif et transparent
- **Plan Starter** : 2500€ TTC (au lieu de 4000€) - 7-14 jours
- **Plan Business** : 4500€ TTC (au lieu de 7000€) - 14-21 jours
- **Plan Enterprise** : 7500€ TTC (au lieu de 12000€) - 21 jours max
- **Réduction de lancement** : -40% sur tous les plans
- **Garanties claires** : Délais respectés ou remboursé

### 📅 Intégration Calendly
- **Consultation gratuite** : 15 minutes pour analyser le projet
- **Boutons d'action** : CTA vers la prise de rendez-vous
- **Widget intégré** : Calendly directement dans la page contact

### 📱 Responsive Design Optimisé
- **Mobile-first** : Interface parfaitement adaptée sur tous les appareils
- **Typographie responsive** : Tailles adaptées pour chaque breakpoint
- **Grilles flexibles** : Layouts qui s'adaptent automatiquement
- **Touch-friendly** : Boutons et interactions optimisés mobile

### 🎯 Conversion et Urgence
- **Live notifications** : Fausses notifications de clients en temps réel
- **Badges d'urgence** : "Plus que 7 jours", "Déjà 15 demandes"
- **Preuves sociales** : Témoignages et statistiques
- **CTA améliorés** : Textes plus incitatifs et urgents

## 🔧 Configuration requise

### 1. Calendly
⚠️ **Action requise** : Remplace le lien Calendly par le tien dans :
- `components/Contact.tsx` ligne 22 : `url: 'https://calendly.com/your-calendly-username/30min'`
- `components/Contact.tsx` ligne 147 : `data-url="https://calendly.com/your-calendly-username/30min"`

### 2. Informations de contact
Met à jour dans `components/Contact.tsx` :
- Email : `info.ozirus@gmail.com` (lignes 178 et 185)
- Téléphone : `+33 1 23 45 67 89` (ligne 193)

### 3. Domaine et URL
Met à jour dans `app/layout.tsx` :
- URL du site : `https://ozirus.com` (ligne 28)
- Ajouter le metadataBase pour les images OpenGraph

## 🚀 Démarrage

```bash
# Installer les dépendances
pnpm install

# Lancer en développement
pnpm run dev

# Build production
pnpm run build
```

## 📁 Nouveaux composants créés

1. **`components/Pricing.tsx`** - Section pricing avec 3 plans tarifaires
2. **`components/Contact.tsx`** - Section contact avec intégration Calendly
3. **`components/LiveNotification.tsx`** - Notifications en temps réel pour l'urgence

## 🔄 Composants mis à jour

1. **`components/Hero.tsx`** - Badge d'urgence et responsive amélioré
2. **`components/Stats.tsx`** - Statistiques alignées avec 21 jours
3. **`components/Realizations.tsx`** - Durées des projets cohérentes (12-21 jours)
4. **`components/Process.tsx`** - Timeline ajustée pour 21 jours max
5. **`components/Team.tsx`** - Messaging mis à jour
6. **`components/Footer.tsx`** - Proposition de valeur actualisée
7. **`components/CTA.tsx`** - Garantie 21 jours
8. **`components/Services.tsx`** - Délais cohérents

## 🎯 Points clés de la nouvelle proposition

### Avantages concurrentiels
- ⚡ **Ultra-rapide** : 21 jours maximum vs 90 jours habituels
- 💰 **Prix compétitifs** : -40% en promotion de lancement
- 🎯 **Transparent** : Prix fixes, pas de surprises
- 🛡️ **Garanti** : Respect des délais ou remboursement
- 📞 **Accessible** : Consultation gratuite de 15 min

### Proposition de valeur
- De l'idée au produit fonctionnel en **21 jours maximum**
- **Technologies de pointe** pour un avantage concurrentiel
- **Process éprouvé** et équipe dédiée 24/7
- **Support inclus** pendant et après le développement

## 📧 Email de contact suggéré

Si un prospect t'écrit, voici un template de réponse :

---

**Objet : Transformons votre idée en produit en 21 jours 🚀**

Bonjour [Nom],

Merci pour votre intérêt pour Ozirus !

Je serais ravi de discuter de votre projet lors d'un **appel découverte gratuit de 15 minutes**.

Durant cet échange, nous analyserons :
✅ La faisabilité technique de votre idée
✅ L'estimation précise des délais et budget
✅ La stratégie optimale pour votre lancement

**Réservez votre créneau ici** : [Lien Calendly]

Ou répondez simplement à cet email avec vos disponibilités.

À très bientôt !

[Votre nom]
Fondateur - Ozirus
📧 contact.fotie@gmail.com
📞 +33 1 23 45 67 89

---

## 🔄 Prochaines étapes recommandées

1. ✅ Configurer ton vrai lien Calendly
2. ✅ Mettre à jour les vraies coordonnées de contact
3. ✅ Tester le formulaire de contact et Calendly
4. ✅ Créer du contenu pour les réseaux sociaux avec la nouvelle proposition
5. ✅ Préparer des témoignages clients pour valider les délais de 21 jours
6. ✅ Mettre en place le tracking analytics (Google Analytics, Facebook Pixel, etc.)

Le site est maintenant prêt avec une proposition marketing bien plus attractive et compétitive ! 🎉
