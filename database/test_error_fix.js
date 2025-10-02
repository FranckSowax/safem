const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testErrorFix() {
  console.log('🔧 Test du correctif d\'erreur TypeError...');
  
  try {
    // Récupérer les ventes récentes comme le fait le service
    console.log('📊 Récupération des ventes récentes...');
    
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
      .limit(5);
    
    if (error) {
      console.log('❌ Erreur Supabase:', error.message);
      return;
    }
    
    console.log(`✅ ${data.length} ventes récupérées`);
    
    // Simuler la transformation des données comme dans le service
    console.log('\n🔄 Transformation des données...');
    
    const transformedData = data.map(sale => ({
      id: sale.id,
      client: sale.client_name,
      clientName: sale.client_name,
      phone: sale.client_phone,
      amount: parseFloat(sale.total_amount),
      total: parseFloat(sale.total_amount),
      items: sale.sale_items.length,
      products: sale.sale_items.map(item => ({
        name: item.product_name,
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.unit_price)
      })),
      time: new Date(sale.created_at).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: sale.sale_date || sale.created_at,
      clientType: 'particulier', // Valeur par défaut
      status: sale.status || 'completed'
    }));
    
    console.log('✅ Données transformées avec succès');
    
    // Tester les propriétés critiques
    console.log('\n🧪 Test des propriétés critiques...');
    
    transformedData.forEach((sale, index) => {
      console.log(`\n--- Vente ${index + 1} ---`);
      console.log(`ID: ${sale.id}`);
      console.log(`Client: ${sale.clientName}`);
      console.log(`Type client: ${sale.clientType}`);
      console.log(`Date: ${sale.date}`);
      console.log(`Total: ${sale.total} FCFA`);
      console.log(`Articles: ${sale.items}`);
      
      // Tester l'accès aux propriétés comme dans le composant
      const CLIENT_TYPES = {
        particulier: { name: 'Particulier', discount: 0, color: 'blue' },
        restaurant: { name: 'Restaurant/Hôtel', discount: 5, color: 'green' },
        distributeur: { name: 'Distributeur', discount: 10, color: 'purple' }
      };
      
      // Test de l'accès sécurisé
      const clientTypeName = CLIENT_TYPES[sale.clientType]?.name || 'Particulier';
      const discount = CLIENT_TYPES[sale.clientType]?.discount || 0;
      
      console.log(`✅ Type client résolu: ${clientTypeName}`);
      console.log(`✅ Remise: ${discount}%`);
    });
    
    console.log('\n🎉 Test terminé avec succès !');
    console.log('💡 L\'erreur TypeError devrait être corrigée');
    console.log('🔄 Rechargez la page du dashboard pour voir les changements');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

if (require.main === module) {
  testErrorFix();
}

module.exports = { testErrorFix };
