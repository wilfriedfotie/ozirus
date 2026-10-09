/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Sous-domaine de l'offre MVP : mvp.ozirus.agency sert la page /mvp.
  // Le domaine doit aussi être ajouté au projet Vercel (Settings → Domains).
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', has: [{ type: 'host', value: 'mvp\\..+' }], destination: '/mvp' },
      ],
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
