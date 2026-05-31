/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  turbopack: {
    root: __dirname,
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
