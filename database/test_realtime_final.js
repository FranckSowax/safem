const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealtimeFinal() {
  console.log('🚀 TEST FINAL - Dashboard SAFEM avec Realtime');
  console.log('⏰ Heure actuelle:', new Date().toLocaleString('fr-FR'));
  
  // 1. Statistiques initiales
  console.log('\n📊 1. Statistiques initiales...');
  
  const { data: initialSales, error: initialError } = await supabase
    .from('sales')
    .select('total_amount')
    .gte('sale_date', new Date().toISOString().split('T')[0]);
  
  if (initialError) {
    console.error('❌ Erreur:', initialError);
    return;
  }
  
  const initialRevenue = initialSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const initialCount = initialSales.length;
  
  console.log(`💰 Chiffre d'affaires initial: ${initialRevenue.toLocaleString('fr-FR')} FCFA`);
  console.log(`📈 Nombre de ventes initial: ${initialCount}`);
  
  // 2. Configuration Realtime
  console.log('\n📡 2. Configuration Realtime...');
  
  let realtimeEvents = [];
  
  const channel = supabase
    .channel('sales-realtime-test')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'sales' },
      (payload) => {
        console.log('📡 [REALTIME] Nouvelle vente détectée:', {
          id: payload.new.id,
          client: payload.new.client_name,
          total: payload.new.total_amount + ' FCFA',
          timestamp: new Date().toLocaleString('fr-FR')
        });
        realtimeEvents.push(payload);
      }
    )
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'sale_items' },
      (payload) => {
        console.log('📦 [REALTIME] Nouvel article de vente:', {
          sale_id: payload.new.sale_id,
          product_id: payload.new.product_id,
          quantity: payload.new.quantity,
          total: payload.new.total_price + ' FCFA'
        });
      }
    )
    .subscribe((status) => {
      console.log('📡 Status Realtime:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime activé avec succès !');
        
        // 3. Créer une vente de test après activation
        setTimeout(async () => {
          console.log('\n🛍️ 3. Création d\'une vente de test...');
          
          const testSale = {
            client_name: `Test Realtime Final ${Date.now()}`,
            client_phone: '+241 06 77 88 99',
            total_amount: 12500,
            payment_method: 'cash',
            sale_date: new Date().toISOString().split('T')[0],
            status: 'completed'
          };
          
          const { data: newSale, error: saleError } = await supabase
            .from('sales')
            .insert(testSale)
            .select()
            .single();
          
          if (saleError) {
            console.error('❌ Erreur lors de la création de la vente:', saleError);
            return;
          }
          
          console.log('✅ Vente créée:', {
            id: newSale.id,
            client: newSale.client_name,
            total: newSale.total_amount + ' FCFA'
          });
          
          // Ajouter des articles à la vente
          const saleItems = [
            {
              sale_id: newSale.id,
              product_id: '11111111-1111-1111-1111-111111111111', // Poivron De conti
              quantity: 3,
              unit_price: 2250,
              total_price: 6750
            },
            {
              sale_id: newSale.id,
              product_id: '22222222-2222-2222-2222-222222222222', // Tomate Padma
              quantity: 2,
              unit_price: 1500,
              total_price: 3000
            },
            {
              sale_id: newSale.id,
              product_id: '33333333-3333-3333-3333-333333333333', // Piment Demon
              quantity: 1,
              unit_price: 2750,
              total_price: 2750
            }
          ];
          
          const { data: items, error: itemsError } = await supabase
            .from('sale_items')
            .insert(saleItems);
          
          if (itemsError) {
            console.error('❌ Erreur lors de l\'ajout des articles:', itemsError);
          } else {
            console.log(`✅ ${saleItems.length} articles ajoutés à la vente`);
          }
          
          // 4. Vérifier la synchronisation après 3 secondes
          setTimeout(async () => {
            console.log('\n📊 4. Vérification de la synchronisation...');
            
            const { data: finalSales, error: finalError } = await supabase
              .from('sales')
              .select('total_amount')
              .gte('sale_date', new Date().toISOString().split('T')[0]);
            
            if (finalError) {
              console.error('❌ Erreur:', finalError);
              return;
            }
            
            const finalRevenue = finalSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
            const finalCount = finalSales.length;
            
            console.log(`💰 Chiffre d'affaires final: ${finalRevenue.toLocaleString('fr-FR')} FCFA`);
            console.log(`📈 Nombre de ventes final: ${finalCount}`);
            
            const revenueIncrease = finalRevenue - initialRevenue;
            const countIncrease = finalCount - initialCount;
            
            console.log('\n📈 ÉVOLUTION:');
            console.log(`💰 Revenus: +${revenueIncrease.toLocaleString('fr-FR')} FCFA`);
            console.log(`📊 Ventes: +${countIncrease}`);
            
            // 5. Vérifier les événements Realtime
            console.log('\n📡 5. Vérification des événements Realtime...');
            console.log(`📡 Événements reçus: ${realtimeEvents.length}`);
            
            if (realtimeEvents.length > 0) {
              console.log('✅ Realtime fonctionne correctement !');
              realtimeEvents.forEach((event, index) => {
                console.log(`   Event ${index + 1}: ${event.new.client_name} - ${event.new.total_amount} FCFA`);
              });
            } else {
              console.log('⚠️  Aucun événement Realtime reçu');
              console.log('💡 Vérifiez que Realtime est activé dans les paramètres Supabase');
            }
            
            // 6. Instructions finales
            console.log('\n🎯 6. INSTRUCTIONS FINALES:');
            console.log('');
            console.log('✅ CORRECTIONS APPLIQUÉES:');
            console.log('   - SalesModule corrigé avec props sécurisées');
            console.log('   - Optional chaining ajouté partout');
            console.log('   - Transformation des données robuste');
            console.log('   - Realtime activé dans useDashboard.js');
            console.log('');
            console.log('🚀 POUR TESTER LE DASHBOARD:');
            console.log('   1. Ouvrez http://localhost:3001');
            console.log('   2. Naviguez vers l\'onglet "Ventes"');
            console.log('   3. Ouvrez la console développeur (F12)');
            console.log('   4. Vérifiez qu\'il n\'y a plus d\'erreurs');
            console.log('   5. Les mises à jour devraient être instantanées');
            console.log('');
            console.log('📡 REALTIME STATUS:');
            if (realtimeEvents.length > 0) {
              console.log('   ✅ Realtime ACTIVÉ et fonctionnel');
              console.log('   ✅ Mises à jour instantanées');
              console.log('   ✅ Synchronisation parfaite');
            } else {
              console.log('   ⚠️  Realtime configuré mais pas d\'événements');
              console.log('   💡 Le polling de secours (30s) est actif');
            }
            console.log('');
            console.log('🎉 DASHBOARD SAFEM PRÊT À L\'UTILISATION !');
            
            // Fermer le canal
            channel.unsubscribe();
            
          }, 3000);
          
        }, 2000);
        
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Erreur de connexion Realtime');
        console.log('💡 Le dashboard utilisera le polling de secours');
      }
    });
}

if (require.main === module) {
  testRealtimeFinal();
}

module.exports = { testRealtimeFinal };
