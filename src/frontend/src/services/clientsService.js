import { supabase } from '../lib/supabaseClient';

/**
 * Service pour gérer les clients SAFEM
 * Gestion des clients particuliers et professionnels avec historique complet
 */
export class ClientsService {
  
  /**
   * Récupérer tous les clients avec leurs statistiques
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Array>} Liste des clients avec stats
   */
  static async getAllClients(options = {}) {
    try {
      const { 
        clientType = null, 
        search = null,
        limit = 100,
        offset = 0 
      } = options;

      console.log('📋 Récupération des clients...', options);

      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrer par type si spécifié
      if (clientType) {
        query = query.eq('client_type', clientType);
      }

      // Recherche par nom ou téléphone
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Pagination
      query = query.range(offset, offset + limit - 1);

      const { data: clients, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des clients:', error);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }

      // Enrichir avec les statistiques de ventes pour chaque client
      const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
          const stats = await this.getClientStats(client.id);
          return {
            ...client,
            stats
          };
        })
      );

      console.log(`✅ ${clientsWithStats.length} clients récupérés avec statistiques`);
      
      return {
        success: true,
        data: clientsWithStats
      };

    } catch (error) {
      console.error('❌ Erreur dans getAllClients:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Récupérer un client par ID avec son historique complet
   * @param {string} clientId - ID du client
   * @returns {Promise<Object>} Client avec historique
   */
  static async getClientById(clientId) {
    try {
      console.log('📋 Récupération du client:', clientId);

      // Récupérer le client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('❌ Erreur lors de la récupération du client:', clientError);
        return {
          success: false,
          error: clientError.message
        };
      }

      // Récupérer l'historique des ventes
      const salesHistory = await this.getClientSalesHistory(clientId);
      
      // Récupérer les statistiques
      const stats = await this.getClientStats(clientId);
      
      // Récupérer les produits préférés
      const favoriteProducts = await this.getClientFavoriteProducts(clientId);

      console.log('✅ Client récupéré avec historique complet');
      
      return {
        success: true,
        data: {
          ...client,
          salesHistory,
          stats,
          favoriteProducts
        }
      };

    } catch (error) {
      console.error('❌ Erreur dans getClientById:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer ou mettre à jour un client
   * @param {Object} clientData - Données du client
   * @returns {Promise<Object>} Client créé/mis à jour
   */
  static async upsertClient(clientData) {
    try {
      console.log('💾 Upsert client:', clientData);

      const clientToUpsert = {
        name: clientData.name,
        phone: clientData.phone,
        email: clientData.email || null,
        address: clientData.address || null,
        client_type: clientData.client_type || 'particulier',
        notes: clientData.notes || null,
        updated_at: new Date().toISOString()
      };

      // Si ID fourni, c'est une mise à jour
      if (clientData.id) {
        const { data, error } = await supabase
          .from('clients')
          .update(clientToUpsert)
          .eq('id', clientData.id)
          .select()
          .single();

        if (error) throw error;

        console.log('✅ Client mis à jour:', data);
        return {
          success: true,
          data
        };
      } else {
        // Sinon, c'est une création
        clientToUpsert.created_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('clients')
          .insert([clientToUpsert])
          .select()
          .single();

        if (error) throw error;

        console.log('✅ Client créé:', data);
        return {
          success: true,
          data
        };
      }

    } catch (error) {
      console.error('❌ Erreur dans upsertClient:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rechercher un client par nom ou téléphone
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<Array>} Clients correspondants
   */
  static async searchClients(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: true,
          data: []
        };
      }

      console.log('🔍 Recherche clients:', searchTerm);

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;

      console.log(`✅ ${data.length} clients trouvés`);
      
      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('❌ Erreur dans searchClients:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Récupérer l'historique des ventes d'un client
   * @param {string} clientId - ID du client
   * @returns {Promise<Array>} Historique des ventes
   */
  static async getClientSalesHistory(clientId) {
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
        .eq('client_id', clientId)
        .order('sale_date', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data || [];

    } catch (error) {
      console.error('❌ Erreur getClientSalesHistory:', error);
      return [];
    }
  }

  /**
   * Récupérer les statistiques d'un client
   * @param {string} clientId - ID du client
   * @returns {Promise<Object>} Statistiques du client
   */
  static async getClientStats(clientId) {
    try {
      // Récupérer toutes les ventes du client
      const { data: sales, error } = await supabase
        .from('sales')
        .select('total_amount, sale_date, sale_items(quantity)')
        .eq('client_id', clientId);

      if (error) throw error;

      if (!sales || sales.length === 0) {
        return {
          totalSales: 0,
          totalAmount: 0,
          averageAmount: 0,
          totalItems: 0,
          lastPurchaseDate: null,
          firstPurchaseDate: null
        };
      }

      const totalAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
      const totalItems = sales.reduce((sum, sale) => {
        return sum + (sale.sale_items || []).reduce((itemSum, item) => 
          itemSum + parseFloat(item.quantity || 0), 0
        );
      }, 0);

      const sortedDates = sales
        .map(s => new Date(s.sale_date))
        .sort((a, b) => b - a);

      return {
        totalSales: sales.length,
        totalAmount,
        averageAmount: totalAmount / sales.length,
        totalItems,
        lastPurchaseDate: sortedDates[0],
        firstPurchaseDate: sortedDates[sortedDates.length - 1]
      };

    } catch (error) {
      console.error('❌ Erreur getClientStats:', error);
      return {
        totalSales: 0,
        totalAmount: 0,
        averageAmount: 0,
        totalItems: 0,
        lastPurchaseDate: null,
        firstPurchaseDate: null
      };
    }
  }

  /**
   * Récupérer les produits préférés d'un client
   * @param {string} clientId - ID du client
   * @returns {Promise<Array>} Produits les plus achetés
   */
  static async getClientFavoriteProducts(clientId) {
    try {
      // Récupérer tous les articles achetés par le client
      const { data: sales, error } = await supabase
        .from('sales')
        .select(`
          sale_items (
            product_name,
            quantity,
            unit_price
          )
        `)
        .eq('client_id', clientId);

      if (error) throw error;

      if (!sales || sales.length === 0) return [];

      // Agréger les produits
      const productStats = {};
      sales.forEach(sale => {
        (sale.sale_items || []).forEach(item => {
          const productName = item.product_name;
          if (!productStats[productName]) {
            productStats[productName] = {
              name: productName,
              totalQuantity: 0,
              totalSpent: 0,
              purchaseCount: 0
            };
          }
          productStats[productName].totalQuantity += parseFloat(item.quantity || 0);
          productStats[productName].totalSpent += parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
          productStats[productName].purchaseCount += 1;
        });
      });

      // Convertir en tableau et trier par quantité totale
      return Object.values(productStats)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10);

    } catch (error) {
      console.error('❌ Erreur getClientFavoriteProducts:', error);
      return [];
    }
  }

  /**
   * Récupérer les statistiques globales des clients
   * @returns {Promise<Object>} Statistiques globales
   */
  static async getGlobalStats() {
    try {
      console.log('📊 Récupération des statistiques globales clients...');

      const { data: clients, error } = await supabase
        .from('clients')
        .select('id, client_type');

      if (error) throw error;

      const stats = {
        total: clients.length,
        particuliers: clients.filter(c => c.client_type === 'particulier').length,
        professionnels: clients.filter(c => c.client_type === 'pro').length
      };

      console.log('✅ Statistiques globales calculées:', stats);
      
      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('❌ Erreur getGlobalStats:', error);
      return {
        success: false,
        error: error.message,
        data: {
          total: 0,
          particuliers: 0,
          professionnels: 0
        }
      };
    }
  }

  /**
   * Supprimer un client
   * @param {string} clientId - ID du client
   * @returns {Promise<Object>} Résultat de la suppression
   */
  static async deleteClient(clientId) {
    try {
      console.log('🗑️ Suppression du client:', clientId);

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      console.log('✅ Client supprimé');
      
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Erreur deleteClient:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Synchroniser les clients avec les ventes
   * Crée automatiquement des clients à partir des ventes sans client_id
   */
  static async syncClientsFromSales() {
    try {
      console.log('🔄 Synchronisation des clients depuis les ventes...');

      // Récupérer les ventes sans client_id
      const { data: salesWithoutClient, error: salesError } = await supabase
        .from('sales')
        .select('id, client_name, client_phone')
        .is('client_id', null)
        .not('client_name', 'is', null);

      if (salesError) throw salesError;

      if (!salesWithoutClient || salesWithoutClient.length === 0) {
        console.log('✅ Aucune vente à synchroniser');
        return {
          success: true,
          synced: 0
        };
      }

      let syncedCount = 0;

      for (const sale of salesWithoutClient) {
        // Vérifier si un client existe déjà avec ce téléphone ou nom
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .or(`phone.eq.${sale.client_phone},name.eq.${sale.client_name}`)
          .limit(1)
          .single();

        let clientId;

        if (existingClient) {
          clientId = existingClient.id;
        } else {
          // Créer un nouveau client
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert([{
              name: sale.client_name,
              phone: sale.client_phone,
              client_type: 'particulier',
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (createError) {
            console.error('❌ Erreur création client:', createError);
            continue;
          }

          clientId = newClient.id;
        }

        // Mettre à jour la vente avec le client_id
        const { error: updateError } = await supabase
          .from('sales')
          .update({ client_id: clientId })
          .eq('id', sale.id);

        if (!updateError) {
          syncedCount++;
        }
      }

      console.log(`✅ ${syncedCount} ventes synchronisées avec des clients`);
      
      return {
        success: true,
        synced: syncedCount
      };

    } catch (error) {
      console.error('❌ Erreur syncClientsFromSales:', error);
      return {
        success: false,
        error: error.message,
        synced: 0
      };
    }
  }
}

export default ClientsService;
