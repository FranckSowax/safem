const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalTest() {
  console.log('🎯 Test final de synchronisation caisse → dashboard');
  
  try {
    // État initial
    console.log('\n📊 État initial du dashboard...');
    
    const today = new Date().toISOString().split('T')[0];
    const { data: initialSales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    const initialRevenue = initialSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    
    console.log(`📈 Ventes initiales: ${initialSales.length}`);
    console.log(`💰 CA initial: ${initialRevenue.toLocaleString()} FCFA`);
    
    // Créer une vente comme depuis la caisse
    console.log('\n🛒 Simulation vente depuis la caisse...');
    
    const caisseSale = {
      client_name: 'Client Final Test',
      client_phone: '+241 06 11 22 33',
      total_amount: 4500,
      payment_method: 'cash',
      status: 'completed'
    };
    
    const { data: newSale, error: saleError } = await supabase
      .from('sales')
      .insert(caisseSale)
      .select()
      .single();
    
    if (saleError) {
      console.log('❌ Erreur vente:', saleError.message);
      return;
    }
    
    console.log(`✅ Vente créée: ${newSale.id} - ${newSale.total_amount} FCFA`);
    
    // Attendre 6 secondes (plus que l'intervalle de 5s)
    console.log('\n⏳ Attente de 6 secondes pour le rafraîchissement automatique...');
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Vérifier les nouvelles données
    console.log('\n📊 Vérification des données après rafraîchissement...');
    
    const { data: updatedSales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    const updatedRevenue = updatedSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    
    console.log(`📈 Ventes après: ${updatedSales.length} (+${updatedSales.length - initialSales.length})`);
    console.log(`💰 CA après: ${updatedRevenue.toLocaleString()} FCFA (+${(updatedRevenue - initialRevenue).toLocaleString()})`);
    
    // Vérifier les ventes récentes
    const { data: recentSales } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    console.log('\n📋 3 dernières ventes:');
    recentSales.forEach((sale, index) => {
      const time = new Date(sale.created_at).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      console.log(`   ${index + 1}. ${time} - ${sale.client_name} - ${sale.total_amount} FCFA`);
    });
    
    console.log('\n🎯 Instructions pour tester le dashboard:');
    console.log('1. 📱 Ouvrez http://localhost:3000 dans votre navigateur');
    console.log('2. 🔍 Ouvrez la console du navigateur (F12)');
    console.log('3. 👀 Cherchez les logs [useDashboard] pour voir les rafraîchissements');
    console.log('4. 🔄 Vous devriez voir des logs toutes les 5 secondes');
    console.log('5. 📊 Les KPIs devraient afficher:');
    console.log(`   - Ventes du jour: ${updatedSales.length}`);
    console.log(`   - Revenus du jour: ${updatedRevenue.toLocaleString()} FCFA`);
    console.log(`   - Vente moyenne: ${(updatedRevenue / updatedSales.length).toLocaleString()} FCFA`);
    
    console.log('\n💡 Si le dashboard ne se met pas à jour:');
    console.log('   - Vérifiez les logs dans la console du navigateur');
    console.log('   - Cliquez sur le bouton "Actualiser" dans le dashboard');
    console.log('   - Vérifiez que les variables d\'environnement sont correctes');
    console.log('   - Rechargez la page complètement');
    
  } catch (error) {
    console.error('❌ Erreur lors du test final:', error);
  }
}

if (require.main === module) {
  finalTest();
}

module.exports = { finalTest };
