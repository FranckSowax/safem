const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealtime() {
  console.log('🔄 Test de la synchronisation temps réel Supabase...');
  
  // Test 1: Vérifier la connexion Realtime
  console.log('\n📡 Configuration de l\'écoute temps réel...');
  
  const subscription = supabase
    .channel('test-realtime')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'sales' },
      (payload) => {
        console.log('🔔 CHANGEMENT DÉTECTÉ dans sales:', payload);
        console.log('  - Événement:', payload.eventType);
        console.log('  - Données:', payload.new || payload.old);
      }
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'sale_items' },
      (payload) => {
        console.log('🔔 CHANGEMENT DÉTECTÉ dans sale_items:', payload);
        console.log('  - Événement:', payload.eventType);
        console.log('  - Données:', payload.new || payload.old);
      }
    )
    .subscribe((status) => {
      console.log('📡 Statut de l\'abonnement:', status);
    });
  
  console.log('✅ Écoute temps réel configurée');
  console.log('⏳ En attente de changements... (30 secondes)');
  
  // Test 2: Créer une vente pour tester le temps réel
  setTimeout(async () => {
    console.log('\n🧪 Création d\'une vente de test...');
    
    const testSale = {
      client_name: 'Test Realtime Client',
      client_phone: '+241 77 88 99 00',
      total_amount: 5000,
      payment_method: 'cash',
      status: 'completed'
    };
    
    const { data: newSale, error } = await supabase
      .from('sales')
      .insert(testSale)
      .select()
      .single();
    
    if (error) {
      console.log('❌ Erreur création vente:', error.message);
    } else {
      console.log('✅ Vente créée:', newSale.id);
      
      // Ajouter un article
      setTimeout(async () => {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .limit(1);
        
        if (products && products.length > 0) {
          const testItem = {
            sale_id: newSale.id,
            product_id: products[0].id,
            product_name: products[0].name,
            quantity: 2,
            unit_price: products[0].price,
            total_price: products[0].price * 2
          };
          
          const { error: itemError } = await supabase
            .from('sale_items')
            .insert(testItem);
          
          if (itemError) {
            console.log('❌ Erreur article:', itemError.message);
          } else {
            console.log('✅ Article ajouté:', products[0].name);
          }
        }
      }, 2000);
    }
  }, 5000);
  
  // Test 3: Arrêter après 30 secondes
  setTimeout(() => {
    console.log('\n🔚 Arrêt du test temps réel');
    supabase.removeChannel(subscription);
    process.exit(0);
  }, 30000);
}

// Test 4: Vérifier si Realtime est activé
async function checkRealtimeStatus() {
  console.log('🔍 Vérification du statut Realtime...');
  
  try {
    // Tenter de créer un channel simple
    const testChannel = supabase.channel('status-test');
    
    testChannel.subscribe((status) => {
      console.log('📊 Statut du channel:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime est activé et fonctionnel');
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Erreur de channel Realtime');
      } else if (status === 'TIMED_OUT') {
        console.log('⏱️ Timeout de connexion Realtime');
      } else {
        console.log('⚠️ Statut inconnu:', status);
      }
      
      // Nettoyer et démarrer le test principal
      setTimeout(() => {
        supabase.removeChannel(testChannel);
        testRealtime();
      }, 2000);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification Realtime:', error);
    console.log('🔄 Tentative de test direct...');
    testRealtime();
  }
}

if (require.main === module) {
  checkRealtimeStatus();
}

module.exports = { testRealtime, checkRealtimeStatus };
