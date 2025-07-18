import { useEffect } from 'react';
import supabase from '../services/supabaseClient';

export default function TestEnv() {
  useEffect(() => {
    console.log('=== TEST VARIABLES D\'ENVIRONNEMENT CÔTÉ CLIENT ===');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('URL définie:', !!url);
    console.log('Clé définie:', !!key);
    
    if (url) {
      console.log('Longueur URL:', url.length);
      console.log('URL commence par https:', url.startsWith('https://'));
    }
    
    if (key) {
      console.log('Longueur clé:', key.length);
      console.log('Clé commence par eyJ:', key.startsWith('eyJ'));
    }
    
    console.log('Client Supabase:', supabase ? 'CONFIGURÉ' : 'NON CONFIGURÉ');
    
    if (supabase) {
      console.log('✅ Supabase est configuré et prêt !');
      // Test de connexion simple
      supabase.from('products').select('count').then(result => {
        console.log('Test connexion Supabase:', result);
      }).catch(error => {
        console.log('Erreur test connexion:', error.message);
      });
    } else {
      console.log('❌ Supabase n\'est pas configuré');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Variables d'Environnement</h1>
      <p>Ouvrez la console du navigateur (F12) pour voir les résultats du test.</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Variables d'environnement :</h2>
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Non définie'}</p>
        <p>Clé: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Non définie'}</p>
        <p>Client Supabase: {supabase ? '✅ Configuré' : '❌ Non configuré'}</p>
      </div>
    </div>
  );
}
