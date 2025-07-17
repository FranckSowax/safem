const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function enableRealtime() {
  console.log('🔄 Activation de Supabase Realtime pour SAFEM Dashboard');
  console.log('⏰ Heure actuelle:', new Date().toLocaleString('fr-FR'));
  
  console.log('\n📋 ÉTAPES POUR ACTIVER REALTIME:');
  console.log('1. Connectez-vous à votre projet Supabase');
  console.log('2. Allez dans Settings > API');
  console.log('3. Activez Realtime pour les tables suivantes:');
  console.log('   - ✅ sales (ventes)');
  console.log('   - ✅ sale_items (articles de vente)');
  console.log('   - ✅ products (produits)');
  console.log('   - ✅ inventory (stock)');
  
  console.log('\n🔧 CONFIGURATION REALTIME:');
  console.log('- URL du projet:', supabaseUrl);
  console.log('- Tables à surveiller: sales, sale_items, products, inventory');
  console.log('- Événements: INSERT, UPDATE, DELETE');
  
  // Test de connexion Realtime
  console.log('\n🧪 Test de connexion Realtime...');
  
  try {
    // Créer un canal de test
    const channel = supabase
      .channel('test-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' },
        (payload) => {
          console.log('📡 Événement Realtime reçu:', payload.eventType);
          console.log('📊 Données:', payload.new || payload.old);
        }
      )
      .subscribe((status) => {
        console.log('📡 Status Realtime:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime activé avec succès !');
          console.log('🔄 Le dashboard utilisera maintenant les mises à jour en temps réel');
          
          // Créer une vente de test pour vérifier
          setTimeout(async () => {
            console.log('\n🧪 Création d\'une vente de test pour vérifier Realtime...');
            
            const testSale = {
              client_name: `Test Realtime ${Date.now()}`,
              client_phone: '+241 06 11 22 33',
              total_amount: 1500,
              payment_method: 'cash',
              sale_date: new Date().toISOString(),
              status: 'completed'
            };
            
            const { data, error } = await supabase
              .from('sales')
              .insert(testSale)
              .select()
              .single();
            
            if (error) {
              console.error('❌ Erreur lors de la création de la vente test:', error);
            } else {
              console.log('✅ Vente test créée:', data.id);
              console.log('📡 Vous devriez voir un événement Realtime ci-dessus');
            }
            
            // Fermer le canal après le test
            setTimeout(() => {
              channel.unsubscribe();
              console.log('\n🔄 Test terminé - Canal Realtime fermé');
              console.log('💡 Rechargez le dashboard pour utiliser Realtime');
            }, 2000);
            
          }, 2000);
          
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ Erreur de connexion Realtime');
          console.log('💡 Vérifiez que Realtime est activé dans les paramètres Supabase');
        }
      });
    
  } catch (error) {
    console.error('❌ Erreur lors du test Realtime:', error);
  }
}

// Instructions pour modifier le hook useDashboard
function showRealtimeInstructions() {
  console.log('\n📝 INSTRUCTIONS POUR ACTIVER REALTIME DANS LE CODE:');
  console.log('');
  console.log('1. Ouvrez le fichier: src/frontend/src/hooks/useDashboard.js');
  console.log('2. Trouvez la ligne: const REALTIME_ENABLED = false;');
  console.log('3. Changez-la en: const REALTIME_ENABLED = true;');
  console.log('4. Sauvegardez le fichier');
  console.log('5. Le dashboard utilisera automatiquement Realtime');
  console.log('');
  console.log('📊 AVANTAGES DE REALTIME:');
  console.log('- ✅ Mises à jour instantanées (pas de délai de 5 secondes)');
  console.log('- ✅ Moins de requêtes serveur');
  console.log('- ✅ Synchronisation parfaite entre plusieurs utilisateurs');
  console.log('- ✅ Meilleure expérience utilisateur');
}

if (require.main === module) {
  enableRealtime();
  setTimeout(showRealtimeInstructions, 8000);
}

module.exports = { enableRealtime };
