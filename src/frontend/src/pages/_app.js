import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

/**
 * Composant principal de l'application Safem
 * Enveloppe toutes les pages avec les providers nécessaires et les styles globaux
 */
export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
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
