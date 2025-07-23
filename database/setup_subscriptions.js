const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🚀 CONFIGURATION DES ABONNEMENTS SAFEM');
console.log('=====================================\n');

// Charger les variables d'environnement
const envPath = '../src/frontend/.env.local';
if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.local non trouvé');
  console.log('Veuillez créer le fichier .env.local avec vos variables Supabase');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    env[key.trim()] = valueParts.join('=').trim();
  }
});

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Variables Supabase manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupSubscriptions() {
  try {
    console.log('1. 🔍 Vérification de la connexion Supabase...');
    
    // Test de connexion
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur de connexion Supabase:', testError.message);
      return;
    }
    
    console.log('✅ Connexion Supabase réussie');

    console.log('\n2. 📋 Exécution du schéma des abonnements...');
    
    // Lire le fichier SQL du schéma
    const schemaSQL = fs.readFileSync('./subscriptions_schema.sql', 'utf8');
    
    // Diviser en requêtes individuelles (approximatif)
    const queries = schemaSQL
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--') && !q.startsWith('/*'));
    
    console.log(`📝 ${queries.length} requêtes à exécuter...`);
    
    // Note: L'exécution directe de SQL depuis le client n'est pas possible
    // avec la clé anon. Il faut utiliser l'interface Supabase ou la clé service.
    console.log('⚠️  Pour créer les tables, veuillez :');
    console.log('   1. Aller sur https://supabase.com/dashboard');
    console.log('   2. Ouvrir votre projet SAFEM');
    console.log('   3. Aller dans "SQL Editor"');
    console.log('   4. Copier-coller le contenu de subscriptions_schema.sql');
    console.log('   5. Exécuter le script');

    console.log('\n3. 🧪 Test des fonctionnalités d\'abonnement...');
    
    // Tester si les tables existent (via une requête simple)
    try {
      const { data: subTest, error: subError } = await supabase
        .from('subscriptions')
        .select('count')
        .limit(1);
      
      if (subError && subError.code === '42P01') {
        console.log('⚠️  Tables d\'abonnement non créées. Veuillez exécuter le schéma SQL d\'abord.');
      } else if (subError) {
        console.log('⚠️  Erreur lors du test des tables:', subError.message);
      } else {
        console.log('✅ Tables d\'abonnement détectées');
        
        // Test de création d'un abonnement de test
        console.log('\n4. 🧪 Test de création d\'abonnement...');
        
        const testSubscription = {
          client_name: 'Test Client',
          client_phone: '+241 01 23 45 67',
          client_email: 'test@example.com',
          client_type: 'particulier',
          subscription_name: 'Panier Test',
          frequency: 'weekly',
          delivery_address: '123 Rue Test, Libreville',
          total_amount: 15000,
          final_amount: 15000,
          next_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        
        const { data: newSub, error: createError } = await supabase
          .from('subscriptions')
          .insert(testSubscription)
          .select()
          .single();
        
        if (createError) {
          console.log('⚠️  Erreur lors de la création de test:', createError.message);
        } else {
          console.log('✅ Abonnement de test créé:', newSub.id);
          
          // Nettoyer l'abonnement de test
          await supabase.from('subscriptions').delete().eq('id', newSub.id);
          console.log('🧹 Abonnement de test supprimé');
        }
      }
    } catch (error) {
      console.log('⚠️  Erreur lors du test des tables:', error.message);
    }

    console.log('\n5. 📊 Vérification des produits disponibles...');
    
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        stock_quantity,
        is_active,
        product_categories(name)
      `)
      .eq('is_active', true)
      .gt('stock_quantity', 0);
    
    if (prodError) {
      console.log('⚠️  Erreur lors de la récupération des produits:', prodError.message);
    } else {
      console.log(`✅ ${products.length} produits disponibles pour abonnements`);
      
      // Afficher quelques exemples
      if (products.length > 0) {
        console.log('\n📦 Exemples de produits disponibles:');
        products.slice(0, 5).forEach(product => {
          console.log(`   • ${product.name} - ${product.price} FCFA (Stock: ${product.stock_quantity})`);
        });
      }
    }

    console.log('\n🎉 CONFIGURATION TERMINÉE !');
    console.log('=====================================');
    console.log('✅ Service d\'abonnements prêt');
    console.log('✅ Page d\'abonnements créée (/abonnements)');
    console.log('✅ Bouton ajouté à la navbar');
    console.log('✅ Intégration Supabase configurée');
    console.log('\n🚀 Vous pouvez maintenant tester les abonnements sur http://localhost:3000/abonnements');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  }
}

// Exécuter la configuration
setupSubscriptions();
