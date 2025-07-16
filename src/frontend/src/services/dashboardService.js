import supabase from './supabaseClient';
import SalesService from './salesService';

/**
 * Service pour gérer les données du dashboard SAFEM
 */
export class DashboardService {
  
  /**
   * Récupérer toutes les données du dashboard
   * @returns {Promise<Object>} Données complètes du dashboard
   */
  static async getDashboardData() {
    try {
      const [
        todaySales,
        recentSales,
        salesStats,
        stockData
      ] = await Promise.all([
        this.getTodaySales(),
        SalesService.getRecentSales(10),
        SalesService.getSalesStats('today'),
        this.getStockData()
      ]);

      // Calculer les KPIs
      const kpis = await this.calculateKPIs();

      return {
        todayHarvest: [], // À implémenter si nécessaire
        todaySales: todaySales,
        recentSales: recentSales,
        currentStock: stockData,
        alerts: await this.getAlerts(),
        teamActivity: [], // À implémenter si nécessaire
        kpis: kpis,
        salesStats: salesStats
      };

    } catch (error) {
      console.error('Erreur lors du chargement des données dashboard:', error);
      return this.getFallbackData();
    }
  }

  /**
   * Récupérer les ventes du jour
   * @returns {Promise<Array>} Ventes d'aujourd'hui
   */
  static async getTodaySales() {
    if (!supabase) {
      return [];
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
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
        .gte('sale_date', today)
        .lt('sale_date', today + 'T23:59:59')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformer les données pour le dashboard
      return data.map(sale => ({
        id: sale.id,
        client: sale.client_name,
        phone: sale.client_phone,
        amount: parseFloat(sale.total_amount),
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
        status: sale.status || 'completed'
      }));

    } catch (error) {
      console.error('Erreur lors de la récupération des ventes du jour:', error);
      return [];
    }
  }

  /**
   * Calculer les KPIs du dashboard
   * @returns {Promise<Object>} KPIs calculés
   */
  static async calculateKPIs() {
    try {
      const [todayStats, weekStats, monthStats] = await Promise.all([
        SalesService.getSalesStats('today'),
        SalesService.getSalesStats('week'),
        SalesService.getSalesStats('month')
      ]);

      // Calculer la croissance
      const weeklyGrowth = weekStats.total_amount > 0 ? 
        ((todayStats.total_amount * 7 - weekStats.total_amount) / weekStats.total_amount * 100) : 0;

      return {
        dailyRevenue: todayStats.total_amount,
        dailySales: todayStats.total_sales,
        weeklyRevenue: weekStats.total_amount,
        monthlyRevenue: monthStats.total_amount,
        weeklyProductivity: weekStats.total_items,
        monthlyGrowth: weeklyGrowth,
        averageSale: todayStats.avg_sale,
        stockLevel: 85 // À calculer avec les vraies données de stock
      };

    } catch (error) {
      console.error('Erreur lors du calcul des KPIs:', error);
      return {
        dailyRevenue: 0,
        dailySales: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        weeklyProductivity: 0,
        monthlyGrowth: 0,
        averageSale: 0,
        stockLevel: 0
      };
    }
  }

  /**
   * Récupérer les données de stock (simulation pour l'instant)
   * @returns {Promise<Array>} Données de stock
   */
  static async getStockData() {
    // Simulation basée sur les produits SAFEM
    const products = [
      { name: 'Piment Demon', quantity: 15, unit: 'kg', status: 'normal', price: 2000 },
      { name: 'Piment Shamsi', quantity: 8, unit: 'kg', status: 'low', price: 2000 },
      { name: 'Poivron Yolo Wander', quantity: 25, unit: 'kg', status: 'normal', price: 2000 },
      { name: 'Poivron De Conti', quantity: 30, unit: 'kg', status: 'normal', price: 2500 },
      { name: 'Tomate Padma', quantity: 40, unit: 'kg', status: 'high', price: 1500 },
      { name: 'Tomate Anita', quantity: 35, unit: 'kg', status: 'normal', price: 1500 },
      { name: 'Aubergine Africaine', quantity: 20, unit: 'kg', status: 'normal', price: 1000 },
      { name: 'Gombo Kirikou', quantity: 12, unit: 'kg', status: 'normal', price: 2000 }
    ];

    return products.map(product => ({
      ...product,
      value: product.quantity * product.price,
      lastUpdate: new Date().toISOString()
    }));
  }

  /**
   * Récupérer les alertes du système
   * @returns {Promise<Array>} Liste des alertes
   */
  static async getAlerts() {
    const alerts = [];
    
    // Vérifier les stocks faibles
    const stockData = await this.getStockData();
    const lowStockItems = stockData.filter(item => item.status === 'low');
    
    lowStockItems.forEach(item => {
      alerts.push({
        id: `stock-${item.name}`,
        type: 'warning',
        title: 'Stock faible',
        message: `${item.name}: ${item.quantity}${item.unit} restants`,
        priority: 'medium',
        timestamp: new Date().toISOString()
      });
    });

    // Vérifier les ventes récentes pour des alertes de performance
    const todayStats = await SalesService.getSalesStats('today');
    if (todayStats.total_sales === 0) {
      alerts.push({
        id: 'no-sales-today',
        type: 'info',
        title: 'Aucune vente aujourd\'hui',
        message: 'Aucune vente enregistrée pour aujourd\'hui',
        priority: 'low',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * Données de fallback en cas d'erreur
   * @returns {Object} Données par défaut
   */
  static getFallbackData() {
    return {
      todayHarvest: [],
      todaySales: [],
      recentSales: [],
      currentStock: [],
      alerts: [{
        id: 'connection-error',
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Impossible de charger les données. Vérifiez votre connexion.',
        priority: 'high',
        timestamp: new Date().toISOString()
      }],
      teamActivity: [],
      kpis: {
        dailyRevenue: 0,
        dailySales: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        weeklyProductivity: 0,
        monthlyGrowth: 0,
        averageSale: 0,
        stockLevel: 0
      },
      salesStats: {
        total_sales: 0,
        total_amount: 0,
        total_items: 0,
        avg_sale: 0
      }
    };
  }

  /**
   * Écouter les changements en temps réel (Supabase Realtime)
   * @param {Function} callback - Fonction appelée lors des changements
   * @returns {Function} Fonction de nettoyage
   */
  static subscribeToChanges(callback) {
    if (!supabase) {
      return () => {}; // Fonction vide si pas de Supabase
    }

    const subscription = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' },
        (payload) => {
          console.log('🔄 Changement détecté dans les ventes:', payload);
          callback('sales', payload);
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sale_items' },
        (payload) => {
          console.log('🔄 Changement détecté dans les articles:', payload);
          callback('sale_items', payload);
        }
      )
      .subscribe();

    // Retourner la fonction de nettoyage
    return () => {
      supabase.removeChannel(subscription);
    };
  }

  /**
   * Forcer le rechargement des données
   * @returns {Promise<Object>} Nouvelles données
   */
  static async refreshData() {
    console.log('🔄 Rechargement des données dashboard...');
    return await this.getDashboardData();
  }
}

export default DashboardService;
