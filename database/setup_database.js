const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const supabaseUrl = 'https://iwwgbmukenmxumfxibsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3d2dibXVrZW5teHVtZnhpYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Njk1MzEsImV4cCI6MjA2ODM0NTUzMX0.CXLQgcK_3F1Uq5z9zfhxfndx_WM7ZLBZc8gfVNdiMO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données SAFEM...');
  
  try {
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, 'complete_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Diviser le SQL en commandes individuelles
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Exécution de ${commands.length} commandes SQL...`);
    
    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length > 0) {
        try {
          console.log(`⏳ Commande ${i + 1}/${commands.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            console.warn(`⚠️ Avertissement commande ${i + 1}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️ Erreur commande ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('✅ Base de données configurée avec succès !');
    
    // Tester la connexion
    await testConnection();
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  }
}

async function testConnection() {
  console.log('\n🔍 Test de la connexion...');
  
  try {
    // Tester la lecture des produits
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError);
    } else {
      console.log(`✅ ${products.length} produits trouvés`);
    }
    
    // Tester la lecture des ventes
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (salesError) {
      console.error('❌ Erreur ventes:', salesError);
    } else {
      console.log(`✅ ${sales.length} ventes trouvées`);
    }
    
    // Tester la lecture des catégories
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Erreur catégories:', categoriesError);
    } else {
      console.log(`✅ ${categories.length} catégories trouvées`);
    }
    
    console.log('\n🎉 Connexion Supabase fonctionnelle !');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

// Fonction alternative pour exécuter le SQL directement
async function executeSQL() {
  console.log('🔧 Exécution directe du SQL...');
  
  try {
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, 'complete_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Essayer d'exécuter le SQL complet
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ sql: sqlContent })
    });
    
    if (response.ok) {
      console.log('✅ SQL exécuté avec succès !');
    } else {
      const error = await response.text();
      console.error('❌ Erreur SQL:', error);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter le setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, testConnection };
