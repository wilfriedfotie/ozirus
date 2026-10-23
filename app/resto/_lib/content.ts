export const WHY_ITEMS = [
  {
    icon: "Users",
    title: "Fiche client automatique",
    body: "Nom, numéro, plats préférés — enregistrés à chaque commande WhatsApp.",
  },
  {
    icon: "Heart",
    title: "Relance automatique",
    body: "Un client absent depuis 3 semaines reçoit un message. Sans y penser.",
  },
  {
    icon: "CreditCard",
    title: "Paiement direct",
    body: "Le client paie en Mobile Money. L'argent arrive chez vous, sans intermédiaire.",
  },
  {
    icon: "Package",
    title: "Alerte de stock",
    body: "Le stock baisse à chaque commande. Vous êtes prévenu avant la rupture.",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "25 000",
    period: "FCFA / mois",
    description: "Pour démarrer sur WhatsApp sans complexité.",
    features: ["Catalogue WhatsApp", "Paiement NotchPay", "Gestion de commandes"],
  },
  {
    name: "Pro",
    price: "45 000",
    period: "FCFA / mois",
    description: "Pour piloter votre stock et fidéliser vos clients.",
    features: ["Tout Starter", "Gestion de stock & alertes", "Mini-site inclus", "Fidélisation client"],
    highlighted: true,
  },
  {
    name: "Business",
    price: "75 000",
    period: "FCFA / mois",
    description: "Pour les équipes multi-staff avec IA avancée.",
    features: ["Tout Pro", "Agent IA prédictif", "Facturation digitale", "Support prioritaire"],
  },
];
