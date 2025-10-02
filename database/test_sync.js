const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSyncFlow() {
  console.log('🔄 Test du flux de synchronisation SAFEM...');
  
  try {
    // Étape 1: Compter les ventes actuelles
    console.log('\n📊 État initial...');
    const { data: initialSales, error: initialError } = await supabase
      .from('sales')
      .select('*');
    
    if (initialError) {
      console.log('❌ Erreur lecture initiale:', initialError.message);
      return;
    }
    
    console.log(`✅ Ventes actuelles: ${initialSales.length}`);
    
    // Étape 2: Créer une nouvelle vente
    console.log('\n🛒 Création d\'une nouvelle vente...');
    const newSale = {
      client_name: `Test Client ${Date.now()}`,
      client_phone: '+241 06 12 34 56',
      total_amount: 2500,
      payment_method: 'cash',
      status: 'completed'
    };
    
    const { data: createdSale, error: saleError } = await supabase
      .from('sales')
      .insert(newSale)
      .select()
      .single();
    
    if (saleError) {
      console.log('❌ Erreur création vente:', saleError.message);
      return;
    }
    
    console.log(`✅ Vente créée: ${createdSale.id}`);
    console.log(`   Client: ${createdSale.client_name}`);
    console.log(`   Montant: ${createdSale.total_amount} FCFA`);
    
    // Étape 3: Ajouter des articles à la vente
    console.log('\n📦 Ajout d\'articles...');
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(3);
    
    if (products && products.length > 0) {
      const items = products.map((product, index) => ({
        sale_id: createdSale.id,
        product_id: product.id,
        product_name: product.name,
        quantity: index + 1,
        unit_price: product.price,
        total_price: product.price * (index + 1)
      }));
      
      const { data: createdItems, error: itemsError } = await supabase
        .from('sale_items')
        .insert(items)
        .select();
      
      if (itemsError) {
        console.log('❌ Erreur articles:', itemsError.message);
      } else {
        console.log(`✅ ${createdItems.length} articles ajoutés`);
        createdItems.forEach(item => {
          console.log(`   - ${item.product_name}: ${item.quantity} x ${item.unit_price} = ${item.total_price} FCFA`);
        });
      }
    }
    
    // Étape 4: Vérifier le total après création
    console.log('\n📈 Vérification post-création...');
    const { data: finalSales } = await supabase
      .from('sales')
      .select('*');
    
    console.log(`✅ Total ventes après création: ${finalSales.length}`);
    console.log(`📊 Différence: +${finalSales.length - initialSales.length}`);
    
    // Étape 5: Tester les statistiques (comme le dashboard)
    console.log('\n📊 Test des statistiques dashboard...');
    
    // Ventes du jour
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    console.log(`✅ Ventes du jour: ${todaySales.length}`);
    
    // Calcul du chiffre d'affaires du jour
    const todayRevenue = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    console.log(`💰 CA du jour: ${todayRevenue.toLocaleString()} FCFA`);
    
    // Ventes récentes
    const { data: recentSales } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    console.log(`📋 Ventes récentes: ${recentSales.length}`);
    recentSales.forEach((sale, index) => {
      const time = new Date(sale.created_at).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      console.log(`   ${index + 1}. ${time} - ${sale.client_name} - ${sale.total_amount} FCFA`);
    });
    
    // Étape 6: Simuler un rafraîchissement dashboard
    console.log('\n🔄 Simulation rafraîchissement dashboard...');
    
    const dashboardData = {
      todaySales: todaySales,
      recentSales: recentSales,
      kpis: {
        dailyRevenue: todayRevenue,
        dailySales: todaySales.length,
        averageSale: todaySales.length > 0 ? todayRevenue / todaySales.length : 0
      }
    };
    
    console.log('✅ Données dashboard simulées:');
    console.log(`   - Ventes du jour: ${dashboardData.kpis.dailySales}`);
    console.log(`   - Revenus du jour: ${dashboardData.kpis.dailyRevenue.toLocaleString()} FCFA`);
    console.log(`   - Vente moyenne: ${dashboardData.kpis.averageSale.toLocaleString()} FCFA`);
    
    console.log('\n🎉 Test de synchronisation terminé !');
    console.log('💡 Si le dashboard ne se met pas à jour, vérifiez:');
    console.log('   1. Le rafraîchissement automatique (toutes les 5 secondes)');
    console.log('   2. Le bouton "Actualiser" dans le dashboard');
    console.log('   3. La console du navigateur pour les erreurs');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

if (require.main === module) {
  testSyncFlow();
}

module.exports = { testSyncFlow };
