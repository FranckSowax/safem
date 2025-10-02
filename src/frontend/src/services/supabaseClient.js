import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase seulement si les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Création d'un client Supabase pour l'utilisation côté client, ou null si les identifiants ne sont pas disponibles
let supabase = null;

// Vérifier que les variables d'environnement sont définies avant d'initialiser Supabase
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Supabase:', error);
  }
}

export default supabase;
