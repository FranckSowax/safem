/**
 * Configuration Supabase pour Safem
 * Ce fichier initialise la connexion à Supabase et expose le client pour une utilisation dans l'application.
 */

const { createClient } = require('@supabase/supabase-js');

// Ces valeurs seraient normalement chargées depuis des variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Vérification de la présence des variables d'environnement requises
if (!supabaseUrl || !supabaseKey) {
  console.error('Les variables d\'environnement SUPABASE_URL et SUPABASE_KEY doivent être définies');
  process.exit(1);
}

// Création du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
