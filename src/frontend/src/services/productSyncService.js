import { supabase } from './supabaseClient';

/**
 * Service pour synchroniser les produits avec Supabase
 * et créer un mapping correct entre les IDs locaux et les UUIDs Supabase
 */
class ProductSyncService {
  
  /**
   * Récupère tous les produits depuis Supabase
   * @returns {Promise<Object>} Résultat avec les produits
   */
  static async getAllProducts() {
    if (!supabase) {
      console.warn('Supabase non configuré');
      return { success: false, data: [], message: 'Supabase non configuré' };
    }

    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          unit,
          stock_quantity,
          product_categories (
            name,
            color,
            icon
          )
        `)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        return { success: false, data: [], message: error.message };
      }

      console.log('✅ Produits récupérés depuis Supabase:', products?.length || 0);
      return { success: true, data: products || [], message: 'Produits récupérés' };

    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  /**
   * Crée un mapping entre les noms de produits locaux et les UUIDs Supabase
   * @returns {Promise<Object>} Mapping nom -> UUID
   */
  static async createProductMapping() {
    const result = await this.getAllProducts();
    
    if (!result.success) {
      console.warn('Impossible de créer le mapping produits - utilisation du fallback');
      console.warn('Erreur Supabase:', result.message);
      
      // Retourner un mapping de fallback basé sur les IDs locaux
      return this.createFallbackMapping();
    }

    const mapping = {};
    
    // Mapping basé sur les noms de produits
    result.data.forEach(product => {
      const name = product.name.toLowerCase();
      
      // Mapping direct par nom
      mapping[name] = product.id;
      
      // Mapping par mots-clés pour correspondre aux IDs locaux
      if (name.includes('demon') || name.includes('piment demon')) {
        mapping['demon'] = product.id;
        mapping['demon2'] = product.id;
      }
      if (name.includes('shamsi')) mapping['shamsi'] = product.id;
      if (name.includes('avenir')) mapping['avenir'] = product.id;
      if (name.includes('king') || name.includes('theking')) mapping['theking'] = product.id;
      
      if (name.includes('yolo')) mapping['yolo'] = product.id;
      if (name.includes('conti') || name.includes('de conti')) {
        mapping['deconti'] = product.id;
        mapping['de conti'] = product.id;
      }
      if (name.includes('nobili')) mapping['nobili'] = product.id;
      
      if (name.includes('padma')) {
        mapping['padma'] = product.id;
        mapping['padma2'] = product.id;
      }
      if (name.includes('anita')) mapping['anita'] = product.id;
      
      if (name.includes('africaine')) mapping['africaine'] = product.id;
      if (name.includes('bonita')) mapping['bonita'] = product.id;
      if (name.includes('ping') || name.includes('pingtung')) mapping['pingtung'] = product.id;
      
      if (name.includes('plantain') || name.includes('ebanga')) {
        mapping['plantain'] = product.id;
        mapping['plantain2'] = product.id;
      }
      if (name.includes('douce')) mapping['douce'] = product.id;
      
      if (name.includes('taro blanc') || (name.includes('taro') && name.includes('blanc'))) {
        mapping['blanc'] = product.id;
      }
      if (name.includes('taro rouge') || (name.includes('taro') && name.includes('rouge'))) {
        mapping['rouge'] = product.id;
      }
      
      if (name.includes('chou') && name.includes('avent')) mapping['chou'] = product.id;
      if (name.includes('gombo') && name.includes('kirikou')) mapping['gombo'] = product.id;
      if (name.includes('concombre') && name.includes('mur')) mapping['concombre'] = product.id;
      if (name.includes('ciboulette')) mapping['ciboulette'] = product.id;
    });

    console.log('🗂️ Mapping produits créé:', Object.keys(mapping).length, 'entrées');
    console.log('📋 Mapping détaillé:', mapping);
    
    return mapping;
  }

  /**
   * Insère les produits manquants dans Supabase si nécessaire
   * @param {Array} localProducts - Produits locaux à synchroniser
   * @returns {Promise<Object>} Résultat de l'insertion
   */
  static async ensureProductsExist(localProducts) {
    if (!supabase) {
      return { success: false, message: 'Supabase non configuré' };
    }

    try {
      // Récupérer les produits existants
      const existingResult = await this.getAllProducts();
      if (!existingResult.success) {
        return existingResult;
      }

      const existingNames = existingResult.data.map(p => p.name.toLowerCase());
      const missingProducts = [];

      // Identifier les produits manquants
      localProducts.forEach(product => {
        if (!existingNames.includes(product.name.toLowerCase())) {
          missingProducts.push({
            name: product.name,
            price: product.price,
            unit: product.unit || 'kg',
            stock_quantity: product.stock || 0,
            description: `Produit ${product.name} - ${product.category || 'Général'}`
          });
        }
      });

      if (missingProducts.length === 0) {
        console.log('✅ Tous les produits existent déjà dans Supabase');
        return { success: true, message: 'Tous les produits existent' };
      }

      // Insérer les produits manquants
      const { data, error } = await supabase
        .from('products')
        .insert(missingProducts)
        .select();

      if (error) {
        console.error('Erreur lors de l\'insertion des produits:', error);
        return { success: false, message: error.message };
      }

      console.log('✅ Produits insérés dans Supabase:', data?.length || 0);
      return { success: true, data, message: `${data?.length || 0} produits insérés` };

    } catch (error) {
      console.error('Erreur lors de la synchronisation des produits:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Crée un mapping de fallback basé sur les IDs locaux
   * Utilisé quand Supabase n'est pas disponible
   * @returns {Object} Mapping de fallback
   */
  static createFallbackMapping() {
    console.log('🔄 Création du mapping de fallback (mode hors ligne)');
    
    // Mapping de fallback basé sur les produits locaux
    // Utilise des UUIDs générés localement pour éviter les erreurs Supabase
    const fallbackMapping = {
      // Piments
      'demon': 'local-demon-uuid-001',
      'demon2': 'local-demon2-uuid-002', 
      'shamsi': 'local-shamsi-uuid-003',
      'avenir': 'local-avenir-uuid-004',
      'the king': 'local-theking-uuid-005',
      
      // Poivrons
      'yolo wander': 'local-yolowander-uuid-006',
      'de conti': 'local-deconti-uuid-007',
      'deconti': 'local-deconti-uuid-007', // Alias
      'nobili': 'local-nobili-uuid-008',
      
      // Tomates
      'padma': 'local-padma-uuid-009',
      'anita': 'local-anita-uuid-010',
      
      // Aubergines
      'africaine': 'local-africaine-uuid-011',
      'bonita': 'local-bonita-uuid-012',
      'ping tung': 'local-pingtung-uuid-013',
      
      // Bananes
      'plantain ebanga': 'local-plantainebanga-uuid-014',
      'banane douce': 'local-bananedouce-uuid-015',
      
      // Taros
      'taro blanc': 'local-taroblanc-uuid-016',
      'taro rouge': 'local-tarorouge-uuid-017',
      
      // Autres
      'chou averty': 'local-chouaverty-uuid-018',
      'gombo kirikou': 'local-gombokirikou-uuid-019',
      'concombre mureino': 'local-concombremureino-uuid-020',
      'ciboulette': 'local-ciboulette-uuid-021'
    };
    
    console.log('✅ Mapping de fallback créé avec', Object.keys(fallbackMapping).length, 'entrées');
    return fallbackMapping;
  }
}

export { ProductSyncService };
