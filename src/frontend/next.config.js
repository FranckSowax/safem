/**
 * Configuration Next.js pour Safem
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'xgafzmqqzjzuhbangeff.supabase.co', // Domaine Supabase Storage (à adapter à votre instance)
      'images.unsplash.com' // Pour les images de développement/test
    ],
    formats: ['image/avif', 'image/webp'],
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
