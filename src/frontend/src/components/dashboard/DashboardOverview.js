import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function DashboardOverview({ data }) {
  const { todayHarvest, todaySales, currentStock, alerts, teamActivity, kpis } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-green-600 bg-green-100';
      case 'high': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec date */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Dernière mise à jour</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  CA Journalier
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(kpis.dailyRevenue)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Productivité Équipe
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {kpis.weeklyProductivity}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Croissance Mensuelle
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  +{kpis.monthlyGrowth}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Niveau Stock
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {kpis.stockLevel}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ExclamationIcon className="w-5 h-5 text-yellow-500 mr-2" />
              Alertes ({alerts.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`border-l-4 p-4 rounded ${getAlertColor(alert.priority)}`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Priorité: {alert.priority}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Récoltes du jour */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Récoltes du jour ({todayHarvest.length})
            </h3>
          </div>
          <div className="p-6">
            {todayHarvest.length > 0 ? (
              <div className="space-y-4">
                {todayHarvest.map((harvest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {harvest.product}
                      </div>
                      <div className="text-xs text-gray-500">
                        Par {harvest.technician}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {harvest.quantity} kg
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        harvest.quality === 'A' ? 'bg-green-100 text-green-800' :
                        harvest.quality === 'B' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Qualité {harvest.quality}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucune récolte enregistrée aujourd'hui
              </p>
            )}
          </div>
        </div>

        {/* Ventes du jour */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Ventes du jour ({todaySales.length})
            </h3>
          </div>
          <div className="p-6">
            {todaySales.length > 0 ? (
              <div className="space-y-4">
                {todaySales.map((sale, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.product}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sale.client}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.quantity} kg
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {formatCurrency(sale.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucune vente enregistrée aujourd'hui
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock actuel */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Stock actuel
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {currentStock.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStockStatusColor(item.status)}`}>
                      {item.status === 'low' ? 'Faible' : 
                       item.status === 'normal' ? 'Normal' : 'Élevé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activité équipe */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Activité équipe
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teamActivity.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'active' ? 'bg-green-400' :
                    member.status === 'break' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.task}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' :
                    member.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status === 'active' ? 'Actif' :
                     member.status === 'break' ? 'Pause' : 'Inactif'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
