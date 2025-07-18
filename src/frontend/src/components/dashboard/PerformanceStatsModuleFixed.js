import { useState, useEffect } from 'react';
import SalesStatsService from '../../services/salesStatsService';

/**
 * Module Stats Générales de Performance (Version Corrigée)
 * Affiche les KPIs principaux de performance des ventes
 */
const PerformanceStatsModuleFixed = ({ period = '30d' }) => {
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
      
      const data = await SalesStatsService.getSalesStats(period);
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des stats de performance:', err);
      setError(err.message);
      // Fallback avec données simulées
      setStats({
        total_sales: 25,
        total_revenue: 125000,
        total_items_sold: 180.5,
        avg_order_value: 5000,
        avg_price_per_kg: 692,
        avg_quantity_per_sale: 7.2,
        sales_per_day: 1.2
      });
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, format) => {
    if (!value && value !== 0) return '0';
    
    switch (format) {
      case 'currency':
        return `${parseFloat(value).toLocaleString('fr-FR')} FCFA`;
      case 'number':
        return parseFloat(value).toLocaleString('fr-FR');
      case 'quantity':
        return `${parseFloat(value).toFixed(1)} kg`;
      case 'decimal':
        return parseFloat(value).toFixed(1);
      default:
        return value.toString();
    }
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case '7d': return 'Derniers 7 jours';
      case '30d': return 'Derniers 30 jours';
      case '90d': return 'Derniers 90 jours';
      case 'all': return 'Toutes les données';
      default: return 'Derniers 30 jours';
    }
  };

  const kpiCards = [
    {
      title: 'Total Ventes',
      value: stats.total_sales || 0,
      format: 'number',
      emoji: '🛒',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Commandes complétées'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: stats.total_revenue || 0,
      format: 'currency',
      emoji: '💰',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Revenus générés'
    },
    {
      title: 'Articles Vendus',
      value: stats.total_items_sold || 0,
      format: 'quantity',
      emoji: '📦',
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Quantité totale (kg)'
    },
    {
      title: 'Panier Moyen',
      value: stats.avg_order_value || 0,
      format: 'currency',
      emoji: '📈',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Valeur moyenne par commande'
    }
  ];

  const metricsCards = [
    {
      title: 'Prix Moyen/kg',
      value: stats.avg_price_per_kg || 0,
      format: 'currency',
      emoji: '⚖️'
    },
    {
      title: 'Quantité/Vente',
      value: stats.avg_quantity_per_sale || 0,
      format: 'decimal',
      emoji: '📊'
    },
    {
      title: 'Ventes/Jour',
      value: stats.sales_per_day || 0,
      format: 'decimal',
      emoji: '📅'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-xl">📊</span>
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
          <span className="text-lg">🔄</span>
        </button>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-500">Chargement des statistiques...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Erreur: {error}</p>
          <button
            onClick={loadPerformanceStats}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPIs Principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpiCards.map((kpi, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${kpi.bgColor} rounded-full flex items-center justify-center`}>
                    <span className="text-lg">{kpi.emoji}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${kpi.textColor}`}>
                      {formatValue(kpi.value, kpi.format)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {kpi.title}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{kpi.description}</p>
              </div>
            ))}
          </div>

          {/* Métriques Additionnelles */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Métriques Détaillées</h4>
            <div className="grid grid-cols-3 gap-4">
              {metricsCards.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg mb-1">{metric.emoji}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatValue(metric.value, metric.format)}
                  </div>
                  <div className="text-xs text-gray-500">{metric.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceStatsModuleFixed;
