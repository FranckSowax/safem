import { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import caisseService from '../../services/caisseService';

export default function CaisseModule() {
  const [salesData, setSalesData] = useState({
    todaySales: 0,
    todayTransactions: 0,
    averageTicket: 0,
    topProducts: [],
    recentSales: []
  });

  // Charger les données réelles du service
  useEffect(() => {
    const loadData = () => {
      const stats = caisseService.getTodayStats();
      const topProducts = caisseService.getTopProducts(4);
      const recentSales = caisseService.getRecentSales(4);

      setSalesData({
        todaySales: stats.todayRevenue,
        todayTransactions: stats.todayTransactions,
        averageTicket: Math.round(stats.averageTicket),
        topProducts: topProducts.map(product => ({
          name: product.name,
          quantity: product.totalQuantity,
          revenue: product.totalRevenue,
          icon: product.icon
        })),
        recentSales
      });
    };

    loadData();
    
    // Recharger les données toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'accès à la caisse */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🛒 Caisse Virtuelle</h2>
          <p className="text-gray-600">Gestion des ventes et point de vente tactile</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <a
            href="/caisse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Ouvrir la Caisse
          </a>
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ventes du jour</p>
              <p className="text-2xl font-bold text-gray-900">
                {salesData.todaySales.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.todayTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ticket moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {salesData.averageTicket.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clients servis</p>
              <p className="text-2xl font-bold text-gray-900">{salesData.todayTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produits les plus vendus */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🏆 Produits les plus vendus
          </h3>
          <div className="space-y-3">
            {salesData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{product.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} unités vendues</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {product.revenue.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ventes récentes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⏰ Ventes récentes
          </h3>
          <div className="space-y-3">
            {salesData.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sale.time}</p>
                    <p className="text-sm text-gray-600">
                      {sale.client} • {sale.items} articles
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {sale.amount.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          📱 Comment utiliser la caisse virtuelle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-lg">1️⃣</span>
            <div>
              <p className="font-medium text-gray-900">Sélectionner les produits</p>
              <p className="text-gray-600">Cliquez sur les icônes produits pour les ajouter au panier</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-lg">2️⃣</span>
            <div>
              <p className="font-medium text-gray-900">Choisir le client</p>
              <p className="text-gray-600">Sélectionnez le type de client pour appliquer les remises</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-lg">3️⃣</span>
            <div>
              <p className="font-medium text-gray-900">Mode de paiement</p>
              <p className="text-gray-600">Espèces avec calculatrice intégrée ou carte bancaire</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-lg">4️⃣</span>
            <div>
              <p className="font-medium text-gray-900">Finaliser</p>
              <p className="text-gray-600">Validation automatique et synchronisation avec le dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
