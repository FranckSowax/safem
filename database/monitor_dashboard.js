const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

let saleCounter = 1;

async function createTestSale() {
  const clients = [
    { name: 'Marie Nguema', phone: '+241 06 11 22 33' },
    { name: 'Jean-Baptiste Obame', phone: '+241 07 44 55 66' },
    { name: 'Fatima Bongo', phone: '+241 05 77 88 99' },
    { name: 'Pierre Mba', phone: '+241 06 33 44 55' },
    { name: 'Aïcha Ondimba', phone: '+241 07 66 77 88' }
  ];
  
  const amounts = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  
  const client = clients[Math.floor(Math.random() * clients.length)];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  
  const testSale = {
    client_name: `${client.name} (Test ${saleCounter})`,
    client_phone: client.phone,
    total_amount: amount,
    payment_method: Math.random() > 0.7 ? 'mobile_money' : 'cash',
    status: 'completed'
  };
  
  try {
    const { data: newSale, error } = await supabase
      .from('sales')
      .insert(testSale)
      .select()
      .single();
    
    if (error) {
      console.log(`❌ Erreur vente ${saleCounter}:`, error.message);
      return null;
    }
    
    console.log(`✅ Vente ${saleCounter} créée: ${newSale.client_name} - ${newSale.total_amount} FCFA`);
    saleCounter++;
    return newSale;
    
  } catch (error) {
    console.log(`❌ Erreur création vente ${saleCounter}:`, error.message);
    return null;
  }
}

async function getCurrentStats() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    const revenue = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    const average = todaySales.length > 0 ? revenue / todaySales.length : 0;
    
    return {
      count: todaySales.length,
      revenue: revenue,
      average: average
    };
  } catch (error) {
    console.log('❌ Erreur stats:', error.message);
    return { count: 0, revenue: 0, average: 0 };
  }
}

async function monitorDashboard() {
  console.log('🔍 Surveillance du dashboard SAFEM');
  console.log('📱 Dashboard: http://localhost:3001');
  console.log('🔧 Ouvrez la console du navigateur pour voir les logs [useDashboard]');
  console.log('⏰ Rafraîchissement automatique: toutes les 5 secondes');
  console.log('🛒 Création de ventes de test: toutes les 15 secondes');
  console.log('');
  
  // État initial
  const initialStats = await getCurrentStats();
  console.log(`📊 État initial: ${initialStats.count} ventes, ${initialStats.revenue.toLocaleString()} FCFA`);
  console.log('');
  
  // Créer des ventes de test périodiquement
  const saleInterval = setInterval(async () => {
    console.log(`\n🛒 [${new Date().toLocaleTimeString()}] Création d'une vente de test...`);
    
    const sale = await createTestSale();
    if (sale) {
      // Attendre 2 secondes puis afficher les nouvelles stats
      setTimeout(async () => {
        const newStats = await getCurrentStats();
        console.log(`📊 Nouvelles stats: ${newStats.count} ventes (+${newStats.count - initialStats.count}), ${newStats.revenue.toLocaleString()} FCFA (+${(newStats.revenue - initialStats.revenue).toLocaleString()})`);
        console.log(`💡 Le dashboard devrait se mettre à jour dans les 5 secondes suivantes...`);
      }, 2000);
    }
  }, 15000); // Toutes les 15 secondes
  
  // Afficher les stats périodiquement
  const statsInterval = setInterval(async () => {
    const stats = await getCurrentStats();
    const time = new Date().toLocaleTimeString();
    console.log(`\n📈 [${time}] Stats actuelles: ${stats.count} ventes, ${stats.revenue.toLocaleString()} FCFA, moyenne: ${stats.average.toLocaleString()} FCFA`);
  }, 30000); // Toutes les 30 secondes
  
  // Instructions périodiques
  setTimeout(() => {
    console.log('\n💡 Instructions de test:');
    console.log('1. 🌐 Ouvrez http://localhost:3001 dans votre navigateur');
    console.log('2. 🔍 Ouvrez les outils de développement (F12)');
    console.log('3. 📋 Allez dans l\'onglet "Console"');
    console.log('4. 👀 Cherchez les logs qui commencent par [useDashboard]');
    console.log('5. ⏰ Vous devriez voir des logs toutes les 5 secondes');
    console.log('6. 🔄 Les KPIs du dashboard devraient se mettre à jour automatiquement');
    console.log('');
  }, 5000);
  
  // Arrêter après 2 minutes
  setTimeout(() => {
    clearInterval(saleInterval);
    clearInterval(statsInterval);
    console.log('\n🏁 Surveillance terminée');
    console.log('💡 Le dashboard devrait maintenant afficher les données mises à jour');
    console.log('🔄 Si ce n\'est pas le cas, cliquez sur "Actualiser" dans le dashboard');
    process.exit(0);
  }, 120000); // 2 minutes
}

if (require.main === module) {
  monitorDashboard();
}

module.exports = { monitorDashboard, createTestSale };
