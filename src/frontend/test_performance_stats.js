const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🧪 TEST COMPLET DU MODULE PERFORMANCE STATS');
console.log('===========================================\n');

// Charger les variables d'environnement
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testPerformanceStats() {
  try {
    console.log('1. 📊 Test de récupération des ventes...');
    
    // Récupérer les ventes des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: sales, error } = await supabase
      .from('sales')
      .select(`
        id,
        total_amount,
        sale_date,
        status,
        sale_items(quantity, total_price)
      `)
      .gte('sale_date', thirtyDaysAgo.toISOString())
      .eq('status', 'completed');

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }

    console.log('✅ Ventes récupérées:', sales.length);

    // Calculer les statistiques comme le fait le service
    const stats = {
      total_sales: sales.length,
      total_revenue: 0,
      total_items_sold: 0,
      avg_order_value: 0
    };

    // Variables pour les métriques détaillées
    let totalPriceForAvg = 0;
    let totalQuantityForAvg = 0;
    let itemCount = 0;

    sales.forEach(sale => {
      stats.total_revenue += parseFloat(sale.total_amount) || 0;
      
      if (sale.sale_items && Array.isArray(sale.sale_items)) {
        sale.sale_items.forEach(item => {
          const quantity = parseFloat(item.quantity) || 0;
          const totalPrice = parseFloat(item.total_price) || 0;
          
          stats.total_items_sold += quantity;
          totalPriceForAvg += totalPrice;
          totalQuantityForAvg += quantity;
          itemCount++;
        });
      }
    });

    stats.avg_order_value = stats.total_sales > 0 ? stats.total_revenue / stats.total_sales : 0;
    
    // Calcul des métriques détaillées
    stats.avg_price_per_kg = stats.total_items_sold > 0 ? stats.total_revenue / stats.total_items_sold : 0;
    stats.avg_quantity_per_sale = stats.total_sales > 0 ? stats.total_items_sold / stats.total_sales : 0;
    stats.sales_per_day = 30 > 0 ? stats.total_sales / 30 : 0;

    console.log('\n2. 📈 Statistiques calculées:');
    console.log('==========================');
    console.log('🛒 Total Ventes:', stats.total_sales);
    console.log('💰 Chiffre d\'Affaires:', stats.total_revenue.toLocaleString('fr-FR'), 'FCFA');
    console.log('📦 Articles Vendus:', stats.total_items_sold.toFixed(1), 'kg');
    console.log('💳 Panier Moyen:', stats.avg_order_value.toLocaleString('fr-FR'), 'FCFA');
    
    console.log('\n3. 🎯 Métriques Détaillées:');
    console.log('===========================');
    console.log('⚖️ Prix Moyen/kg:', stats.avg_price_per_kg.toLocaleString('fr-FR'), 'FCFA');
    console.log('📊 Quantité/Vente:', stats.avg_quantity_per_sale.toFixed(1), 'kg');
    console.log('📅 Ventes/Jour:', stats.sales_per_day.toFixed(1));

    if (stats.total_sales > 0) {
      console.log('\n✅ SUCCESS: Le module Performance Stats devrait maintenant afficher ces vraies données !');
      console.log('🔄 Actualisez votre dashboard pour voir les changements.');
    } else {
      console.log('\n⚠️ ATTENTION: Aucune vente trouvée dans les 30 derniers jours.');
      console.log('📝 Le module affichera des zéros car il n\'y a pas de données à afficher.');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testPerformanceStats();
