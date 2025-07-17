const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyInventoryFix() {
  console.log('🔧 Application du correctif pour la table inventory...');
  
  try {
    // Vérifier d'abord si les colonnes existent
    console.log('📋 Vérification de la structure actuelle...');
    
    const { data: inventoryData, error: selectError } = await supabase
      .from('inventory')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Erreur lors de la vérification:', selectError.message);
      return;
    }
    
    console.log('✅ Table inventory accessible');
    
    // Tester une insertion pour voir si l'erreur persiste
    console.log('\n🧪 Test d\'insertion dans inventory...');
    
    // Récupérer un produit pour le test
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (!products || products.length === 0) {
      console.log('❌ Aucun produit trouvé pour le test');
      return;
    }
    
    const testInventoryEntry = {
      product_id: products[0].id,
      quantity_in: 10.0,
      quantity_out: 0.0,
      current_stock: 10.0,
      movement_type: 'stock_in',
      reference_type: 'manual',
      unit_cost: 500.0,
      total_value: 5000.0,
      notes: 'Test d\'insertion après correctif'
    };
    
    const { data: insertedEntry, error: insertError } = await supabase
      .from('inventory')
      .insert(testInventoryEntry)
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Erreur d\'insertion:', insertError.message);
      console.log('💡 Vous devez exécuter le correctif SQL manuellement:');
      console.log('   ALTER TABLE inventory ADD COLUMN IF NOT EXISTS unit_cost DECIMAL(10,2);');
      console.log('   ALTER TABLE inventory ADD COLUMN IF NOT EXISTS total_value DECIMAL(12,2);');
      return;
    }
    
    console.log('✅ Insertion réussie dans inventory:', insertedEntry.id);
    
    // Test avec une vente pour voir si l'erreur persiste
    console.log('\n🛒 Test de création de vente après correctif...');
    
    const testSale = {
      client_name: 'Test Correctif Inventory',
      client_phone: '+241 07 88 99 00',
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
      console.log('❌ Erreur création vente:', saleError.message);
      return;
    }
    
    console.log('✅ Vente créée:', newSale.id);
    
    // Ajouter un article à la vente
    const testItem = {
      sale_id: newSale.id,
      product_id: products[0].id,
      product_name: products[0].name,
      quantity: 2,
      unit_price: products[0].price,
      total_price: products[0].price * 2
    };
    
    const { data: createdItem, error: itemError } = await supabase
      .from('sale_items')
      .insert(testItem)
      .select()
      .single();
    
    if (itemError) {
      console.error('❌ Erreur article:', itemError.message);
      
      if (itemError.message.includes('unit_cost')) {
        console.log('⚠️ L\'erreur unit_cost persiste. Correctif nécessaire.');
        console.log('📝 Exécutez ce SQL dans Supabase SQL Editor:');
        console.log('   ALTER TABLE inventory ADD COLUMN IF NOT EXISTS unit_cost DECIMAL(10,2);');
        console.log('   ALTER TABLE inventory ADD COLUMN IF NOT EXISTS total_value DECIMAL(12,2);');
      }
    } else {
      console.log('✅ Article créé sans erreur:', createdItem.id);
      console.log('🎉 Correctif appliqué avec succès !');
    }
    
    // Statistiques finales
    console.log('\n📊 Statistiques après correctif:');
    
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    const todayRevenue = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    
    console.log(`📈 Ventes du jour: ${todaySales.length}`);
    console.log(`💰 CA du jour: ${todayRevenue.toLocaleString()} FCFA`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application du correctif:', error);
  }
}

if (require.main === module) {
  applyInventoryFix();
}

module.exports = { applyInventoryFix };
