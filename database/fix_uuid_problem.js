const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../src/frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixUuidProblem() {
  console.log('🔧 Correction du problème UUID -> INTEGER pour product_id...');
  
  try {
    console.log('📋 Étape 1: Suppression des contraintes...');
    
    // 1. Supprimer les contraintes de clé étrangère
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE sale_items DROP CONSTRAINT IF EXISTS sale_items_product_id_fkey;'
    });
    
    console.log('📋 Étape 2: Modification du type product_id dans products...');
    
    // 2. Modifier products.id en INTEGER
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products DROP CONSTRAINT IF EXISTS products_pkey;
        ALTER TABLE products ALTER COLUMN id TYPE INTEGER USING (
          CASE 
            WHEN id ~ '^[0-9]+$' THEN id::INTEGER 
            ELSE ROW_NUMBER() OVER() 
          END
        );
        ALTER TABLE products ADD PRIMARY KEY (id);
      `
    });
    
    console.log('📋 Étape 3: Modification du type product_id dans sale_items...');
    
    // 3. Modifier sale_items.product_id en INTEGER
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE sale_items ALTER COLUMN product_id TYPE INTEGER USING (
          CASE 
            WHEN product_id ~ '^[0-9]+$' THEN product_id::INTEGER 
            ELSE NULL 
          END
        );
      `
    });
    
    console.log('📋 Étape 4: Recréation de la contrainte...');
    
    // 4. Recréer la contrainte
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE sale_items ADD CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);'
    });
    
    console.log('📋 Étape 5: Nettoyage des données...');
    
    // 5. Nettoyer les données existantes
    await supabase.rpc('exec_sql', {
      sql: 'DELETE FROM sale_items; DELETE FROM sales; DELETE FROM products;'
    });
    
    console.log('📋 Étape 6: Réinsertion des produits avec IDs numériques...');
    
    // 6. Réinsérer les produits avec les bons IDs
    const products = [
      { id: 1, name: 'Demon', variety: 'Demon', price: 2000.00, unit: 'kg', category: 'PIMENTS' },
      { id: 2, name: 'Shamsi', variety: 'Shamsi', price: 2000.00, unit: 'kg', category: 'PIMENTS' },
      { id: 3, name: 'Avenir', variety: 'Avenir', price: 4000.00, unit: 'kg', category: 'PIMENTS' },
      { id: 4, name: 'The King', variety: 'The King', price: 4000.00, unit: 'kg', category: 'PIMENTS' },
      { id: 5, name: 'Yolo Wander', variety: 'Yolo Wander', price: 2000.00, unit: 'kg', category: 'POIVRONS' },
      { id: 6, name: 'De Conti', variety: 'De Conti', price: 2500.00, unit: 'kg', category: 'POIVRONS' },
      { id: 7, name: 'Nobili', variety: 'Nobili', price: 2500.00, unit: 'kg', category: 'POIVRONS' },
      { id: 8, name: 'Padma', variety: 'Padma', price: 1500.00, unit: 'kg', category: 'TOMATES' },
      { id: 9, name: 'Anita', variety: 'Anita', price: 1500.00, unit: 'kg', category: 'TOMATES' },
      { id: 10, name: 'Black Beauty', variety: 'Black Beauty', price: 2500.00, unit: 'kg', category: 'AUBERGINES' },
      { id: 11, name: 'Violette de Barbentane', variety: 'Violette de Barbentane', price: 3000.00, unit: 'kg', category: 'AUBERGINES' },
      { id: 12, name: 'Marketmore', variety: 'Marketmore', price: 1800.00, unit: 'kg', category: 'CONCOMBRES' },
      { id: 13, name: 'Suyo Long', variety: 'Suyo Long', price: 2000.00, unit: 'kg', category: 'CONCOMBRES' },
      { id: 14, name: 'Black Beauty Zucchini', variety: 'Black Beauty', price: 1800.00, unit: 'kg', category: 'COURGETTES' },
      { id: 15, name: 'Eight Ball', variety: 'Eight Ball', price: 2200.00, unit: 'kg', category: 'COURGETTES' },
      { id: 16, name: 'Provider', variety: 'Provider', price: 3500.00, unit: 'kg', category: 'HARICOTS' },
      { id: 17, name: 'Cherokee Trail of Tears', variety: 'Cherokee', price: 4000.00, unit: 'kg', category: 'HARICOTS' },
      { id: 18, name: 'Buttercrunch', variety: 'Buttercrunch', price: 1200.00, unit: 'kg', category: 'LAITUES' },
      { id: 19, name: 'Red Sails', variety: 'Red Sails', price: 1500.00, unit: 'kg', category: 'LAITUES' },
      { id: 20, name: 'Cherry Belle', variety: 'Cherry Belle', price: 800.00, unit: 'kg', category: 'RADIS' },
      { id: 21, name: 'French Breakfast', variety: 'French Breakfast', price: 1000.00, unit: 'kg', category: 'RADIS' }
    ];
    
    // Insérer les produits un par un
    for (const product of products) {
      const { error } = await supabase
        .from('products')
        .insert({
          id: product.id,
          name: product.name,
          variety: product.variety,
          price: product.price,
          unit: product.unit,
          description: `${product.name} - Variété ${product.variety}`,
          stock_quantity: 50.00,
          min_stock_level: 10.00,
          status: 'active'
        });
      
      if (error) {
        console.error(`❌ Erreur produit ${product.name}:`, error.message);
      } else {
        console.log(`✅ Produit ${product.name} inséré`);
      }
    }
    
    console.log('🎉 Correction terminée!');
    console.log('📊 Vérification des produits...');
    
    // Vérifier les produits
    const { data: finalProducts, error: checkError } = await supabase
      .from('products')
      .select('id, name, price')
      .order('id');
    
    if (checkError) {
      console.error('❌ Erreur vérification:', checkError);
    } else {
      console.log('✅ Produits avec IDs numériques:');
      finalProducts.forEach(p => console.log(`  - ID ${p.id}: ${p.name} (${p.price} FCFA)`));
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

fixUuidProblem();
