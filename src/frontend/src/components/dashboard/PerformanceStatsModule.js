import { useState, useEffect } from 'react';
import { ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon, TrendingUpIcon } from '@heroicons/react/24/outline';
import SalesStatsService from '../../services/salesStatsService';

/**
 * Module Stats Générales de Performance
 * Affiche les KPIs principaux de performance des ventes
 */
const PerformanceStatsModule = ({ period = '30d' }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPerformanceStats();
  }, [period]);

  const loadPerformanceStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await SalesStatsService.getSalesStats(period);
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      console.error('Erreur dans loadPerformanceStats:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const formatQuantity = (quantity) => {
    return parseFloat(quantity || 0).toFixed(1);
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case '7d': return '7 derniers jours';
      case '30d': return '30 derniers jours';
      case '90d': return '90 derniers jours';
      case 'all': return 'Depuis le début';
      default: return period;
    }
  };

  const kpiCards = [
    {
      title: 'Total Ventes',
      value: stats.total_sales || 0,
      format: 'number',

      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Commandes complétées'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: stats.total_revenue || 0,
      format: 'currency',

      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Revenus générés'
    },
    {
      title: 'Articles Vendus',
      value: stats.total_items_sold || 0,
      format: 'quantity',

      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Quantité totale (kg)'
    },
    {
      title: 'Panier Moyen',
      value: stats.avg_order_value || 0,
      format: 'currency',

      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Valeur moyenne par commande'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'number':
        return formatNumber(value);
      case 'quantity':
        return formatQuantity(value) + ' kg';
      default:
        return value;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUpIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Générale</h3>
            <p className="text-sm text-gray-500">{getPeriodLabel(period)}</p>
          </div>
        </div>
        
        <button
          onClick={loadPerformanceStats}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <ChartBarIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 text-sm mb-2">❌ {error}</p>
          <button
            onClick={loadPerformanceStats}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpiCards.map((kpi, index) => {
            const renderIcon = () => {
              switch(index) {
                case 0: return <ShoppingCartIcon className={`h-5 w-5 ${kpi.textColor}`} />;
                case 1: return <CurrencyDollarIcon className={`h-5 w-5 ${kpi.textColor}`} />;
                case 2: return <ChartBarIcon className={`h-5 w-5 ${kpi.textColor}`} />;
                case 3: return <TrendingUpIcon className={`h-5 w-5 ${kpi.textColor}`} />;
                default: return <ChartBarIcon className={`h-5 w-5 ${kpi.textColor}`} />;
              }
            };
            
            return (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${kpi.bgColor} rounded-full flex items-center justify-center`}>
                    {renderIcon()}
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${kpi.textColor}`}>
                      {formatValue(kpi.value, kpi.format)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {kpi.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {kpi.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insights supplémentaires */}
      {!loading && !error && stats.total_sales > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">
                {stats.total_items_sold > 0 ? (stats.total_revenue / stats.total_items_sold).toFixed(0) : 0} FCFA
              </div>
              <div className="text-xs text-blue-600">Prix moyen/kg</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">
                {stats.total_sales > 0 ? (stats.total_items_sold / stats.total_sales).toFixed(1) : 0} kg
              </div>
              <div className="text-xs text-green-600">Quantité moyenne/vente</div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">
                {period === '30d' ? (stats.total_sales / 30).toFixed(1) : 
                 period === '7d' ? (stats.total_sales / 7).toFixed(1) : 
                 stats.total_sales}
              </div>
              <div className="text-xs text-purple-600">
                {period === '30d' ? 'Ventes/jour' : 
                 period === '7d' ? 'Ventes/jour' : 
                 'Total ventes'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceStatsModule;
