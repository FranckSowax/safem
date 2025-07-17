const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAppConnection() {
  console.log('🔍 Test de connexion SAFEM avec Supabase...');
  
  try {
    // Test 1: Vérifier les tables essentielles
    console.log('\n📋 Vérification des tables...');
    
    const tables = ['clients', 'product_categories', 'products', 'sales', 'sale_items'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }
    
    // Test 2: Compter les enregistrements
    console.log('\n📊 Comptage des données...');
    
    const { data: categories, error: catError } = await supabase
      .from('product_categories')
      .select('*');
    
    if (!catError) {
      console.log(`✅ Catégories: ${categories.length} trouvées`);
    }
    
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*');
    
    if (!prodError) {
      console.log(`✅ Produits: ${products.length} trouvés`);
    }
    
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*');
    
    if (!salesError) {
      console.log(`✅ Ventes: ${sales.length} trouvées`);
    }
    
    // Test 3: Créer une vente de test
    console.log('\n🧪 Test de création de vente...');
    
    const testSale = {
      client_name: 'Client Test SAFEM',
      client_phone: '+241 01 23 45 67',
      total_amount: 3000,
      payment_method: 'cash',
      status: 'completed'
    };
    
    const { data: newSale, error: saleError } = await supabase
      .from('sales')
      .insert(testSale)
      .select()
      .single();
    
    if (saleError) {
      console.log(`❌ Création vente: ${saleError.message}`);
    } else {
      console.log(`✅ Vente créée: ${newSale.id}`);
      
      // Ajouter un article à la vente
      if (products && products.length > 0) {
        const testItem = {
          sale_id: newSale.id,
          product_id: products[0].id,
          product_name: products[0].name,
          quantity: 1.5,
          unit_price: products[0].price,
          total_price: products[0].price * 1.5
        };
        
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert(testItem);
        
        if (itemError) {
          console.log(`❌ Création article: ${itemError.message}`);
        } else {
          console.log(`✅ Article ajouté: ${products[0].name}`);
        }
      }
    }
    
    // Test 4: Statistiques finales
    console.log('\n📈 Statistiques finales...');
    
    const { data: finalSales } = await supabase
      .from('sales')
      .select('*');
    
    const { data: finalItems } = await supabase
      .from('sale_items')
      .select('*');
    
    console.log(`📊 Total ventes: ${finalSales?.length || 0}`);
    console.log(`📦 Total articles: ${finalItems?.length || 0}`);
    
    if (finalSales && finalSales.length > 0) {
      const totalRevenue = finalSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
      console.log(`💰 Chiffre d'affaires total: ${totalRevenue.toLocaleString()} FCFA`);
    }
    
    console.log('\n🎉 Test de connexion terminé !');
    console.log('🔗 Votre application SAFEM peut maintenant utiliser Supabase');
    console.log('📱 Testez sur http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Erreur de test:', error);
  }
}

if (require.main === module) {
  testAppConnection();
}

module.exports = { testAppConnection };
