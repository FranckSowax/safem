import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Création d'un client Supabase pour l'utilisation côté client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
