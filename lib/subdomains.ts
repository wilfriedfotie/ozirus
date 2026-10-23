// Landings servies sur leur propre sous-domaine : `<subdomain>.ozirus.agency/` affiche `route`.
// Source unique pour les rewrites de next.config.ts et les liens de retour vers le site principal
// (`useMainSiteHref`). Chaque domaine doit aussi être ajouté au projet Vercel (Settings → Domains).
export const SUBDOMAIN_ROUTES = [
  { subdomain: 'mvp', route: '/mvp' },
  { subdomain: 'formation', route: '/formation-ia' },
  { subdomain: 'resto', route: '/resto' },
] as const;
