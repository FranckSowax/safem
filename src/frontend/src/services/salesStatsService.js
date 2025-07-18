import supabase from './supabaseClient';

/**
 * Service pour générer des statistiques de ventes à partir de la table sale_items
 * Utilisé pour alimenter le module "Produits les plus vendus" et autres statistiques
 */
export class SalesStatsService {
  
  /**
   * Récupère les produits les plus vendus avec leurs statistiques
   * @param {number} limit - Nombre de produits à retourner (défaut: 10)
   * @param {string} period - Période d'analyse ('7d', '30d', '90d', 'all')
   * @returns {Object} { success: boolean, data: Array, error?: string }
   */
  static async getBestSellingProducts(limit = 10, period = '30d') {
    try {
      console.log(`🔍 Récupération des produits les plus vendus (${limit} produits, période: ${period})`);
      
      // Calculer la date de début selon la période
      let dateFilter = '';
      if (period !== 'all') {
        const days = parseInt(period.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        dateFilter = `AND s.sale_date >= '${startDate.toISOString()}'`;
      }

      // Requête pour récupérer les statistiques des produits vendus
      const { data, error } = await supabase.rpc('get_best_selling_products', {
        p_limit: limit,
        p_days: period === 'all' ? null : parseInt(period.replace('d', ''))
      });

      if (error) {
        console.error('❌ Erreur lors de la récupération des produits les plus vendus:', error);
        
        // Fallback: requête directe si la fonction RPC n'existe pas
        return await this.getBestSellingProductsDirect(limit, period);
      }

      console.log(`✅ ${data?.length || 0} produits les plus vendus récupérés`);
      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('❌ Erreur dans getBestSellingProducts:', error);
      
      // Fallback vers la méthode directe
      return await this.getBestSellingProductsDirect(limit, period);
    }
  }

  /**
   * Méthode directe pour récupérer les produits les plus vendus
   * Utilisée comme fallback si la fonction RPC n'existe pas
   */
  static async getBestSellingProductsDirect(limit = 10, period = '30d') {
    try {
      console.log('🔄 Utilisation de la méthode directe pour les statistiques');
      
      // Calculer la date de début
      let query = supabase
        .from('sale_items')
        .select(`
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price,
          sales!inner(sale_date, status)
        `);

      // Filtrer par période si nécessaire
      if (period !== 'all') {
        const days = parseInt(period.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('sales.sale_date', startDate.toISOString());
      }

      // Filtrer les ventes complétées
      query = query.eq('sales.status', 'completed');

      const { data: saleItems, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la requête directe:', error);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }

      // Calculer les statistiques par produit
      const productStats = {};
      
      saleItems.forEach(item => {
        const productId = item.product_id;
        const productName = item.product_name;
        const quantity = parseFloat(item.quantity) || 0;
        const totalPrice = parseFloat(item.total_price) || 0;

        if (!productStats[productId]) {
          productStats[productId] = {
            product_id: productId,
            product_name: productName,
            total_quantity: 0,
            total_sales: 0,
            total_revenue: 0,
            avg_price: 0
          };
        }

        productStats[productId].total_quantity += quantity;
        productStats[productId].total_sales += 1;
        productStats[productId].total_revenue += totalPrice;
      });

      // Calculer le prix moyen et trier par quantité vendue
      const sortedProducts = Object.values(productStats)
        .map(product => ({
          ...product,
          avg_price: product.total_revenue / product.total_quantity
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, limit);

      console.log(`✅ ${sortedProducts.length} produits les plus vendus calculés`);
      return {
        success: true,
        data: sortedProducts
      };

    } catch (error) {
      console.error('❌ Erreur dans getBestSellingProductsDirect:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Récupère les statistiques générales de ventes
   * @param {string} period - Période d'analyse ('7d', '30d', '90d', 'all')
   * @returns {Object} Statistiques générales
   */
  static async getSalesStats(period = '30d') {
    try {
      console.log(`📊 Récupération des statistiques de ventes (période: ${period})`);
      
      let query = supabase
        .from('sales')
        .select(`
          id,
          total_amount,
          sale_date,
          status,
          sale_items(quantity, total_price)
        `);

      // Filtrer par période
      if (period !== 'all') {
        const days = parseInt(period.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('sale_date', startDate.toISOString());
      }

      // Filtrer les ventes complétées
      query = query.eq('status', 'completed');

      const { data: sales, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des statistiques:', error);
        return {
          success: false,
          error: error.message,
          data: {}
        };
      }

      // Calculer les statistiques
      const stats = {
        total_sales: sales.length,
        total_revenue: 0,
        total_items_sold: 0,
        avg_order_value: 0,
        period: period
      };

      sales.forEach(sale => {
        stats.total_revenue += parseFloat(sale.total_amount) || 0;
        
        if (sale.sale_items && Array.isArray(sale.sale_items)) {
          sale.sale_items.forEach(item => {
            stats.total_items_sold += parseFloat(item.quantity) || 0;
          });
        }
      });

      stats.avg_order_value = stats.total_sales > 0 ? stats.total_revenue / stats.total_sales : 0;

      console.log('✅ Statistiques de ventes calculées:', stats);
      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('❌ Erreur dans getSalesStats:', error);
      return {
        success: false,
        error: error.message,
        data: {}
      };
    }
  }

  /**
   * Récupère les ventes par catégorie de produits
   * @param {string} period - Période d'analyse
   * @returns {Object} Statistiques par catégorie
   */
  static async getSalesByCategory(period = '30d') {
    try {
      console.log(`📈 Récupération des ventes par catégorie (période: ${period})`);
      
      let query = supabase
        .from('sale_items')
        .select(`
          product_id,
          product_name,
          quantity,
          total_price,
          products!inner(category_id, product_categories!inner(name, color)),
          sales!inner(sale_date, status)
        `);

      // Filtrer par période
      if (period !== 'all') {
        const days = parseInt(period.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('sales.sale_date', startDate.toISOString());
      }

      query = query.eq('sales.status', 'completed');

      const { data: saleItems, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des ventes par catégorie:', error);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }

      // Calculer les statistiques par catégorie
      const categoryStats = {};
      
      saleItems.forEach(item => {
        const categoryName = item.products?.product_categories?.name || 'Non catégorisé';
        const categoryColor = item.products?.product_categories?.color || '#10B981';
        const quantity = parseFloat(item.quantity) || 0;
        const revenue = parseFloat(item.total_price) || 0;

        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {
            category_name: categoryName,
            category_color: categoryColor,
            total_quantity: 0,
            total_revenue: 0,
            total_sales: 0
          };
        }

        categoryStats[categoryName].total_quantity += quantity;
        categoryStats[categoryName].total_revenue += revenue;
        categoryStats[categoryName].total_sales += 1;
      });

      const sortedCategories = Object.values(categoryStats)
        .sort((a, b) => b.total_revenue - a.total_revenue);

      console.log(`✅ ${sortedCategories.length} catégories analysées`);
      return {
        success: true,
        data: sortedCategories
      };

    } catch (error) {
      console.error('❌ Erreur dans getSalesByCategory:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Récupère les tendances de ventes (évolution dans le temps)
   * @param {string} period - Période d'analyse
   * @returns {Object} Données de tendance
   */
  static async getSalesTrends(period = '30d') {
    try {
      console.log(`📈 Récupération des tendances de ventes (période: ${period})`);
      
      const days = period === 'all' ? 365 : parseInt(period.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: sales, error } = await supabase
        .from('sales')
        .select('total_amount, sale_date, status')
        .gte('sale_date', startDate.toISOString())
        .eq('status', 'completed')
        .order('sale_date', { ascending: true });

      if (error) {
        console.error('❌ Erreur lors de la récupération des tendances:', error);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }

      // Grouper les ventes par jour
      const dailyStats = {};
      
      sales.forEach(sale => {
        const date = new Date(sale.sale_date).toISOString().split('T')[0];
        const amount = parseFloat(sale.total_amount) || 0;

        if (!dailyStats[date]) {
          dailyStats[date] = {
            date: date,
            total_sales: 0,
            total_revenue: 0
          };
        }

        dailyStats[date].total_sales += 1;
        dailyStats[date].total_revenue += amount;
      });

      const trendsData = Object.values(dailyStats)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log(`✅ ${trendsData.length} points de données de tendance calculés`);
      return {
        success: true,
        data: trendsData
      };

    } catch (error) {
      console.error('❌ Erreur dans getSalesTrends:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default SalesStatsService;
