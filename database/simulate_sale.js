const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateCaisseSale() {
  console.log('🛒 Simulation d\'une vente depuis la caisse SAFEM...');
  
  try {
    // Récupérer quelques produits
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(3);
    
    if (!products || products.length === 0) {
      console.log('❌ Aucun produit trouvé');
      return;
    }
    
    // Créer une vente réaliste
    const clientNames = [
      'Marie Mbadinga',
      'Jean-Pierre Nzé',
      'Fatou Diallo',
      'Paul Obiang',
      'Aminata Traoré'
    ];
    
    const randomClient = clientNames[Math.floor(Math.random() * clientNames.length)];
    const randomPhone = `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`;
    
    // Sélectionner 1-3 produits aléatoirement
    const selectedProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
    
    // Calculer le total
    let totalAmount = 0;
    const items = selectedProducts.map(product => {
      const quantity = Math.random() * 3 + 0.5; // Entre 0.5 et 3.5
      const roundedQuantity = Math.round(quantity * 2) / 2; // Arrondir à 0.5
      const itemTotal = product.price * roundedQuantity;
      totalAmount += itemTotal;
      
      return {
        product_id: product.id,
        product_name: product.name,
        quantity: roundedQuantity,
        unit_price: product.price,
        total_price: itemTotal
      };
    });
    
    console.log(`👤 Client: ${randomClient}`);
    console.log(`📞 Téléphone: ${randomPhone}`);
    console.log(`🛍️ Articles:`);
    items.forEach(item => {
      console.log(`   - ${item.product_name}: ${item.quantity} x ${item.unit_price} = ${item.total_price} FCFA`);
    });
    console.log(`💰 Total: ${totalAmount} FCFA`);
    
    // Créer la vente
    const saleData = {
      client_name: randomClient,
      client_phone: randomPhone,
      total_amount: totalAmount,
      payment_method: Math.random() > 0.7 ? 'mobile_money' : 'cash',
      status: 'completed'
    };
    
    const { data: newSale, error: saleError } = await supabase
      .from('sales')
      .insert(saleData)
      .select()
      .single();
    
    if (saleError) {
      console.log('❌ Erreur création vente:', saleError.message);
      return;
    }
    
    console.log(`✅ Vente créée avec ID: ${newSale.id}`);
    
    // Ajouter les articles
    const itemsWithSaleId = items.map(item => ({
      ...item,
      sale_id: newSale.id
    }));
    
    const { data: createdItems, error: itemsError } = await supabase
      .from('sale_items')
      .insert(itemsWithSaleId)
      .select();
    
    if (itemsError) {
      console.log('❌ Erreur articles:', itemsError.message);
    } else {
      console.log(`✅ ${createdItems.length} articles ajoutés`);
    }
    
    // Afficher les statistiques mises à jour
    console.log('\n📊 Statistiques mises à jour:');
    
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySales } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);
    
    const todayRevenue = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
    
    console.log(`📈 Ventes du jour: ${todaySales.length}`);
    console.log(`💰 CA du jour: ${todayRevenue.toLocaleString()} FCFA`);
    console.log(`📊 Vente moyenne: ${(todayRevenue / todaySales.length).toLocaleString()} FCFA`);
    
    console.log('\n🔄 Le dashboard devrait se mettre à jour dans les 5 secondes...');
    console.log('👀 Vérifiez votre dashboard sur http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
  }
}

if (require.main === module) {
  simulateCaisseSale();
}

module.exports = { simulateCaisseSale };
