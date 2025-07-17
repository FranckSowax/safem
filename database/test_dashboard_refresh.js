const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDashboardRefresh() {
  console.log('🔄 Test du rafraîchissement du dashboard...');
  
  try {
    // Simuler le comportement du DashboardService
    console.log('\n📊 Récupération des données comme le dashboard...');
    
    // 1. Ventes du jour
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySales, error: todayError } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    if (todayError) {
      console.log('❌ Erreur ventes du jour:', todayError.message);
      return;
    }
    
    console.log(`✅ Ventes du jour: ${todaySales.length}`);
    
    // 2. Ventes récentes
    const { data: recentSales, error: recentError } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.log('❌ Erreur ventes récentes:', recentError.message);
      return;
    }
    
    console.log(`✅ Ventes récentes: ${recentSales.length}`);
    
    // 3. Calcul des KPIs
    const todayRevenue = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    const averageSale = todaySales.length > 0 ? todayRevenue / todaySales.length : 0;
    
    console.log(`💰 Revenus du jour: ${todayRevenue.toLocaleString()} FCFA`);
    console.log(`📊 Vente moyenne: ${averageSale.toLocaleString()} FCFA`);
    
    // 4. Simuler plusieurs rafraîchissements
    console.log('\n🔄 Simulation de rafraîchissements successifs...');
    
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Rafraîchissement ${i} ---`);
      
      // Créer une nouvelle vente
      const testSale = {
        client_name: `Test Refresh ${i} - ${Date.now()}`,
        client_phone: '+241 07 77 77 77',
        total_amount: 1000 + (i * 500),
        payment_method: 'cash',
        status: 'completed'
      };
      
      const { data: newSale, error: saleError } = await supabase
        .from('sales')
        .insert(testSale)
        .select()
        .single();
      
      if (saleError) {
        console.log(`❌ Erreur création vente ${i}:`, saleError.message);
        continue;
      }
      
      console.log(`✅ Vente ${i} créée: ${newSale.total_amount} FCFA`);
      
      // Attendre 2 secondes puis récupérer les nouvelles données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: updatedSales } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      
      const newRevenue = updatedSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
      
      console.log(`📈 Nouvelles données: ${updatedSales.length} ventes, ${newRevenue.toLocaleString()} FCFA`);
      console.log(`🔄 Différence: +${updatedSales.length - todaySales.length} ventes, +${(newRevenue - todayRevenue).toLocaleString()} FCFA`);
    }
    
    // 5. Test de l'endpoint de statistiques
    console.log('\n📊 Test des statistiques complètes...');
    
    const { data: allSales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    const finalRevenue = allSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    
    console.log(`📊 Statistiques finales:`);
    console.log(`   - Ventes: ${allSales.length}`);
    console.log(`   - Revenus: ${finalRevenue.toLocaleString()} FCFA`);
    console.log(`   - Moyenne: ${(finalRevenue / allSales.length).toLocaleString()} FCFA`);
    
    // 6. Vérifier les données récentes
    const { data: latestSales } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    console.log(`\n📋 5 dernières ventes:`);
    latestSales.forEach((sale, index) => {
      const time = new Date(sale.created_at).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      console.log(`   ${index + 1}. ${time} - ${sale.client_name} - ${sale.total_amount} FCFA`);
    });
    
    console.log('\n✅ Test terminé !');
    console.log('💡 Si le dashboard ne se met pas à jour:');
    console.log('   1. Vérifiez la console du navigateur pour les erreurs');
    console.log('   2. Cliquez sur le bouton "Actualiser" dans le dashboard');
    console.log('   3. Rechargez la page du dashboard');
    console.log('   4. Vérifiez que l\'application utilise les bonnes variables d\'environnement');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

if (require.main === module) {
  testDashboardRefresh();
}

module.exports = { testDashboardRefresh };
