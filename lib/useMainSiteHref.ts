'use client';

import { useEffect, useState } from 'react';
import { SUBDOMAIN_ROUTES } from './subdomains';

// Sur un sous-domaine, `/` sert la landing elle-même : un lien vers `/` (ou vers une autre
// page du site) doit donc viser le domaine principal. Renvoie un résolveur de liens qui
// préfixe l'origine principale sur un sous-domaine, et laisse les ancres intactes.
// L'origine n'est connue qu'après montage : le premier rendu (SSR) garde les chemins relatifs.
export function useMainSiteHref() {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    const { protocol, host } = window.location;
    const [first, ...rest] = host.split('.');
    if (rest.length && SUBDOMAIN_ROUTES.some(s => s.subdomain === first)) {
      setOrigin(`${protocol}//${rest.join('.')}`);
    }
  }, []);
  return (path: string) => (path.startsWith('#') ? path : origin + path);
}
