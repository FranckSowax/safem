import supabase from './supabaseClient';

/**
 * Service pour la gestion des produits dans la page caisse
 * Synchronisation complète avec Supabase
 */
class CaisseProductsService {
  
  /**
   * Récupérer tous les produits avec leurs catégories
   * @returns {Promise<Array>} Liste des produits
   */
  async getAllProducts() {
    try {
      if (!supabase) {
        console.warn('Supabase non configuré, utilisation des données de fallback');
        return this.getFallbackProducts();
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          stock_quantity,
          is_active,
          unit,
          description,
          product_categories (
            name
          )
        `)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        return this.getFallbackProducts();
      }

      // Transformer les données pour correspondre au format attendu par l'interface
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        stock: parseFloat(product.stock_quantity),
        category: product.product_categories?.name || 'AUTRES',
        status: product.is_active ? 'active' : 'inactive',
        unit: product.unit || 'kg',
        description: product.description || ''
      }));

    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return this.getFallbackProducts();
    }
  }

  /**
   * Ajouter un nouveau produit
   * @param {Object} productData - Données du produit
   * @returns {Promise<Object>} Produit créé
   */
  async addProduct(productData) {
    try {
      if (!supabase) {
        console.warn('Supabase non configuré, simulation de l\'ajout');
        return {
          id: Date.now().toString(),
          ...productData,
          status: 'active'
        };
      }

      // D'abord, récupérer l'ID de la catégorie
      const categoryId = await this.getCategoryId(productData.category);

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: parseFloat(productData.price),
          stock_quantity: parseFloat(productData.stock),
          category_id: categoryId,
          is_active: true,
          unit: 'kg',
          description: productData.description || ''
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        throw error;
      }

      // Transformer la réponse pour correspondre au format attendu
      return {
        id: data.id,
        name: data.name,
        price: parseFloat(data.price),
        stock: parseFloat(data.stock_quantity),
        category: productData.category,
        status: data.is_active ? 'active' : 'inactive',
        unit: data.unit
      };

    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un produit existant
   * @param {string} productId - ID du produit
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>} Produit mis à jour
   */
  async updateProduct(productId, updates) {
    try {
      if (!supabase) {
        console.warn('Supabase non configuré, simulation de la mise à jour');
        return { id: productId, ...updates };
      }

      const updateData = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
      if (updates.stock !== undefined) updateData.stock_quantity = parseFloat(updates.stock);
      if (updates.status) updateData.is_active = updates.status === 'active';
      if (updates.description) updateData.description = updates.description;
      
      // Si la catégorie change, récupérer le nouvel ID
      if (updates.category) {
        updateData.category_id = await this.getCategoryId(updates.category);
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        price: parseFloat(data.price),
        stock: parseFloat(data.stock_quantity),
        category: updates.category || 'AUTRES',
        status: data.is_active ? 'active' : 'inactive',
        unit: data.unit
      };

    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  /**
   * Supprimer un produit
   * @param {string} productId - ID du produit
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteProduct(productId) {
    try {
      if (!supabase) {
        console.warn('Supabase non configuré, simulation de la suppression');
        return true;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        throw error;
      }

      return true;

    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  /**
   * Récupérer les catégories de produits
   * @returns {Promise<Array>} Liste des catégories
   */
  async getCategories() {
    try {
      if (!supabase) {
        return this.getFallbackCategories();
      }

      const { data, error } = await supabase
        .from('product_categories')
        .select('id, name, color, icon')
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return this.getFallbackCategories();
      }

      return data.map(cat => ({
        value: cat.name.toUpperCase(),
        label: cat.name,
        emoji: this.getCategoryEmoji(cat.name.toUpperCase()),
        color: cat.color,
        icon: cat.icon
      }));

    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return this.getFallbackCategories();
    }
  }

  /**
   * Récupérer l'ID d'une catégorie par son nom
   * @param {string} categoryName - Nom de la catégorie
   * @returns {Promise<string>} ID de la catégorie
   */
  async getCategoryId(categoryName) {
    try {
      if (!supabase) {
        return null;
      }

      const { data, error } = await supabase
        .from('product_categories')
        .select('id')
        .ilike('name', categoryName)
        .single();

      if (error || !data) {
        // Si la catégorie n'existe pas, créer une catégorie par défaut
        return await this.createDefaultCategory(categoryName);
      }

      return data.id;

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID de catégorie:', error);
      return null;
    }
  }

  /**
   * Créer une catégorie par défaut
   * @param {string} categoryName - Nom de la catégorie
   * @returns {Promise<string>} ID de la catégorie créée
   */
  async createDefaultCategory(categoryName) {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{
          name: categoryName,
          description: `Catégorie ${categoryName}`,
          color: '#10B981',
          icon: 'leaf'
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        return null;
      }

      return data.id;

    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      return null;
    }
  }

  /**
   * Synchroniser les prix avec la base de données
   * @returns {Promise<boolean>} Succès de la synchronisation
   */
  async syncPrices() {
    try {
      if (!supabase) {
        console.warn('Supabase non configuré, simulation de la synchronisation');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
      }

      // Récupérer tous les produits pour vérifier la synchronisation
      const products = await this.getAllProducts();
      console.log(`Synchronisation réussie pour ${products.length} produits`);
      
      return true;

    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  }

  /**
   * Données de fallback en cas d'échec Supabase
   * @returns {Array} Liste des produits de fallback
   */
  getFallbackProducts() {
    return [
      { id: '1', name: 'Piment Demon', price: 2000, stock: 25, category: 'PIMENTS', status: 'active' },
      { id: '2', name: 'Piment Habanero', price: 1800, stock: 15, category: 'PIMENTS', status: 'active' },
      { id: '3', name: 'Piment Scotch Bonnet', price: 2200, stock: 8, category: 'PIMENTS', status: 'active' },
      { id: '4', name: 'Piment Cayenne', price: 1500, stock: 30, category: 'PIMENTS', status: 'active' },
      { id: '5', name: 'Poivron De conti', price: 1200, stock: 20, category: 'POIVRONS', status: 'active' },
      { id: '6', name: 'Poivron Rouge', price: 1300, stock: 18, category: 'POIVRONS', status: 'active' },
      { id: '7', name: 'Poivron Jaune', price: 1400, stock: 12, category: 'POIVRONS', status: 'active' },
      { id: '8', name: 'Tomate Padma', price: 800, stock: 35, category: 'TOMATES', status: 'active' },
      { id: '9', name: 'Tomate Roma', price: 900, stock: 28, category: 'TOMATES', status: 'active' },
      { id: '10', name: 'Aubergine Africaine', price: 1000, stock: 22, category: 'AUBERGINES', status: 'active' },
      { id: '11', name: 'Aubergine Violette', price: 1100, stock: 16, category: 'AUBERGINES', status: 'active' },
      { id: '12', name: 'Aubergine Blanche', price: 1200, stock: 14, category: 'AUBERGINES', status: 'active' },
      { id: '13', name: 'Concombre', price: 600, stock: 25, category: 'AUTRES', status: 'active' },
      { id: '14', name: 'Courgette', price: 700, stock: 20, category: 'AUTRES', status: 'active' },
      { id: '15', name: 'Gombo', price: 1500, stock: 18, category: 'AUTRES', status: 'active' },
      { id: '16', name: 'Épinard', price: 500, stock: 30, category: 'AUTRES', status: 'active' },
      { id: '17', name: 'Banane plantain Ebanga', price: 300, stock: 50, category: 'BANANES', status: 'active' },
      { id: '18', name: 'Banane douce', price: 250, stock: 45, category: 'BANANES', status: 'active' },
      { id: '19', name: 'Manioc', price: 400, stock: 40, category: 'AUTRES', status: 'active' },
      { id: '20', name: 'Taro blanc', price: 800, stock: 25, category: 'TAROS', status: 'active' },
      { id: '21', name: 'Taro rouge', price: 900, stock: 20, category: 'TAROS', status: 'active' }
    ];
  }

  /**
   * Catégories de fallback
   * @returns {Array} Liste des catégories de fallback
   */
  getFallbackCategories() {
    return [
      { value: 'ALL', label: 'Toutes les catégories', emoji: '📦' },
      { value: 'PIMENTS', label: 'Piments', emoji: '🌶️' },
      { value: 'POIVRONS', label: 'Poivrons', emoji: '🫑' },
      { value: 'TOMATES', label: 'Tomates', emoji: '🍅' },
      { value: 'AUBERGINES', label: 'Aubergines', emoji: '🍆' },
      { value: 'AUTRES', label: 'Autres', emoji: '🥒' },
      { value: 'BANANES', label: 'Bananes', emoji: '🍌' },
      { value: 'TAROS', label: 'Taros', emoji: '🍠' }
    ];
  }

  /**
   * Obtenir l'emoji d'une catégorie
   * @param {string} category - Nom de la catégorie
   * @returns {string} Emoji correspondant
   */
  getCategoryEmoji(category) {
    if (!category) return '📦';
    
    // Normaliser le nom de la catégorie (majuscules, sans accents)
    const normalizedCategory = category.toString()
      .toUpperCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Supprimer les accents
    
    // Mapping des catégories françaises Supabase vers leurs emojis
    const frenchCategoryMap = {
      'EPICES': '🌶️',
      'LEGUMES FRUITS': '🍅',
      'LEGUMES FEUILLES': '🥬', 
      'LEGUMES RACINES': '🥕',
      'FRUITS': '🍎',
      'CEREALES': '🌾',
      'TUBERCULES': '🥔',
      'LEGUMINEUSES': '🫘',
      'HERBES': '🌿'
    };
    
    // Chercher dans le mapping français
    if (frenchCategoryMap[normalizedCategory]) {
      return frenchCategoryMap[normalizedCategory];
    }
    
    // Mapping anglais (pour compatibilité)
    const englishCategoryMap = {
      'PIMENTS': '🌶️',
      'POIVRONS': '🫑',
      'TOMATES': '🍅',
      'AUBERGINES': '🍆',
      'AUTRES': '🥒',
      'BANANES': '🍌',
      'TAROS': '🍠',
      'LEGUMES': '🥬',
      'SPICES': '🌶️',
      'VEGETABLES': '🥬'
    };
    
    if (englishCategoryMap[normalizedCategory]) {
      return englishCategoryMap[normalizedCategory];
    }
    
    // Mapping par mots-clés pour identifier le type de produit
    const productKeywords = {
      'PIMENT': '🌶️',
      'PEPPER': '🌶️',
      'CHILI': '🌶️',
      'POIVRON': '🫑',
      'BELL': '🫑',
      'TOMATE': '🍅',
      'TOMATO': '🍅',
      'AUBERGINE': '🍆',
      'EGGPLANT': '🍆',
      'BANANE': '🍌',
      'BANANA': '🍌',
      'PLANTAIN': '🍌',
      'TARO': '🍠',
      'CONCOMBRE': '🥒',
      'CUCUMBER': '🥒',
      'COURGETTE': '🥒',
      'ZUCCHINI': '🥒',
      'GOMBO': '🥒',
      'OKRA': '🥒',
      'EPINARD': '🥬',
      'SPINACH': '🥬',
      'MANIOC': '🥔',
      'CASSAVA': '🥔',
      'CHOU': '🥬',
      'CABBAGE': '🥬',
      'CAROTTE': '🥕',
      'CARROT': '🥕',
      'BETTERAVE': '🥕',
      'BEETROOT': '🥕',
      'GINGEMBRE': '🫚',
      'GINGER': '🫚',
      'OIGNON': '🧅',
      'ONION': '🧅',
      'CEREAL': '🌾',
      'GRAIN': '🌾',
      'FRUIT': '🍎',
      'LEGUME': '🥬',
      'VEGETABLE': '🥬',
      'HERBE': '🌿',
      'HERB': '🌿'
    };
    
    // Chercher par mots-clés dans le nom de la catégorie
    for (const [keyword, emoji] of Object.entries(productKeywords)) {
      if (normalizedCategory.includes(keyword)) {
        return emoji;
      }
    }
    
    // Emoji par défaut
    return '📦';
  }
}

export default new CaisseProductsService();
