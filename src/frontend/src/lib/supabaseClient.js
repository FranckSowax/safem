import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Configuration par défaut pour éviter les erreurs si les variables ne sont pas définies
const defaultUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

// Utiliser les variables d'environnement ou les valeurs par défaut
const finalUrl = supabaseUrl || defaultUrl;
const finalKey = supabaseAnonKey || defaultKey;

export const supabase = createClient(finalUrl, finalKey);

// Fonction pour vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Fonction pour tester la connexion
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('produits').select('count', { count: 'exact', head: true });
    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
