const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function quickSetup() {
  console.log('🚀 Configuration rapide Supabase SAFEM...');
  
  try {
    // 1. Créer les catégories de produits
    console.log('📂 Création des catégories...');
    const categories = [
      { name: 'Légumes Feuilles', description: 'Légumes à feuilles vertes' },
      { name: 'Légumes Fruits', description: 'Légumes fruits comme tomates, poivrons' },
      { name: 'Légumes Racines', description: 'Légumes racines et tubercules' },
      { name: 'Épices', description: 'Épices et aromates' },
      { name: 'Fruits', description: 'Fruits tropicaux' }
    ];
    
    // Vérifier si la table existe
    const { data: existingCategories, error: catError } = await supabase
      .from('product_categories')
      .select('*')
      .limit(1);
    
    if (catError && catError.code === 'PGRST116') {
      console.log('⚠️ Table product_categories n\'existe pas. Veuillez exécuter le schéma SQL complet.');
      console.log('📖 Consultez le fichier SETUP_GUIDE.md pour les instructions.');
      return;
    }
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('product_categories')
      .upsert(categories, { onConflict: 'name' })
      .select();
    
    if (categoriesError) {
      console.error('❌ Erreur catégories:', categoriesError);
    } else {
      console.log(`✅ ${categoriesData.length} catégories configurées`);
    }
    
    // 2. Attendre et récupérer les catégories
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { data: allCategories } = await supabase
      .from('product_categories')
      .select('*');
    
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    // 3. Créer les produits SAFEM
    console.log('🥬 Création des produits SAFEM...');
    const products = [
      { name: 'Poivron De conti', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 2250, stock_quantity: 50 },
      { name: 'Tomate Padma', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 1500, stock_quantity: 80 },
      { name: 'Piment Demon', category_id: categoryMap['Épices'], unit: 'kg', price: 3000, stock_quantity: 12 },
      { name: 'Chou Aventy', category_id: categoryMap['Légumes Feuilles'], unit: 'kg', price: 1000, stock_quantity: 30 },
      { name: 'Gombo Kirikou', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 2000, stock_quantity: 25 },
      { name: 'Concombre Murano', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 1000, stock_quantity: 40 },
      { name: 'Aubergine Africaine', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 1500, stock_quantity: 35 },
      { name: 'Banane plantain Ebanga', category_id: categoryMap['Fruits'], unit: 'kg', price: 1000, stock_quantity: 120 },
      { name: 'Taro blanc', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 1000, stock_quantity: 45 },
      { name: 'Manioc Mvondo', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 800, stock_quantity: 60 },
      { name: 'Igname Essingang', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 1200, stock_quantity: 40 },
      { name: 'Patate douce Mbanga', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 900, stock_quantity: 35 },
      { name: 'Épinard Fom', category_id: categoryMap['Légumes Feuilles'], unit: 'botte', price: 500, stock_quantity: 25 },
      { name: 'Oseille Kelen', category_id: categoryMap['Légumes Feuilles'], unit: 'botte', price: 600, stock_quantity: 20 },
      { name: 'Persil Ndolé', category_id: categoryMap['Légumes Feuilles'], unit: 'botte', price: 400, stock_quantity: 30 },
      { name: 'Céleri Akpi', category_id: categoryMap['Légumes Feuilles'], unit: 'botte', price: 700, stock_quantity: 15 },
      { name: 'Carotte Bikutsi', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 1100, stock_quantity: 40 },
      { name: 'Betterave Makossa', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 1300, stock_quantity: 25 },
      { name: 'Radis Assiko', category_id: categoryMap['Légumes Racines'], unit: 'kg', price: 800, stock_quantity: 20 },
      { name: 'Gingembre Bikutsi', category_id: categoryMap['Épices'], unit: 'kg', price: 2500, stock_quantity: 15 },
      { name: 'Ail Benskin', category_id: categoryMap['Épices'], unit: 'kg', price: 3500, stock_quantity: 10 }
    ];
    
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'name' })
      .select();
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError);
    } else {
      console.log(`✅ ${productsData.length} produits SAFEM configurés`);
    }
    
    // 4. Tester la connexion avec les ventes
    console.log('💰 Test des ventes...');
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (salesError) {
      console.error('❌ Erreur ventes:', salesError);
    } else {
      console.log(`✅ ${salesData.length} ventes trouvées`);
    }
    
    // 5. Créer une vente de test si aucune vente n'existe
    if (salesData.length === 0) {
      console.log('🧪 Création d\'une vente de test...');
      
      const testSale = {
        client_name: 'Client Test',
        client_phone: '+241 01 23 45 67',
        total_amount: 4500,
        payment_method: 'cash',
        status: 'completed'
      };
      
      const { data: newSale, error: newSaleError } = await supabase
        .from('sales')
        .insert(testSale)
        .select()
        .single();
      
      if (newSaleError) {
        console.error('❌ Erreur vente test:', newSaleError);
      } else {
        console.log('✅ Vente de test créée:', newSale.id);
        
        // Ajouter des articles à la vente de test
        const testItems = [
          {
            sale_id: newSale.id,
            product_id: productsData[0].id,
            product_name: productsData[0].name,
            quantity: 2,
            unit_price: productsData[0].price,
            total_price: productsData[0].price * 2
          }
        ];
        
        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(testItems);
        
        if (itemsError) {
          console.error('❌ Erreur articles test:', itemsError);
        } else {
          console.log('✅ Articles de test ajoutés');
        }
      }
    }
    
    console.log('\n🎉 Configuration rapide terminée !');
    console.log('🔗 Votre application SAFEM est maintenant connectée à Supabase');
    console.log('📱 Testez la caisse et le dashboard sur http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Erreur de configuration:', error);
  }
}

if (require.main === module) {
  quickSetup();
}

module.exports = { quickSetup };
