const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../src/frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function simpleFix() {
  console.log('🔧 Solution simple: Modifier le code pour utiliser les UUIDs existants...');
  
  try {
    // Récupérer tous les produits existants
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price')
      .order('name');
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log('📋 Produits existants dans la base:');
    products.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.name} - ID: ${p.id} - Prix: ${p.price} FCFA`);
    });
    
    console.log('\n💡 SOLUTION:');
    console.log('Au lieu de changer la base, modifions le code pour mapper les noms aux UUIDs');
    
    // Créer un mapping nom -> UUID
    const productMapping = {};
    products.forEach(p => {
      productMapping[p.name] = p.id;
    });
    
    console.log('\n📝 Mapping à utiliser dans le code:');
    console.log('const PRODUCT_UUID_MAP = {');
    Object.entries(productMapping).forEach(([name, id]) => {
      console.log(`  "${name}": "${id}",`);
    });
    console.log('};');
    
    return productMapping;
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

simpleFix();
