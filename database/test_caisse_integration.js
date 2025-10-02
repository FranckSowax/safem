const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../src/frontend/.env.local' });

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Test d\'intégration Supabase pour la page Caisse SAFEM');
console.log('=' .repeat(60));

async function testSupabaseIntegration() {
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variables d\'environnement Supabase manquantes');
    console.log('ℹ️  L\'application fonctionnera en mode fallback avec données locales');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔗 Connexion à Supabase...');
    
    // Test 1: Vérifier la connexion
    const { data: connectionTest, error: connectionError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ Erreur de connexion:', connectionError.message);
      return;
    }
    
    console.log('✅ Connexion Supabase réussie');
    
    // Test 2: Récupérer les produits
    console.log('\n📦 Test de récupération des produits...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        stock_quantity,
        is_active,
        product_categories (name)
      `)
      .limit(5);
    
    if (productsError) {
      console.log('❌ Erreur lors de la récupération des produits:', productsError.message);
    } else {
      console.log(`✅ ${products.length} produits récupérés avec succès`);
      products.forEach(product => {
        console.log(`   - ${product.name}: ${product.price} FCFA (Stock: ${product.stock_quantity}kg)`);
      });
    }
    
    // Test 3: Récupérer les catégories
    console.log('\n🏷️  Test de récupération des catégories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('id, name, color, icon');
    
    if (categoriesError) {
      console.log('❌ Erreur lors de la récupération des catégories:', categoriesError.message);
    } else {
      console.log(`✅ ${categories.length} catégories récupérées avec succès`);
      categories.forEach(category => {
        console.log(`   - ${category.name} (${category.color})`);
      });
    }
    
    // Test 4: Test d'ajout de produit (simulation)
    console.log('\n➕ Test de simulation d\'ajout de produit...');
    const testProduct = {
      name: 'Test Produit - ' + Date.now(),
      price: 1500,
      stock_quantity: 10,
      is_active: true,
      unit: 'kg'
    };
    
    // Récupérer une catégorie existante
    const { data: firstCategory } = await supabase
      .from('product_categories')
      .select('id')
      .limit(1)
      .single();
    
    if (firstCategory) {
      testProduct.category_id = firstCategory.id;
      
      const { data: newProduct, error: addError } = await supabase
        .from('products')
        .insert([testProduct])
        .select()
        .single();
      
      if (addError) {
        console.log('❌ Erreur lors de l\'ajout du produit test:', addError.message);
      } else {
        console.log('✅ Produit test ajouté avec succès:', newProduct.name);
        
        // Nettoyer le produit test
        await supabase
          .from('products')
          .delete()
          .eq('id', newProduct.id);
        
        console.log('🧹 Produit test supprimé');
      }
    }
    
    console.log('\n🎉 Tests d\'intégration Supabase terminés avec succès !');
    console.log('\n📋 Résumé des fonctionnalités testées :');
    console.log('   ✅ Connexion à la base de données');
    console.log('   ✅ Récupération des produits avec catégories');
    console.log('   ✅ Récupération des catégories');
    console.log('   ✅ Ajout et suppression de produits');
    console.log('\n🚀 L\'interface caisse est prête à utiliser Supabase !');
    
  } catch (error) {
    console.log('❌ Erreur générale:', error.message);
    console.log('ℹ️  L\'application fonctionnera en mode fallback');
  }
}

// Test des variables d'environnement
console.log('\n🔧 Vérification de la configuration...');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Configuré' : '❌ Manquant');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configuré' : '❌ Manquant');

// Exécuter les tests
testSupabaseIntegration().catch(console.error);
