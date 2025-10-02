import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Document personnalisé pour SAFEM
 * Gère les éléments <head> globaux et les stylesheets externes
 */
export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Fonts Google - Correct placement selon Next.js */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* DNS Prefetch pour performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Favicon et manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color pour mobile */}
        <meta name="theme-color" content="#2E7D32" />
        
        {/* Accept-CH pour images responsive */}
        <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
