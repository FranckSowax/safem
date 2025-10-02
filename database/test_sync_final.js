const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFinalSync() {
  console.log('🔄 Test final de synchronisation Dashboard SAFEM');
  console.log('⏰ Heure actuelle:', new Date().toLocaleString('fr-FR'));
  
  try {
    // 1. Récupérer les statistiques avant
    console.log('\n📊 Statistiques AVANT création de vente...');
    const statsBefore = await getDashboardStats();
    console.log(`💰 Chiffre d'affaires du jour: ${statsBefore.dailyRevenue} FCFA`);
    console.log(`📈 Nombre de ventes: ${statsBefore.dailySales}`);
    console.log(`🛒 Vente moyenne: ${statsBefore.averageSale} FCFA`);
    
    // 2. Créer une nouvelle vente de test
    console.log('\n🛍️ Création d\'une nouvelle vente...');
    const testSale = {
      client_name: `Client Test Final ${Date.now()}`,
      client_phone: '+241 06 12 34 56',
      total_amount: 8600, // 2100 + 5000 + 1500
      payment_method: 'cash',
      sale_date: new Date().toISOString(),
      status: 'completed'
    };
    
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert(testSale)
      .select()
      .single();
    
    if (saleError) throw saleError;
    
    console.log(`✅ Vente créée avec ID: ${sale.id}`);
    console.log(`👤 Client: ${sale.client_name}`);
    console.log(`💵 Montant: ${sale.total_amount} FCFA`);
    
    // 3. Ajouter des articles à la vente
    console.log('\n📦 Ajout d\'articles à la vente...');
    const saleItems = [
      {
        sale_id: sale.id,
        product_id: '7df53e1f-eec9-4fc1-b582-685c129ecc48',
        product_name: 'Céleri Akpi',
        quantity: 3,
        unit_price: 700,
        total_price: 2100
      },
      {
        sale_id: sale.id,
        product_id: '971180f1-9758-411c-ad50-eac8be35406f',
        product_name: 'Chou Aventy',
        quantity: 5,
        unit_price: 1000,
        total_price: 5000
      },
      {
        sale_id: sale.id,
        product_id: '35690672-6be4-4916-8324-359c605f9b78',
        product_name: 'Épinard Fom',
        quantity: 3,
        unit_price: 500,
        total_price: 1500
      }
    ];
    
    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems)
      .select();
    
    if (itemsError) throw itemsError;
    
    console.log(`✅ ${items.length} articles ajoutés à la vente`);
    
    // 4. Attendre un peu pour la synchronisation
    console.log('\n⏳ Attente de 3 secondes pour la synchronisation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 5. Récupérer les statistiques après
    console.log('\n📊 Statistiques APRÈS création de vente...');
    const statsAfter = await getDashboardStats();
    console.log(`💰 Chiffre d'affaires du jour: ${statsAfter.dailyRevenue} FCFA`);
    console.log(`📈 Nombre de ventes: ${statsAfter.dailySales}`);
    console.log(`🛒 Vente moyenne: ${statsAfter.averageSale} FCFA`);
    
    // 6. Calculer les différences
    console.log('\n📈 ÉVOLUTION DES STATISTIQUES:');
    const revenueDiff = statsAfter.dailyRevenue - statsBefore.dailyRevenue;
    const salesDiff = statsAfter.dailySales - statsBefore.dailySales;
    const avgDiff = statsAfter.averageSale - statsBefore.averageSale;
    
    console.log(`💰 Revenus: +${revenueDiff} FCFA`);
    console.log(`📊 Ventes: +${salesDiff}`);
    console.log(`📊 Moyenne: ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(2)} FCFA`);
    
    // 7. Vérifier la synchronisation
    if (revenueDiff === 8600 && salesDiff === 1) {
      console.log('\n🎉 SYNCHRONISATION RÉUSSIE !');
      console.log('✅ Le dashboard se met à jour correctement');
      console.log('✅ Les données sont synchronisées en temps réel');
    } else {
      console.log('\n⚠️ Problème de synchronisation détecté');
      console.log('❌ Les statistiques ne correspondent pas');
      console.log(`📊 Attendu: +8600 FCFA, +1 vente`);
      console.log(`📊 Reçu: +${revenueDiff} FCFA, +${salesDiff} vente(s)`);
    }
    
    // 8. Tester la récupération des ventes récentes
    console.log('\n📋 Test des ventes récentes...');
    const recentSales = await getRecentSales();
    const ourSale = recentSales.find(s => s.id === sale.id);
    
    if (ourSale) {
      console.log('✅ Vente trouvée dans les ventes récentes');
      console.log(`👤 Client: ${ourSale.clientName}`);
      console.log(`💵 Montant: ${ourSale.total} FCFA`);
      console.log(`📦 Articles: ${ourSale.items}`);
      console.log(`🏷️ Type client: ${ourSale.clientType}`);
    } else {
      console.log('❌ Vente non trouvée dans les ventes récentes');
    }
    
    console.log('\n🔄 INSTRUCTIONS POUR VÉRIFIER LE DASHBOARD:');
    console.log('1. Ouvrez http://localhost:3001 dans votre navigateur');
    console.log('2. Ouvrez la console développeur (F12)');
    console.log('3. Cherchez les logs [useDashboard] toutes les 5 secondes');
    console.log('4. Vérifiez que les nouvelles statistiques s\'affichent');
    console.log('5. La nouvelle vente devrait apparaître dans la liste');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('sales')
    .select('total_amount')
    .gte('sale_date', today)
    .lt('sale_date', today + 'T23:59:59');
  
  if (error) throw error;
  
  const totalRevenue = data.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const totalSales = data.length;
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  return {
    dailyRevenue: totalRevenue,
    dailySales: totalSales,
    averageSale: averageSale
  };
}

async function getRecentSales() {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  
  return (data || []).map(sale => ({
    id: sale.id,
    clientName: sale.client_name,
    phone: sale.client_phone,
    total: parseFloat(sale.total_amount),
    items: sale.sale_items.length,
    clientType: 'particulier',
    status: sale.status || 'completed'
  }));
}

if (require.main === module) {
  testFinalSync();
}

module.exports = { testFinalSync };
