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

export default function ModernDashboardOverview({ data }) {
  const { todayHarvest, todaySales, currentStock, alerts, teamActivity, kpis } = data;

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Revenus Quotidiens</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(kpis.dailyRevenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+12% depuis hier</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Ended Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Productivité</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.weeklyProductivity}%</p>
              <div className="flex items-center mt-2">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-green-600">+5% cette semaine</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <CheckCircleIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Running Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Croissance Mensuelle</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.monthlyGrowth}%</p>
              <div className="flex items-center mt-2">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-blue-500" />
                <span className="text-sm text-blue-600">En progression</span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <TrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pending Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Niveau Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.stockLevel}%</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">Stock optimal</span>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HarvestChart />
        <SalesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminders Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alertes</h3>
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Récoltes du Jour</h3>
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activité Équipe</h3>
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
    </div>
  );
}
