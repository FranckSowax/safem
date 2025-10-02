import { supabase } from '../lib/supabaseClient';

/**
 * Service pour gérer les produits SAFEM depuis Supabase
 */
export class ProductsService {
  
  /**
   * Récupérer tous les produits actifs
   * @returns {Promise<Array>} Liste des produits
   */
  static async getAllProducts() {
    try {
      console.log('📦 Récupération des produits...');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('❌ Erreur lors de la récupération des produits:', error);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }

      console.log(`✅ ${data.length} produits récupérés`);
      
      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('❌ Erreur dans getAllProducts:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Récupérer un produit par ID
   * @param {string} productId - ID du produit
   * @returns {Promise<Object>} Produit
   */
  static async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('❌ Erreur getProductById:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Récupérer les produits par catégorie
   * @param {string} categoryId - ID de la catégorie
   * @returns {Promise<Array>} Liste des produits
   */
  static async getProductsByCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('❌ Erreur getProductsByCategory:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Récupérer les produits avec stock faible
   * @returns {Promise<Array>} Produits en stock faible
   */
  static async getLowStockProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('stock_quantity', supabase.raw('min_stock_level'))
        .eq('is_active', true)
        .order('stock_quantity');

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('❌ Erreur getLowStockProducts:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Mettre à jour le stock d'un produit
   * @param {string} productId - ID du produit
   * @param {number} newQuantity - Nouvelle quantité
   * @returns {Promise<Object>} Résultat
   */
  static async updateStock(productId, newQuantity) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('❌ Erreur updateStock:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Récupérer les catégories de produits
   * @returns {Promise<Array>} Liste des catégories
   */
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('❌ Erreur getCategories:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default ProductsService;
