// Service pour gérer les données de la caisse virtuelle
// Simulation d'API - À remplacer par de vraies API calls

class CaisseService {
  constructor() {
    this.sales = this.loadSalesFromStorage();
    this.products = this.getProducts();
  }

  // Charger les ventes depuis le localStorage
  loadSalesFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('safem_sales');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  // Sauvegarder les ventes dans le localStorage
  saveSalesToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('safem_sales', JSON.stringify(this.sales));
    }
  }

  // Obtenir la liste des produits
  getProducts() {
    return [
      { 
        id: 1, 
        name: 'Tomate', 
        price: 800, 
        unit: 'kg', 
        icon: '🍅',
        category: 'Légumes',
        stock: 50
      },
      { 
        id: 2, 
        name: 'Poivron', 
        price: 1200, 
        unit: 'kg', 
        icon: '🫑',
        category: 'Légumes',
        stock: 30
      },
      { 
        id: 3, 
        name: 'Aubergine', 
        price: 1000, 
        unit: 'kg', 
        icon: '🍆',
        category: 'Légumes',
        stock: 25
      },
      { 
        id: 4, 
        name: 'Carotte', 
        price: 600, 
        unit: 'kg', 
        icon: '🥕',
        category: 'Légumes',
        stock: 40
      },
      { 
        id: 5, 
        name: 'Banane', 
        price: 500, 
        unit: 'régime', 
        icon: '🍌',
        category: 'Fruits',
        stock: 20
      },
      { 
        id: 6, 
        name: 'Mangue', 
        price: 300, 
        unit: 'pièce', 
        icon: '🥭',
        category: 'Fruits',
        stock: 35
      },
      { 
        id: 7, 
        name: 'Ananas', 
        price: 1500, 
        unit: 'pièce', 
        icon: '🍍',
        category: 'Fruits',
        stock: 15
      },
      { 
        id: 8, 
        name: 'Papaye', 
        price: 1000, 
        unit: 'pièce', 
        icon: '🫐',
        category: 'Fruits',
        stock: 18
      }
    ];
  }

  // Enregistrer une nouvelle vente
  async recordSale(saleData) {
    return new Promise((resolve, reject) => {
      try {
        // Simulation d'un délai d'API
        setTimeout(() => {
          const sale = {
            ...saleData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'completed'
          };

          this.sales.unshift(sale);
          this.saveSalesToStorage();

          // Mettre à jour les stocks (simulation)
          this.updateStock(saleData.items);

          resolve(sale);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Mettre à jour les stocks après une vente
  updateStock(items) {
    items.forEach(item => {
      const product = this.products.find(p => p.id === item.id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });
  }

  // Obtenir les statistiques du jour
  getTodayStats() {
    const today = new Date().toDateString();
    const todaySales = this.sales.filter(sale => 
      new Date(sale.timestamp).toDateString() === today
    );

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayTransactions = todaySales.length;
    const averageTicket = todayTransactions > 0 ? todayRevenue / todayTransactions : 0;

    return {
      todayRevenue,
      todayTransactions,
      averageTicket,
      todaySales: todaySales.slice(0, 10) // 10 dernières ventes
    };
  }

  // Obtenir les produits les plus vendus
  getTopProducts(limit = 5) {
    const productSales = {};
    
    this.sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            ...item,
            totalQuantity: 0,
            totalRevenue: 0
          };
        }
        productSales[item.id].totalQuantity += item.quantity;
        productSales[item.id].totalRevenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  // Obtenir les ventes récentes
  getRecentSales(limit = 10) {
    return this.sales
      .slice(0, limit)
      .map(sale => ({
        id: sale.id,
        time: new Date(sale.timestamp).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        amount: sale.total,
        client: sale.client.name,
        items: sale.items.reduce((sum, item) => sum + item.quantity, 0),
        paymentMethod: sale.paymentMethod
      }));
  }

  // Obtenir les données pour les graphiques
  getChartData() {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toDateString(),
        label: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        sales: 0,
        revenue: 0
      });
    }

    this.sales.forEach(sale => {
      const saleDate = new Date(sale.timestamp).toDateString();
      const dayData = last7Days.find(day => day.date === saleDate);
      if (dayData) {
        dayData.sales += 1;
        dayData.revenue += sale.total;
      }
    });

    return last7Days;
  }

  // Vérifier la disponibilité d'un produit
  checkProductAvailability(productId, quantity) {
    const product = this.products.find(p => p.id === productId);
    return product && product.stock >= quantity;
  }

  // Obtenir le stock actuel
  getCurrentStock() {
    return this.products.map(product => ({
      id: product.id,
      name: product.name,
      icon: product.icon,
      stock: product.stock,
      unit: product.unit,
      price: product.price,
      category: product.category,
      status: product.stock < 10 ? 'low' : product.stock < 5 ? 'critical' : 'normal'
    }));
  }
}

// Instance singleton
const caisseService = new CaisseService();

export default caisseService;
