/**
 * Configuration Next.js pour Safem
 * Optimisée pour les performances sur connections lentes au Gabon
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // Active la compression gzip pour toutes les ressources
  poweredByHeader: false, // Supprime l'en-tête X-Powered-By pour la sécurité
  
  // Optimisations pour réduire les warnings
  swcMinify: true, // Utilise SWC pour la minification (plus rapide)
  images: {
    domains: [
      'localhost',
      'xgafzmqqzjzuhbangeff.supabase.co', // Domaine Supabase Storage
      'images.unsplash.com', // Pour les images de test
      'i.imgur.com', // Pour les images hébergées sur Imgur
      'via.placeholder.com' // Pour les images placeholder
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200], // Tailles d'écran optimisées
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Tailles d'images adaptatives
    minimumCacheTTL: 86400, // Cache d'un jour pour réduire les téléchargements
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  },
  async redirects() {
    return [
      {
        source: '/accueil',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
