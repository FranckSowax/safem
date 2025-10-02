import supabase from './supabaseClient';

/**
 * Service pour gérer les commandes produits avec géolocalisation
 */
class ProductOrdersService {
  /**
   * Créer une nouvelle commande produit
   * @param {Object} orderData - Données de la commande
   * @param {Array} cartItems - Articles du panier
   * @returns {Promise<Object>} - Commande créée
   */
  async createOrder(orderData, cartItems) {
    try {
      console.log('Création commande produit:', { orderData, cartItems });

      // Calculer le total
      const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      // Préparer les données de la commande
      const orderToInsert = {
        client_name: orderData.name,
        client_phone: orderData.phone,
        quartier: orderData.quartier,
        latitude: orderData.latitude,
        longitude: orderData.longitude,
        address_formatted: orderData.address_formatted || '',
        total_amount: totalAmount,
        status: 'pending',
        notes: orderData.notes || ''
      };

      // Insérer la commande
      const { data: order, error: orderError } = await supabase
        .from('product_orders')
        .insert([orderToInsert])
        .select()
        .single();

      if (orderError) {
        console.error('Erreur lors de la création de la commande:', orderError);
        throw new Error(`Erreur lors de la création de la commande: ${orderError.message}`);
      }

      console.log('Commande créée:', order);

      // Préparer les articles de la commande
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_icon: item.icon,
        product_category: item.category,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      // Insérer les articles
      const { data: items, error: itemsError } = await supabase
        .from('product_order_items')
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error('Erreur lors de l\'insertion des articles:', itemsError);
        // Supprimer la commande si l'insertion des articles échoue
        await supabase.from('product_orders').delete().eq('id', order.id);
        throw new Error(`Erreur lors de l'insertion des articles: ${itemsError.message}`);
      }

      console.log('Articles insérés:', items);

      return {
        order,
        items,
        success: true
      };

    } catch (error) {
      console.error('Erreur dans createOrder:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les commandes produits
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Array>} - Liste des commandes
   */
  async getAllOrders(options = {}) {
    try {
      let query = supabase
        .from('product_orders')
        .select(`
          *,
          product_order_items (
            *
          )
        `)
        .order('order_date', { ascending: false });

      // Filtrer par statut si spécifié
      if (options.status) {
        query = query.eq('status', options.status);
      }

      // Filtrer par quartier si spécifié
      if (options.quartier) {
        query = query.eq('quartier', options.quartier);
      }

      // Limiter le nombre de résultats
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
      }

      return data || [];

    } catch (error) {
      console.error('Erreur dans getAllOrders:', error);
      throw error;
    }
  }

  /**
   * Récupérer une commande par ID
   * @param {string} orderId - ID de la commande
   * @returns {Promise<Object>} - Commande avec articles
   */
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('product_orders')
        .select(`
          *,
          product_order_items (
            *
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        throw new Error(`Erreur lors de la récupération de la commande: ${error.message}`);
      }

      return data;

    } catch (error) {
      console.error('Erreur dans getOrderById:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'une commande
   * @param {string} orderId - ID de la commande
   * @param {string} status - Nouveau statut
   * @returns {Promise<Object>} - Commande mise à jour
   */
  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('product_orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
      }

      return data;

    } catch (error) {
      console.error('Erreur dans updateOrderStatus:', error);
      throw error;
    }
  }

  /**
   * Récupérer les commandes dans un rayon donné
   * @param {number} latitude - Latitude du centre
   * @param {number} longitude - Longitude du centre
   * @param {number} radiusKm - Rayon en kilomètres
   * @returns {Promise<Array>} - Commandes dans le rayon
   */
  async getOrdersInRadius(latitude, longitude, radiusKm = 10) {
    try {
      const { data, error } = await supabase
        .rpc('get_orders_in_radius', {
          center_lat: latitude,
          center_lon: longitude,
          radius_km: radiusKm
        });

      if (error) {
        console.error('Erreur lors de la recherche par rayon:', error);
        throw new Error(`Erreur lors de la recherche par rayon: ${error.message}`);
      }

      return data || [];

    } catch (error) {
      console.error('Erreur dans getOrdersInRadius:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des commandes produits
   * @returns {Promise<Object>} - Statistiques
   */
  async getOrdersStats() {
    try {
      // Statistiques générales
      const { data: totalOrders, error: totalError } = await supabase
        .from('product_orders')
        .select('id', { count: 'exact' });

      if (totalError) throw totalError;

      // Commandes par statut
      const { data: statusStats, error: statusError } = await supabase
        .from('product_orders')
        .select('status')
        .order('status');

      if (statusError) throw statusError;

      // Chiffre d'affaires total
      const { data: revenueData, error: revenueError } = await supabase
        .from('product_orders')
        .select('total_amount');

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      // Commandes par quartier
      const { data: quartierStats, error: quartierError } = await supabase
        .from('product_orders')
        .select('quartier')
        .order('quartier');

      if (quartierError) throw quartierError;

      // Grouper par statut
      const statusCounts = statusStats.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Grouper par quartier
      const quartierCounts = quartierStats.reduce((acc, order) => {
        if (order.quartier) {
          acc[order.quartier] = (acc[order.quartier] || 0) + 1;
        }
        return acc;
      }, {});

      return {
        totalOrders: totalOrders.length,
        totalRevenue,
        statusCounts,
        quartierCounts,
        averageOrderValue: totalOrders.length > 0 ? totalRevenue / totalOrders.length : 0
      };

    } catch (error) {
      console.error('Erreur dans getOrdersStats:', error);
      throw error;
    }
  }

  /**
   * Récupérer les produits les plus commandés
   * @param {number} limit - Nombre de produits à retourner
   * @returns {Promise<Array>} - Produits les plus commandés
   */
  async getTopOrderedProducts(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('product_order_items')
        .select('product_name, product_icon, product_category, quantity')
        .order('quantity', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des top produits:', error);
        throw new Error(`Erreur lors de la récupération des top produits: ${error.message}`);
      }

      // Grouper par produit et sommer les quantités
      const productStats = data.reduce((acc, item) => {
        const key = item.product_name;
        if (!acc[key]) {
          acc[key] = {
            name: item.product_name,
            icon: item.product_icon,
            category: item.product_category,
            totalQuantity: 0,
            orderCount: 0
          };
        }
        acc[key].totalQuantity += parseFloat(item.quantity || 0);
        acc[key].orderCount += 1;
        return acc;
      }, {});

      // Convertir en tableau et trier
      return Object.values(productStats)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, limit);

    } catch (error) {
      console.error('Erreur dans getTopOrderedProducts:', error);
      throw error;
    }
  }
}

export default new ProductOrdersService();
