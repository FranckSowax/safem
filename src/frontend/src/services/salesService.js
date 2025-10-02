import supabase from './supabaseClient';

/**
 * Service pour gérer les ventes dans Supabase
 */
export class SalesService {
  
  /**
   * Créer une nouvelle vente avec ses articles
   * @param {Object} saleData - Données de la vente
   * @param {string} saleData.client_name - Nom du client
   * @param {string} saleData.client_phone - Téléphone du client (optionnel)
   * @param {Array} saleData.items - Articles de la vente
   * @param {number} saleData.total_amount - Montant total
   * @param {string} saleData.payment_method - Méthode de paiement
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async createSale(saleData) {
    if (!supabase) {
      console.warn('Supabase non configuré - simulation de la vente');
      return {
        success: true,
        data: { id: 'mock-' + Date.now(), ...saleData },
        message: 'Vente simulée (Supabase non configuré)'
      };
    }

    try {
      // Vérifier si on utilise des UUIDs de fallback (mode hors ligne)
      const hasLocalUUIDs = saleData.items.some(item => 
        item.product_id && item.product_id.startsWith('local-')
      );
      
      if (hasLocalUUIDs) {
        console.log('📴 Mode hors ligne détecté - simulation de la vente');
        return {
          success: true,
          data: { 
            id: 'offline-' + Date.now(), 
            client_name: saleData.client_name,
            client_phone: saleData.client_phone,
            total_amount: saleData.total_amount,
            sale_date: new Date().toISOString(),
            status: 'completed'
          },
          message: 'Vente enregistrée en mode hors ligne'
        };
      }
      
      // 1. Créer la vente principale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          client_name: saleData.client_name,
          client_phone: saleData.client_phone,
          total_amount: saleData.total_amount,
          payment_method: saleData.payment_method || 'cash',
          sale_date: new Date().toISOString(),
          status: 'completed'
        })
        .select()
        .single();

      if (saleError) {
        throw saleError;
      }

      // 2. Créer les articles de vente
      const saleItems = saleData.items.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) {
        // Rollback: supprimer la vente si les articles n'ont pas pu être créés
        await supabase.from('sales').delete().eq('id', sale.id);
        throw itemsError;
      }

      return {
        success: true,
        data: sale,
        message: 'Vente créée avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de la création de la vente'
      };
    }
  }

  /**
   * Récupérer toutes les ventes avec leurs articles
   * @param {number} limit - Nombre de ventes à récupérer (optionnel)
   * @returns {Promise<Object>} Résultat avec les ventes
   */
  static async getAllSales(limit = 100) {
    if (!supabase) {
      console.warn('Supabase non configuré - retour de données vides');
      return {
        success: false,
        data: [],
        message: 'Supabase non configuré'
      };
    }

    try {
      // Récupérer les ventes avec leurs articles
      const { data: sales, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        return {
          success: false,
          data: [],
          message: error.message
        };
      }

      console.log('✅ Ventes récupérées depuis Supabase:', sales?.length || 0);
      
      return {
        success: true,
        data: sales || [],
        message: 'Ventes récupérées avec succès'
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des ventes:', error);
      return {
        success: false,
        data: [],
        message: error.message
      };
    }
  }

  /**
   * Récupérer les ventes récentes
   * @param {number} limit - Nombre de ventes à récupérer
   * @returns {Promise<Array>} Liste des ventes
   */
  static async getRecentSales(limit = 10) {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            product_name,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Transformer les données pour être compatibles avec le composant
      return (data || []).map(sale => ({
        id: sale.id,
        client: sale.client_name,
        clientName: sale.client_name,
        phone: sale.client_phone,
        amount: parseFloat(sale.total_amount),
        total: parseFloat(sale.total_amount),
        items: sale.sale_items.length,
        products: sale.sale_items.map(item => ({
          name: item.product_name,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.unit_price)
        })),
        time: new Date(sale.created_at).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        date: sale.sale_date || sale.created_at,
        clientType: 'particulier', // Valeur par défaut
        status: sale.status || 'completed'
      }));

    } catch (error) {
      console.error('Erreur lors de la récupération des ventes:', error);
      return [];
    }
  }

  /**
   * Récupérer les statistiques de ventes
   * @param {string} period - Période ('today', 'week', 'month')
   * @returns {Promise<Object>} Statistiques
   */
  static async getSalesStats(period = 'today') {
    if (!supabase) {
      return {
        total_sales: 0,
        total_amount: 0,
        total_items: 0,
        avg_sale: 0
      };
    }

    try {
      let dateFilter = '';
      const now = new Date();
      
      switch (period) {
        case 'today':
          dateFilter = now.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = monthAgo.toISOString().split('T')[0];
          break;
      }

      const { data, error } = await supabase
        .from('sales')
        .select('total_amount, sale_items(quantity)')
        .gte('sale_date', dateFilter);

      if (error) throw error;

      const stats = {
        total_sales: data.length,
        total_amount: data.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0),
        total_items: data.reduce((sum, sale) => 
          sum + sale.sale_items.reduce((itemSum, item) => itemSum + parseFloat(item.quantity), 0), 0
        ),
        avg_sale: data.length > 0 ? 
          data.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0) / data.length : 0
      };

      return stats;

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_sales: 0,
        total_amount: 0,
        total_items: 0,
        avg_sale: 0
      };
    }
  }

  /**
   * Rechercher des clients par nom
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<Array>} Liste des clients
   */
  static async searchClients(searchTerm) {
    if (!supabase || !searchTerm.trim()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Erreur lors de la recherche de clients:', error);
      return [];
    }
  }

  /**
   * Créer ou mettre à jour un client
   * @param {Object} clientData - Données du client
   * @returns {Promise<Object>} Client créé/mis à jour
   */
  static async upsertClient(clientData) {
    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .upsert(clientData)
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Erreur lors de la création/mise à jour du client:', error);
      return null;
    }
  }
}

export default SalesService;
