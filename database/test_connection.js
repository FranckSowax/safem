const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Test de la connexion Supabase...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test simple de connexion
    const { data, error } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('⚠️ Table migrations non trouvée, c\'est normal pour une nouvelle base');
    } else {
      console.log('✅ Connexion réussie !');
    }
    
    // Tester la création d'une table simple
    console.log('\n🔧 Test de création de table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Utiliser l'API SQL directement
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ sql: createTableSQL })
    });
    
    if (response.ok) {
      console.log('✅ Table de test créée avec succès !');
      
      // Insérer un enregistrement de test
      const { data: insertData, error: insertError } = await supabase
        .from('test_connection')
        .insert({ message: 'Test de connexion SAFEM' })
        .select();
      
      if (insertError) {
        console.error('❌ Erreur insertion:', insertError);
      } else {
        console.log('✅ Enregistrement inséré:', insertData);
      }
      
    } else {
      const errorText = await response.text();
      console.error('❌ Erreur création table:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

// Fonction pour créer les tables principales
async function createBasicTables() {
  console.log('\n🏗️ Création des tables principales...');
  
  const tables = [
    {
      name: 'clients',
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          email VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'product_categories',
      sql: `
        CREATE TABLE IF NOT EXISTS product_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'products',
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          category_id UUID REFERENCES product_categories(id),
          unit VARCHAR(20) NOT NULL DEFAULT 'kg',
          price DECIMAL(10,2) NOT NULL,
          stock_quantity DECIMAL(10,2) DEFAULT 0.00,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'sales',
      sql: `
        CREATE TABLE IF NOT EXISTS sales (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_name VARCHAR(255) NOT NULL,
          client_phone VARCHAR(20),
          total_amount DECIMAL(12,2) NOT NULL,
          payment_method VARCHAR(50) DEFAULT 'cash',
          sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status VARCHAR(20) DEFAULT 'completed',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'sale_items',
      sql: `
        CREATE TABLE IF NOT EXISTS sale_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id),
          product_name VARCHAR(255) NOT NULL,
          quantity DECIMAL(10,2) NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(12,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];
  
  for (const table of tables) {
    try {
      console.log(`📝 Création de la table ${table.name}...`);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ sql: table.sql })
      });
      
      if (response.ok) {
        console.log(`✅ Table ${table.name} créée`);
      } else {
        const error = await response.text();
        console.error(`❌ Erreur table ${table.name}:`, error);
      }
      
    } catch (error) {
      console.error(`❌ Erreur table ${table.name}:`, error);
    }
  }
}

// Fonction pour insérer les données initiales
async function insertInitialData() {
  console.log('\n📦 Insertion des données initiales...');
  
  try {
    // Insérer les catégories
    const categories = [
      { name: 'Légumes Feuilles', description: 'Légumes à feuilles vertes' },
      { name: 'Légumes Fruits', description: 'Légumes fruits comme tomates, poivrons' },
      { name: 'Légumes Racines', description: 'Légumes racines et tubercules' },
      { name: 'Épices', description: 'Épices et aromates' },
      { name: 'Fruits', description: 'Fruits tropicaux' }
    ];
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('product_categories')
      .upsert(categories, { onConflict: 'name' })
      .select();
    
    if (categoriesError) {
      console.error('❌ Erreur catégories:', categoriesError);
    } else {
      console.log(`✅ ${categoriesData.length} catégories insérées`);
    }
    
    // Attendre un peu pour que les catégories soient créées
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Récupérer les catégories pour les IDs
    const { data: allCategories } = await supabase
      .from('product_categories')
      .select('*');
    
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    // Insérer quelques produits de base
    const products = [
      { name: 'Poivron De conti', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 2250, stock_quantity: 50 },
      { name: 'Tomate Padma', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 1500, stock_quantity: 80 },
      { name: 'Piment Demon', category_id: categoryMap['Épices'], unit: 'kg', price: 3000, stock_quantity: 12 },
      { name: 'Chou Aventy', category_id: categoryMap['Légumes Feuilles'], unit: 'kg', price: 1000, stock_quantity: 30 },
      { name: 'Gombo Kirikou', category_id: categoryMap['Légumes Fruits'], unit: 'kg', price: 2000, stock_quantity: 25 }
    ];
    
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'name' })
      .select();
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError);
    } else {
      console.log(`✅ ${productsData.length} produits insérés`);
    }
    
  } catch (error) {
    console.error('❌ Erreur données initiales:', error);
  }
}

async function main() {
  await testConnection();
  await createBasicTables();
  await insertInitialData();
  
  console.log('\n🎉 Configuration terminée !');
  console.log('🔗 Vous pouvez maintenant tester l\'application avec Supabase configuré');
}

if (require.main === module) {
  main();
}
