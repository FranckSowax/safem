import '../styles/globals.css';
import '../styles/about.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import Script from 'next/script';

/**
 * Composant principal de l'application Safem
 * Enveloppe toutes les pages avec les providers nécessaires et les styles globaux
 */
export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="SAFEM - Une Ferme et plateforme de produits frais, locaux et durables du Gabon. Notre coopérative agricole promeut des pratiques respectueuses de l'environnement." />
        <meta name="keywords" content="SAFEM, agriculture, Gabon, produits frais, permaculture, développement durable, maraîchage, Meba, Ntoum" />
        <meta property="og:title" content="SAFEM - L'excellence agricole au service du développement" />
        <meta property="og:description" content="Découvrez les produits frais et locaux de notre ferme gabonaise, cultivés selon des normes sanitaires strictes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://safem.ga" />
        <meta property="og:image" content="/images/vegetables.jpg" />
        <link rel="canonical" href="https://safem.ga" />
      </Head>
      <Component {...pageProps} />
      
      {/* Service Worker - utilisation de next/script au lieu de script tag dans Head */}
      <Script
        src="/register-sw.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Service Worker script chargé');
        }}
      />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#333333',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#2E7D32',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#E53E3E',
              secondary: '#FFFFFF',
            },
          },
          duration: 3000,
        }}
      />
    </AuthProvider>
  );
}
