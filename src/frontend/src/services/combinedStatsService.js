import supabase from './supabaseClient';
import productOrdersService from './productOrdersService';

/**
 * Service pour les statistiques combinées (ventes caisse + commandes produits)
 */
class CombinedStatsService {
  /**
   * Récupérer les statistiques générales combinées
   * @returns {Promise<Object>} - Statistiques générales
   */
  async getGeneralStats() {
    try {
      // Statistiques des ventes caisse
      const { data: caisseStats, error: caisseError } = await supabase
        .from('sales')
        .select('id, total_amount, sale_date')
        .order('sale_date', { ascending: false });

      if (caisseError) throw caisseError;

      // Statistiques des commandes produits
      const productStats = await productOrdersService.getOrdersStats();

      // Calculer les totaux combinés
      const totalCaisseRevenue = caisseStats.reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
      const totalRevenue = totalCaisseRevenue + productStats.totalRevenue;
      const totalOrders = caisseStats.length + productStats.totalOrders;

      // Calculer les moyennes
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        caisseRevenue: totalCaisseRevenue,
        productRevenue: productStats.totalRevenue,
        caisseOrders: caisseStats.length,
        productOrders: productStats.totalOrders,
        breakdown: {
          caisse: {
            revenue: totalCaisseRevenue,
            orders: caisseStats.length,
            percentage: totalRevenue > 0 ? (totalCaisseRevenue / totalRevenue) * 100 : 0
          },
          produits: {
            revenue: productStats.totalRevenue,
            orders: productStats.totalOrders,
            percentage: totalRevenue > 0 ? (productStats.totalRevenue / totalRevenue) * 100 : 0
          }
        }
      };

    } catch (error) {
      console.error('Erreur dans getGeneralStats:', error);
      throw error;
    }
  }

  /**
   * Récupérer les ventes récentes combinées
   * @param {number} limit - Nombre de ventes à retourner
   * @returns {Promise<Array>} - Ventes récentes
   */
  async getRecentSales(limit = 6) {
    try {
      // Ventes caisse récentes
      const { data: caisseData, error: caisseError } = await supabase
        .from('sales')
        .select(`
          id,
          client_name,
          client_phone,
          total_amount,
          sale_date,
          quartier,
          sale_items (
            product_name,
            quantity,
            unit_price
          )
        `)
        .order('sale_date', { ascending: false })
        .limit(limit);

      if (caisseError) throw caisseError;

      // Commandes produits récentes
      const productOrders = await productOrdersService.getAllOrders({ limit });

      // Combiner et formater les données
      const combinedSales = [];

      // Ajouter les ventes caisse
      caisseData.forEach(sale => {
        combinedSales.push({
          id: sale.id,
          source: 'caisse',
          client_name: sale.client_name,
          client_phone: sale.client_phone,
          quartier: sale.quartier,
          total_amount: parseFloat(sale.total_amount || 0),
          date: sale.sale_date,
          items: sale.sale_items || [],
          itemsCount: sale.sale_items?.length || 0
        });
      });

      // Ajouter les commandes produits
      productOrders.forEach(order => {
        combinedSales.push({
          id: order.id,
          source: 'produits',
          client_name: order.client_name,
          client_phone: order.client_phone,
          quartier: order.quartier,
          total_amount: parseFloat(order.total_amount || 0),
          date: order.order_date,
          items: order.product_order_items || [],
          itemsCount: order.product_order_items?.length || 0
        });
      });

      // Trier par date décroissante et limiter
      return combinedSales
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);

    } catch (error) {
      console.error('Erreur dans getRecentSales:', error);
      throw error;
    }
  }

  /**
   * Récupérer les produits les plus vendus (combiné)
   * @param {number} limit - Nombre de produits à retourner
   * @returns {Promise<Array>} - Produits les plus vendus
   */
  async getTopProducts(limit = 10) {
    try {
      // Produits vendus en caisse
      const { data: caisseItems, error: caisseError } = await supabase
        .from('sale_items')
        .select('product_name, quantity');

      if (caisseError) throw caisseError;

      // Produits commandés via page produits
      const productItems = await productOrdersService.getTopOrderedProducts(100); // Récupérer plus pour combiner

      // Combiner les données
      const productStats = {};

      // Ajouter les ventes caisse
      caisseItems.forEach(item => {
        const name = item.product_name;
        if (!productStats[name]) {
          productStats[name] = {
            name,
            totalQuantity: 0,
            caisseQuantity: 0,
            productQuantity: 0,
            icon: '🥬', // Icône par défaut
            category: 'Légumes'
          };
        }
        const quantity = parseFloat(item.quantity || 0);
        productStats[name].totalQuantity += quantity;
        productStats[name].caisseQuantity += quantity;
      });

      // Ajouter les commandes produits
      productItems.forEach(item => {
        const name = item.name;
        if (!productStats[name]) {
          productStats[name] = {
            name,
            totalQuantity: 0,
            caisseQuantity: 0,
            productQuantity: 0,
            icon: item.icon || '🥬',
            category: item.category || 'Légumes'
          };
        }
        productStats[name].totalQuantity += item.totalQuantity;
        productStats[name].productQuantity += item.totalQuantity;
        productStats[name].icon = item.icon || productStats[name].icon;
        productStats[name].category = item.category || productStats[name].category;
      });

      // Convertir en tableau et trier
      return Object.values(productStats)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, limit);

    } catch (error) {
      console.error('Erreur dans getTopProducts:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques par quartier
   * @returns {Promise<Array>} - Statistiques par quartier
   */
  async getQuartierStats() {
    try {
      // Ventes caisse par quartier
      const { data: caisseData, error: caisseError } = await supabase
        .from('sales')
        .select('quartier, total_amount')
        .not('quartier', 'is', null);

      if (caisseError) throw caisseError;

      // Commandes produits par quartier
      const productOrders = await productOrdersService.getAllOrders();

      // Combiner les données par quartier
      const quartierStats = {};

      // Ajouter les ventes caisse
      caisseData.forEach(sale => {
        const quartier = sale.quartier;
        if (quartier) {
          if (!quartierStats[quartier]) {
            quartierStats[quartier] = {
              quartier,
              totalRevenue: 0,
              totalOrders: 0,
              caisseRevenue: 0,
              caisseOrders: 0,
              productRevenue: 0,
              productOrders: 0
            };
          }
          const amount = parseFloat(sale.total_amount || 0);
          quartierStats[quartier].totalRevenue += amount;
          quartierStats[quartier].totalOrders += 1;
          quartierStats[quartier].caisseRevenue += amount;
          quartierStats[quartier].caisseOrders += 1;
        }
      });

      // Ajouter les commandes produits
      productOrders.forEach(order => {
        const quartier = order.quartier;
        if (quartier) {
          if (!quartierStats[quartier]) {
            quartierStats[quartier] = {
              quartier,
              totalRevenue: 0,
              totalOrders: 0,
              caisseRevenue: 0,
              caisseOrders: 0,
              productRevenue: 0,
              productOrders: 0
            };
          }
          const amount = parseFloat(order.total_amount || 0);
          quartierStats[quartier].totalRevenue += amount;
          quartierStats[quartier].totalOrders += 1;
          quartierStats[quartier].productRevenue += amount;
          quartierStats[quartier].productOrders += 1;
        }
      });

      // Convertir en tableau et trier par chiffre d'affaires
      return Object.values(quartierStats)
        .sort((a, b) => b.totalRevenue - a.totalRevenue);

    } catch (error) {
      console.error('Erreur dans getQuartierStats:', error);
      throw error;
    }
  }

  /**
   * Récupérer les métriques détaillées
   * @returns {Promise<Object>} - Métriques détaillées
   */
  async getDetailedMetrics() {
    try {
      const generalStats = await this.getGeneralStats();
      const topProducts = await this.getTopProducts(5);
      const quartierStats = await this.getQuartierStats();

      // Calculer les métriques avancées
      const totalQuantitySold = topProducts.reduce((sum, product) => sum + product.totalQuantity, 0);
      const averageQuantityPerOrder = generalStats.totalOrders > 0 ? totalQuantitySold / generalStats.totalOrders : 0;
      const averagePricePerKg = totalQuantitySold > 0 ? generalStats.totalRevenue / totalQuantitySold : 0;

      // Calculer les ventes par jour (derniers 30 jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentSales, error: recentError } = await supabase
        .from('sales')
        .select('sale_date, total_amount')
        .gte('sale_date', thirtyDaysAgo.toISOString());

      if (recentError) throw recentError;

      const recentProductOrders = await productOrdersService.getAllOrders();
      const recentProductOrdersFiltered = recentProductOrders.filter(
        order => new Date(order.order_date) >= thirtyDaysAgo
      );

      const totalRecentOrders = recentSales.length + recentProductOrdersFiltered.length;
      const averageOrdersPerDay = totalRecentOrders / 30;

      return {
        ...generalStats,
        averageQuantityPerOrder,
        averagePricePerKg,
        averageOrdersPerDay,
        topQuartier: quartierStats[0]?.quartier || 'N/A',
        totalQuantitySold,
        metrics: {
          revenueGrowth: 0, // À calculer avec données historiques
          orderGrowth: 0,   // À calculer avec données historiques
          customerRetention: 0 // À calculer avec données clients
        }
      };

    } catch (error) {
      console.error('Erreur dans getDetailedMetrics:', error);
      throw error;
    }
  }

  /**
   * Récupérer les données pour les graphiques
   * @param {number} days - Nombre de jours à analyser
   * @returns {Promise<Object>} - Données pour graphiques
   */
  async getChartData(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Ventes caisse par jour
      const { data: caisseData, error: caisseError } = await supabase
        .from('sales')
        .select('sale_date, total_amount')
        .gte('sale_date', startDate.toISOString())
        .order('sale_date');

      if (caisseError) throw caisseError;

      // Commandes produits par jour
      const productOrders = await productOrdersService.getAllOrders();
      const recentProductOrders = productOrders.filter(
        order => new Date(order.order_date) >= startDate
      );

      // Grouper par jour
      const dailyStats = {};

      // Initialiser tous les jours
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dailyStats[dateKey] = {
          date: dateKey,
          caisseRevenue: 0,
          productRevenue: 0,
          totalRevenue: 0,
          caisseOrders: 0,
          productOrders: 0,
          totalOrders: 0
        };
      }

      // Ajouter les ventes caisse
      caisseData.forEach(sale => {
        const dateKey = sale.sale_date.split('T')[0];
        if (dailyStats[dateKey]) {
          const amount = parseFloat(sale.total_amount || 0);
          dailyStats[dateKey].caisseRevenue += amount;
          dailyStats[dateKey].totalRevenue += amount;
          dailyStats[dateKey].caisseOrders += 1;
          dailyStats[dateKey].totalOrders += 1;
        }
      });

      // Ajouter les commandes produits
      recentProductOrders.forEach(order => {
        const dateKey = order.order_date.split('T')[0];
        if (dailyStats[dateKey]) {
          const amount = parseFloat(order.total_amount || 0);
          dailyStats[dateKey].productRevenue += amount;
          dailyStats[dateKey].totalRevenue += amount;
          dailyStats[dateKey].productOrders += 1;
          dailyStats[dateKey].totalOrders += 1;
        }
      });

      return {
        daily: Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date)),
        summary: {
          totalDays: days,
          averageDailyRevenue: Object.values(dailyStats).reduce((sum, day) => sum + day.totalRevenue, 0) / days,
          averageDailyOrders: Object.values(dailyStats).reduce((sum, day) => sum + day.totalOrders, 0) / days
        }
      };

    } catch (error) {
      console.error('Erreur dans getChartData:', error);
      throw error;
    }
  }
}

export default new CombinedStatsService();
