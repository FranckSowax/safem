const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🔍 DIAGNOSTIC SUPABASE SAFEM');
console.log('============================\n');

// 1. Vérifier le fichier .env.local
console.log('1. Vérification du fichier .env.local...');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('✅ Fichier .env.local trouvé (' + envContent.length + ' caractères)');
  
  // Parser les variables
  const lines = envContent.split('\n');
  const env = {};
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  console.log('Variables d\'environnement:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Manquante');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante');
  
  if (env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('- URL Supabase:', env.NEXT_PUBLIC_SUPABASE_URL);
  }
  
  console.log('\n2. Test de connexion Supabase...');
  
  if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log('Client Supabase créé avec succès');
    
    // Test 1: Connexion basique
    console.log('\n🧪 Test 1: Connexion basique...');
    supabase.from('sales').select('count').limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Erreur lors du test basique:', error);
        } else {
          console.log('✅ Test basique réussi!');
          
          // Test 2: Récupération des ventes
          console.log('\n🧪 Test 2: Récupération des ventes...');
          return supabase.from('sales').select('*').limit(5);
        }
      })
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Erreur lors de la récupération des ventes:', error);
        } else {
          console.log('✅ Récupération des ventes réussie!');
          console.log('Nombre de ventes trouvées:', data ? data.length : 0);
          
          // Test 3: Test avec sale_items
          console.log('\n🧪 Test 3: Test avec sale_items...');
          return supabase.from('sales')
            .select('*, sale_items(id, product_name, quantity, unit_price, total_price)')
            .limit(3);
        }
      })
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Erreur lors du test avec sale_items:', error);
        } else {
          console.log('✅ Test avec sale_items réussi!');
          console.log('Données récupérées:', data ? data.length : 0, 'ventes');
        }
      })
      .catch(err => {
        console.error('❌ Erreur réseau globale:', err.message);
        console.error('Type d\'erreur:', err.name);
        if (err.code) {
          console.error('Code d\'erreur:', err.code);
        }
      });
      
  } else {
    console.log('❌ Variables d\'environnement manquantes, impossible de tester');
  }
  
} catch (err) {
  console.error('❌ Erreur lors de la lecture du fichier .env.local:', err.message);
}

console.log('\n3. Test de résolution DNS...');
const dns = require('dns');
dns.resolve('iwwgbmukenmxumfxibsz.supabase.co', (err, addresses) => {
  if (err) {
    console.error('❌ Erreur DNS:', err.message);
  } else {
    console.log('✅ Résolution DNS réussie:', addresses);
  }
});
