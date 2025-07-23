import supabase from './supabaseClient';

/**
 * Service pour gérer les abonnements SAFEM
 * Gestion des paniers récurrents avec livraisons automatiques
 */
class SubscriptionsService {
  
  /**
   * Récupère les produits disponibles pour les abonnements (identiques à la page caisse)
   * @returns {Object} { success: boolean, data: Array, error?: string }
   */
  static async getAvailableProducts() {
    try {
      console.log('📎 Récupération des produits caisse pour abonnements...');
      
      // Produits exactement identiques à ceux de la page caisse
      const CAISSE_PRODUCTS = {
        quickAccess: [
          { id: 'demon', name: 'Demon', price: 2000, unit: 'FCFA/kg', icon: '🌶️', category: 'Accès Rapide', stock: 50 },
          { id: 'padma', name: 'Padma', price: 1500, unit: 'FCFA/kg', icon: '🍅', category: 'Accès Rapide', stock: 30 },
          { id: 'plantain', name: 'Plantain Ebanga', price: 1000, unit: 'FCFA/kg', icon: '🍌', category: 'Accès Rapide', stock: 25 }
        ],
        piments: [
          { id: 'demon2', name: 'Demon', price: 2000, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 50 },
          { id: 'shamsi', name: 'Shamsi', price: 2500, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 30 },
          { id: 'avenir', name: 'Avenir', price: 1800, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 40 },
          { id: 'theking', name: 'The King', price: 3000, unit: 'FCFA/kg', icon: '🌶️', category: 'Piments', stock: 20 }
        ],
        poivrons: [
          { id: 'yolo', name: 'Yolo Wander', price: 2000, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 35 },
          { id: 'deconti', name: 'De Conti', price: 2500, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 28 },
          { id: 'nobili', name: 'Nobili', price: 2200, unit: 'FCFA/kg', icon: '🫑', category: 'Poivrons', stock: 32 }
        ],
        tomates: [
          { id: 'padma2', name: 'Padma', price: 1500, unit: 'FCFA/kg', icon: '🍅', category: 'Tomates', stock: 45 },
          { id: 'anita', name: 'Anita', price: 1200, unit: 'FCFA/kg', icon: '🍅', category: 'Tomates', stock: 38 }
        ],
        aubergines: [
          { id: 'africaine', name: 'Africaine', price: 1800, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 25 },
          { id: 'bonita', name: 'Bonita', price: 1600, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 30 },
          { id: 'pingtung', name: 'Ping Tung', price: 2000, unit: 'FCFA/kg', icon: '🍆', category: 'Aubergines', stock: 22 }
        ],
        bananes: [
          { id: 'plantain2', name: 'Plantain Ebanga', price: 1000, unit: 'FCFA/kg', icon: '🍌', category: 'Bananes', stock: 40 },
          { id: 'douce', name: 'Banane Douce', price: 1200, unit: 'FCFA/kg', icon: '🍌', category: 'Bananes', stock: 35 }
        ],
        taros: [
          { id: 'blanc', name: 'Taro Blanc', price: 1000, unit: 'FCFA/kg', icon: '🥔', category: 'Taros', stock: 28 },
          { id: 'rouge', name: 'Taro Rouge', price: 1500, unit: 'FCFA/kg', icon: '🥔', category: 'Taros', stock: 25 }
        ],
        autres: [
          { id: 'chou', name: 'Chou Averty', price: 1000, unit: 'FCFA/kg', icon: '🥬', category: 'Autres', stock: 20 },
          { id: 'gombo', name: 'Gombo Kirikou', price: 2000, unit: 'FCFA/kg', icon: '🌿', category: 'Autres', stock: 15 },
          { id: 'concombre', name: 'Concombre Mureino', price: 1000, unit: 'FCFA/kg', icon: '🥒', category: 'Autres', stock: 30 },
          { id: 'ciboulette', name: 'Ciboulette', price: 500, unit: 'FCFA/botte', icon: '🌿', category: 'Autres', stock: 25 }
        ]
      };

      // Aplatir tous les produits en un seul tableau
      const allProducts = [];
      Object.values(CAISSE_PRODUCTS).forEach(categoryProducts => {
        allProducts.push(...categoryProducts);
      });

      // Filtrer les produits disponibles (stock > 0)
      const availableProducts = allProducts
        .filter(product => product.stock > 0)
        .map(product => ({
          ...product,
          // Ajouter les propriétés pour les abonnements
          minQuantity: 0.5, // Quantité minimale 0,5 kg
          stepQuantity: 0.5, // Incrément par paliers de 0,5 kg
          maxQuantity: Math.floor(product.stock / 2) * 0.5, // Maximum basé sur le stock
          displayUnit: product.unit === 'FCFA/botte' ? 'botte' : 'kg'
        }));

      console.log(`✅ ${availableProducts.length} produits caisse disponibles pour abonnements`);
      console.log('📎 Produits avec paliers de 0,5 kg configurés');
      
      return {
        success: true,
        data: availableProducts
      };

    } catch (error) {
      console.error('❌ Erreur dans getAvailableProducts:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Crée un nouvel abonnement
   * @param {Object} subscriptionData - Données de l'abonnement
   * @returns {Object} { success: boolean, data?: Object, error?: string }
   */
  static async createSubscription(subscriptionData) {
    try {
      console.log('📝 Création d\'un nouvel abonnement...');
      
      const {
        clientName,
        clientPhone,
        clientEmail,
        clientType,
        subscriptionName,
        frequency,
        deliveryAddress,
        deliveryNotes,
        preferredDeliveryTime,
        items,
        totalAmount,
        discountRate,
        finalAmount
      } = subscriptionData;

      // Calculer la prochaine date de livraison
      const nextDeliveryDate = this.calculateNextDeliveryDate(new Date(), frequency);
      
      // Validation et logs de débogage
      console.log('🗓️ Calcul next_delivery_date:', {
        currentDate: new Date().toISOString(),
        frequency: frequency,
        nextDeliveryDate: nextDeliveryDate?.toISOString(),
        formattedDate: nextDeliveryDate?.toISOString().split('T')[0]
      });
      
      if (!nextDeliveryDate || isNaN(nextDeliveryDate.getTime())) {
        console.error('❌ Erreur: next_delivery_date invalide');
        return {
          success: false,
          error: 'Impossible de calculer la date de prochaine livraison'
        };
      }

      const formattedNextDeliveryDate = nextDeliveryDate.toISOString().split('T')[0];

      // Créer l'abonnement principal
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          client_type: clientType,
          subscription_name: subscriptionName,
          frequency: frequency,
          delivery_address: deliveryAddress,
          delivery_notes: deliveryNotes,
          preferred_delivery_time: preferredDeliveryTime,
          total_amount: totalAmount,
          discount_rate: discountRate || 0,
          final_amount: finalAmount,
          next_delivery_date: formattedNextDeliveryDate,
          status: 'active'
        })
        .select()
        .single();

      if (subscriptionError) {
        console.error('❌ Erreur lors de la création de l\'abonnement:', subscriptionError);
        return {
          success: false,
          error: subscriptionError.message
        };
      }

      // Créer les articles de l'abonnement
      const subscriptionItems = items.map(item => ({
        subscription_id: subscription.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_category: item.product_category,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('subscription_items')
        .insert(subscriptionItems);

      if (itemsError) {
        console.error('❌ Erreur lors de la création des articles:', itemsError);
        // Supprimer l'abonnement créé en cas d'erreur
        await supabase.from('subscriptions').delete().eq('id', subscription.id);
        return {
          success: false,
          error: itemsError.message
        };
      }

      console.log('✅ Abonnement créé avec succès:', subscription.id);
      return {
        success: true,
        data: subscription
      };

    } catch (error) {
      console.error('❌ Erreur dans createSubscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Récupère tous les abonnements avec pagination
   * @param {Object} options - Options de filtrage et pagination
   * @returns {Object} { success: boolean, data: Array, error?: string }
   */
  static async getSubscriptions(options = {}) {
    try {
      const { 
        status = null, 
        clientType = null, 
        frequency = null,
        limit = 50,
        offset = 0 
      } = options;

      console.log('📋 Récupération des abonnements...');
      
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_items(
            id,
            product_name,
            product_category,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false });

      // Appliquer les filtres
      if (status) {
        query = query.eq('status', status);
      }
      if (clientType) {
        query = query.eq('client_type', clientType);
      }
      if (frequency) {
        query = query.eq('frequency', frequency);
      }

      // Appliquer la pagination
      query = query.range(offset, offset + limit - 1);

      const { data: subscriptions, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des abonnements:', error);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }

      console.log(`✅ ${subscriptions.length} abonnements récupérés`);
      return {
        success: true,
        data: subscriptions
      };

    } catch (error) {
      console.error('❌ Erreur dans getSubscriptions:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Met à jour le statut d'un abonnement
   * @param {string} subscriptionId - ID de l'abonnement
   * @param {string} status - Nouveau statut
   * @returns {Object} { success: boolean, data?: Object, error?: string }
   */
  static async updateSubscriptionStatus(subscriptionId, status) {
    try {
      console.log(`🔄 Mise à jour du statut de l'abonnement ${subscriptionId} vers ${status}`);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la mise à jour du statut:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Statut mis à jour avec succès');
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('❌ Erreur dans updateSubscriptionStatus:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crée une livraison pour un abonnement
   * @param {string} subscriptionId - ID de l'abonnement
   * @returns {Object} { success: boolean, data?: Object, error?: string }
   */
  static async createDelivery(subscriptionId) {
    try {
      console.log(`📦 Création d'une livraison pour l'abonnement ${subscriptionId}`);
      
      // Récupérer les détails de l'abonnement
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_items(*)
        `)
        .eq('id', subscriptionId)
        .single();

      if (subError) {
        console.error('❌ Erreur lors de la récupération de l\'abonnement:', subError);
        return {
          success: false,
          error: subError.message
        };
      }

      // Créer la livraison
      const { data: delivery, error: deliveryError } = await supabase
        .from('subscription_deliveries')
        .insert({
          subscription_id: subscriptionId,
          delivery_date: subscription.next_delivery_date,
          scheduled_date: subscription.next_delivery_date,
          delivery_address: subscription.delivery_address,
          delivery_notes: subscription.delivery_notes,
          total_items: subscription.subscription_items.length,
          total_weight: subscription.subscription_items.reduce((sum, item) => sum + parseFloat(item.quantity), 0),
          total_amount: subscription.final_amount,
          status: 'scheduled'
        })
        .select()
        .single();

      if (deliveryError) {
        console.error('❌ Erreur lors de la création de la livraison:', deliveryError);
        return {
          success: false,
          error: deliveryError.message
        };
      }

      // Créer les articles de livraison
      const deliveryItems = subscription.subscription_items.map(item => ({
        delivery_id: delivery.id,
        subscription_item_id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity_ordered: item.quantity,
        quantity_delivered: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('subscription_delivery_items')
        .insert(deliveryItems);

      if (itemsError) {
        console.error('❌ Erreur lors de la création des articles de livraison:', itemsError);
        return {
          success: false,
          error: itemsError.message
        };
      }

      console.log('✅ Livraison créée avec succès');
      return {
        success: true,
        data: delivery
      };

    } catch (error) {
      console.error('❌ Erreur dans createDelivery:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Met à jour le statut d'un abonnement
   * @param {string} subscriptionId - ID de l'abonnement
   * @param {string} status - Nouveau statut
   * @returns {Object} { success: boolean, data?: Object, error?: string }
   */
  static async updateSubscriptionStatus(subscriptionId, status) {
    try {
      console.log(`🔄 Mise à jour du statut de l'abonnement ${subscriptionId} vers ${status}`);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la mise à jour du statut:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Statut mis à jour avec succès');
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('❌ Erreur dans updateSubscriptionStatus:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calcule la prochaine date de livraison
   * @param {Date} currentDate - Date actuelle
   * @param {string} frequency - Fréquence (weekly, biweekly, monthly)
   * @returns {Date} Prochaine date de livraison
   */
  static calculateNextDeliveryDate(currentDate, frequency) {
    // Validation des paramètres
    if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
      console.error('❌ calculateNextDeliveryDate: currentDate invalide', currentDate);
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Fallback: +7 jours
    }
    
    if (!frequency || typeof frequency !== 'string') {
      console.error('❌ calculateNextDeliveryDate: frequency invalide', frequency);
      frequency = 'weekly'; // Fallback par défaut
    }
    
    const nextDate = new Date(currentDate.getTime()); // Clone sécurisé
    
    console.log('📅 Calcul date de livraison:', {
      input: currentDate.toISOString(),
      frequency: frequency
    });
    
    switch (frequency.toLowerCase()) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        console.warn('⚠️ Fréquence inconnue, utilisation de weekly par défaut:', frequency);
        nextDate.setDate(nextDate.getDate() + 7);
    }
    
    // Validation du résultat
    if (isNaN(nextDate.getTime())) {
      console.error('❌ Résultat de calcul invalide');
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Fallback: +7 jours
    }
    
    console.log('✅ Date calculée:', nextDate.toISOString());
    return nextDate;
  }

  /**
   * Récupère les statistiques des abonnements
   * @returns {Object} { success: boolean, data: Object, error?: string }
   */
  static async getSubscriptionStats() {
    try {
      console.log('📊 Récupération des statistiques d\'abonnements...');
      
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('status, client_type, frequency, final_amount');

      if (error) {
        console.error('❌ Erreur lors de la récupération des statistiques:', error);
        return {
          success: false,
          error: error.message,
          data: {}
        };
      }

      const stats = {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === 'active').length,
        paused: subscriptions.filter(s => s.status === 'paused').length,
        cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
        pro: subscriptions.filter(s => s.client_type === 'pro').length,
        particulier: subscriptions.filter(s => s.client_type === 'particulier').length,
        weekly: subscriptions.filter(s => s.frequency === 'weekly').length,
        biweekly: subscriptions.filter(s => s.frequency === 'biweekly').length,
        monthly: subscriptions.filter(s => s.frequency === 'monthly').length,
        totalRevenue: subscriptions.reduce((sum, s) => sum + parseFloat(s.final_amount || 0), 0)
      };

      console.log('✅ Statistiques calculées:', stats);
      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('❌ Erreur dans getSubscriptionStats:', error);
      return {
        success: false,
        error: error.message,
        data: {}
      };
    }
  }
}

export default SubscriptionsService;
