import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import HarvestChart from './charts/HarvestChart';
import SalesChart from './charts/SalesChart';

export default function ModernDashboardOverview({ 
  data, 
  loading = false, 
  lastUpdate = null, 
  onRefresh = null, 
  isConnected = true 
}) {
  const { 
    todayHarvest = [], 
    todaySales = [], 
    recentSales = [],
    currentStock = [], 
    alerts = [], 
    teamActivity = [], 
    kpis = {},
    salesStats = {}
  } = data || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'break': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec statut et rafraîchissement */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
          {lastUpdate && (
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {formatDate(lastUpdate.toISOString())}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span>Synchronisation...</span>
            </div>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualiser</span>
            </button>
          )}
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Revenus Quotidiens Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Revenus Quotidiens</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
                {formatCurrency(kpis.dailyRevenue || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{kpis.dailySales || 0} vente{(kpis.dailySales || 0) > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Revenus Hebdomadaires */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Revenus Hebdomadaires</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(kpis.weeklyRevenue || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-green-600">{kpis.weeklyProductivity || 0} articles vendus</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <CheckCircleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Vente Moyenne */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Vente Moyenne</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(kpis.averageSale || 0)}
              </p>
              <div className="flex items-center mt-2">
                {(kpis.monthlyGrowth || 0) >= 0 ? (
                  <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 mr-1 text-red-500" />
                )}
                <span className={`text-sm ${
                  (kpis.monthlyGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(kpis.monthlyGrowth || 0) >= 0 ? '+' : ''}{(kpis.monthlyGrowth || 0).toFixed(1)}% ce mois
                </span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <TrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Revenus Mensuels */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Revenus Mensuels</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(kpis.monthlyRevenue || 0)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">
                  Stock: {(kpis.stockLevel || 0).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <HarvestChart />
        <SalesChart />
      </div>

      {/* Modules opérationnels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Reminders Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Alertes</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              + Nouvelle
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(alert.priority).split(' ')[1]}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Priorité {alert.priority}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Aucune alerte active</p>
            )}
          </div>
          
          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl text-sm font-medium">
            Voir toutes les alertes
          </button>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Récoltes du Jour</h3>
          </div>
          
          <div className="space-y-4">
            {todayHarvest.length > 0 ? todayHarvest.map((harvest, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">{harvest.quantity}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{harvest.product}</p>
                    <p className="text-sm text-gray-500">Par {harvest.technician}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  harvest.quality === 'A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Qualité {harvest.quality}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Aucune récolte aujourd'hui</p>
            )}
          </div>
        </div>

        {/* Team Collaboration */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Activité Équipe</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              + Ajouter
            </button>
          </div>
          
          <div className="space-y-3">
            {teamActivity.length > 0 ? teamActivity.map((member, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.task}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status === 'active' ? 'Actif' : member.status === 'break' ? 'Pause' : 'Terminé'}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Aucune activité</p>
            )}
          </div>
        </div>
      </div>

      {/* Modules analytiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Produits les plus vendus */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">🏆 Produits les plus vendus</h3>
          </div>
          
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              // Calculer les produits les plus vendus
              Object.entries(
                recentSales.reduce((acc, sale) => {
                  if (sale.items && Array.isArray(sale.items)) {
                    sale.items.forEach(item => {
                      const productName = item.product_name || item.name || 'Produit inconnu';
                      const quantity = parseFloat(item.quantity) || 0;
                      if (!acc[productName]) {
                        acc[productName] = { name: productName, totalQuantity: 0, sales: 0 };
                      }
                      acc[productName].totalQuantity += quantity;
                      acc[productName].sales += 1;
                    });
                  }
                  return acc;
                }, {})
              )
              .sort((a, b) => b[1].totalQuantity - a[1].totalQuantity)
              .slice(0, 3)
              .map(([productName, data], index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{data.name}</p>
                      <p className="text-xs text-gray-500">{data.sales} vente(s)</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {data.totalQuantity.toFixed(1)} kg
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Ventes récentes */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">⏰ Ventes récentes</h3>
          </div>
          
          <div className="space-y-3">
            {recentSales.length > 0 ? recentSales.slice(0, 3).map((sale, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{sale.clientName || sale.client_name || 'Client inconnu'}</p>
                    <p className="text-xs text-gray-500">{formatDate(sale.date || sale.created_at)}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {formatCurrency(sale.total || sale.total_amount || 0)}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">Aucune vente récente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
