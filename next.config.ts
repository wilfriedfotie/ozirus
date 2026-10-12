import { SUBDOMAIN_ROUTES } from './lib/subdomains'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Sous-domaines (mvp.ozirus.agency → /mvp, formation.ozirus.agency → /formation-ia…),
  // déclarés dans lib/subdomains.ts. Chaque domaine doit aussi être ajouté au projet Vercel.
  async rewrites() {
    return {
      beforeFiles: SUBDOMAIN_ROUTES.map(({ subdomain, route }) => ({
        source: '/',
        has: [{ type: 'host' as const, value: `${subdomain}\\..+` }],
        destination: route,
      })),
    }
  },

  typescript: {
    // Ignore les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore les erreurs ESLint pendant le build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
